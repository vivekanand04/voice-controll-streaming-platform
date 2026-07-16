import axios from "axios";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiPlayCircle, FiTrash2 } from "react-icons/fi";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const SHORTS_API_BASE = (import.meta.env.VITE_SHORTS_API_URL || "http://localhost:8081").replace(/\/$/, "");

const TABS = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
];

const getShortId = (short) => short?.id || short?._id;

const resolveMediaUrl = (url, apiBase) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

const formatNumber = (value = 0) => {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return String(number);
};

const formatDuration = (seconds) => {
  const numericSeconds = Number(seconds);
  if (!Number.isFinite(numericSeconds) || numericSeconds <= 0) return "";
  const minutes = Math.floor(numericSeconds / 60);
  const remainingSeconds = Math.floor(numericSeconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getApiMessage = (payload) => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return String(payload.message || payload.error || payload.data?.message || "");
};

const isEmptyCollectionMessage = (message) => {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("no videos found") ||
    text.includes("no shorts found") ||
    text.includes("no content found") ||
    text.includes("no uploaded content")
  );
};

const normalizeCollectionResponse = (response) => {
  const payload = response?.data;
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (data == null && isEmptyCollectionMessage(getApiMessage(payload))) return [];

  throw new Error("Invalid collection response");
};

const isEmptyCollectionError = (err) =>
  err?.response?.status === 404 && isEmptyCollectionMessage(getApiMessage(err.response.data));

function Loader() {
  return (
    <div className="text-center my-44">
      <div className="p-4 text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin fill-black"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ label, onDelete }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center mt-3"
      onClick={onDelete}
      aria-label={label}
    >
      <FiTrash2 className="h-4 w-4" />
      Delete
    </button>
  );
}

function VideoCard({ video, index, onDelete }) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <Link to={`/watch/${video._id}`} aria-label={`Play ${video.title}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-40 object-cover transition duration-200 group-hover:opacity-90"
            loading="lazy"
          />
        </Link>
        <div className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white">
          {index + 1}
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-lg font-bold truncate">
          <Link to={`/watch/${video._id}`}>{video.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {formatNumber(video.views)} views{video.createdAt ? ` - ${timeAgo(video.createdAt)}` : ""}
        </p>
        <DeleteButton label={`Delete ${video.title}`} onDelete={() => onDelete(video._id)} />
      </div>
    </article>
  );
}

function ShortCard({ short, index, onOpen, onDelete }) {
  const shortId = getShortId(short);
  const thumbnailUrl = resolveMediaUrl(short.thumbnailUrl, SHORTS_API_BASE);
  const duration = formatDuration(short.duration);

  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onOpen(short)}
        className="relative block w-full overflow-hidden rounded-lg bg-gray-100 text-left focus:outline-none focus:ring-4 focus:ring-gray-200"
        aria-label={`Open short ${short.title}`}
      >
        <div className="aspect-[9/16] max-h-64 w-full bg-black">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={short.title}
              className="h-full w-full object-cover transition duration-200 group-hover:opacity-90"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/70">
              Short
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
        <div className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white">
          {index + 1}
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
          <span className="inline-flex items-center gap-1 text-xs font-semibold">
            <FiPlayCircle className="h-4 w-4" />
            Short
          </span>
          {duration && <span className="rounded bg-black/70 px-1.5 py-0.5 text-xs">{duration}</span>}
        </div>
      </button>

      <div className="mt-2">
        <h3 className="text-base font-bold truncate">
          <button type="button" className="text-left hover:text-gray-700" onClick={() => onOpen(short)}>
            {short.title}
          </button>
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {formatNumber(short.views)} views{short.createdAt ? ` - ${timeAgo(short.createdAt)}` : ""}
        </p>
        <DeleteButton label={`Delete ${short.title}`} onDelete={() => onDelete(shortId)} />
      </div>
    </article>
  );
}

function AllVideo() {
  const userdata = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const activeTab = TABS.some((tab) => tab.id === tabFromUrl) ? tabFromUrl : "all";
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingShorts, setLoadingShorts] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [shortsError, setShortsError] = useState("");
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [shortsLoaded, setShortsLoaded] = useState(false);
  const pendingIndexRef = useRef(null);
  const requestIdRef = useRef(0);

  const authHeaders = useMemo(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    [accessToken]
  );

  const loadContent = useCallback(async () => {
    if (!userdata?._id) {
      setVideos([]);
      setShorts([]);
      setVideoError("");
      setShortsError("");
      setVideosLoaded(false);
      setShortsLoaded(false);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setVideoError("");
    setShortsError("");
    setVideosLoaded(false);
    setShortsLoaded(false);
    setLoadingVideos(true);
    setLoadingShorts(true);

    const videosRequest = axios
      .get(`${API_BASE}/api/v1/videos/allUserVideo/${userdata._id}`, { withCredentials: true })
      .then((response) => {
        if (requestIdRef.current !== requestId) return;
        setVideos(normalizeCollectionResponse(response));
        setVideoError("");
        setVideosLoaded(true);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        if (isEmptyCollectionError(err)) {
          setVideos([]);
          setVideoError("");
          setVideosLoaded(true);
          return;
        }
        console.error("Error fetching videos:", err);
        setVideoError("Videos could not be loaded. Please try again.");
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoadingVideos(false);
      });

    const shortsRequest = axios
      .get(`${SHORTS_API_BASE}/api/shorts/user/${userdata._id}`, {
        headers: authHeaders,
        withCredentials: true,
      })
      .then((response) => {
        if (requestIdRef.current !== requestId) return;
        setShorts(normalizeCollectionResponse(response));
        setShortsError("");
        setShortsLoaded(true);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        if (isEmptyCollectionError(err)) {
          setShorts([]);
          setShortsError("");
          setShortsLoaded(true);
          return;
        }
        console.error("Error fetching shorts:", err);
        setShortsError("Shorts could not be loaded. Please try again.");
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoadingShorts(false);
      });

    await Promise.allSettled([videosRequest, shortsRequest]);
  }, [authHeaders, userdata?._id]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const contentItems = useMemo(() => {
    const videoItems = videos.map((video) => ({
      id: video._id,
      type: "video",
      createdAt: video.createdAt,
      item: video,
    }));
    const shortItems = shorts.map((short) => ({
      id: getShortId(short),
      type: "short",
      createdAt: short.createdAt,
      item: short,
    }));

    const items =
      activeTab === "videos" ? videoItems : activeTab === "shorts" ? shortItems : [...videoItems, ...shortItems];

    return [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [activeTab, shorts, videos]);

  const openItem = useCallback(
    (entry) => {
      if (!entry) return;
      if (entry.type === "video") {
        navigate(`/watch/${entry.item._id}`);
        return;
      }
      navigate(`/shorts?short=${getShortId(entry.item)}`);
    },
    [navigate]
  );

  const openShort = useCallback(
    (short) => {
      navigate(`/shorts?short=${getShortId(short)}`);
    },
    [navigate]
  );

  const handleDeleteVideo = useCallback(
    async (videoId) => {
      if (!videoId || !confirm("Are you sure you want to delete this video?")) return;

      try {
        setLoadingVideos(true);
        await axios.delete(`${API_BASE}/api/v1/videos/delete/${videoId}`, {
          headers: authHeaders,
          withCredentials: true,
        });
        setVideos((previous) => previous.filter((video) => video._id !== videoId));
        alert("Video deleted Successfully !");
      } catch (err) {
        console.error("Error deleting video:", err);
        alert("Unable to delete the video. Please try again.");
      } finally {
        setLoadingVideos(false);
      }
    },
    [authHeaders]
  );

  const handleDeleteShort = useCallback(
    async (shortId) => {
      if (!shortId || !confirm("Are you sure you want to delete this Short?")) return;

      try {
        setLoadingShorts(true);
        await axios.delete(`${SHORTS_API_BASE}/api/shorts/${shortId}`, {
          headers: authHeaders,
          withCredentials: true,
        });
        setShorts((previous) => previous.filter((short) => getShortId(short) !== shortId));
        alert("Short deleted Successfully !");
      } catch (err) {
        console.error("Error deleting short:", err);
        alert("Unable to delete the Short. Please try again.");
      } finally {
        setLoadingShorts(false);
      }
    },
    [authHeaders]
  );

  useEffect(() => {
    const handler = (event) => {
      const index = Number(event?.detail?.index);
      if (!index || index <= 0) return;

      if (contentItems.length > 0) {
        const entry = contentItems[index - 1];
        if (entry) openItem(entry);
        else alert(`No content found at index ${index}`);
      } else {
        pendingIndexRef.current = index;
      }
    };

    window.addEventListener("play-index", handler);
    return () => window.removeEventListener("play-index", handler);
  }, [contentItems, openItem]);

  useEffect(() => {
    if (!pendingIndexRef.current || contentItems.length === 0) return;
    const index = pendingIndexRef.current;
    pendingIndexRef.current = null;
    const entry = contentItems[index - 1];
    if (entry) openItem(entry);
    else alert(`No content found at index ${index}`);
  }, [contentItems, openItem]);

  const activeSourceState = useMemo(() => {
    const states = {
      videos: { loading: loadingVideos, error: videoError, loaded: videosLoaded },
      shorts: { loading: loadingShorts, error: shortsError, loaded: shortsLoaded },
    };
    const sourceKeys =
      activeTab === "videos" ? ["videos"] : activeTab === "shorts" ? ["shorts"] : ["videos", "shorts"];
    const activeStates = sourceKeys.map((key) => states[key]);
    const hasFailedSource = activeStates.some((state) => state.error);
    return {
      loading: activeStates.some((state) => state.loading),
      error:
        contentItems.length === 0 && hasFailedSource
          ? activeStates.map((state) => state.error).find(Boolean) || ""
          : "",
    };
  }, [
    activeTab,
    contentItems.length,
    loadingShorts,
    loadingVideos,
    shortsError,
    shortsLoaded,
    videoError,
    videosLoaded,
  ]);

  const shouldShowLoader = activeSourceState.loading && contentItems.length === 0;
  const shouldShowError = !activeSourceState.loading && !!activeSourceState.error && contentItems.length === 0;
  const shouldShowEmpty = !activeSourceState.loading && !activeSourceState.error && contentItems.length === 0;
  const emptyLabel =
    activeTab === "videos"
      ? "No videos available."
      : activeTab === "shorts"
        ? "No Shorts available."
        : "No content available.";

  if (shouldShowLoader) return <Loader />;

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <section>
          <div className="container">
            {activeSourceState.loading && contentItems.length > 0 && (
              <div className="mb-4 text-xs text-gray-500">Refreshing...</div>
            )}

            {shouldShowError ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{activeSourceState.error}</span>
                <button type="button" className="font-semibold hover:text-red-900" onClick={loadContent}>
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {contentItems.length > 0 ? (
                contentItems.map((entry, index) =>
                  entry.type === "video" ? (
                    <VideoCard
                      key={`video-${entry.id}`}
                      video={entry.item}
                      index={index}
                      onDelete={handleDeleteVideo}
                    />
                  ) : (
                    <ShortCard
                      key={`short-${entry.id}`}
                      short={entry.item}
                      index={index}
                      onOpen={openShort}
                      onDelete={handleDeleteShort}
                    />
                  )
                )
                ) : shouldShowEmpty ? (
                  <p className="text-sm text-gray-500">{emptyLabel}</p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AllVideo;

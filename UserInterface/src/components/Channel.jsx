import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const API_BASE = import.meta.env.VITE_API_URL;

function Channel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const pendingIndexRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchChannelData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const url = `${API_BASE}/api/v1/account/userData/${id}`;
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          signal: controller.signal,
        });

        const channelObj = response?.data?.data ?? response?.data ?? null;
        if (!channelObj) {
          setFetchError("Channel not found");
          setChannelData(null);
        } else {
          setChannelData(channelObj);
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.message === "canceled") {
          console.log("Request aborted");
        } else {
          console.error("Fetch error:", err);
          if (err.response) {
            setFetchError(`Server ${err.response.status}: ${JSON.stringify(err.response.data)}`);
          } else if (err.request) {
            setFetchError("No response received — network/CORS/server down.");
          } else {
            setFetchError(err.message);
          }
          setChannelData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Fetch channel's videos
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchVideos = async () => {
      setLoadingVideos(true);
      setVideosError(null);
      try {
        const url = `${API_BASE}/api/v1/videos/allUserVideo/${id}`;
        console.log("Fetching videos from:", url);
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          signal: controller.signal,
        });

        console.log("Videos response:", response);
        const videoList = response?.data?.data ?? response?.data ?? [];
        setVideos(Array.isArray(videoList) ? videoList : []);
        console.log("Videos loaded:", videoList.length);
      } catch (err) {
        if (err.name !== "CanceledError" && err.message !== "canceled") {
          console.error("Error fetching videos:", err);
          console.error("Error details:", err.response?.data);
          setVideosError("Failed to load videos for this channel");
        }
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Voice-controlled video playback by index
  useEffect(() => {
    const handler = (e) => {
      const idx = Number(e?.detail?.index);
      if (!idx || idx <= 0) return;
      if (videos.length > 0) {
        const vid = videos[idx - 1];
        if (vid && vid._id) {
          navigate(`/watch/${vid._id}`);
        } else {
          alert(`No video found at index ${idx}`);
        }
      } else {
        // videos not loaded yet — remember requested index
        pendingIndexRef.current = idx;
      }
    };
    window.addEventListener('play-index', handler);
    return () => window.removeEventListener('play-index', handler);
  }, [videos, navigate]);

  // If there was a pending index requested before videos loaded, handle it now
  useEffect(() => {
    if (pendingIndexRef.current && videos.length > 0) {
      const idx = pendingIndexRef.current;
      pendingIndexRef.current = null;
      const vid = videos[idx - 1];
      if (vid && vid._id) navigate(`/watch/${vid._id}`);
      else alert(`No video found at index ${idx}`);
    }
  }, [videos, navigate]);

  return (
    <>
      <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          <div className="mt-4 flex items-center gap-5">
            {loading ? (
              <div>Loading channel data...</div>
            ) : fetchError ? (
              <div className="text-sm text-red-600">Error: {fetchError}</div>
            ) : channelData ? (
              <>
                <img
                  className="w-28 h-28 rounded-full object-cover"
                  src={channelData.avatar || "/fallback-avatar.png"}
                  alt={channelData.name || "avatar"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/fallback-avatar.png";
                  }}
                />
                <div className="font-bold text-black">
                  <div className="text-lg">{(channelData.name || "Channel").toUpperCase()}</div>
                  <div className="text-sm mb-3 text-gray-500">
                    Joined in {formatDate(channelData.createdAt)}
                  </div>
                </div>
              </>
            ) : (
              <div>No channel data available.</div>
            )}
          </div>

          {/* tabs */}
          <div className="border-b border-gray-200 mt-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
              <li className="me-2">
                <div className="inline-flex items-center justify-center p-4 border-b-2 border-blue-600 rounded-t-lg text-blue-600">
                  Videos
                </div>
              </li>
            </ul>
          </div>

          {/* Videos Grid */}
          <div className="mt-6">
            {loadingVideos ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading videos...</p>
              </div>
            ) : videosError ? (
              <div className="text-center py-8 text-red-600">
                {videosError}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map((video, index) => (
                  <Link
                    key={video._id}
                    to={`/watch/${video._id}`}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/default-thumbnail.png"}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/default-thumbnail.png";
                        }}
                      />
                      {/* INDEX BADGE - Voice Command Index */}
                      <div
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2
                           bg-black bg-opacity-70 text-white text-md font-semibold
                           px-2 py-1 rounded-xl shadow"
                      >
                        {index + 1}
                      </div>
                      {/* {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      )} */}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {video.title || "Untitled Video"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {video.views > 0 ? `${video.views} views • ` : ''}{formatDate(video.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                This channel has no videos yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Channel;


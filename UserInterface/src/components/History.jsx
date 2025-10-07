




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRef } from "react";
const API_BASE = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

/**
 * Updated History component
 * - Beautiful heading
 * - Shows channel (avatar + name), views (abbreviated), upload time (relative + full on hover)
 * - Thumbnail with duration overlay
 * - Responsive grid and skeleton loading cards
 *
 * Assumptions:
 * - API returns the history array at response.data.data OR response.data
 * - Each video item has: _id, thumbnail, title, owner{_id, name, avatar}, views, createdAt, duration
 * - Adjust axios base URL / headers if your app requires auth
 */

function formatViews(num = 0) {
  if (num < 1000) return `${num}`;
  if (num < 1_000_000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  return `${(num / 1_000_000_000).toFixed(1)}B`;
}

function timeAgo(iso) {
  if (!iso) return "";
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const intervals = [
    { label: "year", sec: 31536000 },
    { label: "month", sec: 2592000 },
    { label: "week", sec: 604800 },
    { label: "day", sec: 86400 },
    { label: "hour", sec: 3600 },
    { label: "minute", sec: 60 },
  ];
  for (const i of intervals) {
    const value = Math.floor(seconds / i.sec);
    if (value >= 1) return `${value} ${i.label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function formatDuration(seconds = 0) {
  // seconds => mm:ss or hh:mm:ss
  const s = Number(seconds) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gray-200 h-40 w-full" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="w-1/2 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 const navigate = useNavigate();
const pendingIndexRef = useRef(null);
//voice command

  useEffect(() => {
    const handler = (e) => {
      const idx = Number(e?.detail?.index);
      if (!idx || idx <= 0) return;
      if (history.length > 0) {
        const vid = history[idx - 1];
        if (vid && vid._id) navigate(`/watch/${vid._id}`);
        else alert(`No video found at index ${idx}`);
      } else {
        pendingIndexRef.current = idx;
      }
    };
    window.addEventListener("play-index", handler);
    return () => window.removeEventListener("play-index", handler);
  }, [history, navigate]);

  useEffect(() => {
    if (pendingIndexRef.current && history.length > 0) {
      const idx = pendingIndexRef.current;
      pendingIndexRef.current = null;
      const vid = history[idx - 1];
      if (vid && vid._id) navigate(`/watch/${vid._id}`);
      else alert(`No video found at index ${idx}`);
    }
  }, [history, navigate]);





  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/api/v1/account/history`);
        // backend might return response.data.data or response.data
        const data = response?.data?.data ?? response?.data ?? [];
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load watch history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="lg:mt-12 bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Beautiful heading */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Watch history</h1>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                A list of videos you watched recently. You can revisit them, or clear your history from
                account settings.
              </p>
            </div>

            <div className="hidden sm:flex items-center space-x-3">
              {/* <button
                onClick={() => {
                  // optional: clear history UI-only (you may want to call API)
                  setHistory([]);
                }}
                className="text-sm px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
              >
                Clear history
              </button> */}
              <a
                href="/"
                className="text-sm px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
              >
                Explore videos
              </a>
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded p-3 bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">No watch history yet</h2>
            <p className="text-gray-600 mb-6">Start watching videos and they'll appear here.</p>
            <Link to="/" className="inline-block px-5 py-2 bg-indigo-600 text-white rounded">
              Explore videos
            </Link>
          </div>
        ) : (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {history.map((video,index) => {
                // video might be wrapped inside .video depending on your API
                const v = video?.video ?? video;
                const vidId = v?._id || video._id;
                return (
                  <article
                    key={vidId}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <Link to={`/watch/${vidId}`}>
                        <img
                          src={v?.thumbnail}
                          alt={v?.title}
                          className="w-full h-40 object-cover"
                        />
                        <div aria-hidden="true" className="absolute left-2 top-2 bg-black bg-opacity-70 text-white text-sm font-semibold px-2 py-1 rounded-xl shadow" > {index + 1} </div>
                      </Link>

                      {/* duration overlay */}
                      <div className="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        {formatDuration(v?.duration)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        <Link to={`/watch/${vidId}`}>{v?.title ?? "Untitled video"}</Link>
                      </h3>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={v?.owner?.avatar || "/default-avatar.png"}
                            alt={v?.owner?.name || "channel"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {v?.owner?.name ?? "Unknown channel"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatViews(v?.views)} views •{" "}
                              <span title={new Date(v?.createdAt || video?.createdAt).toLocaleString()}>
                                {timeAgo(v?.createdAt ?? video?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs text-gray-500">
                          {/* If your history item includes 'watchedAt' or 'lastWatched', you can show it */}
                          {video?.watchedAt ? (
                            <div title={new Date(video.watchedAt).toLocaleString()}>
                              Watched {timeAgo(video.watchedAt)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* optional description preview */}
                      {v?.description ? (
                        <p className="mt-3 text-xs text-gray-600 line-clamp-3">{v.description}</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}



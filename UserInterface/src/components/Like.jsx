


// src/pages/Like.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
const API_BASE = import.meta.env.VITE_API_URL;
/**
 * Show ALL liked videos on a single page.
 * - Requests a very large `limit` so backend returns all liked videos in one response.
 * - Removes pagination controls and keeps the rest of the UI/UX (auth handling, unlike).
 *
 * Paste/replace this file in your project.
 */

function findToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("jwt") ||
    null
  );
}

function getAuthHeader() {
  const token = findToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VideoCard({ item, onUnlike ,index}) {
  const vid = item.video;
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={vid.thumbnail}
          alt={vid.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        // replace your existing index badge div with this
<div aria-hidden="true" className="absolute left-2 top-2 bg-black bg-opacity-70 text-white text-sm font-semibold px-2 py-1 rounded-xl shadow" > {index + 1} </div>

        <div className="absolute left-2 bottom-2 px-2 py-1 text-xs rounded bg-black/60 text-white">
          {vid.duration ? Math.floor(vid.duration) + "s" : "0:00"}
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{vid.title}</h3>

          <p className="text-xs text-gray-500 mt-2 line-clamp-3">
            {vid.description ? vid.description.slice(0, 120) + (vid.description.length > 120 ? "…" : "") : ""}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={vid.owner?.avatar}
              alt={vid.owner?.name || "owner"}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-xs">
              <div className="font-medium text-gray-800">{vid.owner?.name || "Unknown"}</div>
              <div className="text-gray-500">{vid.views ?? 0} views</div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500">{formatDate(item.likedAt)}</div>

            <div className="mt-2 flex items-center space-x-2">
              <a
                href={`/watch/${vid._id}`}
                className="px-3 py-1 text-xs rounded-full border border-gray-200 hover:bg-gray-50"
                aria-label={`Open ${vid.title}`}
              >
                Watch
              </a>

              <button
                onClick={() => onUnlike(vid._id)}
                className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                aria-label="Unlike video"
                title="Unlike"
              >
                ♥ Unlike
              </button>
            </div>
          </div>

        </div>
        
      </div>
       
    </div>
  );
}

export default function Like() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]); // array of { likedAt, video }
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // change this if your backend base is different
  // const apiBase = "http://localhost:5000/api/v1";


//voice commad
const pendingIndexRef = useRef(null);

useEffect(() => {
  const handler = (e) => {
    const idx = Number(e?.detail?.index);
    if (!idx || idx <= 0) return;

    if (videos.length > 0) {
      const vid = videos[idx - 1]?.video;
      if (vid && vid._id) {
        navigate(`/watch/${vid._id}`);
      } else {
        alert(`No video found at index ${idx}`);
      }
    } else {
      pendingIndexRef.current = idx; // videos not loaded yet
    }
  };

  window.addEventListener('play-index', handler);
  return () => window.removeEventListener('play-index', handler);
}, [videos, navigate]);

// handle pending index after videos load
useEffect(() => {
  if (pendingIndexRef.current && videos.length > 0) {
    const idx = pendingIndexRef.current;
    pendingIndexRef.current = null;
    const vid = videos[idx - 1]?.video;
    if (vid && vid._id) navigate(`/watch/${vid._id}`);
    else alert(`No video found at index ${idx}`);
  }
}, [videos, navigate]);




  const handleAuthFailure = (message) => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("jwt");
    setError(message || "Please login to continue.");
    setTimeout(() => navigate("/login", { replace: true }), 600);
  };

  // set a very large limit to request all liked videos in single page
  const ALL_LIMIT = 100000;

  const fetchAllLiked = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: 1, limit: ALL_LIMIT });
      const res = await fetch(`$${API_BASE}/api/v1/likes/videos?${qs.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.status === 401) {
        handleAuthFailure("You must be logged in to view liked videos.");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load liked videos: ${res.status} ${text}`);
      }

      const json = await res.json();
      setVideos(json.videos || []);
      setTotal(json.total ?? (json.videos ? json.videos.length : 0));
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    // attempt to fetch all liked videos
    fetchAllLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlike = async (videoId) => {
    const previous = videos;
    setVideos(prev => prev.filter(it => it.video._id !== videoId));
    setTotal(prevTotal => Math.max(0, prevTotal - 1));
    setError(null);

    try {
      const res = await fetch(`$${API_BASE}/api/v1/likes/video/${videoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.status === 401) {
        handleAuthFailure("You must be logged in to unlike videos.");
        setVideos(previous);
        setTotal(previous.length);
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to unlike: ${res.status} ${txt}`);
      }
      // success
    } catch (err) {
      console.error("Unlike failed:", err);
      setVideos(previous);
      setTotal(previous.length);
      setError("Failed to unlike video. Please try again.");
    }
  };

  return (
    <div className="lg:mt-8 bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Liked Videos</h1>
            <p className="text-sm text-gray-600 mt-1">
              All videos you've liked. Total: <span className="font-medium">{total}</span>
            </p>
          </div>

          <div className="text-sm text-gray-600">
            {/* small advisory if user has lots of likes */}
            {total > 500 && (
              <div className="text-xs text-yellow-600">
                You have many liked videos — loading all on one page may be slow.
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded p-3 bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-3 h-56" />
              
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded p-6 text-center">
            <p className="text-gray-700">You haven't liked any videos yet.</p>
            <a
              href="/"
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Explore videos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {videos.map((it,index) => (
             
              <VideoCard key={it.video._id} item={it} index={index} onUnlike={handleUnlike} />
 
              

            ))}
          </div>
        )}
      </div>
    </div>
  );
}

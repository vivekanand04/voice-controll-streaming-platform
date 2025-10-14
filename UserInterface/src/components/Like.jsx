


// // src/pages/Like.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRef } from "react";
// const API_BASE = import.meta.env.VITE_API_URL;
// /**
//  * Show ALL liked videos on a single page.
//  * - Requests a very large `limit` so backend returns all liked videos in one response.
//  * - Removes pagination controls and keeps the rest of the UI/UX (auth handling, unlike).
//  *
//  * Paste/replace this file in your project.
//  */

// function findToken() {
//   return (
//     localStorage.getItem("token") ||
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("jwt") ||
//     null
//   );
// }

// function getAuthHeader() {
//   const token = findToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }
  
// function formatDate(iso) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return d.toLocaleString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function VideoCard({ item, onUnlike ,index}) {
//   const vid = item.video;
//   return (
//     <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
//       <div className="relative">
//         <img
//           src={vid.thumbnail}
//           alt={vid.title}
//           className="w-full h-44 object-cover"
//           loading="lazy"
//         />
//         // replace your existing index badge div with this
// <div aria-hidden="true" className="absolute left-2 top-2 bg-black bg-opacity-70 text-white text-sm font-semibold px-2 py-1 rounded-xl shadow" > {index + 1} </div>

//         <div className="absolute left-2 bottom-2 px-2 py-1 text-xs rounded bg-black/60 text-white">
//           {vid.duration ? Math.floor(vid.duration) + "s" : "0:00"}
//         </div>
//       </div>

//       <div className="p-3 flex-1 flex flex-col justify-between">
//         <div>
//           <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{vid.title}</h3>

//           <p className="text-xs text-gray-500 mt-2 line-clamp-3">
//             {vid.description ? vid.description.slice(0, 120) + (vid.description.length > 120 ? "…" : "") : ""}
//           </p>
//         </div>

//         <div className="mt-3 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <img
//               src={vid.owner?.avatar}
//               alt={vid.owner?.name || "owner"}
//               className="w-8 h-8 rounded-full object-cover"
//             />
//             <div className="text-xs">
//               <div className="font-medium text-gray-800">{vid.owner?.name || "Unknown"}</div>
//               <div className="text-gray-500">{vid.views ?? 0} views</div>
//             </div>
//           </div>

//           <div className="flex flex-col items-end">
//             <div className="text-xs text-gray-500">{formatDate(item.likedAt)}</div>

//             <div className="mt-2 flex items-center space-x-2">
//               <a
//                 href={`/watch/${vid._id}`}
//                 className="px-3 py-1 text-xs rounded-full border border-gray-200 hover:bg-gray-50"
//                 aria-label={`Open ${vid.title}`}
//               >
//                 Watch
//               </a>

//               <button
//                 onClick={() => onUnlike(vid._id)}
//                 className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
//                 aria-label="Unlike video"
//                 title="Unlike"
//               >
//                 ♥ Unlike
//               </button>
//             </div>
//           </div>

//         </div>
        
//       </div>
       
//     </div>
//   );
// }

// export default function Like() {
//   const navigate = useNavigate();

//   const [videos, setVideos] = useState([]); // array of { likedAt, video }
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // change this if your backend base is different
//   // const apiBase = "http://localhost:5000/api/v1";


// //voice commad
// const pendingIndexRef = useRef(null);

// useEffect(() => {
//   const handler = (e) => {
//     const idx = Number(e?.detail?.index);
//     if (!idx || idx <= 0) return;

//     if (videos.length > 0) {
//       const vid = videos[idx - 1]?.video;
//       if (vid && vid._id) {
//         navigate(`/watch/${vid._id}`);
//       } else {
//         alert(`No video found at index ${idx}`);
//       }
//     } else {
//       pendingIndexRef.current = idx; // videos not loaded yet
//     }
//   };

//   window.addEventListener('play-index', handler);
//   return () => window.removeEventListener('play-index', handler);
// }, [videos, navigate]);

// // handle pending index after videos load
// useEffect(() => {
//   if (pendingIndexRef.current && videos.length > 0) {
//     const idx = pendingIndexRef.current;
//     pendingIndexRef.current = null;
//     const vid = videos[idx - 1]?.video;
//     if (vid && vid._id) navigate(`/watch/${vid._id}`);
//     else alert(`No video found at index ${idx}`);
//   }
// }, [videos, navigate]);




//   const handleAuthFailure = (message) => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("jwt");
//     setError(message || "Please login to continue.");
//     setTimeout(() => navigate("/login", { replace: true }), 600);
//   };

//   // set a very large limit to request all liked videos in single page
//   const ALL_LIMIT = 100000;

//   const fetchAllLiked = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const qs = new URLSearchParams({ page: 1, limit: ALL_LIMIT });
//       const res = await fetch(`$${API_BASE}/api/v1/likes/videos?${qs.toString()}`, {
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeader(),
//         },
//         credentials: "include",
//       });

//       if (res.status === 401) {
//         handleAuthFailure("You must be logged in to view liked videos.");
//         return;
//       }

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Failed to load liked videos: ${res.status} ${text}`);
//       }

//       const json = await res.json();
//       setVideos(json.videos || []);
//       setTotal(json.total ?? (json.videos ? json.videos.length : 0));
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, [apiBase]);

//   useEffect(() => {
//     // attempt to fetch all liked videos
//     fetchAllLiked();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleUnlike = async (videoId) => {
//     const previous = videos;
//     setVideos(prev => prev.filter(it => it.video._id !== videoId));
//     setTotal(prevTotal => Math.max(0, prevTotal - 1));
//     setError(null);

//     try {
//       const res = await fetch(`$${API_BASE}/api/v1/likes/video/${videoId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeader(),
//         },
//         credentials: "include",
//       });

//       if (res.status === 401) {
//         handleAuthFailure("You must be logged in to unlike videos.");
//         setVideos(previous);
//         setTotal(previous.length);
//         return;
//       }

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`Failed to unlike: ${res.status} ${txt}`);
//       }
//       // success
//     } catch (err) {
//       console.error("Unlike failed:", err);
//       setVideos(previous);
//       setTotal(previous.length);
//       setError("Failed to unlike video. Please try again.");
//     }
//   };

//   return (
//     <div className="lg:mt-8 bg-gray-50 min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-extrabold text-gray-900">Liked Videos</h1>
//             <p className="text-sm text-gray-600 mt-1">
//               All videos you've liked. Total: <span className="font-medium">{total}</span>
//             </p>
//           </div>

//           <div className="text-sm text-gray-600">
//             {/* small advisory if user has lots of likes */}
//             {total > 500 && (
//               <div className="text-xs text-yellow-600">
//                 You have many liked videos — loading all on one page may be slow.
//               </div>
//             )}
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 rounded p-3 bg-red-50 text-red-700 border border-red-100">
//             {error}
//           </div>
//         )}

//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Array.from({ length: 9 }).map((_, i) => (
//               <div key={i} className="animate-pulse bg-white rounded-2xl p-3 h-56" />
              
//             ))}
//           </div>
//         ) : videos.length === 0 ? (
//           <div className="bg-white rounded p-6 text-center">
//             <p className="text-gray-700">You haven't liked any videos yet.</p>
//             <a
//               href="/"
//               className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Explore videos
//             </a>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//             {videos.map((it,index) => (
             
//               <VideoCard key={it.video._id} item={it} index={index} onUnlike={handleUnlike} />
 
              

//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







//write code to implement the likes pages for production
// src/pages/Like.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

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

/* ---------------------------
   Index parsing utilities
   --------------------------- */
const WORD_NUMBER_MAP = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10
};

function wordsToNumber(text) {
  if (!text) return null;
  const words = text.toLowerCase().replace(/[,()-]/g, ' ').split(/\s+/).filter(Boolean);
  let total = 0, current = 0;
  for (let w of words) {
    if (WORD_NUMBER_MAP[w] != null) {
      const val = WORD_NUMBER_MAP[w];
      if (val === 100) {
        if (current === 0) current = 1;
        current = current * 100;
      } else {
        current += val;
      }
    } else {
      const m = w.match(/^(\d+)$/);
      if (m) current += parseInt(m[1], 10);
    }
  }
  total += current;
  return total > 0 ? total : null;
}

function parseIndexFromText(text) {
  if (!text) return null;
  const s = String(text).toLowerCase();

  // 1) direct digits: "3" or "play 3"
  const digitMatch = s.match(/\b(\d+)\b/);
  if (digitMatch) {
    const n = Number(digitMatch[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }

  // 2) ordinal words or cardinal words: "three" "third" "twenty one"
  const wordMatch = s.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)(?:[\s-]+(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred))*\b/);
  if (wordMatch) {
    const num = wordsToNumber(wordMatch[0]);
    if (num && num > 0) return num;
  }

  // 3) phrases like "play video number three" — fallback: pick last number-like token after keywords
  const fallbackMatch = s.match(/(?:number|index|video|#)\s*(\d+)/);
  if (fallbackMatch) {
    const n = Number(fallbackMatch[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }

  return null;
}

/* ---------------------------
   UI components
   --------------------------- */
function VideoCard({ item, onUnlike, index }) {
  const vid = item.video || {};
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={vid.thumbnail}
          alt={vid.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        <div aria-hidden="true" className="absolute left-2 top-2 bg-black bg-opacity-70 text-white text-sm font-semibold px-2 py-1 rounded-xl shadow">
          {index + 1}
        </div>
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

            {/* <div className="mt-2 flex items-center space-x-2">
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
            </div> */}
          </div>

        </div>

      </div>

    </div>
  );
}

/* ---------------------------
   Main Like component
   --------------------------- */
export default function Like() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pendingIndexRef = useRef(null);
  const pendingUnlikeRef = useRef(null);

  useEffect(() => {
    // Handle both 'play-index' and 'voice-command' (for play/unmute/open) and 'unlike' voice commands.
    const handlePlayIndexEvent = (e) => {
      const payload = e?.detail ?? e;
      let idx = null;

      if (typeof payload === "number") idx = payload;
      else if (typeof payload === "string") idx = parseIndexFromText(payload);
      else if (payload && (payload.index || payload.idx)) {
        idx = Number(payload.index ?? payload.idx);
      }

      if (!idx || idx <= 0) return;

      if (videos.length > 0) {
        const vid = videos[idx - 1]?.video;
        if (vid && vid._id) navigate(`/watch/${vid._id}`);
        else alert(`No video found at index ${idx}`);
      } else {
        pendingIndexRef.current = idx;
      }
    };

    const handleVoiceCommand = (e) => {
      const detail = e?.detail ?? e;
      let text = null;
      if (typeof detail === "string") text = detail;
      else if (detail && (detail.text || detail.transcript)) text = detail.text || detail.transcript;
      else text = String(detail ?? "");

      if (!text) return;
      const lower = text.toLowerCase();

      // PLAY / OPEN handling (same as before)
      if (/\b(play|open|watch|index|number|video)\b/.test(lower)) {
        const idx = parseIndexFromText(lower);
        if (idx) {
          window.dispatchEvent(new CustomEvent("play-index", { detail: { index: idx } }));
          return;
        }
      }

      // UNLIKE handling via voice: commands like "unlike three", "remove like number 3", "remove from liked videos 3"
      if (/\b(unlike|remove like|thumbs up|remove from liked|remove from likes|remove|delete like|dislike|remove liked)\b/.test(lower)) {
        const idx = parseIndexFromText(lower);
        if (idx) {
          if (videos.length > 0) {
            const target = videos[idx - 1];
            if (target && target.video && target.video._id) {
              // call unlike handler
              handleUnlike(target.video._id);
            } else {
              alert(`No liked video found at index ${idx}`);
            }
          } else {
            // store request and process after videos load
            pendingUnlikeRef.current = idx;
            // optionally show message to user (UI state)
            setError(`Will unlike video #${idx} when liked list loads`);
            setTimeout(() => setError(null), 2500);
          }
        } else {
          // no index found: maybe user said "unlike this" — not enough context here
          setError("Please say the index number to unlike, e.g., 'unlike three'.");
          setTimeout(() => setError(null), 2600);
        }
        return;
      }
    };

    window.addEventListener("play-index", handlePlayIndexEvent);
    window.addEventListener("voice-command", handleVoiceCommand);

    return () => {
      window.removeEventListener("play-index", handlePlayIndexEvent);
      window.removeEventListener("voice-command", handleVoiceCommand);
    };
    // include videos and navigate in deps so handler uses fresh list
  }, [videos, navigate]);

  // When videos load, process any pending play/unlike requests.
  useEffect(() => {
    if (pendingIndexRef.current && videos.length > 0) {
      const idx = pendingIndexRef.current;
      pendingIndexRef.current = null;
      const vid = videos[idx - 1]?.video;
      if (vid && vid._id) navigate(`/watch/${vid._id}`);
      else alert(`No video found at index ${idx}`);
    }
    if (pendingUnlikeRef.current && videos.length > 0) {
      const idx = pendingUnlikeRef.current;
      pendingUnlikeRef.current = null;
      const item = videos[idx - 1];
      if (item && item.video && item.video._id) {
        // call unlike
        handleUnlike(item.video._id);
      } else {
        alert(`No liked video found at index ${idx}`);
      }
    }
  }, [videos, navigate]);

  const handleAuthFailure = (message) => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("jwt");
    setError(message || "Please login to continue.");
    setTimeout(() => navigate("/login", { replace: true }), 600);
  };

  const ALL_LIMIT = 100000;

  const buildUrl = (path) => {
    const base = (API_BASE || "").replace(/\/$/, "");
    if (base) return `${base}${path.startsWith("/") ? path : `/${path}`}`;
    return path;
  };

  const fetchAllLiked = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = buildUrl("/api/v1/likes/videos");
      const res = await axios.get(url, {
        params: { page: 1, limit: ALL_LIMIT },
        headers: getAuthHeader(),
        withCredentials: true,
      });

      if (res.status === 401) {
        handleAuthFailure("You must be logged in to view liked videos.");
        return;
      }

      const data = res?.data?.data ?? res?.data ?? {};
      const list = data.videos || data || [];
      setVideos(Array.isArray(list) ? list : []);
      setTotal(data.total ?? (Array.isArray(list) ? list.length : 0));
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        handleAuthFailure("You must be logged in to view liked videos.");
        return;
      }
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAllLiked();
  }, [fetchAllLiked]);

  const handleUnlike = useCallback(async (videoId) => {
    // optimistic UI removal
    const previous = videos;
    setVideos(prev => prev.filter(it => it.video._id !== videoId));
    setTotal(prevTotal => Math.max(0, prevTotal - 1));
    setError(null);

    try {
      const url = buildUrl(`/api/v1/likes/video/${videoId}`);
      const res = await axios.post(url, {}, {
        headers: getAuthHeader(),
        withCredentials: true,
      });

      if (res.status === 401) {
        handleAuthFailure("You must be logged in to unlike videos.");
        // rollback
        setVideos(previous);
        setTotal(previous.length);
        return;
      }

      if (!(res.status >= 200 && res.status < 300)) {
        throw new Error(`Failed to unlike: ${res.status}`);
      }

      // success — keep it removed
      // optional: show quick success message
    } catch (err) {
      console.error("Unlike failed:", err);
      setVideos(previous);
      setTotal(previous.length);
      setError("Failed to unlike video. Please try again.");
      setTimeout(() => setError(null), 2500);
    }
  }, [videos]);

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
            {videos.map((it, index) => (
              <VideoCard key={it.video._id} item={it} index={index} onUnlike={handleUnlike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

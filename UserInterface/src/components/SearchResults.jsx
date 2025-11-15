// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// function SearchResults() {
//   const { query } = useParams();
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoading(true);
//         // const res = await axios.get(`/api/v1/account/search?q=${query}`);
//          const res = await axios.get(`http://localhost:5000/api/v1/account/search?q=${query}`);
//          console.log(res)
//         // setVideos(res.data.videos || []);
//         setVideos(res.data || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching videos", err);
//         setLoading(false);
//       }
//     };
//     fetchVideos();
//   }, [query]);

//   if (loading) {
//     return (
//       <div className="p-5 text-center text-gray-500">Loading search results...</div>
//     );
//   }

//   return (
//     <div className="p-5 mt-10">
//       <h2 className="text-xl font-bold mb-4">
//         Search results for: <span className="text-red-500">{query}</span>
//       </h2>
//       {videos.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         <div className="space-y-4">
//           {videos.map((video) => (
//             <Link
//               key={video._id}
//               to={`/watch/${video._id}`}
//               className="flex gap-4 hover:bg-gray-100 p-2 rounded-lg"
//             >
//               <img
//                 src={video.thumbnail}
//                 alt={video.title}
//                 className="w-48 h-28 object-cover rounded-lg"
//               />
//               <div>
//                 <h3 className="font-semibold">{video.title}</h3>
//                 <p className="text-sm text-gray-600">{video.owner?.name || "Unknown channel"}</p>
//                 <p className="text-sm text-gray-500">{video.views} views</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchResults;


//method 2
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import axios from "../api/axios";
const API_BASE = import.meta.env.VITE_API_URL;
function SearchResults() {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pendingIndexRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/v1/account/search?q=${query}`);
        console.log(res)
        // support multiple response shapes
        const items = res?.data?.data || res?.data?.videos || res?.data || [];
        setVideos(Array.isArray(items) ? items : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos", err);
        setVideos([]);
        setLoading(false);
      }
    };
    fetchVideos();
  }, [query]);

  // handle play-index events for voice control
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

  // if there was a pending index requested before videos loaded, handle it now
  useEffect(() => {
    if (pendingIndexRef.current && videos.length > 0) {
      const idx = pendingIndexRef.current;
      pendingIndexRef.current = null;
      const vid = videos[idx - 1];
      if (vid && vid._id) navigate(`/watch/${vid._id}`);
      else alert(`No video found at index ${idx}`);
    }
  }, [videos, navigate]);

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-500">Loading search results...</div>
    );
  }

  return (
    <div className="p-5 mt-3">
      <h2 className="text-xl font-bold my-2">
        Filter results for: <span className="text-red-500">{query}</span>
      </h2>
      {videos.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <Link
              key={video._id || index}
              to={`/watch/${video._id}`}
              className="w-full flex flex-col sm:flex-row items-start gap-4 hover:bg-gray-100 p-2 rounded-lg relative"
            >
              <div className="relative w-full sm:w-48 h-40 sm:h-28 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* INDEX BADGE - middle of left edge */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2
                             bg-black bg-opacity-70 text-white text-md font-semibold
                             px-2 py-1 rounded-xl shadow"
                >
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.owner?.name || "Unknown channel"}</p>
                <p className="text-sm text-gray-500">{video.views || 0} views</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;




import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Helper to format "time ago" (same as Home)
const timeAgo = (date) => {
  if (!date) return "Just now";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

function Music() {
//   const { query } = useParams();
const query="music"||"Music";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/v1/account/search?q=${encodeURIComponent(query)}`);
        // support multiple response shapes
        const items = res?.data?.data || res?.data?.videos || res?.data || [];
        setVideos(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Error fetching videos", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [query]);

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-500">Loading search results...</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 mt-3">
      {/* <h2 className="text-xl font-bold mb-4">
        Search results for: <span className="text-red-500">{query}</span>
      </h2> */}

      {videos.length === 0 ? (
          <h2 className="text-xl font-bold mb-4">
       Filter  results for: <span className="text-red-500">{query}</span>
           <p>No results found.</p>
      </h2>
     
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <div key={video._id || index} className="flex flex-col my-[20px]">
              {/* Thumbnail */}
              <Link to={`/watch/${video._id}`} className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition"
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
              </Link>

              {/* Video Info */}
              <div className="flex mt-3">
                <div className="flex-shrink-0 mr-3">
                  <img
                    className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                    src={video.owner?.avatar}
                    alt={video.owner?.name || "Channel"}
                  />
                </div>

                <div className="flex flex-col">
                  <Link
                    to={`/watch/${video._id}`}
                    className="font-semibold text-sm line-clamp-2"
                  >
                    {video.title}
                  </Link>

                  <span className="text-gray-500 text-xs">
                    {video.owner?.name || "Unknown Channel"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {video.views || 0} views • {timeAgo(video.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Music;

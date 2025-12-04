


// import axios from "axios";
import axios from "../api/axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import api from "./apiClient";
const API_BASE = import.meta.env.VITE_API_URL || '';


// Helper to format "time ago"
const timeAgo = (date) => {
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

function Home() {
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false);
  // Add this:
  // const [playingIndex, setPlayingIndex] = useState(null);
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);



  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoader(true);
       
        // const response = await axios.get(`${API_BASE}/api/v1/videos/allVideo`);
          // const response = await api.get("/videos/allVideo");
          const response = await axios.get(`${API_BASE}/api/v1/videos/allVideo`, { withCredentials: true });

          console.log("the response homepage are",response);
          
        setVideos(response.data.data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchVideos();
  }, []);


  //adding this to play the vidoe using voice 
  const navigate = useNavigate();
  const pendingIndexRef = useRef(null);

  // handle play-index events
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


  if (loader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg
          aria-hidden="true"
          className="w-10 h-10 text-gray-300 animate-spin fill-black"
          viewBox="0 0 100 101"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142..."
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div key={video._id} className="flex flex-col my-[2px] mt-8">
            {/* Thumbnail */}
            <Link to={`/watch/${video._id}`} className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48  object-cover rounded-lg hover:opacity-90 transition md:h-60 "
              />
              {/* INDEX BADGE - left edge (top-left) */}
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
              {/* Placeholder channel avatar */}
              <div className="flex-shrink-0 mr-3">

                <img className="w-10 h-10 bg-gray-300 rounded-full"
                  src={video.owner?.avatar} alt=" "


                />

              </div>

              {/* Title & Meta */}
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
    </div>
  );
}

export default Home;

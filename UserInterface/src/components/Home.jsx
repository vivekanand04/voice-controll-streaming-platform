// // import axios from 'axios';
// // import React, { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';

// // function Home() {
// //   const [videos, setVideos] = useState([]);
// //   const [loader, setLoader] = useState(false)

// //   useEffect(() => {
// //     const fetchVideos = async () => {
// //       try {
// //         // setLoader(true)
// //         const response = await axios.get('/api/v1/videos/allVideo');
// //         // setLoader(false)
// //         console.log(response);
// //         setVideos(response.data.data);
// //       } catch (error) {
// //         console.error('Error fetching videos:', error);
// //       }
// //     };

// //     fetchVideos();
// //   }, [videos]);


// //   return (
// //     loader ?  
// //     <div className="text-center  my-72 ">
// //     <div className="p-4 text-center">
// //     <div role="status">
// //         <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin  fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
// //             <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
// //             <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
// //         </svg>
// //         <span className="sr-only">Loading...</span>
// //     </div>
// //     </div>
// //     </div>
// //     :
// //     <>
// //       <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
// //         <div className="mb-4 col-span-full xl:mb-2">
// //           {/*----------- content ------------- */}
// //           <section>
// //             <div className="container">
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //                 {videos.map((video) => (
// //                   <div key={video._id}>
// //                     <div className="relative">
// //                       <Link to={`/watch/${video._id}`}>
// //                         <img src={video.thumbnail} alt={video.title} 
// //                         // className="w-full h-auto" 
// //                         className="w-80 h-40" 
// //                         />
// //                       </Link>
// //                     </div>
// //                     <div className="mt-2 md:mt-0">
// //                       <div>
// //                         <h3 className="text-lg font-bold truncate">
// //                           <Link to={`/watch/${video._id}`}>{video.title}</Link>
// //                         </h3>
// //                       </div>
// //                       <div className="mt-2">
// //                         {/* <ul>
// //                           <li className="text-sm">Duration: {video.duration} mins</li>
// //                         </ul> */}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </section>
// //           {/*----------- content ------------- */}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // export default Home;


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// // Helper to format "time ago"
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//   const intervals = {
//     year: 31536000,
//     month: 2592000,
//     week: 604800,
//     day: 86400,
//     hour: 3600,
//     minute: 60,
//   };

//   for (let key in intervals) {
//     const interval = Math.floor(seconds / intervals[key]);
//     if (interval >= 1) return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
//   }
//   return "Just now";
// };

// function Home() {
//   const [videos, setVideos] = useState([]);
//   const [loader, setLoader] = useState(false);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         setLoader(true);
//         const response = await axios.get("/api/v1/videos/allVideo");
//         setVideos(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//       } finally {
//         setLoader(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   if (loader) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <svg
//           aria-hidden="true"
//           className="w-10 h-10 text-gray-300 animate-spin fill-black"
//           viewBox="0 0 100 101"
//         >
//           <path
//             d="M100 50.5908C100 78.2051 77.6142..."
//             fill="currentColor"
//           />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {videos.map((video) => (
//           <div key={video._id} className="flex flex-col my-[20px]">
//             {/* Thumbnail */}
//             <Link to={`/watch/${video._id}`} className="relative">
//               <img
//                 src={video.thumbnail}
//                 alt={video.title}
//                 className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition "
//               />
//             </Link>

//             {/* Video Info */}
//             <div className="flex mt-3">
//               {/* Placeholder channel avatar */}
//               <div className="flex-shrink-0 mr-3">

//                    <img className="w-10 h-10 bg-gray-300 rounded-full"
//                 src={video.owner?.avatar} alt=" "


//               />

//               </div>

//               {/* Title & Meta */}
//               <div className="flex flex-col">
//                 <Link
//                   to={`/watch/${video._id}`}
//                   className="font-semibold text-sm line-clamp-2"
//                 >
//                   {video.title}
//                 </Link>
//                 <span className="text-gray-500 text-xs">
//                   {video.owner?.name || "Unknown Channel"}
//                 </span>
//                 <span className="text-gray-500 text-xs">
//                   {video.views || 0} views • {timeAgo(video.createdAt)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Home;






// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// function Home() {
//   const [videos, setVideos] = useState([]);
//   const [loader, setLoader] = useState(false)

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         // setLoader(true)
//         const response = await axios.get('/api/v1/videos/allVideo');
//         // setLoader(false)
//         console.log(response);
//         setVideos(response.data.data);
//       } catch (error) {
//         console.error('Error fetching videos:', error);
//       }
//     };

//     fetchVideos();
//   }, [videos]);


//   return (
//     loader ?  
//     <div className="text-center  my-72 ">
//     <div className="p-4 text-center">
//     <div role="status">
//         <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin  fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
//             <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
//         </svg>
//         <span className="sr-only">Loading...</span>
//     </div>
//     </div>
//     </div>
//     :
//     <>
//       <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
//         <div className="mb-4 col-span-full xl:mb-2">
//           {/*----------- content ------------- */}
//           <section>
//             <div className="container">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {videos.map((video) => (
//                   <div key={video._id}>
//                     <div className="relative">
//                       <Link to={`/watch/${video._id}`}>
//                         <img src={video.thumbnail} alt={video.title} 
//                         // className="w-full h-auto" 
//                         className="w-80 h-40" 
//                         />
//                       </Link>
//                     </div>
//                     <div className="mt-2 md:mt-0">
//                       <div>
//                         <h3 className="text-lg font-bold truncate">
//                           <Link to={`/watch/${video._id}`}>{video.title}</Link>
//                         </h3>
//                       </div>
//                       <div className="mt-2">
//                         {/* <ul>
//                           <li className="text-sm">Duration: {video.duration} mins</li>
//                         </ul> */}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//           {/*----------- content ------------- */}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Home;


import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


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


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoader(true);
        const response = await axios.get("/api/v1/videos/allVideo");
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

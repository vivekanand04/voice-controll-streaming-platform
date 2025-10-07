
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// // import image from "../assets/profile-picture-5.jpg";
// import { Link, useParams } from 'react-router-dom';

// function Video() {
//   const { id } = useParams();
//   const [videoData, setVideoData] = useState(id);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, options);
//   };

//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         const response = await axios.get(`/api/v1/videos/videoData/${id}`);
//         setVideoData(response.data.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideoData();
//   }, [id]);

//   useEffect(() => {
//     const incrementViewCount = async () => {
//       try {
//         await axios.put(`/api/v1/videos/incrementView/${id}`);
//         console.log('View count incremented');
//       } catch (error) {
//         console.error('Error incrementing view count:', error);
//       }
//     };
//     incrementViewCount();
//   }, [id]);

//   useEffect(() => {
//     const addToWatchHistory = async () => {
//       try {
//         await axios.put(`/api/v1/account/addToHistory/${id}`);
//         console.log('addToWatchHistory');
//       } catch (error) {
//         console.error('Error addToWatchHistory:', error);
//       }
//     };
//     addToWatchHistory();
//   }, [id]);

//   useEffect(() => {
//     if (videoData && videoData.owner) {
//       const fetchUser = async () => {
//         try {
//           const response = await axios.get(`/api/v1/account/userData/${videoData.owner}`);
//           setUserData(response.data.data);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       fetchUser();
//     }
//   }, [videoData]);

//   // console.log(userData);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!videoData) {
//     return <div>No video data found.</div>;
//   }

//   return (
//     <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
//       <div className="mb-4 col-span-full xl:mb-2">
//         {/*-------------------content---------------------*/}
//         <section className="pb-5 mt-3">
//           <div className="container mx-auto">
//             <div className="row">
//               <div className="col-lg-9 col-xl-9">
//               <section>
//                 <div className="row">
//                   <div className="col">
//                     <div className="relative video-wrap" style={{ height: "465px" }}>
//                       <video className=" w-full h-full" controls>
//                         <source src={videoData.videoFile} type="video/mp4"/>
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//                 <div className="mt-4">
//                   <h1 className="mb-3 text-xl truncate">{videoData.title}</h1>

//                   <div>
//                     <div className="border-b border-b-gray-100">
//                       <ul className="-mb-px flex items-center gap-5 text-sm font-sm">
//                         <li>
//                           {userData ? (
//                             <Link className="inline-flex cursor-pointer items-center gap-3 px-1 py-3 text-black hover:text-gray-700 ">
//                               <img
//                                 className="w-12 h-12 rounded-full"
//                                 src={userData.avatar}
//                                 alt="User"
//                               />
//                               {userData.name}
//                             </Link>
//                           ) : (
//                             <div>Loading user data...</div>
//                           )}
//                         </li>
//                         <li>
//                           <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black" >
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
//                               <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
//                             </svg>
//                             Subscribe
//                             <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> 303k </span>
//                           </Link>
//                         </li>
//                         <li>
//                           <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
//                             </svg>
//                             <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> 30k </span>
//                           </Link>
//                         </li>
//                         <li>
//                           <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                             </svg>
//                             <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"> {videoData.views}  </span> 
//                           </Link>
//                         </li>
//                         <li>
//                           <Link className="inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-600 hover:text-black">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
//                             </svg>
//                             <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{formatDate(videoData.createdAt)}</span> 
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <p className='truncate'>{videoData.description}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/*-------------------content---------------------*/}
//       </div>
//     </div>
//   );
// }

// export default Video;









//CODE 1

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';

// function Video() {
//   const { id } = useParams();
//   const [videoData, setVideoData] = useState(id);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [showFullDesc, setShowFullDesc] = useState(false);

//   // Voice state
//   const [listening, setListening] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');

//   const videoRef = useRef(null);
//   const recognitionRef = useRef(null);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, options);
//   };

//   // === API Calls ===
//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         const response = await axios.get(`/api/v1/videos/videoData/${id}`);
//         setVideoData(response.data.data);
//       } catch (err) {
//         setError(err.message || 'Error fetching video');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideoData();
//   }, [id]);

//   useEffect(() => {
//     axios.put(`/api/v1/videos/incrementView/${id}`).catch(console.error);
//     axios.put(`/api/v1/account/addToHistory/${id}`).catch(console.error);
//   }, [id]);

//   useEffect(() => {
//     if (videoData && videoData.owner) {
//       axios.get(`/api/v1/account/userData/${videoData.owner}`)
//         .then(res => setUserData(res.data.data))
//         .catch(console.error);
//     }
//   }, [videoData]);

//   // Cleanup recognition
//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//         recognitionRef.current = null;
//       }
//     };
//   }, []);

//   // === Voice Command Parser ===
//   const handleVoiceCommand = async (text) => {
//     if (!videoRef.current) return;
//     const t = text.toLowerCase();

//     // 🔹 Playback controls
//     if (t.includes("pause")) return videoRef.current.pause();
//     if (t.includes("play") || t.includes("resume")) return videoRef.current.play();

//     if (t.includes("forward")) {
//       const seconds = extractSeconds(t) || 10;
//       videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds);
//       return;
//     }
//     if (t.includes("back") || t.includes("rewind")) {
//       const seconds = extractSeconds(t) || 10;
//       videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
//       return;
//     }

//     // 🔹 Speed
//     const speed = parseSpeedFromText(t);
//     if (speed !== null) {
//       videoRef.current.playbackRate = speed;
//       return;
//     }

//     // 🔹 Volume
//     if (t.includes("volume up") || t.includes("increase volume")) {
//       videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
//       return;
//     }
//     if (t.includes("volume down") || t.includes("decrease volume")) {
//       videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
//       return;
//     }
//     if (t.includes("mute")) {
//       videoRef.current.muted = true;
//       return;
//     }
//     if (t.includes("unmute")) {
//       videoRef.current.muted = false;
//       return;
//     }

//     // 🔹 Fullscreen / Exit fullscreen
//     if (t.includes("fullscreen")) {
//       if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
//       return;
//     }
//     if (t.includes("exit fullscreen") || t.includes("normal screen")) {
//       if (document.exitFullscreen) document.exitFullscreen();
//       return;
//     }

//     // 🔹 Picture-in-Picture
//     if (t.includes("picture in picture") || t.includes("pip")) {
//       try {
//         if (document.pictureInPictureElement) {
//           await document.exitPictureInPicture();
//         } else {
//           await videoRef.current.requestPictureInPicture();
//         }
//       } catch (err) {
//         console.error("PIP error:", err);
//       }
//       return;
//     }

//     // 🔹 Download video
//     if (t.includes("download")) {
//       const a = document.createElement("a");
//       a.href = videoData.videoFile;
//       a.download = `${videoData.title || "video"}.mp4`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       return;
//     }
//   };

//   const parseSpeedFromText = (t) => {
//     if (!t) return null;

//     if (t.includes('normal')) return 1;
//     if (t.includes('half')) return 0.5;
//     if (t.includes('quarter')) return 0.25;
//     if (t.includes('1.5') || t.includes('one point five')) return 1.5;
//     if (t.includes('double') || t.includes('two')) return 2;
//     if (t.includes('triple') || t.includes('three')) return 3;

//     if (t.includes('faster') || t.includes('increase')) {
//       const cur = videoRef.current?.playbackRate ?? 1;
//       return Math.min(cur + 0.25, 16);
//     }
//     if (t.includes('slower') || t.includes('decrease')) {
//       const cur = videoRef.current?.playbackRate ?? 1;
//       return Math.max(cur - 0.25, 0.25);
//     }

//     const numeric = t.match(/(\d+(\.\d+)?)/);
//     if (numeric) {
//       const n = parseFloat(numeric[0]);
//       if (!Number.isNaN(n) && n > 0 && n <= 16) return n;
//     }

//     return null;
//   };

//   const extractSeconds = (text) => {
//     const match = text.match(/(\d+)\s*second/);
//     if (match) return parseInt(match[1]);
//     return null;
//   };

//   // === Start Listening ===
//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setStatusMessage('Speech Recognition not supported in this browser.');
//       return;
//     }

//     if (recognitionRef.current) recognitionRef.current.stop();

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onresult = (event) => {
//       let final = '';
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) final += event.results[i][0].transcript;
//       }
//       if (final) handleVoiceCommand(final);
//     };
//     recognition.onerror = () => setListening(false);
//     recognition.onend = () => setListening(false);

//     recognition.start();
//   };

//   const stopListening = () => {
//     recognitionRef.current?.stop();
//     recognitionRef.current = null;
//     setListening(false);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!videoData) return <div>No video data found.</div>;

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 px-10 pt-6">
//       {/* Left Side */}
//       <div className="lg:w-2/3">
//         <div className="relative w-full aspect-video bg-black">
//           <video ref={videoRef} className="w-full h-full" controls>
//             <source src={videoData.videoFile} type="video/mp4" />
//           </video>
//         </div>

//         {/* Video Info */}
//         <div className="mt-4">
//           <h1 className="mb-3 text-xl font-semibold">{videoData.title}</h1>
//           <div className="flex items-center justify-between border-b border-gray-200 pb-3">
//             {userData ? (
//               <div className="flex items-center gap-3">
//                 <img src={userData.avatar} className="w-12 h-12 rounded-full" alt="User" />
//                 <div>
//                   <p className="font-medium">{userData.name}</p>
//                   <p className="text-sm text-gray-500">Subscribed • 303k</p>
//                 </div>

//                 {/* Mic Button */}
//                 <button
//                   onClick={() => (listening ? stopListening() : startListening())}
//                   className={`ml-4 px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                 >
//                   {listening ? '🎤 Listening…' : '🎤 Voice'}
//                 </button>
//               </div>
//             ) : (
//               <div>Loading user...</div>
//             )}

//             <button className="bg-red-600 text-white px-4 py-1 rounded-md">Subscribe</button>
//           </div>

//           <div className="bg-gray-100 p-4 rounded-lg mt-3">
//             <div className="flex gap-6 text-sm text-gray-700">
//               <span>👁 {videoData.views} views</span>
//               <span>📅 {formatDate(videoData.createdAt)}</span>
//             </div>
//             <p className="text-sm mt-2">
//               {showFullDesc
//                 ? videoData.description
//                 : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
//             </p>
//             {videoData.description?.length > 150 && (
//               <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 text-sm mt-1">
//                 {showFullDesc ? 'See less' : 'See more'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="lg:w-1/3 space-y-4">
//         <h2 className="font-semibold text-lg mb-2">Recommended</h2>
//         {recommended.length > 0 ? (
//           recommended.map((vid) => (
//             <Link key={vid._id} to={`/watch/${vid._id}`} className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg">
//               <img src={vid.thumbnail} className="w-40 h-24 object-cover rounded-lg" alt={vid.title} />
//               <div>
//                 <h3 className="text-sm font-medium">{vid.title}</h3>
//                 <p className="text-xs text-gray-600">{vid.owner?.name || 'Unknown'}</p>
//                 <p className="text-xs text-gray-500">{vid.views} views</p>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <p>No recommended videos.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Video;








//CODE 2

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams, useNavigate } from 'react-router-dom';

// function Video() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [showFullDesc, setShowFullDesc] = useState(false);

//   // Likes
//   const [videoLikes, setVideoLikes] = useState(0);
//   const [videoLiked, setVideoLiked] = useState(false);

//   // Comments
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [showCommentsModal, setShowCommentsModal] = useState(false);

//   // Voice state
//   const [listening, setListening] = useState(false);
//   const videoRef = useRef(null);

//   // === Fetch video ===
//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         const res = await axios.get(`/api/v1/videos/videoData/${id}`, { withCredentials: true });
//         setVideoData(res.data.data);
//         setVideoLikes(res.data.data.likes?.length || 0);
//       } catch (err) {
//         setError(err.message || 'Error fetching video');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideoData();
//   }, [id]);

//   // === Increment view + add to history ===
//   useEffect(() => {
//     axios.put(`/api/v1/videos/incrementView/${id}`).catch(console.error);
//     axios.put(`/api/v1/account/addToHistory/${id}`).catch(console.error);
//   }, [id]);

//   // === Fetch uploader data ===
//   useEffect(() => {
//     if (videoData?.owner) {
//       axios.get(`/api/v1/account/userData/${videoData.owner}`)
//         .then(res => setUserData(res.data.data))
//         .catch(console.error);
//     }
//   }, [videoData]);

//   // === Fetch comments ===
//   useEffect(() => {
//     axios
//       .get(`/api/v1/messages/video/${id}`, { withCredentials: true })
//       .then(res => setMessages(res.data.messages || []))
//       .catch(console.error);
//   }, [id]);

//   // === Fetch all videos for Recommended ===
//   useEffect(() => {
//     axios
//       .get("/api/v1/videos/allVideo")
//       .then(res => setRecommended(res.data.data || []))
//       .catch(console.error);
//   }, []);

//   // === Like video ===
//   const handleLikeVideo = async () => {
//     try {
//       await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });
//       setVideoLiked(!videoLiked);
//       setVideoLikes(prev => (videoLiked ? prev - 1 : prev + 1));
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Post comment ===
//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const res = await axios.post(`/api/v1/messages`, { videoId: id, content: newMessage }, { withCredentials: true });
//       setMessages(prev => [res.data, ...prev]);
//       setNewMessage('');
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Like comment ===
//   const toggleMessageLike = async (msgId) => {
//     try {
//       const res = await axios.post(`/api/v1/messages/${msgId}/like`, {}, { withCredentials: true });
//       setMessages(prev =>
//         prev.map(m => m._id === msgId ? { ...m, likes: res.data.likes } : m)
//       );
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Delete comment ===
//   const deleteMessage = async (msgId) => {
//     try {
//       await axios.delete(`/api/v1/messages/${msgId}`, { withCredentials: true });
//       setMessages(prev => prev.filter(m => m._id !== msgId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!videoData) return <div>No video data</div>;

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 pt-6">
//       {/* ===== Left Section ===== */}
//       <div className="lg:w-2/3">
//         <div className="relative w-full aspect-video bg-black">
//           <video ref={videoRef} className="w-full h-full" controls>
//             <source src={videoData.videoFile} type="video/mp4" />
//           </video>
//         </div>

//         {/* Video Info */}
//         <h1 className="mt-4 mb-2 text-xl font-semibold">{videoData.title}</h1>

//         {/* Uploader + Actions */}
//         <div className="border-b border-gray-200 pb-3">
//           {userData ? (
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               {/* Row 1: uploader + mic */}
//               <div className="flex items-center gap-3 flex-1">
//                 <img src={userData.avatar} className="w-12 h-12 rounded-full" alt="User" />
//                 <div>
//                   <p className="font-medium">{userData.name}</p>
//                   <p className="text-sm text-gray-500">Subscribed • 303k</p>
//                 </div>

//                 {/* 🎤 Mic always last in row */}
//                 <button
//                   onClick={() => setListening(!listening)}
//                   className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                 >
//                   🎤
//                 </button>
//               </div>

//               {/* Row 2 (on mobile) or right side (desktop): Like + Subscribe */}
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleLikeVideo}
//                   className={`px-3 py-2 rounded-md text-white ${videoLiked ? 'bg-green-600' : 'bg-gray-600'}`}
//                 >
//                   👍 {videoLikes}
//                 </button>
//                 <button className="bg-red-600 text-white px-4 py-1 rounded-md">Subscribe</button>
//               </div>
//             </div>
//           ) : <p>Loading user...</p>}
//         </div>

//         {/* Views, Date & Desc */}
//         <div className="bg-gray-100 p-4 rounded-lg mt-3 text-sm">
//           <div className="flex gap-6 text-gray-700">
//             <span>👁 {videoData.views} views</span>
//             <span>📅 {formatDate(videoData.createdAt)}</span>
//           </div>
//           <p className="mt-2">
//             {showFullDesc
//               ? videoData.description
//               : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
//           </p>
//           {videoData.description?.length > 150 && (
//             <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 text-sm">
//               {showFullDesc ? 'See less' : 'See more'}
//             </button>
//           )}
//         </div>

//         {/* ===== Comments Section ===== */}
//         <div className="mt-6">
//           <h2 className="font-semibold text-lg mb-3">Comments</h2>

//           {/* Mobile view → show "View comments" box */}
//           <div className="lg:hidden">
//             <div
//               onClick={() => setShowCommentsModal(true)}
//               className="bg-gray-100 p-3 rounded-lg cursor-pointer"
//             >
//               💬 View all {messages.length} comments
//             </div>
//           </div>

//           {/* Desktop comments */}
//           <div className="hidden lg:block">
//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Send
//               </button>
//             </div>

//             {/* <div className="space-y-3">
//               {messages.map((msg) => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                  {/* <p className="font-medium">{msg.author?.name || 'Anon'}</p> */}

//                   {/* <p>{msg.content}</p>
//                   <div className="flex gap-4 text-sm mt-1">
//                     <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                       👍 {msg.likes?.length || 0}
//                     </button>
//                     <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div> */} 



//             <div className="space-y-3">
//   {messages.map((msg) => (
//     <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//       <div className="flex justify-between items-center">
//         {/* Left: author */}
//         <div className="flex items-center gap-2">
//           <img src={msg.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
//           <span className="font-medium">{msg.author?.name || "Anon"}</span>
//         </div>

//         {/* Right: actions */}
//         <div className="flex gap-4 text-sm">
//           <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//             👍 {msg.likes?.length || 0}
//           </button>
//           <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Message text */}
//       <p className="mt-2">{msg.content}</p>
//     </div>
//   ))}
// </div>

//           </div>
//         </div>
//       </div>

//       {/* ===== Right Section ===== */}
//       <div className="lg:w-1/3 space-y-4">
//         <h2 className="font-semibold text-lg">Recommended</h2>
//         {recommended.length > 0 ? (
//           recommended.map(vid => (
//             <Link key={vid._id} to={`/watch/${vid._id}`} className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg">
//               <img src={vid.thumbnail} className="w-40 h-24 object-cover rounded-lg" alt={vid.title} />
//               <div>
//                 <h3 className="text-sm font-medium">{vid.title}</h3>
//                 <p className="text-xs text-gray-600">{vid.owner?.name || 'Unknown'}</p>
//                 <p className="text-xs text-gray-500">{vid.views} views</p>
//               </div>
//             </Link>
//           ))
//         ) : <p>No recommended videos</p>}
//       </div>

//       {/* ===== Mobile Comments Modal ===== */}
//       {showCommentsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end">
//           <div className="bg-white w-full h-2/3 rounded-t-2xl p-4 overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold">Comments</h3>
//               <button onClick={() => setShowCommentsModal(false)}>✖</button>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-md">
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map(msg => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <p className="font-medium">{msg.user?.name || 'Anon'}</p>
//                   <p>{msg.content}</p>
//                   <div className="flex gap-4 text-sm mt-1">
//                     <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                       👍 {msg.likes?.length || 0}
//                     </button>
//                     <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Video;





//CODE 3
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams, useNavigate } from 'react-router-dom';

// function Video() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [detected, setDetected] = useState('');


//   // Likes
//   const [videoLikes, setVideoLikes] = useState(0);
//   const [videoLiked, setVideoLiked] = useState(false);

//   // Comments
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [showCommentsModal, setShowCommentsModal] = useState(false);

//   // Voice state
//   const [listening, setListening] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const videoRef = useRef(null);
//   const recognitionRef = useRef(null);



//   // === Fetch video ===
//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         const res = await axios.get(`/api/v1/videos/videoData/${id}`, { withCredentials: true });
//         setVideoData(res.data.data);
//         setVideoLikes(res.data.data.likes?.length || 0);
//       } catch (err) {
//         setError(err.message || 'Error fetching video');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideoData();
//   }, [id]);

//   // === Increment view + add to history ===
//   useEffect(() => {
//     axios.put(`/api/v1/videos/incrementView/${id}`).catch(console.error);
//     axios.put(`/api/v1/account/addToHistory/${id}`).catch(console.error);
//   }, [id]);

//   // === Fetch uploader data ===
//   useEffect(() => {
//     if (videoData?.owner) {
//       axios.get(`/api/v1/account/userData/${videoData.owner}`)
//         .then(res => setUserData(res.data.data))
//         .catch(console.error);
//     }
//   }, [videoData]);

//   // === Fetch comments ===
//   useEffect(() => {
//     axios
//       .get(`/api/v1/messages/video/${id}`, { withCredentials: true })
//       .then(res => setMessages(res.data.messages || []))
//       .catch(console.error);
//   }, [id]);

//   // === Fetch all videos for Recommended ===
//   useEffect(() => {
//     axios
//       .get("/api/v1/videos/allVideo")
//       .then(res => setRecommended(res.data.data || []))
//       .catch(console.error);
//   }, []);

//   // === Like video ===
//   const handleLikeVideo = async () => {
//     try {
//       await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });
//       setVideoLiked(!videoLiked);
//       setVideoLikes(prev => (videoLiked ? prev - 1 : prev + 1));
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Post comment ===
//   const handleSendMessage = async () => {
   
//     if (!newMessage.trim()) return;
//     try {
//       console.log("Sending message:", { videoId: id, content: newMessage});

//       const res = await axios.post(`/api/v1/messages`, { videoId: id, content: newMessage }, { withCredentials: true });
//       setMessages(prev => [res.data, ...prev]); 
//       setNewMessage('');
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Like comment ===
//   const toggleMessageLike = async (msgId) => {
//     try {
//       const res = await axios.post(`/api/v1/messages/${msgId}/like`, {}, { withCredentials: true });
//       setMessages(prev =>
//         prev.map(m => m._id === msgId ? { ...m, likes: res.data.likes } : m)
//       );
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Delete comment ===
//   const deleteMessage = async (msgId) => {
//     try {
//       await axios.delete(`/api/v1/messages/${msgId}`, { withCredentials: true });
//       setMessages(prev => prev.filter(m => m._id !== msgId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // === Voice Command Parser ===
//   //   const handleVoiceCommand = async (text) => {
//   //     if (!videoRef.current) return;
//   //     const t = text.toLowerCase();

//   //     if (t.includes("pause")) return videoRef.current.pause();
//   //     if (t.includes("play") || t.includes("resume")) return videoRef.current.play();

//   //     if (t.includes("forward")) {
//   //       const seconds = extractSeconds(t) || 10;
//   //       videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds);
//   //       return;
//   //     }
//   //     if (t.includes("back") || t.includes("rewind")) {
//   //       const seconds = extractSeconds(t) || 10;
//   //       videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
//   //       return;
//   //     }

//   //     const speed = parseSpeedFromText(t);
//   //     if (speed !== null) {
//   //       videoRef.current.playbackRate = speed;
//   //       return;
//   //     }

//   //     if (t.includes("volume up") || t.includes("increase volume")) {
//   //       videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.3);
//   //       return;
//   //     }
//   //     if (t.includes("volume down") || t.includes("decrease volume")) {
//   //       videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.3);
//   //       return;
//   //     }
//   //     if (t.includes("mute")) {
//   //       videoRef.current.muted = true;
//   //       return;
//   //     }
//   //     if (t.includes("unmute")) {
//   //       videoRef.current.muted = false;
//   //       return;
//   //     }

//   //     if (t.includes("fullscreen")) {
//   //       if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
//   //       return;
//   //     }
//   //     if (t.includes("exit fullscreen") || t.includes("normal screen")) {
//   //       if (document.exitFullscreen) document.exitFullscreen();
//   //       return;
//   //     }

//   //     if (t.includes("picture in picture") || t.includes("pip")) {
//   //       try {
//   //         if (document.pictureInPictureElement) {
//   //           await document.exitPictureInPicture();
//   //         } else {
//   //           await videoRef.current.requestPictureInPicture();
//   //         }
//   //       } catch (err) {
//   //         console.error("PIP error:", err);
//   //       }
//   //       return;
//   //     }

//   //     if (t.includes("download")) {
//   //       const a = document.createElement("a");
//   //       a.href = videoData.videoFile;
//   //       a.download = `${videoData.title || "video"}.mp4`;
//   //       document.body.appendChild(a);
//   //       a.click();
//   //       document.body.removeChild(a);
//   //       return;
//   //     }
//   //   };

//   //   const parseSpeedFromText = (t) => {
//   //     if (!t) return null;
//   //     if (t.includes('normal')) return 1;
//   //     if (t.includes('half')) return 0.5;
//   //     if (t.includes('quarter')) return 0.25;
//   //     if (t.includes('1.5') || t.includes('one point five')) return 1.5;
//   //     if (t.includes('double') || t.includes('two')) return 2;
//   //     if (t.includes('triple') || t.includes('three')) return 3;

//   //     if (t.includes('faster') || t.includes('increase')) {
//   //       const cur = videoRef.current?.playbackRate ?? 1;
//   //       return Math.min(cur + 0.25, 16);
//   //     }
//   //     if (t.includes('slower') || t.includes('decrease')) {
//   //       const cur = videoRef.current?.playbackRate ?? 1;
//   //       return Math.max(cur - 0.25, 0.25);
//   //     }

//   //     const numeric = t.match(/(\d+(\.\d+)?)/);
//   //     if (numeric) {
//   //       const n = parseFloat(numeric[0]);
//   //       if (!Number.isNaN(n) && n > 0 && n <= 16) return n;
//   //     }
//   //     return null;
//   //   };
//   // === Voice Command Parser ===
  



//   const handleVoiceCommand = (command) => {
//    const video = videoRef.current;

//     if (!video) return;

//     const lower = command.toLowerCase();
//     console.log("The detected voice is : ", lower)
//     console.log("exact word is  : ", lower.includes)
//     setDetected(lower);
//     let matched = true; // ✅ Track if any command matched

//     // Auto clear after 5 seconds
//     setTimeout(() => setDetected(''), 5000);
//     // 🔊 Volume controls
//     // 🔊 Volume controls
//     if (lower.includes("volume increase")) {
//       video.muted = false;
//       video.volume = Math.min(video.volume + 0.1, 1);
//     } else if (lower.includes("volume decrease")) {
//       video.muted = false;
//       video.volume = Math.max(video.volume - 0.1, 0);
//     } else if (lower.includes("mute") || lower.includes("mute the video")) {
//       video.muted = true;
//     } else if (lower.includes("unmute") || lower.includes("un mute") || lower.includes("un-mute") || lower.includes("unmute the video")) {
//       video.muted = false;
//     }





//     // ⚡ Speed controls
//     else if (lower.includes("normal")) {
//       video.playbackRate = 1;
//     } else if (lower.includes("slow")) {
//       video.playbackRate = 0.5;
//     } else if (lower.includes("slower")) {
//       video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
//     } else if (lower.includes("faster")) {
//       video.playbackRate = Math.min(video.playbackRate + 0.25, 3);
//     } else if (lower.includes("double")) {
//       video.playbackRate = 2;
//     } else if (lower.includes("triple")) {
//       video.playbackRate = 3;
//     }

//     // ⏩ Navigation
//     else if (lower.includes("forward 10")) {
//       video.currentTime = Math.min(video.currentTime + 10, video.duration);
//     } else if (lower.includes("backward 10")) {
//       video.currentTime = Math.max(video.currentTime - 10, 0);
//     }

//     // 🖥 Screen
//     else if (lower.includes("fullscreen") || lower.includes("full screen") || lower.includes("ful screen")) {
//       if (video.requestFullscreen) {
//         video.requestFullscreen();
//       }
//     } else if (lower.includes("exit fullscreen")) {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     } else if (lower.includes("picture in picture mode")) {
//       if (video.requestPictureInPicture) {
//         video.requestPictureInPicture();
//       }
//     }

//     // 🎬 Playback
//     else if (lower.includes("play")) {
//       video.play();
//     } else if (lower.includes("pause") || lower.includes("stop")) {
//       video.pause();
//     } else if (lower.includes("resume")) {
//       video.play();
//     }


//     else {
//       matched = false;
//       setStatusMessage("⚠️Please speak clearly. Your voice command did not match");
//       setTimeout(() => setStatusMessage(""), 4000);
//     }
//   };
//   // === Helpers ===
//   const extractSeconds = (text) => {
//     const match = text.match(/(\d+)\s*second/);
//     return match ? parseInt(match[1]) : null;
//   };

//   const parseSpeedFromText = (t) => {
//     if (!t) return null;
//     if (t.includes("normal")) return 1;
//     if (t.includes("half")) return 0.5;
//     if (t.includes("quarter")) return 0.25;
//     if (t.includes("1.5") || t.includes("one point five")) return 1.5;
//     if (t.includes("double") || t.includes("two")) return 2;
//     if (t.includes("triple") || t.includes("three")) return 3;

//     if (t.includes("faster")) {
//       const cur = videoRef.current?.playbackRate ?? 1;
//       return Math.min(cur + 0.25, 16);
//     }
//     if (t.includes("slower")) {
//       const cur = videoRef.current?.playbackRate ?? 1;
//       return Math.max(cur - 0.25, 0.25);
//     }

//     const numeric = t.match(/(\d+(\.\d+)?)/);
//     if (numeric) {
//       const n = parseFloat(numeric[0]);
//       if (!Number.isNaN(n) && n > 0 && n <= 16) return n;
//     }
//     return null;
//   };


//   //   const extractSeconds = (text) => {
//   //     const match = text.match(/(\d+)\s*second/);
//   //     if (match) return parseInt(match[1]);
//   //     return null;
//   //   };

//   // === Voice recognition start/stop ===
//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setStatusMessage('Speech Recognition not supported in this browser.');
//       return;
//     }

//     if (recognitionRef.current) recognitionRef.current.stop();

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onresult = (event) => {
//       let final = '';
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) final += event.results[i][0].transcript;
//       }
//       if (final) handleVoiceCommand(final);
//     };
//     recognition.onerror = () => setListening(false);
//     recognition.onend = () => setListening(false);

//     recognition.start();
//   };

//   const stopListening = () => {
//     recognitionRef.current?.stop();
//     recognitionRef.current = null;
//     setListening(false);
//   };

//   // Cleanup recognition
//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {

//         recognitionRef.current.stop();
//         recognitionRef.current = null;
//       }
//     };
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!videoData) return <div>No video data</div>;
//   // useEffect(() => {
//   //   if (videoRef.current) {
//   //     videoRef.current.muted = true;  // required for autoplay
//   //     videoRef.current.play().catch(err => {
//   //       console.warn("Autoplay blocked:", err);
//   //     });
//   //   }
//   // }, [videoData]);

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 pt-6">
//       {/* ===== Left Section ===== */}
//       <div className="lg:w-2/3">
//         <div className="relative w-full aspect-video bg-black">
//           <video ref={videoRef} className="w-full h-full" controls autoPlay muted playsInline>
//             <source src={videoData.videoFile} type="video/mp4" />
//           </video>
//         </div>

//         {/* Video Info */}
//         <h1 className="mt-4 mb-2 text-xl font-semibold">{videoData.title}</h1>

//         {/* Uploader + Actions */}
//         <div className="border-b border-gray-200 pb-3">
//           {userData ? (
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-3 flex-1">
//                 <img src={userData.avatar} className="w-12 h-12 rounded-full" alt="User" />
//                 <div>
//                   <p className="font-medium">{userData.name}</p>
//                   <p className="text-sm text-gray-500">Subscribed • 303k</p>
//                 </div  >

//                 {/* 🎤 Mic Button */}

//                 {/*           
//                   <button
//                     onClick={() => (listening ? stopListening() : startListening())}
//                     className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                   >
//                     {listening ? '🎤 Listening…' : '🎤 Voice'}
//                   </button> */}

//                 {/* <div className="relative inline-block  ml-[40%]">
                
//                   {statusMessage && ( 
//                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 
//                 min-w-[200px] max-w-[300px] px-4 py-2 
//                 bg-red-600 text-white text-sm rounded-lg 
//                 shadow-lg text-center animate-fadeInOut">
//                       {statusMessage}
//                       <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 
//                   w-0 h-0 border-l-6 border-r-6 border-t-6 
//                   border-l-transparent border-r-transparent border-t-red-600"></div>
//                     </div>

//                   )}
 
                
//                   <button
//                     onClick={() => (listening ? stopListening() : startListening())}
//                     className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                   >
//                     {listening ? '🎤 Listening…' : '🎤 Voice'}
//                   </button>
//                </div> */}
//    <div className="relative inline-block ml-auto lg:ml-8">
//   {/* Popup over mic */}
//   {statusMessage && (
//     <div
//       className="
//         absolute -top-12
//         lg:left-1/2 lg:-translate-x-1/2       /* Desktop: center over mic */
//         right-0 sm:right-0 sm:-translate-x-full /* Mobile: left of mic */
//         min-w-[200px] max-w-[300px] px-4 py-2
//         bg-red-600 text-white text-sm rounded-lg
//         shadow-lg text-center animate-fadeInOut
//       "
//     >
//       {statusMessage}
//       <div
//         className="
//           absolute bottom-[-6px]
//           lg:left-1/2 lg:-translate-x-1/2       /* Desktop arrow */
//           right-0 -translate-x-full               /* Mobile arrow */
//           w-0 h-0 border-l-6 border-r-6 border-t-6
//           border-l-transparent border-r-transparent border-t-red-600
//         "
//       ></div>
//     </div>
//   )}

//   {/* 🎤 Mic Button */}
//   <button
//     onClick={() => (listening ? stopListening() : startListening())}
//     className={`px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//   >
//     {listening ? '🎤 Listening…' : '🎤 Voice'}
//   </button>
// </div>


//                 {/* 
//                 {detected && (
//                   <div className="relative mt-2 inline-block">
//                     <p className="px-3 py-2 text-sm text-gray-700 bg-yellow-200 border-2 border-yellow-500 rounded-lg shadow-md italic">
//                       You said: "{detected}"
//                     </p>
                   
//                     <div className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-500 [clip-path:polygon(0%_0%,5%_100%,10%_0%,15%_100%,20%_0%,25%_100%,30%_0%,35%_100%,40%_0%,45%_100%,50%_0%,55%_100%,60%_0%,65%_100%,70%_0%,75%_100%,80%_0%,85%_100%,90%_0%,95%_100%,100%_0%)]"></div>
//                   </div>
//                 )} */}

//                 {/* {statusMessage && (
//                   <div className="mt-2 px-3 py-2 text-sm bg-red-200 border-2 border-red-500 rounded-lg text-red-800 shadow-md animate-pulse">
//                     {statusMessage}
//                   </div>
//                 )} */}

//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleLikeVideo}
//                   className={`px-3 py-2 rounded-md text-white ${videoLiked ? 'bg-green-600' : 'bg-gray-600'}`}
//                 >
//                   👍 {videoLikes}
//                 </button>
//                 <button className="bg-red-600 text-white px-4 py-1 rounded-md">Subscribe</button>
//               </div>
//             </div>
//           ) : <p>Loading user...</p>}
//         </div>

//         {/* Views, Date & Desc */}
//         <div className="bg-gray-100 p-4 rounded-lg mt-3 text-sm">
//           <div className="flex gap-6 text-gray-700">
//             <span>👁 {videoData.views} views</span>
//             <span>📅 {formatDate(videoData.createdAt)}</span>
//           </div>
//           <p className="mt-2">
//             {showFullDesc
//               ? videoData.description
//               : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
//           </p>
//           {videoData.description?.length > 150 && (
//             <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 text-sm">
//               {showFullDesc ? 'See less' : 'See more'}
//             </button>
//           )}
//         </div>

//         {/* ===== Comments Section ===== */}
//         <div className="mt-6">
//           <h2 className="font-semibold text-lg mb-3">Comments</h2>
//           <div className="lg:hidden">
//             <div
//               onClick={() => setShowCommentsModal(true)}
//               className="bg-gray-100 p-3 rounded-lg cursor-pointer"
//             >
//               💬 View all {messages.length} comments
//             </div>
//           </div>

//           <div className="hidden lg:block">
//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map((msg) => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <img src={msg.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
//                       <span className="font-medium">{msg.author?.name || "Anon"}</span>
//                     </div>
//                     <div className="flex gap-4 text-sm">
//                       <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                         👍 {msg.likes?.length || 0}
//                       </button>
//                       <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                   <p className="mt-2">{msg.content}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== Right Section ===== */}
//       <div className="lg:w-1/3 space-y-4">
//         <h2 className="font-semibold text-lg">Recommended</h2>
//         {recommended.length > 0 ? (
//           recommended.map(vid => (
//             <Link key={vid._id} to={`/watch/${vid._id}`} className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg">
//               <img src={vid.thumbnail} className="w-40 h-24 object-cover rounded-lg" alt={vid.title} />
//               <div>
//                 <h3 className="text-sm font-medium">{vid.title}</h3>
//                 <p className="text-xs text-gray-600">{vid.owner?.name || 'Unknown'}</p>
//                 <p className="text-xs text-gray-500">{vid.views} views</p>
//               </div>
//             </Link>
//           ))
//         ) : <p>No recommended videos</p>}
//       </div>

//       {/* ===== Mobile Comments Modal ===== */}
//       {showCommentsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end">
//           <div className="bg-white w-full h-2/3 rounded-t-2xl p-4 overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold">Comments</h3>
//               <button onClick={() => setShowCommentsModal(false)}>✖</button>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-md">
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map(msg => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <p className="font-medium">{msg.user?.name || 'Anon'}</p>
//                   <p>{msg.content}</p>
//                   <div className="flex gap-4 text-sm mt-1">
//                     <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                       👍 {msg.likes?.length || 0}
//                     </button>
//                     <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Video;



//CODE 4

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// // import {dotenv } from 'dotenv';

// function Video() {
//  const API = import.meta.env.VITE_API_URL || "";
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [channelId, setChannelId] = useState(null);
//   const [error, setError] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [detected, setDetected] = useState('');


//   // Likes
//   const [videoLikes, setVideoLikes] = useState(0);
//   const [videoLiked, setVideoLiked] = useState(false);

//   // Comments
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [showCommentsModal, setShowCommentsModal] = useState(false);

//   // Voice state
//   const [listening, setListening] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const videoRef = useRef(null);
//   const recognitionRef = useRef(null);

// //subscribe
// const [subscribe, setSubscribe] = useState(false);
// const [count, setCount] = useState(0);
// const [isToggling, setIsToggling] = useState(false);



//   // === Fetch video ===
//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         const res = await axios.get(`/api/v1/videos/videoData/${id}`, { withCredentials: true });
//         setVideoData(res.data.data);
//         setVideoLikes(res.data.data.likes?.length || 0);
//       } catch (err) {
//         setError(err.message || 'Error fetching video');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideoData();
//   }, [id]);

//   // === Increment view + add to history ===
//   useEffect(() => {
//     axios.put(`/api/v1/videos/incrementView/${id}`).catch(console.error);
//     axios.put(`/api/v1/account/addToHistory/${id}`).catch(console.error);
//   }, [id]);


// /// to make vidioe auto play after click on any recommended vidioe
//    useEffect(() => {
//   if (!videoData?.videoFile || !videoRef.current) return;
//   const v = videoRef.current;
//   try { v.pause(); } catch (e) {}
//   if (v.src !== videoData.videoFile) {
//     v.src = videoData.videoFile;
//   }
//   try {
//     v.load();
//     v.play().catch(() => {});
//   } catch (e) {}
// }, [videoData]);




//   // === Fetch uploader data ===
//   useEffect(() => {
//     if (videoData?.owner) {
//       axios.get(`/api/v1/account/userData/${videoData.owner}`)
//         .then(res => {
//           console.log("the value is ",res);
//           // setUserId(res.data.data._id);
//           setUserData(res.data.data)
//              setChannelId(res.data.data._id || videoData.owner);
//         })  
//         .catch(console.error);
//     }
//   }, [videoData]);

//   // === Fetch comments ===
//   useEffect(() => {
//     axios
//       .get(`/api/v1/messages/video/${id}`, { withCredentials: true })
//       .then(res => setMessages(res.data.messages || []))
//       .catch(console.error);
//   }, [id]);

//   // === Fetch all videos for Recommended ===
//   useEffect(() => {
//     axios
//       .get("/api/v1/videos/allVideo")
//       .then(res => setRecommended(res.data.data || []))
//       .catch(console.error);
//   }, []);

//   // === Like video ===
//   const handleLikeVideo = async () => {
//     try {
//       await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });
//       setVideoLiked(!videoLiked);
//       setVideoLikes(prev => (videoLiked ? prev - 1 : prev + 1));
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

 
 

// // use channelId to fetch count & status
// useEffect(() => {
//   if (!channelId) return;

//   axios.get(`/api/v1/subs/${channelId}/count`)
//     .then(res => setCount(res.data.count || 0))
//     .catch(err => console.error("count error:", err.response?.data || err.message));

//   axios.get(`/api/v1/subs/${channelId}/status`, { withCredentials: true })
//     .then(res => setSubscribe(!!res.data.subscribed))
//     .catch(err => {
//       if (err.response?.status === 401) setSubscribe(false);
//       else console.error("status error:", err.response?.data || err.message);
//     });
// }, [channelId]);

// // subscribe handler uses the channelId state
// const handleSubscribe = async () => {
//   if (!channelId) {
//     console.warn("No channelId available for subscribe");
//     return;
//   }
//   if (isToggling) return;

//   const prevSubscribed = subscribe;
//   const prevCount = count;
//   const newSubscribed = !prevSubscribed;

//   setIsToggling(true);
//   setSubscribe(newSubscribed);
//   setCount(prev => Math.max(0, prev + (newSubscribed ? 1 : -1)));

//   try {
//     const res = await axios.post(`/api/v1/subs/${channelId}/subscribe`, {}, { withCredentials: true });
//     console.log("subscribe response:", res.data);
//     if (res.data?.subscribed !== undefined) setSubscribe(!!res.data.subscribed);
//     if (typeof res.data?.count === 'number') setCount(res.data.count);
//   } catch (err) {
//     setSubscribe(prevSubscribed);
//     setCount(prevCount);
//     console.error("subscribe error:", err.response?.data || err.message);
//     if (err.response?.status === 401) navigate('/login');
//   } finally {
//     setIsToggling(false);
//   }
// };

//   // === Post comment ===
//  const handleSendMessage = async (overrideText = null) => {
//   const messageText = overrideText !== null ? overrideText : newMessage;
//   if (!messageText.trim()) return;

//   try {
//     console.log("Sending message:", { videoId: id, content: messageText });

//     const res = await axios.post(
//       `/api/v1/messages`,
//       { videoId: id, content: messageText },
//       { withCredentials: true }
//     );

//     setMessages(prev => [res.data, ...prev]); 
//     setNewMessage('');
//        setShowCommentsModal(true);
//   } catch (err) {
//     if (err.response?.status === 401) navigate('/login');
//   }
// };


//   // === Like comment ===
//   const toggleMessageLike = async (msgId) => {
//     try {
//       const res = await axios.post(`/api/v1/messages/${msgId}/like`, {}, { withCredentials: true });
//       setMessages(prev => 
//         prev.map(m => m._id === msgId ? { ...m, likes: res.data.likes } : m)
//       );
    
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Delete comment ===
//   const deleteMessage = async (msgId) => {
//     try {
//       await axios.delete(`/api/v1/messages/${msgId}`, { withCredentials: true });
//       setMessages(prev => prev.filter(m => m._id !== msgId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // === Voice Command Parser ===
//   //   const handleVoiceCommand = async (text) => {
//   //     if (!videoRef.current) return;
//   //     const t = text.toLowerCase();

//   //     if (t.includes("pause")) return videoRef.current.pause();
//   //     if (t.includes("play") || t.includes("resume")) return videoRef.current.play();

//   //     if (t.includes("forward")) {
//   //       const seconds = extractSeconds(t) || 10;
//   //       videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds);
//   //       return;
//   //     }
//   //     if (t.includes("back") || t.includes("rewind")) {
//   //       const seconds = extractSeconds(t) || 10;
//   //       videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
//   //       return;
//   //     }

//   //     const speed = parseSpeedFromText(t);
//   //     if (speed !== null) {
//   //       videoRef.current.playbackRate = speed;
//   //       return;
//   //     }

//   //     if (t.includes("volume up") || t.includes("increase volume")) {
//   //       videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.3);
//   //       return;
//   //     }
//   //     if (t.includes("volume down") || t.includes("decrease volume")) {
//   //       videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.3);
//   //       return;
//   //     }
//   //     if (t.includes("mute")) {
//   //       videoRef.current.muted = true;
//   //       return;
//   //     }
//   //     if (t.includes("unmute")) {
//   //       videoRef.current.muted = false;
//   //       return;
//   //     }

//   //     if (t.includes("fullscreen")) {
//   //       if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
//   //       return;
//   //     }
//   //     if (t.includes("exit fullscreen") || t.includes("normal screen")) {
//   //       if (document.exitFullscreen) document.exitFullscreen();
//   //       return;
//   //     }

//   //     if (t.includes("picture in picture") || t.includes("pip")) {
//   //       try {
//   //         if (document.pictureInPictureElement) {
//   //           await document.exitPictureInPicture();
//   //         } else {
//   //           await videoRef.current.requestPictureInPicture();
//   //         }
//   //       } catch (err) {
//   //         console.error("PIP error:", err);
//   //       }
//   //       return;
//   //     }

//   //     if (t.includes("download")) {
//   //       const a = document.createElement("a");
//   //       a.href = videoData.videoFile;
//   //       a.download = `${videoData.title || "video"}.mp4`;
//   //       document.body.appendChild(a);
//   //       a.click();
//   //       document.body.removeChild(a);
//   //       return;
//   //     }
//   //   };

//   //   const parseSpeedFromText = (t) => {
//   //     if (!t) return null;
//   //     if (t.includes('normal')) return 1;
//   //     if (t.includes('half')) return 0.5;
//   //     if (t.includes('quarter')) return 0.25;
//   //     if (t.includes('1.5') || t.includes('one point five')) return 1.5;
//   //     if (t.includes('double') || t.includes('two')) return 2;
//   //     if (t.includes('triple') || t.includes('three')) return 3;

//   //     if (t.includes('faster') || t.includes('increase')) {
//   //       const cur = videoRef.current?.playbackRate ?? 1;
//   //       return Math.min(cur + 0.25, 16);
//   //     }
//   //     if (t.includes('slower') || t.includes('decrease')) {
//   //       const cur = videoRef.current?.playbackRate ?? 1;
//   //       return Math.max(cur - 0.25, 0.25);
//   //     }

//   //     const numeric = t.match(/(\d+(\.\d+)?)/);
//   //     if (numeric) {
//   //       const n = parseFloat(numeric[0]);
//   //       if (!Number.isNaN(n) && n > 0 && n <= 16) return n;
//   //     }
//   //     return null;
//   //   };
//   // === Voice Command Parser ===
  



//   const handleVoiceCommand = (command) => {
//    const video = videoRef.current;

//     if (!video) return;

//     const lower = command.toLowerCase();
//     console.log("The detected voice is : ", lower)
//     console.log("exact word is  : ", lower.includes)
//     setDetected(lower);

// //applying video play functionality
// const idx = parseIndexFromText(lower, recommended.length);
// if (idx !== null) {
//   if (!recommended || recommended.length === 0) {
//     setStatusMessage("No recommendations available");
//     setTimeout(() => setStatusMessage(""), 2500);
//     return;
//   }
//   const target = recommended[idx];
//   if (!target) {
//     setStatusMessage("Index out of range");
//     setTimeout(() => setStatusMessage(""), 2500);
//     return;
//   }
//   try { recognitionRef.current?.stop(); } catch (e) {}  
//   recognitionRef.current = null;
//   setListening(false);
 
//   setStatusMessage(`Opening "${target.title}"`);
//   navigate(`/watch/${target._id}`);
 
//   return;
// }





//     let matched = true; // ✅ Track if any command matched

//     // Auto clear after 5 seconds
//     setTimeout(() => setDetected(''), 5000);
//     // 🔊 Volume controls
//     // 🔊 Volume controls
//     if (lower.includes("volume increase")) {
//       video.muted = false;
//       video.volume = Math.min(video.volume + 0.1, 1);
//     } else if (lower.includes("volume decrease")) {
//       video.muted = false;
//       video.volume = Math.max(video.volume - 0.1, 0);
//     } else if (lower.includes("mute") || lower.includes("mute the video")) {
//       video.muted = true;
//     } else if (lower.includes("unmute") || lower.includes("un mute") || lower.includes("un-mute") || lower.includes("unmute the video")) {
//       video.muted = false;
//     }





//     // ⚡ Speed controls
//     else if (lower.includes("normal")) {
//       video.playbackRate = 1;
//     } else if (lower.includes("slow")) {
//       video.playbackRate = 0.5;
//     } else if (lower.includes("slower")) {
//       video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
//     } else if (lower.includes("faster")) {
//       video.playbackRate = Math.min(video.playbackRate + 0.25, 3);
//     } else if (lower.includes("double")) {
//       video.playbackRate = 2;
//     } else if (lower.includes("triple")) {
//       video.playbackRate = 3;
//     }

//     // ⏩ Navigation
//     else if (lower.includes("forward 10")) {
//       video.currentTime = Math.min(video.currentTime + 10, video.duration);
//     } else if (lower.includes("backward 10")) {
//       video.currentTime = Math.max(video.currentTime - 10, 0);
//     }

//     // 🖥 Screen
//     else if (lower.includes("fullscreen") || lower.includes("full screen") || lower.includes("ful screen")) {
//       if (video.requestFullscreen) {
//         video.requestFullscreen();
//       }
//     } else if (lower.includes("exit fullscreen")) {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     } else if (lower.includes("picture in picture mode")) {
//       if (video.requestPictureInPicture) {
//         video.requestPictureInPicture();
//       }
//     }

//     // 🎬 Playback
//     else if (lower.includes("play")) {
//       video.play();
//     } else if (lower.includes("pause") || lower.includes("stop")) {
//       video.pause();
//     } else if (lower.includes("resume")) {
//       video.play();
//     }

//     //create a message
//    else  if (lower.includes("create message")) {
//   setStatusMessage("🎤 Speak your message (10s)...");
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   if (!SpeechRecognition) {
//     setStatusMessage("Speech Recognition not supported in this browser.");
//     return;
//   }

//   const recognition = new SpeechRecognition();
//   recognition.lang = "en-US";
//   recognition.interimResults = false;
//   recognition.continuous = false;

// recognition.onresult = async (event) => {
//   let spokenText = "";
//   for (let i = event.resultIndex; i < event.results.length; ++i) {
//     if (event.results[i].isFinal) {
//       spokenText += event.results[i][0].transcript;
//     }
//   }

//   if (spokenText.trim()) {
//     await handleSendMessage(spokenText); // ✅ now works
//     setStatusMessage("✅ Message sent!");
//     setTimeout(() => setStatusMessage(""), 4000);
//   }
// };


//   recognition.onend = () => setStatusMessage("");
//   recognition.start();

//   // stop after 10 seconds
//   setTimeout(() => recognition.stop(), 10000);
//   return;
// }

// //open or close message UI
// else if (lower.includes("open message") || lower.includes("show message") || lower.includes("open comments")) {
//   setShowCommentsModal(true);
//   setStatusMessage("💬 Comments opened");
//   return;
// }

// else if (lower.includes("close message") || lower.includes("hide message") || lower.includes("close comments")) {
//   setShowCommentsModal(false);
//   setStatusMessage("❌ Comments closed");
//   return;
// }
// else if (lower.includes("toggle subscribe")) {
//      handleSubscribe();
//     }



//     else {
//       matched = false;
//       setStatusMessage("⚠️Please speak clearly. Your voice command did not match");
//       setTimeout(() => setStatusMessage(""), 4000);
//     }
//   };
//   // === Helpers ===
//   const extractSeconds = (text) => {
//     const match = text.match(/(\d+)\s*second/);
//     return match ? parseInt(match[1]) : null;
//   };

//  const wordToNumber = (w) => {
//   const map = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, first:1, second:2, third:3, fourth:4, fifth:5 };
//   return map[w] ?? null;
// };


// const parseIndexFromText = (text, max) => {
//   if (!text) return null;
//   const digitMatch = text.match(/\b(\d+)(st|nd|rd|th)?\b/);
//   if (digitMatch) {
//     const n = Number(digitMatch[1]);
//     if (n >= 1 && n <= max) return n - 1;
//   }
//   const wordMatch = text.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth)\b/);
//   if (wordMatch) {
//     const n = wordToNumber(wordMatch[1]);
//     if (n !== null && n >= 0 && n < max) return n === 0 ? 0 : n - 1;
//   }
//   return null;
// };


//   //   const extractSeconds = (text) => {
//   //     const match = text.match(/(\d+)\s*second/);
//   //     if (match) return parseInt(match[1]);
//   //     return null;
//   //   };

//   // === Voice recognition start/stop ===
//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setStatusMessage('Speech Recognition not supported in this browser.');
//       return;
//     }

//     if (recognitionRef.current) recognitionRef.current.stop();

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onresult = (event) => {
//       let final = '';
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) final += event.results[i][0].transcript;
//       }
//       if (final) handleVoiceCommand(final);
//     };
//     recognition.onerror = () => setListening(false);
//     recognition.onend = () => setListening(false);

//     recognition.start();
//   };

//   const stopListening = () => {
//     recognitionRef.current?.stop();
//     recognitionRef.current = null;
//     setListening(false);
//   };

//   // Cleanup recognition
//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {

//         recognitionRef.current.stop();
//         recognitionRef.current = null;
//       }
//     };
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!videoData) return <div>No video data</div>;
//   // useEffect(() => {
//   //   if (videoRef.current) {
//   //     videoRef.current.muted = true;  // required for autoplay
//   //     videoRef.current.play().catch(err => {
//   //       console.warn("Autoplay blocked:", err);
//   //     });
//   //   }
//   // }, [videoData]);

 

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 pt-6">
//       {/* ===== Left Section ===== */}
//       <div className="lg:w-2/3">
//         <div className="relative w-full aspect-video bg-black">
//           <video ref={videoRef} className="w-full h-full" controls autoPlay muted playsInline>
//             <source src={videoData.videoFile} type="video/mp4" />
//           </video>
//         </div>

//         {/* Video Info */}
//         <h1 className="mt-4 mb-2 text-xl font-semibold">{videoData.title}</h1>

//         {/* Uploader + Actions */}
//         <div className="border-b border-gray-200 pb-3">
//           {userData ? (
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-3 flex-1">
//                 <img src={userData.avatar} className="w-12 h-12 rounded-full" alt="User" />
//                 <div>
//                   <p className="font-medium">{userData.name}</p>
//                   <p className="text-sm text-gray-500"> {count} Subscribers</p>
//                 </div  >

//                 {/* 🎤 Mic Button */}

//                 {/*           
//                   <button
//                     onClick={() => (listening ? stopListening() : startListening())}
//                     className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                   >
//                     {listening ? '🎤 Listening…' : '🎤 Voice'}
//                   </button> */}

//                 {/* <div className="relative inline-block  ml-[40%]">
                
//                   {statusMessage && ( 
//                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 
//                 min-w-[200px] max-w-[300px] px-4 py-2 
//                 bg-red-600 text-white text-sm rounded-lg 
//                 shadow-lg text-center animate-fadeInOut">
//                       {statusMessage}
//                       <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 
//                   w-0 h-0 border-l-6 border-r-6 border-t-6 
//                   border-l-transparent border-r-transparent border-t-red-600"></div>
//                     </div>

//                   )}
 
                
//                   <button
//                     onClick={() => (listening ? stopListening() : startListening())}
//                     className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                   >
//                     {listening ? '🎤 Listening…' : '🎤 Voice'}
//                   </button>
//                </div> */}
//    <div className="relative inline-block ml-auto lg:ml-8">
//   {/* Popup over mic */}
//   {statusMessage && (
//     <div
//       className="
//         absolute -top-12
//         lg:left-1/2 lg:-translate-x-1/2       /* Desktop: center over mic */
//         right-0 sm:right-0 sm:-translate-x-full /* Mobile: left of mic */
//         min-w-[200px] max-w-[300px] px-4 py-2
//         bg-red-600 text-white text-sm rounded-lg
//         shadow-lg text-center animate-fadeInOut
//       "
//     >
//       {statusMessage}
//       <div
//         className="
//           absolute bottom-[-6px]
//           lg:left-1/2 lg:-translate-x-1/2       /* Desktop arrow */
//           right-0 -translate-x-full               /* Mobile arrow */
//           w-0 h-0 border-l-6 border-r-6 border-t-6
//           border-l-transparent border-r-transparent border-t-red-600
//         "
//       ></div>
//     </div>
//   )}

//   {/* 🎤 Mic Button */}
//   <button
//     onClick={() => (listening ? stopListening() : startListening())}
//     className={`px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//   >
//     {listening ? '🎤 Listening…' : '🎤 Voice'}
//   </button>
// </div>


//                 {/* 
//                 {detected && (
//                   <div className="relative mt-2 inline-block">
//                     <p className="px-3 py-2 text-sm text-gray-700 bg-yellow-200 border-2 border-yellow-500 rounded-lg shadow-md italic">
//                       You said: "{detected}"
//                     </p>
                   
//                     <div className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-500 [clip-path:polygon(0%_0%,5%_100%,10%_0%,15%_100%,20%_0%,25%_100%,30%_0%,35%_100%,40%_0%,45%_100%,50%_0%,55%_100%,60%_0%,65%_100%,70%_0%,75%_100%,80%_0%,85%_100%,90%_0%,95%_100%,100%_0%)]"></div>
//                   </div>
//                 )} */}

//                 {/* {statusMessage && (
//                   <div className="mt-2 px-3 py-2 text-sm bg-red-200 border-2 border-red-500 rounded-lg text-red-800 shadow-md animate-pulse">
//                     {statusMessage}
//                   </div>
//                 )} */}

//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleLikeVideo}
//                   className={`px-3 py-2 rounded-md text-white ${videoLiked ? 'bg-green-600' : 'bg-gray-600'}`}
//                 >
//                   👍 {videoLikes}
//                 </button>
//                 <button onClick={handleSubscribe } className="bg-red-600 text-white px-4 py-1 rounded-md">{subscribe?"Subscribed":"Subscribe"}</button>
//               </div>
//             </div>
//           ) : <p>Loading user...</p>}
//         </div>

//         {/* Views, Date & Desc */}
//         <div className="bg-gray-100 p-4 rounded-lg mt-3 text-sm">
//           <div className="flex gap-6 text-gray-700">
//             <span>👁 {videoData.views} views</span>
//             <span>📅 {formatDate(videoData.createdAt)}</span>
//           </div>
//           <p className="mt-2">
//             {showFullDesc
//               ? videoData.description
//               : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
//           </p>
//           {videoData.description?.length > 150 && (
//             <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 text-sm">
//               {showFullDesc ? 'See less' : 'See more'}
//             </button>
//           )}
//         </div>

//         {/* ===== Comments Section ===== */}
//         <div className="mt-6">
//           <h2 className="font-semibold text-lg mb-3">Comments</h2>
//           <div className="lg:hidden">
//             <div
//               onClick={() => setShowCommentsModal(true)}
//               className="bg-gray-100 p-3 rounded-lg cursor-pointer"
//             >
//               💬 View all {messages.length} comments
//             </div>
//           </div>

//           <div className="hidden lg:block">
//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map((msg) => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <img src={msg.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
//                       <span className="font-medium">{msg.author?.name || "Anon"}</span>
//                     </div>
//                     <div className="flex gap-4 text-sm">
//                       <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                         👍 {msg.likes?.length || 0}
//                       </button>
//                       <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                   <p className="mt-2">{msg.content}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== Right Section ===== */}
//       <div className="lg:w-1/3 space-y-4">
//         <h2 className="font-semibold text-lg">Recommended</h2>
//         {recommended.length > 0 ? (
//           recommended.map(vid => (
//             <Link key={vid._id} to={`/watch/${vid._id}`} className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg">
//               <img src={vid.thumbnail} className="w-40 h-24 object-cover rounded-lg" alt={vid.title} />
              
//               <div>
//                 <h3 className="text-sm font-medium">{vid.title}</h3>
//                 <p className="text-xs text-gray-600">{vid.owner?.name || 'Unknown'}</p>
//                 <p className="text-xs text-gray-500">{vid.views} views</p>
//               </div>
//             </Link>
//           ))
//         ) : <p>No recommended videos</p>}
//       </div>

//       {/* ===== Mobile Comments Modal ===== */}
//       {showCommentsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end">
//           <div className="bg-white w-full h-2/3 rounded-t-2xl p-4 overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold">Comments</h3>
//               <button onClick={() => setShowCommentsModal(false)}>✖</button>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-md">
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map(msg => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <p className="font-medium">{msg.user?.name || 'Anon'}</p>
//                   <p>{msg.content}</p>
//                   <div className="flex gap-4 text-sm mt-1">
//                     <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                       👍 {msg.likes?.length || 0}
//                     </button>
//                     <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Video;



//code 5
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// // import {dotenv } from 'dotenv';

// function Video() {
//  const API = import.meta.env.VITE_API_URL || "";
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [channelId, setChannelId] = useState(null);
//   const [error, setError] = useState(null);
//   const [recommended, setRecommended] = useState([]);
//   const [showFullDesc, setShowFullDesc] = useState(false);
//   const [detected, setDetected] = useState('');


//   // Likes
//   const [videoLikes, setVideoLikes] = useState(0);
//   const [videoLiked, setVideoLiked] = useState(false);

//   // Comments
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [showCommentsModal, setShowCommentsModal] = useState(false);

//   // Voice state
//   const [listening, setListening] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const videoRef = useRef(null);
//   const recognitionRef = useRef(null);

// //subscribe
// const [subscribe, setSubscribe] = useState(false);
// const [count, setCount] = useState(0);
// const [isToggling, setIsToggling] = useState(false);

// //rerender 
// const [render,setRender]=useState(true);  

//   // === Fetch video ===
//   useEffect(() => {
//     const fetchVideoData = async () => {
//       try {
//         const res = await axios.get(`/api/v1/videos/videoData/${id}`, { withCredentials: true });
//         setVideoData(res.data.data);
//         setVideoLikes(res.data.data.likes?.length || 0);
//       } catch (err) {
//         setError(err.message || 'Error fetching video');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideoData();
//   }, [id]);

//   // === Increment view + add to history ===
//   useEffect(() => {
//     axios.put(`/api/v1/videos/incrementView/${id}`).catch(console.error);
//     axios.put(`/api/v1/account/addToHistory/${id}`).catch(console.error);
//   }, [id]);


// /// to make vidioe auto play after click on any recommended vidioe
//    useEffect(() => {
//   if (!videoData?.videoFile || !videoRef.current) return;
//   const v = videoRef.current;
//   try { v.pause(); } catch (e) {}
//   if (v.src !== videoData.videoFile) {
//     v.src = videoData.videoFile;
//   }
//   try {
//     v.load();
//     v.play().catch(() => {});
//   } catch (e) {}

//   setRender(!render)
// }, [videoData]);




//   // === Fetch uploader data ===
//   useEffect(() => {
//     if (videoData?.owner) {
//       axios.get(`/api/v1/account/userData/${videoData.owner}`)
//         .then(res => {
//           console.log("the value is ",res);
//           // setUserId(res.data.data._id);
//           setUserData(res.data.data)
//              setChannelId(res.data.data._id || videoData.owner);
//         })  
//         .catch(console.error);
//     }
//   }, [videoData]);

//   // === Fetch comments ===
//   useEffect(() => {
//     axios
//       .get(`/api/v1/messages/video/${id}`, { withCredentials: true })
//       .then(res => setMessages(res.data.messages || []))
//       .catch(console.error);
//   }, [id]);

//   // === Fetch all videos for Recommended ===
//   useEffect(() => {
//     axios
//       .get("/api/v1/videos/allVideo")
//       .then(res => setRecommended(res.data.data || []))
//       .catch(console.error);
//   }, []);

//   // === Like video ===
//   const handleLikeVideo = async () => {
//     try {
//       await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });
//       setVideoLiked(!videoLiked);
//       setVideoLikes(prev => (videoLiked ? prev - 1 : prev + 1));
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

 
 

// // use channelId to fetch count & status
// useEffect(() => {
//   if (!channelId) return;

//   axios.get(`/api/v1/subs/${channelId}/count`)
//     .then(res => setCount(res.data.count || 0))
//     .catch(err => console.error("count error:", err.response?.data || err.message));

//   axios.get(`/api/v1/subs/${channelId}/status`, { withCredentials: true })
//     .then(res => setSubscribe(!!res.data.subscribed))
//     .catch(err => {
//       if (err.response?.status === 401) setSubscribe(false);
//       else console.error("status error:", err.response?.data || err.message);
//     });
// }, [channelId]);

// // subscribe handler uses the channelId state
// const handleSubscribe = async () => {
//   if (!channelId) {
//     console.warn("No channelId available for subscribe");
//     return;
//   }
//   if (isToggling) return;

//   const prevSubscribed = subscribe;
//   const prevCount = count;
//   const newSubscribed = !prevSubscribed;

//   setIsToggling(true);
//   setSubscribe(newSubscribed);
//   setCount(prev => Math.max(0, prev + (newSubscribed ? 1 : -1)));

//   try {
//     const res = await axios.post(`/api/v1/subs/${channelId}/subscribe`, {}, { withCredentials: true });
//     console.log("subscribe response:", res.data);
//     if (res.data?.subscribed !== undefined) setSubscribe(!!res.data.subscribed);
//     if (typeof res.data?.count === 'number') setCount(res.data.count);
//   } catch (err) {
//     setSubscribe(prevSubscribed);
//     setCount(prevCount);
//     console.error("subscribe error:", err.response?.data || err.message);
//     if (err.response?.status === 401) navigate('/login');
//   } finally {
//     setIsToggling(false);
//   }
// };

//   // === Post comment ===
//  const handleSendMessage = async (overrideText = null) => {
//   const messageText = overrideText !== null ? overrideText : newMessage;
//   if (!messageText.trim()) return;

//   try {
//     console.log("Sending message:", { videoId: id, content: messageText });

//     const res = await axios.post(
//       `/api/v1/messages`,
//       { videoId: id, content: messageText },
//       { withCredentials: true }
//     );

//     setMessages(prev => [res.data, ...prev]); 
//     setNewMessage('');
//        setShowCommentsModal(true);
//   } catch (err) {
//     if (err.response?.status === 401) navigate('/login');
//   }
// };


//   // === Like comment ===
//   const toggleMessageLike = async (msgId) => {
//     try {
//       const res = await axios.post(`/api/v1/messages/${msgId}/like`, {}, { withCredentials: true });
//       setMessages(prev => 
//         prev.map(m => m._id === msgId ? { ...m, likes: res.data.likes } : m)
//       );
    
//     } catch (err) {
//       if (err.response?.status === 401) navigate('/login');
//     }
//   };

//   // === Delete comment ===
//   const deleteMessage = async (msgId) => {
//     try {
//       await axios.delete(`/api/v1/messages/${msgId}`, { withCredentials: true });
//       setMessages(prev => prev.filter(m => m._id !== msgId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // === Voice Command Parser ===
//   //   const handleVoiceCommand = async (text) => {
//   //     if (!videoRef.current) return;
//   //     const t = text.toLowerCase();

//   //     if (t.includes("pause")) return videoRef.current.pause();
//   //     if (t.includes("play") || t.includes("resume")) return videoRef.current.play();

//   //     if (t.includes("forward")) {
//   //       const seconds = extractSeconds(t) || 10;
//   //       videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds);
//   //       return;
//   //     }
//   //     if (t.includes("back") || t.includes("rewind")) {
//   //       const seconds = extractSeconds(t) || 10;
//   //       videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
//   //       return;
//   //     }

//   //     const speed = parseSpeedFromText(t);
//   //     if (speed !== null) {
//   //       videoRef.current.playbackRate = speed;
//   //       return;
//   //     }

//   //     if (t.includes("volume up") || t.includes("increase volume")) {
//   //       videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.3);
//   //       return;
//   //     }
//   //     if (t.includes("volume down") || t.includes("decrease volume")) {
//   //       videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.3);
//   //       return;
//   //     }
//   //     if (t.includes("mute")) {
//   //       videoRef.current.muted = true;
//   //       return;
//   //     }
//   //     if (t.includes("unmute")) {
//   //       videoRef.current.muted = false;
//   //       return;
//   //     }

//   //     if (t.includes("fullscreen")) {
//   //       if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
//   //       return;
//   //     }
//   //     if (t.includes("exit fullscreen") || t.includes("normal screen")) {
//   //       if (document.exitFullscreen) document.exitFullscreen();
//   //       return;
//   //     }

//   //     if (t.includes("picture in picture") || t.includes("pip")) {
//   //       try {
//   //         if (document.pictureInPictureElement) {
//   //           await document.exitPictureInPicture();
//   //         } else {
//   //           await videoRef.current.requestPictureInPicture();
//   //         }
//   //       } catch (err) {
//   //         console.error("PIP error:", err);
//   //       }
//   //       return;
//   //     }

//   //     if (t.includes("download")) {
//   //       const a = document.createElement("a");
//   //       a.href = videoData.videoFile;
//   //       a.download = `${videoData.title || "video"}.mp4`;
//   //       document.body.appendChild(a);
//   //       a.click();
//   //       document.body.removeChild(a);
//   //       return;
//   //     }
//   //   };

//   //   const parseSpeedFromText = (t) => {
//   //     if (!t) return null;
//   //     if (t.includes('normal')) return 1;
//   //     if (t.includes('half')) return 0.5;
//   //     if (t.includes('quarter')) return 0.25;
//   //     if (t.includes('1.5') || t.includes('one point five')) return 1.5;
//   //     if (t.includes('double') || t.includes('two')) return 2;
//   //     if (t.includes('triple') || t.includes('three')) return 3;

//   //     if (t.includes('faster') || t.includes('increase')) {
//   //       const cur = videoRef.current?.playbackRate ?? 1;
//   //       return Math.min(cur + 0.25, 16);
//   //     }
//   //     if (t.includes('slower') || t.includes('decrease')) {
//   //       const cur = videoRef.current?.playbackRate ?? 1;
//   //       return Math.max(cur - 0.25, 0.25);
//   //     }

//   //     const numeric = t.match(/(\d+(\.\d+)?)/);
//   //     if (numeric) {
//   //       const n = parseFloat(numeric[0]);
//   //       if (!Number.isNaN(n) && n > 0 && n <= 16) return n;
//   //     }
//   //     return null;
//   //   };
//   // === Voice Command Parser ===
  



//   const handleVoiceCommand = (command) => {
//    const video = videoRef.current;

//     if (!video) return;

//     const lower = command.toLowerCase();
//     console.log("The detected voice is : ", lower)
//     console.log("exact word is  : ", lower.includes)
//     setDetected(lower);

// //applying video play functionality
// const idx = parseIndexFromText(lower, recommended.length);
// if (idx !== null) {
//   if (!recommended || recommended.length === 0) {
//     setStatusMessage("No recommendations available");
//     setTimeout(() => setStatusMessage(""), 2500);
//     return;
//   }
//   const target = recommended[idx];
//   if (!target) {
//     setStatusMessage("Index out of range");
//     setTimeout(() => setStatusMessage(""), 2500);
//     return;
//   }
//   try { recognitionRef.current?.stop(); } catch (e) {}  
//   recognitionRef.current = null;
//   setListening(false);
 
//   setStatusMessage(`Opening "${target.title}"`);
//   navigate(`/watch/${target._id}`);
 
//   return;
// }





//     let matched = true; // ✅ Track if any command matched

//     // Auto clear after 5 seconds
//     setTimeout(() => setDetected(''), 5000);
//     // 🔊 Volume controls
//     // 🔊 Volume controls
//     if (lower.includes("volume increase")) {
//       video.muted = false;
//       video.volume = Math.min(video.volume + 0.1, 1);
//     } else if (lower.includes("volume decrease")) {
//       video.muted = false;
//       video.volume = Math.max(video.volume - 0.1, 0);
//     } else if (lower.includes("mute") || lower.includes("mute the video")) {
//       video.muted = true;
//     } else if (lower.includes("unmute") || lower.includes("un mute") || lower.includes("un-mute") || lower.includes("unmute the video")) {
//       video.muted = false;
//     }





//     // ⚡ Speed controls
//     else if (lower.includes("normal")) {
//       video.playbackRate = 1;
//     } else if (lower.includes("slow")) {
//       video.playbackRate = 0.5;
//     } else if (lower.includes("slower")) {
//       video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
//     } else if (lower.includes("faster")) {
//       video.playbackRate = Math.min(video.playbackRate + 0.25, 3);
//     } else if (lower.includes("double")) {
//       video.playbackRate = 2;
//     } else if (lower.includes("triple")) {
//       video.playbackRate = 3;
//     }

//     // ⏩ Navigation
//     else if (lower.includes("forward 10")) {
//       video.currentTime = Math.min(video.currentTime + 10, video.duration);
//     } else if (lower.includes("backward 10")) {
//       video.currentTime = Math.max(video.currentTime - 10, 0);
//     }

//     // 🖥 Screen
//     else if (lower.includes("fullscreen") || lower.includes("full screen") || lower.includes("ful screen")) {
//       if (video.requestFullscreen) {
//         video.requestFullscreen();
//       }
//     } else if (lower.includes("exit fullscreen")) {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     } else if (lower.includes("picture in picture mode")) {
//       if (video.requestPictureInPicture) {
//         video.requestPictureInPicture();
//       }
//     }

//     // 🎬 Playback
//     else if (lower.includes("play")) {
//       video.play();
//     } else if (lower.includes("pause") || lower.includes("stop")) {
//       video.pause();
//     } else if (lower.includes("resume")) {
//       video.play();
//     }

//     //create a message
//    else  if (lower.includes("create message")) {
//   setStatusMessage("🎤 Speak your message (10s)...");
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   if (!SpeechRecognition) {
//     setStatusMessage("Speech Recognition not supported in this browser.");
//     return;
//   }

//   const recognition = new SpeechRecognition();
//   recognition.lang = "en-US";
//   recognition.interimResults = false;
//   recognition.continuous = false;

// recognition.onresult = async (event) => {
//   let spokenText = "";
//   for (let i = event.resultIndex; i < event.results.length; ++i) {
//     if (event.results[i].isFinal) {
//       spokenText += event.results[i][0].transcript;
//     }
//   }

//   if (spokenText.trim()) {
//     await handleSendMessage(spokenText); // ✅ now works
//     setStatusMessage("✅ Message sent!");
//     setTimeout(() => setStatusMessage(""), 4000);
//   }
// };


//   recognition.onend = () => setStatusMessage("");
//   recognition.start();

//   // stop after 10 seconds
//   setTimeout(() => recognition.stop(), 10000);
//   return;
// }

// //open or close message UI
// else if (lower.includes("open message") || lower.includes("show message") || lower.includes("open comments")) {
//   setShowCommentsModal(true);
//   setStatusMessage("💬 Comments opened");
//   return;
// }

// else if (lower.includes("close message") || lower.includes("hide message") || lower.includes("close comments")) {
//   setShowCommentsModal(false);
//   setStatusMessage("❌ Comments closed");
//   return;
// }
// else if (lower.includes("toggle subscribe")) {
//      handleSubscribe();
//     }



//     else {
//       matched = false;
//       setStatusMessage("⚠️Please speak clearly. Your voice command did not match");
//       setTimeout(() => setStatusMessage(""), 4000);
//     }
//   };
//   // === Helpers ===
//   const extractSeconds = (text) => {
//     const match = text.match(/(\d+)\s*second/);
//     return match ? parseInt(match[1]) : null;
//   };

//  const wordToNumber = (w) => {
//   const map = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, first:1, second:2, third:3, fourth:4, fifth:5 };
//   return map[w] ?? null;
// };


// const parseIndexFromText = (text, max) => {
//   if (!text) return null;
//   const digitMatch = text.match(/\b(\d+)(st|nd|rd|th)?\b/);
//   if (digitMatch) {
//     const n = Number(digitMatch[1]);
//     if (n >= 1 && n <= max) return n - 1;
//   }
//   const wordMatch = text.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth)\b/);
//   if (wordMatch) {
//     const n = wordToNumber(wordMatch[1]);
//     if (n !== null && n >= 0 && n < max) return n === 0 ? 0 : n - 1;
//   }
//   return null;
// };


 
//   // === Voice recognition start/stop ===
//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setStatusMessage('Speech Recognition not supported in this browser.');
//       return;
//     }

//     if (recognitionRef.current) recognitionRef.current.stop();

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onresult = (event) => {
//       let final = '';
//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal) final += event.results[i][0].transcript;
//       }
//       if (final) handleVoiceCommand(final);
//     };
//     recognition.onerror = () => setListening(false);
//     recognition.onend = () => setListening(false);

//     recognition.start();
//   };

//   const stopListening = () => {
//     recognitionRef.current?.stop();
//     recognitionRef.current = null;
//     setListening(false);
//   };

//   // Cleanup recognition
//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {

//         recognitionRef.current.stop();
//         recognitionRef.current = null;
//       }
//     };
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!videoData) return <div>No video data</div>;
//   // useEffect(() => {
//   //   if (videoRef.current) {
//   //     videoRef.current.muted = true;  // required for autoplay
//   //     videoRef.current.play().catch(err => {
//   //       console.warn("Autoplay blocked:", err);
//   //     });
//   //   }
//   // }, [videoData]);

 

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 pt-6">
//       {/* ===== Left Section ===== */}
//       <div className="lg:w-2/3">
//         <div className="relative w-full aspect-video bg-black">
//           <video ref={videoRef} className="w-full h-full" controls autoPlay muted playsInline>
//             <source src={videoData.videoFile} type="video/mp4" />
//           </video>
//         </div>

//         {/* Video Info */}
//         <h1 className="mt-4 mb-2 text-xl font-semibold">{videoData.title}</h1>

//         {/* Uploader + Actions */}
//         <div className="border-b border-gray-200 pb-3">
//           {userData ? (
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-3 flex-1">
//                 <img src={userData.avatar} className="w-12 h-12 rounded-full" alt="User" />
//                 <div>
//                   <p className="font-medium">{userData.name}</p>
//                   <p className="text-sm text-gray-500"> {count} Subscribers</p>
//                 </div  >

//                 {/* 🎤 Mic Button */}

//                 {/*           
//                   <button
//                     onClick={() => (listening ? stopListening() : startListening())}
//                     className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                   >
//                     {listening ? '🎤 Listening…' : '🎤 Voice'}
//                   </button> */}

//                 {/* <div className="relative inline-block  ml-[40%]">
                
//                   {statusMessage && ( 
//                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 
//                 min-w-[200px] max-w-[300px] px-4 py-2 
//                 bg-red-600 text-white text-sm rounded-lg 
//                 shadow-lg text-center animate-fadeInOut">
//                       {statusMessage}
//                       <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 
//                   w-0 h-0 border-l-6 border-r-6 border-t-6 
//                   border-l-transparent border-r-transparent border-t-red-600"></div>
//                     </div>

//                   )}
 
                
//                   <button
//                     onClick={() => (listening ? stopListening() : startListening())}
//                     className={`ml-auto px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//                   >
//                     {listening ? '🎤 Listening…' : '🎤 Voice'}
//                   </button>
//                </div> */}
//    <div className="relative inline-block ml-auto lg:ml-8">
//   {/* Popup over mic */}
//   {statusMessage && (
//     <div
//       className="
//         absolute -top-12
//         lg:left-1/2 lg:-translate-x-1/2       /* Desktop: center over mic */
//         right-0 sm:right-0 sm:-translate-x-full /* Mobile: left of mic */
//         min-w-[200px] max-w-[300px] px-4 py-2
//         bg-red-600 text-white text-sm rounded-lg
//         shadow-lg text-center animate-fadeInOut
//       "
//     >
//       {statusMessage}
//       <div
//         className="
//           absolute bottom-[-6px]
//           lg:left-1/2 lg:-translate-x-1/2       /* Desktop arrow */
//           right-0 -translate-x-full               /* Mobile arrow */
//           w-0 h-0 border-l-6 border-r-6 border-t-6
//           border-l-transparent border-r-transparent border-t-red-600
//         "
//       ></div>
//     </div>
//   )}

//   {/* 🎤 Mic Button */}
//   <button
//     onClick={() => (listening ? stopListening() : startListening())}
//     className={`px-3 py-2 rounded-md text-white ${listening ? 'bg-green-600' : 'bg-blue-600'}`}
//   >
//     {listening ? '🎤 Listening…' : '🎤 Voice'}
//   </button>
// </div>


//                 {/* 
//                 {detected && (
//                   <div className="relative mt-2 inline-block">
//                     <p className="px-3 py-2 text-sm text-gray-700 bg-yellow-200 border-2 border-yellow-500 rounded-lg shadow-md italic">
//                       You said: "{detected}"
//                     </p>
                   
//                     <div className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-500 [clip-path:polygon(0%_0%,5%_100%,10%_0%,15%_100%,20%_0%,25%_100%,30%_0%,35%_100%,40%_0%,45%_100%,50%_0%,55%_100%,60%_0%,65%_100%,70%_0%,75%_100%,80%_0%,85%_100%,90%_0%,95%_100%,100%_0%)]"></div>
//                   </div>
//                 )} */}

//                 {/* {statusMessage && (
//                   <div className="mt-2 px-3 py-2 text-sm bg-red-200 border-2 border-red-500 rounded-lg text-red-800 shadow-md animate-pulse">
//                     {statusMessage}
//                   </div>
//                 )} */}

//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleLikeVideo}
//                   className={`px-3 py-2 rounded-md text-white ${videoLiked ? 'bg-green-600' : 'bg-gray-600'}`}
//                 >
//                   👍 {videoLikes}
//                 </button>
//                 <button onClick={handleSubscribe } className="bg-red-600 text-white px-4 py-1 rounded-md">{subscribe?"Subscribed":"Subscribe"}</button>
//               </div>
//             </div>
//           ) : <p>Loading user...</p>}
//         </div>

//         {/* Views, Date & Desc */}
//         <div className="bg-gray-100 p-4 rounded-lg mt-3 text-sm">
//           <div className="flex gap-6 text-gray-700">
//             <span>👁 {videoData.views} views</span>
//             <span>📅 {formatDate(videoData.createdAt)}</span>
//           </div>
//           <p className="mt-2">
//             {showFullDesc
//               ? videoData.description
//               : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
//           </p>
//           {videoData.description?.length > 150 && (
//             <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 text-sm">
//               {showFullDesc ? 'See less' : 'See more'}
//             </button>
//           )}
//         </div>

//         {/* ===== Comments Section ===== */}
//         <div className="mt-6">
//           <h2 className="font-semibold text-lg mb-3">Comments</h2>
//           <div className="lg:hidden">
//             <div
//               onClick={() => setShowCommentsModal(true)}
//               className="bg-gray-100 p-3 rounded-lg cursor-pointer"
//             >
//               💬 View all {messages.length} comments
//             </div>
//           </div>

//           <div className="hidden lg:block">
//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//               >
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map((msg) => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <img src={msg.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
//                       <span className="font-medium">{msg.author?.name || "Anon"}</span>
//                     </div>
//                     <div className="flex gap-4 text-sm">
//                       <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                         👍 {msg.likes?.length || 0}
//                       </button>
//                       <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                   <p className="mt-2">{msg.content}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== Right Section ===== */}
//       <div className="lg:w-1/3 space-y-4">
//         <h2 className="font-semibold text-lg">Recommended</h2>
//       {recommended.length > 0 ? (
//   recommended.map((vid, idx) => (
//     <Link
//       key={vid._id}
//       to={`/watch/${vid._id}`}
//       className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg items-center"
//     >
//       <div className="relative w-40 h-24 flex-shrink-0">
//         <img
//           src={vid.thumbnail}
//           className="w-full h-full object-cover rounded-lg"
//           alt={vid.title}
//         />
//         <div
//           className={`absolute -left-3 top-1/2 transform -translate-y-1/2
//             w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md border
//             ${id === vid._id ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-800 border-gray-200'}`}
//           style={{ zIndex: 5 }}
//         >
//           {idx + 1}
//         </div>
//       </div>

//       <div className="flex-1">
//         <h3 className="text-sm font-medium">{vid.title}</h3>
//         <p className="text-xs text-gray-600">{vid.owner?.name || 'Unknown'}</p>
//         <p className="text-xs text-gray-500">{vid.views} views</p>
//       </div>
//     </Link>
//   ))
// ) : <p>No recommended videos</p>}

//       </div>

//       {/* ===== Mobile Comments Modal ===== */}
//       {showCommentsModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end">
//           <div className="bg-white w-full h-2/3 rounded-t-2xl p-4 overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold">Comments</h3>
//               <button onClick={() => setShowCommentsModal(false)}>✖</button>
//             </div>

//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-1 border rounded-md px-3 py-2"
//                 placeholder="Add a comment..."
//               />
//               <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-md">
//                 Send
//               </button>
//             </div>

//             <div className="space-y-3">
//               {messages.map(msg => (
//                 <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
//                   <p className="font-medium">{msg.user?.name || 'Anon'}</p>
//                   <p>{msg.content}</p>
//                   <div className="flex gap-4 text-sm mt-1">
//                     <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
//                       👍 {msg.likes?.length || 0}
//                     </button>
//                     <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Video;




  //code 6 add both mike
  import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL;

function Video() {
  const API = import.meta.env.VITE_API_URL || "";
  const { id } = useParams();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [error, setError] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [detected, setDetected] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Likes
  const [videoLikes, setVideoLikes] = useState(0);
  const [videoLiked, setVideoLiked] = useState(false);



const [isLiking, setIsLiking] = useState(false);




  // Comments
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const videoRef = useRef(null);

  //subscribe
  const [subscribe, setSubscribe] = useState(false);
  const [count, setCount] = useState(0);
  const [isToggling, setIsToggling] = useState(false);

  //rerender 
  const [render,setRender]=useState(true);

  // === Fetch video ===
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const res = await axios.get(`/api/v1/videos/videoData/${id}`, { withCredentials: true });
        setVideoData(res.data.data);
        setVideoLikes(res.data.data.likes?.length || 0);
      } catch (err) {
        setError(err.message || 'Error fetching video');
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [id]);



  // === Increment view + add to history ===
  useEffect(() => {
    axios.put(`/api/v1/videos/incrementView/${id}`).catch(console.error);
    axios.put(`/api/v1/account/addToHistory/${id}`).catch(console.error);
  }, [id]);

  // Autoplay when videoData changes
  useEffect(() => {
    if (!videoData?.videoFile || !videoRef.current) return;
    const v = videoRef.current;
    try { v.pause(); } catch (e) {}
    if (v.src !== videoData.videoFile) {
      v.src = videoData.videoFile;
    }
    try {
      v.load();
      v.play().catch(() => {});
    } catch (e) {}
    setRender(!render);
  }, [videoData]);

  // === Fetch uploader data ===
  useEffect(() => {
    if (videoData?.owner) {
      axios.get(`/api/v1/account/userData/${videoData.owner}`)
        .then(res => {
          setUserData(res.data.data);
          setChannelId(res.data.data._id || videoData.owner);
        })
        .catch(console.error);
    }
  }, [videoData]);

  // === Fetch comments ===
  useEffect(() => {
    axios
      .get(`/api/v1/messages/video/${id}`, { withCredentials: true })
      .then(res => setMessages(res.data.messages || []))
      .catch(console.error);
  }, [id]);

  // === Fetch all videos for Recommended ===
  useEffect(() => {
    axios
      .get("/api/v1/videos/allVideo")
      .then(res => setRecommended(res.data.data || []))
      .catch(console.error);
  }, []);

  // === Like video ===
  // const handleLikeVideo = async () => {
  //   try {
  //     await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });
  //     setVideoLiked(!videoLiked);
  //     setVideoLikes(prev => (videoLiked ? prev - 1 : prev + 1));
  //   } catch (err) {
  //     if (err.response?.status === 401) navigate('/login');
  //   }
  // };
  const handleLikeVideo = async () => {
  if (isLiking) return null;
  setIsLiking(true);

  // optimistic fallback values (in case server response is missing)
  const prevLiked = videoLiked;
  const prevCount = videoLikes;

  try {
    const res = await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });

    // Prefer server-truth if provided
    if (res?.data) {
      // server may return { liked: boolean, likes: number } or { likes: [userIds...] }
      if (typeof res.data.liked !== 'undefined') {
        setVideoLiked(!!res.data.liked);
      } else {
        // fallback: toggle if server didn't supply explicit boolean
        setVideoLiked(!prevLiked);
      }

      if (typeof res.data.likes === 'number') {
        setVideoLikes(res.data.likes);
      } else if (Array.isArray(res.data.likes)) {
        setVideoLikes(res.data.likes.length);
      } else {
        // fallback optimistic update
        setVideoLikes(prev => (prevLiked ? Math.max(0, prev - 1) : prev + 1));
      }

      return { liked: typeof res.data.liked !== 'undefined' ? !!res.data.liked : !prevLiked, likes: typeof res.data.likes === 'number' ? res.data.likes : (Array.isArray(res.data.likes) ? res.data.likes.length : (prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1)) };
    } else {
      // No payload — fallback to optimistic toggling
      setVideoLiked(!prevLiked);
      setVideoLikes(prev => (prevLiked ? Math.max(0, prev - 1) : prev + 1));
      return { liked: !prevLiked, likes: prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1 };
    }
  } catch (err) {
    // revert optimistic (if we used any)
    setVideoLiked(prevLiked);
    setVideoLikes(prevCount);
    if (err.response?.status === 401) navigate('/login');
    console.error("like error:", err?.response?.data || err?.message);
    return null;
  } finally {
    setIsLiking(false);
  }
};


  // use channelId to fetch count & status
  useEffect(() => {
    if (!channelId) return;
    axios.get(`/api/v1/subs/${channelId}/count`)
      .then(res => setCount(res.data.count || 0))
      .catch(err => console.error("count error:", err.response?.data || err.message));
    axios.get(`/api/v1/subs/${channelId}/status`, { withCredentials: true })
      .then(res => setSubscribe(!!res.data.subscribed))
      .catch(err => {
        if (err.response?.status === 401) setSubscribe(false);
        else console.error("status error:", err.response?.data || err.message);
      });
  }, [channelId]);

  // subscribe handler uses the channelId state
  const handleSubscribe = async () => {
    if (!channelId) {
      console.warn("No channelId available for subscribe");
      return;
    }
    if (isToggling) return;
    const prevSubscribed = subscribe;
    const prevCount = count;
    const newSubscribed = !prevSubscribed;
    setIsToggling(true);
    setSubscribe(newSubscribed);
    setCount(prev => Math.max(0, prev + (newSubscribed ? 1 : -1)));
    try {
      const res = await axios.post(`/api/v1/subs/${channelId}/subscribe`, {}, { withCredentials: true });
      if (res.data?.subscribed !== undefined) setSubscribe(!!res.data.subscribed);
      if (typeof res.data?.count === 'number') setCount(res.data.count);
    } catch (err) {
      setSubscribe(prevSubscribed);
      setCount(prevCount);
      console.error("subscribe error:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setIsToggling(false);
    }
  };

  // === Post comment ===
  const handleSendMessage = async (overrideText = null) => {
    const messageText = overrideText !== null ? overrideText : newMessage;
    if (!messageText.trim()) return;
    try {
      const res = await axios.post(
        `/api/v1/messages`,
        { videoId: id, content: messageText },
        { withCredentials: true }
      );
      setMessages(prev => [res.data, ...prev]);
      setNewMessage('');
      setShowCommentsModal(true);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  // === Like comment ===
  const toggleMessageLike = async (msgId) => {
    try {
      const res = await axios.post(`/api/v1/messages/${msgId}/like`, {}, { withCredentials: true });
      setMessages(prev => prev.map(m => m._id === msgId ? { ...m, likes: res.data.likes } : m));
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  // === Delete comment ===
  const deleteMessage = async (msgId) => {
    try {
      await axios.delete(`/api/v1/messages/${msgId}`, { withCredentials: true });
      setMessages(prev => prev.filter(m => m._id !== msgId));
    } catch (err) {
      console.error(err);
    }
  };

  // === Helpers used by parser ===

  // const extractSeconds = (text) => {
  //   const match = text.match(/(\d+)\s*second/);
  //   return match ? parseInt(match[1]) : null;
  // };

  // const wordToNumber = (w) => {
  //   const map = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, first:1, second:2, third:3, fourth:4, fifth:5 };
  //   return map[w] ?? null;
  // };

  // add near other helpers in Video.jsx
const WORD_NUMBER_MAP = {
  zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10,
  eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19,
  twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90, hundred:100
};

const wordsToNumber = (text) => {
  if (!text) return null;
  const words = text.toLowerCase().replace(/[,()-]/g,' ').split(/\s+/).filter(Boolean);
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
      if (m) current += parseInt(m[1],10);
    }
  }
  total += current;
  return total > 0 ? total : null;
};

const extractSeconds = (text) => {
  if (!text) return null;
  const digitMatch = text.match(/(\d+)\s*(?:sec|second|seconds|s)\b/i);
  if (digitMatch) return parseInt(digitMatch[1], 10);
  const wordMatch = text.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)(?:\s+(?:and\s+)?[a-z\s-]*)?\b/i);
  if (wordMatch) {
    const possible = wordMatch[0];
    return wordsToNumber(possible);
  }
  return null;
};

  const parseIndexFromText = (text, max) => {
    if (!text) return null;
    const digitMatch = text.match(/\b(\d+)(st|nd|rd|th)?\b/);
    if (digitMatch) {
      const n = Number(digitMatch[1]);
      if (n >= 1 && n <= max) return n - 1;
    }
    const wordMatch = text.match(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth)\b/);
    if (wordMatch) {
      const n = wordToNumber(wordMatch[1]);
      if (n !== null && n >= 0 && n < max) return n === 0 ? 0 : n - 1;
    }
    return null;
  };

  // === Voice Command Parser (called when Navbar dispatches 'voice-command' or 'play-index') ===
  const handleVoiceCommand = async(command) => {
    const video = videoRef.current;
    if (!video) {
      // Not on watch page or video not ready
      return;
    }
    const lower = String(command).toLowerCase();
    setDetected(lower);
    // auto clear visual detected after 5s
    setTimeout(() => setDetected(''), 5000);

    // If user said index-like phrase, try to open recommended index
    const idx = parseIndexFromText(lower, recommended.length);
    if (idx !== null) {
      if (!recommended || recommended.length === 0) {
        setStatusMessage("No recommendations available");
        setTimeout(() => setStatusMessage(""), 2500);
        return;
      }
      const target = recommended[idx];
      if (!target) {
        setStatusMessage("Index out of range");
        setTimeout(() => setStatusMessage(""), 2500);
        return;
      }
      setStatusMessage(`Opening "${target.title}"`);
      navigate(`/watch/${target._id}`);
      return;
    }

    // Volume
    if (lower.includes("volume increase") || lower.includes("increase volume")) {
      video.muted = false;
      video.volume = Math.min(video.volume + 0.1, 1);
      return;
    }
    if (lower.includes("volume decrease") || lower.includes("decrease volume")) {
      video.muted = false;
      video.volume = Math.max(video.volume - 0.1, 0);
      return;
    }
    if (lower.includes("mute") || lower.includes("mute the video")) {
      video.muted = true;
      return;
    }
    if (lower.includes("unmute") || lower.includes("un mute") || lower.includes("un-mute") || lower.includes("unmute the video")) {
      video.muted = false;
      return;
    }

    // Speed
    if (lower.includes("normal")) {
      video.playbackRate = 1;
      return;
    }
    if (lower.includes("slow")) {
      video.playbackRate = 0.5;
      return;
    }
    if (lower.includes("slower")) {
      video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
      return;
    }
    if (lower.includes("faster")) {
      video.playbackRate = Math.min(video.playbackRate + 0.25, 3);
      return;
    }
    if (lower.includes("double")) {
      video.playbackRate = 2;
      return;
    }
    if (lower.includes("triple")) {
      video.playbackRate = 3;
      return;
    }




    // Seek (explicit forward/backward 10)
    // if (lower.includes("forward 10")) {
    //   video.currentTime = Math.min(video.currentTime + 10, video.duration);
    //   return;
    // }
    // if (lower.includes("backward 10")) {
    //   video.currentTime = Math.max(video.currentTime - 10, 0);
    //   return;
    // }

    // // Screen controls
    // if (lower.includes("fullscreen") || lower.includes("full screen") || lower.includes("ful screen")) {
    //   if (video.requestFullscreen) video.requestFullscreen();
    //   return;
    // }
    // if (lower.includes("exit fullscreen")) {
    //   if (document.exitFullscreen) document.exitFullscreen();
    //   return;
    // }
    // if (lower.includes("picture in picture") || lower.includes("pip") || lower.includes("picture in picture mode")) {
    //   try {
    //     if (document.pictureInPictureElement) {
    //       document.exitPictureInPicture();
    //     } else if (video.requestPictureInPicture) {
    //       video.requestPictureInPicture();
    //     }
    //   } catch (err) {
    //     console.error("PIP error:", err);
    //   }
    //   return;
    // }

// SEEK: forward / backward (supports "forward 10", "forward ten seconds", "forward")
if (lower.includes("forward") || lower.includes("skip forward")) {
  const sec = extractSeconds(lower) ?? (() => {
    const m = lower.match(/forward\s+([a-z0-9\s-]+)\s*(?:seconds?|secs?)?/);
    if (m && m[1]) return wordsToNumber(m[1].trim());
    return null;
  })();
  const jump = sec ?? 10;
  video.currentTime = Math.min((video.currentTime || 0) + jump, video.duration || Infinity);
  return;
}
if (lower.includes("backward") || lower.includes("skip back") || lower.includes("rewind")) {
  const sec = extractSeconds(lower) ?? (() => {
    const m = lower.match(/backward\s+([a-z0-9\s-]+)\s*(?:seconds?|secs?)?/);
    if (m && m[1]) return wordsToNumber(m[1].trim());
    return null;
  })();
  const jump = sec ?? 10;
  video.currentTime = Math.max((video.currentTime || 0) - jump, 0);
  return;
}

// FULLSCREEN: try video element then parent, report errors to user
if (lower.includes("fullscreen") || lower.includes("full screen") || lower.includes("ful screen")) {
  try {
    if (video.requestFullscreen) await video.requestFullscreen();
    else if (video.parentElement && video.parentElement.requestFullscreen) await video.parentElement.requestFullscreen();
    else {
      setStatusMessage("Fullscreen not supported in this browser");
      setTimeout(()=>setStatusMessage(""), 2500);
    }
  } catch (err) {
    console.error("Fullscreen error:", err);
    setStatusMessage("Cannot enter fullscreen (blocked by browser)");
    setTimeout(()=>setStatusMessage(""), 3000);
  }
  return;
}
if (lower.includes("exit fullscreen") || lower.includes("leave fullscreen")) {
  try {
    if (document.exitFullscreen) await document.exitFullscreen();
  } catch (err) {
    console.error("Exit fullscreen error:", err);
    setStatusMessage("Cannot exit fullscreen");
    setTimeout(()=>setStatusMessage(""), 2500);
  }
  return;
}

// PICTURE-IN-PICTURE
if (lower.includes("picture in picture") || lower.includes("pip")) {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (video.requestPictureInPicture) {
      await video.requestPictureInPicture();
    } else {
      setStatusMessage("Picture-in-Picture not supported");
      setTimeout(()=>setStatusMessage(""), 2500);
    }
  } catch (err) {
    console.error("PIP error:", err);
    setStatusMessage("PIP blocked or unavailable");
    setTimeout(()=>setStatusMessage(""), 3000);
  }
  return;
}

// toggle subscribe: ensure channelId available

if (lower.includes("toggle subscribe") || lower.includes("toggle subscription") || lower.includes("subscribe toggle")) {
  if (!channelId) {
    setStatusMessage("Channel not ready yet");
    setTimeout(()=>setStatusMessage(""), 2500);
    return;
  }
  if (isToggling) {
    setStatusMessage("Please wait...");
    setTimeout(()=>setStatusMessage(""), 1800);
    return;
  }

  setIsToggling(true);
  setStatusMessage("Toggling subscription...");
  try {
    const res = await axios.post(`/api/v1/subs/${channelId}/subscribe`, {}, { withCredentials: true });
    // Use server truth rather than flipping locally
    if (res.data?.subscribed !== undefined) setSubscribe(!!res.data.subscribed);
    if (typeof res.data?.count === 'number') setCount(res.data.count);

    setStatusMessage(res.data?.subscribed ? "Subscribed ✅" : "Unsubscribed ❌");
    setTimeout(()=>setStatusMessage(""), 2000);
  } catch (err) {
    console.error("subscribe error:", err?.response?.data || err?.message);
    setStatusMessage("Subscribe failed");
    setTimeout(()=>setStatusMessage(""), 2000);
    if (err.response?.status === 401) navigate('/login');
  } finally {
    setIsToggling(false);
  }
  return;
}

// voice -> toggle like
if ( lower.includes("thumbs up") || lower.includes("unlike") || lower.includes("toggle thumbs") ) {
  if (isLiking) {
    setStatusMessage("Please wait...");
    setTimeout(()=>setStatusMessage(""), 1500);
    return;
  }
  setStatusMessage("Toggling like...");
  const result = await handleLikeVideo();
  if (!result) {
    setStatusMessage("Like failed");
    setTimeout(()=>setStatusMessage(""), 1500);
    return;
  }
  setStatusMessage(result.liked ? "Liked 👍" : "Unliked");
  setTimeout(()=>setStatusMessage(""), 1800);
  return;
}






    // Play / Pause / Resume
    if (lower.includes("play")) {
      video.play().catch(() => {});
      return;
    }
    if (lower.includes("pause") || lower.includes("stop")) {
      video.pause();
      return;
    }
    if (lower.includes("resume")) {
      video.play().catch(() => {});
      return;
    }

    // create message -> open a short local recognizer to capture comment then post
    if (lower.includes("create message")) {
      setStatusMessage("🎤 Speak your message (10s)...");
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setStatusMessage("Speech Recognition not supported in this browser.");
        setTimeout(() => setStatusMessage(""), 4000);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = async (event) => {
        let spokenText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            spokenText += event.results[i][0].transcript;
          }
        }
        if (spokenText.trim()) {
          await handleSendMessage(spokenText);
          setStatusMessage("✅ Message sent!");
          setTimeout(() => setStatusMessage(""), 3000);
        } else {
          setStatusMessage("No message detected");
          setTimeout(() => setStatusMessage(""), 2000);
        }
      };

      recognition.onend = () => {
        // clear indicator if necessary
      };
      recognition.onerror = () => {
        setStatusMessage("Error listening for message");
        setTimeout(() => setStatusMessage(""), 2000);
      };

      recognition.start();
      setTimeout(() => recognition.stop(), 10000); // stop after 10s
      return;
    }

    // open/close comments UI
    if (lower.includes("open message") || lower.includes("show message") || lower.includes("open comments")) {
      setShowCommentsModal(true);
      setStatusMessage("💬 Comments opened");
      setTimeout(() => setStatusMessage(""), 2500);
      return;
    }
    if (lower.includes("close message") || lower.includes("hide message") || lower.includes("close comments")) {
      setShowCommentsModal(false);
      setStatusMessage("❌ Comments closed");
      setTimeout(() => setStatusMessage(""), 2000);
      return;
    }

    // toggle subscribe
    // if (lower.includes("toggle subscribe")) {
    //   handleSubscribe();
    //   return;
    // }

    // If nothing matched
    setStatusMessage("⚠️ Please speak clearly. Command not recognized.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // === Listen for global voice events sent by Navbar ===
  useEffect(() => {
    const onVoiceCommand = (e) => {
      const payload = e?.detail ?? e; // either string or object
      const text = typeof payload === 'string' ? payload : (payload.text || payload.transcript || payload);
      handleVoiceCommand(text);
    };
    const onPlayIndex = (e) => {
      const idx = e?.detail?.index ?? e?.detail;
      if (!idx) return;
      // Navbar gives 1-based index -> convert to 0-based
      const zeroBased = Number(idx) - 1;
      if (Number.isInteger(zeroBased) && zeroBased >= 0 && zeroBased < recommended.length) {
        const target = recommended[zeroBased];
        if (target) {
          setStatusMessage(`Opening "${target.title}"`);
          navigate(`/watch/${target._id}`);
        }
      } else {
        setStatusMessage("Index out of range");
        setTimeout(() => setStatusMessage(""), 2000);
      }
    };

    window.addEventListener('voice-command', onVoiceCommand);
    window.addEventListener('play-index', onPlayIndex);
    return () => {
      window.removeEventListener('voice-command', onVoiceCommand);
      window.removeEventListener('play-index', onPlayIndex);
    };
  }, [recommended, videoRef.current, channelId, subscribe, count]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!videoData) return <div>No video data</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 pt-6">
      <div className="lg:w-2/3">
        <div className="relative w-full aspect-video bg-black">
          <video ref={videoRef} className="w-full h-full" controls autoPlay muted playsInline>
            <source src={videoData.videoFile} type="video/mp4" />
          </video>
        </div>

        <h1 className="mt-4 mb-2 text-xl font-semibold">{videoData.title}</h1>

        <div className="border-b border-gray-200 pb-3">
          {userData ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <img src={userData.avatar} className="w-12 h-12 rounded-full" alt="User" />
                <div>
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-gray-500"> {count} Subscribers</p>
                </div>

                {/* note: mic removed from video; Navbar mic now dispatches commands */}

                <div className="relative inline-block ml-auto lg:ml-8">
                  {statusMessage && (
                    <div className="absolute -top-12 lg:left-1/2 lg:-translate-x-1/2 right-0 sm:right-0 sm:-translate-x-full min-w-[200px] max-w-[300px] px-4 py-2 bg-red-600 text-white text-sm rounded-lg shadow-lg text-center">
                      {statusMessage}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLikeVideo}
                  className={`px-3 py-2 rounded-md text-white ${videoLiked ? 'bg-green-600' : 'bg-gray-600'}`}
                >
                  👍 {videoLikes}
                </button>
                <button onClick={handleSubscribe } className="bg-red-600 text-white px-4 py-1 rounded-md">{subscribe?"Subscribed":"Subscribe"}</button>
              </div>
            </div>
          ) : <p>Loading user...</p>}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mt-3 text-sm">
          <div className="flex gap-6 text-gray-700">
            <span>👁 {videoData.views} views</span>
            <span>📅 {formatDate(videoData.createdAt)}</span>
          </div>
          <p className="mt-2">
            {showFullDesc
              ? videoData.description
              : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
          </p>
          {videoData.description?.length > 150 && (
            <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 text-sm">
              {showFullDesc ? 'See less' : 'See more'}
            </button>
          )}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-3">Comments</h2>
          <div className="lg:hidden">
            <div
              onClick={() => setShowCommentsModal(true)}
              className="bg-gray-100 p-3 rounded-lg cursor-pointer"
            >
              💬 View all {messages.length} comments
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
                placeholder="Add a comment..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Send
              </button>
            </div>

            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={msg.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <span className="font-medium">{msg.author?.name || "Anon"}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
                        👍 {msg.likes?.length || 0}
                      </button>
                      <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/3 space-y-4">
        <h2 className="font-semibold text-lg">Recommended</h2>
        {recommended.length > 0 ? (
          recommended.map((vid, idx) => (
            <Link
              key={vid._id}
              to={`/watch/${vid._id}`}
              className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg items-center"
            >
              <div className="relative w-40 h-24 flex-shrink-0">
                <img
                  src={vid.thumbnail}
                  className="w-full h-full object-cover rounded-lg"
                  alt={vid.title}
                />
                <div
                  className={`absolute -left-3 top-1/2 transform -translate-y-1/2
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md border
                    ${id === vid._id ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-800 border-gray-200'}`}
                  style={{ zIndex: 5 }}
                >
                  {idx + 1}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{vid.title}</h3>
                <p className="text-xs text-gray-600">{vid.owner?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{vid.views} views</p>
              </div>
            </Link>
          ))
        ) : <p>No recommended videos</p>}
      </div>

      {showCommentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end">
          <div className="bg-white w-full h-2/3 rounded-t-2xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Comments</h3>
              <button onClick={() => setShowCommentsModal(false)}>✖</button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
                placeholder="Add a comment..."
              />
              <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Send
              </button>
            </div>

            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium">{msg.user?.name || 'Anon'}</p>
                  <p>{msg.content}</p>
                  <div className="flex gap-4 text-sm mt-1">
                    <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">
                      👍 {msg.likes?.length || 0}
                    </button>
                    <button onClick={() => deleteMessage(msg._id)} className="text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Video;

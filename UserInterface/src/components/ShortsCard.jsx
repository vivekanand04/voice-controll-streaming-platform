// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_SHORTS_API_URL ?? 'http://localhost:8081';

// const formatNumber = (value) => {
//   if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
//   if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
//   return value.toString();
// };

// function ShortsCard({ short, isActive, onLike, onComment, onShare, currentUserId, onSubscribe, isMuted, onToggleMute }) {
//   const videoRef = useRef(null);
//   const [playing, setPlaying] = useState(false);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (isActive) {
//       video.muted = isMuted;
//       video.play().catch(() => {
//         // Autoplay may be blocked in some browsers, keep muted to improve chance of success
//         video.muted = true;
//         video.play().catch(() => null);
//       });
//       setPlaying(true);
//     } else {
//       video.pause();
//       setPlaying(false);
//     }

//     return () => {
//       if (video && !isActive) video.pause();
//     };
//   }, [isActive, isMuted]);

//   useEffect(() => {
//     const onPauseEvent = () => {
//       if (videoRef.current && isActive) {
//         videoRef.current.pause();
//         setPlaying(false);
//       }
//     };
//     const onPlayEvent = () => {
//       if (videoRef.current && isActive) {
//         videoRef.current.play().catch(() => null);
//         setPlaying(true);
//       }
//     };

//     window.addEventListener('shorts-pause', onPauseEvent);
//     window.addEventListener('shorts-play', onPlayEvent);

//     return () => {
//       window.removeEventListener('shorts-pause', onPauseEvent);
//       window.removeEventListener('shorts-play', onPlayEvent);
//     };
//   }, [isActive]);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const handleLike = async () => {
//     try {
//       await axios.post(`${API_BASE}/api/shorts/${short.id}/like`, null, {
//         headers: {
//           ...getAuthHeaders(),
//         },
//       });
//       if (onLike) onLike(short.id);
//     } catch (err) {
//       console.error('Like failed', err);
//       alert('Please login to like shorts.');
//     }
//   };

//   const handleComment = async () => {
//     const commentText = window.prompt('Add a comment for this short:');
//     if (!commentText) return;
//     try {
//       await axios.post(`${API_BASE}/api/shorts/${short.id}/comment`, { comment: commentText }, {
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders(),
//         },
//       });
//       if (onComment) onComment(short.id);
//     } catch (err) {
//       console.error('Comment failed', err);
//       alert('Comment failed. Please login or try again.');
//     }
//   };

//   const handleShare = async () => {
//     const shareUrl = `${window.location.origin}/shorts?shared=${short.id}`;
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       if (onShare) onShare(short.id);
//       alert('Shorts link copied to clipboard');
//     } catch (err) {
//       console.error('Share failed', err);
//       alert(shareUrl);
//     }
//   };

//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-black text-white">
//       <div className="absolute inset-0 bg-black opacity-70" aria-hidden="true" />
//       <video
//         ref={videoRef}
//         className="h-full w-full object-cover"
//         src={short.videoUrl}
//         poster={short.thumbnailUrl}
//         loop
//         playsInline
//         muted={isMuted}
//         controls={false}
//       />

//       <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
//         <div className="mb-4 space-y-2">
//           <div className="text-sm font-semibold uppercase tracking-widest text-gray-300">Shorts</div>
//           <h1 className="text-xl font-bold text-white">{short.title}</h1>
//           <p className="text-sm text-gray-200 max-w-xl line-clamp-2">{short.description}</p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
//           <span>{formatNumber(short.views)} views</span>
//           <span>{formatNumber(short.likes)} likes</span>
//           <span>{formatNumber(short.commentsCount)} comments</span>
//           <span>{Math.round(short.duration || 0)}s</span>
//         </div>

//         <div className="mt-4 grid grid-cols-4 gap-2">
//           <button className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/20" onClick={handleLike}>
//             Like
//           </button>
//           <button className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/20" onClick={handleComment}>
//             Comment
//           </button>
//           <button className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/20" onClick={handleShare}>
//             Share
//           </button>
//           <button className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/20" onClick={onToggleMute}>
//             {isMuted ? 'Unmute' : 'Mute'}
//           </button>
//         </div>

//         <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-200">
//           <span className="rounded-full bg-white/10 px-2 py-1">{short.uploadedBy}</span>
//           {short.tags?.slice(0, 4).map((tag) => (
//             <span key={tag} className="rounded-full bg-white/10 px-2 py-1">#{tag}</span>
//           ))}
//         </div>

//         {currentUserId && short.uploaderId !== currentUserId && (
//           <button
//             onClick={() => onSubscribe(short.uploaderId)}
//             className="mt-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
//           >
//             Subscribe creator
//           </button>
//         )}
//       </div>

//       <div className="absolute top-4 right-4 rounded-full bg-black/60 p-3 text-xs uppercase tracking-[0.18em] text-white">
//         {isActive ? 'Active' : 'Paused'}
//       </div>
//     </div>
//   );
// }

// export default ShortsCard;

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import ShortsCard from './ShortsCard';
// import api from '../apiClient';

// const API_BASE = import.meta.env.VITE_SHORTS_API_URL ?? 'http://localhost:8081';
// const PAGE_SIZE = 5;

// const parseVoiceCommand = (command, state) => {
//   const text = command.toLowerCase();
//   if (text.includes('next short') || text.includes('swipe up') || text.includes('next')) return 'next';
//   if (text.includes('previous short') || text.includes('swipe down') || text.includes('previous')) return 'prev';
//   if (text.includes('pause short') || text.includes('pause')) return 'pause';
//   if (text.includes('play short') || text.includes('play')) return 'play';
//   if (text.includes('mute short') || text.includes('mute')) return 'mute';
//   if (text.includes('unmute short') || text.includes('unmute')) return 'unmute';
//   if (text.includes('like this short') || text.includes('like short') || text.includes('like this')) return 'like';
//   if (text.includes('comment')) return 'comment';
//   if (text.includes('subscribe creator')) return 'subscribe';
//   if (text.includes('share')) return 'share';
//   return null;
// };

// function ShortsFeed() {
//   const [shorts, setShorts] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [muted, setMuted] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const touchStartRef = useRef(null);

//   const currentShort = useMemo(() => shorts[activeIndex] || null, [shorts, activeIndex]);

//   const fetchShorts = useCallback(async (pageToLoad = 1) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get(`${API_BASE}/api/shorts/feed?page=${pageToLoad}&size=${PAGE_SIZE}`);
//       if (res?.data?.data) {
//         setShorts((prev) => (pageToLoad === 1 ? res.data.data : [...prev, ...res.data.data]));
//       }
//     } catch (err) {
//       console.error('Failed to load shorts', err);
//       setError('Unable to load shorts feed');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const loadMoreIfNeeded = useCallback(() => {
//     if (shorts.length - activeIndex <= 2 && !loading) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   }, [activeIndex, loading, shorts.length]);

//   useEffect(() => {
//     fetchShorts(1);
//   }, [fetchShorts]);

//   useEffect(() => {
//     if (page > 1) fetchShorts(page);
//   }, [page, fetchShorts]);

//   useEffect(() => {
//     loadMoreIfNeeded();
//   }, [activeIndex, loadMoreIfNeeded]);

//   useEffect(() => {
//     try {
//       const saved = window.localStorage.getItem('userId');
//       if (saved) setCurrentUserId(saved);
//     } catch (ignored) {
//       setCurrentUserId(null);
//     }
//   }, []);

//   const goNext = useCallback(() => {
//     setActiveIndex((idx) => Math.min(shorts.length - 1, idx + 1));
//   }, [shorts.length]);

//   const goPrevious = useCallback(() => {
//     setActiveIndex((idx) => Math.max(0, idx - 1));
//   }, []);

//   const handleVoiceCommand = useCallback(async (event) => {
//     const detail = event?.detail || '';
//     const command = typeof detail === 'string' ? detail : String(detail);
//     const action = parseVoiceCommand(command);
//     if (!action) return;

//     if (!currentShort) return;
//     switch (action) {
//       case 'next':
//         goNext();
//         break;
//       case 'prev':
//         goPrevious();
//         break;
//       case 'pause':
//         window.dispatchEvent(new CustomEvent('shorts-pause', { detail: {} }));
//         break;
//       case 'play':
//         window.dispatchEvent(new CustomEvent('shorts-play', { detail: {} }));
//         break;
//       case 'mute':
//         setMuted(true);
//         break;
//       case 'unmute':
//         setMuted(false);
//         break;
//       case 'like':
//         await api.post(`${API_BASE}/api/shorts/${currentShort.id}/like`).catch(() => null);
//         fetchShorts(1);
//         break;
//       case 'comment':
//         const commentText = window.prompt('Add a comment to this short:');
//         if (commentText) {
//           await api.post(`${API_BASE}/api/shorts/${currentShort.id}/comment`, { comment: commentText }).catch(() => null);
//           fetchShorts(1);
//         }
//         break;
//       case 'subscribe':
//         if (currentShort?.uploaderId) {
//           await api.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/subs/${currentShort.uploaderId}/subscribe`).catch(() => null);
//           alert('Subscription request sent.');
//         }
//         break;
//       case 'share':
//         const shareUrl = `${window.location.origin}/shorts?shared=${currentShort.id}`;
//         await navigator.clipboard.writeText(shareUrl).catch(() => null);
//         alert('Share link copied.');
//         break;
//       default:
//         break;
//     }
//   }, [currentShort, fetchShorts, goNext, goPrevious]);

//   useEffect(() => {
//     window.addEventListener('voice-command', handleVoiceCommand);
//     return () => window.removeEventListener('voice-command', handleVoiceCommand);
//   }, [handleVoiceCommand]);

//   const handleLikeUpdate = (id) => {
//     setShorts((prev) => prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item)));
//   };

//   const handleCommentUpdate = (id) => {
//     setShorts((prev) => prev.map((item) => (item.id === id ? { ...item, commentsCount: item.commentsCount + 1 } : item)));
//   };

//   const handleSubscribe = async (uploaderId) => {
//     if (!uploaderId) return;
//     try {
//       await api.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/subs/${uploaderId}/subscribe`);
//       alert('Subscribed to creator');
//     } catch (err) {
//       console.error(err);
//       alert('Unable to subscribe');
//     }
//   };

//   const handleTouchStart = (event) => {
//     touchStartRef.current = event.touches[0].clientY;
//   };
//   const handleTouchEnd = (event) => {
//     if (touchStartRef.current === null) return;
//     const delta = touchStartRef.current - event.changedTouches[0].clientY;
//     const threshold = 50;
//     if (delta > threshold) {
//       goNext();
//     } else if (delta < -threshold) {
//       goPrevious();
//     }
//     touchStartRef.current = null;
//   };

//   if (error) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
//         <div className="text-center px-4">
//           <h2 className="text-2xl font-bold">Unable to load Shorts.</h2>
//           <p className="mt-2 text-gray-300">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <div className="sticky top-0 z-20 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <h1 className="text-xl font-semibold">Shorts</h1>
//             <p className="text-sm text-gray-400">Swipe up/down or use voice commands to navigate.</p>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-gray-300">
//             <span>Autoplay</span>
//             <button onClick={() => setMuted((prev) => !prev)} className="rounded-full border border-white/10 px-3 py-1 hover:bg-white/10">
//               {muted ? 'Unmute' : 'Mute'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className="relative h-[calc(100vh-72px)]"
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//       >
//         {loading && shorts.length === 0 && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-white">Loading shorts...</div>
//           </div>
//         )}

//         {shorts.map((short, index) => (
//           <div
//             key={short.id}
//             className={`absolute inset-0 transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
//           >
//             <ShortsCard
//               short={short}
//               isActive={index === activeIndex}
//               onLike={handleLikeUpdate}
//               onComment={handleCommentUpdate}
//               onShare={() => null}
//               currentUserId={currentUserId}
//               onSubscribe={handleSubscribe}
//               isMuted={muted}
//               onToggleMute={() => setMuted((prev) => !prev)}
//             />
//           </div>
//         ))}

//         <div className="pointer-events-none absolute inset-x-0 top-1/2 flex items-center justify-between px-4">
//           <button
//             onClick={goPrevious}
//             className="pointer-events-auto rounded-full bg-black/70 p-3 text-white shadow-lg transition hover:bg-black"
//             aria-label="Previous short"
//           >
//             ↑
//           </button>
//           <button
//             onClick={goNext}
//             className="pointer-events-auto rounded-full bg-black/70 p-3 text-white shadow-lg transition hover:bg-black"
//             aria-label="Next short"
//           >
//             ↓
//           </button>
//         </div>
//       </div>

//       <div className="sticky bottom-0 z-20 border-t border-white/10 bg-black/90 px-4 py-3 text-xs text-gray-400">
//         {currentShort ? (
//           <span>Showing {activeIndex + 1} of {shorts.length} — {currentShort.title}</span>
//         ) : (
//           <span>Ready for Shorts.</span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ShortsFeed;

// import axios from 'axios';
// import React, { useEffect, useRef, useState } from 'react';

// const API_BASE = import.meta.env.VITE_SHORTS_API_URL ?? 'http://localhost:8081';
// const MAX_DURATION = Number(import.meta.env.VITE_SHORTS_MAX_DURATION ?? '60');
// const ALLOWED_TYPES = ['video/mp4', 'video/webm'];

// function ShortsUpload({ onUploadSuccess }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [thumbnail, setThumbnail] = useState(null);
//   const [videoFile, setVideoFile] = useState(null);
//   const [tags, setTags] = useState('');
//   const [duration, setDuration] = useState(null);
//   const [isVertical, setIsVertical] = useState(false);
//   const [validationError, setValidationError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const videoProbeRef = useRef(null);

//   useEffect(() => {
//     if (videoFile) {
//       const objectUrl = URL.createObjectURL(videoFile);
//       const videoElement = document.createElement('video');
//       videoElement.preload = 'metadata';
//       videoElement.src = objectUrl;
//       videoElement.onloadedmetadata = () => {
//         URL.revokeObjectURL(objectUrl);
//         const videoDuration = videoElement.duration;
//         const width = videoElement.videoWidth;
//         const height = videoElement.videoHeight;
//         const vertical = height > width;
//         setDuration(videoDuration);
//         setIsVertical(vertical);
//         if (videoDuration > MAX_DURATION) {
//           setValidationError(`Shorts may be at most ${MAX_DURATION} seconds.`);
//         } else if (!vertical) {
//           setValidationError('Shorts must be vertical video (portrait orientation).');
//         } else {
//           setValidationError('');
//         }
//       };
//       videoElement.onerror = () => {
//         setValidationError('Unable to read video metadata. Please choose a valid MP4/WebM file.');
//         URL.revokeObjectURL(objectUrl);
//       };
//     }
//   }, [videoFile]);

//   const handleThumbnailChange = (e) => {
//     setThumbnail(e.target.files[0]);
//   };

//   const handleVideoFileChange = (e) => {
//     const file = e.target.files[0];
//     setVideoFile(file);
//     if (file && !ALLOWED_TYPES.includes(file.type)) {
//       setValidationError('Only MP4 and WebM files are accepted for shorts.');
//     } else {
//       setValidationError('');
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!title || !description || !thumbnail || !videoFile) {
//       setValidationError('All fields are required for shorts upload.');
//       return;
//     }
//     if (!ALLOWED_TYPES.includes(videoFile.type)) {
//       setValidationError('Only MP4 and WebM files are accepted for shorts.');
//       return;
//     }
//     if (!isVertical) {
//       setValidationError('Shorts must be recorded in portrait orientation.');
//       return;
//     }
//     if (duration > MAX_DURATION) {
//       setValidationError(`Shorts duration must be ${MAX_DURATION} seconds or less.`);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('thumbnail', thumbnail);
//     formData.append('videoFile', videoFile);
//     formData.append('duration', duration);
//     formData.append('isVertical', isVertical);
//     formData.append('tags', tags);
//     formData.append('durationValidation', duration);

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(`${API_BASE}/api/shorts/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         withCredentials: true,
//       });
//       alert('Short uploaded successfully');
//       setLoading(false);
//       setTitle('');
//       setDescription('');
//       setThumbnail(null);
//       setVideoFile(null);
//       setTags('');
//       setDuration(null);
//       setIsVertical(false);
//       if (onUploadSuccess) onUploadSuccess(res.data);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//       setValidationError(err?.response?.data?.message || 'Short upload failed.');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
//             placeholder="Enter short title"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
//           <input
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
//             placeholder="comma separated tags"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           rows={4}
//           className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
//           placeholder="Enter short description"
//           required
//         />
//       </div>

//       <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">Thumbnail</label>
//           <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full" required />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-900">Short video</label>
//           <input type="file" accept="video/mp4,video/webm" onChange={handleVideoFileChange} className="w-full" required />
//           {duration != null && (
//             <div className="mt-2 text-sm text-gray-600">Duration: {Math.round(duration)} seconds</div>
//           )}
//           <div className="mt-1 text-sm text-gray-500">Max {MAX_DURATION}s, portrait only.</div>
//         </div>
//       </div>

//       {validationError && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{validationError}</div>}

//       <button
//         type="button"
//         onClick={handleSubmit}
//         disabled={loading}
//         className="inline-flex items-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {loading ? 'Uploading...' : 'Upload Short'}
//       </button>
//     </div>
//   );
// }

// export default ShortsUpload;

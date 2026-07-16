import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const API_BASE = import.meta.env.VITE_SHORTS_API_URL ?? 'http://localhost:8081';
const MAX_DURATION = Number(import.meta.env.VITE_SHORTS_MAX_DURATION ?? '60');
const ALLOWED_TYPES = ['video/mp4', 'video/webm'];

function ShortsUpload({ onUploadSuccess }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [tags, setTags] = useState('');
  const [duration, setDuration] = useState(null);
  const [isVertical, setIsVertical] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videoFile) {
      setDuration(null);
      setIsVertical(false);
      return;
    }

    const objectUrl = URL.createObjectURL(videoFile);
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.src = objectUrl;

    const handleLoadedMetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const videoDuration = videoElement.duration;
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      const vertical = height > width;
      setDuration(videoDuration);
      setIsVertical(vertical);

      if (videoDuration > MAX_DURATION) {
        setValidationError(`Shorts may be at most ${MAX_DURATION} seconds.`);
      } else if (!vertical) {
        setValidationError('Shorts must be vertical video (portrait orientation).');
      } else {
        setValidationError('');
      }
    };

    const handleError = () => {
      setValidationError('Unable to read video metadata. Please choose a valid MP4 or WebM file.');
      URL.revokeObjectURL(objectUrl);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile]);

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files?.[0] || null);
  };

  const handleVideoFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setVideoFile(file);
    if (file && !ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Only MP4 and WebM files are accepted for shorts.');
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !thumbnail || !videoFile) {
      setValidationError('All fields are required for shorts upload.');
      return;
    }

    if (!ALLOWED_TYPES.includes(videoFile.type)) {
      setValidationError('Only MP4 and WebM files are accepted for shorts.');
      return;
    }

    if (duration > MAX_DURATION) {
      setValidationError(`Shorts duration must be ${MAX_DURATION} seconds or less.`);
      return;
    }

    if (!isVertical) {
      setValidationError('Shorts must be vertical video (portrait orientation).');
      return;
    }

    // Get JWT token from Redux store
    if (!accessToken) {
      setValidationError('Authentication required. Please log in first.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('tags', tags.trim() || '');
    formData.append('duration', String(duration));
    formData.append('isVertical', String(isVertical));
    formData.append('thumbnail', thumbnail);
    formData.append('videoFile', videoFile);

    // Log the request details for debugging
    console.log('=== SHORTS UPLOAD REQUEST DEBUG ===');
    console.log('URL:', `${API_BASE}/api/shorts/upload`);
    console.log('Method: POST');
    console.log('FormData entries:', {
      title: title.trim(),
      description: description.trim(),
      tags: tags.trim() || '',
      duration: String(duration),
      isVertical: String(isVertical),
      thumbnail_file: thumbnail?.name,
      thumbnail_type: thumbnail?.type,
      thumbnail_size: thumbnail?.size,
      videoFile_name: videoFile?.name,
      videoFile_type: videoFile?.type,
      videoFile_size: videoFile?.size,
    });
    console.log('WithCredentials: true');
    console.log('Authorization: Bearer [token]');
    console.log('====================================');

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/shorts/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        timeout: 30000,
      });

      console.log('Upload success:', response.data);
      alert('Short uploaded successfully');
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      setTitle('');
      setDescription('');
      setThumbnail(null);
      setVideoFile(null);
      setTags('');
      setDuration(null);
      setIsVertical(false);
      setValidationError('');
    } catch (error) {
      console.error('=== SHORTS UPLOAD ERROR DEBUG ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Status text:', error.response?.statusText);
      console.error('Response data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Request headers:', error.config?.headers);
      console.error('Full error:', error);
      console.error('==================================');

      let errorMsg = 'Short upload failed.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Network Error: Cannot reach the shorts service. Ensure the Java Shorts microservice is running on http://localhost:8081';
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout. The server took too long to respond.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Unauthorized. Please log in again.';
      } else if (error.response) {
        errorMsg = error.response.data?.message || `Server error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMsg = 'No response from server. Please ensure the shorts service is running.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setValidationError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter short title"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Comma separated tags"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter short description"
          required
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Short video</label>
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleVideoFileChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
            required
          />
          {duration != null && (
            <div className="mt-2 text-sm text-gray-600">Duration: {Math.round(duration)} seconds</div>
          )}
          <div className="mt-1 text-sm text-gray-500">Max {MAX_DURATION}s, portrait only.</div>
        </div>
      </div>

      {validationError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{validationError}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Uploading...' : 'Upload Short'}
      </button>
    </form>
  );
}

export default ShortsUpload;

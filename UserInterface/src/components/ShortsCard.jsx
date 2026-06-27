import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiPause,
  FiPlay,
  FiSend,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";

const formatNumber = (value = 0) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
};

const formatTimeAgo = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const resolveMediaUrl = (url, apiBase) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const getInitial = (name = "Creator") => name.trim().charAt(0).toUpperCase() || "C";

const getCommentName = (comment) =>
  comment.commenterName ||
  comment.username ||
  comment.userName ||
  comment.author?.name ||
  comment.author?.username ||
  comment.user?.name ||
  comment.user?.username ||
  "Creator";

const getCommentText = (comment) => comment.comment || comment.text || comment.content || "";

const getCommentLikes = (comment) => comment.likes ?? comment.likeCount ?? comment.likesCount ?? 0;

const getCommentAvatar = (comment) =>
  comment.avatar ||
  comment.commenterAvatar ||
  comment.profilePicture ||
  comment.author?.avatar ||
  comment.author?.profilePicture ||
  comment.user?.avatar ||
  comment.user?.profilePicture ||
  "";

function CommentsDrawer({ short, comments = [], localComments = [], loading, error, onRetry, onClose, onAddComment }) {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const visibleComments = useMemo(() => {
    const loadedTexts = new Set(
      comments.map((comment) => getCommentText(comment).trim().toLowerCase()).filter(Boolean)
    );
    const pendingLocal = localComments.filter((comment) => {
      const text = getCommentText(comment).trim().toLowerCase();
      return text && !loadedTexts.has(text);
    });
    const seen = new Set();
    return [...pendingLocal, ...comments].filter((comment, index) => {
      const text = getCommentText(comment).trim().toLowerCase();
      const key =
        comment.id ||
        comment._id ||
        (text ? `text:${text}` : `${getCommentName(comment)}-${comment.createdAt || index}`);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [comments, localComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await onAddComment(commentText);
      setCommentText("");
    } catch (err) {
      setSubmitError("Unable to add comment. Please sign in and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-end bg-black/50 lg:absolute lg:inset-auto lg:bottom-[5px] lg:right-[84px] lg:top-[5px] lg:w-[480px] lg:items-stretch lg:bg-transparent lg:pointer-events-none xl:w-[552px]">
      <button type="button" className="absolute inset-0 cursor-default lg:hidden" aria-label="Close comments" onClick={onClose} />
      <section className="relative flex max-h-[78vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white text-gray-950 shadow-2xl lg:pointer-events-auto lg:h-full lg:max-h-none lg:w-full lg:rounded-lg lg:border lg:border-gray-200">
        <div className="flex flex-none items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Comments</h2>
            <p className="text-xs text-gray-500">{formatNumber(short.commentsCount)} total</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-gray-100"
            aria-label="Close comments"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex animate-pulse gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-sm text-gray-600">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Retry
              </button>
            </div>
          ) : visibleComments.length > 0 ? (
            <div className="space-y-5">
              {visibleComments.map((comment, index) => {
                const name = getCommentName(comment);
                const avatar = getCommentAvatar(comment);
                const likeCount = getCommentLikes(comment);
                const commentKey = comment.id || comment._id || `${name}-${comment.createdAt || index}`;

                return (
                  <article key={commentKey} className="flex gap-3">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="h-9 w-9 flex-none rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {getInitial(name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-gray-950">@{name}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="mt-1 break-words text-sm leading-5 text-gray-800">{getCommentText(comment)}</p>
                      {likeCount > 0 && (
                        <div className="mt-2 text-xs font-medium text-gray-500">{formatNumber(likeCount)} likes</div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
              {short.commentsCount > 0
                ? "Previous comments are not returned by the currently running comments API. New comments you add will appear here."
                : "No comments yet. Be the first to comment."}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-none border-t border-gray-200 bg-white p-3">
          {submitError && <div className="mb-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{submitError}</div>}
          <div className="flex items-center gap-2">
            <input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="Add a comment"
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="grid h-10 w-10 place-items-center rounded-full bg-gray-950 text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Post comment"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ShortsCard({
  short,
  isActive,
  isMuted,
  shouldLoad,
  onToggleMute,
  onLike,
  onOpenComments,
  apiBase,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playHintVisible, setPlayHintVisible] = useState(false);

  const videoUrl = useMemo(() => resolveMediaUrl(short.videoUrl, apiBase), [apiBase, short.videoUrl]);
  const thumbnailUrl = useMemo(() => resolveMediaUrl(short.thumbnailUrl, apiBase), [apiBase, short.thumbnailUrl]);
  const commentCount = short.commentsCount ?? 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted;
      video.play().then(() => setPlaying(true)).catch(() => {
        video.muted = true;
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      });
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [isActive, isMuted, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const updateProgress = () => {
      if (!video.duration) {
        setProgress(0);
        return;
      }
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [videoUrl]);

  useEffect(() => {
    const pauseVideo = () => {
      if (!isActive || !videoRef.current) return;
      videoRef.current.pause();
      setPlaying(false);
    };

    const playVideo = () => {
      if (!isActive || !videoRef.current) return;
      videoRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };

    window.addEventListener("shorts-pause", pauseVideo);
    window.addEventListener("shorts-play", playVideo);
    return () => {
      window.removeEventListener("shorts-pause", pauseVideo);
      window.removeEventListener("shorts-play", playVideo);
    };
  }, [isActive]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }

    setPlayHintVisible(true);
    window.setTimeout(() => setPlayHintVisible(false), 550);
  }, []);

  return (
    <article className="relative mx-auto flex h-full max-w-[420px] items-center justify-center overflow-hidden rounded-lg bg-black shadow-xl transition-transform duration-300 ease-out lg:max-w-[400px] xl:max-w-[460px]">
      <button
        type="button"
        onClick={togglePlayback}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label={playing ? "Pause short" : "Play short"}
      />

      {shouldLoad ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={videoUrl}
          poster={thumbnailUrl}
          playsInline
          muted={isMuted}
          loop
          preload={isActive ? "auto" : "metadata"}
        />
      ) : (
        <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

      {playHintVisible && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
          {playing ? <FiPause className="h-8 w-8" /> : <FiPlay className="h-8 w-8" />}
        </div>
      )}

      <div className="absolute left-0 right-0 top-0 z-20 h-1 bg-white/20">
        <div className="h-full bg-white transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="absolute bottom-0 left-0 right-[74px] z-20 p-4 pb-6 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white text-sm font-bold text-gray-950 ring-2 ring-white/60">
            {getInitial(short.uploadedBy)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">@{short.uploadedBy || "Creator"}</p>
            <p className="text-xs text-white/70">{formatTimeAgo(short.createdAt)}</p>
          </div>
        </div>

        <h1 className="line-clamp-2 text-base font-semibold">{short.title}</h1>
        <p className="mt-1 line-clamp-3 text-sm leading-5 text-white/85">{short.description}</p>
        {short.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
            {short.tags.slice(0, 4).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-7 right-3 z-30 flex w-14 flex-col items-center gap-4 sm:right-5">
        <button
          type="button"
          onClick={onLike}
          className="flex flex-col items-center gap-1 text-white"
          aria-label="Like short"
        >
          <span className={`grid h-12 w-12 place-items-center rounded-full bg-black/35 backdrop-blur ${short.viewerLiked ? "text-red-500" : ""}`}>
            <FiHeart className={`h-6 w-6 ${short.viewerLiked ? "fill-current" : ""}`} />
          </span>
          <span className="text-xs font-semibold">{formatNumber(short.likes)}</span>
        </button>

        <button
          type="button"
          onClick={onOpenComments}
          className="flex flex-col items-center gap-1 text-white"
          aria-label="Open comments"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black/35 backdrop-blur">
            <FiMessageCircle className="h-6 w-6" />
          </span>
          <span className="text-xs font-semibold">{formatNumber(commentCount)}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className="flex flex-col items-center gap-1 text-white"
          aria-label={isMuted ? "Unmute short" : "Mute short"}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black/35 backdrop-blur">
            {isMuted ? <FiVolumeX className="h-6 w-6" /> : <FiVolume2 className="h-6 w-6" />}
          </span>
          <span className="text-xs font-semibold">{isMuted ? "Muted" : "Sound"}</span>
        </button>
      </div>
    </article>
  );
}

const MemoizedShortsCard = memo(ShortsCard);
MemoizedShortsCard.CommentsDrawer = CommentsDrawer;

export default MemoizedShortsCard;

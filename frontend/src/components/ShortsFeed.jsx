import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ShortsCard from "./ShortsCard";
import useShortsVoiceCommands from "../hooks/useShortsVoiceCommands";
import useShortsAutoScroll from "../hooks/useShortsAutoScroll";

const API_BASE = (import.meta.env.VITE_SHORTS_API_URL ?? "http://localhost:8081").replace(/\/$/, "");
const APP_API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const PAGE_SIZE = 6;
const SHORTS_COMMENTS_STORAGE_KEY = "shorts:comments";
const SHORTS_LIKES_STORAGE_PREFIX = "shorts:liked";

const getPersistedAccessToken = () => {
  const directToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (directToken) return directToken;

  try {
    const persistedRoot = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const auth = JSON.parse(persistedRoot.auth || "{}");
    return auth.accessToken || null;
  } catch (err) {
    return null;
  }
};

const getAuthHeaders = (accessToken) => {
  const token = accessToken || getPersistedAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getShortId = (short) => short?.id ?? short?._id;

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(window.atob(padded));
  } catch (err) {
    return null;
  }
};

const getShortsLikesStorageKey = (user, accessToken) => {
  const token = accessToken || getPersistedAccessToken();
  const tokenPayload = decodeJwtPayload(token);
  const userId =
    user?._id ||
    user?.id ||
    user?.userId ||
    user?.email ||
    user?.username ||
    tokenPayload?.sub ||
    tokenPayload?._id ||
    tokenPayload?.id ||
    null;

  return userId ? `${SHORTS_LIKES_STORAGE_PREFIX}:${userId}` : null;
};

const readStoredLikedShortIds = (storageKey) => {
  if (!storageKey) return new Set();

  try {
    const storedValue = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(storedValue)) return new Set(storedValue.filter(Boolean));
    if (storedValue && typeof storedValue === "object") {
      return new Set(Object.keys(storedValue).filter((shortId) => storedValue[shortId]));
    }
  } catch (err) {
    // If stored data is malformed, ignore it and rebuild from future likes.
  }

  return new Set();
};

const writeStoredLikedShortIds = (storageKey, likedShortIds) => {
  if (!storageKey) return;

  try {
    localStorage.setItem(storageKey, JSON.stringify([...likedShortIds]));
  } catch (err) {
    // Local persistence is best effort; the backend like request remains authoritative for counts.
  }
};

const setStoredShortLike = (storageKey, shortId, liked) => {
  if (!storageKey || !shortId) return readStoredLikedShortIds(storageKey);

  const likedShortIds = readStoredLikedShortIds(storageKey);
  if (liked) likedShortIds.add(shortId);
  else likedShortIds.delete(shortId);
  writeStoredLikedShortIds(storageKey, likedShortIds);
  return likedShortIds;
};

const getServerViewerLiked = (short) =>
  Boolean(
    short?.viewerLiked ??
      short?.viewerHasLiked ??
      short?.likedByCurrentUser ??
      short?.liked
  );

const getResolvedViewerLiked = (short, likedShortIds) => {
  const shortId = getShortId(short);
  return Boolean(short?.viewerLikedFromServer || (shortId && likedShortIds.has(shortId)));
};

const normalizeShort = (short, likedShortIds = new Set()) => {
  const viewerLikedFromServer = getServerViewerLiked(short);
  const normalized = {
    ...short,
    views: short.views ?? 0,
    likes: short.likes ?? 0,
    commentsCount: short.commentsCount ?? 0,
    tags: Array.isArray(short.tags) ? short.tags : [],
    viewerLikedFromServer,
  };

  return {
    ...normalized,
    viewerLiked: getResolvedViewerLiked(normalized, likedShortIds),
  };
};

const readStoredComments = (shortId) => {
  try {
    const allComments = JSON.parse(localStorage.getItem(SHORTS_COMMENTS_STORAGE_KEY) || "{}");
    return Array.isArray(allComments[shortId]) ? allComments[shortId] : [];
  } catch (err) {
    return [];
  }
};

const writeStoredComment = (shortId, comment) => {
  try {
    const allComments = JSON.parse(localStorage.getItem(SHORTS_COMMENTS_STORAGE_KEY) || "{}");
    const previous = Array.isArray(allComments[shortId]) ? allComments[shortId] : [];
    allComments[shortId] = [comment, ...previous.filter((item) => item.id !== comment.id)];
    localStorage.setItem(SHORTS_COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
  } catch (err) {
    // Local persistence is best effort only; posting still succeeds without it.
  }
};

const removeStoredComment = (shortId, commentId) => {
  try {
    const allComments = JSON.parse(localStorage.getItem(SHORTS_COMMENTS_STORAGE_KEY) || "{}");
    const previous = Array.isArray(allComments[shortId]) ? allComments[shortId] : [];
    const next = previous.filter((item) => item.id !== commentId);
    if (next.length === 0) {
      delete allComments[shortId];
    } else {
      allComments[shortId] = next;
    }
    localStorage.setItem(SHORTS_COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
  } catch (err) {
    // Local persistence is best effort only.
  }
};

const getCommentContent = (comment) =>
  (comment?.comment || comment?.text || comment?.content || "").trim().toLowerCase();

const mergeCommentsList = (localComments, remoteComments) => {
  const remoteTexts = new Set(remoteComments.map(getCommentContent).filter(Boolean));
  const pendingLocal = localComments.filter((comment) => {
    const text = getCommentContent(comment);
    return text && !remoteTexts.has(text);
  });
  return [...remoteComments, ...pendingLocal];
};

const isUnavailableCommentsEndpoint = (err) => {
  const status = err?.response?.status;
  const message = err?.response?.data?.message || err?.response?.data || err?.message || "";
  return status === 404 || String(message).toLowerCase().includes("no static resource");
};

function ShortsFeed() {
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status);
  const requestedShortId = useMemo(
    () => new URLSearchParams(location.search).get("short"),
    [location.search]
  );
  const likedShortsStorageKey = useMemo(
    () => (authStatus || user ? getShortsLikesStorageKey(user, accessToken) : null),
    [accessToken, authStatus, user]
  );
  const [shorts, setShorts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(true);
  const [shortMuteOverrides, setShortMuteOverrides] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentsByShort, setCommentsByShort] = useState({});
  const [commentsLoadingByShort, setCommentsLoadingByShort] = useState({});
  const [commentsErrorByShort, setCommentsErrorByShort] = useState({});
  const [commentDrawerShort, setCommentDrawerShort] = useState(null);
  const [voiceCommentMessage, setVoiceCommentMessage] = useState("");
  const [voiceCommentRecording, setVoiceCommentRecording] = useState(false);
  const feedRef = useRef(null);
  const itemRefs = useRef(new Map());
  const observerRef = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const viewedRef = useRef(new Set());
  const voiceCommentRecognitionRef = useRef(null);
  const voiceCommentTimeoutRef = useRef(null);
  const voiceCommentTextRef = useRef("");
  const voiceCommentDeadlineRef = useRef(0);
  const voiceCommentFinalizingRef = useRef(false);

  const activeIndex = useMemo(
    () => shorts.findIndex((short) => getShortId(short) === activeId),
    [activeId, shorts]
  );

  useEffect(() => {
    const likedShortIds = readStoredLikedShortIds(likedShortsStorageKey);
    setShorts((previous) =>
      previous.map((short) => ({
        ...short,
        viewerLiked: getResolvedViewerLiked(short, likedShortIds),
      }))
    );
  }, [likedShortsStorageKey]);

  const loadShorts = useCallback(
    async (pageToLoad = 0) => {
      if (loadingRef.current || (!hasMoreRef.current && pageToLoad !== 0)) return;
      loadingRef.current = true;
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_BASE}/api/shorts/feed`, {
          params: { page: pageToLoad, size: PAGE_SIZE },
          withCredentials: true,
        });
        const likedShortIds = readStoredLikedShortIds(likedShortsStorageKey);
        let nextShorts = (response.data?.data || []).map((short) =>
          normalizeShort(short, likedShortIds)
        );

        if (pageToLoad === 0 && requestedShortId) {
          try {
            const selectedResponse = await axios.get(`${API_BASE}/api/shorts/${requestedShortId}`, {
              withCredentials: true,
            });
            const selectedShort = selectedResponse.data?.data;
            if (selectedShort) {
              const normalizedSelectedShort = normalizeShort(selectedShort, likedShortIds);
              nextShorts = [
                normalizedSelectedShort,
                ...nextShorts.filter((short) => getShortId(short) !== requestedShortId),
              ];
            }
          } catch (err) {
            console.error("Failed to load requested short", err);
          }
        }

        setShorts((previous) => {
          const merged = pageToLoad === 0 ? [] : [...previous];
          const seen = new Set(merged.map((short) => getShortId(short)));
          nextShorts.forEach((short) => {
            const id = getShortId(short);
            if (id && !seen.has(id)) {
              merged.push(short);
              seen.add(id);
            }
          });
          return [...merged];
        });

        const nextHasMore = nextShorts.length === PAGE_SIZE;
        hasMoreRef.current = nextHasMore;
        setHasMore(nextHasMore);
        setPage(pageToLoad);
      } catch (err) {
        console.error("Failed to load shorts", err);
        setError("Unable to load Shorts. Please make sure the Shorts service is running.");
      } finally {
        setInitialLoading(false);
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [likedShortsStorageKey, requestedShortId]
  );

  useEffect(() => {
    loadShorts(0);
  }, [loadShorts]);

  useEffect(() => {
    if (!shorts.length || activeId) return;
    setActiveId(getShortId(shorts[0]));
  }, [activeId, shorts]);

  useEffect(() => {
    if (!requestedShortId || !shorts.some((short) => getShortId(short) === requestedShortId)) return;
    setActiveId(requestedShortId);
  }, [requestedShortId, shorts]);

  const incrementView = useCallback((shortId) => {
    if (!shortId || viewedRef.current.has(shortId)) return;
    viewedRef.current.add(shortId);
    axios.post(`${API_BASE}/api/shorts/${shortId}/view`, null, { withCredentials: true }).catch(() => null);
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const nextActiveId = visible.target.dataset.shortId;
        setActiveId(nextActiveId);
        incrementView(nextActiveId);
      },
      {
        root: feedRef.current,
        threshold: [0.55, 0.75, 0.9],
      }
    );

    itemRefs.current.forEach((node) => {
      if (node) observerRef.current.observe(node);
    });

    return () => observerRef.current?.disconnect();
  }, [incrementView, shorts]);

  useEffect(() => {
    if (!shorts.length || activeIndex < 0) return;
    if (shorts.length - activeIndex <= 3 && hasMore && !loading) {
      loadShorts(page + 1);
    }
  }, [activeIndex, hasMore, loadShorts, loading, page, shorts.length]);

  const setItemRef = useCallback((shortId, node) => {
    if (!shortId) return;
    if (node) itemRefs.current.set(shortId, node);
    else itemRefs.current.delete(shortId);
  }, []);

  const scrollToIndex = useCallback(
    (nextIndex) => {
      const boundedIndex = Math.max(0, Math.min(shorts.length - 1, nextIndex));
      const shortId = getShortId(shorts[boundedIndex]);
      const node = itemRefs.current.get(shortId);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [shorts]
  );

  const goNext = useCallback(() => {
    if (!shorts.length) return false;
    const current = activeIndex < 0 ? 0 : activeIndex;
    if (current >= shorts.length - 1) return false;
    scrollToIndex(current + 1);
    return true;
  }, [activeIndex, scrollToIndex, shorts.length]);

  const goPrevious = useCallback(() => {
    if (!shorts.length) return false;
    const current = activeIndex < 0 ? 0 : activeIndex;
    if (current <= 0) return false;
    scrollToIndex(current - 1);
    return true;
  }, [activeIndex, scrollToIndex, shorts.length]);

  const { autoScrollNotice, stopAutoScroll } = useShortsAutoScroll({
    feedRef,
    activeId,
    activeIndex,
    shortsLength: shorts.length,
    goNext,
    goPrevious,
  });

  const playActiveShort = useCallback(() => {
    window.dispatchEvent(new CustomEvent("shorts-play"));
  }, []);

  const pauseActiveShort = useCallback(() => {
    window.dispatchEvent(new CustomEvent("shorts-pause"));
  }, []);

  const muteActiveShort = useCallback(() => {
    if (!activeId) return;
    setShortMuteOverrides((previous) => ({ ...previous, [activeId]: true }));
  }, [activeId]);

  const unmuteActiveShort = useCallback(() => {
    if (!activeId) return;
    setShortMuteOverrides((previous) => ({ ...previous, [activeId]: false }));
  }, [activeId]);

  const updateShort = useCallback((shortId, updater) => {
    setShorts((previous) =>
      previous.map((short) => (getShortId(short) === shortId ? updater(short) : short))
    );
  }, []);

  const handleLike = useCallback(
    async (shortId) => {
      const previousShort = shorts.find((short) => getShortId(short) === shortId);
      if (!previousShort) return;

      const wasLiked = Boolean(previousShort.viewerLiked);
      const nextLiked = !wasLiked;
      const previousLikes = Number(previousShort.likes ?? 0);
      setStoredShortLike(likedShortsStorageKey, shortId, nextLiked);

      updateShort(shortId, (short) => ({
        ...short,
        likes: Math.max(0, (short.likes ?? 0) + (short.viewerLiked ? -1 : 1)),
        viewerLiked: !short.viewerLiked,
      }));

      try {
        const response = await axios.post(`${API_BASE}/api/shorts/${shortId}/like`, null, {
          headers: getAuthHeaders(accessToken),
          withCredentials: true,
        });
        const nextLikes = response.data?.data?.likes;
        if (typeof nextLikes === "number") {
          updateShort(shortId, (short) => ({ ...short, likes: nextLikes }));
          const confirmedLiked =
            nextLikes > previousLikes ? true : nextLikes < previousLikes ? false : nextLiked;
          setStoredShortLike(likedShortsStorageKey, shortId, confirmedLiked);
          updateShort(shortId, (short) => ({ ...short, viewerLiked: confirmedLiked }));
        }
      } catch (err) {
        console.error("Like failed", err);
        setStoredShortLike(likedShortsStorageKey, shortId, wasLiked);
        updateShort(shortId, () => previousShort);
      }
    },
    [accessToken, likedShortsStorageKey, shorts, updateShort]
  );

  const handleOpenComments = useCallback((short, options = {}) => {
    setCommentDrawerShort((currentShort) => {
      const nextShortId = getShortId(short);
      const currentShortId = getShortId(currentShort);
      if (currentShortId && currentShortId === nextShortId) return currentShort;
      return short;
    });

    if (options.fromVoice) {
      setVoiceCommentMessage("Comments opened.");
    }
  }, []);

  const openActiveCommentsByVoice = useCallback(() => {
    const activeShort = shorts.find((short) => getShortId(short) === activeId);
    if (!activeShort) return;
    handleOpenComments(activeShort, { fromVoice: true });
  }, [activeId, handleOpenComments, shorts]);

  const closeCommentsByVoice = useCallback(() => {
    setCommentDrawerShort((currentShort) => (currentShort ? null : currentShort));
    setVoiceCommentMessage("Comments closed.");
  }, []);

  const normalizeCommentsResponse = useCallback((payload) => {
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data?.messages)) return payload.data.messages;
    if (Array.isArray(payload?.data?.comments)) return payload.data.comments;
    if (Array.isArray(payload?.messages)) return payload.messages;
    if (Array.isArray(payload?.comments)) return payload.comments;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  }, []);

  const loadComments = useCallback(
    async (shortId) => {
      if (!shortId) return;

      setCommentsByShort((previous) => ({ ...previous, [shortId]: [] }));
      setCommentsLoadingByShort((previous) => ({ ...previous, [shortId]: true }));
      setCommentsErrorByShort((previous) => ({ ...previous, [shortId]: "" }));
      const storedComments = readStoredComments(shortId);
      if (storedComments.length > 0) {
        setCommentsByShort((previous) => ({ ...previous, [shortId]: storedComments }));
      }

      try {
        const response = await axios.get(`${API_BASE}/api/shorts/${shortId}/comments`, {
          withCredentials: true,
        });
        const remoteComments = normalizeCommentsResponse(response);
        setCommentsByShort((previous) => ({
          ...previous,
          [shortId]: mergeCommentsList(storedComments, remoteComments),
        }));
      } catch (err) {
        console.error("Failed to load comments", err);
        if (isUnavailableCommentsEndpoint(err)) {
          try {
            const fallbackResponse = await axios.get(`${APP_API_BASE}/api/v1/messages/video/${shortId}`, {
              withCredentials: true,
            });
            const fallbackComments = normalizeCommentsResponse(fallbackResponse);
            setCommentsByShort((previous) => ({
              ...previous,
              [shortId]: mergeCommentsList(storedComments, fallbackComments),
            }));
            setCommentsErrorByShort((previous) => ({ ...previous, [shortId]: "" }));
          } catch (fallbackErr) {
            console.error("Failed to load fallback comments", fallbackErr);
            setCommentsByShort((previous) => ({ ...previous, [shortId]: storedComments }));
            setCommentsErrorByShort((previous) => ({ ...previous, [shortId]: "" }));
          }
        } else {
          setCommentsErrorByShort((previous) => ({
            ...previous,
            [shortId]: "Comments could not be refreshed.",
          }));
        }
      } finally {
        setCommentsLoadingByShort((previous) => ({ ...previous, [shortId]: false }));
      }
    },
    [normalizeCommentsResponse]
  );

  const handleAddComment = useCallback(
    async (shortId, text) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      const newComment = {
        id: `${shortId}-${Date.now()}`,
        comment: cleanText,
        content: cleanText,
        commenterName: "You",
        createdAt: new Date().toISOString(),
      };

      setCommentDrafts((previous) => ({
        ...previous,
        [shortId]: [newComment, ...(previous[shortId] || [])],
      }));
      updateShort(shortId, (short) => ({
        ...short,
        commentsCount: (short.commentsCount ?? 0) + 1,
      }));

      try {
        const response = await axios.post(
          `${API_BASE}/api/shorts/${shortId}/comment`,
          { comment: cleanText },
          {
            headers: { "Content-Type": "application/json", ...getAuthHeaders(accessToken) },
            withCredentials: true,
          }
        );
        const nextCount = response.data?.data?.commentsCount;
        if (typeof nextCount === "number") {
          updateShort(shortId, (short) => ({ ...short, commentsCount: nextCount }));
        }

        removeStoredComment(shortId, newComment.id);
        setCommentDrafts((previous) => ({
          ...previous,
          [shortId]: (previous[shortId] || []).filter((comment) => comment.id !== newComment.id),
        }));

        const commenterName =
          user?.name || user?.username || user?.email?.split("@")[0] || "You";
        const confirmedComment = {
          ...newComment,
          commenterName,
        };
        setCommentsByShort((previous) => {
          const existing = previous[shortId] || [];
          const text = getCommentContent(confirmedComment);
          const filtered = existing.filter((comment) => getCommentContent(comment) !== text);
          return {
            ...previous,
            [shortId]: [confirmedComment, ...filtered],
          };
        });
      } catch (err) {
        console.error("Comment failed", err);
        writeStoredComment(shortId, newComment);
        setCommentDrafts((previous) => ({
          ...previous,
          [shortId]: (previous[shortId] || []).filter((comment) => comment.id !== newComment.id),
        }));
        updateShort(shortId, (short) => ({
          ...short,
          commentsCount: Math.max(0, (short.commentsCount ?? 1) - 1),
        }));
        throw err;
      }
    },
    [accessToken, updateShort, user]
  );

  const stopVoiceCommentRecorder = useCallback(() => {
    if (voiceCommentTimeoutRef.current) {
      clearTimeout(voiceCommentTimeoutRef.current);
      voiceCommentTimeoutRef.current = null;
    }
    if (voiceCommentRecognitionRef.current) {
      try {
        voiceCommentRecognitionRef.current.stop();
      } catch (err) {
        // The recorder may already be stopped by the browser.
      }
    }
  }, []);

  const startVoiceCommentRecorder = useCallback(() => {
    const shortId = activeId;
    const activeShort = shorts.find((short) => getShortId(short) === shortId);
    if (!shortId || !activeShort) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceCommentMessage("Voice comments are not supported in this browser.");
      return;
    }

    if (voiceCommentRecognitionRef.current) {
      try {
        voiceCommentRecognitionRef.current.abort();
      } catch (err) {
        // Best-effort cleanup before starting a fresh comment recorder.
      }
      voiceCommentRecognitionRef.current = null;
    }
    if (voiceCommentTimeoutRef.current) {
      clearTimeout(voiceCommentTimeoutRef.current);
      voiceCommentTimeoutRef.current = null;
    }

    voiceCommentTextRef.current = "";
    voiceCommentDeadlineRef.current = Date.now() + 10000;
    voiceCommentFinalizingRef.current = false;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      setVoiceCommentRecording(true);
      setVoiceCommentMessage("Record your comment for the next 10 seconds");
    };

    recognition.onresult = (event) => {
      let spokenText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        if (event.results[index].isFinal) {
          spokenText += event.results[index][0].transcript;
        }
      }
      if (spokenText.trim()) {
        voiceCommentTextRef.current = `${voiceCommentTextRef.current} ${spokenText}`.trim();
      }
    };

    recognition.onerror = (event) => {
      console.error("Shorts voice comment error", event);
      setVoiceCommentMessage("Unable to record comment. Please try again.");
    };

    recognition.onend = async () => {
      if (!voiceCommentFinalizingRef.current && Date.now() < voiceCommentDeadlineRef.current - 150) {
        try {
          recognition.start();
          voiceCommentRecognitionRef.current = recognition;
          return;
        } catch (err) {
          voiceCommentFinalizingRef.current = true;
        }
      }

      if (voiceCommentTimeoutRef.current) {
        clearTimeout(voiceCommentTimeoutRef.current);
        voiceCommentTimeoutRef.current = null;
      }
      voiceCommentFinalizingRef.current = false;
      voiceCommentRecognitionRef.current = null;
      setVoiceCommentRecording(false);

      const recordedComment = voiceCommentTextRef.current.trim();
      voiceCommentTextRef.current = "";

      if (!recordedComment) {
        setVoiceCommentMessage("No comment detected.");
        return;
      }

      try {
        await handleAddComment(shortId, recordedComment);
        handleOpenComments(activeShort);
        setVoiceCommentMessage("Comment posted.");
      } catch (err) {
        setVoiceCommentMessage("Unable to add comment. Please sign in and try again.");
      }
    };

    voiceCommentRecognitionRef.current = recognition;
    try {
      recognition.start();
      voiceCommentTimeoutRef.current = setTimeout(() => {
        voiceCommentFinalizingRef.current = true;
        stopVoiceCommentRecorder();
      }, 10000);
    } catch (err) {
      console.error("Shorts voice comment start failed", err);
      voiceCommentRecognitionRef.current = null;
      setVoiceCommentRecording(false);
      setVoiceCommentMessage("Recording failed. Please try again.");
    }
  }, [activeId, handleAddComment, handleOpenComments, shorts, stopVoiceCommentRecorder]);

  useShortsVoiceCommands({
    onPlay: playActiveShort,
    onPause: pauseActiveShort,
    onMute: muteActiveShort,
    onUnmute: unmuteActiveShort,
    onLike: () => {
      if (activeId) handleLike(activeId);
    },
    onCreateComment: startVoiceCommentRecorder,
    onOpenComments: openActiveCommentsByVoice,
    onCloseComments: closeCommentsByVoice,
  });

  useEffect(() => {
    return () => {
      if (voiceCommentTimeoutRef.current) clearTimeout(voiceCommentTimeoutRef.current);
      if (voiceCommentRecognitionRef.current) {
        try {
          voiceCommentRecognitionRef.current.abort();
        } catch (err) {
          // Ignore cleanup errors from an already-ended recorder.
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!voiceCommentMessage || voiceCommentRecording) return;
    const timeoutId = setTimeout(() => setVoiceCommentMessage(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [voiceCommentMessage, voiceCommentRecording]);

  const handleVoiceCommand = useCallback(
    (event) => {
      const detail = event?.detail ?? event;
      const transcript = String(
        typeof detail === "string" ? detail : detail?.text || detail?.transcript || ""
      ).toLowerCase();

      if (transcript.includes("next") || transcript.includes("swipe up")) goNext();
      else if (transcript.includes("previous") || transcript.includes("swipe down") || transcript.includes("back")) goPrevious();
    },
    [goNext, goPrevious]
  );

  useEffect(() => {
    window.addEventListener("voice-command", handleVoiceCommand);
    return () => window.removeEventListener("voice-command", handleVoiceCommand);
  }, [handleVoiceCommand]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        stopAutoScroll("Auto-scroll paused: manually interrupted.");
        goNext();
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        stopAutoScroll("Auto-scroll paused: manually interrupted.");
        goPrevious();
      }
    },
    [goNext, goPrevious, stopAutoScroll]
  );

  const commentsOpen = !!commentDrawerShort;
  const activeShortForDrawer = useMemo(() => {
    if (!commentsOpen) return null;
    return (
      shorts.find((short) => getShortId(short) === activeId) ||
      shorts.find((short) => getShortId(short) === getShortId(commentDrawerShort)) ||
      commentDrawerShort
    );
  }, [activeId, commentDrawerShort, commentsOpen, shorts]);

  useEffect(() => {
    const shortId = getShortId(activeShortForDrawer);
    if (!commentsOpen || !shortId) return;
    loadComments(shortId);
  }, [activeShortForDrawer, commentsOpen, loadComments]);

  return (
    <section className="relative mt-[33px] h-[calc(100vh-65px)] overflow-hidden bg-gray-50 px-2 py-[5px] text-white sm:px-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {initialLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />
        </div>
      )}

      {error && !shorts.length && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-50 px-6 text-center text-gray-950">
          <div>
            <h1 className="text-2xl font-semibold">Shorts are unavailable</h1>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              type="button"
              onClick={() => loadShorts(0)}
              className="mt-5 rounded-full bg-gray-950 px-5 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {(voiceCommentMessage || autoScrollNotice) && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[720] w-[min(92vw,360px)] -translate-x-1/2 rounded-lg bg-gray-950 px-4 py-3 text-center text-sm font-semibold text-white shadow-xl">
          {voiceCommentRecording && (
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 align-middle" />
          )}
          {voiceCommentMessage || autoScrollNotice}
        </div>
      )}

      <div
        ref={feedRef}
        className="relative mx-auto h-[calc(100vh-75px)] max-w-[1120px] snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth rounded-lg bg-gray-50"
        style={{ scrollbarWidth: "none" }}
      >
        {shorts.map((short, index) => {
          const shortId = getShortId(short);
          const distance = Math.abs(index - activeIndex);
          const isShortMuted = shortMuteOverrides[shortId] ?? muted;

          return (
            <div
              key={shortId}
              ref={(node) => setItemRef(shortId, node)}
              data-short-id={shortId}
              className={`relative h-full snap-start snap-always transition-[padding] duration-300 ease-out ${
                activeShortForDrawer ? "lg:pr-[560px] xl:pr-[640px]" : ""
              }`}
            >
              <ShortsCard
                short={short}
                isActive={shortId === activeId}
                isMuted={isShortMuted}
                shouldLoad={distance <= 2 || activeIndex < 0}
                onToggleMute={() => {
                  setShortMuteOverrides({});
                  setMuted((previous) => !previous);
                }}
                onLike={() => handleLike(shortId)}
                onOpenComments={() => handleOpenComments(short)}
                apiBase={API_BASE}
              />
            </div>
          );
        })}

        {!initialLoading && loading && shorts.length > 0 && (
          <div className="flex h-24 snap-start items-center justify-center bg-gray-50 text-sm text-gray-500">
            Loading more Shorts...
          </div>
        )}

      </div>

      <div className="pointer-events-none absolute right-3 top-1/2 z-[650] hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-4">
        <button
          type="button"
          onClick={goPrevious}
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/45 text-xl backdrop-blur hover:bg-black/70"
          aria-label="Previous short"
        >
          ^
        </button>
        <button
          type="button"
          onClick={goNext}
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/45 text-xl backdrop-blur hover:bg-black/70"
          aria-label="Next short"
        >
          v
        </button>
      </div>

      {activeShortForDrawer && (
        <ShortsCard.CommentsDrawer
          short={activeShortForDrawer}
          comments={commentsByShort[getShortId(activeShortForDrawer)] || []}
          localComments={commentDrafts[getShortId(activeShortForDrawer)] || []}
          loading={!!commentsLoadingByShort[getShortId(activeShortForDrawer)]}
          error={commentsErrorByShort[getShortId(activeShortForDrawer)] || ""}
          onRetry={() => loadComments(getShortId(activeShortForDrawer))}
          onClose={() => setCommentDrawerShort(null)}
          onAddComment={(text) => handleAddComment(getShortId(activeShortForDrawer), text)}
        />
      )}
    </section>
  );
}

export default ShortsFeed;

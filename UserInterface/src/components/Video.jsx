

//adding download the videos and visit respectice channel
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Video() {
  const API = import.meta.env.VITE_API_URL || "";
  const { id } = useParams();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [error, setError] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [detected, setDetected] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [videoLoading, setVideoLoading] = useState(true);

  // Likes
  const [videoLikes, setVideoLikes] = useState(0);
  const [videoLiked, setVideoLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Comments
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null); // new ref for the video wrapper

  //subscribe
  const [subscribe, setSubscribe] = useState(false);
  const [count, setCount] = useState(0);
  const [isToggling, setIsToggling] = useState(false);

  // modal position/size state (to match video)
  const [modalRect, setModalRect] = useState(null);

  //rerender s
  const [render, setRender] = useState(true);
  //unmute the autoplay
  const [isMutedState, setIsMutedState] = useState(true);
const [showUnmuteBtn, setShowUnmuteBtn] = useState(false);


  // number helpers (kept from your code)
  const WORD_NUMBER_MAP = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100
  };
  const wordsToNumber = (text) => {
    if (!text) return null;
    const words = text.toLowerCase().replace(/[,()-]/g, ' ').split(/\s+/).filter(Boolean);
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
        if (m) current += parseInt(m[1], 10);
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
      const map = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };
      const n = map[wordMatch[1]] ?? null;
      if (n !== null && n >= 0 && n < max) return n === 0 ? 0 : n - 1;
    }
    return null;
  };

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
  // useEffect(() => {
  //   if (!videoData?.videoFile || !videoRef.current) return;
  //   const v = videoRef.current;
  //   try { v.pause(); } catch (e) { }
  //   if (v.src !== videoData.videoFile) v.src = videoData.videoFile;
  //   try { v.load(); v.play().catch(() => { }); } catch (e) { }
  //   setRender(!render);
  // }, [videoData]);


useEffect(() => {
  if (!videoData?.videoFile || !videoRef.current) return;
  const v = videoRef.current;

  const attemptAutoplay = () => {
    try { v.pause(); } catch (e) {}
    if (v.src !== videoData.videoFile) v.src = videoData.videoFile;

    // Wait for video to be ready before attempting autoplay
    if (v.readyState >= 2) { // HAVE_CURRENT_DATA or higher
      tryAutoplay();
    } else {
      // Wait for video to be ready
      const onCanPlay = () => {
        v.removeEventListener('canplay', onCanPlay);
        tryAutoplay();
      };
      v.addEventListener('canplay', onCanPlay);
    }
  };

  const tryAutoplay = () => {
    try {
      // Try to autoplay unmuted first
      v.muted = false;
      setIsMutedState(false);
      v.play().then(() => {
        // Video started playing unmuted successfully
        setShowUnmuteBtn(false);
        setVideoLoading(false);
      }).catch(() => {
        // Autoplay with sound blocked, try muted autoplay
        try {
          v.muted = true;
          setIsMutedState(true);
          return v.play().then(() => {
            // Muted autoplay succeeded, show unmute button
            setShowUnmuteBtn(true);
            setVideoLoading(false);
          });
        } catch (mutedErr) {
          // Both failed, show unmute button
          setShowUnmuteBtn(true);
          setVideoLoading(false);
        }
      });
    } catch (e) {
      setShowUnmuteBtn(true);
      setVideoLoading(false);
    }
  };

  attemptAutoplay();
  setRender(prev => !prev);
}, [videoData]);


//unmute handler
const handleUnmuteClick = async () => {
  const v = videoRef.current;
  if (!v) return;
  try {
    v.muted = false;
    await v.play();
    setIsMutedState(false);
    setShowUnmuteBtn(false);
  } catch (err) {
    v.muted = true;
    setIsMutedState(true);
    setShowUnmuteBtn(true);
  }
};



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
    axios.get(`/api/v1/messages/video/${id}`, { withCredentials: true })
      .then(res => setMessages(res.data.messages || res.data.data || []))
      .catch(console.error);
  }, [id]);

  // === Fetch all videos for Recommended ===
  useEffect(() => {
    axios.get("/api/v1/videos/allVideo")
      .then(res => setRecommended(res.data.data || []))
      .catch(console.error);
  }, []);

  // === Like video ===
  const handleLikeVideo = async () => {
    if (!authStatus) {
      setStatusMessage('Please sign in to continue.');
      setTimeout(() => setStatusMessage(''), 3000);
      return null;
    }
    if (isLiking) return null;
    setIsLiking(true);
    const prevLiked = videoLiked;
    const prevCount = videoLikes;
    try {
      const res = await axios.put(`/api/v1/videos/${id}/like`, {}, { withCredentials: true });
      if (res?.data) {
        if (typeof res.data.liked !== 'undefined') setVideoLiked(!!res.data.liked);
        else setVideoLiked(!prevLiked);
        if (typeof res.data.likes === 'number') setVideoLikes(res.data.likes);
        else if (Array.isArray(res.data.likes)) setVideoLikes(res.data.likes.length);
        else setVideoLikes(prev => (prevLiked ? Math.max(0, prev - 1) : prev + 1));
        return { liked: typeof res.data.liked !== 'undefined' ? !!res.data.liked : !prevLiked, likes: typeof res.data.likes === 'number' ? res.data.likes : (Array.isArray(res.data.likes) ? res.data.likes.length : (prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1)) };
      } else {
        setVideoLiked(!prevLiked);
        setVideoLikes(prev => (prevLiked ? Math.max(0, prev - 1) : prev + 1));
        return { liked: !prevLiked, likes: prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1 };
      }
    } catch (err) {
      setVideoLiked(prevLiked);
      setVideoLikes(prevCount);
      if (err.response?.status === 401) {
        setStatusMessage('Please sign in to continue.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
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

  const handleSubscribe = async () => {
    if (!authStatus) {
      setStatusMessage('Please sign in to continue.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
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
      console.error("subscribe error:", err.response?.data || err?.message);
      if (err.response?.status === 401) {
        setStatusMessage('Please sign in to continue.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } finally {
      setIsToggling(false);
    }
  };

  // === Post comment ===
  // NOTE: default openModal=false so manual posts won't open the modal.
  const handleSendMessage = async (overrideText = null, { openModal = false } = {}) => {
    if (!authStatus) {
      setStatusMessage('Please sign in to continue.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    const messageText = overrideText !== null ? overrideText : newMessage;
    if (!messageText || !messageText.trim()) return;
    setIsPosting(true);
    try {
      const res = await axios.post(`/api/v1/messages`, { videoId: id, content: messageText }, { withCredentials: true });
      const created = res.data?.message || res.data?.data || res.data;
      if (created) {
        setMessages(prev => [created, ...prev]);
      } else {
        const refetch = await axios.get(`/api/v1/messages/video/${id}`, { withCredentials: true });
        setMessages(refetch.data.messages || refetch.data.data || []);
      }
      setNewMessage('');
      // only open the modal if caller asked for it (mic-recorded flow)
      if (openModal) {
        // compute position/width based on video wrapper
        const rect = videoContainerRef.current?.getBoundingClientRect();
        if (rect) {
          setModalRect({
            left: rect.left,
            width: rect.width,
          });
        } else {
          setModalRect(null);
        }
        setShowCommentsModal(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setStatusMessage('Please sign in to continue.');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        console.error('post message error:', err?.response?.data || err?.message);
        setStatusMessage('Failed to post message');
        setTimeout(() => setStatusMessage(''), 2000);
      }
    } finally {
      setIsPosting(false);
    }
  };

  // === Like comment ===
  const toggleMessageLike = async (msgId) => {
    if (!authStatus) {
      setStatusMessage('Please sign in to continue.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    try {
      const res = await axios.post(`/api/v1/messages/${msgId}/like`, {}, { withCredentials: true });
      setMessages(prev => prev.map(m => m._id === msgId ? { ...m, likes: res.data.likes } : m));
    } catch (err) {
      if (err.response?.status === 401) {
        setStatusMessage('Please sign in to continue.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
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

  // helper to update modalRect on resize when modal is visible
  useEffect(() => {
    if (!showCommentsModal) return;
    const updateRect = () => {
      const rect = videoContainerRef.current?.getBoundingClientRect();
      if (rect) setModalRect({ left: rect.left, width: rect.width });
    };
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });
    updateRect();
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [showCommentsModal]);

  // === Voice Message Recorder ===
  const startMessageRecorder = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage("Speech Recognition not supported in this browser.");
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setStatusMessage("🎤 Speak your message (10s)...");
      setDetected('Recording…');
    };

    recognition.onresult = async (event) => {
      let spokenText = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          spokenText += event.results[i][0].transcript;
        }
      }
      const collected = spokenText.trim();
      if (collected) {
        // pass openModal: true so the modal opens only for mic-created messages
        await handleSendMessage(collected, { openModal: true });
        setStatusMessage("✅ Message sent!");
        setTimeout(() => setStatusMessage(''), 2500);
      } else {
        setStatusMessage("No message detected");
        setTimeout(() => setStatusMessage(''), 2000);
      }
    };

    recognition.onerror = (ev) => {
      console.error('recorder error', ev);
      setStatusMessage("Error listening for message");
      setTimeout(() => setStatusMessage(''), 2000);
    };

    recognition.onend = () => {
      setDetected('');
    };

    setTimeout(() => {
      try { recognition.start(); } catch (e) { console.error('recorder start error', e); setStatusMessage("Recording failed"); }
    }, 120);

    setTimeout(() => {
      try { recognition.stop(); } catch (e) { /* ignore */ }
    }, 10000);
  };

  // -------------------- NEW: Download & Render helpers --------------------
  const downloadVideo = async () => {
    if (!videoData?.videoFile) {
      setStatusMessage("No video URL to download");
      setTimeout(() => setStatusMessage(''), 2000);
      return;
    }
    try {
      setStatusMessage("Downloading video...");
      // Try to fetch as blob (requires CORS on the host)
      const res = await axios.get(videoData.videoFile, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = (videoData.title || 'video').replace(/[^\w\-. ]+/g, '').slice(0, 120);
      a.href = url;
      a.download = `${safeTitle}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatusMessage("Download started");
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('download error:', err);
      // fallback: open in new tab (user can Save As)
      try {
        window.open(videoData.videoFile, '_blank', 'noopener');
        setStatusMessage("Opened in new tab (use Save As if download blocked)");
      } catch (e) {
        setStatusMessage("Download failed (CORS or network)");
      }
      setTimeout(() => setStatusMessage(''), 3500);
    }
  };

  const renderToChannel = async () => {
    if (!id) return;
    try {
      setStatusMessage("Rendering to channel...");
      // Try server endpoint. Adjust the endpoint name if your backend uses another route.
      const res = await axios.post(`/api/v1/videos/${id}/renderToChannel`, {}, { withCredentials: true });
      if (res?.data?.success || res?.status === 200) {
        setStatusMessage(res.data?.message || "Rendered to channel");
        // navigate to channel page or to the rendered video's page as appropriate
        setTimeout(() => {
          setStatusMessage('');
          navigate('/your_channel');
        }, 1500);
      } else {
        // fallback: navigate to render page with id so user can finish server-side rendering
        setStatusMessage(res.data?.message || "Render request sent");
        setTimeout(() => {
          setStatusMessage('');
          navigate(`/your_channel/render/${id}`);
        }, 1400);
      }
    } catch (err) {
      console.error('render error:', err);
      if (err.response?.status === 401) {
        setStatusMessage('Please sign in to continue.');
        setTimeout(() => setStatusMessage(''), 3000);
        return;
      }
      // If server doesn't implement that endpoint, fallback to a render page
      setStatusMessage("Render failed — opening render page");
      setTimeout(() => {
        setStatusMessage('');
        navigate(`/your_channel/render/${id}`);
      }, 1400);
    }
  };

  // ---------------------------------------------------------------------

  // === Voice Command Parser (updated to include download/render) ===
    const handleVoiceCommand = async (command) => {
    const video = videoRef.current;
    if (!video) return;
    const lower = String(command).toLowerCase();
    setDetected(lower);
    setTimeout(() => setDetected(''), 5000);
    

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
      // setStatusMessage(`Opening "${target.title}"`);
      navigate(`/watch/${target._id}`);
      return;
    }
  
    // Download/render voice commands (order matters for combined phrases)
    if (lower.includes("download and render") || lower.includes("download then render") || lower.includes("download & render")) {
      await downloadVideo();
      // small delay so download starts
      setTimeout(() => renderToChannel(), 800);
      return;
    }
    if (lower.includes("download") || lower.includes("download video") || lower.includes("download this video")) {
      await downloadVideo();
      return;
    }
    if (lower.includes("render to channel") || lower.includes("publish to channel") || lower.includes("upload to channel") || lower.includes("post to channel") || lower === 'render') {
      await renderToChannel();
      return;
    }

    // volume/playback/seek/fullscreen/subscribe/like/play/pause/resume...
    if (lower.includes("volume increase") || lower.includes("increase volume")) { video.muted = false; video.volume = Math.min(video.volume + 0.1, 1); return; }
    if (lower.includes("volume decrease") || lower.includes("decrease volume")) { video.muted = false; video.volume = Math.max(video.volume - 0.1, 0); return; }
    if (lower.includes("mute")) { video.muted = true; return; }
    if (lower.includes("unmute") || lower.includes("un mute") || lower.includes("un-mute")) { video.muted = false; return; }

    if (lower.includes("normal")) { video.playbackRate = 1; return; }
    if (lower.includes("slow")) { video.playbackRate = 0.5; return; }
    if (lower.includes("slower")) { video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25); return; }
    if (lower.includes("faster")) { video.playbackRate = Math.min(video.playbackRate + 0.25, 3); return; }
    if (lower.includes("double")) { video.playbackRate = 2; return; }
    if (lower.includes("triple")) { video.playbackRate = 3; return; }

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

    if (lower.includes("fullscreen") || lower.includes("full screen") || lower.includes("ful screen")) {
      try { if (video.requestFullscreen) await video.requestFullscreen(); else if (video.parentElement && video.parentElement.requestFullscreen) await video.parentElement.requestFullscreen(); else { setStatusMessage("Fullscreen not supported"); setTimeout(() => setStatusMessage(""), 2500); } } catch (err) { console.error("Fullscreen error:", err); setStatusMessage("Cannot enter fullscreen"); setTimeout(() => setStatusMessage(""), 3000); }
      return;
    }
    if (lower.includes("exit fullscreen") || lower.includes("leave fullscreen")) {
      try { if (document.exitFullscreen) await document.exitFullscreen(); } catch (err) { console.error("Exit fullscreen error:", err); setStatusMessage("Cannot exit fullscreen"); setTimeout(() => setStatusMessage(""), 2500); }
      return;
    }
    if (lower.includes("picture in picture") || lower.includes("pip")||lower.includes("picture and picture")||lower.includes("texture and picture")||lower.includes("texture in picture")) {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else if (video.requestPictureInPicture) await video.requestPictureInPicture();
        else { setStatusMessage("Picture-in-Picture not supported"); setTimeout(() => setStatusMessage(""), 2500); }
      } catch (err) { console.error("PIP error:", err); setStatusMessage("PIP blocked or unavailable"); setTimeout(() => setStatusMessage(""), 3000); }
      return;
    }

    if (lower.includes("toggle subscribe") || lower.includes("toggle subscription") || lower.includes("subscribe toggle")) {
      if (!authStatus) {
        setStatusMessage('Please sign in to continue.');
        setTimeout(() => setStatusMessage(''), 3000);
        return;
      }
      if (!channelId) { setStatusMessage("Channel not ready yet"); setTimeout(() => setStatusMessage(""), 2500); return; }
      if (isToggling) { setStatusMessage("Please wait..."); setTimeout(() => setStatusMessage(""), 1800); return; }
      setIsToggling(true);
      setStatusMessage("Toggling subscription...");
      try {
        const res = await axios.post(`/api/v1/subs/${channelId}/subscribe`, {}, { withCredentials: true });
        if (res.data?.subscribed !== undefined) setSubscribe(!!res.data.subscribed);
        if (typeof res.data?.count === 'number') setCount(res.data.count);
        setStatusMessage(res.data?.subscribed ? "Subscribed ✅" : "Unsubscribed ❌");
        setTimeout(() => setStatusMessage(""), 2000);
      } catch (err) {
        console.error("subscribe error:", err?.response?.data || err?.message);
        if (err.response?.status === 401) {
          setStatusMessage('Please sign in to continue.');
          setTimeout(() => setStatusMessage(''), 3000);
        } else {
          setStatusMessage("Subscribe failed");
          setTimeout(() => setStatusMessage(""), 2000);
        }
      } finally {
        setIsToggling(false);
      }
      return;
    }

    if (lower.includes("thumbs up") || lower.includes("unlike") || lower.includes("toggle thumbs")) {
      if (isLiking) { setStatusMessage("Please wait..."); setTimeout(() => setStatusMessage(""), 1500); return; }
      setStatusMessage("Toggling like...");
      const result = await handleLikeVideo();
      if (!result) { setStatusMessage("Like failed"); setTimeout(() => setStatusMessage(""), 1500); return; }
      setStatusMessage(result.liked ? "Liked 👍" : "Unliked");
      setTimeout(() => setStatusMessage(""), 1800);
      return;
    }

    if (lower.includes("play")) { video.play().catch(() => { }); return; }
    if (lower.includes("pause") || lower.includes("stop")) { video.pause(); return; }
    if (lower.includes("resume")) { video.play().catch(() => { }); return; }

    if (lower.includes("create message") || lower.includes("create a message") || lower.includes("record message")) {
      startMessageRecorder();
      return;
    }

    if (lower.includes("open message") || lower.includes("show message") || lower.includes("open comments")) {
      setShowCommentsModal(true);
      setTimeout(() => setStatusMessage(""), 2500);
      return;
    }
    if (lower.includes("close message") || lower.includes("hide message") || lower.includes("close comments")) {
      setShowCommentsModal(false);
      setStatusMessage("❌ Comments closed");
      setTimeout(() => setStatusMessage(""), 2000);
      return;
    }

    setStatusMessage("⚠️ Please speak clearly. Command not recognized.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // === Listen for global voice events sent by Navbar ===
  useEffect(() => {
    const onVoiceCommand = (e) => {
      const payload = e?.detail ?? e;
      const text = typeof payload === 'string' ? payload : (payload.text || payload.transcript || payload);
      handleVoiceCommand(text);
    };
    const onPlayIndex = (e) => {
      const idx = e?.detail?.index ?? e?.detail;
      if (!idx) return;
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

    const onCreateMessage = (e) => {
      startMessageRecorder();
    };

    window.addEventListener('voice-command', onVoiceCommand);
    window.addEventListener('play-index', onPlayIndex);
    window.addEventListener('create-message', onCreateMessage);

    return () => {
      window.removeEventListener('voice-command', onVoiceCommand);
      window.removeEventListener('play-index', onPlayIndex);
      window.removeEventListener('create-message', onCreateMessage);
    };
  }, [recommended, channelId, subscribe, count]);

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
        {/* <div ref={videoContainerRef} className="relative w-full aspect-video bg-black">
          <video ref={videoRef} className="w-full h-full" controls autoPlay muted playsInline>
            <source src={videoData.videoFile} type="video/mp4" />
          </video>
        </div> */}
        <div ref={videoContainerRef} className="relative w-full aspect-video bg-black">
  <video
    ref={videoRef}
    className="w-full h-full"
    controls
    autoPlay
    playsInline
    preload="auto"
    onLoadStart={() => setVideoLoading(true)}
    onCanPlay={() => setVideoLoading(false)}
    onCanPlayThrough={() => setVideoLoading(false)}
    onError={() => setVideoLoading(false)}
  >
    <source src={videoData.videoFile} type="video/mp4" />
  </video>

  {videoLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-white text-lg">Loading video...</div>
    </div>
  )}

  {showUnmuteBtn && (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <button
        onClick={handleUnmuteClick}
        className="pointer-events-auto bg-black bg-opacity-60 text-white px-4 py-2 rounded-md"
        aria-label="Unmute video"
      >
        Unmute
      </button>
    </div>
  )}
</div>


        <h1 className="my-10 text-xl font-semibold hidden sm:inline">{videoData.title}</h1>
        <h1
          className="mt-4 mb-3 text-xl font-semibold md:hidden"
          title={videoData?.title || ''}
          aria-label={videoData?.title || ''}
        >
          {videoData?.title
            ? (videoData.title.length > 50 ? videoData.title.slice(0, 70) + '...' : videoData.title)
            : ''}
        </h1>


        <div className="border-b border-gray-200 pb-3">
          {userData ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <img src={userData.avatar} className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-gray-500"> {count} Subscribers</p>
                </div>

                <div className="relative inline-block ml-auto lg:ml-8">
                  {statusMessage && (
                    <div className="absolute -top-12 lg:left-1/2 lg:-translate-x-1/2 right-0 sm:right-0 sm:-translate-x-full min-w-[200px] max-w-[300px] px-4 py-2 bg-red-600 text-white text-sm rounded-lg shadow-lg text-center">
                      {statusMessage}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex gap-3 ">
                <button onClick={handleLikeVideo} className={`px-2 py-[2px] rounded-md text-white ${videoLiked ? 'bg-green-600' : 'bg-gray-600'}`} >
                  👍 {videoLikes}
                </button>

                {/* NEW: Download & Render buttons */}
                <button onClick={downloadVideo} className="px-2 py-[2px] rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm">
                  Download
                </button>
                {/* <button onClick={renderToChannel} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">
                  Render
                </button> */}

                <button onClick={handleSubscribe} className="bg-red-600 text-white px-2 py-[2px]  rounded-md">{subscribe ? "Subscribed" : "Subscribe"}</button>
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
            {showFullDesc ? videoData.description : videoData.description?.slice(0, 150) + (videoData.description?.length > 150 ? '...' : '')}
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
            <div onClick={() => setShowCommentsModal(true)} className="bg-gray-100 p-3 rounded-lg cursor-pointer">
              💬 View all {messages.length} comments
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="flex gap-2 mb-4">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } }} className="flex-1 border rounded-md px-3 py-2" placeholder="Add a comment..." />
              <button onClick={() => handleSendMessage()} disabled={isPosting || !newMessage.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                {isPosting ? 'Sending...' : 'Send'}
              </button>
            </div>

            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={msg.author?.avatar || msg.user?.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <span className="font-medium">{msg.author?.name || msg.user?.name || "Anon"}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">👍 {msg.likes?.length || 0}</button>
                      <button onClick={() => deleteMessage(msg._id)} className="text-red-600">Delete</button>
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
            <Link key={vid._id} to={`/watch/${vid._id}`} className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg items-center">
              <div className="relative w-40 h-24 flex-shrink-0">
                <img src={vid.thumbnail} className="w-full h-full object-cover rounded-lg" alt={vid.title} />
                <div className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-md border ${id === vid._id ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-800 border-gray-200'}`} style={{ zIndex: 5 }}>
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

      {/* Comments modal: only appears if showCommentsModal === true.
          If modalRect is present we position/size it to match the video container. */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50">
          {/* If modalRect available, place the modal at video left/bottom; otherwise fallback to centered full width */}
          {modalRect ? (
            <div
              style={{
                position: 'fixed',
                left: `${modalRect.left}px`,
                bottom: 0,
                width: `${modalRect.width}px`,
                maxHeight: '66vh',
                zIndex: 60
              }}
              className="bg-white rounded-t-2xl p-4 overflow-y-auto shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Comments</h3>
                <button onClick={() => setShowCommentsModal(false)}>✖</button>
              </div>

              <div className="flex gap-2 mb-4">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-md px-3 py-2" placeholder="Add a comment..." />
                <button onClick={() => handleSendMessage()} disabled={isPosting || !newMessage.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-md">{isPosting ? 'Sending...' : 'Send'}</button>
              </div>

              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg._id} className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">{msg.user?.name || msg.author?.name || 'Anon'}</p>
                    <p>{msg.content}</p>
                    <div className="flex gap-4 text-sm mt-1">
                      <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">👍 {msg.likes?.length || 0}</button>
                      <button onClick={() => deleteMessage(msg._id)} className="text-red-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // fallback full-width modal (mobile / when measurement fails)
            <div className="fixed inset-x-0 bottom-0 z-60 bg-white h-2/3 rounded-t-2xl p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Comments</h3>
                <button onClick={() => setShowCommentsModal(false)}>✖</button>
              </div>

              <div className="flex gap-2 mb-4">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-md px-3 py-2" placeholder="Add a comment..." />
                <button onClick={() => handleSendMessage()} disabled={isPosting || !newMessage.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-md">{isPosting ? 'Sending...' : 'Send'}</button>
              </div>

              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg._1} className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">{msg.user?.name || msg.author?.name || 'Anon'}</p>
                    <p>{msg.content}</p>
                    <div className="flex gap-4 text-sm mt-1">
                      <button onClick={() => toggleMessageLike(msg._id)} className="text-blue-600">👍 {msg.likes?.length || 0}</button>
                      <button onClick={() => deleteMessage(msg._id)} className="text-red-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Video;

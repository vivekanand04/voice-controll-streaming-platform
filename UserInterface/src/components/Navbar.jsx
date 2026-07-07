

// // Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import logo from '../assets/file.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import axios from 'axios';
import { FiUpload, FiFileText } from "react-icons/fi";
import { getShortsVoiceAction } from '../hooks/useShortsVoiceCommands';
import { getShortsScrollAction } from '../hooks/useShortsAutoScroll';

function Navbar({ openChange }) {
  const [userdata, setUserData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const data = useSelector((state) => state.auth.user);
  const [statusMessage, setStatusMessage] = useState('');
  const isShortsRoute = location.pathname.startsWith('/shorts');

  // recognition refs
  const recognitionRef = useRef(null);
  const queryRecRef = useRef(null);

  // Scroll helpers 
  const scrollRef = useRef({
    running: false,
    direction: 1,
    speed: 240,
    rafId: null,
    lastTime: null,
    timeoutId: null,
    manualInterrupted: false,
    reachedEnd: false,
  });

  const stopScroll = () => {
    const s = scrollRef.current;
    if (s.rafId) cancelAnimationFrame(s.rafId);
    if (s.timeoutId) clearTimeout(s.timeoutId);
    s.rafId = null;
    s.timeoutId = null;
    s.running = false;
    s.lastTime = null;
    setStatusMessage('Scroll stopped');
  };

  const scrollStep = (time) => {
    const s = scrollRef.current;
    if (!s.running) { s.rafId = null; return; }
    if (s.lastTime == null) s.lastTime = time;
    const dt = (time - s.lastTime) / 1000;
    s.lastTime = time;
    const delta = s.speed * dt * s.direction;
    window.scrollBy({ top: delta, left: 0, behavior: 'auto' });

    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const viewport = window.innerHeight || document.documentElement.clientHeight || 0;
    const docHeight = Math.max(document.documentElement.scrollHeight || 0, document.body.scrollHeight || 0);

    if (s.direction === 1 && scrollTop + viewport >= docHeight - 1) {
      if (s.rafId) cancelAnimationFrame(s.rafId);
      if (s.timeoutId) { clearTimeout(s.timeoutId); s.timeoutId = null; }
      s.rafId = null;
      s.running = false;
      s.lastTime = null;
      s.reachedEnd = true;
      setStatusMessage('Reached bottom — stopped');
      return;
    }
    if (s.direction === -1 && scrollTop <= 1) {
      if (s.rafId) cancelAnimationFrame(s.rafId);
      if (s.timeoutId) { clearTimeout(s.timeoutId); s.timeoutId = null; }
      s.rafId = null;
      s.running = false;
      s.lastTime = null;
      s.reachedEnd = true;
      setStatusMessage('Reached top — stopped');
      return;
    }

    s.rafId = requestAnimationFrame(scrollStep);
  };

  const startScroll = (direction = 1, speed = null, durationSeconds = null) => {
    stopScroll();
    if (speed != null) scrollRef.current.speed = Math.max(20, Math.round(speed));
    scrollRef.current.manualInterrupted = false;
    scrollRef.current.reachedEnd = false;
    scrollRef.current.direction = direction;
    scrollRef.current.running = true;
    scrollRef.current.lastTime = null;
    scrollRef.current.rafId = requestAnimationFrame(scrollStep);
    if (durationSeconds && durationSeconds > 0) {
      scrollRef.current.timeoutId = setTimeout(() => {
        stopScroll();
      }, durationSeconds * 1000);
    }
    setStatusMessage(direction === 1 ? 'Scrolling down' : 'Scrolling up');
  };

  const changeSpeedByFactor = (factor) => {
    scrollRef.current.speed = Math.max(20, Math.round(scrollRef.current.speed * factor));
    setStatusMessage(`Scroll speed ${scrollRef.current.speed} px/s`);
  };

  const setAbsoluteSpeed = (pxPerSec) => {
    scrollRef.current.speed = Math.max(20, Math.round(pxPerSec));
    setStatusMessage(`Scroll speed ${scrollRef.current.speed} px/s`);
  };

  useEffect(() => {
    const onUserInput = (e) => {
      const s = scrollRef.current;
      if (!s.running) return;
      s.manualInterrupted = true;
      try { stopScroll(); } catch (err) { }
      setStatusMessage('Manual scroll detected — voice scroll stopped');
    };

    const onKey = (e) => {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
      if (keys.includes(e.key)) onUserInput(e);
    };

    window.addEventListener('wheel', onUserInput, { passive: true });
    window.addEventListener('touchstart', onUserInput, { passive: true });
    window.addEventListener('pointerdown', onUserInput, { passive: true });
    window.addEventListener('keydown', onKey, { passive: true });

    return () => {
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchstart', onUserInput);
      window.removeEventListener('pointerdown', onUserInput);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const t = setTimeout(() => setStatusMessage(''), 3000);
    return () => clearTimeout(t);
  }, [statusMessage]);

  const toggleSidebar = () => { openChange(); };
  const toggleDropdown = () => { setDropdownVisible(!dropdownVisible); };
  const handleSignOut = () => { dispatch(logout()); };  

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) navigate(`/search/${encodeURIComponent(searchText.trim())}`);
  };

  useEffect(() => {
    if (!isShortsRoute && voiceMode === 'command' && recognitionRef.current?.continuous) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }
  }, [isShortsRoute, voiceMode]);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.abort(); } catch (e) { }
      try { queryRecRef.current?.abort(); } catch (e) { }
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => {
        try { searchInputRef.current?.focus(); } catch (e) { }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  // number word helpers (unchanged)
  const NUMBER_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    hundred: 100, thousand: 1000 };

  function textNumberToInt(text) {
    if (!text || typeof text !== 'string') return null;
    text = text.toLowerCase().replace(/[,()]/g, ' ').replace(/-/g, ' ').trim();
    text = text.replace(/\b(video|videos|number|no|#|the|please|play|open|watch|index|of|for|rd|th|st|nd)\b/g, ' ').trim();
    if (!text) return null;
    text = text.replace(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\b/,
      (m) => {
        const ordMap = { first: 'one', second: 'two', third: 'three', fourth: 'four', fifth: 'five', sixth: 'six', seventh: 'seven', eighth: 'eight', ninth: 'nine', tenth: 'ten', eleventh: 'eleven', twelfth: 'twelve' };
        return ordMap[m] || m;
      });
    const words = text.split(/\s+/);
    let total = 0;
    let current = 0;
    for (let w of words) {
      if (!w) continue;
      if (NUMBER_WORDS[w] != null) {
        const val = NUMBER_WORDS[w];
        if (val === 100 || val === 1000) {
          if (current === 0) current = 1;
          current = current * val;
        } else {
          current += val;
        }
      } else {
        const m = w.match(/^(\d+)(st|nd|rd|th)?$/);
        if (m) current += parseInt(m[1], 10);
      }
    }
    total = total + current;
    return total > 0 ? total : null;
  }

  // ---------- Command recognition ----------
  const startCommandRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Voice commands are not supported in this browser.');
      return;
    }

    // if another recognition exists, stop/abort it first
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) { }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = isShortsRoute;
    recognition.maxAlternatives = 1;
    let commandHandled = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMode('command');
      recognitionRef.current = recognition; // keep reference
    };

    recognition.onresult = (event) => {
      if (commandHandled) return;
      const currentResult = event.results[event.resultIndex] || event.results[0];
      const transcriptRaw = currentResult?.[0]?.transcript?.trim() || '';
      if (!transcriptRaw) return;
      const transcript = transcriptRaw.toLowerCase();
      console.log('navbar transcript:', transcript);

      if (isShortsRoute) {
        const shortsScrollAction = getShortsScrollAction(transcript);
        if (shortsScrollAction) {
          const scrollCommandDetail = { action: shortsScrollAction, accepted: false };
          window.dispatchEvent(
            new CustomEvent('shorts-scroll-command', { detail: scrollCommandDetail })
          );

          if (shortsScrollAction === 'scroll-one') {
            if (scrollCommandDetail.accepted) {
              commandHandled = true;
              try { recognition.stop(); } catch (e) { /* ignore */ }
              recognitionRef.current = null;
              setIsListening(false);
              setVoiceMode(null);
              setStatusMessage('Scroll One');
            } else {
              setStatusMessage('Scroll One is not available right now');
            }
            return;
          }

          if (shortsScrollAction === 'stop') setStatusMessage(scrollCommandDetail.accepted ? 'Auto-scroll stopped' : 'No auto-scroll is running');
          else if (shortsScrollAction === 'scroll-down') setStatusMessage('Scrolling Shorts down');
          else if (shortsScrollAction === 'scroll-up') setStatusMessage('Scrolling Shorts up');
          return;
        }
      }

      const shortsVoiceAction = getShortsVoiceAction(transcript);
      const isShortsLocalCommand =
        shortsVoiceAction ||
        transcript.includes('next') ||
        transcript.includes('swipe up') ||
        transcript.includes('previous') ||
        transcript.includes('swipe down') ||
        transcript.includes('comment') ||
        transcript.includes('like');

      if (isShortsRoute && isShortsLocalCommand) {
        const eventName = shortsVoiceAction ? 'shorts-voice-command' : 'voice-command';
        const dispatchShortsCommand = () => {
          window.dispatchEvent(new CustomEvent(eventName, { detail: transcript }));
        };

        if (shortsVoiceAction === 'comment') {
          try { recognition.stop(); } catch (e) { /* ignore */ }
          recognitionRef.current = null;
          setIsListening(false);
          setVoiceMode(null);
          setStatusMessage('Recording Shorts comment...');
          setTimeout(dispatchShortsCommand, 120);
          return;
        }

        dispatchShortsCommand();
        setStatusMessage(`Shorts command: "${transcriptRaw}"`);
        return;
      }

      // Stop this recognition right away so other components can start their own (prevents contention)
      try { recognition.stop(); } catch (e) { /* ignore */ }
      recognitionRef.current = null;
      setIsListening(false);
      setVoiceMode(null);

      // direct "create message" shortcut -> dispatch a dedicated event
      if (transcript.includes('create message') || transcript.includes('create a message') || transcript.includes('record message')) {
        setStatusMessage('Opening message recorder...');
        // give a tiny delay for audio device to become free in some browsers
        setTimeout(() => window.dispatchEvent(new CustomEvent('create-message', { detail: { source: 'navbar' } })), 80);
        return;
      }

      // numeric play: digits
      const playMatch = transcript.match(/(?:play|open|watch|index|play number|play the)?\s*(\d{1,4})\b/);
      if (playMatch) {
        const idx = parseInt(playMatch[1], 10);
        if (!isNaN(idx) && idx > 0) {
          window.dispatchEvent(new CustomEvent('play-index', { detail: { index: idx } }));
          setStatusMessage(`Playing video #${idx}`);
          return;
        }
      }

      // word number after play
      let afterPlay = null;
      const afterPlayMatch = transcript.match(/(?:play|open|watch|index)(?:\s+the|\s+number)?\s+(.*)/);
      if (afterPlayMatch && afterPlayMatch[1]) afterPlay = afterPlayMatch[1];
      else afterPlay = transcript;
      const wordNumber = textNumberToInt(afterPlay);
      if (wordNumber && wordNumber > 0) {
        window.dispatchEvent(new CustomEvent('play-index', { detail: { index: wordNumber } }));
        setStatusMessage(`Playing video #${wordNumber}`);
        return;
      }

      // Shorts feed handles its own scroll voice commands; never start window scroll there.
      if (isShortsRoute && transcript.includes('scroll')) {
        return;
      }

      // --- scroll & speed commands (same logic) ---
      if (transcript.includes('stop scrolling') || transcript === 'stop' || transcript.includes('stop scroll') || transcript.includes('pause scrolling')) {
        stopScroll();
        return;
      }
      if (transcript.includes('jump to top') || transcript.includes('go to top') || transcript.includes('scroll to top')) {
        stopScroll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStatusMessage('Jumped to top');
        return;
      }
      if (transcript.includes('jump to bottom') || transcript.includes('go to bottom') || transcript.includes('scroll to bottom')) {
        stopScroll();
        const bottom = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight || 0);
        window.scrollTo({ top: bottom, behavior: 'smooth' });
        setStatusMessage('Jumped to bottom');
        return;
      }
      let speedMatch = transcript.match(/(?:set )?speed(?: to)?(?: is)?\s+(\d{2,5})/);
      if (!speedMatch) speedMatch = transcript.match(/\b(\d{2,5})\s*(px|pixels|per second|per sec|p\/s)\b/);
      if (speedMatch && speedMatch[1]) {
        const sp = parseInt(speedMatch[1], 10);
        if (!isNaN(sp)) { setAbsoluteSpeed(sp); return; }
      }
      if (transcript.includes('faster') || transcript.includes('increase speed') || transcript.includes('speed up')) { changeSpeedByFactor(1.5); return; }
      if (transcript.includes('slower') || transcript.includes('decrease speed') || transcript.includes('slow down')) { changeSpeedByFactor(0.66); return; }
      if (transcript.includes('scroll down') || transcript.includes('scroll up')) {
        const direction = transcript.includes('scroll down') ? 1 : -1;
        let duration = null;
        const durMatch = transcript.match(/for\s+(\d{1,4})\s*(seconds|second|secs|sec)/);
        if (durMatch) duration = parseInt(durMatch[1], 10);
        else if (transcript.includes('second') || transcript.includes('seconds')) {
          const tn = textNumberToInt(transcript);
          if (tn) duration = tn;
        }
        let explicitSpeed = null;
        const spMatch = transcript.match(/(?:at|with|speed)\s+(\d{2,5})/);
        if (spMatch && spMatch[1]) explicitSpeed = parseInt(spMatch[1], 10);
        startScroll(direction, explicitSpeed, duration);
        return;
      }
      if (transcript.startsWith('scroll') && !transcript.includes('play') && !transcript.includes('search')) {
        let duration = null;
        const durMatch2 = transcript.match(/for\s+(\d{1,4})\s*(seconds|second|secs|sec)/);
        if (durMatch2) duration = parseInt(durMatch2[1], 10);
        startScroll(1, null, duration);
        return;
      }

      // navigation/search commands
      if (transcript.includes('search')) {
        setStatusMessage("Record your search query");
        setMobileSearchOpen(true);
        startQueryRecognition();
        return;
      } else if (transcript.includes('login')) { navigate('/login'); return; }
      else if (transcript.includes('sign up') || transcript.includes('signup') || transcript.includes('register')) { navigate('/signup'); return; }
      else if (transcript.includes('upload') || transcript.includes('upload video') || transcript.includes('upload contract')) { navigate('/your_channel/upload_video'); return; }
      else if (transcript.includes('home')) { navigate('/home'); return; }
      else if (transcript.includes('shorts')) { navigate('/shorts'); return; }
      else if (transcript.includes('subscription')) { navigate('/subscriptions'); return; }
      else if (transcript.includes('history')) { navigate('/history'); return; }
      else if (transcript.includes('playlist')) { navigate('/playlist'); return; }
      else if (transcript.includes('like')) { navigate('/like'); return; }
      else if (transcript.includes('setting')) { navigate('/settings'); return; }
      else if (transcript.includes('edit channel') || transcript.includes('customize channel') || transcript.includes('edit my channel') || transcript.includes('customize my channel')) { navigate('/customize_channel'); return; }
      else if (transcript.includes('music')) { navigate('/music'); return; }
      else if (transcript.includes('trending')) { navigate('/trending'); return; }
      else if (transcript.includes('movies') || transcript.includes('movie')) { navigate('/movies'); return; }
      else if (transcript.includes('dashboard') || transcript.includes('profile') || transcript.includes('my channel') || transcript.includes('your channel')) { navigate('/your_channel'); return; }
      else if (transcript.includes('logout') || transcript.includes('sign out')) { handleSignOut(); return; }
      else if (transcript.includes('voice docs') || transcript.includes('voice command') || transcript.includes('voice command docs') || transcript.includes('docs')) { navigate('/docs'); return; }

      // fallback: broadcast recognized text
      // small delay to ensure recognition is fully stopped and audio is released
      setTimeout(() => window.dispatchEvent(new CustomEvent('voice-command', { detail: transcript })), 50);
      setStatusMessage(`Heard: "${transcriptRaw}"`);
    };

    recognition.onerror = (ev) => {
      console.error('recognition error', ev);
      setStatusMessage('Voice command recognition error.');
    };
    recognition.onend = () => {
      setIsListening(false);
      setVoiceMode(null);
      recognitionRef.current = null;
    };
    
    recognitionRef.current = recognition;
    try { recognition.start(); } catch (e) { console.error('start failed', e); }
  };

  const startQueryRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice search.');
      return;
    }
    setMobileSearchOpen(true);
    if (queryRecRef.current) {
      try { queryRecRef.current.abort(); } catch (e) { }
      queryRecRef.current = null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMode('query');
      try { searchInputRef.current?.focus(); } catch (e) { }
      queryRecRef.current = recognition;
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setSearchText(transcript);
      navigate(`/search/${encodeURIComponent(transcript)}`);
      setMobileSearchOpen(false);
    };
    recognition.onerror = (ev) => {
      console.error('query recognition error', ev);
    };
    recognition.onend = () => {
      setIsListening(false);
      setVoiceMode(null);
      queryRecRef.current = null;
    };
    queryRecRef.current = recognition;
    try { recognition.start(); } catch (e) { console.error('query start failed', e); }
  };

  const handleMicClick = () => {
    if (isListening) {
      if (voiceMode === 'query' && queryRecRef.current) {
        try { queryRecRef.current.stop(); } catch (e) { }
      }
      if (voiceMode === 'command' && recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      setIsListening(false);
      setVoiceMode(null);
      return;
    }
    startCommandRecognition();
  };

  useEffect(() => {
    if (!data || !data._id) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/account/userData/${data._id}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [data]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[500] w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-3 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100" aria-label="Toggle sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <Link to="/home" className="flex items-center">
              <h1 className="ml-2 text-2xl font-bold tracking-tight">
                <span className="hidden sm:inline text-red-600 m-0 p-0">⭕ </span>
                <span className="text-red-600">India</span>
                <span className="text-black">Tube</span>
              </h1>
            </Link>
          </div>

          <div className="hidden sm:flex flex-1 justify-center px-4">
            <form onSubmit={handleSearch} className="flex w-full max-w-xl">
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search"
                className="flex-grow border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500" aria-label="Search" />
              <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-full px-4 flex items-center justify-center hover:bg-gray-200" aria-label="Search">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="sm:hidden w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200" onClick={() => setMobileSearchOpen(true)} aria-label="Open search">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>

            <button type="button" onClick={handleMicClick} className="w-10 h-10 p-0 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
              title={isListening ? (voiceMode === 'query' ? 'Listening for search...' : 'Listening for command...') : 'Voice Command'} aria-label="Voice command">
              <svg xmlns="http://www.w3.org/2000/svg" fill={isListening ? 'red' : 'currentColor'} viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm0 0v4m0 0h3m-3 0H9" />
              </svg>
            </button>

            <Link to="/docs" className="hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-100 border mx-2">
              <FiFileText />
            </Link>

            <Link to="/your_channel/upload_video" className="hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-100 border mx-4">
              <FiUpload />
            </Link>

            <div className="relative hidden sm:block">
              {authStatus ? (
                <>
                  <button type="button" className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300" onClick={toggleDropdown} aria-haspopup="true" aria-expanded={dropdownVisible}>
                    {userdata ? <img className="w-8 h-8 rounded-full" src={userdata.avatar} alt="User" /> : <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />}
                  </button>

                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 text-base bg-white divide-y divide-gray-100 rounded shadow-lg">
                      <div className="px-4 py-3">
                        <p className="text-sm">{userdata?.name}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{userdata?.email}</p>
                      </div>
                      <ul className="py-1">
                        <li><Link to="/your_channel" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link></li>
                        <li><Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</Link></li>
                        <li><button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Sign out</button></li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => setDropdownVisible(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="fixed inset-x-0 top-0 z-40 p-3 bg-white shadow-md sm:hidden">
          <div className="flex items-center gap-2">
            <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="flex-grow flex items-center">
              <input ref={searchInputRef} type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500" aria-label="Mobile search input" />
            </form>

            <button type="button" onClick={() => {
              if (isListening && voiceMode === 'query' && queryRecRef.current) {
                try { queryRecRef.current.stop(); } catch (e) { }
              } else {
                startQueryRecognition();
              }
            }} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200" aria-label="Voice search"
              title={isListening ? (voiceMode === 'query' ? 'Listening for search...' : 'Listening...') : 'Voice Search'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill={isListening ? 'red' : 'currentColor'} viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm0 0v4m0 0h3m-3 0H9" />
              </svg>
            </button>

            <button type="button" onClick={() => setMobileSearchOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200" aria-label="Close search">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <div role="status" aria-live="polite" className="fixed right-4 top-20 z-50 px-4 py-2 bg-red-600 text-white text-sm rounded-lg shadow-lg">
          {statusMessage}
        </div>
      )}
    </nav>
  );
}

export default Navbar;



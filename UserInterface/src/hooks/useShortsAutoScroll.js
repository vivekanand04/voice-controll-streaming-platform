import { useCallback, useEffect, useRef, useState } from "react";

export const getShortsScrollAction = (command) => {
  const text = String(command || "").toLowerCase().trim();
  if (!text) return null;

  if (
    text.includes("stop scrolling") ||
    text.includes("stop scroll") ||
    text.includes("pause scrolling")
  ) {
    return "stop";
  }
  if (
    text.includes("scroll one") ||
    text.includes("scroll 1") ||
    /\bscroll\s+won\b/.test(text)
  ) {
    return "scroll-one";
  }
  if (text.includes("scroll down")) return "scroll-down";
  if (text.includes("scroll up")) return "scroll-up";

  return null;
};

const CONTINUOUS_PAUSE_MS = 500;
const SCROLL_ONE_START_TIMEOUT_MS = 1500;

const createIdleState = (sessionId = 0) => ({
  active: false,
  mode: null,
  awaitingPlayback: false,
  watchShortId: null,
  lastIndex: -1,
  sessionId,
  pendingStart: false,
});

function useShortsAutoScroll({
  feedRef,
  itemRefs,
  activeId,
  activeIndex,
  shortsLength,
  goNext,
  goPrevious,
}) {
  const [autoScrollNotice, setAutoScrollNotice] = useState("");
  const delayTimerRef = useRef(null);
  const scrollOneStartTimerRef = useRef(null);
  const stateRef = useRef(createIdleState());

  const clearContinuousDelay = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
  }, []);

  const clearScrollOneStartTimer = useCallback(() => {
    if (scrollOneStartTimerRef.current) {
      clearTimeout(scrollOneStartTimerRef.current);
      scrollOneStartTimerRef.current = null;
    }
  }, []);

  const isAtLastShort = useCallback(
    (index = activeIndex) => shortsLength > 0 && index >= shortsLength - 1,
    [activeIndex, shortsLength]
  );

  const isAtFirstShort = useCallback(
    (index = activeIndex) => index <= 0,
    [activeIndex]
  );

  const stopAutoScroll = useCallback(
    (message) => {
      const wasActive = stateRef.current.active;
      clearContinuousDelay();
      clearScrollOneStartTimer();
      stateRef.current = createIdleState(stateRef.current.sessionId + 1);
      if (wasActive && message) setAutoScrollNotice(message);
      return wasActive;
    },
    [clearContinuousDelay, clearScrollOneStartTimer]
  );

  const armScrollOneWatch = useCallback(
    (shortId) => {
      const state = stateRef.current;
      if (!state.active || state.mode !== "one" || !shortId) return;
      state.awaitingPlayback = true;
      state.watchShortId = shortId;
    },
    []
  );

  const scheduleContinuousAdvance = useCallback(
    (direction) => {
      clearContinuousDelay();
      delayTimerRef.current = setTimeout(() => {
        delayTimerRef.current = null;
        const state = stateRef.current;
        if (!state.active || state.mode !== direction) return;

        if (direction === "down") {
          if (isAtLastShort()) {
            stopAutoScroll();
            return;
          }
          const moved = goNext();
          if (!moved) stopAutoScroll();
          return;
        }

        if (isAtFirstShort()) {
          stopAutoScroll();
          return;
        }
        const moved = goPrevious();
        if (!moved) stopAutoScroll();
      }, CONTINUOUS_PAUSE_MS);
    },
    [clearContinuousDelay, goNext, goPrevious, isAtFirstShort, isAtLastShort, stopAutoScroll]
  );

  const startContinuous = useCallback(
    (direction) => {
      stopAutoScroll();
      if (shortsLength === 0) return;

      if (direction === "down" && isAtLastShort()) return;
      if (direction === "up" && isAtFirstShort()) return;

      stateRef.current = {
        active: true,
        mode: direction,
        awaitingPlayback: false,
        watchShortId: null,
        lastIndex: activeIndex,
        sessionId: stateRef.current.sessionId + 1,
      };

      const moved = direction === "down" ? goNext() : goPrevious();
      if (!moved) stopAutoScroll();
      return moved;
    },
    [activeIndex, goNext, goPrevious, isAtFirstShort, isAtLastShort, shortsLength, stopAutoScroll]
  );

  const startScrollOne = useCallback(() => {
    stopAutoScroll();
    if (shortsLength === 0 || !activeId || activeIndex < 0) return false;

    stateRef.current = {
      active: false,
      mode: "one",
      awaitingPlayback: true,
      watchShortId: activeId,
      lastIndex: activeIndex,
      sessionId: stateRef.current.sessionId + 1,
      pendingStart: true,
    };

    const sessionId = stateRef.current.sessionId;
    window.dispatchEvent(new CustomEvent("shorts-play"));
    clearScrollOneStartTimer();
    scrollOneStartTimerRef.current = setTimeout(() => {
      scrollOneStartTimerRef.current = null;
      const state = stateRef.current;
      if (
        state.mode === "one" &&
        state.sessionId === sessionId &&
        state.pendingStart &&
        state.watchShortId === activeId
      ) {
        stopAutoScroll();
      }
    }, SCROLL_ONE_START_TIMEOUT_MS);
    return true;
  }, [activeId, activeIndex, clearScrollOneStartTimer, shortsLength, stopAutoScroll]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state.active) return;
    if (activeIndex === state.lastIndex) return;

    state.lastIndex = activeIndex;

    if (state.mode === "down") {
      if (isAtLastShort()) {
        stopAutoScroll();
        return;
      }
      scheduleContinuousAdvance("down");
      return;
    }

    if (state.mode === "up") {
      if (isAtFirstShort()) {
        stopAutoScroll();
        return;
      }
      scheduleContinuousAdvance("up");
      return;
    }

    if (state.mode === "one") {
      if (!state.active && state.pendingStart) return;
      armScrollOneWatch(activeId);
      return;
    }
  }, [
    activeId,
    activeIndex,
    armScrollOneWatch,
    isAtFirstShort,
    isAtLastShort,
    scheduleContinuousAdvance,
    stopAutoScroll,
  ]);

  useEffect(() => {
    const onPlaybackRunning = (event) => {
      const state = stateRef.current;
      if (state.mode !== "one" || !state.awaitingPlayback) return;
      if (!event.detail?.shortId || event.detail.shortId !== state.watchShortId) return;
      if (!state.pendingStart && state.active) return;

      clearScrollOneStartTimer();
      state.pendingStart = false;
      state.active = true;
    };

    const onPlaybackComplete = (event) => {
      const state = stateRef.current;
      if (!state.active || state.mode !== "one" || !state.awaitingPlayback) return;
      if (!event.detail?.shortId || event.detail.shortId !== state.watchShortId) return;

      clearScrollOneStartTimer();
      state.awaitingPlayback = false;
      state.watchShortId = null;
      state.pendingStart = false;
      const sessionId = state.sessionId;

      if (isAtLastShort()) {
        stopAutoScroll();
        return;
      }

      const moved = goNext();
      if (stateRef.current.sessionId !== sessionId) return;
      if (!moved) stopAutoScroll();
    };

    window.addEventListener("shorts-playback-running", onPlaybackRunning);
    window.addEventListener("shorts-playback-complete", onPlaybackComplete);
    return () => {
      window.removeEventListener("shorts-playback-running", onPlaybackRunning);
      window.removeEventListener("shorts-playback-complete", onPlaybackComplete);
    };
  }, [clearScrollOneStartTimer, goNext, isAtLastShort, stopAutoScroll]);

  useEffect(() => {
    const onCommand = (event) => {
      const action = event.detail?.action || getShortsScrollAction(event.detail);
      let accepted = false;
      if (action === "stop") accepted = stopAutoScroll("Auto-scroll stopped");
      else if (action === "scroll-down") accepted = startContinuous("down");
      else if (action === "scroll-up") accepted = startContinuous("up");
      else if (action === "scroll-one") accepted = startScrollOne();

      if (event.detail && typeof event.detail === "object") {
        event.detail.accepted = Boolean(accepted);
        event.detail.active = stateRef.current.active;
        event.detail.mode = stateRef.current.mode;
      }
    };

    window.addEventListener("shorts-scroll-command", onCommand);
    return () => window.removeEventListener("shorts-scroll-command", onCommand);
  }, [startContinuous, startScrollOne, stopAutoScroll]);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return undefined;

    const onManualInterrupt = () => {
      if (stateRef.current.active) {
        stopAutoScroll("Auto-scroll paused: manually interrupted.");
      }
    };

    feed.addEventListener("wheel", onManualInterrupt, { passive: true });
    feed.addEventListener("touchstart", onManualInterrupt, { passive: true });

    return () => {
      feed.removeEventListener("wheel", onManualInterrupt);
      feed.removeEventListener("touchstart", onManualInterrupt);
    };
  }, [feedRef, stopAutoScroll]);

  useEffect(() => {
    if (!autoScrollNotice) return undefined;
    const timeoutId = setTimeout(() => setAutoScrollNotice(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [autoScrollNotice]);

  useEffect(
    () => () => {
      clearContinuousDelay();
      clearScrollOneStartTimer();
      stopAutoScroll();
    },
    [clearContinuousDelay, clearScrollOneStartTimer, stopAutoScroll]
  );

  return { autoScrollNotice, stopAutoScroll };
}

export default useShortsAutoScroll;

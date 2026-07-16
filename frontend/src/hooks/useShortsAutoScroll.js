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

const createIdleState = (sessionId = 0) => ({
  active: false,
  mode: null,
  awaitingPlayback: false,
  watchShortId: null,
  lastIndex: -1,
  sessionId,
});

function useShortsAutoScroll({
  feedRef,
  activeId,
  activeIndex,
  shortsLength,
  goNext,
  goPrevious,
}) {
  const [autoScrollNotice, setAutoScrollNotice] = useState("");
  const delayTimerRef = useRef(null);
  const stateRef = useRef(createIdleState());

  const clearContinuousDelay = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
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
      stateRef.current = createIdleState(stateRef.current.sessionId + 1);
      if (wasActive && message) setAutoScrollNotice(message);
      return wasActive;
    },
    [clearContinuousDelay]
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
    if (shortsLength === 0 || !activeId || activeIndex < 0 || isAtLastShort()) {
      return { accepted: false, started: Promise.resolve(false) };
    }

    const moved = goNext();
    if (!moved) return { accepted: false, started: Promise.resolve(false) };

    stateRef.current = createIdleState(stateRef.current.sessionId + 1);
    return { accepted: true, started: Promise.resolve(true) };
  }, [activeId, activeIndex, goNext, isAtLastShort, shortsLength, stopAutoScroll]);

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

  }, [
    activeId,
    activeIndex,
    isAtFirstShort,
    isAtLastShort,
    scheduleContinuousAdvance,
    stopAutoScroll,
  ]);

  useEffect(() => {
    const onCommand = (event) => {
      const action = event.detail?.action || getShortsScrollAction(event.detail);
      let accepted = false;
      if (action === "stop") accepted = stopAutoScroll("Auto-scroll stopped");
      else if (action === "scroll-down") accepted = startContinuous("down");
      else if (action === "scroll-up") accepted = startContinuous("up");
      else if (action === "scroll-one") {
        const result = startScrollOne();
        accepted = result.accepted;
        if (event.detail && typeof event.detail === "object") {
          event.detail.started = result.started;
        }
      }

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
      stopAutoScroll();
    },
    [clearContinuousDelay, stopAutoScroll]
  );

  return { autoScrollNotice, stopAutoScroll };
}

export default useShortsAutoScroll;

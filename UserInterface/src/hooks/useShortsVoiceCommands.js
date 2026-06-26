import { useEffect } from "react";

export const getShortsVoiceAction = (command) => {
  const text = String(command || "").toLowerCase().trim();
  if (!text) return null;

  if (text.includes("unmute") || text.includes("un mute") || text.includes("un-mute")) return "unmute";
  if (text.includes("mute")) return "mute";
  if (text.includes("pause") || text === "stop" || text.includes("stop short")) return "pause";
  if (text.includes("play") || text.includes("resume")) return "play";
  if (text === "like" || text === "like video" || text === "thumbs up"||text==="live") return "like";
  if (
    text === "comment" ||
    text === "comments" ||
    text === "message" ||
    text === "messages" ||
    text.includes("open comments") ||
    text.includes("create comment") ||
    text.includes("create message")
  ) {
    return "comment";
  }

  return null;
};

function useShortsVoiceCommands({ enabled = true, onPlay, onPause, onMute, onUnmute, onLike, onComment }) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handleCommand = (event) => {
      const detail = event?.detail ?? event;
      const command = typeof detail === "string" ? detail : detail?.text || detail?.transcript || "";
      const action = getShortsVoiceAction(command);

      if (action === "play") onPlay?.();
      if (action === "pause") onPause?.();
      if (action === "mute") onMute?.();
      if (action === "unmute") onUnmute?.();
      if (action === "like") onLike?.();
      if (action === "comment") onComment?.();
    };

    window.addEventListener("voice-command", handleCommand);
    window.addEventListener("shorts-voice-command", handleCommand);

    return () => {
      window.removeEventListener("voice-command", handleCommand);
      window.removeEventListener("shorts-voice-command", handleCommand);
    };
  }, [enabled, onComment, onLike, onMute, onPause, onPlay, onUnmute]);
}

export default useShortsVoiceCommands;

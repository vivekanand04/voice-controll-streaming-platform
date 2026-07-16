import { useEffect } from "react";

export const getShortsVoiceAction = (command) => {
  const text = String(command || "").toLowerCase().trim();
  if (!text) return null;

  if (text.includes("unmute") || text.includes("un mute") || text.includes("un-mute")) return "unmute";
  if (text.includes("mute")) return "mute";
  if (text.includes("pause") || text === "stop" || text.includes("stop short")) return "pause";
  if (text.includes("play") || text.includes("resume")) return "play";
  if (text === "like" || text === "like video" || text === "thumbs up"||text==="live") return "like";
  if (/\b(?:open|show)\s+(?:comment|comments|message|messages)\b/.test(text)) return "open-comments";
  if (/\b(?:close|hide)\s+(?:comment|comments|message|messages)\b/.test(text)) return "close-comments";
  if (text.includes("create comment") || text.includes("create message")) return "create-comment";
  if (text === "comment" || text === "comments" || text === "message" || text === "messages") return "create-comment";

  return null;
};

function useShortsVoiceCommands({
  enabled = true,
  onPlay,
  onPause,
  onMute,
  onUnmute,
  onLike,
  onComment,
  onCreateComment,
  onOpenComments,
  onCloseComments,
}) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handleCommand = (event) => {
      const detail = event?.detail ?? event;
      const command = typeof detail === "string" ? detail : detail?.text || detail?.transcript || "";
      const action = typeof detail === "object" && detail?.action ? detail.action : getShortsVoiceAction(command);

      if (action === "play") onPlay?.();
      if (action === "pause") onPause?.();
      if (action === "mute") onMute?.();
      if (action === "unmute") onUnmute?.();
      if (action === "like") onLike?.();
      if (action === "create-comment") (onCreateComment || onComment)?.();
      if (action === "open-comments") onOpenComments?.();
      if (action === "close-comments") onCloseComments?.();
    };

    window.addEventListener("voice-command", handleCommand);
    window.addEventListener("shorts-voice-command", handleCommand);

    return () => {
      window.removeEventListener("voice-command", handleCommand);
      window.removeEventListener("shorts-voice-command", handleCommand);
    };
  }, [
    enabled,
    onCloseComments,
    onComment,
    onCreateComment,
    onLike,
    onMute,
    onOpenComments,
    onPause,
    onPlay,
    onUnmute,
  ]);
}

export default useShortsVoiceCommands;

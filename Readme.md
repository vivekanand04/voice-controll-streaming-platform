
**IndiaTube** is a next-generation video streaming experience built around natural voice control. Every common action — playing, pausing, seeking, changing speed, toggling fullscreen or picture-in-picture, opening comments and even posting short voice comments — can be performed by speaking plain English. The navbar listens for global commands and forwards them to the player so you can navigate the site hands-free. IndiaTube is designed for accessibility and speed: voice search finds content instantly, voice comments let you post feedback in under 10 seconds, and publishing/upload actions are available via spoken commands. If you prefer, use the quick command reference below to learn exact phrases and expected behavior.


Live : https://voice-controll-streaming-platform.onrender.com

## Command Reference

**How to use:** say a phrase similar to the examples below. Short pauses and clear pronunciation improve recognition. Commands are case-insensitive and support numeric words (e.g., “three”, “ten seconds”).

---

### Backward / Rewind
- **Examples:** `backward 10`, `rewind 5 seconds`, `skip back`  
- **Function:** Seeks the current video backward by the specified number of seconds (defaults to 10s if unspecified).

### Create message (voice comment)
- **Examples:** `create message`, `record message`  
- **Function:** Opens a short (~10s) voice recorder, converts speech to text, and posts the comment to the video.

### Forward / Skip forward
- **Examples:** `forward 10`, `forward ten seconds`, `skip forward 30`  
- **Function:** Seeks forward by the specified seconds (supports digits or words).

### Fullscreen / Exit fullscreen
- **Examples:** `fullscreen`, `exit fullscreen`  
- **Function:** Toggles fullscreen for the video player.

### Login / Signup / Logout
- **Examples:** `login`, `signup`, `logout`, `sign out`  
- **Function:** Opens authentication pages or logs the user out.

### Mute / Unmute
- **Examples:** `mute`, `unmute`  
- **Function:** Toggles the audio mute state.

### Navigate (pages)
- **Examples:** `go home`, `open settings`, `open history`, `open subscriptions`  
- **Function:** Navigates the site to the requested page.

### Open / Close comments
- **Examples:** `open comments`, `close comments`  
- **Function:** Opens or closes the comments UI.

### Pause / Stop
- **Examples:** `pause`, `stop`  
- **Function:** Pauses playback immediately.

### Picture-in-Picture (PIP)
- **Examples:** `picture in picture`, `pip`  
- **Function:** Toggles Picture-in-Picture mode if the browser supports it.

### Play
- **Examples:** `play`, `play video`  
- **Function:** Starts or resumes playback.

### Play index
- **Examples:** `play 3`, `play three`, `open 2`  
- **Function:** Opens a recommended video by 1-based index (useful for the recommended list).

### Resume
- **Examples:** `resume`  
- **Function:** Resumes playback (useful after pause/stop).

### Search (start voice query)
- **Examples:** `search for funny cats`, `search avengers trailer`  
- **Function:** Opens voice search input, collects your query, and runs the site search.

### Speed controls
- **Examples:** `slow`, `normal`, `double`, `faster`  
- **Function:** Adjusts playbackRate (e.g., 0.5, 1, 2, or incremental changes).

### Toggle like (thumbs up)
- **Examples:** `thumbs up`, `toggle thumbs`, `like`  
- **Function:** Likes or unlikes the current video.

### Toggle subscribe
- **Examples:** `toggle subscribe`, `subscribe`  
- **Function:** Subscribes or unsubscribes to the current channel.

### Upload
- **Examples:** `upload`, `upload video`  
- **Function:** Navigates to the upload page to add new content.

### Volume decrease
- **Examples:** `decrease volume`, `volume down`  
- **Function:** Lowers playback volume by a small step.

### Volume increase
- **Examples:** `increase volume`, `volume up`  
- **Function:** Raises playback volume by a small step.

---

## Notes
- The navbar listens for global commands and broadcasts events like `play-index` and `voice-command` to the video player.  
- Playback and comment creation are handled by the video page component; navigation commands are handled by the app/router.  
- For best recognition: speak clearly, avoid background noise, and pause briefly before and after the command.

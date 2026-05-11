import React, { useState } from 'react'
import { FiSpeaker } from 'react-icons/fi'

const COMMANDS = [
  { id: 1, command: 'Backward / Rewind', examples: ['backward 10', 'rewind 5 seconds', 'skip back'], action: 'Seeks backward' },
  { id: 2, command: 'Create message (voice comment)', examples: ['create message', 'record message'], action: 'Starts a short 10s recorder and posts comment' },
  { id: 3, command: 'Forward / Skip forward', examples: ['forward 10', 'forward ten seconds', 'skip forward 30'], action: 'Seeks forward (supports numeric or word seconds)' },
  { id: 4, command: 'Fullscreen / Exit fullscreen', examples: ['fullscreen', 'exit fullscreen'], action: 'Enter or exit fullscreen' },
  { id: 5, command: 'Login / Signup / Logout', examples: ['login', 'signup', 'logout', 'sign out'], action: 'Opens auth pages or logs user out' },
  { id: 6, command: 'Mute / Unmute', examples: ['mute', 'unmute'], action: 'Toggles mute state' },
  { id: 7, command: 'Navigate (pages)', examples: ['go home', 'open settings', 'open history', 'open subscriptions'], action: 'Navigates to app pages' },
  { id: 8, command: 'Open / Close comments', examples: ['open comments', 'close comments'], action: 'Opens or closes comments UI' },
  { id: 9, command: 'Pause / Stop', examples: ['pause', 'stop'], action: 'Pauses the current video' },
  { id: 10, command: 'Picture-in-Picture (PIP)', examples: ['picture in picture', 'pip'], action: 'Toggle pip mode if supported' },
  { id: 11, command: 'Play', examples: ['play', 'play video', 'play'], action: 'Plays the current video if paused' },
  { id: 12, command: 'Play index', examples: ['play 3', 'play three', 'open 2'], action: 'Opens the recommended video by index (1-based)' },
  { id: 13, command: 'Resume', examples: ['resume'], action: 'Resumes playback' },
  { id: 14, command: 'Search (start voice query)', examples: ['search for funny cats', 'search avengers trailer'], action: 'Opens voice-search input and runs search' },
  { id: 15, command: 'Speed controls', examples: ['slow', 'normal', 'double', 'faster'], action: 'Adjusts playbackRate (0.5, 1, 2, etc.)' },
  { id: 16, command: 'Toggle like (thumbs up)', examples: ['thumbs up', 'toggle thumbs', 'like'], action: 'Likes or unlikes the current video' },
  { id: 17, command: 'Toggle subscribe', examples: ['toggle subscribe', 'subscribe'], action: 'Subscribes/unsubscribes to channel' },
  { id: 18, command: 'Upload', examples: ['upload', 'upload video'], action: 'Navigate to upload page' },
  { id: 19, command: 'Volume decrease', examples: ['decrease volume', 'volume down'], action: 'Lowers volume slightly' },
  { id: 20, command: 'Volume increase', examples: ['increase volume', 'volume up'], action: 'Raises volume slightly' }
]

COMMANDS.sort((a, b) => a.command.localeCompare(b.command));

export default function VoiceCommandsDocs() {
  const [filter, setFilter] = useState('')
  const list = COMMANDS.filter(c => {
    const q = filter.trim().toLowerCase()
    if (!q) return true
    return (c.command + ' ' + c.examples.join(' ') + ' ' + c.action).toLowerCase().includes(q)
  })
  return (
    <div className="p-6 mt-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-full">
            <FiSpeaker className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Voice Commands — Quick Reference</h1>
            <p className="text-sm text-gray-500">Use this table to learn available voice commands and their behavior.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input value={filter} onChange={(e)=>setFilter(e.target.value)} placeholder="Filter commands..." className="flex-1 border rounded px-3 py-2" />
        </div>

        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Prefix</th>
                <th className="px-3 py-2 text-left">Command variety</th>
                <th className="px-3 py-2 text-left">What it does</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 align-top font-medium">{item.command}</td>
                  <td className="px-3 py-2 align-top">{item.examples.map((ex, i)=> <div key={i} className="whitespace-nowrap">{ex}</div>)}</td>
                  <td className="px-3 py-2 align-top">{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <div className="mb-2">Notes:</div>
          <ul className="list-disc ml-5 space-y-1">
            <li>Navbar listens for global commands and broadcasts events like <code>play-index</code> and <code>voice-command</code>.</li>
            <li>Video page handles most playback-related commands and comment creation.</li>
            <li>Use the filter box to quickly find commands.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

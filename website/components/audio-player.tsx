"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  audioUrl: string
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100) // now represents % (0–400)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Setup Web Audio Boost
    audioCtxRef.current = new AudioContext()
    const source = audioCtxRef.current.createMediaElementSource(audio)

    const gainNode = audioCtxRef.current.createGain()
    gainNode.gain.setValueAtTime(1, audioCtxRef.current.currentTime)

    source.connect(gainNode).connect(audioCtxRef.current.destination)
    gainNodeRef.current = gainNode

    // Event listeners
    const updateDuration = () => setDuration(audio.duration)
    const updateTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
      audioCtxRef.current?.resume()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) audioRef.current.currentTime = newTime
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value)
    setVolume(newVol)

    // Map 0–400 slider → gain 0–4.0
    const gain = newVol / 100

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = gain
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} />

      {/* Playback Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={togglePlayPause}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
          size="icon"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>

        {/* Progress Bar */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full"
          />
        </div>

        <div className="text-sm text-slate-600 min-w-16 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Volume (Now goes up to 400%!) */}git remote set-url origin
      <div className="flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-slate-600" />
        <input
          type="range"
          min="0"
          max="400"  // !!! LOUD !!!
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1"
        />
        <span className="text-sm text-slate-600 min-w-10">{volume}%</span>
      </div>
    </div>
  )
}

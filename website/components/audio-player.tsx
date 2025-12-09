"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  audioUrl: string
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 1

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

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
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
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

      {/* Play/Pause Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={togglePlayPause}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
          size="icon"
          aria-label={isPlaying ? "Pause" : "Play"}
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
            className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Audio progress"
          />
        </div>

        {/* Time Display */}
        <div className="text-sm text-slate-600 font-mono min-w-12 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-slate-600" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          aria-label="Volume"
        />
        <span className="text-sm text-slate-600 min-w-8">{volume}%</span>
      </div>
    </div>
  )
}

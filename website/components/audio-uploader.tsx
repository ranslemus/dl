"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Music } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioUploaderProps {
  onAudioSelect: (file: File) => void
}

export function AudioUploader({ onAudioSelect }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED_FORMATS = "audio/mpeg,audio/wav,audio/ogg,audio/mp4"

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("audio/")) {
        onAudioSelect(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onAudioSelect(files[0])
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200",
        isDragging ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400",
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload audio file"
      />

      <div className="space-y-4">
        <div className="flex justify-center">
          {isDragging ? (
            <Music className="w-12 h-12 text-blue-600 animate-bounce" />
          ) : (
            <Upload className="w-12 h-12 text-slate-400" />
          )}
        </div>

        <div>
          <p className="text-lg font-semibold text-slate-900 mb-1">
            {isDragging ? "Drop your audio here" : "Drag audio file here or click to upload"}
          </p>
          <p className="text-sm text-slate-500">MP3, WAV, OGG or M4A</p>
        </div>
      </div>
    </div>
  )
}

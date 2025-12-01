"use client"

import { useState } from "react"
import { AudioUploader } from "@/components/audio-uploader"
import { AudioPlayer } from "@/components/audio-player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AudioWaveform as Waveform, CheckCircle, AlertCircle } from "lucide-react"

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [emotionResult, setEmotionResult] = useState<{
    emotion: string
    confidence: number
    allPredictions?: Record<string, number>
  } | null>(null)
  const [error, setError] = useState<string>("")

  const handleAudioSelect = (file: File) => {
    setAudioFile(file)
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    setError("")
    setEmotionResult(null)
  }

  const handleProcess = async () => {
    if (!audioFile) return

    setIsProcessing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("audio", audioFile)

      console.log("[v0] Sending audio file to API:", audioFile.name)

      const response = await fetch("/api/analyze-emotions", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        const errorMsg = errorData.details ? `${errorData.error} - ${errorData.details}` : errorData.error
        throw new Error(errorMsg)
      }

      const data = await response.json()
      console.log("[v0] Received prediction:", data)

      setEmotionResult({
        emotion: data.emotion,
        confidence: typeof data.confidence === "string" ? Number.parseFloat(data.confidence) / 100 : data.confidence,
        allPredictions: data.allPredictions,
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      setError(errorMsg)
      console.error("[v0] Error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waveform className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Speech Emotion Recognition</h1>
          </div>
          <p className="text-slate-600 text-lg">Analyze emotions in speech with advanced AI technology</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Upload Section */}
          <Card className="bg-white border-slate-200 p-8 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-blue-600">Upload Audio</h2>
              <AudioUploader onAudioSelect={handleAudioSelect} />

              {audioFile && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-2">Selected file:</p>
                  <p className="font-mono text-slate-900 mb-4 break-all">{audioFile.name}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Audio Player Section */}
          {audioUrl && (
            <Card className="bg-white border-slate-200 p-8 shadow-sm">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-600">Preview Audio</h2>
                <AudioPlayer audioUrl={audioUrl} />
              </div>
            </Card>
          )}

          {/* Process Button */}
          {audioFile && (
            <Card className="bg-blue-50 border-blue-200 p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Ready to Analyze</h3>
                  <p className="text-slate-600">Click the button to start emotion detection</p>
                </div>
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
                >
                  {isProcessing ? "Processing..." : "Analyze Emotion"}
                </Button>
              </div>
            </Card>
          )}

          {error && (
            <Card className="bg-red-50 border-red-200 p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-1">Analysis Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {emotionResult && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Emotion Detected</h3>
                  <p className="text-slate-700 mb-1">
                    <span className="font-bold text-green-700 text-xl capitalize">{emotionResult.emotion}</span>
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${emotionResult.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Confidence: {(emotionResult.confidence * 100).toFixed(1)}%
                  </p>

                  {emotionResult.allPredictions && (
                    <div className="mt-6 pt-6 border-t border-green-200">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">All Emotions</h4>
                      <div className="space-y-2">
                        {Object.entries(emotionResult.allPredictions)
                          .sort(([, a], [, b]) => b - a)
                          .map(([emotion, confidence]) => (
                            <div key={emotion} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 capitalize">{emotion}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-slate-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{ width: `${(confidence as number) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-500 w-10 text-right">
                                  {((confidence as number) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Info Section */}
          <Card className="bg-white border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Supported Emotions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["neutral", "calm", "happy", "sad", "angry", "fearful", "disgust", "surprised"].map((emotion) => (
                <div
                  key={emotion}
                  className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center text-slate-700 capitalize font-medium"
                >
                  {emotion}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

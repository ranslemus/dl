"use client"

import { useState, useCallback } from "react"
import { ImageUpload } from "@/components/image-upload"
import { ClassificationResults } from "@/components/classification-results"
import { ModelSelector } from "@/components/model-selector"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"

export interface ClassificationResult {
  label: string
  confidence: number
  description?: string
}

export interface ModelConfig {
  id: string
  name: string
  description: string
  endpoint: string
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [results, setResults] = useState<ClassificationResult[]>([])
  const [isClassifying, setIsClassifying] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelConfig | null>(null)

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setResults([]) // Clear previous results
  }, [])

  const handleClassify = useCallback(async () => {
    if (!selectedImage || !selectedModel) return

    setIsClassifying(true)

    try {
      // Simulate API call to classification model
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock results - replace with actual API call
      const mockResults: ClassificationResult[] = [
        { label: "Golden Retriever", confidence: 0.94, description: "Large breed dog with golden coat" },
        { label: "Labrador Retriever", confidence: 0.78, description: "Medium to large breed working dog" },
        { label: "German Shepherd", confidence: 0.65, description: "Large breed herding dog" },
        { label: "Border Collie", confidence: 0.43, description: "Medium breed herding dog" },
        { label: "Beagle", confidence: 0.21, description: "Medium breed hound dog" },
      ]

      setResults(mockResults)
    } catch (error) {
      console.error("Classification failed:", error)
    } finally {
      setIsClassifying(false)
    }
  }, [selectedImage, selectedModel])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Model Selection */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4">Select Classification Model</h2>
              <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4">Upload Image</h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                imagePreview={imagePreview}
                onClassify={handleClassify}
                isClassifying={isClassifying}
                canClassify={!!(selectedImage && selectedModel)}
              />
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold text-card-foreground mb-4">Classification Results</h2>
              <ClassificationResults results={results} isLoading={isClassifying} modelName={selectedModel?.name} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

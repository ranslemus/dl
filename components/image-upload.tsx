"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedImage: File | null
  imagePreview: string | null
  onClassify: () => void
  isClassifying: boolean
  canClassify: boolean
}

export function ImageUpload({
  onImageSelect,
  selectedImage,
  imagePreview,
  onClassify,
  isClassifying,
  canClassify,
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0])
      }
    },
    [onImageSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          selectedImage && "border-primary bg-primary/5",
        )}
      >
        <input {...getInputProps()} />

        {imagePreview ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-48 h-48 rounded-lg overflow-hidden">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Selected image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-card-foreground">{selectedImage?.name}</p>
              <p>{(selectedImage?.size || 0 / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-card-foreground">
                {isDragActive ? "Drop image here" : "Upload an image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop or click to select • JPEG, PNG, GIF, WebP
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <Button onClick={onClassify} disabled={!canClassify || isClassifying} className="w-full" size="lg">
          {isClassifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Classifying Image...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              Classify Image
            </>
          )}
        </Button>
      )}
    </div>
  )
}

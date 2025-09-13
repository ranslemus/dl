"use client"

import { Loader2, Target, TrendingUp, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { ClassificationResult } from "@/app/page"

interface ClassificationResultsProps {
  results: ClassificationResult[]
  isLoading: boolean
  modelName?: string
}

export function ClassificationResults({ results, isLoading, modelName }: ClassificationResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="font-medium text-card-foreground">Processing Image</p>
          <p className="text-sm text-muted-foreground">{modelName} is analyzing your image...</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-card-foreground">No Results Yet</p>
          <p className="text-sm text-muted-foreground">
            Upload an image and select a model to see classification results
          </p>
        </div>
      </div>
    )
  }

  const topResult = results[0]
  const otherResults = results.slice(1)

  return (
    <div className="space-y-6">
      {/* Model Info */}
      {modelName && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Classified using {modelName}</span>
        </div>
      )}

      {/* Top Result */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-card-foreground">{topResult.label}</h3>
            {topResult.description && <p className="text-sm text-muted-foreground mt-1">{topResult.description}</p>}
          </div>
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            <TrendingUp className="w-3 h-3 mr-1" />
            Top Match
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium text-card-foreground">{(topResult.confidence * 100).toFixed(1)}%</span>
          </div>
          <Progress value={topResult.confidence * 100} className="h-2" />
        </div>
      </Card>

      {/* Other Results */}
      {otherResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-card-foreground">Other Possibilities</h4>
          {otherResults.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="font-medium text-card-foreground">{result.label}</h5>
                  {result.description && <p className="text-xs text-muted-foreground mt-1">{result.description}</p>}
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={result.confidence * 100} className="h-1" />
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card className="p-4 bg-muted/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-card-foreground">{results.length}</p>
            <p className="text-xs text-muted-foreground">Classifications</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{(topResult.confidence * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Best Match</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

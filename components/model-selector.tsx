"use client"
import { Check, ChevronDown, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ModelConfig } from "@/app/page"

interface ModelSelectorProps {
  selectedModel: ModelConfig | null
  onModelSelect: (model: ModelConfig) => void
}

const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "resnet50",
    name: "ResNet-50",
    description: "Deep residual network for general image classification",
    endpoint: "/api/models/resnet50",
  },
  {
    id: "efficientnet",
    name: "EfficientNet-B7",
    description: "Efficient convolutional neural network with high accuracy",
    endpoint: "/api/models/efficientnet",
  },
  {
    id: "vit",
    name: "Vision Transformer",
    description: "Transformer-based model for advanced image understanding",
    endpoint: "/api/models/vit",
  },
  {
    id: "mobilenet",
    name: "MobileNet-V3",
    description: "Lightweight model optimized for mobile deployment",
    endpoint: "/api/models/mobilenet",
  },
]

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-auto p-4 bg-transparent">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">{selectedModel ? selectedModel.name : "Select a model"}</p>
                {selectedModel && <p className="text-sm text-muted-foreground">{selectedModel.description}</p>}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80">
          {AVAILABLE_MODELS.map((model) => (
            <DropdownMenuItem key={model.id} onClick={() => onModelSelect(model)} className="p-4 cursor-pointer">
              <div className="flex items-start space-x-3 w-full">
                <div className="flex-shrink-0 mt-1">
                  {selectedModel?.id === model.id ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{model.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedModel && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start space-x-3">
            <Cpu className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm text-card-foreground">{selectedModel.name} Selected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for image classification • Endpoint: {selectedModel.endpoint}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

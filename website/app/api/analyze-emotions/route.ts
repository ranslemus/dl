import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the audio file from the request
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const pythonFormData = new FormData()
    pythonFormData.append("file", audioFile)

    const backendUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000"

    console.log("[v0] Attempting to fetch from backend:", backendUrl)
    console.log("[v0] Form data prepared with file:", audioFile.name, audioFile.size, "bytes")

    const backendResponse = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      body: pythonFormData,
    })

    console.log("[v0] Backend response status:", backendResponse.status)

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.log("[v0] Backend error response:", errorText)
      throw new Error(`Backend prediction failed: ${backendResponse.status} - ${errorText}`)
    }

    const result = await backendResponse.json()
    console.log("[v0] Prediction result:", result)

    return NextResponse.json({
      emotion: result.emotion,
      confidence: result.confidence,
      allPredictions: result.allPredictions || {},
    })
  } catch (error) {
    console.error("[v0] Error analyzing emotion:", error)

    const errorMessage = error instanceof Error ? error.message : "Failed to analyze emotion"
    return NextResponse.json(
      {
        error: errorMessage,
        details:
          "Make sure your Python backend is running at http://localhost:8000 and the /predict endpoint is available",
      },
      { status: 500 },
    )
  }
}

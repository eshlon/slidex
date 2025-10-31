import { NextRequest, NextResponse } from "next/server";

interface SlideOutline {
  id: string;
  title: string;
  content: string[];
}

interface GenerateOutlineRequest {
  prompt: string;
  slideCount: number;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateOutlineRequest = await request.json();
    const { prompt, slideCount, language } = body;

    if (!prompt || !slideCount || !language) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, slideCount, language" },
        { status: 400 }
      );
    }

    const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL;
    if (!pythonApiUrl) {
      console.error("Python API URL is not configured");
      return NextResponse.json(
        { error: "Application is not configured to communicate with the backend service." },
        { status: 500 }
      );
    }

    const outlineUrl = `${pythonApiUrl}/generate_outline`;

    console.log(`Forwarding outline request to: ${outlineUrl}`);

    const response = await fetch(outlineUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        prompt,
        slideCount,
        language,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error from Python API: ${response.status} ${response.statusText}`, errorBody);
      return NextResponse.json(
        { error: "Failed to generate outline from the backend service.", details: errorBody },
        { status: response.status }
      );
    }

    const data = await response.json();
    const outlineData = data.outlines;

    if (!Array.isArray(outlineData)) {
        console.error("Invalid response format from Python API. 'outlines' should be an array.", data);
        return NextResponse.json(
            { error: "Received an invalid response from the backend service." },
            { status: 500 }
        );
    }

    // Convert to the expected format with unique IDs
    const outlines: SlideOutline[] = outlineData.map((slide, index) => ({
      id: `slide-${Date.now()}-${index}`,
      title: slide.title,
      content: slide.content,
    }));

    return NextResponse.json(
      {
        success: true,
        outlines,
        metadata: {
          slideCount: outlines.length,
          language,
          generatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error)
{
    console.error("Generate outline API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, updateUserCredits } from "@/lib/auth-actions";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, prompt, slideCount, template, content, pythonApi } = body;

    if (!title || !prompt || !slideCount || !template) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    const creditResult = await updateUserCredits(user.id, 1);
    if (!creditResult.success) {
      return NextResponse.json(
        { error: creditResult.error || "Failed to deduct credits" },
        { status: 500 }
      );
    }

    const { data: presentation, error: createError } = await supabaseAdmin
      .from("presentations")
      .insert({
        user_id: user.id,
        title,
        prompt,
        slide_count: slideCount,
        template,
        content: JSON.stringify(content),
        status: "processing",
        python_api: pythonApi,
      })
      .select("id, title, created_at")
      .single();

    if (createError || !presentation) {
      return NextResponse.json(
        { error: "Failed to create presentation record" },
        { status: 500 }
      );
    }

    if (pythonApi) {
      try {
        console.log("Attempting to connect to Python API:", PYTHON_API_URL);
        
        const response = await fetch(
          `${PYTHON_API_URL}/generate_slide_with_template`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              outlines: content,
              templateId: template,
              language: "english",
            }),
            signal: AbortSignal.timeout(120000), // 2 minute timeout for complex presentations
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Python API error response:", response.status, errorText);
          throw new Error(`Python API error: ${response.status} - ${errorText}`);
        }

        const fileBuffer = await response.blob();
        const fileName = `${user.id}/${uuidv4()}.pptx`;

        const { data: uploadData, error: uploadError } =
          await supabaseAdmin.storage
            .from("presentations")
            .upload(fileName, fileBuffer, {
              contentType:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            });

        if (uploadError || !uploadData) {
          throw new Error("Failed to upload presentation to storage");
        }

        const {
          data: { publicUrl },
        } = supabaseAdmin.storage
          .from("presentations")
          .getPublicUrl(uploadData.path);

        await supabaseAdmin
          .from("presentations")
          .update({
            status: "completed",
            file_url: publicUrl,
            storage_path: uploadData.path,
          })
          .eq("id", presentation.id);
      } catch (apiError) {
        console.error("Python API processing error:", apiError);
        await supabaseAdmin
          .from("presentations")
          .update({ status: "failed" })
          .eq("id", presentation.id);
        
        // Provide more specific error message
        let errorMessage = "Failed to process presentation";
        if (apiError instanceof Error) {
          if (apiError.name === "AbortError") {
            errorMessage = "Request timeout - Python API took too long to respond";
          } else if (apiError.message.includes("fetch")) {
            errorMessage = "Cannot connect to Python API service";
          } else {
            errorMessage = apiError.message;
          }
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        presentation,
        remainingCredits: creditResult.newBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create presentation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

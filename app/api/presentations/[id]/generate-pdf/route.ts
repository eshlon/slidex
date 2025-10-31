import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-actions";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: presentation, error: fetchError } = await supabaseAdmin
      .from("presentations")
      .select("id, file_url")
      .eq("id", id)
      .single();

    if (fetchError || !presentation) {
      return NextResponse.json(
        { error: "Presentation not found" },
        { status: 404 }
      );
    }

    if (!presentation.file_url) {
      return NextResponse.json(
        { error: "Presentation file not available" },
        { status: 400 }
      );
    }

    const pdfResponse = await fetch(`${PYTHON_API_URL}/convert_to_pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_url: presentation.file_url }),
    });

    if (!pdfResponse.ok) {
      throw new Error("Failed to convert presentation to PDF");
    }

    const pdfFileBuffer = await pdfResponse.blob();
    const pdfFileName = `${user.id}/${uuidv4()}.pdf`;

    const { data: pdfUploadData, error: pdfUploadError } =
      await supabaseAdmin.storage
        .from("presentations")
        .upload(pdfFileName, pdfFileBuffer, {
          contentType: "application/pdf",
        });

    if (pdfUploadError || !pdfUploadData) {
      throw new Error("Failed to upload PDF to storage");
    }

    const {
      data: { publicUrl: pdfPublicUrl },
    } = supabaseAdmin.storage
      .from("presentations")
      .getPublicUrl(pdfUploadData.path);

    await supabaseAdmin
      .from("presentations")
      .update({
        pdf_file_url: pdfPublicUrl,
        pdf_storage_path: pdfUploadData.path,
      })
      .eq("id", presentation.id);

    return NextResponse.json({ pdf_url: pdfPublicUrl });
  } catch (error) {
    console.error("Generate PDF error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

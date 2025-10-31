import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-actions"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const presentationId = searchParams.get('id')

    if (!presentationId) {
      return NextResponse.json(
        { error: "Missing presentation ID" },
        { status: 400 }
      )
    }

    // Get presentation from database
    const { data: presentation, error } = await supabaseAdmin
      .from('presentations')
      .select('title, file_url')
      .eq('id', presentationId)
      .eq('user_id', user.id)
      .single()

    if (error || !presentation || !presentation.file_url) {
      return NextResponse.json(
        { error: "Presentation file not found" },
        { status: 404 }
      )
    }

    // Fetch the file from the storage URL
    const fileResponse = await fetch(presentation.file_url)
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch presentation from storage: ${fileResponse.statusText}`)
    }
    const fileBuffer = await fileResponse.arrayBuffer()

    // Return the file as a download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${presentation.title}.pptx"`,
        'Content-Length': fileBuffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error("Download presentation API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

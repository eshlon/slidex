import { NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const result = await signUp({ name, email, password })
    
    if (result.success) {
      return NextResponse.json(
        { success: true, user: result.user },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

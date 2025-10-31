import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await signIn(email, password)
    
    if (result.success) {
      return NextResponse.json(
        { success: true, user: result.user },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Signin API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

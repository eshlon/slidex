import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth-actions"

export async function POST() {
  try {
    await signOut()
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error("Signout API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

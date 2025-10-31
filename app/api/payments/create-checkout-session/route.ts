import { NextRequest, NextResponse } from "next/server"
import { createStripeCheckoutSession } from "@/lib/stripe-actions"
import { getCurrentUser } from "@/lib/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { credits, price } = body

    if (!credits || credits <= 0 || !price || price <= 0) {
      return NextResponse.json(
        { error: "Invalid credits or price amount" },
        { status: 400 }
      )
    }

    const result = await createStripeCheckoutSession(user.id, credits, price)
    
    if (result.success) {
      return NextResponse.json(
        { success: true, sessionUrl: result.sessionUrl },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Create checkout session API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

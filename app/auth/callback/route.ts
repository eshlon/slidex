import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProfileFromOAuth } from '@/lib/auth-actions'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = process.env.NEXT_PUBLIC_BASE_URL!
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/dashboard'
  }
  if (code) {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && user) {
      await createProfileFromOAuth({
        id: user.id,
        name: user.user_metadata.name,
        email: user.user_metadata.email,
        avatar_url: user.user_metadata.picture ?? user.user_metadata.avatar_url,
      })
      // Redirect to a URL in the same origin as the request
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

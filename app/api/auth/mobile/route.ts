import { NextRequest } from 'next/server'

// Receives the Supabase OAuth callback for the mobile app
// and redirects back into the app via deep link.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Build gymtrack:// deep link with all query params passed through
  const deepLink = new URL('gymtrack://')
  searchParams.forEach((value, key) => {
    deepLink.searchParams.set(key, value)
  })

  return Response.redirect(deepLink.toString(), 302)
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js middleware for API route protection only
 * Client-side routes are protected by checking localStorage in the component
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect API routes, not client-side pages
  // Client-side pages will check localStorage themselves
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    // Define protected API routes
    const protectedApiRoutes = [
      '/api/profile',
      '/api/favorites',
      '/api/messages',
      '/api/owner',
      '/api/tenant',
      '/api/admin',
    ]

    const isProtectedApi = protectedApiRoutes.some(route => 
      pathname.startsWith(route)
    )

    if (isProtectedApi && !token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|).*)',
  ],
}

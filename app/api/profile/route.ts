import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, AuthenticatedRequest } from '@/lib/middleware/auth'

/**
 * GET /api/profile
 * Get authenticated user's profile
 * Protected route - requires valid JWT token
 */
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return NextResponse.json({
      user: req.user,
    })
  })
}

/**
 * PUT /api/profile
 * Update authenticated user's profile
 * Protected route - requires valid JWT token
 */
export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    // Example implementation - would need actual update logic
    const body = await request.json()
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: req.user,
    })
  })
}

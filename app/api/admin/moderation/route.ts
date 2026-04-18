import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/moderation
 * Get content moderation queue (admin-only feature)
 * Protected route - requires admin role
 * 
 * Validates: Requirements 2.3, 2.4
 */
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['admin'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      // This would fetch flagged content from database
      return NextResponse.json({
        message: 'Moderation queue retrieved successfully',
        adminId: authenticatedReq.user?.userId,
        queue: [], // Would contain flagged properties, messages, etc.
      })
    })
  })
}

/**
 * POST /api/admin/moderation
 * Take moderation action on content (admin-only feature)
 * Protected route - requires admin role
 * 
 * Validates: Requirements 2.3, 2.4
 */
export async function POST(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['admin'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      const body = await request.json()
      const { contentId, contentType, action, reason } = body

      // This would update content status in database
      return NextResponse.json({
        message: 'Moderation action completed successfully',
        moderation: {
          contentId,
          contentType,
          action,
          reason,
          moderatedBy: authenticatedReq.user?.userId,
        },
      }, { status: 201 })
    })
  })
}

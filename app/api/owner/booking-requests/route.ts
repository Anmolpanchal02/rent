import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/owner/booking-requests
 * Get booking requests for owner's properties
 * Protected route - requires owner role
 * 
 * Validates: Requirements 2.2, 2.4
 */
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      // This would fetch booking requests from database
      return NextResponse.json({
        message: 'Booking requests retrieved successfully',
        ownerId: authenticatedReq.user?.userId,
        requests: [], // Would contain actual booking request data
      })
    })
  })
}

/**
 * PUT /api/owner/booking-requests
 * Handle booking request (approve/reject)
 * Protected route - requires owner role
 * 
 * Validates: Requirements 2.2, 2.4
 */
export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      const body = await request.json()
      const { bookingId, status } = body

      // This would update booking request status in database
      return NextResponse.json({
        message: 'Booking request updated successfully',
        booking: {
          id: bookingId,
          status,
          ownerId: authenticatedReq.user?.userId,
        },
      })
    })
  })
}

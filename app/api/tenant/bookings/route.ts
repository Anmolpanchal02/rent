import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/tenant/bookings
 * Get tenant's bookings
 * Protected route - requires tenant role
 * 
 * Validates: Requirements 2.1, 2.4
 */
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['tenant'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      // This would fetch bookings from database
      return NextResponse.json({
        message: 'Bookings retrieved successfully',
        userId: authenticatedReq.user?.userId,
        bookings: [], // Would contain actual booking data
      })
    })
  })
}

/**
 * POST /api/tenant/bookings
 * Create a new booking (tenant-only feature)
 * Protected route - requires tenant role
 * 
 * Validates: Requirements 2.1, 2.4
 */
export async function POST(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['tenant'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      const body = await request.json()
      const { propertyId, startDate, endDate } = body

      // This would create a booking in the database
      return NextResponse.json({
        message: 'Booking created successfully',
        booking: {
          propertyId,
          startDate,
          endDate,
          tenantId: authenticatedReq.user?.userId,
        },
      }, { status: 201 })
    })
  })
}

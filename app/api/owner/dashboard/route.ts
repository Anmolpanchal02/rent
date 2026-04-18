import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth'

/**
 * GET /api/owner/dashboard
 * Get owner's performance metrics and dashboard data
 * Protected route - requires owner role
 * 
 * Validates: Requirements 2.2, 2.4
 */
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      // This would fetch performance metrics from database
      return NextResponse.json({
        message: 'Dashboard data retrieved successfully',
        ownerId: authenticatedReq.user?.userId,
        metrics: {
          totalProperties: 0,
          activeBookings: 0,
          pendingRequests: 0,
          totalRevenue: 0,
          occupancyRate: 0,
        },
      })
    })
  })
}

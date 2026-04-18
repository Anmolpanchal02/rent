import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth'
import { connectDB } from '@/lib/db'
import Property from '@/lib/models/Property'

export const dynamic = 'force-dynamic'

/**
 * GET /api/owner/properties
 * Get owner's properties for management
 * Protected route - requires owner role
 * 
 * Validates: Requirements 2.2, 2.4
 */
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      try {
        await connectDB()
        
        const properties = await Property.find({ 
          owner: authenticatedReq.user?.userId 
        }).sort({ createdAt: -1 })

        return NextResponse.json({
          message: 'Properties retrieved successfully',
          properties,
        })
      } catch (error) {
        console.error('Error fetching properties:', error)
        return NextResponse.json(
          { error: 'Failed to fetch properties' },
          { status: 500 }
        )
      }
    })
  })
}

/**
 * POST /api/owner/properties
 * Create a new property listing (owner-only feature)
 * Protected route - requires owner role
 * 
 * Validates: Requirements 2.2, 2.4
 */
export async function POST(request: NextRequest) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      try {
        await connectDB()
        
        const body = await request.json()
        
        // Create property with owner ID
        const property = await Property.create({
          ...body,
          owner: authenticatedReq.user?.userId,
          status: 'active',
          images: body.images || [],
          location: {
            address: body.address,
            city: body.city,
            state: body.state,
            pincode: body.pincode,
          }
        })

        return NextResponse.json({
          message: 'Property created successfully',
          property,
        }, { status: 201 })
      } catch (error) {
        console.error('Error creating property:', error)
        return NextResponse.json(
          { error: 'Failed to create property' },
          { status: 500 }
        )
      }
    })
  })
}

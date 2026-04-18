import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth'
import { connectDB } from '@/lib/db'
import Property from '@/lib/models/Property'

export const dynamic = 'force-dynamic'

/**
 * GET /api/owner/properties/[id]
 * Get a single property by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      try {
        await connectDB()
        
        const property = await Property.findOne({
          _id: params.id,
          owner: authenticatedReq.user?.userId
        })

        if (!property) {
          return NextResponse.json(
            { error: 'Property not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          message: 'Property retrieved successfully',
          property,
        })
      } catch (error) {
        console.error('Error fetching property:', error)
        return NextResponse.json(
          { error: 'Failed to fetch property' },
          { status: 500 }
        )
      }
    })
  })
}

/**
 * PUT /api/owner/properties/[id]
 * Update a property
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      try {
        await connectDB()
        
        const body = await request.json()
        
        // Find property and verify ownership
        const property = await Property.findOne({
          _id: params.id,
          owner: authenticatedReq.user?.userId
        })

        if (!property) {
          return NextResponse.json(
            { error: 'Property not found' },
            { status: 404 }
          )
        }

        // Update property
        const updatedProperty = await Property.findByIdAndUpdate(
          params.id,
          {
            ...body,
            location: {
              address: body.address,
              city: body.city,
              state: body.state,
              pincode: body.pincode,
            }
          },
          { new: true, runValidators: true }
        )

        return NextResponse.json({
          message: 'Property updated successfully',
          property: updatedProperty,
        })
      } catch (error) {
        console.error('Error updating property:', error)
        return NextResponse.json(
          { error: 'Failed to update property' },
          { status: 500 }
        )
      }
    })
  })
}

/**
 * DELETE /api/owner/properties/[id]
 * Delete a property
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return authMiddleware(request, async (req: AuthenticatedRequest) => {
    return requireRole(['owner'])(req, async (authenticatedReq: AuthenticatedRequest) => {
      try {
        await connectDB()
        
        // Find property and verify ownership
        const property = await Property.findOne({
          _id: params.id,
          owner: authenticatedReq.user?.userId
        })

        if (!property) {
          return NextResponse.json(
            { error: 'Property not found' },
            { status: 404 }
          )
        }

        await Property.findByIdAndDelete(params.id)

        return NextResponse.json({
          message: 'Property deleted successfully',
        })
      } catch (error) {
        console.error('Error deleting property:', error)
        return NextResponse.json(
          { error: 'Failed to delete property' },
          { status: 500 }
        )
      }
    })
  })
}

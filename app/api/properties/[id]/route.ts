import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Property from '@/lib/models/Property'

/**
 * GET /api/properties/[id]
 * Get a single property by ID (public access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const property = await Property.findById(params.id)
      .populate('owner', 'name email phone')

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Increment views count
    await Property.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

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
}

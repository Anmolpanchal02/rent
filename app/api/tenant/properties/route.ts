import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Property from '@/lib/models/Property'

export const dynamic = 'force-dynamic'

/**
 * GET /api/tenant/properties
 * Browse and filter properties (public access)
 * 
 * Validates: Requirements 2.1, 2.4
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const type = searchParams.get('type')

    // Build query
    const query: any = { status: 'active' }
    
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } },
      ]
    }
    
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }
    
    if (type && type !== 'all') {
      query.type = type
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(50)

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
}

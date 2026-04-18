import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'

// GET /api/favorites - Get user's favorite properties
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const userData = await User.findById(user.id).populate('favorites')
    
    return NextResponse.json({ 
      favorites: userData?.favorites || [] 
    })
  } catch (error: any) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add property to favorites
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { propertyId } = await req.json()

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const userData = await User.findById(user.id)
    
    if (!userData.favorites) {
      userData.favorites = []
    }

    // Check if already in favorites
    if (userData.favorites.includes(propertyId)) {
      return NextResponse.json(
        { message: 'Property already in favorites' },
        { status: 200 }
      )
    }

    userData.favorites.push(propertyId)
    await userData.save()

    return NextResponse.json({ 
      message: 'Added to favorites',
      favorites: userData.favorites 
    })
  } catch (error: any) {
    console.error('Add to favorites error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add to favorites' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove property from favorites
export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const userData = await User.findById(user.id)
    
    if (!userData.favorites) {
      userData.favorites = []
    }

    userData.favorites = userData.favorites.filter(
      (id: any) => id.toString() !== propertyId
    )
    await userData.save()

    return NextResponse.json({ 
      message: 'Removed from favorites',
      favorites: userData.favorites 
    })
  } catch (error: any) {
    console.error('Remove from favorites error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove from favorites' },
      { status: 500 }
    )
  }
}

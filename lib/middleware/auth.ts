import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { UserRole } from '@/types'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: UserRole
    name: string
    phone?: string
    avatar?: string
    bio?: string
  }
}

/**
 * Authentication middleware for protected routes
 * Validates JWT token and fetches user data
 * Redirects to login if token is invalid or missing
 */
export async function authMiddleware(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables')
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    let decoded: JWTPayload
    try {
      decoded = jwt.verify(token, jwtSecret) as JWTPayload
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Connect to database and fetch user data
    await connectDB()
    
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Attach user data to request
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
    }

    // Call the handler with authenticated request
    return await handler(authenticatedRequest)
  } catch (error) {
    console.error('Authentication middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role
 */
export function requireRole(allowedRoles: UserRole[]) {
  return async (
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    if (!request.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!allowedRoles.includes(request.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return await handler(request)
  }
}

/**
 * Verify authentication and return user data
 * Used in API routes to check if user is authenticated
 */
export async function verifyAuth(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables')
      return null
    }

    let decoded: JWTPayload
    try {
      decoded = jwt.verify(token, jwtSecret) as JWTPayload
    } catch (error) {
      return null
    }

    // Connect to database and fetch user data
    await connectDB()
    
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
    }
  } catch (error) {
    console.error('Verify auth error:', error)
    return null
  }
}

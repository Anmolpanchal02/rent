import { NextRequest, NextResponse } from 'next/server'
import { userRegistrationSchema } from '@/lib/validations/user'
import User from '@/lib/models/User'
import { connectDB } from '@/lib/db'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate request body
    const validatedData = userRegistrationSchema.parse(body)

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create(validatedData)

    // Return user without password
    const userResponse = user.toJSON()

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userResponse,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle mongoose duplicate key error
      if ('code' in error && error.code === 11000) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }

      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

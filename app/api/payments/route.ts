import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { connectDB } from '@/lib/db'
import { Booking } from '@/lib/models'
// import Razorpay from 'razorpay'

// Initialize Razorpay (uncomment when keys are available)
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!
// })

// POST /api/payments - Create payment order
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, amount } = await req.json()

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Booking ID and amount are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.tenant.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (booking.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Booking must be accepted before payment' },
        { status: 400 }
      )
    }

    // TODO: Create Razorpay order
    // const order = await razorpay.orders.create({
    //   amount: amount * 100, // Convert to paise
    //   currency: 'INR',
    //   receipt: `booking_${bookingId}`,
    //   notes: {
    //     bookingId: bookingId,
    //     userId: user.id
    //   }
    // })

    // For now, return mock order
    const mockOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${bookingId}`
    }

    return NextResponse.json({ order: mockOrder })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// PUT /api/payments - Verify payment
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, paymentId, orderId, signature } = await req.json()

    if (!bookingId || !paymentId || !orderId) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      )
    }

    await connectDB()

    // TODO: Verify Razorpay signature
    // const crypto = require('crypto')
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(`${orderId}|${paymentId}`)
    //   .digest('hex')
    
    // if (expectedSignature !== signature) {
    //   return NextResponse.json(
    //     { error: 'Invalid payment signature' },
    //     { status: 400 }
    //   )
    // }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: 'paid',
        paymentId,
        paymentStatus: 'completed'
      },
      { new: true }
    )

    return NextResponse.json({
      message: 'Payment verified successfully',
      booking
    })
  } catch (error: any) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

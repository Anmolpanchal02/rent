import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { connectDB } from '@/lib/db'
import { Message } from '@/lib/models'

export const dynamic = 'force-dynamic'

// GET /api/messages/[userId] - Get conversation with specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const messages = await Message.find({
      $or: [
        { sender: user.id, receiver: params.userId },
        { sender: params.userId, receiver: user.id }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 })

    // Mark messages as read
    await Message.updateMany(
      { sender: params.userId, receiver: user.id, read: false },
      { read: true }
    )

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}

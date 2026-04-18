import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { connectDB } from '@/lib/db'
import { Message } from '@/lib/models'

export const dynamic = 'force-dynamic'

// GET /api/messages - Get all conversations for current user
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
     

    

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: user.id }, { receiver: user.id }]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })

    // Group messages by conversation
    const conversations = new Map()
    
    messages.forEach((msg: any) => {
      const otherUser = msg.sender._id.toString() === user.id 
        ? msg.receiver 
        : msg.sender
      
      const conversationId = otherUser._id.toString()
      
      if (!conversations.has(conversationId)) {
        conversations.set(conversationId, {
          user: otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unread: 0
        })
      }
    })

    return NextResponse.json({
      conversations: Array.from(conversations.values())
    })
  } catch (error: any) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId, content, propertyId } = await req.json()

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver and content are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const message = await Message.create({
      sender: user.id,
      receiver: receiverId,
      content,
      property: propertyId || null,
      read: false
    })

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')

    // TODO: Emit socket event for real-time delivery
    // io.to(receiverId).emit('new-message', populatedMessage)

    return NextResponse.json({ message: populatedMessage }, { status: 201 })
  } catch (error: any) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get messages between users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const friendId = searchParams.get('friendId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId || !friendId) {
      return NextResponse.json({ error: 'User IDs required' }, { status: 400 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sender: { select: { id: true, name: true, avatar: true } }
      }
    });

    return NextResponse.json({ 
      messages: messages.reverse().map(m => ({
        id: m.id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        content: m.content,
        isRead: m.isRead,
        createdAt: m.createdAt,
        sender: m.sender
      }))
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        senderId,
        receiverId,
        content: content.trim()
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: message.createdAt,
        sender: message.sender
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// PUT - Get conversation list (all chats)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get all messages for this user
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true, knowledgeRating: true } },
        receiver: { select: { id: true, name: true, avatar: true, knowledgeRating: true } }
      }
    });

    // Group by conversation partner
    const conversationsMap = new Map<string, {
      friend: { id: string; name: string; avatar: string | null; knowledgeRating: number; isOnline: boolean };
      lastMessage: { id: string; content: string; senderId: string; senderName: string; createdAt: Date; isRead: boolean } | null;
      unreadCount: number;
    }>();

    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          friend: {
            id: partner.id,
            name: partner.name,
            avatar: partner.avatar,
            knowledgeRating: partner.knowledgeRating,
            isOnline: false // Would need UserStatus lookup
          },
          lastMessage: {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.sender.name,
            createdAt: msg.createdAt,
            isRead: msg.isRead
          },
          unreadCount: msg.receiverId === userId && !msg.isRead ? 1 : 0
        });
      } else {
        const conv = conversationsMap.get(partnerId)!;
        if (msg.receiverId === userId && !msg.isRead) {
          conv.unreadCount++;
        }
      }
    }

    return NextResponse.json({ 
      conversations: Array.from(conversationsMap.values())
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

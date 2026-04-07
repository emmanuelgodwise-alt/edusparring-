import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get friends list or friend requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'friends'; // friends, requests, search

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (type === 'friends') {
      // Get accepted friends
      const friendships = await db.friendship.findMany({
        where: {
          OR: [
            { requesterId: userId, status: 'accepted' },
            { accepterId: userId, status: 'accepted' }
          ]
        },
        include: {
          requester: { select: { id: true, name: true, avatar: true, knowledgeRating: true, country: true } },
          accepter: { select: { id: true, name: true, avatar: true, knowledgeRating: true, country: true } }
        }
      });

      const friends = friendships.map(f => {
        const friend = f.requesterId === userId ? f.accepter : f.requester;
        return {
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          knowledgeRating: friend.knowledgeRating,
          country: friend.country,
          friendshipId: f.id
        };
      });

      return NextResponse.json({ friends });
    }

    if (type === 'requests') {
      // Get pending friend requests
      const requests = await db.friendship.findMany({
        where: {
          accepterId: userId,
          status: 'pending'
        },
        include: {
          requester: { select: { id: true, name: true, avatar: true, knowledgeRating: true, country: true } }
        }
      });

      const friendRequests = requests.map(r => ({
        id: r.id,
        requester: {
          id: r.requester.id,
          name: r.requester.name,
          avatar: r.requester.avatar,
          knowledgeRating: r.requester.knowledgeRating,
          country: r.requester.country
        }
      }));

      return NextResponse.json({ requests: friendRequests });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
  }
}

// POST - Send friend request or accept/decline
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, targetUserId, requestId } = body;

    if (action === 'send') {
      // Send friend request
      if (!userId || !targetUserId) {
        return NextResponse.json({ error: 'User IDs required' }, { status: 400 });
      }

      // Check if already friends or request exists
      const existing = await db.friendship.findFirst({
        where: {
          OR: [
            { requesterId: userId, accepterId: targetUserId },
            { requesterId: targetUserId, accepterId: userId }
          ]
        }
      });

      if (existing) {
        return NextResponse.json({ error: 'Friend request already exists' }, { status: 400 });
      }

      const friendship = await db.friendship.create({
        data: {
          requesterId: userId,
          accepterId: targetUserId,
          status: 'pending'
        }
      });

      return NextResponse.json({ success: true, friendship });
    }

    if (action === 'accept') {
      // Accept friend request
      if (!requestId) {
        return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
      }

      const friendship = await db.friendship.update({
        where: { id: requestId },
        data: { status: 'accepted' }
      });

      return NextResponse.json({ success: true, friendship });
    }

    if (action === 'decline') {
      // Decline friend request
      if (!requestId) {
        return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
      }

      await db.friendship.delete({
        where: { id: requestId }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing friends:', error);
    return NextResponse.json({ error: 'Failed to manage friends' }, { status: 500 });
  }
}

// DELETE - Remove friend
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const friendshipId = searchParams.get('friendshipId');

    if (!friendshipId) {
      return NextResponse.json({ error: 'Friendship ID required' }, { status: 400 });
    }

    await db.friendship.delete({
      where: { id: friendshipId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json({ error: 'Failed to remove friend' }, { status: 500 });
  }
}

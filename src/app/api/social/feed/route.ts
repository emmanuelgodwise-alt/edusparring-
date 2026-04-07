import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get activity feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'friends'; // friends, all, user
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let activities: any[] = [];

    if (type === 'friends') {
      // Get friend IDs
      const friendships = await db.friendship.findMany({
        where: {
          OR: [
            { requesterId: userId, status: 'accepted' },
            { accepterId: userId, status: 'accepted' }
          ]
        },
        select: { requesterId: true, accepterId: true }
      });

      const friendIds = new Set<string>();
      friendships.forEach(f => {
        friendIds.add(f.requesterId);
        friendIds.add(f.accepterId);
      });
      friendIds.delete(userId);

      // Get activities from friends
      if (friendIds.size > 0) {
        activities = await db.activity.findMany({
          where: {
            userId: { in: Array.from(friendIds) },
            visibility: { in: ['public', 'friends'] }
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          include: {
            user: { select: { id: true, name: true, avatar: true, knowledgeRating: true } },
            likes: { select: { userId: true } },
            comments: {
              take: 3,
              orderBy: { createdAt: 'desc' },
              include: { user: { select: { id: true, name: true, avatar: true } } }
            }
          }
        });
      }
    } else {
      // Get all public activities
      activities = await db.activity.findMany({
        where: { visibility: 'public' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          user: { select: { id: true, name: true, avatar: true, knowledgeRating: true } },
          likes: { select: { userId: true } },
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, avatar: true } } }
          }
        }
      });
    }

    // Add isLiked field
    const activitiesWithLiked = activities.map(a => ({
      ...a,
      likesCount: a.likes?.length || 0,
      commentsCount: a.comments?.length || 0,
      isLiked: a.likes?.some((l: any) => l.userId === userId) || false
    }));

    return NextResponse.json({ activities: activitiesWithLiked });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

// POST - Create activity (share match result, achievement, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, content, matchId, visibility } = body;

    if (!userId || !type || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const activity = await db.activity.create({
      data: {
        userId,
        type,
        content: JSON.stringify(content),
        matchId,
        visibility: visibility || 'friends'
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, knowledgeRating: true } }
      }
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

// PUT - Like/unlike or comment on activity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, activityId, userId, content } = body;

    if (action === 'like') {
      // Check if already liked
      const existing = await db.activityLike.findUnique({
        where: {
          activityId_userId: { activityId, userId }
        }
      });

      if (existing) {
        // Unlike
        await db.activityLike.delete({ where: { id: existing.id } });
        await db.activity.update({
          where: { id: activityId },
          data: { likesCount: { decrement: 1 } }
        });
        return NextResponse.json({ success: true, liked: false });
      } else {
        // Like
        await db.activityLike.create({ data: { activityId, userId } });
        await db.activity.update({
          where: { id: activityId },
          data: { likesCount: { increment: 1 } }
        });
        return NextResponse.json({ success: true, liked: true });
      }
    }

    if (action === 'comment') {
      if (!content?.trim()) {
        return NextResponse.json({ error: 'Comment content required' }, { status: 400 });
      }

      const comment = await db.activityComment.create({
        data: { activityId, userId, content: content.trim() },
        include: { user: { select: { id: true, name: true, avatar: true } } }
      });

      await db.activity.update({
        where: { id: activityId },
        data: { commentsCount: { increment: 1 } }
      });

      return NextResponse.json({ success: true, comment });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

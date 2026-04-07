import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List study circles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');

    const where: {
      isPublic?: boolean;
      subject?: string;
      OR?: Array<{ name: { contains: string }; description: { contains: string } }>;
    } = { isPublic: true };

    if (subject) {
      where.subject = subject;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const circles = await db.studyCircle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Parse members and add member count
    const circlesWithMemberCount = circles.map(circle => {
      const members: string[] = JSON.parse(circle.members);
      return {
        ...circle,
        memberCount: members.length,
        isMember: userId ? members.includes(userId) : false
      };
    });

    return NextResponse.json({
      success: true,
      circles: circlesWithMemberCount
    });

  } catch (error) {
    console.error('Get circles error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get circles' },
      { status: 500 }
    );
  }
}

// POST - Create a new study circle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, subject, creatorId, isPublic, maxMembers } = body;

    if (!name || !subject || !creatorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create circle with creator as first member
    const circle = await db.studyCircle.create({
      data: {
        name,
        description: description || '',
        subject,
        creatorId,
        members: JSON.stringify([creatorId]),
        isPublic: isPublic !== false,
        maxMembers: maxMembers || 20
      }
    });

    // Award "leader" badge for creating a circle
    const existingBadge = await db.characterBadge.findUnique({
      where: {
        userId_badgeType: {
          userId: creatorId,
          badgeType: 'leader'
        }
      }
    });

    if (!existingBadge) {
      await db.characterBadge.create({
        data: {
          userId: creatorId,
          badgeType: 'leader',
          level: 1,
          metadata: JSON.stringify({ earnedFrom: 'circle_creation' })
        }
      });
    }

    return NextResponse.json({
      success: true,
      circle: {
        ...circle,
        memberCount: 1
      }
    });

  } catch (error) {
    console.error('Create circle error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create circle' },
      { status: 500 }
    );
  }
}

// PUT - Join/Leave a circle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { circleId, userId, action } = body; // action: 'join' or 'leave'

    if (!circleId || !userId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const circle = await db.studyCircle.findUnique({
      where: { id: circleId }
    });

    if (!circle) {
      return NextResponse.json(
        { success: false, error: 'Circle not found' },
        { status: 404 }
      );
    }

    const members: string[] = JSON.parse(circle.members);

    if (action === 'join') {
      if (members.includes(userId)) {
        return NextResponse.json(
          { success: false, error: 'Already a member' },
          { status: 400 }
        );
      }

      if (members.length >= circle.maxMembers) {
        return NextResponse.json(
          { success: false, error: 'Circle is full' },
          { status: 400 }
        );
      }

      members.push(userId);

      // Award "helper" badge progress for joining study circles
      const existingBadge = await db.characterBadge.findUnique({
        where: {
          userId_badgeType: {
            userId,
            badgeType: 'helper'
          }
        }
      });

      if (!existingBadge) {
        await db.characterBadge.create({
          data: {
            userId,
            badgeType: 'helper',
            level: 1,
            metadata: JSON.stringify({ circlesJoined: 1 })
          }
        });
      }

    } else if (action === 'leave') {
      const index = members.indexOf(userId);
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Not a member' },
          { status: 400 }
        );
      }

      // Don't allow creator to leave if they're the only member
      if (members.length === 1 && circle.creatorId === userId) {
        return NextResponse.json(
          { success: false, error: 'Cannot leave as the only member. Delete the circle instead.' },
          { status: 400 }
        );
      }

      members.splice(index, 1);
    }

    await db.studyCircle.update({
      where: { id: circleId },
      data: { members: JSON.stringify(members) }
    });

    return NextResponse.json({
      success: true,
      message: action === 'join' ? 'Successfully joined the circle' : 'Left the circle',
      memberCount: members.length
    });

  } catch (error) {
    console.error('Update circle membership error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update membership' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a circle (creator only)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { circleId, userId } = body;

    if (!circleId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const circle = await db.studyCircle.findUnique({
      where: { id: circleId }
    });

    if (!circle) {
      return NextResponse.json(
        { success: false, error: 'Circle not found' },
        { status: 404 }
      );
    }

    if (circle.creatorId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Only the creator can delete the circle' },
        { status: 403 }
      );
    }

    await db.studyCircle.delete({
      where: { id: circleId }
    });

    return NextResponse.json({
      success: true,
      message: 'Circle deleted successfully'
    });

  } catch (error) {
    console.error('Delete circle error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete circle' },
      { status: 500 }
    );
  }
}

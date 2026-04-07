import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get mood check-in history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '7');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      );
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const checkIns = await db.moodCheckIn.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average mood
    const avgMood = checkIns.length > 0
      ? checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length
      : 0;

    // Get today's check-in
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCheckIn = await db.moodCheckIn.findFirst({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    return NextResponse.json({
      success: true,
      checkIns: checkIns.map(c => ({
        ...c,
        tags: JSON.parse(c.tags)
      })),
      stats: {
        average: Math.round(avgMood * 10) / 10,
        total: checkIns.length,
        todayCheckedIn: !!todayCheckIn,
        todayMood: todayCheckIn?.mood || null
      }
    });

  } catch (error) {
    console.error('Get mood check-ins error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get check-ins' },
      { status: 500 }
    );
  }
}

// POST - Create a mood check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, mood, notes, tags } = body;

    if (!userId || !mood) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate mood (1-5)
    if (mood < 1 || mood > 5) {
      return NextResponse.json(
        { success: false, error: 'Mood must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await db.moodCheckIn.findFirst({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    if (existingCheckIn) {
      // Update existing check-in
      const updated = await db.moodCheckIn.update({
        where: { id: existingCheckIn.id },
        data: {
          mood,
          notes,
          tags: JSON.stringify(tags || [])
        }
      });

      return NextResponse.json({
        success: true,
        checkIn: {
          ...updated,
          tags: JSON.parse(updated.tags)
        },
        message: 'Mood updated for today'
      });
    }

    const checkIn = await db.moodCheckIn.create({
      data: {
        userId,
        mood,
        notes,
        tags: JSON.stringify(tags || [])
      }
    });

    // Check for resilience badge (consistent mood tracking)
    const totalCheckIns = await db.moodCheckIn.count({
      where: { userId }
    });

    if (totalCheckIns >= 7) {
      await db.characterBadge.upsert({
        where: {
          userId_badgeType: {
            userId,
            badgeType: 'resilient'
          }
        },
        create: {
          userId,
          badgeType: 'resilient',
          level: 1,
          metadata: JSON.stringify({ checkIns: totalCheckIns })
        },
        update: {
          metadata: JSON.stringify({ checkIns: totalCheckIns })
        }
      });
    }

    return NextResponse.json({
      success: true,
      checkIn: {
        ...checkIn,
        tags: JSON.parse(checkIn.tags)
      },
      streak: totalCheckIns
    });

  } catch (error) {
    console.error('Create mood check-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}

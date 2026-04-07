import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get user wellness settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      );
    }

    let settings = await db.wellnessSettings.findUnique({
      where: { userId }
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await db.wellnessSettings.create({
        data: { userId }
      });
    }

    // Get today's screen time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const screenTimeToday = await db.screenTimeLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    // Get last 7 days screen time
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyScreenTime = await db.screenTimeLog.findMany({
      where: {
        userId,
        date: { gte: lastWeek }
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        focusModeSchedule: settings.focusModeSchedule ? JSON.parse(settings.focusModeSchedule) : null
      },
      screenTime: {
        today: screenTimeToday?.minutes || 0,
        weekly: weeklyScreenTime.map(s => ({
          date: s.date,
          minutes: s.minutes,
          sessions: s.sessions
        })),
        weeklyTotal: weeklyScreenTime.reduce((sum, s) => sum + s.minutes, 0),
        dailyAverage: weeklyScreenTime.length > 0
          ? Math.round(weeklyScreenTime.reduce((sum, s) => sum + s.minutes, 0) / 7)
          : 0
      }
    });

  } catch (error) {
    console.error('Get wellness settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

// PUT - Update wellness settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, screenTimeLimit, focusModeEnabled, focusModeSchedule, sleepReminderTime, breakReminders, mindfulnessPrompts } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      );
    }

    const updateData: {
      screenTimeLimit?: number | null;
      focusModeEnabled?: boolean;
      focusModeSchedule?: string;
      sleepReminderTime?: string;
      breakReminders?: boolean;
      mindfulnessPrompts?: boolean;
    } = {};

    if (screenTimeLimit !== undefined) updateData.screenTimeLimit = screenTimeLimit;
    if (focusModeEnabled !== undefined) updateData.focusModeEnabled = focusModeEnabled;
    if (focusModeSchedule !== undefined) updateData.focusModeSchedule = JSON.stringify(focusModeSchedule);
    if (sleepReminderTime !== undefined) updateData.sleepReminderTime = sleepReminderTime;
    if (breakReminders !== undefined) updateData.breakReminders = breakReminders;
    if (mindfulnessPrompts !== undefined) updateData.mindfulnessPrompts = mindfulnessPrompts;

    const settings = await db.wellnessSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...updateData
      },
      update: updateData
    });

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        focusModeSchedule: settings.focusModeSchedule ? JSON.parse(settings.focusModeSchedule) : null
      }
    });

  } catch (error) {
    console.error('Update wellness settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

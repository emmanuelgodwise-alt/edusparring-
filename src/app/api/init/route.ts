import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Initialize or get user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: email || 'player@edusparring.com' }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email || `player_${Date.now()}@edusparring.com`,
          name: name || 'Scholar',
          knowledgeRating: 800,
          level: 'High School',
          points: 0
        }
      });

      // Add default subjects
      await prisma.userSubject.createMany({
        data: [
          { userId: user.id, subject: 'Math', proficiency: 50 },
          { userId: user.id, subject: 'Physics', proficiency: 30 },
          { userId: user.id, subject: 'Chemistry', proficiency: 40 }
        ]
      });

      // Add to global leaderboard
      await prisma.leaderboard.create({
        data: {
          userId: user.id,
          category: 'global',
          rank: 999999,
          score: 0,
          period: 'all_time'
        }
      });
    }

    // Get user's subjects
    const subjects = await prisma.userSubject.findMany({
      where: { userId: user.id }
    });

    // Get user's achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: { achievement: true }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        knowledgeRating: user.knowledgeRating,
        level: user.level,
        bio: user.bio,
        country: user.country,
        points: user.points,
        totalWins: user.totalWins,
        totalLosses: user.totalLosses,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        subjects: subjects.map(s => ({ subject: s.subject, proficiency: s.proficiency })),
        achievements: achievements.map(a => ({
          name: a.achievement.name,
          icon: a.achievement.icon,
          earnedAt: a.earnedAt.toISOString()
        }))
      }
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize user' },
      { status: 500 }
    );
  }
}

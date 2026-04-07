import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ACHIEVEMENTS, checkAchievements, getAchievementById, type UserStats, type AchievementDefinition } from '@/lib/achievements'

// GET - Get user achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'earned' // earned, available, all

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's earned achievements
    const earnedAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' }
    })

    if (type === 'earned') {
      return NextResponse.json({ 
        achievements: earnedAchievements.map(ea => ({
          ...ea.achievement,
          earnedAt: ea.earnedAt
        }))
      })
    }

    if (type === 'available') {
      // Get all achievement definitions
      const earnedIds = earnedAchievements.map(ea => ea.achievement.id)
      const available = ACHIEVEMENTS.filter(a => !earnedIds.includes(a.id))

      return NextResponse.json({ achievements: available })
    }

    // All - return both earned and available with status
    const earnedMap = new Map(
      earnedAchievements.map(ea => [ea.achievement.id, ea.earnedAt])
    )

    const allAchievements = ACHIEVEMENTS.map(a => ({
      ...a,
      earnedAt: earnedMap.get(a.id) || null,
      isEarned: earnedMap.has(a.id)
    }))

    return NextResponse.json({ achievements: allAchievements })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

// POST - Check and award achievements
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, trigger } = body // trigger: 'match_end', 'friend_add', etc.

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user stats
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        achievements: { include: { achievement: true } },
        subjects: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get season progress for season achievements
    const seasonProgress = await db.seasonProgress.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    // Build stats object
    const stats: UserStats = {
      totalWins: user.totalWins,
      totalLosses: user.totalLosses,
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      knowledgeRating: user.knowledgeRating,
      perfectMatches: 0, // Would need to track this separately
      totalMatches: user.totalWins + user.totalLosses,
      friendsCount: 0,
      subjectsMastered: user.subjects.filter(s => s.proficiency >= 100).length,
      tournamentWins: 0, // Would need to track this
      seasonRank: seasonProgress?.rankAchieved
    }

    // Get friend count
    const friendCount = await db.friendship.count({
      where: {
        OR: [
          { requesterId: userId, status: 'accepted' },
          { accepterId: userId, status: 'accepted' }
        ]
      }
    })
    stats.friendsCount = friendCount

    // Get earned achievement IDs
    const earnedIds = user.achievements.map(a => a.achievement.id)

    // Check for new achievements
    const newAchievementIds = checkAchievements(stats, earnedIds)

    // Award new achievements
    const newAchievements: AchievementDefinition[] = []
    for (const achievementId of newAchievementIds) {
      const achievement = getAchievementById(achievementId)
      if (achievement) {
        await db.userAchievement.create({
          data: {
            userId,
            achievementId
          }
        })
        newAchievements.push(achievement)

        // Create activity for achievement
        await db.activity.create({
          data: {
            userId,
            type: 'achievement_earned',
            content: JSON.stringify({
              achievementId: achievement.id,
              achievementName: achievement.name,
              achievementIcon: achievement.icon,
              rarity: achievement.rarity
            }),
            visibility: 'public'
          }
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      newAchievements,
      stats 
    })
  } catch (error) {
    console.error('Error checking achievements:', error)
    return NextResponse.json({ error: 'Failed to check achievements' }, { status: 500 })
  }
}

// PUT - Manually award achievement (admin/system)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, achievementId } = body

    if (!userId || !achievementId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if achievement exists
    const achievement = getAchievementById(achievementId)
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    // Check if already earned
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId, achievementId }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Achievement already earned' }, { status: 400 })
    }

    // Award achievement
    await db.userAchievement.create({
      data: { userId, achievementId }
    })

    // Create activity
    await db.activity.create({
      data: {
        userId,
        type: 'achievement_earned',
        content: JSON.stringify({
          achievementId: achievement.id,
          achievementName: achievement.name,
          achievementIcon: achievement.icon,
          rarity: achievement.rarity
        }),
        visibility: 'public'
      }
    })

    return NextResponse.json({ success: true, achievement })
  } catch (error) {
    console.error('Error awarding achievement:', error)
    return NextResponse.json({ error: 'Failed to award achievement' }, { status: 500 })
  }
}

// Initialize achievements in database if not exists
export async function initializeAchievements() {
  try {
    for (const achievement of ACHIEVEMENTS) {
      await db.achievement.upsert({
        where: { id: achievement.id },
        create: {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          requirement: achievement.requirement,
          pointsRequired: achievement.pointsValue,
          rarity: achievement.rarity
        },
        update: {
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          requirement: achievement.requirement,
          pointsRequired: achievement.pointsValue,
          rarity: achievement.rarity
        }
      })
    }
    console.log('Achievements initialized')
  } catch (error) {
    console.error('Error initializing achievements:', error)
  }
}

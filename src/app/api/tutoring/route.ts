import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List tutoring sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get('tutorId');
    const studentId = searchParams.get('studentId');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');

    const where: {
      tutorId?: string;
      studentId?: string;
      subject?: string;
      status?: string;
    } = {};

    if (tutorId) where.tutorId = tutorId;
    if (studentId) where.studentId = studentId;
    if (subject) where.subject = subject;
    if (status) where.status = status;

    const sessions = await db.peerTutoringSession.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: 50
    });

    // Get tutor and student details
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const tutor = await db.user.findUnique({
          where: { id: session.tutorId },
          select: { id: true, name: true, knowledgeRating: true }
        });
        const student = await db.user.findUnique({
          where: { id: session.studentId },
          select: { id: true, name: true, knowledgeRating: true }
        });
        return {
          ...session,
          tutor,
          student
        };
      })
    );

    return NextResponse.json({
      success: true,
      sessions: sessionsWithDetails
    });

  } catch (error) {
    console.error('Get tutoring sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get sessions' },
      { status: 500 }
    );
  }
}

// POST - Create a tutoring session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorId, studentId, subject, scheduledAt, duration, notes } = body;

    if (!tutorId || !studentId || !subject || !scheduledAt) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify both users exist
    const [tutor, student] = await Promise.all([
      db.user.findUnique({ where: { id: tutorId } }),
      db.user.findUnique({ where: { id: studentId } })
    ]);

    if (!tutor || !student) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const session = await db.peerTutoringSession.create({
      data: {
        tutorId,
        studentId,
        subject,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        notes,
        status: 'scheduled'
      }
    });

    // Award "mentor" badge to tutor
    const existingBadge = await db.characterBadge.findUnique({
      where: {
        userId_badgeType: {
          userId: tutorId,
          badgeType: 'mentor'
        }
      }
    });

    if (!existingBadge) {
      await db.characterBadge.create({
        data: {
          userId: tutorId,
          badgeType: 'mentor',
          level: 1,
          metadata: JSON.stringify({ sessions: 1 })
        }
      });
    }

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Create tutoring session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// PUT - Update session status or add rating
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status, rating, feedback } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    const updateData: {
      status?: string;
      rating?: number;
      feedback?: string;
    } = {};

    if (status) updateData.status = status;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
      updateData.rating = rating;
    }
    if (feedback) updateData.feedback = feedback;

    const session = await db.peerTutoringSession.update({
      where: { id: sessionId },
      data: updateData
    });

    // If completed with good rating, update mentor badge level
    if (status === 'completed' && rating && rating >= 4) {
      const session = await db.peerTutoringSession.findUnique({
        where: { id: sessionId }
      });

      if (session) {
        const completedSessions = await db.peerTutoringSession.count({
          where: {
            tutorId: session.tutorId,
            status: 'completed',
            rating: { gte: 4 }
          }
        });

        // Level up badge every 5 completed sessions
        const newLevel = Math.min(5, Math.floor(completedSessions / 5) + 1);

        await db.characterBadge.upsert({
          where: {
            userId_badgeType: {
              userId: session.tutorId,
              badgeType: 'mentor'
            }
          },
          create: {
            userId: session.tutorId,
            badgeType: 'mentor',
            level: newLevel
          },
          update: {
            level: newLevel
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Update tutoring session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

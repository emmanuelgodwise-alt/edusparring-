import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/programs/incubation/enroll - Enroll student in Incubation Program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      email,
      phone,
      country,
      city,
      schoolName,
      gradeLevel,
      currentTerm,
      examGoals,
      whyJoin,
      semesterTerm,
      semesterYear,
      weeksUntilExams,
      examPeriod,
      studyTime,
      commitmentPledge,
      parentConsent,
    } = body;

    // Validation
    if (!fullName || !email || !phone || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required personal information' },
        { status: 400 }
      );
    }

    if (!schoolName || !gradeLevel) {
      return NextResponse.json(
        { success: false, error: 'Missing required academic information' },
        { status: 400 }
      );
    }

    if (!examGoals || examGoals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one exam goal is required' },
        { status: 400 }
      );
    }

    if (!studyTime || !commitmentPledge) {
      return NextResponse.json(
        { success: false, error: 'Commitment pledge must be accepted' },
        { status: 400 }
      );
    }

    if (!semesterTerm || !weeksUntilExams) {
      return NextResponse.json(
        { success: false, error: 'Semester information is required' },
        { status: 400 }
      );
    }

    // Find or create the Incubation Program
    let program = await prisma.program.findUnique({
      where: { slug: 'incubation' }
    });

    if (!program) {
      // Create the program if it doesn't exist
      program = await prisma.program.create({
        data: {
          name: 'Straight As Incubation Program',
          slug: 'incubation',
          description: 'Transform from an average student to a Straight As student this semester',
          longDescription: 'A life-changing semester-long program that pairs struggling students with verified volunteers for daily accountability.',
          icon: '🎓',
          color: 'purple',
          status: 'active',
          featured: true,
          openEnrollment: true,
          durationType: 'semester',
          semesterName: `Current Semester ${new Date().getFullYear()}`,
          durationDays: 90, // Approximate
        }
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create a new user for enrollment
      user = await prisma.user.create({
        data: {
          email,
          name: fullName,
          level: gradeLevel,
          country,
        }
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.programEnrollment.findUnique({
      where: {
        programId_studentId: {
          programId: program.id,
          studentId: user.id
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this program' },
        { status: 400 }
      );
    }

    // Create enrollment with semester data
    const enrollment = await prisma.programEnrollment.create({
      data: {
        programId: program.id,
        studentId: user.id,
        status: 'pending',
        pairingStatus: 'pending',
        totalDays: parseInt(weeksUntilExams) * 7, // Convert weeks to days
        examGoals: JSON.stringify(examGoals),
        // Semester tracking
        semesterName: `${semesterTerm === '1' ? 'First' : semesterTerm === '2' ? 'Second' : 'Third'} Term ${semesterYear}`,
        semesterYear: parseInt(semesterYear) || new Date().getFullYear(),
        semesterTerm: parseInt(semesterTerm) || 1,
        semesterEndsAt: examPeriod ? new Date(examPeriod) : null,
      }
    });

    // Create exam goal trackers
    for (const goal of examGoals) {
      await prisma.examGoalTracker.create({
        data: {
          enrollmentId: enrollment.id,
          subject: goal.subject,
          currentGrade: goal.currentGrade,
          targetGrade: goal.targetGrade,
        }
      });
    }

    // Update program participant count
    await prisma.program.update({
      where: { id: program.id },
      data: {
        currentParticipants: { increment: 1 }
      }
    });

    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        message: 'Successfully enrolled in the Straight As Incubation Program. You will be matched with a volunteer mentor within 24-48 hours.'
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}

// GET /api/programs/incubation/enroll - Get enrollment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the program
    const program = await prisma.program.findUnique({
      where: { slug: 'incubation' }
    });

    if (!program) {
      return NextResponse.json({
        success: true,
        enrolled: false,
        message: 'Program not found'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        enrolled: false
      });
    }

    // Check enrollment
    const enrollment = await prisma.programEnrollment.findUnique({
      where: {
        programId_studentId: {
          programId: program.id,
          studentId: user.id
        }
      },
      include: {
        program: true
      }
    });

    return NextResponse.json({
      success: true,
      enrolled: !!enrollment,
      enrollment: enrollment ? {
        id: enrollment.id,
        status: enrollment.status,
        currentDay: enrollment.currentDay,
        notesRead: enrollment.notesRead,
        summariesWritten: enrollment.summariesWritten,
        pairingStatus: enrollment.pairingStatus,
        enrolledAt: enrollment.enrolledAt,
      } : null
    });

  } catch (error) {
    console.error('Error checking enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check enrollment status' },
      { status: 500 }
    );
  }
}

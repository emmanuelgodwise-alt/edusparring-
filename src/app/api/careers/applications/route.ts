import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - List applications (for student or employer)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const positionId = searchParams.get('positionId');
  const status = searchParams.get('status');

  try {
    const where: any = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (positionId) {
      where.positionId = positionId;
    }

    if (status) {
      where.status = status;
    }

    const applications = await prisma.mockJobApplication.findMany({
      where,
      include: {
        position: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST - Submit an application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { positionId, studentId, coverLetter, portfolio, krAtApplication, winsAtApplication, badgesAtApplication } = body;

    if (!positionId || !studentId) {
      return NextResponse.json(
        { success: false, error: 'Position ID and Student ID are required' },
        { status: 400 }
      );
    }

    // Check if position exists and is open
    const position = await prisma.mockJobPosition.findUnique({
      where: { id: positionId },
    });

    if (!position) {
      return NextResponse.json(
        { success: false, error: 'Position not found' },
        { status: 404 }
      );
    }

    if (position.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'This position is no longer accepting applications' },
        { status: 400 }
      );
    }

    if (position.filled >= position.spots) {
      return NextResponse.json(
        { success: false, error: 'All positions have been filled' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.mockJobApplication.findUnique({
      where: {
        positionId_studentId: {
          positionId,
          studentId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.mockJobApplication.create({
      data: {
        positionId,
        studentId,
        coverLetter,
        portfolio,
        krAtApplication: krAtApplication || 0,
        winsAtApplication: winsAtApplication || 0,
        badgesAtApplication: JSON.stringify(badgesAtApplication || []),
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// PUT - Update application status (accept/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, reviewNotes, reviewedBy } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    // Update application
    const application = await prisma.mockJobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewNotes,
        reviewedBy,
        reviewedAt: new Date(),
      },
    });

    // If accepted, create placement
    if (status === 'accepted') {
      await prisma.mockJobPlacement.create({
        data: {
          applicationId,
          studentId: application.studentId,
          positionId: application.positionId,
          status: 'scheduled',
        },
      });

      // Update filled count
      await prisma.mockJobPosition.update({
        where: { id: application.positionId },
        data: { filled: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

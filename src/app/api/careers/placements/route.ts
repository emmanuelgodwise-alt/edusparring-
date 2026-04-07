import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get placements for a student
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');

  try {
    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const where: any = { studentId };
    if (status) {
      where.status = status;
    }

    const placements = await prisma.mockJobPlacement.findMany({
      where,
      include: {
        application: {
          include: {
            position: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      placements,
    });
  } catch (error) {
    console.error('Error fetching placements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch placements' },
      { status: 500 }
    );
  }
}

// PUT - Update placement status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { placementId, status, workLog, paymentStatus, paymentDate, paymentAmount } = body;

    if (!placementId) {
      return NextResponse.json(
        { success: false, error: 'Placement ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (workLog) updateData.workLog = JSON.stringify(workLog);
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentDate) updateData.paymentDate = new Date(paymentDate);
    if (paymentAmount) updateData.paymentAmount = paymentAmount;

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const placement = await prisma.mockJobPlacement.update({
      where: { id: placementId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      placement,
    });
  } catch (error) {
    console.error('Error updating placement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update placement' },
      { status: 500 }
    );
  }
}

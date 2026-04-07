import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporterId, reportedUserId, contentType, contentId, reportedContent, reason, description } = body;

    if (!reporterId || !contentType || !reportedContent || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = ['post', 'comment', 'message', 'profile', 'circle', 'other'];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Validate reason
    const validReasons = ['harassment', 'inappropriate', 'spam', 'bullying', 'cheating', 'other'];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reason' },
        { status: 400 }
      );
    }

    // Create the report
    const report = await db.contentReport.create({
      data: {
        reporterId,
        reportedUserId,
        contentType,
        contentId,
        reportedContent,
        reason,
        description,
        status: 'pending'
      }
    });

    // Notify guardians if the reporter is a student
    // In production, this would trigger notifications

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. We will review it shortly.',
      reportId: report.id
    });

  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reporterId = searchParams.get('reporterId');
    const status = searchParams.get('status');

    if (!reporterId) {
      return NextResponse.json(
        { success: false, error: 'Missing reporterId' },
        { status: 400 }
      );
    }

    const where: { reporterId: string; status?: string } = { reporterId };
    if (status) {
      where.status = status;
    }

    const reports = await db.contentReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      reports
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get reports' },
      { status: 500 }
    );
  }
}

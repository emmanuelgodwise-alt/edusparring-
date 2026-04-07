import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, guardianEmail, guardianName, relationship, accessLevel } = body;

    if (!studentId || !guardianEmail || !guardianName || !relationship) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate relationship
    const validRelationships = ['parent', 'guardian', 'teacher'];
    if (!validRelationships.includes(relationship)) {
      return NextResponse.json(
        { success: false, error: 'Invalid relationship type' },
        { status: 400 }
      );
    }

    // Validate access level
    const validAccessLevels = ['basic', 'full'];
    const finalAccessLevel = accessLevel && ['basic', 'full'].includes(accessLevel) 
      ? accessLevel 
      : 'basic';

    // Check if student exists
    const student = await db.user.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if guardian link already exists
    const existingLink = await db.guardianLink.findFirst({
      where: {
        studentId,
        guardianEmail: guardianEmail.toLowerCase()
      }
    });

    if (existingLink) {
      return NextResponse.json(
        { success: false, error: 'This guardian is already linked to your account' },
        { status: 400 }
      );
    }

    // Create guardian link
    const guardianLink = await db.guardianLink.create({
      data: {
        studentId,
        guardianEmail: guardianEmail.toLowerCase(),
        guardianName,
        relationship,
        accessLevel: finalAccessLevel,
        weeklyReportEnabled: true,
        status: 'pending'
      }
    });

    // In production, send invitation email to guardian here

    return NextResponse.json({
      success: true,
      message: 'Guardian invitation sent successfully',
      link: {
        id: guardianLink.id,
        guardianEmail: guardianLink.guardianEmail,
        guardianName: guardianLink.guardianName,
        relationship: guardianLink.relationship,
        status: guardianLink.status
      }
    });

  } catch (error) {
    console.error('Guardian link error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to link guardian' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing studentId' },
        { status: 400 }
      );
    }

    const guardianLinks = await db.guardianLink.findMany({
      where: { studentId }
    });

    return NextResponse.json({
      success: true,
      guardians: guardianLinks
    });

  } catch (error) {
    console.error('Get guardian links error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get guardian links' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId, studentId } = body;

    if (!linkId || !studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify ownership
    const link = await db.guardianLink.findFirst({
      where: { id: linkId, studentId }
    });

    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Guardian link not found' },
        { status: 404 }
      );
    }

    await db.guardianLink.delete({
      where: { id: linkId }
    });

    return NextResponse.json({
      success: true,
      message: 'Guardian link removed'
    });

  } catch (error) {
    console.error('Delete guardian link error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove guardian link' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, verificationCode } = body;

    if (!userId || !verificationCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the verification record
    const verification = await db.studentVerification.findUnique({
      where: { userId }
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'No verification request found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (verification.verificationStatus === 'verified') {
      return NextResponse.json({
        success: true,
        message: 'Already verified',
        alreadyVerified: true
      });
    }

    // Verify the code
    if (verification.verificationCode !== verificationCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update verification status
    await db.studentVerification.update({
      where: { userId },
      data: {
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verificationCode: null // Clear the code after use
      }
    });

    // Award a verification badge
    const existingBadge = await db.characterBadge.findUnique({
      where: {
        userId_badgeType: {
          userId,
          badgeType: 'verified'
        }
      }
    });

    if (!existingBadge) {
      await db.characterBadge.create({
        data: {
          userId,
          badgeType: 'verified',
          level: 1,
          metadata: JSON.stringify({
            earnedFrom: 'school_verification',
            schoolName: verification.schoolName
          })
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your account has been verified!',
      schoolName: verification.schoolName
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}

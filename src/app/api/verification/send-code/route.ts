import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Valid school email domains for verification
const VALID_SCHOOL_DOMAINS = [
  '.edu', '.k12', '.ac.uk', '.edu.au', '.ac.jp', '.edu.cn',
  '.edu.in', '.edu.br', '.edu.mx', '.ac.kr', '.edu.sg'
];

function isValidSchoolEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // Check for known school domain patterns
  return VALID_SCHOOL_DOMAINS.some(validDomain => domain.endsWith(validDomain));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, schoolEmail, schoolName } = body;

    if (!userId || !schoolEmail || !schoolName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(schoolEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if it's a valid school email
    if (!isValidSchoolEmail(schoolEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please use a valid school email address (.edu, .k12, etc.)' },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingVerification = await db.studentVerification.findFirst({
      where: {
        schoolEmail: schoolEmail.toLowerCase(),
        userId: { not: userId }
      }
    });

    if (existingVerification) {
      return NextResponse.json(
        { success: false, error: 'This school email is already registered' },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert verification record
    await db.studentVerification.upsert({
      where: { userId },
      create: {
        userId,
        schoolEmail: schoolEmail.toLowerCase(),
        schoolName,
        verificationCode,
        verificationStatus: 'pending'
      },
      update: {
        schoolEmail: schoolEmail.toLowerCase(),
        schoolName,
        verificationCode,
        verificationStatus: 'pending'
      }
    });

    // In production, send actual email here
    // For demo, we'll return the code (remove in production!)
    console.log(`[DEV] Verification code for ${schoolEmail}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your school email',
      // Remove this in production!
      devCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
    });

  } catch (error) {
    console.error('Send verification code error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

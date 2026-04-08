import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { completed } = body;

    // Update user's onboarding status
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { hasCompletedOnboarding: completed }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      }
    });
  } catch (error) {
    console.error('Failed to update onboarding status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update onboarding status' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { hasCompletedOnboarding: true }
    });

    return NextResponse.json({
      success: true,
      hasCompletedOnboarding: user?.hasCompletedOnboarding ?? false
    });
  } catch (error) {
    console.error('Failed to get onboarding status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get onboarding status' },
      { status: 500 }
    );
  }
}

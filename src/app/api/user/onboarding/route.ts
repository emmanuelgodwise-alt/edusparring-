import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST: Handle onboarding skip or complete
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
    const { action } = body; // "skip" or "complete"

    let user;

    if (action === 'skip') {
      // Increment skip count
      user = await prisma.user.update({
        where: { email: session.user.email },
        data: { 
          onboardingSkipCount: { increment: 1 }
        },
        select: {
          id: true,
          onboardingSkipCount: true,
          hasCompletedOnboarding: true
        }
      });

      return NextResponse.json({
        success: true,
        action: 'skip',
        user: {
          id: user.id,
          onboardingSkipCount: user.onboardingSkipCount,
          hasCompletedOnboarding: user.hasCompletedOnboarding
        }
      });
    } else if (action === 'complete') {
      // Mark onboarding as completed
      user = await prisma.user.update({
        where: { email: session.user.email },
        data: { hasCompletedOnboarding: true },
        select: {
          id: true,
          onboardingSkipCount: true,
          hasCompletedOnboarding: true
        }
      });

      return NextResponse.json({
        success: true,
        action: 'complete',
        user: {
          id: user.id,
          onboardingSkipCount: user.onboardingSkipCount,
          hasCompletedOnboarding: user.hasCompletedOnboarding
        }
      });
    } else {
      // Legacy support: if no action specified, treat as complete
      user = await prisma.user.update({
        where: { email: session.user.email },
        data: { hasCompletedOnboarding: true },
        select: {
          id: true,
          onboardingSkipCount: true,
          hasCompletedOnboarding: true
        }
      });

      return NextResponse.json({
        success: true,
        action: 'complete',
        user: {
          id: user.id,
          onboardingSkipCount: user.onboardingSkipCount,
          hasCompletedOnboarding: user.hasCompletedOnboarding
        }
      });
    }
  } catch (error) {
    console.error('Failed to update onboarding status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update onboarding status' },
      { status: 500 }
    );
  }
}

// GET: Get onboarding status
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
      select: { 
        hasCompletedOnboarding: true,
        onboardingSkipCount: true
      }
    });

    // User should see onboarding if:
    // - They haven't completed it AND they haven't skipped 5+ times
    const shouldShowOnboarding = !user?.hasCompletedOnboarding && (user?.onboardingSkipCount ?? 0) < 5;

    return NextResponse.json({
      success: true,
      hasCompletedOnboarding: user?.hasCompletedOnboarding ?? false,
      onboardingSkipCount: user?.onboardingSkipCount ?? 0,
      shouldShowOnboarding
    });
  } catch (error) {
    console.error('Failed to get onboarding status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get onboarding status' },
      { status: 500 }
    );
  }
}

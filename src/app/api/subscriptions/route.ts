import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get user subscription
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    // If no subscription, return free tier
    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: {
          plan: 'free',
          status: 'active',
          price: 0,
          currency: 'USD',
          billingCycle: 'monthly',
        },
      });
    }

    // Check if subscription is expired
    if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
      // Update status to expired
      await prisma.userSubscription.update({
        where: { userId },
        data: { status: 'expired' },
      });
      subscription.status = 'expired';
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

// POST - Create or upgrade subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plan, billingCycle, stripeCustomerId, stripeSubscriptionId, stripePriceId } = body;

    if (!userId || !plan) {
      return NextResponse.json(
        { success: false, error: 'User ID and plan are required' },
        { status: 400 }
      );
    }

    // Plan pricing
    const PLAN_PRICING: Record<string, { monthly: number; yearly: number }> = {
      free: { monthly: 0, yearly: 0 },
      scholar: { monthly: 4.99, yearly: 49 },
      champion: { monthly: 9.99, yearly: 99 },
      elite: { monthly: 19.99, yearly: 199 },
    };

    const pricing = PLAN_PRICING[plan];
    if (!pricing) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const price = billingCycle === 'yearly' ? pricing.yearly : pricing.monthly;
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

    // Upsert subscription
    const subscription = await prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: 'active',
        price,
        currency: 'USD',
        billingCycle: billingCycle || 'monthly',
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
      },
      update: {
        plan,
        status: 'active',
        price,
        billingCycle: billingCycle || 'monthly',
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
        canceledAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// PUT - Cancel subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (action === 'cancel') {
      const subscription = await prisma.userSubscription.update({
        where: { userId },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        subscription,
        message: 'Subscription canceled. You will have access until the end of your billing period.',
      });
    }

    if (action === 'reactivate') {
      const subscription = await prisma.userSubscription.update({
        where: { userId },
        data: {
          status: 'active',
          canceledAt: null,
        },
      });

      return NextResponse.json({
        success: true,
        subscription,
        message: 'Subscription reactivated.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

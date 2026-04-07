import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - List all mock job positions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry');
  const status = searchParams.get('status') || 'published';
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const where: any = {
      status,
    };

    if (industry) {
      where.industry = industry;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const positions = await prisma.mockJobPosition.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const total = await prisma.mockJobPosition.count({ where });

    return NextResponse.json({
      success: true,
      positions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + positions.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}

// POST - Create a new mock job position
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      company,
      companyId,
      industry,
      department,
      location,
      remote,
      duration,
      spots,
      compensation,
      currency,
      minKR,
      requiredBadges,
      requiredSubjects,
      minWins,
      minWinRate,
      applicationDeadline,
    } = body;

    // Validate required fields
    if (!title || !description || !company || !industry || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const position = await prisma.mockJobPosition.create({
      data: {
        title,
        description,
        company,
        companyId,
        industry,
        department,
        location,
        remote: remote ?? false,
        duration: duration ?? 14,
        spots: spots ?? 1,
        compensation: parseFloat(compensation) || 0,
        currency: currency || 'USD',
        minKR: minKR ?? 1200,
        requiredBadges: JSON.stringify(requiredBadges || []),
        requiredSubjects: JSON.stringify(requiredSubjects || []),
        minWins: minWins ?? 10,
        minWinRate: minWinRate ?? 0.6,
        status: 'draft',
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      },
    });

    return NextResponse.json({
      success: true,
      position,
    });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create position' },
      { status: 500 }
    );
  }
}

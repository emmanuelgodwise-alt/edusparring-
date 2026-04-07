import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - List employer partners (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry');
  const status = searchParams.get('status') || 'approved';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const where: any = { status };

    if (industry) {
      where.industry = industry;
    }

    const employers = await prisma.employerPartner.findMany({
      where,
      take: limit,
      orderBy: [
        { tier: 'desc' },
        { totalPlacements: 'desc' },
      ],
      select: {
        id: true,
        companyName: true,
        logo: true,
        industry: true,
        description: true,
        location: true,
        country: true,
        tier: true,
        totalPositions: true,
        totalPlacements: true,
        avgRating: true,
      },
    });

    return NextResponse.json({
      success: true,
      employers,
    });
  } catch (error) {
    console.error('Error fetching employers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employers' },
      { status: 500 }
    );
  }
}

// POST - Register as employer partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      industry,
      description,
      website,
      location,
      country,
      contactName,
      contactEmail,
      contactPhone,
    } = body;

    // Validate required fields
    if (!companyName || !industry || !location || !country || !contactName || !contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if company already exists
    const existingEmployer = await prisma.employerPartner.findUnique({
      where: { companyName },
    });

    if (existingEmployer) {
      return NextResponse.json(
        { success: false, error: 'Company already registered' },
        { status: 400 }
      );
    }

    // Create employer partner
    const employer = await prisma.employerPartner.create({
      data: {
        companyName,
        industry,
        description,
        website,
        location,
        country,
        contactName,
        contactEmail,
        contactPhone,
        status: 'pending',
        tier: 'standard',
      },
    });

    return NextResponse.json({
      success: true,
      employer,
      message: 'Application submitted successfully. We will review and get back to you within 2-3 business days.',
    });
  } catch (error) {
    console.error('Error registering employer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register employer' },
      { status: 500 }
    );
  }
}

// PUT - Update employer partner status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { employerId, status, tier } = body;

    if (!employerId) {
      return NextResponse.json(
        { success: false, error: 'Employer ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (tier) updateData.tier = tier;

    const employer = await prisma.employerPartner.update({
      where: { id: employerId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      employer,
    });
  } catch (error) {
    console.error('Error updating employer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update employer' },
      { status: 500 }
    );
  }
}

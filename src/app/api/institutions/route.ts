import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - List institutional partners (public info only)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const country = searchParams.get('country');
  const status = searchParams.get('status') || 'active';

  try {
    const where: any = { status, verified: true };

    if (type) {
      where.type = type;
    }

    if (country) {
      where.country = country;
    }

    const partners = await prisma.institutionalPartner.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        country: true,
        partnershipType: true,
        studentCount: true,
        canAdministerExams: true,
      },
      orderBy: { studentCount: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

// POST - Register new institutional partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      country,
      region,
      adminName,
      adminEmail,
      adminPhone,
      website,
      partnershipType,
      studentCount,
    } = body;

    // Validate required fields
    if (!name || !type || !country || !adminName || !adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if organization already exists
    const existingPartner = await prisma.institutionalPartner.findFirst({
      where: {
        name,
        country,
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { success: false, error: 'Organization already registered' },
        { status: 400 }
      );
    }

    // Create partner
    const partner = await prisma.institutionalPartner.create({
      data: {
        name,
        type,
        country,
        region,
        adminName,
        adminEmail,
        adminPhone,
        website,
        partnershipType: partnershipType || 'trial',
        status: 'pending',
        studentCount: studentCount ? parseInt(studentCount) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      partner,
      message: 'Application submitted successfully. Our partnerships team will contact you within 24 hours.',
    });
  } catch (error) {
    console.error('Error registering partner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register partner' },
      { status: 500 }
    );
  }
}

// PUT - Update partner status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId, status, partnershipType, verified, canAdministerExams, features } = body;

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (partnershipType) updateData.partnershipType = partnershipType;
    if (verified !== undefined) {
      updateData.verified = verified;
      if (verified) updateData.verifiedAt = new Date();
    }
    if (canAdministerExams !== undefined) updateData.canAdministerExams = canAdministerExams;
    if (features) updateData.features = JSON.stringify(features);

    const partner = await prisma.institutionalPartner.update({
      where: { id: partnerId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      partner,
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}

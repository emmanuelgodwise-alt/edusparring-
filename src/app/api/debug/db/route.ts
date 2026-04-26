import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Try to count users
    const userCount = await prisma.user.count();

    // Check if User table exists by trying a simple query
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true }
    });

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      sampleUser: testUser ? { id: testUser.id, email: testUser.email } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database debug error:", error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

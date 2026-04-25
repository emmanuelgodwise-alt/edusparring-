import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  };

  // Check 1: Environment variables are set
  diagnostics.checks = {
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
    DIRECT_URL_set: !!process.env.DIRECT_URL,
    NEXTAUTH_SECRET_set: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL_set: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_value: process.env.NEXTAUTH_URL,
  };

  // Check 2: Database connection
  try {
    await prisma.$connect();
    diagnostics.checks.database_connection = "SUCCESS";

    // Check 3: Can query users table
    const userCount = await prisma.user.count();
    diagnostics.checks.users_table_exists = true;
    diagnostics.checks.users_count = userCount;

  } catch (error: unknown) {
    diagnostics.checks.database_connection = "FAILED";
    if (error instanceof Error) {
      diagnostics.checks.database_error = error.message;
    } else {
      diagnostics.checks.database_error = String(error);
    }
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(diagnostics, { status: 200 });
}

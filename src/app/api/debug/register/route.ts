import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Log incoming request
    console.log("Debug register request:", { name, email, passwordLength: password?.length });

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: "Missing fields",
        received: { name: !!name, email: !!email, password: !!password }
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: "User already exists",
        userId: existingUser.id
      }, { status: 400 });
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully");

    // Create user
    console.log("Creating user in database...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country: null,
        knowledgeRating: 800,
        level: "High School",
        language: "en",
      },
    });
    console.log("User created:", user.id);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Debug register error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined
    }, { status: 500 });
  }
}

// GET endpoint to test with predefined data
export async function GET() {
  try {
    const testEmail = `test${Date.now()}@test.com`;
    const testPassword = "TestPass123";

    console.log("Creating test user:", testEmail);

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail,
        password: hashedPassword,
        knowledgeRating: 800,
        level: "High School",
        language: "en",
      },
    });

    // Verify user was created
    const verifyUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    return NextResponse.json({
      success: true,
      message: "Test user created and verified",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      verified: !!verifyUser,
      totalUsers: await prisma.user.count()
    });

  } catch (error) {
    console.error("Debug GET error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined,
      errorType: error?.constructor?.name
    }, { status: 500 });
  }
}

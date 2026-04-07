import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/videos - List videos with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};
    
    if (subject && subject !== 'All') {
      where.subject = subject;
    }
    
    if (type && type !== 'All') {
      where.type = type;
    }
    
    if (difficulty && difficulty !== 'All') {
      where.difficulty = difficulty;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = { views: 'desc' };
    }

    // For now, return mock data since we don't have a Video table in the schema
    // In production, this would query the database
    const mockVideos = [
      {
        id: '1',
        title: 'Solving Quadratic Equations - Complete Guide',
        description: 'Learn all methods to solve quadratic equations step by step.',
        subject: 'Math',
        topic: 'Algebra',
        thumbnailUrl: 'https://picsum.photos/seed/math1/640/360',
        videoUrl: '/videos/sample.mp4',
        duration: 845,
        views: 15420,
        likes: 892,
        creatorId: 't1',
        creatorName: 'Prof. Mathews',
        type: 'lesson',
        difficulty: 'intermediate',
        tags: ['quadratic', 'equations', 'algebra'],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        isLive: false,
      },
      {
        id: '2',
        title: 'Newton\'s Laws of Motion Explained',
        description: 'Understanding the three laws of motion with real-world examples.',
        subject: 'Physics',
        topic: 'Mechanics',
        thumbnailUrl: 'https://picsum.photos/seed/physics1/640/360',
        videoUrl: '/videos/sample.mp4',
        duration: 1200,
        views: 23100,
        likes: 1456,
        creatorId: 't2',
        creatorName: 'Dr. Physics',
        type: 'lesson',
        difficulty: 'beginner',
        tags: ['newton', 'motion', 'forces'],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        isLive: false,
      },
      {
        id: '3',
        title: 'JAMB 2024 Chemistry Solutions',
        description: 'Step-by-step solutions to JAMB chemistry questions.',
        subject: 'Chemistry',
        topic: 'Exam Prep',
        thumbnailUrl: 'https://picsum.photos/seed/chem1/640/360',
        videoUrl: '/videos/sample.mp4',
        duration: 2400,
        views: 45000,
        likes: 3200,
        creatorId: 't3',
        creatorName: 'Chem Master',
        type: 'solution',
        difficulty: 'advanced',
        tags: ['JAMB', 'chemistry', 'solutions'],
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        isLive: false,
      },
    ];

    // Apply filters to mock data
    let filteredVideos = mockVideos;
    if (subject && subject !== 'All') {
      filteredVideos = filteredVideos.filter(v => v.subject === subject);
    }
    if (type && type !== 'All') {
      filteredVideos = filteredVideos.filter(v => v.type === type);
    }
    if (difficulty && difficulty !== 'All') {
      filteredVideos = filteredVideos.filter(v => v.difficulty === difficulty);
    }
    if (search) {
      const query = search.toLowerCase();
      filteredVideos = filteredVideos.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      videos: filteredVideos,
      total: filteredVideos.length,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos - Upload a new video
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string || '{}');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!metadata.title || !metadata.subject) {
      return NextResponse.json(
        { success: false, error: 'Title and subject are required' },
        { status: 400 }
      );
    }

    // In production, upload to cloud storage (S3, Cloudflare R2, etc.)
    // For now, just return success
    const videoId = `video_${Date.now()}`;

    return NextResponse.json({
      success: true,
      video: {
        id: videoId,
        ...metadata,
        videoUrl: `/videos/${videoId}.mp4`,
        thumbnailUrl: `/thumbnails/${videoId}.jpg`,
        duration: 0,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLive: false,
      },
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

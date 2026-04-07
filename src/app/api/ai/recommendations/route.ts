import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// POST /api/ai/recommendations - Generate personalized recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subjects, recentPerformance, learningGoals } = body;

    // In production, fetch user's learning profile from database
    // For now, generate recommendations based on available data

    const systemPrompt = `You are an AI learning advisor for EduSparring. Based on the student's profile, generate personalized learning recommendations.

Available activity types:
- practice: Practice problems and exercises
- video: Educational videos and tutorials
- lesson: Structured lessons
- challenge: Challenge problems and competitions
- review: Spaced repetition review

Generate 3-5 specific recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "practice|video|lesson|challenge|review",
      "subject": "Subject name",
      "topic": "Specific topic",
      "title": "Activity title",
      "description": "Brief description",
      "reason": "Why this is recommended for this student",
      "priority": "high|medium|low",
      "estimatedDuration": minutes (number)
    }
  ]
}`;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Generate recommendations for a student with:
- Subjects of interest: ${subjects?.join(', ') || 'Math, Physics'}
- Recent accuracy: ${recentPerformance?.accuracy || '65%'}
- Learning goals: ${learningGoals?.join(', ') || 'Improve problem solving skills'}

Return only valid JSON.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let recommendations = [];
    try {
      const content = completion.choices[0]?.message?.content || '';
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        recommendations = parsed.recommendations || [];
      }
    } catch (e) {
      console.error('Failed to parse AI recommendations:', e);
    }

    // If AI failed to generate, use fallback recommendations
    if (recommendations.length === 0) {
      recommendations = [
        {
          type: 'practice',
          subject: 'Math',
          topic: 'Algebra',
          title: 'Practice Algebra Fundamentals',
          description: 'Strengthen your algebra skills with targeted practice',
          reason: 'Building a strong foundation in algebra will help with advanced topics',
          priority: 'high',
          estimatedDuration: 15,
        },
        {
          type: 'video',
          subject: 'Physics',
          topic: 'Mechanics',
          title: 'Understanding Forces',
          description: 'Watch an engaging explanation of force and motion',
          reason: 'Visual learning helps reinforce theoretical concepts',
          priority: 'medium',
          estimatedDuration: 20,
        },
        {
          type: 'review',
          subject: 'Chemistry',
          topic: 'Periodic Table',
          title: 'Review Periodic Trends',
          description: 'Refresh your knowledge of element properties',
          reason: 'Spaced repetition helps long-term retention',
          priority: 'medium',
          estimatedDuration: 10,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/ai/recommendations - Get cached recommendations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Return mock recommendations for now
  return NextResponse.json({
    success: true,
    recommendations: [
      {
        id: '1',
        type: 'practice',
        subject: 'Math',
        topic: 'Quadratic Equations',
        title: 'Practice Quadratic Equations',
        description: 'Review solving quadratic equations',
        reason: 'Based on your recent performance',
        priority: 'high',
        relevanceScore: 0.92,
        estimatedDuration: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'video',
        subject: 'Physics',
        topic: "Newton's Laws",
        title: "Watch: Newton's Laws Explained",
        description: 'Comprehensive video on laws of motion',
        reason: 'You expressed interest in mechanics',
        priority: 'medium',
        relevanceScore: 0.85,
        estimatedDuration: 20,
        createdAt: new Date().toISOString(),
      },
    ],
  });
}

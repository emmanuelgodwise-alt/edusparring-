import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { prisma } from '@/lib/db';

// Content categories for moderation
export enum ModerationCategory {
  SAFE = 'safe',
  BULLYING = 'bullying',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  INAPPROPRIATE = 'inappropriate',
  PERSONAL_INFO = 'personal_info',
  SPAM = 'spam',
  SCAM = 'scam',
  SELF_HARM = 'self_harm',
  VIOLENCE = 'violence',
}

// Severity levels
export enum SeverityLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

// Moderation result interface
export interface ModerationResult {
  isSafe: boolean;
  category: ModerationCategory;
  severity: SeverityLevel;
  confidence: number;
  flaggedPhrases: string[];
  suggestion: string;
  shouldBlock: boolean;
  shouldWarn: boolean;
  shouldReport: boolean;
}

// Request interface
interface ModerationRequest {
  text: string;
  userId: string;
  context?: 'chat' | 'profile' | 'post' | 'comment' | 'username';
  targetUserId?: string;
}

// Response interface
interface ModerationResponse {
  success: boolean;
  result?: ModerationResult;
  error?: string;
}

// POST - Moderate text content
export async function POST(request: NextRequest): Promise<NextResponse<ModerationResponse>> {
  try {
    const body: ModerationRequest = await request.json();
    const { text, userId, context = 'chat', targetUserId } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Text is required'
      }, { status: 400 });
    }

    // Skip moderation for very short messages
    if (text.trim().length < 3) {
      return NextResponse.json({
        success: true,
        result: {
          isSafe: true,
          category: ModerationCategory.SAFE,
          severity: SeverityLevel.NONE,
          confidence: 1.0,
          flaggedPhrases: [],
          suggestion: '',
          shouldBlock: false,
          shouldWarn: false,
          shouldReport: false,
        }
      });
    }

    // Perform AI moderation
    const result = await moderateWithAI(text, context);

    // Log the moderation result
    try {
      await prisma.moderationLog.create({
        data: {
          userId,
          targetUserId,
          content: text.substring(0, 500),
          category: result.category,
          severity: result.severity,
          isSafe: result.isSafe,
          confidence: result.confidence,
          context,
          action: result.shouldBlock ? 'blocked' : result.shouldWarn ? 'warned' : 'allowed',
        }
      });
    } catch (logError) {
      console.log('Failed to log moderation:', logError);
    }

    // If high severity, create a report automatically
    if (result.shouldReport) {
      try {
        await prisma.safetyReport.create({
          data: {
            reporterId: 'system',
            reportedUserId: userId,
            type: 'content_violation',
            category: result.category,
            description: `Automatic flag: ${result.category} detected with ${result.severity} severity`,
            content: text.substring(0, 500),
            status: 'pending',
          }
        });
      } catch (reportError) {
        console.log('Failed to create report:', reportError);
      }
    }

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Moderation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Moderation failed'
    }, { status: 500 });
  }
}

// AI-powered moderation
async function moderateWithAI(
  text: string,
  context: string
): Promise<ModerationResult> {
  try {
    const zai = await ZAI.create();

    const systemPrompt = `You are a content moderation AI for an educational platform for students. Your task is to analyze text and determine if it contains inappropriate content.

Analyze the text for the following categories:
1. BULLYING - Harassment, insults, targeting individuals
2. HARASSMENT - Unwanted advances, persistent unwanted contact
3. HATE_SPEECH - Discrimination based on race, religion, gender, etc.
4. INAPPROPRIATE - Sexual content, explicit language
5. PERSONAL_INFO - Sharing of phone numbers, addresses, personal details
6. SPAM - Repetitive, promotional, or irrelevant content
7. SCAM - Attempts to deceive or defraud
8. SELF_HARM - Content suggesting self-harm or suicide
9. VIOLENCE - Threats of violence or violent content
10. SAFE - None of the above

Respond in JSON format:
{
  "category": "CATEGORY_NAME",
  "severity": 0-4,
  "confidence": 0.0-1.0,
  "flaggedPhrases": ["phrase1", "phrase2"],
  "explanation": "Brief explanation",
  "suggestion": "What the user should do instead"
}

Be strict but fair. Remember this is a platform for students. False positives are better than false negatives for safety.`;

    const userPrompt = `Analyze this ${context} content for a student educational platform:\n\n"${text}"`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1, // Low temperature for consistent moderation
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    let moderationData;
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moderationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // Default to safe if parsing fails
      return createSafeResult();
    }

    // Map the category
    const category = mapCategory(moderationData.category);
    const severity = Math.min(4, Math.max(0, parseInt(moderationData.severity) || 0));
    const confidence = Math.min(1, Math.max(0, parseFloat(moderationData.confidence) || 0.5));

    // Determine actions
    const isSafe = category === ModerationCategory.SAFE || severity <= 1;
    const shouldBlock = severity >= 3 || (severity >= 2 && confidence >= 0.8);
    const shouldWarn = severity === 2 || (severity === 1 && confidence >= 0.9);
    const shouldReport = severity >= 3 || 
      (category === ModerationCategory.SELF_HARM && severity >= 2);

    return {
      isSafe,
      category,
      severity,
      confidence,
      flaggedPhrases: moderationData.flaggedPhrases || [],
      suggestion: moderationData.suggestion || '',
      shouldBlock,
      shouldWarn,
      shouldReport,
    };

  } catch (error) {
    console.error('AI moderation failed:', error);
    // Return safe result on error to avoid blocking legitimate content
    return createSafeResult();
  }
}

// Map string category to enum
function mapCategory(categoryStr: string): ModerationCategory {
  const categoryMap: Record<string, ModerationCategory> = {
    'BULLYING': ModerationCategory.BULLYING,
    'HARASSMENT': ModerationCategory.HARASSMENT,
    'HATE_SPEECH': ModerationCategory.HATE_SPEECH,
    'INAPPROPRIATE': ModerationCategory.INAPPROPRIATE,
    'PERSONAL_INFO': ModerationCategory.PERSONAL_INFO,
    'SPAM': ModerationCategory.SPAM,
    'SCAM': ModerationCategory.SCAM,
    'SELF_HARM': ModerationCategory.SELF_HARM,
    'VIOLENCE': ModerationCategory.VIOLENCE,
    'SAFE': ModerationCategory.SAFE,
  };
  return categoryMap[categoryStr?.toUpperCase()] || ModerationCategory.SAFE;
}

// Create a safe result
function createSafeResult(): ModerationResult {
  return {
    isSafe: true,
    category: ModerationCategory.SAFE,
    severity: SeverityLevel.NONE,
    confidence: 1.0,
    flaggedPhrases: [],
    suggestion: '',
    shouldBlock: false,
    shouldWarn: false,
    shouldReport: false,
  };
}

// GET - Get moderation stats for a user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const stats = await prisma.moderationLog.groupBy({
      by: ['category'],
      where: { userId },
      _count: { id: true },
    });

    const recentViolations = await prisma.moderationLog.findMany({
      where: {
        userId,
        isSafe: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      stats: {
        byCategory: stats,
        totalViolations: stats.reduce((acc, s) => acc + (s.category !== 'safe' ? s._count.id : 0), 0),
        recentViolations,
      }
    });
  } catch (error) {
    console.error('Failed to get moderation stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}

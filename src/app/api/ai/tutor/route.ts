import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// POST /api/ai/tutor - AI Tutor chat endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, subject, topic, userId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Create system prompt for the tutor
    const systemPrompt = `You are an expert AI tutor for EduSparring, an educational platform. Your role is to:

1. Help students learn ${subject || 'various subjects'}${topic ? `, specifically ${topic}` : ''}
2. Explain concepts clearly with examples
3. Provide practice problems when asked
4. Encourage and motivate students
5. Adapt explanations to the student's level
6. Use simple language and break down complex topics
7. Ask follow-up questions to check understanding

Guidelines:
- Be patient and supportive
- Use markdown formatting for better readability
- Provide step-by-step explanations
- Give real-world examples when possible
- Celebrate correct answers gently
- Guide students to find answers rather than just giving them
- Keep responses concise but thorough (aim for 2-4 paragraphs max unless explaining something complex)

When giving practice problems:
- Start with easier problems and increase difficulty
- Provide hints if the student is stuck
- Walk through solutions step by step

Remember: Your goal is to help students learn and build confidence!`;

    // Initialize ZAI
    const zai = await ZAI.create();

    // Call the chat completions API
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('AI Tutor error:', error);
    
    // Return a fallback response
    return NextResponse.json({
      success: true,
      message: `I'm here to help you learn! Let me provide some guidance.

**Key Learning Tips:**
1. **Break it down** - Complex topics are easier when broken into smaller parts
2. **Practice regularly** - Consistency is key to mastery
3. **Ask questions** - Don't hesitate to ask for clarification
4. **Connect concepts** - Try to relate new information to what you already know

What specific topic would you like me to explain or practice with you?`,
      error: error.message,
    });
  }
}

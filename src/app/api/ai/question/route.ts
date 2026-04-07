import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// POST /api/ai/question - Generate AI questions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, topic, difficulty, questionType, count = 1 } = body;

    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert question generator for an educational platform. Generate ${count} ${questionType || 'multiple choice'} question(s) for ${subject}${topic ? ` on the topic of ${topic}` : ''}.

Difficulty level: ${difficulty || 'medium'} (1-10 scale)

Return the question(s) in this exact JSON format:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation of why this is correct",
      "difficulty": ${difficulty || 5},
      "subject": "${subject}",
      "topic": "${topic || 'General'}",
      "tags": ["relevant", "tags"]
    }
  ]
}

Important:
- Make questions educational and clear
- Options should be plausible but only one correct
- Provide helpful explanations
- Match the difficulty level appropriately
- Return valid JSON only`;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Generate ${count} ${difficulty || 'medium'} difficulty ${questionType || 'multiple choice'} question(s) for ${subject}${topic ? ` about ${topic}` : ''}. Return only valid JSON.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    let questions = [];
    try {
      const content = completion.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        questions = parsed.questions || [];
      }
    } catch (e) {
      console.error('Failed to parse AI questions:', e);
    }

    // Fallback questions if AI fails
    if (questions.length === 0) {
      questions = [
        {
          id: `q-${Date.now()}`,
          question: `What is the capital of France?`,
          type: 'multiple_choice',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris',
          explanation: 'Paris is the capital and most populous city of France.',
          difficulty: difficulty || 5,
          subject,
          topic: topic || 'General',
          tags: ['geography', 'capitals'],
        },
      ];
    }

    // Add IDs to questions
    questions = questions.map((q: any, i: number) => ({
      ...q,
      id: `q-${Date.now()}-${i}`,
    }));

    return NextResponse.json({
      success: true,
      questions,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Question generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/ai/question/explain - Explain an answer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, userAnswer, correctAnswer, subject, topic } = body;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an educational tutor. Explain why an answer is correct or incorrect in a helpful, encouraging way. Keep explanations concise but thorough.`,
        },
        {
          role: 'user',
          content: `Question: "${question}"
Student answered: "${userAnswer}"
Correct answer: "${correctAnswer}"
Subject: ${subject}
Topic: ${topic || 'General'}

Explain this to the student in 2-3 sentences. If they got it wrong, guide them to understand why without being discouraging.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const explanation = completion.choices[0]?.message?.content || 
      `The correct answer is "${correctAnswer}". Keep practicing to strengthen your understanding!`;

    return NextResponse.json({
      success: true,
      explanation,
      isCorrect: userAnswer === correctAnswer,
    });
  } catch (error: any) {
    console.error('Explanation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

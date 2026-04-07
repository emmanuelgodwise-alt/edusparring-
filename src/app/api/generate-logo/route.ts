import ZAI from 'z-ai-web-dev-sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const zai = await ZAI.create();
    
    const response = await zai.images.generations.create({
      prompt,
      size: '1024x1024'
    });
    
    return NextResponse.json({
      success: true,
      image: response.data[0].base64
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

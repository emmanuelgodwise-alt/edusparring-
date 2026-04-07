import { NextResponse } from 'next/server'
import { generateMatchHighlights } from '@/lib/sparring-highlights'

/**
 * GET /api/highlights/[matchId]
 * 
 * Get the highlight reel for a specific match.
 * Used for sharing on social media and the highlight detail page.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    
    const highlight = await generateMatchHighlights(matchId)
    
    if (!highlight) {
      return NextResponse.json(
        { success: false, error: 'Highlight not found or match not completed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      highlight
    })
  } catch (error) {
    console.error('Failed to get highlight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate highlight' },
      { status: 500 }
    )
  }
}

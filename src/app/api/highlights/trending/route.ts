import { NextResponse } from 'next/server'
import { getTrendingHighlights } from '@/lib/sparring-highlights'

/**
 * GET /api/highlights/trending
 * 
 * Get trending battle highlights for the "Trending Battles" feed.
 * This is the TikTok-like feed of epic moments.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const subject = url.searchParams.get('subject')
    const timeframe = url.searchParams.get('timeframe') || '24h' // 24h, 7d, 30d

    // Get trending highlights
    const highlights = await getTrendingHighlights(limit)

    // Filter by subject if specified
    const filtered = subject 
      ? highlights.filter(h => h.subject.toLowerCase() === subject.toLowerCase())
      : highlights

    return NextResponse.json({
      success: true,
      highlights: filtered,
      meta: {
        total: filtered.length,
        timeframe,
        subject: subject || 'all'
      }
    })
  } catch (error) {
    console.error('Failed to get trending highlights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get trending highlights' },
      { status: 500 }
    )
  }
}

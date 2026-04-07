import { NextRequest, NextResponse } from 'next/server';

// Mock tournament data (in production, use database)
const tournaments: Map<string, any> = new Map([
  ['t1', {
    id: 't1',
    name: 'Math Olympiad Championship',
    description: 'The ultimate mathematics competition for elite students',
    subject: 'Math',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    maxParticipants: 64,
    currentParticipants: 58,
    prizePool: 10000,
    entryFee: 0,
    minRating: 800,
    maxRating: 1500,
    status: 'upcoming',
    rules: ['Single elimination', '5 questions per round', '15 seconds per question'],
    isOfficial: true,
    sponsors: ['EduSparring', 'Math Society'],
  }],
  ['t2', {
    id: 't2',
    name: 'Physics Grand Slam',
    description: 'Test your physics knowledge against the best',
    subject: 'Physics',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    maxParticipants: 32,
    currentParticipants: 32,
    prizePool: 5000,
    entryFee: 100,
    minRating: 700,
    status: 'active',
    rules: ['Double elimination', 'Advanced difficulty'],
    isOfficial: true,
    sponsors: [],
  }],
  ['t3', {
    id: 't3',
    name: 'Chemistry Weekly Cup',
    description: 'Weekly chemistry competition',
    subject: 'Chemistry',
    startDate: new Date(Date.now() - 86400000).toISOString(),
    endDate: new Date().toISOString(),
    maxParticipants: 16,
    currentParticipants: 16,
    prizePool: 1000,
    entryFee: 0,
    minRating: 0,
    status: 'completed',
    rules: ['Single elimination'],
    isOfficial: false,
    sponsors: [],
    champion: 'ChemMaster_99',
  }],
]);

// GET /api/tournaments - List tournaments
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const subject = searchParams.get('subject');
  const limit = parseInt(searchParams.get('limit') || '20');

  let tournamentList = Array.from(tournaments.values());

  // Apply filters
  if (status) {
    tournamentList = tournamentList.filter(t => t.status === status);
  }
  if (subject) {
    tournamentList = tournamentList.filter(t => t.subject === subject);
  }

  // Sort by start date
  tournamentList.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return NextResponse.json({
    success: true,
    tournaments: tournamentList.slice(0, limit),
    total: tournamentList.length,
  });
}

// POST /api/tournaments - Create a new tournament
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      subject,
      startDate,
      endDate,
      maxParticipants,
      prizePool,
      entryFee,
      minRating,
      rules,
    } = body;

    if (!name || !subject || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tournamentId = `t-${Date.now()}`;
    const tournament = {
      id: tournamentId,
      name,
      description: description || '',
      subject,
      startDate,
      endDate,
      maxParticipants: maxParticipants || 16,
      currentParticipants: 0,
      prizePool: prizePool || 0,
      entryFee: entryFee || 0,
      minRating: minRating || 0,
      status: 'upcoming',
      rules: rules || [],
      isOfficial: false,
      sponsors: [],
    };

    tournaments.set(tournamentId, tournament);

    return NextResponse.json({
      success: true,
      tournament,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/tournaments - Register for a tournament
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tournamentId, userId } = body;

    const tournament = tournaments.get(tournamentId);
    if (!tournament) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
        { status: 404 }
      );
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Tournament is full' },
        { status: 400 }
      );
    }

    tournament.currentParticipants += 1;
    tournaments.set(tournamentId, tournament);

    return NextResponse.json({
      success: true,
      tournament,
      message: 'Successfully registered',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

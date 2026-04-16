# EduSparring - Complete Developer Documentation
## For Developers & AI Agents Continuing This Project

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Core Features](#5-core-features)
6. [API Reference](#6-api-reference)
7. [Database Schema](#7-database-schema)
8. [State Management](#8-state-management)
9. [Component Library](#9-component-library)
10. [Authentication Flow](#10-authentication-flow)
11. [Key Implementation Details](#11-key-implementation-details)
12. [Adding New Features](#12-adding-new-features)
13. [Known Issues & TODOs](#13-known-issues--todos)
14. [Environment Setup](#14-environment-setup)

---

## 1. PROJECT OVERVIEW

### What is EduSparring?

EduSparring is an AI-powered competitive learning platform where students compete in real-time knowledge battles. Think "chess.com meets Duolingo" - users are matched with opponents worldwide, answer questions in 15-second rounds, and climb a skill-based ranking system called Knowledge Rating (KR).

### Core Value Proposition

- **Knowledge Rating (KR)**: Chess-like ELO system for academic subjects
- **Real Opponents**: No bots - verified students only
- **AI Coaching**: Post-match feedback explaining answers
- **Safe by Design**: Verified students, AI-moderated chats

### Target Users

- High school and university students
- Competitive learners who want gamified education
- Users tired of passive study methods

---

## 2. ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  Pages (App Router)    │  Components    │  State (Zustand)  │
│  - Landing Page        │  - UI (shadcn) │  - useAppStore    │
│  - Auth Pages          │  - Gamification│  - User data      │
│  - Main Platform       │  - Battle      │  - Match state    │
│  - Onboarding          │  - AI Tutor    │  - Settings       │
├─────────────────────────────────────────────────────────────┤
│                      API ROUTES                              │
├─────────────────────────────────────────────────────────────┤
│  /api/auth/*           │  /api/battle/*   │  /api/ai/*      │
│  /api/matchmaking/*    │  /api/user/*     │  /api/sparring/*│
│  /api/community/*      │  /api/videos/*   │  /api/quests/*  │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE (SQLite/Prisma)                  │
│  - Users, Matches, Questions, Achievements, Tournaments     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Component → Zustand Store → API Route → Prisma → Database
                    ↓
              UI Update ← State Change ← API Response
```

---

## 3. TECH STACK

### Frontend
- **Next.js 16.1.3**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **shadcn/ui**: Component library (Radix-based)
- **Framer Motion**: Animations
- **Lucide React**: Icons

### Backend
- **Next.js API Routes**: Serverless functions
- **Prisma ORM**: Database operations
- **NextAuth.js**: Authentication
- **SQLite**: Database (file-based)

### State Management
- **Zustand**: Global state store

### AI Integration
- **z-ai-web-dev-sdk**: AI model integration for:
  - Question generation
  - Answer evaluation
  - Coaching feedback
  - Tutoring

---

## 4. PROJECT STRUCTURE

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (SALES COPY)
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles
│   │
│   ├── auth/                     # Authentication
│   │   ├── signin/page.tsx       # Sign in page
│   │   └── signup/page.tsx       # Sign up page
│   │
│   ├── onboarding/               # User onboarding flow
│   │   └── page.tsx              # Multi-step onboarding
│   │
│   ├── ai-tutor/                 # AI Tutor page
│   │   └── page.tsx
│   │
│   ├── multiplayer/              # Multiplayer battles
│   │   └── page.tsx
│   │
│   ├── videos/                   # Video lessons
│   │   └── page.tsx
│   │
│   ├── social/                   # Social features
│   │   ├── friends/page.tsx
│   │   ├── chat/[userId]/page.tsx
│   │   └── feed/page.tsx
│   │
│   ├── leaderboard/              # Global leaderboard
│   │   └── page.tsx
│   │
│   ├── sparring/                 # Sparring arena
│   │   ├── page.tsx
│   │   ├── lobby/page.tsx
│   │   ├── game/[matchId]/page.tsx
│   │   └── history/page.tsx
│   │
│   └── api/                      # API Routes
│       ├── auth/[...nextauth]/route.ts
│       ├── auth/register/route.ts
│       ├── user/route.ts
│       ├── user/onboarding/route.ts
│       ├── battle/[matchId]/route.ts
│       ├── matchmaking/quick-match/route.ts
│       ├── matchmaking/ranked-match/route.ts
│       ├── ai/tutor/route.ts
│       ├── ai/generate-question/route.ts
│       ├── ai/coaching-feedback/route.ts
│       ├── sparring/*/route.ts
│       ├── community/leaderboard/route.ts
│       ├── videos/route.ts
│       ├── quests/route.ts
│       ├── streak/route.ts
│       ├── season-pass/route.ts
│       └── ... (many more)
│
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ... (40+ components)
│   │
│   ├── gamification/             # Gamification features
│   │   ├── StreakDisplay.tsx     # Daily streak tracker
│   │   ├── DailyQuests.tsx       # Daily challenges
│   │   ├── SpinWheel.tsx         # Reward spin wheel
│   │   ├── SeasonPass.tsx        # Season pass UI
│   │   └── index.ts
│   │
│   ├── ai/                       # AI components
│   │   ├── AITutor.tsx           # Main AI tutor interface
│   │   ├── Recommendations.tsx   # AI recommendations
│   │   ├── AdaptiveDifficulty.tsx
│   │   └── index.ts
│   │
│   ├── video/                    # Video components
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoSuggestions.tsx
│   │   ├── LiveClass.tsx
│   │   └── index.ts
│   │
│   ├── multiplayer/              # Multiplayer components
│   │   ├── LiveBattle.tsx
│   │   ├── LiveBattleArena.tsx
│   │   ├── SpectatorMode.tsx
│   │   ├── Tournament.tsx
│   │   └── index.ts
│   │
│   ├── battle/                   # Battle components
│   │   ├── QuestionCard.tsx
│   │   └── Timer.tsx
│   │
│   ├── navigation/               # Navigation components
│   │   ├── GlobalSearch.tsx      # Ctrl+K search
│   │   ├── MainLayout.tsx
│   │   ├── GlobalHeader.tsx
│   │   └── BottomNav.tsx
│   │
│   ├── social/                   # Social components
│   │   ├── FriendList.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── AchievementBadge.tsx
│   │
│   ├── pwa/                      # PWA components
│   │   └── PWAInstallPrompt.tsx
│   │
│   ├── AuthProvider.tsx          # Auth context provider
│   ├── I18nProvider.tsx          # Internationalization
│   └── EduSparringLogo.tsx       # Logo component
│
├── lib/                          # Utility libraries
│   ├── utils.ts                  # General utilities
│   ├── db.ts                     # Database connection
│   ├── auth.ts                   # Auth configuration
│   ├── kr-calculator.ts          # KR rating calculations
│   ├── battle-engine.ts          # Battle logic
│   ├── matchmaking.ts            # Matchmaking algorithm
│   ├── ai-engine.ts              # AI integration
│   ├── sparring-engine.ts        # Sparring logic
│   ├── tournament-engine.ts      # Tournament logic
│   ├── achievements.ts           # Achievement system
│   ├── sounds.ts                 # Sound effects
│   └── i18n.ts                   # Internationalization
│
├── store/                        # State management
│   └── useAppStore.ts            # Main Zustand store
│
├── hooks/                        # Custom hooks
│   ├── useGamification.ts
│   ├── useMultiplayer.ts
│   ├── useBattle.ts
│   ├── usePWA.ts
│   └── useTranslations.ts
│
├── types/                        # TypeScript types
│   ├── ai.ts
│   ├── video.ts
│   └── multiplayer.ts
│
└── locales/                      # Translations
    ├── en.json
    ├── zh.json
    ├── hi.json
    ├── fr.json
    ├── es.json
    ├── pt.json
    └── ar.json

prisma/
└── schema.prisma                 # Database schema

public/                           # Static assets
├── edusparring-logo.svg
├── logo.svg
├── logo-simple.svg
├── favicon.svg
├── manifest.json
├── sw.js
└── icons/
```

---

## 5. CORE FEATURES

### 5.1 Landing Page (Sales Copy)

**File:** `src/app/page.tsx`

The landing page displays for non-authenticated users. Key sections:
- Animated logo and branding
- Headline: "What If Studying Felt Like a Sport?"
- Problem statement
- 4 Unique Value Propositions
- CTA buttons (Sign In / Create Free Account)

**Key Code Pattern:**
```tsx
// Landing page shows when !isAuthenticated
if (!isAuthenticated) {
  return <LandingPage />;
}
```

### 5.2 Authentication Flow

**Files:**
- `src/app/auth/signin/page.tsx`
- `src/app/auth/signup/page.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/components/AuthProvider.tsx`

**Flow:**
1. User visits landing page
2. Clicks Sign In or Create Account
3. Fills credentials
4. If new user → redirected to onboarding
5. If existing user → redirected to main platform

**Key Implementation:**
```tsx
// In page.tsx - check onboarding status
if (isAuthenticated && authUser) {
  const res = await fetch(`/api/user?email=${authUser.email}`);
  if (!data.user.hasCompletedOnboarding) {
    router.push('/onboarding');
  }
}
```

### 5.3 Knowledge Rating (KR) System

**File:** `src/lib/kr-calculator.ts`

KR works like chess ELO:
- **Starting KR:** 800
- **Beginner:** 800-999
- **Intermediate:** 1000-1399
- **Advanced:** 1400-1799
- **Elite:** 1800+

**Calculation:**
```typescript
function calculateNewKR(
  currentKR: number,
  opponentKR: number,
  won: boolean
): number {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentKR - currentKR) / 400));
  const actualScore = won ? 1 : 0;
  return Math.round(currentKR + K * (actualScore - expectedScore));
}
```

### 5.4 Sparring Arena (Battle System)

**Files:**
- `src/app/page.tsx` (HomePage component)
- `src/lib/battle-engine.ts`
- `src/app/api/battle/[matchId]/route.ts`
- `src/components/battle/QuestionCard.tsx`
- `src/components/battle/Timer.tsx`

**Battle Flow:**
1. User selects subject
2. User clicks "Play with Bot" or "Play with Student"
3. Matchmaking finds opponent
4. Battle begins with 5 rounds
5. Each round: 15 seconds to answer
6. After battle: KR update + AI coaching feedback

**Question Card Pattern:**
```tsx
<QuestionCard
  question={currentQuestion}
  onAnswer={handleAnswer}
  timeLeft={timeLeft}
/>
```

### 5.5 AI Tutor

**Files:**
- `src/app/ai-tutor/page.tsx`
- `src/components/ai/AITutor.tsx`
- `src/app/api/ai/tutor/route.ts`
- `src/app/api/ai/generate-question/route.ts`
- `src/app/api/ai/coaching-feedback/route.ts`

**AI Capabilities:**
- Generate questions by subject/difficulty
- Evaluate answers
- Provide coaching feedback after matches
- Adaptive difficulty adjustment

**API Pattern:**
```typescript
// Using z-ai-web-dev-sdk
const zai = await ZAI.create();
const completion = await zai.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are an educational AI tutor...' },
    { role: 'user', content: prompt }
  ]
});
```

### 5.6 Gamification System

**Files:**
- `src/components/gamification/StreakDisplay.tsx`
- `src/components/gamification/DailyQuests.tsx`
- `src/components/gamification/SpinWheel.tsx`
- `src/components/gamification/SeasonPass.tsx`
- `src/app/api/quests/route.ts`
- `src/app/api/streak/route.ts`
- `src/app/api/season-pass/route.ts`

**Features:**
- **Daily Streak:** Consecutive days of activity
- **Daily Quests:** Complete 3 tasks for rewards
- **Spin Wheel:** Random rewards after matches
- **Season Pass:** Progress through tiers with rewards

### 5.7 Multiplayer & Tournaments

**Files:**
- `src/app/multiplayer/page.tsx`
- `src/components/multiplayer/LiveBattle.tsx`
- `src/components/multiplayer/Tournament.tsx`
- `src/app/api/multiplayer/matchmaking/route.ts`
- `src/lib/tournament-engine.ts`

### 5.8 Global Search (Ctrl+K)

**Files:**
- `src/components/navigation/GlobalSearch.tsx`

**Usage:**
```tsx
// In layout or header
<SearchTrigger onClick={openSearch} />
<GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
```

### 5.9 Video Lessons

**Files:**
- `src/app/videos/page.tsx`
- `src/components/video/VideoPlayer.tsx`
- `src/components/video/VideoSuggestions.tsx`
- `src/app/api/videos/route.ts`

### 5.10 PWA Support

**Files:**
- `public/manifest.json`
- `public/sw.js`
- `src/components/pwa/PWAInstallPrompt.tsx`
- `src/hooks/usePWA.ts`

---

## 6. API REFERENCE

### Authentication APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | NextAuth.js handler |
| `/api/auth/register` | POST | Register new user |

### User APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user` | GET | Get user data by email |
| `/api/user/onboarding` | POST | Complete onboarding |

### Battle/Sparring APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/battle/[matchId]` | GET | Get battle state |
| `/api/battle/[matchId]/submit` | POST | Submit answer |
| `/api/battle/[matchId]/end` | POST | End battle |
| `/api/matchmaking/quick-match` | POST | Find quick match |
| `/api/matchmaking/ranked-match` | POST | Find ranked match |
| `/api/sparring/create` | POST | Create sparring session |
| `/api/sparring/question` | GET | Get next question |
| `/api/sparring/answer` | POST | Submit answer |

### AI APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/tutor` | POST | AI tutor chat |
| `/api/ai/generate-question` | POST | Generate question |
| `/api/ai/coaching-feedback` | POST | Get feedback |
| `/api/ai/evaluate-answer` | POST | Evaluate answer |

### Community APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/community/leaderboard` | GET | Get leaderboard |
| `/api/community/profile/[userId]` | GET | Get user profile |

### Gamification APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/quests` | GET | Get daily quests |
| `/api/streak` | GET/POST | Streak operations |
| `/api/season-pass` | GET | Season pass data |
| `/api/spin-wheel` | POST | Spin for rewards |

---

## 7. DATABASE SCHEMA

**File:** `prisma/schema.prisma`

### Key Models

```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  name                  String
  password              String?
  knowledgeRating       Int       @default(800)
  level                 String?
  points                Int       @default(0)
  totalWins             Int       @default(0)
  totalLosses           Int       @default(0)
  currentStreak         Int       @default(0)
  bestStreak            Int       @default(0)
  country               String?
  language              String    @default("en")
  bio                   String?
  avatar                String?
  subjects              String[]  // ["Math", "Physics"]
  achievements          String[]
  hasCompletedOnboarding Boolean  @default(false)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model Match {
  id              String   @id @default(cuid())
  player1Id       String
  player2Id       String?
  player1Score    Int      @default(0)
  player2Score    Int      @default(0)
  winnerId        String?
  subject         String
  status          String   // "active", "completed", "abandoned"
  totalRounds     Int      @default(5)
  currentRound    Int      @default(1)
  mode            String   // "quick", "ranked", "bot"
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}

model Question {
  id          String   @id @default(cuid())
  subject     String
  question    String
  options     String[] // ["Option A", "Option B", "Option C", "Option D"]
  correctAnswer Int    // Index of correct option
  difficulty  String   // "easy", "medium", "hard"
  explanation String?
  createdAt   DateTime @default(now())
}

model Tournament {
  id                  String   @id @default(cuid())
  name                String
  description         String?
  subject             String?
  startDate           DateTime
  endDate             DateTime
  maxParticipants     Int
  currentParticipants Int      @default(0)
  prizePool           Int?
  status              String   // "upcoming", "active", "completed"
  createdAt           DateTime @default(now())
}
```

---

## 8. STATE MANAGEMENT

**File:** `src/store/useAppStore.ts`

### Store Structure

```typescript
interface AppStore {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Match state
  match: Match | null;
  setMatch: (match: Match | null) => void;
  isSearchingMatch: boolean;
  setSearchingMatch: (searching: boolean) => void;
  
  // Results & feedback
  showMatchResult: boolean;
  setShowMatchResult: (show: boolean) => void;
  coachingFeedback: CoachingFeedback | null;
  setCoachingFeedback: (feedback: CoachingFeedback | null) => void;
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  leaderboardCategory: string;
  setLeaderboardCategory: (category: string) => void;
  
  // Subject selection
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Tournaments & Live
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
  liveMatches: LiveMatch[];
  setLiveMatches: (matches: LiveMatch[]) => void;
  
  // Friends
  friends: Friend[];
  setFriends: (friends: Friend[]) => void;
  showFriendsModal: boolean;
  setShowFriendsModal: (show: boolean) => void;
  
  // Notifications
  addNotification: (message: string, type: string) => void;
}
```

### Usage Pattern

```tsx
// In any component
import { useAppStore } from '@/store/useAppStore';

function MyComponent() {
  const { user, match, setMatch } = useAppStore();
  
  // Use state directly
  console.log(user?.knowledgeRating);
  
  // Update state
  setMatch(newMatchData);
}
```

---

## 9. COMPONENT LIBRARY

### shadcn/ui Components Used

Located in `src/components/ui/`:

| Component | Usage |
|-----------|-------|
| Button | All clickable actions |
| Card | Content containers |
| Dialog | Modals |
| DropdownMenu | User menu, settings |
| Tabs | Navigation |
| Badge | Status indicators |
| Progress | Progress bars |
| Input | Form inputs |
| Select | Dropdowns |
| Switch | Toggle settings |
| Toast | Notifications |
| Avatar | User avatars |
| ScrollArea | Scrollable content |
| Separator | Dividers |

### Custom Components

| Component | Location | Description |
|-----------|----------|-------------|
| EduSparringLogo | `components/EduSparringLogo.tsx` | Animated logo |
| QuestionCard | `components/battle/QuestionCard.tsx` | Battle question display |
| Timer | `components/battle/Timer.tsx` | Countdown timer |
| StreakDisplay | `components/gamification/StreakDisplay.tsx` | Streak tracker |
| DailyQuests | `components/gamification/DailyQuests.tsx` | Quest list |
| SpinWheel | `components/gamification/SpinWheel.tsx` | Reward wheel |
| SeasonPass | `components/gamification/SeasonPass.tsx` | Season progress |
| GlobalSearch | `components/navigation/GlobalSearch.tsx` | Ctrl+K search |
| AITutor | `components/ai/AITutor.tsx` | Tutor interface |

---

## 10. AUTHENTICATION FLOW

### Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Landing Page │────▶│  Sign In/Up  │────▶│  Onboarding  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Settings    │◀────│ Main Platform│◀────│ Auth Check   │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Implementation

**AuthProvider.tsx:**
```tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Usage in layout.tsx:**
```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

**Checking auth in components:**
```tsx
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loading />;
  if (status === 'unauthenticated') return <LandingPage />;
  
  return <Dashboard user={session.user} />;
}
```

---

## 11. KEY IMPLEMENTATION DETAILS

### 11.1 Landing Page Sales Copy

The landing page (`src/app/page.tsx`) uses a conversion-focused design:

```tsx
// Structure:
// 1. Header with logo + CTA buttons
// 2. Hero section with animated logo
// 3. Problem statement
// 4. Solution hook
// 5. 4 UVP cards (KR, Real Opponents, AI Coaching, Safe by Design)
// 6. Final CTA

// Key animation pattern:
<motion.div
  animate={{ y: [0, -8, 0] }}
  transition={{ duration: 3, repeat: Infinity }}
>
  <Logo />
</motion.div>
```

### 11.2 KR Tier Display

```tsx
function getKRTier(kr: number) {
  if (kr < 1000) return { tier: 'Beginner', color: 'text-gray-400' };
  if (kr < 1400) return { tier: 'Intermediate', color: 'text-green-400' };
  if (kr < 1800) return { tier: 'Advanced', color: 'text-blue-400' };
  return { tier: 'Elite', color: 'text-yellow-400' };
}
```

### 11.3 Subject Icons Mapping

```tsx
const subjectIcons: Record<string, string> = {
  Math: '📐',
  Physics: '⚛️',
  Chemistry: '🧪',
  Biology: '🧬',
  History: '📜',
  Geography: '🌍',
  Literature: '📚',
  Computer: '💻'
};
```

### 11.4 Battle Timer

```tsx
// 15-second countdown per question
const [timeLeft, setTimeLeft] = useState(15);

useEffect(() => {
  if (timeLeft <= 0) {
    handleTimeout();
    return;
  }
  const timer = setInterval(() => {
    setTimeLeft(t => t - 1);
  }, 1000);
  return () => clearInterval(timer);
}, [timeLeft]);
```

---

## 12. ADDING NEW FEATURES

### 12.1 Adding a New Page

1. Create folder in `src/app/`
2. Add `page.tsx` file
3. Add navigation link if needed

**Example: Adding a "Practice" page:**

```tsx
// src/app/practice/page.tsx
'use client';

import { useAuth } from '@/components/AuthProvider';

export default function PracticePage() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect or show login prompt
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1>Practice Mode</h1>
      {/* Your content */}
    </div>
  );
}
```

### 12.2 Adding a New API Route

1. Create folder in `src/app/api/`
2. Add `route.ts` file

**Example: Adding a "practice" API:**

```tsx
// src/app/api/practice/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    
    const questions = await prisma.question.findMany({
      where: { subject },
      take: 10
    });
    
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
```

### 12.3 Adding a New Component

1. Create file in appropriate `src/components/` subfolder
2. Export from `index.ts` if needed
3. Import and use

**Example: Adding a StatsCard component:**

```tsx
// src/components/stats/StatsCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 12.4 Adding a New Store Slice

```tsx
// In useAppStore.ts, add new state:
interface AppStore {
  // ... existing state
  
  // New slice
  practiceMode: {
    isActive: boolean;
    subject: string;
    questions: Question[];
  };
  setPracticeMode: (mode: Partial<AppStore['practiceMode']>) => void;
}

// Add implementation:
export const useAppStore = create<AppStore>((set) => ({
  // ... existing implementations
  
  practiceMode: {
    isActive: false,
    subject: '',
    questions: []
  },
  setPracticeMode: (mode) => set((state) => ({
    practiceMode: { ...state.practiceMode, ...mode }
  }))
}));
```

---

## 13. KNOWN ISSUES & TODOs

### Known Issues

1. **Preview Links**: Sometimes 404 - restart dev server
2. **Auth Warnings**: NEXTAUTH_URL warnings in console (harmless)
3. **Duplicate Route**: `api/social/achievements` has both .ts and .tsx

### TODOs (Future Features)

1. **Real-time WebSocket**: Currently using mock data for live matches
2. **Video Upload**: Backend integration needed
3. **Payment Integration**: Subscription system UI exists, backend needed
4. **Mobile App**: PWA works, but native app would be better
5. **More Subjects**: Currently 8 subjects, can expand
6. **Question Bank**: Need more questions per subject
7. **Analytics Dashboard**: User progress analytics
8. **Social Features**: Expand chat, add groups
9. **Accessibility**: Improve ARIA labels
10. **Testing**: Add unit and integration tests

---

## 14. ENVIRONMENT SETUP

### Required Environment Variables

```env
# Database
DATABASE_URL=file:./db/custom.db

# Authentication
NEXTAUTH_SECRET=your-secret-key-at-least-32-characters
NEXTAUTH_URL=http://localhost:3000

# Optional: If deploying
# DATABASE_URL=postgresql://...
# NEXTAUTH_URL=https://yourdomain.com
```

### Setup Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# (Optional) Seed database
npx prisma db seed

# Run development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

---

## DOCUMENT END

**Created:** April 8, 2026  
**Project:** EduSparring  
**Version:** 1.0.0  
**Author:** AI Development Assistant

For questions or issues, refer to the codebase or create an issue in the project repository.

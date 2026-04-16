# EduSparring Project Package
## Complete Export for Transfer

### Project Overview
- **Name:** EduSparring
- **Type:** AI-powered competitive learning platform
- **Tech Stack:** Next.js 16.1.3, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma ORM, SQLite

### Project Structure
```
/home/z/my-project/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main landing page with sales copy
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── onboarding/        # User onboarding flow
│   │   ├── ai-tutor/          # AI Tutor page
│   │   ├── multiplayer/       # Multiplayer battle page
│   │   ├── videos/            # Video lessons page
│   │   ├── social/            # Social features
│   │   ├── leaderboard/       # Leaderboard page
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── gamification/     # Streaks, quests, spin wheel
│   │   ├── video/            # Video components
│   │   ├── ai/               # AI tutor components
│   │   └── navigation/       # Global search, navigation
│   ├── store/                 # Zustand state management
│   └── lib/                   # Utilities
├── prisma/                    # Database schema
├── public/                    # Static assets (logos, icons)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
└── .env                       # Environment variables
```

### Key Features Implemented
1. **Landing Page** - Sales copy with conversion-focused design
2. **Authentication Flow** - Sign in/up → Onboarding → Main platform
3. **Sparring Arena** - Play with Bot or Student
4. **Knowledge Rating (KR)** - Chess-like skill rating system
5. **AI Tutor** - AI-powered tutoring
6. **Video Lessons** - Educational video content
7. **Gamification** - Streaks, daily quests, spin wheel
8. **Multiplayer** - Real-time battles
9. **Global Search** - Ctrl+K search functionality
10. **PWA Support** - Progressive Web App capabilities

### Environment Variables Required
```
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### To Run This Project
```bash
npm install
npm run dev
```

### Transfer Instructions
1. Copy entire project folder
2. Run `npm install` to install dependencies
3. Set up environment variables in `.env`
4. Run `npx prisma db push` to set up database
5. Run `npm run dev` to start development server

---
*Package created: $(date)*

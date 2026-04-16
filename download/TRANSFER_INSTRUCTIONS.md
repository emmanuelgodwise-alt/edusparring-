# EduSparring Project Transfer Instructions

## Quick Start Guide

### Option 1: Direct Copy (Recommended)
Copy the entire `/home/z/my-project` folder from this server.

### Option 2: Recreate Project
Run these commands on your target machine:

```bash
# 1. Create project directory
mkdir edusparring && cd edusparring

# 2. Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 3. Install additional dependencies
npm install framer-motion zustand @prisma/client prisma next-auth lucide-react
npm install -D @types/node

# 4. Copy the following folders/files from this project:
# - src/ (all files and folders)
# - public/ (all assets)
# - prisma/schema.prisma
# - tailwind.config.ts
# - .env (create with values below)

# 5. Create .env file
echo "DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000" > .env

# 6. Setup database
npx prisma db push

# 7. Run project
npm run dev
```

## Essential Files Structure

```
edusparring/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page with sales copy
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── auth/             # Sign in/up pages
│   │   ├── onboarding/       # Onboarding flow
│   │   ├── ai-tutor/         # AI tutor page
│   │   ├── multiplayer/      # Multiplayer battles
│   │   ├── videos/           # Video lessons
│   │   ├── social/           # Social features
│   │   ├── api/              # API routes
│   │   └── ...
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── gamification/     # Streaks, quests, spin wheel
│   │   ├── ai/               # AI components
│   │   ├── video/            # Video components
│   │   └── ...
│   ├── store/                # Zustand state
│   ├── lib/                  # Utilities
│   └── hooks/                # Custom hooks
├── public/
│   ├── edusparring-logo.svg
│   ├── logo.svg
│   ├── logo-simple.svg
│   └── manifest.json
├── prisma/
│   └── schema.prisma
├── package.json
├── tailwind.config.ts
└── .env
```

## Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "16.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.15.0",
    "zustand": "^5.0.2",
    "@prisma/client": "^6.2.0",
    "prisma": "^6.2.0",
    "next-auth": "^4.24.11",
    "lucide-react": "^0.469.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "@radix-ui/react-*": "various",
    "zod": "^3.24.1",
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^3.9.1"
  }
}
```

## Environment Variables

```
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-secure-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000
```

## Features Implemented

1. **Landing Page** - Sales copy, conversion-focused design
2. **Auth Flow** - Sign in/up → Onboarding → Main platform
3. **Sparring Arena** - Play with Bot or Student
4. **Knowledge Rating (KR)** - Chess-like skill rating
5. **AI Tutor** - AI-powered learning
6. **Video Lessons** - Educational content
7. **Gamification** - Streaks, quests, spin wheel, season pass
8. **Multiplayer** - Real-time battles, tournaments
9. **Global Search** - Ctrl+K functionality
10. **PWA** - Progressive Web App support

## Database Schema (Prisma)

Run `npx prisma db push` after setting up .env to create the database.

## Troubleshooting

- **Auth errors**: Ensure NEXTAUTH_SECRET is at least 32 characters
- **Database errors**: Run `npx prisma generate` then `npx prisma db push`
- **Module not found**: Run `npm install` to install all dependencies

---
Created: April 8, 2026
Project: EduSparring - AI-powered competitive learning platform

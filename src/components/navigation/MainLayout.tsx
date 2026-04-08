'use client';

import { ReactNode } from 'react';
import { GlobalHeader } from './GlobalHeader';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    knowledgeRating: number;
    points: number;
    currentStreak: number;
    avatar?: string;
  } | null;
  showSearch?: boolean;
  showBottomNav?: boolean;
  /** Additional padding at bottom for fixed bottom nav */
  bottomPadding?: boolean;
}

export function MainLayout({ 
  children, 
  user, 
  showSearch = true,
  showBottomNav = true,
  bottomPadding = true
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Global Header */}
      <GlobalHeader user={user} showSearch={showSearch} />
      
      {/* Main Content */}
      <main className={bottomPadding ? 'pb-20 md:pb-6' : ''}>
        {children}
      </main>
      
      {/* Bottom Navigation (Mobile) */}
      {showBottomNav && <BottomNav user={user} />}
    </div>
  );
}

export default MainLayout;

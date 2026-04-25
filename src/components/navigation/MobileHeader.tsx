'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Swords, Menu, X, Home, Brain, Video, Users, Trophy,
  Crown, Flame, Star, Settings, LogOut, ChevronRight,
  Bot, Radio, Search, Bell, MessageCircle, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOut } from 'next-auth/react';

interface MobileHeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    knowledgeRating: number;
    points: number;
    currentStreak: number;
    avatar?: string;
  } | null;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  rightContent?: React.ReactNode;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: string | number;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  }>;
}

// Navigation menu items
const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/sparring', label: 'Sparring', icon: Swords },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Brain },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function MobileHeader({
  user,
  title = 'EduSparring',
  subtitle,
  showBackButton = false,
  backHref = '/',
  rightContent,
  actions = [],
}: MobileHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Link href={backHref}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white -ml-2">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
            </Link>
          ) : null}

          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Swords className="w-7 h-7 text-purple-400" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] text-gray-400 -mt-0.5">{subtitle}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Right side - Actions and Hamburger */}
        <div className="flex items-center gap-2">
          {/* Custom right content if provided */}
          {rightContent}

          {/* Quick actions visible on larger screens */}
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">{user.points.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium">{user.currentStreak}</span>
              </div>
            </div>
          )}

          {/* Hamburger Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-slate-950 border-white/10 text-white p-0">
              <div className="h-full flex flex-col">
                {/* Header with user info */}
                {user ? (
                  <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className="text-sm text-yellow-400">{user.knowledgeRating} KR</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <Trophy className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
                        <p className="text-sm font-bold">{user.points.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400">Points</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <Flame className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                        <p className="text-sm font-bold">{user.currentStreak}</p>
                        <p className="text-[10px] text-gray-400">Streak</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-white/10">
                    <SheetHeader>
                      <SheetTitle className="text-white text-left">EduSparring</SheetTitle>
                    </SheetHeader>
                    <div className="flex gap-2 mt-3">
                      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="text-gray-300 hover:text-white">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                        <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-2">
                  <div className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive(item.href)
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {isActive(item.href) && (
                          <div className="ml-auto w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-3 border-t border-white/10" />

                  {/* Quick Actions */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">Quick Actions</p>
                    
                    <Link
                      href="/sparring"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Bot className="w-5 h-5" />
                      <span>Play with Bot</span>
                    </Link>
                    
                    <Link
                      href="/sparring/lobby"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Users className="w-5 h-5" />
                      <span>Find Opponent</span>
                    </Link>
                    
                    <Link
                      href="/multiplayer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Radio className="w-5 h-5 text-red-400" />
                      <span>Live Battles</span>
                    </Link>
                  </div>

                  {/* Custom Actions */}
                  {actions.length > 0 && (
                    <>
                      <div className="my-3 border-t border-white/10" />
                      <div className="space-y-1">
                        {actions.map((action, index) => (
                          action.href ? (
                            <Link
                              key={index}
                              href={action.href}
                              onClick={() => {
                                action.onClick?.();
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                            >
                              {action.icon}
                              <span>{action.label}</span>
                              {action.badge !== undefined && (
                                <Badge className="ml-auto bg-purple-500/20 text-purple-400">
                                  {action.badge}
                                </Badge>
                              )}
                            </Link>
                          ) : (
                            <button
                              key={index}
                              onClick={() => {
                                action.onClick?.();
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                            >
                              {action.icon}
                              <span>{action.label}</span>
                              {action.badge !== undefined && (
                                <Badge className="ml-auto bg-purple-500/20 text-purple-400">
                                  {action.badge}
                                </Badge>
                              )}
                            </button>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </nav>

                {/* Footer */}
                {user && (
                  <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                      href="/character"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Profile & Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;

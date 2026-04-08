'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Swords, Trophy, Flame, Crown, User, Settings,
  LogOut, ChevronDown, Brain, Video, Users, BookOpen,
  HelpCircle, Moon, Sun, Bell, Search, Command, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearch, SearchTrigger, useGlobalSearch } from './GlobalSearch';
import { signOut } from 'next-auth/react';

interface GlobalHeaderProps {
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
}

// Navigation links configuration
const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home, mobileOnly: true },
  { href: '/sparring', label: 'Sparring', icon: Swords },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Brain },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/leaderboard', label: 'Ranks', icon: Trophy },
];

export function GlobalHeader({ user, showSearch = true }: GlobalHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen: searchOpen, openSearch, closeSearch } = useGlobalSearch();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Swords className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
              EduSparring
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.filter(link => !link.mobileOnly).map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    isActive(link.href)
                      ? 'bg-purple-500/20 border-purple-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="text-sm">{link.label}</span>
                </motion.button>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            {showSearch && (
              <SearchTrigger onClick={openSearch} />
            )}

            {/* User Stats (if logged in) */}
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{user.points.toLocaleString()}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">{user.currentStreak}</span>
                </div>
              </>
            )}

            {/* User Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-full p-1.5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">{user.knowledgeRating} KR</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuItem asChild className="text-gray-300 cursor-pointer hover:bg-white/10">
                    <Link href="/character" className="flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild className="text-gray-300 cursor-pointer hover:bg-white/10">
                    <Link href="/?tab=settings" className="flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="text-gray-300 cursor-pointer hover:bg-white/10">
                    <Link href="/onboarding" className="flex items-center w-full">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      View Onboarding
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400 cursor-pointer hover:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="hidden sm:block">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}

export default GlobalHeader;

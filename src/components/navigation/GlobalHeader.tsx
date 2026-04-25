'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Swords, Trophy, Flame, Crown, User, Settings,
  LogOut, ChevronDown, Brain, Video, Users, BookOpen,
  HelpCircle, Moon, Sun, Bell, Search, Command, Home,
  Menu, Radio, Bot, ChevronRight
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
  { href: '/', label: 'Home', icon: Home },
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
  const [menuOpen, setMenuOpen] = useState(false);

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
            {NAV_LINKS.map((link) => (
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

            {/* User Stats (if logged in) - Hidden on mobile */}
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

            {/* User Dropdown - Desktop only */}
            {user ? (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-full p-1.5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
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
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-white hover:bg-white/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-slate-950 border-white/10 text-white p-0">
                <div className="h-full flex flex-col">
                  {/* Header with user info */}
                  {user ? (
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
                      <SheetHeader>
                        <SheetTitle className="text-white sr-only">Menu</SheetTitle>
                      </SheetHeader>
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
                        <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
                          <Button variant="ghost" className="text-gray-300 hover:text-white">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
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
                      {NAV_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
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
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Bot className="w-5 h-5" />
                        <span>Play with Bot</span>
                      </Link>
                      
                      <Link
                        href="/sparring/lobby"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Users className="w-5 h-5" />
                        <span>Find Opponent</span>
                      </Link>
                      
                      <Link
                        href="/multiplayer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Radio className="w-5 h-5 text-red-400" />
                        <span>Live Battles</span>
                      </Link>
                    </div>
                  </nav>

                  {/* Footer */}
                  {user && (
                    <div className="p-4 border-t border-white/10 space-y-2">
                      <Link
                        href="/character"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Profile & Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMenuOpen(false);
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

      {/* Global Search Overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}

export default GlobalHeader;

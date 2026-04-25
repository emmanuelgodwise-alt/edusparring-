'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Command, ArrowRight, Swords, Brain, Video,
  Users, Trophy, Settings, Home, BookOpen, History,
  MessageCircle, Bell, User, HelpCircle, Globe, Crown,
  Zap, Target, Flame, Star, Clock, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Searchable pages configuration
const SEARCHABLE_PAGES = [
  { id: 'home', name: 'Home Dashboard', path: '/', icon: Home, category: 'Main', keywords: ['dashboard', 'main', 'home'] },
  { id: 'sparring', name: 'Sparring Arena', path: '/sparring', icon: Swords, category: 'Battle', keywords: ['battle', 'fight', 'spar', 'compete'] },
  { id: 'sparring-lobby', name: 'Find Opponents', path: '/sparring/lobby', icon: Users, category: 'Battle', keywords: ['lobby', 'matchmaking', 'find', 'players'] },
  { id: 'sparring-history', name: 'Match History', path: '/sparring/history', icon: History, category: 'Battle', keywords: ['history', 'past', 'matches'] },
  { id: 'ai-tutor', name: 'AI Tutor', path: '/ai-tutor', icon: Brain, category: 'Learn', keywords: ['tutor', 'ai', 'learn', 'study', 'help'] },
  { id: 'ai-tutor-bot', name: 'Play with Bot', path: '/ai-tutor?tab=bot', icon: Bot, category: 'Learn', keywords: ['bot', 'practice', 'ai', 'training'] },
  { id: 'videos', name: 'Video Lessons', path: '/videos', icon: Video, category: 'Learn', keywords: ['video', 'lessons', 'watch', 'tutorials'] },
  { id: 'multiplayer', name: 'Multiplayer Arena', path: '/multiplayer', icon: Swords, category: 'Battle', keywords: ['multiplayer', 'arena', 'live', 'battle'] },
  { id: 'leaderboard', name: 'Global Leaderboard', path: '/leaderboard', icon: Trophy, category: 'Ranks', keywords: ['leaderboard', 'ranks', 'top', 'players'] },
  { id: 'social', name: 'Social Hub', path: '/social', icon: Users, category: 'Social', keywords: ['social', 'friends', 'community'] },
  { id: 'social-friends', name: 'Friends', path: '/social/friends', icon: Users, category: 'Social', keywords: ['friends', 'connections'] },
  { id: 'social-feed', name: 'Activity Feed', path: '/social/feed', icon: MessageCircle, category: 'Social', keywords: ['feed', 'activity', 'posts'] },
  { id: 'social-circles', name: 'Study Circles', path: '/social/circles', icon: Globe, category: 'Social', keywords: ['circles', 'groups', 'study'] },
  { id: 'social-tutoring', name: 'Peer Tutoring', path: '/social/tutoring', icon: BookOpen, category: 'Social', keywords: ['tutoring', 'peer', 'help'] },
  { id: 'character', name: 'My Profile', path: '/character', icon: User, category: 'Profile', keywords: ['profile', 'character', 'avatar', 'me'] },
  { id: 'settings', name: 'Settings', path: '/?tab=settings', icon: Settings, category: 'Profile', keywords: ['settings', 'preferences', 'config'] },
  { id: 'onboarding', name: 'View Onboarding', path: '/onboarding', icon: HelpCircle, category: 'Help', keywords: ['onboarding', 'tutorial', 'guide', 'help'] },
  { id: 'safety', name: 'Safety Features', path: '/safety', icon: Bell, category: 'Help', keywords: ['safety', 'security', 'protection'] },
  { id: 'careers', name: 'Careers', path: '/careers', icon: Target, category: 'Other', keywords: ['careers', 'jobs', 'employment'] },
];

// Bot icon component (not in lucide-react)
function Bot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="10" x="3" y="11" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  );
}

// Quick actions that can be performed
const QUICK_ACTIONS = [
  { id: 'quick-bot', name: 'Quick Bot Match', shortcut: 'Start practicing immediately', icon: Bot, action: '/ai-tutor?tab=bot' },
  { id: 'quick-match', name: 'Find Quick Match', shortcut: 'Jump to matchmaking', icon: Swords, action: '/multiplayer' },
  { id: 'quick-friend', name: 'Find Friends', shortcut: 'Search for students', icon: Users, action: '/social/friends' },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return { pages: [], actions: [] };

    const lowerQuery = query.toLowerCase();
    
    const pages = SEARCHABLE_PAGES.filter(page => 
      page.name.toLowerCase().includes(lowerQuery) ||
      page.keywords.some(kw => kw.includes(lowerQuery)) ||
      page.category.toLowerCase().includes(lowerQuery)
    );

    const actions = QUICK_ACTIONS.filter(action =>
      action.name.toLowerCase().includes(lowerQuery)
    );

    return { pages, actions };
  }, [query]);

  // All selectable items for keyboard navigation
  const allItems = useMemo(() => {
    const items: Array<{ type: 'page' | 'action'; item: typeof SEARCHABLE_PAGES[0] | typeof QUICK_ACTIONS[0] }> = [];
    
    if (filteredResults.pages) {
      filteredResults.pages.forEach(page => items.push({ type: 'page', item: page }));
    }
    if (filteredResults.actions) {
      filteredResults.actions.forEach(action => items.push({ type: 'action', item: action }));
    }
    
    return items;
  }, [filteredResults]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (allItems[selectedIndex]) {
          const selected = allItems[selectedIndex];
          if (selected.type === 'page') {
            router.push((selected.item as typeof SEARCHABLE_PAGES[0]).path);
          } else {
            router.push((selected.item as typeof QUICK_ACTIONS[0]).action);
          }
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, allItems, selectedIndex, router, onClose]);

  // Reset on open/close
  useEffect(() => {
    setQuery('');
    setSelectedIndex(0);
  }, [isOpen]);

  // Keyboard listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Handle item click
  const handleItemClick = (type: 'page' | 'action', item: typeof SEARCHABLE_PAGES[0] | typeof QUICK_ACTIONS[0]) => {
    if (type === 'page') {
      router.push((item as typeof SEARCHABLE_PAGES[0]).path);
    } else {
      router.push((item as typeof QUICK_ACTIONS[0]).action);
    }
    onClose();
  };

  // Group pages by category
  const groupedPages = useMemo(() => {
    if (!filteredResults.pages || filteredResults.pages.length === 0) return {};
    
    return filteredResults.pages.reduce((acc, page) => {
      if (!acc[page.category]) acc[page.category] = [];
      acc[page.category].push(page);
      return acc;
    }, {} as Record<string, typeof SEARCHABLE_PAGES>);
  }, [filteredResults.pages]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, features, actions..."
                className="flex-1 bg-transparent text-white text-lg placeholder:text-gray-500 outline-none"
                autoFocus
              />
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === '' ? (
                /* Default state - Quick Actions */
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
                  <div className="space-y-1">
                    {QUICK_ACTIONS.map((action, index) => (
                      <button
                        key={action.id}
                        onClick={() => handleItemClick('action', action)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          selectedIndex === index ? 'bg-purple-500/20' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <action.icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium">{action.name}</p>
                          <p className="text-xs text-gray-500">{action.shortcut}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 mt-6">Popular Pages</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SEARCHABLE_PAGES.slice(0, 8).map((page) => (
                      <button
                        key={page.id}
                        onClick={() => handleItemClick('page', page)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <page.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300 truncate">{page.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Enter</kbd>
                      Select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Esc</kbd>
                      Close
                    </span>
                  </div>
                </div>
              ) : (
                /* Search Results */
                <div className="p-4">
                  {allItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No results found for &quot;{query}&quot;</p>
                    </div>
                  ) : (
                    <>
                      {/* Pages by Category */}
                      {Object.entries(groupedPages).map(([category, pages]) => (
                        <div key={category} className="mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{category}</p>
                          <div className="space-y-1">
                            {(pages as typeof SEARCHABLE_PAGES).map((page) => {
                              const globalIndex = allItems.findIndex(
                                item => item.type === 'page' && (item.item as typeof SEARCHABLE_PAGES[0]).id === page.id
                              );
                              return (
                                <button
                                  key={page.id}
                                  onClick={() => handleItemClick('page', page)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                    selectedIndex === globalIndex ? 'bg-purple-500/20' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <page.icon className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="text-white">{page.name}</p>
                                    <p className="text-xs text-gray-500">{page.path}</p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Quick Actions */}
                      {filteredResults.actions && filteredResults.actions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
                          <div className="space-y-1">
                            {filteredResults.actions.map((action) => {
                              const globalIndex = allItems.findIndex(
                                item => item.type === 'action' && (item.item as typeof QUICK_ACTIONS[0]).id === action.id
                              );
                              return (
                                <button
                                  key={action.id}
                                  onClick={() => handleItemClick('action', action)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                    selectedIndex === globalIndex ? 'bg-cyan-500/20' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <action.icon className="w-4 h-4 text-cyan-400" />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="text-white">{action.name}</p>
                                    <p className="text-xs text-gray-500">{action.shortcut}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                    Action
                                  </Badge>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage global search state
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);
  const toggleSearch = useCallback(() => setIsOpen(prev => !prev), []);

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return { isOpen, openSearch, closeSearch, toggleSearch };
}

// Search trigger button component
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
    >
      <Search className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-400 hidden sm:inline">Search...</span>
      <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-500">
        <Command className="w-3 h-3" />
        K
      </kbd>
    </button>
  );
}

export default GlobalSearch;

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Brain, Video, Users, User, Trophy, Home } from 'lucide-react';

interface BottomNavProps {
  user?: {
    id: string;
    name: string;
  } | null;
}

// Bottom navigation items
const BOTTOM_NAV_ITEMS = [
  { id: 'home', href: '/', label: 'Home', icon: Home },
  { id: 'sparring', href: '/sparring', label: 'Sparring', icon: Swords },
  { id: 'ai-tutor', href: '/ai-tutor', label: 'Learn', icon: Brain },
  { id: 'social', href: '/social', label: 'Social', icon: Users },
  { id: 'profile', href: '/character', label: 'Profile', icon: User },
];

export function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/character') return pathname.startsWith('/character') || pathname.startsWith('/?tab=profile');
    return pathname.startsWith(href);
  };

  // Don't show on auth pages
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-t border-white/10 md:hidden">
      <div className="container mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {BOTTOM_NAV_ITEMS.map(({ id, href, label, icon: Icon }) => {
            const active = isActive(href);
            
            return (
              <Link key={id} href={href} className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-all w-full ${
                    active
                      ? 'text-purple-400 bg-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] sm:text-xs font-medium">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -top-0.5 w-8 h-0.5 bg-purple-400 rounded-full"
                    />
                  )}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check if we're back online
    const handleOnline = () => setIsOnline(true);
    window.addEventListener('online', handleOnline);
    setIsOnline(navigator.onLine);
    
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                <WifiOff className="w-10 h-10 text-amber-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
            <p className="text-gray-400 mb-6">
              No internet connection detected. Some features may be limited, 
              but you can still access cached content and practice mode.
            </p>

            <div className="space-y-3">
              {isOnline ? (
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full border-white/20 bg-white/5"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}

              <Link href="/" className="block">
                <Button variant="outline" className="w-full border-white/20 bg-white/5">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-medium mb-4 flex items-center justify-center gap-2">
                <Swords className="w-4 h-4 text-purple-400" />
                Available Offline
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Practice mode (cached questions)</li>
                <li>✓ View past match history</li>
                <li>✓ Read cached messages</li>
                <li>✓ Review study materials</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

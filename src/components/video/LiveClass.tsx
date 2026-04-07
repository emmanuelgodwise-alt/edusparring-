'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, VideoOff, Mic, MicOff, ScreenShare, Users, MessageCircle,
  Hand, ThumbsUp, Send, MoreHorizontal, Settings, X, Maximize,
  Minimize, Volume2, VolumeX, Radio, Clock, Crown, Shield, Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LiveClass, LiveChatMessage } from '@/types/video';

interface LiveClassViewerProps {
  liveClass: LiveClass;
  currentUserId?: string;
  onLeave?: () => void;
}

export function LiveClassViewer({ liveClass, currentUserId, onLeave }: LiveClassViewerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(liveClass.viewerCount);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate receiving messages
  useEffect(() => {
    const mockMessages: LiveChatMessage[] = [
      {
        id: '1',
        liveClassId: liveClass.id,
        userId: 'u1',
        userName: 'Alex',
        message: 'Great explanation!',
        timestamp: new Date().toISOString(),
        isHighlighted: false,
        isModerator: false,
      },
      {
        id: '2',
        liveClassId: liveClass.id,
        userId: 'u2',
        userName: 'Jordan',
        message: 'Can you explain that again?',
        timestamp: new Date().toISOString(),
        isHighlighted: false,
        isModerator: false,
      },
      {
        id: '3',
        liveClassId: liveClass.id,
        userId: 'u3',
        userName: 'Teacher',
        message: 'Welcome everyone! Today we will cover quadratic equations.',
        timestamp: new Date().toISOString(),
        isHighlighted: true,
        isModerator: true,
      },
    ];
    setChatMessages(mockMessages);

    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);

    return () => clearInterval(interval);
  }, [liveClass.id]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUserId) return;

    const message: LiveChatMessage = {
      id: Date.now().toString(),
      liveClassId: liveClass.id,
      userId: currentUserId,
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isHighlighted: false,
      isModerator: false,
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[500px] bg-slate-950 rounded-xl overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Stream */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
          {liveClass.status === 'live' ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {liveClass.hostName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{liveClass.hostName}</h3>
                <p className="text-gray-400">is streaming now</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold text-white mb-2">Starting Soon</h3>
                <p className="text-gray-400">
                  {liveClass.scheduledFor 
                    ? new Date(liveClass.scheduledFor).toLocaleString()
                    : 'Waiting for host...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Badge */}
        {liveClass.status === 'live' && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge className="bg-red-500 text-white animate-pulse">
              <Radio className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
              <Users className="w-3 h-3 mr-1" />
              {viewerCount.toLocaleString()}
            </Badge>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`text-white hover:bg-white/20 ${isHandRaised ? 'bg-yellow-500/30' : ''}`}
              >
                <Hand className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={onLeave}
                className="text-red-400 border-red-400/30 hover:bg-red-500/20"
              >
                Leave
              </Button>
            </div>
          </div>
        </div>

        {/* Class Info */}
        <div className="absolute top-4 right-4 text-right">
          <h3 className="text-lg font-semibold text-white">{liveClass.title}</h3>
          <p className="text-sm text-gray-400">{liveClass.subject}</p>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="w-full lg:w-80 border-l border-white/10 flex flex-col bg-slate-900/50">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(false)}
              className="lg:hidden text-gray-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3" ref={chatRef}>
            <div className="space-y-3">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.isHighlighted ? 'bg-yellow-500/10 -mx-2 px-2 py-1 rounded' : ''}`}
                >
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarFallback className={msg.isModerator ? 'bg-purple-500' : 'bg-gray-600'}>
                      {msg.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${msg.isModerator ? 'text-purple-400' : 'text-white'}`}>
                        {msg.userName}
                      </span>
                      {msg.isModerator && (
                        <Shield className="w-3 h-3 text-purple-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300 break-words">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              <Button type="submit" size="icon" className="bg-purple-500 hover:bg-purple-600">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Toggle */}
      {!showChat && (
        <Button
          variant="outline"
          onClick={() => setShowChat(true)}
          className="fixed bottom-20 right-4 lg:hidden bg-purple-500 border-purple-500 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      )}
    </div>
  );
}

// Live Class Host Component
export function LiveClassHost({ liveClass, onEnd }: { liveClass: LiveClass; onEnd?: () => void }) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(liveClass.viewerCount);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] bg-slate-950 rounded-xl overflow-hidden">
      {/* Preview Area */}
      <div className="h-full flex items-center justify-center relative bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
        {isVideoOn ? (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">
                {liveClass.hostName.charAt(0)}
              </span>
            </div>
            <p className="text-gray-400">Camera preview</p>
          </div>
        ) : (
          <div className="text-center">
            <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Camera is off</p>
          </div>
        )}

        {/* Info Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <Badge className="bg-red-500 text-white animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
          <span className="text-white font-mono">{formatDuration(duration)}</span>
          <Badge variant="outline" className="bg-black/50 text-white border-white/20">
            <Users className="w-3 h-3 mr-1" />
            {viewerCount.toLocaleString()}
          </Badge>
        </div>

        {/* Class Info */}
        <div className="absolute top-4 right-4 text-right">
          <h3 className="text-lg font-semibold text-white">{liveClass.title}</h3>
          <p className="text-sm text-gray-400">{liveClass.subject}</p>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isAudioOn ? 'secondary' : 'destructive'}
              size="lg"
              onClick={() => setIsAudioOn(!isAudioOn)}
              className="rounded-full w-14 h-14"
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>
            
            <Button
              variant={isVideoOn ? 'secondary' : 'destructive'}
              size="lg"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="rounded-full w-14 h-14"
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
            
            <Button
              variant={isSharing ? 'default' : 'secondary'}
              size="lg"
              onClick={() => setIsSharing(!isSharing)}
              className="rounded-full w-14 h-14"
            >
              <ScreenShare className="w-6 h-6" />
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={onEnd}
              className="rounded-full px-8"
            >
              End Stream
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Live Class Card
export function LiveClassCard({ liveClass, onClick }: { liveClass: LiveClass; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className={`overflow-hidden ${
        liveClass.status === 'live' 
          ? 'bg-gradient-to-br from-red-900/30 to-purple-900/30 border-red-500/30' 
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="relative aspect-video">
          <img
            src={liveClass.thumbnailUrl || '/placeholder-live.jpg'}
            alt={liveClass.title}
            className="w-full h-full object-cover"
          />
          
          {liveClass.status === 'live' && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-500 text-white animate-pulse">
                <Radio className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            {liveClass.status === 'live' ? (
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                <Users className="w-3 h-3 mr-1" />
                {liveClass.viewerCount} watching
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                <Clock className="w-3 h-3 mr-1" />
                {liveClass.scheduledFor 
                  ? new Date(liveClass.scheduledFor).toLocaleDateString()
                  : 'Scheduled'}
              </Badge>
            )}
            <Badge variant="outline" className="bg-black/50 text-white border-white/20 capitalize">
              {liveClass.difficulty}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
            {liveClass.title}
          </h4>
          <p className="text-sm text-gray-400 mt-1">{liveClass.hostName}</p>
          <p className="text-sm text-gray-500 mt-1">{liveClass.subject}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

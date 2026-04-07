'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, CheckCircle, X, Wifi, WifiOff,
  ArrowLeft, Bot, Send, MessageCircle, Swords,
  Globe, Star, Zap, Clock, ChevronRight, Sparkles,
  Languages, Shield, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MultilingualChat, type TranslatedMessage, type LanguagePreference } from '@/components/chat/MultilingualChat';
import { type LanguageCode, SUPPORTED_LANGUAGES, getLanguageFlag, getLanguageNativeName } from '@/lib/translation';

// Country flags and names
const countryFlags: Record<string, string> = {
  US: '🇺🇸', UK: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵', KR: '🇰🇷',
  CN: '🇨🇳', IN: '🇮🇳', BR: '🇧🇷', CA: '🇨🇦', AU: '🇦🇺', ES: '🇪🇸',
  IT: '🇮🇹', MX: '🇲🇽', RU: '🇷🇺', NL: '🇳🇱', SE: '🇸🇪', PL: '🇵🇱',
  NG: '🇳🇬', EG: '🇪🇬', ZA: '🇿🇦', SA: '🇸🇦', AE: '🇦🇪', TR: '🇹🇷'
};

// Country to language mapping
const countryToLanguage: Record<string, LanguageCode> = {
  US: 'en', UK: 'en', DE: 'de', FR: 'fr', JP: 'ja', KR: 'ko',
  CN: 'zh', IN: 'hi', BR: 'pt', CA: 'en', AU: 'en', ES: 'es',
  IT: 'it', MX: 'es', RU: 'ru', NL: 'nl', SE: 'en', PL: 'pl',
  NG: 'en', EG: 'ar', ZA: 'en', SA: 'ar', AE: 'ar', TR: 'tr'
};

// Subject icons and names
const subjectIcons: Record<string, string> = {
  Math: '📐', Physics: '⚛️', Chemistry: '🧪', Biology: '🧬',
  History: '📜', Geography: '🌍', Literature: '📚', Economics: '💰',
  ComputerScience: '💻', Civics: '⚖️', English: '📖',
};

const subjectNames: Record<string, string> = {
  Math: 'Math', Physics: 'Physics', Chemistry: 'Chemistry', Biology: 'Biology',
  History: 'History', Geography: 'Geography', Literature: 'Literature', Economics: 'Economics',
  ComputerScience: 'Computer Science', Civics: 'Civics', English: 'English',
};

// Mock sparring partners data
interface SparringPartner {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  countryName: string;
  language: LanguageCode;
  knowledgeRating: number;
  rank: string;
  online: boolean;
  favoriteSubjects: string[];
  winRate: number;
  lastActive: string;
}

const mockPartners: SparringPartner[] = [
  {
    id: '1',
    name: 'Alex Chen',
    country: 'US',
    countryName: 'United States',
    language: 'en',
    knowledgeRating: 1450,
    rank: 'Elite',
    online: true,
    favoriteSubjects: ['Math', 'Physics'],
    winRate: 72,
    lastActive: 'now'
  },
  {
    id: '2',
    name: 'Yuki Tanaka',
    country: 'JP',
    countryName: 'Japan',
    language: 'ja',
    knowledgeRating: 1380,
    rank: 'Advanced',
    online: true,
    favoriteSubjects: ['Biology', 'Chemistry'],
    winRate: 68,
    lastActive: 'now'
  },
  {
    id: '3',
    name: 'Emma Schmidt',
    country: 'DE',
    countryName: 'Germany',
    language: 'de',
    knowledgeRating: 1320,
    rank: 'Advanced',
    online: true,
    favoriteSubjects: ['History', 'Literature'],
    winRate: 65,
    lastActive: '2m ago'
  },
  {
    id: '4',
    name: 'Park Ji-hoon',
    country: 'KR',
    countryName: 'South Korea',
    language: 'ko',
    knowledgeRating: 1520,
    rank: 'Elite',
    online: true,
    favoriteSubjects: ['Math', 'ComputerScience'],
    winRate: 78,
    lastActive: 'now'
  },
  {
    id: '5',
    name: 'Sophie Martin',
    country: 'FR',
    countryName: 'France',
    language: 'fr',
    knowledgeRating: 1250,
    rank: 'Intermediate',
    online: true,
    favoriteSubjects: ['Literature', 'History'],
    winRate: 58,
    lastActive: '5m ago'
  },
  {
    id: '6',
    name: 'Rahul Sharma',
    country: 'IN',
    countryName: 'India',
    language: 'hi',
    knowledgeRating: 1400,
    rank: 'Advanced',
    online: true,
    favoriteSubjects: ['Physics', 'Math'],
    winRate: 71,
    lastActive: 'now'
  },
  {
    id: '7',
    name: 'Lucas Silva',
    country: 'BR',
    countryName: 'Brazil',
    language: 'pt',
    knowledgeRating: 1180,
    rank: 'Intermediate',
    online: false,
    favoriteSubjects: ['Geography', 'Economics'],
    winRate: 55,
    lastActive: '1h ago'
  },
  {
    id: '8',
    name: 'Olivia Wilson',
    country: 'AU',
    countryName: 'Australia',
    language: 'en',
    knowledgeRating: 1350,
    rank: 'Advanced',
    online: true,
    favoriteSubjects: ['Biology', 'Chemistry'],
    winRate: 67,
    lastActive: 'now'
  },
  {
    id: '9',
    name: 'Wang Wei',
    country: 'CN',
    countryName: 'China',
    language: 'zh',
    knowledgeRating: 1420,
    rank: 'Elite',
    online: true,
    favoriteSubjects: ['Math', 'Physics'],
    winRate: 75,
    lastActive: 'now'
  },
  {
    id: '10',
    name: 'Ahmed Hassan',
    country: 'EG',
    countryName: 'Egypt',
    language: 'ar',
    knowledgeRating: 1290,
    rank: 'Advanced',
    online: true,
    favoriteSubjects: ['History', 'Geography'],
    winRate: 62,
    lastActive: 'now'
  }
];

// Rank colors
const rankColors: Record<string, string> = {
  Beginner: 'text-gray-400 bg-gray-500/20',
  Intermediate: 'text-blue-400 bg-blue-500/20',
  Advanced: 'text-purple-400 bg-purple-500/20',
  Elite: 'text-amber-400 bg-amber-500/20'
};

export default function SparringLobbyPage() {
  const router = useRouter();
  const [selectedPartner, setSelectedPartner] = useState<SparringPartner | null>(null);
  const [activeTab, setActiveTab] = useState('partners');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected] = useState(true);
  const [currentUserId] = useState('current-user');
  
  // Language preference state
  const [languagePref, setLanguagePref] = useState<LanguagePreference>({
    myLanguage: 'en',
    theirLanguage: 'en',
  });

  // Initial messages for chat
  const getInitialMessages = useCallback((partner: SparringPartner): TranslatedMessage[] => [
    {
      id: '1',
      senderId: partner.id,
      originalText: `Hey! 👋 I see you're interested in sparring. Ready for a challenge?`,
      translatedText: `Hey! 👋 I see you're interested in sparring. Ready for a challenge?`,
      originalLanguage: partner.language,
      targetLanguage: languagePref.myLanguage,
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '2',
      senderId: 'current-user',
      originalText: `Hi! Yeah, I've been practicing. What subject do you want to spar in?`,
      translatedText: `Hi! Yeah, I've been practicing. What subject do you want to spar in?`,
      originalLanguage: languagePref.myLanguage,
      targetLanguage: partner.language,
      timestamp: new Date(Date.now() - 90000),
    },
    {
      id: '3',
      senderId: partner.id,
      originalText: `${subjectIcons[partner.favoriteSubjects[0]]} ${subjectNames[partner.favoriteSubjects[0]]} is my favorite! Or we could try ${subjectNames[partner.favoriteSubjects[1]]}. Your choice!`,
      translatedText: `${subjectIcons[partner.favoriteSubjects[0]]} ${subjectNames[partner.favoriteSubjects[0]]} is my favorite! Or we could try ${subjectNames[partner.favoriteSubjects[1]]}. Your choice!`,
      originalLanguage: partner.language,
      targetLanguage: languagePref.myLanguage,
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '4',
      senderId: 'current-user',
      originalText: `Let's do ${subjectNames[partner.favoriteSubjects[0]]}! I'm feeling confident today 💪`,
      translatedText: `Let's do ${subjectNames[partner.favoriteSubjects[0]]}! I'm feeling confident today 💪`,
      originalLanguage: languagePref.myLanguage,
      targetLanguage: partner.language,
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: '5',
      senderId: partner.id,
      originalText: `Awesome! My KR is ${partner.knowledgeRating}, so it should be a close match. May the best mind win! 🧠⚡`,
      translatedText: `Awesome! My KR is ${partner.knowledgeRating}, so it should be a close match. May the best mind win! 🧠⚡`,
      originalLanguage: partner.language,
      targetLanguage: languagePref.myLanguage,
      timestamp: new Date(Date.now() - 15000),
    }
  ], [languagePref.myLanguage]);

  const [chatMessages, setChatMessages] = useState<TranslatedMessage[]>([]);

  // Select partner and load chat
  const handleSelectPartner = (partner: SparringPartner) => {
    setSelectedPartner(partner);
    setLanguagePref(prev => ({
      ...prev,
      theirLanguage: partner.language,
    }));
    setChatMessages(getInitialMessages(partner));
    setActiveTab('chat');
  };

  // Handle language preference change
  const handleLanguageChange = (preference: LanguagePreference) => {
    setLanguagePref(preference);
  };

  // Handle send message callback
  const handleSendMessage = (original: string, translated: string) => {
    // In a real app, this would send to WebSocket/API
    console.log('Message sent:', { original, translated });
  };

  // Start sparring
  const handleStartSparring = () => {
    router.push('/sparring');
  };

  // Filter partners by search
  const filteredPartners = mockPartners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.favoriteSubjects.some(s => subjectNames[s].toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/sparring">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Swords className="w-8 h-8 text-purple-400" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold">Sparring Lobby</h1>
                  <p className="text-xs text-gray-400">Find your opponent • Translate & Connect</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Translation indicator */}
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <Languages className="w-3 h-3 mr-1" />
                28 Languages
              </Badge>
              {isConnected ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Users className="w-3 h-3 mr-1" />
                {mockPartners.filter(p => p.online).length} Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Main content - Desktop: Side by side, Mobile: Tabs */}
        <main className="flex-1 overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-full">
            {/* Left Panel - Partners List */}
            <div className="w-[380px] border-r border-white/10 bg-black/10 backdrop-blur-sm flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search players or countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Partners List */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {filteredPartners.map((partner, index) => (
                      <motion.button
                        key={partner.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectPartner(partner)}
                        className={`w-full p-3 rounded-xl border transition-all text-left ${
                          selectedPartner?.id === partner.id
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-white/20">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                                {partner.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {partner.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-950" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold truncate">{partner.name}</span>
                              <span className="text-lg">{countryFlags[partner.country]}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-white/10" title={`Speaks ${SUPPORTED_LANGUAGES[partner.language]?.nativeName}`}>
                                {getLanguageFlag(partner.language)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Badge className={`${rankColors[partner.rank]} text-[10px] px-1.5 py-0`}>
                                {partner.rank}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {partner.knowledgeRating} KR
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {partner.favoriteSubjects.slice(0, 2).map(subject => (
                                <span key={subject} className="text-sm">
                                  {subjectIcons[subject]}
                                </span>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                {partner.winRate}% WR
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              {/* Play vs Bot option */}
              <div className="p-4 border-t border-white/10">
                <Link href="/sparring">
                  <Button variant="outline" className="w-full border-white/20 bg-white/5 hover:bg-white/10">
                    <Bot className="w-4 h-4 mr-2" />
                    Practice with AI Bot
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Panel - Multilingual Chat Interface */}
            <div className="flex-1 flex flex-col bg-black/5">
              {selectedPartner ? (
                <>
                  {/* Chat Header with Partner Info */}
                  <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10 border-2 border-white/20">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                              {selectedPartner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {selectedPartner.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{selectedPartner.name}</span>
                            <span className="text-base">{countryFlags[selectedPartner.country]}</span>
                            <Badge className={`${rankColors[selectedPartner.rank]} text-[10px] px-1.5 py-0`}>
                              {selectedPartner.rank}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {selectedPartner.countryName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Languages className="w-3 h-3" />
                              {getLanguageNativeName(selectedPartner.language)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {selectedPartner.knowledgeRating} KR
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleStartSparring}
                          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                        >
                          <Swords className="w-4 h-4 mr-2" />
                          Start Sparring
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Multilingual Chat Component */}
                  <MultilingualChat
                    currentUserId={currentUserId}
                    partnerId={selectedPartner.id}
                    partnerName={selectedPartner.name}
                    partnerLanguage={selectedPartner.language}
                    partnerCountry={selectedPartner.country}
                    onSendMessage={handleSendMessage}
                    onLanguageChange={handleLanguageChange}
                    initialMessages={chatMessages}
                    className="flex-1"
                  />
                </>
              ) : (
                /* Empty state */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center"
                    >
                      <Languages className="w-10 h-10 text-gray-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">Connect Across Languages</h3>
                    <p className="text-gray-400 max-w-sm mb-4">
                      Choose a sparring partner to start chatting. Our AI automatically translates messages so you can communicate in your preferred language!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-cyan-400">
                      <Shield className="w-4 h-4" />
                      <span>Real-time translation powered by AI</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout - Tabs */}
          <div className="md:hidden h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-sm border-b border-white/10 rounded-none h-12">
                <TabsTrigger value="partners" className="data-[state=active]:bg-purple-500/20">
                  <Users className="w-4 h-4 mr-2" />
                  Partners
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500/20" disabled={!selectedPartner}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                  {selectedPartner && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="partners" className="flex-1 overflow-hidden mt-0">
                <div className="h-full flex flex-col bg-black/10">
                  {/* Search */}
                  <div className="p-3 border-b border-white/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Partners List */}
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                      {filteredPartners.map((partner, index) => (
                        <motion.button
                          key={partner.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelectPartner(partner)}
                          className={`w-full p-3 rounded-xl border transition-all text-left ${
                            selectedPartner?.id === partner.id
                              ? 'bg-purple-500/20 border-purple-500/50'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-11 h-11 border-2 border-white/20">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold text-sm">
                                  {partner.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {partner.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm truncate">{partner.name}</span>
                                <span className="text-base">{countryFlags[partner.country]}</span>
                                <span className="text-xs">{getLanguageFlag(partner.language)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Badge className={`${rankColors[partner.rank]} text-[9px] px-1 py-0`}>
                                  {partner.rank}
                                </Badge>
                                <span>{partner.knowledgeRating} KR</span>
                                <span>•</span>
                                <span>{partner.winRate}% WR</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Play vs Bot */}
                  <div className="p-3 border-t border-white/10">
                    <Link href="/sparring">
                      <Button variant="outline" className="w-full border-white/20 bg-white/5">
                        <Bot className="w-4 h-4 mr-2" />
                        Practice with AI Bot
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
                {selectedPartner && (
                  <div className="h-full flex flex-col bg-black/5">
                    {/* Mobile Chat Header */}
                    <div className="p-3 border-b border-white/10 bg-black/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setActiveTab('partners')}
                          className="text-gray-400 hover:text-white"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex-1 flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold text-sm">
                              {selectedPartner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm">{selectedPartner.name}</span>
                              <span>{countryFlags[selectedPartner.country]}</span>
                              <span className="text-xs">{getLanguageFlag(selectedPartner.language)}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{selectedPartner.knowledgeRating} KR</span>
                          </div>
                        </div>
                        <Button
                          onClick={handleStartSparring}
                          size="sm"
                          className="bg-gradient-to-r from-cyan-600 to-purple-600"
                        >
                          <Swords className="w-4 h-4 mr-1" />
                          Spar
                        </Button>
                      </div>
                    </div>

                    {/* Multilingual Chat for Mobile */}
                    <MultilingualChat
                      currentUserId={currentUserId}
                      partnerId={selectedPartner.id}
                      partnerName={selectedPartner.name}
                      partnerLanguage={selectedPartner.language}
                      partnerCountry={selectedPartner.country}
                      onSendMessage={handleSendMessage}
                      onLanguageChange={handleLanguageChange}
                      initialMessages={chatMessages}
                      className="flex-1"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

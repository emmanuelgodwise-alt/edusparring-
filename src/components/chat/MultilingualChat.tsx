'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Send, MessageCircle, Languages, ChevronDown,
  Check, Copy, Volume2, Sparkles, RefreshCw, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
  getLanguageFlag,
  getLanguageNativeName,
  COMMON_PHRASES,
  isRTL,
} from '@/lib/translation';

// Translated message interface
export interface TranslatedMessage {
  id: string;
  senderId: string;
  originalText: string;
  translatedText?: string;
  originalLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  timestamp: Date;
  isTranslating?: boolean;
  translationFailed?: boolean;
  showOriginal?: boolean;
}

// Language preference interface
export interface LanguagePreference {
  myLanguage: LanguageCode;
  theirLanguage: LanguageCode;
}

// Props for MultilingualChat
interface MultilingualChatProps {
  currentUserId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerLanguage?: LanguageCode;
  partnerCountry?: string;
  onSendMessage?: (message: string, translatedMessage: string) => void;
  onLanguageChange?: (preference: LanguagePreference) => void;
  initialMessages?: TranslatedMessage[];
  className?: string;
}

// Popular languages for quick selection
const POPULAR_LANGUAGES: LanguageCode[] = ['en', 'es', 'zh', 'fr', 'ar', 'hi', 'pt', 'ja', 'ko', 'de'];

export function MultilingualChat({
  currentUserId,
  partnerId,
  partnerName,
  partnerAvatar,
  partnerLanguage = 'en',
  partnerCountry,
  onSendMessage,
  onLanguageChange,
  initialMessages = [],
  className = '',
}: MultilingualChatProps) {
  const [messages, setMessages] = useState<TranslatedMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [languagePref, setLanguagePref] = useState<LanguagePreference>({
    myLanguage: 'en',
    theirLanguage: partnerLanguage,
  });
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Translate text using API
  const translateText = useCallback(async (
    text: string,
    sourceLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ): Promise<string> => {
    if (sourceLanguage === targetLanguage) return text;

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
          context: 'Educational chat between students',
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data.translatedText;
      }
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsTranslating(true);

    // Create initial message
    const newMessage: TranslatedMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      originalText: messageText,
      originalLanguage: languagePref.myLanguage,
      targetLanguage: languagePref.theirLanguage,
      timestamp: new Date(),
      isTranslating: true,
    };

    setMessages(prev => [...prev, newMessage]);

    // Translate the message
    const translatedText = await translateText(
      messageText,
      languagePref.myLanguage,
      languagePref.theirLanguage
    );

    // Update message with translation
    setMessages(prev =>
      prev.map(msg =>
        msg.id === newMessage.id
          ? { ...msg, translatedText, isTranslating: false }
          : msg
      )
    );

    setIsTranslating(false);

    // Callback
    if (onSendMessage) {
      onSendMessage(messageText, translatedText);
    }
  };

  // Handle receiving message (for integration with real-time chat)
  const handleReceiveMessage = useCallback(async (
    messageText: string,
    senderLanguage: LanguageCode = languagePref.theirLanguage
  ) => {
    const newMessage: TranslatedMessage = {
      id: Date.now().toString(),
      senderId: partnerId,
      originalText: messageText,
      originalLanguage: senderLanguage,
      targetLanguage: languagePref.myLanguage,
      timestamp: new Date(),
      isTranslating: true,
    };

    setMessages(prev => [...prev, newMessage]);

    // Translate incoming message to user's language
    const translatedText = await translateText(
      messageText,
      senderLanguage,
      languagePref.myLanguage
    );

    setMessages(prev =>
      prev.map(msg =>
        msg.id === newMessage.id
          ? { ...msg, translatedText, isTranslating: false }
          : msg
      )
    );
  }, [partnerId, languagePref, translateText]);

  // Toggle showing original text
  const toggleShowOriginal = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, showOriginal: !msg.showOriginal }
          : msg
      )
    );
  };

  // Retry failed translation
  const retryTranslation = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isTranslating: true, translationFailed: false }
          : msg
      )
    );

    const translatedText = await translateText(
      message.originalText,
      message.originalLanguage,
      message.targetLanguage
    );

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, translatedText, isTranslating: false }
          : msg
      )
    );
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Quick phrase insertion
  const insertQuickPhrase = (phrase: string) => {
    setInputMessage(prev => prev ? `${prev} ${phrase}` : phrase);
    inputRef.current?.focus();
  };

  // Handle language preference change
  const handleLanguageChange = (type: 'my' | 'their', language: LanguageCode) => {
    const newPref: LanguagePreference = {
      ...languagePref,
      [type === 'my' ? 'myLanguage' : 'theirLanguage']: language,
    };
    setLanguagePref(newPref);
    if (onLanguageChange) {
      onLanguageChange(newPref);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get common phrases for user's language
  const quickPhrases = COMMON_PHRASES[languagePref.myLanguage] || COMMON_PHRASES.en;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Language Settings Bar */}
      <div className="p-3 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Translation:</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* My Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-white/20 bg-white/5">
                  <span className="mr-1">{getLanguageFlag(languagePref.myLanguage)}</span>
                  <span className="text-xs">{getLanguageNativeName(languagePref.myLanguage)}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-slate-900 border-white/10 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-white text-xs">Popular Languages</DropdownMenuLabel>
                {POPULAR_LANGUAGES.map(lang => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => handleLanguageChange('my', lang)}
                    className={`text-gray-300 cursor-pointer ${languagePref.myLanguage === lang ? 'bg-purple-500/20' : ''}`}
                  >
                    <span className="mr-2">{getLanguageFlag(lang)}</span>
                    <span className="flex-1">{SUPPORTED_LANGUAGES[lang].nativeName}</span>
                    {languagePref.myLanguage === lang && <Check className="w-4 h-4 text-purple-400" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuLabel className="text-white text-xs">All Languages</DropdownMenuLabel>
                {Object.entries(SUPPORTED_LANGUAGES)
                  .filter(([code]) => !POPULAR_LANGUAGES.includes(code as LanguageCode))
                  .map(([code, info]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => handleLanguageChange('my', code as LanguageCode)}
                      className={`text-gray-300 cursor-pointer ${languagePref.myLanguage === code ? 'bg-purple-500/20' : ''}`}
                    >
                      <span className="mr-2">{info.flag}</span>
                      <span className="flex-1">{info.nativeName}</span>
                      {languagePref.myLanguage === code && <Check className="w-4 h-4 text-purple-400" />}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-gray-500">→</span>

            {/* Their Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-white/20 bg-white/5">
                  <span className="mr-1">{getLanguageFlag(languagePref.theirLanguage)}</span>
                  <span className="text-xs">{getLanguageNativeName(languagePref.theirLanguage)}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-white/10 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-white text-xs">Partner's Language</DropdownMenuLabel>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => handleLanguageChange('their', code as LanguageCode)}
                    className={`text-gray-300 cursor-pointer ${languagePref.theirLanguage === code ? 'bg-purple-500/20' : ''}`}
                  >
                    <span className="mr-2">{info.flag}</span>
                    <span className="flex-1">{info.nativeName}</span>
                    {languagePref.theirLanguage === code && <Check className="w-4 h-4 text-purple-400" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                  {/* Partner avatar for received messages */}
                  {message.senderId !== currentUserId && (
                    <div className="flex items-end gap-2">
                      <Avatar className="w-6 h-6 border border-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xs font-bold">
                          {partnerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <MessageBubble
                          message={message}
                          isOwn={false}
                          onToggleOriginal={() => toggleShowOriginal(message.id)}
                          onRetry={() => retryTranslation(message.id)}
                          onCopy={copyToClipboard}
                        />
                      </div>
                    </div>
                  )}

                  {/* Own messages */}
                  {message.senderId === currentUserId && (
                    <MessageBubble
                      message={message}
                      isOwn={true}
                      onToggleOriginal={() => toggleShowOriginal(message.id)}
                      onRetry={() => retryTranslation(message.id)}
                      onCopy={copyToClipboard}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <Avatar className="w-6 h-6 border border-white/20">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xs font-bold">
                    {partnerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Phrases */}
      <div className="px-4 py-2 border-t border-white/10 bg-black/10 overflow-x-auto">
        <div className="flex gap-2 min-w-max max-w-2xl mx-auto">
          <div className="flex items-center gap-1 text-xs text-gray-500 mr-2">
            <Sparkles className="w-3 h-3" />
            <span>Quick:</span>
          </div>
          {Object.entries(quickPhrases).slice(0, 6).map(([key, phrase]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => insertQuickPhrase(phrase)}
              className="h-7 text-xs border-white/20 bg-white/5 text-gray-300 hover:bg-white/10"
            >
              {phrase}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={`Type in ${getLanguageNativeName(languagePref.myLanguage)}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isTranslating && handleSendMessage()}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-20"
              dir={isRTL(languagePref.myLanguage) ? 'rtl' : 'ltr'}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] border-white/20 bg-white/5">
                {getLanguageFlag(languagePref.myLanguage)} → {getLanguageFlag(languagePref.theirLanguage)}
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTranslating}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
          >
            {isTranslating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Message Bubble Component
interface MessageBubbleProps {
  message: TranslatedMessage;
  isOwn: boolean;
  onToggleOriginal: () => void;
  onRetry: () => void;
  onCopy: (text: string) => void;
}

function MessageBubble({ message, isOwn, onToggleOriginal, onRetry, onCopy }: MessageBubbleProps) {
  const hasTranslation = message.translatedText && message.translatedText !== message.originalText;

  return (
    <div className="space-y-1">
      <div
        className={`px-4 py-2.5 rounded-2xl ${
          isOwn
            ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-br-md'
            : 'bg-white/10 backdrop-blur border border-white/10 rounded-bl-md'
        }`}
        dir={isRTL(message.originalLanguage) ? 'rtl' : 'ltr'}
      >
        {message.isTranslating ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />
            <span className="text-sm text-gray-400">Translating...</span>
          </div>
        ) : (
          <>
            {/* Translated text (main) */}
            {hasTranslation && (
              <p className="text-sm">{message.translatedText}</p>
            )}

            {/* Original text */}
            {message.showOriginal && (
              <p className={`text-sm mt-2 pt-2 border-t ${isOwn ? 'border-white/20 text-white/70' : 'border-white/10 text-gray-400'}`}>
                {message.originalText}
              </p>
            )}

            {/* No translation needed */}
            {!hasTranslation && (
              <p className="text-sm">{message.originalText}</p>
            )}
          </>
        )}
      </div>

      {/* Message actions */}
      <div className={`flex items-center gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <p className="text-[10px] text-gray-500">
          {formatTime(message.timestamp)}
        </p>

        {hasTranslation && !message.isTranslating && (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleOriginal}
                    className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300"
                  >
                    <Languages className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{message.showOriginal ? 'Hide original' : 'Show original'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onCopy(message.translatedText || message.originalText)}
                    className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {message.translationFailed && (
          <button
            onClick={onRetry}
            className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}

        {hasTranslation && (
          <Badge variant="outline" className="text-[9px] border-white/10 bg-white/5 text-gray-400">
            <Languages className="w-2 h-2 mr-1" />
            Translated
          </Badge>
        )}
      </div>
    </div>
  );
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default MultilingualChat;

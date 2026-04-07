'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Mic, MicOff, Image, FileText, Lightbulb, BookOpen,
  ThumbsUp, ThumbsDown, RotateCcw, Sparkles, Target, HelpCircle,
  ChevronDown, X, Maximize2, Minimize2, Copy, Check, Volume2,
  Clock, TrendingUp, Zap, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TutorMessage, TutorSession } from '@/types/ai';

interface AITutorProps {
  subject?: string;
  topic?: string;
  userId?: string;
  onSessionEnd?: (session: TutorSession) => void;
  compact?: boolean;
}

const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Computer Science'];

export function AITutor({ subject: initialSubject, topic: initialTopic, userId, onSessionEnd, compact = false }: AITutorProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState(initialSubject || 'Math');
  const [topic, setTopic] = useState(initialTopic || '');
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const greeting: TutorMessage = {
      id: 'greeting',
      role: 'assistant',
      content: `Hello! I'm your AI tutor. I'm here to help you learn ${subject}. ${topic ? `Let's focus on ${topic}.` : 'What topic would you like to explore today?'} Feel free to ask questions, request explanations, or practice problems!`,
      timestamp: new Date().toISOString(),
      subject,
      topic,
    };
    setMessages([greeting]);
  }, []);

  // Quick suggestions based on subject
  const quickSuggestions = [
    { label: 'Explain a concept', prompt: `Can you explain a key concept in ${topic || subject}?` },
    { label: 'Practice problem', prompt: `Give me a practice problem on ${topic || subject}.` },
    { label: 'Quiz me', prompt: `Quiz me on ${topic || subject}. Ask me one question at a time.` },
    { label: 'Study tips', prompt: `What are effective study strategies for ${topic || subject}?` },
    { label: 'Real-world example', prompt: `Can you give me a real-world example of ${topic || subject}?` },
  ];

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      subject,
      topic,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Call AI API
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          subject,
          topic,
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: TutorMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
          subject,
          topic,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback response
        const fallbackMessage: TutorMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: generateFallbackResponse(content, subject, topic),
          timestamp: new Date().toISOString(),
          subject,
          topic,
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('AI Tutor error:', error);
      const errorMessage: TutorMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, but I'm having trouble connecting right now. Let me help you with a quick tip for ${subject}: Practice regularly and don't hesitate to ask specific questions!`,
        timestamp: new Date().toISOString(),
        subject,
        topic,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (question: string, subj: string, top: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('explain') || lowerQ.includes('what is')) {
      return `Great question! In ${subj}${top ? `, particularly in ${top}` : ''}, the key concepts build upon foundational principles. Let me break this down:\n\n1. **Core Concept**: Understanding the fundamentals is essential\n2. **Application**: Practice applying these concepts to problems\n3. **Connection**: See how this relates to other topics\n\nWould you like me to elaborate on any specific aspect?`;
    }
    
    if (lowerQ.includes('problem') || lowerQ.includes('practice')) {
      return `Here's a practice problem for ${subj}${top ? ` (${top})` : ''}:\n\n**Problem**: A student solves 15 problems correctly out of 20 attempted. What is their accuracy rate?\n\n**Hint**: Think about the ratio of correct to total problems.\n\nTake your time, and let me know your answer when you're ready!`;
    }
    
    if (lowerQ.includes('help') || lowerQ.includes('stuck')) {
      return `I'm here to help! Here are some ways I can assist you with ${subj}:\n\n• **Explain concepts** in simple terms\n• **Work through problems** step by step\n• **Provide practice questions** at your level\n• **Give study tips** and strategies\n\nWhat would be most helpful right now?`;
    }

    return `That's an interesting question about ${subj}! Let me help you understand this better.\n\nWhen approaching this topic, consider:\n• The underlying principles\n• How it connects to what you already know\n• Practical applications\n\nWould you like me to provide a specific example or dive deeper into any aspect?`;
  };

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, feedback: { helpful, rating: null } }
        : m
    ));
  };

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  if (compact && !isExpanded) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Tutor</h3>
                <p className="text-sm text-gray-400">Get personalized help with {subject}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500"
            >
              Start Learning
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/5 border-white/10 flex flex-col ${compact ? 'h-[500px]' : 'h-[600px]'}`}>
      {/* Header */}
      <CardHeader className="pb-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Tutor
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  Online
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-xs bg-white/5 border border-white/10 rounded px-2 py-0.5 text-white"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Topic (optional)"
                  className="text-xs bg-white/5 border border-white/10 rounded px-2 py-0.5 text-white placeholder:text-gray-500 w-24"
                />
              </div>
            </div>
          </div>
          {compact && (
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={message.role === 'user' 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-purple-500 to-cyan-500'
                  }>
                    {message.role === 'user' ? '👤' : <Brain className="w-4 h-4 text-white" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-2xl max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-purple-500/30 text-white rounded-tr-none'
                      : 'bg-white/5 text-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Message Actions */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => copyMessage(message.content, message.id)}
                        className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1"
                      >
                        {copiedId === message.id ? (
                          <><Check className="w-3 h-3" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy</>
                        )}
                      </button>
                      
                      {message.feedback?.helpful === undefined && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-green-400"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-red-400"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      {message.feedback?.helpful === true && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Helpful
                        </span>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500">
                  <Brain className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/5 rounded-2xl rounded-tl-none p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.slice(0, 3).map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(s.prompt)}
                className="border-white/10 bg-white/5 text-xs"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Lightbulb className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {quickSuggestions.map((s, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => handleSuggestionClick(s.prompt)}
                  className="text-sm"
                >
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about ${subject}...`}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            disabled={isLoading}
          />
          
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-cyan-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

// Compact AI Tutor Widget
export function AITutorWidget() {
  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Study Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          Get personalized help, explanations, and practice problems powered by AI.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
            <HelpCircle className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
            <Target className="w-4 h-4 mr-2" />
            Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

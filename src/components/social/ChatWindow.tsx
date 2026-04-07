'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, ArrowLeft, Loader2, Wifi, WifiOff, Languages, 
  ChevronDown, Eye, EyeOff, RefreshCw, Copy, Check
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import {
  SUPPORTED_LANGUAGES,
  getAllLanguages,
  type LanguageCode
} from '@/lib/translation'
import { LanguagePairDisplay } from './LanguageSelector'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  originalContent?: string
  originalLang?: string
  translated?: boolean
  isRead: boolean
  createdAt: Date | string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

interface TranslatedMessage extends Message {
  translatedContent?: string
  translationLoading?: boolean
  showOriginal?: boolean
}

interface ChatFriend {
  id: string
  name: string
  avatar?: string
  knowledgeRating: number
  isOnline: boolean
  language?: LanguageCode
}

interface ChatWindowProps {
  userId: string
  friend: ChatFriend
  onBack?: () => void
  className?: string
}

export function ChatWindow({ userId, friend, onBack, className }: ChatWindowProps) {
  const [messages, setMessages] = useState<TranslatedMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const socketRef = useRef<Socket | null>(null)
  
  // Translation state
  const [myLanguage, setMyLanguage] = useState<LanguageCode>('en')
  const [theirLanguage, setTheirLanguage] = useState<LanguageCode>('en')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const allLanguages = getAllLanguages()

  // Fetch message history
  useEffect(() => {
    fetchMessages()
    fetchLanguagePreferences()
  }, [userId, friend.id])

  // Setup socket connection for real-time chat
  useEffect(() => {
    const setupSocket = async () => {
      socketRef.current = io('/?XTransformPort=3003', {
        transports: ['websocket', 'polling'],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      socketRef.current.on('connect', () => {
        console.log('[Chat] Connected to server')
        setIsConnected(true)
        socketRef.current?.emit('join-chat', { userId })
      })

      socketRef.current.on('disconnect', () => {
        console.log('[Chat] Disconnected from server')
        setIsConnected(false)
      })

      socketRef.current.on('chat-message', async (data: Message) => {
        if (data.senderId === friend.id || data.receiverId === friend.id) {
          // Translate incoming message if auto-translate is on
          if (autoTranslate && data.senderId === friend.id && theirLanguage !== myLanguage) {
            const translated = await translateMessage(data.content, theirLanguage, myLanguage)
            setMessages(prev => [...prev, { 
              ...data, 
              translatedContent: translated,
              showOriginal: false
            }])
          } else {
            setMessages(prev => [...prev, data])
          }
          
          if (data.senderId === friend.id) {
            socketRef.current?.emit('mark-read', { messageId: data.id, userId })
          }
        }
      })

      socketRef.current.on('user-typing', (data: { userId: string; isTyping: boolean }) => {
        if (data.userId === friend.id) {
          setIsTyping(data.isTyping)
        }
      })
    }

    setupSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [userId, friend.id, autoTranslate, myLanguage, theirLanguage])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/social/chat?userId=${userId}&friendId=${friend.id}&limit=50`
      )
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLanguagePreferences = async () => {
    try {
      const response = await fetch(`/api/language-preferences?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.preferences) {
        setMyLanguage(data.preferences.preferredChatLanguage as LanguageCode)
        setAutoTranslate(data.preferences.autoTranslate)
        // Set their language based on friend's preference or default
        setTheirLanguage((friend.language || data.preferences.nativeLanguage || 'en') as LanguageCode)
      }
    } catch (error) {
      console.error('Error fetching language preferences:', error)
    }
  }

  const translateMessage = async (
    text: string, 
    source: LanguageCode, 
    target: LanguageCode
  ): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLanguage: source,
          targetLanguage: target
        })
      })
      const data = await response.json()
      return data.success ? data.translatedText : text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      // Translate message before sending if needed
      let translatedContent = content
      let isTranslated = false
      
      if (autoTranslate && theirLanguage !== myLanguage) {
        translatedContent = await translateMessage(content, myLanguage, theirLanguage)
        isTranslated = true
      }

      const response = await fetch('/api/social/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId: friend.id,
          content: translatedContent,
          originalContent: isTranslated ? content : undefined,
          originalLang: isTranslated ? myLanguage : undefined,
          translated: isTranslated
        })
      })

      const data = await response.json()
      
      if (data.success && data.message) {
        const msg: TranslatedMessage = {
          ...data.message,
          translatedContent: isTranslated ? translatedContent : undefined,
          showOriginal: false
        }
        setMessages(prev => [...prev, msg])
        
        if (socketRef.current?.connected) {
          socketRef.current.emit('send-message', {
            message: data.message,
            toUserId: friend.id
          })
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleTyping = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { userId, toUserId: friend.id, isTyping: true })
      setTimeout(() => {
        socketRef.current?.emit('typing', { userId, toUserId: friend.id, isTyping: false })
      }, 2000)
    }
  }

  const toggleShowOriginal = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, showOriginal: !msg.showOriginal }
        : msg
    ))
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const retranslateMessage = async (messageId: string) => {
    const msg = messages.find(m => m.id === messageId)
    if (!msg || !msg.originalContent) return
    
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, translationLoading: true } : m
    ))
    
    const newTranslation = await translateMessage(msg.originalContent, myLanguage, theirLanguage)
    
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, content: newTranslation, translationLoading: false }
        : m
    ))
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const myLang = SUPPORTED_LANGUAGES[myLanguage]
  const theirLang = SUPPORTED_LANGUAGES[theirLanguage]

  return (
    <div className={cn('flex flex-col h-full bg-slate-900', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700 bg-slate-800/50">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={friend.avatar} />
            <AvatarFallback className="bg-purple-600">
              {friend.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800',
            friend.isOnline ? 'bg-green-500' : 'bg-slate-500'
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{friend.name}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {isConnected ? (
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-green-400" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-red-400" />
                Disconnected
              </span>
            )}
            <span>•</span>
            <span className="text-cyan-400">KR: {friend.knowledgeRating}</span>
          </div>
        </div>

        {/* Language Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowLanguageSettings(!showLanguageSettings)}
          className={cn(showLanguageSettings && 'text-purple-400')}
        >
          <Languages className="w-5 h-5" />
        </Button>
      </div>

      {/* Language Settings Panel */}
      {showLanguageSettings && (
        <div className="p-3 border-b border-slate-700 bg-slate-800/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">Translation Settings</span>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-slate-300">Auto-translate</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {/* My Language Selector */}
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">You speak</label>
              <select
                value={myLanguage}
                onChange={(e) => setMyLanguage(e.target.value as LanguageCode)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              >
                {allLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Arrow */}
            <div className="flex items-end pb-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Their Language Selector */}
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">{friend.name} speaks</label>
              <select
                value={theirLanguage}
                onChange={(e) => setTheirLanguage(e.target.value as LanguageCode)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                {allLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Pair Display */}
          {autoTranslate && myLanguage !== theirLanguage && (
            <div className="mt-3 p-2 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-purple-300">Your message in {myLang?.nativeName}</span>
                <span className="text-slate-500">→</span>
                <span className="text-cyan-300">Delivered in {theirLang?.nativeName}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Say hello to {friend.name}!</p>
              {autoTranslate && myLanguage !== theirLanguage && (
                <p className="text-xs mt-2 text-purple-400">
                  Messages will be automatically translated between {myLang?.nativeName} and {theirLang?.nativeName}
                </p>
              )}
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === userId
              return (
                <div
                  key={message.id}
                  className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn('max-w-[80%]')}>
                    {/* Main message bubble */}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2',
                        isOwn 
                          ? 'bg-purple-600 text-white rounded-br-md' 
                          : 'bg-slate-800 text-white rounded-bl-md'
                      )}
                    >
                      {/* Translated content */}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.showOriginal && message.originalContent 
                          ? message.originalContent 
                          : message.content}
                      </p>
                      
                      {/* Translation indicator */}
                      {message.translated && message.originalContent && (
                        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-white/10">
                          <span className="text-xs opacity-70">
                            {isOwn ? (
                              <>Translated from {myLang?.nativeName}</>
                            ) : (
                              <>Translated from {theirLang?.nativeName}</>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message actions */}
                    {(message.translated || message.originalContent) && (
                      <div className="flex items-center gap-2 mt-1 px-1">
                        {/* Show original toggle */}
                        {message.originalContent && (
                          <button
                            onClick={() => toggleShowOriginal(message.id)}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-purple-400 transition-colors"
                          >
                            {message.showOriginal ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Show translated</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Show original</span>
                              </>
                            )}
                          </button>
                        )}
                        
                        {/* Copy button */}
                        <button
                          onClick={() => copyToClipboard(
                            message.showOriginal && message.originalContent 
                              ? message.originalContent 
                              : message.content,
                            message.id
                          )}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className={cn(
                      'text-xs mt-1 px-1',
                      isOwn ? 'text-right text-purple-300' : 'text-left text-slate-500'
                    )}>
                      {formatTime(message.createdAt)}
                      {isOwn && (
                        <span className="ml-1">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-700 bg-slate-800/50">
        {/* Language indicator */}
        {autoTranslate && myLanguage !== theirLanguage && (
          <div className="mb-2 flex items-center justify-center">
            <LanguagePairDisplay 
              myLanguage={myLanguage} 
              theirLanguage={theirLanguage}
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            placeholder={
              autoTranslate && myLanguage !== theirLanguage
                ? `Type in ${myLang?.nativeName} (auto-translated to ${theirLang?.nativeName})...`
                : isConnected ? "Type a message..." : "Connecting..."
            }
            disabled={!isConnected || sending}
            className="flex-1 bg-slate-800 border-slate-700 focus:border-purple-500"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !isConnected || sending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

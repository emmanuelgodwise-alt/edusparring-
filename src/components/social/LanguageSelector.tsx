'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, Globe, Search, Check, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SUPPORTED_LANGUAGES,
  getAllLanguages,
  getLanguageFlag,
  getLanguageNativeName,
  type LanguageCode
} from '@/lib/translation'

interface LanguageSelectorProps {
  value: LanguageCode
  onChange: (lang: LanguageCode) => void
  label?: string
  showFlag?: boolean
  showNativeName?: boolean
  disabled?: boolean
  className?: string
  excludeLanguages?: LanguageCode[]
}

export function LanguageSelector({
  value,
  onChange,
  label,
  showFlag = true,
  showNativeName = true,
  disabled = false,
  className,
  excludeLanguages = []
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const allLanguages = getAllLanguages()
  const filteredLanguages = allLanguages.filter(lang => {
    const matchesSearch = !searchQuery || 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    
    const notExcluded = !excludeLanguages.includes(lang.code)
    
    return matchesSearch && notExcluded
  })

  const selectedLang = SUPPORTED_LANGUAGES[value]

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
          'bg-slate-800/50 border-slate-700 hover:border-purple-500/50',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-purple-500'
        )}
      >
        {showFlag && (
          <span className="text-lg">{selectedLang?.flag || '🌐'}</span>
        )}
        <span className="text-sm font-medium text-white">
          {showNativeName 
            ? (selectedLang?.nativeName || value.toUpperCase())
            : (selectedLang?.name || value.toUpperCase())
          }
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 text-slate-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-2 w-72 rounded-xl border shadow-xl',
              'bg-slate-900 border-slate-700'
            )}
          >
            {/* Header */}
            <div className="p-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Languages className="w-4 h-4" />
                <span>{label || 'Select Language'}</span>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search languages..."
                  className="pl-9 bg-slate-800 border-slate-700 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Language List */}
            <ScrollArea className="h-64">
              <div className="p-1">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onChange(lang.code)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                      value === lang.code
                        ? 'bg-purple-600/20 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    )}
                  >
                    <span className="text-xl w-8 text-center">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lang.nativeName}</p>
                      <p className="text-xs text-slate-500 truncate">{lang.name}</p>
                    </div>
                    {value === lang.code && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}

                {filteredLanguages.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No languages found
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-2 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
              <p className="text-xs text-slate-500 text-center">
                {filteredLanguages.length} languages available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact inline language selector for chat
interface InlineLanguageSelectorProps {
  myLanguage: LanguageCode
  theirLanguage: LanguageCode
  onMyLanguageChange: (lang: LanguageCode) => void
  onTheirLanguageChange: (lang: LanguageCode) => void
  className?: string
}

export function InlineLanguageSelector({
  myLanguage,
  theirLanguage,
  onMyLanguageChange,
  onTheirLanguageChange,
  className
}: InlineLanguageSelectorProps) {
  const languages = getAllLanguages()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* My Language */}
      <select
        value={myLanguage}
        onChange={(e) => onMyLanguageChange(e.target.value as LanguageCode)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>

      {/* Arrow */}
      <div className="flex items-center gap-1 text-slate-500">
        <span className="text-lg">→</span>
      </div>

      {/* Their Language */}
      <select
        value={theirLanguage}
        onChange={(e) => onTheirLanguageChange(e.target.value as LanguageCode)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}

// Language pair display for chat header
interface LanguagePairDisplayProps {
  myLanguage: LanguageCode
  theirLanguage: LanguageCode
  className?: string
}

export function LanguagePairDisplay({
  myLanguage,
  theirLanguage,
  className
}: LanguagePairDisplayProps) {
  const myLang = SUPPORTED_LANGUAGES[myLanguage]
  const theirLang = SUPPORTED_LANGUAGES[theirLanguage]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 rounded-lg border border-purple-500/30">
        <span className="text-base">{myLang?.flag || '🌐'}</span>
        <span className="text-xs font-medium text-purple-300">{myLang?.nativeName}</span>
      </div>
      
      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      
      <div className="flex items-center gap-1 px-2 py-1 bg-cyan-600/20 rounded-lg border border-cyan-500/30">
        <span className="text-base">{theirLang?.flag || '🌐'}</span>
        <span className="text-xs font-medium text-cyan-300">{theirLang?.nativeName}</span>
      </div>
    </div>
  )
}

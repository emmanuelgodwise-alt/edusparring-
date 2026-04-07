'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  LANGUAGES, 
  LanguageCode, 
  getLanguageInfo,
  getAllLanguages 
} from '@/lib/i18n';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  showLabel?: boolean;
  compact?: boolean;
}

export function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange,
  showLabel = true,
  compact = false
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = getLanguageInfo(currentLanguage);
  const languages = getAllLanguages();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size={compact ? "icon" : "default"}
        onClick={() => setIsOpen(!isOpen)}
        className={`text-gray-400 hover:text-white hover:bg-white/10 ${compact ? 'p-2' : ''}`}
      >
        <Globe className={`w-5 h-5 ${showLabel ? 'mr-2' : ''}`} />
        {showLabel && (
          <>
            <span className="mr-1">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-2 border-b border-slate-700">
              <p className="text-xs text-gray-400 px-2">Select Language</p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${
                    currentLanguage === lang.code ? 'bg-purple-500/10' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{lang.nativeName}</p>
                    <p className="text-xs text-gray-400">{lang.name}</p>
                  </div>
                  {currentLanguage === lang.code && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  {lang.dir === 'rtl' && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">RTL</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Country Selector Component
interface CountrySelectorProps {
  currentCountry: string;
  onCountryChange: (country: string) => void;
}

export function CountrySelector({ currentCountry, onCountryChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  ];

  const current = countries.find(c => c.code === currentCountry) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white hover:bg-white/10"
      >
        <span className="text-xl mr-2">{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-2 border-b border-slate-700">
              <p className="text-xs text-gray-400 px-2">Select Country</p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onCountryChange(country.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${
                    currentCountry === country.code ? 'bg-purple-500/10' : ''
                  }`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  {currentCountry === country.code && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

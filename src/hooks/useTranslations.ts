'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  loadTranslation, 
  detectBrowserLanguage, 
  LanguageCode, 
  LANGUAGES,
  TranslationStrings,
  DEFAULT_TRANSLATIONS,
  isRTL
} from '@/lib/i18n';

interface UseTranslationsReturn {
  t: TranslationStrings;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  direction: 'rtl' | 'ltr';
  isLoading: boolean;
  translate: (key: string, params?: Record<string, string | number>) => string;
}

export function useTranslations(): UseTranslationsReturn {
  const [translations, setTranslations] = useState<TranslationStrings>(DEFAULT_TRANSLATIONS);
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load translations on mount and language change
  useEffect(() => {
    const initLanguage = async () => {
      // Check localStorage first
      const savedLang = typeof window !== 'undefined' 
        ? localStorage.getItem('edusparring_language') as LanguageCode 
        : null;
      
      // Detect or use saved
      const detectedLang = savedLang && savedLang in LANGUAGES 
        ? savedLang 
        : detectBrowserLanguage();
      
      setLanguageState(detectedLang);
      
      try {
        const loaded = await loadTranslation(detectedLang);
        setTranslations(loaded);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, []);

  // Set language and load translations
  const setLanguage = useCallback(async (lang: LanguageCode) => {
    if (!(lang in LANGUAGES)) return;
    
    setIsLoading(true);
    try {
      const loaded = await loadTranslation(lang);
      setTranslations(loaded);
      setLanguageState(lang);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('edusparring_language', lang);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get nested translation value
  const translate = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if not found
      }
    }
    
    if (typeof value !== 'string') return key;
    
    // Replace parameters
    let result = value;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
    }
    
    return result;
  }, [translations]);

  return {
    t: translations,
    language,
    setLanguage,
    direction: isRTL(language) ? 'rtl' : 'ltr',
    isLoading,
    translate
  };
}

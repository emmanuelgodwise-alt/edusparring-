'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  loadTranslation, 
  detectBrowserLanguage, 
  LanguageCode, 
  LANGUAGES,
  TranslationStrings,
  DEFAULT_TRANSLATIONS,
  isRTL as checkRTL
} from '@/lib/i18n';

interface I18nContextType {
  t: TranslationStrings;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  direction: 'rtl' | 'ltr';
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageCode;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [translations, setTranslations] = useState<TranslationStrings>(DEFAULT_TRANSLATIONS);
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage || 'en');
  const [isLoading, setIsLoading] = useState(true);

  // Load translations on mount
  useEffect(() => {
    const initLanguage = async () => {
      // Check localStorage first
      let detectedLang: LanguageCode = 'en';
      
      if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('edusparring_language') as LanguageCode;
        if (savedLang && savedLang in LANGUAGES) {
          detectedLang = savedLang;
        } else {
          detectedLang = detectBrowserLanguage();
        }
      }
      
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

  // Update document direction when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isRTL = checkRTL(language);
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, [language]);

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

  const value: I18nContextType = {
    t: translations,
    language,
    setLanguage,
    direction: checkRTL(language) ? 'rtl' : 'ltr',
    isLoading
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// HOC for wrapping components with i18n
export function withI18n<P extends object>(Component: React.ComponentType<P & { t: TranslationStrings }>) {
  return function I18nWrappedComponent(props: P) {
    const { t } = useI18n();
    return <Component {...props} t={t} />;
  };
}


import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, ...args: any[]) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey, ...args: any[]): string => {
    const langTranslations = translations[language] || translations.en;
    let translationEntry = langTranslations[key];

    // Fallback to English if key is missing in current language
    if (translationEntry === undefined) {
      translationEntry = translations.en[key];
    }
    
    // If translation entry is still undefined, fallback to the key itself
    if (translationEntry === undefined) {
        console.warn(`Translation key "${String(key)}" not found in language "${language}" or fallback "en".`);
        return String(key);
    }

    if (typeof translationEntry === 'function') {
      return (translationEntry as (...args: any[]) => string)(...args);
    }
    return translationEntry as string;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

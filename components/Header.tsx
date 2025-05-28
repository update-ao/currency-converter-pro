import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-PT' : 'en');
  };

  return (
    <header className="relative w-full py-6">
      {/* Language button - locked to top-right */}
      <div className="absolute right-2 top-2 sm:right-6 sm:top-6 z-10">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-200 hover:bg-slate-300 text-[#1865f2] transition-colors"
          aria-label={language === 'en' ? t('switchToPortuguese') : t('switchToEnglish')}
        >
          {language === 'en' ? 'PT' : 'EN'}
        </button>
      </div>

      {/* Header content - add right padding to prevent overlap */}
      <div className="mx-auto text-center pr-14">
        <h1 className="text-3xl font-bold text-[#1865f2]">
          <span role="img" aria-label="currency exchange icon" className="mr-2">💱</span>
          {t('headerTitle')}
        </h1>
        <p className="text-slate-600 mt-1 text-sm">
          {t('headerSubtitle')}
        </p>
      </div>
    </header>
  );
};

export default Header;
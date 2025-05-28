import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-PT' : 'en');
  };

  return (
    <header className="px-4 py-4 sm:py-6">
      <div className="max-w-xl mx-auto flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1865f2]">
            <span role="img" aria-label="currency exchange icon" className="mr-2">💱</span>
            {t('headerTitle')}
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            {t('headerSubtitle')}
          </p>
        </div>

        {/* Language Button - Now inline, not absolute */}
        <button
          onClick={toggleLanguage}
          className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
          aria-label={language === 'en' ? t('switchToPortuguese') : t('switchToEnglish')}
        >
          🌐 {language === 'en' ? 'EN' : 'PT'}
        </button>
      </div>
    </header>
  );
};

export default Header;
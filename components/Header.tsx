import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-PT' : 'en');
  };

  return (
    <header className="px-4 py-4">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2 sm:gap-0">
          <div className="text-left">
            <h1 className="text-lg font-bold text-[#1865f2]">
              💱 {t('headerTitle')}
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              {t('headerSubtitle')}
            </p>
          </div>
          <button
            onClick={toggleLanguage}
            className="self-end sm:self-auto px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
            aria-label={language === 'en' ? t('switchToPortuguese') : t('switchToEnglish')}
          >
            🌐 {language === 'en' ? 'EN' : 'PT'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
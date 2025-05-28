<header className="px-4 py-4">
  <div className="max-w-xl mx-auto flex justify-between items-center">
    {/* Title Section */}
    <div className="text-left">
      <h1 className="text-lg font-bold text-[#1865f2]">
        💱 {t('headerTitle')}
      </h1>
      <p className="text-slate-600 mt-1 text-sm">
        {t('headerSubtitle')}
      </p>
    </div>

    {/* Language Button */}
    <button
      onClick={toggleLanguage}
      className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
      aria-label={language === 'en' ? t('switchToPortuguese') : t('switchToEnglish')}
    >
      🌐 {language === 'en' ? 'EN' : 'PT'}
    </button>
  </div>
</header>
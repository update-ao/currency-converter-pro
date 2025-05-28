
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const Footer: React.FC = () => {
  const { t } = useLocalization();
  return (
    <footer className="w-full py-6 text-center mt-8">
      <p className="text-sm text-slate-500">
        {t('footerCreatedBy')}
        <a href="https://www.goat.africa" target="_blank" rel="noopener noreferrer" className="text-[#1865f2] hover:underline">
          {t('footerAuthorName')}
        </a>.
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {t('footerDisclaimer')}
      </p>
    </footer>
  );
};

export default Footer;
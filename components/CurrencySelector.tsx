
import React from 'react';
import { GroupedCurrencyOption, CurrencyOption } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface CurrencySelectorProps {
  id: string;
  label: string; // Label will be translated by parent component
  options: GroupedCurrencyOption[]; // Updated to accept grouped options
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  id,
  label,
  options,
  selectedValue,
  onChange,
  disabled = false,
  className = '',
}) => {
  const { t } = useLocalization();
  const isLoading = options.length === 0;

  return (
    <div className={`flex-1 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1865f2] focus:border-[#1865f2] bg-white text-slate-900 transition duration-150 ease-in-out"
      >
        {isLoading && <option value="">{t('loadingCurrenciesDropdown')}</option>}
        {!isLoading && options.map((group) => (
          <optgroup key={group.regionKey} label={t(group.regionKey)}>
            {group.currencies.map((option: CurrencyOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
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
      <label htmlFor={id} className="block text-13px font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        // MODIFICATION: Apply a consistent text size to the select element itself
        // This will affect the selected value displayed in the dropdown.
        // Let's use text-base which is 16px by default, a common size for inputs.
        // If "100" is smaller, you might use 'text-sm' (14px) or 'text-13px' if defined.
        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1865f2] focus:border-[#1865f2] bg-white text-slate-900 transition duration-150 ease-in-out text-base" // Changed to text-base
      >
        {isLoading && <option value="">{t('loadingCurrenciesDropdown')}</option>}
        {!isLoading && options.map((group) => (
          <optgroup
            key={group.regionKey}
            label={t(group.regionKey)}
            // MODIFICATION: Apply bold and a slightly larger font size for the region label
            // A common approach is to make optgroup labels slightly larger than options.
            // Let's try 'text-sm' (14px) for the region label to be subtle but distinct.
            className="font-bold text-sm" // Region label: bold, 14px
          >
            {group.currencies.map((option: CurrencyOption) => (
              <option
                key={option.value}
                value={option.value}
                // MODIFICATION: Apply the target text size (e.g., text-base/16px) to the options
                // This will make the individual currency options match the input.
                // We remove the explicit 'text-xs' as 'text-base' or similar from the parent select
                // might propagate, but it's safer to explicitly set it if needed.
                // However, generally, options inherit from the <select> or are styled by browser.
                // For cross-browser consistency, sometimes you apply classes here,
                // but direct styling of <option> can be tricky.
                // Let's rely on the <select> class for now. If it doesn't work,
                // you might need custom CSS or a different component approach.
              >
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
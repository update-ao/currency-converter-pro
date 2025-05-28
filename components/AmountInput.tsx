
import React from 'react';

interface AmountInputProps {
  id: string;
  label: string;
  value: string; // Use string for input value to handle empty and partial inputs
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty string or valid numbers (including decimals)
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };
  
  return (
    <div className={`flex-1 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type="text" // Use text to better control input, parse to number elsewhere
        id={id}
        inputMode="decimal"
        value={value}
        onChange={handleInputChange}
        placeholder="0.00"
        disabled={disabled}
        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1865f2] focus:border-[#1865f2] bg-white text-slate-900 transition duration-150 ease-in-out"
      />
    </div>
  );
};

export default AmountInput;
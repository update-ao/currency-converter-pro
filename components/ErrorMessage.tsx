
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useLocalization();
  if (!message) return null;

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-md shadow-sm" role="alert">
      <p className="font-bold">{t('errorTitle')}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;

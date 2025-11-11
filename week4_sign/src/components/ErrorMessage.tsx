import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = "오류가 발생했습니다.", 
  onRetry 
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="text-red-500 flex items-center gap-2">
      <FiAlertTriangle />
      <span>{message}</span>
      <button onClick={handleRetry}>
        <FiRefreshCw />
      </button>
    </div>
  );
};

export default ErrorMessage;



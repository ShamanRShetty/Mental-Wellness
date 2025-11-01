import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import clsx from 'clsx';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      textColor: 'text-yellow-800 dark:text-yellow-100',
      iconColor: 'text-yellow-600 dark:text-yellow-300',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div className={clsx('border-l-4 p-4 rounded', bgColor, borderColor)}>
      <div className="flex items-start">
        <Icon className={clsx('mt-0.5 mr-3', iconColor)} size={20} />
        <div className="flex-1">
          {title && <h3 className={clsx('font-semibold mb-1', textColor)}>{title}</h3>}
          <p className={clsx('text-sm', textColor)}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className={clsx('ml-4', textColor, 'hover:opacity-80')}>
            <XCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

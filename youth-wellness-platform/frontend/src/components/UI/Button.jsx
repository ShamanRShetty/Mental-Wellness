import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon,
  ...props 
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: clsx(
      'bg-white text-blue-600 border border-blue-600 hover:bg-blue-100 hover:shadow-md hover:-translate-y-[1px] focus:ring-blue-500',
      'dark:bg-blue-600 dark:text-white dark:border-blue-500 dark:hover:bg-blue-700 dark:hover:border-blue-400'
    ),
    secondary: clsx(
      'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:shadow-md hover:-translate-y-[1px] focus:ring-gray-400',
      'dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-dark-bg'
    ),
    danger: clsx(
      'bg-white text-red-600 border border-red-600 hover:bg-red-100 hover:shadow-md hover:-translate-y-[1px] focus:ring-red-400',
      'dark:bg-red-600 dark:text-white dark:border-red-500 dark:hover:bg-red-700'
    ),
    success: clsx(
      'bg-white text-green-600 border border-green-600 hover:bg-green-100 hover:shadow-md hover:-translate-y-[1px] focus:ring-green-400',
      'dark:bg-green-600 dark:text-white dark:border-green-500 dark:hover:bg-green-700'
    ),
    outline: clsx(
      'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-md hover:-translate-y-[1px] focus:ring-blue-500',
      'dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30'
    ),
    ghost: clsx(
      'bg-transparent text-blue-600 hover:bg-blue-100 hover:shadow-md hover:-translate-y-[1px] focus:ring-blue-400',
      'dark:text-blue-400 dark:hover:bg-blue-900/30'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600 dark:text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

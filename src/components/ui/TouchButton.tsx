'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/format';

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
}

const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
      // Touch-friendly
      'touch-manipulation select-none',
      // Focus styles
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      // Disabled styles
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      // Active/pressed state
      'active:scale-95',
    ];

    // Size variants with touch-friendly minimum sizes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[40px]', // Minimum 40px for touch
      md: 'px-4 py-2.5 text-sm min-h-[44px]', // Minimum 44px for touch
      lg: 'px-6 py-3 text-base min-h-[48px]', // Minimum 48px for touch
      xl: 'px-8 py-4 text-lg min-h-[52px]', // Minimum 52px for touch
    };

    // Color variants
    const variantClasses = {
      primary: [
        'bg-primary-600 text-white shadow-sm',
        'hover:bg-primary-700 focus:ring-primary-500',
        'active:bg-primary-800',
      ].join(' '),
      secondary: [
        'bg-gray-600 text-white shadow-sm',
        'hover:bg-gray-700 focus:ring-gray-500',
        'active:bg-gray-800',
      ].join(' '),
      outline: [
        'border border-gray-300 bg-white text-gray-700 shadow-sm',
        'hover:bg-gray-50 focus:ring-primary-500',
        'active:bg-gray-100',
      ].join(' '),
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 focus:ring-gray-500',
        'active:bg-gray-200',
      ].join(' '),
      danger: [
        'bg-red-600 text-white shadow-sm',
        'hover:bg-red-700 focus:ring-red-500',
        'active:bg-red-800',
      ].join(' '),
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          widthClass,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';

export default TouchButton;
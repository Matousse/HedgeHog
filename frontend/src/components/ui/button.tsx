import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-colors duration-300 rounded-lg focus:outline-none',
        {
          // Variants
          'bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-600 hover:via-blue-700 hover:to-violet-700 text-white': variant === 'primary',
          'bg-gradient-to-r from-blue-500 via-purple-600 to-violet-600 hover:from-blue-600 hover:via-purple-700 hover:to-violet-700 text-white': variant === 'secondary',
          'bg-slate-800 text-white hover:bg-slate-700': variant === 'default',
          'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800': variant === 'outline',
          'bg-transparent hover:bg-gray-100 text-gray-800': variant === 'ghost',
        },
        // Sizes
        {
          'text-xs px-2 py-1': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

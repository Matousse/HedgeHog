import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={clsx(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white text-sm',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500',
          'placeholder:text-gray-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        style={{ paddingLeft: '16px !important', paddingRight: '16px !important', paddingTop: '8px !important', paddingBottom: '8px !important' }}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', id, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-muted select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={twMerge(
              clsx(
                'glass-input w-full text-sm font-medium py-3 px-4',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-danger/60 focus:border-danger/80 focus:ring-danger/20'
              ),
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-muted pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <span className="text-xs font-medium text-danger animate-fade-in" data-testid="error-message">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-muted">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

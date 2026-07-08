'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, error, helperText, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-muted select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={twMerge(
            clsx(
              'glass-input w-full text-sm font-medium min-h-[100px] resize-y py-3 px-4',
              error && 'border-danger/60 focus:border-danger/80 focus:ring-danger/20'
            ),
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

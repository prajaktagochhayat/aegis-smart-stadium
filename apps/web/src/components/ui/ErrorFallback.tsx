'use client';

import React from 'react';
import { Button } from './Button';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface ErrorFallbackProps {
  title?: string;
  description: string;
  errorCode?: string;
  onRetry?: () => void;
  onSupport?: () => void;
  className?: string;
}

export function ErrorFallback({
  title = 'System Error Encountered',
  description,
  errorCode = 'ERR_SYSTEM_UNEXPECTED',
  onRetry,
  onSupport,
  className,
}: ErrorFallbackProps) {
  return (
    <div
      className={twMerge(
        'glass-panel p-6 flex flex-col gap-5 border-danger/20 max-w-sm w-full mx-auto',
        className
      )}
    >
      <div className="flex gap-3 items-start">
        {/* Warning Indicator */}
        <div className="p-2.5 bg-danger/10 text-danger rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        
        {/* Error Descriptions */}
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold tracking-tight text-foreground">
            {title}
          </h4>
          <p className="text-xs text-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="bg-foreground/[0.03] border border-card-border/30 rounded-lg p-2.5 font-mono text-[10px] text-muted flex justify-between items-center select-all">
        <span>Diagnostics:</span>
        <span className="font-semibold text-foreground/80">{errorCode}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full mt-1">
        {onRetry && (
          <Button
            variant="danger"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="flex-1"
          >
            Retry
          </Button>
        )}
        {onSupport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSupport}
            leftIcon={<ShieldAlert className="w-4 h-4" />}
            className="flex-1"
          >
            Support
          </Button>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Button } from './Button';
import { HelpCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = <HelpCircle className="w-12 h-12 text-muted" />,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center p-8 text-center gap-4 rounded-xl border border-dashed border-card-border bg-foreground/[0.01]',
        className
      )}
    >
      {/* Icon Area */}
      <div className="p-3 bg-foreground/[0.03] rounded-2xl flex items-center justify-center">
        {icon}
      </div>

      {/* Text Area */}
      <div className="flex flex-col gap-1.5 max-w-xs">
        <h4 className="text-base font-bold tracking-tight text-foreground">
          {title}
        </h4>
        <p className="text-xs text-muted leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-1">
          {actionText}
        </Button>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-foreground/10 animate-pulse shrink-0',
          variant === 'circle' && 'rounded-full',
          variant === 'rect' && 'rounded-lg',
          variant === 'text' && 'h-4 w-full rounded'
        ),
        className
      )}
      {...props}
    />
  );
}

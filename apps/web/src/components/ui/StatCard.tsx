'use client';

import React from 'react';
import { Card, CardContent } from './Card';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  aiSummary?: string;
  className?: string;
  children?: React.ReactNode; // For mini-visualizations or charts
}

export function StatCard({ title, value, icon, trend, aiSummary, className, children }: StatCardProps) {
  const trendColor = trend
    ? trend.direction === 'up'
      ? 'text-success'
      : trend.direction === 'down'
      ? 'text-danger'
      : 'text-muted'
    : '';

  const TrendIcon = trend
    ? trend.direction === 'up'
      ? TrendingUp
      : trend.direction === 'down'
      ? TrendingDown
      : Minus
    : null;

  return (
    <Card className={twMerge('relative overflow-hidden flex flex-col', className)}>
      <CardContent className="pt-6 flex flex-col h-full gap-4">
        {/* Header containing title & icon */}
        <div className="flex justify-between items-start w-full">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted select-none">
            {title}
          </span>
          {icon && <span className="text-primary shrink-0">{icon}</span>}
        </div>

        {/* Value and Trend */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </h2>
          {trend && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {TrendIcon && <TrendIcon className={clsx('w-4 h-4', trendColor)} />}
              <span className={clsx(trendColor)}>{trend.value}</span>
              {trend.label && <span className="text-muted">{trend.label}</span>}
            </div>
          )}
        </div>

        {/* Mini Chart / Custom Content */}
        {children && <div className="w-full mt-1">{children}</div>}

        {/* AI Insight banner if present */}
        {aiSummary && (
          <div className="mt-auto pt-3 border-t border-card-border/40 flex gap-2 items-start text-xs font-medium text-primary">
            <Sparkles className="w-4 h-4 shrink-0 text-secondary animate-pulse" />
            <p className="leading-normal italic">{aiSummary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

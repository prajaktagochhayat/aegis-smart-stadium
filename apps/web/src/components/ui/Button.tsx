'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      magnetic = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref || internalRef) as React.RefObject<HTMLButtonElement | null>;

    // State for magnetic offset translations
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || disabled || isLoading || typeof window === 'undefined') return;
      
      // Don't apply magnetic effect on touch devices
      if (window.matchMedia('(hover: none)').matches) return;

      const btn = resolvedRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Translate button up to 8px in the direction of the cursor
      setOffset({ x: x * 0.15, y: y * 0.15 });
    };

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 });
    };

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-[0_4px_20px_0_rgba(10,92,255,0.25)]',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-[0_4px_20px_0_rgba(124,58,237,0.25)]',
      outline: 'border border-card-border bg-transparent text-foreground hover:bg-foreground/5',
      ghost: 'bg-transparent text-foreground hover:bg-foreground/5',
      danger: 'bg-danger text-white hover:bg-danger/90 shadow-[0_4px_20px_0_rgba(239,68,68,0.25)]',
      success: 'bg-success text-white hover:bg-success/90 shadow-[0_4px_20px_0_rgba(16,185,129,0.25)]',
      glass: 'glass-panel text-foreground hover:bg-foreground/10',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
    };

    return (
      <motion.button
        ref={resolvedRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: offset.x, y: offset.y }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" data-testid="loader" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

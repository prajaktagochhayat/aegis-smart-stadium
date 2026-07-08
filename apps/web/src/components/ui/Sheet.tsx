'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  side = 'right',
  children,
  footer,
  className,
}: SheetProps) {
  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Framer Motion variant configuration based on anchor side
  const sheetVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      style: 'left-0 top-0 bottom-0 h-full w-full max-w-sm border-r',
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      style: 'right-0 top-0 bottom-0 h-full w-full max-w-sm border-l',
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
      style: 'top-0 left-0 right-0 w-full max-h-[80vh] border-b',
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      style: 'bottom-0 left-0 right-0 w-full max-h-[80vh] border-t',
    },
  };

  const selectedSide = sheetVariants[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-md cursor-pointer"
          />

          {/* Drawer Content */}
          <motion.div
            initial={selectedSide.initial}
            animate={selectedSide.animate}
            exit={selectedSide.exit}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            aria-describedby={description ? "sheet-desc" : undefined}
            className={twMerge(
              'fixed flex flex-col bg-background/90 backdrop-blur-lg border-card-border/60 shadow-2xl overflow-hidden',
              selectedSide.style,
              className
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-card-border/40 gap-4">
              <div className="flex flex-col gap-1">
                <h3 id="sheet-title" className="text-lg font-bold tracking-tight text-foreground">
                  {title}
                </h3>
                {description && (
                  <p id="sheet-desc" className="text-sm text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="text-muted hover:text-foreground transition-colors p-1.5 hover:bg-foreground/5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 p-6 overflow-y-auto text-sm text-foreground/90 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex justify-end gap-3 p-6 border-t border-card-border/40 bg-foreground/[0.02]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

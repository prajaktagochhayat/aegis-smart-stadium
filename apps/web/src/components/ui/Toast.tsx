'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Bell, X } from 'lucide-react';
import { useToast, ToastItem, ToastType } from '@/hooks/useToast';
import { clsx } from 'clsx';

function getToastStyles(type: ToastType) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-success/15 border-success/30 text-success-foreground',
        icon: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
        accent: 'bg-success',
      };
    case 'warning':
      return {
        bg: 'bg-warning/15 border-warning/30 text-warning-foreground',
        icon: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
        accent: 'bg-warning',
      };
    case 'error':
      return {
        bg: 'bg-danger/15 border-danger/30 text-danger-foreground',
        icon: <XCircle className="w-5 h-5 text-danger shrink-0" />,
        accent: 'bg-danger',
      };
    case 'ai_insight':
      return {
        bg: 'bg-secondary/15 border-secondary/30 text-secondary-foreground',
        icon: <Sparkles className="w-5 h-5 text-secondary shrink-0 animate-pulse" />,
        accent: 'bg-secondary',
      };
    case 'live_event':
    default:
      return {
        bg: 'bg-accent/15 border-accent/30 text-accent-foreground',
        icon: <Bell className="w-5 h-5 text-accent shrink-0" />,
        accent: 'bg-accent',
      };
  }
}

export function Toast({ item }: { item: ToastItem }) {
  const removeToast = useToast((state) => state.removeToast);
  const styles = getToastStyles(item.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      role="alert"
      className={clsx(
        'relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg w-full max-w-sm overflow-hidden select-none',
        styles.bg
      )}
    >
      {/* Decorative vertical indicator bar */}
      <div className={clsx('absolute left-0 top-0 bottom-0 w-1', styles.accent)} />

      {/* Type Icon */}
      {styles.icon}

      {/* Text Context */}
      <div className="flex-1 flex flex-col gap-0.5 text-xs text-foreground/90">
        <h4 className="font-bold text-sm tracking-tight text-foreground">
          {item.title}
        </h4>
        {item.description && (
          <p className="leading-relaxed font-medium mt-0.5">
            {item.description}
          </p>
        )}
      </div>

      {/* Manual Close Button */}
      <button
        onClick={() => removeToast(item.id)}
        className="text-muted hover:text-foreground transition-colors p-0.5 rounded hover:bg-foreground/5 cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToast((state) => state.toasts);

  return (
    <div className="fixed bottom-0 right-0 z-[9999] flex flex-col gap-3 p-4 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast item={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

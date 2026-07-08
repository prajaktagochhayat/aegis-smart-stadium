'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'warning' | 'error' | 'ai_insight' | 'live_event';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // duration in ms
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `toast-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newItem],
    }));

    // Auto-remove toast after duration (defaults to 5000ms)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

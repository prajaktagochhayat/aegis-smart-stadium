'use client';

import { create } from 'zustand';
import { User, UserRole } from '@aegis/types';
import { supabase, mockAuth, useMockAuth } from '@/lib/supabase';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => () => void;
  signIn: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  signUp: (
    email: string,
    password?: string,
    role?: UserRole,
    displayName?: string,
    phoneNumber?: string
  ) => Promise<boolean>;
  sendOtp: (email: string, phoneNumber: string) => Promise<string | null>; // Returns mock OTP if success, or null
  verifyOtp: (email: string, phoneNumber: string, otp: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<boolean>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  initialize: () => {
    set({ isLoading: true });

    if (useMockAuth()) {
      // Subscribe to MockAuth updates
      const unsubscribe = mockAuth.subscribe((mockUser) => {
        if (mockUser) {
          document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=86400; SameSite=Strict`;
        } else {
          document.cookie = 'aegis-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: mockUser, isLoading: false });
      });
      return unsubscribe;
    } else {
      // Subscribe to Supabase Auth updates
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // Map Supabase user metadata to User interface
            const mappedUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              displayName: session.user.user_metadata.display_name || session.user.email?.split('@')[0] || 'User',
              phoneNumber: session.user.user_metadata.phone_number || '',
              role: (session.user.user_metadata.role as UserRole) || 'Fan',
              preferredLanguage: session.user.user_metadata.preferred_language || 'English',
              theme: session.user.user_metadata.theme || 'system',
              timezone: session.user.user_metadata.timezone || 'UTC',
              createdAt: session.user.created_at,
              updatedAt: session.user.updated_at || session.user.created_at,
            };
            document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(mappedUser))}; path=/; max-age=86400; SameSite=Strict`;
            set({ user: mappedUser, isLoading: false });
          } else {
            document.cookie = 'aegis-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            set({ user: null, isLoading: false });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  },

  signIn: async (email, password, role = 'Fan') => {
    set({ isLoading: true, error: null });
    try {
      if (useMockAuth()) {
        const { user, error } = await mockAuth.signIn(email, role);
        if (error) throw error;
        if (user) {
          document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Strict`;
        }
        set({ user, isLoading: false });
        return true;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || '',
        });
        if (error) throw error;
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  signUp: async (email, password, role = 'Fan', displayName, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      if (useMockAuth()) {
        const { user, error } = await mockAuth.signUp(email, role, displayName, phoneNumber);
        if (error) throw error;
        if (user) {
          document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Strict`;
        }
        set({ user, isLoading: false });
        return true;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || '',
          options: {
            data: {
              role,
              display_name: displayName || email.split('@')[0],
              phone_number: phoneNumber,
              preferred_language: 'English',
              theme: 'system',
            },
          },
        });
        if (error) throw error;
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  sendOtp: async (email, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      if (useMockAuth()) {
        const { success, otp, error } = await mockAuth.sendOtp(email, phoneNumber);
        if (error) throw error;
        set({ isLoading: false });
        return otp || 'SUCCESS';
      } else {
        // Live Supabase OTP dispatch via magic link or SMS
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        });
        if (error) throw error;
        set({ isLoading: false });
        return 'LIVE_OTP_SENT';
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to dispatch verification code', isLoading: false });
      return null;
    }
  },

  verifyOtp: async (email, phoneNumber, otp) => {
    set({ isLoading: true, error: null });
    try {
      if (useMockAuth()) {
        const { user, error } = await mockAuth.verifyOtp(email, phoneNumber, otp);
        if (error) throw error;
        if (user) {
          document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Strict`;
        }
        set({ user, isLoading: false });
        return true;
      } else {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        });
        if (error) throw error;
        set({ isLoading: false });
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || 'Verification code check failed', isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    document.cookie = 'aegis-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    if (useMockAuth()) {
      await mockAuth.signOut();
    } else {
      await supabase.auth.signOut();
    }
    set({ user: null, isLoading: false });
  },

  updateProfile: async (profileUpdates) => {
    const { user } = get();
    if (!user) return false;

    set({ isLoading: true, error: null });
    try {
      const updatedUser = { ...user, ...profileUpdates, updatedAt: new Date().toISOString() };
      
      if (useMockAuth()) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('aegis-mock-user', JSON.stringify(updatedUser));
          document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=86400; SameSite=Strict`;
        }
        set({ user: updatedUser, isLoading: false });
        return true;
      } else {
        const { error } = await supabase.auth.updateUser({
          data: {
            display_name: profileUpdates.displayName,
            preferred_language: profileUpdates.preferredLanguage,
            theme: profileUpdates.theme,
            timezone: profileUpdates.timezone,
          },
        });
        if (error) throw error;
        document.cookie = `aegis-user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=86400; SameSite=Strict`;
        set({ user: updatedUser, isLoading: false });
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || 'Profile update failed', isLoading: false });
      return false;
    }
  },
}));

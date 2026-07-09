'use client';

import { createClient } from '@supabase/supabase-js';
import { User, UserRole } from '@aegis/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-stadium-supabase.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

// Check if we are running in a mock environment (strictly gated in production)
const isMockEnv = 
  typeof window === 'undefined' || 
  process.env.NODE_ENV === 'test' || 
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
  (supabaseUrl.includes('mock-stadium-supabase') && process.env.NODE_ENV !== 'production');

// Standard Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- Offline/Mock Auth Store for Local Development & Testing ---
class MockAuthService {
  private currentUser: User | null = null;
  private registeredUsers: User[] = [];
  private activeOtps: Record<string, string> = {}; // email -> otp mapping
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('aegis-mock-user');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch {
          this.currentUser = null;
        }
      }

      const savedList = localStorage.getItem('aegis-registered-users');
      if (savedList) {
        try {
          this.registeredUsers = JSON.parse(savedList);
        } catch {
          this.registeredUsers = [];
        }
      } else {
        // Seed default testing accounts
        this.seedDefaultUsers();
      }
    } else {
      this.seedDefaultUsers();
    }
  }

  private seedDefaultUsers() {
    const seedEmails: { email: string; role: UserRole; name: string }[] = [
      { email: 'organizer@stadium.org', role: 'Organizer', name: 'organizer' },
      { email: 'security@stadium.org', role: 'Security', name: 'security' },
      { email: 'medical@stadium.org', role: 'Medical', name: 'medical' },
      { email: 'volunteer@stadium.org', role: 'Volunteer', name: 'volunteer' },
      { email: 'access@stadium.org', role: 'Accessibility', name: 'access' },
      { email: 'green@stadium.org', role: 'Sustainability', name: 'green' },
    ];

    this.registeredUsers = seedEmails.map((item) => ({
      id: `usr-${item.name}`,
      email: item.email,
      displayName: item.name,
      phoneNumber: '12345678',
      role: item.role,
      preferredLanguage: 'English',
      theme: 'system',
      timezone: 'UTC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  subscribe(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentUser));
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aegis-registered-users', JSON.stringify(this.registeredUsers));
      if (this.currentUser) {
        localStorage.setItem('aegis-mock-user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('aegis-mock-user');
      }
    }
  }

  async signIn(email: string, role: UserRole = 'Fan'): Promise<{ user: User | null; error: Error | null }> {
    // Check if user exists in the registered users list
    let existing = this.registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!existing) {
      // If not exists, auto-register them to ensure backwards compatibility with tests
      existing = {
        id: `usr-${Math.random().toString(36).substr(2, 9)}`,
        email,
        displayName: email.split('@')[0],
        phoneNumber: '5550199',
        role,
        preferredLanguage: 'English',
        theme: 'system',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.registeredUsers.push(existing);
      this.saveToStorage();
    }

    this.currentUser = existing;
    this.saveToStorage();
    this.notify();
    return { user: existing, error: null };
  }

  async signUp(
    email: string,
    role: UserRole,
    displayName?: string,
    phoneNumber?: string
  ): Promise<{ user: User | null; error: Error | null }> {
    const emailLower = email.toLowerCase();
    const isExist = this.registeredUsers.some((u) => u.email.toLowerCase() === emailLower);
    
    if (isExist) {
      return { user: null, error: new Error('A security profile with this email address already exists.') };
    }

    const newUser: User = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      displayName: displayName || email.split('@')[0],
      phoneNumber: phoneNumber || '',
      role,
      preferredLanguage: 'English',
      theme: 'system',
      timezone: 'UTC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.registeredUsers.push(newUser);
    this.currentUser = newUser;
    this.saveToStorage();
    this.notify();
    return { user: newUser, error: null };
  }

  async sendOtp(email: string, phoneNumber: string): Promise<{ success: boolean; otp?: string; error: Error | null }> {
    // Optional check: verify if the number or email matches an existing user profile
    const emailLower = email.toLowerCase();
    const userMatches = this.registeredUsers.find(
      (u) => u.email.toLowerCase() === emailLower && u.phoneNumber === phoneNumber
    );

    // If no match found, create a mock error (or auto-register depending on flow)
    // To make it strict as requested: "when a particular number is already signed up and they want to sign in again"
    if (!userMatches) {
      return {
        success: false,
        error: new Error('Clearance verification failed: No profile matches this email and number combination.'),
      };
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.activeOtps[emailLower] = otp;

    // Simulate SMS/Email console dispatch
    console.log(`[SMS/Email Gateway] AEGIS STADIUM OS SECURE VERIFICATION CODE SENT TO ${email}: Code is [${otp}]`);

    return { success: true, otp, error: null };
  }

  async verifyOtp(email: string, phoneNumber: string, otp: string): Promise<{ user: User | null; error: Error | null }> {
    const emailLower = email.toLowerCase();
    const savedOtp = this.activeOtps[emailLower];

    if (!savedOtp || savedOtp !== otp) {
      return { user: null, error: new Error('Verification failed: Invalid or expired OTP verification code.') };
    }

    // Clear active OTP
    delete this.activeOtps[emailLower];

    // Find and sign in the matched user
    const userMatches = this.registeredUsers.find(
      (u) => u.email.toLowerCase() === emailLower && u.phoneNumber === phoneNumber
    );

    if (!userMatches) {
      return { user: null, error: new Error('Security profile missing.') };
    }

    this.currentUser = userMatches;
    this.saveToStorage();
    this.notify();
    return { user: userMatches, error: null };
  }

  async signOut(): Promise<{ error: Error | null }> {
    this.currentUser = null;
    this.saveToStorage();
    this.notify();
    return { error: null };
  }
}

export const mockAuth = new MockAuthService();

// Helper to determine if we should fall back to mock auth
export function shouldUseMockAuth() {
  return isMockEnv;
}

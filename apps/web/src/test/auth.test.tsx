import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { MfaVerify } from '../components/auth/MfaVerify';
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

// Mock browser global document cookie
let mockCookies = '';
Object.defineProperty(document, 'cookie', {
  get() {
    return mockCookies;
  },
  set(val) {
    mockCookies = val;
  },
  configurable: true,
});

describe('Authentication & Authorization Tests', () => {
  beforeEach(() => {
    mockCookies = '';
    // Reset Zustand store state manually
    useAuth.setState({ user: null, error: null, isLoading: false });
  });

  // --- useAuth Hook ---
  describe('useAuth Hook State Management', () => {
    it('should initialize with null user and isLoading true or false depending on action', async () => {
      const state = useAuth.getState();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should authorize user on signIn and set local state', async () => {
      const signInSuccess = await useAuth.getState().signIn('test@stadium.org', 'Pass12345!@#$', 'Organizer');
      expect(signInSuccess).toBe(true);
      expect(useAuth.getState().user?.email).toBe('test@stadium.org');
      expect(useAuth.getState().user?.role).toBe('Organizer');
    });
  });

  // --- SignInForm Validation ---
  describe('SignInForm Validation & Submission', () => {
    it('should fail validation with invalid email format', async () => {
      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      
      const form = emailInput.closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });
  });

  // --- SignUpForm Strict Password Policy ---
  describe('SignUpForm Strict Password Policy Rules', () => {
    it('should display error if password does not meet complexity requirements', async () => {
      render(<SignUpForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'user@stadium.org' } });
      // Input password lacking uppercase, special character, and short length (less than 12)
      fireEvent.change(screen.getByLabelText(/^security password/i), { target: { value: 'short' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
      
      const form = emailInput.closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 12 characters long/i)).toBeInTheDocument();
      });
    });

    it('should display error if passwords do not match', async () => {
      render(<SignUpForm />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'user@stadium.org' } });
      fireEvent.change(screen.getByLabelText(/^security password/i), { target: { value: 'Pass123456789!@' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'DifferentPass12!' } });
      
      const form = emailInput.closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  // --- MFA Code Input ---
  describe('MfaVerify Code Validation', () => {
    it('should show error message for invalid characters', async () => {
      render(<MfaVerify />);
      
      const input = screen.getByPlaceholderText('000000');
      fireEvent.change(input, { target: { value: 'abc' } }); // Non-digits should be stripped
      expect(input).toHaveValue('');

      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.click(screen.getByRole('button', { name: /verify code/i }));
      
      expect(screen.getByTestId('error-message')).toHaveTextContent(/please enter a valid 6-digit numerical code/i);
    });
  });

  // --- RBAC Middleware ---
  describe('Router Middleware Role-Based Redirections', () => {
    it('should redirect unauthenticated users visiting /organizer to /login', () => {
      const mockRequest = new NextRequest('http://localhost/organizer');
      const response = middleware(mockRequest);
      
      expect(response).toBeDefined();
      expect(response?.headers.get('location')).toContain('/login');
    });

    it('should allow Organizer role to access /organizer', () => {
      const userObj = { email: 'test@stadium.org', role: 'Organizer' };
      const mockRequest = new NextRequest('http://localhost/organizer', {
        headers: {
          cookie: `aegis-user=${encodeURIComponent(JSON.stringify(userObj))}`,
        },
      });
      
      const response = middleware(mockRequest);
      // If allowed, Next.js middleware returns a NextFetchEvent chain / status 200 without redirect headers
      expect(response?.headers.get('location')).toBeNull();
    });

    it('should redirect Fan role trying to access /organizer to /unauthorized', () => {
      const userObj = { email: 'fan@stadium.org', role: 'Fan' };
      const mockRequest = new NextRequest('http://localhost/organizer', {
        headers: {
          cookie: `aegis-user=${encodeURIComponent(JSON.stringify(userObj))}`,
        },
      });
      
      const response = middleware(mockRequest);
      expect(response?.headers.get('location')).toContain('/unauthorized');
    });
  });
});

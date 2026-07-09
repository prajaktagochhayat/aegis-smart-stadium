import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import HomePage from '../app/page';
import { useAuth } from '../hooks/useAuth';
import { mockAuth } from '../lib/supabase';

// Mock ThemeProvider context hooks
vi.mock('@/components/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    isDark: false,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ResizeObserver for jsdom WebGL canvas measurements
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock matchMedia for window
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Dashboard Role-Based Clearance Tests', () => {
  beforeEach(async () => {
    await mockAuth.signOut();
    useAuth.setState({ user: null, error: null, isLoading: false });
  });

  it('should render WelcomeHub and open SignInForm on Clearance Login click if user is unauthenticated', () => {
    render(<HomePage />);
    expect(screen.getByText('Launch Workspace')).toBeInTheDocument();

    const loginBtn = screen.getByText('Login');
    fireEvent.click(loginBtn);

    expect(screen.getByText('Access Command Center')).toBeInTheDocument();
  });

  it('should render OrganizerDashboard when user is an Organizer', async () => {
    await act(async () => {
      await mockAuth.signIn('organizer@stadium.org', 'Organizer');
    });

    render(<HomePage />);
    
    // Click Launch Workspace
    const launchBtn = screen.getByText('Launch Workspace');
    fireEvent.click(launchBtn);

    expect(await screen.findByText('Venue Governance', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('North Upper Seating', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should render SecurityDashboard when user is Security personnel', async () => {
    await act(async () => {
      await mockAuth.signIn('security@stadium.org', 'Security');
    });

    render(<HomePage />);
    
    // Click Launch Workspace
    const launchBtn = screen.getByText('Launch Workspace');
    fireEvent.click(launchBtn);

    expect(await screen.findByText('Active Threat Incidents', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Live Anomaly Index', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should render MedicalDashboard when user is Medical personnel', async () => {
    await act(async () => {
      await mockAuth.signIn('medical@stadium.org', 'Medical');
    });

    render(<HomePage />);
    
    // Click Launch Workspace
    const launchBtn = screen.getByText('Launch Workspace');
    fireEvent.click(launchBtn);

    expect(await screen.findByText('Active Medical triages', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Field Clinic Occupancy', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should render VolunteerDashboard when user is a Volunteer', async () => {
    await act(async () => {
      await mockAuth.signIn('volunteer@stadium.org', 'Volunteer');
    });

    render(<HomePage />);
    
    // Click Launch Workspace
    const launchBtn = screen.getByText('Launch Workspace');
    fireEvent.click(launchBtn);

    expect(await screen.findByText('My Volunteer Console Tasks', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Tasks Completed', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should render AccessibilityDashboard when user is an Accessibility coordinator', async () => {
    await act(async () => {
      await mockAuth.signIn('access@stadium.org', 'Accessibility');
    });

    render(<HomePage />);
    
    // Click Launch Workspace
    const launchBtn = screen.getByText('Launch Workspace');
    fireEvent.click(launchBtn);

    expect(await screen.findByText('Accessible Parking spaces', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Elevator Health Index', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should render SustainabilityDashboard when user is a Sustainability manager', async () => {
    await act(async () => {
      await mockAuth.signIn('green@stadium.org', 'Sustainability');
    });

    render(<HomePage />);
    
    // Click Launch Workspace
    const launchBtn = screen.getByText('Launch Workspace');
    fireEvent.click(launchBtn);

    expect(await screen.findByText('Sustainability Initiatives Status', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(await screen.findByText('Energy Saved today', {}, { timeout: 3000 })).toBeInTheDocument();
  });
});

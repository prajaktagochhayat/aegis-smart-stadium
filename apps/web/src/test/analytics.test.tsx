import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { OrganizerDashboard } from '../components/dashboard/roles/OrganizerDashboard';

// Mock ResizeObserver for Recharts compatibility in jsdom
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

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

describe('Analytics & Diagnostics Telemetry Tests', () => {
  describe('AnalyticsDashboard Component', () => {
    it('should render visitor throughput and sustainability performance charts', () => {
      render(<AnalyticsDashboard />);
      expect(screen.getByText('Visitor Location Throughput')).toBeInTheDocument();
      expect(screen.getByText('Sustainability Performance')).toBeInTheDocument();
      expect(screen.getByText('North Gate Peak Queue')).toBeInTheDocument();
    });
  });

  describe('SystemHealth Component', () => {
    it('should render diagnostic stats and scrolling terminal', () => {
      render(<SystemHealth />);
      expect(screen.getByText('API Response Latency')).toBeInTheDocument();
      expect(screen.getByText('Live System Diagnostic Terminal')).toBeInTheDocument();
      expect(screen.getByText(/AEGIS System Kernel successfully initialized/)).toBeInTheDocument();
    });
  });

  describe('Organizer Dashboard Sub-Navigation Tabs', () => {
    it('should support switching to analytics charts and diagnostics terminal', () => {
      render(<OrganizerDashboard />);
      
      // Default: Real-Time Telemetry
      expect(screen.getByText('Venue Governance')).toBeInTheDocument();

      // Click Analytics tab
      const analyticsTabBtn = screen.getByRole('button', { name: /analytics charts/i });
      fireEvent.click(analyticsTabBtn);

      expect(screen.getByText('Visitor Location Throughput')).toBeInTheDocument();
      expect(screen.queryByText('Venue Governance')).not.toBeInTheDocument();

      // Click Diagnostics tab
      const diagTabBtn = screen.getByRole('button', { name: /system diagnostics/i });
      fireEvent.click(diagTabBtn);

      expect(screen.getByText('Live System Diagnostic Terminal')).toBeInTheDocument();
      expect(screen.queryByText('Visitor Location Throughput')).not.toBeInTheDocument();
    });
  });
});

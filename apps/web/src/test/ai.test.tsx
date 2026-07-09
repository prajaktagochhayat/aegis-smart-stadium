import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAiCoPilot } from '../hooks/useAiCoPilot';
import { IncidentConsole } from '../components/dashboard/IncidentConsole';
import { useEventStore } from '../hooks/useEventStore';

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

describe('AI Co-Pilot & Incident System Tests', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useEventStore.setState({
      zones: [],
      alerts: [],
      incidents: [
        {
          id: 'inc-99',
          category: 'Medical',
          severity: 4,
          status: 'Reported',
          location: 'Sector B Entrance',
          description: 'Attendee passed out near turnstile.',
          reportTime: new Date().toISOString(),
          assignedTeamIds: [],
        },
      ],
      tasks: [],
      routes: [],
      parkingLots: [],
      isStreaming: false,
    });
  });

  // --- useAiCoPilot Hook ---
  describe('useAiCoPilot Hook', () => {
    it('should initialize with welcome message', () => {
      const { result } = renderHookHelper();
      expect(result.messages).toHaveLength(1);
      expect(result.messages[0].role).toBe('assistant');
    });

    it('should stream incident plan response', async () => {
      const { result } = renderHookHelper();
      
      let finalChunk = '';
      const onChunk = (text: string) => {
        finalChunk = text;
      };
      
      const onDone = vi.fn();
      
      act(() => {
        result.getIncidentRecommendationStream(
          {
            id: 'inc-1',
            category: 'Medical',
            severity: 4,
            status: 'Reported',
            location: 'Sector B',
            description: 'Emergency test',
            reportTime: new Date().toISOString(),
            assignedTeamIds: [],
          },
          onChunk,
          onDone
        );
      });

      // Wait for stream to finish (simulate interval completion)
      await waitFor(() => {
        expect(onDone).toHaveBeenCalled();
      }, { timeout: 5000 });

      expect(finalChunk).toContain('[MEDICAL DISPATCH COMMAND');
    });
  });

  // --- IncidentConsole Panel ---
  describe('IncidentConsole Component', () => {
    it('should render live incidents list', () => {
      render(<IncidentConsole />);
      expect(screen.getAllByText('Medical')[0]).toBeInTheDocument();
      expect(screen.getByText('Attendee passed out near turnstile.')).toBeInTheDocument();
    });

    it('should select incident and support team dispatch', async () => {
      render(<IncidentConsole />);
      
      // Select the medical incident
      fireEvent.click(screen.getByText('Attendee passed out near turnstile.'));
      
      // Detailed panel should now load
      expect(screen.getAllByText('Sector B Entrance')[0]).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /authorize dispatch/i })).toBeInTheDocument();

      // Trigger dispatch action
      fireEvent.click(screen.getByRole('button', { name: /authorize dispatch/i }));

      // Incident status should update in the store
      const incidents = useEventStore.getState().incidents;
      expect(incidents[0].status).toBe('InProgress');
    });

    it('should support resolving incident', async () => {
      render(<IncidentConsole />);
      fireEvent.click(screen.getByText('Attendee passed out near turnstile.'));
      
      // Trigger resolve action
      fireEvent.click(screen.getByRole('button', { name: /resolve threat/i }));

      const incidents = useEventStore.getState().incidents;
      expect(incidents[0].status).toBe('Resolved');
    });
  });
});

// Reusable testing helper for Client hooks
function renderHookHelper() {
  let result: ReturnType<typeof useAiCoPilot> | null = null;
  function TestComponent() {
    result = useAiCoPilot();
    return null;
  }
  render(<TestComponent />);
  return { result: result as ReturnType<typeof useAiCoPilot> };
}

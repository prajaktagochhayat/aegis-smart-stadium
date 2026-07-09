import React from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAiCoPilot, ChatMessage } from '../hooks/useAiCoPilot';
import { UserProfile } from '../components/auth/UserProfile';
import { useAuth } from '../hooks/useAuth';

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

// Mock useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock useTheme
vi.mock('../components/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
    isDark: true,
  }),
}));

describe('AI Co-Pilot sendMessage and UserProfile Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      user: {
        id: 'usr-organizer',
        email: 'organizer@demo.aegis',
        displayName: 'Demo Organizer',
        phoneNumber: '5550199',
        role: 'Organizer',
        preferredLanguage: 'English',
        theme: 'dark',
      },
      updateProfile: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it('should fall back to local templates on fetch errors in sendMessage', async () => {
    // Stub fetch to return 500 error
    const fetchSpy = vi.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Network Error'));

    let resultHook: ReturnType<typeof useAiCoPilot> | null = null;
    function TestComponent() {
      resultHook = useAiCoPilot();
      return null;
    }
    render(<TestComponent />);

    await act(async () => {
      if (resultHook) {
        await resultHook.sendMessage('medical emergency incident');
      }
    });

    expect(fetchSpy).toHaveBeenCalled();
    expect(resultHook).toBeDefined();
    // Wait for fallback streaming interval to complete and verify the streamed content has local template parts
    await waitFor(() => {
      if (resultHook) {
        const assistantMsgs = resultHook.messages.filter((m: ChatMessage) => m.role === 'assistant');
        expect(assistantMsgs.length).toBeGreaterThan(0);
        expect(assistantMsgs[assistantMsgs.length - 1].content).toContain('[AI SECURE MONITOR]');
      }
    }, { timeout: 4000 });
  });

  it('should render UserProfile editor correctly', () => {
    render(<UserProfile />);
    expect(screen.getByText(/profile configuration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toHaveValue('Demo Organizer');
  });

  it('should support updating profile fields', async () => {
    const updateProfileMock = vi.fn().mockResolvedValue({ error: null });
    (useAuth as Mock).mockReturnValue({
      user: {
        id: 'usr-organizer',
        email: 'organizer@demo.aegis',
        displayName: 'Demo Organizer',
        phoneNumber: '5550199',
        role: 'Organizer',
        preferredLanguage: 'English',
        theme: 'dark',
      },
      updateProfile: updateProfileMock,
    });

    render(<UserProfile />);
    const nameInput = screen.getByLabelText(/display name/i);
    fireEvent.change(nameInput, { target: { value: 'New Organizer Name' } });
    expect(nameInput).toHaveValue('New Organizer Name');

    const saveBtn = screen.getByRole('button', { name: /save configuration/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalled();
    });
  });
});

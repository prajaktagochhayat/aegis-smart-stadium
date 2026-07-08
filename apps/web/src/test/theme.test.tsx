import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

// Mock matchMedia for window
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

function ThemeTestComponent() {
  const { theme, setTheme, isDark } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="dark-val">{isDark ? 'dark' : 'light'}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}

describe('ThemeProvider & useTheme', () => {
  it('should render children and provide theme context', () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val').textContent).toBe('light');
    expect(screen.getByTestId('dark-val').textContent).toBe('light');
  });

  it('should update theme when setTheme is called', () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    const darkBtn = screen.getByText('Set Dark');
    fireEvent.click(darkBtn);
    expect(screen.getByTestId('theme-val').textContent).toBe('dark');
  });
});

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StadiumMap3D } from '../components/dashboard/StadiumMap3D';

// Mock the Canvas-containing component because WebGL is not available in jsdom
vi.mock('../components/dashboard/StadiumMap3DCanvas', () => {
  return {
    default: ({ onSelectZone }: { onSelectZone?: (id: string) => void }) => (
      <div data-testid="mock-3d-canvas">
        <button onClick={() => onSelectZone?.('zone-n-gate')}>Select North</button>
      </div>
    ),
  };
});

describe('3D Stadium Map Telemetry Visualizer', () => {
  it('should render the dynamic 3D canvas wrapper', async () => {
    render(<StadiumMap3D />);
    
    // In jsdom testing, next/dynamic triggers the loading state first
    expect(screen.getByText('Initializing WebGL 3D Canvas')).toBeInTheDocument();

    // Resolves dynamically and renders our mocked Canvas component
    const canvasElement = await screen.findByTestId('mock-3d-canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  it('should trigger selection callback on click', async () => {
    const selectSpy = vi.fn();
    render(<StadiumMap3D onSelectZone={selectSpy} />);

    const selectBtn = await screen.findByRole('button', { name: 'Select North' });
    selectBtn.click();

    expect(selectSpy).toHaveBeenCalledWith('zone-n-gate');
  });
});

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Dialog } from '../components/ui/Dialog';
import { Sheet } from '../components/ui/Sheet';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorFallback } from '../components/ui/ErrorFallback';

describe('Core Component Library Tests', () => {
  // --- Button ---
  describe('Button Component', () => {
    it('should render children text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('should render loading spinner when isLoading is true', () => {
      render(<Button isLoading>Click Me</Button>);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should trigger onClick when clicked', () => {
      const clickSpy = vi.fn();
      render(<Button onClick={clickSpy}>Click Me</Button>);
      fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
      expect(clickSpy).toHaveBeenCalledOnce();
    });
  });

  // --- Input ---
  describe('Input Component', () => {
    it('should render label and error message', () => {
      render(<Input label="Username" error="Invalid field" placeholder="Enter text" onChange={() => {}} />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });
  });

  // --- Textarea ---
  describe('Textarea Component', () => {
    it('should render label and area container', () => {
      render(<Textarea label="Bio" placeholder="Tell us about yourself" onChange={() => {}} />);
      expect(screen.getByText('Bio')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
    });
  });

  // --- Card ---
  describe('Card Component', () => {
    it('should render nested header and titles', () => {
      render(
        <Card animate={false}>
          <CardTitle>Match Day #1</CardTitle>
          <div>Card Body</div>
        </Card>
      );
      expect(screen.getByText('Match Day #1')).toBeInTheDocument();
      expect(screen.getByText('Card Body')).toBeInTheDocument();
    });
  });

  // --- StatCard ---
  describe('StatCard Component', () => {
    it('should render metrics and AI insights', () => {
      render(
        <StatCard
          title="Attendance"
          value="82,450"
          trend={{ value: '+5%', direction: 'up', label: 'vs last match' }}
          aiSummary="Peak flow arrived via Metro Gate B."
        />
      );
      expect(screen.getByText('Attendance')).toBeInTheDocument();
      expect(screen.getByText('82,450')).toBeInTheDocument();
      expect(screen.getByText('+5%')).toBeInTheDocument();
      expect(screen.getByText('Peak flow arrived via Metro Gate B.')).toBeInTheDocument();
    });
  });

  // --- Dialog ---
  describe('Dialog Component', () => {
    it('should render modal content when open', () => {
      const closeSpy = vi.fn();
      render(
        <Dialog isOpen onClose={closeSpy} title="Modal Alert">
          <div>Alert details...</div>
        </Dialog>
      );
      expect(screen.getByText('Modal Alert')).toBeInTheDocument();
      expect(screen.getByText('Alert details...')).toBeInTheDocument();
    });
  });

  // --- Sheet ---
  describe('Sheet Component', () => {
    it('should render sidebar drawer when open', () => {
      const closeSpy = vi.fn();
      render(
        <Sheet isOpen onClose={closeSpy} title="Navigation Panel" side="right">
          <div>Links...</div>
        </Sheet>
      );
      expect(screen.getByText('Navigation Panel')).toBeInTheDocument();
      expect(screen.getByText('Links...')).toBeInTheDocument();
    });
  });

  // --- Skeleton ---
  describe('Skeleton Component', () => {
    it('should render with correct pulse classes', () => {
      const { container } = render(<Skeleton variant="circle" className="w-12 h-12" />);
      expect(container.firstChild).toHaveClass('animate-pulse');
      expect(container.firstChild).toHaveClass('rounded-full');
    });
  });

  // --- EmptyState ---
  describe('EmptyState Component', () => {
    it('should render title and description', () => {
      render(<EmptyState title="No Alerts" description="All clear across zones." />);
      expect(screen.getByText('No Alerts')).toBeInTheDocument();
      expect(screen.getByText('All clear across zones.')).toBeInTheDocument();
    });
  });

  // --- ErrorFallback ---
  describe('ErrorFallback Component', () => {
    it('should render diagnostics code and trigger retry', () => {
      const retrySpy = vi.fn();
      render(
        <ErrorFallback
          description="Failed to fetch live queue data."
          errorCode="ERR_QUEUE_TIMEOUT"
          onRetry={retrySpy}
        />
      );
      expect(screen.getByText('Failed to fetch live queue data.')).toBeInTheDocument();
      expect(screen.getByText('ERR_QUEUE_TIMEOUT')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(retrySpy).toHaveBeenCalledOnce();
    });
  });
});

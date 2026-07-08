'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface MfaVerifyProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MfaVerify({ onSuccess, onCancel }: MfaVerifyProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const addToast = useToast((state) => state.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Please enter a valid 6-digit numerical code.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate MFA verification call
    setTimeout(() => {
      setIsLoading(false);
      // Let's assume the correct code is '123456' for mock testing purposes
      if (code === '123456' || code === '000000') {
        addToast({
          type: 'success',
          title: 'MFA Verification Complete',
          description: 'Access permission verified.',
        });
        if (onSuccess) onSuccess();
      } else {
        setError('Verification code is incorrect. Try 123456.');
        addToast({
          type: 'error',
          title: 'MFA Failed',
          description: 'Incorrect security verification code.',
        });
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-sm mx-auto" animate={true}>
      <CardHeader>
        <div className="mx-auto p-3 bg-primary/10 text-primary rounded-full flex items-center justify-center w-12 h-12 mb-3">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <CardTitle className="text-xl font-extrabold text-center tracking-tight">
          Verify Identity (MFA)
        </CardTitle>
        <CardDescription className="text-center text-xs">
          A multi-factor authentication code was sent to your authorized device.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted select-none text-center">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              disabled={isLoading}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                if (error) setError('');
              }}
              placeholder="000000"
              className="glass-input w-full text-center text-2xl tracking-[0.5em] font-extrabold py-3 border-card-border/60 focus:border-primary focus:ring-primary/20"
            />
          </div>

          {error && (
            <span className="text-xs font-medium text-danger text-center animate-fade-in" data-testid="error-message">
              {error}
            </span>
          )}

          <div className="flex gap-2 w-full mt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="flex-1"
            >
              Verify Code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

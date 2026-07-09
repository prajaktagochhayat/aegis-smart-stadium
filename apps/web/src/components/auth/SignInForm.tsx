'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { UserRole } from '@aegis/types';
import { shouldUseMockAuth } from '@/lib/supabase';

const signInSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  devRole: zod.string().optional(),
});

type SignInValues = zod.infer<typeof signInSchema>;

interface SignInFormProps {
  onSuccess?: () => void;
  onNavigateToSignUp?: () => void;
}

export function SignInForm({ onSuccess, onNavigateToSignUp }: SignInFormProps) {
  const { signIn, isLoading, error } = useAuth();
  const addToast = useToast((state) => state.addToast);
  const isMock = shouldUseMockAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(signInSchema as any),
    defaultValues: {
      email: '',
      password: '',
      devRole: 'Fan',
    },
  });

  const demoAccounts = [
    { role: 'Organizer', email: 'organizer@demo.aegis', label: 'Organizer Clearance' },
    { role: 'Security', email: 'security@demo.aegis', label: 'Security Clearance' },
    { role: 'Medical', email: 'medical@demo.aegis', label: 'Medical Clearance' },
  ];

  const handleSelectDemoAccount = (email: string, role: string) => {
    setValue('email', email);
    setValue('password', 'AegisDemo2026!');
    if (isMock) {
      setValue('devRole', role);
    }
    addToast({
      type: 'ai_insight',
      title: 'Credentials Prefilled',
      description: `Loaded demo credentials for ${role}. Click 'Authorize Access' to sign in.`,
    });
  };

  const onSubmit = async (values: SignInValues) => {
    const success = await signIn(
      values.email,
      values.password,
      isMock ? (values.devRole as UserRole) : undefined
    );

    if (success) {
      addToast({
        type: 'success',
        title: 'Successfully Authenticated',
        description: `Welcome back to AEGIS StadiumOS Command Center!`,
      });
      if (onSuccess) onSuccess();
    } else {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        description: error || 'Please check your credentials.',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" animate={true}>
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-center tracking-tight font-heading">
          Access Command Center
        </CardTitle>
        <CardDescription className="text-center">
          Enter credentials to authorize access to AEGIS StadiumOS.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Demo Credentials Picker */}
          <div className="flex flex-col gap-2 p-3 bg-foreground/[0.02] border border-card-border/30 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
              <UserIcon className="w-3 h-3 text-primary animate-pulse" /> Evaluator / Demo Credentials
            </span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemoAccount(acc.email, acc.role)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-card-border/40 hover:border-primary/50 hover:bg-primary/5 bg-foreground/[0.01] transition-all cursor-pointer group text-center"
                >
                  <span className="text-[10px] font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {acc.role}
                  </span>
                  <span className="text-[8px] text-muted font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                    {acc.email.split('@')[0]}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-[8px] text-muted font-medium text-center">
              *Password: <code className="text-foreground select-all">AegisDemo2026!</code>
            </span>
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="name@stadium.org"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          {/* Password */}
          <Input
            label="Security Password"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />

          {/* Dev Mode Role Selection - ONLY visible in mock environments */}
          {isMock && (
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold uppercase tracking-wider text-red-600 select-none">
                Development Role Assignment
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-red-600 pointer-events-none flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </span>
                <select
                  disabled={isLoading}
                  className="glass-input w-full text-sm font-medium pl-10 border-red-500/40 focus:border-red-500 focus:ring-red-500/20"
                  {...register('devRole')}
                >
                  <option value="Fan">Fan</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Security">Security Personnel</option>
                  <option value="Medical">Medical Team</option>
                  <option value="Accessibility">Accessibility Coordinator</option>
                  <option value="Sustainability">Sustainability Manager</option>
                  <option value="Administrator">System Administrator</option>
                </select>
              </div>
              <span className="text-[10px] text-muted font-medium">
                *Local mock mode: assigns specified security clearance role on login.
              </span>
            </div>
          )}

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full mt-2 font-bold font-heading uppercase"
            isLoading={isLoading}
          >
            Authorize Access
          </Button>

          {/* Navigation link */}
          {onNavigateToSignUp && (
            <p className="text-xs text-center text-muted mt-2">
              Need credential clearance?{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Register a new profile
              </button>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

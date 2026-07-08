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
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { UserRole } from '@aegis/types';

const signUpSchema = zod
  .object({
    displayName: zod.string().min(2, 'Name must be at least 2 characters long'),
    phoneNumber: zod.string().min(8, 'Phone number must be at least 8 digits'),
    email: zod.string().email('Please enter a valid email address'),
    password: zod
      .string()
      .min(12, 'Password must be at least 12 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: zod.string(),
    role: zod.string().default('Fan'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpValues = zod.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
  onNavigateToSignIn?: () => void;
}

export function SignUpForm({ onSuccess, onNavigateToSignIn }: SignUpFormProps) {
  const { signUp, isLoading, error } = useAuth();
  const addToast = useToast((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema as any),
    defaultValues: {
      displayName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Fan',
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    const success = await signUp(
      values.email,
      values.password,
      values.role as UserRole,
      values.displayName,
      values.phoneNumber
    );

    if (success) {
      addToast({
        type: 'success',
        title: 'Profile Created Successfully',
        description: 'Your security profile has been initialized.',
      });
      if (onSuccess) onSuccess();
    } else {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        description: error || 'Please check your information and try again.',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" animate={true}>
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-center tracking-tight">
          Create Security Profile
        </CardTitle>
        <CardDescription className="text-center">
          Register new credentials to establish stadium access permissions.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            placeholder="Prajakta"
            leftIcon={<UserIcon className="w-4 h-4" />}
            error={errors.displayName?.message}
            disabled={isLoading}
            {...register('displayName')}
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 555-0199"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phoneNumber?.message}
            disabled={isLoading}
            {...register('phoneNumber')}
          />

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
            placeholder="Min 12 chars: A, a, 1, #"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter security password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register('confirmPassword')}
          />

          {/* Role selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted select-none">
              Primary Role Assignment
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted pointer-events-none flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </span>
              <select
                disabled={isLoading}
                className="glass-input w-full text-sm font-medium pl-10 border-card-border/60 focus:border-primary focus:ring-primary/20"
                {...register('role')}
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
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full mt-2 font-bold"
            isLoading={isLoading}
          >
            Create Profile
          </Button>

          {/* Navigation link */}
          {onNavigateToSignIn && (
            <p className="text-xs text-center text-muted mt-2">
              Already have credential clearance?{' '}
              <button
                type="button"
                onClick={onNavigateToSignIn}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Authorize existing profile
              </button>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

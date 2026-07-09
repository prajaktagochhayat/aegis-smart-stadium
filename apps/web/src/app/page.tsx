'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useEventStore } from '@/hooks/useEventStore';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Navbar } from '@/components/dashboard/Navbar';
import { OrganizerDashboard } from '@/components/dashboard/roles/OrganizerDashboard';
import { SecurityDashboard } from '@/components/dashboard/roles/SecurityDashboard';
import { MedicalDashboard } from '@/components/dashboard/roles/MedicalDashboard';
import { VolunteerDashboard } from '@/components/dashboard/roles/VolunteerDashboard';
import { AccessibilityDashboard } from '@/components/dashboard/roles/AccessibilityDashboard';
import { SustainabilityDashboard } from '@/components/dashboard/roles/SustainabilityDashboard';
import { AiCoPilotPanel } from '@/components/dashboard/AiCoPilotPanel';
import { Dialog } from '@/components/ui/Dialog';
import { UserProfile } from '@/components/auth/UserProfile';
import { WelcomeHub } from '@/components/dashboard/WelcomeHub';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const BackgroundFootballs3D = dynamic(
  () => import('@/components/dashboard/BackgroundFootballs3D').then((mod) => mod.BackgroundFootballs3D),
  { ssr: false }
);

export default function HomePage() {
  const { user, isLoading, initialize } = useAuth();
  const { startMockStreaming, stopMockStreaming } = useEventStore();
  const [showSignUp, setShowSignUp] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [inWorkspace, setInWorkspace] = useState(false);

  // Toggle .in-workspace class on body to control native/custom cursor states
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (inWorkspace && user) {
        document.body.classList.add('in-workspace');
      } else {
        document.body.classList.remove('in-workspace');
      }
    }
  }, [inWorkspace, user]);

  // Initialize auth session subscription
  useEffect(() => {
    const unsubscribe = initialize();
    return () => {
      unsubscribe();
    };
  }, [initialize]);

  // Activate real-time event simulation when authorized user enters
  useEffect(() => {
    if (user) {
      const unsubscribeSimulator = startMockStreaming();
      return () => {
        unsubscribeSimulator();
      };
    } else {
      stopMockStreaming();
    }
  }, [user, startMockStreaming, stopMockStreaming]);

  // Full screen loading indicator during authentication resolution
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs font-bold text-muted uppercase tracking-widest animate-pulse">
          Resolving Authorization Credentials
        </span>
      </div>
    );
  }

  // Render Role-Specific Dashboard
  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'Security':
        return <SecurityDashboard />;
      case 'Medical':
        return <MedicalDashboard />;
      case 'Volunteer':
        return <VolunteerDashboard />;
      case 'Accessibility':
        return <AccessibilityDashboard />;
      case 'Sustainability':
        return <SustainabilityDashboard />;
      case 'Organizer':
      default:
        return <OrganizerDashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12">
      <BackgroundFootballs3D />
      {/* Global Navigation Header */}
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onGoHome={() => setInWorkspace(false)}
        hideRoleSwitcher={!inWorkspace}
        onOpenAuth={() => {
          setShowSignUp(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full mt-6 px-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {inWorkspace && user ? (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col"
            >
              {renderDashboardByRole()}
            </motion.div>
          ) : (
            <WelcomeHub
              key="hub"
              onEnterWorkspace={() => {
                if (user) {
                  setInWorkspace(true);
                } else {
                  setShowSignUp(false);
                  setIsAuthOpen(true);
                }
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Floating AI Operational Co-Pilot */}
      <AiCoPilotPanel />

      {/* User Profile Configurations Dialog */}
      <Dialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Account Configurations"
        className="max-w-2xl"
      >
        <UserProfile />
      </Dialog>

      {/* Authentication Portal Dialog */}
      <Dialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title={showSignUp ? "Security Profile Registration" : "Clearance Authentication"}
        className="max-w-md"
      >
        <div className="py-2">
          {showSignUp ? (
            <SignUpForm
              onSuccess={() => {
                setIsAuthOpen(false);
                setShowSignUp(false);
              }}
              onNavigateToSignIn={() => setShowSignUp(false)}
            />
          ) : (
            <SignInForm
              onSuccess={() => {
                setIsAuthOpen(false);
              }}
              onNavigateToSignUp={() => setShowSignUp(true)}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}

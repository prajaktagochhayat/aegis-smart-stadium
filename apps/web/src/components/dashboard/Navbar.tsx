'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@aegis/types';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  LogOut,
  RefreshCcw,
  User as UserIcon,
  Sun,
  Moon,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Users,
  Accessibility as AccessibilityIcon,
  Leaf,
  Lock
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavbarProps {
  onOpenProfile?: () => void;
  onGoHome?: () => void;
  hideRoleSwitcher?: boolean;
  onOpenAuth?: () => void;
}

export function Navbar({ onOpenProfile, onGoHome, hideRoleSwitcher = false, onOpenAuth }: NavbarProps) {
  const { user, updateProfile, signOut, isLoading } = useAuth();
  const { t } = useI18n();
  const { setTheme, isDark } = useTheme();

  const handleRoleSwitch = async (role: UserRole) => {
    await updateProfile({ role });
  };

  const rolesList = [
    { value: 'Organizer', label: 'Organizer', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { value: 'Security', label: 'Security Personnel', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { value: 'Medical', label: 'Medical Team', icon: <Activity className="w-3.5 h-3.5" /> },
    { value: 'Volunteer', label: 'Volunteer Console', icon: <Users className="w-3.5 h-3.5" /> },
    { value: 'Accessibility', label: 'Accessibility', icon: <AccessibilityIcon className="w-3.5 h-3.5" /> },
    { value: 'Sustainability', label: 'Sustainability', icon: <Leaf className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="glass-panel sticky top-4 z-30 mx-4 mt-4 flex flex-col px-6 py-4 border-card-border/60 rounded-2xl select-none gap-3.5 animate-[fadeIn_0.5s_ease-out]">
      {/* Top Row: Brand & Profile Actions */}
      <div className="flex items-center justify-between w-full">
        {/* Brand logo (Football Logo replacing Shield) */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left cursor-pointer hover:opacity-85 transition-opacity"
        >
          <div className="p-2 bg-red-600 rounded-full text-white flex items-center justify-center shadow-md shadow-red-500/25 animate-float-soccer">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5.5 h-5.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="12,7.5 15.5,10 14,14 10,14 8.5,10" fill="currentColor" fillOpacity="0.15" />
              <line x1="12" y1="7.5" x2="12" y2="2" />
              <line x1="15.5" y1="10" x2="20.5" y2="8.5" />
              <line x1="14" y1="14" x2="18" y2="18" />
              <line x1="10" y1="14" x2="6" y2="18" />
              <line x1="8.5" y1="10" x2="3.5" y2="8.5" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground font-heading">
              AEGIS StadiumOS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-red-500 font-extrabold leading-none">
              FIFA Matchday Command Center
            </span>
          </div>
        </button>

        {/* Profile & Settings menu */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="h-8.5 w-8.5 p-0 flex items-center justify-center border-card-border/40 hover:bg-foreground/5"
            aria-label="Toggle visual theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-primary" />}
          </Button>

          {user ? (
            <>
              {/* User profile action */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-foreground/5 p-1.5 rounded-xl border border-transparent hover:border-card-border/30 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold font-heading">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden sm:inline truncate max-w-[120px] font-bold text-xs">
                  {user.displayName}
                </span>
              </button>

              {/* Global logout */}
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-danger/10 hover:bg-danger/10 hover:text-danger text-danger py-2 h-8.5 px-3"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            /* Clearance Login Action for Unauthenticated Guests */
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-red-600 to-rose-600 border-red-500 py-2 h-8.5 px-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-500/25 flex items-center gap-1.5"
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Direct Click-to-Switch Clearance Roles */}
      {!hideRoleSwitcher && user && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-card-border/30 w-full justify-center sm:justify-start">
          {rolesList.map((role) => {
            const isActive = user.role === role.value;
            return (
              <motion.button
                key={role.value}
                onClick={() => handleRoleSwitch(role.value as UserRole)}
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  "px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all flex items-center gap-1.5",
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-[0_2px_12px_rgba(220,38,38,0.25)]"
                    : "bg-foreground/[0.02] border-card-border/40 hover:bg-foreground/[0.06] text-muted hover:text-foreground"
                )}
              >
                {role.icon}
                <span>{role.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}
    </header>
  );
}

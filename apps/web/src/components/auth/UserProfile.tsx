'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/components/ThemeProvider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserSession } from '@aegis/types';
import { User as UserIcon, LogOut, Laptop, Smartphone, Globe, Shield, Trash2 } from 'lucide-react';

export function UserProfile() {
  const { user, updateProfile, signOut, isLoading } = useAuth();
  const addToast = useToast((state) => state.addToast);
  const { setTheme: setThemeGlobal } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English');
  const [theme, setTheme] = useState(user?.theme || 'system');
  
  // Local state for mock device sessions as specified in AUTHENTICATION.md
  const [sessions, setSessions] = useState<UserSession[]>([
    {
      id: 'sess-1',
      userId: user?.id || 'usr-123',
      deviceInfo: 'Chrome 125, macOS Sonoma',
      ipAddress: '192.168.1.45',
      lastLogin: '2026-07-09T15:00:00.000Z',
      location: 'Stadium Operations Center (Local IP)',
      isTrusted: true,
    },
    {
      id: 'sess-2',
      userId: user?.id || 'usr-123',
      deviceInfo: 'Safari iOS 17.5, iPhone 15 Pro',
      ipAddress: '10.0.82.11',
      lastLogin: '2026-07-09T14:00:00.000Z',
      location: 'North Gate Access Point',
      isTrusted: false,
    },
  ]);

  if (!user) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center">
        <CardDescription>No authorized profile loaded. Please authenticate.</CardDescription>
      </Card>
    );
  }

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      displayName,
      preferredLanguage: language,
      theme: theme as 'light' | 'dark' | 'system',
    });

    if (success) {
      setThemeGlobal(theme as 'light' | 'dark' | 'system');
      addToast({
        type: 'success',
        title: 'Profile Updated',
        description: 'Settings saved successfully.',
      });
    } else {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: 'Could not update user configuration.',
      });
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    addToast({
      type: 'warning',
      title: 'Session Revoked',
      description: `Authorized session ${sessionId} has been disconnected.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full p-4">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card animate={true} className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <UserIcon className="w-5 h-5 text-primary" />
              Profile Configuration
            </CardTitle>
            <CardDescription>
              Update your user display preferences.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-4 flex-grow justify-between">
            <div className="flex flex-col gap-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted select-none">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isLoading}
                  className="glass-input w-full text-sm font-medium border-card-border/60 focus:border-primary focus:ring-primary/20"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Portuguese">Portuguese (Português)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted select-none">
                  Interface Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  disabled={isLoading}
                  className="glass-input w-full text-sm font-medium border-card-border/60 focus:border-primary focus:ring-primary/20"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Preference</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full mt-4"
              isLoading={isLoading}
            >
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Access Rights Card */}
        <Card animate={true} className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Shield className="w-5 h-5 text-secondary" />
              Clearance & Authority
            </CardTitle>
            <CardDescription>
              Your security clearance level on AEGIS StadiumOS.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-4 justify-between flex-grow">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-foreground/[0.03] border border-card-border/40 p-4 rounded-xl">
                <span className="text-xs font-semibold text-muted uppercase">Authorized Role</span>
                <span className="text-sm font-extrabold text-primary uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center bg-foreground/[0.03] border border-card-border/40 p-4 rounded-xl">
                <span className="text-xs font-semibold text-muted uppercase">MFA Status</span>
                <span className="text-sm font-bold text-success flex items-center gap-1">
                  Enforced
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={signOut}
              isLoading={isLoading}
              leftIcon={<LogOut className="w-4 h-4 text-danger" />}
              className="w-full border-danger/20 hover:bg-danger/10 hover:text-danger-foreground text-danger mt-4"
            >
              Revoke Session & Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Card */}
      <Card animate={true}>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Globe className="w-5 h-5 text-accent" />
            Active Authorized Devices
          </CardTitle>
          <CardDescription>
            List of devices currently logged into your AEGIS credentials.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4">
          {sessions.length === 0 ? (
            <p className="text-xs text-muted text-center py-4">No active sessions found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl hover:bg-foreground/[0.03] transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-foreground/[0.03] rounded-lg text-muted">
                      {session.deviceInfo.toLowerCase().includes('mac') || session.deviceInfo.toLowerCase().includes('windows') ? (
                        <Laptop className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-foreground">
                        {session.deviceInfo}
                      </span>
                      <span className="text-[10px] text-muted leading-none">
                        IP: {session.ipAddress} • {session.location}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    leftIcon={<Trash2 className="w-4 h-4 text-danger" />}
                    className="p-2 border border-transparent hover:border-danger/10 hover:bg-danger/5"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

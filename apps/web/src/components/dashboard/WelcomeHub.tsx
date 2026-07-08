'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEventStore } from '@/hooks/useEventStore';
import { useTheme } from '@/components/ThemeProvider';
import { Play, ShieldAlert, Cpu, Activity, Clock, Globe, ArrowRight, ShieldCheck, Sparkles, Terminal, Shield, Wifi, HeartPulse, RefreshCw } from 'lucide-react';

interface WelcomeHubProps {
  onEnterWorkspace: () => void;
}

export function WelcomeHub({ onEnterWorkspace }: WelcomeHubProps) {
  const { alerts } = useEventStore();
  const { isDark } = useTheme();

  // Mock Countdown Timer for kickoff
  const [timeLeft, setTimeLeft] = useState('02:43:37');
  useEffect(() => {
    const interval = setInterval(() => {
      const parts = timeLeft.split(':').map(Number);
      let h = parts[0];
      let m = parts[1];
      let s = parts[2];

      s--;
      if (s < 0) {
        s = 59;
        m--;
        if (m < 0) {
          m = 59;
          h--;
          if (h < 0) {
            h = 2;
            m = 43;
            s = 37;
          }
        }
      }

      const format = (n: number) => n.toString().padStart(2, '0');
      setTimeLeft(`${format(h)}:${format(m)}:${format(s)}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const activeAlertsCount = alerts.filter(a => a.severity === 'high_risk' || a.severity === 'critical' || a.severity === 'emergency').length;

  const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)', transition: { duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] } }}
      className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-between py-6 px-4 select-none relative z-10"
    >
      {/* Immersive 3-Column Tactical Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-grow justify-center max-w-7xl mx-auto w-full mt-6">
        
        {/* Left Column: Tactical Signal Lattice (Simulated Radar HUD) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-3 hidden lg:flex flex-col gap-6"
        >
          <div className="glass-panel p-5 border-card-border/50 bg-slate-950/20 backdrop-blur-md relative overflow-hidden shadow-lg shadow-red-500/5">
            {/* Pulsing scanning line overlay */}
            <div className="absolute inset-x-0 h-0.5 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.5)] top-0 animate-[bounce_4s_infinite_linear]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5 font-heading">
              <Shield className="w-3.5 h-3.5 animate-pulse" /> Zone Sentinel Grid
            </h3>
            <p className="text-[10px] text-muted mt-1 leading-relaxed">
              Real-time sensor arrays scanning stadium gates, concession blocks, and parking lattices.
            </p>
            
            {/* Visual radar scanning grid */}
            <div className="w-full h-36 border border-card-border/30 rounded-xl mt-4 relative overflow-hidden bg-foreground/[0.02] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)] animate-[pulse_3s_infinite]" />
              <div className="absolute w-24 h-24 border border-red-500/10 rounded-full animate-[ping_4s_infinite]" />
              <div className="absolute w-12 h-12 border border-red-500/20 rounded-full" />
              
              {/* Floating tactical nodes */}
              <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-red-500" />
              <div className="absolute top-[65%] left-[70%] w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <div className="absolute top-[40%] left-[55%] w-2 h-2 rounded-full bg-success animate-pulse" />
              
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold font-mono absolute bottom-2">
                Scanning Matrix: Active
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 text-[9px] font-mono font-semibold text-muted">
              <div className="flex justify-between items-center border-b border-card-border/20 pb-1.5">
                <span>GATE ALFA SIGNAL</span>
                <span className="text-success flex items-center gap-0.5"><Wifi className="w-3 h-3" /> 98%</span>
              </div>
              <div className="flex justify-between items-center border-b border-card-border/20 pb-1.5">
                <span>CONCOURSE BETA</span>
                <span className="text-success flex items-center gap-0.5"><Wifi className="w-3 h-3" /> 95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>PARKING STANDS</span>
                <span className="text-warning flex items-center gap-0.5"><Wifi className="w-3 h-3" /> 84%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center Column: Title, Branding, Big Workspace CTA */}
        <div className="lg:col-span-6 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto relative px-4 md:px-8">
          {/* Floating interactive micro-badges in background */}
          <motion.div
            animate={{ y: [0, -12, 0], x: [0, 8, 0], rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-14 w-12 h-12 rounded-full bg-gradient-to-tr from-red-600/15 to-rose-600/15 border border-red-500/25 flex items-center justify-center backdrop-blur-md hidden md:flex shadow-[0_4px_16px_rgba(220,38,38,0.15)]"
          >
            <ShieldCheck className="w-5.5 h-5.5 text-red-500 animate-pulse" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -10, 0], rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-2 -right-16 w-11 h-11 rounded-full bg-gradient-to-bl from-amber-500/15 to-yellow-500/15 border border-amber-500/25 flex items-center justify-center backdrop-blur-md hidden md:flex shadow-[0_4px_16px_rgba(245,158,11,0.15)]"
          >
            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], x: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-12 -left-16 w-14 h-14 rounded-full bg-gradient-to-r from-primary/10 to-rose-500/15 border border-primary/25 flex items-center justify-center backdrop-blur-md hidden md:flex shadow-[0_4px_16px_rgba(239,68,68,0.1)]"
          >
            <Cpu className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '10s' }} />
          </motion.div>

          {/* Floating status chips */}
          <div className="flex flex-wrap justify-center gap-2.5">
            <motion.span 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="px-3.5 py-1.5 bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/25 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              FIFA World Cup 2026 Hub
            </motion.span>
            <motion.span 
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-red-500" />
              AI Co-Pilot: Online
            </motion.span>
            <motion.span 
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="px-3.5 py-1.5 bg-success/10 text-success border border-success/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-sm"
            >
              <Activity className="w-3 h-3 text-success animate-pulse" />
              Crowd Telemetry: Active
            </motion.span>
          </div>

          {/* Large Cinematic Header */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] font-heading select-none">
            AEGIS <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">StadiumOS</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted max-w-xl leading-relaxed font-medium mt-2">
            Holographic venue operations console driven by Generative AI. Harness real-time crowd heatmaps, secure communication lattices, and automated emergency dispatches.
          </p>

          {/* Massive Redesigned Launch Button */}
          <div className="mt-8 flex flex-col items-center gap-4 w-full">
            <Button
              variant="primary"
              size="lg"
              onClick={onEnterWorkspace}
              rightIcon={<ArrowRight className="w-5 h-5 text-white animate-pulse shrink-0" />}
              className="w-full max-w-md h-16 px-10 text-xs md:text-sm font-extrabold bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white rounded-2xl hover:scale-[1.04] active:scale-95 transition-transform shadow-[0_8px_32px_rgba(220,38,38,0.45)] border border-red-500/30 uppercase tracking-widest cursor-pointer font-heading whitespace-nowrap"
            >
              Launch Workspace
            </Button>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> SECURE AUTHENTICATED SYSTEM SESSION v1.2.0
            </span>
          </div>
        </div>

        {/* Right Column: AI Co-Pilot Diagnostics Console */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lg:col-span-3 hidden lg:flex flex-col gap-6"
        >
          <div className="glass-panel p-5 border-card-border/50 bg-slate-950/20 backdrop-blur-md relative overflow-hidden shadow-lg shadow-amber-500/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5 font-heading">
              <Cpu className="w-3.5 h-3.5 animate-spin" /> Cognitive Diagnostics
            </h3>
            <p className="text-[10px] text-muted mt-1 leading-relaxed">
              AI agent models running on Supabase vector stores, managing autonomous triage networks.
            </p>
            
            {/* Sparkline/Wave visual HUD widget */}
            <div className="w-full h-36 border border-card-border/30 rounded-xl mt-4 relative overflow-hidden bg-foreground/[0.02] flex flex-col justify-end p-3">
              {/* Wave diagram */}
              <div className="flex items-end gap-1 h-20 w-full px-1">
                {Array.from({ length: 16 }).map((_, idx) => {
                  const h = Math.abs(Math.sin((idx + 2) * 1.3) * 50) + 10;
                  return (
                    <motion.div 
                      key={idx}
                      animate={isTest ? {} : { height: [h, h * 1.4, h] }}
                      transition={{ duration: 2 + idx * 0.15, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-1 bg-gradient-to-t from-amber-500/40 to-amber-500 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold font-mono text-center mt-3">
                Agent Latency: 12ms / Stable
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 text-[9px] font-mono font-semibold text-muted">
              <div className="flex justify-between items-center border-b border-card-border/20 pb-1.5">
                <span>MODEL ACCURACY</span>
                <span className="text-success">99.86%</span>
              </div>
              <div className="flex justify-between items-center border-b border-card-border/20 pb-1.5">
                <span>SECURITY COGNITION</span>
                <span className="text-success flex items-center gap-1"><HeartPulse className="w-3 h-3 text-success animate-pulse" /> NORMAL</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ZUSTAND EVENT LOGS</span>
                <span className="text-muted flex items-center gap-0.5"><RefreshCw className="w-3 h-3 animate-spin" /> SYNCED</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Premium Glass Telemetry Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mx-auto mt-12 relative z-20">
        <Card className="flex flex-col border-card-border/50 glass-panel" animate={true}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3.5 bg-red-500/10 text-red-500 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Active Alerts</span>
              <span className="text-xl font-extrabold text-foreground mt-0.5 font-heading">
                {activeAlertsCount} Emergencies
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-card-border/50 glass-panel" animate={true}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Operational Capacity</span>
              <span className="text-xl font-extrabold text-foreground mt-0.5 font-heading">
                83.4% Occupied
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-card-border/50 glass-panel" animate={true}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-500 rounded-2xl shadow-[0_0_15px_rgba(124,58,237,0.1)]">
              <Clock className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Kickoff Countdown</span>
              <span className="text-xl font-extrabold text-foreground mt-0.5 font-mono">
                {timeLeft}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-card-border/50 glass-panel" animate={true}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <Cpu className="w-6 h-6 animate-spin" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Sensor Latency</span>
              <span className="text-xl font-extrabold text-foreground mt-0.5 font-heading">
                12ms / Stable
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

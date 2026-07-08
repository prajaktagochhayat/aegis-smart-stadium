'use client';

import React, { useState, useEffect } from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StadiumMap3D } from '../StadiumMap3D';
import { AnalyticsDashboard } from '../AnalyticsDashboard';
import { SystemHealth } from '../SystemHealth';
import {
  Users,
  AlertTriangle,
  Clock,
  Route,
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Droplet,
  Wifi,
  Smartphone,
  Eye,
  Megaphone,
  Wind,
  Thermometer,
  Compass,
  MapPin,
  Sparkles,
  TrafficCone,
  Heart,
  Video,
  Volume2,
  Calendar,
  Activity,
  Award,
  HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';

// List of all 28 specific twin control pill buttons
const twinControlPills = [
  'Stadium Overview', 'Live Crowd Heatmap', 'Seating Blocks', 'Gates & Entry',
  'Security Command', 'Medical Response', 'Emergency Evacuation', 'Traffic Control',
  'Parking Occupancy', 'Metro & Shuttle', 'Volunteer Console', 'Staff Management',
  'Accessibility', 'Sustainability', 'Broadcast Operations', 'VIP & Hospitality',
  'Fan Experience', 'Food & Retail', 'Restrooms', 'Weather Monitor',
  'Drone Surveillance', 'CCTV Analytics', 'AI Prediction', 'Digital Twin Analytics',
  'Incident Timeline', 'Communication Center', 'Energy Usage', 'Water Management'
];

export function OrganizerDashboard() {
  const { zones, alerts, routes, parkingLots, updateZone } = useEventStore();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'analytics' | 'diagnostics'>('telemetry');
  
  // Digital Twin Control Panel Pill Selection
  const [activeTwinPanel, setActiveTwinPanel] = useState('Stadium Overview');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Live pulsing state fluctuations for 34 metrics
  const [fluctuator, setFluctuator] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFluctuator((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Simulated countdown values
  const [countdown, setCountdown] = useState({ hours: 14, mins: 42, secs: 18 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { hours: prev.hours, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, mins: 59, secs: 59 };
        return { hours: 0, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Map individual seating zones
  const zonesMap = zones.reduce((acc, z) => {
    acc[z.id] = z;
    return acc;
  }, {} as Record<string, typeof zones[0]>);

  const getZoneOccupancy = (id: string, defVal: number) => {
    const z = zonesMap[id];
    return z ? z.currentOccupancy : defVal;
  };

  const getZoneCapacity = (id: string, defCap: number) => {
    const z = zonesMap[id];
    return z ? z.capacity : defCap;
  };

  const getZonePercent = (id: string, defVal: number, defCap: number) => {
    const z = zonesMap[id];
    if (!z) return Math.floor((defVal / defCap) * 100);
    return Math.floor((z.currentOccupancy / z.capacity) * 100);
  };

  // Calculations for Left Sidebar
  const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const occupancyPercent = totalCapacity > 0 ? Math.floor((totalOccupancy / totalCapacity) * 100) : 0;
  
  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) {
      updateZone(zoneId, {
        currentOccupancy: Math.min(zone.capacity, zone.currentOccupancy + 150),
      });
    }
  };

  // 34 Analytics Cards calculations with simulated fluctuations
  const mockPulsedPercent = (base: number, freq: number) => {
    const sinOffset = Math.sin(fluctuator * freq) * 3;
    return Math.max(1, Math.min(99, Math.floor(base + sinOffset)));
  };

  const mockPulsedCount = (base: number, freq: number, amplitude: number = 5) => {
    const sinOffset = Math.sin(fluctuator * freq) * amplitude;
    return Math.max(0, Math.floor(base + sinOffset));
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 font-sans select-none">
      {/* Top Tab Switcher */}
      <div className="flex gap-2 bg-foreground/[0.02] border border-card-border/40 p-1.5 rounded-2xl self-start select-none z-10">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold flex gap-2 items-center cursor-pointer transition-colors',
            activeTab === 'telemetry'
              ? 'bg-primary text-white shadow-md shadow-primary/10'
              : 'text-muted hover:bg-foreground/5 hover:text-foreground'
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          Digital Twin Command Center
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold flex gap-2 items-center cursor-pointer transition-colors',
            activeTab === 'analytics'
              ? 'bg-primary text-white shadow-md shadow-primary/10'
              : 'text-muted hover:bg-foreground/5 hover:text-foreground'
          )}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics Charts
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold flex gap-2 items-center cursor-pointer transition-colors',
            activeTab === 'diagnostics'
              ? 'bg-primary text-white shadow-md shadow-primary/10'
              : 'text-muted hover:bg-foreground/5 hover:text-foreground'
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          System Diagnostics
        </button>
      </div>

      {/* Rendering Core Sections */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
          {/* COLUMN 1: LEFT SIDEBAR (Stadium Inventory & Operations) */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <Card className="glass-panel border-card-border/60" animate={true}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest text-primary font-heading font-extrabold">
                  Venue Governance
                </CardTitle>
                <CardDescription>Matchday inventory & unit statuses.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {/* Stadium Capacity stats */}
                <div className="p-4 bg-foreground/[0.01] border border-card-border/30 rounded-xl flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted">Stadium Capacity</span>
                    <span className="text-xl font-extrabold text-foreground font-heading">72,000</span>
                  </div>
                  <Users className="w-7 h-7 text-primary/70" />
                </div>

                <div className="p-4 bg-foreground/[0.01] border border-card-border/30 rounded-xl flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted">Current Attendance</span>
                    <span className="text-xl font-extrabold text-foreground font-heading">
                      {totalOccupancy.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">
                    {occupancyPercent}% Fill
                  </span>
                </div>

                {/* Operations & Dispatch units list */}
                <div className="flex flex-col gap-3.5 border-t border-card-border/30 pt-4 mt-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-muted font-heading">
                    Clearance & Support Deployments
                  </h4>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-success" /> Security Status</span>
                    <span className="text-success uppercase tracking-wider bg-success/15 px-2 py-0.5 rounded-md border border-success/10">Active Secure</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><TrafficCone className="w-3.5 h-3.5 text-warning" /> Gate 7 Status</span>
                    <span className="text-warning bg-warning/10 px-2 py-0.5 rounded-md border border-warning/15">Congested</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-primary" /> Active Incidents</span>
                    <span className="text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">1 Triage</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-red-500" /> Medical Teams</span>
                    <span className="text-foreground">8 Squads Online</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-secondary" /> Police Units</span>
                    <span className="text-foreground">14 Squads deployed</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Fire Response</span>
                    <span className="text-foreground">4 Trucks active</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> Volunteers on Duty</span>
                    <span className="text-foreground">240 Checked In</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-muted flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-success" /> Broadcast Feed</span>
                    <span className="text-success flex items-center gap-1 font-extrabold uppercase text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" /> Live 4K HDR
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COLUMN 2 & 3: CENTRAL DIGITAL TWIN CONSOLE */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Control Panel Tab Pills Wrapper */}
            <div className="glass-panel border-card-border/60 p-4 rounded-2xl flex flex-col gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary font-heading">
                Digital Twin Control console
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {twinControlPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setActiveTwinPanel(pill)}
                    className={clsx(
                      'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border',
                      activeTwinPanel === pill
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                        : 'bg-foreground/[0.02] border-card-border/30 text-muted hover:border-card-border hover:text-foreground'
                    )}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Central 3D Canvas Box */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-card-border/60 bg-foreground/[0.01] shadow-2xl h-[520px]">
              <StadiumMap3D onSelectZone={handleSelectZone} selectedZoneId={selectedZoneId} activetwinPanel={activeTwinPanel} />
            </div>

            {/* Live Analytics Cards Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary font-heading">
                  Twin Telemetry Indicators
                </h3>
                <span className="text-[9px] uppercase tracking-wider text-muted font-bold">
                  *Fluctuating live counts synced with R3F WebGL canvas
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* 1-4 Gate Occupancy */}
                <MiniTelemetryCard title="North Gate Occupancy" value={`${mockPulsedPercent(82, 0.45)}%`} icon={<Smartphone className="text-primary" />} />
                <MiniTelemetryCard title="South Gate Occupancy" value={`${mockPulsedPercent(74, 0.35)}%`} icon={<Smartphone className="text-primary" />} />
                <MiniTelemetryCard title="East Gate Occupancy" value={`${mockPulsedPercent(91, 0.6)}%`} icon={<Smartphone className="text-primary" />} />
                <MiniTelemetryCard title="West Gate Occupancy" value={`${mockPulsedPercent(48, 0.2)}%`} icon={<Smartphone className="text-primary" />} />

                {/* 5-12 Compass upper/lower zones */}
                <MiniTelemetryCard title="North Upper Seating" value={`${getZonePercent('zone-n-upper', 82, 10000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="North Lower Seating" value={`${getZonePercent('zone-n-lower', 76, 8000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="South Upper Seating" value={`${getZonePercent('zone-s-upper', 91, 10000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="South Lower Seating" value={`${getZonePercent('zone-s-lower', 92, 8000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="East Upper Seating" value={`${getZonePercent('zone-e-upper', 96, 12000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="East Lower Seating" value={`${getZonePercent('zone-e-lower', 81, 10000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="West Upper Seating" value={`${getZonePercent('zone-w-upper', 65, 12000)}%`} icon={<Users className="text-secondary" />} />
                <MiniTelemetryCard title="West Lower Seating" value={`${getZonePercent('zone-w-lower', 68, 10000)}%`} icon={<Users className="text-secondary" />} />
              </div>
            </div>
          </div>

          {/* COLUMN 4: RIGHT SIDEBAR (External Environment & AI Triage) */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Match Countdown Clock */}
            <Card className="glass-panel border-card-border/60 bg-gradient-to-r from-red-950/20 via-slate-950/20 to-amber-950/20" animate={true}>
              <CardContent className="py-5 flex flex-col items-center text-center gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 flex gap-1.5 items-center font-heading">
                  <Calendar className="w-3.5 h-3.5" /> Match Countdown
                </span>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col bg-background/50 border border-card-border/30 px-3 py-1.5 rounded-xl">
                    <span className="text-xl font-extrabold font-heading text-foreground">
                      {countdown.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted font-bold leading-none mt-0.5">hours</span>
                  </div>
                  <span className="text-xl font-extrabold text-foreground animate-pulse">:</span>
                  <div className="flex flex-col bg-background/50 border border-card-border/30 px-3 py-1.5 rounded-xl">
                    <span className="text-xl font-extrabold font-heading text-foreground">
                      {countdown.mins.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted font-bold leading-none mt-0.5">mins</span>
                  </div>
                  <span className="text-xl font-extrabold text-foreground animate-pulse">:</span>
                  <div className="flex flex-col bg-background/50 border border-card-border/30 px-3 py-1.5 rounded-xl">
                    <span className="text-xl font-extrabold font-heading text-foreground">
                      {countdown.secs.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted font-bold leading-none mt-0.5">secs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Transit wait times */}
            <Card className="glass-panel border-card-border/60" animate={true}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest text-primary font-heading font-extrabold">
                  Public Transit Status
                </CardTitle>
                <CardDescription>Transit route delays & shuttle waits.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {routes.map((rt) => (
                  <div
                    key={rt.id}
                    className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-foreground truncate max-w-[140px]">{rt.name}</span>
                      <span className="text-[10px] text-muted capitalize">Mode: {rt.mode}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-extrabold text-primary">{rt.etaMinutes} mins wait</span>
                      <span className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                        rt.status === 'delayed'
                          ? 'bg-danger/10 text-danger border-danger/10'
                          : 'bg-success/10 text-success border-success/10'
                      }`}>
                        {rt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Parking space indicators */}
            <Card className="glass-panel border-card-border/60" animate={true}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest text-primary font-heading font-extrabold">
                  Parking lots occupancy
                </CardTitle>
                <CardDescription>Active capacities of zones A–F.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {parkingLots.map((lot) => (
                  <div key={lot.id} className="flex justify-between items-center text-xs font-semibold text-foreground">
                    <span className="text-muted">{lot.name}</span>
                    <span className={lot.isFull ? 'text-danger font-bold' : 'text-success'}>
                      {lot.isFull ? 'FULL' : `${lot.occupiedSpaces} / ${lot.totalSpaces} spots`}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency warning alerts */}
            <Card className="glass-panel border-card-border/60" animate={true}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest text-primary font-heading font-extrabold">
                  Tactical Command Warnings
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {alerts.length > 0 ? (
                  alerts.map((alt) => (
                    <div key={alt.id} className="p-3 bg-danger/5 border border-danger/15 rounded-xl flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-primary uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {alt.cause}
                        </span>
                        <span className="text-[9px] text-muted font-bold">Live</span>
                      </div>
                      <span className="text-[10px] text-foreground font-semibold leading-tight">{alt.explanation}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs font-semibold text-muted">
                    No active warnings.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Local weather monitor */}
            <Card className="glass-panel border-card-border/60" animate={true}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest text-primary font-heading font-extrabold">
                  Matchday Weather Station
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 items-center">
                <Thermometer className="w-8 h-8 text-warning shrink-0" />
                <div className="flex flex-col gap-0.5 text-xs font-semibold text-foreground">
                  <span className="text-base font-extrabold text-foreground leading-none">24.2 °C</span>
                  <span className="text-[10px] text-muted">Sunny | Humid: 54% | Wind: 12 km/h</span>
                </div>
              </CardContent>
            </Card>

            {/* AI co-pilot insights */}
            <Card className="glass-panel border-card-border/60 bg-gradient-to-tr from-primary/5 to-rose-500/5" animate={true}>
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest text-primary font-heading font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Operations Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-xs font-semibold text-muted leading-relaxed">
                <p>* Queue at South food courts expected to rise in 10 minutes. Advise redirection toward West stands concourses.</p>
                <p>* Match shuttle bus fleet transit ETA experiencing 8-minute congestion delays on Route 3. Dispatch backup shuttles.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && <AnalyticsDashboard />}
      {activeTab === 'diagnostics' && <SystemHealth />}
    </div>
  );
}

// Mini Telemetry Helper Card component
interface MiniCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function MiniTelemetryCard({ title, value, icon }: MiniCardProps) {
  return (
    <div className="p-3 bg-foreground/[0.01] border border-card-border/30 rounded-xl flex items-center gap-3 shadow-[0_2px_8px_0_rgba(0,0,0,0.015)]">
      <div className="p-2 bg-foreground/[0.02] rounded-lg shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-[9px] uppercase tracking-wider text-muted font-bold whitespace-normal leading-normal">{title}</span>
        <span className="text-xs font-extrabold text-foreground font-heading mt-0.5">{value}</span>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Sparkles, Route, Building, ShieldCheck } from 'lucide-react';

export function AccessibilityDashboard() {
  const { parkingLots, tasks } = useEventStore();

  const totalAccessibleSpots = parkingLots.reduce((sum, l) => sum + l.accessibleSpaces, 0);
  const accessibilityTasks = tasks.filter((t) => t.volunteerId !== 'unassigned');

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Accessible Parking spaces"
          value={totalAccessibleSpots}
          icon={<Route className="w-5 h-5 text-primary" />}
          trend={{ value: 'Available', direction: 'neutral' }}
          aiSummary="Accessible Lot A turnstiles have ramp support."
        />

        <StatCard
          title="Elevator Health Index"
          value="100% Online"
          icon={<Building className="w-5 h-5 text-accent" />}
          trend={{ value: '8 Elevators', direction: 'neutral' }}
          aiSummary="Gate A Main Lift operational. Ramps inspected."
        />

        <StatCard
          title="Escort Assistance Squads"
          value={`${accessibilityTasks.length} Stewards`}
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          trend={{ value: 'Active', direction: 'neutral' }}
          aiSummary="Volunteers assisting wheelchair entries at Gate B."
        />
      </div>

      {/* Ramps & Elevators detailed checklist */}
      <Card animate={true}>
        <CardHeader>
          <CardTitle>Stadium Accessibility Status Check</CardTitle>
          <CardDescription>Inspections of wheelchair access routes and escalators.</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl">
            <span className="text-xs font-bold text-foreground">Main Entrance Access Ramp (North Gate)</span>
            <span className="text-xs font-extrabold text-success uppercase">Inspected & Clear</span>
          </div>
          <div className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl">
            <span className="text-xs font-bold text-foreground">VIP Lift Elevator A (East stands)</span>
            <span className="text-xs font-extrabold text-success uppercase">Fully Operational</span>
          </div>
          <div className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl">
            <span className="text-xs font-bold text-foreground">South Concourse Pedestrian Ramp</span>
            <span className="text-xs font-extrabold text-success uppercase">Inspected & Clear</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

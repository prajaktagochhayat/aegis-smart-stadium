'use client';

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Leaf, Award, Recycle } from 'lucide-react';

export function SustainabilityDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Recycling Rate"
          value="74.5%"
          icon={<Recycle className="w-5 h-5 text-success" />}
          trend={{ value: '+4.2%', direction: 'up', label: 'vs last match' }}
          aiSummary="Halftime waste segregation task is currently active."
        />

        <StatCard
          title="Energy Saved today"
          value="4,250 kWh"
          icon={<Leaf className="w-5 h-5 text-primary" />}
          trend={{ value: 'Target: 5k', direction: 'neutral' }}
          aiSummary="LED lighting system running at peak efficiency."
        />

        <StatCard
          title="Water Usage Index"
          value="0.82 Liters/Fan"
          icon={<Award className="w-5 h-5 text-accent" />}
          trend={{ value: '-8.5%', direction: 'up', label: 'savings' }}
          aiSummary="Greywater recycle valves operating at 100%."
        />
      </div>

      {/* Sustainable Goals checklist */}
      <Card animate={true}>
        <CardHeader>
          <CardTitle>Sustainability Initiatives Status</CardTitle>
          <CardDescription>Live tracking of energy reduction plans and halftime cleanup.</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl">
            <span className="text-xs font-bold text-foreground">Halftime Segregation Stewards</span>
            <span className="text-xs font-extrabold text-success uppercase">Deployed</span>
          </div>
          <div className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl">
            <span className="text-xs font-bold text-foreground">Solar Canopy Production</span>
            <span className="text-xs font-extrabold text-success uppercase">Generating (450 kW)</span>
          </div>
          <div className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl">
            <span className="text-xs font-bold text-foreground">Biodegradable Cup Verification</span>
            <span className="text-xs font-extrabold text-success uppercase">100% Vendor Compliance</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

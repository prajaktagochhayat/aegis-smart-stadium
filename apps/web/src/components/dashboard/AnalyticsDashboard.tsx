'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, Leaf } from 'lucide-react';

// Historical match day data: Visitor Throughput (Pre-match, Kickoff, Halftime, Fulltime)
const visitorData = [
  { time: '18:00', gates: 2400, concourse: 1200, stands: 400 },
  { time: '18:30', gates: 8500, concourse: 3400, stands: 2200 },
  { time: '19:00', gates: 14200, concourse: 8200, stands: 7500 },
  { time: '19:30', gates: 4500, concourse: 6100, stands: 18200 },
  { time: '20:00 (KO)', gates: 800, concourse: 2200, stands: 24200 },
  { time: '20:45 (HT)', gates: 200, concourse: 14500, stands: 9200 },
  { time: '21:30', gates: 100, concourse: 1800, stands: 24500 },
  { time: '22:00 (FT)', gates: 8500, concourse: 4500, stands: 11000 },
];

// Sustainability Resource Usages
const sustainabilityData = [
  { metric: 'Solar energy generated (kW)', current: 450, target: 500 },
  { metric: 'Grid energy consumed (kW)', current: 180, target: 200 },
  { metric: 'Water recycled (kL)', current: 38, target: 45 },
  { metric: 'Waste segregated (kg)', current: 820, target: 1000 },
];

export function AnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitor Throughput Area Chart */}
        <Card className="flex flex-col h-[400px]" animate={true}>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Activity className="w-5 h-5 text-primary" />
              Visitor Location Throughput
            </CardTitle>
            <CardDescription>
              Real-time load distributions across gates, concourses, and seating blocks.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 w-full pb-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a5cff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0a5cff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConcourse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="gates" stroke="#0a5cff" fillOpacity={1} fill="url(#colorGates)" name="Gate Inflows" />
                <Area type="monotone" dataKey="concourse" stroke="#7c3aed" fillOpacity={1} fill="url(#colorConcourse)" name="Concourse Crowd" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sustainability Resource Usage Bar Chart */}
        <Card className="flex flex-col h-[400px]" animate={true}>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Leaf className="w-5 h-5 text-success" />
              Sustainability Performance
            </CardTitle>
            <CardDescription>
              Solar canopy generation and recycling outputs compared against targets.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 w-full pb-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sustainabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="current" fill="#10b981" radius={[4, 4, 0, 0]} name="Current Output" />
                <Bar dataKey="target" fill="#64748b" radius={[4, 4, 0, 0]} name="Goal Target" opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Historical Queue waits text blocks */}
      <Card animate={true}>
        <CardHeader>
          <CardTitle>Historical Queue Analysis</CardTitle>
          <CardDescription>Turnstile flow comparisons against previous matches.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-card-border/40 rounded-xl bg-foreground/[0.01]">
              <span className="text-[10px] uppercase font-bold text-muted">North Gate Peak Queue</span>
              <p className="text-xl font-extrabold text-foreground mt-1">11.4 mins</p>
              <span className="text-[10px] text-success font-semibold mt-0.5 block">-2.5 mins vs last match</span>
            </div>
            <div className="p-4 border border-card-border/40 rounded-xl bg-foreground/[0.01]">
              <span className="text-[10px] uppercase font-bold text-muted">South Concourse Peak Wait</span>
              <p className="text-xl font-extrabold text-foreground mt-1">8.8 mins</p>
              <span className="text-[10px] text-danger font-semibold mt-0.5 block">+1.2 mins vs last match</span>
            </div>
            <div className="p-4 border border-card-border/40 rounded-xl bg-foreground/[0.01]">
              <span className="text-[10px] uppercase font-bold text-muted">Halftime concession Peak</span>
              <p className="text-xl font-extrabold text-foreground mt-1">14.2 mins</p>
              <span className="text-[10px] text-success font-semibold mt-0.5 block">-0.8 mins vs last match</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

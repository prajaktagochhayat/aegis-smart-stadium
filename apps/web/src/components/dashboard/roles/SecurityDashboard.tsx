'use client';

import React from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { StatCard } from '@/components/ui/StatCard';
import { IncidentConsole } from '../IncidentConsole';
import { Shield, Eye, ShieldAlert } from 'lucide-react';

export function SecurityDashboard() {
  const { incidents } = useEventStore();

  const activeIncidents = incidents.filter((inc) => inc.status !== 'Resolved');
  const criticalCount = activeIncidents.filter((inc) => inc.severity >= 4).length;

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Threat Incidents"
          value={activeIncidents.length}
          icon={<Shield className="w-5 h-5 text-primary" />}
          trend={{ value: `${criticalCount} Critical`, direction: 'neutral' }}
          aiSummary="Security dispatches currently attending Section 104."
        />

        <StatCard
          title="Live Anomaly Index"
          value="12%"
          icon={<Eye className="w-5 h-5 text-accent" />}
          trend={{ value: 'Stable', direction: 'neutral', label: 'sensor telemetry' }}
          aiSummary="Camera feeds indicate regular pedestrian flow rates."
        />

        <StatCard
          title="Security Force Status"
          value="15 Teams Ready"
          icon={<ShieldAlert className="w-5 h-5 text-secondary" />}
          trend={{ value: 'Operational', direction: 'neutral' }}
          aiSummary="Tactical squad and access control staff deployed."
        />
      </div>

      {/* Embedded Live Incident Console */}
      <IncidentConsole />
    </div>
  );
}

'use client';

import React from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Heart, Activity, UserPlus, MapPin, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export function MedicalDashboard() {
  const { incidents, updateIncidentStatus } = useEventStore();
  const { addToast } = useToast();

  const medicalIncidents = incidents.filter((inc) => inc.category === 'Medical');
  const activeMedical = medicalIncidents.filter((inc) => inc.status !== 'Resolved');

  const handleTriageUpdate = (incidentId: string, status: 'InProgress' | 'Resolved') => {
    updateIncidentStatus(incidentId, status, ['medical-squad-alpha']);
    addToast({
      type: 'success',
      title: status === 'InProgress' ? 'Responder Dispatched' : 'Incident Resolved',
      description: status === 'InProgress' ? 'Triage responder team sent.' : 'Triage log resolved.',
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Medical triages"
          value={activeMedical.length}
          icon={<Heart className="w-5 h-5 text-danger" />}
          trend={{ value: 'Triage active', direction: 'neutral' }}
          aiSummary="All responders have access to defibrillators and trauma kits."
        />

        <StatCard
          title="Field Clinic Occupancy"
          value="4 / 12 beds"
          icon={<Activity className="w-5 h-5 text-primary" />}
          trend={{ value: '33% Capacity', direction: 'neutral' }}
          aiSummary="North Field Clinic is ready to receive transfers."
        />

        <StatCard
          title="Responders On Duty"
          value="8 Squads Ready"
          icon={<UserPlus className="w-5 h-5 text-success" />}
          trend={{ value: 'Operational', direction: 'neutral' }}
          aiSummary="Ambulances parked at South Gate and East ramps."
        />
      </div>

      {/* Triages details Card */}
      <Card animate={true}>
        <CardHeader>
          <CardTitle>Medical Triage Incidents</CardTitle>
          <CardDescription>Live list of reported attendee medical anomalies.</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4">
          {medicalIncidents.length === 0 ? (
            <p className="text-xs text-muted text-center py-6 select-none">No medical triage events reported.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {medicalIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="flex justify-between items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{inc.description}</span>
                      <span className="px-2 py-0.5 border text-[9px] font-bold rounded bg-danger/10 text-danger border-danger/10">
                        Severity Level {inc.severity}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {inc.location}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {inc.status === 'Reported' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleTriageUpdate(inc.id, 'InProgress')}
                        leftIcon={<Zap className="w-3.5 h-3.5" />}
                        className="py-1 h-8 text-xs bg-primary"
                      >
                        Dispatch Triage
                      </Button>
                    )}
                    {inc.status !== 'Resolved' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleTriageUpdate(inc.id, 'Resolved')}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        className="py-1 h-8 text-xs bg-success"
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {inc.status === 'Resolved' && (
                      <span className="text-xs font-bold text-success pr-2">Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

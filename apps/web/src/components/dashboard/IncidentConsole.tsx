'use client';

import React, { useState } from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { useAiCoPilot } from '@/hooks/useAiCoPilot';
import { useToast } from '@/hooks/useToast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmergencyIncident, IncidentCategory } from '@aegis/types';
import { ShieldAlert, AlertCircle, Heart, Zap, Sparkles, MapPin, Users, CheckCircle, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

export function IncidentConsole() {
  const { incidents, updateIncidentStatus, reportIncident } = useEventStore();
  const { addToast } = useToast();
  const { isStreaming, getIncidentRecommendationStream } = useAiCoPilot();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [localAiRecs, setLocalAiRecs] = useState<{ [id: string]: string }>({});

  const selectedIncident = incidents.find((inc) => inc.id === selectedIncidentId);

  // Filtered incidents list
  const filteredIncidents = incidents.filter(
    (inc) => filterCategory === 'ALL' || inc.category === filterCategory
  );

  const getSeverityStyles = (severity: number) => {
    if (severity >= 5) {
      return {
        badge: 'bg-danger/10 text-danger border-danger/20',
        text: 'text-danger font-extrabold',
        dot: 'bg-danger',
      };
    }
    if (severity >= 3) {
      return {
        badge: 'bg-warning/15 text-warning border-warning/30',
        text: 'text-warning font-bold',
        dot: 'bg-warning',
      };
    }
    return {
      badge: 'bg-primary/10 text-primary border-primary/20',
      text: 'text-primary font-medium',
      dot: 'bg-primary',
    };
  };

  const getCategoryIcon = (category: IncidentCategory) => {
    switch (category) {
      case 'Medical':
        return <Heart className="w-4 h-4 text-danger shrink-0" />;
      case 'Security':
        return <ShieldAlert className="w-4 h-4 text-warning shrink-0" />;
      case 'Crowd':
        return <Users className="w-4 h-4 text-primary shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted shrink-0" />;
    }
  };

  const handleFetchAiRecommendation = (incident: EmergencyIncident) => {
    if (isStreaming) return;
    setLocalAiRecs((prev) => ({ ...prev, [incident.id]: '' }));

    getIncidentRecommendationStream(
      incident,
      (chunk) => {
        setLocalAiRecs((prev) => ({ ...prev, [incident.id]: chunk }));
      },
      () => {
        addToast({
          type: 'ai_insight',
          title: 'AI Support Plan Generated',
          description: `Clearance recommendation ready for ${incident.category} incident.`,
        });
      }
    );
  };

  const handleDispatchTeam = (incidentId: string) => {
    updateIncidentStatus(incidentId, 'InProgress', ['team-dispatch-alpha']);
    addToast({
      type: 'success',
      title: 'Responders Dispatched',
      description: 'Emergency response squad dispatched via bypass tunnel.',
    });
  };

  const handleResolveIncident = (incidentId: string) => {
    updateIncidentStatus(incidentId, 'Resolved');
    addToast({
      type: 'success',
      title: 'Incident Resolved',
      description: 'The incident state has been marked as fully resolved.',
    });
  };

  // Mock reporting an incident quickly for demo purposes
  const handleTriggerMockIncident = () => {
    const categories: IncidentCategory[] = ['Medical', 'Security', 'Crowd', 'Infrastructure'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const id = reportIncident({
      category: randomCat,
      severity: (Math.floor(Math.random() * 4) + 2) as (1 | 2 | 3 | 4 | 5 | 6),
      status: 'Reported',
      location: `Gate ${Math.floor(Math.random() * 8) + 1}, Sector Section ${Math.floor(Math.random() * 20) + 100}`,
      description: `Reported anomaly: ${randomCat} event requiring operations supervisor check.`,
      assignedTeamIds: [],
    });

    setSelectedIncidentId(id);
    addToast({
      type: 'live_event',
      title: 'New Emergency Reported',
      description: `Incoming ${randomCat} notification registered in state.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Incident List Sidebar */}
      <Card className="md:col-span-1 flex flex-col h-[550px] overflow-hidden" animate={true}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-base font-extrabold flex gap-2 items-center">
              <ShieldAlert className="w-5 h-5 text-danger" />
              Live Incidents
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleTriggerMockIncident} className="text-xs h-7 px-2">
              Mock Incident
            </Button>
          </div>
          <CardDescription>
            Live security & medical notifications feed.
          </CardDescription>
          
          {/* Category Filter Pills with integrated bottom border divider */}
          <div className="flex gap-2 mt-4 pb-3.5 border-b border-card-border/30 w-full overflow-x-auto select-none scrollbar-none">
            {['ALL', 'Security', 'Medical', 'Crowd'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={clsx(
                  'px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border cursor-pointer transition-colors shrink-0',
                  filterCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-foreground/5 text-muted border-card-border/50 hover:bg-foreground/10'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto flex-1 p-4 pt-4 gap-2 flex flex-col">
          {filteredIncidents.length === 0 ? (
            <div className="text-center text-xs text-muted py-8 select-none">
              All clear. No active incidents.
            </div>
          ) : (
            filteredIncidents.map((inc) => {
              const sev = getSeverityStyles(inc.severity);
              const isSelected = selectedIncidentId === inc.id;
              
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={clsx(
                    'p-3.5 border rounded-xl cursor-pointer flex flex-col gap-2 transition-all hover:bg-foreground/[0.03]',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                      : 'border-card-border/40 bg-foreground/[0.01]'
                  )}
                >
                  <div className="flex justify-between items-center w-full gap-2">
                    <span className="flex gap-1.5 items-center text-xs font-bold text-foreground">
                      {getCategoryIcon(inc.category)}
                      {inc.category}
                    </span>
                    <span className={clsx('px-2 py-0.5 border text-[9px] font-bold rounded-md uppercase tracking-wider', sev.badge)}>
                      Lvl {inc.severity}
                    </span>
                  </div>
                  
                  <p className="text-xs text-foreground/80 truncate font-semibold">
                    {inc.description}
                  </p>

                  <div className="flex justify-between items-center w-full text-[10px] text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {inc.location.split(',')[0]}
                    </span>
                    <span className="font-medium">
                      Status: <span className="font-bold text-foreground">{inc.status}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Incident Details Pane */}
      <Card className="md:col-span-2 flex flex-col h-[550px] overflow-hidden" animate={true}>
        {selectedIncident ? (
          <div className="flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b border-card-border/40 pb-5">
              <div className="flex justify-between items-start w-full gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted tracking-wide uppercase flex gap-1 items-center">
                    {getCategoryIcon(selectedIncident.category)}
                    {selectedIncident.category} Emergency
                  </span>
                  <CardTitle className="text-xl font-extrabold tracking-tight">
                    {selectedIncident.location}
                  </CardTitle>
                </div>
                
                <span className={clsx(
                  'px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest',
                  getSeverityStyles(selectedIncident.severity).badge
                )}>
                  Severity Level {selectedIncident.severity}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Incident Details */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted select-none">
                  Description of Threat/Anomaly
                </h4>
                <p className="text-sm font-semibold text-foreground/90 leading-relaxed bg-foreground/[0.02] border border-card-border/40 p-4 rounded-xl">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-card-border/40 rounded-xl bg-foreground/[0.01]">
                  <span className="text-xs font-bold text-muted uppercase">Dispatch Status</span>
                  <p className="text-sm font-extrabold text-foreground mt-1">{selectedIncident.status}</p>
                </div>
                <div className="p-4 border border-card-border/40 rounded-xl bg-foreground/[0.01]">
                  <span className="text-xs font-bold text-muted uppercase">Assigned Squads</span>
                  <p className="text-sm font-extrabold text-primary mt-1">
                    {selectedIncident.assignedTeamIds.length > 0
                      ? selectedIncident.assignedTeamIds.join(', ')
                      : 'None Assigned'}
                  </p>
                </div>
              </div>

              {/* AI Co-Pilot Recommendation section */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary select-none flex gap-1.5 items-center">
                    <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                    AI Incident Resolution plan
                  </h4>
                  {!localAiRecs[selectedIncident.id] && (
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => handleFetchAiRecommendation(selectedIncident)}
                      disabled={isStreaming}
                      leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}
                      className="text-xs py-1 h-8"
                    >
                      Generate AI Plan
                    </Button>
                  )}
                </div>

                {localAiRecs[selectedIncident.id] && (
                  <div className="glass-panel p-4 border-secondary/20 bg-secondary/5 font-mono text-xs text-foreground/90 leading-normal overflow-x-auto max-h-[160px] whitespace-pre-wrap">
                    {localAiRecs[selectedIncident.id]}
                    {isStreaming && <span className="animate-pulse font-bold text-secondary">█</span>}
                  </div>
                )}

                {selectedIncident.aiRecommendation && !localAiRecs[selectedIncident.id] && (
                  <div className="glass-panel p-4 border-secondary/20 bg-secondary/5 font-mono text-xs text-foreground/90 leading-normal max-h-[160px] overflow-x-auto whitespace-pre-wrap">
                    {selectedIncident.aiRecommendation}
                    <div className="text-[10px] text-secondary font-bold mt-2">
                      Historical Confidence: {selectedIncident.aiConfidence}%
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Controller Actions */}
            <div className="p-6 border-t border-card-border/40 bg-foreground/[0.02] flex justify-end gap-3">
              {selectedIncident.status === 'Reported' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDispatchTeam(selectedIncident.id)}
                  leftIcon={<Zap className="w-4 h-4" />}
                >
                  Authorize Dispatch
                </Button>
              )}
              {selectedIncident.status === 'Assigned' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDispatchTeam(selectedIncident.id)}
                  leftIcon={<Zap className="w-4 h-4" />}
                >
                  Acknowledge Dispatch
                </Button>
              )}
              {selectedIncident.status !== 'Resolved' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleResolveIncident(selectedIncident.id)}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Resolve Threat
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted">
            <ShieldAlert className="w-12 h-12 mb-3 text-muted/50" />
            <h3 className="font-extrabold text-foreground text-sm">No Emergency Selected</h3>
            <p className="text-xs max-w-xs mt-1">Select an incident from the operational feed to generate AI resolution paths and dispatch response teams.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

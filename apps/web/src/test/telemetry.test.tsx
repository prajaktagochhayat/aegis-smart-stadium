import { describe, it, expect, beforeEach } from 'vitest';
import { useEventStore } from '../hooks/useEventStore';

describe('Real-Time Event State & Telemetry Store Tests', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useEventStore.setState({
      zones: [
        {
          id: 'zone-n-gate',
          stadiumId: 'stadium-main',
          name: 'North Gate Access Area',
          capacity: 15000,
          currentOccupancy: 12000,
          crowdScore: 80,
        },
      ],
      alerts: [],
      incidents: [],
      tasks: [],
      routes: [],
      parkingLots: [],
      isStreaming: false,
    });
  });

  it('should initialize with correct default state', () => {
    const state = useEventStore.getState();
    expect(state.zones).toHaveLength(1);
    expect(state.alerts).toHaveLength(0);
    expect(state.incidents).toHaveLength(0);
    expect(state.isStreaming).toBe(false);
  });

  it('should support updating zone parameters', () => {
    useEventStore.getState().updateZone('zone-n-gate', {
      currentOccupancy: 14000,
      crowdScore: 93,
    });

    const zone = useEventStore.getState().zones[0];
    expect(zone.currentOccupancy).toBe(14000);
    expect(zone.crowdScore).toBe(93);
  });

  it('should add a new crowd alert', () => {
    useEventStore.getState().addAlert({
      severity: 'critical',
      location: 'North Gate Access Area',
      cause: 'Access bottle neck',
      explanation: 'Gate queue time exceeding limits.',
      recommendedActions: ['Reroute traffic to West Gate'],
    });

    const alerts = useEventStore.getState().alerts;
    expect(alerts).toHaveLength(1);
    expect(alerts[0].location).toBe('North Gate Access Area');
    expect(alerts[0].severity).toBe('critical');
    expect(alerts[0].id).toBeDefined();
  });

  it('should resolve an active alert by removing it from the queue', () => {
    useEventStore.getState().addAlert({
      severity: 'warning',
      location: 'North Gate Access Area',
      cause: 'Friction',
      explanation: 'Minor friction near Gate 3 vendor stalls.',
      recommendedActions: ['Deploy guardens'],
    });

    const alertId = useEventStore.getState().alerts[0].id;
    useEventStore.getState().resolveAlert(alertId);

    const alerts = useEventStore.getState().alerts;
    expect(alerts).toHaveLength(0);
  });

  it('should report a new emergency incident', () => {
    const newId = useEventStore.getState().reportIncident({
      category: 'Medical',
      severity: 4,
      status: 'Reported',
      location: 'Sector B Entrance',
      description: 'Attendee passed out near turnstile.',
      assignedTeamIds: [],
    });

    const incidents = useEventStore.getState().incidents;
    expect(incidents).toHaveLength(1);
    expect(incidents[0].id).toBe(newId);
    expect(incidents[0].category).toBe('Medical');
    expect(incidents[0].reportTime).toBeDefined();
  });

  it('should update incident status and assignment', () => {
    const id = useEventStore.getState().reportIncident({
      category: 'Medical',
      severity: 4,
      status: 'Reported',
      location: 'Sector B Entrance',
      description: 'Attendee passed out near turnstile.',
      assignedTeamIds: [],
    });

    useEventStore.getState().updateIncidentStatus(id, 'Resolved', ['team-medical-02']);

    const incident = useEventStore.getState().incidents[0];
    expect(incident.status).toBe('Resolved');
    expect(incident.assignedTeamIds).toContain('team-medical-02');
  });
});

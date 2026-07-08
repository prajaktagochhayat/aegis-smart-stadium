'use client';

import { create } from 'zustand';
import {
  StadiumZone,
  CrowdAlert,
  EmergencyIncident,
  VolunteerTask,
  TransportRoute,
  ParkingLotStatus,
} from '@aegis/types';
import { generateMockId } from '@aegis/utils';

interface EventStore {
  // Core State
  zones: StadiumZone[];
  alerts: CrowdAlert[];
  incidents: EmergencyIncident[];
  tasks: VolunteerTask[];
  routes: TransportRoute[];
  parkingLots: ParkingLotStatus[];
  isStreaming: boolean;

  // Actions - Zones
  updateZone: (zoneId: string, updates: Partial<StadiumZone>) => void;
  
  // Actions - Alerts
  addAlert: (alert: Omit<CrowdAlert, 'id' | 'timestamp'>) => void;
  resolveAlert: (alertId: string) => void;
  
  // Actions - Incidents
  reportIncident: (incident: Omit<EmergencyIncident, 'id' | 'reportTime'>) => string;
  updateIncidentStatus: (incidentId: string, status: EmergencyIncident['status'], assignedTeamIds?: string[]) => void;
  
  // Actions - Volunteer Tasks
  addTask: (task: Omit<VolunteerTask, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: VolunteerTask['status']) => void;
  
  // Actions - Transport & Parking
  updateRoute: (routeId: string, updates: Partial<TransportRoute>) => void;
  updateParkingLot: (lotId: string, updates: Partial<ParkingLotStatus>) => void;

  // Real-Time Simulator Control
  startMockStreaming: () => () => void;
  stopMockStreaming: () => void;
}

// Initial Mock Datasets aligned exactly with @aegis/types
const initialZones: StadiumZone[] = [
  {
    id: 'zone-n-upper',
    stadiumId: 'stadium-main',
    name: 'North Upper',
    capacity: 10000,
    currentOccupancy: 8200,
    crowdScore: 82,
  },
  {
    id: 'zone-n-lower',
    stadiumId: 'stadium-main',
    name: 'North Lower',
    capacity: 8000,
    currentOccupancy: 6100,
    crowdScore: 76,
  },
  {
    id: 'zone-s-upper',
    stadiumId: 'stadium-main',
    name: 'South Upper',
    capacity: 10000,
    currentOccupancy: 9100,
    crowdScore: 91,
  },
  {
    id: 'zone-s-lower',
    stadiumId: 'stadium-main',
    name: 'South Lower',
    capacity: 8000,
    currentOccupancy: 7400,
    crowdScore: 92,
  },
  {
    id: 'zone-e-upper',
    stadiumId: 'stadium-main',
    name: 'East Upper',
    capacity: 12000,
    currentOccupancy: 11520,
    crowdScore: 96,
  },
  {
    id: 'zone-e-lower',
    stadiumId: 'stadium-main',
    name: 'East Lower',
    capacity: 10000,
    currentOccupancy: 8100,
    crowdScore: 81,
  },
  {
    id: 'zone-w-upper',
    stadiumId: 'stadium-main',
    name: 'West Upper',
    capacity: 12000,
    currentOccupancy: 7800,
    crowdScore: 65,
  },
  {
    id: 'zone-w-lower',
    stadiumId: 'stadium-main',
    name: 'West Lower',
    capacity: 10000,
    currentOccupancy: 6800,
    crowdScore: 68,
  },
];

const initialAlerts: CrowdAlert[] = [
  {
    id: 'alt-1',
    severity: 'warning',
    location: 'South Lower',
    cause: 'Heavy foot traffic',
    explanation: 'High crowd density detected near South food counters.',
    recommendedActions: ['Redirect incoming fans to West Concourse outlets', 'Deploy crowd wardens'],
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
];

const initialIncidents: EmergencyIncident[] = [
  {
    id: 'inc-1',
    category: 'Security',
    severity: 3,
    status: 'Assigned',
    location: 'Section 104, beside East Lower entrance.',
    description: 'Minor crowd friction near Gate 3 vendor stalls.',
    reportTime: new Date(Date.now() - 600000).toISOString(),
    assignedTeamIds: ['team-security-405'],
    aiRecommendation: 'Deploy additional nearby patrol to separate crowd clusters.',
    aiConfidence: 85,
  },
];

const initialTasks: VolunteerTask[] = [
  {
    id: 'tsk-1',
    volunteerId: 'usr-volunteer-50',
    title: 'Assist Accessibility Group',
    description: 'Direct wheelchair attendees coming from Metro exit to Gate A elevator.',
    status: 'InProgress',
    priority: 'HIGH',
    location: 'North Upper access ramp',
    deadline: new Date(Date.now() + 3600000).toISOString(),
    assignedBy: 'usr-organizer-02',
  },
  {
    id: 'tsk-2',
    volunteerId: 'unassigned',
    title: 'Recycling Bag Distribution',
    description: 'Provide paper recycling bags to fans in West block during halftime.',
    status: 'Assigned',
    priority: 'MEDIUM',
    location: 'West Lower Seating',
    deadline: new Date(Date.now() + 7200000).toISOString(),
    assignedBy: 'usr-organizer-02',
  },
];

const initialRoutes: TransportRoute[] = [
  {
    id: 'rt-metro-line-1',
    name: 'Metro Express Line 1 (Stadium Stn)',
    mode: 'metro',
    etaMinutes: 4,
    status: 'normal',
    crowdLevel: 'HIGH',
  },
  {
    id: 'rt-shuttle-east',
    name: 'Shuttle Bus East Parking Connect',
    mode: 'shuttle',
    etaMinutes: 12,
    status: 'delayed',
    crowdLevel: 'CRITICAL',
  },
  {
    id: 'rt-shuttle-3',
    name: 'Shuttle Route 3 (West Walkway)',
    mode: 'shuttle',
    etaMinutes: 8,
    status: 'delayed',
    crowdLevel: 'HIGH',
  },
];

const initialParkingLots: ParkingLotStatus[] = [
  {
    id: 'lot-a',
    name: 'Lot A (VIP North)',
    totalSpaces: 500,
    occupiedSpaces: 482,
    accessibleSpaces: 20,
    isFull: true,
  },
  {
    id: 'lot-b',
    name: 'Lot B (General South)',
    totalSpaces: 2000,
    occupiedSpaces: 1450,
    accessibleSpaces: 80,
    isFull: false,
  },
  {
    id: 'lot-c',
    name: 'Lot C (East Concourse)',
    totalSpaces: 1500,
    occupiedSpaces: 1480,
    accessibleSpaces: 50,
    isFull: true,
  },
  {
    id: 'lot-d',
    name: 'Lot D (West Concourse)',
    totalSpaces: 1500,
    occupiedSpaces: 920,
    accessibleSpaces: 50,
    isFull: false,
  },
  {
    id: 'lot-e',
    name: 'Lot E (Media Lot)',
    totalSpaces: 300,
    occupiedSpaces: 120,
    accessibleSpaces: 10,
    isFull: false,
  },
  {
    id: 'lot-f',
    name: 'Lot F (Overflow Bus)',
    totalSpaces: 800,
    occupiedSpaces: 790,
    accessibleSpaces: 30,
    isFull: true,
  },
];

let simulatorInterval: NodeJS.Timeout | null = null;

export const useEventStore = create<EventStore>((set, get) => ({
  zones: initialZones,
  alerts: initialAlerts,
  incidents: initialIncidents,
  tasks: initialTasks,
  routes: initialRoutes,
  parkingLots: initialParkingLots,
  isStreaming: false,

  updateZone: (zoneId, updates) =>
    set((state) => ({
      zones: state.zones.map((z) => (z.id === zoneId ? { ...z, ...updates } : z)),
    })),

  addAlert: (alert) => {
    const newAlert: CrowdAlert = {
      ...alert,
      id: `alt-${generateMockId()}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
  },

  resolveAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId), // Resolving deletes it from active queue
    })),

  reportIncident: (incident) => {
    const id = `inc-${generateMockId()}`;
    const newIncident: EmergencyIncident = {
      ...incident,
      id,
      reportTime: new Date().toISOString(),
    };
    set((state) => ({
      incidents: [newIncident, ...state.incidents],
    }));
    return id;
  },

  updateIncidentStatus: (incidentId, status, assignedTeamIds) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status,
              assignedTeamIds: assignedTeamIds || inc.assignedTeamIds,
            }
          : inc
      ),
    })),

  addTask: (task) => {
    const newTask: VolunteerTask = {
      ...task,
      id: `tsk-${generateMockId()}`,
    };
    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
  },

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),

  updateRoute: (routeId, updates) =>
    set((state) => ({
      routes: state.routes.map((r) => (r.id === routeId ? { ...r, ...updates } : r)),
    })),

  updateParkingLot: (lotId, updates) =>
    set((state) => ({
      parkingLots: state.parkingLots.map((l) => (l.id === lotId ? { ...l, ...updates } : l)),
    })),

  startMockStreaming: () => {
    if (simulatorInterval) return () => {};

    set({ isStreaming: true });

    const tick = () => {
      const state = get();

      // 1. Simulate minor variations in zone occupancies
      const updatedZones = state.zones.map((z) => {
        const delta = Math.floor((Math.random() - 0.5) * 50);
        const nextOccupancy = Math.max(0, Math.min(z.capacity, z.currentOccupancy + delta));
        const crowdPercentage = nextOccupancy / z.capacity;
        
        return {
          ...z,
          currentOccupancy: nextOccupancy,
          crowdScore: Math.floor(crowdPercentage * 100),
        };
      });

      // 2. Add an alert if crowdScore passes 95%
      const alertsToAdd: CrowdAlert[] = [];
      updatedZones.forEach((z) => {
        const hasActiveAlert = state.alerts.some((a) => a.location === z.name);
        if (z.crowdScore > 95 && !hasActiveAlert) {
          alertsToAdd.push({
            id: `alt-${generateMockId()}`,
            severity: 'critical',
            location: z.name,
            cause: 'Zone Congestion',
            explanation: `Crowd score of ${z.crowdScore}% exceeded critical safety threshold.`,
            recommendedActions: ['Initiate bypass routing', 'Notify security'],
            timestamp: new Date().toISOString(),
          });
        }
      });

      // 3. Update Transport & Parking wait times/spaces
      const updatedRoutes = state.routes.map((r) => {
        const deltaEta = Math.floor((Math.random() - 0.5) * 3);
        const nextEta = Math.max(1, r.etaMinutes + deltaEta);
        
        let crowdLvl: CrowdRouteDensity = 'LOW';
        if (nextEta > 10) crowdLvl = 'CRITICAL';
        else if (nextEta > 6) crowdLvl = 'HIGH';
        else if (nextEta > 3) crowdLvl = 'MEDIUM';

        return {
          ...r,
          etaMinutes: nextEta,
          crowdLevel: crowdLvl as any,
          status: (nextEta > 10 ? 'delayed' : 'normal') as any,
        };
      });

      const updatedParking = state.parkingLots.map((l) => {
        const delta = Math.floor((Math.random() - 0.5) * 8);
        const nextOccupied = Math.max(0, Math.min(l.totalSpaces, l.occupiedSpaces + delta));
        
        return {
          ...l,
          occupiedSpaces: nextOccupied,
          isFull: nextOccupied >= l.totalSpaces,
        };
      });

      set((curr) => ({
        zones: updatedZones,
        alerts: alertsToAdd.length > 0 ? [...alertsToAdd, ...curr.alerts] : curr.alerts,
        routes: updatedRoutes,
        parkingLots: updatedParking,
      }));
    };

    if (process.env.NODE_ENV !== 'test') {
      simulatorInterval = setInterval(tick, 3500);
    }

    return () => {
      if (simulatorInterval) {
        clearInterval(simulatorInterval);
        simulatorInterval = null;
      }
      set({ isStreaming: false });
    };
  },

  stopMockStreaming: () => {
    if (simulatorInterval) {
      clearInterval(simulatorInterval);
      simulatorInterval = null;
      set({ isStreaming: false });
    }
  },
}));

type CrowdRouteDensity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

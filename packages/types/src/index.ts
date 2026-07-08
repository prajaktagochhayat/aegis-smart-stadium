// AEGIS StadiumOS Shared Types

// --- Authentication & User Roles ---
export type UserRole =
  | 'Fan'
  | 'Volunteer'
  | 'Organizer'
  | 'Security'
  | 'Medical'
  | 'Accessibility'
  | 'Sustainability'
  | 'Administrator'
  | 'Super Administrator';

export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  preferredLanguage: string;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  lastLogin: string;
  location?: string;
  isTrusted: boolean;
}

// --- Stadium & Structure ---
export interface Stadium {
  id: string;
  name: string;
  capacity: number;
  location: string;
}

export interface StadiumZone {
  id: string;
  stadiumId: string;
  name: string; // e.g. North Gate, Section C, Food Court
  capacity: number;
  currentOccupancy: number;
  crowdScore: number; // 0 to 100
}

export interface Seat {
  id: string;
  zoneId: string;
  section: string;
  row: string;
  number: string;
  isAccessible: boolean;
}

// --- Crowd Intelligence ---
export type CrowdDensityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export interface CrowdZoneMetric {
  zoneId: string;
  zoneName: string;
  densityLevel: CrowdDensityLevel;
  occupancyPercent: number;
  waitingTimeMinutes: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CrowdAlert {
  id: string;
  severity: 'info' | 'warning' | 'high_risk' | 'critical' | 'emergency';
  location: string;
  cause: string;
  explanation: string;
  recommendedActions: string[];
  timestamp: string;
}

// --- Emergency & Incident Management ---
export type IncidentCategory =
  | 'Medical'
  | 'Security'
  | 'Crowd'
  | 'Infrastructure'
  | 'Weather'
  | 'Accessibility'
  | 'Transport';

export type IncidentStatus =
  | 'Reported'
  | 'Verified'
  | 'Assigned'
  | 'InProgress'
  | 'Resolved'
  | 'Escalated';

export interface EmergencyIncident {
  id: string;
  category: IncidentCategory;
  severity: 1 | 2 | 3 | 4 | 5 | 6; // Level 1 (Info) to Level 6 (Evacuation)
  status: IncidentStatus;
  location: string; // Specific section or zone
  description: string;
  reportTime: string;
  assignedTeamIds: string[];
  aiRecommendation?: string;
  aiConfidence?: number; // 0 to 100
  resolvedAt?: string;
}

// --- Volunteer Console ---
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus =
  | 'Assigned'
  | 'Accepted'
  | 'InProgress'
  | 'Waiting'
  | 'Completed'
  | 'Cancelled'
  | 'Escalated';

export interface VolunteerTask {
  id: string;
  volunteerId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  location: string;
  deadline: string;
  assignedBy: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  skills: string[];
  languages: string[];
  isAvailable: boolean;
  currentZone?: string;
}

// --- Transportation ---
export interface TransportRoute {
  id: string;
  name: string;
  mode: 'metro' | 'bus' | 'shuttle' | 'walking' | 'ride_share';
  status: 'normal' | 'delayed' | 'suspended';
  etaMinutes: number;
  crowdLevel: CrowdDensityLevel;
}

export interface ParkingLotStatus {
  id: string;
  name: string;
  totalSpaces: number;
  occupiedSpaces: number;
  accessibleSpaces: number;
  isFull: boolean;
}

// --- Sustainability ---
export interface SustainabilityMetrics {
  energyUsageKwh: number;
  waterUsageLiters: number;
  wasteCollectedKg: number;
  recyclingRatePercent: number;
  carbonEmissionKg: number;
}

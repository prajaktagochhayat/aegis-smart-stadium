// AEGIS StadiumOS 3D Mapping Utilities & Data

export const hoverData: Record<
  string,
  {
    block: string;
    gate: string;
    arrivalTime: string;
    exitTime: string;
    security: string;
    route: string;
  }
> = {
  'zone-n-upper': { block: 'N-301 to N-310', gate: 'Gate A (North)', arrivalTime: '18 mins', exitTime: '12 mins', security: 'Level 1 (Low)', route: 'Exit Route Alpha' },
  'zone-n-lower': { block: 'N-101 to N-112', gate: 'Gate B (North-East)', arrivalTime: '12 mins', exitTime: '8 mins', security: 'Level 1 (Low)', route: 'Exit Route Bravo' },
  'zone-s-upper': { block: 'S-301 to S-310', gate: 'Gate C (South)', arrivalTime: '22 mins', exitTime: '15 mins', security: 'Level 2 (Med)', route: 'Exit Route Charlie' },
  'zone-s-lower': { block: 'S-101 to S-112', gate: 'Gate D (South-West)', arrivalTime: '15 mins', exitTime: '10 mins', security: 'Level 3 (High)', route: 'Exit Route Delta' },
  'zone-e-upper': { block: 'E-301 to E-312', gate: 'Gate E (East-Upper)', arrivalTime: '25 mins', exitTime: '18 mins', security: 'Level 2 (Med)', route: 'Exit Route Echo' },
  'zone-e-lower': { block: 'E-101 to F-115', gate: 'Gate F (East-Concourse)', arrivalTime: '14 mins', exitTime: '9 mins', security: 'Level 1 (Low)', route: 'Exit Route Foxtrot' },
  'zone-w-upper': { block: 'W-301 to W-312', gate: 'Gate G (West-Upper)', arrivalTime: '16 mins', exitTime: '11 mins', security: 'Level 1 (Low)', route: 'Exit Route Golf' },
  'zone-w-lower': { block: 'W-101 to W-115', gate: 'Gate H (West-Concourse)', arrivalTime: '10 mins', exitTime: '6 mins', security: 'Level 1 (Low)', route: 'Exit Route Hotel' },
};

export const getZoneColor = (score: number, activeTwinPanel: string) => {
  if (activeTwinPanel === 'Live Crowd Heatmap') {
    if (score >= 90) return '#ef4444';
    if (score >= 80) return '#f97316';
    if (score >= 70) return '#eab308';
    return '#22c55e';
  }
  
  if (activeTwinPanel === 'Security Command') {
    if (score >= 90) return '#7f1d1d';
    return '#3b82f6';
  }

  if (activeTwinPanel === 'Emergency Evacuation') {
    return '#a855f7';
  }

  if (score >= 90) return '#ef4444';
  if (score >= 80) return '#fbbf24';
  return '#10b981';
};

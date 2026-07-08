'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

// Safely lazy-load the R3F WebGL canvas to prevent SSR build failures
const StadiumMap3DCanvas = dynamic(() => import('./StadiumMap3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[350px] relative bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center flex-col gap-3">
      <Skeleton className="w-full h-full absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center gap-1.5 animate-pulse text-xs text-white/50 select-none">
        <span>Initializing WebGL 3D Canvas</span>
      </div>
    </div>
  ),
});

interface StadiumMap3DProps {
  onSelectZone?: (zoneId: string) => void;
  selectedZoneId?: string | null;
  activetwinPanel?: string;
}

export function StadiumMap3D({ onSelectZone, selectedZoneId, activetwinPanel }: StadiumMap3DProps) {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-card-border/60 shadow-lg">
      <StadiumMap3DCanvas onSelectZone={onSelectZone} selectedZoneId={selectedZoneId} activetwinPanel={activetwinPanel} />
    </div>
  );
}

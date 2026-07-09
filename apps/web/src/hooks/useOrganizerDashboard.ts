'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEventStore } from '@/hooks/useEventStore';

export function useOrganizerDashboard() {
  const { zones, alerts, routes, parkingLots, updateZone } = useEventStore();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'analytics' | 'diagnostics'>('telemetry');
  
  // Digital Twin Control Panel Pill Selection
  const [activeTwinPanel, setActiveTwinPanel] = useState('Stadium Overview');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Live pulsing state fluctuations for 34 metrics
  const [fluctuator, setFluctuator] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFluctuator((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Simulated countdown values
  const [countdown, setCountdown] = useState({ hours: 14, mins: 42, secs: 18 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { hours: prev.hours, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, mins: 59, secs: 59 };
        return { hours: 0, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Map individual seating zones
  const zonesMap = zones.reduce((acc, z) => {
    acc[z.id] = z;
    return acc;
  }, {} as Record<string, typeof zones[0]>);

  const getZonePercent = (id: string, defVal: number, defCap: number) => {
    const z = zonesMap[id];
    if (!z) return Math.floor((defVal / defCap) * 100);
    return Math.floor((z.currentOccupancy / z.capacity) * 100);
  };

  // Calculations for Left Sidebar
  const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const occupancyPercent = totalCapacity > 0 ? Math.floor((totalOccupancy / totalCapacity) * 100) : 0;
  
  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) {
      updateZone(zoneId, {
        currentOccupancy: Math.min(zone.capacity, zone.currentOccupancy + 150),
      });
    }
  };

  // 34 Analytics Cards calculations with simulated fluctuations
  const mockPulsedPercent = (base: number, freq: number) => {
    const sinOffset = Math.sin(fluctuator * freq) * 3;
    return Math.max(1, Math.min(99, Math.floor(base + sinOffset)));
  };

  // --- Real GenAI Recommendations Generation ---
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateAiInsights = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiInsights('');
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: 'Reason over the active zone occupancy levels, incidents, alerts, and transport routes to generate exactly two short, actionable bullet points (starting with "* ") of operational recommendations for stadium staff. Keep it under 40 words total.' 
            }
          ],
          telemetry: {
            zones,
            alerts,
            routes,
            parkingLots,
          }
        })
      });

      if (!response.ok) throw new Error('API error');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const data = JSON.parse(dataStr);
                const content = data.choices?.[0]?.delta?.content || data.delta?.text || '';
                if (content) {
                  streamedText += content;
                  setAiInsights(streamedText);
                }
              } catch {
                // Ignore partial JSON parse errors
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('[AEGIS AI Dashboard] Failed to load GenAI insights. Falling back to dynamic heuristics.', err);
      
      // Fallback to dynamic heuristics reasoning over actual state so it is never static!
      const highZones = zones.filter(z => (z.currentOccupancy / z.capacity) > 0.85);
      const activeAlerts = alerts.length;
      let rec1 = "* Crowd densities are normal. Maintain standard gate monitoring.";
      let rec2 = "* Public transport running smoothly. Monitor shuttle flow.";

      if (highZones.length > 0) {
        rec1 = `* ${highZones[0].name} has exceeded 85% occupancy. Reroute incoming fans to adjacent sectors.`;
      }
      if (activeAlerts > 0) {
        rec2 = `* Alert: ${alerts[0].cause} reported. Dispatch staff via designated safety corridors.`;
      }
      setAiInsights(`${rec1}\n${rec2}`);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, zones, alerts, routes, parkingLots]);

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
      const timer = setTimeout(() => {
        generateAiInsights();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [generateAiInsights]);

  return {
    // States
    activeTab,
    setActiveTab,
    activeTwinPanel,
    setActiveTwinPanel,
    selectedZoneId,
    setSelectedZoneId,
    fluctuator,
    countdown,
    // Store data & actions
    zones,
    alerts,
    routes,
    parkingLots,
    updateZone,
    // Helpers & Metrics
    zonesMap,
    getZonePercent,
    totalOccupancy,
    totalCapacity,
    occupancyPercent,
    handleSelectZone,
    mockPulsedPercent,
    // GenAI
    aiInsights,
    isGenerating,
    generateAiInsights,
  };
}

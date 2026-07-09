'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useEventStore } from '@/hooks/useEventStore';
import { useTheme } from '@/components/ThemeProvider';
import { StadiumZone } from '@aegis/types';
import { hoverData, getZoneColor as getZoneColorUtil } from '@/lib/stadiumUtils';


interface CurvedStandProps {
  zone: StadiumZone;
  radiusTop: number;
  radiusBottom: number;
  y: number;
  height: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  onHover: (zoneId: string | null) => void;
  isDark: boolean;
  thetaStart: number;
  thetaLength: number;
}

function CurvedStand({
  zone,
  radiusTop,
  radiusBottom,
  y,
  height,
  color,
  isSelected,
  onClick,
  onHover,
  isDark,
  thetaStart,
  thetaLength
}: CurvedStandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (groupRef.current) {
      const scale = isSelected ? 1.05 : hovered ? 1.025 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
    }
  });

  // Render concentric tiered rows inside the stand
  const rows = [];
  const stepCount = 3;
  for (let r = 0; r < stepCount; r++) {
    const frac = r / (stepCount - 1);
    const rowRadTop = radiusBottom + (radiusTop - radiusBottom) * frac;
    const rowRadBottom = radiusBottom + (radiusTop - radiusBottom) * frac * 0.95;
    const rowY = height * frac * 0.75;
    const rowHeight = height * 0.15;

    rows.push(
      <mesh key={`row-${r}`} position={[0, rowY + rowHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[rowRadTop, rowRadBottom, rowHeight, 32, 1, true, thetaStart, thetaLength]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.95 : hovered ? 1.4 : isDark ? 0.6 : 0.3}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[0, y, 0]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(zone.id);
        if (typeof window !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        if (typeof window !== 'undefined') {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* Wireframe Grid Shell */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radiusTop, radiusBottom, height, 32, 6, true, thetaStart, thetaLength]} />
        <meshStandardMaterial
          wireframe={true}
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.85 : hovered ? 1.25 : isDark ? 0.5 : 0.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Tiered Rows */}
      {rows}

      {/* Semi-transparent backplate */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radiusTop, radiusBottom, height, 32, 6, true, thetaStart, thetaLength]} />
        <meshStandardMaterial
          transparent={true}
          opacity={isSelected ? 0.35 : hovered ? 0.22 : 0.08}
          color={color}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// LED Ribbon Board with glowing pulse
function LedRibbonBoard({ isDark }: { isDark: boolean }) {
  const ribbonRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (ribbonRef.current) {
      ribbonRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      
      // Dynamic breathing glow
      const time = state.clock.getElapsedTime();
      if (ribbonRef.current.material instanceof THREE.MeshStandardMaterial) {
        ribbonRef.current.material.emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.3;
      }
    }
  });

  return (
    <mesh ref={ribbonRef} position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[7.15, 7.18, 64]} />
      <meshStandardMaterial 
        color={isDark ? '#ef4444' : '#dc2626'} 
        emissive={isDark ? '#ef4444' : '#dc2626'}
        emissiveIntensity={0.8}
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}

// Floating Structural Roof Canopy Truss
function RoofCanopy({ isDark }: { isDark: boolean }) {
  const canopyRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (canopyRef.current) {
      const time = state.clock.getElapsedTime();
      if (canopyRef.current.material instanceof THREE.MeshStandardMaterial) {
        canopyRef.current.material.emissiveIntensity = 0.9 + Math.sin(time * 1.5) * 0.3;
      }
    }
  });

  return (
    <group position={[0, 2.2, 0]}>
      {/* Floating Ring Truss */}
      <mesh ref={canopyRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <ringGeometry args={[6.8, 7.3, 64]} />
        <meshStandardMaterial
          wireframe={true}
          color={isDark ? '#3b82f6' : '#2563eb'}
          emissive={isDark ? '#3b82f6' : '#2563eb'}
          emissiveIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer Truss Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[7.28, 7.3, 64]} />
        <meshStandardMaterial color={isDark ? '#475569' : '#94a3b8'} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Glowing Pitch Goalposts
function Goalpost({ position, rotationY }: { position: [number, number, number]; rotationY: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Left Post */}
      <mesh position={[-0.3, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.36, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Right Post */}
      <mesh position={[0.3, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.36, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.013, 0.013, 0.6, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Net frame */}
      <mesh position={[0, 0.18, -0.1]}>
        <boxGeometry args={[0.6, 0.36, 0.2]} />
        <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// Low Pitch Boundary Wall
function PitchWall({ isDark }: { isDark: boolean }) {
  return (
    <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[4.2, 4.23, 64]} />
      <meshStandardMaterial 
        color={isDark ? '#1e293b' : '#cbd5e1'} 
        roughness={0.7} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}

// Animated Spectator Flowing Particles
function SpectatorFlow({ isDark }: { isDark: boolean }) {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();
  
  const particles = useRef<Array<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
    speed: number;
    gateIndex: number;
  }>>([]);

  useEffect(() => {
    const gates = [
      new THREE.Vector3(0, 0.08, -8.5), // North Gate
      new THREE.Vector3(0, 0.08, 8.5),  // South Gate
      new THREE.Vector3(9.5, 0.08, 0),  // East Gate
      new THREE.Vector3(-9.5, 0.08, 0), // West Gate
    ];

    particles.current = Array.from({ length: count }).map(() => {
      const gateIndex = Math.floor(Math.random() * gates.length);
      const start = gates[gateIndex].clone();
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 4.5 + Math.random() * 2.0;
      const target = new THREE.Vector3(
        Math.cos(angle) * radius,
        0.3 + Math.random() * 1.5,
        Math.sin(angle) * radius
      );

      return {
        pos: start,
        target,
        speed: 0.015 + Math.random() * 0.02,
        gateIndex,
      };
    });
  }, []);

  useFrame(() => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (!meshRef.current || particles.current.length === 0) return;

    const gates = [
      new THREE.Vector3(0, 0.08, -8.5),
      new THREE.Vector3(0, 0.08, 8.5),
      new THREE.Vector3(9.5, 0.08, 0),
      new THREE.Vector3(-9.5, 0.08, 0),
    ];

    particles.current.forEach((p, idx) => {
      p.pos.lerp(p.target, p.speed);

      if (p.pos.distanceTo(p.target) < 0.25) {
        p.pos.copy(gates[p.gateIndex]);
      }

      tempObject.position.copy(p.pos);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(idx, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as unknown as THREE.BufferGeometry, null as unknown as THREE.Material, count]} castShadow>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshBasicMaterial color={isDark ? '#fbbf24' : '#ef4444'} transparent opacity={0.65} />
    </instancedMesh>
  );
}

// Dugout Panels
function Dugout({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[1.0, 0.24, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.22, 0.18]}>
        <boxGeometry args={[0.9, 0.02, 0.02]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// Player Tunnel
function PlayerTunnel() {
  return (
    <group position={[-4.9, 0.06, 1.2]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.7, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.31]}>
        <planeGeometry args={[0.6, 0.55]} />
        <meshStandardMaterial color="#020617" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Volumetric Spotlight
function VolumetricLightBeam({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.08, 1.5, 7.5, 16, 1, true]} />
      <meshBasicMaterial
        color="#ffffff"
        opacity={0.065}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Floodlight Towers
function FloodlightTower({ position, rotationBeam, beamPosition }: { position: [number, number, number]; rotationBeam: [number, number, number]; beamPosition: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 7, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 7.0, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh position={[0, 6.9, 0.1]}>
        <boxGeometry args={[0.6, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
      </mesh>
      <spotLight
        position={[0, 6.8, 0]}
        intensity={3.0}
        angle={Math.PI / 4}
        penumbra={0.6}
        castShadow
      />
      <VolumetricLightBeam position={beamPosition} rotation={rotationBeam} />
    </group>
  );
}

interface StadiumMap3DCanvasProps {
  onSelectZone?: (zoneId: string) => void;
  selectedZoneId?: string | null;
  activetwinPanel?: string;
}

export default function StadiumMap3DCanvas({ onSelectZone, selectedZoneId, activetwinPanel = 'Overview' }: StadiumMap3DCanvasProps) {
  const { zones } = useEventStore();
  const { isDark } = useTheme();
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const getZoneColor = (score: number) => getZoneColorUtil(score, activetwinPanel);

  const zonesMap = zones.reduce((acc, z) => {
    acc[z.id] = z;
    return acc;
  }, {} as Record<string, StadiumZone>);

  const activeDisplayId = selectedZoneId || hoveredZoneId;
  const activeZone = activeDisplayId ? zonesMap[activeDisplayId] : null;
  const activeStats = activeDisplayId ? hoverData[activeDisplayId] : null;

  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    return (
      <div className="w-full h-full min-h-[520px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center flex-col gap-3 text-white/50" data-testid="mock-3d-canvas">
        <span>[3D WebGL Digital Twin Telemetry View]</span>
        <button onClick={() => onSelectZone?.('zone-n-lower')} className="px-3 py-1 bg-primary text-white rounded text-xs">
          Select Stand
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative animate-fade-in" style={{ minHeight: '520px' }}>
      {/* 3D WebGL Canvas */}
      <Canvas shadows className="rounded-xl overflow-hidden">
        <color attach="background" args={[isDark ? '#04060c' : '#ffffff']} />
        
        <PerspectiveCamera makeDefault position={[0, 9.5, 14]} fov={52} />
        
        {/* Lights */}
        <ambientLight intensity={isDark ? 0.35 : 0.75} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={isDark ? 0.65 : 0.95}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Outer Concourse Ring Walkways */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.8, 9.2, 64]} />
          <meshStandardMaterial color={isDark ? '#1e293b' : '#cbd5e1'} roughness={0.7} />
        </mesh>

        {/* Volumetric Spotlights */}
        <FloodlightTower position={[-8.5, 0, -6.5]} rotationBeam={[0.4, 0, -0.4]} beamPosition={[1.8, -2.5, 1.8]} />
        <FloodlightTower position={[8.5, 0, -6.5]} rotationBeam={[0.4, 0, 0.4]} beamPosition={[-1.8, -2.5, 1.8]} />
        <FloodlightTower position={[-8.5, 0, 6.5]} rotationBeam={[-0.4, 0, -0.4]} beamPosition={[1.8, -2.5, -1.8]} />
        <FloodlightTower position={[8.5, 0, 6.5]} rotationBeam={[-0.4, 0, 0.4]} beamPosition={[-1.8, -2.5, -1.8]} />

        {/* Circular Elliptical Football Pitch & Markings */}
        <group position={[0, 0.04, 0]} scale={[1.25, 0.92, 1.0]}>
          {/* Turf concentric bands */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[2.6, 3.8, 64]} />
            <meshStandardMaterial color={isDark ? '#0f3e1a' : '#14532d'} roughness={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[1.4, 2.6, 64]} />
            <meshStandardMaterial color={isDark ? '#166534' : '#22c55e'} roughness={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[0, 1.4, 64]} />
            <meshStandardMaterial color={isDark ? '#0f3e1a' : '#14532d'} roughness={0.8} />
          </mesh>
          
          {/* White markings overlay */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
            <ringGeometry args={[3.78, 3.82, 64]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
            <ringGeometry args={[0.8, 0.83, 64]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.04, 7.6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>

          {/* Goalposts at major axis ends */}
          <Goalpost position={[-3.65, 0.006, 0]} rotationY={Math.PI / 2} />
          <Goalpost position={[3.65, 0.006, 0]} rotationY={-Math.PI / 2} />
        </group>

        {/* Dugouts, Tunnel, LED Ribbon & Roof canopy */}
        <Dugout position={[-1.2, 0.06, 3.7]} />
        <Dugout position={[1.2, 0.06, 3.7]} />
        <PlayerTunnel />
        <LedRibbonBoard isDark={isDark} />
        <RoofCanopy isDark={isDark} />
        <PitchWall isDark={isDark} />

        {/* Center Field markings */}
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.44, 32]} />
          <meshBasicMaterial color={isDark ? '#94a3b8' : '#64748b'} side={THREE.DoubleSide} />
        </mesh>

        {/* Spectator particle flows */}
        <SpectatorFlow isDark={isDark} />

        {/* Seating Block Zones: 8 Split Curved Elliptical Stand Assemblies */}
        {/* NORTH STANDS (Math.PI / 4 to 3 * Math.PI / 4) */}
        {zonesMap['zone-n-lower'] && (
          <CurvedStand
            zone={zonesMap['zone-n-lower']}
            radiusTop={5.4}
            radiusBottom={4.6}
            y={0.06}
            height={0.8}
            color={getZoneColor(zonesMap['zone-n-lower'].crowdScore)}
            isSelected={selectedZoneId === 'zone-n-lower'}
            onClick={() => onSelectZone?.('zone-n-lower')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}
        {zonesMap['zone-n-upper'] && (
          <CurvedStand
            zone={zonesMap['zone-n-upper']}
            radiusTop={6.5}
            radiusBottom={5.5}
            y={0.86}
            height={1.0}
            color={getZoneColor(zonesMap['zone-n-upper'].crowdScore)}
            isSelected={selectedZoneId === 'zone-n-upper'}
            onClick={() => onSelectZone?.('zone-n-upper')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}

        {/* WEST STANDS (3 * Math.PI / 4 to 5 * Math.PI / 4) */}
        {zonesMap['zone-w-lower'] && (
          <CurvedStand
            zone={zonesMap['zone-w-lower']}
            radiusTop={5.4}
            radiusBottom={4.6}
            y={0.06}
            height={0.8}
            color={getZoneColor(zonesMap['zone-w-lower'].crowdScore)}
            isSelected={selectedZoneId === 'zone-w-lower'}
            onClick={() => onSelectZone?.('zone-w-lower')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={3 * Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}
        {zonesMap['zone-w-upper'] && (
          <CurvedStand
            zone={zonesMap['zone-w-upper']}
            radiusTop={6.5}
            radiusBottom={5.5}
            y={0.86}
            height={1.0}
            color={getZoneColor(zonesMap['zone-w-upper'].crowdScore)}
            isSelected={selectedZoneId === 'zone-w-upper'}
            onClick={() => onSelectZone?.('zone-w-upper')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={3 * Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}

        {/* SOUTH STANDS (5 * Math.PI / 4 to 7 * Math.PI / 4) */}
        {zonesMap['zone-s-lower'] && (
          <CurvedStand
            zone={zonesMap['zone-s-lower']}
            radiusTop={5.4}
            radiusBottom={4.6}
            y={0.06}
            height={0.8}
            color={getZoneColor(zonesMap['zone-s-lower'].crowdScore)}
            isSelected={selectedZoneId === 'zone-s-lower'}
            onClick={() => onSelectZone?.('zone-s-lower')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={5 * Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}
        {zonesMap['zone-s-upper'] && (
          <CurvedStand
            zone={zonesMap['zone-s-upper']}
            radiusTop={6.5}
            radiusBottom={5.5}
            y={0.86}
            height={1.0}
            color={getZoneColor(zonesMap['zone-s-upper'].crowdScore)}
            isSelected={selectedZoneId === 'zone-s-upper'}
            onClick={() => onSelectZone?.('zone-s-upper')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={5 * Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}

        {/* EAST STANDS (-Math.PI / 4 to Math.PI / 4) */}
        {zonesMap['zone-e-lower'] && (
          <CurvedStand
            zone={zonesMap['zone-e-lower']}
            radiusTop={5.4}
            radiusBottom={4.6}
            y={0.06}
            height={0.8}
            color={getZoneColor(zonesMap['zone-e-lower'].crowdScore)}
            isSelected={selectedZoneId === 'zone-e-lower'}
            onClick={() => onSelectZone?.('zone-e-lower')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={-Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}
        {zonesMap['zone-e-upper'] && (
          <CurvedStand
            zone={zonesMap['zone-e-upper']}
            radiusTop={6.5}
            radiusBottom={5.5}
            y={0.86}
            height={1.0}
            color={getZoneColor(zonesMap['zone-e-upper'].crowdScore)}
            isSelected={selectedZoneId === 'zone-e-upper'}
            onClick={() => onSelectZone?.('zone-e-upper')}
            onHover={setHoveredZoneId}
            isDark={isDark}
            thetaStart={-Math.PI / 4}
            thetaLength={Math.PI / 2}
          />
        )}

        {/* Floor Ground Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color={isDark ? '#04060c' : '#e2e8f0'} roughness={0.9} />
        </mesh>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={25}
        />
      </Canvas>

      {/* Floating HUD Screen */}
      {activeZone && activeStats ? (
        <div className={`absolute bottom-4 left-4 z-20 border backdrop-blur-md p-4 rounded-xl text-xs flex flex-col gap-2.5 max-w-xs select-none shadow-xl border-card-border/55 animate-[fadeIn_0.2s_ease-out] ${isDark ? 'bg-slate-950/85 text-white shadow-black/55' : 'bg-white/90 text-slate-800'}`}>
          <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
            <span className="font-extrabold uppercase tracking-widest text-[10px] text-primary">Zone Telemetry Screen</span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 rounded-md">
              {activeZone.crowdScore}% Full
            </span>
          </div>

          <div className="flex flex-col gap-1.5 font-bold">
            <div className="flex justify-between">
              <span className="text-muted">Section:</span>
              <span className="text-foreground">{activeZone.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Blocks:</span>
              <span className="text-foreground">{activeStats.block}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Capacity:</span>
              <span className="text-foreground">{activeZone.capacity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Occupancy:</span>
              <span className="text-foreground">{activeZone.currentOccupancy.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Entry Gate:</span>
              <span className="text-foreground">{activeStats.gate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Avg Arrival:</span>
              <span className="text-foreground">{activeStats.arrivalTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Exit Time Est:</span>
              <span className="text-foreground">{activeStats.exitTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Security Guard:</span>
              <span className="text-foreground">{activeStats.security}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Emergency Route:</span>
              <span className="text-foreground text-primary">{activeStats.route}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`absolute bottom-4 left-4 z-20 border backdrop-blur-md p-4 rounded-xl text-[10px] flex flex-col gap-2 max-w-xs select-none shadow-xl border-card-border/55 ${isDark ? 'bg-slate-950/85 text-white shadow-black/55' : 'bg-white/90 text-slate-800'}`}>
          <span className="font-extrabold uppercase text-[9px] text-primary">Command Overview</span>
          <p className="text-muted leading-relaxed font-semibold">Hover or click any seating block segment to load localized crowd telemetry, arrival times, and exit estimates.</p>
        </div>
      )}

      {/* Color Code Legend */}
      <div className={`absolute bottom-4 right-4 z-10 border backdrop-blur-md p-3.5 rounded-xl text-[10px] flex flex-col gap-2 select-none shadow-lg border-card-border/40 ${isDark ? 'bg-slate-950/85 text-white shadow-black/40' : 'bg-white/90 text-slate-800'}`}>
        <span className={`font-bold uppercase tracking-widest text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-heading`}>Operational Color Code Legend</span>
        <div className="flex flex-col gap-2 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#ef4444] shadow-sm flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-foreground">Critical density (90%+)</span>
              <span className="text-[9px] text-muted font-normal">Color Code: #ef4444</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#f97316] shadow-sm flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-foreground">High density (80%–90%)</span>
              <span className="text-[9px] text-muted font-normal">Color Code: #f97316</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#eab308] shadow-sm flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-foreground">Medium density (70%–80%)</span>
              <span className="text-[9px] text-muted font-normal">Color Code: #eab308</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#22c55e] shadow-sm flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-foreground">Low density (&lt;70%)</span>
              <span className="text-[9px] text-muted font-normal">Color Code: #22c55e</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

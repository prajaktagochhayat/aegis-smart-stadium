'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/components/ThemeProvider';

interface RealisticSoccerBallProps {
  rotationSpeed?: number;
}

// Procedural PBR Soccer Ball model in React Three Fiber
function RealisticSoccerBall({ rotationSpeed = 0.005 }: RealisticSoccerBallProps) {
  const ballGroupRef = useRef<THREE.Group>(null);

  // Slow continuous rotation and subtle floating float
  useFrame((state) => {
    if (ballGroupRef.current) {
      ballGroupRef.current.rotation.y += rotationSpeed;
      ballGroupRef.current.rotation.x += rotationSpeed * 0.35;
      ballGroupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.75) * 0.15;
    }
  });

  // Icosahedron vertex directions to place the 12 black pentagonal patches
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices: [number, number, number][] = [
    [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
    [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
  ];

  return (
    <group ref={ballGroupRef}>
      {/* 1. Base Pure White Leather Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.12}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Procedural True Black Pentagonal Panels positioned at icosahedron directions */}
      {rawVertices.map((v, i) => {
        const dir = new THREE.Vector3(...v).normalize();
        const pos = dir.clone().multiplyScalar(1.503); // slightly above the white sphere
        
        // Compute orientation to align the pentagonal face outwards
        const upVec = new THREE.Vector3(0, 0, 1);
        const q = new THREE.Quaternion().setFromUnitVectors(upVec, dir);

        return (
          <group key={i} position={[pos.x, pos.y, pos.z]} quaternion={[q.x, q.y, q.z, q.w]}>
            <mesh castShadow>
              <circleGeometry args={[0.39, 5]} />
              <meshStandardMaterial
                color="#dc2626"
                roughness={0.15}
                metalness={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function BackgroundFootballs3D() {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Football 1: Top-Right Corner (Partially visible, ~40% outside, Enlarged) */}
      <div 
        className="absolute w-[420px] h-[420px] md:w-[500px] md:h-[500px]"
        style={{
          top: '-15%',
          right: '-12%',
          opacity: isDark ? 0.28 : 0.35,
        }}
      >
        <Canvas className="w-full h-full" gl={{ antialias: true }} shadows>
          <ambientLight intensity={isDark ? 0.4 : 0.9} />
          <pointLight position={[5, 5, 5]} intensity={2.5} castShadow />
          <directionalLight position={[-5, 5, 2]} intensity={0.7} />
          <PerspectiveCamera makeDefault position={[0, 0, 4.0]} fov={45} />
          
          <RealisticSoccerBall rotationSpeed={0.003} />
        </Canvas>
      </div>

      {/* Football 2: Bottom-Left Corner (Partially visible, ~40% outside, Enlarged) */}
      <div 
        className="absolute w-[480px] h-[480px] md:w-[620px] md:h-[620px]"
        style={{
          bottom: '-18%',
          left: '-15%',
          opacity: isDark ? 0.22 : 0.28,
        }}
      >
        <Canvas className="w-full h-full" gl={{ antialias: true }} shadows>
          <ambientLight intensity={isDark ? 0.4 : 0.9} />
          <pointLight position={[-5, 5, 5]} intensity={2.5} castShadow />
          <directionalLight position={[5, -5, 2]} intensity={0.7} />
          <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={45} />
          
          <RealisticSoccerBall rotationSpeed={-0.004} />
        </Canvas>
      </div>
    </div>
  );
}

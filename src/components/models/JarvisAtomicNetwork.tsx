'use client';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function JarvisAtomicNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Mathematical procedural generation of a perfect spherical node network
  const spherePoints = useMemo(() => {
    const totalNodes = 4000;
    const pts = new Float32Array(totalNodes * 3);
    for (let i = 0; i < totalNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / totalNodes);
      const theta = Math.sqrt(totalNodes * Math.PI) * phi;
      const radius = 6 + Math.random() * 0.2; // Slight surface variation

      pts[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pts[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pts[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current) return;

    // Constant ambient orbital rotation
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x += delta * 0.05;

    // Parallax Cursor Tracking (The structure follows the mouse)
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 6;
    void targetX;
    void targetY;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      state.pointer.x * 3,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      state.pointer.y * 3,
      0.05
    );

    // Counter-rotation for the points themselves for complex mechanics
    pointsRef.current.rotation.y -= delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={spherePoints} stride={3}>
        <PointMaterial
          transparent
          color="#00D8FF"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Orbiting Atomic Rings */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[7.5, 0.015, 16, 120]} />
        <meshBasicMaterial color="#00D8FF" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[8.5, 0.015, 16, 120]} />
        <meshBasicMaterial color="#00D8FF" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

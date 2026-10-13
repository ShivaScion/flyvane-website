'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { JarvisAtomicNetwork } from './JarvisAtomicNetwork';
import { DNASpiral } from './DNASpiral';

export function HybridCore() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Counter-rotation for the combined hybrid element
    groupRef.current.rotation.z += delta * 0.1;

    // Parallax Cursor Tracking
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      state.pointer.x * 2,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      state.pointer.y * 2,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {/* Outer Shell: Scaled down Jarvis Network */}
      <group scale={1.2}>
        <JarvisAtomicNetwork />
      </group>

      {/* Inner Core: Scaled down, angled DNA Helix */}
      <group scale={0.4} rotation={[0, 0, Math.PI / 2]}>
        <DNASpiral />
      </group>
    </group>
  );
}

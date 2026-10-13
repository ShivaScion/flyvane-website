'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function DNASpiral() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Mathematical procedural generation of a double helix particle strand
  const dnaPoints = useMemo(() => {
    const particlesPerStrand = 1500;
    const pts = new Float32Array((particlesPerStrand * 2 + 500) * 3); // Extra 500 for connecting bridges
    const radius = 3;
    const heightSpread = 16;
    let index = 0;

    // Generate Strand A & B
    for (let i = 0; i < particlesPerStrand; i++) {
      const t = (i / particlesPerStrand) * Math.PI * 8; // Multiple twists
      const y = (i / particlesPerStrand) * heightSpread - heightSpread / 2;

      // Strand A
      pts[index++] = Math.cos(t) * radius;
      pts[index++] = y;
      pts[index++] = Math.sin(t) * radius;

      // Strand B (Offset by PI)
      pts[index++] = Math.cos(t + Math.PI) * radius;
      pts[index++] = y;
      pts[index++] = Math.sin(t + Math.PI) * radius;
    }

    // Generate connecting rung bridges randomly
    for (let i = 0; i < 166; i++) {
      const t = Math.random() * Math.PI * 8;
      const y = (t / (Math.PI * 8)) * heightSpread - heightSpread / 2;
      for (let j = 0; j < 3; j++) {
        const lerpFactor = j / 2;
        const startX = Math.cos(t) * radius;
        const startZ = Math.sin(t) * radius;
        const endX = Math.cos(t + Math.PI) * radius;
        const endZ = Math.sin(t + Math.PI) * radius;

        pts[index++] = startX + (endX - startX) * lerpFactor;
        pts[index++] = y;
        pts[index++] = startZ + (endZ - startZ) * lerpFactor;
      }
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Constant twist climbing animation
    groupRef.current.rotation.y -= delta * 0.3;

    // Parallax Cursor Tracking
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      state.pointer.x * 2.5,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      state.pointer.y * 2.5,
      0.05
    );

    // Gentle tilt based on mouse X
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      state.pointer.x * 0.2,
      0.05
    );
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0]}>
      <Points ref={pointsRef} positions={dnaPoints} stride={3}>
        <PointMaterial
          transparent
          color="#F59E0B" /* Amber Gold for Marketing Mode */
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

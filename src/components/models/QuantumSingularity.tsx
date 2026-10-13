import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CyberneticDysonSphere } from './CyberneticDysonSphere';

/**
 * QuantumSingularity — Hybrid mode procedural background.
 * 2000 gold particles with cbrt(random) radius clustering (dense core → sparse outer),
 * wrapped inside a scaled-down CyberneticDysonSphere shell.
 */
export function QuantumSingularity() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Points>(null);

  const corePoints = useMemo(() => {
    const count = 2000;
    const pts = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Cube-root distribution: heavy density at center, falloff outward
      const radius = Math.cbrt(Math.random()) * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pts[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Continuously decrement Z rotation of main group
    groupRef.current.rotation.z -= delta * 0.15;

    // Continuously increment Y rotation of inner core rapidly
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
    }

    // Parallax cursor tracking
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
      {/* Dense golden singularity core */}
      <Points ref={coreRef} positions={corePoints} stride={3}>
        <PointMaterial
          transparent
          color="#F59E0B"
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Outer Dyson Shell at 0.8 scale */}
      <group scale={0.8}>
        <CyberneticDysonSphere />
      </group>
    </group>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CognitiveTorusPlexus — Marketing Services procedural background.
 * 6000 vertices on a p=3, q=4 torus knot parametric surface
 * with volumetric scatter noise for organic density.
 */
export function CognitiveTorusPlexus() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const knotPoints = useMemo(() => {
    const count = 6000;
    const pts = new Float32Array(count * 3);
    const p = 3;
    const q = 4;
    const R = 4;   // Major radius of the torus
    const r = 1.5; // Tube radius

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2 * p;

      // Torus knot parametric equations
      const cosQt = Math.cos(q * t / p);
      const sinQt = Math.sin(q * t / p);
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);

      // Base position on the knot curve
      const curveR = R + r * cosQt;
      const baseX = curveR * cosT;
      const baseY = curveR * sinT;
      const baseZ = r * sinQt;

      // Volumetric scatter: randomize around the knot surface
      const scatter = 0.3;
      pts[i * 3] = baseX + (Math.random() - 0.5) * scatter;
      pts[i * 3 + 1] = baseY + (Math.random() - 0.5) * scatter;
      pts[i * 3 + 2] = baseZ + (Math.random() - 0.5) * scatter;
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Continuously increment Z and Y rotation for tumbling effect
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.z += delta * 0.1;

    // Dynamic tilt based on mouse X coordinate manipulating rotation.x
    const targetRotX = 0.3 + state.pointer.x * 0.25;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    );

    // Parallax cursor tracking
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
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      <Points ref={pointsRef} positions={knotPoints} stride={3}>
        <PointMaterial
          transparent
          color="#F59E0B"
          size={0.04}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

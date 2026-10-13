import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CyberneticDysonSphere — Automation Services procedural background.
 * 3000 nodes via Golden Ratio spherical (Fibonacci) distribution,
 * three thin torus orbital rings at radii 7, 7.5, 8.
 */
export function CyberneticDysonSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const spherePoints = useMemo(() => {
    const count = 3000;
    const pts = new Float32Array(count * 3);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;
      const r = 5 + (Math.random() - 0.5) * 0.15;

      pts[i * 3] = r * Math.sin(inclination) * Math.cos(azimuth);
      pts[i * 3 + 1] = r * Math.sin(inclination) * Math.sin(azimuth);
      pts[i * 3 + 2] = r * Math.cos(inclination);
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current) return;

    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.04;

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

    pointsRef.current.rotation.y -= delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={spherePoints} stride={3}>
        <PointMaterial
          transparent
          color="#00D8FF"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Three thin orbital torus rings */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[7, 0.012, 16, 128]} />
        <meshBasicMaterial color="#00D8FF" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 3.5, Math.PI / 5, 0]}>
        <torusGeometry args={[7.5, 0.012, 16, 128]} />
        <meshBasicMaterial color="#00D8FF" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2.8, Math.PI / 4]}>
        <torusGeometry args={[8, 0.012, 16, 128]} />
        <meshBasicMaterial color="#00D8FF" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

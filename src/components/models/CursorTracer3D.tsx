import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CursorTracerProps {
  modeColor: string;
}

/**
 * CursorTracer3D:
 * Projects the user's cursor position into 3D world coordinates,
 * casting dynamic specular lighting onto the background procedural geometry
 * and leaving a fluid luminous particle trail.
 */
export function CursorTracer3D({ modeColor }: CursorTracerProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const trailPointsRef = useRef<THREE.Points>(null);
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5));
  const currentPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5));
  const { viewport } = useThree();

  const TRAIL_LENGTH = 75;
  const positions = useMemo(() => new Float32Array(TRAIL_LENGTH * 3), []);
  const history = useMemo(() => {
    return Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(0, 0, 5));
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      targetPos.current.x = (nx * viewport.width) / 2.2;
      targetPos.current.y = (ny * viewport.height) / 2.2;
      targetPos.current.z = 4.0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [viewport.width, viewport.height]);

  useFrame((_state, delta) => {
    currentPos.current.lerp(targetPos.current, Math.min(1, delta * 8));

    if (lightRef.current) {
      lightRef.current.position.copy(currentPos.current);
    }

    history.pop();
    history.unshift(currentPos.current.clone());

    if (trailPointsRef.current) {
      const posAttr = trailPointsRef.current.geometry.attributes.position;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const pt = history[i];
        const spread = (i / TRAIL_LENGTH) * 0.12;
        positions[i * 3] = pt.x + Math.sin(i * 0.4) * spread;
        positions[i * 3 + 1] = pt.y + Math.cos(i * 0.4) * spread;
        positions[i * 3 + 2] = pt.z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Specular Point Light following cursor in 3D space */}
      <pointLight
        ref={lightRef}
        color={modeColor}
        intensity={3.2}
        distance={20}
        decay={2}
      />

      {/* Dynamic additive particle trail */}
      <points ref={trailPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color={modeColor}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default CursorTracer3D;

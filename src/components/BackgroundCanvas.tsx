import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { CyberneticDysonSphere } from './models/CyberneticDysonSphere';
import { CognitiveTorusPlexus } from './models/CognitiveTorusPlexus';
import { QuantumSingularity } from './models/QuantumSingularity';
import { CursorTracer3D } from './models/CursorTracer3D';

interface BackgroundProps {
  activeMode:
    | 'Automation Services'
    | 'Marketing Services'
    | 'Hybrid'
    | 'machine'
    | 'mind'
    | 'hybrid';
}

/**
 * GlobalPointerSync:
 * Listens to window pointermove events and propagates normalized coordinates
 * to R3F's internal pointer state, ensuring procedural 3D meshes track the cursor
 * even while cursor hovers over DOM elements.
 */
function GlobalPointerSync() {
  const { pointer } = useThree();

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [pointer]);

  return null;
}

export default function BackgroundCanvas({ activeMode }: BackgroundProps) {
  const normalizedMode =
    activeMode === 'machine'
      ? 'Automation Services'
      : activeMode === 'mind'
      ? 'Marketing Services'
      : activeMode === 'hybrid'
      ? 'Hybrid'
      : activeMode;

  const modeColor =
    normalizedMode === 'Marketing Services'
      ? '#F59E0B'
      : normalizedMode === 'Hybrid'
      ? '#10B981'
      : '#00D8FF';

  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-50 pointer-events-none bg-[#030406] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.18} />
        <GlobalPointerSync />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
            {normalizedMode === 'Automation Services' && <CyberneticDysonSphere />}
            {normalizedMode === 'Marketing Services' && <CognitiveTorusPlexus />}
            {normalizedMode === 'Hybrid' && <QuantumSingularity />}
          </Float>
          {/* Dynamic 3D Cursor Tracing Lighting & Particle Trail */}
          <CursorTracer3D modeColor={modeColor} />
        </Suspense>
      </Canvas>
      {/* Subtle vignette for foreground type contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030406_100%)] opacity-60 mix-blend-multiply" />
    </div>
  );
}

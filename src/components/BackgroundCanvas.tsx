import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { CyberneticDysonSphere } from './models/CyberneticDysonSphere';
import { CognitiveTorusPlexus } from './models/CognitiveTorusPlexus';
import { QuantumSingularity } from './models/QuantumSingularity';

interface BackgroundProps {
  activeMode:
    | 'Automation Services'
    | 'Marketing Services'
    | 'Hybrid'
    | 'machine'
    | 'mind'
    | 'hybrid';
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

  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-50 pointer-events-none bg-[#030406] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.15} />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
            {normalizedMode === 'Automation Services' && <CyberneticDysonSphere />}
            {normalizedMode === 'Marketing Services' && <CognitiveTorusPlexus />}
            {normalizedMode === 'Hybrid' && <QuantumSingularity />}
          </Float>
        </Suspense>
      </Canvas>
      {/* Subtle vignette for foreground type contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030406_100%)] opacity-60 mix-blend-multiply" />
    </div>
  );
}

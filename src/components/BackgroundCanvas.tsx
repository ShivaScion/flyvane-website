'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { JarvisAtomicNetwork } from './models/JarvisAtomicNetwork';
import { DNASpiral } from './models/DNASpiral';
import { HybridCore } from './models/HybridCore';

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
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            {normalizedMode === 'Automation Services' && <JarvisAtomicNetwork />}
            {normalizedMode === 'Marketing Services' && <DNASpiral />}
            {normalizedMode === 'Hybrid' && <HybridCore />}
          </Float>
        </Suspense>
      </Canvas>
      {/* Global Vignette to ensure extreme contrast for foreground typography */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030406_100%)] opacity-80 mix-blend-multiply" />
    </div>
  );
}

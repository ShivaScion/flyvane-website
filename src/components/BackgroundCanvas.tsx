import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Float } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

export interface BackgroundCanvasProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

// Global pointer listener so pointer-events-none on the fixed canvas wrapper never blocks cursor tracking
const globalPointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

// ============================================================================
// 2.1 AUTOMATION SERVICES: TRUE CYBERNETIC ANDROID (.glb + MeshPhysicalMaterial + Custom Shader)
// ============================================================================
export const AndroidModel: React.FC<{ scrollProgress: React.MutableRefObject<number> }> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/cybernetic_android.glb');

  const { clonedScene, chassisMaterial, visorAccentMaterial } = useMemo(() => {
    const cloned = scene.clone(true);

    // Chassis: metalness: 0.9, roughness: 0.2, color: '#111'
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#111'),
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 1.0,
      transparent: true,
      opacity: 1.0,
    });

    // Visor/Accents: emissive: '#00D8FF', emissiveIntensity: 2, toneMapped: false
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00D8FF'),
      emissive: new THREE.Color('#00D8FF'),
      emissiveIntensity: 2,
      toneMapped: false,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.96,
    });

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name.startsWith('Visor') || mesh.name.startsWith('Accent')) {
          mesh.material = visorMat;
        } else {
          mesh.material = chassisMat;
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return { clonedScene: cloned, chassisMaterial: chassisMat, visorAccentMaterial: visorMat };
  }, [scene]);

  // Custom WebGL ShaderMaterial simulating an electromagnetic telemetry field around the bust
  const telemetryShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uFade: { value: 1.0 },
        uColor: { value: new THREE.Color('#00D8FF') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uFade;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float scan = sin(vUv.y * 80.0 - uTime * 4.0) * 0.5 + 0.5;
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          float alpha = (fresnel * 0.35 + scan * 0.06) * uFade;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const mx = state.mouse.x !== 0 ? state.mouse.x : globalPointer.x;
    const my = state.mouse.y !== 0 ? state.mouse.y : globalPointer.y;
    const scroll = scrollProgress.current;

    // Rotate the model based on state.mouse.x and state.mouse.y with lerp smoothing
    const targetRotY = mx * 0.52 + Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    const targetRotX = -my * 0.3;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4.5);

    // Section 1.3 Scroll-Linked Parallax: translate upward on Y-axis and fade slightly into background
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const targetX = isDesktop ? 1.25 * (1 - scroll * 0.4) : 0;
    const targetY = -0.1 + scroll * 1.55;
    const targetZ = -scroll * 1.25;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 5);

    const fade = Math.max(0.35, 1 - scroll * 0.55);
    chassisMaterial.opacity = fade;
    visorAccentMaterial.opacity = 0.96 * fade;
    visorAccentMaterial.emissiveIntensity = (2.0 + Math.sin(state.clock.elapsedTime * 2.8) * 0.35) * fade;
    telemetryShaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    telemetryShaderMaterial.uniforms.uFade.value = fade;
  });

  return (
    <group ref={groupRef} scale={0.92}>
      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.22}>
        <primitive object={clonedScene} />
        <mesh position={[0, 0.25, 0]} scale={[1.28, 1.35, 1.22]} material={telemetryShaderMaterial}>
          <cylinderGeometry args={[1.15, 1.35, 2.5, 48, 1, true]} />
        </mesh>
      </Float>
    </group>
  );
};

// ============================================================================
// 2.2 MARKETING SERVICES: TRUE ANATOMICAL BRAIN (.glb + Wireframe Synaptic Material)
// ============================================================================
export const NeuralBrainModel: React.FC<{ scrollProgress: React.MutableRefObject<number> }> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/neural_brain.glb');

  const { clonedBrain, wireframeMaterial, coreShaderMaterial } = useMemo(() => {
    const cloned = scene.clone(true);

    // Exact Section 2.2 specification:
    // wireframe={true}, color="#38BDF8", emissive="#2DD4BF", transparent={true}, opacity={0.6}
    const wireMat = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: new THREE.Color('#38BDF8'),
      emissive: new THREE.Color('#2DD4BF'),
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.6,
    });

    // Subtle inner synaptic pulse shader so the cerebral hemispheres have volumetric depth inside the wireframe
    const innerShaderMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uFade: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          vPos = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 0.96, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uFade;
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          float pulse = sin(vPos.z * 5.0 - uTime * 3.2) * cos(vPos.x * 6.0 + uTime * 2.1) * 0.5 + 0.5;
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.8);
          vec3 col = mix(vec3(0.05, 0.14, 0.25), vec3(0.22, 0.74, 0.97), pulse * 0.65 + rim * 0.35);
          gl_FragColor = vec4(col, (0.26 + pulse * 0.18) * uFade);
        }
      `,
    });

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = wireMat;
        // Add inner cortical glow clone for each hemisphere/lobe
        const innerClone = new THREE.Mesh(mesh.geometry, innerShaderMat);
        innerClone.name = `${mesh.name}_InnerCore`;
        mesh.add(innerClone);
      }
    });

    return {
      clonedBrain: cloned,
      wireframeMaterial: wireMat,
      coreShaderMaterial: innerShaderMat,
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const mx = state.mouse.x !== 0 ? state.mouse.x : globalPointer.x;
    const my = state.mouse.y !== 0 ? state.mouse.y : globalPointer.y;
    const scroll = scrollProgress.current;

    // Continuous slow anatomical inspection rotation + mouse lerp
    const targetRotY = state.clock.elapsedTime * 0.22 + mx * 0.65;
    const targetRotX = -my * 0.35 + 0.12;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.0);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4.0);

    // Scroll-linked parallax: translate upward on Y-axis and fade slightly into background
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const targetX = isDesktop ? 1.25 * (1 - scroll * 0.4) : 0;
    const targetY = -0.05 + scroll * 1.55;
    const targetZ = -scroll * 1.25;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 5);

    const fade = Math.max(0.35, 1 - scroll * 0.55);
    wireframeMaterial.opacity = 0.6 * fade;
    coreShaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    coreShaderMaterial.uniforms.uFade.value = fade;
  });

  return (
    <group ref={groupRef} scale={0.95}>
      <Float speed={1.5} rotationIntensity={0.18} floatIntensity={0.25}>
        <primitive object={clonedBrain} />
      </Float>
    </group>
  );
};

// ============================================================================
// 2.3 HYBRID MODE: CRYSTALLINE CORE (Outer Octahedron + MeshTransmissionMaterial + Inner Glowing Icosahedron)
// ============================================================================
export const CrystallineCoreModel: React.FC<{ scrollProgress: React.MutableRefObject<number> }> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const outerShellRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const innerMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const mx = state.mouse.x !== 0 ? state.mouse.x : globalPointer.x;
    const my = state.mouse.y !== 0 ? state.mouse.y : globalPointer.y;
    const scroll = scrollProgress.current;

    const targetRotY = state.clock.elapsedTime * 0.25 + mx * 0.6;
    const targetRotX = state.clock.elapsedTime * 0.14 - my * 0.38;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4.5);

    if (outerShellRef.current) {
      outerShellRef.current.rotation.z = state.clock.elapsedTime * 0.12;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -state.clock.elapsedTime * 0.55;
      innerCoreRef.current.rotation.x = state.clock.elapsedTime * 0.35;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.08;
      innerCoreRef.current.scale.setScalar(pulse);
    }

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const targetX = isDesktop ? 1.25 * (1 - scroll * 0.4) : 0;
    const targetY = -0.05 + scroll * 1.55;
    const targetZ = -scroll * 1.25;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 5);

    const fade = Math.max(0.35, 1 - scroll * 0.55);
    if (innerMatRef.current) {
      innerMatRef.current.opacity = 0.92 * fade;
      innerMatRef.current.emissiveIntensity = (2.2 + Math.sin(state.clock.elapsedTime * 3.0) * 0.5) * fade;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.28}>
        {/* Outer Refracting Glass Octahedron with MeshTransmissionMaterial */}
        <mesh ref={outerShellRef} name="OuterCrystallineOctahedron">
          <octahedronGeometry args={[1.55, 0]} />
          <MeshTransmissionMaterial
            transmission={0.9}
            thickness={0.5}
            roughness={0.1}
            ior={1.5}
            color="#00D8FF"
            chromaticAberration={0.04}
            backside={true}
            samples={6}
            resolution={512}
          />
        </mesh>

        {/* Precision Specular Rim Wireframe Cage on Outer Octahedron */}
        <mesh scale={1.56}>
          <octahedronGeometry args={[1.0, 0]} />
          <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.28} />
        </mesh>

        {/* Inner Glowing Icosahedron Core */}
        <mesh ref={innerCoreRef} name="InnerGlowingIcosahedron">
          <icosahedronGeometry args={[0.78, 1]} />
          <meshPhysicalMaterial
            ref={innerMatRef}
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={2.2}
            roughness={0.15}
            metalness={0.8}
            wireframe={true}
            transparent={true}
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>

        {/* Innermost Energy Singularity Sphere */}
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshBasicMaterial color="#00D8FF" transparent opacity={0.75} />
        </mesh>
      </Float>
    </group>
  );
};

// Preload both GLB assets so mode switching is instantaneous
useGLTF.preload('/models/cybernetic_android.glb');
useGLTF.preload('/models/neural_brain.glb');

// ============================================================================
// SECTION 1: GLOBAL FIXED 3D BACKGROUND CANVAS COMPONENT
// ============================================================================
export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ mode }) => {
  const { scrollYProgress } = useScroll();
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      scrollProgressRef.current = v;
    });
    const onNativeScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgressRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', onNativeScroll);
    };
  }, [scrollYProgress]);

  return (
    <div
      id="global-background-canvas-wrapper"
      data-active-mode={mode}
      className="fixed top-0 left-0 w-screen h-screen -z-50 pointer-events-none overflow-hidden bg-[#050608]"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 4.5, 12]} />

        {/* Studio Multi-Point Rim & Key Lighting */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 4]} intensity={2.4} color="#ffffff" />
        <pointLight position={[-4, 2, 3]} intensity={3.2} color="#00D8FF" distance={12} />
        <pointLight position={[3, -3, 2]} intensity={2.6} color="#F59E0B" distance={12} />
        <spotLight
          position={[0, 6, 3]}
          angle={0.5}
          penumbra={0.8}
          intensity={2.8}
          color={mode === 'mind' ? '#2DD4BF' : '#00D8FF'}
        />

        <Suspense fallback={null}>
          {mode === 'machine' && <AndroidModel scrollProgress={scrollProgressRef} />}
          {mode === 'mind' && <NeuralBrainModel scrollProgress={scrollProgressRef} />}
          {mode === 'hybrid' && <CrystallineCoreModel scrollProgress={scrollProgressRef} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;

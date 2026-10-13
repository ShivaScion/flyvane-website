import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, MeshTransmissionMaterial, Float } from '@react-three/drei';
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
// 2.1 AUTOMATION SERVICES: ARTICULATED CYBERNETIC ANDROID RIG (.glb + useAnimations + Multi-Part Servo Kinematics)
// ============================================================================
export const AndroidModel: React.FC<{ scrollProgress: React.MutableRefObject<number> }> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const swarmGroupRef = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF('/models/cybernetic_android.glb');

  const {
    clonedScene,
    chassisMaterial,
    visorAccentMaterial,
    parts,
  } = useMemo(() => {
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

    const rigParts: Record<string, THREE.Object3D> = {};

    cloned.traverse((child) => {
      if (child.name) {
        rigParts[child.name] = child;
      }
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

    return {
      clonedScene: cloned,
      chassisMaterial: chassisMat,
      visorAccentMaterial: visorMat,
      parts: rigParts,
    };
  }, [scene]);

  // Play embedded GLTF AnimationClips via @react-three/drei useAnimations
  const { actions } = useAnimations(animations, clonedScene);
  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action?.reset().fadeIn(0.3).play();
    });
  }, [actions]);

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
          float scan = sin(vUv.y * 80.0 - uTime * 5.0) * 0.5 + 0.5;
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          float alpha = (fresnel * 0.35 + scan * 0.08) * uFade;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
  }, []);

  // 18 Autonomous Worker Nodes orbiting the Android Rig
  const workerNodes = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 1.65 + (i % 3) * 0.28;
      const yOffset = ((i % 5) - 2) * 0.42;
      return { angle, radius, yOffset, speed: 0.55 + (i % 4) * 0.18, phase: i * 0.7 };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const mx = state.mouse.x !== 0 ? state.mouse.x : globalPointer.x;
    const my = state.mouse.y !== 0 ? state.mouse.y : globalPointer.y;
    const scroll = scrollProgress.current;

    // 1. Whole-rig mouse lerp + autonomous scanning sway
    const scanSweep = Math.sin(t * 0.9) * 0.22 + Math.sin(t * 2.1) * 0.06;
    const targetRotY = mx * 0.58 + scanSweep;
    const targetRotX = -my * 0.34 + Math.cos(t * 1.2) * 0.08;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4.5);

    // 2. Articulated Sub-Mesh Servo Kinematics (Head, Visor, Mandibles, Pistons, Neck Rings, Thoracic Core)
    const cranium = parts['Chassis_Cranium'];
    const visor = parts['Visor_OpticalShield'];
    const crest = parts['Accent_CranialCrest'];
    if (cranium && visor) {
      const headLookY = mx * 0.35 + Math.sin(t * 1.7) * 0.18;
      const headLookX = -my * 0.22 + Math.sin(t * 2.4) * 0.07;
      cranium.rotation.y = THREE.MathUtils.lerp(cranium.rotation.y, headLookY, delta * 6);
      cranium.rotation.x = THREE.MathUtils.lerp(cranium.rotation.x, headLookX, delta * 6);
      visor.rotation.y = cranium.rotation.y * 1.15;
      visor.rotation.x = cranium.rotation.x * 1.1;
      visor.position.y = 0.68 + Math.sin(t * 3.2) * 0.025;
      if (crest) {
        crest.rotation.y = cranium.rotation.y;
        crest.position.y = 1.52 + Math.sin(t * 3.2) * 0.03;
      }
    }

    // Articulated Mandibles (breathing / vocal telemetry oscillation)
    const jawL = parts['Chassis_Mandible_L'];
    const jawR = parts['Chassis_Mandible_R'];
    const jawBreath = Math.sin(t * 2.8) * 0.045 + Math.max(0, Math.sin(t * 6.5)) * 0.025;
    if (jawL) {
      jawL.position.x = -0.52 - jawBreath;
      jawL.position.y = 0.12 - jawBreath * 0.6;
      jawL.rotation.z = -0.22 - jawBreath * 1.4;
    }
    if (jawR) {
      jawR.position.x = 0.52 + jawBreath;
      jawR.position.y = 0.12 - jawBreath * 0.6;
      jawR.rotation.z = 0.22 + jawBreath * 1.4;
    }

    // Reciprocating Hydraulic Neck Pistons & Conduits
    const pistonL = parts['Chassis_Piston_L'];
    const pistonR = parts['Chassis_Piston_R'];
    const conduitL = parts['Accent_Conduit_L'];
    const conduitR = parts['Accent_Conduit_R'];
    const pistonStroke = Math.sin(t * 3.4) * 0.08;
    if (pistonL) pistonL.position.y = -0.55 + pistonStroke;
    if (conduitL) conduitL.position.y = -0.54 + pistonStroke;
    if (pistonR) pistonR.position.y = -0.55 - pistonStroke;
    if (conduitR) conduitR.position.y = -0.54 - pistonStroke;

    // Counter-Rotating Cervical Neck Rings
    for (let r = 0; r < 4; r++) {
      const nRing = parts[`Chassis_NeckRing_${r}`];
      if (nRing) {
        nRing.rotation.z = t * (r % 2 === 0 ? 1.4 : -1.4);
      }
    }

    // Temple Telemetry Rings & Thoracic Core Reactor Spin
    const earRingL = parts['Accent_TempleRing_L'];
    const earRingR = parts['Accent_TempleRing_R'];
    if (earRingL) earRingL.rotation.x = t * 2.5;
    if (earRingR) earRingR.rotation.x = -t * 2.5;

    const thoracicCore = parts['Accent_ThoracicCore'];
    if (thoracicCore) {
      thoracicCore.rotation.z = t * 2.2;
      const corePulse = 1 + Math.sin(t * 4.2) * 0.16;
      thoracicCore.scale.setScalar(corePulse);
    }

    // 3. Orbital Telemetry Rings & Autonomous Worker Swarm Animation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.65;
      ring1Ref.current.rotation.x = Math.PI / 2.3 + Math.sin(t * 0.8) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.85;
      ring2Ref.current.rotation.y = Math.cos(t * 0.7) * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.45;
      ring3Ref.current.rotation.y = -t * 0.55;
    }
    if (swarmGroupRef.current) {
      swarmGroupRef.current.rotation.y = t * 0.42;
      swarmGroupRef.current.children.forEach((child, idx) => {
        const w = workerNodes[idx];
        if (!w) return;
        const a = w.angle + t * w.speed;
        child.position.set(
          Math.cos(a) * w.radius,
          w.yOffset + Math.sin(t * 2.4 + w.phase) * 0.22,
          Math.sin(a) * w.radius
        );
      });
    }

    // 4. Section 1.3 Scroll-Linked Parallax: translate upward on Y-axis and fade slightly into background
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
    visorAccentMaterial.emissiveIntensity = (2.2 + Math.sin(t * 3.5) * 0.55) * fade;
    telemetryShaderMaterial.uniforms.uTime.value = t;
    telemetryShaderMaterial.uniforms.uFade.value = fade;
  });

  return (
    <group ref={groupRef} scale={0.92}>
      <Float speed={2.2} rotationIntensity={0.22} floatIntensity={0.35}>
        <primitive object={clonedScene} />

        {/* Articulated Orbital Telemetry Gyroscope Rings */}
        <mesh ref={ring1Ref} position={[0, 0.45, 0]}>
          <torusGeometry args={[1.55, 0.012, 16, 96]} />
          <meshBasicMaterial color="#00D8FF" transparent opacity={0.55} />
        </mesh>
        <mesh ref={ring2Ref} position={[0, -0.35, 0]} rotation={[1.2, 0.3, 0]}>
          <torusGeometry args={[1.82, 0.01, 16, 96]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.38} />
        </mesh>
        <mesh ref={ring3Ref} position={[0, 0.2, 0]}>
          <torusGeometry args={[2.05, 0.008, 12, 96]} />
          <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Orbiting Autonomous Worker Swarm Nodes */}
        <group ref={swarmGroupRef}>
          {workerNodes.map((_, idx) => (
            <mesh key={idx}>
              <octahedronGeometry args={[0.045, 0]} />
              <meshBasicMaterial color={idx % 2 === 0 ? '#00D8FF' : '#10B981'} />
            </mesh>
          ))}
        </group>

        {/* Electromagnetic Scanline Shader Field */}
        <mesh position={[0, 0.25, 0]} scale={[1.28, 1.35, 1.22]} material={telemetryShaderMaterial}>
          <cylinderGeometry args={[1.15, 1.35, 2.5, 48, 1, true]} />
        </mesh>
      </Float>
    </group>
  );
};

// ============================================================================
// 2.2 MARKETING SERVICES: LIVING ANATOMICAL NEURAL BRAIN (.glb + Cortical Wave Deformation + Travelling Synaptic Pulses)
// ============================================================================
export const NeuralBrainModel: React.FC<{ scrollProgress: React.MutableRefObject<number> }> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulsesGroupRef = useRef<THREE.Group>(null);
  const gyro1Ref = useRef<THREE.Mesh>(null);
  const gyro2Ref = useRef<THREE.Mesh>(null);

  const { scene, animations } = useGLTF('/models/neural_brain.glb');

  const {
    clonedBrain,
    wireframeMaterial,
    coreShaderMaterial,
    deformableMeshes,
    synapticPathways,
  } = useMemo(() => {
    const cloned = scene.clone(true);

    // Exact Section 2.2 specification:
    // wireframe={true}, color="#38BDF8", emissive="#2DD4BF", transparent={true}, opacity={0.6}
    const wireMat = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: new THREE.Color('#38BDF8'),
      emissive: new THREE.Color('#2DD4BF'),
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.6,
    });

    const innerShaderMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uFade: { value: 1.0 },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          vPos = position;
          vNormal = normalize(normalMatrix * normal);
          float wave = sin(position.z * 4.5 - uTime * 3.8) * 0.03;
          vec3 displaced = position * (0.96 + wave);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uFade;
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          float pulse = sin(vPos.z * 5.0 - uTime * 3.6) * cos(vPos.x * 6.0 + uTime * 2.4) * 0.5 + 0.5;
          float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.8);
          vec3 col = mix(vec3(0.05, 0.16, 0.28), vec3(0.22, 0.82, 0.98), pulse * 0.7 + rim * 0.35);
          gl_FragColor = vec4(col, (0.28 + pulse * 0.22) * uFade);
        }
      `,
    });

    const meshesToDeform: { mesh: THREE.Mesh; basePositions: Float32Array }[] = [];
    const sampledSurfacePoints: THREE.Vector3[] = [];

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry = mesh.geometry.clone();
        mesh.material = wireMat;

        const posAttr = mesh.geometry.attributes.position;
        if (posAttr) {
          meshesToDeform.push({
            mesh,
            basePositions: new Float32Array(posAttr.array as ArrayLike<number>),
          });

          // Sample cortical surface coordinates for travelling synaptic action-potential impulses
          const step = Math.max(1, Math.floor(posAttr.count / 36));
          for (let i = 0; i < posAttr.count; i += step) {
            const p = new THREE.Vector3().fromBufferAttribute(posAttr, i);
            p.add(mesh.position);
            sampledSurfacePoints.push(p);
          }
        }

        const innerClone = new THREE.Mesh(mesh.geometry, innerShaderMat);
        innerClone.name = `${mesh.name}_InnerCore`;
        mesh.add(innerClone);
      }
    });

    // Build 42 synaptic pathways connecting cortical lobes for travelling action-potential impulses
    const pathways = Array.from({ length: 42 }, (_, idx) => {
      const a = sampledSurfacePoints[(idx * 3) % Math.max(1, sampledSurfacePoints.length)] || new THREE.Vector3(-0.6, 0.4, 0.5);
      const b = sampledSurfacePoints[(idx * 7 + 11) % Math.max(1, sampledSurfacePoints.length)] || new THREE.Vector3(0.6, 0.3, -0.5);
      const mid = a.clone().add(b).multiplyScalar(0.58);
      return {
        start: a,
        mid,
        end: b,
        speed: 0.45 + (idx % 5) * 0.16,
        offset: (idx * 0.19) % 1,
        isWarm: idx % 3 === 0,
      };
    });

    return {
      clonedBrain: cloned,
      wireframeMaterial: wireMat,
      coreShaderMaterial: innerShaderMat,
      deformableMeshes: meshesToDeform,
      synapticPathways: pathways,
    };
  }, [scene]);

  // Play embedded GLTF AnimationClips
  const { actions } = useAnimations(animations, clonedBrain);
  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action?.reset().fadeIn(0.3).play();
    });
  }, [actions]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const mx = state.mouse.x !== 0 ? state.mouse.x : globalPointer.x;
    const my = state.mouse.y !== 0 ? state.mouse.y : globalPointer.y;
    const scroll = scrollProgress.current;

    // 1. Continuous anatomical inspection rotation + mouse lerp
    const targetRotY = t * 0.32 + mx * 0.68;
    const targetRotX = -my * 0.36 + Math.sin(t * 0.9) * 0.14;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.2);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4.2);

    // 2. Real-time Cortical Gyri/Sulci Vertex Wave Animation across both hemispheres & cerebellum
    for (const item of deformableMeshes) {
      const posAttr = item.mesh.geometry.attributes.position as THREE.BufferAttribute;
      const base = item.basePositions;
      for (let i = 0; i < posAttr.count; i++) {
        const ix = i * 3;
        const bx = base[ix];
        const by = base[ix + 1];
        const bz = base[ix + 2];
        const wave =
          1 +
          0.032 * Math.sin(bz * 3.8 - t * 3.6 + bx * 2.5) +
          0.018 * Math.cos(by * 5.0 + t * 2.8);
        posAttr.setXYZ(i, bx * wave, by * wave, bz * wave);
      }
      posAttr.needsUpdate = true;
    }

    // 3. Animate 42 Travelling Synaptic Action-Potential Impulses racing across the cortex
    if (pulsesGroupRef.current) {
      pulsesGroupRef.current.children.forEach((child, idx) => {
        const path = synapticPathways[idx];
        if (!path) return;
        const prog = (t * path.speed + path.offset) % 1;
        const inv = 1 - prog;
        // Quadratic Bezier interpolation between cortical lobes
        const x = inv * inv * path.start.x + 2 * inv * prog * path.mid.x + prog * prog * path.end.x;
        const y = inv * inv * path.start.y + 2 * inv * prog * path.mid.y + prog * prog * path.end.y;
        const z = inv * inv * path.start.z + 2 * inv * prog * path.mid.z + prog * prog * path.end.z;
        child.position.set(x, y, z);
        const s = 0.6 + Math.sin(prog * Math.PI) * 1.1;
        child.scale.setScalar(s);
      });
    }

    // 4. Counter-rotating Synaptic Telemetry Gyroscopes
    if (gyro1Ref.current) {
      gyro1Ref.current.rotation.z = t * 0.55;
      gyro1Ref.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.7) * 0.2;
    }
    if (gyro2Ref.current) {
      gyro2Ref.current.rotation.y = -t * 0.65;
      gyro2Ref.current.rotation.x = Math.cos(t * 0.6) * 0.35;
    }

    // 5. Scroll-linked parallax: translate upward on Y-axis and fade slightly into background
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const targetX = isDesktop ? 1.25 * (1 - scroll * 0.4) : 0;
    const targetY = -0.05 + scroll * 1.55;
    const targetZ = -scroll * 1.25;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 5);

    const fade = Math.max(0.35, 1 - scroll * 0.55);
    wireframeMaterial.opacity = 0.6 * fade;
    wireframeMaterial.emissiveIntensity = (0.85 + Math.sin(t * 3.0) * 0.3) * fade;
    coreShaderMaterial.uniforms.uTime.value = t;
    coreShaderMaterial.uniforms.uFade.value = fade;
  });

  return (
    <group ref={groupRef} scale={0.95}>
      <Float speed={2.0} rotationIntensity={0.24} floatIntensity={0.32}>
        <primitive object={clonedBrain} />

        {/* Travelling 3D Synaptic Action-Potential Impulses */}
        <group ref={pulsesGroupRef}>
          {synapticPathways.map((p, idx) => (
            <mesh key={idx}>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshBasicMaterial color={p.isWarm ? '#F59E0B' : '#2DD4BF'} />
            </mesh>
          ))}
        </group>

        {/* Articulated Synaptic Gyroscope Rings */}
        <mesh ref={gyro1Ref}>
          <torusGeometry args={[1.95, 0.01, 16, 96]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.42} />
        </mesh>
        <mesh ref={gyro2Ref} rotation={[0.8, 0.4, 0]}>
          <torusGeometry args={[2.18, 0.008, 16, 96]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.32} />
        </mesh>
      </Float>
    </group>
  );
};

// ============================================================================
// 2.3 HYBRID MODE: KINETIC CRYSTALLINE CORE (Outer Octahedron + MeshTransmissionMaterial + Breathing Shards + Gimbal Rings)
// ============================================================================
export const CrystallineCoreModel: React.FC<{ scrollProgress: React.MutableRefObject<number> }> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const outerShellRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const innerMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const shardsGroupRef = useRef<THREE.Group>(null);
  const gimbal1Ref = useRef<THREE.Mesh>(null);
  const gimbal2Ref = useRef<THREE.Mesh>(null);
  const gimbal3Ref = useRef<THREE.Mesh>(null);

  // 12 Orbiting & Radially Breathing Crystal Satellite Shards
  const crystalShards = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 12);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize();
      return { dir, phase: i * 0.55, isAmber: i % 2 === 1 };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const mx = state.mouse.x !== 0 ? state.mouse.x : globalPointer.x;
    const my = state.mouse.y !== 0 ? state.mouse.y : globalPointer.y;
    const scroll = scrollProgress.current;

    const targetRotY = t * 0.34 + mx * 0.65;
    const targetRotX = t * 0.18 - my * 0.42;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4.5);

    if (outerShellRef.current) {
      outerShellRef.current.rotation.z = t * 0.22;
      const shellBreath = 1 + Math.sin(t * 2.2) * 0.045;
      outerShellRef.current.scale.setScalar(shellBreath);
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.85;
      innerCoreRef.current.rotation.x = t * 0.62;
      const pulse = 1 + Math.sin(t * 3.6) * 0.14;
      innerCoreRef.current.scale.setScalar(pulse);
    }

    // Animate 12 Radially Breathing & Orbiting Crystal Shards
    if (shardsGroupRef.current) {
      shardsGroupRef.current.rotation.y = -t * 0.48;
      shardsGroupRef.current.rotation.z = Math.sin(t * 0.6) * 0.25;
      shardsGroupRef.current.children.forEach((shard, idx) => {
        const cfg = crystalShards[idx];
        if (!cfg) return;
        const radius = 1.85 + Math.sin(t * 2.8 + cfg.phase) * 0.28;
        shard.position.copy(cfg.dir).multiplyScalar(radius);
        shard.rotation.x = t * 1.8 + cfg.phase;
        shard.rotation.y = t * 1.4 - cfg.phase;
      });
    }

    // Animate 3-Axis Kinetic Gimbal Rings
    if (gimbal1Ref.current) {
      gimbal1Ref.current.rotation.x = t * 0.72;
      gimbal1Ref.current.rotation.y = t * 0.35;
    }
    if (gimbal2Ref.current) {
      gimbal2Ref.current.rotation.y = -t * 0.68;
      gimbal2Ref.current.rotation.z = t * 0.42;
    }
    if (gimbal3Ref.current) {
      gimbal3Ref.current.rotation.z = -t * 0.54;
      gimbal3Ref.current.rotation.x = Math.sin(t * 0.8) * 0.5;
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
      innerMatRef.current.emissiveIntensity = (2.4 + Math.sin(t * 3.8) * 0.65) * fade;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.2} rotationIntensity={0.28} floatIntensity={0.35}>
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
          <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.32} />
        </mesh>

        {/* Inner Glowing Icosahedron Core */}
        <mesh ref={innerCoreRef} name="InnerGlowingIcosahedron">
          <icosahedronGeometry args={[0.78, 1]} />
          <meshPhysicalMaterial
            ref={innerMatRef}
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={2.4}
            roughness={0.15}
            metalness={0.8}
            wireframe={true}
            transparent={true}
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>

        {/* Orbiting & Radially Breathing Crystal Satellite Shards */}
        <group ref={shardsGroupRef}>
          {crystalShards.map((s, idx) => (
            <mesh key={idx}>
              <octahedronGeometry args={[0.11, 0]} />
              <meshPhysicalMaterial
                color={s.isAmber ? '#F59E0B' : '#00D8FF'}
                emissive={s.isAmber ? '#F59E0B' : '#00D8FF'}
                emissiveIntensity={1.6}
                metalness={0.85}
                roughness={0.15}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        {/* 3-Axis Kinetic Gimbal Rings */}
        <mesh ref={gimbal1Ref}>
          <torusGeometry args={[1.92, 0.012, 16, 96]} />
          <meshBasicMaterial color="#00D8FF" transparent opacity={0.48} />
        </mesh>
        <mesh ref={gimbal2Ref}>
          <torusGeometry args={[2.12, 0.01, 16, 96]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.38} />
        </mesh>
        <mesh ref={gimbal3Ref}>
          <torusGeometry args={[2.32, 0.008, 12, 96]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.28} />
        </mesh>

        {/* Innermost Energy Singularity Sphere */}
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshBasicMaterial color="#00D8FF" transparent opacity={0.78} />
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

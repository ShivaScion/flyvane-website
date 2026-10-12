import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type CompanionActivity =
  | 'none'
  | 'sipping_coffee'
  | 'leaning_boundary'
  | 'dozing_sleeping'
  | 'hacking_laptop'
  | 'listening_music'
  | 'kneeling_pat';

export type CompanionPose =
  | 'idle'
  | 'walk'
  | 'run'
  | 'agree'
  | 'headShake'
  | 'sneak_pose'
  | 'sad_pose'
  | 'flirting';

interface Aira3DModelProps {
  currentPose: CompanionPose;
  activity?: CompanionActivity;
  isCursorOffscreen: boolean;
  walkDirection?: { dx: number; dy: number };
  onClickModel?: () => void;
  width?: number;
  height?: number;
}

export const Aira3DModel: React.FC<Aira3DModelProps> = ({
  currentPose = 'idle',
  activity = 'none',
  isCursorOffscreen = false,
  walkDirection,
  onClickModel,
  width = 240,
  height = 340,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References to keep Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<{ [key: string]: THREE.AnimationAction }>({});
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

  // Skeletal Bones
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const rightForeArmRef = useRef<THREE.Object3D | null>(null);
  const rightHandRef = useRef<THREE.Object3D | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);

  // 3D Prop Groups
  const coffeeCupPropRef = useRef<THREE.Group | null>(null);
  const headphonesPropRef = useRef<THREE.Group | null>(null);
  const laptopPropRef = useRef<THREE.Group | null>(null);

  const walkDirectionRef = useRef(walkDirection);
  walkDirectionRef.current = walkDirection;

  const activityRef = useRef(activity);
  activityRef.current = activity;

  const currentPoseRef = useRef(currentPose);
  currentPoseRef.current = currentPose;

  const isCursorOffscreenRef = useRef(isCursorOffscreen);
  isCursorOffscreenRef.current = isCursorOffscreen;

  // Mouse tracking targets
  const mouseRef = useRef<{ targetX: number; targetY: number; currX: number; currY: number }>({
    targetX: 0,
    targetY: 0,
    currX: 0,
    currY: 0,
  });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup - framed for 3/4 upper body & full posture
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0.25, 2.7);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    // Cyber Rim Light (Cyan / Electric Blue backlight for cinematic edge glow)
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    rimLight.position.set(-2.5, 2.2, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xff8844, 0.9);
    fillLight.position.set(1, -2, 1.5);
    scene.add(fillLight);

    const faceLight = new THREE.PointLight(0x00e5ff, 1.2, 3);
    faceLight.position.set(0, 0.6, 1.2);
    scene.add(faceLight);

    // Ground Holographic Stage Ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.38, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const stageRing = new THREE.Mesh(ringGeo, ringMat);
    stageRing.rotation.x = -Math.PI / 2;
    stageRing.position.y = -0.92;
    scene.add(stageRing);

    const outerRingGeo = new THREE.RingGeometry(0.52, 0.54, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const outerStageRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerStageRing.rotation.x = -Math.PI / 2;
    outerStageRing.position.y = -0.92;
    scene.add(outerStageRing);

    // 5. Load GLTF Model (xbot.glb)
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;

    loader.load(
      '/assets/aira/xbot.glb',
      (gltf) => {
        const model = gltf.scene;
        modelRootRef.current = model;

        model.position.set(0, -0.92, 0);
        model.scale.set(1, 1, 1);

        // Customize Materials to reflect Aira's streetwear obsidian & tech precision
        model.traverse((child) => {
          if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
            const mesh = child as THREE.SkinnedMesh;
            mesh.frustumCulled = false;

            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map((mat) => customizeMaterial(mat));
            } else if (mesh.material) {
              mesh.material = customizeMaterial(mesh.material);
            }
          }
        });

        // Bone references for tracking & props
        const headBone = model.getObjectByName('mixamorig:Head');
        const neckBone = model.getObjectByName('mixamorig:Neck');
        const rightArm = model.getObjectByName('mixamorig:RightArm');
        const rightForeArm = model.getObjectByName('mixamorig:RightForeArm');
        const rightHand = model.getObjectByName('mixamorig:RightHand');

        headBoneRef.current = headBone || null;
        neckBoneRef.current = neckBone || null;
        rightArmRef.current = rightArm || null;
        rightForeArmRef.current = rightForeArm || null;
        rightHandRef.current = rightHand || null;

        // Prop 1: Attach Anime Character Hair & Headset to Head bone
        if (headBone) {
          // Aira's signature anime styled cyber hairstyle
          const animeHair = createAnimeHairstyle();
          animeHair.position.set(0, 0.05, -0.02);
          headBone.add(animeHair);

          // Aira's facial features: expressive glowing anime eyes & neural earpiece
          const animeFaceRig = createAnimeFaceRig();
          animeFaceRig.position.set(0, 0.08, 0.095);
          headBone.add(animeFaceRig);

          // Prop 2: Attach Cyber Wireframe Glasses
          const glassesGroup = createCyberGlasses();
          glassesGroup.position.set(0, 0.08, 0.11);
          headBone.add(glassesGroup);

          // Prop 3: Attach Cyber Headphones to Head bone (hidden by default)
          const headphones = createCyberHeadphones();
          headphones.position.set(0, 0.09, 0);
          headphones.visible = false;
          headphonesPropRef.current = headphones;
          headBone.add(headphones);
        }

        // Prop 4: Attach Coffee Mug to Right Hand (hidden by default)
        if (rightHand) {
          const coffeeMug = createCoffeeMug();
          coffeeMug.position.set(0.04, 0.09, 0.02);
          coffeeMug.rotation.set(0, 0, Math.PI / 8);
          coffeeMug.visible = false;
          coffeeCupPropRef.current = coffeeMug;
          rightHand.add(coffeeMug);
        }

        // Prop 5: Holographic Floating Laptop (hidden by default)
        const holoLaptop = createHoloLaptop();
        holoLaptop.position.set(0, 0.74, 0.38);
        holoLaptop.visible = false;
        laptopPropRef.current = holoLaptop;
        model.add(holoLaptop);

        // Setup Animation Mixer
        mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        const actions: { [key: string]: THREE.AnimationAction } = {};
        gltf.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip);
          if (clip.name === 'sad_pose' || clip.name === 'sneak_pose') {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
          }
          actions[clip.name] = action;
        });
        actionsRef.current = actions;

        // Default pose
        const startClip = actions[currentPoseRef.current] || actions['idle'] || Object.values(actions)[0];
        if (startClip) {
          startClip.play();
          activeActionRef.current = startClip;
        }

        scene.add(model);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load Aira 3D model:', err);
        setLoadError('Failed to initialize 3D model.');
        setIsLoading(false);
      }
    );

    // Helper: Material customizer for Aira's anime-cyber streetwear
    function customizeMaterial(mat: THREE.Material): THREE.Material {
      const matName = (mat.name || '').toLowerCase();
      if (matName.includes('joints') || matName.includes('trim')) {
        return new THREE.MeshStandardMaterial({
          color: 0x080c14,
          metalness: 0.9,
          roughness: 0.15,
          emissive: 0x00f0ff,
          emissiveIntensity: 0.45,
        });
      } else if (matName.includes('head') || matName.includes('skin') || matName.includes('face')) {
        // Soft porcelain anime skin tone with subtle subsurface feel
        return new THREE.MeshStandardMaterial({
          color: 0xfdecdb,
          roughness: 0.55,
          metalness: 0.05,
        });
      } else {
        // Deep obsidian techwear jacket with subtle metallic sheen
        return new THREE.MeshStandardMaterial({
          color: 0x12141c,
          roughness: 0.65,
          metalness: 0.25,
        });
      }
    }

    // Helper: Create Anime Hairstyle (Twin Bangs, Back Volume & Flowing Strands)
    function createAnimeHairstyle(): THREE.Group {
      const hair = new THREE.Group();
      
      // Silk dark charcoal / indigo hair with cyan rim highlights
      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x181a26,
        roughness: 0.38,
        metalness: 0.2,
      });

      const highlightMat = new THREE.MeshStandardMaterial({
        color: 0x00d8f6,
        roughness: 0.25,
        metalness: 0.6,
        emissive: 0x00d8f6,
        emissiveIntensity: 0.3,
      });

      // 1. Crown / Top hair cap
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.125, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
      crown.position.set(0, 0.04, 0);
      crown.rotation.x = -0.15;
      hair.add(crown);

      // 2. Front Anime Side Bangs (Left & Right tapered locks)
      const bangGeo = new THREE.ConeGeometry(0.024, 0.18, 12);
      
      // Left front bang
      const leftBang = new THREE.Mesh(bangGeo, hairMat);
      leftBang.position.set(-0.075, -0.02, 0.08);
      leftBang.rotation.set(-0.2, 0.15, -0.25);
      hair.add(leftBang);

      // Right front bang
      const rightBang = new THREE.Mesh(bangGeo, hairMat);
      rightBang.position.set(0.075, -0.02, 0.08);
      rightBang.rotation.set(-0.2, -0.15, 0.25);
      hair.add(rightBang);

      // Center parting fringe lock
      const centerFringe = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.11, 10), hairMat);
      centerFringe.position.set(0.015, 0.04, 0.115);
      centerFringe.rotation.set(-0.35, 0.1, 0.05);
      hair.add(centerFringe);

      // 3. Cybernetic Hair Clips / Ribbons
      const clipGeo = new THREE.BoxGeometry(0.012, 0.035, 0.008);
      const leftClip = new THREE.Mesh(clipGeo, highlightMat);
      leftClip.position.set(-0.085, 0.06, 0.06);
      leftClip.rotation.z = 0.4;
      hair.add(leftClip);

      const rightClip = new THREE.Mesh(clipGeo, highlightMat);
      rightClip.position.set(0.085, 0.06, 0.06);
      rightClip.rotation.z = -0.4;
      hair.add(rightClip);

      // 4. Back hair volume
      const backHair = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.16, 16), hairMat);
      backHair.position.set(0, -0.04, -0.06);
      backHair.rotation.x = -0.2;
      hair.add(backHair);

      return hair;
    }

    // Helper: Anime Facial Details & Glowing Irises
    function createAnimeFaceRig(): THREE.Group {
      const faceGroup = new THREE.Group();

      const eyeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.9,
      });

      const pupilMat = new THREE.MeshBasicMaterial({
        color: 0x031828,
      });

      // Left Eye
      const eyeL = new THREE.Mesh(new THREE.CircleGeometry(0.014, 16), eyeMat);
      eyeL.position.set(-0.038, 0.015, 0.01);
      const pupilL = new THREE.Mesh(new THREE.CircleGeometry(0.007, 16), pupilMat);
      pupilL.position.set(-0.038, 0.015, 0.012);
      faceGroup.add(eyeL);
      faceGroup.add(pupilL);

      // Right Eye
      const eyeR = new THREE.Mesh(new THREE.CircleGeometry(0.014, 16), eyeMat);
      eyeR.position.set(0.038, 0.015, 0.01);
      const pupilR = new THREE.Mesh(new THREE.CircleGeometry(0.007, 16), pupilMat);
      pupilR.position.set(0.038, 0.015, 0.012);
      faceGroup.add(eyeR);
      faceGroup.add(pupilR);

      // Cyber Neural Earpiece (Right Ear)
      const earpieceMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.5,
      });
      const earpiece = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 8, 16), earpieceMat);
      earpiece.position.set(0.096, 0.01, -0.015);
      earpiece.rotation.y = Math.PI / 2;
      faceGroup.add(earpiece);

      return faceGroup;
    }

    // Helper: Cyber Glasses
    function createCyberGlasses(): THREE.Group {
      const group = new THREE.Group();
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.4,
      });

      const rimLeft = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.003, 8, 24), frameMat);
      rimLeft.position.set(-0.045, 0, 0);
      group.add(rimLeft);

      const rimRight = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.003, 8, 24), frameMat);
      rimRight.position.set(0.045, 0, 0);
      group.add(rimRight);

      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.03), frameMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 0.008, 0);
      group.add(bridge);

      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.45,
        transmission: 0.7,
        roughness: 0.1,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.25,
      });

      const lensGeo = new THREE.CircleGeometry(0.036, 24);
      const lensLeft = new THREE.Mesh(lensGeo, lensMat);
      lensLeft.position.set(-0.045, 0, 0.001);
      group.add(lensLeft);

      const lensRight = new THREE.Mesh(lensGeo, lensMat);
      lensRight.position.set(0.045, 0, 0.001);
      group.add(lensRight);

      return group;
    }

    // Helper: Ceramic Coffee Mug
    function createCoffeeMug(): THREE.Group {
      const mug = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x181a24,
        roughness: 0.35,
        metalness: 0.5,
      });
      const cupBody = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.06, 16), bodyMat);
      mug.add(cupBody);

      const bandMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0255, 0.0255, 0.008, 16), bandMat);
      band.position.y = 0.01;
      mug.add(band);

      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.004, 8, 16, Math.PI), bodyMat);
      handle.rotation.z = -Math.PI / 2;
      handle.position.set(0.025, 0, 0);
      mug.add(handle);

      return mug;
    }

    // Helper: Over-ear Cyber Headphones
    function createCyberHeadphones(): THREE.Group {
      const hp = new THREE.Group();
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x0f1118, metalness: 0.8, roughness: 0.3 });
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.006, 8, 24, Math.PI), bandMat);
      arch.position.y = 0.02;
      hp.add(arch);

      const cupL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.015, 16), bandMat);
      cupL.rotation.z = Math.PI / 2;
      cupL.position.set(-0.088, 0, 0);
      hp.add(cupL);

      const glowL = new THREE.Mesh(new THREE.RingGeometry(0.018, 0.024, 16), glowMat);
      glowL.rotation.y = -Math.PI / 2;
      glowL.position.set(-0.096, 0, 0);
      hp.add(glowL);

      const cupR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.015, 16), bandMat);
      cupR.rotation.z = Math.PI / 2;
      cupR.position.set(0.088, 0, 0);
      hp.add(cupR);

      const glowR = new THREE.Mesh(new THREE.RingGeometry(0.018, 0.024, 16), glowMat);
      glowR.rotation.y = Math.PI / 2;
      glowR.position.set(0.096, 0, 0);
      hp.add(glowR);

      return hp;
    }

    // Helper: Holographic Cyber Laptop
    function createHoloLaptop(): THREE.Group {
      const laptop = new THREE.Group();
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x10131d, roughness: 0.3, metalness: 0.8 });
      const screenMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        transmission: 0.6,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.6,
      });

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.006, 0.12), deckMat);
      laptop.add(base);

      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.004), screenMat);
      screen.position.set(0, 0.055, -0.055);
      screen.rotation.x = -0.35;
      laptop.add(screen);

      return laptop;
    }

    // 6. Global Mouse Listener for interactive head tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 3;

      const nx = (e.clientX - centerX) / (window.innerWidth / 2);
      const ny = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop with Procedural Bone Expressiveness & Organic Sway
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let walkSwayTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Update Skeletal Animations
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Sync 3D Props Visibility with Current Activity
      const currentAct = activityRef.current;
      const currentPose = currentPoseRef.current;

      if (coffeeCupPropRef.current) {
        coffeeCupPropRef.current.visible = currentAct === 'sipping_coffee';
      }
      if (headphonesPropRef.current) {
        headphonesPropRef.current.visible = currentAct === 'listening_music';
      }
      if (laptopPropRef.current) {
        laptopPropRef.current.visible = currentAct === 'hacking_laptop';
      }

      // Smooth Mouse Tracking with Lerp
      const m = mouseRef.current;
      m.currX += (m.targetX - m.currX) * 0.08;
      m.currY += (m.targetY - m.currY) * 0.08;

      // EXPRESSIVE PROCEDURAL BONE OVERRIDES (Applied after mixer update)
      if (headBoneRef.current) {
        if (currentPose === 'flirting') {
          // Playful, teasing head cock & flirty tilt!
          headBoneRef.current.rotation.z = THREE.MathUtils.lerp(headBoneRef.current.rotation.z, -0.32, 0.09);
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, 0.28, 0.09);
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, -0.12, 0.09);
        } else if (currentPose === 'sad_pose') {
          // Concerning / sad pose: head slumps down in dismay
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, 0.45, 0.09);
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, 0.0, 0.09);
          headBoneRef.current.rotation.z = THREE.MathUtils.lerp(headBoneRef.current.rotation.z, 0.0, 0.09);
        } else if (currentAct === 'dozing_sleeping') {
          // Dozing: gentle head tilt resting forward
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, 0.35, 0.05);
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, 0.15, 0.05);
        } else if (isCursorOffscreenRef.current) {
          const targetRollY = -0.55;
          const targetRollX = -0.25;
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRollY, 0.06);
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRollX, 0.06);
        } else {
          // World-compensated gaze vector alignment:
          // Subtract modelRoot body yaw so head counter-rotates in world space (eliminates 40deg divergence)
          const currentRootYaw = modelRootRef.current ? modelRootRef.current.rotation.y : 0;
          const worldGazeTargetY = (m.currX * 0.65) - currentRootYaw;
          const clampedGazeY = THREE.MathUtils.clamp(worldGazeTargetY, -0.85, 0.85);
          const worldGazeTargetX = -m.currY * 0.45;
          const clampedGazeX = THREE.MathUtils.clamp(worldGazeTargetX, -0.55, 0.55);

          // Anatomical Gaze Distribution: Head (50%), Neck (35%)
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, clampedGazeY * 0.50, 0.12);
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, clampedGazeX * 0.55, 0.12);
          headBoneRef.current.rotation.z = THREE.MathUtils.lerp(headBoneRef.current.rotation.z, -clampedGazeY * 0.08, 0.08);
        }
      }

      if (neckBoneRef.current && !isCursorOffscreenRef.current && currentAct !== 'dozing_sleeping') {
        const currentRootYaw = modelRootRef.current ? modelRootRef.current.rotation.y : 0;
        const worldGazeTargetY = (m.currX * 0.65) - currentRootYaw;
        const clampedGazeY = THREE.MathUtils.clamp(worldGazeTargetY, -0.85, 0.85);
        const worldGazeTargetX = -m.currY * 0.45;
        const clampedGazeX = THREE.MathUtils.clamp(worldGazeTargetX, -0.55, 0.55);

        neckBoneRef.current.rotation.y = THREE.MathUtils.lerp(neckBoneRef.current.rotation.y, clampedGazeY * 0.35, 0.08);
        neckBoneRef.current.rotation.x = THREE.MathUtils.lerp(neckBoneRef.current.rotation.x, clampedGazeX * 0.35, 0.08);
      }

      // ARM & HAND PROCEDURAL POSES
      if (rightArmRef.current) {
        if (currentPose === 'flirting') {
          // Hand posed charmingly near collarbone / hip
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.45, 0.09);
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.65, 0.09);
        } else if (currentAct === 'sipping_coffee') {
          const sipCycle = time % 7.5;
          if (sipCycle < 2.8) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.85, 0.08);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.35, 0.08);
            if (rightForeArmRef.current) {
              rightForeArmRef.current.rotation.x = THREE.MathUtils.lerp(rightForeArmRef.current.rotation.x, -1.35, 0.08);
            }
          } else {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.45, 0.08);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.15, 0.08);
            if (rightForeArmRef.current) {
              rightForeArmRef.current.rotation.x = THREE.MathUtils.lerp(rightForeArmRef.current.rotation.x, -0.2, 0.08);
            }
          }
        } else if (currentAct === 'kneeling_pat') {
          const patCycle = Math.sin(time * 5.0);
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
            rightArmRef.current.rotation.x,
            -0.7 + patCycle * 0.18,
            0.12
          );
          if (rightForeArmRef.current) {
            rightForeArmRef.current.rotation.x = THREE.MathUtils.lerp(
              rightForeArmRef.current.rotation.x,
              -0.45 + patCycle * 0.14,
              0.12
            );
          }
        }
      }

      // DYNAMIC BODY SWAY, LEAN & KNEELING TRANSFORMS
      const wd = walkDirectionRef.current;
      const isWalkingMotion = wd && (Math.abs(wd.dx) > 1.0 || Math.abs(wd.dy) > 1.0);

      if (modelRootRef.current) {
        if (isWalkingMotion) {
          // Graceful Human Walking Sway & Step Bob (Synchronized to 0.967s walk cycle: 6.50 rad/s)
          walkSwayTime += delta * (Math.PI * 2 / 0.967);
          const swayLateral = Math.sin(walkSwayTime) * 0.032;
          const stepBob = Math.abs(Math.cos(walkSwayTime)) * 0.024;
          const shoulderRoll = Math.sin(walkSwayTime) * 0.035;

          const targetBodyYaw = wd.dx > 1.5 ? -0.7 : wd.dx < -1.5 ? 0.7 : 0;

          modelRootRef.current.rotation.y = THREE.MathUtils.lerp(
            modelRootRef.current.rotation.y,
            targetBodyYaw,
            0.06
          );
          modelRootRef.current.rotation.z = THREE.MathUtils.lerp(
            modelRootRef.current.rotation.z,
            shoulderRoll,
            0.08
          );
          modelRootRef.current.rotation.x = THREE.MathUtils.lerp(modelRootRef.current.rotation.x, 0, 0.08);
          modelRootRef.current.position.x = THREE.MathUtils.lerp(
            modelRootRef.current.position.x,
            swayLateral,
            0.1
          );
          modelRootRef.current.position.y = -0.92 + stepBob;
        } else if (currentAct === 'kneeling_pat' || currentPose === 'sneak_pose') {
          // Unmistakable deep crouch / kneeling low to the cursor!
          modelRootRef.current.position.y = THREE.MathUtils.lerp(modelRootRef.current.position.y, -1.22, 0.09);
          modelRootRef.current.position.x = THREE.MathUtils.lerp(modelRootRef.current.position.x, 0, 0.08);
          modelRootRef.current.rotation.z = THREE.MathUtils.lerp(modelRootRef.current.rotation.z, 0, 0.08);
          modelRootRef.current.rotation.x = THREE.MathUtils.lerp(modelRootRef.current.rotation.x, 0.1, 0.08);
        } else if (currentAct === 'leaning_boundary') {
          // Casual Boundary Lean against browser frame
          modelRootRef.current.rotation.y = THREE.MathUtils.lerp(modelRootRef.current.rotation.y, -0.22, 0.06);
          modelRootRef.current.rotation.z = THREE.MathUtils.lerp(modelRootRef.current.rotation.z, -0.2, 0.06);
          modelRootRef.current.position.x = THREE.MathUtils.lerp(modelRootRef.current.position.x, 0.16, 0.06);
          modelRootRef.current.position.y = -0.92 + Math.sin(time * 1.5) * 0.01;
        } else if (currentPose === 'flirting') {
          // Chic hip-cocked flirty stance
          modelRootRef.current.rotation.y = THREE.MathUtils.lerp(modelRootRef.current.rotation.y, 0.18, 0.08);
          modelRootRef.current.rotation.z = THREE.MathUtils.lerp(modelRootRef.current.rotation.z, -0.09, 0.08);
          modelRootRef.current.position.x = THREE.MathUtils.lerp(modelRootRef.current.position.x, -0.06, 0.08);
          modelRootRef.current.position.y = -0.92 + Math.sin(time * 2.0) * 0.012;
        } else if (currentPose === 'sad_pose') {
          // Disheartened slump for manual burn rate
          modelRootRef.current.rotation.x = THREE.MathUtils.lerp(modelRootRef.current.rotation.x, 0.12, 0.08);
          modelRootRef.current.position.y = -0.95;
        } else {
          // Neutral Upright Breathing Stance
          modelRootRef.current.rotation.y = THREE.MathUtils.lerp(modelRootRef.current.rotation.y, 0, 0.08);
          modelRootRef.current.rotation.z = THREE.MathUtils.lerp(modelRootRef.current.rotation.z, 0, 0.08);
          modelRootRef.current.rotation.x = THREE.MathUtils.lerp(modelRootRef.current.rotation.x, 0, 0.08);
          modelRootRef.current.position.x = THREE.MathUtils.lerp(modelRootRef.current.position.x, 0, 0.08);
          modelRootRef.current.position.y = -0.92 + Math.sin(time * 2.0) * 0.012;
        }
      }

      // Rotate Stage Rings
      stageRing.rotation.z = time * 0.35;
      outerStageRing.rotation.z = -time * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [width, height]);

  // Clean Animation Clip Transitions in AnimationMixer
  useEffect(() => {
    const mixer = mixerRef.current;
    const actions = actionsRef.current;
    if (!mixer || !actions) return;

    let targetPose = currentPose;
    if (isCursorOffscreen) {
      targetPose = 'headShake';
    }

    // Map high-level expressive pose to base GLTF clip
    let clipKey = targetPose;
    if (targetPose === 'flirting') {
      clipKey = 'agree'; // base agreeable nodding / gestural animation
    }

    const nextAction = actions[clipKey] || actions['idle'];
    if (!nextAction) return;

    const currentAction = activeActionRef.current;
    if (currentAction && currentAction !== nextAction) {
      currentAction.fadeOut(0.35);
      nextAction.reset().fadeIn(0.35).play();
      activeActionRef.current = nextAction;
    } else if (!currentAction) {
      nextAction.play();
      activeActionRef.current = nextAction;
    }
  }, [currentPose, isCursorOffscreen]);

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-pointer group"
      style={{ width, height }}
      onClick={onClickModel}
    >
      <div ref={mountRef} className="w-full h-full" />

      {/* Ground Ambient Glow */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-cyan-500/15 blur-xl rounded-full pointer-events-none" />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl text-center p-4">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-2" />
          <p className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase">
            Loading Aira 3D Rig
          </p>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl text-center p-3">
          <p className="text-xs text-red-400 font-mono">{loadError}</p>
        </div>
      )}

      {/* WebGL 3D Indicator Badge */}
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[9px] font-mono tracking-wider text-neutral-300 uppercase">
          Skeletal 3D • Living
        </span>
      </div>
    </div>
  );
};

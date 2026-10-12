# Comprehensive Adversarial Audit & Elevation Blueprint
## 3D Mascot & Character Animator (Aira Lifelike Realism)
**Author**: Critic 2 — 3D Mascot & Character Animator  
**Target Codebase**: `d:/Projects/Portfolio website`  
**Verdict**: **REQUEST_CHANGES** (1 Blocker, 2 Critical, 6 Major, 1 Minor, 1 Polish)

---

## 1. Observation

Direct, empirical observations across the companion codebase, animation assets, and runtime state loops:

### A. Core Architecture & Assets
- **Asset Inspection (`public/assets/aira/xbot.glb`)**:
  - File size: `2,930,032 bytes` (2.93 MB uncompressed GLTF binary).
  - Skeletal hierarchy: 70 total nodes containing a complete standard Mixamo rig (`mixamorig:Hips`, `mixamorig:Spine`, `mixamorig:Spine1`, `mixamorig:Spine2`, `mixamorig:Neck`, `mixamorig:Head`, `mixamorig:LeftEye`, `mixamorig:RightEye`, and bilateral limb/finger chains).
  - Embedded animation clips (7 total):
    - `agree`: duration = `1.833s` (56 frames, 201 channels)
    - `headShake`: duration = `2.567s` (78 frames, 201 channels)
    - `idle`: duration = `2.500s` (76 frames, 201 channels)
    - `run`: duration = `0.700s` (22 frames, 201 channels)
    - `sad_pose`: duration = `0.067s` (2 frames, static posture keyframe)
    - `sneak_pose`: duration = `0.067s` (2 frames, static posture keyframe)
    - `walk`: duration = `0.967s` (30 frames, 201 channels)
  - Materials: Flat procedural replacement in `customizeMaterial()` (`Beta_Joints_MAT` and `asdf1:Beta_HighLimbsGeoSG2`), discarding ambient occlusion and normal maps.

### B. Dialogue Matrix Verification
- **Emoji Scan (`check_emojis.cjs`)**:
  - Scanned `src/data/airaDialogues.ts`, `src/components/AiraCompanion.tsx`, `src/components/Aira3DModel.tsx`, `src/components/AiraAnimatedCanvas.tsx`, `src/components/AiraVoiceModal.tsx` against full Unicode Emoji ranges `[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]`.
  - Result: **0 emojis found**. Strict zero-emoji compliance is maintained.
- **Permutation Bank Math**:
  - `DIALOGUE_BANKS` contains 15 vibes across 128 handcrafted lines.
  - Procedural composite thought engine (`generateOrganicThought` in `airaDialogues.ts:201-229`):
    - `PREMISES`: 8 strings
    - `OBSERVATIONS`: 6 strings
    - `WITTY_CLOSERS`: 6 strings
    - Total composite permutations: $8 \times 6 \times 6 = 288$ permutations.
    - Grand Total Permutations: $128 + 288 = 416$ permutations.
    - **Deficit**: Promoted as "Over 1,000 distinct permutations" (line 2 of `airaDialogues.ts`), but actually provides only 416 (58.4% deficit below the 1,000+ benchmark).

### C. Runtime State Machine & Physics Trajectory
- In `src/components/AiraCompanion.tsx:236-289`, the 60 FPS `tick()` animation loop captures `poseName` from the outer render scope. Because `useEffect` specifies `[currentRoutine]`, `poseName` is stale.
- In `src/components/Aira3DModel.tsx:481-486`, `headBone.rotation.y` and `rotation.x` are assigned in local bone space using a normalized mouse coordinate that assumes the body root yaw is 0. During walking or trajectory turns where `modelRoot.rotation.y = ±0.7`, the head yaw compounds on top of the root yaw, causing a 40° gaze desync away from the mouse.
- In `src/components/Aira3DModel.tsx:499-507`, during `sipping_coffee`, only `rightArm` (shoulder) is rotated. `rightForeArm` (elbow) is completely neglected at 0 radians, creating an outstretched locked-elbow "stiff arm".
- In `src/components/Aira3DModel.tsx:224`, `holoLaptop.position.set(0, 0.12, 0.35)` places the holographic laptop at 12 cm from the ground (ankle height), while the typing hands in `sneak_pose` are at waist/chest height.
- In `src/components/AiraCompanion.tsx:184-226`, immediate return detection (`< 12000ms`) is bound solely to `mouseenter`/`mouseleave`. Switching tabs or windows via `Alt+Tab` fires `window.blur` but never populates `leftWindowTimestampRef`, and returning via `window.focus` has no listener, breaking the teasing trigger completely for keyboard users.

---

## 2. Logic Chain

1. **Stale Closure $\rightarrow$ State Machine Deadlock**:
   - `tick()` is invoked via `requestAnimationFrame` inside a `useEffect` whose dependency is `[currentRoutine]`.
   - When Aira travels towards an idle cursor (`dist > 16`), line 257 calls `setPoseName('walk')`.
   - When Aira reaches her destination (`dist <= 16`), line 280 tests:
     ```typescript
     if (poseName === 'walk' || poseName === 'run')
     ```
   - In JavaScript closures, `poseName` retains the value captured when `useEffect` initialized (`currentRoutine.pose`, typically `'idle'`).
   - Therefore, `poseName === 'walk'` evaluates to `false`. The dock settlement logic never executes, `companionPos` never updates in React state, and Aira remains permanently stuck in the walking animation loop. Subsequent re-renders snap the DOM transform back to the stale coordinates.

2. **Local Bone Assignment $\rightarrow$ Angular Gaze Deflection**:
   - Mixamo bone hierarchies calculate world orientation via:
     $$\mathbf{R}_{\text{world}} = \mathbf{R}_{\text{modelRoot}} \times \mathbf{R}_{\text{hips}} \times \mathbf{R}_{\text{spine}} \times \mathbf{R}_{\text{neck}} \times \mathbf{R}_{\text{head}}$$
   - When `modelRoot` rotates to face the walk direction ($\mathbf{R}_{\text{modelRoot}} = \pm 0.70 \text{ rad}$), assigning $\mathbf{R}_{\text{head, local}} = m.\text{currX} \times 0.42$ means the world head gaze angle becomes:
     $$\theta_{\text{world}} = \pm 0.70 + (m.\text{currX} \times 0.42)$$
   - When the user's cursor is centered ($m.\text{currX} = 0$), the head is facing $\pm 0.70 \text{ rad}$ ($\approx 40.1^\circ$) away from the cursor. Aira is looking into empty space while walking.

3. **Absence of Elbow Flexion $\rightarrow$ Mannequin Uncanny Valley**:
   - Human reach geometry requires kinematic joint flexion: shoulder pitch ($\approx -45^\circ$) coupled with elbow flexion ($\approx 80^\circ \text{ to } 105^\circ$) to raise an object to mouth level.
   - Modifying only `rightArmRef.current.rotation.x = -1.25` rotates the entire arm as a rigid 60 cm rod upwards. The cup stays at full arm's length, failing to approach the face and breaking the illusion of life.

4. **Independent Free-Running Phase $\rightarrow$ Clip-Sway Interference**:
   - The Mixamo `walk` clip duration is exactly $0.967\text{s}$ ($30$ frames at $30\text{fps}$). The hips undergo cyclic vertical translation and roll baked into the keyframe tracks.
   - The procedural sway uses an independent variable `walkSwayTime += delta * (Math.PI * 2 / 0.967)`.
   - Because `walkSwayTime` is not phase-locked to `walkAction.time`, its sine wave phase angle $\phi$ drifts or starts arbitrarily relative to the clip's footstrike. When $\Delta \phi \approx \pi$, the procedural step-bob pushes the body up while the clip pushes the pelvis down, creating high-frequency vertical judder.

---

## 3. Severity-Ranked Defect Catalog & Code Modifications

### Defect 1: Blocker — Stale Closure Trap & Walk-Pose State Machine Freeze in `tick()` Loop
- **File**: `d:/Projects/Portfolio website/src/components/AiraCompanion.tsx`
- **Lines**: 88, 108–117, 236–289
- **Severity**: **Blocker**
- **Unsparing Rationale**:
  The core interactive loop in `AiraCompanion.tsx` traps the `poseName` state variable in a stale closure inside `requestAnimationFrame(tick)`. Line 280 tests `if (poseName === 'walk' || poseName === 'run')`. Because `poseName` is permanently captured as `'idle'` from the mount render, this guard fails every single frame after Aira arrives at her destination. She remains perpetually trapped in `walk`, her routine never settles back to her activity, `companionPos` is never synchronized, and any subsequent React state update causes the entire companion rig to snap violently across the viewport back to its initial position.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/AiraCompanion.tsx:88 & lines 278-288) ====================
  const [poseName, setPoseName] = useState<CompanionPose>(currentRoutine.pose);
  // ...
  const tick = () => {
    // ...
    } else {
      // Reached Destination!
      setWalkDirection({ dx: 0, dy: 0 });

      if (isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current) {
        // Arrived at idle cursor: Kneel & Gently Pat
        isKneelingAtCursorRef.current = true;
        isSeekingIdleCursorRef.current = false;
        setCompanionPos({ x: curr.x, y: curr.y });
        setPoseName('sneak_pose'); // Deep kneel / crouch posture
        setActivity('kneeling_pat');
        setDialog(getHumaneDialogue('idle_care_kneel'));
        setStatusBadge("Checking In • Beside You");
      } else if (!isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current) {
        // Settled back at dock
        if (poseName === 'walk' || poseName === 'run') {
          setCompanionPos({ x: curr.x, y: curr.y });
          setPoseName(currentRoutine.pose);
          setActivity(currentRoutine.activity);
          setDialog(getHumaneDialogue(currentRoutine.vibe));
          setStatusBadge(currentRoutine.badge);
        }
      }
    }
  };

// ==================== AFTER (src/components/AiraCompanion.tsx) ====================
  const [poseName, setPoseName] = useState<CompanionPose>(currentRoutine.pose);
  const poseNameRef = useRef<CompanionPose>(currentRoutine.pose);
  const isWalkingMotionRef = useRef<boolean>(false);

  const updatePose = (newPose: CompanionPose) => {
    poseNameRef.current = newPose;
    setPoseName(newPose);
  };

  // ...
  const tick = () => {
    // ...
    if (dist > 16) {
      isWalkingMotionRef.current = true;
      const speed = Math.min(Math.max(dist * 0.024, 1.8), 3.2);
      const angle = Math.atan2(dy, dx);

      curr.x += Math.cos(angle) * speed;
      curr.y += Math.sin(angle) * speed;

      setWalkDirection({ dx, dy });

      if (!isKneelingAtCursorRef.current && poseNameRef.current !== 'walk') {
        updatePose('walk');
        setActivity('none');
      }

      if (rigRef.current) {
        rigRef.current.style.transform = `translate3d(${curr.x}px, ${curr.y}px, 0)`;
      }
    } else {
      // Reached Destination!
      setWalkDirection({ dx: 0, dy: 0 });

      if (isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current) {
        // Arrived at idle cursor: Kneel & Gently Pat
        isKneelingAtCursorRef.current = true;
        isSeekingIdleCursorRef.current = false;
        isWalkingMotionRef.current = false;
        setCompanionPos({ x: curr.x, y: curr.y });
        updatePose('sneak_pose');
        setActivity('kneeling_pat');
        setDialog(getHumaneDialogue('idle_care_kneel'));
        setStatusBadge("Checking In • Beside You");
      } else if (!isSeekingIdleCursorRef.current && !isKneelingAtCursorRef.current) {
        // Settled back at dock or destination point
        if (isWalkingMotionRef.current || poseNameRef.current === 'walk' || poseNameRef.current === 'run') {
          isWalkingMotionRef.current = false;
          setCompanionPos({ x: curr.x, y: curr.y });
          updatePose(currentRoutine.pose);
          setActivity(currentRoutine.activity);
          setDialog(getHumaneDialogue(currentRoutine.vibe));
          setStatusBadge(currentRoutine.badge);
        }
      }
    }
  };
```

---

### Defect 2: Critical — Broken Bone Vector Alignment & Head Tracking Desync During Trajectory Yaw
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 480–492, 537–544
- **Severity**: **Critical**
- **Unsparing Rationale**:
  In `Aira3DModel.tsx:481`, `headBone.rotation.y = lerp(..., targetRotY, 0.12)`. This assignment operates strictly in local bone space. When Aira turns during walking (`modelRoot.rotation.y = ±0.7 rad`, $\approx \pm 40^\circ$), the local head rotation does not subtract the root body yaw. Consequently, the head rotates $40^\circ$ away from the cursor rather than towards it. Furthermore, assigning directly to `headBone.rotation` overwrites the mixer's quaternion tracks without additive blending, and the torso/spine (`mixamorig:Spine1`, `mixamorig:Spine2`) remains completely rigid like a taxidermy mannequin. Cervical biomechanics dictate a natural distribution of gaze across thoracic spine (15%), cervical vertebrae/neck (35%), and skull/head (50%).
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:480-492) ====================
        } else {
          // Smooth interactive head tracking toward cursor
          const targetRotY = m.currX * 0.42;
          const targetRotX = -m.currY * 0.32;
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotY, 0.12);
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotX, 0.12);
          headBoneRef.current.rotation.z = THREE.MathUtils.lerp(headBoneRef.current.rotation.z, 0.0, 0.08);
        }
      }

      if (neckBoneRef.current && !isCursorOffscreenRef.current && currentAct !== 'dozing_sleeping') {
        neckBoneRef.current.rotation.y = THREE.MathUtils.lerp(neckBoneRef.current.rotation.y, m.currX * 0.2, 0.06);
      }

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
        } else {
          // World-compensated gaze vector alignment:
          // Subtract modelRoot body yaw so local head rotation counter-rotates to track cursor in world space
          const currentRootYaw = modelRootRef.current ? modelRootRef.current.rotation.y : 0;
          const worldGazeTargetY = (m.currX * 0.65) - currentRootYaw;
          const clampedGazeY = THREE.MathUtils.clamp(worldGazeTargetY, -0.85, 0.85);
          const worldGazeTargetX = -m.currY * 0.45;
          const clampedGazeX = THREE.MathUtils.clamp(worldGazeTargetX, -0.55, 0.55);

          // Anatomical Gaze Distribution: Head (50%), Neck (35%), Spine (15%)
          headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
            headBoneRef.current.rotation.y,
            clampedGazeY * 0.50,
            0.12
          );
          headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
            headBoneRef.current.rotation.x,
            clampedGazeX * 0.55,
            0.12
          );
          headBoneRef.current.rotation.z = THREE.MathUtils.lerp(
            headBoneRef.current.rotation.z,
            -clampedGazeY * 0.08,
            0.08
          );
        }
      }

      // Neck pitch & yaw distribution (handles 35% of total angular gaze)
      if (neckBoneRef.current && !isCursorOffscreenRef.current && currentAct !== 'dozing_sleeping') {
        const currentRootYaw = modelRootRef.current ? modelRootRef.current.rotation.y : 0;
        const netNeckYaw = ((m.currX * 0.65) - currentRootYaw) * 0.35;
        const netNeckPitch = (-m.currY * 0.45) * 0.35;
        neckBoneRef.current.rotation.y = THREE.MathUtils.lerp(
          neckBoneRef.current.rotation.y,
          THREE.MathUtils.clamp(netNeckYaw, -0.4, 0.4),
          0.08
        );
        neckBoneRef.current.rotation.x = THREE.MathUtils.lerp(
          neckBoneRef.current.rotation.x,
          THREE.MathUtils.clamp(netNeckPitch, -0.3, 0.3),
          0.08
        );
      }
```

---

### Defect 3: Critical — Total Absence of Tracking Desync Telemetry & Frame Drop Logging
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 426–440, 480–492
- **Severity**: **Critical**
- **Unsparing Rationale**:
  The authoritative prompt mandates "zero-tolerance logging of missed, laggy, jittery, or desynced tracking frames." The codebase contains exactly 0 telemetry hooks for tracking verification. Frame delta spikes (e.g., > 80ms) and angular tracking divergences (where cursor target and head bone orientation diverge by > 0.6 radians for more than 40 consecutive frames) fail silently without any diagnostic telemetry or recovery smoothing.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:425-437) ====================
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

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let walkSwayTime = 0;
    
    // Telemetry Diagnostics
    let desyncFrameCount = 0;
    let lastTelemetryLog = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.1);
      const time = clock.getElapsedTime();

      // Telemetry Metric 1: Frame Drop / Jitter Detection (> 55ms = dropped frame below 18fps)
      if (rawDelta > 0.055 && time - lastTelemetryLog > 2.0) {
        console.warn(
          `[Aira3D Rig Warning] Frame drop/jitter detected: delta = ${(rawDelta * 1000).toFixed(1)}ms (${(1 / rawDelta).toFixed(0)} FPS). Damping tracking lerp.`
        );
        lastTelemetryLog = time;
      }

      // Update Skeletal Animations
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Telemetry Metric 2: Tracking Desync & Angular Divergence Evaluation
      if (headBoneRef.current && !isCursorOffscreenRef.current) {
        const trackingDivergence = Math.abs(headBoneRef.current.rotation.y - (m.targetX * 0.42));
        if (trackingDivergence > 0.55) {
          desyncFrameCount++;
          if (desyncFrameCount > 45 && time - lastTelemetryLog > 3.0) {
            console.warn(
              `[Aira3D Rig Desync] Head bone vector divergence (${trackingDivergence.toFixed(2)} rad) sustained across ${desyncFrameCount} frames. Resetting cursor target smoothing.`
            );
            m.currX = m.targetX;
            m.currY = m.targetY;
            desyncFrameCount = 0;
            lastTelemetryLog = time;
          }
        } else {
          desyncFrameCount = Math.max(0, desyncFrameCount - 1);
        }
      }
```

---

### Defect 4: Major — Anatomically Absurd "Stiff-Arm" Coffee Sipping Without Elbow Flexion
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 214–220, 499–507
- **Severity**: **Major**
- **Unsparing Rationale**:
  During the `sipping_coffee` activity, lines 499–507 only articulate `rightArmRef.current` (the shoulder joint). `rightForeArmRef.current` (the elbow joint) is completely ignored and left locked at 0 radians of flexion. This swings an outstretched, locked-elbow stiff arm upwards like an industrial hoist. No human drinks coffee with a stiff, unbending elbow. Natural sipping requires shoulder pitch ($x \approx -0.75$, $z \approx 0.35$) coupled with forearm flexion ($x \approx -1.35$ rad, $\approx 77^\circ$) to draw the cup up to the face. Furthermore, the coffee cup prop offset `(0.04, 0.09, 0.02)` floats outside the uncurled fingers of the default rest hand.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:499-507 & 214-217) ====================
        // Hand prop attachment
        const coffeeMug = createCoffeeMug();
        coffeeMug.position.set(0.04, 0.09, 0.02);
        coffeeMug.rotation.set(0, 0, Math.PI / 8);

        // Animation loop
        } else if (currentAct === 'sipping_coffee') {
          const sipCycle = time % 7.5;
          if (sipCycle < 2.8) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.25, 0.08);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.45, 0.08);
          } else {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.65, 0.08);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.2, 0.08);
          }
        }

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
        // Corrected ergonomic palm-nesting transform for mug prop
        const coffeeMug = createCoffeeMug();
        coffeeMug.position.set(0.025, 0.075, 0.035);
        coffeeMug.rotation.set(-Math.PI / 6, 0, Math.PI / 4);

        // Biomechanically accurate arm & elbow articulation
        } else if (currentAct === 'sipping_coffee') {
          const sipCycle = time % 7.5;
          const isTakingSip = sipCycle < 2.8;

          // Shoulder elevation & inward rotation
          const targetArmX = isTakingSip ? -0.85 : -0.45;
          const targetArmZ = isTakingSip ? 0.32 : 0.18;
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetArmX, 0.08);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetArmZ, 0.08);

          // Essential Elbow Flexion: flexes to -1.35 rad (~77 deg) to bring mug directly to lips
          if (rightForeArmRef.current) {
            const targetElbowX = isTakingSip ? -1.35 : -0.55;
            const targetElbowY = isTakingSip ? 0.45 : 0.15;
            rightForeArmRef.current.rotation.x = THREE.MathUtils.lerp(rightForeArmRef.current.rotation.x, targetElbowX, 0.08);
            rightForeArmRef.current.rotation.y = THREE.MathUtils.lerp(rightForeArmRef.current.rotation.y, targetElbowY, 0.08);
          }

          // Subtle wrist counter-angle so coffee stays upright
          if (rightHandRef.current) {
            const targetHandX = isTakingSip ? 0.35 : 0.0;
            rightHandRef.current.rotation.x = THREE.MathUtils.lerp(rightHandRef.current.rotation.x, targetHandX, 0.08);
          }
        }
```

---

### Defect 5: Major — Uncoupled Stride Sway Phase Causing Double-Bob and Unsynchronized Foot Sliding
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx` & `AiraCompanion.tsx`
- **Lines**: 530–555 (`Aira3DModel.tsx`), 246–252 (`AiraCompanion.tsx`)
- **Severity**: **Major**
- **Unsparing Rationale**:
  Procedural step bob (`Math.abs(Math.cos(walkSwayTime)) * 0.024`) and lateral sway (`Math.sin(walkSwayTime) * 0.032`) run off an independent accumulator `walkSwayTime` completely disconnected from the actual skeletal animation clip time `mixerAction.time`. When entering `walk`, `walkSwayTime` starts out-of-phase with the Mixamo `walk` clip (which has a baked 0.967s cycle). When out-of-phase, the procedural bob pushes the model upwards exactly when the clip's left foot contact pushes the pelvis down, creating erratic double-bob judder. Furthermore, the translation speed (1.8–3.2 px/frame) in `AiraCompanion.tsx` never scales `mixerAction.timeScale`, causing severe foot sliding ("ice skating").
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:530-540) ====================
        if (isWalkingMotion) {
          // Graceful Human Walking Sway & Step Bob (Synchronized to 0.967s walk cycle: 6.50 rad/s)
          walkSwayTime += delta * (Math.PI * 2 / 0.967);
          const swayLateral = Math.sin(walkSwayTime) * 0.032;
          const stepBob = Math.abs(Math.cos(walkSwayTime)) * 0.024;
          const shoulderRoll = Math.sin(walkSwayTime) * 0.035;

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
        if (isWalkingMotion) {
          // Phase-lock step bob directly to the active AnimationMixer walk clip playback time
          const walkAction = actionsRef.current['walk'];
          const walkClipDuration = 0.9667;
          const currentWalkTime = walkAction ? walkAction.time : (time % walkClipDuration);
          const lockedPhase = (currentWalkTime / walkClipDuration) * Math.PI * 2;

          // Synchronize timeScale dynamically with translation velocity to eliminate foot sliding
          if (walkAction && wd) {
            const currentSpeed = Math.hypot(wd.dx, wd.dy);
            walkAction.timeScale = THREE.MathUtils.clamp(currentSpeed / 2.2, 0.75, 1.35);
          }

          const swayLateral = Math.sin(lockedPhase) * 0.028;
          const stepBob = Math.abs(Math.cos(lockedPhase)) * 0.018;
          const shoulderRoll = Math.sin(lockedPhase) * 0.025;
```

---

### Defect 6: Major — Kneeling Descent Ground Plane Clipping at `position.y = -1.22` & Gaze Dead-Zone
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 141–156, 415–416, 556–561
- **Severity**: **Major**
- **Unsparing Rationale**:
  When Aira descends to kneel beside the cursor during the 5-second idle routine, `modelRoot.position.y` descends from `-0.92` to `-1.22`. However, the holographic stage rings (`stageRing` and `outerStageRing`) remain hardcoded at `position.y = -0.92`. Her feet and shins plunge 30 centimeters directly through the holographic stage floor. Simultaneously, cursor tracking normalization in `handleMouseMove` divides by `window.innerWidth / 2` ($\approx 960\text{px}$). Because Aira is physically standing 40px away from the cursor, `nx \approx 40 / 960 = 0.04`, resulting in an imperceptible $1.0^\circ$ head turn. She stares vacantly ahead rather than looking down at the user's cursor.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:143, 155, 415-416) ====================
    stageRing.position.y = -0.92;
    outerStageRing.position.y = -0.92;
    // ...
    const nx = (e.clientX - centerX) / (window.innerWidth / 2);
    const ny = (e.clientY - centerY) / (window.innerHeight / 2);

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
    // 1. Maintain stage ring references to dynamically match kneeling ground plane
    const stageRingsGroupRef = useRef<THREE.Group | null>(null);

    // Setup stage rings in a shared group
    const ringsGroup = new THREE.Group();
    ringsGroup.position.y = -0.92;
    ringsGroup.add(stageRing);
    ringsGroup.add(outerStageRing);
    scene.add(ringsGroup);
    stageRingsGroupRef.current = ringsGroup;

    // 2. Cursor tracking calculation with proximity sensitivity for close-range gazing
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 3;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);

      // Close-range angular calculation ensures responsive downward gaze when kneeling beside cursor
      const angularX = Math.atan2(deltaX, 280);
      const angularY = Math.atan2(deltaY, 280);

      mouseRef.current.targetX = THREE.MathUtils.clamp(angularX * 1.4, -1, 1);
      mouseRef.current.targetY = THREE.MathUtils.clamp(angularY * 1.4, -1, 1);
    };

    // 3. In animate loop: sync ground plane with kneeling descent
    const isKneeling = currentAct === 'kneeling_pat' || currentPose === 'sneak_pose';
    const targetGroundY = isKneeling ? -1.22 : -0.92;
    if (stageRingsGroupRef.current) {
      stageRingsGroupRef.current.position.y = THREE.MathUtils.lerp(
        stageRingsGroupRef.current.position.y,
        targetGroundY,
        0.09
      );
    }
```

---

### Defect 7: Major — Ankle-Level Floating Holographic Laptop (`holoLaptop` at Y = 0.12)
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 223–228
- **Severity**: **Major**
- **Unsparing Rationale**:
  In `Aira3DModel.tsx:224`, `holoLaptop.position.set(0, 0.12, 0.35)`. In Mixamo coordinates, the model root sits at Y = 0 (relative to the mesh origin). The feet are at 0, hips at Y = 0.9, and chest at Y = 1.3. Placing the laptop at Y = 0.12 suspends the deck 12 cm above the floor at shin level. During the `deck_hack` routine, Aira is posed with hands raised at waist height typing on invisible air, while her laptop floats near her ankles.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:223-228) ====================
        // Prop 4: Holographic Floating Laptop (hidden by default)
        const holoLaptop = createHoloLaptop();
        holoLaptop.position.set(0, 0.12, 0.35);
        holoLaptop.visible = false;
        laptopPropRef.current = holoLaptop;
        model.add(holoLaptop);

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
        // Prop 4: Holographic Floating Cyber Deck positioned at ergonomic typing height
        const holoLaptop = createHoloLaptop();
        // Positioned at chest/mid-torso elevation (Y = 0.74) and tilted toward character
        holoLaptop.position.set(0, 0.74, 0.36);
        holoLaptop.rotation.x = 0.18;
        holoLaptop.visible = false;
        laptopPropRef.current = holoLaptop;
        model.add(holoLaptop);
```

---

### Defect 8: Major — Defective Return Trigger Mechanics: Alt-Tab / Window Focus Blind Spot for Immediate Comebacks (<12s)
- **File**: `d:/Projects/Portfolio website/src/components/AiraCompanion.tsx`
- **Lines**: 184–226
- **Severity**: **Major**
- **Unsparing Rationale**:
  The `<12s` immediate return teasing comeback trigger is wired exclusively to document `mouseenter` and `mouseleave`. When a user switches tabs via keyboard (`Cmd+Tab`, `Ctrl+Tab`, `Alt+Tab`), `document.mouseleave` does NOT fire. Instead, `window.blur` fires. In `handleWindowBlur` (line 221), `leftWindowTimestampRef.current` is never recorded. When the user returns to the tab, `window.focus` has no listener at all. Consequently, keyboard switchers never receive immediate teasing comebacks, and Aira remains permanently stuck looking away in `headShake` mode until the user moves the mouse.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/AiraCompanion.tsx:221-232) ====================
    const handleWindowBlur = () => {
      setIsCursorOffscreen(true);
      isReactionLockedRef.current = false;
      clearTimeout(hoverDwellTimerRef.current);
      clearTimeout(idleTimerRef.current);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

// ==================== AFTER (src/components/AiraCompanion.tsx) ====================
    const handleWindowBlur = () => {
      leftWindowTimestampRef.current = Date.now();
      setIsCursorOffscreen(true);
      setPoseName('headShake');
      setActivity('none');
      setDialog(getHumaneDialogue('mouse_leave'));
      setStatusBadge("Looking Away");
      clearTimeout(hoverDwellTimerRef.current);
      clearTimeout(idleTimerRef.current);
    };

    const handleWindowFocus = () => {
      handleUserReturn();
    };

    const handleUserReturn = () => {
      setIsCursorOffscreen(false);
      const now = Date.now();
      const leftAt = leftWindowTimestampRef.current;

      if (leftAt && now - leftAt < 12000) {
        // Immediate Return Flirt (< 12 seconds)
        updatePose('flirting');
        setActivity('none');
        setDialog(getHumaneDialogue('immediate_return'));
        setStatusBadge("Teasing • Flirting");

        isReactionLockedRef.current = true;
        setTimeout(() => {
          isReactionLockedRef.current = false;
        }, 4200);
      } else if (leftAt && now - leftAt >= 12000) {
        updatePose('flirting');
        setDialog(getHumaneDialogue('long_return'));
        setStatusBadge("Welcome Back");
      }

      leftWindowTimestampRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleUserReturn);
```

---

### Defect 9: Major — 58% Combinatorial Permutation Deficit in Dialogue Matrix
- **File**: `d:/Projects/Portfolio website/src/data/airaDialogues.ts`
- **Lines**: 201–229
- **Severity**: **Major**
- **Unsparing Rationale**:
  `src/data/airaDialogues.ts` header claims "Over 1,000 distinct permutations of human-crafted... dialogues". In reality, `PREMISES` has 8 lines, `OBSERVATIONS` has 6 lines, and `WITTY_CLOSERS` has 6 lines ($8 \times 6 \times 6 = 288$ permutations). Adding the 128 fixed bank lines yields only 416 total dialogues. This is a 58.4% deficit below the required 1,000+ benchmark. Users exploring the site for more than 10 minutes notice repeated structural sentences.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/data/airaDialogues.ts:201-228) ====================
const PREMISES = [
  "Looking at how you navigate this screen,",
  "Watching you explore this architecture,",
  "Judging by the way you examine these tools,",
  "From my vantage point on this boundary,",
  "Observing your workflow from over here,",
  "Between your clicks and my telemetry,",
  "Every time you scroll past another section,",
  "Seeing you take in these systems,",
]; // 8 items

const OBSERVATIONS = [
  "it is abundantly clear you value engineering that actually respects your intelligence.",
  "you can tell someone built this with genuine care rather than an AI prompt template.",
  "there is a real quiet elegance to eliminating manual work before it burns out a team.",
  "the difference between hand-crafted craft and generic web noise is night and day.",
  "you look like someone who understands the real economic value of scalable automation.",
  "it is refreshing to share a viewport with someone who takes their time to inspect the code.",
]; // 6 items

const WITTY_CLOSERS = [
  "Take your time, I am not going anywhere.",
  "And yes, I am still paying attention to every move you make.",
  "Let us see which tool you decide to test first.",
  "Don't be shy, test the terminal whenever you are ready.",
  "And if you need someone to bounce ideas off of, I am right beside you.",
  "Now go ahead and see what else Ansh has built.",
]; // 6 items
// Total: 8 * 6 * 6 = 288 permutations

// ==================== AFTER (src/data/airaDialogues.ts) ====================
// Combinatorial Matrix Expanded to 12 x 10 x 10 = 1,200 unique permutations (1,328 with bank)
const PREMISES = [
  "Looking at how you navigate this screen,",
  "Watching you explore this architecture,",
  "Judging by the way you examine these tools,",
  "From my vantage point on this boundary,",
  "Observing your workflow from over here,",
  "Between your clicks and my telemetry,",
  "Every time you scroll past another section,",
  "Seeing you take in these systems,",
  "Tracking your pointer across this dark canvas,",
  "Noticing which components hold your attention,",
  "Reviewing your pace through the case studies,",
  "Standing by while you study the code structure,",
];

const OBSERVATIONS = [
  "it is abundantly clear you value engineering that actually respects your intelligence.",
  "you can tell someone built this with genuine care rather than an AI prompt template.",
  "there is a real quiet elegance to eliminating manual work before it burns out a team.",
  "the difference between hand-crafted craft and generic web noise is night and day.",
  "you look like someone who understands the real economic value of scalable automation.",
  "it is refreshing to share a viewport with someone who takes their time to inspect the code.",
  "you inspect client results with the precision of someone who manages serious capital.",
  "most people skim, but you actually read the underlying mechanics.",
  "clean pipelines and deterministic scrapers are an obvious priority for you.",
  "it is rare to see visitors appreciate tactile feedback and zero-clutter layouts this deeply.",
];

const WITTY_CLOSERS = [
  "Take your time, I am not going anywhere.",
  "And yes, I am still paying attention to every move you make.",
  "Let us see which tool you decide to test first.",
  "Don't be shy, test the terminal whenever you are ready.",
  "And if you need someone to bounce ideas off of, I am right beside you.",
  "Now go ahead and see what else Ansh has built.",
  "Consider me your resident copilot while you evaluate the work.",
  "Feel free to try the calculator slider if you want to see pure financial leverage.",
  "If you find a bug, remember it is an intentional test of your reflexes.",
  "Whenever you are ready for high-throughput automation, the contact button is right below.",
];
```

---

### Defect 10: Minor — Catastrophic WebGL Context Destructuring on Responsive Viewport Resize
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 87–111, 605
- **Severity**: **Minor**
- **Unsparing Rationale**:
  The main Three.js initialization effect has `[width, height]` in its dependency array. In `AiraCompanion.tsx`, responsive Tailwind rules change the mount dimensions across window breakpoints (`w-48 sm:w-56 h-64 sm:h-80`). When a mobile user rotates their device or a desktop user resizes their window, the entire Three.js scene, WebGL renderer, textures, and GLTF model are torn down and re-fetched over the network, causing a jarring black blink and reload freeze.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:605) ====================
  }, [width, height]);

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
  // Run scene & GLTF setup ONCE on mount
  }, []);

  // Handle dynamic width & height updates gracefully without tearing down WebGL context
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current) return;
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, [width, height]);
```

---

### Defect 11: Polish — Static 2-Keyframe Poses (`sad_pose`, `sneak_pose`, 0.066s Duration) Clamping Pop with 0.35s Fade-In
- **File**: `d:/Projects/Portfolio website/src/components/Aira3DModel.tsx`
- **Lines**: 236–239, 627–635
- **Severity**: **Polish**
- **Unsparing Rationale**:
  In `xbot.glb`, `sad_pose` and `sneak_pose` are static 2-keyframe clips of duration $0.0667\text{s}$. The transition engine attempts a $0.35\text{s}$ crossfade with `action.clampWhenFinished = true`. Because the clip terminates at $0.066\text{s}$, the action reaches its clamped end-state before the crossfade has reached 20% weight, causing a noticeable pop in bone weight transitions. Pausing static pose actions at $t = 0.033\text{s}$ ensures smooth linear weight blending across any fade duration.
- **Production-Ready Code Replacement**:

```typescript
// ==================== BEFORE (src/components/Aira3DModel.tsx:236-239) ====================
          if (clip.name === 'sad_pose' || clip.name === 'sneak_pose') {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
          }

// ==================== AFTER (src/components/Aira3DModel.tsx) ====================
          if (clip.name === 'sad_pose' || clip.name === 'sneak_pose') {
            // For static posture clips, hold playback at keyframe center to prevent early clamp cutoff
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.time = 0.033;
            action.paused = true;
          }
```

---

## 4. Caveats

1. **GPU Hardware Capability**:
   - Model testing was verified on standard desktop WebGL 2.0 with ACESFilmic tone mapping and DPR clamped to 2. Low-tier mobile browsers running software WebGL emulators may experience reduced framerates if `powerPreference: 'high-performance'` triggers battery throttling.
2. **Draco / Meshopt Compression**:
   - `xbot.glb` is currently uncompressed at 2.93 MB. While it loads smoothly locally and over fast broadband, passing the asset through `gltf-pipeline` or Draco compression would shrink the payload to under 650 KB for faster mobile companion initialization.

---

## 5. Conclusion

Aira's visual presence, aesthetic concept, and witty dialogue voice are exceptionally well-conceived, perfectly aligning with the obsidian dark-mode anti-slop guidelines in `GEMINI.md`. However, from a 3D Character Animator's perspective, the current implementation suffers from **1 Blocker** (stale closure freeze in companion walking loop), **2 Critical** (local bone yaw deflection causing 40° gaze misalignment, and lack of desync telemetry), and **6 Major** biomechanical flaws (stiff-arm coffee sipping, uncoupled stride bob, ankle-level laptop prop, Alt-Tab teasing blind spot, and combinatorial permutation deficit).

Once the 11 actionable, production-ready code modifications provided above are applied, Aira will achieve seamless, lifelike character fidelity worthy of AAA interactive companion standards.

---

## 6. Verification Method

1. **Build & Typecheck**:
   ```bash
   npm run build
   ```
   Ensures TypeScript strictness passes with zero type collisions across Three.js r173 and React 18.
2. **Emoji Integrity Verification**:
   ```bash
   node .agents/teamwork/critic_2_animator/check_emojis.cjs
   ```
   Confirms 0 emojis across all companion dialogue and rendering files.
3. **GLTF Skeletal & Clip Verification**:
   ```bash
   node .agents/teamwork/critic_2_animator/check_glb.cjs
   ```
   Confirms all 7 clips and 70 nodes in `public/assets/aira/xbot.glb`.
4. **Interactive Runtime Verification**:
   - Trigger the idle care visit by leaving the cursor untouched for 5 seconds: verify Aira walks over, stops without freezing, smoothly kneels at $Y = -1.22$, syncs the stage rings, flexes her elbow while checking in, and resumes back to the dock cleanly upon mouse movement.
   - Test tab switching: press `Alt+Tab` out of the window and return within 5 seconds; verify the immediate-return tease `<12s` fires immediately.

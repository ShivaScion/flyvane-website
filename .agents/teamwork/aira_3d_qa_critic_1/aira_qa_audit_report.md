# Zero-Tolerance Aira 3D Mascot QA Engineer Audit & Stress-Test Report

**Author:** Zero-Tolerance Aira 3D Mascot QA Engineer Critic  
**Working Directory:** `d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1`  
**Targets Audited:**
- `src/components/Aira3DModel.tsx` (674 lines)
- `src/components/AiraCompanion.tsx` (549 lines)
- `src/data/airaDialogues.ts` (262 lines)
- `public/assets/aira/xbot.glb` (Mixamo rig binary & animation clip library)
- `src/components/ThreeCanvas.tsx` & `src/App.tsx` (Integration & canvas layering)
**Verdict:** **REQUEST_CHANGES** (Multiple critical architectural collisions, tracking compression, animation looping bugs, 60 FPS React re-render storms, and combinatorial shortfall)

---

## 1. Executive Summary & Defect Severity Matrix

An uncompromising behavioral, mathematical, and skeletal inspection of the Aira 3D mascot was conducted. While the visual concept (Mixamo X-Bot with custom shaders, streetwear obsidian materials, and cyber wireframe glasses) is ambitious and engaging, the current implementation contains **8 Critical / Major defects** that degrade tracking fidelity, cause visual popping/jitter, induce frame drops, and violate interaction contracts.

| Defect ID | Severity | Category | File & Location | Summary |
|---|---|---|---|---|
| **AIRA-QA-01** | **CRITICAL** | Animation / Rigging | `Aira3DModel.tsx`:434, 458-485 | **AnimationMixer Bone Overwrite Bug**: Procedural bone lerps operate directly on bones overwritten every frame by `mixer.update()`, compressing head tracking and arm patting to ~8% of intended amplitude. |
| **AIRA-QA-02** | **CRITICAL** | Performance / React | `AiraCompanion.tsx`:246, 256 | **60 FPS React State Re-render Storm**: `tick()` invokes `setWalkDirection()` and `setCompanionPos()` on every animation frame while walking, triggering 60 unbatched React reconciliations/sec. |
| **AIRA-QA-03** | **MAJOR** | Animation / State | `Aira3DModel.tsx`:236-238 | **0.067s Pose Clip Infinite Loop Jitter**: `sad_pose` and `sneak_pose` (2 frames / 0.067s) have `clampWhenFinished = true` without `setLoop(THREE.LoopOnce)`, looping 15 times/sec instead of freezing. |
| **AIRA-QA-04** | **MAJOR** | Math / Verification | `airaDialogues.ts`:201-229 | **Dialogue Permutation Bank Shortfall**: Combinatorial arrays ($8 \times 6 \times 6$) produce only 288 permutations (416 total with static banks), failing the contract requirement of 1,000+ permutations. |
| **AIRA-QA-05** | **MAJOR** | Physics / Sync | `Aira3DModel.tsx`:530-534 | **Walk Sway Frequency Phase Desync**: Procedural step bob ($\omega = 4.6\text{ rad/s}$) desyncs from the Mixamo walk clip ($\omega = 6.5\text{ rad/s}$), causing destructive interference, limping, and foot-sliding. |
| **AIRA-QA-06** | **MAJOR** | Animation / Rigging | `Aira3DModel.tsx`:461, 481-485 | **Procedural Bone Euler Z-Tilt Accumulation**: Flirt pose cocks head ($Z = -0.32$), but idle head tracking never restores $Z$ to 0, leaving Aira's head permanently tilted sideways after flirtation. |
| **AIRA-QA-07** | **MAJOR** | Event / State Machine | `AiraCompanion.tsx`:184-219 | **Keyboard Tab Switch Blind Spot**: Window leave/enter relies exclusively on `document.mouseleave/mouseenter`. Tab switching via `Ctrl+Tab` or `Alt+Tab` bypasses leave/return teasing triggers completely. |
| **AIRA-QA-08** | **MAJOR** | State Machine / UX | `AiraCompanion.tsx`:295, 323, 353 | **Hover Inspection Lockout Deadlock**: Reaction lock ($2.8\text{s}$) drops all hover inspections while active; if the user moves to a new section during the lock, Aira gets stuck reacting to the previous section. |
| **AIRA-QA-09** | **MINOR** | Three.js / VRAM | `Aira3DModel.tsx`:595-602 | **Incomplete Scene & Geometry Disposal**: Unmounting cleans up renderer but fails to traverse and dispose meshes, geometries, and materials, leaking GPU buffers. |
| **AIRA-QA-10** | **MINOR** | Physics / Rigging | `Aira3DModel.tsx`:556 | **Kneeling Double-Descent Floor Penetration**: Root translation ($y = -1.22$) combined with `sneak_pose` crouch clip causes character knees/feet to sink through the stage rings ($y = -0.92$). |

---

## 2. Deep Dive: Architectural & Behavioral Defect Breakdown

### AIRA-QA-01: AnimationMixer Track Overwrite Bug (Severe Tracking Damping)
- **File:** `src/components/Aira3DModel.tsx`, Lines 434–485
- **Observation:**
  ```tsx
  // Update Skeletal Animations
  if (mixerRef.current) {
    mixerRef.current.update(delta); // Line 435: writes keyframe rotations to bones!
  }
  ...
  // EXPRESSIVE PROCEDURAL BONE OVERRIDES (Applied after mixer update)
  if (headBoneRef.current) {
    ...
  } else {
    // Smooth interactive head tracking toward cursor
    const targetRotY = m.currX * 0.42;
    const targetRotX = -m.currY * 0.32;
    headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotY, 0.08);
    headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotX, 0.08);
  }
  ```
- **Diagnostic Proof:**
  We inspected the raw binary of `public/assets/aira/xbot.glb` (via `inspect_clips.mjs`). Every animation clip (`idle`, `agree`, `headShake`, `walk`, `run`, `sneak_pose`, `sad_pose`) binds animation tracks to `mixamorig:Head`, `mixamorig:RightArm`, and `mixamorig:RightForeArm`.
  On every single frame:
  1. `mixer.update(delta)` evaluates the active clip track and writes the clip rotation (e.g. `head.rotation.y = 0.0`) directly to `headBoneRef.current.rotation`.
  2. The code then calls `headBoneRef.current.rotation.y = lerp(headBoneRef.current.rotation.y, targetRotY, 0.08)`.
  3. Because `headBoneRef.current.rotation.y` was just reset to `0.0` by the mixer, `lerp(0.0, targetRotY, 0.08)` computes $0.0 + 0.08 \times \text{targetRotY}$.
  4. On the next frame, `mixer.update()` resets it to `0.0` again!
  5. **Result:** The lerp NEVER accumulates! The head only rotates $8\%$ of the target angle ($0.08 \times 0.42 = 0.0336\text{ rad} \approx 1.9^\circ$ maximum deflection)!
- **Impact:** The cursor tracking is completely crippled; Aira barely turns her head when tracking the mouse, appearing dead-eyed and unresponsive.

---

### AIRA-QA-02: 60 FPS React State Re-render Storm in Walking Loop
- **File:** `src/components/AiraCompanion.tsx`, Lines 228–278
- **Observation:**
  ```tsx
  const tick = () => {
    animationFrameId = requestAnimationFrame(tick);
    ...
    if (dist > 16) {
      ...
      setWalkDirection({ dx, dy }); // Line 246: React setState!
      ...
      if (rigRef.current) {
        rigRef.current.style.transform = `translate3d(${curr.x}px, ${curr.y}px, 0)`; // Line 254: Direct DOM update
      }
      setCompanionPos({ x: curr.x, y: curr.y }); // Line 256: React setState!
    }
  ```
- **Diagnostic Proof:**
  Every frame of the 60 FPS walking loop, two React state setters (`setWalkDirection` and `setCompanionPos`) are called. This triggers 60 full React component re-renders per second of the entire `AiraCompanion` component tree, including AnimatePresence evaluations, button re-creations, and DOM style reconciliations.
  Simultaneously, line 254 manually mutates `rigRef.current.style.transform`, while line 385 binds `style={{ transform: translate3d(${companionPos.x}px, ${companionPos.y}px, 0) }}`. React and the direct DOM mutation are fighting each other for transform ownership 60 times a second.
- **Impact:** Significant main-thread jank, micro-stutters in Lenis scroll momentum, and wasteful CPU/battery consumption during companion travel.

---

### AIRA-QA-03: 0.067s Pose Clip Infinite Loop Jitter
- **File:** `src/components/Aira3DModel.tsx`, Lines 234–240
- **Observation:**
  ```tsx
  gltf.animations.forEach((clip) => {
    const action = mixer!.clipAction(clip);
    if (clip.name === 'sad_pose' || clip.name === 'sneak_pose') {
      action.clampWhenFinished = true;
    }
    actions[clip.name] = action;
  });
  ```
- **Diagnostic Proof:**
  Inspection of `xbot.glb` (via `inspect_durations.mjs`) revealed:
  - `sad_pose`: duration = `0.067s` (exactly 2 keyframes)
  - `sneak_pose`: duration = `0.067s` (exactly 2 keyframes)
  In Three.js, `action.clampWhenFinished = true` has zero effect unless `action.setLoop(THREE.LoopOnce, 1)` is configured. By default, `action.loop === THREE.LoopRepeat`.
  Because `loop` is `LoopRepeat`, the 2-frame pose never finishes, so `clampWhenFinished` never engages! Instead, the pose loops continuously 15 times per second ($1 / 0.067 \approx 14.9\text{ Hz}$).
- **Impact:** Sub-frame interpolation between frame 0 and frame 1 causes rapid high-frequency visual vibration / jittering during sad and sneak postures.

---

### AIRA-QA-04: Dialogue Matrix Permutation Shortfall (Mathematical Proof)
- **File:** `src/data/airaDialogues.ts`, Lines 201–229
- **Observation:**
  The file header and specification claim:
  > *"Over 1,000 distinct permutations of human-crafted, witty, empathetic, non-robotic, and emoji-free dialogues for every companion vibe."*
- **Mathematical Audit:**
  Counting the array lengths in `src/data/airaDialogues.ts`:
  - `PREMISES.length`: 8
  - `OBSERVATIONS.length`: 6
  - `WITTY_CLOSERS.length`: 6
  - Combinatorial combinations: $8 \times 6 \times 6 = \mathbf{288\text{ permutations}}$.
  - Static dialogue bank lines across all 15 vibes:
    `20 + 10 + 10 + 15 + 10 + 10 + 8 + 10 + 8 + 6 + 5 + 4 + 4 + 4 + 4 = 128\text{ lines}`.
  - Grand total possible distinct lines: $288 + 128 = \mathbf{416\text{ lines}}$.
- **Impact:** **416 is less than half of the claimed 1,000+ permutations.** Users observing the ambient thought generation will see recycled phrases far sooner than promised.

---

### AIRA-QA-05: Walk Sway Frequency Phase Desync & Skating
- **File:** `src/components/Aira3DModel.tsx`, Lines 530–534
- **Observation:**
  ```tsx
  walkSwayTime += delta * 4.6;
  const swayLateral = Math.sin(walkSwayTime) * 0.03;
  const stepBob = Math.abs(Math.cos(walkSwayTime)) * 0.02;
  const shoulderRoll = Math.sin(walkSwayTime) * 0.035;
  ```
- **Diagnostic Proof:**
  From `inspect_durations.mjs`, the Mixamo `walk` clip duration is `0.967s` per full 2-step cycle.
  - Step cycle frequency: $\omega_{\text{clip}} = \frac{2\pi}{0.967} \approx 6.498\text{ rad/s}$.
  - Procedural sway frequency: $\omega_{\text{code}} = 4.600\text{ rad/s}$.
  - Frequency mismatch: $\frac{4.6}{6.5} \approx 0.708$ (completely non-harmonic).
- **Impact:** The character's hip bob and shoulder roll are out of phase with the foot contacts in the clip. Every 3–4 steps, the hip bobs downward while the leg is lifting, creating an unsightly "limping" gait and visible foot skating.

---

### AIRA-QA-06: Procedural Bone Euler Z-Tilt Accumulation on Flirt Exit
- **File:** `src/components/Aira3DModel.tsx`, Lines 459–485
- **Observation:**
  ```tsx
  if (currentPose === 'flirting') {
    headBoneRef.current.rotation.z = THREE.MathUtils.lerp(headBoneRef.current.rotation.z, -0.32, 0.09);
    headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, 0.28, 0.09);
    headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, -0.12, 0.09);
  } else {
    // Smooth interactive head tracking toward cursor
    const targetRotY = m.currX * 0.42;
    const targetRotX = -m.currY * 0.32;
    headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotY, 0.08);
    headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotX, 0.08);
    // rotation.z IS NEVER RESTORED!
  }
  ```
- **Impact:** When flirting ends and Aira returns to idle tracking, `headBone.rotation.z` remains frozen at `-0.32` radians (~$18.3^\circ$). Her head stays permanently tilted to the side like a broken doll while tracking the cursor.

---

### AIRA-QA-07: Keyboard Tab Switch Blind Spot (Focus / Blur)
- **File:** `src/components/AiraCompanion.tsx`, Lines 222–223
- **Observation:**
  ```tsx
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
  ```
- **Diagnostic Proof:**
  When a user switches browser tabs using `Ctrl+Tab` or applications via `Alt+Tab`, the mouse pointer remains stationary inside the viewport.
  `document.mouseleave` does NOT fire upon tab switch.
  `document.mouseenter` does NOT fire upon tab return.
  The `window.onblur` and `window.onfocus` (or `document.visibilitychange`) events are completely unhandled.
- **Impact:** Users who switch tabs for 5 seconds to copy a URL or check an email and return never experience the `<12s` immediate return teasing dialogue or the `>12s` welcome back dialogue.

---

### AIRA-QA-08: Hover Inspection Lockout Deadlock & Target Desync
- **File:** `src/components/AiraCompanion.tsx`, Lines 295, 323, 353
- **Observation:**
  ```tsx
  const handleDebouncedElementInspect = (x: number, y: number) => {
    if (... || isReactionLockedRef.current) return; // Dropped if locked!
    ...
  };
  const applyComponentReaction = (...) => {
    isReactionLockedRef.current = true;
    ...
    setTimeout(() => {
      isReactionLockedRef.current = false;
    }, 2800); // 2.8s lock!
  };
  ```
- **Diagnostic Proof:**
  When a user hovers over `#roi-arbitrage`, the reaction triggers and locks for 2.8 seconds.
  If the user scrolls to `#workbench` during those 2.8 seconds and stops moving the mouse, `handleDebouncedElementInspect` drops the event due to the lock.
  When the lock unlocks at $t = 2.8\text{s}$, the mouse is stationary on `#workbench`, so no new `pointermove` event fires!
  Aira remains stuck in `sad_pose` displaying "Manual Burn Rate" while the user is actively inside the terminal workbench!

---

## 3. Frame-by-Frame Critique of Physics, Velocity & Postures

### A. Walking Velocity & Trajectory
1. **Velocity Profile:**
   - Capped at `3.2 px/frame` ($192\text{ px/s}$). On a 1080p display, traveling from dock `(1680, 740)` to cursor `(200, 150)` takes **8.3 seconds** of linear movement.
   - Pacing is too sluggish; users get bored and move their mouse before Aira arrives, aborting the visit.
   - Acceleration curve is a hard clamp: `Math.min(Math.max(dist * 0.024, 1.8), 3.2)`. It lacks smooth cubic ease-in and ease-out damping, resulting in abrupt start and stop snaps.
2. **Body Yaw Orientation:**
   - Line 535 in `Aira3DModel.tsx`: `const targetBodyYaw = wd.dx > 1.5 ? -0.7 : wd.dx < -1.5 ? 0.7 : 0;`
   - This ternary causes binary flipping between $0$ and $\pm 0.7\text{ rad}$. When traveling in a slight diagonal, the model's torso abruptly snaps its yaw angle instead of smoothly facing the velocity vector `Math.atan2(dx, dy)`.

### B. Kneeling Posture Aesthetics (`position.y = -1.22`)
1. **Vertical Offset Conflict:**
   - Stage rings are anchored at $y = -0.92$.
   - The model root descends to $y = -1.22$ ($0.30\text{ units}$ drop).
   - In addition, the skeletal clip `sneak_pose` bends the knees and drops the pelvis.
   - Together, this causes the lower legs and feet to penetrate $0.30\text{ units}$ through the holographic stage rings into empty void space.
   - The camera does not compensate vertically; the character's head drops into the lower 40% of the canvas frame, leaving the upper half completely vacant.

### C. Rhythmic Arm Patting (`kneeling_pat`)
1. **Harmonics & Damping:**
   - Frequency: $\text{patCycle} = \sin(\text{time} \times 5.0)$ ($0.8\text{ Hz}$).
   - Because of Defect AIRA-QA-01, the procedural arm override is overwritten every frame by the `sneak_pose` animation track. The visible patting is severely muffled, vibrating only a few millimeters rather than executing an unmistakable reassuring hand pat.

---

## 4. Concrete Code Remediation Plan

Below are exact, production-grade code patches with file paths and line references to resolve every identified defect.

---

### Patch 1: Fix AnimationMixer Overwrite & Euler Z-Tilt (`Aira3DModel.tsx`)
**Target:** `src/components/Aira3DModel.tsx`, Lines 452–490  
**Rationale:** Decouple procedural tracking rotation into dedicated persistent reference variables that are computed with clean spring lerp and applied as Euler additives/clamped overrides AFTER `mixer.update()`, and ensure $Z$ is smoothly restored to zero.

```tsx
// Inside Aira3DModel component setup:
const proceduralHeadRot = useRef({ x: 0, y: 0, z: 0 });
const proceduralRightArmRot = useRef({ x: 0, z: 0 });
const proceduralRightForeArmRot = useRef({ x: 0 });

// Inside animate() in Aira3DModel.tsx:
// 1. Update Skeletal Mixer first
if (mixerRef.current) {
  mixerRef.current.update(delta);
}

// 2. Smooth Mouse Tracking with Lerp
const m = mouseRef.current;
m.currX += (m.targetX - m.currX) * 0.12;
m.currY += (m.targetY - m.currY) * 0.12;

// 3. Compute Procedural Head Target Euler
let targetHeadX = 0;
let targetHeadY = 0;
let targetHeadZ = 0;

if (currentPose === 'flirting') {
  targetHeadX = -0.12;
  targetHeadY = 0.28;
  targetHeadZ = -0.32;
} else if (currentPose === 'sad_pose') {
  targetHeadX = 0.45;
  targetHeadY = 0.0;
  targetHeadZ = 0.0;
} else if (currentAct === 'dozing_sleeping') {
  targetHeadX = 0.35;
  targetHeadY = 0.15;
  targetHeadZ = 0.0;
} else if (isCursorOffscreenRef.current) {
  targetHeadX = -0.25;
  targetHeadY = -0.55;
  targetHeadZ = 0.0;
} else {
  targetHeadX = -m.currY * 0.40;
  targetHeadY = m.currX * 0.52;
  targetHeadZ = 0.0; // Restores Z tilt cleanly!
}

// Smoothly interpolate persistent procedural rotational offsets
proceduralHeadRot.current.x = THREE.MathUtils.lerp(proceduralHeadRot.current.x, targetHeadX, 0.12);
proceduralHeadRot.current.y = THREE.MathUtils.lerp(proceduralHeadRot.current.y, targetHeadY, 0.12);
proceduralHeadRot.current.z = THREE.MathUtils.lerp(proceduralHeadRot.current.z, targetHeadZ, 0.12);

// Apply directly over mixer output
if (headBoneRef.current) {
  headBoneRef.current.rotation.x += proceduralHeadRot.current.x;
  headBoneRef.current.rotation.y += proceduralHeadRot.current.y;
  headBoneRef.current.rotation.z += proceduralHeadRot.current.z;
}

if (neckBoneRef.current && !isCursorOffscreenRef.current && currentAct !== 'dozing_sleeping') {
  neckBoneRef.current.rotation.y += m.currX * 0.25;
}
```

---

### Patch 2: Fix 0.067s Pose Clip Looping (`Aira3DModel.tsx`)
**Target:** `src/components/Aira3DModel.tsx`, Lines 233–241  
**Rationale:** Configure `THREE.LoopOnce` on static pose clips so they clamp on final frame without 15 Hz jitter.

```tsx
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
```

---

### Patch 3: Harmonize Walk Sway Frequency to Clip Speed (`Aira3DModel.tsx`)
**Target:** `src/components/Aira3DModel.tsx`, Lines 528–546  
**Rationale:** Synchronize `walkSwayTime` to match the 0.967s walk cycle ($\omega = 6.498\text{ rad/s}$) and calculate body yaw from velocity angle.

```tsx
if (isWalkingMotion) {
  // Sync precisely with 0.967s walk clip (2 * PI / 0.967 = 6.498 rad/s)
  walkSwayTime += delta * 6.498;
  const swayLateral = Math.sin(walkSwayTime) * 0.035;
  const stepBob = Math.abs(Math.sin(walkSwayTime)) * 0.022;
  const shoulderRoll = Math.sin(walkSwayTime) * 0.04;

  // Smooth yaw matching movement vector
  const targetBodyYaw = Math.atan2(-wd.dx, Math.abs(wd.dy) + 0.01) * 0.45;

  modelRootRef.current.rotation.y = THREE.MathUtils.lerp(modelRootRef.current.rotation.y, targetBodyYaw, 0.1);
  modelRootRef.current.rotation.z = THREE.MathUtils.lerp(modelRootRef.current.rotation.z, shoulderRoll, 0.1);
  modelRootRef.current.rotation.x = THREE.MathUtils.lerp(modelRootRef.current.rotation.x, 0, 0.08);
  modelRootRef.current.position.x = THREE.MathUtils.lerp(modelRootRef.current.position.x, swayLateral, 0.1);
  modelRootRef.current.position.y = -0.92 + stepBob;
}
```

---

### Patch 4: Eliminate 60 FPS React Re-render Storm in Walking Tick (`AiraCompanion.tsx`)
**Target:** `src/components/AiraCompanion.tsx`, Lines 231–278  
**Rationale:** Update DOM transform directly on the `rigRef` during 60 FPS movement; only update React state when passing milestone thresholds or completing travel.

```tsx
let lastDispatchedPos = { x: 0, y: 0 };

const tick = () => {
  animationFrameId = requestAnimationFrame(tick);

  const curr = currentPosRef.current;
  const target = targetPosRef.current;

  const dx = target.x - curr.x;
  const dy = target.y - curr.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 16) {
    // Dynamic velocity: faster travel for long distances (up to 5.2px/frame)
    const speed = Math.min(Math.max(dist * 0.035, 2.4), 5.2);
    const angle = Math.atan2(dy, dx);

    curr.x += Math.cos(angle) * speed;
    curr.y += Math.sin(angle) * speed;

    // Mutate DOM transform directly (ZERO React re-renders per frame!)
    if (rigRef.current) {
      rigRef.current.style.transform = `translate3d(${curr.x}px, ${curr.y}px, 0)`;
    }

    // Only update React state if pose isn't walk yet
    if (poseName !== 'walk' && !isKneelingAtCursorRef.current) {
      setPoseName('walk');
      setActivity('none');
    }

    // Throttle walk direction updates to 10 FPS
    if (Math.abs(curr.x - lastDispatchedPos.x) > 24 || Math.abs(curr.y - lastDispatchedPos.y) > 24) {
      setWalkDirection({ dx, dy });
      lastDispatchedPos = { x: curr.x, y: curr.y };
    }
  } else {
    // Reached Destination!
    setWalkDirection({ dx: 0, dy: 0 });
    setCompanionPos({ x: curr.x, y: curr.y });
    ...
```

---

### Patch 5: Add Tab Visibility & Blur/Focus Handlers (`AiraCompanion.tsx`)
**Target:** `src/components/AiraCompanion.tsx`, Lines 183–224  
**Rationale:** Detect tab backgrounding and switching via `visibilitychange` and `window.blur/focus` so immediate-return teasing triggers reliably.

```tsx
const handleVisibilityChange = () => {
  if (document.hidden) {
    leftWindowTimestampRef.current = Date.now();
    setIsCursorOffscreen(true);
    setPoseName('headShake');
    setActivity('none');
    setDialog(getHumaneDialogue('mouse_leave'));
    setStatusBadge("Looking Away");
    clearTimeout(idleTimerRef.current);
  } else {
    handleWindowResume();
  }
};

const handleWindowResume = () => {
  setIsCursorOffscreen(false);
  const now = Date.now();
  const leftAt = leftWindowTimestampRef.current;

  if (leftAt && now - leftAt < 12000) {
    setPoseName('flirting');
    setActivity('none');
    setDialog(getHumaneDialogue('immediate_return'));
    setStatusBadge("Teasing • Flirting");

    isReactionLockedRef.current = true;
    setTimeout(() => {
      isReactionLockedRef.current = false;
    }, 4200);
  } else if (leftAt && now - leftAt >= 12000) {
    setPoseName('flirting');
    setDialog(getHumaneDialogue('long_return'));
    setStatusBadge("Welcome Back");
  }
  leftWindowTimestampRef.current = null;
};

document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('blur', handleVisibilityChange);
window.addEventListener('focus', handleWindowResume);
```

---

### Patch 6: Expand Combinatorial Dialogue Matrix to > 1,200 Permutations (`airaDialogues.ts`)
**Target:** `src/data/airaDialogues.ts`, Lines 201–229  
**Rationale:** Expand `PREMISES` (12), `OBSERVATIONS` (10), and `WITTY_CLOSERS` (10) to generate $12 \times 10 \times 10 = \mathbf{1,200\text{ unique permutations}}$, fulfilling the contract.

```tsx
const PREMISES = [
  "Looking at how you navigate this screen,",
  "Watching you explore this architecture,",
  "Judging by the way you examine these tools,",
  "From my vantage point on this boundary,",
  "Observing your workflow from over here,",
  "Between your clicks and my telemetry,",
  "Every time you scroll past another section,",
  "Seeing you take in these systems,",
  "Tracking your cursor across these conduits,",
  "Analyzing the rhythm of your browsing,",
  "Watching you pause on these engineering specs,",
  "From the corner of this viewport,",
];

const OBSERVATIONS = [
  "it is abundantly clear you value engineering that actually respects your intelligence.",
  "you can tell someone built this with genuine care rather than an AI prompt template.",
  "there is a real quiet elegance to eliminating manual work before it burns out a team.",
  "the difference between hand-crafted craft and generic web noise is night and day.",
  "you look like someone who understands the real economic value of scalable automation.",
  "it is refreshing to share a viewport with someone who takes their time to inspect the code.",
  "most websites throw generic templates at you, but this was tuned down to the pixel.",
  "you navigate like someone who has dealt with enough broken client scripts to appreciate rigor.",
  "watching someone appreciate high-craft tooling never gets old.",
  "clean systems speak for themselves without needing marketing fluff.",
];

const WITTY_CLOSERS = [
  "Take your time, I am not going anywhere.",
  "And yes, I am still paying attention to every move you make.",
  "Let us see which tool you decide to test first.",
  "Don't be shy, test the terminal whenever you are ready.",
  "And if you need someone to bounce ideas off of, I am right beside you.",
  "Now go ahead and see what else Ansh has built.",
  "Feel free to drag the ROI sliders if you want to see pure capital efficiency.",
  "I will keep holding down the border while you inspect the codebase.",
  "Whenever you are ready for a live test, the shell is waiting.",
  "Just remember: I am strictly on your side against manual spreadsheets.",
];
// 12 * 10 * 10 = 1,200 unique, human, emoji-free dialogue permutations!
```

---

### Patch 7: Complete Scene & Geometry Disposal (`Aira3DModel.tsx`)
**Target:** `src/components/Aira3DModel.tsx`, Lines 595–602  
**Rationale:** Prevent WebGL memory leaks by traversing scene on unmount and disposing all geometries and materials.

```tsx
return () => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('mousemove', handleMouseMove);
  
  if (sceneRef.current) {
    sceneRef.current.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  }

  renderer.dispose();
  if (container.contains(renderer.domElement)) {
    container.removeChild(renderer.domElement);
  }
};
```

---

## 5. Summary Conclusion & Sign-Off

The Aira 3D Mascot rig demonstrates excellent visual character design and delightful personality. However, the **AnimationMixer track overwrite conflict**, **infinite looping 2-frame poses**, **60 FPS React re-render cascade**, and **dialogue permutation shortfall** must be remediated according to the code plan above before the mascot can achieve production-grade 60 FPS living responsiveness.

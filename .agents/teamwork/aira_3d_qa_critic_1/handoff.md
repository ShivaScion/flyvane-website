# Handoff Report — Zero-Tolerance Aira 3D Mascot QA Audit

**Agent:** `aira_3d_qa_critic_1`  
**Role:** Zero-Tolerance Aira 3D Mascot QA Engineer Critic  
**Working Directory:** `d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1`  
**Parent Agent ID:** `996672db-aa40-4347-82b6-7e7f6dd389a6`  
**Type:** Hard Handoff (Task Complete)  

---

## 1. Observation

1. **GLTF Animation Clip Analysis (`public/assets/aira/xbot.glb`):**
   Inspected via Node script reading GLB chunks (`inspect_durations.mjs`, `inspect_clips.mjs`):
   - `agree`: duration = 1.833s
   - `headShake`: duration = 2.567s
   - `idle`: duration = 2.500s
   - `run`: duration = 0.700s
   - `sad_pose`: duration = **0.067s** (2 keyframes)
   - `sneak_pose`: duration = **0.067s** (2 keyframes)
   - `walk`: duration = **0.967s** (full 2-step cycle)
   Every clip contains tracks targeting: `mixamorig:Head`, `mixamorig:Neck`, `mixamorig:RightArm`, and `mixamorig:RightForeArm`.

2. **AnimationMixer Bone Overwrite Conflict (`src/components/Aira3DModel.tsx`):**
   - Lines 434–436: `mixerRef.current.update(delta)` evaluates active clip tracks and overwrites bone rotations.
   - Lines 480–484:
     ```tsx
     const targetRotY = m.currX * 0.42;
     const targetRotX = -m.currY * 0.32;
     headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotY, 0.08);
     headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotX, 0.08);
     ```
   - Line 461: In `'flirting'`, `headBoneRef.current.rotation.z` is lerped to `-0.32`. In idle tracking (lines 480–484), `rotation.z` is never restored or reset.

3. **Clip Looping Configuration (`src/components/Aira3DModel.tsx`):**
   - Lines 236–238:
     ```tsx
     if (clip.name === 'sad_pose' || clip.name === 'sneak_pose') {
       action.clampWhenFinished = true;
     }
     ```
   - In Three.js, `clampWhenFinished = true` has zero effect without `action.setLoop(THREE.LoopOnce, 1)`. The action defaults to `THREE.LoopRepeat`.

4. **Walk Sway Frequency Desync (`src/components/Aira3DModel.tsx`):**
   - Lines 530–534:
     ```tsx
     walkSwayTime += delta * 4.6;
     const swayLateral = Math.sin(walkSwayTime) * 0.03;
     const stepBob = Math.abs(Math.cos(walkSwayTime)) * 0.02;
     const shoulderRoll = Math.sin(walkSwayTime) * 0.035;
     ```
   - Mixamo walk clip frequency is $\omega = \frac{2\pi}{0.967} \approx 6.498\text{ rad/s}$. The procedural code oscillates at $\omega = 4.6\text{ rad/s}$.

5. **60 FPS React Re-render Storm in Walking Loop (`src/components/AiraCompanion.tsx`):**
   - Lines 246 & 256:
     ```tsx
     setWalkDirection({ dx, dy });
     ...
     setCompanionPos({ x: curr.x, y: curr.y });
     ```
   - Both are called inside `requestAnimationFrame(tick)` on every single frame while walking ($dist > 16$).

6. **Combinatorial Dialogue Permutation Count (`src/data/airaDialogues.ts`):**
   - Lines 201–229: `PREMISES.length = 8`, `OBSERVATIONS.length = 6`, `WITTY_CLOSERS.length = 6`.
   - Total combinatorial permutations = $8 \times 6 \times 6 = 288$.
   - Static dialogue bank lines across 15 vibes = 128.
   - Total distinct phrases = 416 (shortfall vs claimed 1,000+).
   - Zero emojis confirmed across all Aira dialogue arrays.

7. **Tab Blur/Focus Event Blind Spot (`src/components/AiraCompanion.tsx`):**
   - Lines 222–223 attach only `document.addEventListener('mouseleave')` and `document.addEventListener('mouseenter')`. `visibilitychange`, `blur`, and `focus` are unhandled.

8. **Build Verification (`npm run build`):**
   - Command: `npm run build`
   - Output: `vite v6.4.4 building for production... ✓ built in 5.68s` (Exited with code 0).

---

## 2. Logic Chain

1. From **Observation 1 & 2**, `mixer.update(delta)` overwrites bone rotations from the clip tracks every frame. When procedural lerp code immediately follows, reading `bone.rotation.y` and writing back `lerp(bone.rotation.y, target, 0.08)`, `bone.rotation.y` starts from the clip's zero frame on every tick. Therefore, the value cannot integrate over time and is permanently capped at $8\%$ of the target deflection ($1.9^\circ$ max instead of $24^\circ$).
2. From **Observation 2**, when `'flirting'` cocks the head by setting `rotation.z = -0.32`, and the user moves the mouse to transition to idle tracking, the idle branch only writes `rotation.x` and `rotation.y`. Because `rotation.z` is never cleared, Aira's head remains permanently tilted sideways.
3. From **Observation 1 & 3**, `sad_pose` and `sneak_pose` are 0.067s long (2 keyframes). Because `setLoop(THREE.LoopOnce)` was omitted, `clampWhenFinished` never triggers. Three.js repeats the 2 frames at 15 Hz, generating high-frequency pose jitter.
4. From **Observation 1 & 4**, because procedural sway runs at 4.6 rad/s while the walk clip runs at 6.5 rad/s, the phases drift continuously. When step bob reaches a trough while the clip leg is in swing phase, the model appears to limp and slide across the floor.
5. From **Observation 5**, invoking two React state setters (`setWalkDirection`, `setCompanionPos`) 60 times per second during companion walking forces 60 synchronous React component tree re-renders per second, triggering main-thread jank and competing with direct DOM `style.transform` mutations.
6. From **Observation 6**, the mathematical product of the dialogue generator arrays is $8 \times 6 \times 6 = 288$. Even combining all static banks yields only 416 permutations, disproving the claim of 1,000+ permutations.
7. From **Observation 7**, users switching tabs with keyboard shortcuts never leave the document bounds with their cursor, so `mouseleave` and `mouseenter` never fire, leaving return teasing triggers dead.

---

## 3. Caveats

1. **Review-Only Constraint:** In accordance with the system prompt role constraints (`reviewer`, `critic`), no implementation files were directly edited. All findings are delivered as an evidence-based audit report with complete, copy-pasteable code patches.
2. **Audio Hardware Testing:** `window.speechSynthesis` and `SpeechRecognition` rely on browser vendor APIs (Web Speech API). In headless terminal testing, audio synthesis availability depends on the operating system voice registry.
3. **Model Rig Asset Preservation:** The GLB model `public/assets/aira/xbot.glb` is a standard Mixamo binary. Modifying bone hierarchy or baking animations is unnecessary; all issues can be completely resolved at the Three.js runtime layer using the remediation patches provided.

---

## 4. Conclusion

The Aira 3D Mascot companion has solid visual foundations and strong character writing, but suffers from **critical skeletal animation conflicts**, **severe tracking amplitude damping**, **React state update thrashing at 60 FPS**, and a **dialogue permutation shortfall**.

**Verdict: REQUEST_CHANGES.**  
The complete audit report and 7 ready-to-apply remediation code patches have been generated in:
`d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1/aira_qa_audit_report.md`.

---

## 5. Verification Method

1. **Verify Binary Model & Clips:**
   Run the inspection script to confirm clip durations and bone bindings:
   ```powershell
   node .agents/teamwork/aira_3d_qa_critic_1/inspect_durations.mjs
   node .agents/teamwork/aira_3d_qa_critic_1/inspect_clips.mjs
   ```
2. **Verify Permutation Count Math:**
   Inspect `src/data/airaDialogues.ts` lines 201–229:
   Calculate `PREMISES.length * OBSERVATIONS.length * WITTY_CLOSERS.length` ($8 \times 6 \times 6 = 288$).
3. **Verify Build Integrity:**
   Run `npm run build` from `d:/Projects/Portfolio website`:
   ```powershell
   npm run build
   ```
4. **Inspect Detailed Audit Report:**
   View `d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1/aira_qa_audit_report.md`.

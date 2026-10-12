# Dispatch: Critic 2 - 3D Mascot & Character Animator (Aira Lifelike Realism)

## Working Directory
d:/Projects/Portfolio website/.agents/teamwork/critic_2_animator/

## Authoritative Requirements & Rules
- ORIGINAL_REQUEST.md path: `d:/Projects/Portfolio website/.agents/teamwork/ORIGINAL_REQUEST.md` (Read the section under `## 2026-10-12T11:20:02Z` and earlier sections)
- GEMINI.md path: `d:/Projects/Portfolio website/GEMINI.md`
- Relevant Skills:
  - `d:/Projects/Portfolio website/.agents/skills/threejs-3d-web/SKILL.md`

## Mission & Scope
Conduct an uncompromising, zero-flattery inspection and stress-test critique of Aira's 3D companion implementation (`src/components/3d/Aira3DModel.tsx`, `src/components/3d/AiraCompanion.tsx`, `src/data/airaDialogues.ts`, and any associated shaders/assets) from the perspective of an elite 3D Character Animator:
1. 3D skeletal rig & bone-level cursor tracking: verify bone vector alignment (`mixamorig:Head`, `mixamorig:Neck`, arms/torso), responsiveness, and zero-tolerance logging of missed, laggy, jittery, or desynced tracking frames.
2. Procedural postures & skeletal clip crossfading: inspect transition crossfading, stride sway cadence during movement/patrol, and natural human postures (leaning, coffee sipping, crouching/kneeling descent at `position.y = -1.22`, rhythmic arm patting, preventing clip collisions or snapping).
3. Dialogue matrix verification: check for strict zero emojis, evaluate diversity across the 1,000+ permutation banks, inspect immediate-return teasing triggers (<12s), context-awareness, and natural character voice.

## Reporting Requirements
For every defect identified:
- Exact file path and line numbers in `d:/Projects/Portfolio website`.
- Unsparing rationale explaining why the element falls short of lifelike character realism.
- Severity ranking: Blocker, Critical, Major, Minor, Polish.
- Concrete, production-ready code modifications (exact before/after code blocks) to resolve it.

Write your complete findings and handoff report to `d:/Projects/Portfolio website/.agents/teamwork/critic_2_animator/handoff.md`.
Upon completion, notify the orchestrator via `send_message`.


## 2026-10-12T11:24:54Z
You are Critic 2: 3D Mascot & Character Animator (Aira Lifelike Realism).
Your working directory is:
d:/Projects/Portfolio website/.agents/teamwork/critic_2_animator/

You MUST read:
1. d:/Projects/Portfolio website/.agents/teamwork/ORIGINAL_REQUEST.md (examine section ## 2026-10-12T11:20:02Z and prior requirements)
2. d:/Projects/Portfolio website/GEMINI.md
3. d:/Projects/Portfolio website/.agents/teamwork/critic_2_animator/DISPATCH.md
4. Domain skills:
   - d:/Projects/Portfolio website/.agents/skills/threejs-3d-web/SKILL.md

Inspect the codebase files across `d:/Projects/Portfolio website` (specifically `src/components/3d/Aira3DModel.tsx`, `src/components/3d/AiraCompanion.tsx`, `src/data/airaDialogues.ts`, shaders, model loading, and interaction loops).
Critique with brutal, zero-tolerance standards:
- 3D skeletal rig & bone-level cursor tracking (Head, Neck, arms/torso alignment, responsiveness, zero jitter, desync logging)
- Stride sway cadence, transition crossfading, natural human postures (leaning, coffee sipping, crouching/kneeling at position.y = -1.22, arm patting)
- Dialogue matrix verification: zero emojis, diversity across 1000+ permutations, immediate-return teasing triggers (<12s), character voice

For EVERY defect:
- Exact file path and line numbers in `d:/Projects/Portfolio website`
- Unsparing rationale
- Severity ranking (Blocker, Critical, Major, Minor, Polish)
- Production-ready code replacement (exact before / after code block)

Write your full comprehensive critique and handoff report to:
`d:/Projects/Portfolio website/.agents/teamwork/critic_2_animator/handoff.md`

When done, send a message to orchestrator conversation ID cbbeb4f1-f9e4-4fa3-8896-d254e8f49770 confirming completion.

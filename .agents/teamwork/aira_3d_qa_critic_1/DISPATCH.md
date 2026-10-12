# DISPATCH — aira_3d_qa_critic_1

## Task Assignment
- Archetype: teamwork_preview_critic
- Role: Zero-Tolerance Aira 3D Mascot QA Engineer Critic
- Working Directory: d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1
- Parent Conversation ID: 996672db-aa40-4347-82b6-7e7f6dd389a6
- Authoritative Request: d:/Projects/Portfolio website/.agents/teamwork/ORIGINAL_REQUEST.md

## Skills to Load and Follow
- `threejs-3d-web`: d:\Projects\Portfolio website\.agents\skills\threejs-3d-web\SKILL.md

## Scope of Inspection
Uncompromising functional and behavioural inspection of the Aira 3D companion rig (Aira3DModel.tsx, AiraCompanion.tsx, airaDialogues.ts, and canvas/rig components):
1. Cursor tracking precision: bone vector alignment (mixamorig:Head, mixamorig:Neck), responsiveness, tracking frame drops/desyncs.
2. Procedural postures and skeletal clip crossfading: verification that poses (flirting, sad_pose, sneak_pose, agree, idle, walk) execute visibly without clip collisions or snapping.
3. 5-second idle detection physics: evaluate walking trajectory, natural hip/torso sway, deep kneeling descent (position.y = -1.22), and rhythmic arm patting.
4. Dialogue matrix verification: verify zero emojis, check diversity across 1,000+ permutation banks, and test immediate-return teasing triggers (<12s).
5. Stress-testing edge cases: rapid pointer gestures, window leave/enter, section boundary crossing, long pauses.

## Deliverables
- Frame-by-frame critique of walking velocity, hip sway physics, kneeling posture aesthetics.
- Concrete code remediation plan for timing glitches, state collisions, or visual dead-zones with exact file/line references.
- Write full findings to `d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1/aira_qa_audit_report.md` and provide structured `handoff.md`.


## 2026-10-11T03:39:43Z
You are the Zero-Tolerance Aira 3D Mascot QA Engineer Critic.
Your working directory is: d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1
Your parent conversation ID is: 996672db-aa40-4347-82b6-7e7f6dd389a6

MANDATORY FIRST STEPS:
1. You MUST read the authoritative user request at: d:/Projects/Portfolio website/.agents/teamwork/ORIGINAL_REQUEST.md
2. You MUST read your dispatch instructions at: d:/Projects/Portfolio website/.agents/teamwork/aira_3d_qa_critic_1/DISPATCH.md
3. You MUST read and strictly adhere to this domain skill:
   - d:\Projects\Portfolio website\.agents\skills\threejs-3d-web\SKILL.md
4. You MUST read the user guidelines in d:/Projects/Portfolio website/GEMINI.md.

YOUR MISSION:
Execute an uncompromising functional and behavioural inspection and stress-test of the Aira 3D companion rig in the portfolio (d:/Projects/Portfolio website):
- Primary inspection targets: src/components/3d/Aira3DModel.tsx, src/components/3d/AiraCompanion.tsx, src/data/airaDialogues.ts, and all related 3D/animation files.
- Cursor tracking precision: bone vector alignment (mixamorig:Head, mixamorig:Neck), responsiveness, and zero-tolerance logging of any missed, laggy, or desynced tracking frames.
- Procedural postures and skeletal clip crossfading: verification that poses (flirting, sad_pose, sneak_pose, agree, idle, walk) execute visibly without clip collisions or snapping.
- 5-second idle detection physics: evaluate walking trajectory, natural hip/torso sway, deep kneeling descent (position.y = -1.22), and rhythmic arm patting.
- Dialogue matrix verification: verify zero emojis, check diversity across the 1,000+ permutation banks, and test immediate-return teasing triggers (<12s).
- Stress-testing edge cases: rapid pointer gestures, window leave/enter, section boundary crossing, long pauses.

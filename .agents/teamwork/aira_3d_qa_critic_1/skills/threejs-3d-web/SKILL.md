---
name: threejs-3d-web
description: >-
  Architects, builds, and optimizes interactive 3D web experiences using Three.js, React Three Fiber (R3F), @react-three/drei, GLSL shaders, and WebGL. Use whenever creating 3D landing pages, interactive product viewports, particle systems, 3D portfolios, custom shaders, or optimizing 3D assets for 60fps web performance.
---

# 3D Web Development: Three.js & React Three Fiber

## Core Stack
- `@react-three/fiber` & `three`
- `@react-three/drei` (OrbitControls, Float, Sparkles, MeshTransmissionMaterial, Environment, Html)
- `@react-three/postprocessing` (Bloom, ChromaticAberration, Noise)

## Performance Rules
- Clamp DPR to `[1, 2]` (`<Canvas dpr={[1, 2]}>`).
- Optimize GLTF/GLB models using Draco/Meshopt compression.
- Use `frameloop="demand"` for interactive scenes that do not require constant 60fps idle rendering.

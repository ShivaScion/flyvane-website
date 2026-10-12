import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroCenterpiece3DProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

interface BrainNode {
  pos: THREE.Vector3;
  region: 'frontal' | 'parietal' | 'temporal' | 'occipital' | 'cerebellum' | 'stem';
  hemisphere: 'left' | 'right' | 'mid';
  phase: number;
}

interface SynapseEdge {
  a: number;
  b: number;
  pulseOffset: number;
  pulseSpeed: number;
  isCorticalRibbon?: boolean;
}

interface CrystalFacet {
  v0: THREE.Vector3;
  v1: THREE.Vector3;
  v2: THREE.Vector3;
  normal: THREE.Vector3;
  center: THREE.Vector3;
  facetSeed: number;
}

export const HeroCenterpiece3D: React.FC<HeroCenterpiece3DProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoomDisplay, setZoomDisplay] = useState<number>(100);
  const [isDraggingUI, setIsDraggingUI] = useState<boolean>(false);
  const [tiltTransform, setTiltTransform] = useState<string>(
    'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [visorSweepPos, setVisorSweepPos] = useState<{ x: number; y: number }>({ x: 50, y: 34 });

  // Interactive physics state ref
  const interactionRef = useRef({
    pointerX: 0,
    pointerY: 0,
    isDragging: false,
    lastDragX: 0,
    lastDragY: 0,
    dragRotY: 0,
    dragRotX: 0,
    currentRotY: 0,
    currentRotX: 0,
    zoom: 1.0,
    targetZoom: 1.0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 640;
    let height = 520;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 460);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // =========================================================================
    // 1. ANATOMICAL NEURAL SYNAPTIC BRAIN (Section 4.2 — Marketing Services)
    //    Sculpted Left/Right Cerebral Hemispheres, Gyri/Sulci Cortical Folds,
    //    Sylvian Fissure, Temporal Lobe, Cerebellum Folia, and Brainstem
    // =========================================================================
    const brainNodes: BrainNode[] = [];
    const brainEdges: SynapseEdge[] = [];

    // Anatomical shaping helper for a human cerebral hemisphere
    const sampleCerebralPoint = (u: number, v: number, isLeft: boolean): { pos: THREE.Vector3; region: BrainNode['region'] } => {
      // u in [0, PI] (anterior to posterior), v in [0, PI] (superior crown to inferior base)
      // Base hemisphere dimensions: length (Z) ~ 165, height (Y) ~ 105, width (X) ~ 68 per hemisphere
      const sinV = Math.sin(v);
      const cosV = Math.cos(v);
      const cosU = Math.cos(u); // +1 anterior (frontal), -1 posterior (occipital)
      const sinU = Math.sin(u);

      // Longitudinal coordinate Z (+ front, - back)
      let z = cosU * 138;

      // Vertical coordinate Y (- top crown, + bottom base)
      // Flatten inferior surface and arch the superior parietal dome
      let y = -cosV * 88;
      if (y > 22) {
        y = 22 + (y - 22) * 0.42;
      }
      // Frontal lobe slope & occipital taper
      if (z > 40) {
        y += ((z - 40) / 98) * 14;
      } else if (z < -65) {
        y += ((-65 - z) / 73) * 18;
      }

      // Lateral width X
      let xMag = sinV * sinU * 76;

      // Temporal lobe lateral bulge (inferior-lateral, z in [-35, 45], y > -5)
      let region: BrainNode['region'] = 'parietal';
      if (z > 32) {
        region = 'frontal';
        xMag *= 0.92;
      } else if (z < -62) {
        region = 'occipital';
        xMag *= 0.78;
      } else if (y > -2 && z > -42 && z < 48) {
        region = 'temporal';
        xMag += 18 * Math.sin(((z + 42) / 90) * Math.PI);
        y += 14;
      }

      // Sylvian fissure (lateral sulcus) indentation between frontal/parietal and temporal lobe
      if (Math.abs(y + 4) < 10 && z > -25 && z < 45) {
        xMag *= 0.84;
      }

      // Cortical gyri & sulci folding modulation (high-frequency anatomical sulci ridges)
      const gyrusWave =
        Math.sin(u * 9 + v * 6) * 4.2 +
        Math.cos(u * 14 - v * 11) * 2.8;
      xMag += gyrusWave;
      y += Math.sin(u * 11 + v * 8) * 3.2;

      // Separate Left and Right hemispheres with the Longitudinal Fissure gap
      const fissureGap = 11;
      const x = (isLeft ? -1 : 1) * (fissureGap + Math.max(4, xMag));

      return { pos: new THREE.Vector3(x, y - 12, z), region };
    };

    // Populate structured cortical ribbons (Gyri pathways) across both hemispheres
    const uSteps = 18;
    const vSteps = 10;
    for (let hemi = 0; hemi < 2; hemi++) {
      const isLeft = hemi === 0;
      const baseOffset = brainNodes.length;

      for (let iu = 0; iu < uSteps; iu++) {
        const u = 0.12 + (iu / (uSteps - 1)) * (Math.PI - 0.24);
        for (let iv = 0; iv < vSteps; iv++) {
          const v = 0.14 + (iv / (vSteps - 1)) * (Math.PI - 0.28);
          const { pos, region } = sampleCerebralPoint(u, v, isLeft);
          brainNodes.push({
            pos,
            region,
            hemisphere: isLeft ? 'left' : 'right',
            phase: (iu * 0.37 + iv * 0.61) % (Math.PI * 2),
          });

          const currIdx = baseOffset + iu * vSteps + iv;
          // Connect along longitudinal gyri ribbons
          if (iu > 0) {
            brainEdges.push({
              a: currIdx - vSteps,
              b: currIdx,
              pulseOffset: (currIdx * 0.19) % 1,
              pulseSpeed: 0.35 + (currIdx % 5) * 0.08,
              isCorticalRibbon: true,
            });
          }
          // Connect across sulci bridges
          if (iv > 0 && (iu + iv) % 2 === 0) {
            brainEdges.push({
              a: currIdx - 1,
              b: currIdx,
              pulseOffset: (currIdx * 0.31) % 1,
              pulseSpeed: 0.28 + (currIdx % 4) * 0.07,
            });
          }
        }
      }
    }

    // Add Corpus Callosum inter-hemispheric commissural bridge
    for (let i = 0; i < uSteps; i += 2) {
      const leftIdx = i * vSteps + 2;
      const rightIdx = uSteps * vSteps + i * vSteps + 2;
      brainEdges.push({
        a: leftIdx,
        b: rightIdx,
        pulseOffset: i * 0.15,
        pulseSpeed: 0.55,
      });
    }

    // Add Cerebellum (inferior-posterior striated lobes)
    const cerebellumStart = brainNodes.length;
    const cbRings = 6;
    const cbCols = 10;
    for (let r = 0; r < cbRings; r++) {
      const cy = 36 + r * 7.5;
      const ringRadiusX = 52 * Math.sin(((r + 1) / (cbRings + 1)) * Math.PI);
      const ringRadiusZ = 32 * Math.sin(((r + 1) / (cbRings + 1)) * Math.PI);
      for (let c = 0; c < cbCols; c++) {
        const angle = (c / (cbCols - 1) - 0.5) * Math.PI * 1.15;
        const cx = Math.sin(angle) * ringRadiusX + (Math.sin(angle) >= 0 ? 6 : -6);
        const cz = -78 - Math.cos(angle) * ringRadiusZ;
        brainNodes.push({
          pos: new THREE.Vector3(cx, cy, cz),
          region: 'cerebellum',
          hemisphere: cx < 0 ? 'left' : 'right',
          phase: r * 0.5 + c * 0.3,
        });
        const idx = cerebellumStart + r * cbCols + c;
        if (c > 0) {
          brainEdges.push({
            a: idx - 1,
            b: idx,
            pulseOffset: (idx * 0.23) % 1,
            pulseSpeed: 0.42,
            isCorticalRibbon: true,
          });
        }
        if (r > 0 && c % 2 === 0) {
          brainEdges.push({
            a: idx - cbCols,
            b: idx,
            pulseOffset: (idx * 0.17) % 1,
            pulseSpeed: 0.36,
          });
        }
      }
    }

    // Add Brainstem (Pons & Medulla descending neural tracts)
    const stemStart = brainNodes.length;
    const stemLevels = 7;
    const stemTracts = 6;
    for (let l = 0; l < stemLevels; l++) {
      const sy = 30 + l * 12;
      const sz = -22 - l * 3.2;
      const radius = 16 - l * 1.1;
      for (let t = 0; t < stemTracts; t++) {
        const ang = (t / stemTracts) * Math.PI * 2;
        const sx = Math.cos(ang) * radius;
        const tz = sz + Math.sin(ang) * (radius * 0.75);
        brainNodes.push({
          pos: new THREE.Vector3(sx, sy, tz),
          region: 'stem',
          hemisphere: 'mid',
          phase: l * 0.4 + t,
        });
        const idx = stemStart + l * stemTracts + t;
        if (l > 0) {
          brainEdges.push({
            a: idx - stemTracts,
            b: idx,
            pulseOffset: l * 0.14,
            pulseSpeed: 0.65,
            isCorticalRibbon: true,
          });
        }
      }
    }

    // Ambient drifting synaptic dust particles
    const ambientDust = Array.from({ length: 48 }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.sin(i * 19.3) - 0.5) * 320,
        (Math.cos(i * 27.1) - 0.5) * 260,
        (Math.sin(i * 41.7) - 0.5) * 220
      ),
      speed: 0.35 + (i % 6) * 0.12,
      size: 1.1 + (i % 3) * 0.55,
    }));

    // =========================================================================
    // 2. DENSE CRYSTALLINE OBSIDIAN POLYHEDRON + NEURAL CORE (Section 4.3 — Hybrid)
    //    Multi-faceted subdivision crystal with sharp obsidian facets,
    //    Blinn-Phong cyan/amber specular reflections, and internal neural lattice
    // =========================================================================
    const crystalFacets: CrystalFacet[] = [];
    const rawCrystalGeo = new THREE.IcosahedronGeometry(132, 2); // 320 triangular crystal facets
    const posAttr = rawCrystalGeo.attributes.position;

    // Displace vertices radially by deterministic crystalline cleavage planes
    const displacedVerts: THREE.Vector3[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const dir = v.clone().normalize();
      // Faceted quartz/obsidian elongation along vertical axis + crystalline ridge harmonics
      const crystalRidge =
        1.0 +
        0.14 * Math.abs(dir.y) +
        0.08 * Math.sin(dir.x * 7.0) * Math.cos(dir.z * 7.0);
      displacedVerts.push(v.multiplyScalar(crystalRidge));
    }

    const indexAttr = rawCrystalGeo.index;
    if (indexAttr) {
      for (let i = 0; i < indexAttr.count; i += 3) {
        const v0 = displacedVerts[indexAttr.getX(i)].clone();
        const v1 = displacedVerts[indexAttr.getX(i + 1)].clone();
        const v2 = displacedVerts[indexAttr.getX(i + 2)].clone();
        const cb = new THREE.Vector3().subVectors(v2, v1);
        const ab = new THREE.Vector3().subVectors(v0, v1);
        const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();
        const center = new THREE.Vector3().add(v0).add(v1).add(v2).divideScalar(3);
        crystalFacets.push({
          v0,
          v1,
          v2,
          normal,
          center,
          facetSeed: (i / 3) % 17,
        });
      }
    } else {
      for (let i = 0; i < displacedVerts.length; i += 3) {
        const v0 = displacedVerts[i].clone();
        const v1 = displacedVerts[i + 1].clone();
        const v2 = displacedVerts[i + 2].clone();
        const cb = new THREE.Vector3().subVectors(v2, v1);
        const ab = new THREE.Vector3().subVectors(v0, v1);
        const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();
        const center = new THREE.Vector3().add(v0).add(v1).add(v2).divideScalar(3);
        crystalFacets.push({
          v0,
          v1,
          v2,
          normal,
          center,
          facetSeed: (i / 3) % 17,
        });
      }
    }

    // Internal Neural Core suspended inside the Hybrid Obsidian Polyhedron
    const coreNodes: THREE.Vector3[] = [];
    const coreEdges: Array<{ a: number; b: number; speed: number; offset: number; warm: boolean }> = [];
    for (let i = 0; i < 42; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 42);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 42 + (i % 3) * 18;
      coreNodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    for (let i = 0; i < coreNodes.length; i++) {
      for (let j = i + 1; j < coreNodes.length; j++) {
        if (coreNodes[i].distanceTo(coreNodes[j]) < 46 && coreEdges.length < 110) {
          coreEdges.push({
            a: i,
            b: j,
            speed: 0.45 + ((i + j) % 5) * 0.1,
            offset: (i * 0.21) % 1,
            warm: (i + j) % 2 === 0,
          });
        }
      }
    }

    // 3D Projection Helper
    const fov = 560;
    const project3D = (
      p: THREE.Vector3,
      rotX: number,
      rotY: number,
      zoom: number,
      cx: number,
      cy: number
    ) => {
      const euler = new THREE.Euler(rotX, rotY, 0, 'YXZ');
      const v = p.clone().applyEuler(euler);
      const zDepth = v.z + 440;
      const scale = (fov / Math.max(120, zDepth)) * zoom;
      return {
        x: cx + v.x * scale,
        y: cy + v.y * scale,
        z: v.z,
        scale,
        rotated: v,
      };
    };

    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const t = (now - startTime) * 0.001;
      const state = interactionRef.current;

      // Smooth lerp for zoom and rotation
      state.zoom += (state.targetZoom - state.zoom) * 0.1;

      const targetYaw =
        state.dragRotY +
        state.pointerX * 0.42 +
        (mode === 'mind' ? Math.sin(t * 0.35) * 0.22 - 0.35 : mode === 'hybrid' ? t * 0.28 : 0);
      const targetPitch =
        state.dragRotX +
        state.pointerY * 0.28 +
        (mode === 'mind' ? 0.12 + Math.cos(t * 0.25) * 0.06 : Math.sin(t * 0.4) * 0.08);

      state.currentRotY += (targetYaw - state.currentRotY) * 0.08;
      state.currentRotX += (targetPitch - state.currentRotX) * 0.08;

      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.5;

      // =======================================================================
      // MODE 1: AUTOMATION SERVICES — 2.5D LAYERED DEPTH & VISOR SPECULAR SHADER
      // =======================================================================
      if (mode === 'machine') {
        // Note: The photorealistic cybernetic android bust renders in the 3D perspective DOM plane below,
        // and this synchronized canvas overlays dynamic normal-mapped cyan visor light sweeps & telemetry particles.
        const sweepX = cx + state.pointerX * 95 + Math.sin(t * 1.9) * 44;
        const sweepY = cy - 68 + state.pointerY * 22;

        // Subtle atmospheric cyan volumetric backlight
        const visorGlow = ctx.createRadialGradient(sweepX, sweepY, 4, sweepX, sweepY, 150);
        visorGlow.addColorStop(0, 'rgba(0, 216, 255, 0.28)');
        visorGlow.addColorStop(0.45, 'rgba(0, 216, 255, 0.08)');
        visorGlow.addColorStop(1, 'rgba(0, 216, 255, 0)');
        ctx.fillStyle = visorGlow;
        ctx.fillRect(0, 0, width, height);

        // Micro floating optical dust motes around the android bust (no wireframe cages)
        ambientDust.slice(0, 24).forEach((d, idx) => {
          const px = cx + Math.sin(t * 0.3 + idx * 1.7) * (width * 0.36) + state.pointerX * -18;
          const py = cy + Math.cos(t * 0.25 + idx * 2.3) * (height * 0.36) + state.pointerY * -18;
          const alpha = 0.18 + 0.25 * Math.sin(t * 2 + idx);
          ctx.fillStyle = `rgba(0, 216, 255, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, d.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // =======================================================================
      // MODE 2: MARKETING SERVICES — ANATOMICAL NEURAL SYNAPTIC BRAIN
      // =======================================================================
      if (mode === 'mind') {
        const bgGlow = ctx.createRadialGradient(cx, cy, 12, cx, cy, Math.max(width, height) * 0.48);
        bgGlow.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
        bgGlow.addColorStop(0.45, 'rgba(45, 212, 191, 0.06)');
        bgGlow.addColorStop(1, 'rgba(7, 8, 11, 0)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        // Background drifting neural dust
        ambientDust.forEach((d, idx) => {
          const driftPos = d.pos.clone();
          driftPos.y += Math.sin(t * d.speed + idx) * 14;
          const proj = project3D(driftPos, state.currentRotX * 0.35, state.currentRotY * 0.35, state.zoom, cx, cy);
          const alpha = Math.max(0.08, Math.min(0.42, (proj.z + 240) / 480));
          ctx.fillStyle = idx % 2 === 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(45, 212, 191, ${alpha})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, d.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        });

        // Project anatomical brain nodes
        const projectedNodes = brainNodes.map((n) => {
          const breathe = 1 + Math.sin(t * 1.8 + n.phase) * 0.012;
          const animatedPos = n.pos.clone().multiplyScalar(breathe);
          return {
            ...project3D(animatedPos, state.currentRotX, state.currentRotY, state.zoom, cx, cy),
            region: n.region,
            hemisphere: n.hemisphere,
            phase: n.phase,
          };
        });

        // Sort synaptic pathways back-to-front
        const sortedEdges = brainEdges
          .map((e) => {
            const na = projectedNodes[e.a];
            const nb = projectedNodes[e.b];
            return { ...e, na, nb, depth: (na.z + nb.z) * 0.5 };
          })
          .sort((x, y) => x.depth - y.depth);

        for (const edge of sortedEdges) {
          const { na, nb } = edge;
          const depthAlpha = Math.max(0.08, Math.min(0.68, (edge.depth + 190) / 340));

          ctx.strokeStyle =
            na.region === 'cerebellum'
              ? `rgba(45, 212, 191, ${(depthAlpha * 0.55).toFixed(3)})`
              : edge.isCorticalRibbon
              ? `rgba(56, 189, 248, ${(depthAlpha * 0.65).toFixed(3)})`
              : `rgba(45, 212, 191, ${(depthAlpha * 0.32).toFixed(3)})`;
          ctx.lineWidth = (edge.isCorticalRibbon ? 1.25 : 0.75) * state.zoom;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();

          // Travelling synaptic firing wave along active pathways
          const pulsePos = (t * edge.pulseSpeed + edge.pulseOffset) % 1;
          if (pulsePos < 0.28 && depthAlpha > 0.22) {
            const frac = pulsePos / 0.28;
            const px = na.x + (nb.x - na.x) * frac;
            const py = na.y + (nb.y - na.y) * frac;
            const pulseAlpha = Math.sin(frac * Math.PI) * depthAlpha;

            ctx.fillStyle = `rgba(186, 230, 253, ${(pulseAlpha * 0.95).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(px, py, 2.1 * state.zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw cortical nodes back-to-front
        const sortedNodes = [...projectedNodes].sort((a, b) => a.z - b.z);
        for (const n of sortedNodes) {
          const depthNorm = Math.max(0.12, Math.min(1, (n.z + 180) / 340));
          const pulse = 0.5 + 0.5 * Math.sin(t * 2.6 + n.phase);
          const radius = (1.35 + pulse * 0.85) * n.scale;

          if (pulse > 0.82 && depthNorm > 0.45) {
            const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4.2);
            glow.addColorStop(0, `rgba(56, 189, 248, ${(depthNorm * 0.45).toFixed(3)})`);
            glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(n.x, n.y, radius * 4.2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle =
            n.region === 'cerebellum'
              ? `rgba(45, 212, 191, ${(depthNorm * 0.88).toFixed(3)})`
              : `rgba(186, 230, 253, ${(depthNorm * 0.92).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =======================================================================
      // MODE 3: HYBRID — DENSE CRYSTALLINE OBSIDIAN POLYHEDRON + NEURAL CORE
      // =======================================================================
      if (mode === 'hybrid') {
        const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.46);
        bgGlow.addColorStop(0, 'rgba(0, 216, 255, 0.14)');
        bgGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.07)');
        bgGlow.addColorStop(1, 'rgba(7, 8, 11, 0)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        const euler = new THREE.Euler(state.currentRotX, state.currentRotY, Math.sin(t * 0.25) * 0.1, 'YXZ');

        // Dynamic light sources driven by cursor position
        const cyanLightDir = new THREE.Vector3(
          -0.65 + state.pointerX * 0.55,
          -0.55 + state.pointerY * 0.45,
          0.85
        ).normalize();
        const amberLightDir = new THREE.Vector3(
          0.7 - state.pointerX * 0.45,
          0.5 - state.pointerY * 0.35,
          0.75
        ).normalize();
        const viewDir = new THREE.Vector3(0, 0, 1);

        // Project all 320 crystal facets and compute per-facet lighting
        const projectedFacets = crystalFacets.map((f) => {
          const p0 = project3D(f.v0, euler.x, euler.y, state.zoom, cx, cy);
          const p1 = project3D(f.v1, euler.x, euler.y, state.zoom, cx, cy);
          const p2 = project3D(f.v2, euler.x, euler.y, state.zoom, cx, cy);
          const rotNormal = f.normal.clone().applyEuler(euler).normalize();
          const avgZ = (p0.z + p1.z + p2.z) / 3;

          // Blinn-Phong diffuse + sharp specular reflection
          const nDotCyan = Math.max(0, rotNormal.dot(cyanLightDir));
          const nDotAmber = Math.max(0, rotNormal.dot(amberLightDir));

          const halfCyan = cyanLightDir.clone().add(viewDir).normalize();
          const halfAmber = amberLightDir.clone().add(viewDir).normalize();
          const specCyan = Math.pow(Math.max(0, rotNormal.dot(halfCyan)), 28);
          const specAmber = Math.pow(Math.max(0, rotNormal.dot(halfAmber)), 24);

          return {
            p0,
            p1,
            p2,
            avgZ,
            isFrontFacing: rotNormal.z > -0.05,
            nDotCyan,
            nDotAmber,
            specCyan,
            specAmber,
            seed: f.facetSeed,
          };
        });

        const backFacets = projectedFacets.filter((f) => !f.isFrontFacing).sort((a, b) => a.avgZ - b.avgZ);
        const frontFacets = projectedFacets.filter((f) => f.isFrontFacing).sort((a, b) => a.avgZ - b.avgZ);

        // Step A: Render rear obsidian crystal facets
        for (const f of backFacets) {
          ctx.beginPath();
          ctx.moveTo(f.p0.x, f.p0.y);
          ctx.lineTo(f.p1.x, f.p1.y);
          ctx.lineTo(f.p2.x, f.p2.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(8, 11, 18, 0.55)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        // Step B: Render the suspended internal Neural Lattice Core inside the crystal
        const projCoreNodes = coreNodes.map((n, idx) => {
          const p = n.clone().multiplyScalar(1 + Math.sin(t * 2.2 + idx) * 0.03);
          return project3D(p, -state.currentRotX * 0.7, -state.currentRotY * 0.85 + t * 0.35, state.zoom, cx, cy);
        });

        for (const edge of coreEdges) {
          const na = projCoreNodes[edge.a];
          const nb = projCoreNodes[edge.b];
          ctx.strokeStyle = edge.warm
            ? 'rgba(245, 158, 11, 0.45)'
            : 'rgba(0, 216, 255, 0.48)';
          ctx.lineWidth = 1.15 * state.zoom;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();

          const pulse = (t * edge.speed + edge.offset) % 1;
          if (pulse < 0.35) {
            const frac = pulse / 0.35;
            const px = na.x + (nb.x - na.x) * frac;
            const py = na.y + (nb.y - na.y) * frac;
            ctx.fillStyle = edge.warm ? '#FDE68A' : '#A5F3FC';
            ctx.beginPath();
            ctx.arc(px, py, 2.2 * state.zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Central core energy singularity
        const coreCenterGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 78 * state.zoom);
        coreCenterGlow.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        coreCenterGlow.addColorStop(0.35, 'rgba(0, 216, 255, 0.28)');
        coreCenterGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.14)');
        coreCenterGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreCenterGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 78 * state.zoom, 0, Math.PI * 2);
        ctx.fill();

        // Step C: Render front-facing Crystalline Obsidian facets with specular rim reflections
        for (const f of frontFacets) {
          ctx.beginPath();
          ctx.moveTo(f.p0.x, f.p0.y);
          ctx.lineTo(f.p1.x, f.p1.y);
          ctx.lineTo(f.p2.x, f.p2.y);
          ctx.closePath();

          // Compute obsidian glass face color combining deep obsidian base + cyan & amber specular highlights
          const r = Math.min(255, Math.round(10 + f.nDotAmber * 55 + f.specAmber * 235 + f.specCyan * 70));
          const g = Math.min(255, Math.round(14 + f.nDotCyan * 65 + f.nDotAmber * 38 + f.specCyan * 220 + f.specAmber * 165));
          const b = Math.min(255, Math.round(22 + f.nDotCyan * 95 + f.specCyan * 255 + f.specAmber * 50));
          const alpha = Math.min(0.84, 0.34 + f.specCyan * 0.45 + f.specAmber * 0.38);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          ctx.fill();

          // Crisp crystalline facet bevel edges catching cyan or amber rim light
          const edgeSpec = Math.max(f.specCyan, f.specAmber);
          if (edgeSpec > 0.25) {
            ctx.strokeStyle =
              f.specCyan >= f.specAmber
                ? `rgba(0, 216, 255, ${Math.min(0.9, 0.25 + f.specCyan * 0.7).toFixed(3)})`
                : `rgba(245, 158, 11, ${Math.min(0.9, 0.25 + f.specAmber * 0.7).toFixed(3)})`;
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
            ctx.lineWidth = 0.75;
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [mode]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    interactionRef.current.isDragging = true;
    interactionRef.current.lastDragX = e.clientX;
    interactionRef.current.lastDragY = e.clientY;
    setIsDraggingUI(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic pointer capture errors in headless automation
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    interactionRef.current.pointerX = nx;
    interactionRef.current.pointerY = ny;

    // Update 3D perspective tilt and visor specular light sweep for Mode 1 (Automation Services)
    const rotX = (-ny * 8.5).toFixed(2);
    const rotY = (nx * 10.5 + (interactionRef.current.dragRotY * 180) / Math.PI).toFixed(2);
    setTiltTransform(
      `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${interactionRef.current.targetZoom.toFixed(
        3
      )}, ${interactionRef.current.targetZoom.toFixed(3)}, 1)`
    );
    setVisorSweepPos({
      x: Math.max(15, Math.min(85, 50 + nx * 28)),
      y: Math.max(22, Math.min(46, 33 + ny * 8)),
    });

    if (interactionRef.current.isDragging) {
      const dx = e.clientX - interactionRef.current.lastDragX;
      const dy = e.clientY - interactionRef.current.lastDragY;
      interactionRef.current.dragRotY += dx * 0.011;
      interactionRef.current.dragRotX = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, interactionRef.current.dragRotX + dy * 0.011)
      );
      interactionRef.current.lastDragX = e.clientX;
      interactionRef.current.lastDragY = e.clientY;
      e.currentTarget.setAttribute('data-drag-yaw', interactionRef.current.dragRotY.toFixed(3));
    }
  };

  const handlePointerLeave = () => {
    if (!interactionRef.current.isDragging) {
      interactionRef.current.pointerX = 0;
      interactionRef.current.pointerY = 0;
      setTiltTransform(
        `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(${interactionRef.current.targetZoom.toFixed(
          3
        )}, ${interactionRef.current.targetZoom.toFixed(3)}, 1)`
      );
      setVisorSweepPos({ x: 50, y: 33 });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    interactionRef.current.isDragging = false;
    setIsDraggingUI(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore synthetic pointer release errors
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const nextZoom = Math.max(
      0.75,
      Math.min(1.5, interactionRef.current.targetZoom - e.deltaY * 0.0008)
    );
    interactionRef.current.targetZoom = nextZoom;
    setZoomDisplay(Math.round(nextZoom * 100));
    setTiltTransform(
      `perspective(1200px) rotateX(${(-interactionRef.current.pointerY * 8.5).toFixed(2)}deg) rotateY(${(
        interactionRef.current.pointerX * 10.5
      ).toFixed(2)}deg) scale3d(${nextZoom.toFixed(3)}, ${nextZoom.toFixed(3)}, 1)`
    );
  };

  const badges =
    mode === 'machine'
      ? [
          { pos: 'top-5 left-5', label: 'Autonomous Runtime: 99.4%' },
          { pos: 'top-5 right-5', label: 'Zero-Operator Swarm' },
          { pos: 'bottom-5 left-5', label: 'Visor Specular Tracking · Active' },
        ]
      : mode === 'mind'
      ? [
          { pos: 'top-5 left-5', label: 'Anatomical Synaptic Matrix · Active' },
          { pos: 'top-5 right-5', label: '4.2x Executive Reach Velocity' },
          { pos: 'bottom-5 left-5', label: '100% Category Differentiation' },
        ]
      : [
          { pos: 'top-5 left-5', label: 'Crystalline Obsidian + Neural Core' },
          { pos: 'top-5 right-5', label: 'Engineering + Authority Sync' },
          { pos: 'bottom-5 left-5', label: 'Dual-Spectrum Specular Refraction' },
        ];

  return (
    <div
      ref={containerRef}
      id="hero-3d-centerpiece"
      data-centerpiece-mode={mode}
      data-drag-yaw="0.000"
      data-zoom={zoomDisplay}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      className={`relative w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden select-none flex items-center justify-center ${
        isDraggingUI ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      aria-label={
        mode === 'machine'
          ? 'Studio-Grade Cybernetic Android Bust Centerpiece'
          : mode === 'mind'
          ? 'Anatomical Neural Synaptic Brain Centerpiece'
          : 'Crystalline Obsidian Polyhedron and Neural Core Centerpiece'
      }
    >
      {/* SECTION 4.1: Photorealistic 2.5D Layered Depth Shader for Cybernetic Android Bust */}
      {mode === 'machine' && (
        <div
          id="cybernetic-android-depth-rig"
          style={{
            transform: tiltTransform,
            transition: isDraggingUI ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
        >
          {/* Base Plane: Studio-Grade Photorealistic Cybernetic Android Bust */}
          <img
            src="/assets/centerpieces/cybernetic_android_bust.jpg"
            alt="Cybernetic Android Bust with Obsidian Composite Armor and Electric-Cyan Visor"
            className="w-[88%] h-[88%] object-contain select-none pointer-events-none rounded-2xl"
            style={{
              filter: 'contrast(1.06) brightness(1.02)',
              maskImage: 'radial-gradient(ellipse 68% 68% at 50% 48%, black 62%, transparent 98%)',
              WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at 50% 48%, black 62%, transparent 98%)',
            }}
          />

          {/* Normal-Mapped Specular Visor Reflection Sweep Layer */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              background: `radial-gradient(140px 38px ellipse at ${visorSweepPos.x}% ${visorSweepPos.y}%, rgba(0, 216, 255, 0.65), rgba(0, 216, 255, 0.14) 55%, transparent 85%)`,
            }}
          />
        </div>
      )}

      {/* Interactive High-DPI WebGL/Canvas Layer (Synaptic Brain, Obsidian Polyhedron, and Android Particle Telemetry) */}
      <canvas
        ref={canvasRef}
        data-testid="hero-3d-canvas"
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* SECTION 2.2: Floating Glass Telemetry Badges */}
      {badges.map((b, idx) => (
        <div
          key={idx}
          className={`floating-glass-badge absolute ${b.pos} backdrop-blur-xl bg-white/[0.035] border border-white/[0.12] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)] rounded-full px-3.5 py-1.5 text-xs text-zinc-200 font-sans pointer-events-none flex items-center gap-2 z-10`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              mode === 'mind'
                ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]'
                : mode === 'machine'
                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,216,255,0.8)]'
                : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
            }`}
          />
          <span>{b.label}</span>
        </div>
      ))}

      {/* Interactive 360° & Zoom Telemetry Capsule */}
      <div className="floating-glass-badge absolute bottom-5 right-5 backdrop-blur-xl bg-white/[0.035] border border-white/[0.12] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)] rounded-full px-3.5 py-1.5 text-xs text-zinc-200 font-sans pointer-events-none flex items-center gap-2 z-10">
        <span>{mode === 'machine' ? 'Interactive 3D Tilt · Zoom' : 'Drag 360° · Zoom'}</span>
        <span className="font-mono text-[11px] text-white">{zoomDisplay}%</span>
      </div>
    </div>
  );
};

export default HeroCenterpiece3D;

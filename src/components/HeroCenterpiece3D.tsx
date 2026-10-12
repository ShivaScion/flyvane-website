import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroCenterpiece3DProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

interface BrainNode {
  pos: THREE.Vector3;
  hemisphere: 'left' | 'right' | 'core';
  phase: number;
}

interface SynapseEdge {
  a: number;
  b: number;
  pulseOffset: number;
  pulseSpeed: number;
}

interface ArmorFace {
  verts: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3?];
  baseColor: string;
  rimColor: string;
  isVisor?: boolean;
  part: 'head' | 'visor' | 'neck' | 'chest';
}

interface ConduitPath {
  points: THREE.Vector3[];
  phase: number;
}

export const HeroCenterpiece3D: React.FC<HeroCenterpiece3DProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoomDisplay, setZoomDisplay] = useState<number>(100);
  const [isDraggingUI, setIsDraggingUI] = useState<boolean>(false);

  // Interactive physics state ref
  const interactionRef = useRef({
    pointerX: 0,
    pointerY: 0,
    isHovered: false,
    isDragging: false,
    lastDragX: 0,
    lastDragY: 0,
    dragRotY: 0,
    dragRotX: 0,
    currentRotY: 0,
    currentRotX: 0,
    zoom: 1.0,
    targetZoom: 1.0,
    visorSweep: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 640;
    let height = 540;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 440);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // =========================================================================
    // 1. BUILD NEURAL BRAIN GEOMETRY (Marketing Services / Mind Mode)
    // =========================================================================
    const brainNodes: BrainNode[] = [];
    const brainEdges: SynapseEdge[] = [];

    // Generate bi-hemispheric anatomical cerebral cortex point cloud
    const numCorticalNodes = 156;
    for (let i = 0; i < numCorticalNodes; i++) {
      const isLeft = i % 2 === 0;
      const u = ((i * 0.61803398875) % 1) * Math.PI * 2;
      const v = Math.acos(2 * (((i + 0.5) / numCorticalNodes)) - 1);

      // Ellipsoid proportions for human cerebral hemisphere
      let x = Math.sin(v) * Math.cos(u) * 86;
      let y = Math.cos(v) * 95;
      const z = Math.sin(v) * Math.sin(u) * 128;

      // Separate hemispheres across longitudinal fissure
      const hemiSign = isLeft ? -1 : 1;
      x = hemiSign * (Math.abs(x) * 0.78 + 14);

      //Flatten inferior base slightly & curve temporal lobe
      if (y < -25) {
        y *= 0.68;
      }
      y += Math.sin(z * 0.025) * 10;

      brainNodes.push({
        pos: new THREE.Vector3(x, y, z),
        hemisphere: isLeft ? 'left' : 'right',
        phase: (i * 1.37) % (Math.PI * 2),
      });
    }

    // Add corpus callosum / deep thalamic core nodes bridging hemispheres
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      brainNodes.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * 22,
          Math.sin(angle) * 26 - 5,
          Math.sin(angle * 2) * 48
        ),
        hemisphere: 'core',
        phase: i * 0.5,
      });
    }

    // Connect nearby cortical & thalamic nodes to form dense neural wireframe
    for (let i = 0; i < brainNodes.length; i++) {
      for (let j = i + 1; j < brainNodes.length; j++) {
        const dist = brainNodes[i].pos.distanceTo(brainNodes[j].pos);
        const sameHemi = brainNodes[i].hemisphere === brainNodes[j].hemisphere;
        const maxDist = sameHemi ? 46 : 38;
        if (dist < maxDist) {
          brainEdges.push({
            a: i,
            b: j,
            pulseOffset: (i * 0.31 + j * 0.17) % 1,
            pulseSpeed: 0.32 + ((i + j) % 7) * 0.06,
          });
        }
      }
    }

    // Drifting ambient neural dust particles
    const ambientParticles = Array.from({ length: 75 }, (_, i) => ({
      pos: new THREE.Vector3(
        (Math.sin(i * 12.9898) * 43758.5453 % 1) * 320 - 160,
        (Math.cos(i * 78.233) * 23421.631 % 1) * 280 - 140,
        (Math.sin(i * 45.164) * 19283.412 % 1) * 240 - 120
      ),
      speed: 0.25 + (i % 5) * 0.1,
      size: 1.1 + (i % 3) * 0.6,
    }));

    // =========================================================================
    // 2. BUILD CYBERNETIC ANDROID BUST GEOMETRY (Automation Services / Machine)
    // =========================================================================
    const androidFaces: ArmorFace[] = [];
    const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

    // Cranial Crown & Obsidian Helmet Plates
    androidFaces.push(
      // Forehead central plate
      {
        verts: [v(-36, -98, 48), v(36, -98, 48), v(44, -52, 66), v(-44, -52, 66)],
        baseColor: '#0E131B',
        rimColor: 'rgba(0, 216, 255, 0.35)',
        part: 'head',
      },
      // Crown top plate
      {
        verts: [v(-28, -124, 10), v(28, -124, 10), v(36, -98, 48), v(-36, -98, 48)],
        baseColor: '#121824',
        rimColor: 'rgba(0, 216, 255, 0.28)',
        part: 'head',
      },
      // Left & Right temporal plates
      {
        verts: [v(-58, -82, 12), v(-36, -98, 48), v(-44, -52, 66), v(-62, -44, 24)],
        baseColor: '#0A0D14',
        rimColor: 'rgba(56, 189, 248, 0.25)',
        part: 'head',
      },
      {
        verts: [v(36, -98, 48), v(58, -82, 12), v(62, -44, 24), v(44, -52, 66)],
        baseColor: '#0A0D14',
        rimColor: 'rgba(56, 189, 248, 0.25)',
        part: 'head',
      },
      // Electric-Cyan Glowing Visor (#00D8FF) — Central & Wrap-around segments
      {
        verts: [v(-46, -50, 67), v(46, -50, 67), v(42, -26, 72), v(-42, -26, 72)],
        baseColor: '#00D8FF',
        rimColor: '#7DD3FC',
        isVisor: true,
        part: 'visor',
      },
      {
        verts: [v(-62, -44, 26), v(-46, -50, 67), v(-42, -26, 72), v(-58, -22, 32)],
        baseColor: '#00B8E6',
        rimColor: '#38BDF8',
        isVisor: true,
        part: 'visor',
      },
      {
        verts: [v(46, -50, 67), v(62, -44, 26), v(58, -22, 32), v(42, -26, 72)],
        baseColor: '#00B8E6',
        rimColor: '#38BDF8',
        isVisor: true,
        part: 'visor',
      },
      // Zygomatic / Cheekbone Matte Obsidian Plates
      {
        verts: [v(-42, -24, 70), v(0, -22, 76), v(0, 12, 68), v(-34, 8, 54)],
        baseColor: '#0C1017',
        rimColor: 'rgba(0, 216, 255, 0.28)',
        part: 'head',
      },
      {
        verts: [v(0, -22, 76), v(42, -24, 70), v(34, 8, 54), v(0, 12, 68)],
        baseColor: '#0E131C',
        rimColor: 'rgba(0, 216, 255, 0.28)',
        part: 'head',
      },
      // Mandible / Jaw Guard
      {
        verts: [v(-32, 10, 52), v(32, 10, 52), v(20, 34, 56), v(-20, 34, 56)],
        baseColor: '#090C12',
        rimColor: 'rgba(0, 216, 255, 0.35)',
        part: 'head',
      },
      // Cervical Neck Core Column
      {
        verts: [v(-22, 34, 30), v(22, 34, 30), v(28, 72, 24), v(-28, 72, 24)],
        baseColor: '#070A0F',
        rimColor: 'rgba(0, 216, 255, 0.4)',
        part: 'neck',
      },
      // Thoracic Sternum Core Reactor Plate
      {
        verts: [v(-42, 74, 44), v(42, 74, 44), v(30, 134, 52), v(-30, 134, 52)],
        baseColor: '#0D121A',
        rimColor: 'rgba(0, 216, 255, 0.45)',
        part: 'chest',
      },
      // Left & Right Pectoral / Deltoid Obsidian Armor Plates
      {
        verts: [v(-118, 68, 12), v(-42, 74, 44), v(-30, 134, 52), v(-104, 128, 22)],
        baseColor: '#0A0E15',
        rimColor: 'rgba(56, 189, 248, 0.3)',
        part: 'chest',
      },
      {
        verts: [v(42, 74, 44), v(118, 68, 12), v(104, 128, 22), v(30, 134, 52)],
        baseColor: '#0C1119',
        rimColor: 'rgba(56, 189, 248, 0.3)',
        part: 'chest',
      }
    );

    // High-density exposed energy conduits on the Android Bust
    const androidConduits: ConduitPath[] = [
      {
        points: [v(-36, 32, 34), v(-44, 54, 38), v(-68, 76, 32), v(-96, 98, 24)],
        phase: 0.1,
      },
      {
        points: [v(36, 32, 34), v(44, 54, 38), v(68, 76, 32), v(96, 98, 24)],
        phase: 0.6,
      },
      {
        points: [v(-16, 34, 40), v(-20, 62, 42), v(-18, 102, 50)],
        phase: 0.35,
      },
      {
        points: [v(16, 34, 40), v(20, 62, 42), v(18, 102, 50)],
        phase: 0.85,
      },
      {
        points: [v(-52, -52, 40), v(-58, -78, 20), v(-40, -108, 18)],
        phase: 0.5,
      },
      {
        points: [v(52, -52, 40), v(58, -78, 20), v(40, -108, 18)],
        phase: 0.9,
      },
    ];

    // =========================================================================
    // 3. BUILD HYBRID OBSIDIAN LATTICE + SYNAPTIC WEB GEOMETRY
    // =========================================================================
    const icoGeom = new THREE.IcosahedronGeometry(108, 1);
    const innerGeom = new THREE.DodecahedronGeometry(64, 0);
    const posAttr = icoGeom.attributes.position;
    const latticeTriangles: Array<[THREE.Vector3, THREE.Vector3, THREE.Vector3]> = [];
    const latticeVertices: THREE.Vector3[] = [];

    for (let i = 0; i < posAttr.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const b = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);
      latticeTriangles.push([a, b, c]);
    }

    for (let i = 0; i < posAttr.count; i++) {
      const pt = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      if (!latticeVertices.some((existing) => existing.distanceTo(pt) < 1)) {
        latticeVertices.push(pt);
      }
    }

    const innerPosAttr = innerGeom.attributes.position;
    const innerVertices: THREE.Vector3[] = [];
    for (let i = 0; i < innerPosAttr.count; i++) {
      const pt = new THREE.Vector3().fromBufferAttribute(innerPosAttr, i);
      if (!innerVertices.some((existing) => existing.distanceTo(pt) < 1)) {
        innerVertices.push(pt);
      }
    }

    // Project 3D point to 2D canvas coordinates
    const fov = 520;
    const project = (pt: THREE.Vector3, zoomScale: number) => {
      const zOffset = 380 / zoomScale - pt.z;
      const scale = fov / Math.max(zOffset, 80);
      return {
        x: width / 2 + pt.x * scale,
        y: height / 2 + pt.y * scale,
        scale,
        z: pt.z,
      };
    };

    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const state = interactionRef.current;

      // Smooth lerp for rotation and zoom
      const targetY = state.dragRotY + state.pointerX * 0.55;
      const targetX = state.dragRotX + state.pointerY * 0.35;
      state.currentRotY += (targetY - state.currentRotY) * 0.08;
      state.currentRotX += (targetX - state.currentRotX) * 0.08;
      state.zoom += (state.targetZoom - state.zoom) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric radial aura behind 3D model
      const auraGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        15,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.48
      );
      if (mode === 'mind') {
        auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
        auraGrad.addColorStop(0.5, 'rgba(45, 212, 191, 0.06)');
        auraGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
      } else if (mode === 'machine') {
        auraGrad.addColorStop(0, 'rgba(0, 216, 255, 0.16)');
        auraGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.05)');
        auraGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
      } else {
        auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
        auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.07)');
        auraGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
      }
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // =======================================================================
      // MODE 1: MARKETING SERVICES — DYNAMIC WIREFRAME NEURAL BRAIN
      // =======================================================================
      if (mode === 'mind') {
        const autoYaw = elapsed * 0.24;
        const euler = new THREE.Euler(
          state.currentRotX + Math.sin(elapsed * 0.7) * 0.06,
          state.currentRotY + autoYaw,
          0,
          'YXZ'
        );

        // 1. Drifting background node particles
        for (const p of ambientParticles) {
          const drifted = p.pos.clone();
          drifted.y = ((drifted.y - elapsed * 14 * p.speed + 140) % 280) - 140;
          drifted.applyEuler(euler);
          const proj = project(drifted, state.zoom);
          const alpha = Math.max(0.08, Math.min(0.45, (proj.z + 140) / 280));
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Transform all brain nodes
        const projectedNodes = brainNodes.map((n) => {
          const cloned = n.pos.clone();
          const pulse = 1 + Math.sin(elapsed * 2.2 + n.phase) * 0.018;
          cloned.multiplyScalar(pulse);
          cloned.applyEuler(euler);
          return {
            ...project(cloned, state.zoom),
            hemisphere: n.hemisphere,
            phase: n.phase,
          };
        });

        // 2. Render neural wireframe axons & synaptic firing waves
        for (const edge of brainEdges) {
          const nA = projectedNodes[edge.a];
          const nB = projectedNodes[edge.b];
          const avgZ = (nA.z + nB.z) * 0.5;
          const depthAlpha = Math.max(0.06, Math.min(0.48, (avgZ + 130) / 240));

          ctx.strokeStyle =
            nA.hemisphere === 'core'
              ? `rgba(45, 212, 191, ${(depthAlpha * 1.1).toFixed(2)})`
              : `rgba(56, 189, 248, ${depthAlpha.toFixed(2)})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(nA.x, nA.y);
          ctx.lineTo(nB.x, nB.y);
          ctx.stroke();

          // Traveling synaptic action-potential wave along axon
          const waveProgress = (elapsed * edge.pulseSpeed + edge.pulseOffset) % 1;
          if (waveProgress < 0.35 && avgZ > -40) {
            const t = waveProgress / 0.35;
            const wx = nA.x + (nB.x - nA.x) * t;
            const wy = nA.y + (nB.y - nA.y) * t;
            ctx.fillStyle = '#2DD4BF';
            ctx.beginPath();
            ctx.arc(wx, wy, 1.9 * ((nA.scale + nB.scale) * 0.5), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. Render luminescent cortical nodes (#38BDF8 & #2DD4BF)
        for (const n of projectedNodes) {
          const depthAlpha = Math.max(0.18, Math.min(0.95, (n.z + 130) / 230));
          const isTeal = n.hemisphere === 'right' || n.hemisphere === 'core';
          ctx.fillStyle = isTeal
            ? `rgba(45, 212, 191, ${depthAlpha.toFixed(2)})`
            : `rgba(56, 189, 248, ${depthAlpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2 * n.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =======================================================================
      // MODE 2: AUTOMATION SERVICES — CYBERNETIC ANDROID BUST
      // =======================================================================
      else if (mode === 'machine') {
        const levitationY = Math.sin(elapsed * 1.7) * 7;
        const breathScale = 1 + Math.sin(elapsed * 2.4) * 0.016;
        const headEuler = new THREE.Euler(
          state.currentRotX * 0.85 + Math.sin(elapsed * 1.1) * 0.04,
          state.currentRotY * 0.95 + Math.sin(elapsed * 0.6) * 0.14,
          0,
          'YXZ'
        );
        const bodyEuler = new THREE.Euler(
          state.currentRotX * 0.45,
          state.currentRotY * 0.65 + Math.sin(elapsed * 0.6) * 0.08,
          0,
          'YXZ'
        );

        // Transform & Z-sort armor plates
        const transformedFaces = androidFaces
          .map((face) => {
            const transformedVerts = face.verts
              .filter((v): v is THREE.Vector3 => Boolean(v))
              .map((vert) => {
                const p = vert.clone();
                if (face.part === 'chest') {
                  p.x *= breathScale;
                  p.z *= breathScale;
                  p.applyEuler(bodyEuler);
                } else {
                  p.applyEuler(headEuler);
                }
                p.y += levitationY;
                return p;
              });

            const centerZ =
              transformedVerts.reduce((acc, v) => acc + v.z, 0) / transformedVerts.length;

            // Compute surface normal for specular lighting
            const vA = new THREE.Vector3().subVectors(transformedVerts[1], transformedVerts[0]);
            const vB = new THREE.Vector3().subVectors(transformedVerts[2], transformedVerts[0]);
            const normal = new THREE.Vector3().crossVectors(vA, vB).normalize();
            const lightDir = new THREE.Vector3(
              state.pointerX * 0.8,
              -0.5 + state.pointerY * 0.5,
              1
            ).normalize();
            const diffuse = Math.max(0, Math.abs(normal.dot(lightDir)));

            return {
              face,
              projected: transformedVerts.map((tv) => project(tv, state.zoom)),
              centerZ,
              diffuse,
            };
          })
          .sort((a, b) => a.centerZ - b.centerZ);

        // Render high-density energy conduits first
        for (const conduit of androidConduits) {
          const pts = conduit.points.map((pt) => {
            const c = pt.clone().applyEuler(bodyEuler);
            c.y += levitationY;
            return project(c, state.zoom);
          });

          ctx.strokeStyle = 'rgba(0, 216, 255, 0.35)';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.stroke();

          // Flowing energy packet along conduit
          const pulseT = (elapsed * 0.75 + conduit.phase) % 1;
          const segIdx = Math.min(
            pts.length - 2,
            Math.floor(pulseT * (pts.length - 1))
          );
          const localT = pulseT * (pts.length - 1) - segIdx;
          const px = pts[segIdx].x + (pts[segIdx + 1].x - pts[segIdx].x) * localT;
          const py = pts[segIdx].y + (pts[segIdx + 1].y - pts[segIdx].y) * localT;
          ctx.fillStyle = '#00D8FF';
          ctx.shadowColor = '#00D8FF';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Render Z-sorted obsidian armor plates & glowing electric-cyan visor
        for (const item of transformedFaces) {
          const { face, projected, diffuse } = item;
          ctx.beginPath();
          projected.forEach((p, idx) =>
            idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
          );
          ctx.closePath();

          if (face.isVisor) {
            // Electric-cyan glowing visor (#00D8FF) with specular light sweep
            const minX = Math.min(...projected.map((p) => p.x));
            const maxX = Math.max(...projected.map((p) => p.x));
            const sweepCenter =
              0.5 +
              Math.sin(elapsed * 2.1 + state.pointerX * 2.2) * 0.38;
            const visorGrad = ctx.createLinearGradient(minX, 0, maxX, 0);
            visorGrad.addColorStop(0, 'rgba(0, 180, 230, 0.85)');
            visorGrad.addColorStop(
              Math.max(0.05, Math.min(0.95, sweepCenter - 0.12)),
              'rgba(0, 216, 255, 0.95)'
            );
            visorGrad.addColorStop(
              Math.max(0.1, Math.min(0.9, sweepCenter)),
              '#E0F2FE'
            );
            visorGrad.addColorStop(
              Math.max(0.15, Math.min(0.98, sweepCenter + 0.12)),
              'rgba(0, 216, 255, 0.95)'
            );
            visorGrad.addColorStop(1, 'rgba(0, 180, 230, 0.85)');

            ctx.save();
            ctx.shadowColor = '#00D8FF';
            ctx.shadowBlur = 22;
            ctx.fillStyle = visorGrad;
            ctx.fill();
            ctx.strokeStyle = '#BAE6FD';
            ctx.lineWidth = 1.4;
            ctx.stroke();
            ctx.restore();
          } else {
            // Matte obsidian armor plate with specular rim reflection
            const shade = Math.round(10 + diffuse * 22);
            ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 11})`;
            ctx.fill();
            ctx.strokeStyle = face.rimColor;
            ctx.lineWidth = 1.15;
            ctx.stroke();
          }
        }

        // Thoracic core reactor glow ring
        const reactorCenter = new THREE.Vector3(0, 102, 54).applyEuler(bodyEuler);
        reactorCenter.y += levitationY;
        const rProj = project(reactorCenter, state.zoom);
        ctx.save();
        ctx.shadowColor = '#00D8FF';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = 'rgba(0, 216, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rProj.x, rProj.y, 11 * rProj.scale * breathScale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 216, 255, 0.35)';
        ctx.fill();
        ctx.restore();
      }

      // =======================================================================
      // MODE 3: HYBRID MODE — DENSE OBSIDIAN LATTICE + SYNAPTIC WEB
      // =======================================================================
      else {
        const outerEuler = new THREE.Euler(
          state.currentRotX + elapsed * 0.18,
          state.currentRotY + elapsed * 0.26,
          elapsed * 0.08,
          'YXZ'
        );
        const innerEuler = new THREE.Euler(
          -state.currentRotX * 1.2 - elapsed * 0.25,
          -state.currentRotY * 1.2 + elapsed * 0.32,
          0,
          'YXZ'
        );

        // 1. Inner pulsing synaptic neural threads
        const projInner = innerVertices.map((v) => {
          const cloned = v.clone();
          const pulse = 1 + Math.sin(elapsed * 2.8 + v.x * 0.05) * 0.06;
          cloned.multiplyScalar(pulse).applyEuler(innerEuler);
          return project(cloned, state.zoom);
        });

        for (let i = 0; i < projInner.length; i++) {
          for (let j = i + 1; j < projInner.length; j++) {
            const dx = projInner[i].x - projInner[j].x;
            const dy = projInner[i].y - projInner[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 95) {
              ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(projInner[i].x, projInner[i].y);
              ctx.lineTo(projInner[j].x, projInner[j].y);
              ctx.stroke();
            }
          }
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(projInner[i].x, projInner[i].y, 2.4 * projInner[i].scale, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Outer Crystalline Obsidian Polyhedron Facets
        const sortedTris = latticeTriangles
          .map((tri) => {
            const tVerts = tri.map((v) => v.clone().applyEuler(outerEuler));
            const zAvg = (tVerts[0].z + tVerts[1].z + tVerts[2].z) / 3;
            const e1 = new THREE.Vector3().subVectors(tVerts[1], tVerts[0]);
            const e2 = new THREE.Vector3().subVectors(tVerts[2], tVerts[0]);
            const norm = new THREE.Vector3().crossVectors(e1, e2).normalize();
            const light = new THREE.Vector3(state.pointerX, -state.pointerY, 1).normalize();
            const spec = Math.max(0, norm.dot(light));
            return {
              pts: tVerts.map((tv) => project(tv, state.zoom)),
              zAvg,
              spec,
            };
          })
          .sort((a, b) => a.zAvg - b.zAvg);

        for (const tri of sortedTris) {
          ctx.beginPath();
          ctx.moveTo(tri.pts[0].x, tri.pts[0].y);
          ctx.lineTo(tri.pts[1].x, tri.pts[1].y);
          ctx.lineTo(tri.pts[2].x, tri.pts[2].y);
          ctx.closePath();

          const fillAlpha = 0.14 + tri.spec * 0.22;
          ctx.fillStyle = `rgba(12, 16, 24, ${fillAlpha.toFixed(2)})`;
          ctx.fill();
          ctx.strokeStyle =
            tri.spec > 0.65
              ? 'rgba(56, 189, 248, 0.55)'
              : 'rgba(16, 185, 129, 0.24)';
          ctx.lineWidth = 1;
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
      // Synthetic pointer events in headless tests may not have an active pointerId
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    interactionRef.current.pointerX = nx;
    interactionRef.current.pointerY = ny;

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
      0.68,
      Math.min(1.65, interactionRef.current.targetZoom - e.deltaY * 0.0008)
    );
    interactionRef.current.targetZoom = nextZoom;
    setZoomDisplay(Math.round(nextZoom * 100));
  };

  const badges =
    mode === 'machine'
      ? [
          { pos: 'top-4 left-4', label: 'Autonomous Runtime · 99.4% Precision' },
          { pos: 'top-4 right-4', label: 'Zero-Operator Worker Swarm' },
          { pos: 'bottom-4 left-4', label: 'Visor Specular Tracking · Active' },
        ]
      : mode === 'mind'
      ? [
          { pos: 'top-4 left-4', label: 'Synaptic Positioning Matrix · Active' },
          { pos: 'top-4 right-4', label: '4.2x Executive Reach Velocity' },
          { pos: 'bottom-4 left-4', label: '100% Category Differentiation' },
        ]
      : [
          { pos: 'top-4 left-4', label: 'Obsidian Lattice · Unified Engine' },
          { pos: 'top-4 right-4', label: 'Engineering + Authority Sync' },
          { pos: 'bottom-4 left-4', label: 'Interactive 360° Projection' },
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
      onWheel={handleWheel}
      className={`relative w-full h-[440px] sm:h-[510px] rounded-3xl overflow-hidden select-none ${
        isDraggingUI ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      aria-label={
        mode === 'machine'
          ? 'Interactive 3D Cybernetic Android Bust Centerpiece'
          : mode === 'mind'
          ? 'Interactive 3D Neural Brain Centerpiece'
          : 'Interactive 3D Obsidian Lattice Centerpiece'
      }
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Floating Liquid Glass Status Capsules (Section 2.2 Strict Spec) */}
      {badges.map((b, idx) => (
        <div
          key={idx}
          className={`absolute ${b.pos} backdrop-blur-xl bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full text-xs text-zinc-300 font-sans pointer-events-none flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.18)]`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              mode === 'mind'
                ? 'bg-teal-400'
                : mode === 'machine'
                ? 'bg-cyan-400'
                : 'bg-emerald-400'
            }`}
          />
          <span>{b.label}</span>
        </div>
      ))}

      {/* Interactive 360° & Zoom Capsule */}
      <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full text-xs text-zinc-300 font-sans pointer-events-none flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.18)]">
        <span>Drag 360° · Zoom</span>
        <span className="font-mono text-[11px] text-white">{zoomDisplay}%</span>
      </div>
    </div>
  );
};

export default HeroCenterpiece3D;

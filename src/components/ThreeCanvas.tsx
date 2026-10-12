import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const icosahedronRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (err) {
      console.warn('WebGL is not supported or failed to initialize:', err);
      return;
    }

    // Particle Cloud
    const particleCount = 220;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 26;
      positions[i + 1] = (Math.random() - 0.5) * 36;
      positions[i + 2] = (Math.random() - 0.5) * 16;

      colors[i] = 0.0;
      colors[i + 1] = 0.85 + Math.random() * 0.15;
      colors[i + 2] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });

    const particleCloud = new THREE.Points(geometry, pMaterial);
    scene.add(particleCloud);

    // Rotating 3D Icosahedron
    const icoGeom = new THREE.IcosahedronGeometry(2.4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: mode === 'mind' ? 0xf59e0b : mode === 'hybrid' ? 0x10b981 : 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const icosahedronMesh = new THREE.Mesh(icoGeom, icoMat);
    icosahedronMesh.position.set(4.5, 0, -2);
    scene.add(icosahedronMesh);
    icosahedronRef.current = icosahedronMesh;

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let currentScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      currentScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 1.5;
      camera.position.y = (targetY * 1.2) - (currentScroll * 15);
      camera.position.z = 8 + Math.sin(currentScroll * Math.PI) * 3;

      particleCloud.rotation.y += 0.001;
      particleCloud.rotation.x = currentScroll * 1.5;

      icosahedronMesh.rotation.x += 0.004;
      icosahedronMesh.rotation.y += 0.006;
      icosahedronMesh.position.y = - (currentScroll * 12);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update mesh color when theme mode changes
  useEffect(() => {
    if (icosahedronRef.current) {
      const mat = icosahedronRef.current.material as THREE.MeshBasicMaterial;
      if (mode === 'mind') mat.color.setHex(0xf59e0b);
      else if (mode === 'hybrid') mat.color.setHex(0x10b981);
      else mat.color.setHex(0x00f0ff);
    }
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

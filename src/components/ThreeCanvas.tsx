import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial | null>(null);

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
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (err) {
      console.warn('WebGL is not supported or failed to initialize:', err);
      return;
    }

    // Subtle Ambient Depth Dust Particle Field (No wireframe cages or polyhedrons)
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 28;
      positions[i + 1] = (Math.random() - 0.5) * 38;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.065,
      color: mode === 'mind' ? 0xf59e0b : mode === 'hybrid' ? 0x00d8ff : 0x10b981,
      transparent: true,
      opacity: 0.42,
    });
    pointsMaterialRef.current = pMaterial;

    const particleCloud = new THREE.Points(geometry, pMaterial);
    scene.add(particleCloud);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
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

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = targetX * 1.1;
      camera.position.y = targetY * 0.9 - currentScroll * 12;
      camera.position.z = 8 + Math.sin(currentScroll * Math.PI) * 2;

      particleCloud.rotation.y += 0.0006;
      particleCloud.rotation.x = currentScroll * 1.1;

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

  useEffect(() => {
    if (pointsMaterialRef.current) {
      if (mode === 'mind') pointsMaterialRef.current.color.setHex(0xf59e0b);
      else if (mode === 'hybrid') pointsMaterialRef.current.color.setHex(0x00d8ff);
      else pointsMaterialRef.current.color.setHex(0x10b981);
    }
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

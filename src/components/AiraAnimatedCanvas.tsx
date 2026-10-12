import React, { useEffect, useRef } from 'react';

interface AiraAnimatedCanvasProps {
  poseName: 'standing' | 'laptop' | 'coffee' | 'pointing' | 'smiling' | 'walking' | 'waving';
  isSpeaking: boolean;
  isCursorOffscreen: boolean;
  width?: number;
  height?: number;
}

export const AiraAnimatedCanvas: React.FC<AiraAnimatedCanvasProps> = ({
  poseName,
  isCursorOffscreen,
  width = 240,
  height = 360,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Physics & Time state
    let time = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    let walkTimer = 0;
    let walkFrame = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 3;

      targetMouseX = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      targetMouseY = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Preload high-res realistic photographic assets
    const imgStanding = new Image(); imgStanding.src = '/assets/aira/aira_standing.png';
    const imgLaptop = new Image(); imgLaptop.src = '/assets/aira/aira_laptop.png';
    const imgCoffee = new Image(); imgCoffee.src = '/assets/aira/aira_coffee.png';
    const imgPointing = new Image(); imgPointing.src = '/assets/aira/aira_pointing.png';
    const imgSmiling = new Image(); imgSmiling.src = '/assets/aira/aira_smiling.png';
    const imgWalk1 = new Image(); imgWalk1.src = '/assets/aira/aira_walk_step1.png';
    const imgWalk2 = new Image(); imgWalk2.src = '/assets/aira/aira_walk_step2.png';
    const imgWaving = new Image(); imgWaving.src = '/assets/aira/aira_waving.png';

    const render = () => {
      time += 0.03;

      // 1. Mouse Tracking with spring damping
      mouseX += (targetMouseX - mouseX) * 0.07;
      mouseY += (targetMouseY - mouseY) * 0.07;

      // 2. Multi-Frame Walkcycle Logic
      const isWalking = poseName === 'walking';
      let activeImg = imgStanding;

      if (isWalking) {
        walkTimer += 0.16;
        walkFrame = Math.floor(walkTimer) % 4;
        if (walkFrame === 0) activeImg = imgWalk1;
        else if (walkFrame === 1) activeImg = imgStanding;
        else if (walkFrame === 2) activeImg = imgWalk2;
        else activeImg = imgStanding;
      } else if (poseName === 'waving') {
        activeImg = imgWaving;
      } else if (poseName === 'laptop') {
        activeImg = imgLaptop;
      } else if (poseName === 'coffee') {
        activeImg = imgCoffee;
      } else if (poseName === 'pointing') {
        activeImg = imgPointing;
      } else if (poseName === 'smiling') {
        activeImg = imgSmiling;
      }

      // 3. Cinematic Micro-Physics (Breathing, 3D Parallax Tilt, Hip Bob)
      const walkBounceY = isWalking ? Math.abs(Math.sin(time * 12)) * 8 : 0;
      const breatheY = Math.sin(time * 2.2) * 3.5;
      const breatheScaleX = 1 + Math.sin(time * 2.2) * 0.008;
      const breatheScaleY = 1 - Math.sin(time * 2.2) * 0.006;

      // Subtle 3D perspective Parallax on mouse
      const headParallaxX = isCursorOffscreen ? 15 : mouseX * 8;
      const headTilt = isCursorOffscreen ? 0.06 : mouseX * 0.035;

      // Canvas DPI Scaling
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      ctx.save();

      // Soft Cinematic Floor Contact Shadow
      const shadowW = 75 + (isWalking ? Math.sin(time * 12) * 8 : 0);
      const shadowGrad = ctx.createRadialGradient(width / 2, height - 18, 5, width / 2, height - 18, shadowW);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(width / 2, height - 18, shadowW, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Backlight Ambient Halo (Dark Brushed Titanium glow)
      const rimHalo = ctx.createRadialGradient(width / 2, height * 0.45, 20, width / 2, height * 0.45, 110);
      rimHalo.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      rimHalo.addColorStop(0.7, 'rgba(0, 240, 255, 0.04)');
      rimHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rimHalo;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.45, 110, 0, Math.PI * 2);
      ctx.fill();

      // Center coordinate transform with body breathing and walk bounce
      ctx.translate(width / 2 + headParallaxX * 0.3, height / 2 + breatheY - walkBounceY);
      ctx.rotate(headTilt);
      ctx.scale(breatheScaleX, breatheScaleY);

      // Draw Realistic High-Res Image Texture with Smooth Blending
      if (activeImg.complete && activeImg.naturalWidth > 0) {
        const aspect = activeImg.naturalWidth / activeImg.naturalHeight;
        const drawH = height * 0.94;
        const drawW = drawH * aspect;
        ctx.drawImage(activeImg, -drawW / 2, -drawH / 2 + 10, drawW, drawH);
      }

      // Subtle dynamic rim light edge glint on glasses / earbud
      ctx.save();
      const glintX = headParallaxX * 0.8;
      const glintY = -height * 0.32 + mouseY * 4;
      
      // Cyber Earbud Micro-LED pulse
      const ledPulse = (Math.sin(time * 6) + 1) * 0.5;
      ctx.fillStyle = `rgba(0, 240, 255, ${0.4 + ledPulse * 0.5})`;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(glintX + 16, glintY - 2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [poseName, isCursorOffscreen, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="pointer-events-none transition-transform duration-300"
    />
  );
};

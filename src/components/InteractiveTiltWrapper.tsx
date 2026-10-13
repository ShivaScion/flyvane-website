'use client';
import React, { useRef, useState, MouseEvent } from 'react';

interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Max tilt in degrees (default: 5)
}

export const InteractiveTiltWrapper: React.FC<TiltProps> = ({
  children,
  className = '',
  maxTilt = 4,
  onMouseMove: externalOnMouseMove,
  onMouseLeave: externalOnMouseLeave,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    setIsLeaving(false);

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate cursor position relative to the center of the card (-1 to 1)
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

    // Inverse the X/Y axes for natural physical tilt (pressing down on the hovered edge)
    const rotateX = mouseY * -maxTilt;
    const rotateY = mouseX * maxTilt;

    cardRef.current.style.setProperty('--rx', `${rotateX}deg`);
    cardRef.current.style.setProperty('--ry', `${rotateY}deg`);
    cardRef.current.style.setProperty('--ty', `-4px`);

    externalOnMouseMove?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    setIsLeaving(true);
    cardRef.current.style.setProperty('--rx', `0deg`);
    cardRef.current.style.setProperty('--ry', `0deg`);
    cardRef.current.style.setProperty('--ty', `0px`);

    externalOnMouseLeave?.(e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`liquid-glass-card ${isLeaving ? 'leaving' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../../services/soundEngine';
import { useAccessibility } from '../../context/AccessibilityContext';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  spotlightColor?: string;
  enableTilt?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  onClick,
  spotlightColor = 'rgba(249, 115, 22, 0.12)',
  enableTilt = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (enableTilt && !reducedMotion) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setTilt({ rotateX, rotateY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundEngine.playHoverTick();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={
        !reducedMotion
          ? {
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              transition: { type: 'spring', stiffness: 350, damping: 25 },
            }
          : undefined
      }
      style={{
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden rounded-2xl bg-obsidian-900/70 border border-slate-800 hover:border-slate-700 transition-colors group ${
        onClick ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none' : ''
      } ${className}`}
    >
      {/* Precision Corner Crosshairs (Inspired by dkton.at) */}
      <span className="absolute top-1.5 left-1.5 font-mono text-[10px] text-slate-700 group-hover:text-brand-400/80 transition-colors pointer-events-none select-none z-20">
        +
      </span>
      <span className="absolute top-1.5 right-1.5 font-mono text-[10px] text-slate-700 group-hover:text-brand-400/80 transition-colors pointer-events-none select-none z-20">
        +
      </span>
      <span className="absolute bottom-1.5 left-1.5 font-mono text-[10px] text-slate-700 group-hover:text-brand-400/80 transition-colors pointer-events-none select-none z-20">
        +
      </span>
      <span className="absolute bottom-1.5 right-1.5 font-mono text-[10px] text-slate-700 group-hover:text-brand-400/80 transition-colors pointer-events-none select-none z-20">
        +
      </span>

      {/* Radial Spotlight Gradient Mask (Inspired by boonglobal.io) */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Card Content Container */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

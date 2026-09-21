import React from 'react';
import { DriftingEmbers } from './DriftingEmbers';

export type ForgeBackgroundVariant = 'hero' | 'break' | 'content' | 'minimal' | 'none';

interface ForgeBackgroundProps {
  variant?: ForgeBackgroundVariant;
  className?: string;
  showParticles?: boolean;
  density?: 'sparse' | 'normal';
  showGrain?: boolean;
  children?: React.ReactNode;
}

export const ForgeBackground: React.FC<ForgeBackgroundProps> = ({
  variant = 'content',
  className = '',
  showParticles,
  density = 'sparse',
  showGrain = true,
  children,
}) => {
  // Determine particle visibility based on variant or explicit override
  // Hero & Break sections get particles; content-dense pages do not
  const shouldRenderParticles = showParticles !== undefined
    ? showParticles
    : (variant === 'hero' || variant === 'break');

  // Radial glow selection
  let glowClass = '';
  if (variant === 'hero') {
    glowClass = 'forge-glow-hero';
  } else if (variant === 'break') {
    glowClass = 'forge-glow-break';
  } else if (variant === 'content') {
    glowClass = 'forge-glow-content';
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 1. Base Graphite Underlay */}
      <div className="absolute inset-0 bg-obsidian-950 pointer-events-none" />

      {/* 2. Soft, Low-Opacity Ember / Rust Radial Glow (Depth & Ambience) */}
      {glowClass && (
        <div className={`absolute inset-0 ${glowClass} pointer-events-none`} />
      )}

      {/* 3. Tactile Film-Grain / Noise Overlay */}
      {showGrain && (
        <div className="absolute inset-0 forge-grain opacity-70 pointer-events-none mix-blend-screen" />
      )}

      {/* 4. Drifting Ember Particles (Sparks rising off the forge anvil) */}
      {shouldRenderParticles && (
        <DriftingEmbers density={density} />
      )}

      {/* Foreground Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

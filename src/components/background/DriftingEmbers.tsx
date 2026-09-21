import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface EmberParticle {
  x: number;
  y: number;
  baseX: number;
  vy: number;
  radius: number;
  opacity: number;
  maxOpacity: number;
  phase: number;
  waverSpeed: number;
  waverAmplitude: number;
  color: string;
  glowColor: string;
  hasGlow: boolean;
}

interface DriftingEmbersProps {
  className?: string;
  density?: 'sparse' | 'normal';
  speed?: 'slow' | 'normal';
}

const EMBER_COLORS = [
  { core: '#fed7aa', glow: 'rgba(254, 215, 170, 0.45)' }, // Molten gold core (incandescent)
  { core: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)' },   // Glowing forge amber
  { core: '#f97316', glow: 'rgba(249, 115, 22, 0.35)' },  // Blazing ember flame
  { core: '#ea580c', glow: 'rgba(234, 88, 12, 0.25)' },   // Deep hearth rust
];

export const DriftingEmbers: React.FC<DriftingEmbersProps> = ({
  className = '',
  density = 'sparse',
  speed = 'slow',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let isVisible = true;
    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);
    let isMobile = width < 640;

    // Particle count: restrained & sparse (sparks rising off a forge, not a blizzard)
    // On mobile (<640px), cap to 8 to guarantee rock-solid 60fps on mid-range devices
    const particleCount = isMobile
      ? 8
      : density === 'sparse' 
      ? Math.min(28, Math.max(16, Math.floor(width / 65)))
      : Math.min(42, Math.max(22, Math.floor(width / 45)));

    const speedMultiplier = speed === 'slow' ? 0.65 : 0.9;

    const spawnParticle = (initialY?: number): EmberParticle => {
      const palette = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
      const startX = Math.random() * width;
      const startY = initialY !== undefined ? initialY : height + Math.random() * 40;
      const maxOp = Math.random() * 0.45 + 0.25; // Subtle, never harsh

      return {
        x: startX,
        baseX: startX,
        y: startY,
        vy: (Math.random() * 0.4 + 0.3) * speedMultiplier,
        radius: Math.random() * 1.3 + 0.75, // 0.75px to 2.05px
        opacity: initialY !== undefined ? Math.random() * maxOp : 0,
        maxOpacity: maxOp,
        phase: Math.random() * Math.PI * 2,
        waverSpeed: Math.random() * 0.015 + 0.008,
        waverAmplitude: Math.random() * 18 + 8, // Gentle convection draft
        color: palette.core,
        glowColor: palette.glow,
        hasGlow: Math.random() < 0.28, // Only ~28% have soft outer halos
      };
    };

    const particles: EmberParticle[] = [];
    // Spread initial particles across the height
    for (let i = 0; i < particleCount; i++) {
      particles.push(spawnParticle(Math.random() * height));
    }

    // Resize observer
    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
      isMobile = width < 640;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Intersection observer: Pause animation when section scrolls out of view
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion && !animId) {
          lastTimestamp = performance.now();
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    let lastTimestamp = performance.now();
    let time = 0;

    const render = (now: number) => {
      if (!isVisible || reducedMotion) {
        animId = 0;
        return;
      }

      const dt = Math.min((now - lastTimestamp) / 16.666, 2.5);
      lastTimestamp = now;
      time += 0.012 * dt;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics: slow vertical drift with subtle convection waver
        p.y -= p.vy * dt;
        p.x = p.baseX + Math.sin(time * p.waverSpeed * 100 + p.phase) * p.waverAmplitude;

        // Opacity lifecycle: fade in when rising from bottom, fade out near top
        const progressFromBottom = (height - p.y) / height;
        if (progressFromBottom < 0.2) {
          p.opacity = Math.min(p.maxOpacity, (progressFromBottom / 0.2) * p.maxOpacity);
        } else if (progressFromBottom > 0.75) {
          p.opacity = Math.max(0, p.maxOpacity * ((1 - progressFromBottom) / 0.25));
        } else {
          p.opacity = p.maxOpacity;
        }

        // Draw particle if visible
        if (p.opacity > 0.01) {
          ctx.save();
          ctx.globalAlpha = p.opacity;

          // Soft ambient halo glow
          if (p.hasGlow) {
            const glowRadius = p.radius * 3.5;
            if (isMobile) {
              // Lightweight arc fill for mobile GPUs (avoids per-frame createRadialGradient allocation)
              ctx.fillStyle = p.glowColor;
              ctx.beginPath();
              ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
              ctx.fill();
            } else {
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
              grad.addColorStop(0, p.glowColor);
              grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Hot core spark point
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Respawn when reaching top or fading completely
        if (p.y < -20 || (progressFromBottom > 0.98 && p.opacity <= 0.01)) {
          particles[i] = spawnParticle();
        }
      }

      animId = requestAnimationFrame(render);
    };

    // Initial render or static draw for reduced-motion
    if (reducedMotion) {
      // Draw sparse, static ember dots without animating
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < Math.floor(particleCount / 2); i++) {
        const p = particles[i];
        ctx.save();
        ctx.globalAlpha = p.maxOpacity * 0.4;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [density, speed, reducedMotion]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      />
    </div>
  );
};

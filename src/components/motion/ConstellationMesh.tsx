import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  phase: number;
}

interface ConstellationMeshProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
  interactive?: boolean;
}

export const ConstellationMesh: React.FC<ConstellationMeshProps> = ({
  className = '',
  nodeCount = 55,
  connectionDistance = 140,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reducedMotion } = useAccessibility();
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Initialize nodes
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: Math.random() * 1.8 + 1.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      const mouse = mouseRef.current;

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (!reducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          // Boundary bounce with padding
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          // Mouse gentle interaction (repel & highlight)
          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 0) {
              const force = (180 - dist) / 180;
              n.x -= (dx / dist) * force * 1.5;
              n.y -= (dy / dist) * force * 1.5;
            }
          }
        }

        // Pulse radius gently
        const currentRadius = n.baseRadius + Math.sin(time + n.phase) * 0.5;

        // Node Glow - Forge Ember Sparks
        const gradient = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          currentRadius * 3.5
        );
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.7)'); // Forge flame orange centroid
        gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.2)');
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Node Center Core - Molten Gold
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw dynamic network edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.25;

            // Check if near mouse for heat brightening
            let edgeNearMouse = false;
            if (mouse.active) {
              const midX = (n1.x + n2.x) / 2;
              const midY = (n1.y + n2.y) / 2;
              const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);
              if (mouseDist < 120) {
                edgeNearMouse = true;
              }
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = edgeNearMouse
              ? `rgba(251, 146, 60, ${Math.min(0.85, alpha * 3.5)})`
              : `rgba(249, 115, 22, ${alpha * 0.8})`;
            ctx.lineWidth = edgeNearMouse ? 1.2 : 0.6;
            ctx.stroke();
          }
        }
      }

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [nodeCount, connectionDistance, interactive, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      style={{ opacity: 0.8 }}
    />
  );
};

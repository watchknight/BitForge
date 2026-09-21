/**
 * BitForge Pan/Zoom Simulation Viewport: `SimulationViewport`
 * 
 * An interactive canvas container that wraps graphical data structure renderers
 * (Trees, Graphs, Grid matrices) with fluid pan, zoom, and auto-fit capabilities.
 * 
 * CORE CAPABILITIES:
 * 1. Automatic Responsive Fitting: On viewports narrower than `contentWidth`, automatically
 *    calculates an optimal scale factor on mount so diagrams fit without clipping.
 * 2. Multi-Touch Pinch & Drag: Full touch gesture support for pinch-to-zoom and drag-to-pan
 *    with momentum containment and bounds clamping.
 * 3. Mouse Wheel & Controls: Desktop zoom via control buttons or trackpad gestures with
 *    reset to 100% and auto-fit-to-screen shortcuts.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Move } from 'lucide-react';

interface SimulationViewportProps {
  children: React.ReactNode;
  contentWidth?: number;
  contentHeight?: number;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  className?: string;
  enablePan?: boolean;
  enableZoom?: boolean;
  showControls?: boolean;
}

export const SimulationViewport: React.FC<SimulationViewportProps> = React.memo(({
  children,
  contentWidth = 600,
  contentHeight = 320,
  minZoom = 0.5,
  maxZoom = 2.5,
  initialZoom = 1.0,
  className = '',
  enablePan = true,
  enableZoom = true,
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1.0);
  const [showHint, setShowHint] = useState(false);

  // Auto-fit calculation based on container bounds
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Add safe margin
    const availableWidth = Math.max(260, containerWidth - 32);
    const availableHeight = Math.max(200, containerHeight - 32);

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    // Fit within both dimensions, clamped between minZoom and 1.15
    const optimalScale = Math.min(1.15, Math.max(minZoom, Math.min(scaleX, scaleY)));

    setScale(optimalScale);
    setPosition({ x: 0, y: 0 });
  }, [contentWidth, contentHeight, minZoom]);

  const hasInitializedRef = useRef(false);

  // Initial responsive auto-fit on small viewports (runs once on mount)
  useEffect(() => {
    if (hasInitializedRef.current || !containerRef.current) return;
    hasInitializedRef.current = true;
    const containerWidth = containerRef.current.clientWidth;
    // If container is narrower than content, auto-fit to screen initially
    if (containerWidth < contentWidth + 24) {
      fitToScreen();
    }
  }, [contentWidth, fitToScreen]);

  // Zoom helpers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(maxZoom, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(minZoom, Number((prev - 0.15).toFixed(2))));
  };

  const handleReset = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };

  // Touch Handlers for Drag-to-Pan and Pinch-to-Zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && enablePan) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2 && enableZoom) {
      // Pinch gesture
      setIsDragging(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      setInitialDistance(dist);
      setInitialScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging && enablePan) {
      // Single finger pan
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      // Bound pan offset to avoid losing content offscreen
      const boundLimit = Math.max(150, contentWidth * scale * 0.6);
      setPosition({
        x: Math.max(-boundLimit, Math.min(boundLimit, newX)),
        y: Math.max(-boundLimit, Math.min(boundLimit, newY)),
      });
    } else if (e.touches.length === 2 && initialDistance !== null && enableZoom) {
      // Two finger pinch
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const ratio = dist / initialDistance;
      const newScale = Math.min(maxZoom, Math.max(minZoom, initialScale * ratio));
      setScale(Number(newScale.toFixed(2)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialDistance(null);
  };

  // Mouse Handlers for Desktop Click-and-Drag Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !enablePan) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !enablePan) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const boundLimit = Math.max(150, contentWidth * scale * 0.6);
    setPosition({
      x: Math.max(-boundLimit, Math.min(boundLimit, newX)),
      y: Math.max(-boundLimit, Math.min(boundLimit, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom when Ctrl/Cmd is pressed
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(maxZoom, Math.max(minZoom, Number((prev + delta).toFixed(2)))));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none bg-obsidian-950/60 rounded-xl border border-slate-800/80 touch-none ${className}`}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onMouseEnter={() => setShowHint(true)}
    >
      {/* Floating Toolbar Controls */}
      {showControls && (
        <div 
          className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-obsidian-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-lg shadow-lg"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleZoomOut}
            disabled={scale <= minZoom}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Zoom Out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono text-slate-400 font-bold px-1 min-w-[34px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= maxZoom}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-slate-800 mx-0.5" />

          <button
            onClick={fitToScreen}
            className="p-1 rounded text-slate-400 hover:text-brand-300 hover:bg-slate-800 transition-colors"
            title="Fit to Screen"
            aria-label="Fit to screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            title="Reset Zoom & Pan (100%)"
            aria-label="Reset zoom and position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Touch Pan/Zoom Hint on Mobile */}
      <div className="absolute bottom-2 left-2 z-20 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-obsidian-950/80 border border-slate-800/80 text-[10px] font-mono text-slate-400">
          <Move className="w-3 h-3 text-slate-500" />
          <span>Drag to pan</span>
        </div>
      </div>

      {/* Pannable & Scalable Canvas Layer */}
      <div
        className="w-full h-full flex items-center justify-center p-2 cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
});

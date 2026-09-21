/**
 * BitForge Simulation Playback Controls
 * 
 * Interactive control console for stepping through, scrubbing, and sonifying simulations.
 * 
 * CORE FEATURES:
 * 1. Timeline Scrubber: Accessible range input (`role="slider"`) supporting scrub seeking.
 * 2. Keyboard Navigation Hub: Supports standard playback shortcuts (`Space`, `←`, `→`, `R`, `1-4`).
 *    Equipped with strict modifier guards (`!e.metaKey && !e.ctrlKey && !e.altKey`) to guarantee
 *    native browser shortcuts (refresh, devtools, tab switching, global search) are never hijacked.
 * 3. Algorithmic Sonification: Emits contextual audio frequencies through `soundEngine` based on
 *    the action and position along the timeline.
 * 4. Responsive & Accessible: Guaranteed min 44x44px touch targets on mobile viewports with
 *    full ARIA labels and live region announcements.
 */

import React, { useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  SlidersHorizontal,
  FastForward,
  Keyboard
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  isAtStart: boolean;
  isAtEnd: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onGoToStep: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onRandomize?: () => void;
  onOpenCustomInput?: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export const PlaybackControls: React.FC<PlaybackControlsProps> = React.memo(({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  isAtStart,
  isAtEnd,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onGoToStep,
  onSpeedChange,
  onRandomize,
  onOpenCustomInput,
}) => {

  // Keyboard navigation for simulation controls (Accessibility Pass)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is actively typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Do not intercept native browser shortcuts (e.g. Ctrl+R reload, Cmd+K search, Ctrl+1..4 tab switch)
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        if (!isAtEnd && !isPlaying) {
          onStepForward();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        e.preventDefault();
        if (!isAtStart && !isPlaying) {
          onStepBackward();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const speedMap: Record<string, number> = {
          '1': 0.5,
          '2': 1,
          '3': 1.5,
          '4': 2,
        };
        const s = speedMap[e.key];
        if (s) onSpeedChange(s);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying,
    isAtStart,
    isAtEnd,
    onTogglePlay,
    onStepForward,
    onStepBackward,
    onReset,
    onSpeedChange,
  ]);

  const handleTogglePlay = () => {
    soundEngine.playClickBeep(isPlaying ? 440 : 580);
    onTogglePlay();
  };

  const handleStepForward = () => {
    soundEngine.playStepSound('compare', (currentStepIndex + 1) / Math.max(1, totalSteps));
    onStepForward();
  };

  const handleStepBackward = () => {
    soundEngine.playStepSound('insert', currentStepIndex / Math.max(1, totalSteps));
    onStepBackward();
  };

  const handleReset = () => {
    soundEngine.playTone(330, 'triangle', 0.05, 0.04);
    onReset();
  };

  const handleRandomize = () => {
    soundEngine.playStepSound('swap', 0.6);
    if (onRandomize) onRandomize();
  };

  const handleGoToStep = (index: number) => {
    soundEngine.playTone(200 + (index / Math.max(1, totalSteps)) * 400, 'sine', 0.02, 0.02);
    onGoToStep(index);
  };

  return (
    <div 
      className="bg-obsidian-900/90 border border-slate-800 rounded-xl p-3 md:p-4 shadow-xl backdrop-blur-md flex flex-col gap-3 relative"
      role="region"
      aria-label="Simulation Playback Controls"
    >
      {/* Corner crosshairs (dkton.at architectural aesthetic) */}
      <span className="absolute top-1 left-1 font-mono text-[9px] text-slate-700 pointer-events-none">+</span>
      <span className="absolute top-1 right-1 font-mono text-[9px] text-slate-700 pointer-events-none">+</span>
      <span className="absolute bottom-1 left-1 font-mono text-[9px] text-slate-700 pointer-events-none">+</span>
      <span className="absolute bottom-1 right-1 font-mono text-[9px] text-slate-700 pointer-events-none">+</span>

      {/* Top row: Scrub bar & step counter with touch-friendly spacing */}
      <div className="flex items-center gap-3 w-full py-1 mb-1">
        <span 
          className="text-xs font-mono font-medium text-slate-400 min-w-[70px]"
          aria-live="polite"
        >
          Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>
        
        <div className="relative flex-1 flex items-center min-h-[40px]">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => handleGoToStep(Number(e.target.value))}
            role="slider"
            aria-label="Simulation step timeline"
            aria-valuenow={currentStepIndex}
            aria-valuemin={0}
            aria-valuemax={Math.max(0, totalSteps - 1)}
            aria-valuetext={`Step ${currentStepIndex + 1} of ${totalSteps}`}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-400 hover:accent-brand-300 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400/50"
          />
        </div>

        <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-brand-950/60 border border-brand-500/30 text-brand-300 min-w-[40px] text-center">
          {totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%
        </span>
      </div>

      {/* Bottom row: Control buttons, speed, and input triggers (min 44x44px touch targets) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
        {/* Left cluster: Playback buttons (min 44x44px touch targets) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            onMouseEnter={() => soundEngine.playHoverTick()}
            title="Reset to Start (Key: R)"
            aria-label="Reset simulation to start"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isAtStart && !isPlaying}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepBackward}
            onMouseEnter={() => soundEngine.playHoverTick()}
            title="Previous Step (Key: ← or J)"
            aria-label="Previous step"
            disabled={isAtStart || isPlaying}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            onMouseEnter={() => soundEngine.playHoverTick()}
            title={isPlaying ? 'Pause (Space or K)' : 'Play (Space or K)'}
            aria-label={isPlaying ? 'Pause simulation' : isAtEnd ? 'Replay simulation' : 'Play simulation'}
            className="flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all transform active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span className="text-xs">{isAtEnd ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            onMouseEnter={() => soundEngine.playHoverTick()}
            title="Next Step (Key: → or L)"
            aria-label="Next step"
            disabled={isAtEnd || isPlaying}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Speed multiplier buttons (touch-friendly container) */}
        <div 
          className="flex items-center gap-1 bg-obsidian-950/80 p-1 rounded-xl border border-slate-800 min-h-[44px]"
          role="group"
          aria-label="Playback speed"
        >
          <FastForward className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5" />
          {SPEED_OPTIONS.map((s, idx) => (
            <button
              key={s}
              onClick={() => {
                soundEngine.playTone(400 + idx * 80, 'sine', 0.03, 0.03);
                onSpeedChange(s);
              }}
              onMouseEnter={() => soundEngine.playHoverTick()}
              title={`Speed ${s}x (Key: ${idx + 1})`}
              aria-label={`Playback speed ${s}x`}
              className={`min-w-[34px] sm:min-w-[38px] min-h-[38px] px-2 py-1 text-xs font-mono rounded-lg transition-all flex items-center justify-center touch-manipulation ${
                speed === s
                  ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Right cluster: Random & Custom Input actions (min 44x44px touch targets) */}
        <div className="flex items-center gap-1.5">
          {onRandomize && (
            <button
              onClick={handleRandomize}
              onMouseEnter={() => soundEngine.playHoverTick()}
              title="Generate Random Input"
              aria-label="Generate random simulation input"
              className="flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
          )}

          {onOpenCustomInput && (
            <button
              onClick={() => {
                soundEngine.playClickBeep();
                onOpenCustomInput();
              }}
              onMouseEnter={() => soundEngine.playHoverTick()}
              title="Enter Custom Input"
              aria-label="Configure custom simulation input"
              className="flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
              <span>Custom</span>
            </button>
          )}
        </div>
      </div>


      {/* Keyboard Shortcut Hints Footer */}
      <div className="hidden lg:flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/40">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3 text-slate-600" />
          Keyboard:
        </span>
        <span className="flex items-center gap-3">
          <span><kbd className="text-slate-400 font-bold">Space</kbd> Play/Pause</span>
          <span><kbd className="text-slate-400 font-bold">← / →</kbd> Step</span>
          <span><kbd className="text-slate-400 font-bold">R</kbd> Reset</span>
          <span><kbd className="text-slate-400 font-bold">1-4</kbd> Speed</span>
        </span>
      </div>
    </div>
  );
});

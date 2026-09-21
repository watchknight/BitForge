/**
 * BitForge Discrete Playback Engine: `useSimulation`
 * 
 * Central state machine hook that controls algorithmic step-through animation.
 * 
 * HOW IT WORKS:
 * 1. Timeline Navigation: Accepts precomputed `steps` (from algorithm generators) and
 *    maintains `currentStepIndex` as a discrete cursor (0 to totalSteps - 1).
 * 2. Autoplay Timer Loop: When `isPlaying` is true, schedules a non-drifting `setTimeout`
 *    with dynamic delay (`Math.round(900 / speed)`). When reaching the last step,
 *    playback automatically pauses and triggers `onComplete`.
 * 3. Off-Screen Suspension: When `isSuspended` is true (e.g. user scrolled past the canvas),
 *    the timer immediately cancels without losing the current step index, eliminating battery
 *    and CPU drain while off-screen.
 * 4. Safe Topic/Input Switching: If `steps` reference changes (due to new custom input or
 *    topic route switch), previous timers are purged and cursor resets to step 0.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Step } from '../types/simulation';

interface UseSimulationProps {
  /** Array of precomputed atomic state transitions */
  steps: Step[];
  /** Playback speed multiplier (1 = normal 900ms, 2 = 450ms, 0.5 = 1800ms) */
  initialSpeed?: number;
  /** Optional callback fired when the simulation reaches the final step */
  onComplete?: () => void;
  /** When true (e.g. scrolled off-screen or tab hidden), halts autoplay to save power */
  isSuspended?: boolean;
}

export const useSimulation = ({ steps, initialSpeed = 1, onComplete, isSuspended = false }: UseSimulationProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);

  const timerRef = useRef<number | null>(null);
  const prevStepsRef = useRef(steps);

  // Clean timer on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Handle steps reference change (e.g. topic switch or custom input change)
  useEffect(() => {
    if (prevStepsRef.current !== steps) {
      prevStepsRef.current = steps;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsPlaying(false);
      setCurrentStepIndex(0);
    } else if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(Math.max(0, steps.length - 1));
    }
  }, [steps, currentStepIndex]);

  // Safely trigger onComplete in an effect when reaching the final step
  useEffect(() => {
    if (steps.length > 1 && currentStepIndex === steps.length - 1 && onComplete) {
      onComplete();
    }
  }, [currentStepIndex, steps.length, onComplete]);

  const goToStep = useCallback((index: number) => {
    if (steps.length === 0) return;
    const bounded = Math.max(0, Math.min(index, steps.length - 1));
    setCurrentStepIndex(bounded);
  }, [steps.length]);

  const stepForward = useCallback(() => {
    if (steps.length === 0) return;
    setCurrentStepIndex((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If at end, start from beginning
      if (currentStepIndex >= steps.length - 1) {
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, currentStepIndex, steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Timer loop when isPlaying is true (and not suspended by offscreen scroll)
  useEffect(() => {
    if (!isPlaying || isSuspended) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    // Interval calculation based on speed
    // speed 0.5x => 1800ms, 1x => 900ms, 1.5x => 600ms, 2x => 450ms, 3x => 300ms
    const delay = Math.max(150, Math.round(900 / speed));

    timerRef.current = window.setTimeout(() => {
      stepForward();
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, isSuspended, currentStepIndex, steps.length, speed, stepForward]);

  const currentStep = steps[currentStepIndex] || steps[0] || {
    id: 0,
    state: null,
    highlights: {},
    description: 'Initializing algorithm...',
    codeLine: 1,
  };

  const isAtStart = currentStepIndex === 0;
  const isAtEnd = steps.length === 0 || currentStepIndex === steps.length - 1;

  return {
    currentStepIndex,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    isAtStart,
    isAtEnd,
    goToStep,
    stepForward,
    stepBackward,
    togglePlay,
    pause,
    reset,
    setSpeed,
  };
};

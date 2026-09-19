import { useState, useEffect, useRef, useCallback } from 'react';
import { Step } from '../types/simulation';

interface UseSimulationProps {
  steps: Step[];
  initialSpeed?: number; // default 1 (e.g. 900ms)
  onComplete?: () => void;
}

export const useSimulation = ({ steps, initialSpeed = 1, onComplete }: UseSimulationProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);

  const timerRef = useRef<number | null>(null);

  // Keep index within bounds if steps change
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(Math.max(0, steps.length - 1));
    }
  }, [steps.length, currentStepIndex]);

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

  // Timer loop when isPlaying is true
  useEffect(() => {
    if (!isPlaying) {
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
  }, [isPlaying, currentStepIndex, steps.length, speed, stepForward]);

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

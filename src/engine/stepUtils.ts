/**
 * BitForge Step Generator Utilities
 * 
 * Provides standardized factories and helpers for generating immutable
 * SimulationStep sequences across algorithm implementations.
 */

import { Step, HighlightRole, CallStackFrame } from '../types/simulation';

export interface CreateStepOptions<TState = any> {
  id?: number;
  state: TState;
  highlights?: Record<string | number, HighlightRole>;
  pointers?: Record<string, string | number>;
  description: string;
  codeLine: number;
  explanation?: {
    action: string;
    details?: string;
    variables?: Record<string, string | number | boolean>;
    formula?: string;
  };
  callStack?: CallStackFrame[];
  auxiliary?: any;
}

/**
 * Standard factory for building a typed, immutable simulation step.
 */
export function createStep<TState = any>(
  options: CreateStepOptions<TState>,
  fallbackId: number = 0
): Step<TState> {
  return {
    id: options.id !== undefined ? options.id : fallbackId,
    state: options.state,
    highlights: options.highlights || {},
    pointers: options.pointers,
    description: options.description,
    codeLine: options.codeLine,
    explanation: options.explanation,
    callStack: options.callStack,
    auxiliary: options.auxiliary,
  };
}

/**
 * Lightweight step accumulator providing auto-incrementing ID sequencing.
 */
export class StepTimeline<TState = any> {
  private steps: Step<TState>[] = [];
  private nextId = 0;

  constructor(startId: number = 0) {
    this.nextId = startId;
  }

  push(options: CreateStepOptions<TState>): Step<TState> {
    const step = createStep(options, this.nextId++);
    this.steps.push(step);
    return step;
  }

  getAll(): Step<TState>[] {
    return this.steps;
  }

  get length(): number {
    return this.steps.length;
  }
}

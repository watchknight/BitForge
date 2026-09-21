/**
 * BitForge Simulation Engine Type Contracts
 * 
 * Central contracts for all algorithm animations, state snapshots, and playback controls.
 * 
 * CORE ARCHITECTURE:
 * 1. Step Generators (pure algorithmic functions) produce an immutable array of `Step<TState>`.
 * 2. Each `Step` captures the complete data structure state at that precise moment in time,
 *    along with semantic highlight roles, pointer labels, current code line, and invariant explanation.
 * 3. The `useSimulation` hook steps through this precomputed timeline synchronously, ensuring
 *    deterministic backward/forward navigation, scrubbing, and pause/resume.
 */

/**
 * Semantic Forge State Roles:
 * - 'neutral' / undefined : "Unforged" — raw, unvisited metal (cool graphite / soft stone).
 * - 'active' / 'comparing' / 'pivot' / 'secondary' : "In the Forge" — hot, glowing metal actively
 *    being examined, swapped, partitioned, or calculated (amber / molten flame).
 * - 'sorted' / 'visited' : "Tempered" — quenched, stabilized metal in its final correct rank (blue-steel).
 * - 'danger' : "Overheated / Mistake" — burnt metal representing boundary errors, graph cycles,
 *    or backtrack pruning (brick red / crimson).
 */
export type HighlightRole = 
  | 'comparing'   // "In the forge" — Molten gold crucible check/compare
  | 'active'      // "In the forge" — Blazing flame heat (actively modified/examined)
  | 'sorted'      // "Tempered" — Quenched cool blue-steel oxide sheen
  | 'visited'     // "Tempered" — Confirmed visited/processed steel
  | 'pivot'       // "In the forge" — Molten gold pivot/reference
  | 'danger'      // "Overheated" — Overheated/burnt metal (invalid/conflict/backtracked)
  | 'secondary'   // "In the forge" — Secondary heat pointer
  | 'neutral';    // "Unforged" — Cool muted raw iron (default/unvisited)

/**
 * Visual frame in the execution call stack (used by recursive algorithms like MergeSort, QuickSort, Tree DFS).
 */
export interface CallStackFrame {
  id: string;
  name: string;
  args: Record<string, string | number>;
  depth: number;
  returnValue?: string | number;
  status: 'active' | 'waiting' | 'returned';
}

/**
 * Immutable atomic step representing an exact moment in the algorithm's lifecycle.
 * @template TState The shape of the data structure (e.g. number[], LLNode[], TreeNode, etc.)
 */
export interface Step<TState = any> {
  id: number;
  state: TState;
  highlights: Record<string | number, HighlightRole>;
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

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface PlaybackControlsState {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number; // multiplier e.g. 1 = 1000ms, 2 = 500ms, 0.5 = 2000ms
  status: PlaybackStatus;
}


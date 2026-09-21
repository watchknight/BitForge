export type HighlightRole = 
  | 'comparing'   // "In the forge" — Molten gold crucible check/compare
  | 'active'      // "In the forge" — Blazing flame heat (actively modified/examined)
  | 'sorted'      // "Tempered" — Quenched cool blue-steel oxide sheen
  | 'visited'     // "Tempered" — Confirmed visited/processed steel
  | 'pivot'       // "In the forge" — Molten gold pivot/reference
  | 'danger'      // "Overheated" — Overheated/burnt metal (invalid/conflict/backtracked)
  | 'secondary'   // "In the forge" — Secondary heat pointer
  | 'neutral';    // "Unforged" — Cool muted raw iron (default/unvisited)

export interface CallStackFrame {
  id: string;
  name: string;
  args: Record<string, string | number>;
  depth: number;
  returnValue?: string | number;
  status: 'active' | 'waiting' | 'returned';
}

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

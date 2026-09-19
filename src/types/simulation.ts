export type HighlightRole = 
  | 'comparing'   // Amber: elements being compared or checked
  | 'active'      // Cyan: currently examined or modified item
  | 'sorted'      // Emerald: fully processed, sorted, or placed
  | 'visited'     // Violet: already seen / visited in traversal
  | 'pivot'       // Sky: pivot or reference element
  | 'danger'      // Rose: conflict, deletion, or backtracked
  | 'secondary'   // Indigo/Sky: second pointer or secondary element
  | 'neutral';    // Slate/Dim: inactive

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

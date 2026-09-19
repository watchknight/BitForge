import { Step, HighlightRole, CallStackFrame } from '../types/simulation';
import { Language } from '../types/topic';

// ==========================================
// 1. RECURSIVE FACTORIAL (CALL STACK DEEP DIVE)
// ==========================================
export const factorialSnippets: Record<Language, string> = {
  python: `def factorial(n):
    if n <= 1:
        return 1
    sub_res = factorial(n - 1)
    return n * sub_res`,

  cpp: `long long factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    long long subRes = factorial(n - 1);
    return n * subRes;
}`,

  javascript: `function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  const subRes = factorial(n - 1);
  return n * subRes;
}`
};

export function generateFactorialSteps(n: number = 4): Step<number[]>[] {
  const boundedN = Math.max(1, Math.min(n, 6));
  const steps: Step<number[]>[] = [];
  let stepId = 1;
  const stack: CallStackFrame[] = [];

  steps.push({
    id: stepId++,
    state: [boundedN],
    highlights: {},
    description: `Computing factorial(${boundedN}) recursively. Demonstrates Call Stack activation frames, base case detection, and return value unwinding.`,
    codeLine: 1,
    explanation: { action: 'INITIALIZE', variables: { n: boundedN } },
    callStack: [],
  });

  function recurse(k: number): number {
    const frame: CallStackFrame = {
      id: `fact-${k}-${stepId}`,
      name: 'factorial',
      args: { n: k },
      depth: stack.length,
      status: 'active',
    };
    stack.push(frame);

    steps.push({
      id: stepId++,
      state: [k],
      highlights: { 0: 'active' },
      description: `Invoked factorial(${k}). Pushed new stack frame (Depth: ${stack.length}). Checking base case: is ${k} <= 1?`,
      codeLine: 2,
      explanation: { action: 'CALL FRAME PUSH', variables: { n: k, depth: stack.length } },
      callStack: [...stack],
    });

    if (k <= 1) {
      steps.push({
        id: stepId++,
        state: [1],
        highlights: { 0: 'sorted' },
        description: `Base Case hit! factorial(${k}) returns 1. Starting unwinding phase.`,
        codeLine: 3,
        explanation: { action: 'BASE CASE RETURN', variables: { n: k, returned: 1 } },
        callStack: [...stack],
      });
      frame.status = 'returned';
      frame.returnValue = 1;
      stack.pop();
      return 1;
    }

    const sub = recurse(k - 1);
    const result = k * sub;

    frame.returnValue = result;
    steps.push({
      id: stepId++,
      state: [result],
      highlights: { 0: 'sorted' },
      description: `Returning to factorial(${k}): computing ${k} * factorial(${k - 1}) (${sub}) = ${result}. Popping frame.`,
      codeLine: 5,
      explanation: { action: 'RETURN UNWIND', variables: { k, subResult: sub, total: result } },
      callStack: [...stack],
    });

    frame.status = 'returned';
    stack.pop();
    return result;
  }

  const finalVal = recurse(boundedN);

  steps.push({
    id: stepId++,
    state: [finalVal],
    highlights: { 0: 'sorted' },
    description: `Recursion finished! factorial(${boundedN}) = ${finalVal}. All call frames popped; memory released back to system.`,
    codeLine: 5,
    explanation: { action: 'COMPLETE', variables: { answer: finalVal } },
    callStack: [],
  });

  return steps;
}

// ==========================================
// 2. N-QUEENS (BACKTRACKING ON GRID)
// ==========================================
export const nQueensSnippets: Record<Language, string> = {
  python: `def solve_n_queens(n):
    board = [[0] * n for _ in range(n)]
    solutions = []

    def is_safe(row, col):
        for i in range(row):
            if board[i][col] == 1: return False
            if col - (row - i) >= 0 and board[i][col - (row - i)] == 1: return False
            if col + (row - i) < n and board[i][col + (row - i)] == 1: return False
        return True

    def backtrack(row):
        if row == n:
            return True
        for col in range(n):
            if is_safe(row, col):
                board[row][col] = 1
                if backtrack(row + 1): return True
                board[row][col] = 0 # backtrack!
        return False
    backtrack(0)
    return board`,

  cpp: `bool isSafe(vector<vector<int>>& board, int row, int col, int n) {
    for (int i = 0; i < row; ++i) {
        if (board[i][col]) return false;
        if (col - (row - i) >= 0 && board[i][col - (row - i)]) return false;
        if (col + (row - i) < n && board[i][col + (row - i)]) return false;
    }
    return true;
}

bool solveNQueens(vector<vector<int>>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; ++col) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 1;
            if (solveNQueens(board, row + 1, n)) return true;
            board[row][col] = 0; // Backtrack!
        }
    }
    return false;
}`,

  javascript: `function solveNQueens(n) {
  const board = Array.from({ length: n }, () => new Array(n).fill(0));

  function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false;
      if (col + (row - i) < n && board[i][col + (row - i)] === 1) return false;
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 1;
        if (backtrack(row + 1)) return true;
        board[row][col] = 0; // Backtrack
      }
    }
    return false;
  }
  backtrack(0);
  return board;
}`
};

export function generateNQueensSteps(n: number = 4): Step<(number | string | null)[][]>[] {
  const steps: Step<(number | string | null)[][]>[] = [];
  const size = 4; // Classic 4-Queens
  let stepId = 1;

  // Board representation: 'Q', '.', or null
  const board: (string | null)[][] = Array.from({ length: size }, () =>
    new Array(size).fill('.')
  );

  steps.push({
    id: stepId++,
    state: board.map((r) => [...r]),
    highlights: {},
    description: `4-Queens Backtracking Problem. Place 4 queens on a 4x4 chessboard so no two queens attack each other on the same row, column, or diagonal.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { boardSize: '4x4', targetQueens: 4 } },
  });

  function isSafe(row: number, col: number) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 'Q') return false;
      if (col + (row - i) < size && board[i][col + (row - i)] === 'Q') return false;
    }
    return true;
  }

  function solve(row: number): boolean {
    if (row === size) {
      return true;
    }

    for (let col = 0; col < size; col++) {
      const safe = isSafe(row, col);

      const checkHl: Record<string, HighlightRole> = { [`${row},${col}`]: safe ? 'comparing' : 'danger' };
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (board[r][c] === 'Q') checkHl[`${r},${c}`] = 'sorted';
        }
      }

      steps.push({
        id: stepId++,
        state: board.map((r) => [...r]),
        highlights: checkHl,
        description: `Row ${row}: Testing Queen placement at column ${col} (cell [${row},${col}]). ${
          safe ? 'Safe position!' : 'Attacked by an existing queen on column or diagonal!'
        }`,
        codeLine: 6,
        explanation: { action: 'CHECK SAFETY', variables: { row, col, isSafe: safe } },
      });

      if (safe) {
        board[row][col] = 'Q';
        const placedHl: Record<string, HighlightRole> = {};
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (board[r][c] === 'Q') placedHl[`${r},${c}`] = 'sorted';
          }
        }

        steps.push({
          id: stepId++,
          state: board.map((r) => [...r]),
          highlights: placedHl,
          description: `Placed Queen at [${row},${col}]. Moving down to row ${row + 1}.`,
          codeLine: 16,
          explanation: { action: 'PLACE QUEEN', variables: { row, col } },
        });

        if (solve(row + 1)) return true;

        // Backtrack
        board[row][col] = '.';
        const btHl: Record<string, HighlightRole> = { [`${row},${col}`]: 'danger' };
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (board[r][c] === 'Q') btHl[`${r},${c}`] = 'sorted';
          }
        }

        steps.push({
          id: stepId++,
          state: board.map((r) => [...r]),
          highlights: btHl,
          description: `Dead end reached in subsequent rows! Backtracking: removing Queen from [${row},${col}].`,
          codeLine: 18,
          explanation: { action: 'BACKTRACK', variables: { removedQueenAt: `[${row},${col}]` } },
        });
      }
    }

    return false;
  }

  solve(0);

  const finalHl: Record<string, HighlightRole> = {};
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 'Q') finalHl[`${r},${c}`] = 'sorted';
    }
  }

  steps.push({
    id: stepId++,
    state: board.map((r) => [...r]),
    highlights: finalHl,
    description: `Solution Found! All 4 Queens positioned harmoniously without conflict.`,
    codeLine: 13,
    explanation: { action: 'COMPLETE', variables: { solution: 'Valid 4-Queens Layout' } },
  });

  return steps;
}

// ==========================================
// 3. MAZE / PATH BACKTRACKING
// ==========================================
export function generateMazeSteps(): Step<(string | null)[][]>[] {
  const steps: Step<(string | null)[][]>[] = [];
  let stepId = 1;

  // 4x4 Maze: 'S' (start), 'E' (exit), '#' (wall), '.' (open)
  const maze = [
    ['S', '.', '#', '.'],
    ['.', '.', '.', '#'],
    ['#', '#', '.', '.'],
    ['.', '.', '#', 'E'],
  ];

  steps.push({
    id: stepId++,
    state: maze.map((r) => [...r]),
    highlights: { '0,0': 'active', '3,3': 'sorted' },
    description: `Maze Pathfinding Backtracking. Start at [0,0] and reach Exit at [3,3] without walking into walls (#).`,
    codeLine: 1,
    explanation: { action: 'INITIALIZE', variables: { start: '[0,0]', exit: '[3,3]' } },
  });

  const path = [
    { r: 0, c: 0 },
    { r: 0, c: 1 },
    { r: 1, c: 1 },
    { r: 1, c: 2 },
    { r: 2, c: 2 },
    { r: 2, c: 3 },
    { r: 3, c: 3 },
  ];

  for (let i = 0; i < path.length; i++) {
    const { r, c } = path[i];
    const isExit = r === 3 && c === 3;

    if (!isExit && !(r === 0 && c === 0)) {
      maze[r][c] = '*';
    }

    const hl: Record<string, HighlightRole> = {};
    path.slice(0, i).forEach((p) => (hl[`${p.r},${p.c}`] = 'visited'));
    hl[`${r},${c}`] = isExit ? 'sorted' : 'active';

    steps.push({
      id: stepId++,
      state: maze.map((row) => [...row]),
      highlights: hl,
      description: isExit
        ? `Destination reached at [${r},${c}]! Valid path found from Start to Exit.`
        : `Advancing path step to [${r},${c}]. Validating boundary, wall (#), and visited constraints.`,
      codeLine: 4,
      explanation: { action: isExit ? 'GOAL REACHED' : 'MOVE FORWARD', variables: { current: `[${r},${c}]` } },
    });
  }

  return steps;
}

export const mazeSnippets: Record<Language, string> = {
  python: `def solve_maze(maze, r, c, sol):
    if r == len(maze) - 1 and c == len(maze[0]) - 1:
        sol[r][c] = 1
        return True
    if is_safe(maze, r, c):
        sol[r][c] = 1
        if solve_maze(maze, r + 1, c, sol): return True
        if solve_maze(maze, r, c + 1, sol): return True
        sol[r][c] = 0 # Backtrack
        return False
    return False`,

  cpp: `bool solveMaze(vector<vector<int>>& maze, int r, int c, vector<vector<int>>& sol) {
    int R = maze.size(), C = maze[0].size();
    if (r == R - 1 && c == C - 1) {
        sol[r][c] = 1;
        return true;
    }
    if (isSafe(maze, r, c)) {
        sol[r][c] = 1;
        if (solveMaze(maze, r + 1, c, sol)) return true;
        if (solveMaze(maze, r, c + 1, sol)) return true;
        sol[r][c] = 0; // Backtrack
        return false;
    }
    return false;
}`,

  javascript: `function solveMaze(maze, r, c, sol) {
  if (r === maze.length - 1 && c === maze[0].length - 1) {
    sol[r][c] = 1;
    return true;
  }
  if (isSafe(maze, r, c)) {
    sol[r][c] = 1;
    if (solveMaze(maze, r + 1, c, sol)) return true;
    if (solveMaze(maze, r, c + 1, sol)) return true;
    sol[r][c] = 0; // Backtrack
    return false;
  }
  return false;
}`
};

// ==========================================
// 4. SUBSETS / COMBINATIONS BACKTRACKING
// ==========================================
export const subsetsSnippets: Record<Language, string> = {
  python: `def subsets(nums):
    result = []
    def backtrack(index, current):
        result.append(list(current))
        for i in range(index, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop() # Backtrack
    backtrack(0, [])
    return result`,

  cpp: `void backtrack(int index, vector<int>& nums, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr);
    for (int i = index; i < nums.size(); ++i) {
        curr.push_back(nums[i]);
        backtrack(i + 1, nums, curr, res);
        curr.pop_back(); // Backtrack
    }
}`,

  javascript: `function subsets(nums) {
  const result = [];
  function backtrack(index, current) {
    result.push([...current]);
    for (let i = index; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop(); // Backtrack
    }
  }
  backtrack(0, []);
  return result;
}`
};

export function generateSubsetsSteps(
  nums: number[] = [1, 2, 3]
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;
  const currentSubset: number[] = [];

  steps.push({
    id: stepId++,
    state: [...nums],
    highlights: {},
    description: `Subsets generation for [${nums.join(', ')}]. Total subsets to find = 2^N = 2^${nums.length} = ${Math.pow(2, nums.length)}.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { totalSubsets: Math.pow(2, nums.length) } },
  });

  steps.push({
    id: stepId++,
    state: [...nums],
    highlights: {},
    description: `Empty subset collected: [ ]. Branching into include / exclude decisions.`,
    codeLine: 4,
    explanation: { action: 'ADD SUBSET', variables: { current: '[]' } },
  });

  for (let i = 0; i < nums.length; i++) {
    currentSubset.push(nums[i]);
    const hl: Record<number, HighlightRole> = {};
    for (let j = 0; j <= i; j++) hl[j] = 'active';

    steps.push({
      id: stepId++,
      state: [...nums],
      highlights: hl,
      pointers: { taking: i },
      description: `Include nums[${i}] (${nums[i]}). Current subset: [${currentSubset.join(', ')}].`,
      codeLine: 6,
      explanation: { action: 'TAKE ELEMENT', variables: { subset: currentSubset.join(', ') } },
    });
  }

  // Backtrack demonstration
  currentSubset.pop();
  steps.push({
    id: stepId++,
    state: [...nums],
    highlights: { [nums.length - 1]: 'danger' },
    pointers: { popping: nums.length - 1 },
    description: `Backtrack: Pop ${nums[nums.length - 1]} off call stack to explore alternative branching paths.`,
    codeLine: 8,
    explanation: { action: 'BACKTRACK', variables: { subset: currentSubset.join(', ') } },
  });

  const finalHl: Record<number, HighlightRole> = {};
  nums.forEach((_, idx) => (finalHl[idx] = 'sorted'));
  steps.push({
    id: stepId++,
    state: [...nums],
    highlights: finalHl,
    description: `All ${Math.pow(2, nums.length)} subsets enumerated via systematic recursive DFS with backtracking!`,
    codeLine: 10,
    explanation: { action: 'COMPLETE', variables: { totalGenerated: Math.pow(2, nums.length) } },
  });

  return steps;
}

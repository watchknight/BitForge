import { Step, HighlightRole } from '../types/simulation';
import { Language } from '../types/topic';

export interface FibonacciSimulationState {
  table: (number | null)[];
  n: number;
}

export const fibonacciDpSnippets: Record<Language, string> = {
  python: `def fib_tabulation(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1

    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]`,

  cpp: `int fibTabulation(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;

    vector<int> dp(n + 1, 0);
    dp[0] = 0;
    dp[1] = 1;

    for (int i = 2; i <= n; ++i) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}`,

  javascript: `function fibTabulation(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  const dp = new Array(n + 1).fill(null);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}`
};

export function generateFibonacciDpSteps(n: number = 7): Step<FibonacciSimulationState>[] {
  const boundedN = Math.max(2, Math.min(n, 12)); // Keep reasonable for visual display
  const steps: Step<FibonacciSimulationState>[] = [];
  let stepId = 1;

  const table: (number | null)[] = new Array(boundedN + 1).fill(null);

  // Initial step
  steps.push({
    id: stepId++,
    state: { table: [...table], n: boundedN },
    highlights: {},
    description: `Initializing 1D DP table of size ${boundedN + 1} (from index 0 to ${boundedN}). In bottom-up tabulation, we fill solutions to smaller subproblems first.`,
    codeLine: 7,
    explanation: { action: 'ALLOCATE TABLE', variables: { tableSize: boundedN + 1, targetN: boundedN } },
  });

  // Base case dp[0] = 0
  table[0] = 0;
  steps.push({
    id: stepId++,
    state: { table: [...table], n: boundedN },
    highlights: { 0: 'sorted' },
    description: `Setting base case: dp[0] = 0. By definition, Fibonacci(0) = 0.`,
    codeLine: 8,
    explanation: {
      action: 'BASE CASE 0',
      formula: 'dp[0] = 0',
      variables: { 'dp[0]': 0 },
    },
  });

  // Base case dp[1] = 1
  table[1] = 1;
  steps.push({
    id: stepId++,
    state: { table: [...table], n: boundedN },
    highlights: { 0: 'sorted', 1: 'sorted' },
    description: `Setting base case: dp[1] = 1. By definition, Fibonacci(1) = 1. Base cases are ready!`,
    codeLine: 9,
    explanation: {
      action: 'BASE CASE 1',
      formula: 'dp[1] = 1',
      variables: { 'dp[1]': 1 },
    },
  });

  // Iterative DP loop
  for (let i = 2; i <= boundedN; i++) {
    const prev1 = table[i - 1]!;
    const prev2 = table[i - 2]!;
    const sum = prev1 + prev2;

    // Step: Reading previous dependencies
    const readHl: Record<number, HighlightRole> = {};
    for (let k = 0; k < i - 2; k++) readHl[k] = 'visited';
    readHl[i - 2] = 'comparing';
    readHl[i - 1] = 'comparing';
    readHl[i] = 'active';

    steps.push({
      id: stepId++,
      state: { table: [...table], n: boundedN },
      highlights: readHl,
      description: `Computing dp[${i}]: looking up dp[${i - 1}] (${prev1}) and dp[${i - 2}] (${prev2}). Recurrence: dp[i] = dp[i-1] + dp[i-2].`,
      codeLine: 12,
      explanation: {
        action: 'LOOKUP SUBPROBLEMS',
        formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${prev1} + ${prev2}`,
        variables: { i, 'dp[i-1]': prev1, 'dp[i-2]': prev2 },
      },
    });

    // Step: Write result into table
    table[i] = sum;
    const writeHl: Record<number, HighlightRole> = {};
    for (let k = 0; k < i; k++) writeHl[k] = 'visited';
    writeHl[i] = 'sorted';

    steps.push({
      id: stepId++,
      state: { table: [...table], n: boundedN },
      highlights: writeHl,
      description: `Calculated: ${prev1} + ${prev2} = ${sum}. Stored value ${sum} in dp[${i}]. Subproblem solved in O(1) time!`,
      codeLine: 12,
      explanation: {
        action: 'STORE RESULT',
        formula: `dp[${i}] = ${sum}`,
        variables: { i, 'dp[i]': sum },
      },
    });
  }

  // Final Step: Completion
  const finalHl: Record<number, HighlightRole> = {};
  for (let k = 0; k <= boundedN; k++) finalHl[k] = 'visited';
  finalHl[boundedN] = 'active';

  steps.push({
    id: stepId++,
    state: { table: [...table], n: boundedN },
    highlights: finalHl,
    description: `Tabulation Complete! Final answer Fibonacci(${boundedN}) = ${table[boundedN]}. Solved in linear O(N) time and O(N) space, avoiding exponential 2^N recursion!`,
    codeLine: 14,
    explanation: {
      action: 'COMPLETE',
      formula: `Answer = dp[${boundedN}] = ${table[boundedN]}`,
      variables: { answer: table[boundedN] ?? 0, complexity: 'O(N) time, O(N) space' },
    },
  });

  return steps;
}

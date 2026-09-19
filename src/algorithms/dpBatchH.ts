import { Step, HighlightRole } from '../types/simulation';
import { Language } from '../types/topic';

// ==========================================
// 1. 0/1 KNAPSACK PROBLEM (2D DP GRID)
// ==========================================
export const knapsackSnippets: Record<Language, string> = {
  python: `def knapsack(weights, values, W):
    n = len(values)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,

  cpp: `int knapsack(const vector<int>& weights, const vector<int>& values, int W) {
    int n = values.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; ++i) {
        for (int w = 1; w <= W; ++w) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,

  javascript: `function knapsack(weights, values, W) {
  const n = values.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`
};

export function generateKnapsackSteps(): Step<number[][]>[] {
  const steps: Step<number[][]>[] = [];
  let stepId = 1;

  const weights = [1, 2, 3];
  const values = [6, 10, 12];
  const W = 4;
  const n = values.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  steps.push({
    id: stepId++,
    state: dp.map((r) => [...r]),
    highlights: {},
    description: `0/1 Knapsack Problem. Capacity W = ${W}kg. Items (weight, value): (1kg, $6), (2kg, $10), (3kg, $12). Allocated (N+1) x (W+1) DP matrix.`,
    codeLine: 3,
    explanation: { action: 'INITIALIZE', variables: { capacity: W, itemsCount: n } },
  });

  for (let i = 1; i <= n; i++) {
    const itemWt = weights[i - 1];
    const itemVal = values[i - 1];

    for (let w = 1; w <= W; w++) {
      if (itemWt <= w) {
        const skipVal = dp[i - 1][w];
        const takeVal = itemVal + dp[i - 1][w - itemWt];
        const best = Math.max(skipVal, takeVal);
        dp[i][w] = best;

        const hl: Record<string, HighlightRole> = {
          [`${i - 1},${w}`]: 'comparing',
          [`${i - 1},${w - itemWt}`]: 'comparing',
          [`${i},${w}`]: 'active',
        };

        steps.push({
          id: stepId++,
          state: dp.map((r) => [...r]),
          highlights: hl,
          description: `Item ${i} (wt=${itemWt}kg, val=$${itemVal}) at capacity ${w}kg. Compare: Skip ($${skipVal}) vs Take ($${itemVal} + $${dp[i - 1][w - itemWt]} = $${takeVal}). Best: $${best}.`,
          codeLine: 6,
          explanation: {
            action: 'COMPARE DECISION',
            formula: `max(skip=$${skipVal}, take=$${takeVal}) = $${best}`,
            variables: { i, w, chosenValue: best },
          },
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        const hl: Record<string, HighlightRole> = {
          [`${i - 1},${w}`]: 'comparing',
          [`${i},${w}`]: 'active',
        };

        steps.push({
          id: stepId++,
          state: dp.map((r) => [...r]),
          highlights: hl,
          description: `Item ${i} (wt=${itemWt}kg) exceeds current capacity ${w}kg. Must skip: dp[${i}][${w}] = dp[${i - 1}][${w}] = $${dp[i][w]}.`,
          codeLine: 8,
          explanation: { action: 'EXCEEDS CAPACITY (SKIP)', variables: { itemWt, capacity: w } },
        });
      }
    }
  }

  const finalHl: Record<string, HighlightRole> = { [`${n},${W}`]: 'sorted' };
  steps.push({
    id: stepId++,
    state: dp.map((r) => [...r]),
    highlights: finalHl,
    description: `Knapsack DP Complete! Maximum value achievable for capacity ${W}kg is $${dp[n][W]}. Time Complexity: O(N × W).`,
    codeLine: 10,
    explanation: { action: 'COMPLETE', formula: `Optimal Value = $${dp[n][W]}`, variables: { maxValue: dp[n][W] } },
  });

  return steps;
}

// ==========================================
// 2. LONGEST COMMON SUBSEQUENCE (LCS)
// ==========================================
export function generateLCSSteps(): Step<number[][]>[] {
  const steps: Step<number[][]>[] = [];
  let stepId = 1;

  const s1 = 'ABC';
  const s2 = 'AC';
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  steps.push({
    id: stepId++,
    state: dp.map((r) => [...r]),
    highlights: {},
    description: `Longest Common Subsequence (LCS) between s1="${s1}" and s2="${s2}". Finding length of longest sequence appearing in both in relative order.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { s1, s2 } },
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        const hl: Record<string, HighlightRole> = {
          [`${i - 1},${j - 1}`]: 'comparing',
          [`${i},${j}`]: 'sorted',
        };

        steps.push({
          id: stepId++,
          state: dp.map((r) => [...r]),
          highlights: hl,
          description: `Characters match: s1[${i - 1}] ('${s1[i - 1]}') == s2[${j - 1}] ('${s2[j - 1]}'). Increment diagonal: dp[${i}][${j}] = ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}.`,
          codeLine: 5,
          explanation: { action: 'MATCH DIAGONAL', formula: `dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`, variables: { matchChar: s1[i - 1] } },
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        const hl: Record<string, HighlightRole> = {
          [`${i - 1},${j}`]: 'comparing',
          [`${i},${j - 1}`]: 'comparing',
          [`${i},${j}`]: 'active',
        };

        steps.push({
          id: stepId++,
          state: dp.map((r) => [...r]),
          highlights: hl,
          description: `Characters mismatch ('${s1[i - 1]}' != '${s2[j - 1]}'). Take maximum of top (${dp[i - 1][j]}) and left (${dp[i][j - 1]}): dp[${i}][${j}] = ${dp[i][j]}.`,
          codeLine: 7,
          explanation: { action: 'MISMATCH MAX', formula: `max(up, left) = ${dp[i][j]}`, variables: { chosen: dp[i][j] } },
        });
      }
    }
  }

  return steps;
}

// ==========================================
// 3. COIN CHANGE (1D DP TABLE)
// ==========================================
export function generateCoinChangeSteps(
  coins: number[] = [1, 2, 5],
  amount: number = 6
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;

  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  steps.push({
    id: stepId++,
    state: [...dp].map((v) => (v === Infinity ? 99 : v)),
    highlights: { 0: 'sorted' },
    description: `Coin Change Problem: Find minimum coins needed to make amount ${amount} using coin denominations [${coins.join(', ')}]. Base case: dp[0] = 0 coins.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { targetAmount: amount, baseCase: 'dp[0] = 0' } },
  });

  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0 && dp[i - c] !== Infinity) {
        if (dp[i - c] + 1 < dp[i]) {
          dp[i] = dp[i - c] + 1;

          const hl: Record<number, HighlightRole> = { [i - c]: 'comparing', [i]: 'active' };
          steps.push({
            id: stepId++,
            state: [...dp].map((v) => (v === Infinity ? 99 : v)),
            highlights: hl,
            description: `Amount ${i}: Using coin ${c}, lookup subproblem dp[${i} - ${c}] = dp[${i - c}] (${dp[i - c]} coins). New min coins: ${dp[i]}.`,
            codeLine: 6,
            explanation: { action: 'OPTIMIZE COIN', formula: `dp[${i}] = dp[${i-c}] + 1 = ${dp[i]}`, variables: { coin: c, subproblem: i - c, totalCoins: dp[i] } },
          });
        }
      }
    }
  }

  const finalHl: Record<number, HighlightRole> = { [amount]: 'sorted' };
  steps.push({
    id: stepId++,
    state: [...dp].map((v) => (v === Infinity ? 99 : v)),
    highlights: finalHl,
    description: `Coin Change Complete! Minimum coins needed for amount ${amount} is ${dp[amount]} coins (e.g. 5 + 1).`,
    codeLine: 8,
    explanation: { action: 'COMPLETE', variables: { minCoins: dp[amount] } },
  });

  return steps;
}

export const coinChangeSnippets: Record<Language, string> = {
  python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,

  cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; ++i) {
        for (int c : coins) {
            if (i - c >= 0)
                dp[i] = min(dp[i], dp[i - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,

  javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`
};

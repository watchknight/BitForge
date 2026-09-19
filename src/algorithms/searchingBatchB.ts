import { Step, HighlightRole } from '../types/simulation';
import { Language } from '../types/topic';

// ==========================================
// 1. LINEAR SEARCH
// ==========================================
export const linearSearchSnippets: Record<Language, string> = {
  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,

  cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,

  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`
};

export function generateLinearSearchSteps(
  initialArr: number[] = [24, 78, 13, 95, 41, 62],
  target: number = 95
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Linear Search for target = ${target} on an unsorted array of ${arr.length} elements.`,
    codeLine: 1,
    explanation: { action: 'INITIALIZE', variables: { target, size: arr.length } },
  });

  let foundIdx = -1;
  for (let i = 0; i < arr.length; i++) {
    const isMatch = arr[i] === target;
    const hl: Record<number, HighlightRole> = {};
    for (let k = 0; k < i; k++) hl[k] = 'visited';
    hl[i] = isMatch ? 'sorted' : 'comparing';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: hl,
      pointers: { i },
      description: `Checking index ${i}: arr[${i}] (${arr[i]}) vs target (${target}). ${
        isMatch ? 'Match found!' : 'No match; advance to next element.'
      }`,
      codeLine: 3,
      explanation: { action: 'COMPARE', variables: { 'arr[i]': arr[i], target, match: isMatch } },
    });

    if (isMatch) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx !== -1) {
    const finalHl: Record<number, HighlightRole> = { [foundIdx]: 'sorted' };
    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: finalHl,
      pointers: { found: foundIdx },
      description: `Target ${target} successfully located at index ${foundIdx}! Search completed in O(N) worst-case time.`,
      codeLine: 4,
      explanation: { action: 'FOUND', variables: { index: foundIdx, target } },
    });
  } else {
    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: {},
      description: `Target ${target} not present in the array. Returned -1.`,
      codeLine: 5,
      explanation: { action: 'NOT FOUND', variables: { target } },
    });
  }

  return steps;
}

// ==========================================
// 2. BINARY SEARCH
// ==========================================
export const binarySearchSnippets: Record<Language, string> = {
  python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,

  cpp: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}`,

  javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`
};

export function generateBinarySearchSteps(
  initialArr: number[] = [11, 22, 34, 45, 57, 68, 79, 91],
  target: number = 68
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr].sort((a, b) => a - b);
  let stepId = 1;
  let low = 0;
  let high = arr.length - 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    pointers: { low, high },
    description: `Starting Binary Search for target = ${target} on a sorted array of ${arr.length} elements. Initial search window is [0..${high}].`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { target, low, high } },
  });

  let found = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];

    const hl: Record<number, HighlightRole> = {};
    for (let k = 0; k < low; k++) hl[k] = 'neutral';
    for (let k = high + 1; k < arr.length; k++) hl[k] = 'neutral';
    hl[mid] = 'pivot';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: hl,
      pointers: { low, mid, high },
      description: `Calculated mid = (${low} + ${high}) // 2 = ${mid}. Inspecting arr[${mid}] (${midVal}) vs target (${target}).`,
      codeLine: 4,
      explanation: { action: 'CHECK MID', variables: { mid, 'arr[mid]': midVal, target } },
    });

    if (midVal === target) {
      found = mid;
      hl[mid] = 'sorted';
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { match: mid },
        description: `Found match! arr[${mid}] == ${target}. Target located in O(log N) comparisons!`,
        codeLine: 6,
        explanation: { action: 'MATCH FOUND', variables: { index: mid, target } },
      });
      break;
    } else if (midVal < target) {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { low, mid, high },
        description: `arr[${mid}] (${midVal}) < target (${target}). Target must lie in the right half. Updating low = ${mid + 1}.`,
        codeLine: 8,
        explanation: { action: 'DISCARD LEFT', variables: { newLow: mid + 1 } },
      });
      low = mid + 1;
    } else {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { low, mid, high },
        description: `arr[${mid}] (${midVal}) > target (${target}). Target must lie in the left half. Updating high = ${mid - 1}.`,
        codeLine: 10,
        explanation: { action: 'DISCARD RIGHT', variables: { newHigh: mid - 1 } },
      });
      high = mid - 1;
    }
  }

  if (found === -1) {
    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: {},
      description: `Search window exhausted (low > high). Target ${target} does not exist in array.`,
      codeLine: 11,
      explanation: { action: 'NOT FOUND', variables: { target } },
    });
  }

  return steps;
}

// ==========================================
// 3. TERNARY SEARCH
// ==========================================
export const ternarySearchSnippets: Record<Language, string> = {
  python: `def ternary_search(arr, target, low, high):
    if low > high:
        return -1
    mid1 = low + (high - low) // 3
    mid2 = high - (high - low) // 3
    if arr[mid1] == target:
        return mid1
    if arr[mid2] == target:
        return mid2
    if target < arr[mid1]:
        return ternary_search(arr, target, low, mid1 - 1)
    elif target > arr[mid2]:
        return ternary_search(arr, target, mid2 + 1, high)
    else:
        return ternary_search(arr, target, mid1 + 1, mid2 - 1)`,

  cpp: `int ternarySearch(const vector<int>& arr, int target, int low, int high) {
    if (low > high) return -1;
    int mid1 = low + (high - low) / 3;
    int mid2 = high - (high - low) / 3;
    if (arr[mid1] == target) return mid1;
    if (arr[mid2] == target) return mid2;
    if (target < arr[mid1])
        return ternarySearch(arr, target, low, mid1 - 1);
    else if (target > arr[mid2])
        return ternarySearch(arr, target, mid2 + 1, high);
    else
        return ternarySearch(arr, target, mid1 + 1, mid2 - 1);
}`,

  javascript: `function ternarySearch(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) return -1;
  const mid1 = low + Math.floor((high - low) / 3);
  const mid2 = high - Math.floor((high - low) / 3);
  if (arr[mid1] === target) return mid1;
  if (arr[mid2] === target) return mid2;
  if (target < arr[mid1]) {
    return ternarySearch(arr, target, low, mid1 - 1);
  } else if (target > arr[mid2]) {
    return ternarySearch(arr, target, mid2 + 1, high);
  } else {
    return ternarySearch(arr, target, mid1 + 1, mid2 - 1);
  }
}`
};

export function generateTernarySearchSteps(
  initialArr: number[] = [5, 12, 19, 27, 34, 46, 58, 69, 81],
  target: number = 46
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr].sort((a, b) => a - b);
  let stepId = 1;
  let low = 0;
  let high = arr.length - 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    pointers: { low, high },
    description: `Starting Ternary Search for target = ${target}. Ternary search divides the search window into 3 equal partitions using 2 midpoints: mid1 and mid2.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { target, low, high } },
  });

  let found = -1;
  while (low <= high) {
    const mid1 = low + Math.floor((high - low) / 3);
    const mid2 = high - Math.floor((high - low) / 3);

    const hl: Record<number, HighlightRole> = {};
    for (let k = 0; k < low; k++) hl[k] = 'neutral';
    for (let k = high + 1; k < arr.length; k++) hl[k] = 'neutral';
    hl[mid1] = 'pivot';
    hl[mid2] = 'pivot';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: hl,
      pointers: { low, mid1, mid2, high },
      description: `Trisecting interval: mid1=${mid1} (${arr[mid1]}), mid2=${mid2} (${arr[mid2]}). Comparing with target ${target}.`,
      codeLine: 4,
      explanation: { action: 'TRISIECT', variables: { mid1, val1: arr[mid1], mid2, val2: arr[mid2] } },
    });

    if (arr[mid1] === target) {
      found = mid1;
      hl[mid1] = 'sorted';
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { match: mid1 },
        description: `Target found at mid1 (${mid1})!`,
        codeLine: 6,
        explanation: { action: 'FOUND', variables: { index: mid1 } },
      });
      break;
    }
    if (arr[mid2] === target) {
      found = mid2;
      hl[mid2] = 'sorted';
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { match: mid2 },
        description: `Target found at mid2 (${mid2})!`,
        codeLine: 8,
        explanation: { action: 'FOUND', variables: { index: mid2 } },
      });
      break;
    }

    if (target < arr[mid1]) {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        description: `target < arr[mid1]. Eliminating right two-thirds. High is now mid1 - 1 = ${mid1 - 1}.`,
        codeLine: 10,
        explanation: { action: 'DISCARD RIGHT 2/3', variables: { newHigh: mid1 - 1 } },
      });
      high = mid1 - 1;
    } else if (target > arr[mid2]) {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        description: `target > arr[mid2]. Eliminating left two-thirds. Low is now mid2 + 1 = ${mid2 + 1}.`,
        codeLine: 12,
        explanation: { action: 'DISCARD LEFT 2/3', variables: { newLow: mid2 + 1 } },
      });
      low = mid2 + 1;
    } else {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        description: `target lies strictly between mid1 and mid2. Narrowing window to [${mid1 + 1}..${mid2 - 1}].`,
        codeLine: 14,
        explanation: { action: 'KEEP MIDDLE THIRD', variables: { newLow: mid1 + 1, newHigh: mid2 - 1 } },
      });
      low = mid1 + 1;
      high = mid2 - 1;
    }
  }

  return steps;
}

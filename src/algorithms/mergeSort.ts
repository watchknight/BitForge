import { Step, HighlightRole, CallStackFrame } from '../types/simulation';
import { Language } from '../types/topic';

export interface MergeSortInput {
  array: number[];
}

export const mergeSortSnippets: Record<Language, string> = {
  python: `def merge_sort(arr, left, right):
    if left >= right:
        return
    mid = (left + right) // 2
    merge_sort(arr, left, mid)
    merge_sort(arr, mid + 1, right)
    merge(arr, left, mid, right)

def merge(arr, left, mid, right):
    temp = []
    i, j = left, mid + 1
    while i <= mid and j <= right:
        if arr[i] <= arr[j]:
            temp.append(arr[i])
            i += 1
        else:
            temp.append(arr[j])
            j += 1
    while i <= mid:
        temp.append(arr[i])
        i += 1
    while j <= right:
        temp.append(arr[j])
        j += 1
    for k in range(len(temp)):
        arr[left + k] = temp[k]`,

  cpp: `void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right)
        return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i++]);
        } else {
            temp.push_back(arr[j++]);
        }
    }
    while (i <= mid)
        temp.push_back(arr[i++]);
    while (j <= right)
        temp.push_back(arr[j++]);
    for (int k = 0; k < temp.size(); k++)
        arr[left + k] = temp[k];
}`,

  javascript: `function mergeSort(arr, left, right) {
  if (left >= right) {
    return;
  }
  const mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
  const temp = [];
  let i = left, j = mid + 1;
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }
  while (i <= mid) {
    temp.push(arr[i++]);
  }
  while (j <= right) {
    temp.push(arr[j++]);
  }
  for (let k = 0; k < temp.length; k++) {
    arr[left + k] = temp[k];
  }
}`
};

export function generateMergeSortSteps(initialArray: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArray];
  let stepId = 1;
  const stack: CallStackFrame[] = [];

  // Step 0: Initial Array State
  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    pointers: { left: 0, right: arr.length - 1 },
    description: `Starting Merge Sort on array with ${arr.length} elements. Merge Sort divides the array in half recursively until sub-problems have size 1, then merges sorted halves.`,
    codeLine: 1,
    explanation: {
      action: 'INITIALIZE',
      variables: { size: arr.length, left: 0, right: arr.length - 1 },
    },
    callStack: [],
  });

  function solve(left: number, right: number) {
    const frameId = `frame-${left}-${right}-${stepId}`;
    const frame: CallStackFrame = {
      id: frameId,
      name: 'mergeSort',
      args: { left, right },
      depth: stack.length,
      status: 'active',
    };
    stack.push(frame);

    // Step: Check base case
    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: {
        [left]: left === right ? 'sorted' : 'active',
        [right]: left === right ? 'sorted' : 'active',
      },
      pointers: { left, right },
      description:
        left >= right
          ? `Base Case reached: Sub-array [${left}..${right}] has 1 element (${arr[left]}). A single element is already sorted!`
          : `Examining sub-array range [${left}..${right}]. Since left (${left}) < right (${right}), we calculate the midpoint to divide.`,
      codeLine: 2,
      explanation: {
        action: left >= right ? 'BASE CASE' : 'DIVIDE',
        variables: { left, right, isSingleElement: left >= right },
      },
      callStack: [...stack],
      auxiliary: { mergeRange: [left, right] },
    });

    if (left >= right) {
      frame.status = 'returned';
      stack.pop();
      return;
    }

    const mid = Math.floor((left + right) / 2);

    // Step: Midpoint calculated
    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: {
        [mid]: 'pivot',
      },
      pointers: { left, mid, right },
      description: `Calculated midpoint: mid = floor((${left} + ${right}) / 2) = ${mid}. Dividing into left sub-array [${left}..${mid}] and right sub-array [${mid + 1}..${right}].`,
      codeLine: 4,
      explanation: {
        action: 'DIVIDE',
        variables: { mid, leftRange: `[${left}..${mid}]`, rightRange: `[${mid + 1}..${right}]` },
      },
      callStack: [...stack],
      auxiliary: { mergeRange: [left, right] },
    });

    // Recurse left
    solve(left, mid);

    // Recurse right
    solve(mid + 1, right);

    // Merge Phase
    merge(left, mid, right);

    frame.status = 'returned';
    stack.pop();
  }

  function merge(left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    // Step: Start merge
    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: {
        [i]: 'comparing',
        [j]: 'comparing',
      },
      pointers: { i, j },
      description: `Starting two-finger merge of sorted sub-arrays [${left}..${mid}] and [${mid + 1}..${right}]. Comparing pointer 'i' (${arr[i]}) with pointer 'j' (${arr[j]}).`,
      codeLine: 12,
      explanation: {
        action: 'MERGE START',
        variables: { i, j, 'arr[i]': arr[i], 'arr[j]': arr[j] },
      },
      callStack: [...stack],
      auxiliary: { tempArray: [...temp], mergeRange: [left, right] },
    });

    while (i <= mid && j <= right) {
      const takeLeft = arr[i] <= arr[j];

      // Comparison step
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: {
          [i]: takeLeft ? 'active' : 'comparing',
          [j]: !takeLeft ? 'active' : 'comparing',
        },
        pointers: { i, j },
        description: `Comparing arr[i]=${arr[i]} with arr[j]=${arr[j]}. Since ${arr[i]} ${
          takeLeft ? '<=' : '>'
        } ${arr[j]}, we take ${takeLeft ? arr[i] : arr[j]} and append it to temp buffer.`,
        codeLine: 14,
        explanation: {
          action: 'COMPARING',
          variables: { 'arr[i]': arr[i], 'arr[j]': arr[j], winner: takeLeft ? arr[i] : arr[j] },
        },
        callStack: [...stack],
        auxiliary: { tempArray: [...temp], mergeRange: [left, right] },
      });

      if (takeLeft) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }

    // Remaining left
    while (i <= mid) {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: { [i]: 'active' },
        pointers: { i },
        description: `Right sub-array exhausted. Copying remaining element arr[${i}]=${arr[i]} to temp buffer.`,
        codeLine: 20,
        explanation: {
          action: 'APPEND REMAINING',
          variables: { i, val: arr[i] },
        },
        callStack: [...stack],
        auxiliary: { tempArray: [...temp], mergeRange: [left, right] },
      });
      temp.push(arr[i]);
      i++;
    }

    // Remaining right
    while (j <= right) {
      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: { [j]: 'active' },
        pointers: { j },
        description: `Left sub-array exhausted. Copying remaining element arr[${j}]=${arr[j]} to temp buffer.`,
        codeLine: 23,
        explanation: {
          action: 'APPEND REMAINING',
          variables: { j, val: arr[j] },
        },
        callStack: [...stack],
        auxiliary: { tempArray: [...temp], mergeRange: [left, right] },
      });
      temp.push(arr[j]);
      j++;
    }

    // Write-back from temp into arr
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      const hl: Record<number, HighlightRole> = {};
      for (let idx = left; idx <= left + k; idx++) {
        hl[idx] = 'sorted';
      }

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { k: left + k },
        description: `Copying sorted value ${temp[k]} from temp back into main array at index ${left + k}.`,
        codeLine: 26,
        explanation: {
          action: 'WRITE BACK',
          variables: { targetIndex: left + k, value: temp[k] },
        },
        callStack: [...stack],
        auxiliary: { tempArray: [...temp], mergeRange: [left, right] },
      });
    }
  }

  solve(0, arr.length - 1);

  // Final Completion Step
  const finalHighlights: Record<number, HighlightRole> = {};
  for (let idx = 0; idx < arr.length; idx++) {
    finalHighlights[idx] = 'sorted';
  }

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: finalHighlights,
    description: `Merge Sort Complete! The entire array is now completely sorted in non-decreasing order: [${arr.join(
      ', '
    )}]. Time Complexity: O(N log N).`,
    codeLine: 1,
    explanation: {
      action: 'COMPLETE',
      variables: { totalSorted: arr.length },
    },
    callStack: [],
  });

  return steps;
}

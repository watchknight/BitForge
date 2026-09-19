import { Step, HighlightRole, CallStackFrame } from '../types/simulation';
import { Language } from '../types/topic';

// ==========================================
// 1. BUBBLE SORT
// ==========================================
export const bubbleSortSnippets: Record<Language, string> = {
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,

  cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

  javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`
};

export function generateBubbleSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  let stepId = 1;
  const sortedIndices = new Set<number>();

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Bubble Sort on ${n} elements. In each pass, adjacent elements are compared and swapped if out of order, bubbling the largest unsorted element to the end.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { size: n } },
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const hl: Record<number, HighlightRole> = {};
      sortedIndices.forEach((idx) => (hl[idx] = 'sorted'));
      hl[j] = 'comparing';
      hl[j + 1] = 'comparing';

      const needsSwap = arr[j] > arr[j + 1];

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { j, 'j+1': j + 1 },
        description: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${
          needsSwap ? `${arr[j]} > ${arr[j + 1]} — swap required!` : `${arr[j]} <= ${arr[j + 1]} — already in relative order.`
        }`,
        codeLine: 6,
        explanation: {
          action: 'COMPARE',
          variables: { 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapNeeded: needsSwap },
        },
      });

      if (needsSwap) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        const swapHl: Record<number, HighlightRole> = {};
        sortedIndices.forEach((idx) => (swapHl[idx] = 'sorted'));
        swapHl[j] = 'active';
        swapHl[j + 1] = 'active';

        steps.push({
          id: stepId++,
          state: [...arr],
          highlights: swapHl,
          pointers: { j, 'j+1': j + 1 },
          description: `Swapped: ${arr[j + 1]} floated forward, ${arr[j]} moved backward.`,
          codeLine: 7,
          explanation: { action: 'SWAP', variables: { new_left: arr[j], new_right: arr[j + 1] } },
        });
      }
    }

    sortedIndices.add(n - i - 1);
    const passHl: Record<number, HighlightRole> = {};
    sortedIndices.forEach((idx) => (passHl[idx] = 'sorted'));

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: passHl,
      description: `Pass ${i + 1} complete. Largest remaining element (${arr[n - i - 1]}) is locked at index ${n - i - 1}.`,
      codeLine: 9,
      explanation: { action: 'PASS COMPLETE', variables: { lockedIndex: n - i - 1, val: arr[n - i - 1] } },
    });

    if (!swapped) {
      for (let k = 0; k < n; k++) sortedIndices.add(k);
      const earlyHl: Record<number, HighlightRole> = {};
      sortedIndices.forEach((idx) => (earlyHl[idx] = 'sorted'));

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: earlyHl,
        description: `Early termination: No swaps occurred during this entire pass! Array is already fully sorted in best-case O(N) time.`,
        codeLine: 10,
        explanation: { action: 'EARLY TERMINATION', variables: { sorted: true } },
      });
      break;
    }
  }

  return steps;
}

// ==========================================
// 2. SELECTION SORT
// ==========================================
export const selectionSortSnippets: Record<Language, string> = {
  python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,

  cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,

  javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`
};

export function generateSelectionSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Selection Sort on ${n} elements. In each pass, we scan the unsorted subarray to find the minimum element, then place it at the front.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { size: n } },
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      const hl: Record<number, HighlightRole> = {};
      for (let k = 0; k < i; k++) hl[k] = 'sorted';
      hl[minIdx] = 'pivot';
      hl[j] = 'comparing';

      const isNewMin = arr[j] < arr[minIdx];

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { i, min: minIdx, j },
        description: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}). ${
          isNewMin ? `New minimum found! min_idx is now ${j}.` : `Not smaller; keep scanning.`
        }`,
        codeLine: 6,
        explanation: {
          action: 'SCAN MINIMUM',
          variables: { 'arr[j]': arr[j], 'arr[minIdx]': arr[minIdx], isNewMin },
        },
      });

      if (isNewMin) {
        minIdx = j;
      }
    }

    // Swap arr[i] and arr[minIdx]
    const temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;

    const swapHl: Record<number, HighlightRole> = {};
    for (let k = 0; k <= i; k++) swapHl[k] = 'sorted';
    swapHl[minIdx] = 'active';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: swapHl,
      pointers: { i, swappedWith: minIdx },
      description: `Swapped minimum element (${arr[i]}) into position ${i}. Index ${i} is now permanently sorted.`,
      codeLine: 8,
      explanation: { action: 'PLACE MINIMUM', variables: { sortedIndex: i, val: arr[i] } },
    });
  }

  return steps;
}

// ==========================================
// 3. INSERTION SORT
// ==========================================
export const insertionSortSnippets: Record<Language, string> = {
  python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,

  cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,

  javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
};

export function generateInsertionSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'sorted' },
    description: `Starting Insertion Sort. The first element arr[0] (${arr[0]}) is trivially considered a sorted sub-list of size 1.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { sortedPrefix: 1 } },
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    const pickHl: Record<number, HighlightRole> = {};
    for (let k = 0; k < i; k++) pickHl[k] = 'sorted';
    pickHl[i] = 'active';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: pickHl,
      pointers: { key: i, i },
      description: `Picking key = arr[${i}] (${key}). We will shift elements in the sorted prefix [0..${i - 1}] to find the correct insertion slot.`,
      codeLine: 3,
      explanation: { action: 'PICK KEY', variables: { key, index: i } },
    });

    while (j >= 0 && arr[j] > key) {
      const shiftHl: Record<number, HighlightRole> = {};
      for (let k = 0; k < i; k++) shiftHl[k] = 'sorted';
      shiftHl[j] = 'comparing';
      shiftHl[j + 1] = 'active';

      arr[j + 1] = arr[j];

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: shiftHl,
        pointers: { j, shiftedTo: j + 1 },
        description: `arr[${j}] (${arr[j]}) > key (${key}). Shifting ${arr[j]} one position right to index ${j + 1}.`,
        codeLine: 6,
        explanation: { action: 'SHIFT RIGHT', variables: { shiftedVal: arr[j], newIndex: j + 1 } },
      });

      j--;
    }

    arr[j + 1] = key;
    const placedHl: Record<number, HighlightRole> = {};
    for (let k = 0; k <= i; k++) placedHl[k] = 'sorted';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: placedHl,
      pointers: { inserted: j + 1 },
      description: `Inserted key (${key}) into slot ${j + 1}. Sub-array [0..${i}] is now sorted.`,
      codeLine: 8,
      explanation: { action: 'INSERT KEY', variables: { insertedSlot: j + 1, val: key } },
    });
  }

  return steps;
}

// ==========================================
// 4. QUICK SORT
// ==========================================
export const quickSortSnippets: Record<Language, string> = {
  python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,

  cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] <= pivot) {
            ++i;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,

  javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
};

export function generateQuickSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  let stepId = 1;
  const stack: CallStackFrame[] = [];

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Quick Sort on array of size ${arr.length}. Quick Sort picks a pivot, partitions elements into smaller and larger halves, and sorts recursively.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { size: arr.length } },
    callStack: [],
  });

  function qsort(low: number, high: number) {
    if (low >= high) {
      if (low === high) {
        steps.push({
          id: stepId++,
          state: [...arr],
          highlights: { [low]: 'sorted' },
          description: `Sub-array [${low}..${high}] has 1 element (${arr[low]}). Already sorted.`,
          codeLine: 2,
          explanation: { action: 'BASE CASE', variables: { index: low, val: arr[low] } },
          callStack: [...stack],
        });
      }
      return;
    }

    const frame: CallStackFrame = {
      id: `frame-${low}-${high}-${stepId}`,
      name: 'quickSort',
      args: { low, high },
      depth: stack.length,
      status: 'active',
    };
    stack.push(frame);

    const pivotVal = arr[high];

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: { [high]: 'pivot' },
      pointers: { low, high, pivot: high },
      description: `Partitioning segment [${low}..${high}]. Selected pivot arr[${high}] = ${pivotVal}.`,
      codeLine: 8,
      explanation: { action: 'SELECT PIVOT', variables: { pivot: pivotVal, index: high } },
      callStack: [...stack],
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      const isSmaller = arr[j] <= pivotVal;

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: { [high]: 'pivot', [j]: 'comparing', ...(i >= low ? { [i]: 'active' } : {}) },
        pointers: { pivot: high, j, ...(i >= low ? { i } : {}) },
        description: `Comparing arr[${j}] (${arr[j]}) <= pivot (${pivotVal}). ${
          isSmaller ? 'Condition met! Advance i and swap with arr[j].' : 'Larger than pivot; continue.'
        }`,
        codeLine: 11,
        explanation: { action: 'PARTITION COMPARE', variables: { 'arr[j]': arr[j], pivotVal, isSmaller } },
        callStack: [...stack],
      });

      if (isSmaller) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        steps.push({
          id: stepId++,
          state: [...arr],
          highlights: { [high]: 'pivot', [i]: 'active', [j]: 'active' },
          pointers: { i, j, pivot: high },
          description: `Swapped arr[${i}] and arr[${j}]. Smaller element moved to the left region.`,
          codeLine: 13,
          explanation: { action: 'PARTITION SWAP', variables: { 'arr[i]': arr[i], 'arr[j]': arr[j] } },
          callStack: [...stack],
        });
      }
    }

    // Place pivot at i + 1
    const pi = i + 1;
    const temp = arr[pi];
    arr[pi] = arr[high];
    arr[high] = temp;

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: { [pi]: 'sorted' },
      pointers: { pivotPlaced: pi },
      description: `Placed pivot (${arr[pi]}) into its final sorted position at index ${pi}. Everything to left <= ${arr[pi]}, everything to right > ${arr[pi]}.`,
      codeLine: 14,
      explanation: { action: 'PIVOT LOCKED', variables: { pivotIndex: pi, pivotVal: arr[pi] } },
      callStack: [...stack],
    });

    // Recurse left
    qsort(low, pi - 1);
    // Recurse right
    qsort(pi + 1, high);

    stack.pop();
  }

  qsort(0, arr.length - 1);

  const finalHl: Record<number, HighlightRole> = {};
  for (let k = 0; k < arr.length; k++) finalHl[k] = 'sorted';

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: finalHl,
    description: `Quick Sort Complete! Array fully sorted in O(N log N) average time.`,
    codeLine: 1,
    explanation: { action: 'COMPLETE', variables: { totalElements: arr.length } },
    callStack: [],
  });

  return steps;
}

// ==========================================
// 5. HEAP SORT
// ==========================================
export const heapSortSnippets: Record<Language, string> = {
  python: `def heap_sort(arr):
    n = len(arr)
    # Build max-heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,

  cpp: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}`,

  javascript: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`
};

export function generateHeapSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Heap Sort on ${n} elements. Phase 1: Build a Max-Heap where parent >= children. Phase 2: Repeatedly swap the root max element to the end.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { size: n } },
  });

  function siftDown(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: { [i]: 'active', [largest]: 'comparing' },
        pointers: { parent: i, child: largest },
        description: `Max-heap violation at index ${i}. Sifted down: swapped parent ${temp} with larger child ${arr[i]}.`,
        codeLine: 20,
        explanation: { action: 'HEAPIFY SWAP', variables: { parent: i, child: largest } },
      });

      siftDown(size, largest);
    }
  }

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(n, i);
  }

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'pivot' },
    description: `Max-Heap constructed! Root element arr[0] (${arr[0]}) is guaranteed to be the global maximum.`,
    codeLine: 5,
    explanation: { action: 'HEAP BUILT', variables: { maxElement: arr[0] } },
  });

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    const extractHl: Record<number, HighlightRole> = {};
    for (let k = i; k < n; k++) extractHl[k] = 'sorted';
    extractHl[0] = 'active';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: extractHl,
      pointers: { maxPlaced: i },
      description: `Extracted max (${arr[i]}) to index ${i}. Now restoring max-heap on remaining ${i} items.`,
      codeLine: 8,
      explanation: { action: 'EXTRACT MAX', variables: { placedIndex: i, val: arr[i] } },
    });

    siftDown(i, 0);
  }

  const finalHl: Record<number, HighlightRole> = {};
  for (let k = 0; k < n; k++) finalHl[k] = 'sorted';

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: finalHl,
    description: `Heap Sort Complete! Sorted in guaranteed O(N log N) time in-place with O(1) auxiliary space.`,
    codeLine: 1,
    explanation: { action: 'COMPLETE', variables: { totalSorted: n } },
  });

  return steps;
}

// ==========================================
// 6. COUNTING SORT
// ==========================================
export const countingSortSnippets: Record<Language, string> = {
  python: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1
    # Reconstruct array
    idx = 0
    for val, freq in enumerate(count):
        for _ in range(freq):
            arr[idx] = val
            idx += 1
    return arr`,

  cpp: `void countingSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> count(maxVal + 1, 0);
    for (int num : arr) count[num]++;
    int idx = 0;
    for (int val = 0; val <= maxVal; ++val) {
        while (count[val]-- > 0) {
            arr[idx++] = val;
        }
    }
}`,

  javascript: `function countingSort(arr) {
  const maxVal = Math.max(...arr);
  const count = new Array(maxVal + 1).fill(0);
  for (const num of arr) count[num]++;
  let idx = 0;
  for (let val = 0; val <= maxVal; val++) {
    while (count[val] > 0) {
      arr[idx++] = val;
      count[val]--;
    }
  }
  return arr;
}`
};

export function generateCountingSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  const maxVal = Math.max(...arr, 1);
  const count = new Array(maxVal + 1).fill(0);
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Counting Sort. Non-comparison sort with O(N + K) time. Max value in array is ${maxVal}, so we allocate frequency counter [0..${maxVal}].`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { maxVal, counterSize: maxVal + 1 } },
  });

  // Frequency tally
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    count[val]++;

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: { [i]: 'active' },
      pointers: { i },
      description: `Tallied arr[${i}] = ${val}. Frequency count[${val}] is now ${count[val]}.`,
      codeLine: 5,
      explanation: { action: 'COUNT FREQUENCY', variables: { val, currentCount: count[val] } },
      auxiliary: { tempArray: [...count] },
    });
  }

  // Reconstruct sorted array
  let writeIdx = 0;
  for (let val = 0; val <= maxVal; val++) {
    while (count[val] > 0) {
      arr[writeIdx] = val;
      count[val]--;

      const hl: Record<number, HighlightRole> = {};
      for (let k = 0; k <= writeIdx; k++) hl[k] = 'sorted';

      steps.push({
        id: stepId++,
        state: [...arr],
        highlights: hl,
        pointers: { write: writeIdx },
        description: `Wrote value ${val} to position ${writeIdx} based on frequency tally.`,
        codeLine: 9,
        explanation: { action: 'WRITE VALUE', variables: { val, writeIndex: writeIdx } },
        auxiliary: { tempArray: [...count] },
      });

      writeIdx++;
    }
  }

  const finalHl: Record<number, HighlightRole> = {};
  for (let k = 0; k < arr.length; k++) finalHl[k] = 'sorted';

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: finalHl,
    description: `Counting Sort Complete! Linear O(N + K) time achieved without performing a single comparison.`,
    codeLine: 12,
    explanation: { action: 'COMPLETE', variables: { totalSorted: arr.length } },
  });

  return steps;
}

// ==========================================
// 7. RADIX SORT
// ==========================================
export const radixSortSnippets: Record<Language, string> = {
  python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in range(n):
        idx = (arr[i] // exp) % 10
        count[idx] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        idx = (arr[i] // exp) % 10
        output[count[idx] - 1] = arr[i]
        count[idx] -= 1
    for i in range(n):
        arr[i] = output[i]`,

  cpp: `void radixSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        countSortDigit(arr, exp);
    }
}

void countSortDigit(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    vector<int> count(10, 0);
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int idx = (arr[i] / exp) % 10;
        output[count[idx] - 1] = arr[i];
        count[idx]--;
    }
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}`,

  javascript: `function radixSort(arr) {
  const maxVal = Math.max(...arr);
  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    countSortDigit(arr, exp);
  }
  return arr;
}

function countSortDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`
};

export function generateRadixSortSteps(initialArr: number[]): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialArr];
  const maxVal = Math.max(...arr, 1);
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    description: `Starting Radix Sort (LSD). Radix Sort processes numbers digit by digit from least-significant to most-significant digit using stable subroutine passes.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { maxVal } },
  });

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    const digitPlace = exp === 1 ? '1s' : exp === 10 ? '10s' : '100s';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: {},
      description: `Starting sorting pass on the ${digitPlace} digit place (exp=${exp}).`,
      codeLine: 4,
      explanation: { action: 'START DIGIT PASS', variables: { digitPlace, exp } },
    });

    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }

    const passHl: Record<number, HighlightRole> = {};
    for (let k = 0; k < n; k++) passHl[k] = 'active';

    steps.push({
      id: stepId++,
      state: [...arr],
      highlights: passHl,
      description: `Completed pass for ${digitPlace} place! Array stable-reordered: [${arr.join(', ')}].`,
      codeLine: 6,
      explanation: { action: 'PASS COMPLETE', variables: { sortedByDigit: digitPlace } },
    });
  }

  const finalHl: Record<number, HighlightRole> = {};
  for (let k = 0; k < arr.length; k++) finalHl[k] = 'sorted';

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: finalHl,
    description: `Radix Sort Complete! Array fully sorted in O(D × (N + K)) time without direct comparisons.`,
    codeLine: 7,
    explanation: { action: 'COMPLETE', variables: { totalSorted: arr.length } },
  });

  return steps;
}

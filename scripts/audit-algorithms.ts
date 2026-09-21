import { generateMergeSortSteps } from '../src/algorithms/mergeSort';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  generateCountingSortSteps,
  generateRadixSortSteps,
} from '../src/algorithms/sortingBatchA';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateTernarySearchSteps,
} from '../src/algorithms/searchingBatchB';
import {
  generateDoublyLinkedListSteps,
  generateCircularLinkedListSteps,
  generateDequeSteps,
  generateStackSteps,
  generateQueueSteps,
  generateCircularQueueSteps,
  generatePriorityQueueSteps,
} from '../src/algorithms/linearBatchC';
import { generateLinkedListSteps } from '../src/algorithms/linkedList';
import {
  generateFactorialSteps,
  generateNQueensSteps,
  generateMazeSteps,
  generateSubsetsSteps,
} from '../src/algorithms/recursionBatchD';
import {
  generateAVLTreeSteps,
  generateHeapTreeSteps,
  generateTrieSteps,
  generateSegmentTreeSteps,
  generateFenwickTreeSteps,
} from '../src/algorithms/treesBatchE';
import { generateBSTSteps } from '../src/algorithms/bst';
import { generateHashTableOpenAddressingSteps } from '../src/algorithms/hashingBatchF';
import {
  generateDFSSteps,
  generateDijkstraSteps,
  generateTopologicalSortSteps,
} from '../src/algorithms/graphsBatchG';
import { generateBFSSteps } from '../src/algorithms/bfs';
import {
  generateKnapsackSteps,
  generateLCSSteps,
  generateCoinChangeSteps,
} from '../src/algorithms/dpBatchH';
import { generateFibonacciDpSteps } from '../src/algorithms/fibonacciDp';
import {
  generateActivitySelectionSteps,
  generateHuffmanCodingSteps,
  generateUnionFindSteps,
  generateKMPSteps,
  generateBitManipulationSteps,
} from '../src/algorithms/greedyAndAdvancedBatchIJ';

interface AuditFinding {
  algorithm: string;
  testCase: string;
  type: 'CRASH' | 'ZERO_STEPS' | 'INCORRECT_RESULT' | 'NAN_UNDEFINED_DATA';
  details: string;
}

const findings: AuditFinding[] = [];

function checkSorting(name: string, fn: (arr: number[]) => any[]) {
  const testCases = [
    { label: 'Empty array []', input: [] },
    { label: 'Single element [42]', input: [42] },
    { label: 'Already sorted [1, 2, 3, 4, 5]', input: [1, 2, 3, 4, 5] },
    { label: 'Reverse sorted [5, 4, 3, 2, 1]', input: [5, 4, 3, 2, 1] },
    { label: 'Duplicate elements [5, 2, 5, 1, 5, 2]', input: [5, 2, 5, 1, 5, 2] },
    { label: 'All identical [7, 7, 7, 7]', input: [7, 7, 7, 7] },
    { label: 'Negative values [-5, 10, -20, 0, 15]', input: [-5, 10, -20, 0, 15] },
    { label: 'Two elements unsorted [9, 3]', input: [9, 3] },
    { label: 'Two elements sorted [3, 9]', input: [3, 9] },
  ];

  for (const tc of testCases) {
    try {
      const steps = fn([...tc.input]);
      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        findings.push({
          algorithm: name,
          testCase: tc.label,
          type: 'ZERO_STEPS',
          details: `Generated 0 steps. Total steps = ${steps?.length || 0}.`,
        });
        continue;
      }

      // Check if last step is actually sorted
      const lastStep = steps[steps.length - 1];
      const result = Array.isArray(lastStep?.state)
        ? lastStep.state
        : (lastStep?.state?.array || null);
      if (result && Array.isArray(result)) {
        const expected = [...tc.input].sort((a, b) => a - b);
        if (tc.input.length > 0 && !(name.includes('Counting') || name.includes('Radix')) || !tc.label.includes('Negative')) {
          const isSorted = result.every((val: any, idx: number) => idx === 0 || val >= result[idx - 1]);
          if (!isSorted && expected.length === result.length) {
            findings.push({
              algorithm: name,
              testCase: tc.label,
              type: 'INCORRECT_RESULT',
              details: `Final step state is NOT sorted: [${result.join(', ')}], expected: [${expected.join(', ')}]`,
            });
          }
        }
      }

      // Check for NaN or undefined in steps
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const sArr = Array.isArray(step.state) ? step.state : (step.state?.array || null);
        if (sArr && Array.isArray(sArr)) {
          if (sArr.some((v: any) => v === undefined || (typeof v === 'number' && isNaN(v)))) {
            findings.push({
              algorithm: name,
              testCase: tc.label,
              type: 'NAN_UNDEFINED_DATA',
              details: `Step ${i} contains NaN or undefined: ${JSON.stringify(sArr)}`,
            });
            break;
          }
        }
      }
    } catch (err: any) {
      findings.push({
        algorithm: name,
        testCase: tc.label,
        type: 'CRASH',
        details: `Threw exception: ${err?.message || String(err)}`,
      });
    }
  }
}

function checkSearching(name: string, fn: (arr: number[], target: number) => any[]) {
  const testCases = [
    { label: 'Empty array []', input: [], target: 42 },
    { label: 'Single element found [42]', input: [42], target: 42 },
    { label: 'Single element not found [42]', input: [42], target: 99 },
    { label: 'Target at start [10, 20, 30]', input: [10, 20, 30], target: 10 },
    { label: 'Target at end [10, 20, 30]', input: [10, 20, 30], target: 30 },
    { label: 'Target not found [10, 20, 30]', input: [10, 20, 30], target: 99 },
    { label: 'Target smaller than min [10, 20, 30]', input: [10, 20, 30], target: 5 },
    { label: 'Duplicate targets [10, 20, 20, 30]', input: [10, 20, 20, 30], target: 20 },
  ];

  for (const tc of testCases) {
    try {
      const steps = fn([...tc.input], tc.target);
      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        findings.push({
          algorithm: name,
          testCase: tc.label,
          type: 'ZERO_STEPS',
          details: `Generated 0 steps. Total steps = ${steps?.length || 0}.`,
        });
      }
    } catch (err: any) {
      findings.push({
        algorithm: name,
        testCase: tc.label,
        type: 'CRASH',
        details: `Threw exception: ${err?.message || String(err)}`,
      });
    }
  }
}

function checkBST() {
  const testCases = [
    { label: 'Empty keys []', keys: [], target: 42 },
    { label: 'Single key [42]', keys: [42], target: 42 },
    { label: 'Target non-existent', keys: [50, 30, 70], target: 99 },
    { label: 'Skewed right tree [10, 20, 30, 40, 50]', keys: [10, 20, 30, 40, 50], target: 30 },
    { label: 'Skewed left tree [50, 40, 30, 20, 10]', keys: [50, 40, 30, 20, 10], target: 20 },
    { label: 'Duplicate keys [50, 30, 50, 70]', keys: [50, 30, 50, 70], target: 50 },
  ];

  for (const tc of testCases) {
    try {
      const steps = generateBSTSteps(tc.keys, tc.target);
      if (!steps || steps.length === 0) {
        findings.push({
          algorithm: 'BST',
          testCase: tc.label,
          type: 'ZERO_STEPS',
          details: `Generated 0 steps.`,
        });
      }
    } catch (err: any) {
      findings.push({
        algorithm: 'BST',
        testCase: tc.label,
        type: 'CRASH',
        details: `Threw exception: ${err?.message || String(err)}`,
      });
    }
  }
}

function checkLinkedList() {
  const operations: any[] = [
    { type: 'append', val: 99 },
    { type: 'prepend', val: 5 },
    { type: 'insert', val: 50, index: 1 },
    { type: 'insert', val: 50, index: 0 },
    { type: 'insert', val: 50, index: 999 }, // Out of bounds
    { type: 'delete', val: 10 },
    { type: 'delete', val: 999 }, // Non-existent
    { type: 'reverse' },
    { type: 'search', val: 20 },
    { type: 'search', val: 999 }, // Non-existent
  ];

  for (const op of operations) {
    // Test with normal array
    try {
      const steps = generateLinkedListSteps([10, 20, 30], op);
      if (!steps || steps.length === 0) {
        findings.push({
          algorithm: 'LinkedList',
          testCase: `Op: ${op.type} on [10, 20, 30]`,
          type: 'ZERO_STEPS',
          details: `Generated 0 steps.`,
        });
      }
    } catch (err: any) {
      findings.push({
        algorithm: 'LinkedList',
        testCase: `Op: ${op.type} on [10, 20, 30]`,
        type: 'CRASH',
        details: `Threw exception: ${err?.message || String(err)}`,
      });
    }

    // Test with empty array
    try {
      const steps = generateLinkedListSteps([], op);
      if (!steps || steps.length === 0) {
        findings.push({
          algorithm: 'LinkedList',
          testCase: `Op: ${op.type} on empty []`,
          type: 'ZERO_STEPS',
          details: `Generated 0 steps.`,
        });
      }
    } catch (err: any) {
      findings.push({
        algorithm: 'LinkedList',
        testCase: `Op: ${op.type} on empty []`,
        type: 'CRASH',
        details: `Threw exception: ${err?.message || String(err)}`,
      });
    }

    // Test with single element array
    try {
      const steps = generateLinkedListSteps([42], op);
      if (!steps || steps.length === 0) {
        findings.push({
          algorithm: 'LinkedList',
          testCase: `Op: ${op.type} on single [42]`,
          type: 'ZERO_STEPS',
          details: `Generated 0 steps.`,
        });
      }
    } catch (err: any) {
      findings.push({
        algorithm: 'LinkedList',
        testCase: `Op: ${op.type} on single [42]`,
        type: 'CRASH',
        details: `Threw exception: ${err?.message || String(err)}`,
      });
    }
  }
}

function checkGraphs() {
  // BFS
  try {
    const steps = generateBFSSteps();
    if (!steps || steps.length === 0) {
      findings.push({ algorithm: 'BFS', testCase: 'Default', type: 'ZERO_STEPS', details: '0 steps' });
    }
  } catch (err: any) {
    findings.push({ algorithm: 'BFS', testCase: 'Default', type: 'CRASH', details: err?.message || String(err) });
  }

  // DFS
  try {
    const steps = generateDFSSteps('A');
    if (!steps || steps.length === 0) {
      findings.push({ algorithm: 'DFS', testCase: 'Start A', type: 'ZERO_STEPS', details: '0 steps' });
    }
  } catch (err: any) {
    findings.push({ algorithm: 'DFS', testCase: 'Start A', type: 'CRASH', details: err?.message || String(err) });
  }

  // Dijkstra
  try {
    const steps = generateDijkstraSteps('A');
    if (!steps || steps.length === 0) {
      findings.push({ algorithm: 'Dijkstra', testCase: 'Start A', type: 'ZERO_STEPS', details: '0 steps' });
    }
  } catch (err: any) {
    findings.push({ algorithm: 'Dijkstra', testCase: 'Start A', type: 'CRASH', details: err?.message || String(err) });
  }

  // Invalid start node
  try {
    const steps = generateDFSSteps('NON_EXISTENT');
    if (!steps || steps.length === 0) {
      findings.push({ algorithm: 'DFS', testCase: 'Non-existent start node', type: 'ZERO_STEPS', details: '0 steps' });
    }
  } catch (err: any) {
    findings.push({ algorithm: 'DFS', testCase: 'Non-existent start node', type: 'CRASH', details: err?.message || String(err) });
  }

  try {
    const steps = generateDijkstraSteps('NON_EXISTENT');
    if (!steps || steps.length <= 1) {
      findings.push({ algorithm: 'Dijkstra', testCase: 'Non-existent start node', type: 'ZERO_STEPS', details: 'Less than 2 steps generated' });
    }
  } catch (err: any) {
    findings.push({ algorithm: 'Dijkstra', testCase: 'Non-existent start node', type: 'CRASH', details: err?.message || String(err) });
  }
}

function checkDP() {
  const fibCases = [0, 1, 2, 7, -1, 15];
  for (const n of fibCases) {
    try {
      const steps = generateFibonacciDpSteps(n);
      if (!steps || steps.length === 0) {
        findings.push({ algorithm: 'Fibonacci DP', testCase: `n=${n}`, type: 'ZERO_STEPS', details: '0 steps' });
      }
    } catch (err: any) {
      findings.push({ algorithm: 'Fibonacci DP', testCase: `n=${n}`, type: 'CRASH', details: err?.message || String(err) });
    }
  }
}

function runAudit() {
  console.log('--- AUDITING SORTING ALGORITHMS ---');
  checkSorting('Merge Sort', generateMergeSortSteps);
  checkSorting('Bubble Sort', generateBubbleSortSteps);
  checkSorting('Selection Sort', generateSelectionSortSteps);
  checkSorting('Insertion Sort', generateInsertionSortSteps);
  checkSorting('Quick Sort', generateQuickSortSteps);
  checkSorting('Heap Sort', generateHeapSortSteps);
  checkSorting('Counting Sort', generateCountingSortSteps);
  checkSorting('Radix Sort', generateRadixSortSteps);

  console.log('--- AUDITING SEARCHING ALGORITHMS ---');
  checkSearching('Linear Search', generateLinearSearchSteps);
  checkSearching('Binary Search', generateBinarySearchSteps);
  checkSearching('Ternary Search', generateTernarySearchSteps);

  console.log('--- AUDITING BST ---');
  checkBST();

  console.log('--- AUDITING LINKED LIST ---');
  checkLinkedList();

  console.log('--- AUDITING GRAPHS ---');
  checkGraphs();

  console.log('--- AUDITING DP ---');
  checkDP();

  console.log('\n=== AUDIT RESULTS ===');
  console.log(`Total Findings: ${findings.length}`);
  console.log(JSON.stringify(findings, null, 2));
}

runAudit();

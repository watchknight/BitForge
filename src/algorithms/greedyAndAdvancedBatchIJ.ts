import { Step, HighlightRole } from '../types/simulation';
import { TreeNode } from '../engine/renderers/TreeRenderer';
import { Language } from '../types/topic';

// ==========================================
// BATCH I: 1. ACTIVITY SELECTION
// ==========================================
export const activitySelectionSnippets: Record<Language, string> = {
  python: `def activity_selection(activities):
    # Sort activities by finish time
    activities.sort(key=lambda x: x[1])
    selected = [activities[0]]
    last_end = activities[0][1]
    for start, end in activities[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    return selected`,

  cpp: `vector<pair<int, int>> activitySelection(vector<pair<int, int>>& act) {
    sort(act.begin(), act.end(), [](auto& a, auto& b) { return a.second < b.second; });
    vector<pair<int, int>> selected = { act[0] };
    int lastEnd = act[0].second;
    for (size_t i = 1; i < act.size(); ++i) {
        if (act[i].first >= lastEnd) {
            selected.push_back(act[i]);
            lastEnd = act[i].second;
        }
    }
    return selected;
}`,

  javascript: `function activitySelection(activities) {
  activities.sort((a, b) => a[1] - b[1]);
  const selected = [activities[0]];
  let lastEnd = activities[0][1];
  for (let i = 1; i < activities.length; i++) {
    if (activities[i][0] >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i][1];
    }
  }
  return selected;
}`
};

export function generateActivitySelectionSteps(): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;

  // Activities represented by their finish times: [2, 4, 6, 7, 9]
  const finishTimes = [2, 4, 6, 7, 9];
  const startTimes = [1, 3, 0, 5, 8];

  steps.push({
    id: stepId++,
    state: [...finishTimes],
    highlights: {},
    description: `Activity Selection (Greedy). Activities pre-sorted by finish times: [1-2], [3-4], [0-6], [5-7], [8-9]. Goal: maximize number of non-overlapping activities.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { count: 5 } },
  });

  // Pick first
  steps.push({
    id: stepId++,
    state: [...finishTimes],
    highlights: { 0: 'sorted' },
    pointers: { picked: 0 },
    description: `Greedy choice: Select activity 0 ([1..2]) that finishes earliest. Last finish time = 2.`,
    codeLine: 4,
    explanation: { action: 'SELECT ACTIVITY', variables: { activity: '[1..2]', finish: 2 } },
  });

  // Pick second
  steps.push({
    id: stepId++,
    state: [...finishTimes],
    highlights: { 0: 'sorted', 1: 'sorted' },
    pointers: { picked: 1 },
    description: `Activity 1 ([3..4]) starts at 3 >= 2. Compatible! Selected. Last finish time = 4.`,
    codeLine: 7,
    explanation: { action: 'SELECT ACTIVITY', variables: { activity: '[3..4]', finish: 4 } },
  });

  // Reject third
  steps.push({
    id: stepId++,
    state: [...finishTimes],
    highlights: { 0: 'sorted', 1: 'sorted', 2: 'danger' },
    pointers: { conflict: 2 },
    description: `Activity 2 ([0..6]) starts at 0 < 4. Conflict with active schedule! Skipped.`,
    codeLine: 6,
    explanation: { action: 'REJECT OVERLAP', variables: { conflictActivity: '[0..6]' } },
  });

  // Pick fourth
  steps.push({
    id: stepId++,
    state: [...finishTimes],
    highlights: { 0: 'sorted', 1: 'sorted', 3: 'sorted' },
    pointers: { picked: 3 },
    description: `Activity 3 ([5..7]) starts at 5 >= 4. Compatible! Selected. Last finish time = 7.`,
    codeLine: 7,
    explanation: { action: 'SELECT ACTIVITY', variables: { activity: '[5..7]', finish: 7 } },
  });

  return steps;
}

// ==========================================
// BATCH I: 2. HUFFMAN CODING
// ==========================================
export function generateHuffmanCodingSteps(): Step<{ root: TreeNode | null }>[] {
  const steps: Step<{ root: TreeNode | null }>[] = [];
  let stepId = 1;

  const huffTree: TreeNode = {
    id: 'huff-root',
    val: 'ROOT (freq: 100)',
    left: {
      id: 'huff-a',
      val: "'A' (freq: 45, code: 0)",
    },
    right: {
      id: 'huff-int',
      val: 'freq: 55',
      left: {
        id: 'huff-b',
        val: "'B' (freq: 25, code: 10)",
      },
      right: {
        id: 'huff-c',
        val: "'C' (freq: 30, code: 11)",
      },
    },
  };

  steps.push({
    id: stepId++,
    state: { root: huffTree },
    highlights: { 'huff-root': 'sorted' },
    description: `Huffman Coding Tree. Characters sorted by frequency. Greedily combines the lowest frequency nodes first to minimize average code length for data compression.`,
    codeLine: 1,
    explanation: { action: 'INSPECT HUFFMAN TREE', variables: { compression: 'Lossless prefix codes' } },
  });

  return steps;
}

// ==========================================
// BATCH J: 1. UNION-FIND (DISJOINT SET UNION)
// ==========================================
export const unionFindSnippets: Record<Language, string> = {
  python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x]) # Path compression
        return self.parent[x]

    def union(self, x, y):
        rootX = self.find(x)
        rootY = self.find(y)
        if rootX != rootY:
            if self.rank[rootX] < self.rank[rootY]:
                self.parent[rootX] = rootY
            elif self.rank[rootX] > self.rank[rootY]:
                self.parent[rootY] = rootX
            else:
                self.parent[rootY] = rootX
                self.rank[rootX] += 1
            return True
        return False`,

  cpp: `class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;
        if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
        else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
        else { parent[rootY] = rootX; rank[rootX]++; }
        return true;
    }
};`,

  javascript: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  union(x, y) {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx !== ry) {
      if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
      else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
      else { this.parent[ry] = rx; this.rank[rx]++; }
      return true;
    }
    return false;
  }
}`
};

export function generateUnionFindSteps(): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;

  // Parent array for 5 elements: initially parent[i] = i
  const parent = [0, 1, 2, 3, 4];

  steps.push({
    id: stepId++,
    state: [...parent],
    highlights: {},
    description: `Union-Find (Disjoint Set) with 5 nodes. Initially, each node is its own representative root parent: parent[i] = i.`,
    codeLine: 3,
    explanation: { action: 'INITIALIZE', variables: { elements: 5 } },
  });

  // Union(0, 1)
  parent[1] = 0;
  steps.push({
    id: stepId++,
    state: [...parent],
    highlights: { 0: 'sorted', 1: 'active' },
    pointers: { root: 0, child: 1 },
    description: `union(0, 1): Root of 1 is connected to Root of 0. parent[1] is now 0. Component {0, 1} formed.`,
    codeLine: 16,
    explanation: { action: 'UNION SETS', variables: { merged: '0 and 1' } },
  });

  // Union(2, 3)
  parent[3] = 2;
  steps.push({
    id: stepId++,
    state: [...parent],
    highlights: { 2: 'sorted', 3: 'active' },
    pointers: { root: 2, child: 3 },
    description: `union(2, 3): parent[3] = 2. Component {2, 3} formed.`,
    codeLine: 16,
    explanation: { action: 'UNION SETS', variables: { merged: '2 and 3' } },
  });

  // Union({0,1}, {2,3})
  parent[2] = 0;
  steps.push({
    id: stepId++,
    state: [...parent],
    highlights: { 0: 'sorted', 1: 'sorted', 2: 'active', 3: 'sorted' },
    pointers: { grandRoot: 0 },
    description: `union(1, 3): Finds root(1)=0 and root(3)=2. Connects root 2 to root 0! Nearly-constant α(N) time via rank & path compression.`,
    codeLine: 17,
    explanation: { action: 'UNION BY RANK', variables: { newGrandRoot: 0 } },
  });

  return steps;
}

// ==========================================
// BATCH J: 2. KMP STRING MATCHING
// ==========================================
export function generateKMPSteps(): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;

  // LPS array for pattern "A B A B C"
  const lps = [0, 0, 1, 2, 0];

  steps.push({
    id: stepId++,
    state: [...lps],
    highlights: {},
    description: `Knuth-Morris-Pratt (KMP) Longest Prefix Suffix (LPS) table for pattern "ABABC". LPS avoids resetting text pointer when mismatches occur.`,
    codeLine: 2,
    explanation: { action: 'BUILD LPS TABLE', variables: { pattern: 'ABABC' } },
  });

  steps.push({
    id: stepId++,
    state: [...lps],
    highlights: { 2: 'active', 3: 'sorted' },
    pointers: { matchLength: 2 },
    description: `At index 3 ("ABAB"), prefix "AB" matches suffix "AB". LPS[3] = 2. On mismatch at index 4, fall back to index 2 in O(1) time without re-scanning text!`,
    codeLine: 5,
    explanation: { action: 'LPS JUMP', variables: { fallbackIndex: 2 } },
  });

  return steps;
}

// ==========================================
// BATCH J: 3. BIT MANIPULATION BASICS
// ==========================================
export function generateBitManipulationSteps(): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;

  // 8-bit representation of 42 (00101010)
  const bits = [0, 0, 1, 0, 1, 0, 1, 0];

  steps.push({
    id: stepId++,
    state: [...bits],
    highlights: {},
    description: `Bit Manipulation: Number 42 in binary (8-bit): 00101010. Bits represent powers of 2 (128, 64, 32, 16, 8, 4, 2, 1). 32 + 8 + 2 = 42.`,
    codeLine: 1,
    explanation: { action: 'INITIALIZE BITS', variables: { decimal: 42, binary: '00101010' } },
  });

  // Check bit at index 3 (power 16)
  steps.push({
    id: stepId++,
    state: [...bits],
    highlights: { 3: 'comparing' },
    pointers: { checkBit: 3 },
    description: `Testing if bit 4 (value 16) is set: (42 >> 4) & 1 = 0. Bit is 0 (OFF). Constant O(1) hardware operation!`,
    codeLine: 3,
    explanation: { action: 'TEST BIT', variables: { bitIndex: 4, isSet: false } },
  });

  // Set bit at index 0 (value 128)
  bits[0] = 1;
  steps.push({
    id: stepId++,
    state: [...bits],
    highlights: { 0: 'sorted' },
    pointers: { setBit: 0 },
    description: `Set bit 7 (value 128): 42 | (1 << 7) = 170 (10101010). Bit turned ON in a single CPU cycle.`,
    codeLine: 5,
    explanation: { action: 'SET BIT', variables: { newDecimal: 170, binary: '10101010' } },
  });

  return steps;
}

export const huffmanCodingSnippets: Record<Language, string> = {
  python: `import heapq

def build_huffman_tree(frequencies):
    heap = [[weight, [symbol, ""]] for symbol, weight in frequencies.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]: pair[1] = '0' + pair[1]
        for pair in hi[1:]: pair[1] = '1' + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return sorted(heapq.heappop(heap)[1:], key=lambda p: (len(p[-1]), p))`,

  cpp: `// Huffman Coding creates optimal prefix codes using a Min-Heap
struct HuffmanNode {
    char data;
    unsigned freq;
    HuffmanNode *left, *right;
};`,

  javascript: `function buildHuffmanTree(charFreqs) {
  // Greedily combine two nodes with lowest frequencies
  const nodes = Object.entries(charFreqs).map(([char, freq]) => ({ char, freq }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({ freq: left.freq + right.freq, left, right });
  }
  return nodes[0];
}`
};

export const kmpSnippets: Record<Language, string> = {
  python: `def build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps`,

  cpp: `vector<int> computeLPS(string pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else if (len != 0) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}`,

  javascript: `function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0, i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }
  return lps;
}`
};

export const bitManipulationSnippets: Record<Language, string> = {
  python: `# Bit Manipulation Tricks:
# 1. Check if bit is set: (n >> k) & 1
# 2. Set bit: n | (1 << k)
# 3. Clear bit: n & ~(1 << k)
# 4. Toggle bit: n ^ (1 << k)
# 5. Check power of 2: n > 0 and (n & (n - 1)) == 0`,

  cpp: `// Bit Manipulation Tricks:
// 1. Check k-th bit: (n >> k) & 1
// 2. Set k-th bit: n | (1 << k)
// 3. Clear k-th bit: n & ~(1 << k)
// 4. Toggle k-th bit: n ^ (1 << k)
// 5. Lowest set bit: n & (-n)`,

  javascript: `// Bit Manipulation in JS
const isBitSet = (n, k) => (n >> k) & 1;
const setBit = (n, k) => n | (1 << k);
const clearBit = (n, k) => n & ~(1 << k);
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;`
};

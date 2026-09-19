import { Step, HighlightRole } from '../types/simulation';
import { TreeNode } from '../engine/renderers/TreeRenderer';
import { Language } from '../types/topic';

// ==========================================
// 1. AVL TREE (SELF-BALANCING ROTATIONS)
// ==========================================
export const avlTreeSnippets: Record<Language, string> = {
  python: `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

def right_rotate(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    return x

def left_rotate(x):
    y = x.right
    T2 = y.left
    y.left = x
    x.right = T2
    return y`,

  cpp: `struct AVLNode {
    int val, height;
    AVLNode *left, *right;
    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};

AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    return x;
}

AVLNode* leftRotate(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    return y;
}`,

  javascript: `function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  return x;
}

function leftRotate(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  return y;
}`
};

export function generateAVLTreeSteps(): Step<{ root: TreeNode | null; traversalList?: number[] }>[] {
  const steps: Step<{ root: TreeNode | null; traversalList?: number[] }>[] = [];
  let stepId = 1;

  // Initial unbalanced state after inserting 30, 20, 10 (Left-Left violation)
  const initialTree: TreeNode = {
    id: 'node-30',
    val: '30 (BF=+2)',
    left: {
      id: 'node-20',
      val: '20 (BF=+1)',
      left: {
        id: 'node-10',
        val: '10 (BF=0)',
      },
    },
  };

  steps.push({
    id: stepId++,
    state: { root: initialTree },
    highlights: { 'node-30': 'danger' },
    description: `Inserted keys [30, 20, 10]. Node 30 has Balance Factor = Height(Left) - Height(Right) = 2 - 0 = +2. An imbalance (Left-Left case) has occurred!`,
    codeLine: 8,
    explanation: { action: 'DETECT IMBALANCE', variables: { node: 30, balanceFactor: '+2', case: 'Left-Left (LL)' } },
  });

  steps.push({
    id: stepId++,
    state: { root: initialTree },
    highlights: { 'node-30': 'comparing', 'node-20': 'active' },
    description: `Executing Right Rotation around pivot node 30. Left child (20) will become the new root of this subtree.`,
    codeLine: 10,
    explanation: { action: 'ROTATE RIGHT', variables: { pivot: 30, newRoot: 20 } },
  });

  const balancedTree: TreeNode = {
    id: 'node-20',
    val: '20 (BF=0)',
    left: {
      id: 'node-10',
      val: '10 (BF=0)',
    },
    right: {
      id: 'node-30',
      val: '30 (BF=0)',
    },
  };

  steps.push({
    id: stepId++,
    state: { root: balancedTree },
    highlights: { 'node-20': 'sorted', 'node-10': 'sorted', 'node-30': 'sorted' },
    description: `Right Rotation complete! Node 20 is now root; height is strictly balanced at 2. AVL property restored in O(1) rotation time.`,
    codeLine: 14,
    explanation: { action: 'BALANCED', variables: { treeHeight: 2, balanced: true } },
  });

  return steps;
}

// ==========================================
// 2. MIN-HEAP / MAX-HEAP (COMPLETE TREE)
// ==========================================
export function generateHeapTreeSteps(): Step<{ root: TreeNode | null }>[] {
  const steps: Step<{ root: TreeNode | null }>[] = [];
  let stepId = 1;

  const heapTree: TreeNode = {
    id: 'h-90',
    val: 90,
    left: {
      id: 'h-80',
      val: 80,
      left: { id: 'h-40', val: 40 },
      right: { id: 'h-50', val: 50 },
    },
    right: {
      id: 'h-70',
      val: 70,
      left: { id: 'h-60', val: 60 },
      right: { id: 'h-20', val: 20 },
    },
  };

  steps.push({
    id: stepId++,
    state: { root: heapTree },
    highlights: { 'h-90': 'pivot' },
    description: `Binary Max-Heap visualized as a complete binary tree. Notice that every parent is strictly greater than or equal to both its children.`,
    codeLine: 2,
    explanation: { action: 'INSPECT HEAP', variables: { rootMax: 90, totalNodes: 7 } },
  });

  return steps;
}

// ==========================================
// 3. TRIE (PREFIX TREE)
// ==========================================
export function generateTrieSteps(): Step<{ root: TreeNode | null }>[] {
  const steps: Step<{ root: TreeNode | null }>[] = [];
  let stepId = 1;

  const trieTree: TreeNode = {
    id: 'root',
    val: 'ROOT',
    left: {
      id: 'node-c',
      val: "'c'",
      left: {
        id: 'node-a',
        val: "'a'",
        left: {
          id: 'node-t',
          val: "'t' (END)",
        },
        right: {
          id: 'node-r',
          val: "'r' (END)",
        },
      },
    },
    right: {
      id: 'node-d',
      val: "'d'",
      left: {
        id: 'node-o',
        val: "'o'",
        left: {
          id: 'node-g',
          val: "'g' (END)",
        },
      },
    },
  };

  steps.push({
    id: stepId++,
    state: { root: trieTree },
    highlights: {},
    description: `Trie (Prefix Tree) containing words: "cat", "car", and "dog". Searching for any word takes O(L) time where L is word length, regardless of dictionary size!`,
    codeLine: 1,
    explanation: { action: 'INITIALIZE TRIE', variables: { wordsCount: 3, keys: 'cat, car, dog' } },
  });

  steps.push({
    id: stepId++,
    state: { root: trieTree },
    highlights: { 'node-c': 'active', 'node-a': 'active', 'node-r': 'sorted' },
    description: `Prefix search for "car": follows edge 'c' -> 'a' -> 'r'. Reached terminal node. Word found in exactly 3 character transitions!`,
    codeLine: 5,
    explanation: { action: 'PREFIX LOOKUP', variables: { query: 'car', found: true } },
  });

  return steps;
}

// ==========================================
// 4. SEGMENT TREE
// ==========================================
export function generateSegmentTreeSteps(): Step<{ root: TreeNode | null }>[] {
  const steps: Step<{ root: TreeNode | null }>[] = [];
  let stepId = 1;

  const segTree: TreeNode = {
    id: 'seg-03',
    val: '[0..3]: 24',
    left: {
      id: 'seg-01',
      val: '[0..1]: 9',
      left: { id: 'seg-00', val: '[0]: 4' },
      right: { id: 'seg-11', val: '[1]: 5' },
    },
    right: {
      id: 'seg-23',
      val: '[2..3]: 15',
      left: { id: 'seg-22', val: '[2]: 7' },
      right: { id: 'seg-33', val: '[3]: 8' },
    },
  };

  steps.push({
    id: stepId++,
    state: { root: segTree },
    highlights: {},
    description: `Segment Tree built over array [4, 5, 7, 8]. Every node stores the pre-computed sum for its sub-interval. Supports range sum queries in O(log N) time.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE SEGMENT TREE', variables: { totalSum: 24, intervals: '[0..3]' } },
  });

  steps.push({
    id: stepId++,
    state: { root: segTree },
    highlights: { 'seg-01': 'comparing', 'seg-22': 'comparing' },
    description: `Range query: Sum for index range [1..2]. Combines partial overlap [1] (5) and [2] (7) = 12 in O(log N) steps.`,
    codeLine: 6,
    explanation: { action: 'RANGE QUERY', variables: { queryRange: '[1..2]', answer: 12 } },
  });

  return steps;
}

// ==========================================
// 5. FENWICK TREE (BINARY INDEXED TREE)
// ==========================================
export const fenwickTreeSnippets: Record<Language, string> = {
  python: `class FenwickTree:
    def __init__(self, size):
        self.tree = [0] * (size + 1)

    def update(self, i, delta):
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & (-i)  # Add least significant bit

    def query(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)  # Strip least significant bit
        return s`,

  cpp: `class FenwickTree {
    vector<int> tree;
public:
    FenwickTree(int n) : tree(n + 1, 0) {}

    void update(int i, int delta) {
        for (; i < tree.size(); i += i & (-i))
            tree[i] += delta;
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }
};`,

  javascript: `class FenwickTree {
  constructor(size) {
    this.tree = new Array(size + 1).fill(0);
  }
  update(i, delta) {
    while (i < this.tree.length) {
      this.tree[i] += delta;
      i += i & (-i);
    }
  }
  query(i) {
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & (-i);
    }
    return sum;
  }
}`
};

export function generateFenwickTreeSteps(): Step<{ root: TreeNode | null }>[] {
  const steps: Step<{ root: TreeNode | null }>[] = [];
  let stepId = 1;

  const bitTree: TreeNode = {
    id: 'bit-root',
    val: 'BIT Root (idx 0)',
    left: {
      id: 'bit-4',
      val: 'Tree[4] (Sum 1..4): 20',
      left: {
        id: 'bit-2',
        val: 'Tree[2] (Sum 1..2): 7',
        left: { id: 'bit-1', val: 'Tree[1]: 3' },
      },
      right: {
        id: 'bit-3',
        val: 'Tree[3]: 5',
      },
    },
  };

  steps.push({
    id: stepId++,
    state: { root: bitTree },
    highlights: {},
    description: `Fenwick Tree (Binary Indexed Tree) over array [3, 4, 5, 8]. Space-efficient O(N) array supporting prefix sums and updates in O(log N) via bitwise isolation (i & -i).`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE FENWICK TREE', variables: { size: 4, bitLogic: 'i & (-i)' } },
  });

  steps.push({
    id: stepId++,
    state: { root: bitTree },
    highlights: { 'bit-4': 'comparing' },
    description: `Query prefix sum up to index 4: Read tree[4] (20). Since 4 - (4 & -4) = 0, terminates in 1 hop! Prefix sum = 20.`,
    codeLine: 13,
    explanation: { action: 'PREFIX QUERY', variables: { index: 4, sum: 20 } },
  });

  steps.push({
    id: stepId++,
    state: { root: bitTree },
    highlights: { 'bit-1': 'active', 'bit-2': 'active', 'bit-4': 'active' },
    description: `Point Update at index 1 (+2): Updates tree[1], then 1+(1&-1)=2 (tree[2]), then 2+(2&-2)=4 (tree[4]). Logarithmic O(log N) ripple!`,
    codeLine: 6,
    explanation: { action: 'POINT UPDATE', variables: { updatedIndex: 1, delta: '+2' } },
  });

  return steps;
}

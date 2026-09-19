import { Step, HighlightRole } from '../types/simulation';
import { TreeNode } from '../engine/renderers/TreeRenderer';
import { Language } from '../types/topic';

export interface BSTSimulationState {
  root: TreeNode | null;
  traversalList: number[];
}

export const bstSnippets: Record<Language, string> = {
  python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def inorder_traversal(root, result=None):
    if result is None:
        result = []
    if root:
        inorder_traversal(root.left, result)
        result.append(root.val)
        inorder_traversal(root.right, result)
    return result`,

  cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) {
        return new TreeNode(val);
    }
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    return root;
}

void inorderTraversal(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorderTraversal(root->left, result);
    result.push_back(root->val);
    inorderTraversal(root->right, result);
}`,

  javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function insert(root, val) {
  if (!root) {
    return new TreeNode(val);
  }
  if (val < root.val) {
    root.left = insert(root.left, val);
  } else if (val > root.val) {
    root.right = insert(root.right, val);
  }
  return root;
}

function inorderTraversal(root, result = []) {
  if (root) {
    inorderTraversal(root.left, result);
    result.push(root.val);
    inorderTraversal(root.right, result);
  }
  return result;
}`
};

// Deep clone tree helper
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    id: node.id,
    val: node.val,
    left: cloneTree(node.left ?? null),
    right: cloneTree(node.right ?? null),
  };
}

export function generateBSTSteps(
  initialKeys: number[] = [50, 30, 70, 20, 40, 60, 80],
  insertKey: number = 45
): Step<BSTSimulationState>[] {
  const steps: Step<BSTSimulationState>[] = [];
  let stepId = 1;

  // Build initial tree
  let treeRoot: TreeNode | null = null;
  for (const k of initialKeys) {
    treeRoot = insertPure(treeRoot, k);
  }

  function insertPure(node: TreeNode | null, val: number): TreeNode {
    if (!node) return { id: `node-${val}`, val, left: null, right: null };
    if (val < Number(node.val)) {
      node.left = insertPure(node.left ?? null, val);
    } else if (val > Number(node.val)) {
      node.right = insertPure(node.right ?? null, val);
    }
    return node;
  }

  // Initial step
  steps.push({
    id: stepId++,
    state: { root: cloneTree(treeRoot), traversalList: [] },
    highlights: {},
    description: `Binary Search Tree initialized with ${initialKeys.length} keys: [${initialKeys.join(
      ', '
    )}]. Property: for every node, left subtree < node < right subtree. Preparing to insert key ${insertKey}.`,
    codeLine: 7,
    explanation: { action: 'INITIALIZE', variables: { insertKey, rootVal: treeRoot?.val ?? 'null' } },
  });

  // Step through insertion of insertKey
  let curr = treeRoot;
  let parent: TreeNode | null = null;
  let isLeftChild = false;

  while (curr) {
    // Compare step
    const isSmaller = insertKey < Number(curr.val);
    const compHl: Record<string | number, HighlightRole> = { [curr.id]: 'comparing' as HighlightRole };

    steps.push({
      id: stepId++,
      state: { root: cloneTree(treeRoot), traversalList: [] },
      highlights: compHl,
      pointers: { curr: curr.id },
      description: `Comparing insertKey (${insertKey}) with current node ${curr.val}. Since ${insertKey} ${
        isSmaller ? '<' : '>'
      } ${curr.val}, we must move to the ${isSmaller ? 'LEFT' : 'RIGHT'} child.`,
      codeLine: isSmaller ? 10 : 12,
      explanation: {
        action: 'COMPARE KEY',
        variables: { insertKey, currNode: curr.val, branch: isSmaller ? 'LEFT' : 'RIGHT' },
      },
    });

    parent = curr;
    if (isSmaller) {
      isLeftChild = true;
      if (!curr.left) break;
      curr = curr.left;
    } else {
      isLeftChild = false;
      if (!curr.right) break;
      curr = curr.right;
    }
  }

  // Insertion step
  const newNode: TreeNode = { id: `node-${insertKey}`, val: insertKey, left: null, right: null };
  if (parent) {
    if (isLeftChild) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  } else {
    treeRoot = newNode;
  }

  const newLeafHl: Record<string | number, HighlightRole> = { [newNode.id]: 'active' as HighlightRole };

  steps.push({
    id: stepId++,
    state: { root: cloneTree(treeRoot), traversalList: [] },
    highlights: newLeafHl,
    pointers: { newLeaf: newNode.id },
    description: `Found open leaf slot! Inserted new TreeNode(${insertKey}) as the ${
      isLeftChild ? 'left' : 'right'
    } child of node ${parent?.val}. O(log N) average insertion.`,
    codeLine: 8,
    explanation: {
      action: 'INSERT LEAF',
      variables: { inserted: insertKey, parent: parent?.val ?? 'root', side: isLeftChild ? 'left' : 'right' },
    },
  });

  // Now execute In-Order Traversal (Left -> Root -> Right)
  const traversalOutput: number[] = [];

  steps.push({
    id: stepId++,
    state: { root: cloneTree(treeRoot), traversalList: [] },
    highlights: {},
    description: `Now demonstrating In-Order Traversal (Left -> Root -> Right). A BST in-order traversal visits all nodes in strictly sorted ascending order!`,
    codeLine: 16,
    explanation: { action: 'START TRAVERSAL', variables: { traversalOrder: 'Left -> Root -> Right' } },
  });

  function inOrder(node: TreeNode | null) {
    if (!node) return;

    // Visit Left
    if (node.left) {
      inOrder(node.left);
    }

    // Visit Root
    traversalOutput.push(Number(node.val));
    const hl: Record<string | number, HighlightRole> = {};
    traversalOutput.forEach((v) => (hl[`node-${v}`] = 'visited'));
    hl[node.id] = 'active';

    steps.push({
      id: stepId++,
      state: { root: cloneTree(treeRoot), traversalList: [...traversalOutput] },
      highlights: hl,
      pointers: { curr: node.id },
      description: `In-Order visit: processing node ${node.val}. Added to sorted output stream! Current output: [${traversalOutput.join(
        ', '
      )}].`,
      codeLine: 20,
      explanation: {
        action: 'VISIT NODE',
        variables: { visitedNode: node.val, sortedCount: traversalOutput.length },
      },
    });

    // Visit Right
    if (node.right) {
      inOrder(node.right);
    }
  }

  inOrder(treeRoot);

  // Final step
  const finalHl: Record<string | number, HighlightRole> = {};
  traversalOutput.forEach((v) => (finalHl[`node-${v}`] = 'sorted'));

  steps.push({
    id: stepId++,
    state: { root: cloneTree(treeRoot), traversalList: [...traversalOutput] },
    highlights: finalHl,
    description: `BST In-Order Traversal Complete! All keys visited in sorted order: [${traversalOutput.join(
      ', '
    )}]. Time Complexity: O(N).`,
    codeLine: 22,
    explanation: { action: 'COMPLETE', variables: { totalKeys: traversalOutput.length } },
  });

  return steps;
}

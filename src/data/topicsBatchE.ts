import { Topic } from '../types/topic';
import { avlTreeSnippets, fenwickTreeSnippets } from '../algorithms/treesBatchE';

export const topicsBatchE: Record<string, Topic> = {
  'avl-tree': {
    id: 'avl-tree',
    title: 'AVL Self-Balancing Tree',
    subtitle: 'Rotate unbalanced branches to guarantee strictly logarithmic height',
    categoryId: 'trees',
    categoryName: 'Tree Data Structures',
    dataStructureType: 'tree',
    difficulty: 'Advanced',
    analogy: {
      title: 'The Tightrope Walker with a Balance Pole',
      story: 'Imagine walking a tightrope with a heavy pole. If the left side dips too low (imbalance), you pivot your arms (tree rotation) to level the weight out immediately. An AVL tree checks the height difference between left and right subtrees at every step. If the difference exceeds ±1, it executes an O(1) rotation to restore perfect balance.',
      keyLesson: 'Guarantees strictly O(log N) worst-case search time by preventing BSTs from degenerating into linear chains.',
    },
    defaultInput: [30, 20, 10],
    inputPlaceholder: '30, 20, 10',
    inputDescription: 'Left-Left imbalance triggers right rotation',
    complexity: {
      bestTime: 'O(log N)',
      avgTime: 'O(log N)',
      worstTime: 'O(log N) strictly guaranteed',
      space: 'O(N)',
      whyTime: 'Height is strictly bounded by 1.44 × log₂(N). All operations take at most O(height) = O(log N).',
      whySpace: 'Stores N nodes plus balance factors.',
    },
    commonMistakes: [
      {
        title: 'Confusing Single Rotations (LL, RR) with Double Rotations (LR, RL)',
        misconception: 'Applying a single right rotation when the imbalance is in a zigzag shape.',
        fix: 'Zigzag shapes (LR, RL) require two rotations: rotate child first, then rotate parent.',
      },
    ],
    quiz: [
      {
        id: 'avl-q1',
        question: 'What is the allowable range for the Balance Factor in an AVL tree node?',
        options: ['0 only', '-1, 0, or +1', '-2 to +2', 'Any positive number'],
        correctIndex: 1,
        explanation: 'Balance Factor = Height(Left) - Height(Right). If |BF| > 1, rotations are triggered immediately.',
      },
    ],
    codeSnippets: avlTreeSnippets,
    isFlagship: false,
  },

  'binary-heap': {
    id: 'binary-heap',
    title: 'Binary Heap & Priority Queue',
    subtitle: 'The complete binary tree that powers schedulers and Dijkstra',
    categoryId: 'trees',
    categoryName: 'Tree Data Structures',
    dataStructureType: 'tree',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Pyramid Tournament',
      story: 'In a martial arts tournament pyramid, the reigning champion sits at the summit. Every master is better than their two students below them. If a new challenger beats a student, they challenge the master above them, climbing upward until properly seated.',
      keyLesson: 'Because a binary heap is always a complete binary tree with no missing slots, it can be mapped into a plain 1D array without pointers!',
    },
    defaultInput: [90, 80, 70, 40, 50, 60, 20],
    inputPlaceholder: 'Heap array keys',
    inputDescription: 'Max-heap tree representation',
    complexity: {
      bestTime: 'O(1) Find Max / Min',
      avgTime: 'O(log N) Insert & Extract',
      worstTime: 'O(log N)',
      space: 'O(N)',
      whyTime: 'Tree height is always ⌊log₂(N)⌋. Bubble-up or sift-down travels along at most one root-to-leaf path.',
      whySpace: 'Packed tightly in an array without extra pointer overhead.',
    },
    commonMistakes: [
      {
        title: 'Confusing a Binary Heap with a Binary Search Tree',
        misconception: 'Assuming left child is smaller than right child in a heap.',
        fix: 'A heap only enforces parent >= children. There is NO ordering between siblings or across branches!',
      },
    ],
    quiz: [
      {
        id: 'bh-q1',
        question: 'For a node at array index `i` (0-indexed), what are the indices of its left and right children?',
        options: ['i+1 and i+2', '2i and 2i+1', '2i + 1 and 2i + 2', 'i/2 and i/2 + 1'],
        correctIndex: 2,
        explanation: 'In 0-indexed complete binary trees, left child is 2i + 1 and right child is 2i + 2.',
      },
    ],
    codeSnippets: avlTreeSnippets,
    isFlagship: false,
  },

  'trie': {
    id: 'trie',
    title: 'Prefix Tree (Trie)',
    subtitle: 'Lightning-fast autocomplete and dictionary spell checking',
    categoryId: 'trees',
    categoryName: 'Tree Data Structures',
    dataStructureType: 'tree',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Smartphone Keyboard Autocomplete',
      story: 'When you type "c-a", your phone suggests "cat", "car", "cab". It does not scan a million words in a list. It simply steps down the "c" branch, then the "a" branch, and instantly sees all branches dangling below it.',
      keyLesson: 'Search time depends ONLY on the length of the word (L), completely independent of how many millions of words exist in the dictionary!',
    },
    defaultInput: ['cat', 'car', 'dog'],
    inputPlaceholder: 'cat, car, dog',
    inputDescription: 'Words stored in Trie',
    complexity: {
      bestTime: 'O(L) where L is string length',
      avgTime: 'O(L)',
      worstTime: 'O(L)',
      space: 'O(AlphabetSize × L × N)',
      whyTime: 'Requires exactly L character transitions down the tree.',
      whySpace: 'Each node stores pointers for each possible character in the alphabet.',
    },
    commonMistakes: [
      {
        title: 'Forgetting the isEndOfWord Flag',
        misconception: 'Assuming any path represents a complete word.',
        fix: 'A word like "car" is a prefix of "carpet". Mark `is_end = true` on the "r" node to distinguish valid words.',
      },
    ],
    quiz: [
      {
        id: 'tr-q1',
        question: 'What is the search complexity of checking if a word of length L exists in a Trie of 1,000,000 words?',
        options: ['O(log N)', 'O(N)', 'O(L)', 'O(1)'],
        correctIndex: 2,
        explanation: 'Search walks exactly L character nodes down the tree, unaffected by the total dictionary size N.',
      },
    ],
    codeSnippets: avlTreeSnippets,
    isFlagship: false,
  },

  'segment-tree': {
    id: 'segment-tree',
    title: 'Segment Tree',
    subtitle: 'Answer range queries and point updates in lightning O(log N)',
    categoryId: 'trees',
    categoryName: 'Tree Data Structures',
    dataStructureType: 'tree',
    difficulty: 'Advanced',
    analogy: {
      title: 'The Regional Sales Report',
      story: 'A national company wants to know total sales between store #12 and store #87. Instead of adding 75 stores one by one, they look at regional rollup summaries: "Midwest District (50 stores) + City Central (25 stores)". By summing pre-aggregated chunks, you get the answer in 3 additions instead of 75.',
      keyLesson: 'Both range queries (e.g. range sum, range minimum) and single element updates run in O(log N) time.',
    },
    defaultInput: [4, 5, 7, 8],
    inputPlaceholder: '4, 5, 7, 8',
    inputDescription: 'Base array for Segment Tree',
    complexity: {
      bestTime: 'O(log N) Range Query & Point Update',
      avgTime: 'O(log N)',
      worstTime: 'O(log N)',
      space: 'O(4N) array size',
      whyTime: 'Any range query decomposes into at most 2 nodes per level across log₂(N) levels.',
      whySpace: 'A balanced binary segment tree requires at most 4N array nodes.',
    },
    commonMistakes: [
      {
        title: 'Allocating Insufficient Array Size',
        misconception: 'Allocating 2N array elements for a segment tree.',
        fix: 'When N is not a power of 2, the tree array requires up to 4N capacity to prevent out-of-bounds errors.',
      },
    ],
    quiz: [
      {
        id: 'st-q1',
        question: 'What is the time complexity to query a range sum on an array of size N using a Segment Tree?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
        correctIndex: 1,
        explanation: 'The query interval touches at most 4 nodes per tree level, bounding query time to O(log N).',
      },
    ],
    codeSnippets: avlTreeSnippets,
    isFlagship: false,
  },

  'fenwick-tree': {
    id: 'fenwick-tree',
    title: 'Fenwick Tree (Binary Indexed Tree)',
    subtitle: 'Lightning O(log N) prefix sums and point updates via bit manipulation tricks',
    categoryId: 'trees',
    categoryName: 'Tree Data Structures',
    dataStructureType: 'tree',
    difficulty: 'Advanced',
    analogy: {
      title: 'The Smart Odometer',
      story: 'Imagine an odometer that doesn\'t just count kilometers, but stores subtotal buckets in powers of 2. By inspecting the binary 1-bits of any target distance, you instantly know which pre-calculated odometer buckets to sum up.',
      keyLesson: 'Uses the bit trick `i & (-i)` to isolate the lowest set bit, hopping between tree nodes in strictly O(log N) time with zero extra pointer overhead.',
    },
    defaultInput: [3, 4, 5, 8],
    inputPlaceholder: '3, 4, 5, 8',
    inputDescription: 'Underlying array elements',
    complexity: {
      bestTime: 'O(log N) Prefix Sum & Point Update',
      avgTime: 'O(log N)',
      worstTime: 'O(log N)',
      space: 'O(N) contiguous array',
      whyTime: 'Number of set bits in integer N is bounded by log₂(N).',
      whySpace: 'Requires an array of size N+1, vastly more memory-compact than a 4N Segment Tree.',
    },
    commonMistakes: [
      {
        title: 'Zero Indexing Pitfall',
        misconception: 'Starting Fenwick tree updates from index 0.',
        fix: 'Fenwick Trees strictly require 1-based indexing because `0 & (-0) == 0`, which triggers an infinite loop!',
      },
    ],
    quiz: [
      {
        id: 'fen-q1',
        question: 'What bitwise operation isolates the lowest set bit in two\'s complement representation?',
        options: ['i & (i - 1)', 'i & (-i)', 'i | (-i)', 'i ^ (-i)'],
        correctIndex: 1,
        explanation: 'Due to two\'s complement arithmetic, -i flips all bits to the left of the lowest set bit, so i & (-i) isolates that bit alone.',
      },
    ],
    codeSnippets: fenwickTreeSnippets,
    isFlagship: false,
  },
};

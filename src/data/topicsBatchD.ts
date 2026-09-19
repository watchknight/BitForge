import { Topic } from '../types/topic';
import {
  factorialSnippets,
  nQueensSnippets,
  mazeSnippets,
  subsetsSnippets,
} from '../algorithms/recursionBatchD';

export const topicsBatchD: Record<string, Topic> = {
  'recursion-basics': {
    id: 'recursion-basics',
    title: 'Recursion & The Call Stack',
    subtitle: 'Solve big problems by delegating to identical smaller selves',
    categoryId: 'recursion-backtracking',
    categoryName: 'Recursion & Backtracking',
    dataStructureType: 'array',
    difficulty: 'Beginner',
    analogy: {
      title: 'Russian Matryoshka Dolls',
      story: 'Open a large wooden doll, and inside is an identical smaller doll. Open that one, and inside is a smaller one still. You continue opening dolls until you reach the tiniest solid doll that cannot be opened (the Base Case!). Now you close them back up, doll by doll, returning to where you began.',
      keyLesson: 'Every recursive call pushes an activation frame onto the hardware Call Stack. Without a base case, you trigger the dreaded Stack Overflow!',
    },
    defaultInput: 4,
    inputPlaceholder: 'e.g. 4',
    inputDescription: 'Target integer N (between 1 and 6)',
    complexity: {
      bestTime: 'O(N)',
      avgTime: 'O(N)',
      worstTime: 'O(N)',
      space: 'O(N) Call Stack Frames',
      whyTime: 'Performs N recursive calls, each doing O(1) arithmetic.',
      whySpace: 'Hardware call stack holds N activation frames simultaneously at maximum recursion depth.',
    },
    commonMistakes: [
      {
        title: 'Missing or Unreachable Base Case',
        misconception: 'Writing recursive logic without a guaranteed stopping condition.',
        fix: 'Always define and verify the base case before writing any recursive call.',
      },
    ],
    quiz: [
      {
        id: 'rec-q1',
        question: 'What happens when a recursive function calls itself indefinitely without reaching a base case?',
        options: ['Infinite loop without memory impact', 'StackOverflowError / Segmentation Fault', 'Compilation error', 'Negative number result'],
        correctIndex: 1,
        explanation: 'Every recursive call allocates a stack frame in RAM until the allocated stack memory limit is exceeded.',
      },
    ],
    codeSnippets: factorialSnippets,
    isFlagship: false,
  },

  'n-queens': {
    id: 'n-queens',
    title: 'N-Queens Backtracking',
    subtitle: 'Place non-attacking queens on a chessboard or rewind your mistakes',
    categoryId: 'recursion-backtracking',
    categoryName: 'Recursion & Backtracking',
    dataStructureType: 'grid',
    difficulty: 'Advanced',
    analogy: {
      title: 'The Chessboard Peace Treaty',
      story: 'Place 4 Queens on a 4x4 chessboard. Queens can strike in any direction across entire rows, columns, and diagonals. You place Queen 1. Then you look for a peaceful spot for Queen 2. If you paint yourself into a corner with no valid square left for Queen 3, you don\'t give up: you BACKTRACK, remove Queen 2, and try the next square over.',
      keyLesson: 'Backtracking is systematic trial-and-error: explore a promising path, and the instant a constraint fails, undo your last action and try the next alternative.',
    },
    defaultInput: 4,
    inputPlaceholder: '4',
    inputDescription: 'Standard 4-Queens chessboard',
    complexity: {
      bestTime: 'O(N!)',
      avgTime: 'O(N!)',
      worstTime: 'O(N!)',
      space: 'O(N) recursion depth + O(N²) board',
      whyTime: 'First queen has N choices, second has at most N-2, third N-4... pruned factorial search space.',
      whySpace: 'Call stack depth is bounded by row count N.',
    },
    commonMistakes: [
      {
        title: 'Forgetting to Undo the Board State (Backtrack)',
        misconception: 'Leaving `board[row][col] = 1` even after the recursive branch returns false.',
        fix: 'Always reset the state: `board[row][col] = 0` immediately after the recursive call returns.',
      },
    ],
    quiz: [
      {
        id: 'nq-q1',
        question: 'What is the hallmark operation of backtracking algorithms?',
        options: ['Binary division', 'Reverting (undoing) the state change when a branch fails', 'Sorting inputs', 'Hashing keys'],
        correctIndex: 1,
        explanation: 'Backtracking explores candidates recursively, but crucially undoes the move if it leads to a dead end.',
      },
    ],
    codeSnippets: nQueensSnippets,
    isFlagship: false,
  },

  'maze-path': {
    id: 'maze-path',
    title: 'Maze & Path Backtracking',
    subtitle: 'Find your way through labyrinthian dead ends by marking and unmarking footsteps',
    categoryId: 'recursion-backtracking',
    categoryName: 'Recursion & Backtracking',
    dataStructureType: 'grid',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Theseus and the Minotaur’s Labyrinth',
      story: 'You venture through a dark labyrinth. At every hallway branch, you walk forward and mark the floor with chalk. If you reach a brick wall dead-end, you wipe off the chalk (backtrack) and return to the intersection to explore the next passage.',
      keyLesson: 'DFS exploration with backtracking: mark current cell as visited, recursively try North/South/East/West, and unmark if no exit is reachable from this branch.',
    },
    defaultInput: '4x4',
    inputPlaceholder: '4x4 grid',
    inputDescription: '4x4 obstacle maze with Start [0,0] and Exit [3,3]',
    complexity: {
      bestTime: 'O(R × C)',
      avgTime: 'O(4^(R×C)) worst-case branching',
      worstTime: 'O(4^(R×C))',
      space: 'O(R × C) recursion call stack depth',
      whyTime: 'At every square you can branch up to 4 directions before hitting walls.',
      whySpace: 'Recursion depth equals length of longest potential path.',
    },
    commonMistakes: [
      {
        title: 'Forgetting to Mark Cells Visited',
        misconception: 'Moving back and forth between two adjacent open cells infinitely.',
        fix: 'Always mark the current cell as visited immediately upon entering.',
      },
    ],
    quiz: [
      {
        id: 'maze-q1',
        question: 'Why must visited marks be cleared when backtracking in paths that seek all solutions?',
        options: [
          'To save RAM memory',
          'So that other potential alternate paths can legally traverse through that cell',
          'To prevent compilation error',
          'To speed up CPU clock speed',
        ],
        correctIndex: 1,
        explanation: 'A cell that didn\'t work for path A might be part of an optimal route for path B from a different approach angle.',
      },
    ],
    codeSnippets: mazeSnippets,
    isFlagship: false,
  },

  'subsets-backtracking': {
    id: 'subsets-backtracking',
    title: 'Subsets & Permutations',
    subtitle: 'Systematically explore all 2^N combinations using binary decision trees',
    categoryId: 'recursion-backtracking',
    categoryName: 'Recursion & Backtracking',
    dataStructureType: 'array',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Packing a Backpack for a Hike',
      story: 'For every item on your bedroom floor (flashlight, water bottle, heavy boots), you make a binary yes/no choice: INCLUDE it in the bag or EXCLUDE it. Exploring both choices for all items generates every conceivable packing combination.',
      keyLesson: 'At each recursive level `i`, make a choice, recurse to `i+1`, then undo the choice (pop) to restore state for the other branch.',
    },
    defaultInput: [1, 2, 3],
    inputPlaceholder: '1, 2, 3',
    inputDescription: 'Array elements to generate power set (2^N subsets)',
    complexity: {
      bestTime: 'O(N × 2^N)',
      avgTime: 'O(N × 2^N)',
      worstTime: 'O(N × 2^N)',
      space: 'O(N) recursion stack',
      whyTime: 'There are exactly 2^N subsets, and copying each subset to the output list takes O(N) work.',
      whySpace: 'Maximum recursion depth is N.',
    },
    commonMistakes: [
      {
        title: 'Adding References Instead of Deep Copies',
        misconception: 'Writing `result.append(current)` in Python or JS.',
        fix: 'Because `current` is mutated in place, append a copy: `result.append(list(current))` or `[...current]`.',
      },
    ],
    quiz: [
      {
        id: 'sub-q1',
        question: 'How many total subsets exist for an array of size N?',
        options: ['N²', 'N!', '2^N', 'N log N'],
        correctIndex: 2,
        explanation: 'Each element has 2 independent states: included or excluded, yielding 2 × 2 × ... = 2^N subsets.',
      },
    ],
    codeSnippets: subsetsSnippets,
    isFlagship: false,
  },
};

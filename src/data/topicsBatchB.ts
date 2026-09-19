import { Topic } from '../types/topic';
import {
  linearSearchSnippets,
  binarySearchSnippets,
  ternarySearchSnippets,
} from '../algorithms/searchingBatchB';

export const topicsBatchB: Record<string, Topic> = {
  'linear-search': {
    id: 'linear-search',
    title: 'Linear Search',
    subtitle: 'Check every single item until you spot the prize',
    categoryId: 'searching',
    categoryName: 'Searching Algorithms',
    dataStructureType: 'array',
    difficulty: 'Beginner',
    analogy: {
      title: 'Looking for Your Lost Keys in the House',
      story: 'You lost your keys. Your house is in total disarray (unsorted). You check under the couch, then on the desk, then inside the fridge... item by item until you either find them or run out of rooms to search.',
      keyLesson: 'The only search that works on completely unsorted data. Simple, but slow for large datasets with O(N) comparisons.',
    },
    defaultInput: [24, 78, 13, 95, 41, 62],
    inputPlaceholder: 'e.g. 24, 78, 13, 95, 41, 62',
    inputDescription: 'Enter comma-separated numbers',
    complexity: {
      bestTime: 'O(1) if target is at index 0',
      avgTime: 'O(N)',
      worstTime: 'O(N) if at end or absent',
      space: 'O(1)',
      whyTime: 'In the worst case, checks all N elements sequentially.',
      whySpace: 'Requires only a single loop index variable.',
    },
    commonMistakes: [
      {
        title: 'Forgetting to Stop After Finding Target',
        misconception: 'Continuing the loop even after finding the element.',
        fix: 'Return immediately or break out of the loop.',
      },
    ],
    quiz: [
      {
        id: 'ls-q1',
        question: 'When is Linear Search preferable over Binary Search?',
        options: ['When data is already sorted', 'When data is unsorted and you only need to search once', 'When searching millions of numbers', 'Never'],
        correctIndex: 1,
        explanation: 'Sorting takes O(N log N). If searching an unsorted array only once, O(N) linear search is faster than sorting first.',
      },
    ],
    codeSnippets: linearSearchSnippets,
    isFlagship: false,
  },

  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    subtitle: 'Divide the search world in half with every check',
    categoryId: 'searching',
    categoryName: 'Searching Algorithms',
    dataStructureType: 'array',
    difficulty: 'Beginner',
    analogy: {
      title: 'The Thick Dictionary Split',
      story: 'You need to find the word "Ponder" in a 1,000-page dictionary. You open directly to page 500. It shows words starting with "M". Since P comes after M, you tear away the first 500 pages and throw them in the trash! Open to the middle of the remainder. In 10 page turns, you find any word among a million pages.',
      keyLesson: 'Cuts remaining work in half with every step. log₂(1,000,000) is only ~20 steps!',
    },
    defaultInput: [11, 22, 34, 45, 57, 68, 79, 91],
    inputPlaceholder: 'e.g. 11, 22, 34, 45, 57, 68, 79, 91',
    inputDescription: 'Sorted comma-separated numbers',
    complexity: {
      bestTime: 'O(1) if middle is target',
      avgTime: 'O(log N)',
      worstTime: 'O(log N)',
      space: 'O(1) iterative / O(log N) recursive',
      whyTime: 'The search space is halved every iteration: N -> N/2 -> N/4 -> ... -> 1 in log₂(N) steps.',
      whySpace: 'Iterative implementation maintains only low, mid, and high pointers.',
    },
    commonMistakes: [
      {
        title: 'Running Binary Search on Unsorted Data',
        misconception: 'Expecting Binary Search to work without sorted data.',
        fix: 'Binary Search strictly requires the monotonic sorted condition.',
      },
      {
        title: 'Integer Overflow in Mid Calculation',
        misconception: 'Writing `(low + high) / 2` in C++/Java.',
        fix: 'Use `low + (high - low) / 2`.',
      },
    ],
    quiz: [
      {
        id: 'bs-q1',
        question: 'What is the maximum number of comparisons Binary Search takes on a sorted array of 1,024 elements?',
        options: ['1,024', '512', '11', '100'],
        correctIndex: 2,
        explanation: 'log₂(1024) + 1 = 10 + 1 = 11 comparisons.',
      },
    ],
    codeSnippets: binarySearchSnippets,
    isFlagship: false,
  },

  'ternary-search': {
    id: 'ternary-search',
    title: 'Ternary Search',
    subtitle: 'Divide the search window into three parts',
    categoryId: 'searching',
    categoryName: 'Searching Algorithms',
    dataStructureType: 'array',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Two Bookmarks',
      story: 'Instead of placing one bookmark in the middle of a dictionary, place two bookmarks at the one-third and two-thirds marks. This splits the dictionary into three sections. Test both bookmarks to discard two of the three sections at once.',
      keyLesson: 'Takes O(log₃ N) steps, but makes 2 comparisons per step, so in practice Binary Search is slightly faster.',
    },
    defaultInput: [5, 12, 19, 27, 34, 46, 58, 69, 81],
    inputPlaceholder: 'e.g. 5, 12, 19, 27, 34, 46, 58, 69, 81',
    inputDescription: 'Sorted comma-separated numbers',
    complexity: {
      bestTime: 'O(1)',
      avgTime: 'O(log₃ N)',
      worstTime: 'O(log₃ N)',
      space: 'O(1)',
      whyTime: 'Search space reduced by factor of 3 in each iteration with 2 comparisons.',
      whySpace: 'Maintains constant pointers.',
    },
    commonMistakes: [
      {
        title: 'Assuming Ternary Search is Faster than Binary Search in Practice',
        misconception: 'Thinking base-3 log is always faster.',
        fix: 'Although log₃ N < log₂ N, each iteration requires up to 2 comparisons instead of 1, making total comparison count 2 × log₃ N ≈ 1.26 × log₂ N (slower than binary search!).',
      },
    ],
    quiz: [
      {
        id: 'ts-q1',
        question: 'Where is Ternary Search most famously useful?',
        options: ['Finding unimodal function peaks / extrema', 'Sorting strings', 'Graph traversal', 'Hashing'],
        correctIndex: 0,
        explanation: 'Ternary search efficiently finds the maximum or minimum of a unimodal function (convex/concave optimization).',
      },
    ],
    codeSnippets: ternarySearchSnippets,
    isFlagship: false,
  },
};

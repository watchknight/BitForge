import { Topic } from '../types/topic';
import { mergeSortSnippets } from '../algorithms/mergeSort';
import { linkedListSnippets } from '../algorithms/linkedList';
import { bstSnippets } from '../algorithms/bst';
import { bfsSnippets } from '../algorithms/bfs';
import { fibonacciDpSnippets } from '../algorithms/fibonacciDp';
import { topicsBatchA } from './topicsBatchA';
import { topicsBatchB } from './topicsBatchB';
import { topicsBatchC } from './topicsBatchC';
import { topicsBatchD } from './topicsBatchD';
import { topicsBatchE } from './topicsBatchE';
import { topicsBatchFGHIJ } from './topicsBatchFGHIJ';

export const topicsData: Record<string, Topic> = {
  ...topicsBatchA,
  ...topicsBatchB,
  ...topicsBatchC,
  ...topicsBatchD,
  ...topicsBatchE,
  ...topicsBatchFGHIJ,
  'merge-sort': {
    id: 'merge-sort',
    title: 'Merge Sort',
    subtitle: 'Divide and conquer your chaos into sorted harmony',
    categoryId: 'sorting',
    categoryName: 'Sorting Algorithms',
    dataStructureType: 'array',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Two Decks of Playing Cards',
      story: 'Imagine you have a messy pile of 52 playing cards. Trying to sort all 52 at once is overwhelming. Instead, you split the deck in half, and in half again, down until you have pairs of single cards. A single card is already sorted! Now, whenever you hold two small sorted stacks, merging them is effortless: you simply look at the top card of each stack, pick the smaller one, and place it down face-up. Repeat until the stacks merge together.',
      keyLesson: 'Splitting is easy (O(1) per split). The real magic happens during the merge step, where two already-sorted piles are zipped together in linear O(N) time.',
    },
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    inputPlaceholder: 'e.g. 38, 27, 43, 3, 9, 82, 10',
    inputDescription: 'Enter comma-separated numbers (up to 10 numbers)',
    complexity: {
      bestTime: 'O(N log N)',
      avgTime: 'O(N log N)',
      worstTime: 'O(N log N)',
      space: 'O(N)',
      whyTime: 'The array is repeatedly halved log₂(N) times to form a binary tree of sub-problems. At each of the log₂(N) levels, every element is compared and merged once, doing O(N) work per level. Total time = N × log₂(N).',
      whySpace: 'Standard Merge Sort requires an auxiliary temporary buffer of size O(N) to hold and merge sub-arrays before copying them back into the main array.',
    },
    commonMistakes: [
      {
        title: 'Off-by-One in Midpoint Calculation',
        misconception: 'Writing `mid = (left + right) / 2` in languages with fixed integer sizes can cause integer overflow if left and right are huge.',
        fix: 'Use `mid = left + (right - left) // 2` to guarantee safety against integer overflow.',
      },
      {
        title: 'Forgetting Leftover Elements After the Loop',
        misconception: 'Assuming both sub-arrays exhaust at the exact same time during the two-finger merge.',
        fix: 'Always include the cleanup loops: one sub-array will inevitably run out before the other, so copy any remaining elements from the unfinished half.',
      },
      {
        title: 'Confusing Merge Sort Space with Quick Sort',
        misconception: 'Thinking Merge Sort sorts in-place like Quick Sort without extra memory.',
        fix: 'Array-based Merge Sort requires O(N) auxiliary space. Only linked-list merge sort can easily be done in O(1) auxiliary space.',
      },
    ],
    quiz: [
      {
        id: 'ms-q1',
        question: 'What is the worst-case time complexity of Merge Sort?',
        options: ['O(N²)', 'O(N log N)', 'O(N)', 'O(log N)'],
        correctIndex: 1,
        explanation: 'Merge Sort consistently performs in O(N log N) time in best, average, and worst cases because it always divides the array precisely in half.',
      },
      {
        id: 'ms-q2',
        question: 'Why does Merge Sort require O(N) extra auxiliary memory for arrays?',
        options: [
          'Because recursion consumes O(N) stack frames',
          'Because the two-pointer merge needs a temporary buffer to avoid overwriting elements',
          'Because it converts the array into a binary tree',
          'It does not require extra memory',
        ],
        correctIndex: 1,
        explanation: 'When merging two adjacent sorted segments, writing values directly in-place would overwrite elements that haven\'t been compared yet, necessitating a temporary buffer.',
      },
      {
        id: 'ms-q3',
        question: 'What is the base case condition for the recursive mergeSort(arr, left, right) function?',
        options: ['left == 0', 'left >= right', 'right == arr.length', 'arr[left] > arr[right]'],
        correctIndex: 1,
        explanation: 'When left >= right, the sub-array has either 1 element or 0 elements, both of which are already trivially sorted.',
      },
    ],
    codeSnippets: mergeSortSnippets,
    isFlagship: true,
  },

  'singly-linked-list': {
    id: 'singly-linked-list',
    title: 'Singly Linked List',
    subtitle: 'A chain of nodes where each points the way forward',
    categoryId: 'linear-structures',
    categoryName: 'Linear Data Structures',
    dataStructureType: 'linked-list',
    difficulty: 'Beginner',
    analogy: {
      title: 'The Scavenger Hunt Clues',
      story: 'Think of an array as numbered lockers side-by-side in a hallway: locker #4 is right next to locker #3. A linked list is like a treasure hunt: you only know where the first clue is (the HEAD). That clue has a message and the address of clue #2. Clue #2 points to clue #3, all the way until a clue says "FINISH" (NULL). If you lose one clue\'s address, every clue after it is lost forever!',
      keyLesson: 'Inserting or removing a clue anywhere is fast (just change what clue points to where), but jumping straight to clue #10 requires walking through clues 1 through 9.',
    },
    defaultInput: [15, 42, 89],
    inputPlaceholder: 'e.g. 15, 42, 89',
    inputDescription: 'Initial node values (comma-separated numbers)',
    complexity: {
      bestTime: 'O(1) Insert/Delete at Head',
      avgTime: 'O(N) Search / Access / Delete by Value',
      worstTime: 'O(N) Access by Index',
      space: 'O(N) Total Storage',
      whyTime: 'Inserting at the head is O(1) because you only redirect 2 pointers. But accessing index k or searching for a value requires linear scanning O(N) because nodes do not have contiguous memory indices.',
      whySpace: 'Each node stores its data payload plus an explicit reference (pointer) to the next node in memory, using O(1) extra pointer memory per item.',
    },
    commonMistakes: [
      {
        title: 'Losing the Head Reference ("Garbage Collection Disaster")',
        misconception: 'Overwriting the head variable before saving a pointer to the rest of the list.',
        fix: 'Always store the next node or create a temporary pointer before reassigning head.',
      },
      {
        title: 'Null Pointer Dereference on Traversal',
        misconception: 'Checking `curr.next.val` when `curr` or `curr.next` is null, crashing the program.',
        fix: 'Always guard checks with `while (curr != null && curr.next != null)`.',
      },
      {
        title: 'Forgetting to Update the Tail or Prev Pointer',
        misconception: 'Splicing in a new node by only updating `newNode.next` without linking `curr.next = newNode`.',
        fix: 'Insertion requires two steps: link the new node to the rest of the chain first, then link the predecessor to the new node.',
      },
    ],
    quiz: [
      {
        id: 'll-q1',
        question: 'What is the time complexity of prepending a new node to the front (head) of a singly linked list?',
        options: ['O(N)', 'O(1)', 'O(log N)', 'O(N²)'],
        correctIndex: 1,
        explanation: 'Prepending only requires allocating the new node, setting its next to the current head, and updating head. This takes constant O(1) operations.',
      },
      {
        id: 'll-q2',
        question: 'Why can\'t you perform Binary Search on a standard Singly Linked List in O(log N) time?',
        options: [
          'Because linked lists cannot hold sorted data',
          'Because finding the middle element requires O(N) sequential traversal',
          'Because pointers only move backwards',
          'Because nodes cannot be compared',
        ],
        correctIndex: 1,
        explanation: 'Binary Search relies on instant O(1) random access by index to find the middle. In a linked list, finding the middle requires stepping through O(N/2) pointers.',
      },
      {
        id: 'll-q3',
        question: 'When deleting a node `target` (given predecessor `prev`), what is the core pointer update?',
        options: [
          'prev.next = target.next',
          'target.next = prev',
          'prev = target.next',
          'target = null',
        ],
        correctIndex: 0,
        explanation: 'Setting prev.next = target.next bypasses the target node completely, unlinking it from the chain.',
      },
    ],
    codeSnippets: linkedListSnippets,
    isFlagship: true,
  },

  'binary-search-tree': {
    id: 'binary-search-tree',
    title: 'Binary Search Tree (BST)',
    subtitle: 'Divide your search space in half with every downward branch',
    categoryId: 'trees',
    categoryName: 'Tree Data Structures',
    dataStructureType: 'tree',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Guessing Game & The Library Card Catalog',
      story: 'Think of the number guessing game: "I am thinking of a number between 1 and 100." You guess 50. I say "Higher!" In one step, you eliminated 50 numbers. A Binary Search Tree is that game carved into a data structure: every node is a question. If your number is smaller, go down the left hallway; if larger, go down the right hallway. You cut the remaining work in half with every single step!',
      keyLesson: 'A BST stays lightning fast (O(log N)) as long as it remains balanced. If elements are inserted in already-sorted order, it degenerates into a flat line (like a linked list!).',
    },
    defaultInput: [50, 30, 70, 20, 40, 60, 80],
    inputPlaceholder: 'e.g. 50, 30, 70, 20, 40, 60, 80',
    inputDescription: 'Keys to build initial BST (comma-separated)',
    complexity: {
      bestTime: 'O(log N) Search / Insert / Delete',
      avgTime: 'O(log N)',
      worstTime: 'O(N) when degenerate (skewed line)',
      space: 'O(N) Storage / O(H) recursion stack where H is height',
      whyTime: 'On a balanced tree, each branch decision discards half the remaining nodes. If tree height is log₂(N), operations take at most O(log N) steps.',
      whySpace: 'Storing N nodes takes O(N) space. Recursive operations store at most H activation frames on the call stack, which is O(log N) for balanced trees and O(N) for degenerate trees.',
    },
    commonMistakes: [
      {
        title: 'Assuming All BSTs are Self-Balancing',
        misconception: 'Thinking standard BST insertions automatically balance the tree.',
        fix: 'A naive BST does not balance itself. Inserting sorted numbers [1, 2, 3, 4, 5] yields a degenerate chain of height N with O(N) search time. AVL or Red-Black trees are needed for guaranteed balancing.',
      },
      {
        title: 'Local BST Property vs. Global BST Property',
        misconception: 'Checking only whether a node is greater than its left child and smaller than its right child.',
        fix: 'Every node in the left subtree must be smaller than the root, and every node in the right subtree must be greater than the root. A node deep on the right of the left child cannot exceed the tree root!',
      },
      {
        title: 'Forgetting In-Order Traversal Yields Sorted Order',
        misconception: 'Using pre-order or post-order when asked to extract sorted values.',
        fix: 'In-order traversal (Left -> Node -> Right) on a BST is guaranteed to visit nodes in strictly ascending numerical order.',
      },
    ],
    quiz: [
      {
        id: 'bst-q1',
        question: 'Which traversal method on a Binary Search Tree produces elements in ascending sorted order?',
        options: ['Pre-Order Traversal', 'In-Order Traversal', 'Post-Order Traversal', 'Level-Order Traversal'],
        correctIndex: 1,
        explanation: 'In-Order traversal recursively visits Left subtree (all smaller values), then Root, then Right subtree (all larger values), resulting in sorted order.',
      },
      {
        id: 'bst-q2',
        question: 'What happens to the shape and search time of a naive BST if you insert keys in sorted order [10, 20, 30, 40, 50]?',
        options: [
          'It stays perfectly balanced with O(log N) time',
          'It degenerates into a singly linked list with O(N) search time',
          'It automatically balances into an AVL tree',
          'It throws an index error',
        ],
        correctIndex: 1,
        explanation: 'Each new key is greater than the previous, so each attaches as a right child. This produces a linear chain of height N.',
      },
      {
        id: 'bst-q3',
        question: 'Where would the key 35 be inserted in a BST with root 50 and left child 30?',
        options: [
          'As the left child of 50',
          'As the right child of 30',
          'As the left child of 30',
          'As the right child of 50',
        ],
        correctIndex: 1,
        explanation: '35 < 50, so move left to 30. Then 35 > 30, so attach as the right child of 30.',
      },
    ],
    codeSnippets: bstSnippets,
    isFlagship: true,
  },

  'breadth-first-search': {
    id: 'breadth-first-search',
    title: 'Breadth-First Search (BFS)',
    subtitle: 'Explore layer by layer like ripples across water',
    categoryId: 'graphs',
    categoryName: 'Graph Algorithms',
    dataStructureType: 'graph',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Ripples in a Pond & Degrees of Separation',
      story: 'Drop a pebble into a calm pond. Ripples expand in concentric circles: first 1 inch away, then 2 inches, then 3 inches. Breadth-First Search works the same way: it visits your immediate friends (1 degree away) before checking friends-of-friends (2 degrees away). Because it explores every path at distance d before moving to distance d+1, the very first time BFS touches a node, it has discovered the guaranteed shortest path!',
      keyLesson: 'BFS uses a First-In-First-Out (FIFO) Queue to maintain order. Nodes discovered first are processed first.',
    },
    defaultInput: 'A',
    inputPlaceholder: 'e.g. A',
    inputDescription: 'Select start node (A, B, C, D, E, F)',
    complexity: {
      bestTime: 'O(V + E)',
      avgTime: 'O(V + E)',
      worstTime: 'O(V + E)',
      space: 'O(V) for Queue and Visited Set',
      whyTime: 'BFS visits every reachable vertex V at most once, and scans every edge E incident to those vertices at most twice (once from each endpoint in an undirected graph). Total time is linear O(V + E).',
      whySpace: 'The FIFO queue and visited hash set store at most V vertices in the worst case (e.g. a star graph where the center connects to all other vertices).',
    },
    commonMistakes: [
      {
        title: 'Marking "Visited" on Dequeue Instead of Enqueue',
        misconception: 'Waiting to add a node to the visited set until it is popped from the front of the queue.',
        fix: 'A node must be marked visited the instant it is added to the queue! Otherwise, multiple parallel neighbors will re-add the same node dozens of times, causing exponential duplicate explosion.',
      },
      {
        title: 'Using a Stack Instead of a Queue',
        misconception: 'Using pop() from the end of an array instead of shift() / deque.',
        fix: 'A stack produces Depth-First Search (DFS), which plunges deep down one path and does NOT guarantee finding the shortest path.',
      },
      {
        title: 'Assuming BFS Finds Shortest Paths on Weighted Graphs',
        misconception: 'Using BFS to find minimum cost paths when edges have different weights.',
        fix: 'Standard BFS only finds shortest paths on UNWEIGHTED graphs (where every edge has uniform cost 1). For weighted graphs, use Dijkstra\'s algorithm with a priority queue.',
      },
    ],
    quiz: [
      {
        id: 'bfs-q1',
        question: 'Which fundamental data structure powers Breadth-First Search?',
        options: ['LIFO Stack', 'FIFO Queue', 'Priority Queue', 'Binary Search Tree'],
        correctIndex: 1,
        explanation: 'BFS relies on a FIFO (First-In, First-Out) queue to ensure nodes discovered earlier are explored before nodes discovered later.',
      },
      {
        id: 'bfs-q2',
        question: 'What happens if you forget to mark a node as visited when enqueuing it in a graph with cycles?',
        options: [
          'The algorithm terminates early',
          'The queue enters an infinite loop cycling between connected nodes',
          'The graph is automatically converted to a tree',
          'The memory stays constant',
        ],
        correctIndex: 1,
        explanation: 'Without a visited set, adjacent nodes continuously push each other back into the queue indefinitely.',
      },
      {
        id: 'bfs-q3',
        question: 'On an unweighted graph, does BFS guarantee finding the shortest path from start to target?',
        options: [
          'Yes, because it explores in order of increasing distance from start',
          'No, only DFS guarantees shortest path',
          'Only if the graph is a directed acyclic graph (DAG)',
          'Only if all node values are positive',
        ],
        correctIndex: 0,
        explanation: 'Because BFS explores all nodes at distance k before any node at distance k+1, the first time it reaches a target is along a minimum edge-count path.',
      },
    ],
    codeSnippets: bfsSnippets,
    isFlagship: true,
  },

  'fibonacci-dp': {
    id: 'fibonacci-dp',
    title: 'Fibonacci via DP Tabulation',
    subtitle: 'Never calculate the same subproblem twice',
    categoryId: 'dynamic-programming',
    categoryName: 'Dynamic Programming',
    dataStructureType: 'grid',
    difficulty: 'Beginner',
    analogy: {
      title: 'The Mathematician’s Scratchpad',
      story: 'Suppose someone asks you: "What is 1 + 1 + 1 + 1 + 1?" You count: "5." Now they add another "+ 1" to the end and ask for the new total. Do you start over from the very first 1? Of course not! You remember "5", add 1, and instantly say "6." Dynamic Programming is just that: keeping a scratchpad so you build upon answers you have already figured out.',
      keyLesson: 'Naive recursion branches into a monstrous 2^N tree recalculating fib(2) thousands of times. DP tabulation computes an answer in a single forward pass in linear O(N) time.',
    },
    defaultInput: 7,
    inputPlaceholder: 'e.g. 7',
    inputDescription: 'Target N (between 2 and 12)',
    complexity: {
      bestTime: 'O(N)',
      avgTime: 'O(N)',
      worstTime: 'O(N)',
      space: 'O(N) table (or O(1) space with 2 variables)',
      whyTime: 'The loop executes N - 1 times, performing a single addition and array write per iteration. This slashes the exponential O(2^N) recursive time to purely linear O(N).',
      whySpace: 'An array of size N + 1 is allocated to store the computed subproblems from index 0 to N.',
    },
    commonMistakes: [
      {
        title: 'Confusing Tabulation (Bottom-Up) with Memoization (Top-Down)',
        misconception: 'Thinking all Dynamic Programming is recursive.',
        fix: 'Memoization is Top-Down with recursion and caching. Tabulation is Bottom-Up, using simple iterative loops and a table, completely avoiding call stack overhead.',
      },
      {
        title: 'Off-by-One Array Sizing',
        misconception: 'Allocating an array of size `N` when computing Fibonacci(`N`).',
        fix: 'Because indices start at 0, an array of size `N + 1` is required to access index `N` without out-of-bounds errors.',
      },
      {
        title: 'Missing Base Cases',
        misconception: 'Starting the iterative loop without explicitly defining dp[0] and dp[1].',
        fix: 'Every DP problem requires base cases. For Fibonacci, dp[0] = 0 and dp[1] = 1 are the foundational bricks that allow all subsequent cells to be calculated.',
      },
    ],
    quiz: [
      {
        id: 'fib-q1',
        question: 'What is the time complexity of naive recursive Fibonacci without dynamic programming?',
        options: ['O(N)', 'O(N log N)', 'O(2^N)', 'O(N²)'],
        correctIndex: 2,
        explanation: 'Each recursive call branches into two child calls, creating a binary recursion tree of depth N, which leads to exponential O(2^N) operations.',
      },
      {
        id: 'fib-q2',
        question: 'What is the core recurrence relation used in Fibonacci DP tabulation?',
        options: ['dp[i] = dp[i-1] * dp[i-2]', 'dp[i] = dp[i-1] + dp[i-2]', 'dp[i] = dp[i-1] + i', 'dp[i] = 2 * dp[i-1]'],
        correctIndex: 1,
        explanation: 'By mathematical definition, every Fibonacci number beyond the base cases is the exact sum of the preceding two Fibonacci numbers.',
      },
      {
        id: 'fib-q3',
        question: 'Can the auxiliary space of Fibonacci DP tabulation be reduced from O(N) to O(1)?',
        options: [
          'Yes, by only maintaining two variables for the previous two numbers',
          'No, all N numbers must remain in memory',
          'Only if N is less than 10',
          'Only in compiled languages like C++',
        ],
        correctIndex: 0,
        explanation: 'Because computing dp[i] only requires dp[i-1] and dp[i-2], you only need two scalar variables (prev1, prev2) rather than the entire array.',
      },
    ],
    codeSnippets: fibonacciDpSnippets,
    isFlagship: true,
  },
};

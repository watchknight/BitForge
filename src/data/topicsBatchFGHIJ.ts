import { Topic } from '../types/topic';
import { hashingSnippets } from '../algorithms/hashingBatchF';
import { dfsSnippets } from '../algorithms/graphsBatchG';
import { knapsackSnippets, coinChangeSnippets } from '../algorithms/dpBatchH';
import {
  activitySelectionSnippets,
  unionFindSnippets,
  huffmanCodingSnippets,
  kmpSnippets,
  bitManipulationSnippets,
} from '../algorithms/greedyAndAdvancedBatchIJ';

export const topicsBatchFGHIJ: Record<string, Topic> = {
  // Batch F: Hashing
  'hash-map': {
    id: 'hash-map',
    title: 'Hash Table & Collision Handling',
    subtitle: 'Achieve constant-time O(1) lookups via deterministic key hashing',
    categoryId: 'hashing',
    categoryName: 'Hashing & Hash Tables',
    dataStructureType: 'grid',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Coat Check Room',
      story: 'You hand your coat to the attendant. They don\'t hang coats in random piles; they run a quick calculation on your ticket number and immediately walk to rack slot #7. When you return, they go straight to slot #7. O(1) instantaneous retrieval!',
      keyLesson: 'A hash function converts arbitrary keys into array indices. Collisions occur when two keys map to the same slot; resolution strategies like chaining or linear probing handle them gracefully.',
    },
    defaultInput: [15, 22, 8, 29],
    inputPlaceholder: 'e.g. 15, 22, 8, 29',
    inputDescription: 'Keys to insert into Hash Table (table size 7)',
    complexity: {
      bestTime: 'O(1) Insert, Search, Delete',
      avgTime: 'O(1)',
      worstTime: 'O(N) on catastrophic collisions',
      space: 'O(N)',
      whyTime: 'Direct index computation via hash(key) = key % size provides immediate access without iteration.',
      whySpace: 'Pre-allocates bucket array proportional to expected element count.',
    },
    commonMistakes: [
      {
        title: 'Ignoring the Load Factor',
        misconception: 'Allowing a hash table to fill to 100% capacity.',
        fix: 'When Load Factor (elements/size) exceeds ~0.7, rehash into a table with double the size to maintain O(1) performance.',
      },
    ],
    quiz: [
      {
        id: 'ht-q1',
        question: 'What is the average-case time complexity of retrieving a value from a well-balanced Hash Table?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N²)'],
        correctIndex: 2,
        explanation: 'The hash function maps the key directly to its bucket index in constant O(1) time.',
      },
    ],
    codeSnippets: hashingSnippets,
    isFlagship: false,
  },

  // Batch G: Depth-First Search
  'depth-first-search': {
    id: 'depth-first-search',
    title: 'Depth-First Search (DFS)',
    subtitle: 'Explore every labyrinth hallway to the bitter end before backtracking',
    categoryId: 'graphs',
    categoryName: 'Graph Algorithms',
    dataStructureType: 'graph',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Exploring a Dark Cave with a Thread',
      story: 'You enter a mysterious cave system holding a ball of thread. At every fork in the path, you choose the leftmost tunnel and keep running deeper until you hit a dead end. Then you follow your thread backward to the last fork and try the unexplored branch.',
      keyLesson: 'DFS uses a LIFO Stack (or recursion) to explore deeply. Crucial for topological sorting, cycle detection, and maze solving.',
    },
    defaultInput: 'A',
    inputPlaceholder: 'A',
    inputDescription: 'Start node for DFS',
    complexity: {
      bestTime: 'O(V + E)',
      avgTime: 'O(V + E)',
      worstTime: 'O(V + E)',
      space: 'O(V) recursion stack and visited set',
      whyTime: 'Visits each vertex once and scans every edge incident to it.',
      whySpace: 'Recursion depth can reach V in a linear graph.',
    },
    commonMistakes: [
      {
        title: 'Confusing DFS with BFS for Shortest Path',
        misconception: 'Assuming DFS finds the shortest route between two nodes.',
        fix: 'DFS plunges deep and may return a convoluted, long path! Use BFS for unweighted shortest paths.',
      },
    ],
    quiz: [
      {
        id: 'dfs-q1',
        question: 'Which data structure inherently underpins Depth-First Search?',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Min-Heap', 'Hash Set'],
        correctIndex: 1,
        explanation: 'DFS uses a LIFO stack (either the call stack via recursion or an explicit data structure stack).',
      },
    ],
    codeSnippets: dfsSnippets,
    isFlagship: false,
  },

  // Batch G: Dijkstra
  'dijkstra': {
    id: 'dijkstra',
    title: 'Dijkstra’s Shortest Path',
    subtitle: 'Find the absolute cheapest path through weighted networks',
    categoryId: 'graphs',
    categoryName: 'Graph Algorithms',
    dataStructureType: 'graph',
    difficulty: 'Advanced',
    analogy: {
      title: 'GPS Flight Route Planner',
      story: 'You want to fly from New York to Tokyo with the lowest total flight time. Dijkstra maintains the known shortest travel time to every city. In each step, it locks in the closest unvisited city, looks at its outbound flights, and updates (relaxes) connected cities if a faster layover is found.',
      keyLesson: 'Greedy strategy: always finalize the vertex with the smallest provisional distance using a Priority Queue.',
    },
    defaultInput: 'A',
    inputPlaceholder: 'A',
    inputDescription: 'Start node for Dijkstra',
    complexity: {
      bestTime: 'O((V + E) log V)',
      avgTime: 'O((V + E) log V)',
      worstTime: 'O((V + E) log V)',
      space: 'O(V) for distances and priority queue',
      whyTime: 'Extract-min takes O(log V) across V vertices; edge relaxations update the heap in O(E log V) total.',
      whySpace: 'Maintains distance array and min-heap of size V.',
    },
    commonMistakes: [
      {
        title: 'Using Dijkstra on Negative Edge Weights',
        misconception: 'Expecting Dijkstra to work when edges have negative costs.',
        fix: 'Dijkstra assumes locked nodes can never have their distance decreased later. For negative edges, use Bellman-Ford!',
      },
    ],
    quiz: [
      {
        id: 'dijk-q1',
        question: 'Why does Dijkstra’s algorithm fail when graph edges have negative weights?',
        options: ['It causes division by zero', 'Once a node is marked visited, Dijkstra never re-evaluates it, missing cheaper negative-edge paths', 'Priority queues cannot store negative numbers', 'It always loops infinitely'],
        correctIndex: 1,
        explanation: 'The greedy assumption that the current minimum distance is globally final breaks down when negative edges can decrease costs later.',
      },
    ],
    codeSnippets: dfsSnippets,
    isFlagship: false,
  },

  // Batch H: 0/1 Knapsack
  'knapsack-dp': {
    id: 'knapsack-dp',
    title: '0/1 Knapsack Problem',
    subtitle: 'Pack maximum loot into your knapsack without breaking the weight limit',
    categoryId: 'dynamic-programming',
    categoryName: 'Dynamic Programming',
    dataStructureType: 'grid',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Gold Vault Thief',
      story: 'You have a backpack that can only hold 4kg before ripping. You stand in front of gold bars and gemstones of various weights and values. For each item, you make a binary choice: TAKE it (eating up weight capacity) or SKIP it. Tabulating solutions to smaller weight capacities lets you find the globally optimal stash.',
      keyLesson: 'Classic DP: `dp[i][w] = max(skip, take)`. Builds upon subproblem solutions to avoid 2^N exponential brute force.',
    },
    defaultInput: [1, 2, 3],
    inputPlaceholder: '1, 2, 3',
    inputDescription: 'Weights of items (Capacity W = 4kg)',
    complexity: {
      bestTime: 'O(N × W)',
      avgTime: 'O(N × W)',
      worstTime: 'O(N × W)',
      space: 'O(N × W) table (or O(W) with 1D optimization)',
      whyTime: 'Fills an (N+1) x (W+1) matrix, where each cell is computed in O(1) time.',
      whySpace: 'Stores 2D matrix of size (N+1) x (W+1).',
    },
    commonMistakes: [
      {
        title: 'Confusing 0/1 Knapsack with Fractional Knapsack',
        misconception: 'Trying to sort by value-to-weight ratio for 0/1 Knapsack.',
        fix: 'Greedy value/weight fails for 0/1 Knapsack! Dynamic programming is required because items cannot be split.',
      },
    ],
    quiz: [
      {
        id: 'kp-q1',
        question: 'What is the recurrence relation for the take-or-skip decision in 0/1 Knapsack?',
        options: [
          'dp[i][w] = dp[i-1][w] + values[i]',
          'dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])',
          'dp[i][w] = dp[i][w-1] * values[i]',
          'dp[i][w] = dp[i-1][w-1]',
        ],
        correctIndex: 1,
        explanation: 'At each item, we choose the maximum between skipping the item (dp[i-1][w]) and taking the item (item value + dp at remaining capacity).',
      },
    ],
    codeSnippets: knapsackSnippets,
    isFlagship: false,
  },

  // Batch H: LCS
  'lcs-dp': {
    id: 'lcs-dp',
    title: 'Longest Common Subsequence (LCS)',
    subtitle: 'Find common genetic code and file differences (Git diff)',
    categoryId: 'dynamic-programming',
    categoryName: 'Dynamic Programming',
    dataStructureType: 'grid',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Comparing DNA Sequences',
      story: 'A scientist compares two strands of DNA: "AGGTAB" and "GXTXAYB". Even though other letters are inserted between them, both strands share "GTAB" in the exact same relative order. This is how Git computes file diffs and how bioinformatics aligns genomes.',
      keyLesson: 'If characters match, increment diagonal `dp[i-1][j-1] + 1`. If they mismatch, take the max of discarding from string 1 vs string 2.',
    },
    defaultInput: 'ABC',
    inputPlaceholder: 'ABC',
    inputDescription: 'String 1 (compared against AC)',
    complexity: {
      bestTime: 'O(M × N)',
      avgTime: 'O(M × N)',
      worstTime: 'O(M × N)',
      space: 'O(M × N)',
      whyTime: 'Computes each cell in the (M+1) x (N+1) grid in constant time.',
      whySpace: 'Requires an (M+1) x (N+1) table.',
    },
    commonMistakes: [
      {
        title: 'Confusing Subsequence with Substring',
        misconception: 'Assuming characters must be contiguous.',
        fix: 'A substring must be contiguous ("BC"); a subsequence can have gaps ("AC" from "ABC").',
      },
    ],
    quiz: [
      {
        id: 'lcs-q1',
        question: 'What is the length of the Longest Common Subsequence between "ABCDE" and "ACE"?',
        options: ['2', '3', '5', '1'],
        correctIndex: 1,
        explanation: 'The common subsequence is "A-C-E", which has length 3.',
      },
    ],
    codeSnippets: knapsackSnippets,
    isFlagship: false,
  },

  // Batch I: Activity Selection
  'interval-scheduling': {
    id: 'interval-scheduling',
    title: 'Interval Scheduling (Activity Selection)',
    subtitle: 'Book maximum non-overlapping conference rooms with greedy efficiency',
    categoryId: 'greedy',
    categoryName: 'Greedy Algorithms',
    dataStructureType: 'array',
    difficulty: 'Beginner',
    analogy: {
      title: 'Booking a Single Movie Screen',
      story: 'You are the theater manager with 10 movie requests for one screen. Which movie should you show first? The movie that FINISHES EARLIEST! That leaves the maximum possible free time for the rest of the day to fit in more movies.',
      keyLesson: 'Greedily sort activities by finish time. Pick the earliest finishing activity, and reject any that overlap.',
    },
    defaultInput: [2, 4, 6, 7, 9],
    inputPlaceholder: 'Finish times',
    inputDescription: 'Activities pre-sorted by finish time',
    complexity: {
      bestTime: 'O(N log N) for sorting',
      avgTime: 'O(N log N)',
      worstTime: 'O(N log N)',
      space: 'O(1) auxiliary',
      whyTime: 'Sorting intervals takes O(N log N). The greedy linear pass takes O(N).',
      whySpace: 'In-place iteration with a single finish time variable.',
    },
    commonMistakes: [
      {
        title: 'Sorting by Start Time Instead of Finish Time',
        misconception: 'Greedily picking the activity that starts earliest.',
        fix: 'An activity that starts at 8 AM and lasts 12 hours blocks the entire day! Always sort by EARLIEST FINISH TIME.',
      },
    ],
    quiz: [
      {
        id: 'act-q1',
        question: 'What is the optimal greedy criterion for Activity Selection?',
        options: ['Shortest duration', 'Earliest start time', 'Earliest finish time', 'Latest finish time'],
        correctIndex: 2,
        explanation: 'Finishing earliest leaves the maximum remaining time window for future activities.',
      },
    ],
    codeSnippets: activitySelectionSnippets,
    isFlagship: false,
  },

  // Batch J: Disjoint Set
  'disjoint-set': {
    id: 'disjoint-set',
    title: 'Union-Find (Disjoint Set)',
    subtitle: 'Group connected elements and detect cycles in near-instantaneous time',
    categoryId: 'advanced',
    categoryName: 'Advanced Topics',
    dataStructureType: 'array',
    difficulty: 'Advanced',
    analogy: {
      title: 'Merging Kingdoms in Medieval Europe',
      story: 'Two villages decide to form an alliance. Instead of every citizen meeting everyone, each village elects a King (the set representative). When the two kingdoms merge (Union), King Bob pledges fealty to King Alice. Now anyone in Bob\'s village who asks "Who is my ruler?" (Find) is directed straight to Alice.',
      keyLesson: 'With Path Compression and Union by Rank, Find and Union execute in nearly constant O(α(N)) amortized time!',
    },
    defaultInput: [0, 1, 2, 3, 4],
    inputPlaceholder: '0, 1, 2, 3, 4',
    inputDescription: 'Initial parent array',
    complexity: {
      bestTime: 'O(α(N)) ≈ O(1) effectively constant',
      avgTime: 'O(α(N))',
      worstTime: 'O(α(N)) where α is inverse Ackermann',
      space: 'O(N) for parent & rank arrays',
      whyTime: 'Path compression flattens the tree so subsequent find calls take 1 hop.',
      whySpace: 'Two integer arrays of size N.',
    },
    commonMistakes: [
      {
        title: 'Forgetting Path Compression in find()',
        misconception: 'Traversing parent pointers without updating them directly to root.',
        fix: '`parent[x] = find(parent[x])` flattens the tree dynamically on every lookup.',
      },
    ],
    quiz: [
      {
        id: 'dsu-q1',
        question: 'What is the time complexity of Find and Union with both Path Compression and Union by Rank?',
        options: ['O(N)', 'O(log N)', 'O(α(N)) nearly constant', 'O(N²)'],
        correctIndex: 2,
        explanation: 'The inverse Ackermann function α(N) is less than 5 for all practical universe-sized numbers, making it effectively O(1).',
      },
    ],
    codeSnippets: unionFindSnippets,
    isFlagship: false,
  },

  // Batch G: Topological Sort
  'topological-sort': {
    id: 'topological-sort',
    title: 'Topological Sort (Kahn’s Algorithm)',
    subtitle: 'Order tasks with prerequisite constraints so no dependent task precedes its parent',
    categoryId: 'graphs',
    categoryName: 'Graph Algorithms',
    dataStructureType: 'graph',
    difficulty: 'Intermediate',
    analogy: {
      title: 'University Degree Course Prerequisites',
      story: 'You cannot take "Machine Learning" before passing "Linear Algebra" and "Python 101". Kahn’s algorithm repeatedly identifies courses with 0 remaining prerequisites, schedules them for the current semester, and removes their prerequisite barriers for next semester’s courses.',
      keyLesson: 'Maintains in-degrees of all vertices. Vertices with in-degree 0 are queued and processed, decrementing neighbor in-degrees. Detects cycles if the final sorted count < V.',
    },
    defaultInput: 'DAG',
    inputPlaceholder: 'DAG',
    inputDescription: 'Course prerequisite DAG with 4 courses (Math -> DSA/Systems -> Capstone)',
    complexity: {
      bestTime: 'O(V + E)',
      avgTime: 'O(V + E)',
      worstTime: 'O(V + E)',
      space: 'O(V) for queue and in-degree tracking',
      whyTime: 'Every vertex is pushed/popped from queue once, and every edge is traversed once.',
      whySpace: 'Array for in-degrees and FIFO queue.',
    },
    commonMistakes: [
      {
        title: 'Running Topological Sort on Cyclic Graphs',
        misconception: 'Expecting an ordering when circular dependencies exist.',
        fix: 'Topological sort is strictly defined ONLY on Directed Acyclic Graphs (DAGs). Cycle detection fails if processed count < V.',
      },
    ],
    quiz: [
      {
        id: 'topo-q1',
        question: 'What graph property is required for a valid Topological Sort to exist?',
        options: ['Undirected graph', 'Directed Acyclic Graph (DAG)', 'Complete bipartite graph', 'Tree with single root'],
        correctIndex: 1,
        explanation: 'If a directed cycle exists (A -> B -> A), neither task can be scheduled first, so no topological ordering exists.',
      },
    ],
    codeSnippets: dfsSnippets,
    isFlagship: false,
  },

  // Batch H: Coin Change
  'coin-change': {
    id: 'coin-change',
    title: 'Coin Change (Fewest Coins)',
    subtitle: 'Form the exact dollar amount using the absolute minimum count of coins',
    categoryId: 'dynamic-programming',
    categoryName: 'Dynamic Programming',
    dataStructureType: 'grid',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Vending Machine Dispenser',
      story: 'A vending machine owes you 6 cents in change. Should it hand you 6 pennies? Or one nickel (5¢) and one penny (1¢)? By building up answers from 1¢ to 6¢, it guarantees the fewest coins dispensed.',
      keyLesson: 'Bottom-up DP recurrence: `dp[i] = min(dp[i - c] + 1)` for all coin denominations `c <= i`.',
    },
    defaultInput: [1, 2, 5],
    inputPlaceholder: '1, 2, 5',
    inputDescription: 'Coin denominations (Target Amount = 6)',
    complexity: {
      bestTime: 'O(Amount × NumberOfCoins)',
      avgTime: 'O(Amount × NumberOfCoins)',
      worstTime: 'O(Amount × NumberOfCoins)',
      space: 'O(Amount) 1D DP table',
      whyTime: 'Outer loop iterates up to Amount; inner loop iterates over each coin denomination.',
      whySpace: 'Requires 1D array `dp[0..Amount]`.',
    },
    commonMistakes: [
      {
        title: 'Using Greedy Coin Change for Arbitrary Denominations',
        misconception: 'Assuming picking the largest coin always works.',
        fix: 'Greedy fails for coins [1, 3, 4] with amount 6 (greedy picks 4+1+1=3 coins, but optimal is 3+3=2 coins!). DP guarantees optimality.',
      },
    ],
    quiz: [
      {
        id: 'cc-q1',
        question: 'For coins [1, 3, 4] and amount 6, what is the minimum number of coins needed?',
        options: ['3 coins (4 + 1 + 1)', '2 coins (3 + 3)', '6 coins (all 1s)', 'Impossible'],
        correctIndex: 1,
        explanation: 'Two 3¢ coins yield exactly 6¢, beating the greedy strategy (4 + 1 + 1 = 3 coins).',
      },
    ],
    codeSnippets: coinChangeSnippets,
    isFlagship: false,
  },

  // Batch I: Huffman Coding
  'huffman-coding': {
    id: 'huffman-coding',
    title: 'Huffman Coding & Compression',
    subtitle: 'Assign shorter binary codes to frequent letters to compress data lossless-ly',
    categoryId: 'greedy',
    categoryName: 'Greedy Algorithms',
    dataStructureType: 'tree',
    difficulty: 'Intermediate',
    analogy: {
      title: 'Morse Code Frequency Optimization',
      story: 'In Morse code, the letter "E" (the most common letter in English) is simply a single dot ".", while rare letters like "Q" are "--.-". Huffman coding creates a mathematically optimal prefix code where common characters take fewer bits.',
      keyLesson: 'Builds a binary tree bottom-up by repeatedly pairing the two lowest-frequency symbols using a Min-Heap.',
    },
    defaultInput: 'A:45, B:25, C:30',
    inputPlaceholder: 'A:45, B:25, C:30',
    inputDescription: 'Character frequencies for optimal prefix tree',
    complexity: {
      bestTime: 'O(N log N) where N is distinct characters',
      avgTime: 'O(N log N)',
      worstTime: 'O(N log N)',
      space: 'O(N) priority queue and tree nodes',
      whyTime: 'Inserts and extracts N symbols from min-heap, each taking O(log N).',
      whySpace: 'Stores 2N-1 binary tree nodes.',
    },
    commonMistakes: [
      {
        title: 'Ambiguous Prefix Codes',
        misconception: 'Assigning a code that is a prefix of another code (e.g. A="0", B="01").',
        fix: 'Leaf nodes in the Huffman tree guarantee that no code is a prefix of any other code, making decoding 100% deterministic without delimiters.',
      },
    ],
    quiz: [
      {
        id: 'huff-q1',
        question: 'Why are characters only placed at the leaf nodes of a Huffman Tree?',
        options: [
          'To ensure prefix-free property where no character code is a prefix of another',
          'To minimize tree height',
          'Because internal nodes cannot hold data',
          'To save RAM pointers',
        ],
        correctIndex: 0,
        explanation: 'If a character were at an internal node, its path would be a prefix of all its descendants, creating decoding ambiguity.',
      },
    ],
    codeSnippets: huffmanCodingSnippets,
    isFlagship: false,
  },

  // Batch J: KMP String Matching
  'kmp-search': {
    id: 'kmp-search',
    title: 'KMP String Matching',
    subtitle: 'Search text in linear O(N + M) time without ever backtracking the text pointer',
    categoryId: 'advanced',
    categoryName: 'Advanced Topics',
    dataStructureType: 'array',
    difficulty: 'Advanced',
    analogy: {
      title: 'The Smart Word Hunter',
      story: 'You are searching for "COCOA" in "COCOCOA". When the mismatch happens at the fifth letter ("C" instead of "A"), naive search resets back to the beginning. KMP realizes you already matched "COCO", whose prefix "CO" matches its suffix "CO", so it skips directly forward without re-reading text!',
      keyLesson: 'Pre-computes the LPS (Longest Prefix Suffix) table in O(M) time, guaranteeing strict O(N) single-pass text search.',
    },
    defaultInput: 'ABABC',
    inputPlaceholder: 'ABABC',
    inputDescription: 'Pattern string to compute LPS lookup table',
    complexity: {
      bestTime: 'O(N + M)',
      avgTime: 'O(N + M)',
      worstTime: 'O(N + M)',
      space: 'O(M) for LPS array',
      whyTime: 'Text pointer never moves backward; pattern pointer only falls back according to precomputed LPS values.',
      whySpace: 'Array of size M (pattern length).',
    },
    commonMistakes: [
      {
        title: 'Confusing Proper Prefix with Suffix',
        misconception: 'Allowing the whole string to be its own prefix and suffix in LPS.',
        fix: 'Proper prefixes and suffixes must be strictly shorter than the pattern string itself.',
      },
    ],
    quiz: [
      {
        id: 'kmp-q1',
        question: 'What does each value in the KMP LPS array represent?',
        options: [
          'Length of the longest proper prefix that is also a suffix of the substring',
          'Number of matching vowels',
          'Index of the next mismatch',
          'Hash value of the prefix',
        ],
        correctIndex: 0,
        explanation: 'LPS[i] stores the length of the longest proper prefix of pattern[0..i] that matches a suffix of pattern[0..i].',
      },
    ],
    codeSnippets: kmpSnippets,
    isFlagship: false,
  },

  // Batch J: Bit Manipulation Tricks
  'bit-manipulation': {
    id: 'bit-manipulation',
    title: 'Bit Manipulation Tricks',
    subtitle: 'Harness the raw binary hardware ALU for instantaneous O(1) mathematical feats',
    categoryId: 'advanced',
    categoryName: 'Advanced Topics',
    dataStructureType: 'array',
    difficulty: 'Intermediate',
    analogy: {
      title: 'The Electric Switchboard',
      story: 'Instead of writing down 8 separate true/false checkboxes, you have a single byte with 8 microscopic physical light switches. A single CPU cycle can flip, check, mask, or count all 8 switches simultaneously with zero memory allocation.',
      keyLesson: 'Bitwise AND (&), OR (|), XOR (^), NOT (~), and shifts (<<, >>) execute in 1 clock cycle. Essential for subsets, caches, and low-level systems.',
    },
    defaultInput: [0, 0, 1, 0, 1, 0, 1, 0],
    inputPlaceholder: '0, 0, 1, 0, 1, 0, 1, 0',
    inputDescription: '8-bit binary representation of number 42',
    complexity: {
      bestTime: 'O(1) All Bitwise Operations',
      avgTime: 'O(1)',
      worstTime: 'O(1)',
      space: 'O(1) in CPU registers',
      whyTime: 'Directly supported as fundamental hardware ALU machine instructions.',
      whySpace: 'Stores up to 64 flags in a single 64-bit integer.',
    },
    commonMistakes: [
      {
        title: 'Operator Precedence Bugs in C/C++/JS',
        misconception: 'Writing `if (x & 1 == 0)` expecting bitwise AND before equality.',
        fix: 'Equality `==` has higher precedence than `&`! Always wrap bit operations in parentheses: `if ((x & 1) == 0)`.',
      },
    ],
    quiz: [
      {
        id: 'bit-q1',
        question: 'What does the expression `(n & (n - 1)) == 0` check for a positive integer n?',
        options: ['Whether n is odd', 'Whether n is a power of 2', 'Whether n is divisible by 3', 'Whether n is negative'],
        correctIndex: 1,
        explanation: 'A power of 2 has exactly one \'1\' bit. Subtracting 1 flips all bits after that bit. If their AND is 0, n was a power of 2.',
      },
    ],
    codeSnippets: bitManipulationSnippets,
    isFlagship: false,
  },
};

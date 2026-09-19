import { Step, HighlightRole } from '../types/simulation';
import { Language } from '../types/topic';

export const hashingSnippets: Record<Language, string> = {
  python: `class HashTableOpenAddressing:
    def __init__(self, size=7):
        self.size = size
        self.table = [None] * size

    def insert(self, key):
        idx = key % self.size
        start_idx = idx
        while self.table[idx] is not None:
            idx = (idx + 1) % self.size
            if idx == start_idx:
                raise Exception("Table Full")
        self.table[idx] = key
        return idx`,

  cpp: `class HashTable {
    int size;
    vector<int> table;
public:
    HashTable(int s = 7) : size(s), table(s, -1) {}
    int insert(int key) {
        int idx = key % size;
        int start = idx;
        while (table[idx] != -1) {
            idx = (idx + 1) % size;
            if (idx == start) throw runtime_error("Full");
        }
        table[idx] = key;
        return idx;
    }
};`,

  javascript: `class HashTable {
  constructor(size = 7) {
    this.size = size;
    this.table = new Array(size).fill(null);
  }
  insert(key) {
    let idx = key % this.size;
    const start = idx;
    while (this.table[idx] !== null) {
      idx = (idx + 1) % this.size;
      if (idx === start) throw new Error("Table is full");
    }
    this.table[idx] = key;
    return idx;
  }
}`
};

export function generateHashTableOpenAddressingSteps(
  keys: number[] = [15, 22, 8, 29]
): Step<(number | null)[]>[] {
  const size = 7;
  const table: (number | null)[] = new Array(size).fill(null);
  const steps: Step<(number | null)[]>[] = [];
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...table],
    highlights: {},
    description: `Hash Table (Linear Probing) initialized with ${size} bucket slots. Hash function: hash(key) = key % ${size}.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { tableSize: size } },
  });

  for (const key of keys) {
    let idx = key % size;

    steps.push({
      id: stepId++,
      state: [...table],
      highlights: { [idx]: 'comparing' },
      pointers: { probe: idx },
      description: `Inserting key ${key}: initial hash index = ${key} % ${size} = ${idx}. Checking slot ${idx}.`,
      codeLine: 7,
      explanation: { action: 'COMPUTE HASH', variables: { key, initialIndex: idx } },
    });

    while (table[idx] !== null) {
      steps.push({
        id: stepId++,
        state: [...table],
        highlights: { [idx]: 'danger' },
        pointers: { collision: idx },
        description: `Collision at slot ${idx}! Occupied by ${table[idx]}. Linear probing: probe next slot (${idx} + 1) % ${size} = ${(idx + 1) % size}.`,
        codeLine: 10,
        explanation: { action: 'COLLISION PROBE', variables: { occupiedBy: String(table[idx]), nextSlot: (idx + 1) % size } },
      });
      idx = (idx + 1) % size;
    }

    table[idx] = key;
    const placedHl: Record<number, HighlightRole> = { [idx]: 'sorted' };

    steps.push({
      id: stepId++,
      state: [...table],
      highlights: placedHl,
      pointers: { placed: idx },
      description: `Found empty slot! Placed key ${key} at index ${idx}. Average insertion time: O(1).`,
      codeLine: 13,
      explanation: { action: 'PLACED KEY', variables: { key, slot: idx } },
    });
  }

  return steps;
}

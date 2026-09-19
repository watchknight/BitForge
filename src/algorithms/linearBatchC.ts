import { Step, HighlightRole } from '../types/simulation';
import { LLNode } from '../engine/renderers/LinkedListRenderer';
import { Language } from '../types/topic';

// ==========================================
// 1. DOUBLY LINKED LIST
// ==========================================
export const doublyLinkedListSnippets: Record<Language, string> = {
  python: `class DNode:
    def __init__(self, val, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next

def insert_front(head, val):
    new_node = DNode(val, None, head)
    if head:
        head.prev = new_node
    return new_node

def delete_node(head, target_node):
    if not head or not target_node:
        return head
    if head == target_node:
        head = head.next
    if target_node.next:
        target_node.next.prev = target_node.prev
    if target_node.prev:
        target_node.prev.next = target_node.next
    return head`,

  cpp: `struct DNode {
    int val;
    DNode* prev;
    DNode* next;
    DNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};

DNode* insertFront(DNode* head, int val) {
    DNode* newNode = new DNode(val);
    newNode->next = head;
    if (head) head->prev = newNode;
    return newNode;
}

DNode* deleteNode(DNode* head, DNode* target) {
    if (!head || !target) return head;
    if (head == target) head = head->next;
    if (target->next) target->next->prev = target->prev;
    if (target->prev) target->prev->next = target->next;
    delete target;
    return head;
}`,

  javascript: `class DNode {
  constructor(val) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

function insertFront(head, val) {
  const newNode = new DNode(val);
  newNode.next = head;
  if (head) head.prev = newNode;
  return newNode;
}

function deleteNode(head, target) {
  if (!head || !target) return head;
  if (head === target) head = head.next;
  if (target.next) target.next.prev = target.prev;
  if (target.prev) target.prev.next = target.next;
  return head;
}`
};

export function generateDoublyLinkedListSteps(
  initialValues: number[] = [10, 20, 30],
  insertVal: number = 5
): Step<{ nodes: LLNode[]; detachedNode?: LLNode | null }>[] {
  const steps: Step<{ nodes: LLNode[]; detachedNode?: LLNode | null }>[] = [];
  let stepId = 1;

  let currentNodes: LLNode[] = initialValues.map((val, idx) => ({
    id: `dnode-${idx}-${val}`,
    val,
  }));

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: null },
    highlights: {},
    pointers: currentNodes.length > 0 ? { head: currentNodes[0].id } : {},
    description: `Doubly Linked List initialized with ${currentNodes.length} nodes. Each node stores data, a 'next' pointer, and a 'prev' pointer.`,
    codeLine: 7,
    explanation: { action: 'INITIALIZE', variables: { count: currentNodes.length } },
  });

  const newNode: LLNode = { id: `dnode-new-${insertVal}`, val: insertVal };

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: newNode },
    highlights: { [newNode.id]: 'active' },
    pointers: { newNode: newNode.id },
    description: `Allocated new DNode with value ${insertVal}. Ready to insert at front.`,
    codeLine: 8,
    explanation: { action: 'ALLOCATE', variables: { val: insertVal } },
  });

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: newNode },
    highlights: { [newNode.id]: 'active', [currentNodes[0].id]: 'comparing' },
    pointers: { newNode: newNode.id, head: currentNodes[0].id },
    description: `Set newNode.next = head (${currentNodes[0].val}). Set current head.prev = newNode. Dual bidirectional links established!`,
    codeLine: 10,
    explanation: { action: 'LINK BIDIRECTIONAL', variables: { 'newNode.next': currentNodes[0].val, 'head.prev': insertVal } },
  });

  currentNodes = [newNode, ...currentNodes];

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: null },
    highlights: { [newNode.id]: 'sorted' },
    pointers: { head: newNode.id },
    description: `Updated head pointer to point to newNode. O(1) prepend completed!`,
    codeLine: 11,
    explanation: { action: 'COMPLETE', variables: { newHead: insertVal } },
  });

  return steps;
}

// ==========================================
// 2. STACK (LIFO)
// ==========================================
export const stackSnippets: Record<Language, string> = {
  python: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, val):
        self.items.append(val)
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("Pop from empty stack")
    def peek(self):
        return self.items[-1] if self.items else None
    def is_empty(self):
        return len(self.items) == 0`,

  cpp: `class Stack {
private:
    vector<int> items;
public:
    void push(int val) {
        items.push_back(val);
    }
    int pop() {
        if (items.empty()) throw runtime_error("Empty");
        int val = items.back();
        items.pop_back();
        return val;
    }
    int top() { return items.back(); }
    bool isEmpty() { return items.empty(); }
};`,

  javascript: `class Stack {
  constructor() {
    this.items = [];
  }
  push(val) {
    this.items.push(val);
  }
  pop() {
    if (this.isEmpty()) throw new Error("Empty stack");
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}`
};

export function generateStackSteps(
  initialStack: number[] = [10, 25, 40],
  pushVal: number = 88
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialStack];
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: arr.length > 0 ? { [arr.length - 1]: 'active' } : {},
    pointers: arr.length > 0 ? { top: arr.length - 1 } : {},
    description: `Stack initialized with ${arr.length} items. LIFO principle: Last-In, First-Out. Top item is arr[${arr.length - 1}] (${arr[arr.length - 1]}).`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { size: arr.length, top: arr[arr.length - 1] } },
  });

  // Push operation
  arr.push(pushVal);
  const pushHl: Record<number, HighlightRole> = { [arr.length - 1]: 'sorted' };

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: pushHl,
    pointers: { top: arr.length - 1 },
    description: `Executed push(${pushVal}). New element placed at top of stack in O(1) time.`,
    codeLine: 5,
    explanation: { action: 'PUSH', variables: { pushedValue: pushVal, newSize: arr.length } },
  });

  // Pop operation
  const popped = arr.pop()!;
  const popHl: Record<number, HighlightRole> = { [arr.length - 1]: 'active' };

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: popHl,
    pointers: { top: arr.length - 1 },
    description: `Executed pop(). Removed and returned top item (${popped}). Top pointer returns to ${arr[arr.length - 1]}.`,
    codeLine: 7,
    explanation: { action: 'POP', variables: { poppedValue: popped, remainingSize: arr.length } },
  });

  return steps;
}

// ==========================================
// 3. QUEUE (FIFO) & DEQUE
// ==========================================
export const queueSnippets: Record<Language, string> = {
  python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    def enqueue(self, val):
        self.items.append(val)
    def dequeue(self):
        if self.items:
            return self.items.popleft()
        return None`,

  cpp: `#include <queue>

class Queue {
    queue<int> q;
public:
    void enqueue(int val) {
        q.push(val);
    }
    int dequeue() {
        int val = q.front();
        q.pop();
        return val;
    }
};`,

  javascript: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(val) {
    this.items.push(val);
  }
  dequeue() {
    return this.items.shift();
  }
}`
};

export function generateQueueSteps(
  initialQueue: number[] = [14, 28, 42],
  enqueueVal: number = 77
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const arr = [...initialQueue];
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'active', [arr.length - 1]: 'secondary' },
    pointers: { front: 0, rear: arr.length - 1 },
    description: `Queue initialized with ${arr.length} items. FIFO principle: First-In, First-Out. Front is ${arr[0]}, Rear is ${arr[arr.length - 1]}.`,
    codeLine: 4,
    explanation: { action: 'INITIALIZE', variables: { front: arr[0], rear: arr[arr.length - 1] } },
  });

  // Enqueue
  arr.push(enqueueVal);
  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'active', [arr.length - 1]: 'sorted' },
    pointers: { front: 0, rear: arr.length - 1 },
    description: `Executed enqueue(${enqueueVal}). Added to rear of queue in O(1) time.`,
    codeLine: 7,
    explanation: { action: 'ENQUEUE', variables: { enqueued: enqueueVal, queueLength: arr.length } },
  });

  // Dequeue
  const dequeued = arr.shift()!;
  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'active', [arr.length - 1]: 'secondary' },
    pointers: { front: 0, rear: arr.length - 1 },
    description: `Executed dequeue(). Removed front item (${dequeued}) in O(1) time. Next in line is now ${arr[0]}.`,
    codeLine: 10,
    explanation: { action: 'DEQUEUE', variables: { dequeuedVal: dequeued, newFront: arr[0] } },
  });

  return steps;
}

// Circular Queue
export function generateCircularQueueSteps(
  capacity: number = 5,
  operations: string[] = ['enq:10', 'enq:20', 'enq:30', 'deq', 'enq:40', 'enq:50', 'enq:60']
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const ring = new Array(capacity).fill(0);
  let front = 0;
  let rear = -1;
  let size = 0;
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...ring],
    highlights: {},
    description: `Circular Queue initialized with capacity ${capacity}. Front and rear indices wrap around modulo capacity: index = (index + 1) % ${capacity}.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { capacity, size: 0 } },
  });

  for (const op of operations) {
    if (op.startsWith('enq:')) {
      const val = Number(op.split(':')[1]);
      if (size === capacity) {
        steps.push({
          id: stepId++,
          state: [...ring],
          highlights: {},
          description: `Queue Overflow! Cannot enqueue ${val}; circular queue is at max capacity (${capacity}).`,
          codeLine: 5,
          explanation: { action: 'OVERFLOW', variables: { size, capacity } },
        });
        continue;
      }

      rear = (rear + 1) % capacity;
      ring[rear] = val;
      size++;

      const hl: Record<number, HighlightRole> = {};
      hl[front] = 'active';
      hl[rear] = 'sorted';

      steps.push({
        id: stepId++,
        state: [...ring],
        highlights: hl,
        pointers: { front, rear },
        description: `Enqueued ${val} at rear index (${rear}). Wrapped with rear = (rear + 1) % ${capacity}. Current size: ${size}/${capacity}.`,
        codeLine: 7,
        explanation: { action: 'ENQUEUE', variables: { val, front, rear, size } },
      });
    } else if (op === 'deq') {
      if (size === 0) continue;

      const dequeuedVal = ring[front];
      ring[front] = 0;
      front = (front + 1) % capacity;
      size--;

      const hl: Record<number, HighlightRole> = {};
      hl[front] = 'active';
      if (size > 0) hl[rear] = 'secondary';

      steps.push({
        id: stepId++,
        state: [...ring],
        highlights: hl,
        pointers: { front, rear },
        description: `Dequeued value ${dequeuedVal}. Advanced front = (front + 1) % ${capacity} = ${front}. Size: ${size}/${capacity}.`,
        codeLine: 9,
        explanation: { action: 'DEQUEUE', variables: { dequeuedVal, newFront: front, size } },
      });
    }
  }

  return steps;
}

// Priority Queue (Binary Max-Heap Array)
export function generatePriorityQueueSteps(
  initialPQ: number[] = [80, 60, 70, 30, 40],
  insertVal: number = 95
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  const heap = [...initialPQ];
  let stepId = 1;

  steps.push({
    id: stepId++,
    state: [...heap],
    highlights: { 0: 'pivot' },
    pointers: { maxPriority: 0 },
    description: `Priority Queue (Max-Heap). The highest priority element always sits at root index 0 (${heap[0]}).`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { highestPriority: heap[0] } },
  });

  // Insert & Bubble up
  heap.push(insertVal);
  let curr = heap.length - 1;

  steps.push({
    id: stepId++,
    state: [...heap],
    highlights: { [curr]: 'active' },
    pointers: { inserted: curr },
    description: `Inserted new task with priority ${insertVal} at end of heap (index ${curr}). Bubbling up to restore max-heap.`,
    codeLine: 5,
    explanation: { action: 'INSERT AT END', variables: { priority: insertVal, index: curr } },
  });

  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2);
    if (heap[curr] > heap[parent]) {
      const hl: Record<number, HighlightRole> = { [curr]: 'active', [parent]: 'comparing' };
      steps.push({
        id: stepId++,
        state: [...heap],
        highlights: hl,
        pointers: { curr, parent },
        description: `heap[${curr}] (${heap[curr]}) > parent heap[${parent}] (${heap[parent]}). Swapping to float higher priority up.`,
        codeLine: 8,
        explanation: { action: 'BUBBLE UP SWAP', variables: { curr, parent } },
      });

      const temp = heap[curr];
      heap[curr] = heap[parent];
      heap[parent] = temp;
      curr = parent;
    } else {
      break;
    }
  }

  const finalHl: Record<number, HighlightRole> = { 0: 'sorted' };
  steps.push({
    id: stepId++,
    state: [...heap],
    highlights: finalHl,
    pointers: { newMax: 0 },
    description: `Priority Queue updated! Priority ${insertVal} is now at the root ready for O(1) peek or O(log N) extraction.`,
    codeLine: 10,
    explanation: { action: 'COMPLETE', variables: { topPriority: heap[0] } },
  });

  return steps;
}

// ==========================================
// 6. CIRCULAR LINKED LIST
// ==========================================
export const circularLinkedListSnippets: Record<Language, string> = {
  python: `class CNode:
    def __init__(self, val):
        self.val = val
        self.next = None

def insert_end(head, val):
    new_node = CNode(val)
    if not head:
        new_node.next = new_node
        return new_node
    curr = head
    while curr.next != head:
        curr = curr.next
    curr.next = new_node
    new_node.next = head
    return head`,

  cpp: `struct CNode {
    int val;
    CNode* next;
    CNode(int v) : val(v), next(nullptr) {}
};

CNode* insertEnd(CNode* head, int val) {
    CNode* newNode = new CNode(val);
    if (!head) {
        newNode->next = newNode;
        return newNode;
    }
    CNode* curr = head;
    while (curr->next != head) {
        curr = curr->next;
    }
    curr->next = newNode;
    newNode->next = head;
    return head;
}`,

  javascript: `function insertEndCircular(head, val) {
  const newNode = { val, next: null };
  if (!head) {
    newNode.next = newNode;
    return newNode;
  }
  let curr = head;
  while (curr.next !== head) {
    curr = curr.next;
  }
  curr.next = newNode;
  newNode.next = head;
  return head;
}`
};

export function generateCircularLinkedListSteps(
  initialValues: number[] = [10, 20, 30],
  insertVal: number = 40
): Step<{ nodes: LLNode[]; detachedNode?: LLNode | null }>[] {
  const steps: Step<{ nodes: LLNode[]; detachedNode?: LLNode | null }>[] = [];
  let stepId = 1;

  let currentNodes: LLNode[] = initialValues.map((val, idx) => ({
    id: `cnode-${idx}-${val}`,
    val,
  }));

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: null },
    highlights: {},
    pointers: currentNodes.length > 0 ? { head: currentNodes[0].id, tail: currentNodes[currentNodes.length - 1].id } : {},
    description: `Circular Linked List with ${currentNodes.length} nodes. Tail (${currentNodes[currentNodes.length - 1].val}) points directly back to Head (${currentNodes[0].val}) creating an endless loop.`,
    codeLine: 8,
    explanation: { action: 'INITIALIZE', variables: { totalNodes: currentNodes.length } },
  });

  const newNode: LLNode = { id: `cnode-new-${insertVal}`, val: insertVal };

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: newNode },
    highlights: { [newNode.id]: 'active' },
    pointers: { newNode: newNode.id },
    description: `Allocated new node with value ${insertVal}. Preparing to insert at end of circular ring.`,
    codeLine: 9,
    explanation: { action: 'ALLOCATE', variables: { val: insertVal } },
  });

  const lastNode = currentNodes[currentNodes.length - 1];
  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: newNode },
    highlights: { [lastNode.id]: 'comparing', [newNode.id]: 'active' },
    pointers: { tail: lastNode.id, newNode: newNode.id },
    description: `Traversed to tail node (${lastNode.val}). Repoint tail.next to newNode.`,
    codeLine: 14,
    explanation: { action: 'LINK TAIL TO NEW', variables: { from: lastNode.val, to: insertVal } },
  });

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: newNode },
    highlights: { [newNode.id]: 'sorted', [currentNodes[0].id]: 'comparing' },
    pointers: { newNode: newNode.id, head: currentNodes[0].id },
    description: `Set newNode.next = head (${currentNodes[0].val}). Circular link closed!`,
    codeLine: 15,
    explanation: { action: 'CLOSE RING', variables: { 'newNode.next': currentNodes[0].val } },
  });

  currentNodes = [...currentNodes, newNode];

  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: null },
    highlights: { [newNode.id]: 'sorted' },
    pointers: { head: currentNodes[0].id, newTail: newNode.id },
    description: `Insertion complete. Circular linked list now contains [${currentNodes.map((n) => n.val).join(' -> ')} -> (back to head)].`,
    codeLine: 16,
    explanation: { action: 'COMPLETE', variables: { newTail: insertVal } },
  });

  return steps;
}

// ==========================================
// 7. DEQUE (DOUBLE-ENDED QUEUE)
// ==========================================
export const dequeSnippets: Record<Language, string> = {
  python: `from collections import deque

d = deque([20, 30])
d.appendleft(10)  # Push front: O(1)
d.append(40)      # Push back:  O(1)
d.popleft()       # Pop front:  O(1)
d.pop()           # Pop back:   O(1)`,

  cpp: `#include <deque>
using namespace std;

deque<int> dq = {20, 30};
dq.push_front(10); // O(1)
dq.push_back(40);  // O(1)
dq.pop_front();    // O(1)
dq.pop_back();     // O(1)`,

  javascript: `// In JS, a double-ended linked list or ring buffer implements O(1) Deque
class Deque {
  constructor() { this.items = []; }
  pushFront(val) { this.items.unshift(val); }
  pushBack(val) { this.items.push(val); }
  popFront() { return this.items.shift(); }
  popBack() { return this.items.pop(); }
}`
};

export function generateDequeSteps(
  initialArr: number[] = [20, 30, 40]
): Step<number[]>[] {
  const steps: Step<number[]>[] = [];
  let stepId = 1;
  let arr = [...initialArr];

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: {},
    pointers: { front: 0, back: arr.length - 1 },
    description: `Double-Ended Queue (Deque) initialized: [${arr.join(', ')}]. Allows O(1) insertion and deletion from both Ends (Front & Back).`,
    codeLine: 3,
    explanation: { action: 'INITIALIZE', variables: { size: arr.length } },
  });

  // Push Front: 10
  arr = [10, ...arr];
  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'active' },
    pointers: { front: 0, back: arr.length - 1 },
    description: `push_front(10): Inserted 10 at the front of the Deque in O(1) amortized time.`,
    codeLine: 4,
    explanation: { action: 'PUSH FRONT', variables: { val: 10 } },
  });

  // Push Back: 50
  arr = [...arr, 50];
  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { [arr.length - 1]: 'active' },
    pointers: { front: 0, back: arr.length - 1 },
    description: `push_back(50): Inserted 50 at the back of the Deque in O(1) amortized time.`,
    codeLine: 5,
    explanation: { action: 'PUSH BACK', variables: { val: 50 } },
  });

  // Pop Back: 50 removed
  const popped = arr.pop();
  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { [arr.length - 1]: 'danger' },
    pointers: { front: 0, back: arr.length - 1 },
    description: `pop_back(): Removed ${popped} from the rear of the Deque in O(1) time.`,
    codeLine: 7,
    explanation: { action: 'POP BACK', variables: { removed: popped ?? 0 } },
  });

  steps.push({
    id: stepId++,
    state: [...arr],
    highlights: { 0: 'sorted', [arr.length - 1]: 'sorted' },
    pointers: { front: 0, back: arr.length - 1 },
    description: `Deque operations finished. Final state: [${arr.join(', ')}]. Perfect for sliding window maximum and work-stealing schedulers.`,
    codeLine: 8,
    explanation: { action: 'COMPLETE', variables: { remainingSize: arr.length } },
  });

  return steps;
}

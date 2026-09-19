import { Step, HighlightRole } from '../types/simulation';
import { LLNode } from '../engine/renderers/LinkedListRenderer';
import { Language } from '../types/topic';

export interface LinkedListSimulationState {
  nodes: LLNode[];
  detachedNode?: LLNode | null;
}

export type LLOperationType = 'insertHead' | 'insertTail' | 'insertIndex' | 'deleteVal' | 'traverse';

export const linkedListSnippets: Record<Language, string> = {
  python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_at_index(head, val, index):
    new_node = ListNode(val)
    if index == 0:
        new_node.next = head
        return new_node
    curr = head
    for _ in range(index - 1):
        if not curr:
            break
        curr = curr.next
    new_node.next = curr.next
    curr.next = new_node
    return head

def delete_value(head, val):
    if not head:
        return None
    if head.val == val:
        return head.next
    curr = head
    while curr.next and curr.next.val != val:
        curr = curr.next
    if curr.next:
        curr.next = curr.next.next
    return head`,

  cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* insertAtIndex(ListNode* head, int val, int index) {
    ListNode* newNode = new ListNode(val);
    if (index == 0) {
        newNode->next = head;
        return newNode;
    }
    ListNode* curr = head;
    for (int i = 0; i < index - 1 && curr; ++i) {
        curr = curr->next;
    }
    newNode->next = curr->next;
    curr->next = newNode;
    return head;
}

ListNode* deleteValue(ListNode* head, int val) {
    if (!head) return nullptr;
    if (head->val == val) return head->next;
    ListNode* curr = head;
    while (curr->next && curr->next->val != val) {
        curr = curr->next;
    }
    if (curr->next) {
        curr->next = curr->next->next;
    }
    return head;
}`,

  javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function insertAtIndex(head, val, index) {
  const newNode = new ListNode(val);
  if (index === 0) {
    newNode.next = head;
    return newNode;
  }
  let curr = head;
  for (let i = 0; i < index - 1 && curr; i++) {
    curr = curr.next;
  }
  newNode.next = curr.next;
  curr.next = newNode;
  return head;
}

function deleteValue(head, val) {
  if (!head) return null;
  if (head.val === val) return head.next;
  let curr = head;
  while (curr.next && curr.next.val !== val) {
    curr = curr.next;
  }
  if (curr.next) {
    curr.next = curr.next.next;
  }
  return head;
}`
};

export function generateLinkedListSteps(
  initialValues: number[] = [12, 45, 78],
  operation: { type: LLOperationType; val: number; index?: number } = {
    type: 'insertIndex',
    val: 99,
    index: 2,
  }
): Step<LinkedListSimulationState>[] {
  const steps: Step<LinkedListSimulationState>[] = [];
  let stepId = 1;

  let currentNodes: LLNode[] = initialValues.map((val, idx) => ({
    id: `node-${idx}-${val}`,
    val,
  }));

  // Initial State
  steps.push({
    id: stepId++,
    state: { nodes: [...currentNodes], detachedNode: null },
    highlights: {},
    pointers: currentNodes.length > 0 ? { head: currentNodes[0].id } : {},
    description: `Current Singly Linked List with ${currentNodes.length} nodes. Ready to execute operation: ${operation.type}(val=${operation.val}${
      operation.index !== undefined ? `, index=${operation.index}` : ''
    }).`,
    codeLine: 6,
    explanation: {
      action: 'INITIAL STATE',
      variables: { totalNodes: currentNodes.length, operation: operation.type },
    },
  });

  if (operation.type === 'insertHead' || (operation.type === 'insertIndex' && operation.index === 0)) {
    const newNode: LLNode = { id: `node-new-${operation.val}`, val: operation.val };

    // Step 1: Allocate new node
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: newNode },
      highlights: { [newNode.id]: 'active' },
      pointers: { newNode: newNode.id },
      description: `Allocated new ListNode with value ${operation.val}. It is currently detached with next = null.`,
      codeLine: 7,
      explanation: {
        action: 'ALLOCATE',
        variables: { newNodeVal: operation.val, next: 'null' },
      },
    });

    // Step 2: Link newNode.next = head
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: newNode },
      highlights: { [newNode.id]: 'active', ...(currentNodes[0] ? { [currentNodes[0].id]: 'comparing' } : {}) },
      pointers: { newNode: newNode.id, ...(currentNodes[0] ? { head: currentNodes[0].id } : {}) },
      description: `Point new_node.next to the current head (${currentNodes[0] ? currentNodes[0].val : 'NULL'}).`,
      codeLine: 9,
      explanation: {
        action: 'REWIRE NEXT',
        variables: { 'newNode.next': currentNodes[0] ? currentNodes[0].val : 'NULL' },
      },
    });

    // Step 3: Update head
    currentNodes = [newNode, ...currentNodes];
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: null },
      highlights: { [newNode.id]: 'sorted' },
      pointers: { head: newNode.id },
      description: `New node is now the new HEAD of the list! Insertion at head completed in O(1) time.`,
      codeLine: 10,
      explanation: {
        action: 'COMPLETE',
        variables: { newHead: newNode.val, totalNodes: currentNodes.length },
      },
    });
  } else if (operation.type === 'insertIndex') {
    const targetIdx = Math.max(0, Math.min(operation.index ?? 1, currentNodes.length));
    const newNode: LLNode = { id: `node-new-${operation.val}`, val: operation.val };

    // Step 1: Allocate new node
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: newNode },
      highlights: { [newNode.id]: 'active' },
      pointers: { newNode: newNode.id },
      description: `Created new node with value ${operation.val}. Looking to insert at index ${targetIdx}.`,
      codeLine: 7,
      explanation: { action: 'ALLOCATE', variables: { val: operation.val, targetIndex: targetIdx } },
    });

    // Step 2: Traverse to predecessor (index - 1)
    let currIdx = 0;
    while (currIdx < targetIdx - 1 && currIdx < currentNodes.length - 1) {
      steps.push({
        id: stepId++,
        state: { nodes: [...currentNodes], detachedNode: newNode },
        highlights: { [currentNodes[currIdx].id]: 'comparing' },
        pointers: { curr: currentNodes[currIdx].id, newNode: newNode.id },
        description: `Advancing traversal pointer 'curr': currently at index ${currIdx} (val: ${currentNodes[currIdx].val}).`,
        codeLine: 15,
        explanation: {
          action: 'TRAVERSE',
          variables: { currIndex: currIdx, currVal: currentNodes[currIdx].val },
        },
      });
      currIdx++;
    }

    // At predecessor
    const predNode = currentNodes[currIdx];
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: newNode },
      highlights: { [predNode.id]: 'active' },
      pointers: { curr: predNode.id, newNode: newNode.id },
      description: `Found predecessor node at index ${currIdx} (val: ${predNode.val}). Next we attach new_node.next to curr.next.`,
      codeLine: 16,
      explanation: { action: 'FOUND PREDECESSOR', variables: { predVal: predNode.val } },
    });

    // Wire new_node.next
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: newNode },
      highlights: {
        [newNode.id]: 'comparing',
        ...(currentNodes[currIdx + 1] ? { [currentNodes[currIdx + 1].id]: 'comparing' } : {}),
      },
      pointers: { curr: predNode.id, newNode: newNode.id },
      description: `Linked new_node.next to curr.next (${
        currentNodes[currIdx + 1] ? currentNodes[currIdx + 1].val : 'NULL'
      }).`,
      codeLine: 17,
      explanation: { action: 'LINK NEXT', variables: { 'newNode.next': currentNodes[currIdx + 1]?.val || 'NULL' } },
    });

    // Splice into currentNodes
    currentNodes.splice(targetIdx, 0, newNode);
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: null },
      highlights: { [newNode.id]: 'sorted' },
      pointers: { curr: newNode.id },
      description: `Updated curr.next to point to new_node. Node successfully spliced into the list at index ${targetIdx}!`,
      codeLine: 18,
      explanation: { action: 'INSERTION COMPLETE', variables: { insertedAt: targetIdx } },
    });
  } else if (operation.type === 'deleteVal') {
    const targetVal = operation.val;

    // Check head
    if (currentNodes.length > 0 && currentNodes[0].val === targetVal) {
      steps.push({
        id: stepId++,
        state: { nodes: [...currentNodes], detachedNode: null },
        highlights: { [currentNodes[0].id]: 'danger' },
        pointers: { head: currentNodes[0].id },
        description: `Head node contains target value ${targetVal} to delete!`,
        codeLine: 24,
        explanation: { action: 'FOUND TARGET', variables: { val: targetVal } },
      });

      const deleted = currentNodes.shift();
      steps.push({
        id: stepId++,
        state: { nodes: [...currentNodes], detachedNode: deleted },
        highlights: currentNodes[0] ? { [currentNodes[0].id]: 'sorted' } : {},
        pointers: currentNodes[0] ? { head: currentNodes[0].id } : {},
        description: `Deleted head node. Updated head pointer to head.next. O(1) deletion.`,
        codeLine: 25,
        explanation: { action: 'DELETED HEAD', variables: { remainingNodes: currentNodes.length } },
      });
    } else {
      // Traverse to find node where curr.next.val == targetVal
      let currIdx = 0;
      let found = false;

      while (currIdx < currentNodes.length - 1) {
        const curr = currentNodes[currIdx];
        const next = currentNodes[currIdx + 1];

        steps.push({
          id: stepId++,
          state: { nodes: [...currentNodes], detachedNode: null },
          highlights: { [curr.id]: 'active', [next.id]: 'comparing' },
          pointers: { curr: curr.id, 'curr.next': next.id },
          description: `Checking if curr.next (val: ${next.val}) matches target (${targetVal}).`,
          codeLine: 27,
          explanation: { action: 'SEARCHING', variables: { 'curr.next.val': next.val, target: targetVal } },
        });

        if (next.val === targetVal) {
          found = true;
          // Step: found node to delete
          steps.push({
            id: stepId++,
            state: { nodes: [...currentNodes], detachedNode: null },
            highlights: { [curr.id]: 'active', [next.id]: 'danger' },
            pointers: { curr: curr.id, target: next.id },
            description: `Found match! curr.next (${next.val}) matches ${targetVal}. Bypassing node by setting curr.next = curr.next.next.`,
            codeLine: 30,
            explanation: { action: 'BYPASS NODE', variables: { deleting: next.val } },
          });

          const removed = currentNodes.splice(currIdx + 1, 1)[0];
          steps.push({
            id: stepId++,
            state: { nodes: [...currentNodes], detachedNode: removed },
            highlights: { [curr.id]: 'sorted' },
            pointers: { curr: curr.id },
            description: `Node with value ${targetVal} unlinked and removed!`,
            codeLine: 31,
            explanation: { action: 'DELETE COMPLETE', variables: { remainingCount: currentNodes.length } },
          });
          break;
        }

        currIdx++;
      }

      if (!found) {
        steps.push({
          id: stepId++,
          state: { nodes: [...currentNodes], detachedNode: null },
          highlights: {},
          description: `Finished list traversal. Value ${targetVal} was not found in the list.`,
          codeLine: 32,
          explanation: { action: 'NOT FOUND', variables: { target: targetVal } },
        });
      }
    }
  } else {
    // Traverse operation
    for (let i = 0; i < currentNodes.length; i++) {
      steps.push({
        id: stepId++,
        state: { nodes: [...currentNodes], detachedNode: null },
        highlights: { [currentNodes[i].id]: 'active' },
        pointers: { curr: currentNodes[i].id },
        description: `Visiting node at index ${i} with value ${currentNodes[i].val}. Following 'next' pointer.`,
        codeLine: 12,
        explanation: { action: 'VISITING', variables: { index: i, val: currentNodes[i].val } },
      });
    }
    steps.push({
      id: stepId++,
      state: { nodes: [...currentNodes], detachedNode: null },
      highlights: {},
      description: `Reached NULL. Traversal complete! Visited all ${currentNodes.length} nodes in O(N) time.`,
      codeLine: 13,
      explanation: { action: 'COMPLETE', variables: { totalVisited: currentNodes.length } },
    });
  }

  return steps;
}

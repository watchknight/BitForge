import { Step, HighlightRole } from '../types/simulation';
import { GraphNode, GraphEdge } from '../engine/renderers/GraphRenderer';
import { Language } from '../types/topic';

export interface BFSSimulationState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  queue: string[];
  visited: string[];
  distances: Record<string, number>;
  activeEdge?: { from: string; to: string } | null;
}

export const defaultGraphNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 80, y: 150 },
  { id: 'B', label: 'B', x: 200, y: 70 },
  { id: 'C', label: 'C', x: 200, y: 230 },
  { id: 'D', label: 'D', x: 340, y: 70 },
  { id: 'E', label: 'E', x: 340, y: 230 },
  { id: 'F', label: 'F', x: 480, y: 150 },
];

export const defaultGraphEdges: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'B', to: 'C' },
  { from: 'D', to: 'E' },
  { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
];

export const bfsSnippets: Record<Language, string> = {
  python: `from collections import deque

def bfs(graph, start_node):
    visited = set([start_node])
    queue = deque([start_node])
    distances = {start_node: 0}

    while queue:
        curr = queue.popleft()
        for neighbor in graph[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                distances[neighbor] = distances[curr] + 1
                queue.append(neighbor)
    return distances`,

  cpp: `#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>

unordered_map<char, int> bfs(unordered_map<char, vector<char>>& graph, char start) {
    unordered_set<char> visited;
    queue<char> q;
    unordered_map<char, int> dist;

    visited.insert(start);
    q.push(start);
    dist[start] = 0;

    while (!q.empty()) {
        char curr = q.front();
        q.pop();
        for (char neighbor : graph[curr]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                dist[neighbor] = dist[curr] + 1;
                q.push(neighbor);
            }
        }
    }
    return dist;
}`,

  javascript: `function bfs(graph, startNode) {
  const visited = new Set([startNode]);
  const queue = [startNode];
  const distances = { [startNode]: 0 };

  while (queue.length > 0) {
    const curr = queue.shift();
    for (const neighbor of graph[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        distances[neighbor] = distances[curr] + 1;
        queue.push(neighbor);
      }
    }
  }
  return distances;
}`
};

export function generateBFSSteps(
  nodes: GraphNode[] = defaultGraphNodes,
  edges: GraphEdge[] = defaultGraphEdges,
  startNodeId: string = 'A'
): Step<BFSSimulationState>[] {
  const steps: Step<BFSSimulationState>[] = [];
  let stepId = 1;

  // Validate startNodeId exists in the graph, default to first node or 'A'
  const validStart = nodes.some((n) => n.id === startNodeId) ? startNodeId : (nodes[0]?.id || 'A');

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (adj[e.to]) adj[e.to].push(e.from); // undirected
  });

  const visited: string[] = [validStart];
  const queue: string[] = [validStart];
  const distances: Record<string, number> = { [validStart]: 0 };

  // Step 0: Initialization
  steps.push({
    id: stepId++,
    state: {
      nodes,
      edges,
      queue: [...queue],
      visited: [...visited],
      distances: { ...distances },
      activeEdge: null,
    },
    highlights: { [validStart]: 'active' },
    pointers: { start: validStart },
    description: `Initializing Breadth-First Search at start node '${validStart}'. Mark '${validStart}' as visited, set distance=0, and enqueue it.`,
    codeLine: 4,
    explanation: {
      action: 'INITIALIZE',
      variables: { start: validStart, queueSize: queue.length, visitedCount: visited.length },
    },
  });

  while (queue.length > 0) {
    // Pop front of queue
    const curr = queue.shift()!;

    const currHl: Record<string, HighlightRole> = {};
    visited.forEach((v) => (currHl[v] = 'visited'));
    currHl[curr] = 'active';

    steps.push({
      id: stepId++,
      state: {
        nodes,
        edges,
        queue: [...queue],
        visited: [...visited],
        distances: { ...distances },
        activeEdge: null,
      },
      highlights: currHl,
      pointers: { curr },
      description: `Dequeued front node '${curr}'. Now inspecting all adjacent neighbors of '${curr}'.`,
      codeLine: 9,
      explanation: {
        action: 'DEQUEUE',
        variables: { curr, remainingQueue: queue.join(', ') || 'empty' },
      },
    });

    const neighbors = adj[curr] || [];

    for (const neighbor of neighbors) {
      const isAlreadyVisited = visited.includes(neighbor);

      // Check neighbor step
      steps.push({
        id: stepId++,
        state: {
          nodes,
          edges,
          queue: [...queue],
          visited: [...visited],
          distances: { ...distances },
          activeEdge: { from: curr, to: neighbor },
        },
        highlights: {
          ...currHl,
          [curr]: 'active',
          [neighbor]: isAlreadyVisited ? 'visited' : 'comparing',
        },
        pointers: { curr, neighbor },
        description: `Inspecting edge (${curr} -> ${neighbor}). Neighbor '${neighbor}' is ${
          isAlreadyVisited ? 'ALREADY visited — skipping.' : 'UNVISITED!'
        }`,
        codeLine: 11,
        explanation: {
          action: isAlreadyVisited ? 'SKIP VISITED' : 'DISCOVER NEIGHBOR',
          variables: { curr, neighbor, visited: isAlreadyVisited },
        },
      });

      if (!isAlreadyVisited) {
        visited.push(neighbor);
        distances[neighbor] = distances[curr] + 1;
        queue.push(neighbor);

        steps.push({
          id: stepId++,
          state: {
            nodes,
            edges,
            queue: [...queue],
            visited: [...visited],
            distances: { ...distances },
            activeEdge: { from: curr, to: neighbor },
          },
          highlights: {
            ...currHl,
            [curr]: 'active',
            [neighbor]: 'sorted',
          },
          pointers: { curr, neighbor },
          description: `Discovered new node '${neighbor}'! Marked as visited, set distance = ${distances[curr]} + 1 = ${distances[neighbor]}, and pushed to queue.`,
          codeLine: 13,
          explanation: {
            action: 'ENQUEUE',
            variables: { neighbor, distance: distances[neighbor], newQueue: queue.join(', ') },
          },
        });
      }
    }
  }

  // Final Step: Completion
  const finalHl: Record<string, HighlightRole> = {};
  nodes.forEach((n) => (finalHl[n.id] = 'visited'));

  steps.push({
    id: stepId++,
    state: {
      nodes,
      edges,
      queue: [],
      visited: [...visited],
      distances: { ...distances },
      activeEdge: null,
    },
    highlights: finalHl,
    description: `Queue is empty! Breadth-First Search complete. Shortest distance from '${startNodeId}' to all reachable nodes computed in O(V + E) time.`,
    codeLine: 15,
    explanation: {
      action: 'COMPLETE',
      variables: { totalVisited: visited.length, allDistances: JSON.stringify(distances) },
    },
  });

  return steps;
}

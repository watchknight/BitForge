import { Step, HighlightRole } from '../types/simulation';
import { GraphNode, GraphEdge } from '../engine/renderers/GraphRenderer';
import { defaultGraphNodes, defaultGraphEdges } from './bfs';
import { Language } from '../types/topic';

// ==========================================
// 1. DEPTH-FIRST SEARCH (DFS)
// ==========================================
export const dfsSnippets: Record<Language, string> = {
  python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited`,

  cpp: `void dfs(unordered_map<char, vector<char>>& graph, char curr, unordered_set<char>& visited) {
    visited.insert(curr);
    for (char neighbor : graph[curr]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(graph, neighbor, visited);
        }
    }
}`,

  javascript: `function dfs(graph, curr, visited = new Set()) {
  visited.add(curr);
  for (const neighbor of graph[curr]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}`
};

export function generateDFSSteps(startNodeId: string = 'A'): Step<any>[] {
  const steps: Step<any>[] = [];
  let stepId = 1;
  const nodes = defaultGraphNodes;
  const edges = defaultGraphEdges;

  // Validate startNodeId exists in the graph, default to 'A' if invalid
  const validStart = nodes.some((n) => n.id === startNodeId) ? startNodeId : (nodes[0]?.id || 'A');

  // Adjacency map
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (adj[e.to]) adj[e.to].push(e.from);
  });

  const visited: string[] = [];
  const stack: string[] = [validStart];

  steps.push({
    id: stepId++,
    state: { nodes, edges, queue: [...stack], visited: [...visited], distances: {} },
    highlights: { [validStart]: 'active' },
    pointers: { start: validStart },
    description: `Starting Depth-First Search at root node '${validStart}'. DFS plunges deeply along each branch before backtracking.`,
    codeLine: 1,
    explanation: { action: 'INITIALIZE', variables: { start: validStart } },
  });

  function visitDFS(u: string) {
    visited.push(u);

    const hl: Record<string, HighlightRole> = {};
    visited.forEach((v) => (hl[v] = 'visited'));
    hl[u] = 'active';

    steps.push({
      id: stepId++,
      state: { nodes, edges, queue: [...visited], visited: [...visited], distances: {} },
      highlights: hl,
      pointers: { curr: u },
      description: `Visited node '${u}'. Exploring unvisited adjacent edges.`,
      codeLine: 4,
      explanation: { action: 'VISIT NODE', variables: { node: u, totalVisited: visited.length } },
    });

    for (const v of (adj[u] || [])) {
      if (!visited.includes(v)) {
        steps.push({
          id: stepId++,
          state: { nodes, edges, queue: [...visited], visited: [...visited], distances: {}, activeEdge: { from: u, to: v } },
          highlights: { ...hl, [u]: 'active', [v]: 'comparing' },
          pointers: { curr: u, next: v },
          description: `Discovered unvisited neighbor '${v}'. Plunging deeper into node '${v}'.`,
          codeLine: 7,
          explanation: { action: 'RECURSIVE CALL', variables: { from: u, to: v } },
        });

        visitDFS(v);
      }
    }
  }

  visitDFS(startNodeId);

  const finalHl: Record<string, HighlightRole> = {};
  visited.forEach((v) => (finalHl[v] = 'sorted'));

  steps.push({
    id: stepId++,
    state: { nodes, edges, queue: [], visited: [...visited], distances: {} },
    highlights: finalHl,
    description: `DFS Complete! Visited all ${visited.length} reachable vertices in O(V + E) time.`,
    codeLine: 8,
    explanation: { action: 'COMPLETE', variables: { visited: visited.join(', ') } },
  });

  return steps;
}

// ==========================================
// 2. DIJKSTRA'S SHORTEST PATH
// ==========================================
const weightedGraphNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 80, y: 150 },
  { id: 'B', label: 'B', x: 220, y: 70 },
  { id: 'C', label: 'C', x: 220, y: 230 },
  { id: 'D', label: 'D', x: 360, y: 70 },
  { id: 'E', label: 'E', x: 360, y: 230 },
  { id: 'F', label: 'F', x: 480, y: 150 },
];

const weightedGraphEdges: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'E', weight: 8 },
  { from: 'C', to: 'D', weight: 10 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'D', weight: 2 },
  { from: 'E', to: 'F', weight: 3 },
];

export function generateDijkstraSteps(startId: string = 'A'): Step<any>[] {
  const steps: Step<any>[] = [];
  let stepId = 1;
  const nodes = weightedGraphNodes;
  const edges = weightedGraphEdges;

  // Validate startId exists in the weighted graph, default to 'A' if invalid
  const validStart = nodes.some((n) => n.id === startId) ? startId : (nodes[0]?.id || 'A');

  const dist: Record<string, number> = {};
  nodes.forEach((n) => (dist[n.id] = Infinity));
  dist[validStart] = 0;

  const visited = new Set<string>();
  const pq: Array<{ id: string; d: number }> = [{ id: validStart, d: 0 }];

  steps.push({
    id: stepId++,
    state: { nodes, edges, queue: [validStart], visited: [], distances: { ...dist } },
    highlights: { [validStart]: 'active' },
    description: `Dijkstra's Algorithm from start '${validStart}'. Initialized distance to '${validStart}' = 0, all other nodes = ∞.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { start: validStart, dist: 0 } },
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { id: u, d: uDist } = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    const hl: Record<string, HighlightRole> = {};
    visited.forEach((v) => (hl[v] = 'sorted'));
    hl[u] = 'active';

    steps.push({
      id: stepId++,
      state: { nodes, edges, queue: pq.map((p) => `${p.id}(${p.d})`), visited: Array.from(visited), distances: { ...dist } },
      highlights: hl,
      pointers: { currMin: u },
      description: `Extracted minimum distance node '${u}' (dist=${uDist}). Mark '${u}' as finalized.`,
      codeLine: 6,
      explanation: { action: 'EXTRACT MIN', variables: { node: u, finalizedDistance: uDist } },
    });

    // Relax neighbors
    for (const e of edges) {
      let v: string | null = null;
      if (e.from === u) v = e.to;
      else if (e.to === u) v = e.from;

      if (v && !visited.has(v)) {
        const weight = e.weight || 1;
        const newDist = uDist + weight;

        if (newDist < dist[v]) {
          dist[v] = newDist;
          pq.push({ id: v, d: newDist });

          steps.push({
            id: stepId++,
            state: { nodes, edges, queue: pq.map((p) => `${p.id}(${p.d})`), visited: Array.from(visited), distances: { ...dist }, activeEdge: { from: u, to: v } },
            highlights: { ...hl, [u]: 'active', [v]: 'comparing' },
            description: `Relaxed edge (${u} -> ${v}, w=${weight}): shorter path found! Updated dist[${v}] = ${uDist} + ${weight} = ${newDist}.`,
            codeLine: 10,
            explanation: { action: 'RELAX EDGE', variables: { from: u, to: v, weight, newDistance: newDist } },
          });
        }
      }
    }
  }

  return steps;
}

// ==========================================
// 3. TOPOLOGICAL SORT (KAHN'S ALGORITHM)
// ==========================================
export function generateTopologicalSortSteps(): Step<any>[] {
  const steps: Step<any>[] = [];
  let stepId = 1;

  // DAG: 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3
  const dagNodes: GraphNode[] = [
    { id: 'T0', label: 'T0: Math', x: 100, y: 150 },
    { id: 'T1', label: 'T1: DSA', x: 250, y: 80 },
    { id: 'T2', label: 'T2: System', x: 250, y: 220 },
    { id: 'T3', label: 'T3: Capstone', x: 420, y: 150 },
  ];

  const dagEdges: GraphEdge[] = [
    { from: 'T0', to: 'T1', directed: true },
    { from: 'T0', to: 'T2', directed: true },
    { from: 'T1', to: 'T3', directed: true },
    { from: 'T2', to: 'T3', directed: true },
  ];

  steps.push({
    id: stepId++,
    state: { nodes: dagNodes, edges: dagEdges, queue: ['T0'], visited: [] },
    highlights: { T0: 'active' },
    description: `Topological Sort (Kahn's Algorithm). Directed Acyclic Graph (DAG) of university courses. In-degree of T0 is 0 (no prerequisites)! Pushed to queue.`,
    codeLine: 2,
    explanation: { action: 'INITIALIZE', variables: { zeroInDegree: 'T0' } },
  });

  const order = ['T0', 'T1', 'T2', 'T3'];
  for (let i = 0; i < order.length; i++) {
    const curr = order[i];
    const hl: Record<string, HighlightRole> = {};
    order.slice(0, i).forEach((c) => (hl[c] = 'sorted'));
    hl[curr] = 'active';

    steps.push({
      id: stepId++,
      state: { nodes: dagNodes, edges: dagEdges, queue: order.slice(i + 1), visited: order.slice(0, i + 1) },
      highlights: hl,
      pointers: { takingCourse: curr },
      description: `Course '${curr}' prereqs fulfilled! Added to linear graduation schedule: [${order.slice(0, i + 1).join(' -> ')}].`,
      codeLine: 6,
      explanation: { action: 'RESOLVE PREREQ', variables: { completed: curr, orderSoFar: order.slice(0, i + 1).join(', ') } },
    });
  }

  return steps;
}

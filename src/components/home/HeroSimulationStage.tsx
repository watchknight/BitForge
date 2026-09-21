import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ListOrdered, 
  GitBranch, 
  Network, 
  Layers, 
  Activity, 
  Sparkles,
  ArrowRight,
  Terminal,
  Code2
} from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { useAccessibility } from '../../context/AccessibilityContext';

export type ArchetypeTab = 'quicksort' | 'bst' | 'graph' | 'list';

interface HeroSimulationStageProps {
  onSelectTopic?: (topicId: string) => void;
}

// ---------------------------------------------------------------------------
// Tab 1: Quick Sort State Machine
// ---------------------------------------------------------------------------
const quicksortSteps = [
    {
      arr: [38, 14, 76, 29, 62, 19, 85, 48],
      pivotIdx: 7,
      comparing: [0, 7],
      swapping: [] as number[],
      sorted: [] as number[],
      narration: 'QuickSort begins: select pivot element 48 at index [7]. Partitioning subarray [38..48].',
      code: 'int pivot = arr[high]; // 48',
      telemetry: { time: 'O(N log N)', space: 'O(log N)', phase: 'PIVOT SELECT' }
    },
    {
      arr: [38, 14, 76, 29, 62, 19, 85, 48],
      pivotIdx: 7,
      comparing: [2, 7],
      swapping: [] as number[],
      sorted: [] as number[],
      narration: 'Compare arr[2] (76) with pivot (48). 76 > 48, so it stays in the right partition.',
      code: 'if (arr[j] <= pivot) { ... } // 76 > 48, skip',
      telemetry: { time: 'O(N log N)', space: 'O(log N)', phase: 'SCANNING' }
    },
    {
      arr: [38, 14, 76, 29, 62, 19, 85, 48],
      pivotIdx: 7,
      comparing: [3, 7],
      swapping: [2, 3],
      sorted: [] as number[],
      narration: 'Found arr[3] (29) < 48. Swap arr[2] (76) with arr[3] (29) into left partition.',
      code: 'swap(&arr[i], &arr[j]); // swap 76 ⟷ 29',
      telemetry: { time: 'O(N log N)', space: 'O(log N)', phase: 'SWAP PARTITION' }
    },
    {
      arr: [38, 14, 29, 76, 62, 19, 85, 48],
      pivotIdx: 7,
      comparing: [5, 7],
      swapping: [3, 5],
      sorted: [] as number[],
      narration: 'Compare arr[5] (19) < 48. Swap arr[3] (76) with arr[5] (19). Smaller values shift left.',
      code: 'swap(&arr[i], &arr[j]); // swap 76 ⟷ 19',
      telemetry: { time: 'O(N log N)', space: 'O(log N)', phase: 'SWAP PARTITION' }
    },
    {
      arr: [38, 14, 29, 19, 62, 76, 85, 48],
      pivotIdx: 7,
      comparing: [4, 7],
      swapping: [4, 7],
      sorted: [] as number[],
      narration: 'End of partition: swap pivot 48 with arr[4] (62) to seat 48 into its permanent rank.',
      code: 'swap(&arr[i + 1], &arr[high]); // Seat pivot',
      telemetry: { time: 'O(N log N)', space: 'O(log N)', phase: 'PIVOT SETTLED' }
    },
    {
      arr: [38, 14, 29, 19, 48, 76, 85, 62],
      pivotIdx: 4,
      comparing: [] as number[],
      swapping: [] as number[],
      sorted: [4],
      narration: 'Pivot 48 is now Tempered at final index [4]. Recursing on left & right sub-partitions.',
      code: 'quickSort(arr, low, pi - 1); quickSort(arr, pi + 1, high);',
      telemetry: { time: 'O(N log N)', space: 'O(log N)', phase: 'DIVIDE & CONQUER' }
    },
    {
      arr: [14, 19, 29, 38, 48, 62, 76, 85],
      pivotIdx: -1,
      comparing: [] as number[],
      swapping: [] as number[],
      sorted: [0, 1, 2, 3, 4, 5, 6, 7],
      narration: 'Array fully sorted & tempered! Zero memory allocations required (In-Place Sort).',
      code: '// Sorted in O(N log N) time & O(log N) stack',
      telemetry: { time: 'O(N log N)', space: 'O(1) Aux', phase: 'TEMPERED (COMPLETE)' }
    }
  ];

  // ---------------------------------------------------------------------------
  // Tab 2: Binary Search Tree State Machine
  // ---------------------------------------------------------------------------
  const bstNodes = [
    { id: '50', val: 50, x: 200, y: 35, left: '30', right: '70' },
    { id: '30', val: 30, x: 110, y: 95, left: '20', right: '42' },
    { id: '70', val: 70, x: 290, y: 95, left: '60', right: '85' },
    { id: '20', val: 20, x: 65, y: 155 },
    { id: '42', val: 42, x: 155, y: 155 },
    { id: '60', val: 60, x: 245, y: 155 },
    { id: '85', val: 85, x: 335, y: 155 }
  ];

  const bstSteps = [
    {
      target: 42,
      activeNode: '50',
      visitedNodes: ['50'],
      foundNode: null as string | null,
      activeBranch: '50-30',
      narration: 'Query: search(root, target = 42). Inspect root node (50). Since 42 < 50, branch LEFT.',
      code: 'if (target < root->val) return search(root->left, target);',
      telemetry: { time: 'O(log N)', space: 'O(1)', phase: 'COMPARING ROOT' }
    },
    {
      target: 42,
      activeNode: '30',
      visitedNodes: ['50', '30'],
      foundNode: null as string | null,
      activeBranch: '30-42',
      narration: 'Traverse to left child (30). Compare: 42 > 30. Search space halved again! Branch RIGHT.',
      code: 'else if (target > root->val) return search(root->right, target);',
      telemetry: { time: 'O(log N)', space: 'O(1)', phase: 'SEARCHING LEFT SUBTREE' }
    },
    {
      target: 42,
      activeNode: '42',
      visitedNodes: ['50', '30', '42'],
      foundNode: '42',
      activeBranch: null,
      narration: 'Target match: node->val == 42! Node illuminated and retrieved in exactly 2 comparisons.',
      code: 'if (root->val == target) return root; // Key Found!',
      telemetry: { time: 'O(log N)', space: 'O(1)', phase: 'TARGET CONFIRMED' }
    },
    {
      target: 70,
      activeNode: '50',
      visitedNodes: ['50'],
      foundNode: null as string | null,
      activeBranch: '50-70',
      narration: 'New Query: search(root, target = 70). Start at root (50). Since 70 > 50, branch RIGHT.',
      code: 'if (target > root->val) return search(root->right, target);',
      telemetry: { time: 'O(log N)', space: 'O(1)', phase: 'SEARCHING RIGHT SUBTREE' }
    },
    {
      target: 70,
      activeNode: '70',
      visitedNodes: ['50', '70'],
      foundNode: '70',
      activeBranch: null,
      narration: 'Target match: node (70) located in 1 step! Demonstrates O(log N) logarithmic speed.',
      code: 'return root; // Key Found at Depth 1',
      telemetry: { time: 'O(log N)', space: 'O(1)', phase: 'TARGET CONFIRMED' }
    }
  ];

  // ---------------------------------------------------------------------------
  // Tab 3: Breadth-First Search (Graph) State Machine
  // ---------------------------------------------------------------------------
  const graphNodes = [
    { id: 'A', label: '0', x: 60, y: 100 },
    { id: 'B', label: '1', x: 145, y: 45 },
    { id: 'C', label: '2', x: 145, y: 155 },
    { id: 'D', label: '3', x: 255, y: 45 },
    { id: 'E', label: '4', x: 255, y: 155 },
    { id: 'F', label: '5', x: 340, y: 100 }
  ];

  const graphEdges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'E' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'F' },
    { from: 'E', to: 'F' }
  ];

  const graphSteps = [
    {
      activeNodes: ['A'],
      frontierNodes: ['A'],
      visitedNodes: ['A'],
      activeEdges: [] as string[],
      queue: ['0'],
      narration: 'BFS Initialized: push Source Node 0 into FIFO Queue. Visited set: {0}. Distance: 0.',
      code: 'queue.push(source); visited.insert(source);',
      telemetry: { time: 'O(V + E)', space: 'O(V)', phase: 'SOURCE ENQUEUE' }
    },
    {
      activeNodes: ['B', 'C'],
      frontierNodes: ['B', 'C'],
      visitedNodes: ['A', 'B', 'C'],
      activeEdges: ['A-B', 'A-C'],
      queue: ['1', '2'],
      narration: 'Wavefront expands: dequeue 0, discover unvisited neighbors [1, 2]. Distance: 1 hop.',
      code: 'for (auto& nbr : adj[curr]) if (!visited.count(nbr)) queue.push(nbr);',
      telemetry: { time: 'O(V + E)', space: 'O(V)', phase: 'WAVEFRONT LEVEL 1' }
    },
    {
      activeNodes: ['D', 'E'],
      frontierNodes: ['D', 'E'],
      visitedNodes: ['A', 'B', 'C', 'D', 'E'],
      activeEdges: ['B-D', 'C-E', 'C-D'],
      queue: ['3', '4'],
      narration: 'Dequeue 1 & 2: wave expands into Layer 2 nodes [3, 4]. Cross-edge (2-3) skipped.',
      code: '// Cross-edge 2->3 ignored: node 3 already marked discovered',
      telemetry: { time: 'O(V + E)', space: 'O(V)', phase: 'WAVEFRONT LEVEL 2' }
    },
    {
      activeNodes: ['F'],
      frontierNodes: ['F'],
      visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
      activeEdges: ['D-F', 'E-F'],
      queue: ['5'],
      narration: 'Shortest path confirmed! Target Node 5 reached in exactly 3 hops (0 ➔ 1 ➔ 3 ➔ 5).',
      code: 'if (curr == target) return reconstruct_path(); // Guaranteed Shortest',
      telemetry: { time: 'O(V + E)', space: 'O(V)', phase: 'TARGET REACHED' }
    }
  ];

  // ---------------------------------------------------------------------------
  // Tab 4: Singly Linked List Reversal State Machine
  // ---------------------------------------------------------------------------
  const listSteps = [
    {
      nodes: [12, 29, 47, 85],
      pointers: { prev: -1, curr: 0, next: 1 },
      reversedEdges: [] as number[],
      narration: 'Pointer setup: prev = NULL, curr = HEAD (12), next = curr->next (29).',
      code: 'Node* prev = nullptr; Node* curr = head;',
      telemetry: { time: 'O(N)', space: 'O(1)', phase: 'POINTER INIT' }
    },
    {
      nodes: [12, 29, 47, 85],
      pointers: { prev: 0, curr: 1, next: 2 },
      reversedEdges: [0],
      narration: 'Flip pointer: 12->next = NULL. Shift pointers: prev = 12, curr = 29, next = 47.',
      code: 'curr->next = prev; prev = curr; curr = next;',
      telemetry: { time: 'O(N)', space: 'O(1)', phase: 'REVERSING NODE 0' }
    },
    {
      nodes: [12, 29, 47, 85],
      pointers: { prev: 1, curr: 2, next: 3 },
      reversedEdges: [0, 1],
      narration: 'Flip pointer: 29 points backward to 12. Advance: prev = 29, curr = 47, next = 85.',
      code: 'curr->next = prev; prev = curr; curr = next;',
      telemetry: { time: 'O(N)', space: 'O(1)', phase: 'REVERSING NODE 1' }
    },
    {
      nodes: [12, 29, 47, 85],
      pointers: { prev: 2, curr: 3, next: -1 },
      reversedEdges: [0, 1, 2],
      narration: 'Flip pointer: 47 points backward to 29. Advance: prev = 47, curr = 85 (Tail).',
      code: 'curr->next = prev; prev = curr; curr = next;',
      telemetry: { time: 'O(N)', space: 'O(1)', phase: 'REVERSING NODE 2' }
    },
    {
      nodes: [12, 29, 47, 85],
      pointers: { prev: 3, curr: -1, next: -1 },
      reversedEdges: [0, 1, 2, 3],
      narration: 'Final flip: 85->next = 47. Reversal complete! New HEAD = 85. Mutated in-place.',
      code: 'head = prev; return head; // O(N) linear time, O(1) aux space',
      telemetry: { time: 'O(N)', space: 'O(1)', phase: 'REVERSAL COMPLETE' }
    }
  ];

export const HeroSimulationStage: React.FC<HeroSimulationStageProps> = React.memo(({ onSelectTopic }) => {
  const { reducedMotion } = useAccessibility();
  const [activeTab, setActiveTab] = useState<ArchetypeTab>('quicksort');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFast, setIsFast] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => soundEngine.getMuted());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<string | number | null>(null);

  const stepIndexRef = useRef(stepIndex);
  stepIndexRef.current = stepIndex;
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(!document.hidden);

  // Sync sound mute state
  useEffect(() => {
    return soundEngine.subscribe((muted) => setSoundMuted(muted));
  }, []);

  // Track document visibility to suspend playback when tab is backgrounded
  useEffect(() => {
    const handleVis = () => setIsDocVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // IntersectionObserver: Suspend autoplay loop and audio when scrolled out of view
  useEffect(() => {
    const container = stageContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Get current max steps for active tab
  const getMaxSteps = useCallback(() => {
    switch (activeTab) {
      case 'quicksort': return quicksortSteps.length;
      case 'bst': return bstSteps.length;
      case 'graph': return graphSteps.length;
      case 'list': return listSteps.length;
    }
  }, [activeTab]);

  // Step advancement with sound sonification (only when visible to save mobile audio resources)
  const handleStep = useCallback((delta: number = 1) => {
    const max = getMaxSteps();
    const next = (stepIndexRef.current + delta + max) % max;
    setStepIndex(next);
    // Play tactile auditory feedback only when in viewport and document is active
    if (delta > 0 && isInView && isDocVisible) {
      if (next === max - 1) {
        soundEngine.playStepSound('complete', 0.9);
      } else {
        soundEngine.playStepSound('compare', next / max);
      }
    }
  }, [getMaxSteps, isInView, isDocVisible]);

  // Reset step index when tab changes
  const handleTabChange = (tab: ArchetypeTab) => {
    soundEngine.playStepSound('highlight', 0.5);
    setActiveTab(tab);
    setStepIndex(0);
  };

  // Autoplay loop timer (automatically suspended when scrolled off screen or tab hidden)
  useEffect(() => {
    if (!isPlaying || !isInView || !isDocVisible) return;
    const intervalTime = isFast ? 750 : 1400;
    const timer = setInterval(() => {
      handleStep(1);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isInView, isDocVisible, isFast, handleStep]);

  // Keyboard shortcut listener for spacebar play/pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Only when not typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStep(1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStep(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleStep]);

  // Current step records
  const currentQs = quicksortSteps[stepIndex % quicksortSteps.length];
  const currentBst = bstSteps[stepIndex % bstSteps.length];
  const currentGraph = graphSteps[stepIndex % graphSteps.length];
  const currentList = listSteps[stepIndex % listSteps.length];

  // Active step info helper
  const getActiveMeta = () => {
    switch (activeTab) {
      case 'quicksort': return currentQs;
      case 'bst': return currentBst;
      case 'graph': return currentGraph;
      case 'list': return currentList;
    }
  };
  const activeMeta = getActiveMeta();

  // Topic navigation helper
  const getTopicIdForTab = () => {
    switch (activeTab) {
      case 'quicksort': return 'merge-sort';
      case 'bst': return 'binary-search-tree';
      case 'graph': return 'breadth-first-search';
      case 'list': return 'singly-linked-list';
    }
  };

  return (
    <div 
      ref={stageContainerRef}
      className="relative w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl bg-obsidian-900/90 border border-brand-500/25 shadow-2xl shadow-obsidian-950/80 backdrop-blur-xl overflow-hidden transition-all duration-300 group hover:border-brand-500/40"
    >
      {/* Top Ambient Glow Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

      {/* Console Title Bar / Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-obsidian-950/70">
        {/* Left: Terminal Window Dots & Live Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-sm" />
          </div>
          <div className="h-3 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            </span>
            <span className="text-[11px] font-mono tracking-wider font-semibold uppercase text-slate-300">
              FORGE LAB // {isPlaying ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Center/Right: Archetype Switcher Tabs */}
        <div 
          role="tablist" 
          aria-label="Algorithm archetypes"
          className="flex items-center gap-1 bg-obsidian-900 border border-slate-800 rounded-xl p-1 overflow-x-auto max-w-full scrollbar-none"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'quicksort'}
            onClick={() => handleTabChange('quicksort')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'quicksort'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Array Sort</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'bst'}
            onClick={() => handleTabChange('bst')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'bst'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Binary Tree</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'graph'}
            onClick={() => handleTabChange('graph')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'graph'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graph BFS</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'list'}
            onClick={() => handleTabChange('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'list'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Linked List</span>
          </button>
        </div>

        {/* Telemetry Chips (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded-md bg-obsidian-900 border border-slate-800 text-amber-400">
            {activeMeta.telemetry.time}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-obsidian-900 border border-slate-800 text-steel-300">
            {activeMeta.telemetry.space}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/30 text-brand-300 uppercase font-semibold">
            {activeMeta.telemetry.phase}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage Canvas */}
      <div className="p-4 sm:p-6 lg:p-8 min-h-[240px] sm:min-h-[260px] flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-obsidian-950/40 via-transparent to-obsidian-950/40">
        <AnimatePresence mode="wait">
          {/* TAB 1: QUICK SORT ARRAY VISUALIZER */}
          {activeTab === 'quicksort' && (
            <motion.div
              key="quicksort"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl h-44 sm:h-52 flex items-end justify-center gap-2 sm:gap-3.5 px-2 pb-2"
            >
              {currentQs.arr.map((val, idx) => {
                const isPivot = idx === currentQs.pivotIdx;
                const isComp = currentQs.comparing.includes(idx);
                const isSwap = currentQs.swapping.includes(idx);
                const isSorted = currentQs.sorted.includes(idx);
                const heightPercent = Math.max(22, Math.round((val / 100) * 100));

                let barColor = 'bg-[#333842] text-slate-400 border border-slate-700/50';
                if (isSwap) {
                  barColor = 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 border border-rose-400 scale-105';
                } else if (isComp) {
                  barColor = 'bg-amber-400 text-obsidian-950 shadow-lg shadow-amber-400/40 border border-amber-300';
                } else if (isPivot) {
                  barColor = 'bg-gradient-to-t from-brand-600 to-amber-400 text-white shadow-lg shadow-brand-500/50 border border-amber-300 ring-2 ring-brand-500/50';
                } else if (isSorted) {
                  barColor = 'bg-sky-400 text-obsidian-950 shadow-md shadow-sky-400/30 border border-sky-300';
                }

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredNode(idx)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full max-w-[56px] relative group/bar cursor-pointer"
                  >
                    {/* Pivot indicator badge */}
                    {isPivot && (
                      <span className="absolute -top-7 text-[10px] font-mono font-bold bg-brand-500 text-obsidian-950 px-1.5 py-0.5 rounded uppercase tracking-wider animate-bounce shadow">
                        PIVOT
                      </span>
                    )}

                    {/* Value label */}
                    <span className={`text-[11px] sm:text-xs font-mono font-bold mb-1.5 transition-colors ${
                      isComp || isSwap || isPivot ? 'text-white scale-110' : 'text-slate-400'
                    }`}>
                      {val}
                    </span>

                    {/* Animated bar element */}
                    <motion.div
                      layout={!reducedMotion}
                      style={{ height: `${heightPercent}%` }}
                      transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                    />

                    {/* Index label */}
                    <span className="text-[10px] font-mono text-slate-500 mt-1.5">
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 2: BINARY SEARCH TREE VISUALIZER */}
          {activeTab === 'bst' && (
            <motion.div
              key="bst"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg flex flex-col items-center"
            >
              {/* Target Indicator */}
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Target Key:</span>
                <span className="text-amber-400 font-bold text-sm">{currentBst.target}</span>
              </div>

              {/* Tree SVG */}
              <svg viewBox="0 0 400 195" className="w-full h-44 sm:h-52 overflow-visible">
                {/* Connecting Edges */}
                <g stroke="#3d434f" strokeWidth="2" strokeLinecap="round">
                  <line x1="200" y1="35" x2="110" y2="95" className={currentBst.visitedNodes.includes('30') ? 'stroke-amber-400 stroke-[2.5]' : ''} />
                  <line x1="200" y1="35" x2="290" y2="95" className={currentBst.visitedNodes.includes('70') ? 'stroke-amber-400 stroke-[2.5]' : ''} />
                  <line x1="110" y1="95" x2="65" y2="155" className={currentBst.visitedNodes.includes('20') ? 'stroke-amber-400 stroke-[2.5]' : ''} />
                  <line x1="110" y1="95" x2="155" y2="155" className={currentBst.visitedNodes.includes('42') ? 'stroke-sky-400 stroke-[2.5]' : ''} />
                  <line x1="290" y1="95" x2="245" y2="155" className={currentBst.visitedNodes.includes('60') ? 'stroke-amber-400 stroke-[2.5]' : ''} />
                  <line x1="290" y1="95" x2="335" y2="155" className={currentBst.visitedNodes.includes('85') ? 'stroke-amber-400 stroke-[2.5]' : ''} />
                </g>

                {/* Nodes */}
                {bstNodes.map((node) => {
                  const isActive = node.id === currentBst.activeNode;
                  const isFound = node.id === currentBst.foundNode;
                  const isVisited = currentBst.visitedNodes.includes(node.id);

                  let fill = '#1e2229';
                  let stroke = '#3d434f';
                  let textColor = '#cbd5e1';

                  if (isFound) {
                    fill = '#38bdf8';
                    stroke = '#0284c7';
                    textColor = '#0c0c0e';
                  } else if (isActive) {
                    fill = '#f59e0b';
                    stroke = '#f97316';
                    textColor = '#0c0c0e';
                  } else if (isVisited) {
                    fill = '#475569';
                    stroke = '#f59e0b';
                    textColor = '#ffedd5';
                  }

                  return (
                    <g key={node.id} className="cursor-pointer">
                      {isActive && (
                        <circle cx={node.x} cy={node.y} r="21" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
                      )}
                      {isFound && (
                        <circle cx={node.x} cy={node.y} r="21" fill="rgba(56, 189, 248, 0.3)" className="animate-pulse" />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive || isFound ? '2.5' : '2'}
                        className="transition-colors duration-300"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          )}

          {/* TAB 3: BREADTH-FIRST SEARCH GRAPH VISUALIZER */}
          {activeTab === 'graph' && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg flex flex-col items-center"
            >
              {/* Queue Status Ticker */}
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">FIFO Queue:</span>
                <div className="flex items-center gap-1">
                  {currentGraph.queue.map((q, i) => (
                    <span key={i} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold">
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Graph SVG */}
              <svg viewBox="0 0 400 200" className="w-full h-44 sm:h-52 overflow-visible">
                {/* Edges */}
                <g stroke="#3d434f" strokeWidth="2" strokeLinecap="round">
                  {graphEdges.map((e, idx) => {
                    const fromNode = graphNodes.find(n => n.id === e.from)!;
                    const toNode = graphNodes.find(n => n.id === e.to)!;
                    const edgeKey = `${e.from}-${e.to}`;
                    const isActive = currentGraph.activeEdges.includes(edgeKey);

                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={isActive ? 'stroke-amber-400 stroke-[2.5] transition-all' : ''}
                      />
                    );
                  })}
                </g>

                {/* Nodes */}
                {graphNodes.map((node) => {
                  const isVisited = currentGraph.visitedNodes.includes(node.id);
                  const isFrontier = currentGraph.frontierNodes.includes(node.id);

                  let fill = '#1e2229';
                  let stroke = '#3d434f';
                  let textColor = '#cbd5e1';

                  if (isFrontier) {
                    fill = '#f59e0b';
                    stroke = '#f97316';
                    textColor = '#0c0c0e';
                  } else if (isVisited) {
                    fill = '#0284c7';
                    stroke = '#38bdf8';
                    textColor = '#f0f9ff';
                  }

                  return (
                    <g key={node.id} className="cursor-pointer">
                      {isFrontier && (
                        <circle cx={node.x} cy={node.y} r="22" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isFrontier ? '2.5' : '2'}
                        className="transition-colors duration-300"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          )}

          {/* TAB 4: LINKED LIST REVERSAL VISUALIZER */}
          {activeTab === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl h-44 sm:h-52 flex items-center justify-center gap-2 sm:gap-4 px-2"
            >
              {currentList.nodes.map((val, idx) => {
                const isCurr = currentList.pointers.curr === idx;
                const isPrev = currentList.pointers.prev === idx;
                const isNext = currentList.pointers.next === idx;
                const isReversed = currentList.reversedEdges.includes(idx);

                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center relative">
                      {/* Pointer Badge Top */}
                      <div className="h-5 mb-1 flex items-center">
                        {isCurr && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500 text-obsidian-950 uppercase tracking-wider animate-bounce shadow">
                            CURR
                          </span>
                        )}
                        {isPrev && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-400 text-obsidian-950 uppercase tracking-wider shadow">
                            PREV
                          </span>
                        )}
                        {isNext && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-obsidian-950 uppercase tracking-wider shadow">
                            NEXT
                          </span>
                        )}
                      </div>

                      {/* Node Box */}
                      <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border-2 shadow-lg transition-all duration-300 ${
                        isCurr
                          ? 'bg-amber-400 text-obsidian-950 border-amber-300 shadow-amber-400/30 scale-105'
                          : isPrev
                          ? 'bg-sky-400 text-obsidian-950 border-sky-300 shadow-sky-400/30'
                          : 'bg-[#1e2229] text-white border-slate-700'
                      }`}>
                        {val}
                      </div>

                      {/* Address / Position Subtext */}
                      <span className="text-[10px] font-mono text-slate-500 mt-1">
                        Node {idx}
                      </span>
                    </div>

                    {/* Connecting Pointer Arrow */}
                    {idx < currentList.nodes.length - 1 && (
                      <div className="flex items-center text-slate-500 font-mono text-xs sm:text-sm px-0.5">
                        <span className={`transition-all duration-300 font-bold ${
                          isReversed ? 'text-sky-400 scale-110' : 'text-amber-400'
                        }`}>
                          {isReversed ? '⮌' : '➔'}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Synced Narration & Code Line Ticker */}
      <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-b border-slate-800/80 bg-obsidian-950/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
        {/* Narration */}
        <div className="flex items-center gap-2 text-slate-300 truncate">
          <Terminal className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span className="text-slate-400 shrink-0">STATE:</span>
          <span className="truncate text-slate-200">
            {activeMeta.narration}
          </span>
        </div>

        {/* Synced Code Line */}
        <div className="flex items-center gap-2 text-amber-300 md:justify-end truncate">
          <Code2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-400 shrink-0">CODE:</span>
          <span className="truncate text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
            {activeMeta.code}
          </span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 bg-obsidian-950/90">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs shadow-md transition-all active:scale-95"
            aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Next Step */}
          <button
            onClick={() => {
              setIsPlaying(false);
              handleStep(1);
            }}
            className="p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 hover:text-white border border-slate-800 transition-all active:scale-95"
            title="Step Forward (Right Arrow)"
            aria-label="Step forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Restart / Shuffle */}
          <button
            onClick={() => {
              setStepIndex(0);
              soundEngine.playStepSound('swap', 0.4);
            }}
            className="p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 hover:text-white border border-slate-800 transition-all active:scale-95"
            title="Restart from Step 0"
            aria-label="Restart simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setIsFast(!isFast)}
            aria-label={`Toggle playback speed (currently ${isFast ? '2.0x' : '1.0x'})`}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border transition-all ${
              isFast
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-obsidian-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isFast ? '2.0x' : '1.0x'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => soundEngine.toggleMute()}
            className={`p-2 rounded-xl border transition-all ${
              !soundMuted
                ? 'bg-brand-500/15 text-brand-300 border-brand-500/40'
                : 'bg-obsidian-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={soundMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Step Counter & Full Flagship Link */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            Step {stepIndex + 1} / {getMaxSteps()}
          </span>

          {onSelectTopic && (
            <button
              onClick={() => onSelectTopic(getTopicIdForTab())}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 group/link transition-colors"
            >
              <span>Explore Full Topic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

import React, { useState, useMemo, useEffect } from 'react';
import { Topic } from '../types/topic';
import { topicsData } from '../data/topicsData';
import { useSimulation } from '../engine/useSimulation';
import { PlaybackControls } from '../engine/PlaybackControls';
import { NarrationCard } from '../engine/NarrationCard';
import { SyncedCodePanel } from '../engine/SyncedCodePanel';
import { ArrayRenderer } from '../engine/renderers/ArrayRenderer';
import { LinkedListRenderer } from '../engine/renderers/LinkedListRenderer';
import { TreeRenderer } from '../engine/renderers/TreeRenderer';
import { GraphRenderer } from '../engine/renderers/GraphRenderer';
import { GridRenderer } from '../engine/renderers/GridRenderer';
import { CallStackRenderer } from '../engine/renderers/CallStackRenderer';
import { ComplexityCard } from '../components/topic/ComplexityCard';
import { CommonMistakes } from '../components/topic/CommonMistakes';
import { QuizCard } from '../components/topic/QuizCard';
import { useProgress } from '../context/ProgressContext';
import { generateMergeSortSteps } from '../algorithms/mergeSort';
import { generateLinkedListSteps, LLOperationType } from '../algorithms/linkedList';
import { generateBSTSteps } from '../algorithms/bst';
import { generateBFSSteps } from '../algorithms/bfs';
import { generateFibonacciDpSteps } from '../algorithms/fibonacciDp';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  generateCountingSortSteps,
  generateRadixSortSteps,
} from '../algorithms/sortingBatchA';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateTernarySearchSteps,
} from '../algorithms/searchingBatchB';
import {
  generateDoublyLinkedListSteps,
  generateCircularLinkedListSteps,
  generateDequeSteps,
  generateStackSteps,
  generateQueueSteps,
  generateCircularQueueSteps,
  generatePriorityQueueSteps,
} from '../algorithms/linearBatchC';
import {
  generateFactorialSteps,
  generateNQueensSteps,
  generateMazeSteps,
  generateSubsetsSteps,
} from '../algorithms/recursionBatchD';
import {
  generateAVLTreeSteps,
  generateHeapTreeSteps,
  generateTrieSteps,
  generateSegmentTreeSteps,
  generateFenwickTreeSteps,
} from '../algorithms/treesBatchE';
import { generateHashTableOpenAddressingSteps } from '../algorithms/hashingBatchF';
import {
  generateDFSSteps,
  generateDijkstraSteps,
  generateTopologicalSortSteps,
} from '../algorithms/graphsBatchG';
import {
  generateKnapsackSteps,
  generateLCSSteps,
  generateCoinChangeSteps,
} from '../algorithms/dpBatchH';
import {
  generateActivitySelectionSteps,
  generateHuffmanCodingSteps,
  generateUnionFindSteps,
  generateKMPSteps,
  generateBitManipulationSteps,
} from '../algorithms/greedyAndAdvancedBatchIJ';
import { 
  BookOpen, 
  Lightbulb, 
  Sliders, 
  Check, 
  Sparkles, 
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  X
} from 'lucide-react';

interface TopicPageProps {
  topicId: string;
  onBackToRoadmap: () => void;
  onNavigateTopic: (id: string) => void;
}

export const TopicPage: React.FC<TopicPageProps> = ({
  topicId,
  onBackToRoadmap,
  onNavigateTopic,
}) => {
  const topic: Topic = topicsData[topicId] || topicsData['merge-sort'];
  const { markSimulationViewed } = useProgress();

  // Custom Input Modal state
  const [customInputModalOpen, setCustomInputModalOpen] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // Linked list specific operation state
  const [llOpType, setLlOpType] = useState<LLOperationType>('insertIndex');
  const [llVal, setLlVal] = useState<number>(99);
  const [llIdx, setLlIdx] = useState<number>(2);

  // Input data state per topic
  const [currentInput, setCurrentInput] = useState<any>(topic.defaultInput);

  // Sync default input whenever topicId changes
  useEffect(() => {
    setCurrentInput(topic.defaultInput);
    setCustomInputText(
      Array.isArray(topic.defaultInput)
        ? topic.defaultInput.join(', ')
        : String(topic.defaultInput)
    );
    setInputError(null);
  }, [topicId, topic.defaultInput]);

  // Generate steps pure function invocation based on topicId
  const steps = useMemo(() => {
    switch (topic.id) {
      // Flagships
      case 'merge-sort': {
        const arr = Array.isArray(currentInput) ? currentInput : [38, 27, 43, 3, 9, 82, 10];
        return generateMergeSortSteps(arr);
      }
      case 'singly-linked-list': {
        const arr = Array.isArray(currentInput) ? currentInput : [12, 45, 78];
        return generateLinkedListSteps(arr, {
          type: llOpType,
          val: llVal,
          index: llIdx,
        });
      }
      case 'binary-search-tree': {
        const keys = Array.isArray(currentInput) ? currentInput : [50, 30, 70, 20, 40, 60, 80];
        return generateBSTSteps(keys, 45);
      }
      case 'breadth-first-search': {
        const start = typeof currentInput === 'string' ? currentInput : 'A';
        return generateBFSSteps(undefined, undefined, start);
      }
      case 'fibonacci-dp': {
        const n = typeof currentInput === 'number' ? currentInput : 7;
        return generateFibonacciDpSteps(n);
      }

      // Batch A: Sorting
      case 'bubble-sort':
        return generateBubbleSortSteps(Array.isArray(currentInput) ? currentInput : [55, 23, 78, 12, 45]);
      case 'selection-sort':
        return generateSelectionSortSteps(Array.isArray(currentInput) ? currentInput : [64, 25, 12, 22, 11]);
      case 'insertion-sort':
        return generateInsertionSortSteps(Array.isArray(currentInput) ? currentInput : [35, 12, 49, 18, 27]);
      case 'quick-sort':
        return generateQuickSortSteps(Array.isArray(currentInput) ? currentInput : [48, 19, 73, 11, 84, 32]);
      case 'heap-sort':
        return generateHeapSortSteps(Array.isArray(currentInput) ? currentInput : [45, 12, 85, 32, 89, 21]);
      case 'counting-sort':
        return generateCountingSortSteps(Array.isArray(currentInput) ? currentInput : [4, 2, 2, 8, 3, 3, 1]);
      case 'radix-sort':
        return generateRadixSortSteps(Array.isArray(currentInput) ? currentInput : [170, 45, 75, 90, 802, 24, 66]);

      // Batch B: Searching
      case 'linear-search':
        return generateLinearSearchSteps(Array.isArray(currentInput) ? currentInput : [24, 78, 13, 95, 41, 62], 95);
      case 'binary-search':
        return generateBinarySearchSteps(Array.isArray(currentInput) ? currentInput : [11, 22, 34, 45, 57, 68, 79, 91], 68);
      case 'ternary-search':
        return generateTernarySearchSteps(Array.isArray(currentInput) ? currentInput : [5, 12, 19, 27, 34, 46, 58, 69, 81], 46);

      // Batch C: Linear Structures
      case 'doubly-linked-list':
        return generateDoublyLinkedListSteps(Array.isArray(currentInput) ? currentInput : [10, 20, 30], 5);
      case 'circular-linked-list':
        return generateCircularLinkedListSteps(Array.isArray(currentInput) ? currentInput : [10, 20, 30], 40);
      case 'stack':
        return generateStackSteps(Array.isArray(currentInput) ? currentInput : [10, 25, 40], 88);
      case 'queue':
        return generateQueueSteps(Array.isArray(currentInput) ? currentInput : [14, 28, 42], 77);
      case 'circular-queue':
        return generateCircularQueueSteps();
      case 'deque':
        return generateDequeSteps(Array.isArray(currentInput) ? currentInput : [20, 30, 40]);
      case 'priority-queue':
        return generatePriorityQueueSteps(Array.isArray(currentInput) ? currentInput : [80, 60, 70, 30, 40], 95);

      // Batch D: Recursion & Backtracking
      case 'recursion-basics':
        return generateFactorialSteps(typeof currentInput === 'number' ? currentInput : 4);
      case 'n-queens':
        return generateNQueensSteps();
      case 'maze-path':
        return generateMazeSteps();
      case 'subsets-backtracking':
        return generateSubsetsSteps(Array.isArray(currentInput) ? currentInput : [1, 2, 3]);

      // Batch E: Trees
      case 'avl-tree':
        return generateAVLTreeSteps();
      case 'binary-heap':
        return generateHeapTreeSteps();
      case 'trie':
        return generateTrieSteps();
      case 'segment-tree':
        return generateSegmentTreeSteps();
      case 'fenwick-tree':
        return generateFenwickTreeSteps();

      // Batch F: Hashing
      case 'hash-map':
        return generateHashTableOpenAddressingSteps(Array.isArray(currentInput) ? currentInput : [15, 22, 8, 29]);

      // Batch G: Graphs
      case 'depth-first-search':
        return generateDFSSteps(typeof currentInput === 'string' ? currentInput : 'A');
      case 'dijkstra':
        return generateDijkstraSteps(typeof currentInput === 'string' ? currentInput : 'A');
      case 'topological-sort':
        return generateTopologicalSortSteps();

      // Batch H: Dynamic Programming
      case 'knapsack-dp':
        return generateKnapsackSteps();
      case 'lcs-dp':
        return generateLCSSteps();
      case 'coin-change':
        return generateCoinChangeSteps();

      // Batch I & J: Greedy & Advanced
      case 'interval-scheduling':
        return generateActivitySelectionSteps();
      case 'huffman-coding':
        return generateHuffmanCodingSteps();
      case 'disjoint-set':
        return generateUnionFindSteps();
      case 'kmp-search':
        return generateKMPSteps();
      case 'bit-manipulation':
        return generateBitManipulationSteps();

      default:
        return generateMergeSortSteps([5, 2, 8, 1, 9]);
    }
  }, [topic.id, currentInput, llOpType, llVal, llIdx]);

  // Simulation engine hook
  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    isAtStart,
    isAtEnd,
    goToStep,
    stepForward,
    stepBackward,
    togglePlay,
    reset,
    setSpeed,
  } = useSimulation({
    steps,
    initialSpeed: 1,
    onComplete: () => {
      markSimulationViewed(topic.id);
    },
  });

  // Randomize input handler
  const handleRandomize = () => {
    reset();
    if (topic.dataStructureType === 'array') {
      const length = Math.floor(Math.random() * 3) + 5; // 5 to 7
      let randomArr: number[];
      if (topic.id.includes('search')) {
        const base = Math.floor(Math.random() * 10) + 5;
        randomArr = Array.from({ length }, (_, i) => base + i * (Math.floor(Math.random() * 8) + 6));
      } else {
        randomArr = Array.from({ length }, () => Math.floor(Math.random() * 90) + 10);
      }
      setCurrentInput(randomArr);
      setCustomInputText(randomArr.join(', '));
      return;
    }

    switch (topic.id) {
      case 'singly-linked-list':
      case 'doubly-linked-list':
      case 'circular-linked-list': {
        const randomNodes = Array.from({ length: 4 }, () => Math.floor(Math.random() * 80) + 10);
        setCurrentInput(randomNodes);
        setLlVal(Math.floor(Math.random() * 90) + 5);
        setLlIdx(Math.floor(Math.random() * (randomNodes.length + 1)));
        break;
      }
      case 'binary-search-tree':
      case 'avl-tree':
      case 'binary-heap': {
        const samplePool = [15, 25, 35, 45, 55, 65, 75, 85];
        const shuffled = [...samplePool].sort(() => 0.5 - Math.random()).slice(0, 6);
        setCurrentInput(shuffled);
        setCustomInputText(shuffled.join(', '));
        break;
      }
      case 'breadth-first-search':
      case 'depth-first-search':
      case 'dijkstra': {
        const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        setCurrentInput(randomNode);
        setCustomInputText(randomNode);
        break;
      }
      case 'fibonacci-dp': {
        const randomN = Math.floor(Math.random() * 6) + 4; // 4 to 9
        setCurrentInput(randomN);
        setCustomInputText(String(randomN));
        break;
      }
      case 'recursion-basics': {
        const randomN = Math.floor(Math.random() * 3) + 3; // 3 to 5
        setCurrentInput(randomN);
        setCustomInputText(String(randomN));
        break;
      }
      default: {
        const defaultPool = [25, 40, 60, 15, 80];
        setCurrentInput(defaultPool);
        setCustomInputText(defaultPool.join(', '));
        break;
      }
    }
  };

  // Custom input submit handler with rigorous validation
  const handleApplyCustomInput = () => {
    setInputError(null);

    try {
      if (
        topic.dataStructureType === 'array' ||
        topic.id === 'binary-search-tree' ||
        topic.id === 'singly-linked-list' ||
        topic.id === 'doubly-linked-list' ||
        topic.id === 'circular-linked-list'
      ) {
        const nums = customInputText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number);

        if (nums.length < 2) {
          setInputError('Please enter at least 2 numbers separated by commas.');
          return;
        }
        if (nums.some(isNaN)) {
          setInputError('All entries must be valid numbers.');
          return;
        }
        if (nums.length > 10) {
          setInputError('Please enter at most 10 numbers for clear visualization.');
          return;
        }
        if (nums.some((n) => n < 1 || n > 999)) {
          setInputError('Please keep numbers between 1 and 999.');
          return;
        }

        reset();
        setCurrentInput(nums);
        setCustomInputModalOpen(false);
      } else if (topic.dataStructureType === 'graph') {
        const trimmed = customInputText.trim().toUpperCase();
        if (!['A', 'B', 'C', 'D', 'E', 'F'].includes(trimmed)) {
          setInputError('Start node must be one of: A, B, C, D, E, F');
          return;
        }

        reset();
        setCurrentInput(trimmed);
        setCustomInputModalOpen(false);
      } else if (topic.id === 'fibonacci-dp' || topic.id === 'recursion-basics') {
        const num = Number(customInputText.trim());
        if (isNaN(num) || num < 2 || num > 11) {
          setInputError('Enter an integer N between 2 and 11.');
          return;
        }

        reset();
        setCurrentInput(num);
        setCustomInputModalOpen(false);
      } else {
        setCustomInputModalOpen(false);
      }
    } catch (err: any) {
      setInputError(err.message || 'Invalid input format.');
    }
  };

  // Helper to render the topic-specific renderer
  const renderAlgorithmVisualization = () => {
    // 1. Singly Linked List retains its custom interactive operation bar
    if (topic.id === 'singly-linked-list') {
      return (
        <div className="w-full flex flex-col items-center">
          {/* Interactive operation toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 p-2 bg-obsidian-950 rounded-xl border border-slate-800 text-xs">
            <span className="font-mono text-slate-400 font-semibold mr-1">
              Operation:
            </span>
            {(['insertIndex', 'insertHead', 'deleteVal', 'traverse'] as LLOperationType[]).map(
              (op) => (
                <button
                  key={op}
                  onClick={() => {
                    reset();
                    setLlOpType(op);
                  }}
                  className={`px-3 py-1 rounded-lg font-mono transition-all ${
                    llOpType === op
                      ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {op === 'insertIndex'
                    ? 'Insert at Index'
                    : op === 'insertHead'
                    ? 'Insert Head'
                    : op === 'deleteVal'
                    ? 'Delete Value'
                    : 'Traverse'}
                </button>
              )
            )}

            {/* Value & index modifiers */}
            {llOpType !== 'traverse' && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Val:</span>
                  <input
                    type="number"
                    value={llVal}
                    onChange={(e) => {
                      reset();
                      setLlVal(Number(e.target.value));
                    }}
                    className="w-14 px-2 py-0.5 rounded bg-obsidian-900 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-brand-400"
                  />
                </div>
                {llOpType === 'insertIndex' && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Index:</span>
                    <input
                      type="number"
                      min={0}
                      max={8}
                      value={llIdx}
                      onChange={(e) => {
                        reset();
                        setLlIdx(Number(e.target.value));
                      }}
                      className="w-12 px-2 py-0.5 rounded bg-obsidian-900 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-brand-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <LinkedListRenderer
            nodes={currentStep.state?.nodes || []}
            detachedNode={currentStep.state?.detachedNode}
            highlights={currentStep.highlights}
            pointers={currentStep.pointers}
          />
        </div>
      );
    }

    // 2. Generic Renderer dispatch by dataStructureType
    switch (topic.dataStructureType) {
      case 'array': {
        const arr = Array.isArray(currentStep.state)
          ? currentStep.state
          : (currentStep.state?.array || []);

        return (
          <div className="w-full flex flex-col items-center">
            <ArrayRenderer
              array={arr}
              highlights={currentStep.highlights}
              pointers={currentStep.pointers}
              auxiliary={currentStep.auxiliary}
            />
            {currentStep.callStack && currentStep.callStack.length > 0 && (
              <div className="w-full flex justify-center mt-4">
                <CallStackRenderer stack={currentStep.callStack} />
              </div>
            )}
          </div>
        );
      }

      case 'linked-list': {
        return (
          <div className="w-full flex flex-col items-center">
            <LinkedListRenderer
              nodes={currentStep.state?.nodes || []}
              detachedNode={currentStep.state?.detachedNode}
              highlights={currentStep.highlights}
              pointers={currentStep.pointers}
            />
          </div>
        );
      }

      case 'tree': {
        return (
          <div className="w-full flex flex-col items-center">
            <TreeRenderer
              root={currentStep.state?.root || null}
              highlights={currentStep.highlights}
              traversalList={currentStep.state?.traversalList || []}
              pointers={currentStep.pointers}
            />
          </div>
        );
      }

      case 'graph': {
        return (
          <div className="w-full flex flex-col items-center">
            <GraphRenderer
              nodes={currentStep.state?.nodes || []}
              edges={currentStep.state?.edges || []}
              highlights={currentStep.highlights}
              queue={currentStep.state?.queue || []}
              visited={currentStep.state?.visited || []}
              distances={currentStep.state?.distances || {}}
              activeEdge={currentStep.state?.activeEdge}
            />
          </div>
        );
      }

      case 'grid': {
        const tableData = Array.isArray(currentStep.state)
          ? currentStep.state
          : (currentStep.state?.table || []);

        let colLabels: string[] | undefined = undefined;
        let rowLabels: string[] | undefined = undefined;

        if (topic.id === 'fibonacci-dp' || topic.id === 'coin-change') {
          colLabels = tableData.map((_: any, i: number) => `dp[${i}]`);
        } else if (topic.id === 'hash-map') {
          colLabels = tableData.map((_: any, i: number) => `Slot ${i}`);
        } else if (topic.id === 'knapsack-dp') {
          colLabels = ['W=0', 'W=1', 'W=2', 'W=3', 'W=4'];
          rowLabels = ['None', 'Item 1 ($6)', 'Item 2 ($10)', 'Item 3 ($12)'];
        } else if (topic.id === 'n-queens') {
          colLabels = ['Col 0', 'Col 1', 'Col 2', 'Col 3'];
          rowLabels = ['Row 0', 'Row 1', 'Row 2', 'Row 3'];
        } else if (topic.id === 'maze-path') {
          colLabels = ['C0', 'C1', 'C2', 'C3'];
          rowLabels = ['R0', 'R1', 'R2', 'R3'];
        }

        return (
          <div className="w-full flex flex-col items-center">
            <GridRenderer
              cells={tableData}
              highlights={currentStep.highlights}
              formula={currentStep.explanation?.formula}
              colLabels={colLabels}
              rowLabels={rowLabels}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToRoadmap}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors bg-obsidian-900 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-brand-400" />
          <span>Back to Roadmap</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-brand-950/80 text-brand-300 border border-brand-500/30">
            {topic.categoryName}
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-obsidian-900 text-slate-400 border border-slate-800">
            {topic.difficulty}
          </span>
        </div>
      </div>

      {/* Topic Title & Headline */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          {topic.title}
        </h1>
        <p className="text-base md:text-lg text-slate-400 font-medium">
          {topic.subtitle}
        </p>
      </div>

      {/* Section A: Plain-Language Real-World Analogy */}
      <div className="bg-gradient-to-br from-obsidian-900 to-obsidian-950 border border-brand-500/20 rounded-2xl p-6 md:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight font-sans">
            Real-World Analogy: {topic.analogy.title}
          </h2>
        </div>

        <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
          {topic.analogy.story}
        </p>

        <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-slate-800/80 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-slate-200">
            <strong className="text-brand-300 font-semibold">Core Intuition: </strong>
            {topic.analogy.keyLesson}
          </div>
        </div>
      </div>

      {/* Section B & C: Live Simulation Engine & Synced Code Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <h2 className="text-lg font-bold text-white font-sans">
              Interactive Simulation Engine
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            Step-driven algorithm execution
          </div>
        </div>

        {/* Two-column layout on large screens: Simulator on left, Synced Code on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Canvas + Narration + Playback Controls */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Visual Canvas Card */}
            <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col items-center justify-center min-h-[360px]">
              {renderAlgorithmVisualization()}
            </div>

            {/* Narration Card */}
            <NarrationCard step={currentStep} />

            {/* Playback Controls Bar */}
            <PlaybackControls
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              speed={speed}
              isAtStart={isAtStart}
              isAtEnd={isAtEnd}
              onTogglePlay={togglePlay}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onReset={reset}
              onGoToStep={goToStep}
              onSpeedChange={setSpeed}
              onRandomize={handleRandomize}
              onOpenCustomInput={() => setCustomInputModalOpen(true)}
            />
          </div>

          {/* Right Column: Synced Multi-Language Code Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <SyncedCodePanel
              snippets={topic.codeSnippets}
              activeLine={currentStep.codeLine}
            />
          </div>
        </div>
      </div>

      {/* Section D & E: Complexity Analysis & Common Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplexityCard complexity={topic.complexity} />
        <CommonMistakes mistakes={topic.commonMistakes} />
      </div>

      {/* Section F: Practice Quiz with Instant Feedback */}
      <div>
        <QuizCard topicId={topic.id} questions={topic.quiz} />
      </div>

      {/* Custom Input Modal */}
      {customInputModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 backdrop-blur-sm p-4">
          <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                Customize Simulation Input
              </h3>
              <button
                onClick={() => setCustomInputModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {topic.inputDescription || 'Provide custom input values for the simulation.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                Input Data:
              </label>
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder={topic.inputPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
              />
              {inputError && (
                <p className="text-xs text-rose-400 pt-1 font-mono">
                  {inputError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setCustomInputModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomInput}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 text-xs font-bold transition-all shadow-md"
              >
                Apply & Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

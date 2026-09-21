import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  FastForward, 
  CheckCircle2, 
  BarChart2, 
  Layers, 
  Flame, 
  ArrowRight,
  Info,
  Medal,
  Sparkles
} from 'lucide-react';
import { Step } from '../types/simulation';
import { 
  generateBubbleSortSteps, 
  generateSelectionSortSteps, 
  generateInsertionSortSteps, 
  generateQuickSortSteps, 
  generateHeapSortSteps 
} from '../algorithms/sortingBatchA';
import { generateMergeSortSteps } from '../algorithms/mergeSort';
import { soundEngine } from '../services/soundEngine';

interface SortAlgorithmMeta {
  id: string;
  name: string;
  complexity: string;
  bestCase: string;
  generator: (arr: number[]) => Step<number[]>[];
  color: string;
}

const AVAILABLE_ALGORITHMS: SortAlgorithmMeta[] = [
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    complexity: 'O(N log N)',
    bestCase: 'O(N log N)',
    generator: generateQuickSortSteps,
    color: 'from-steel-400 to-sky-600',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    complexity: 'O(N log N)',
    bestCase: 'O(N log N)',
    generator: generateMergeSortSteps,
    color: 'from-brand-500 to-amber-500',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    complexity: 'O(N log N)',
    bestCase: 'O(N log N)',
    generator: generateHeapSortSteps,
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    complexity: 'O(N²)',
    bestCase: 'O(N)',
    generator: generateInsertionSortSteps,
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    complexity: 'O(N²)',
    bestCase: 'O(N)',
    generator: generateBubbleSortSteps,
    color: 'from-rose-500 to-red-700',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    complexity: 'O(N²)',
    bestCase: 'O(N²)',
    generator: generateSelectionSortSteps,
    color: 'from-stone-600 to-stone-800',
  },
];

const PRESETS = [
  { label: 'Random', data: [45, 12, 85, 32, 89, 39, 69, 22, 54, 18, 95, 7] },
  { label: 'Reverse Sorted', data: [95, 85, 75, 65, 55, 45, 35, 25, 15, 5] },
  { label: 'Nearly Sorted', data: [5, 12, 18, 15, 32, 39, 35, 54, 69, 85] },
  { label: 'Few Unique', data: [20, 60, 20, 90, 60, 20, 90, 60, 20, 60] },
];

interface RaceModePageProps {
  onSelectTopic?: (topicId: string) => void;
}

export const RaceModePage: React.FC<RaceModePageProps> = ({ onSelectTopic }) => {
  // Select 2 or 3 algorithms
  const [selectedAlgoIds, setSelectedAlgoIds] = useState<string[]>([
    'quick-sort',
    'merge-sort',
    'bubble-sort',
  ]);

  const [inputArray, setInputArray] = useState<number[]>([
    45, 12, 85, 32, 89, 39, 69, 22, 54, 18, 95, 7
  ]);
  const [activePreset, setActivePreset] = useState<string>('Random');

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1x, 2x, 4x, 8x
  const [currentStepIndices, setCurrentStepIndices] = useState<Record<string, number>>({});
  const [finishTimestamps, setFinishTimestamps] = useState<Record<string, number>>({});

  const timerRef = useRef<number | null>(null);

  // Generate steps and cumulative metrics for each algorithm
  const algorithmData = useMemo(() => {
    return selectedAlgoIds.map((id) => {
      const meta = AVAILABLE_ALGORITHMS.find((a) => a.id === id)!;
      const steps = meta.generator([...inputArray]);
      
      // Calculate cumulative metrics per step
      let cumComparisons = 0;
      let cumSwaps = 0;
      const metrics: { comparisons: number; swaps: number }[] = [];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const hasComparing = Object.values(step.highlights || {}).some(
          (h) => h === 'comparing'
        );
        const hasSwapOrMerge =
          step.explanation?.action === 'SWAP' ||
          step.explanation?.action === 'MERGE' ||
          (step.description && /swapped|swap|merge|placed/i.test(step.description));

        if (hasComparing) cumComparisons++;
        if (hasSwapOrMerge) cumSwaps++;

        metrics.push({
          comparisons: cumComparisons,
          swaps: cumSwaps,
        });
      }

      return {
        meta,
        steps,
        metrics,
        totalSteps: steps.length,
      };
    });
  }, [selectedAlgoIds, inputArray]);

  // Reset indices when algo selection or input changes
  const resetRace = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const initIndices: Record<string, number> = {};
    selectedAlgoIds.forEach((id) => {
      initIndices[id] = 0;
    });
    setCurrentStepIndices(initIndices);
    setFinishTimestamps({});
  };

  useEffect(() => {
    resetRace();
  }, [selectedAlgoIds, inputArray]);

  // Determine ranks
  const ranks = useMemo(() => {
    const finishedAlgos = Object.entries(finishTimestamps)
      .sort(([, tA], [, tB]) => tA - tB)
      .map(([id]) => id);

    const rankMap: Record<string, number> = {};
    finishedAlgos.forEach((id, idx) => {
      rankMap[id] = idx + 1;
    });
    return rankMap;
  }, [finishTimestamps]);

  const allFinished = useMemo(() => {
    if (algorithmData.length === 0) return false;
    return algorithmData.every((item) => {
      const cur = currentStepIndices[item.meta.id] ?? 0;
      return cur >= item.totalSteps - 1;
    });
  }, [algorithmData, currentStepIndices]);

  // Advance race
  const stepForward = () => {
    setCurrentStepIndices((prev) => {
      const next = { ...prev };
      const now = Date.now();
      let anyAdvanced = false;

      algorithmData.forEach((item) => {
        const cur = prev[item.meta.id] ?? 0;
        if (cur < item.totalSteps - 1) {
          next[item.meta.id] = cur + 1;
          anyAdvanced = true;
          if (cur + 1 === item.totalSteps - 1 && !finishTimestamps[item.meta.id]) {
            soundEngine.playSuccessChime();
            setFinishTimestamps((fPrev) => ({
              ...fPrev,
              [item.meta.id]: now,
            }));
          }

        }
      });

      if (!anyAdvanced) {
        setIsPlaying(false);
      }
      return next;
    });
  };

  const stepBackward = () => {
    setCurrentStepIndices((prev) => {
      const next = { ...prev };
      algorithmData.forEach((item) => {
        const cur = prev[item.meta.id] ?? 0;
        if (cur > 0) {
          next[item.meta.id] = cur - 1;
        }
      });
      return next;
    });
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(25, Math.floor(400 / speed));
      timerRef.current = window.setInterval(() => {
        stepForward();
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, algorithmData, finishTimestamps]);

  // Toggle algorithm selection (keep between 2 and 3)
  const toggleAlgorithm = (id: string) => {
    if (selectedAlgoIds.includes(id)) {
      if (selectedAlgoIds.length > 2) {
        setSelectedAlgoIds(selectedAlgoIds.filter((item) => item !== id));
      }
    } else {
      if (selectedAlgoIds.length < 3) {
        setSelectedAlgoIds([...selectedAlgoIds, id]);
      } else {
        // Replace last one
        setSelectedAlgoIds([selectedAlgoIds[0], selectedAlgoIds[1], id]);
      }
    }
  };

  // Randomize input array
  const generateRandomArray = () => {
    const size = 12;
    const randoms = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 95) + 5
    );
    setInputArray(randoms);
    setActivePreset('Random');
  };

  const maxValue = Math.max(...inputArray, 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Sorting Algorithm Grand Prix
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Race Mode
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Pick 2 or 3 sorting algorithms and pit them against each other on the identical dataset. Watch Big-O complexity play out in real time.
          </p>
        </div>

        {/* Algorithm selection chips */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono text-slate-400">
            Selected Competitors (pick 2–3):
          </span>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_ALGORITHMS.map((algo) => {
              const isSelected = selectedAlgoIds.includes(algo.id);
              return (
                <button
                  key={algo.id}
                  onClick={() => toggleAlgorithm(algo.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-500 text-obsidian-950 font-bold shadow-md shadow-brand-500/20'
                      : 'bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{algo.name}</span>
                  <span className="text-[10px] font-mono opacity-80">({algo.complexity})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inputs & Controls Toolbar */}
      <div className="bg-obsidian-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Input Presets */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <span className="text-xs font-mono text-slate-400 mr-1">Dataset:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setInputArray(p.data);
                setActivePreset(p.label);
              }}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                activePreset === p.label
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 font-semibold'
                  : 'bg-obsidian-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={generateRandomArray}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Shuffle className="w-3 h-3 text-brand-400" />
            Randomize
          </button>
        </div>

        {/* Global Race Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetRace}
            title="Reset Race"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={stepBackward}
            disabled={isPlaying}
            title="Step Back"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all transform active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{allFinished ? 'Replay Race' : 'Start Race'}</span>
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            disabled={isPlaying || allFinished}
            title="Step Forward"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-obsidian-950 p-1 rounded-lg border border-slate-800 ml-2">
            <FastForward className="w-3 h-3 text-slate-500 ml-1" />
            {[1, 2, 4, 8].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 text-xs font-mono rounded ${
                  speed === s
                    ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Race Lanes */}
      <div className={`grid gap-6 ${
        selectedAlgoIds.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'
      }`}>
        {algorithmData.map((item) => {
          const stepIndex = currentStepIndices[item.meta.id] ?? 0;
          const currentStep = item.steps[stepIndex] || item.steps[0];
          const currentMetric = item.metrics[stepIndex] || { comparisons: 0, swaps: 0 };
          const isFinished = stepIndex >= item.totalSteps - 1;
          const rank = ranks[item.meta.id];
          const progressPercent = Math.round(((stepIndex + 1) / item.totalSteps) * 100);

          return (
            <div
              key={item.meta.id}
              className={`bg-obsidian-900 border rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all ${
                rank === 1
                  ? 'border-amber-500/60 shadow-amber-500/10'
                  : isFinished
                  ? 'border-slate-700'
                  : 'border-slate-800'
              }`}
            >
              {/* Podium Badge / Ribbon */}
              {rank && (
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg ${
                  rank === 1
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-obsidian-950 animate-pulse'
                    : rank === 2
                    ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-obsidian-950'
                    : 'bg-gradient-to-r from-amber-700 to-amber-800 text-white'
                }`}>
                  <Medal className="w-3.5 h-3.5" />
                  {rank === 1 ? '1st Place 🏆' : rank === 2 ? '2nd Place 🥈' : '3rd Place 🥉'}
                </div>
              )}

              {/* Lane Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {item.meta.name}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-brand-950/60 border border-brand-500/30 text-brand-300">
                    {item.meta.complexity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                  <span>Step {stepIndex + 1} of {item.totalSteps}</span>
                  <span className="font-semibold text-slate-300">{progressPercent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-steel-400 transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Live Stats Counters */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-obsidian-950/80 rounded-xl border border-slate-800/80 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      Comparisons
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-amber-400 mt-0.5">
                      {currentMetric.comparisons}
                    </span>
                  </div>

                  <div className="p-3 bg-obsidian-950/80 rounded-xl border border-slate-800/80 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      Swaps / Writes
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-brand-300 mt-0.5">
                      {currentMetric.swaps}
                    </span>
                  </div>
                </div>

                {/* Animated Bars Simulation */}
                <div className="h-48 bg-obsidian-950/90 rounded-xl border border-slate-800/80 p-3 flex items-end justify-center gap-1.5 sm:gap-2">
                  {currentStep.state.map((val, idx) => {
                    const highlight = currentStep.highlights?.[idx];
                    const heightPercent = Math.max(12, Math.round((val / maxValue) * 100));

                    let barColor = 'bg-slate-700 border-slate-600';
                    if (highlight === 'comparing') {
                      barColor = 'bg-amber-400 border-amber-300 text-obsidian-950 animate-bounce shadow-lg shadow-amber-400/20';
                    } else if (highlight === 'active' || highlight === 'danger') {
                      barColor = 'bg-rose-500 border-rose-400 text-white animate-pulse';
                    } else if (highlight === 'sorted' || isFinished) {
                      barColor = 'bg-steel-400 border-steel-300 shadow-md shadow-steel-400/30 text-obsidian-950';
                    }

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                      >
                        {/* Tooltip value */}
                        <div className="text-[10px] font-mono text-slate-400 mb-1 group-hover:text-white">
                          {val}
                        </div>
                        {/* Bar */}
                        <div
                          className={`w-full rounded-t-md transition-all duration-150 border-t ${barColor}`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  {isFinished ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-steel-400" />
                      <span className="text-steel-300 font-medium">Finished in {item.totalSteps} steps</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                      <span>Sorting array...</span>
                    </>
                  )}
                </span>

                {onSelectTopic && (
                  <button
                    onClick={() => onSelectTopic(item.meta.id)}
                    className="text-brand-400 hover:text-brand-300 hover:underline flex items-center gap-1"
                  >
                    Deep Dive
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-Race Analysis Table */}
      {allFinished && (
        <div className="bg-obsidian-900 border border-brand-500/30 rounded-2xl p-6 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Race Results & Complexity Verdict</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-obsidian-950 text-slate-400 font-mono text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Algorithm</th>
                  <th className="py-3 px-4">Time Complexity</th>
                  <th className="py-3 px-4">Total Steps</th>
                  <th className="py-3 px-4">Comparisons</th>
                  <th className="py-3 px-4">Swaps / Writes</th>
                  <th className="py-3 px-4">Efficiency Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {algorithmData
                  .sort((a, b) => (ranks[a.meta.id] || 99) - (ranks[b.meta.id] || 99))
                  .map((item, idx) => {
                    const rank = ranks[item.meta.id] || idx + 1;
                    const finalMetric = item.metrics[item.totalSteps - 1] || { comparisons: 0, swaps: 0 };
                    return (
                      <tr key={item.meta.id} className={rank === 1 ? 'bg-amber-500/10' : ''}>
                        <td className="py-3 px-4 font-bold">
                          {rank === 1 ? '🏆 1st' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
                        </td>
                        <td className="py-3 px-4 font-sans font-semibold text-white">
                          {item.meta.name}
                        </td>
                        <td className="py-3 px-4 text-brand-300">{item.meta.complexity}</td>
                        <td className="py-3 px-4">{item.totalSteps}</td>
                        <td className="py-3 px-4 text-amber-300">{finalMetric.comparisons}</td>
                        <td className="py-3 px-4 text-brand-300">{finalMetric.swaps}</td>
                        <td className="py-3 px-4 font-sans text-slate-400">
                          {item.meta.complexity.includes('log')
                            ? 'Scales logarithmically; massive reduction in redundant checks.'
                            : 'Quadratic bottleneck; performs repeated adjacent passes.'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-obsidian-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-200">The Takeaway:</strong> Notice how O(N log N) algorithms like Quick Sort and Merge Sort terminate with vastly fewer comparisons than O(N²) algorithms like Bubble Sort or Selection Sort. On larger arrays of 10,000 items, this difference grows from milliseconds to minutes!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

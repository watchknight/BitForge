import React from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';

interface ArrayRendererProps {
  array: number[];
  highlights?: Record<number | string, HighlightRole>;
  pointers?: Record<string, number | string>;
  auxiliary?: {
    tempArray?: number[];
    leftRange?: [number, number];
    rightRange?: [number, number];
    mergeRange?: [number, number];
  };
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({
  array,
  highlights = {},
  pointers = {},
  auxiliary,
}) => {
  const maxVal = Math.max(...array, 1);

  // Group pointers by index to render stacked badges if multiple pointers land on same index
  const indexToPointers: Record<number, string[]> = {};
  Object.entries(pointers).forEach(([name, idx]) => {
    const numIdx = Number(idx);
    if (!isNaN(numIdx)) {
      if (!indexToPointers[numIdx]) indexToPointers[numIdx] = [];
      indexToPointers[numIdx].push(name);
    }
  });

  const getCardClasses = (role?: HighlightRole) => {
    switch (role) {
      case 'comparing':
        return 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 scale-105';
      case 'active':
        return 'bg-brand-500/20 border-brand-400 text-brand-200 ring-2 ring-brand-400/40 shadow-lg shadow-brand-500/20 scale-105';
      case 'sorted':
        return 'bg-steel-500/20 border-steel-400 text-steel-200 ring-1 ring-steel-500/40 shadow-lg shadow-steel-500/10';
      case 'visited':
        return 'bg-obsidian-800/90 border-slate-600 text-slate-300';
      case 'pivot':
        return 'bg-amber-400/25 border-amber-300 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/25';
      case 'danger':
        return 'bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-400/40';
      default:
        return 'bg-obsidian-900 border-slate-800 text-slate-300 hover:border-slate-700';
    }
  };

  const getBarColor = (role?: HighlightRole) => {
    switch (role) {
      case 'comparing':
        return 'bg-amber-400 shadow-amber-400/50';
      case 'active':
        return 'bg-brand-400 shadow-brand-400/50';
      case 'sorted':
        return 'bg-steel-400 shadow-steel-400/50';
      case 'visited':
        return 'bg-slate-500 shadow-slate-500/30';
      case 'pivot':
        return 'bg-amber-300 shadow-amber-300/60';
      case 'danger':
        return 'bg-rose-400 shadow-rose-400/50';
      default:
        return 'bg-slate-700 hover:bg-slate-600';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-6 select-none">
      {/* Range partition visualizer if in divide & conquer (like Merge Sort) */}
      {auxiliary?.mergeRange && (
        <div className="mb-4 text-xs font-mono text-slate-400 bg-obsidian-950 px-3 py-1 rounded-full border border-slate-800">
          Merging segment: indices <span className="text-brand-300 font-bold">[{auxiliary.mergeRange[0]}..{auxiliary.mergeRange[1]}]</span>
        </div>
      )}

      {/* Bars representation (responsive height) */}
      <div className="w-full max-w-2xl h-44 flex items-end justify-center gap-2 md:gap-3 px-2 pt-6 pb-2 border-b border-slate-800/80">
        {array.map((value, idx) => {
          const role = highlights[idx];
          const heightPercent = Math.max(15, Math.round((value / maxVal) * 100));

          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full max-w-[56px]">
              <span className="text-[11px] font-mono font-bold mb-1.5 text-slate-300">
                {value}
              </span>
              <motion.div
                layout
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`w-full rounded-t-md transition-all duration-200 shadow-md ${getBarColor(role)}`}
              />
            </div>
          );
        })}
      </div>

      {/* Array Element Boxes + Indices */}
      <div className="w-full max-w-2xl flex items-center justify-center gap-2 md:gap-3 mt-4">
        {array.map((value, idx) => {
          const role = highlights[idx];
          const ptrs = indexToPointers[idx];

          return (
            <div key={idx} className="flex-1 flex flex-col items-center max-w-[56px]">
              {/* Box card */}
              <motion.div
                layout
                className={`w-full aspect-square flex items-center justify-center rounded-lg border text-sm md:text-base font-bold font-mono transition-all duration-200 shadow-sm ${getCardClasses(
                  role
                )}`}
              >
                {value}
              </motion.div>

              {/* Index label */}
              <span className="text-[11px] font-mono text-slate-500 mt-1">
                [{idx}]
              </span>

              {/* Pointer tags underneath */}
              <div className="min-h-[24px] flex flex-col items-center gap-0.5 mt-1">
                {ptrs &&
                  ptrs.map((ptr) => (
                    <span
                      key={ptr}
                      className="px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase rounded bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm animate-bounce"
                    >
                      {ptr}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional auxiliary / scratch buffer display */}
      {auxiliary?.tempArray && auxiliary.tempArray.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 w-full max-w-md flex flex-col items-center">
          <span className="text-xs font-mono text-slate-400 mb-2">
            Auxiliary / Merged Buffer:
          </span>
          <div className="flex items-center gap-2">
            {auxiliary.tempArray.map((val, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded border border-brand-500/40 bg-brand-500/10 text-brand-200 font-mono text-xs font-bold flex items-center justify-center"
              >
                {val}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

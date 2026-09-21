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
        // "In the forge" — comparing/checking
        return 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/45 shadow-lg shadow-amber-500/25 scale-105';
      case 'active':
        // "In the forge" — actively modified/heated
        return 'bg-brand-500/25 border-brand-500 text-brand-100 ring-2 ring-brand-400/50 shadow-lg shadow-brand-500/30 scale-105';
      case 'pivot':
        // "In the forge" — molten pivot
        return 'bg-amber-500/25 border-amber-300 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/30 scale-105';
      case 'sorted':
        // "Tempered" — confirmed finished/sorted
        return 'bg-steel-500/20 border-steel-400 text-steel-200 ring-1 ring-steel-400/40 shadow-lg shadow-steel-500/15';
      case 'visited':
        // "Tempered" — processed marker
        return 'bg-steel-950/40 border-steel-500/40 text-steel-200 ring-1 ring-steel-500/30';
      case 'danger':
        // "Overheated" — mistake/conflict state
        return 'bg-red-950/40 border-red-500/60 text-red-300 ring-2 ring-red-500/40';
      default:
        // "Unforged" — raw iron, cool muted grey
        return 'bg-[#1a1c22] border-[#3d434f] text-slate-300 hover:border-slate-500';
    }
  };

  const getBarColor = (role?: HighlightRole) => {
    switch (role) {
      case 'comparing':
        // "In the forge" — molten crucible gold
        return 'bg-amber-400 shadow-md shadow-amber-400/40';
      case 'active':
        // "In the forge" — blazing forge flame (most vivid)
      case 'secondary':
        return 'bg-brand-500 shadow-lg shadow-brand-500/50';
      case 'pivot':
        return 'bg-amber-300 shadow-md shadow-amber-300/50';
      case 'sorted':
        // "Tempered" — cooled blue-steel
        return 'bg-steel-400 shadow-md shadow-steel-400/40';
      case 'visited':
        return 'bg-steel-500 shadow-sm shadow-steel-500/20';
      case 'danger':
        // "Overheated" — deep desaturated red
        return 'bg-red-500 shadow-md shadow-red-500/40';
      default:
        // "Unforged" — cool muted grey unworked iron
        return 'bg-[#333842] hover:bg-[#3f444e]';
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

      {/* Horizontally scrollable momentum container with overflow containment */}
      <div 
        className="w-full max-w-2xl overflow-x-auto pb-2"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
        }}
      >
        <div className="min-w-fit flex flex-col items-center mx-auto px-2">
          {/* Bars representation (responsive height with floor width) */}
          <div className="w-full min-w-max h-44 flex items-end justify-center gap-2 md:gap-3 px-2 pt-6 pb-2 border-b border-slate-800/80">
            {array.map((value, idx) => {
              const role = highlights[idx];
              const heightPercent = Math.max(15, Math.round((value / maxVal) * 100));

              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full w-10 sm:w-12 md:w-14 max-w-[56px] shrink-0">
                  <span className={`text-[11px] font-mono font-bold mb-1.5 transition-colors ${
                    role === 'active'
                      ? 'text-brand-300 font-extrabold scale-110'
                      : role === 'comparing'
                      ? 'text-amber-300 font-extrabold scale-110'
                      : role === 'sorted'
                      ? 'text-steel-300 font-bold'
                      : 'text-slate-400'
                  }`}>
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
          <div className="w-full min-w-max flex items-center justify-center gap-2 md:gap-3 mt-4">
            {array.map((value, idx) => {
              const role = highlights[idx];
              const ptrs = indexToPointers[idx];

              return (
                <div key={idx} className="flex flex-col items-center w-10 sm:w-12 md:w-14 max-w-[56px] shrink-0">
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
        </div>
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

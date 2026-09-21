import React from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';

export interface GridCell {
  row: number;
  col: number;
  value: number | string | null;
  label?: string;
}

interface GridRendererProps {
  // Support both 1D array of cells (for 1D DP like Fibonacci) and 2D matrix
  cells: (number | string | null)[] | (number | string | null)[][];
  rowLabels?: string[];
  colLabels?: string[];
  highlights?: Record<string | number, HighlightRole>; // e.g. "0,1" or index 3
  formula?: string;
  activeCell?: { row: number; col: number } | number | null;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  cells,
  rowLabels,
  colLabels,
  highlights = {},
  formula,
  activeCell,
}) => {
  // Normalize to 2D array
  const is2D = Array.isArray(cells[0]);
  const matrix: (number | string | null)[][] = is2D
    ? (cells as (number | string | null)[][])
    : [cells as (number | string | null)[]];

  const getCellKey = (r: number, c: number) => {
    return is2D ? `${r},${c}` : `${c}`;
  };

  const getCellClasses = (role?: HighlightRole) => {
    switch (role) {
      case 'active':
        // "In the forge" — actively computed DP cell
        return 'bg-brand-500/25 border-brand-500 text-brand-100 ring-2 ring-brand-400/50 shadow-lg shadow-brand-500/25 scale-105 font-bold';
      case 'comparing':
        // "In the forge" — dependency/lookup cell
        return 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 font-bold';
      case 'sorted':
        // "Tempered" — computed finished value
        return 'bg-steel-500/20 border-steel-400 text-steel-200 ring-1 ring-steel-500/40 font-semibold';
      case 'visited':
        // "Tempered" — previously memoized cell
        return 'bg-steel-950/50 border-steel-500/40 text-steel-200 font-semibold';
      case 'danger':
        // "Overheated" — invalid/infeasible state
        return 'bg-red-950/40 border-red-500/60 text-red-300 ring-2 ring-red-500/30';
      default:
        // "Unforged" — uncomputed raw cell
        return 'bg-[#1a1c22] border-[#3d434f] text-slate-300 hover:border-slate-500';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-6 select-none">
      {/* Recurrence / Calculation preview */}
      {formula && (
        <div className="mb-4 px-4 py-1.5 rounded-lg bg-obsidian-950 border border-brand-500/30 text-xs font-mono text-brand-300 flex items-center gap-2 shadow-sm">
          <span className="text-slate-400 font-sans">Active Calculation:</span>
          <span className="font-bold text-slate-100">{formula}</span>
        </div>
      )}

      {/* Grid container with horizontal momentum scroll & sticky headers */}
      <div 
        className="overflow-x-auto max-w-full p-2 w-full flex justify-start sm:justify-center"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
        }}
      >
        <table className="border-separate border-spacing-1.5 sm:border-spacing-2">
          {/* Column headers */}
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th className="p-1 sticky left-0 z-20 bg-obsidian-900/95"></th>}
                {colLabels.map((col, cIdx) => (
                  <th
                    key={cIdx}
                    className="p-1 text-center font-mono text-[11px] sm:text-xs text-slate-400 font-semibold min-w-[40px]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                {/* Row label with sticky positioning on horizontal scroll */}
                {rowLabels && (
                  <td className="pr-2.5 text-right font-mono text-[11px] sm:text-xs text-slate-400 font-semibold sticky left-0 z-10 bg-obsidian-900/95 whitespace-nowrap">
                    {rowLabels[rIdx]}
                  </td>
                )}

                {/* Cells */}
                {row.map((val, cIdx) => {
                  const key = getCellKey(rIdx, cIdx);
                  const role = highlights[key];

                  return (
                    <td key={cIdx} className="p-0">
                      <motion.div
                        layout
                        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg border flex flex-col items-center justify-center transition-all duration-200 shadow-sm ${getCellClasses(
                          role
                        )}`}
                      >
                        <span className="text-xs sm:text-sm md:text-base font-mono">
                          {val !== null && val !== undefined ? val : (
                            <span className="text-slate-600 text-xs">?</span>
                          )}
                        </span>
                        {!is2D && (
                          <span className="text-[9px] font-mono text-slate-500 -mt-0.5">
                            i={cIdx}
                          </span>
                        )}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500/40 border border-amber-400" />
          <span>Lookups / Dependencies</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-brand-500/40 border border-brand-400" />
          <span>Current DP Cell (Heated)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-steel-500/40 border border-steel-400" />
          <span>Computed / Preserved (Tempered)</span>
        </div>
      </div>
    </div>
  );
};

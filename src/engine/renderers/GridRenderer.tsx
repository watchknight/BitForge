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
        return 'bg-brand-500/20 border-brand-400 text-brand-200 ring-2 ring-brand-400/50 shadow-lg shadow-brand-500/20 scale-105 font-bold';
      case 'comparing':
        return 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 font-bold';
      case 'sorted':
        return 'bg-steel-500/20 border-steel-400 text-steel-200 ring-1 ring-steel-500/40';
      case 'visited':
        return 'bg-obsidian-800 border-slate-600 text-slate-300';
      default:
        return 'bg-obsidian-900 border-slate-800 text-slate-300';
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

      {/* Grid container */}
      <div className="overflow-x-auto max-w-full p-2">
        <table className="border-separate border-spacing-2">
          {/* Column headers */}
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th className="p-2"></th>}
                {colLabels.map((col, cIdx) => (
                  <th
                    key={cIdx}
                    className="p-1 text-center font-mono text-xs text-slate-400 font-semibold"
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
                {/* Row label if present */}
                {rowLabels && (
                  <td className="pr-3 text-right font-mono text-xs text-slate-400 font-semibold">
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
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-lg border flex flex-col items-center justify-center transition-all duration-200 shadow-sm ${getCellClasses(
                          role
                        )}`}
                      >
                        <span className="text-sm md:text-base font-mono">
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

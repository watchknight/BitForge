/**
 * BitForge Dynamic Programming Grid Visualizer: `GridRenderer`
 * 
 * Matrix and table visualizer for 1D/2D Dynamic Programming and Recurrence relations
 * (Fibonacci DP, Knapsack 0/1, Longest Common Subsequence, Grid Paths).
 * 
 * FEATURES:
 * 1. 1D Array & 2D Matrix Normalization: Transparently renders both 1D lookup arrays
 *    and 2D recurrence tables with row/column headers.
 * 2. Recurrence Formula Ticker: Displays active mathematical formula (e.g. `dp[i] = dp[i-1] + dp[i-2]`).
 * 3. Cell Dependency Highlights: Highlights source cells being read (`comparing`) and
 *    target cells being written (`active`).
 * 4. Unified Semantic Styling: Uses `getBoxHighlightClasses` for theme-aware cells.
 */

import React, { useMemo } from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { getBoxHighlightClasses } from '../semanticThemes';

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

export const GridRenderer: React.FC<GridRendererProps> = React.memo(({
  cells,
  rowLabels,
  colLabels,
  highlights = {},
  formula,
  activeCell,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Normalize to 2D array
  const { is2D, matrix } = useMemo(() => {
    const isTwoDim = Array.isArray(cells[0]);
    const mat: (number | string | null)[][] = isTwoDim
      ? (cells as (number | string | null)[][])
      : [cells as (number | string | null)[]];
    return { is2D: isTwoDim, matrix: mat };
  }, [cells]);

  const getCellKey = (r: number, c: number) => {
    return is2D ? `${r},${c}` : `${c}`;
  };

  const getCellClasses = (role?: HighlightRole) => getBoxHighlightClasses(role, isLight);


  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-6 select-none">
      {/* Recurrence / Calculation preview */}
      {formula && (
        <div className="mb-4 px-4 py-1.5 rounded-lg bg-obsidian-950 border border-brand-500/30 text-xs font-mono flex items-center gap-2 shadow-sm">
          <span className="text-slate-400 font-sans">Active Calculation:</span>
          <span className={`font-bold ${isLight ? 'text-brand-800' : 'text-brand-300'}`}>{formula}</span>
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
});

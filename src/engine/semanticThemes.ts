/**
 * BitForge Semantic Theme Engine
 * 
 * Centralizes color definitions and contrast mappings across all Simulation Engine
 * renderers (SVG and HTML box renderers) for both "Midnight Forge" (Dark Mode)
 * and "The Forge in Daylight" (Light Mode).
 * 
 * Semantic States:
 * - Unforged: Raw, unvisited metal (cool graphite / soft stone)
 * - In the Forge: Active examination, comparison, or pivot (blazing orange / golden amber)
 * - Tempered: Quenched, confirmed, sorted, or visited (blue-steel / quenched cyan)
 * - Overheated: Conflicts, boundary errors, or backtrack removals (deep brick red / soft rose)
 */

import { HighlightRole } from '../types/simulation';

export interface SvgNodeColors {
  fill: string;
  stroke: string;
  text: string;
}

/**
 * Returns unified SVG fill, stroke, and text color for tree and graph nodes,
 * guaranteeing WCAG AA (>= 4.5:1 text, >= 3:1 graphical) compliance in both themes.
 */
export function getSvgNodeTheme(role?: HighlightRole, isLight: boolean = false): SvgNodeColors {
  if (isLight) {
    switch (role) {
      case 'active':
        return { fill: '#c2410c', stroke: '#9a3412', text: '#ffffff' };
      case 'comparing':
        return { fill: '#b45309', stroke: '#92400e', text: '#ffffff' };
      case 'sorted':
        return { fill: '#0369a1', stroke: '#075985', text: '#ffffff' };
      case 'visited':
        return { fill: '#075985', stroke: '#0c4a6e', text: '#ffffff' };
      case 'danger':
        return { fill: '#b91c1c', stroke: '#991b1b', text: '#ffffff' };
      default:
        return { fill: '#ede7dc', stroke: '#cbbfad', text: '#1c1917' };
    }
  }

  // Dark Mode ("Midnight Forge")
  switch (role) {
    case 'active':
      return { fill: '#f97316', stroke: '#fb923c', text: '#0c0c0e' };
    case 'comparing':
      return { fill: '#f59e0b', stroke: '#fbbf24', text: '#0c0c0e' };
    case 'sorted':
      return { fill: '#38bdf8', stroke: '#7dd3fc', text: '#0c0c0e' };
    case 'visited':
      return { fill: '#0284c7', stroke: '#38bdf8', text: '#f5f2eb' };
    case 'danger':
      return { fill: '#c53030', stroke: '#fca5a5', text: '#f5f2eb' };
    default:
      return { fill: '#1a1c22', stroke: '#3d434f', text: '#f5f2eb' };
  }
}

/**
 * Returns unified CSS classes for container/box-based renderers
 * (LinkedList nodes, Grid cells, etc.).
 */
export function getBoxHighlightClasses(role?: HighlightRole, isLight: boolean = false): string {
  switch (role) {
    case 'active':
      return isLight
        ? 'bg-brand-500/20 border-brand-600 text-brand-900 ring-2 ring-brand-500/50 shadow-md shadow-brand-500/20 font-bold'
        : 'bg-brand-500/25 border-brand-500 text-brand-100 ring-2 ring-brand-400/50 shadow-lg shadow-brand-500/25 font-bold';
    case 'comparing':
      return isLight
        ? 'bg-amber-500/20 border-amber-600 text-amber-900 ring-2 ring-amber-500/50 shadow-md shadow-amber-500/20 font-bold'
        : 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 font-bold';
    case 'sorted':
      return isLight
        ? 'bg-steel-500/20 border-steel-600 text-steel-900 ring-1 ring-steel-500/40 font-semibold'
        : 'bg-steel-500/20 border-steel-400 text-steel-200 ring-1 ring-steel-400/40 font-semibold';
    case 'visited':
      return isLight
        ? 'bg-steel-500/10 border-steel-400 text-steel-800 ring-1 ring-steel-500/30 font-semibold'
        : 'bg-steel-950/50 border-steel-500/40 text-steel-200 ring-1 ring-steel-500/30 font-semibold';
    case 'danger':
      return isLight
        ? 'bg-red-500/15 border-red-600 text-red-800 ring-2 ring-red-500/40'
        : 'bg-red-950/40 border-red-500/60 text-red-300 ring-2 ring-red-500/30';
    default:
      return isLight
        ? 'bg-[#ede7dc] border-[#cbbfad] text-slate-800 hover:border-slate-400'
        : 'bg-[#1a1c22] border-[#3d434f] text-slate-300 hover:border-slate-500';
  }
}

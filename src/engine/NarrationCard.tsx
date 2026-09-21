/**
 * BitForge Invariant & Narration Ticker: `NarrationCard`
 * 
 * Displays real-time natural language explanations and algorithmic invariants
 * synchronized with each step.
 * 
 * CORE FEATURES:
 * 1. Semantic Action Badge: Dynamically classifies the current algorithmic phase
 *    (e.g. COMPARE, SWAP, DIVIDE, RECURSE, BASE CASE) with theme-aware Forge colors.
 * 2. Natural Language Description: Explains *why* the algorithm made this decision
 *    rather than just restating raw numbers.
 * 3. Live Variable Inspector: Renders active pointers, loop variables, and formula
 *    evaluations in monospace chips below the narration text.
 */

import React from 'react';
import { Step } from '../types/simulation';
import { Sparkles, Variable } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NarrationCardProps {
  step: Step;
}

export const NarrationCard: React.FC<NarrationCardProps> = React.memo(({ step }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const action = step.explanation?.action || 'ANALYZING';
  const variables = step.explanation?.variables;
  const formula = step.explanation?.formula;

  // Semantic color for the action badge
  const getBadgeStyle = (act: string) => {
    const lower = act.toLowerCase();
    // "In the forge" — comparing / checking (molten gold)
    if (lower.includes('compare') || lower.includes('check')) {
      return isLight
        ? 'bg-amber-100 text-amber-950 border-amber-300/80 shadow-sm shadow-amber-500/10'
        : 'bg-amber-950/80 text-amber-200 border-amber-500/50 shadow-sm shadow-amber-500/10';
    }
    // "In the forge" — active modification / heat (blazing flame)
    if (lower.includes('swap') || lower.includes('merge') || lower.includes('insert') || lower.includes('write') || lower.includes('active')) {
      return isLight
        ? 'bg-orange-100 text-orange-950 border-orange-300/80 shadow-sm shadow-orange-500/10'
        : 'bg-brand-950/80 text-brand-200 border-brand-500/50 shadow-sm shadow-brand-500/10';
    }
    // "Tempered" — finished / sorted / quenched (blue-steel)
    if (lower.includes('sorted') || lower.includes('found') || lower.includes('complete') || lower.includes('finish') || lower.includes('quenched')) {
      return isLight
        ? 'bg-sky-100 text-sky-950 border-sky-300/80 shadow-sm shadow-sky-500/10'
        : 'bg-steel-950/80 text-steel-200 border-steel-500/50 shadow-sm shadow-steel-500/10';
    }
    // "Overheated" — mistake / danger / error (desaturated red)
    if (lower.includes('delete') || lower.includes('danger') || lower.includes('unwind') || lower.includes('error') || lower.includes('conflict')) {
      return isLight
        ? 'bg-red-100 text-red-950 border-red-300/80 shadow-sm shadow-red-500/10'
        : 'bg-red-950/80 text-red-200 border-red-500/50 shadow-sm shadow-red-500/10';
    }
    // "Unforged" — default raw state
    return isLight
      ? 'bg-stone-200 text-stone-900 border-stone-300'
      : 'bg-[#1a1c22] text-slate-300 border-[#3d434f]';
  };

  return (
    <div className="bg-obsidian-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider rounded border ${getBadgeStyle(
              action
            )}`}
          >
            {action}
          </span>
          <span className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
            Line {step.codeLine}
          </span>
        </div>

        {formula && (
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs font-mono ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-obsidian-950 border-slate-800 text-brand-300'
          }`}>
            <span className={isLight ? 'text-amber-800 font-semibold' : 'text-brand-300'}>Formula:</span>
            <code className={isLight ? 'text-stone-900 font-semibold' : 'text-slate-200'}>{formula}</code>
          </div>
        )}
      </div>

      {/* Main plain-language narrative */}
      <div className="flex items-start gap-3 my-2">
        <div className={`mt-0.5 p-1 rounded-md shrink-0 ${isLight ? 'bg-orange-100 text-orange-600' : 'bg-brand-500/10 text-brand-400'}`}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className={`text-sm md:text-base font-medium leading-relaxed ${isLight ? 'text-stone-900' : 'text-slate-100'}`}>
            {step.description}
          </p>
          {step.explanation?.details && (
            <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
              {step.explanation.details}
            </p>
          )}
        </div>
      </div>

      {/* Live variables inspector */}
      {variables && Object.keys(variables).length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-medium flex items-center gap-1 mr-1 ${isLight ? 'text-stone-600' : 'text-slate-400'}`}>
            <Variable className="w-3.5 h-3.5" />
            Live State:
          </span>
          {Object.entries(variables).map(([key, val]) => (
            <div
              key={key}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-xs ${
                isLight 
                  ? 'bg-stone-100/90 border-stone-200' 
                  : 'bg-obsidian-950 border-slate-800'
              }`}
            >
              <span className={isLight ? 'text-brand-700 font-bold' : 'text-brand-400 font-semibold'}>{key}:</span>
              <span className={isLight ? 'text-stone-900 font-semibold' : 'text-slate-200'}>{String(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

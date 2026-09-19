import React from 'react';
import { Step } from '../types/simulation';
import { Sparkles, ArrowRight, Variable, CheckCircle2, HelpCircle } from 'lucide-react';

interface NarrationCardProps {
  step: Step;
}

export const NarrationCard: React.FC<NarrationCardProps> = ({ step }) => {
  const action = step.explanation?.action || 'ANALYZING';
  const variables = step.explanation?.variables;
  const formula = step.explanation?.formula;

  // Semantic color for the action badge
  const getBadgeStyle = (act: string) => {
    const lower = act.toLowerCase();
    if (lower.includes('compare') || lower.includes('check')) {
      return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
    }
    if (lower.includes('swap') || lower.includes('merge') || lower.includes('insert') || lower.includes('write')) {
      return 'bg-brand-950/70 text-brand-300 border-brand-500/40';
    }
    if (lower.includes('sorted') || lower.includes('found') || lower.includes('complete') || lower.includes('finish')) {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    }
    if (lower.includes('delete') || lower.includes('danger') || lower.includes('unwind')) {
      return 'bg-rose-950/70 text-rose-300 border-rose-500/40';
    }
    return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40';
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
          <span className="text-xs font-mono text-slate-400">
            Line {step.codeLine}
          </span>
        </div>

        {formula && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-obsidian-950 rounded border border-slate-800 text-xs font-mono text-brand-300">
            <span>Formula:</span>
            <code className="text-slate-200">{formula}</code>
          </div>
        )}
      </div>

      {/* Main plain-language narrative */}
      <div className="flex items-start gap-3 my-2">
        <div className="mt-0.5 p-1 rounded-md bg-brand-500/10 text-brand-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
            {step.description}
          </p>
          {step.explanation?.details && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {step.explanation.details}
            </p>
          )}
        </div>
      </div>

      {/* Live variables inspector */}
      {variables && Object.keys(variables).length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Variable className="w-3.5 h-3.5 text-slate-400" />
            Live State:
          </span>
          {Object.entries(variables).map(([key, val]) => (
            <div
              key={key}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-obsidian-950 border border-slate-800 font-mono text-xs"
            >
              <span className="text-brand-400 font-semibold">{key}:</span>
              <span className="text-slate-200">{String(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ComplexityInfo } from '../../types/topic';
import { Clock, HardDrive, HelpCircle, TrendingUp } from 'lucide-react';

interface ComplexityCardProps {
  complexity: ComplexityInfo;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = React.memo(({ complexity }) => {
  return (
    <div className="bg-obsidian-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <TrendingUp className="w-5 h-5 text-brand-400" />
        <h3 className="text-base font-bold text-white font-sans">
          Complexity Analysis
        </h3>
      </div>

      {/* Grid of 4 metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800/80 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-steel-400" />
            Best Time
          </span>
          <span className="text-sm md:text-base font-mono font-bold text-steel-300 mt-1">
            {complexity.bestTime}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800/80 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-400" />
            Average Time
          </span>
          <span className="text-sm md:text-base font-mono font-bold text-brand-300 mt-1">
            {complexity.avgTime}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800/80 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Worst Time
          </span>
          <span className="text-sm md:text-base font-mono font-bold text-amber-300 mt-1">
            {complexity.worstTime}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-950 border border-slate-800/80 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-steel-400" />
            Aux Space
          </span>
          <span className="text-sm md:text-base font-mono font-bold text-steel-300 mt-1">
            {complexity.space}
          </span>
        </div>
      </div>

      {/* Plain-language "Why?" Breakdown */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-obsidian-950/60 border border-slate-800">
          <h4 className="text-xs font-mono font-bold text-brand-300 flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Why this time complexity?
          </h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {complexity.whyTime}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-obsidian-950/60 border border-slate-800">
          <h4 className="text-xs font-mono font-bold text-steel-300 flex items-center gap-1.5 mb-1">
            <HardDrive className="w-3.5 h-3.5" />
            Why this space complexity?
          </h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {complexity.whySpace}
          </p>
        </div>
      </div>
    </div>
  );
});

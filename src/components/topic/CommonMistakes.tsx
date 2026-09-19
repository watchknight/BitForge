import React from 'react';
import { CommonMistake } from '../../types/topic';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CommonMistakesProps {
  mistakes: CommonMistake[];
}

export const CommonMistakes: React.FC<CommonMistakesProps> = ({ mistakes }) => {
  return (
    <div className="bg-obsidian-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-bold text-white font-sans">
          Common Student Pitfalls & Misconceptions
        </h3>
      </div>

      <div className="space-y-4">
        {mistakes.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-obsidian-950/80 border border-slate-800/90 flex flex-col gap-2.5 transition-all hover:border-slate-700"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <h4 className="text-sm font-bold text-slate-100 font-sans">
                {m.title}
              </h4>
            </div>

            {/* Misconception */}
            <div className="flex items-start gap-2 text-xs md:text-[13px] text-rose-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-200">The Trap: </span>
                {m.misconception}
              </div>
            </div>

            {/* Fix */}
            <div className="flex items-start gap-2 text-xs md:text-[13px] text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-200">The Fix: </span>
                {m.fix}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

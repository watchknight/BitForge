import React from 'react';
import { CallStackFrame } from '../../types/simulation';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowDown } from 'lucide-react';

interface CallStackRendererProps {
  stack: CallStackFrame[];
  maxDepth?: number;
}

export const CallStackRenderer: React.FC<CallStackRendererProps> = ({
  stack = [],
  maxDepth = 8,
}) => {
  return (
    <div className="bg-obsidian-950/80 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col w-full max-w-xs shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 font-semibold">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>Call Stack</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-obsidian-900 px-2 py-0.5 rounded border border-slate-800">
          Depth: <span className="text-brand-300 font-bold">{stack.length}</span>
        </span>
      </div>

      <div className="flex flex-col-reverse gap-1.5 min-h-[160px] max-h-[260px] overflow-y-auto p-1">
        {stack.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs font-mono text-slate-600 italic">
            Stack Empty (Execution Finished)
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {stack.map((frame, index) => {
              const isTop = index === stack.length - 1;

              return (
                <motion.div
                  key={frame.id}
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2 rounded-lg border text-xs font-mono transition-all ${
                    isTop
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-100 shadow-md shadow-brand-500/10'
                      : frame.status === 'returned'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-obsidian-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      {frame.name}
                      {isTop && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping"></span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-sans">
                      {isTop ? 'Active' : frame.status}
                    </span>
                  </div>

                  {/* Arguments list */}
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                    {Object.entries(frame.args).map(([k, v]) => (
                      <span
                        key={k}
                        className="px-1.5 py-0.2 bg-obsidian-950/70 rounded text-slate-300 border border-slate-800"
                      >
                        {k}={String(v)}
                      </span>
                    ))}
                  </div>

                  {/* Return value if finished */}
                  {frame.returnValue !== undefined && (
                    <div className="mt-1 text-[10px] text-emerald-400">
                      Returned: {frame.returnValue}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <div className="pt-2 mt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 text-center flex items-center justify-center gap-1">
        <ArrowDown className="w-3 h-3 text-slate-600" />
        <span>Stack Base (caller)</span>
      </div>
    </div>
  );
};

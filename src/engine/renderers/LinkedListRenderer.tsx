import React from 'react';
import { HighlightRole } from '../../types/simulation';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LLNode {
  id: string;
  val: number | string;
  isHead?: boolean;
}

interface LinkedListRendererProps {
  nodes: LLNode[];
  detachedNode?: LLNode | null; // For new node being created/inserted
  highlights?: Record<string | number, HighlightRole>;
  pointers?: Record<string, string | number>; // e.g. { 'curr': 'node-2', 'prev': 'node-1' }
}

export const LinkedListRenderer: React.FC<LinkedListRendererProps> = ({
  nodes,
  detachedNode,
  highlights = {},
  pointers = {},
}) => {
  // Map node ID to list of pointers pointing to it
  const nodePointers: Record<string, string[]> = {};
  Object.entries(pointers).forEach(([name, targetId]) => {
    if (targetId) {
      if (!nodePointers[targetId]) nodePointers[targetId] = [];
      nodePointers[targetId].push(name);
    }
  });

  const getNodeClasses = (role?: HighlightRole) => {
    switch (role) {
      case 'active':
        return 'bg-brand-500/20 border-brand-400 text-brand-200 ring-2 ring-brand-400/40 shadow-lg shadow-brand-500/20';
      case 'comparing':
        return 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20';
      case 'sorted':
        return 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/30';
      case 'danger':
        return 'bg-rose-500/20 border-rose-400 text-rose-200 ring-2 ring-rose-400/40';
      case 'visited':
        return 'bg-violet-500/20 border-violet-400 text-violet-200 ring-1 ring-violet-400/30';
      default:
        return 'bg-obsidian-900 border-slate-700 text-slate-100 hover:border-slate-600';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-x-auto min-h-[220px]">
      {/* Floating / Detached Node (e.g. newly allocated node during insertion) */}
      {detachedNode && (
        <div className="mb-6 flex flex-col items-center">
          <div className="text-xs font-mono text-brand-300 font-semibold mb-1 flex items-center gap-1">
            <span>Allocated New Node</span>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`flex items-center rounded-xl border p-1 shadow-md ${getNodeClasses(
              highlights[detachedNode.id] || 'active'
            )}`}
          >
            <div className="px-3 py-1.5 font-mono font-bold text-sm border-r border-slate-700/60">
              {detachedNode.val}
            </div>
            <div className="px-2 text-xs font-mono text-slate-400">
              next: null
            </div>
          </motion.div>
          {nodePointers[detachedNode.id]?.map((ptr) => (
            <span
              key={ptr}
              className="mt-1 px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase rounded bg-brand-500/20 text-brand-300 border border-brand-500/40"
            >
              {ptr}
            </span>
          ))}
        </div>
      )}

      {/* Main Linked List Chain */}
      <div className="flex items-center gap-2 md:gap-3 py-4 min-w-max">
        {nodes.length === 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-400 px-2 py-1 rounded bg-brand-950/60 border border-brand-500/30">
              HEAD
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-mono text-slate-500 italic px-2 py-1 rounded bg-obsidian-950 border border-slate-800">
              NULL (Empty List)
            </span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => {
              const role = highlights[node.id] || highlights[index];
              const ptrs = nodePointers[node.id];

              return (
                <div key={node.id} className="flex items-center gap-2 md:gap-3">
                  <div className="flex flex-col items-center">
                    {/* Top pointers (like HEAD or curr) */}
                    <div className="min-h-[22px] flex items-center gap-1 mb-1">
                      {index === 0 && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand-950 text-brand-400 border border-brand-500/30">
                          HEAD
                        </span>
                      )}
                      {ptrs?.map((ptr) => (
                        <span
                          key={ptr}
                          className="text-[10px] font-mono font-bold px-1.5 py-0.2 uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                        >
                          {ptr}
                        </span>
                      ))}
                    </div>

                    {/* Node Box: [ val | next ] */}
                    <motion.div
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`flex items-stretch rounded-xl border transition-all duration-200 shadow-sm ${getNodeClasses(
                        role
                      )}`}
                    >
                      {/* Val partition */}
                      <div className="px-3.5 py-2 font-mono font-bold text-sm md:text-base border-r border-slate-700/60 flex items-center justify-center min-w-[40px]">
                        {node.val}
                      </div>

                      {/* Next pointer address partition */}
                      <div className="px-2.5 py-2 text-[11px] font-mono text-slate-400 flex items-center justify-center bg-obsidian-950/40 rounded-r-xl">
                        &bull;
                      </div>
                    </motion.div>

                    {/* Node index */}
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      idx {index}
                    </span>
                  </div>

                  {/* Arrow to next node */}
                  <div className="flex items-center text-slate-500 px-1">
                    <ArrowRight className="w-5 h-5 text-brand-400/70" />
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Terminal NULL */}
        {nodes.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="min-h-[22px] mb-1" />
            <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-slate-800 text-xs font-mono text-slate-500 font-semibold">
              NULL
            </div>
            <div className="min-h-[16px] mt-1" />
          </div>
        )}
      </div>
    </div>
  );
};

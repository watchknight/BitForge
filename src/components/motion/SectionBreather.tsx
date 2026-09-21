import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Sparkles, Network, GitBranch, BarChart3, ArrowDown } from 'lucide-react';

interface SectionBreatherProps {
  initialVariant?: 'sorting' | 'tree' | 'graph';
  title?: string;
  quote?: string;
  author?: string;
  onExplore?: () => void;
}

export const SectionBreather: React.FC<SectionBreatherProps> = ({
  initialVariant = 'sorting',
  title = 'A Breath in the Complexity',
  quote = 'Every algorithm is a solved puzzle waiting for you to see the picture on the box.',
  author = 'BitForge Instructional Philosophy',
  onExplore,
}) => {
  const { reducedMotion } = useAccessibility();
  const [variant, setVariant] = useState<'sorting' | 'tree' | 'graph'>(initialVariant);

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-obsidian-950 border-y border-slate-800/80">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900/60 to-obsidian-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Atmospheric Visual Backdrop */}
      <div className="max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Subtle Category Variant Switcher */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-900/90 border border-slate-800 backdrop-blur-md mb-8">
          <button
            onClick={() => setVariant('sorting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              variant === 'sorting'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Partition Canvas</span>
          </button>

          <button
            onClick={() => setVariant('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              variant === 'tree'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Tree Equilibrium</span>
          </button>

          <button
            onClick={() => setVariant('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              variant === 'graph'
                ? 'bg-brand-500 text-obsidian-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Network Mesh</span>
          </button>
        </div>

        {/* The Atmospheric Data Structure Graphic */}
        <div className="w-full max-w-4xl h-44 sm:h-56 rounded-3xl bg-obsidian-900/50 border border-slate-800/80 backdrop-blur-sm p-6 flex items-center justify-center relative overflow-hidden shadow-2xl mb-10 group">
          {/* Subtle grid background inside canvas */}
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

          {/* 1. Sorting Variant: Partition Harmonic Bars */}
          {variant === 'sorting' && (
            <div className="w-full h-full flex items-end justify-center gap-2 sm:gap-3 px-4">
              {[25, 45, 18, 70, 35, 90, 52, 38, 80, 29, 64, 42, 95, 15, 60, 32].map((height, i) => {
                const isPivot = i === 7;
                const isSorted = i > 11;
                const isComparing = i === 3 || i === 4;

                let color = 'bg-slate-800 border-slate-700';
                if (isPivot) color = 'bg-brand-400 border-brand-300 shadow-lg shadow-brand-400/40';
                else if (isSorted) color = 'bg-steel-500/80 border-steel-400 shadow-md shadow-steel-500/20';
                else if (isComparing) color = 'bg-amber-400/90 border-amber-300 animate-pulse';

                return (
                  <motion.div
                    key={i}
                    layout={!reducedMotion}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.6, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex-1 rounded-t-md border-t transition-all ${color}`}
                  />
                );
              })}
            </div>
          )}

          {/* 2. Tree Variant: Balanced Node Hierarchy */}
          {variant === 'tree' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-full max-w-md" viewBox="0 0 400 180">
                {/* Connecting Edges */}
                <line x1="200" y1="30" x2="100" y2="80" stroke="#2e2e33" strokeWidth="2" strokeDasharray="4 2" />
                <line x1="200" y1="30" x2="300" y2="80" stroke="#2e2e33" strokeWidth="2" strokeDasharray="4 2" />
                <line x1="100" y1="80" x2="60" y2="140" stroke="#2e2e33" strokeWidth="1.5" />
                <line x1="100" y1="80" x2="140" y2="140" stroke="#2e2e33" strokeWidth="1.5" />
                <line x1="300" y1="80" x2="260" y2="140" stroke="#2e2e33" strokeWidth="1.5" />
                <line x1="300" y1="80" x2="340" y2="140" stroke="#2e2e33" strokeWidth="1.5" />

                {/* Level 0: Root */}
                <circle cx="200" cy="30" r="14" fill="#9a3412" stroke="#fb923c" strokeWidth="2" />
                <text x="200" y="34" textAnchor="middle" fill="#f5f2eb" fontSize="11" fontFamily="monospace" fontWeight="bold">50</text>

                {/* Level 1 */}
                <circle cx="100" cy="80" r="12" fill="#141416" stroke="#f97316" strokeWidth="2" />
                <text x="100" y="84" textAnchor="middle" fill="#ded7cc" fontSize="10" fontFamily="monospace">25</text>

                <circle cx="300" cy="80" r="12" fill="#141416" stroke="#38bdf8" strokeWidth="2" />
                <text x="300" y="84" textAnchor="middle" fill="#ded7cc" fontSize="10" fontFamily="monospace">75</text>

                {/* Level 2: Leaves */}
                <circle cx="60" cy="140" r="10" fill="#0c0c0e" stroke="#3a3632" strokeWidth="1.5" />
                <text x="60" y="143" textAnchor="middle" fill="#a39e95" fontSize="9" fontFamily="monospace">10</text>

                <circle cx="140" cy="140" r="10" fill="#0c0c0e" stroke="#3a3632" strokeWidth="1.5" />
                <text x="140" y="143" textAnchor="middle" fill="#a39e95" fontSize="9" fontFamily="monospace">35</text>

                <circle cx="260" cy="140" r="10" fill="#0c0c0e" stroke="#3a3632" strokeWidth="1.5" />
                <text x="260" y="143" textAnchor="middle" fill="#a39e95" fontSize="9" fontFamily="monospace">60</text>

                <circle cx="340" cy="140" r="10" fill="#0c0c0e" stroke="#3a3632" strokeWidth="1.5" />
                <text x="340" y="143" textAnchor="middle" fill="#a39e95" fontSize="9" fontFamily="monospace">90</text>
              </svg>
            </div>
          )}

          {/* 3. Graph Variant: Topological Network Mesh */}
          {variant === 'graph' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-full max-w-lg" viewBox="0 0 450 180">
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="10" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#f97316" />
                  </marker>
                </defs>
                {/* Directed Edges */}
                <line x1="60" y1="90" x2="160" y2="40" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <line x1="60" y1="90" x2="160" y2="140" stroke="#2e2e33" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="160" y1="40" x2="280" y2="40" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <line x1="160" y1="140" x2="280" y2="140" stroke="#2e2e33" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="160" y1="40" x2="280" y2="140" stroke="#2e2e33" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="280" y1="40" x2="390" y2="90" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <line x1="280" y1="140" x2="390" y2="90" stroke="#2e2e33" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

                {/* Nodes */}
                <circle cx="60" cy="90" r="14" fill="#9a3412" stroke="#fb923c" strokeWidth="2" />
                <text x="60" y="94" textAnchor="middle" fill="#f5f2eb" fontSize="11" fontFamily="monospace" fontWeight="bold">S</text>

                <circle cx="160" cy="40" r="13" fill="#141416" stroke="#f97316" strokeWidth="2" />
                <text x="160" y="44" textAnchor="middle" fill="#ded7cc" fontSize="10" fontFamily="monospace">A</text>

                <circle cx="160" cy="140" r="13" fill="#0c0c0e" stroke="#3a3632" strokeWidth="1.5" />
                <text x="160" y="144" textAnchor="middle" fill="#a39e95" fontSize="10" fontFamily="monospace">B</text>

                <circle cx="280" cy="40" r="13" fill="#141416" stroke="#38bdf8" strokeWidth="2" />
                <text x="280" y="44" textAnchor="middle" fill="#ded7cc" fontSize="10" fontFamily="monospace">C</text>

                <circle cx="280" cy="140" r="13" fill="#0c0c0e" stroke="#3a3632" strokeWidth="1.5" />
                <text x="280" y="144" textAnchor="middle" fill="#a39e95" fontSize="10" fontFamily="monospace">D</text>

                <circle cx="390" cy="90" r="14" fill="#075985" stroke="#38bdf8" strokeWidth="2" />
                <text x="390" y="94" textAnchor="middle" fill="#f5f2eb" fontSize="11" fontFamily="monospace" fontWeight="bold">T</text>
              </svg>
            </div>
          )}
        </div>

        {/* Thoughtful Text Content */}
        <div className="max-w-2xl space-y-3">
          <blockquote className="text-lg sm:text-2xl font-serif italic text-slate-200 leading-relaxed font-light">
            "{quote}"
          </blockquote>
          <div className="text-xs font-mono uppercase tracking-widest text-brand-400 font-medium">
            — {author}
          </div>
        </div>

        {onExplore && (
          <button
            onClick={onExplore}
            className="mt-8 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-brand-300 transition-colors group"
          >
            <span>Continue To Curriculum Stages</span>
            <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>
    </section>
  );
};

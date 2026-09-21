import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';

interface PhraseStep {
  index: string;
  tag: string;
  verb: string;
  phrase: string;
  takeaway: string;
  dataVisual: {
    label: string;
    items: { val: number; state: 'neutral' | 'active' | 'comparing' | 'sorted' }[];
  };
}

const ALGORITHM_PHRASES: PhraseStep[] = [
  {
    index: '01',
    tag: 'Divide',
    verb: 'Partition the Chaos',
    phrase: 'First, don’t tackle the whole problem at once.',
    takeaway: 'Halve the input array recursively until you reach single elements—which are trivially sorted.',
    dataVisual: {
      label: 'Recursive Halving',
      items: [
        { val: 38, state: 'active' },
        { val: 27, state: 'active' },
        { val: 43, state: 'active' },
        { val: 3, state: 'neutral' },
        { val: 9, state: 'neutral' },
        { val: 82, state: 'neutral' },
      ],
    },
  },
  {
    index: '02',
    tag: 'Isolate',
    verb: 'Select Reference Pointers',
    phrase: 'Pick key indices and establish clear invariant boundaries.',
    takeaway: 'No guessing: two deterministic pointers advance strictly based on pairwise comparisons.',
    dataVisual: {
      label: 'Pointer Alignment',
      items: [
        { val: 27, state: 'comparing' },
        { val: 38, state: 'comparing' },
        { val: 3, state: 'neutral' },
        { val: 9, state: 'neutral' },
        { val: 43, state: 'neutral' },
        { val: 82, state: 'neutral' },
      ],
    },
  },
  {
    index: '03',
    tag: 'Compare',
    verb: 'Evaluate In Linear Time',
    phrase: 'Compare adjacent elements with surgical precision.',
    takeaway: 'At each comparison, make the locally optimal choice: place the smaller value next in sequence.',
    dataVisual: {
      label: 'Sorted Merge Step',
      items: [
        { val: 3, state: 'sorted' },
        { val: 9, state: 'sorted' },
        { val: 27, state: 'sorted' },
        { val: 38, state: 'comparing' },
        { val: 43, state: 'comparing' },
        { val: 82, state: 'neutral' },
      ],
    },
  },
  {
    index: '04',
    tag: 'Conquer',
    verb: 'Zip Into Harmony',
    phrase: 'And assemble the fragments in guaranteed logarithmic time.',
    takeaway: 'Total work across all log₂(N) tree levels remains strictly O(N log N). Predictable. Elegant.',
    dataVisual: {
      label: 'Complete Sorted Array',
      items: [
        { val: 3, state: 'sorted' },
        { val: 9, state: 'sorted' },
        { val: 27, state: 'sorted' },
        { val: 38, state: 'sorted' },
        { val: 43, state: 'sorted' },
        { val: 82, state: 'sorted' },
      ],
    },
  },
];

export const ScrollSentenceBuilder: React.FC = () => {
  const { reducedMotion } = useAccessibility();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play timer if user clicks play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < ALGORITHM_PHRASES.length - 1 ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = ALGORITHM_PHRASES[activeStep];

  return (
    <section 
      ref={containerRef}
      className="py-16 sm:py-24 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-y border-slate-800/80 relative overflow-hidden"
    >
      {/* Tactile grain & subtle ember glow */}
      <div className="absolute inset-0 forge-glow-break pointer-events-none" />
      <div className="absolute inset-0 forge-grain opacity-70 pointer-events-none" />

      <div className="max-w-6xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-900/90 border border-slate-800 text-slate-300 text-xs font-mono mb-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              <span>Progressive Intuition Builder</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Watch the Logic Form Sentence by Sentence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Algorithms are not magic spells or obscure formulas. They are a sequence of plain-language decisions linked together.
            </p>
          </div>

          {/* Step Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-slate-800 hover:border-brand-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-brand-400" />}
              <span>{isAutoPlaying ? 'Pause' : 'Auto-Play'}</span>
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveStep(0);
              }}
              title="Reset phrase sequence"
              className="p-1.5 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Sentence Assembly Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Progressive Sentences (Inspired by Boon Global) */}
          <div className="lg:col-span-7 space-y-6">
            {ALGORITHM_PHRASES.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <div
                  key={step.index}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-obsidian-900/90 border-brand-500/50 shadow-xl shadow-brand-500/5 scale-[1.01]'
                      : isPast
                      ? 'bg-obsidian-950/60 border-slate-800/80 opacity-75 hover:opacity-100'
                      : 'bg-obsidian-950/30 border-slate-800/40 opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-brand-500 text-obsidian-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.index}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400">
                      {step.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      — {step.verb}
                    </span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                    isActive
                      ? 'text-white'
                      : isPast
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}>
                    {step.phrase}
                  </h3>

                  {isActive && (
                    <motion.p 
                      initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.35 }}
                      className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-slate-800/80 leading-relaxed font-sans"
                    >
                      {step.takeaway}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Synchronized Data State Visual */}
          <div className="lg:col-span-5">
            <div className="bg-obsidian-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse" />
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    {current.dataVisual.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-brand-400 bg-brand-950/80 px-2 py-0.5 rounded border border-brand-500/30">
                  Step {activeStep + 1} of {ALGORITHM_PHRASES.length}
                </span>
              </div>

              {/* Dynamic State Bars */}
              <div className="h-44 bg-obsidian-950 rounded-xl border border-slate-800/80 p-4 flex items-end justify-center gap-2.5 sm:gap-3">
                {current.dataVisual.items.map((item, idx) => {
                  const heightPercent = Math.max(20, Math.round((item.val / 82) * 100));

                  let barStyle = 'bg-[#333842] border-[#3d434f] text-slate-400';
                  if (item.state === 'active') {
                    barStyle = 'bg-brand-500 border-brand-400 text-obsidian-950 font-bold shadow-lg shadow-brand-500/30';
                  } else if (item.state === 'comparing') {
                    barStyle = 'bg-amber-400 border-amber-300 text-obsidian-950 font-bold animate-pulse shadow-lg shadow-amber-400/30';
                  } else if (item.state === 'sorted') {
                    barStyle = 'bg-steel-400 border-steel-300 text-obsidian-950 font-bold shadow-lg shadow-steel-400/30';
                  }

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-[10px] font-mono text-slate-400 mb-1">
                        {item.val}
                      </span>
                      <motion.div
                        layout={!reducedMotion}
                        initial={false}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className={`w-full rounded-t-md border-t transition-colors ${barStyle}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Invariant Note */}
              <div className="p-3 bg-obsidian-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span className="text-slate-500">Active Invariant:</span>
                <span className="text-brand-300 font-semibold">{current.tag} Phase Active</span>
              </div>

              {/* Next Step Trigger */}
              <button
                onClick={() => {
                  setActiveStep((prev) => (prev < ALGORITHM_PHRASES.length - 1 ? prev + 1 : 0));
                  setIsAutoPlaying(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs transition-all shadow-md"
              >
                <span>{activeStep === ALGORITHM_PHRASES.length - 1 ? 'Replay From Step 01' : 'Advance To Next Decision'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

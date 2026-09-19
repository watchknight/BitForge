import React from 'react';
import { 
  Zap, 
  Cpu, 
  Eye, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onStartLearning: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartLearning }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          <span>Our Instructional Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
          Demystifying DSA for Visual Thinkers.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          University CS curriculums are packed with mathematical proofs and dry textbook pseudocode.
          Yet when students write code, what they actually need is a crystal-clear mental model of memory mutation.
        </p>
      </div>

      {/* The Problem & Our Answer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
            The Problem
          </div>
          <h3 className="text-lg font-bold text-white font-sans">
            Why Students Struggle
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Reading pseudocode like <code className="text-brand-300 bg-obsidian-950 px-1 py-0.5 rounded">curr.next = curr.next.next</code> in a static PDF fails to convey pointer reassignments in time and space.
            Students lose track of variables, misinterpret base cases, and fear technical interviews.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-brand-500/30 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-brand-300 font-semibold">
            The BitForge Philosophy
          </div>
          <h3 className="text-lg font-bold text-white font-sans">
            Visual Mutation & Real Analogies
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every topic in BitForge begins with a familiar real-world physical analogy, followed by a live algorithmic simulation.
            Students can pause, step backwards, inspect live variables, and see line-synced code in Python, C++, and JS simultaneously.
          </p>
        </div>
      </div>

      {/* Core Architectural Breakthrough */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-obsidian-900 to-obsidian-950 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 text-brand-400">
          <Terminal className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
            The Universal Simulation Engine
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Unlike tutorial websites that hack together ad-hoc CSS animations, BitForge is powered by a strictly decoupled simulation architecture:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800/80 text-xs space-y-1">
            <span className="font-mono text-brand-300 font-bold">1. Pure Step Generators</span>
            <p className="text-slate-400">
              Algorithms run genuinely on input data and produce deterministic step snapshots recording operations, pointers, and memory state.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800/80 text-xs space-y-1">
            <span className="font-mono text-brand-300 font-bold">2. Reusable Visual Renderers</span>
            <p className="text-slate-400">
              6 dedicated renderers (Array, LinkedList, Tree, Graph, DP Grid, and CallStack) render any step array with smooth transitions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800/80 text-xs space-y-1">
            <span className="font-mono text-brand-300 font-bold">3. Universal Playback Driver</span>
            <p className="text-slate-400">
              Zero code duplication across play, pause, step-back, scrub, speed delays, and randomized input generators.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800/80 text-xs space-y-1">
            <span className="font-mono text-brand-300 font-bold">4. Synced Code & Quizzes</span>
            <p className="text-slate-400">
              Every step activates the exact matching line in Python, C++, and JavaScript, backed by immediate-feedback concept quizzes.
            </p>
          </div>
        </div>
      </div>

      {/* Accessible & Color-Blind Safe */}
      <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-slate-800 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
          <Eye className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white font-sans">
            Accessibility & Color-Blind First
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Functional semantic roles never rely purely on color hue. Every highlight state is reinforced with high-contrast text labels, distinct borders, bouncing pointers, and iconography.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onStartLearning}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-sm shadow-xl shadow-brand-500/25 transition-all"
        >
          <span>Start Exploring BitForge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

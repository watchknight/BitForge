import React, { useState } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Code2, 
  Layers, 
  CheckCircle, 
  Zap, 
  Cpu, 
  GitMerge, 
  Share2, 
  ListOrdered,
  Shuffle,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineReveal, TextReveal } from '../components/motion/TextReveal';
import { ScrollSentenceBuilder } from '../components/motion/ScrollSentenceBuilder';
import { SectionBreather } from '../components/motion/SectionBreather';
import { TopicCardPreview } from '../components/topic/TopicCardPreview';
import { DriftingEmbers } from '../components/background/DriftingEmbers';
import { SpotlightCard } from '../components/motion/SpotlightCard';
import { ArchitecturalFrame } from '../components/motion/ArchitecturalFrame';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onStartLearning: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onSelectTopic,
}) => {
  // Hero mini-simulation state (interactive Bubble / Insertion step)
  const [heroArr, setHeroArr] = useState<number[]>([42, 18, 75, 29, 61, 14, 88]);
  const [heroComparing, setHeroComparing] = useState<[number, number]>([1, 2]);
  const [heroSorted, setHeroSorted] = useState<number[]>([5, 6]);
  const [hoveredFlagshipId, setHoveredFlagshipId] = useState<string | null>(null);
  const [activePreviewFlagshipId, setActivePreviewFlagshipId] = useState<string | null>(null);

  const randomizeHero = () => {
    soundEngine.playStepSound('swap', Math.random());
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 15);
    setHeroArr(arr);
    setHeroComparing([Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) + 1]);
  };


  const flagshipCards = [
    {
      id: 'merge-sort',
      title: 'Merge Sort',
      category: 'Sorting Algorithms',
      dataShape: 'array',
      desc: 'Divide arrays into microscopic subproblems, then merge them in linear O(N log N) beauty.',
      color: 'from-amber-500/20 to-brand-500/10 border-amber-500/30',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      icon: ListOrdered,
      complexity: 'O(N log N)',
      tier: 'Intermediate',
    },
    {
      id: 'singly-linked-list',
      title: 'Singly Linked List',
      category: 'Linear Structures',
      dataShape: 'linked-list',
      desc: 'Master pointer traversal, node allocations, and O(1) splices without losing the head.',
      color: 'from-steel-500/20 to-steel-700/10 border-steel-500/30',
      badgeColor: 'text-steel-300 bg-steel-950/60 border-steel-500/40',
      icon: GitMerge,
      complexity: 'O(1) / O(N)',
      tier: 'Beginner',
    },
    {
      id: 'binary-search-tree',
      title: 'Binary Search Tree',
      category: 'Trees & Hierarchies',
      dataShape: 'tree',
      desc: 'Halve the search space at every fork. Watch in-order traversal unfold in sorted order.',
      color: 'from-amber-500/20 to-brand-950/20 border-amber-500/30',
      badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/40',
      icon: Cpu,
      complexity: 'O(log N)',
      tier: 'Intermediate',
    },
    {
      id: 'breadth-first-search',
      title: 'Breadth-First Search',
      category: 'Graph Algorithms',
      dataShape: 'graph',
      desc: 'Ripples in a pond: inspect nodes layer by layer using a FIFO queue to guarantee shortest paths.',
      color: 'from-brand-500/20 to-amber-500/10 border-brand-500/30',
      badgeColor: 'text-brand-300 bg-brand-950/60 border-brand-500/40',
      icon: Share2,
      complexity: 'O(V + E)',
      tier: 'Intermediate',
    },
    {
      id: 'fibonacci-dp',
      title: 'Fibonacci DP Tabulation',
      category: 'Dynamic Programming',
      dataShape: 'grid',
      desc: 'Transform a monstrous 2^N recursion tree into a linear O(N) scratchpad table.',
      color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30',
      badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/40',
      icon: Layers,
      complexity: 'O(N) Tabular',
      tier: 'Beginner',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* Hero Section with Staggered Typography Reveal */}
      <section className="relative pt-10 md:pt-20 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto overflow-hidden">
        {/* Step 3: Atmospheric Forge Background (Soft Ember Glow + Film Grain + Drifting Sparks) */}
        <div className="absolute inset-0 forge-glow-hero pointer-events-none" />
        <div className="absolute inset-0 forge-grain opacity-80 pointer-events-none" />
        <DriftingEmbers density="sparse" speed="slow" />

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-obsidian-900/90 border border-slate-800 hover:border-slate-700 shadow-xl shadow-obsidian-950/60 backdrop-blur-md transition-all duration-300 group">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
              </span>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-brand-400 uppercase">
                ENGINE v2.0
              </span>
            </div>
            <span className="w-px h-3.5 bg-slate-800" />
            <span className="text-xs font-medium text-slate-300 tracking-tight group-hover:text-bone transition-colors">
              Interactive Data Structures & Algorithms Engine
            </span>
          </div>

          {/* Staggered Line Reveal Headline with Fluid CSS clamp() */}
          <LineReveal
            as="h1"
            lines={[
              <span className="block text-[clamp(2.1rem,6.5vw+0.5rem,5.5rem)] font-extrabold tracking-tight text-bone font-sans leading-[1.08] break-words hyphens-none">
                Stop memorizing code.
              </span>,
              <span className="block text-[clamp(2.1rem,6.5vw+0.5rem,5.5rem)] font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text text-transparent font-sans leading-[1.08] break-words hyphens-none">
                Watch data move.
              </span>
            ]}
            delay={0.1}
            lineDelay={0.18}
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Textbook pseudocode is lifeless. BitForge replaces static walls of text with live,
            interactive step-through simulations, plain-language narration, and synced multi-language code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={onStartLearning}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-sm sm:text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Interactive Roadmap</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onSelectTopic('merge-sort')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-obsidian-900/90 hover:bg-obsidian-850 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-sm sm:text-base transition-all"
            >
              <span>Try Merge Sort Flagship</span>
            </button>
          </motion.div>
        </div>

        {/* Live Mini-Simulation Hero Widget */}
        <div className="mt-14 max-w-3xl mx-auto bg-obsidian-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-steel-400/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                Live Simulation Engine Preview
              </span>
            </div>

            <button
              onClick={randomizeHero}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-950 border border-slate-800 text-xs font-mono text-brand-300 hover:text-white transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-brand-400" />
              <span>Randomize Array</span>
            </button>
          </div>

          {/* Interactive Bars visualizer */}
          <div className="h-36 flex items-end justify-center gap-3 px-4 pb-2 border-b border-slate-800/60">
            {heroArr.map((val, idx) => {
              const isComp = heroComparing.includes(idx);
              const isSorted = heroSorted.includes(idx);
              const heightPercent = Math.max(20, Math.round((val / 100) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full max-w-[50px]">
                  <span className="text-[11px] font-mono text-slate-400 font-bold mb-1">
                    {val}
                  </span>
                  <motion.div
                    layout
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isComp
                        ? 'bg-amber-400 shadow-lg shadow-amber-400/40'
                        : isSorted
                        ? 'bg-steel-400 shadow-lg shadow-steel-400/40'
                        : 'bg-[#333842] hover:bg-[#3f444e]'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#333842]" /> Unforged
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> In the Forge
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-steel-400" /> Tempered
              </span>
            </div>
            <span className="text-brand-300">
              Synced Step Engine &bull; Zero Lag
            </span>
          </div>
        </div>
      </section>

      {/* Progressive Sentence Assembly Section (Adapting Boon Global Scroll Technique) */}
      <ScrollSentenceBuilder />

      {/* Core Architectural Pillars Feature Grid */}
      <section className="max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-500/30 text-brand-300 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            <span>The BitForge Triad</span>
          </div>
          <h2 className="text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-bold text-white font-sans tracking-tight">
            Built for Pedagogical Clarity
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every screen follows our strict learning triad: Intuitive Analogy &rarr; Animated Simulation &rarr; Synced Multi-Language Code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard className="p-6 flex flex-col gap-3 shadow-lg" spotlightColor="rgba(245, 158, 11, 0.12)">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Relatable Analogies First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before seeing an array or pointer, grasp the real-world mental model: two decks of cards, a hallway of lockers, or ripples in a pond.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex flex-col gap-3 shadow-lg" spotlightColor="rgba(249, 115, 22, 0.12)">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Step Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scrub forwards, backwards, slow down, or pause. Highlighted states and pointer chips show exactly which elements are being compared or mutated.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex flex-col gap-3 shadow-lg" spotlightColor="rgba(56, 189, 248, 0.12)">
            <div className="w-10 h-10 rounded-xl bg-steel-500/20 text-steel-300 border border-steel-500/30 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Synced Multi-Language Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch line-by-line code execution in Python, C++, or JavaScript synchronized in real time with the visual animation.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* Flagship Archetypes Showcase Grid with Structured Credits & Micro-Previews */}
      <section className="max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-1">
              5 Foundational Data Shapes
            </div>
            <h2 className="text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-bold text-white font-sans tracking-tight">
              Flagship Simulations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Engineered with dedicated interactive renderers that power the entire curriculum.
            </p>
          </div>

          <button
            onClick={onStartLearning}
            className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start md:self-auto"
          >
            <span>View Full 11-Stage Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div 
          className="grid gap-6 justify-center"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          }}
        >
          {flagshipCards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredFlagshipId === card.id;
            const isPreviewActive = isHovered || activePreviewFlagshipId === card.id;

            return (
              <SpotlightCard
                key={card.id}
                onClick={() => onSelectTopic(card.id)}
                className="p-6 flex flex-col justify-between shadow-xl"
                spotlightColor="rgba(6, 182, 212, 0.14)"
              >
                <div 
                  className="space-y-3"
                  onMouseEnter={() => setHoveredFlagshipId(card.id)}
                  onMouseLeave={() => setHoveredFlagshipId(null)}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                      {card.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {card.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="p-2 rounded-xl bg-obsidian-950 border border-slate-800 text-brand-400 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-sans group-hover:text-brand-300 transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>

                  {/* Structured Credits Metadata Row (Inspired by dkton.at) */}
                  <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 rounded-lg bg-obsidian-950/80 border border-slate-800 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 text-[9px] uppercase">Archetype: </span>
                      <span className="text-slate-300 capitalize">{card.dataShape}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] uppercase">Worst: </span>
                      <span className="text-amber-300">{card.complexity}</span>
                    </div>
                  </div>

                  {/* Micro-Animation Snippet Preview with Touch Affordance */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="uppercase text-slate-500 tracking-wider">Preview</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreviewFlagshipId(activePreviewFlagshipId === card.id ? null : card.id);
                        }}
                        aria-label={activePreviewFlagshipId === card.id ? `Stop previewing ${card.title}` : `Preview ${card.title} animation`}
                        className={`px-2.5 py-1 min-h-[30px] rounded-md text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                          activePreviewFlagshipId === card.id
                            ? 'bg-brand-500 text-obsidian-950 font-bold border-brand-400 shadow-sm'
                            : 'bg-obsidian-950 text-slate-300 border-slate-800 hover:text-brand-300 hover:border-brand-500/30'
                        }`}
                      >
                        {activePreviewFlagshipId === card.id ? (
                          <>
                            <Pause className="w-2.5 h-2.5 fill-current" />
                            <span>Playing</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current text-brand-400" />
                            <span>Tap to Preview</span>
                          </>
                        )}
                      </button>
                    </div>
                    <TopicCardPreview type={card.dataShape} isHovered={isPreviewActive} />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-brand-400 group-hover:text-brand-300">
                  <span>Launch Simulation</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </SpotlightCard>
            );

          })}
        </div>
      </section>

      {/* Full-Bleed Section Breather (Cinematic Pacing Break Moment) */}
      <SectionBreather
        initialVariant="sorting"
        title="Partition Resonance"
        quote="Confidence in DSA comes when you realize that every complex algorithm is just simple steps repeated in disciplined rhythm."
        author="BitForge Instructional Philosophy"
        onExplore={onStartLearning}
      />

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-brand-950/40 border border-brand-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans">
            Ready to conquer your DSA fears?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Follow the game-like skill tree from Memory & Pointers through Sorting, Graphs, and Dynamic Programming.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartLearning}
              className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-sm shadow-xl shadow-brand-500/25 transition-all transform hover:scale-105"
            >
              Start Free on the Roadmap
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

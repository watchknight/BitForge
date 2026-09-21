import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Code2, 
  Layers, 
  CheckCircle, 
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
import { BitForgeLogo } from '../components/common/BitForgeLogo';
import { HeroSimulationStage } from '../components/home/HeroSimulationStage';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onStartLearning: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onSelectTopic,
}) => {
  const heroStageRef = useRef<HTMLDivElement>(null);
  const [hoveredFlagshipId, setHoveredFlagshipId] = useState<string | null>(null);
  const [activePreviewFlagshipId, setActivePreviewFlagshipId] = useState<string | null>(null);


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
      {/* Hero Section with Split Interactive Showcase */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto overflow-hidden">
        {/* Atmospheric Layers: Volumetric Ember Glow + Blueprint Coordinate Grid + Film Grain + Drifting Sparks */}
        <div className="absolute inset-0 forge-glow-hero pointer-events-none" />
        <div className="absolute inset-0 forge-blueprint-grid pointer-events-none opacity-60" />
        <div className="absolute inset-0 forge-grain opacity-80 pointer-events-none" />
        <DriftingEmbers density="sparse" speed="slow" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center relative z-10">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-5 xl:col-span-5 text-center lg:text-left space-y-5">
            {/* Dual-Pill Kicker Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-obsidian-900/90 border border-brand-500/30 hover:border-brand-500/50 shadow-lg shadow-brand-500/10 backdrop-blur-md transition-all duration-300 group cursor-default"
            >
              <BitForgeLogo className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-brand-400 uppercase">
                <span className="hidden sm:inline">THE VISUAL INTUITION ENGINE</span>
                <span className="sm:hidden">VISUAL INTUITION ENGINE</span>
              </span>
              <span className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase text-slate-300 shrink-0">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-400"></span>
                </span>
                <span>REAL-TIME LAB</span>
              </div>
            </motion.div>

            {/* Staggered Line Reveal Headline with Fluid CSS clamp() */}
            <LineReveal
              as="h1"
              lines={[
                <span className="block text-[clamp(2.1rem,4.2vw+0.5rem,3.8rem)] font-extrabold tracking-tight text-bone font-sans leading-[1.08] break-words hyphens-none">
                  Stop memorizing code.
                </span>,
                <span className="block text-[clamp(2.1rem,4.2vw+0.5rem,3.8rem)] font-extrabold tracking-tight forge-shimmer-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent font-sans leading-[1.08] break-words hyphens-none">
                  Watch data move.
                </span>
              ]}
              delay={0.1}
              lineDelay={0.18}
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Textbook pseudocode is lifeless. BitForge illuminates memory mutations, pointer hops, tree balance, and graph waves with live, step-through simulations and synchronized multi-language code.
            </motion.p>

            {/* Interactive CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1"
            >
              <button
                onClick={onStartLearning}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-obsidian-950 font-bold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Interactive Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTopic('merge-sort')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-obsidian-900/90 hover:bg-obsidian-850 text-slate-200 hover:text-white border border-slate-700/80 hover:border-brand-500/40 font-semibold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Try Merge Sort Flagship</span>
              </button>
            </motion.div>

            {/* Key Capabilities Marquee Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="pt-2 max-w-md mx-auto lg:mx-0"
            >
              {/* Desktop & Tablet: 4 Glass Badges */}
              <div className="hidden sm:grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-obsidian-950/60 border border-slate-800/80">
                  <span className="text-brand-400 font-bold">✦</span>
                  <span className="truncate">11 Curriculum Stages</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-obsidian-950/60 border border-slate-800/80">
                  <span className="text-amber-400 font-bold">✦</span>
                  <span className="truncate">50+ Visualized Algms</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-obsidian-950/60 border border-slate-800/80">
                  <span className="text-steel-300 font-bold">✦</span>
                  <span className="truncate">C++ • Python • Java • TS</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-obsidian-950/60 border border-slate-800/80">
                  <span className="text-emerald-400 font-bold">✦</span>
                  <span className="truncate">100% In-Memory Exec</span>
                </div>
              </div>

              {/* Mobile: Clean, compact 1-line ticker */}
              <div className="sm:hidden flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <span>11 Stages</span>
                <span className="text-slate-600">•</span>
                <span>50+ Algorithms</span>
                <span className="text-slate-600">•</span>
                <span>4 Languages</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: The Crown Jewel Live Interactive Stage */}
          <div ref={heroStageRef} className="lg:col-span-7 xl:col-span-7 relative">
            {/* Ambient Background Glow halo behind the stage */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/15 via-amber-500/10 to-steel-500/15 rounded-3xl blur-2xl -z-10 pointer-events-none opacity-80" />
            <HeroSimulationStage onSelectTopic={onSelectTopic} />
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

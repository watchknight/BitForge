import React, { useState } from 'react';
import { roadmapCategories } from '../data/roadmapData';
import { topicsData } from '../data/topicsData';
import { useProgress } from '../context/ProgressContext';
import { TopicStatus } from '../types/roadmap';
import { TopicCardPreview } from '../components/topic/TopicCardPreview';
import { SectionBreather } from '../components/motion/SectionBreather';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Filter, 
  Trophy, 
  Zap, 
  MapPin,
  Circle,
  PlayCircle,
  Award,
  ChevronDown,
  Play,
  Pause
} from 'lucide-react';

interface RoadmapPageProps {
  onSelectTopic: (topicId: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onSelectTopic }) => {
  const { progress, isTopicCompleted, getTopicProgress, getTopicStatus, setTopicStatus, getStatusCounts } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TopicStatus>('all');
  const [activeDropdownTopic, setActiveDropdownTopic] = useState<string | null>(null);
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);
  const [activePreviewTopicId, setActivePreviewTopicId] = useState<string | null>(null);

  // Calculate statistics
  let totalTopics = 0;
  let totalFlagships = 0;
  let masteredCount = 0;
  let practicingCount = 0;
  let notStartedCount = 0;

  roadmapCategories.forEach((cat) => {
    cat.topics.forEach((t) => {
      totalTopics++;
      if (t.isFlagship) totalFlagships++;
      const st = getTopicStatus(t.id);
      if (st === 'mastered') masteredCount++;
      else if (st === 'practicing') practicingCount++;
      else notStartedCount++;
    });
  });

  const percentComplete = totalTopics > 0 ? Math.round((masteredCount / totalTopics) * 100) : 0;

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-steel-500/20 text-steel-200 border border-steel-500/40 shadow-sm shadow-steel-500/15">
            <CheckCircle2 className="w-3 h-3 text-steel-400" />
            Mastered
          </span>
        );
      case 'practicing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Practicing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800/80 text-slate-400 border border-slate-700">
            <Circle className="w-2.5 h-2.5 text-slate-500" />
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-8 pb-24 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-brand-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>Interactive Curriculum & Mastery Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
            DSA Mastery Roadmap
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            A structured visual journey from asymptotic fundamentals to advanced graphs and dynamic programming. Track each algorithm as Not Started, Practicing, or Mastered.
          </p>

          {/* Progress Bar */}
          <div className="pt-2 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Curriculum Mastery</span>
              <span className="text-brand-300 font-bold">{percentComplete}%</span>
            </div>
            <div className="w-full h-2.5 bg-obsidian-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-steel-400 rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gamified Stats Summary */}
        <div className="flex items-center gap-3 sm:gap-4 bg-obsidian-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex flex-col items-center px-2">
            <span className="text-2xl font-mono font-bold text-steel-300">
              {masteredCount}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Mastered
            </span>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="flex flex-col items-center px-2">
            <span className="text-2xl font-mono font-bold text-amber-300">
              {practicingCount}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Practicing
            </span>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="flex flex-col items-center px-2">
            <span className="text-2xl font-mono font-bold text-brand-300">
              {progress.xp}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Total XP
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Step 3: Flex-1 Search Bar Filling Middle Space) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms (e.g. merge, avl, dijkstra)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400 font-sans transition-colors"
          />
        </div>

        {/* Status Filter Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-obsidian-950 rounded-xl border border-slate-800 shrink-0">
          {(['all', 'mastered', 'practicing', 'not-started'] as const).map((st) => {
            const isSelected = statusFilter === st;
            let activeStyle = 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/40 shadow-sm';
            if (st === 'mastered') {
              activeStyle = 'bg-steel-500/20 text-steel-200 font-bold border border-steel-500/40 shadow-sm';
            } else if (st === 'not-started') {
              activeStyle = 'bg-[#1a1c22] text-slate-300 font-bold border border-[#3d434f] shadow-sm';
            }
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  isSelected
                    ? activeStyle
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {st === 'all'
                  ? `All (${totalTopics})`
                  : st === 'mastered'
                  ? `Mastered (${masteredCount})`
                  : st === 'practicing'
                  ? `Practicing (${practicingCount})`
                  : `Not Started (${notStartedCount})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Stage Navigator: Quick horizontal jump bar for narrow screens */}
      <div className="flex sm:hidden flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="uppercase tracking-wider text-slate-500">Jump to Stage</span>
          <span className="text-brand-400">11 Stages</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar scroll-smooth">
          {roadmapCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const el = document.getElementById(`stage-${cat.order}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-brand-500/40 active:bg-brand-500/20 active:border-brand-500/60 transition-all flex items-center gap-1.5 min-h-[36px]"
            >
              <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-300 text-[10px] flex items-center justify-center font-bold">
                {cat.order}
              </span>
              <span className="whitespace-nowrap">{cat.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories & Stages */}
      <div className="space-y-8 relative">
        {roadmapCategories.map((category) => {
          const filteredTopics = category.topics.filter((t) => {
            const status = getTopicStatus(t.id);
            if (statusFilter !== 'all' && status !== statusFilter) return false;
            if (
              searchQuery &&
              !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !category.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return false;
            }
            return true;
          });

          if (filteredTopics.length === 0) return null;

          return (
            <div
              key={category.id}
              id={`stage-${category.order}`}
              className="scroll-mt-24 bg-obsidian-900/60 border border-slate-800/90 rounded-2xl p-4 sm:p-6 space-y-4 transition-all hover:border-slate-700/80"
            >
              {/* Category Header with Stage Milestone Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-500/15 border border-brand-500/40 text-brand-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 shadow-sm shadow-brand-500/10">
                    {category.order}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                      {category.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center pl-10 sm:pl-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-obsidian-950 border border-slate-800 text-slate-400">
                    Stage {category.order} of 11
                  </span>
                  <span className="text-[11px] font-mono text-brand-400/80">
                    {category.topics.length} topics
                  </span>
                </div>
              </div>

              {category.id === 'sorting' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30">
                  <div className="flex items-center gap-2.5 text-xs text-amber-200">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <span>
                      <strong className="text-white">Sorting Race Mode:</strong> Pick 2–3 algorithms and benchmark them side-by-side with live comparison & swap counters!
                    </span>
                  </div>
                  <button
                    onClick={() => { window.location.hash = 'race'; }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all flex-shrink-0"
                  >
                    <span>Launch Race Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Adaptive Topics Grid (Step 2: Auto-fit & Balanced Remainder Margin) */}
              <div 
                className="grid gap-3.5"
                style={{
                  gridTemplateColumns: filteredTopics.length === 1
                    ? 'minmax(min(100%, 320px), 560px)'
                    : filteredTopics.length === 2
                    ? 'repeat(auto-fit, minmax(min(100%, 340px), 640px))'
                    : 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                  justifyContent: filteredTopics.length <= 2 ? 'center' : 'stretch',
                }}
              >
                {filteredTopics.map((topicRef) => {
                  const status = getTopicStatus(topicRef.id);
                  const isDone = status === 'mastered';
                  const userProg = getTopicProgress(topicRef.id);
                  const isDropdownOpen = activeDropdownTopic === topicRef.id;
                  const meta = topicsData[topicRef.id];
                  const difficulty = meta?.difficulty || 'Intermediate';
                  const archetype = meta?.dataStructureType || 'array';
                  const worstTime = meta?.complexity?.worstTime || 'O(N)';
                  const isHovered = hoveredTopicId === topicRef.id;
                  const isPreviewActive = isHovered || activePreviewTopicId === topicRef.id;

                  return (
                    <div
                      key={topicRef.id}
                      onClick={() => onSelectTopic(topicRef.id)}
                      onMouseEnter={() => setHoveredTopicId(topicRef.id)}
                      onMouseLeave={() => setHoveredTopicId(null)}
                      className={`group p-4 rounded-xl bg-obsidian-950 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-md relative ${
                        isDone
                          ? 'border-steel-500/40 hover:border-steel-400 hover:shadow-steel-500/10'
                          : status === 'practicing'
                          ? 'border-brand-500/40 hover:border-brand-400 hover:shadow-brand-500/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Top Bar with Status Badge & Manual Dropdown Switch */}
                        <div className="flex items-center justify-between">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownTopic(isDropdownOpen ? null : topicRef.id);
                              }}
                              className="focus:outline-none"
                              title="Click to change mastery status"
                            >
                              {getStatusBadge(status)}
                            </button>

                            {/* Status Changer Popup */}
                            {isDropdownOpen && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                className="absolute left-0 top-full mt-1.5 w-40 bg-obsidian-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-40 space-y-1"
                              >
                                <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                                  Set Status
                                </div>
                                {(['not-started', 'practicing', 'mastered'] as TopicStatus[]).map((opt) => (
                                  <button
                                    key={opt}
                                    data-testid={`set-status-${opt}`}
                                    onClick={() => {
                                      setTopicStatus(topicRef.id, opt);
                                      setActiveDropdownTopic(null);
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors flex items-center justify-between ${
                                      status === opt
                                        ? 'bg-brand-500/20 text-brand-300 font-bold'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                  >
                                    <span>{opt.replace('-', ' ')}</span>
                                    {status === opt && <CheckCircle2 className="w-3 h-3 text-brand-400" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{topicRef.estimatedMinutes}m</span>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-white font-sans group-hover:text-brand-300 transition-colors line-clamp-1">
                          {topicRef.title}
                        </h3>

                        {/* Structured Credits Metadata Row (Inspired by dkton.at) */}
                        <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 rounded-lg bg-obsidian-900/80 border border-slate-800/80 text-[10px] font-mono">
                          <div>
                            <div className="text-slate-500 uppercase tracking-wider text-[9px]">Shape</div>
                            <div className="text-slate-300 capitalize truncate">{archetype}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 uppercase tracking-wider text-[9px]">Tier</div>
                            <div className="text-brand-300 truncate">{difficulty}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 uppercase tracking-wider text-[9px]">Worst</div>
                            <div className="text-amber-300 truncate">{worstTime}</div>
                          </div>
                        </div>

                        {/* Simulation Snippet Micro-Preview with Touch & Hover Preview Affordance */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span className="text-[10px] uppercase text-slate-500 tracking-wider">Preview</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePreviewTopicId(activePreviewTopicId === topicRef.id ? null : topicRef.id);
                              }}
                              aria-label={activePreviewTopicId === topicRef.id ? `Stop previewing ${topicRef.title}` : `Preview ${topicRef.title} animation`}
                              className={`px-2.5 py-1 min-h-[32px] rounded-md text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                                activePreviewTopicId === topicRef.id
                                  ? 'bg-brand-500 text-obsidian-950 font-bold border-brand-400 shadow-sm'
                                  : 'bg-obsidian-900/90 text-slate-300 border-slate-700/80 hover:text-brand-300 hover:border-brand-500/30'
                              }`}
                            >
                              {activePreviewTopicId === topicRef.id ? (
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
                          <TopicCardPreview type={archetype} isHovered={isPreviewActive} />
                        </div>

                        {userProg?.quizPassed && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-steel-300">
                            <Trophy className="w-3 h-3 text-steel-400" />
                            <span>Quiz Passed ({userProg.quizScore}/3)</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-brand-400 group-hover:text-brand-300">
                        <span>{isDone ? 'Review Simulation' : 'Launch Simulation'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Bleed Pacing Break Moment (Inspired by dkton.at / awwwards showcase) */}
      <div className="pt-8">
        <SectionBreather
          initialVariant="tree"
          title="Tree Equilibrium"
          quote="The human mind learns structures through movement, not formulas. Once you see the tree rebalance itself, logarithmic time is intuitive forever."
          author="BitForge Pedagogical Framework"
          onExplore={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          showEmbers={false}
        />
      </div>
    </div>
  );
};

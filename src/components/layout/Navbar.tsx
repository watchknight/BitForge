import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Map, 
  Table, 
  Info, 
  Code2, 
  Boxes,
  ChevronDown, 
  Menu,
  X,
  Search,
  Trophy,
  GraduationCap,
  Eye,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { BitForgeLogo } from '../common/BitForgeLogo';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SoundEqualizerButton } from '../common/SoundEqualizerButton';
import { soundEngine } from '../../services/soundEngine';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, topicId?: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { progress } = useProgress();
  const { reducedMotion, toggleReducedMotion } = useAccessibility();
  const { theme, toggleTheme } = useTheme();
  const [topicsDropdownOpen, setTopicsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const flagships = [
    { id: 'merge-sort', label: 'Merge Sort', type: 'Array' },
    { id: 'singly-linked-list', label: 'Singly Linked List', type: 'Linked List' },
    { id: 'binary-search-tree', label: 'Binary Search Tree', type: 'Tree' },
    { id: 'breadth-first-search', label: 'Breadth-First Search', type: 'Graph' },
    { id: 'fibonacci-dp', label: 'Fibonacci DP', type: 'Grid / DP' },
  ];

  const handleNav = (view: string, topicId?: string) => {
    soundEngine.playClickBeep();
    onNavigate(view, topicId);
  };

  // Close mobile navigation drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-40 bg-obsidian-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-obsidian-950 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
            <BitForgeLogo className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent font-sans">
              BitForge
            </span>
            <span className="text-[10px] font-mono -mt-1 text-brand-400 tracking-wider">
              INTERACTIVE DSA
            </span>
          </div>
        </div>

        {/* Global Search Button (Desktop & Tablet) */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner max-w-xs w-48 md:w-56"
            title="Search DSA topics (Ctrl+K or /)"
            aria-label="Search all topics"
          >
            <Search className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            <span className="flex-1 text-left truncate">Search topics...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-950 border border-slate-800 text-slate-500">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNav('roadmap')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'roadmap'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-brand-400" />
            Roadmap
          </button>

          <button
            onClick={() => handleNav('race')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'race'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Race Mode
          </button>

          <button
            onClick={() => handleNav('quiz-hub')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'quiz-hub'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
            Quiz Hub
          </button>

          {/* Topics Dropdown */}
          <div className="relative">
            <button
              onClick={() => setTopicsDropdownOpen(!topicsDropdownOpen)}
              onBlur={() => setTimeout(() => setTopicsDropdownOpen(false), 200)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'topic'
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-brand-400" />
              Flagships
              <ChevronDown className={`w-3 h-3 transition-transform ${topicsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {topicsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-obsidian-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn">
                <div className="text-[10px] font-mono text-slate-500 px-3 py-1 uppercase tracking-wider">
                  5 Core DSA Archetypes
                </div>
                {flagships.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      handleNav('topic', f.id);
                      setTopicsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-brand-300">
                      {f.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-obsidian-950 border border-slate-800">
                      {f.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('big-o')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'big-o'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-brand-400" />
            Big-O Sheet
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'about'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-brand-400" />
            About
          </button>
        </div>

        {/* Right: Audio Equalizer, Accessibility Toggle & Gamified Stats */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Audio Visualizer Equalizer Button (dkton.at style) */}
          <SoundEqualizerButton />

          {/* Reduced Motion Toggle Button */}
          <button
            onClick={toggleReducedMotion}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl border transition-all ${
              reducedMotion
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={reducedMotion ? 'Reduced Motion is ON (Click to disable)' : 'Enable Reduced Motion mode'}
            aria-label={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
          >
            {reducedMotion ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all group"
            title={theme === 'dark' ? 'Switch to Light Mode ("The Forge in Daylight")' : 'Switch to Dark Mode ("Midnight Forge")'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-brand-400 transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          {/* Search trigger on small mobile */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Search topics"
              aria-label="Search topics"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-obsidian-900 rounded-full border border-slate-800 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-slate-200 font-bold">{progress.streakDays}</span>
            <span className="text-slate-500 hidden xl:inline">d</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-brand-950/60 rounded-full border border-brand-500/30 text-xs font-mono text-brand-300">
            <Code2 className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-bold">{progress.xp}</span>
            <span className="text-brand-400/80 font-sans hidden sm:inline text-[11px]">XP</span>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 bg-obsidian-950/70 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
            aria-hidden="true"
          />
          <div 
            id="mobile-nav-menu"
            className="lg:hidden relative z-40 bg-obsidian-900/98 backdrop-blur-xl border-b border-slate-800 px-4 py-3 space-y-2 animate-fadeIn max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            {/* Mobile Stats Pill Header */}
            <div className="flex sm:hidden items-center justify-between gap-2 p-2.5 bg-obsidian-950 rounded-xl border border-slate-800 text-xs font-mono mb-2 shadow-inner">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="font-bold">{progress.streakDays} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-300">
                <Code2 className="w-3.5 h-3.5 text-brand-400" />
                <span className="font-bold">{progress.xp} XP</span>
              </div>
            </div>

            {onOpenSearch && (
              <button
                onClick={() => {
                  onOpenSearch();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs text-brand-300 bg-obsidian-950 border border-slate-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand-400" />
                  Search All Topics...
                </span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-mono bg-obsidian-950 border border-slate-800 flex items-center justify-between transition-colors hover:border-slate-700"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <span className="flex items-center gap-2 text-slate-200">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-400" />}
                <span>Theme: {theme === 'dark' ? 'Midnight Forge (Dark)' : 'Forge in Daylight (Light)'}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                Toggle
              </span>
            </button>

            <button
              onClick={() => {
                onNavigate('roadmap');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                currentView === 'roadmap'
                  ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4 text-brand-400" />
              Roadmap & Curriculum
            </button>

            <button
              onClick={() => {
                onNavigate('race');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                currentView === 'race'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-amber-300 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Sorting Race Mode
            </button>

            <button
              onClick={() => {
                onNavigate('quiz-hub');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                currentView === 'quiz-hub'
                  ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-brand-300 hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-brand-400" />
              Quiz Hub (100+ Questions)
            </button>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 px-3 uppercase mb-1">
                Flagship Simulations
              </div>
              {flagships.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onNavigate('topic', f.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 min-h-[40px] rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-brand-300 flex items-center justify-between transition-colors"
                >
                  <span>{f.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{f.type}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onNavigate('big-o');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                currentView === 'big-o'
                  ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Table className="w-4 h-4 text-brand-400" />
              Big-O Cheat Sheet
            </button>

            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                currentView === 'about'
                  ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4 text-brand-400" />
              About BitForge
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

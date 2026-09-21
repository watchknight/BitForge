import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ExperienceIntroGate } from './components/motion/ExperienceIntroGate';
import { soundEngine } from './services/soundEngine';
import { BitForgeLogo } from './components/common/BitForgeLogo';

// Lazy load pages for high performance and fast initial load
const RoadmapPage = lazy(() =>
  import('./pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage }))
);
const TopicPage = lazy(() =>
  import('./pages/TopicPage').then((m) => ({ default: m.TopicPage }))
);
const RaceModePage = lazy(() =>
  import('./pages/RaceModePage').then((m) => ({ default: m.RaceModePage }))
);
const QuizHubPage = lazy(() =>
  import('./pages/QuizHubPage').then((m) => ({ default: m.QuizHubPage }))
);
const BigOCheatSheetPage = lazy(() =>
  import('./pages/BigOCheatSheetPage').then((m) => ({ default: m.BigOCheatSheetPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

type ViewType = 'landing' | 'roadmap' | 'topic' | 'race' | 'quiz-hub' | 'big-o' | 'about';

// Sleek loading fallback
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
    <div className="relative mb-4">
      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 animate-pulse">
        <BitForgeLogo className="w-7 h-7 animate-bounce" />
      </div>
      <div className="absolute inset-0 rounded-2xl border-2 border-brand-400/40 border-t-transparent animate-spin" />
    </div>
    <span className="text-sm font-mono text-slate-400 tracking-wider">
      Forging simulation environment...
    </span>
  </div>
);

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash.startsWith('topic/')) return 'topic';
      if (['roadmap', 'race', 'quiz-hub', 'big-o', 'about'].includes(hash)) return hash as ViewType;
    }
    return 'landing';
  });
  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash.startsWith('topic/')) {
        const tid = hash.replace('topic/', '').trim();
        if (tid) return tid;
      }
    }
    return 'merge-sort';
  });
  const [searchOpen, setSearchOpen] = useState(false);

  // Hash-based URL sync for easy sharing and navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setCurrentView('landing');
      } else if (hash.startsWith('topic/')) {
        const tid = hash.replace('topic/', '');
        setActiveTopicId(tid);
        setCurrentView('topic');
      } else if (['roadmap', 'race', 'quiz-hub', 'big-o', 'about'].includes(hash)) {
        setCurrentView(hash as ViewType);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global hotkeys (Cmd+K / Ctrl+K and /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // '/' when not in input
      else if (e.key === '/') {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        setSearchOpen(true);
      }
      // 'm' or 'M' for sound toggle when not in input
      else if ((e.key === 'm' || e.key === 'M') && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        soundEngine.toggleMute();
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (view: string, topicId?: string) => {
    if (view === 'topic' && topicId) {
      setActiveTopicId(topicId);
      setCurrentView('topic');
      window.location.hash = `topic/${topicId}`;
    } else if (view === 'landing') {
      setCurrentView('landing');
      window.location.hash = '';
    } else {
      setCurrentView(view as ViewType);
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <ProgressProvider>
          <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200 relative overflow-x-hidden transition-colors duration-200">
          {/* Universal Tactile Film-Grain Overlay */}
          <div className="fixed inset-0 forge-grain opacity-60 pointer-events-none z-0" aria-hidden="true" />

          {/* Reduced Ambient Ember Glow for Content-Dense Pages (Topic, Roadmap, Quiz Hub, Race, Big-O, About) */}
          {currentView !== 'landing' && (
            <div className="fixed inset-0 forge-glow-content pointer-events-none z-0" aria-hidden="true" />
          )}

          <div className="relative z-10 flex flex-col flex-1">
            <Navbar 
              currentView={currentView} 
              onNavigate={navigateTo} 
              onOpenSearch={() => setSearchOpen(true)}
            />

            <main className="flex-1">
            {currentView === 'landing' && (
              <LandingPage
                onStartLearning={() => navigateTo('roadmap')}
                onSelectTopic={(tid) => navigateTo('topic', tid)}
              />
            )}

            <Suspense fallback={<PageLoadingFallback />}>
              {currentView === 'roadmap' && (
                <RoadmapPage
                  onSelectTopic={(tid) => navigateTo('topic', tid)}
                />
              )}

              {currentView === 'topic' && (
                <TopicPage
                  topicId={activeTopicId}
                  onBackToRoadmap={() => navigateTo('roadmap')}
                  onNavigateTopic={(tid) => navigateTo('topic', tid)}
                />
              )}

              {currentView === 'race' && (
                <RaceModePage
                  onSelectTopic={(tid) => navigateTo('topic', tid)}
                />
              )}

              {currentView === 'quiz-hub' && (
                <QuizHubPage
                  onSelectTopic={(tid) => navigateTo('topic', tid)}
                  onGoToRoadmap={() => navigateTo('roadmap')}
                />
              )}

              {currentView === 'big-o' && (
                <BigOCheatSheetPage
                  onSelectTopic={(tid) => navigateTo('topic', tid)}
                />
              )}

              {currentView === 'about' && (
                <AboutPage
                  onStartLearning={() => navigateTo('roadmap')}
                />
              )}
            </Suspense>
          </main>

          <Footer onNavigate={navigateTo} />
          </div>

          {/* Cinematic Experience Intro Gate (dkton.at style) */}
          <ExperienceIntroGate />

          {/* Global Search Dialog Modal */}
          <GlobalSearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelectTopic={(tid) => navigateTo('topic', tid)}
          />
        </div>

      </ProgressProvider>
    </AccessibilityProvider>
  </ThemeProvider>
  );
};

export default App;

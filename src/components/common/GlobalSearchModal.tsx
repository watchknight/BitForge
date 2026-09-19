import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Layers, 
  CornerDownLeft,
  BookOpen
} from 'lucide-react';
import { topicsData } from '../../data/topicsData';
import { useProgress } from '../../context/ProgressContext';
import { TopicStatus } from '../../types/roadmap';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const { getTopicStatus } = useProgress();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const topicsList = useMemo(() => Object.values(topicsData), []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    topicsList.forEach((t) => cats.add(t.categoryName));
    return ['all', ...Array.from(cats)];
  }, [topicsList]);

  // Filter topics based on search query and category
  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topicsList.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'all' || topic.categoryName === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.subtitle.toLowerCase().includes(q) ||
        topic.categoryName.toLowerCase().includes(q) ||
        topic.difficulty.toLowerCase().includes(q) ||
        topic.id.toLowerCase().includes(q)
      );
    });
  }, [topicsList, query, selectedCategory]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Keyboard navigation within the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTopics.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : Math.max(0, filteredTopics.length - 1)
        );
      } else if (e.key === 'Enter' && filteredTopics.length > 0) {
        e.preventDefault();
        const selected = filteredTopics[selectedIndex];
        if (selected) {
          onSelectTopic(selected.id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTopics, selectedIndex, onClose, onSelectTopic]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const renderStatusBadge = (status: TopicStatus) => {
    if (status === 'mastered') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Mastered
        </span>
      );
    }
    if (status === 'practicing') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
          <Clock className="w-3 h-3 text-amber-400" />
          Practicing
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-400">
        <Circle className="w-2.5 h-2.5 text-slate-500" />
        Not Started
      </span>
    );
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      case 'intermediate':
        return 'text-brand-400 border-brand-500/30 bg-brand-950/40';
      case 'advanced':
        return 'text-purple-400 border-purple-500/30 bg-purple-950/40';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800/40';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Topic Search"
    >
      <div 
        className="w-full max-w-2xl bg-obsidian-900 border border-slate-800 rounded-2xl shadow-2xl shadow-obsidian-950/90 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-brand-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms, data structures, categories (e.g. Quick Sort, Trie, DP)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
            aria-label="Search topics"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/70 overflow-x-auto no-scrollbar bg-obsidian-950/50">
          <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition-all capitalize font-medium ${
                  isSelected
                    ? 'bg-brand-500 text-obsidian-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat === 'all' ? 'All Topics' : cat}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40"
        >
          {filteredTopics.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium text-sm">No matching DSA topics found</p>
              <p className="text-slate-500 text-xs mt-1">
                Try searching for a different keyword or select "All Topics" filter.
              </p>
            </div>
          ) : (
            filteredTopics.map((topic, index) => {
              const isSelected = index === selectedIndex;
              const status = getTopicStatus(topic.id);

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 text-white border border-brand-500/30 shadow-md shadow-brand-500/5'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 p-2 rounded-lg ${
                      isSelected ? 'bg-brand-500/20 text-brand-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-100 group-hover:text-brand-300 truncate">
                          {topic.title}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-obsidian-950 px-2 py-0.5 rounded border border-slate-800">
                          {topic.categoryName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {topic.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    {renderStatusBadge(status)}
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isSelected ? 'text-brand-400 bg-brand-500/10' : 'text-slate-600'
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-obsidian-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center">
                <CornerDownLeft className="w-3 h-3" />
              </kbd>
              Open
            </span>
          </div>
          <div>
            Showing <span className="text-slate-300 font-semibold">{filteredTopics.length}</span> of {topicsList.length} topics
          </div>
        </div>
      </div>
    </div>
  );
};

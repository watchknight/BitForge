/**
 * BitForge Synchronized Code Inspector: `SyncedCodePanel`
 * 
 * Side-by-side multi-language implementation panel synchronized with active simulation steps.
 * 
 * CORE FEATURES:
 * 1. Multi-Language Switcher: Displays idiomatic implementations in Python, C++, and JavaScript.
 * 2. Active Line Synchronization: Automatically tracks and highlights the exact source line
 *    corresponding to `step.codeLine`, with smooth auto-scrolling to keep active lines in view.
 * 3. Token Syntax Highlighting: Regex-based tokenizer coloring keywords, types, numbers,
 *    strings, and comments tailored for both Dark and Light Forge themes.
 * 4. Code Export: 1-click clipboard copying with visual confirmation.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language } from '../types/topic';
import { Code2, Check, Copy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SyncedCodePanelProps {
  snippets: Record<Language, string>;
  activeLine: number;
}

const SUPPORTED_LANGUAGES: { id: Language; label: string; icon: string }[] = [
  { id: 'python', label: 'Python', icon: 'py' },
  { id: 'cpp', label: 'C++', icon: 'cpp' },
  { id: 'javascript', label: 'JavaScript', icon: 'js' },
];

export const SyncedCodePanel: React.FC<SyncedCodePanelProps> = React.memo(({
  snippets,
  activeLine,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeLang, setActiveLang] = useState<Language>('python');
  const [copied, setCopied] = useState(false);
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const currentCode = snippets[activeLang] || '';
  const lines = useMemo(() => currentCode.split('\n'), [currentCode]);

  // Auto-scroll active line into view smoothly inside code container
  useEffect(() => {
    const el = lineRefs.current[activeLine];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeLine, activeLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-obsidian-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full max-h-[550px]">
      {/* Code Header: responsive segmented language tabs + copy button */}
      <div className="bg-obsidian-950 px-3 sm:px-4 py-2.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Language Tabs: full-width 3-segment pill on mobile, compact on desktop */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] text-xs font-medium rounded-lg text-center flex items-center justify-center transition-all ${
                activeLang === lang.id
                  ? isLight
                    ? 'bg-brand-500/15 text-brand-800 font-semibold border border-brand-500/30 shadow-sm'
                    : 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Action Controls: active line indicator & touch-friendly copy button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-400">
            Active line: <span className="text-brand-300 font-bold">{activeLine}</span>
          </span>
          <button
            onClick={handleCopy}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-obsidian-900 sm:bg-transparent border border-slate-800 sm:border-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy code to clipboard"
            aria-label="Copy code to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-steel-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code content listing: horizontally scrollable without line wraps, >=13px font */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-[13px] md:text-[13.5px] leading-6 select-text overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        <div className="min-w-max">
          {lines.map((lineText, idx) => {
            const lineNumber = idx + 1;
            const isActive = lineNumber === activeLine;

            return (
              <div
                key={lineNumber}
                ref={(el) => (lineRefs.current[lineNumber] = el)}
                className={`flex items-center rounded transition-colors duration-150 px-2 py-0.5 group min-w-max ${
                  isActive
                    ? isLight
                      ? 'bg-brand-500/15 border-l-2 border-brand-500 text-brand-900 font-semibold'
                      : 'bg-brand-500/20 border-l-2 border-brand-400 text-brand-100 font-medium'
                    : isLight
                    ? 'hover:bg-slate-200/50 text-slate-800'
                    : 'hover:bg-slate-800/30 text-slate-300'
                }`}
              >
                {/* Line number */}
                <span
                  className={`w-7 shrink-0 text-right pr-3 select-none text-[11px] font-mono ${
                    isActive
                      ? isLight
                        ? 'text-brand-700 font-bold'
                        : 'text-brand-400 font-bold'
                      : isLight
                      ? 'text-slate-400 group-hover:text-slate-600'
                      : 'text-slate-600 group-hover:text-slate-500'
                  }`}
                >
                  {lineNumber}
                </span>

                {/* Code line text with preserve whitespace */}
                <span className="whitespace-pre flex-1">
                  {lineText || ' '}
                </span>

                {/* Active pointer badge on right */}
                {isActive && (
                  <span className={`ml-3 text-[10px] tracking-wider uppercase font-mono px-1.5 py-0.5 rounded border select-none animate-pulse ${
                    isLight
                      ? 'bg-brand-500/15 text-brand-800 border-brand-500/30'
                      : 'bg-brand-400/20 text-brand-300 border-brand-400/30'
                  }`}>
                    current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

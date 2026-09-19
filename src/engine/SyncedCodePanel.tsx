import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types/topic';
import { Code2, Check, Copy } from 'lucide-react';

interface SyncedCodePanelProps {
  snippets: Record<Language, string>;
  activeLine: number;
}

export const SyncedCodePanel: React.FC<SyncedCodePanelProps> = ({
  snippets,
  activeLine,
}) => {
  const [activeLang, setActiveLang] = useState<Language>('python');
  const [copied, setCopied] = useState(false);
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const currentCode = snippets[activeLang] || '';
  const lines = currentCode.split('\n');

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

  const languages: { id: Language; label: string; icon: string }[] = [
    { id: 'python', label: 'Python', icon: 'py' },
    { id: 'cpp', label: 'C++', icon: 'cpp' },
    { id: 'javascript', label: 'JavaScript', icon: 'js' },
  ];

  return (
    <div className="bg-obsidian-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full max-h-[550px]">
      {/* Code Header with language tabs and copy button */}
      <div className="bg-obsidian-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-obsidian-900 p-1 rounded-lg border border-slate-800/80">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeLang === lang.id
                  ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
            Active line: <span className="text-brand-300 font-bold">{activeLine}</span>
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code content listing */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-xs md:text-[13px] leading-6 select-text">
        {lines.map((lineText, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={lineNumber}
              ref={(el) => (lineRefs.current[lineNumber] = el)}
              className={`flex items-center rounded transition-colors duration-150 px-2 py-0.5 group ${
                isActive
                  ? 'bg-brand-500/20 border-l-2 border-brand-400 text-brand-100 font-medium'
                  : 'hover:bg-slate-800/30 text-slate-300'
              }`}
            >
              {/* Line number */}
              <span
                className={`w-7 shrink-0 text-right pr-3 select-none text-[11px] font-mono ${
                  isActive ? 'text-brand-400 font-bold' : 'text-slate-600 group-hover:text-slate-500'
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
                <span className="ml-2 text-[10px] tracking-wider uppercase font-mono px-1.5 py-0.2 rounded bg-brand-400/20 text-brand-300 border border-brand-400/30 select-none animate-pulse">
                  current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

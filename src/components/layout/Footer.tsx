import React from 'react';
import { Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';
import { BitForgeLogo } from '../common/BitForgeLogo';

interface FooterProps {
  onNavigate: (view: string, topicId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-obsidian-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl 2xl:max-w-9xl 3xl:max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-obsidian-950 shadow-sm shadow-brand-500/20">
                <BitForgeLogo className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-base font-sans">
                BitForge
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An interactive visual simulation platform engineering deep intuition for university computer science students.
            </p>
            <div className="text-[11px] font-mono text-brand-400 flex items-center gap-1.5 pt-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Universal Simulation Engine v1.0</span>
            </div>
          </div>

          {/* Col 2: Flagship topics */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
              Flagship Simulations
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('topic', 'merge-sort')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Merge Sort (Array)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('topic', 'singly-linked-list')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Singly Linked List (Pointers)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('topic', 'binary-search-tree')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Binary Search Tree (Tree)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('topic', 'breadth-first-search')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Breadth-First Search (Graph)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('topic', 'fibonacci-dp')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Fibonacci (DP Tabulation)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Pedagogy */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
              Learning Architecture
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Visual 11-Stage Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('race')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Sorting Race Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz-hub')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Curriculum Quiz Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('big-o')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Big-O Complexity Cheat Sheet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-brand-300 transition-colors"
                >
                  Instructional Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Openness */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
              Quality Commitment
            </h4>
            <div className="p-3 rounded-lg bg-obsidian-900 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-300 font-medium">Algorithmic Precision</p>
              <p className="text-[11px] text-slate-500 leading-normal">
                Every animation executes genuine algorithmic operations step-by-step. Never faked or scripted.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>&copy; {new Date().getFullYear()} BitForge. Designed for Visual CS Learners.</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for computer science education
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

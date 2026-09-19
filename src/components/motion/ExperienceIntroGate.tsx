import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, Zap } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { useAccessibility } from '../../context/AccessibilityContext';

interface ExperienceIntroGateProps {
  onEnter?: () => void;
}

export const ExperienceIntroGate: React.FC<ExperienceIntroGateProps> = ({ onEnter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    // Check if user has already entered in this session
    const hasEntered = sessionStorage.getItem('bitforge_experience_entered');
    if (!hasEntered) {
      setIsOpen(true);
    }
  }, []);

  const handleEnterWithSound = () => {
    soundEngine.setMuted(false);
    soundEngine.playSuccessChime();
    sessionStorage.setItem('bitforge_experience_entered', 'true');
    setIsOpen(false);
    if (onEnter) onEnter();
  };

  const handleEnterSilently = () => {
    soundEngine.setMuted(true);
    sessionStorage.setItem('bitforge_experience_entered', 'true');
    setIsOpen(false);
    if (onEnter) onEnter();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="experience-gate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian-950/98 backdrop-blur-2xl text-slate-100 p-6 overflow-hidden select-none"
      >
        {/* Subtle Background Radial Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Skip Button (Top Right) */}
        <button
          onClick={handleEnterSilently}
          className="absolute top-8 right-8 text-xs font-mono tracking-widest text-slate-500 hover:text-slate-200 transition-colors uppercase py-1 px-3 rounded-lg border border-slate-800 hover:border-slate-700"
        >
          [ Skip Intro ]
        </button>

        <div className="max-w-xl w-full text-center space-y-8 relative z-10">
          {/* Brand Monospace Kicker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-900 border border-slate-800 text-[11px] font-mono uppercase tracking-widest text-brand-400"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>BitForge Computational Lab</span>
          </motion.div>

          {/* Large Hero Title (Inspired by dkton.at & Boon) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase font-sans">
              BitForge
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase">
              Data Structures & Algorithms in Pure Motion
            </p>
          </motion.div>

          {/* Narrative Thesis */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed"
          >
            An interactive pedagogical environment designed with live step physics,
            invariant tracking, and algorithmic sonification.
          </motion.p>

          {/* Interactive Gate Buttons with Corner Crosshairs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {/* Enter with Sound Button */}
            <button
              onClick={handleEnterWithSound}
              className="relative group w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-obsidian-950 font-bold text-sm tracking-wide shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2.5"
            >
              {/* Corner crosshairs */}
              <span className="absolute -top-1 -left-1 font-mono text-[10px] text-brand-300 pointer-events-none select-none">
                ┌
              </span>
              <span className="absolute -top-1 -right-1 font-mono text-[10px] text-brand-300 pointer-events-none select-none">
                ┐
              </span>
              <span className="absolute -bottom-1 -left-1 font-mono text-[10px] text-brand-300 pointer-events-none select-none">
                └
              </span>
              <span className="absolute -bottom-1 -right-1 font-mono text-[10px] text-brand-300 pointer-events-none select-none">
                ┘
              </span>

              <Volume2 className="w-4 h-4 fill-current" />
              <span>Enter Experience // With Sound</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Enter Silently Button */}
            <button
              onClick={handleEnterSilently}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>Enter Muted</span>
            </button>
          </motion.div>

          <div className="text-[10px] font-mono text-slate-600 tracking-wider">
            [ KEYBOARD: ESC TO SKIP • M TO MUTE ANYTIME ]
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

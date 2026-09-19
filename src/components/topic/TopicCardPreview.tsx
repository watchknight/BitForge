import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';

interface TopicCardPreviewProps {
  type: 'array' | 'linked-list' | 'tree' | 'graph' | 'grid' | string;
  isHovered: boolean;
}

export const TopicCardPreview: React.FC<TopicCardPreviewProps> = ({ type, isHovered }) => {
  const { reducedMotion } = useAccessibility();

  // If reduced motion is preferred, show a crisp static icon/layout without animation
  if (reducedMotion) {
    return null;
  }

  return (
    <div className={`h-9 w-full rounded-lg bg-obsidian-950/80 border border-slate-800/80 px-2.5 flex items-center justify-center overflow-hidden transition-all duration-300 ${
      isHovered ? 'border-brand-500/40 bg-obsidian-900 shadow-inner' : 'opacity-70'
    }`}>
      {/* 1. Array / Sorting micro-bars */}
      {(type === 'array' || type === 'sorting') && (
        <div className="flex items-end justify-center gap-1.5 h-6 w-full px-2">
          {[
            { h: 35, active: isHovered },
            { h: 80, comparing: isHovered },
            { h: 50, comparing: isHovered },
            { h: 95, sorted: isHovered },
            { h: 25, active: isHovered },
          ].map((bar, i) => (
            <motion.div
              key={i}
              animate={isHovered ? {
                height: [`${bar.h}%`, `${(bar.h * 1.3) % 100}%`, `${bar.h}%`],
              } : { height: `${bar.h}%` }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              className={`flex-1 rounded-t-sm transition-colors ${
                bar.comparing
                  ? 'bg-amber-400'
                  : bar.sorted
                  ? 'bg-emerald-400'
                  : bar.active
                  ? 'bg-brand-400'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}

      {/* 2. Linked List micro-nodes */}
      {type === 'linked-list' && (
        <div className="flex items-center justify-center gap-2 h-full">
          {[1, 2, 3].map((node, i) => (
            <React.Fragment key={i}>
              <motion.div
                animate={isHovered ? {
                  scale: [1, 1.2, 1],
                  borderColor: ['#334155', '#22D3EE', '#334155'],
                } : { scale: 1 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] font-mono text-slate-300"
              >
                {node}
              </motion.div>
              {i < 2 && (
                <motion.div 
                  animate={isHovered ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                  className="w-2 h-0.5 bg-brand-400"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* 3. Tree micro-branches */}
      {type === 'tree' && (
        <svg className="w-20 h-7" viewBox="0 0 80 28">
          <line x1="40" y1="4" x2="20" y2="20" stroke="#334155" strokeWidth="1" />
          <line x1="40" y1="4" x2="60" y2="20" stroke="#334155" strokeWidth="1" />
          <motion.circle
            cx="40"
            cy="6"
            r={4}
            fill="#0E7490"
            stroke="#22D3EE"
            strokeWidth="1"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '40px 6px' }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.circle
            cx="20"
            cy="20"
            r={3.5}
            fill="#1E293B"
            stroke="#06B6D4"
            strokeWidth="1"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '20px 20px' }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.circle
            cx="60"
            cy="20"
            r={3.5}
            fill="#1E293B"
            stroke="#10B981"
            strokeWidth="1"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '60px 20px' }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          />
        </svg>
      )}

      {/* 4. Graph micro-network */}
      {type === 'graph' && (
        <svg className="w-20 h-7" viewBox="0 0 80 28">
          <line x1="15" y1="14" x2="40" y2="6" stroke="#334155" strokeWidth="1" />
          <line x1="40" y1="6" x2="65" y2="14" stroke="#334155" strokeWidth="1" />
          <line x1="15" y1="14" x2="40" y2="22" stroke="#334155" strokeWidth="1" />
          <line x1="40" y1="22" x2="65" y2="14" stroke="#334155" strokeWidth="1" />
          <motion.circle
            cx="15"
            cy="14"
            r={3.5}
            fill="#0E7490"
            stroke="#22D3EE"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '15px 14px' }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.circle
            cx="40"
            cy="6"
            r={3.5}
            fill="#1E293B"
            stroke="#06B6D4"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '40px 6px' }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.circle
            cx="40"
            cy="22"
            r={3.5}
            fill="#1E293B"
            stroke="#475569"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '40px 22px' }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
          <motion.circle
            cx="65"
            cy="14"
            r={3.5}
            fill="#065F46"
            stroke="#34D399"
            animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            style={{ transformOrigin: '65px 14px' }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          />
        </svg>
      )}

      {/* 5. Grid / DP micro-cells */}
      {(type === 'grid' || type === 'recursion') && (
        <div className="flex items-center justify-center gap-1.5 h-full">
          {[1, 2, 3, 4].map((cell, i) => (
            <motion.div
              key={i}
              animate={isHovered ? {
                backgroundColor: ['#1e293b', '#0e7490', '#1e293b'],
                borderColor: ['#334155', '#22d3ee', '#334155'],
              } : {}}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
              className="w-4 h-4 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[8px] font-mono text-slate-300"
            >
              {cell}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

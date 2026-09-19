import React from 'react';

interface ArchitecturalFrameProps {
  children: React.ReactNode;
  label?: string;
  sublabel?: string;
  className?: string;
  interactive?: boolean;
}

export const ArchitecturalFrame: React.FC<ArchitecturalFrameProps> = ({
  children,
  label,
  sublabel,
  className = '',
}) => {
  return (
    <div className={`relative p-5 sm:p-6 rounded-2xl bg-obsidian-900/60 backdrop-blur-md border border-slate-800/80 group ${className}`}>
      {/* Precision 4-Corner Crosshairs (Inspired by dkton.at) */}
      <span className="absolute -top-1.5 -left-1.5 font-mono text-[11px] text-slate-600 group-hover:text-brand-400 transition-colors pointer-events-none select-none">
        +
      </span>
      <span className="absolute -top-1.5 -right-1.5 font-mono text-[11px] text-slate-600 group-hover:text-brand-400 transition-colors pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[11px] text-slate-600 group-hover:text-brand-400 transition-colors pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[11px] text-slate-600 group-hover:text-brand-400 transition-colors pointer-events-none select-none">
        +
      </span>

      {/* Top Monospace Metadata Banner */}
      {(label || sublabel) && (
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-4 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">{label || 'MODULE'}</span>
          </div>
          {sublabel && (
            <span className="text-slate-500">
              [{sublabel}]
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

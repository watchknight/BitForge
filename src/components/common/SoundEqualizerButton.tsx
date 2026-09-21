import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../services/soundEngine';

export const SoundEqualizerButton: React.FC = () => {
  const [muted, setMuted] = useState(soundEngine.getMuted());

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((newMuted) => {
      setMuted(newMuted);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    soundEngine.toggleMute();
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative group flex items-center justify-center gap-2 px-2.5 py-2 min-h-[44px] min-w-[44px] rounded-xl border transition-all duration-300 ${
        !muted
          ? 'bg-brand-950/80 border-brand-500/40 text-brand-300 shadow-md shadow-brand-500/10'
          : 'bg-obsidian-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
      }`}
      title={muted ? 'Enable Algorithmic Sound (M)' : 'Mute Algorithmic Sound (M)'}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
    >
      {/* 5-Bar Dancing Equalizer (Inspired by dkton.at) */}
      <div className="flex items-center gap-[2.5px] h-3.5 w-4 justify-center">
        {[
          { h: 'h-2', anim: 'animate-[equalizer1_1s_ease-in-out_infinite]' },
          { h: 'h-3.5', anim: 'animate-[equalizer2_1.2s_ease-in-out_infinite]' },
          { h: 'h-1.5', anim: 'animate-[equalizer3_0.8s_ease-in-out_infinite]' },
          { h: 'h-3', anim: 'animate-[equalizer1_1.1s_ease-in-out_infinite]' },
          { h: 'h-2', anim: 'animate-[equalizer2_0.9s_ease-in-out_infinite]' },
        ].map((bar, idx) => (
          <span
            key={idx}
            className={`w-[2px] rounded-full transition-all duration-200 ${
              !muted
                ? `bg-brand-400 ${bar.anim}`
                : 'bg-slate-600 h-[2px]'
            }`}
            style={{
              height: muted ? '2px' : undefined,
            }}
          />
        ))}
      </div>

      <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">
        {!muted ? 'SOUND ON' : 'MUTED'}
      </span>
      
      <span className="text-[9px] font-mono text-slate-500 opacity-60 hidden md:inline">
        [M]
      </span>
    </button>
  );
};

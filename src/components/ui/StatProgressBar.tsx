import React from 'react';

interface StatProgressBarProps {
  label: string;
  current: number;
  max: number;
  color?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'rose' | 'slate';
  customHex?: string;
  unit?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  sublabel?: string;
  className?: string;
}

export const StatProgressBar: React.FC<StatProgressBarProps> = ({
  label,
  current,
  max,
  color = 'cyan',
  customHex,
  unit = '',
  showPercent = false,
  size = 'md',
  sublabel,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / max) * 100)));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colorStyles = {
    cyan: 'bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    violet: 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]',
    amber: 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    emerald: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    rose: 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    slate: 'bg-slate-400'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
        <span className="text-slate-300 font-medium tracking-wide flex items-center gap-1.5">
          {label}
          {sublabel && <span className="text-[10px] text-slate-500 font-sans">({sublabel})</span>}
        </span>
        <span className="text-slate-400 font-semibold tabular-nums">
          {current.toLocaleString()} {unit && <span className="text-[10px] text-slate-500">{unit}</span>}
          {max > 0 && <span className="text-slate-600"> / {max.toLocaleString()}</span>}
          {showPercent && <span className="text-cyan-400 ml-1.5">({percentage}%)</span>}
        </span>
      </div>

      <div className={`w-full bg-[#080c13] rounded-full overflow-hidden border border-white/[0.06] ${heightStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            customHex ? '' : colorStyles[color]
          }`}
          style={{
            width: `${percentage}%`,
            ...(customHex ? { backgroundColor: customHex, boxShadow: `0 0 10px ${customHex}88` } : {})
          }}
        />
      </div>
    </div>
  );
};

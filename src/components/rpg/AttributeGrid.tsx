import React from 'react';
import { AttributeInfo } from '../../types';
import { Dumbbell, Brain, ShieldCheck, Sparkles, HeartPulse, Users } from 'lucide-react';

interface AttributeGridProps {
  attributes: Record<string, AttributeInfo>;
  onSelectAttribute?: (attr: AttributeInfo) => void;
  compact?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-3.5 h-3.5" />,
  Brain: <Brain className="w-3.5 h-3.5" />,
  ShieldCheck: <ShieldCheck className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  HeartPulse: <HeartPulse className="w-3.5 h-3.5" />,
  Users: <Users className="w-3.5 h-3.5" />
};

export const AttributeGrid: React.FC<AttributeGridProps> = ({
  attributes,
  onSelectAttribute,
  compact = false
}) => {
  const list = Object.values(attributes) as AttributeInfo[];

  return (
    <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5'}`}>
      {list.map((attr) => {
        const percent = Math.min(100, Math.round((attr.value / attr.maxValue) * 100));
        const labelText = attr.label || (attr.key ? attr.key.toUpperCase() : 'ATTRIBUTE');

        return (
          <div
            key={attr.key}
            onClick={() => onSelectAttribute && onSelectAttribute(attr)}
            className="group relative bg-[#0c1017] hover:bg-[#111722] border border-white/[0.08] hover:border-white/[0.2] rounded-xl p-3.5 transition-all cursor-pointer shadow-sm"
          >
            {/* Ambient accent strip */}
            <div
              className="absolute top-0 left-3 right-3 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: attr.color, boxShadow: `0 0 8px ${attr.color}` }}
            />

            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded-lg text-black font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: attr.color }}
                >
                  {ICON_MAP[attr.iconName] || <Sparkles className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                    {labelText}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono block leading-none mt-0.5">
                    LV.{attr.level}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="text-xs sm:text-sm font-bold text-white tabular-nums">
                    {attr.value}
                  </span>
                  <span className="text-[10px] text-slate-500">/{attr.maxValue}</span>
                </div>
                {attr.recentGain > 0 && (
                  <span
                    className="block text-[10px] font-bold leading-none mt-0.5"
                    style={{ color: attr.color }}
                  >
                    +{attr.recentGain}
                  </span>
                )}
              </div>
            </div>

            {/* Custom bar */}
            <div className="w-full bg-[#080c13] rounded-full h-1.5 overflow-hidden border border-white/[0.05]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: attr.color,
                  boxShadow: `0 0 8px ${attr.color}88`
                }}
              />
            </div>

            {!compact && (
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 font-sans">
                {attr.domain}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

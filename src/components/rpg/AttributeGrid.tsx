import React from 'react';
import { AttributeInfo } from '../../types';
import { Dumbbell, Brain, ShieldCheck, Sparkles, HeartPulse, Users } from 'lucide-react';

interface AttributeGridProps {
  attributes: Record<string, AttributeInfo>;
  onSelectAttribute?: (attr: AttributeInfo) => void;
  compact?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />
};

export const AttributeGrid: React.FC<AttributeGridProps> = ({
  attributes,
  onSelectAttribute,
  compact = false
}) => {
  const list = Object.values(attributes) as AttributeInfo[];

  return (
    <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 gap-2.5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5'}`}>
      {list.map((attr) => {
        const percent = Math.min(100, Math.round((attr.value / attr.maxValue) * 100));

        return (
          <div
            key={attr.key}
            onClick={() => onSelectAttribute && onSelectAttribute(attr)}
            className="group relative bg-[#0c1017] hover:bg-[#111722] border border-white/[0.08] hover:border-white/[0.2] rounded-xl p-3.5 transition-all cursor-pointer shadow-sm"
          >
            {/* Ambient accent strip */}
            <div
              className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: attr.color, boxShadow: `0 0 8px ${attr.color}` }}
            />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded-lg text-black font-bold flex items-center justify-center"
                  style={{ backgroundColor: attr.color }}
                >
                  {ICON_MAP[attr.iconName] || <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                    {attr.label}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    LV.{attr.level}
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-sm font-bold text-white tabular-nums">
                  {attr.value}
                </span>
                <span className="text-[10px] text-slate-500"> / {attr.maxValue}</span>
                {attr.recentGain > 0 && (
                  <span
                    className="block text-[10px] font-bold"
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

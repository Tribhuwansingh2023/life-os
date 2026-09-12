import React from 'react';
import { motion } from 'framer-motion';
import {
  AttributeInfo,
  AttributeKey,
  Quest,
  ReplayDay,
  PlayerProfile
} from '../../types';
import {
  Calendar,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Brain,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface WeeklyReplayProps {
  attributes: Record<string, AttributeInfo>;
  quests: Quest[];
  replayDays: ReplayDay[];
  player: PlayerProfile;
  className?: string;
  onSelectAttribute?: (key: AttributeKey) => void;
  onInspectQuest?: (quest: Quest) => void;
}

const ATTRIBUTE_METADATA: Record<
  AttributeKey,
  { icon: React.ReactNode; label: string; color: string; target: number }
> = {
  intellect: {
    icon: <Brain className="w-4 h-4" />,
    label: 'Intellect',
    color: '#00f0ff',
    target: 40
  },
  discipline: {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: 'Discipline',
    color: '#8b5cf6',
    target: 30
  },
  creativity: {
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Creativity',
    color: '#f59e0b',
    target: 30
  },
  strength: {
    icon: <Dumbbell className="w-4 h-4" />,
    label: 'Strength',
    color: '#f43f5e',
    target: 30
  },
  social: {
    icon: <Users className="w-4 h-4" />,
    label: 'Social',
    color: '#38bdf8',
    target: 30
  },
  wellness: {
    icon: <HeartPulse className="w-4 h-4" />,
    label: 'Wellness',
    color: '#10b981',
    target: 30
  }
};

export const WeeklyReplay: React.FC<WeeklyReplayProps> = ({
  attributes,
  quests,
  replayDays,
  player,
  className = '',
  onSelectAttribute
}) => {
  const completedQuests = quests.filter((q) => q.status === 'completed');
  const totalWeeklyXp = replayDays.reduce((acc, d) => acc + d.xpEarned, 0);
  const totalWeeklyQuests = replayDays.reduce((acc, d) => acc + d.questsCompleted, 0);

  // Baseline verified 7-day attribute deltas
  const attributeDeltas: Record<AttributeKey, { delta: number; questsCount: number; target: number }> = {
    intellect: { delta: 30, questsCount: 11, target: 40 },
    discipline: { delta: 20, questsCount: 8, target: 30 },
    creativity: { delta: 15, questsCount: 6, target: 30 },
    strength: { delta: 14, questsCount: 5, target: 30 },
    social: { delta: 12, questsCount: 4, target: 30 },
    wellness: { delta: 8, questsCount: 1, target: 30 }
  };

  // Add dynamically completed quests from the active session if any
  completedQuests.forEach((quest) => {
    // Only count quests beyond initial completed mock data to avoid double-counting
    if (quest.id !== 'qst_07') {
      quest.attributesAffected.forEach(({ attribute, gain }) => {
        if (attributeDeltas[attribute]) {
          attributeDeltas[attribute].questsCount += 1;
          attributeDeltas[attribute].delta += gain;
        }
      });
    }
  });

  // Calculate fastest growing and lowest growth
  let fastestGrowingKey: AttributeKey = 'intellect';
  let lowestGrowthKey: AttributeKey = 'wellness';
  let maxDelta = -Infinity;
  let minDelta = Infinity;

  (Object.keys(attributeDeltas) as AttributeKey[]).forEach((key) => {
    const d = attributeDeltas[key].delta;
    if (d > maxDelta) {
      maxDelta = d;
      fastestGrowingKey = key;
    }
    if (d < minDelta) {
      minDelta = d;
      lowestGrowthKey = key;
    }
  });

  return (
    <div
      className={`bg-[#0c1017] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 ${className}`}
      id="weekly-replay-summary"
    >
      {/* Header summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
              7-DAY DEBRIEF // ATTRIBUTE PROGRESS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-mono font-black text-white tracking-wide">
            CORE ATTRIBUTE PROGRESS DELTAS
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Verified growth across all six life domains from {replayDays[0]?.dateStr || 'the last 7 days'}.
          </p>
        </div>

        {/* Top 3 KPI Pills */}
        <div className="flex items-center gap-2.5 font-mono text-xs shrink-0 flex-wrap">
          <div className="bg-[#070a10] px-3.5 py-2 rounded-xl border border-cyan-500/20">
            <span className="text-[9px] text-slate-400 uppercase block">XP EARNED</span>
            <span className="text-sm font-bold text-cyan-300">+{totalWeeklyXp.toLocaleString()} XP</span>
          </div>

          <div className="bg-[#070a10] px-3.5 py-2 rounded-xl border border-violet-500/20">
            <span className="text-[9px] text-slate-400 uppercase block">COMPLETED</span>
            <span className="text-sm font-bold text-violet-300">{totalWeeklyQuests} QUESTS</span>
          </div>

          <div className="bg-[#070a10] px-3.5 py-2 rounded-xl border border-amber-500/20">
            <span className="text-[9px] text-slate-400 uppercase block">FASTEST GROWING</span>
            <span className="text-sm font-bold text-cyan-300 uppercase">
              {fastestGrowingKey} (+{maxDelta})
            </span>
          </div>
        </div>
      </div>

      {/* Six Core Attributes Progress Deltas Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            CORE ATTRIBUTE PROGRESS DELTAS
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Click any attribute to view contributing quests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(ATTRIBUTE_METADATA) as AttributeKey[]).map((key) => {
            const meta = ATTRIBUTE_METADATA[key];
            const attr = attributes[key] || {
              value: 70,
              level: 14,
              maxValue: 100,
              recentGain: 6
            };
            const deltaInfo = attributeDeltas[key];
            const progressPercent = Math.min(100, Math.round((deltaInfo.delta / deltaInfo.target) * 100));
            const isFastest = key === fastestGrowingKey;
            const isLowest = key === lowestGrowthKey;

            return (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                onClick={() => onSelectAttribute?.(key)}
                className={`bg-[#080c13] hover:bg-[#0f1422] p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                  isFastest
                    ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                    : isLowest
                    ? 'border-emerald-500/30'
                    : 'border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                {/* Accent ambient glow */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
                  style={{ backgroundColor: meta.color }}
                />

                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        borderColor: `${meta.color}40`,
                        color: meta.color
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors uppercase">
                          {meta.label}
                        </h5>
                        {isFastest && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider">
                            FASTEST GROWING
                          </span>
                        )}
                        {isLowest && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 uppercase tracking-wider">
                            NEEDS ATTENTION
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Level {attr.level} • {attr.value} / {attr.maxValue || 100}
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Change Badge */}
                  <div
                    className="px-2.5 py-1 rounded-lg border font-mono text-xs font-black flex items-center gap-1 shadow-sm shrink-0"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      borderColor: `${meta.color}50`,
                      color: meta.color
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    +{deltaInfo.delta} this week
                  </div>
                </div>

                {/* Contributing Quests count */}
                <div className="text-[11px] text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{deltaInfo.questsCount} quests</span>
                </div>

                {/* Target Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Target Progress</span>
                    <span className="font-bold text-slate-200">{progressPercent}% of weekly target</span>
                  </div>

                  <div className="w-full bg-[#05070a] rounded-full h-2 overflow-hidden border border-white/[0.04] p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{
                        width: `${Math.max(8, progressPercent)}%`,
                        backgroundColor: meta.color
                      }}
                    />
                  </div>
                </div>

                {/* Footnote */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.04] text-[10px] font-mono text-slate-400">
                  <span className="text-slate-400">
                    Target: +{deltaInfo.target} pts
                  </span>
                  <span className="text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-0.5">
                    View Quests &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

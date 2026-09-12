import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReplayDay,
  PlayerProfile,
  AttributeInfo,
  AttributeKey,
  Quest,
  OracleInsight
} from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { audioService } from '../services/audioService';
import {
  Calendar,
  Zap,
  TrendingUp,
  Trophy,
  CheckCircle2,
  Brain,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  ArrowRight,
  ArrowUpRight,
  Crown,
  Swords,
  Compass,
  Flame,
  AlertTriangle,
  X,
  Target,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface ReplayPageProps {
  replayDays: ReplayDay[];
  player: PlayerProfile;
  attributes?: Record<string, AttributeInfo>;
  quests?: Quest[];
  oracle?: OracleInsight;
  onInspectQuest?: (quest: Quest) => void;
  onNavigateTab?: (tab: string) => void;
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

// Contributing quests repository linked to actual game quests and weekly log
const ATTRIBUTE_CONTRIBUTING_QUESTS: Record<
  AttributeKey,
  Array<{
    id: string;
    title: string;
    xpReward: number;
    gain: number;
    date: string;
    type: string;
    dnaTag: string;
  }>
> = {
  intellect: [
    {
      id: 'qst_01',
      title: 'Deploy Production Architecture Pipeline',
      xpReward: 420,
      gain: 7,
      date: 'Today, Sep 12',
      type: 'epic',
      dnaTag: 'Systems Architecture'
    },
    {
      id: 'qst_03',
      title: 'Design Architecture Specifications for New Core',
      xpReward: 580,
      gain: 8,
      date: 'Fri, Sep 10',
      type: 'epic',
      dnaTag: 'System Design'
    },
    {
      id: 'qst_07',
      title: 'Read 20 Pages of Distributed Systems Engineering',
      xpReward: 140,
      gain: 4,
      date: 'Wed, Sep 08',
      type: 'habit',
      dnaTag: 'Deep Reading'
    },
    {
      id: 'qst_06',
      title: 'Chronos the Procrastinator: Clear 3 Pending Tasks',
      xpReward: 350,
      gain: 5,
      date: 'Thu, Sep 09',
      type: 'boss_raid',
      dnaTag: 'Focus Lock'
    },
    {
      id: 'int_05',
      title: 'Archive of Light: Sector 3 Algorithmic Analysis',
      xpReward: 320,
      gain: 6,
      date: 'Mon, Sep 06',
      type: 'daily',
      dnaTag: 'Byzantine Consensus'
    }
  ],
  discipline: [
    {
      id: 'qst_06',
      title: 'Chronos the Procrastinator: Clear 3 Pending Tasks',
      xpReward: 350,
      gain: 6,
      date: 'Thu, Sep 09',
      type: 'boss_raid',
      dnaTag: 'Boss Raid'
    },
    {
      id: 'disc_01',
      title: '14-Day Morning Deep Work Streak Lockdown',
      xpReward: 480,
      gain: 10,
      date: 'Thu, Sep 09',
      type: 'habit',
      dnaTag: 'Habit Consistency'
    },
    {
      id: 'qst_02',
      title: 'Heavy Strength Training (Squats & Deadlifts)',
      xpReward: 260,
      gain: 3,
      date: 'Tue, Sep 07',
      type: 'daily',
      dnaTag: 'Discipline'
    },
    {
      id: 'disc_02',
      title: 'Zero Distraction Execution Sprint',
      xpReward: 190,
      gain: 1,
      date: 'Mon, Sep 06',
      type: 'daily',
      dnaTag: 'Focus'
    }
  ],
  creativity: [
    {
      id: 'qst_03',
      title: 'Design Architecture Specifications for New Core',
      xpReward: 580,
      gain: 9,
      date: 'Wed, Sep 08',
      type: 'epic',
      dnaTag: 'Ideation'
    },
    {
      id: 'crt_01',
      title: 'Author 4 Modular Cyber System Schematics',
      xpReward: 420,
      gain: 6,
      date: 'Wed, Sep 08',
      type: 'daily',
      dnaTag: 'Creative Synthesis'
    }
  ],
  strength: [
    {
      id: 'qst_02',
      title: 'Heavy Strength Training (Squats & Deadlifts)',
      xpReward: 260,
      gain: 6,
      date: 'Tue, Sep 07',
      type: 'daily',
      dnaTag: 'Kinetic Power'
    },
    {
      id: 'str_01',
      title: 'Basalt Kinetic Conditioning Circuit',
      xpReward: 380,
      gain: 8,
      date: 'Tue, Sep 07',
      type: 'daily',
      dnaTag: 'Endurance'
    }
  ],
  social: [
    {
      id: 'qst_05',
      title: 'Lead Technical Masterclass with 3 Engineering Peers',
      xpReward: 240,
      gain: 7,
      date: 'Sat, Sep 11',
      type: 'daily',
      dnaTag: 'Mentorship'
    },
    {
      id: 'soc_01',
      title: 'Tech Guild Distributed Systems Expedition',
      xpReward: 360,
      gain: 5,
      date: 'Sat, Sep 11',
      type: 'daily',
      dnaTag: 'Squad Synergy'
    }
  ],
  wellness: [
    {
      id: 'qst_04',
      title: 'Digital Fast & 20-Minute Recovery Reset',
      xpReward: 180,
      gain: 8,
      date: 'Thu, Sep 09',
      type: 'habit',
      dnaTag: 'Restoration'
    }
  ]
};

// Milestone detector helper
function getMilestoneMeta(milestone?: string) {
  if (!milestone) return null;
  const lower = milestone.toLowerCase();
  if (lower.includes('level') || lower.includes('breakthrough')) {
    return {
      type: 'breakthrough',
      label: 'BREAKTHROUGH',
      icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
    };
  }
  if (lower.includes('boss') || lower.includes('dmg') || lower.includes('chronos')) {
    return {
      type: 'boss',
      label: 'BOSS RAID',
      icon: <Swords className="w-3.5 h-3.5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300'
    };
  }
  if (lower.includes('archive') || lower.includes('mastered') || lower.includes('region')) {
    return {
      type: 'territory',
      label: 'TERRITORY MILESTONE',
      icon: <Compass className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
    };
  }
  if (lower.includes('streak')) {
    return {
      type: 'streak',
      label: 'STREAK MILESTONE',
      icon: <Flame className="w-3.5 h-3.5 text-violet-400" />,
      color: 'border-violet-500/40 bg-violet-500/10 text-violet-300'
    };
  }
  if (lower.includes('guild') || lower.includes('expedition')) {
    return {
      type: 'expedition',
      label: 'GUILD EXPEDITION',
      icon: <Users className="w-3.5 h-3.5 text-sky-400" />,
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-300'
    };
  }
  if (lower.includes('schematic') || lower.includes('created')) {
    return {
      type: 'craft',
      label: 'CREATIVE CRAFT',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
    };
  }
  return {
    type: 'achievement',
    label: 'KEY MOMENT',
    icon: <Trophy className="w-3.5 h-3.5 text-cyan-400" />,
    color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
  };
}

export const ReplayPage: React.FC<ReplayPageProps> = ({
  replayDays,
  player,
  attributes = {} as Record<string, AttributeInfo>,
  quests = [] as Quest[],
  oracle,
  onInspectQuest,
  onNavigateTab
}) => {
  // State for interactive inspection
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // Default to Friday (Breakthrough)
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [inspectedAttribute, setInspectedAttribute] = useState<AttributeKey | null>(null);

  // Active day is either hovered or selected
  const activeDayIndex = hoveredDayIndex !== null ? hoveredDayIndex : selectedDayIndex;
  const activeDay = replayDays[activeDayIndex] || replayDays[replayDays.length - 1];

  // Verified summary calculations from actual state
  const totalWeeklyXp = replayDays.reduce((acc, d) => acc + d.xpEarned, 0);
  const totalWeeklyQuests = replayDays.reduce((acc, d) => acc + d.questsCompleted, 0);
  const currentMomentum = player.momentum || 88;
  const maxDayXp = Math.max(...replayDays.map((d) => d.xpEarned), 1800);

  // Baseline verified 7-day attribute deltas
  const attributeDeltas: Record<
    AttributeKey,
    { delta: number; questsCount: number; target: number }
  > = {
    intellect: { delta: 30, questsCount: 11, target: 40 },
    discipline: { delta: 20, questsCount: 8, target: 30 },
    creativity: { delta: 15, questsCount: 6, target: 30 },
    strength: { delta: 14, questsCount: 5, target: 30 },
    social: { delta: 12, questsCount: 4, target: 30 },
    wellness: { delta: 8, questsCount: 1, target: 30 }
  };

  // Add dynamically completed quests from the active session if any
  const completedSessionQuests: Quest[] = quests.filter((q) => q.status === 'completed');
  completedSessionQuests.forEach((quest) => {
    if (quest.id !== 'qst_07') {
      quest.attributesAffected.forEach(({ attribute, gain }) => {
        if (attributeDeltas[attribute]) {
          attributeDeltas[attribute].questsCount += 1;
          attributeDeltas[attribute].delta += gain;
        }
      });
    }
  });

  // Calculate fastest growing and slowest growing attributes
  const sortedAttributeKeys = (Object.keys(attributeDeltas) as AttributeKey[]).sort(
    (a, b) => attributeDeltas[b].delta - attributeDeltas[a].delta
  );
  const fastestKey = sortedAttributeKeys[0]; // 'intellect'
  const slowestKey = sortedAttributeKeys[sortedAttributeKeys.length - 1]; // 'wellness'
  const fastestDelta = attributeDeltas[fastestKey].delta;
  const slowestDelta = attributeDeltas[slowestKey].delta;

  // Beginning of week calculation: current value - weekly delta
  const startLevel = Math.max(1, player.level - 1);
  const endLevel = player.level;

  const beginningState: Record<AttributeKey, { start: number; end: number; delta: number }> = {
    intellect: {
      start: (attributes['intellect']?.value || 92) - attributeDeltas.intellect.delta,
      end: attributes['intellect']?.value || 92,
      delta: attributeDeltas.intellect.delta
    },
    discipline: {
      start: (attributes['discipline']?.value || 84) - attributeDeltas.discipline.delta,
      end: attributes['discipline']?.value || 84,
      delta: attributeDeltas.discipline.delta
    },
    creativity: {
      start: (attributes['creativity']?.value || 78) - attributeDeltas.creativity.delta,
      end: attributes['creativity']?.value || 78,
      delta: attributeDeltas.creativity.delta
    },
    strength: {
      start: (attributes['strength']?.value || 68) - attributeDeltas.strength.delta,
      end: attributes['strength']?.value || 68,
      delta: attributeDeltas.strength.delta
    },
    social: {
      start: (attributes['social']?.value || 62) - attributeDeltas.social.delta,
      end: attributes['social']?.value || 62,
      delta: attributeDeltas.social.delta
    },
    wellness: {
      start: (attributes['wellness']?.value || 58) - attributeDeltas.wellness.delta,
      end: attributes['wellness']?.value || 58,
      delta: attributeDeltas.wellness.delta
    }
  };

  const handleDaySelect = (index: number) => {
    audioService.playTactileClick();
    setSelectedDayIndex(index);
  };

  const handleAttributeClick = (key: AttributeKey) => {
    audioService.playTactileClick();
    setInspectedAttribute((prev) => (prev === key ? null : key));
  };

  const handleQuestInspect = (questId: string) => {
    audioService.playTactileClick();
    const existing = (quests as Quest[]).find((q) => q.id === questId);
    if (existing && onInspectQuest) {
      onInspectQuest(existing);
    } else if (onInspectQuest) {
      // Fallback synthetic quest representation if not in active state
      const fallback = Object.values(ATTRIBUTE_CONTRIBUTING_QUESTS)
        .flat()
        .find((q) => q.id === questId);
      if (fallback) {
        onInspectQuest({
          id: fallback.id,
          title: fallback.title,
          category: inspectedAttribute || 'intellect',
          type: (fallback.type as any) || 'daily',
          difficulty: 'B',
          timeEstimateMinutes: 45,
          xpReward: fallback.xpReward,
          goldReward: 80,
          momentumBoost: 6,
          attributesAffected: [
            { attribute: inspectedAttribute || 'intellect', gain: fallback.gain }
          ],
          description: `Logged activity contributing +${fallback.gain} ${inspectedAttribute} during the weekly cycle.`,
          dnaTags: [fallback.dnaTag],
          status: 'completed',
          streakCount: 5
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto" id="weekly-replay-page">
      {/* ============================================================ */}
      {/* 1. PAGE IDENTITY & TOP SUMMARY                               */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-[#0c121e] via-[#090d15] to-[#06080e] border border-white/[0.09] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                CHRONO REPLAY // 7-DAY DEBRIEF
              </span>
              <span className="text-slate-600 font-mono">•</span>
              <span className="text-[11px] font-mono text-slate-400">
                {replayDays[0]?.dateStr} — {replayDays[replayDays.length - 1]?.dateStr}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white tracking-wide">
              WEEKLY REPLAY
            </h1>
            <p className="text-sm text-slate-300 font-sans mt-1">
              See what changed this week.
            </p>
          </div>

          {/* 2. TOP SUMMARY METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono shrink-0">
            {/* XP Earned */}
            <div className="bg-[#070a10] px-4 py-3 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase block tracking-wider">
                XP EARNED
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-cyan-300">
                  +{totalWeeklyXp.toLocaleString()} XP
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-sans">
                <TrendingUp className="w-3 h-3" />
                +12% vs last week
              </span>
            </div>

            {/* Quests Completed */}
            <div className="bg-[#070a10] px-4 py-3 rounded-xl border border-violet-500/20">
              <span className="text-[10px] text-slate-400 uppercase block tracking-wider">
                QUESTS COMPLETED
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-violet-300">
                  {totalWeeklyQuests} QUESTS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 font-sans">
                Across 6 life domains
              </span>
            </div>

            {/* Momentum */}
            <div className="bg-[#070a10] px-4 py-3 rounded-xl border border-amber-500/20">
              <span className="text-[10px] text-slate-400 uppercase block tracking-wider">
                MOMENTUM
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-amber-300">
                  {currentMomentum}% MOMENTUM
                </span>
              </div>
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5 mt-1 font-sans">
                <Flame className="w-3 h-3" />
                Hyper-Drive ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. YOUR WEEK IN ONE SENTENCE (ORACLE INSIGHT)                 */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-violet-950/40 via-[#0c101b] to-cyan-950/30 border border-violet-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-violet-300 uppercase tracking-wider">
                YOUR WEEK IN ONE SENTENCE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-400">Oracle Reflection</span>
            </div>

            <p className="text-base sm:text-lg font-sans font-medium text-slate-100 leading-relaxed">
              &ldquo;You had your strongest <span className="text-cyan-300 font-bold">Intellect</span> week yet, completing <span className="text-white font-bold">{totalWeeklyQuests} quests</span> and gaining <span className="text-cyan-300 font-bold">+{fastestDelta} Intellect</span>, while <span className="text-emerald-400 font-bold">Wellness</span> remained your slowest-growing attribute.&rdquo;
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Breakthrough Level 17 reached
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                Archive of Light at 94% mastery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. BIGGEST WIN + NEEDS ATTENTION (TWO COMPACT CARDS)         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: BIGGEST WIN */}
        <div className="bg-[#0b111a] border border-cyan-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-cyan-400" />
                BIGGEST WIN
              </span>
              <Badge variant="cyan" size="xs">
                HIGHEST SURGE
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-mono font-black text-white">
                INTELLECT +{fastestDelta}
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-sans mb-4">
              You made your largest weekly gain here.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/[0.06] font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contributing Quests</span>
                <span className="font-bold text-cyan-300">
                  {attributeDeltas.intellect.questsCount} quests logged
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Weekly Target Progress</span>
                <span className="font-bold text-slate-200">
                  {Math.round((attributeDeltas.intellect.delta / attributeDeltas.intellect.target) * 100)}% of target
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Relevant Milestone</span>
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Reached Level 17
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => handleAttributeClick('intellect')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              Inspect Contributing Quests &rarr;
            </button>
            <span className="text-[10px] font-mono text-slate-500">Archive of Light +8%</span>
          </div>
        </div>

        {/* CARD 2: NEEDS ATTENTION */}
        <div className="bg-[#0b111a] border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-emerald-400" />
                NEEDS ATTENTION
              </span>
              <Badge variant="emerald" size="xs">
                SLOWER EXPANSION
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-mono font-black text-white">
                WELLNESS +{slowestDelta}
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-sans mb-4">
              Your slowest-growing attribute this week.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/[0.06] font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contributing Quests</span>
                <span className="font-bold text-emerald-300">
                  {attributeDeltas.wellness.questsCount} quest logged
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Weekly Target Progress</span>
                <span className="font-bold text-slate-200">
                  {Math.round((attributeDeltas.wellness.delta / attributeDeltas.wellness.target) * 100)}% of target
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Oracle Recommendation</span>
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-emerald-400" />
                  Recovery priority
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-[11px] font-sans text-slate-400 italic">
              &ldquo;One short Wellness quest could restore balance.&rdquo;
            </p>
            {onNavigateTab && (
              <button
                onClick={() => {
                  audioService.playTactileClick();
                  onNavigateTab('quests');
                }}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors shrink-0 ml-2"
              >
                Browse Quests &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. DAILY EXPERIENCE CHART (INTERACTIVE WITH POPUP/INSPECTOR) */}
      {/* ============================================================ */}
      <div className="bg-[#0b1019] border border-white/[0.09] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                DAILY EXPERIENCE VELOCITY
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Hover or click any day to inspect completed quests, momentum, and key milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[11px] text-slate-400">Peak Day:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              Fri (+1,650 XP)
            </span>
          </div>
        </div>

        {/* 7-Day Interactive Histogram */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-4 pb-2">
          {replayDays.map((day, idx) => {
            const heightPercent = Math.max(18, Math.round((day.xpEarned / maxDayXp) * 100));
            const isSelected = idx === selectedDayIndex;
            const isHovered = idx === hoveredDayIndex;
            const isActive = isSelected || isHovered;
            const milestoneMeta = getMilestoneMeta(day.milestone);

            return (
              <div
                key={day.dateStr}
                onClick={() => handleDaySelect(idx)}
                onMouseEnter={() => setHoveredDayIndex(idx)}
                onMouseLeave={() => setHoveredDayIndex(null)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Milestone indicator icon */}
                {milestoneMeta && (
                  <div className="mb-1 text-amber-400 animate-bounce group-hover:scale-125 transition-transform">
                    {milestoneMeta.icon}
                  </div>
                )}

                <span
                  className={`text-[10px] font-mono tabular-nums mb-1 transition-opacity ${
                    isActive ? 'text-cyan-300 font-bold opacity-100' : 'text-slate-500 opacity-60'
                  }`}
                >
                  +{day.xpEarned}
                </span>

                <div
                  className={`w-full max-w-[54px] rounded-t-xl p-1 border transition-all duration-300 flex items-end h-full ${
                    isActive
                      ? 'bg-[#101928] border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-[#070a10] border-white/[0.06] hover:border-white/[0.2]'
                  }`}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-200'
                        : 'bg-gradient-to-t from-violet-800 to-cyan-500 hover:from-violet-700 hover:to-cyan-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] font-mono block ${
                      isActive ? 'text-cyan-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {day.dayName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    {day.dateStr.split(' ')[1]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Inspector Panel */}
        {activeDay && (
          <motion.div
            key={activeDay.dateStr}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#070a10] border border-cyan-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0e1624] border border-cyan-500/40 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] text-cyan-400 uppercase font-bold">
                  {activeDay.dayName.split(' ')[0]}
                </span>
                <span className="text-sm font-black text-white">
                  {activeDay.dateStr.split(' ')[1]}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-white text-sm font-sans">
                    {activeDay.dayName} — {activeDay.dateStr}
                  </span>
                  <Badge variant="cyan" size="xs">
                    {activeDay.topAttribute} FOCUS
                  </Badge>
                </div>

                {activeDay.milestone ? (
                  <p className="text-xs text-amber-300 flex items-center gap-1.5 font-sans font-medium">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400/80">
                      KEY EVENT:
                    </span>
                    {activeDay.milestone}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 font-sans">
                    Consistent focus execution and habit momentum maintained.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 flex-wrap border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.06]">
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">QUESTS</span>
                <span className="font-bold text-white text-sm">
                  {activeDay.questsCompleted} Completed
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[9px] uppercase block">MOMENTUM</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {activeDay.momentumScore}%
                </span>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg text-cyan-300 font-bold text-sm">
                +{activeDay.xpEarned} XP
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 6. BEFORE → AFTER PROGRESSION (YOUR WEEK IN NUMBERS)          */}
      {/* ============================================================ */}
      <div className="bg-[#0b1019] border border-white/[0.09] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              YOUR WEEK IN NUMBERS
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Beginning-of-week snapshot versus verified end-of-week state.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.06]">
            Based on 7-Day Net Progression Baseline
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* LEVEL */}
          <div className="bg-[#070a10] border border-amber-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              LEVEL
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{startLevel}</span>
              <span className="text-amber-400 text-xs">&rarr;</span>
              <span className="text-white text-base font-black">{endLevel}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
              +1 Level Up
            </span>
          </div>

          {/* INTELLECT */}
          <div className="bg-[#070a10] border border-cyan-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              INTELLECT
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{beginningState.intellect.start}</span>
              <span className="text-cyan-400 text-xs">&rarr;</span>
              <span className="text-cyan-300 text-base font-black">{beginningState.intellect.end}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
              +{beginningState.intellect.delta}
            </span>
          </div>

          {/* DISCIPLINE */}
          <div className="bg-[#070a10] border border-violet-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              DISCIPLINE
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{beginningState.discipline.start}</span>
              <span className="text-violet-400 text-xs">&rarr;</span>
              <span className="text-violet-300 text-base font-black">{beginningState.discipline.end}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300">
              +{beginningState.discipline.delta}
            </span>
          </div>

          {/* CREATIVITY */}
          <div className="bg-[#070a10] border border-amber-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              CREATIVITY
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{beginningState.creativity.start}</span>
              <span className="text-amber-400 text-xs">&rarr;</span>
              <span className="text-amber-300 text-base font-black">{beginningState.creativity.end}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
              +{beginningState.creativity.delta}
            </span>
          </div>

          {/* WELLNESS */}
          <div className="bg-[#070a10] border border-emerald-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              WELLNESS
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{beginningState.wellness.start}</span>
              <span className="text-emerald-400 text-xs">&rarr;</span>
              <span className="text-emerald-300 text-base font-black">{beginningState.wellness.end}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
              +{beginningState.wellness.delta}
            </span>
          </div>

          {/* STRENGTH */}
          <div className="bg-[#070a10] border border-rose-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              STRENGTH
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{beginningState.strength.start}</span>
              <span className="text-rose-400 text-xs">&rarr;</span>
              <span className="text-rose-300 text-base font-black">{beginningState.strength.end}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">
              +{beginningState.strength.delta}
            </span>
          </div>

          {/* SOCIAL */}
          <div className="bg-[#070a10] border border-sky-500/20 rounded-xl p-3 text-center">
            <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
              SOCIAL
            </span>
            <div className="flex items-center justify-center gap-1.5 font-mono">
              <span className="text-slate-400 text-sm font-bold">{beginningState.social.start}</span>
              <span className="text-sky-400 text-xs">&rarr;</span>
              <span className="text-sky-300 text-base font-black">{beginningState.social.end}</span>
            </div>
            <span className="inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">
              +{beginningState.social.delta}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. ATTRIBUTE PROGRESSION (CORE ATTRIBUTE PROGRESS DELTAS)    */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              CORE ATTRIBUTE PROGRESS DELTAS
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Click any domain card to view logged contributing quests and milestones.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            6 Life Domains Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ATTRIBUTE_METADATA) as AttributeKey[]).map((key) => {
            const meta = ATTRIBUTE_METADATA[key];
            const attr = attributes[key] || {
              value: 70,
              level: 14,
              maxValue: 100,
              recentGain: 6
            };
            const deltaInfo = attributeDeltas[key];
            const progressPercent = Math.min(
              100,
              Math.round((deltaInfo.delta / deltaInfo.target) * 100)
            );
            const isFastest = key === fastestKey;
            const isLowest = key === slowestKey;
            const isSelected = inspectedAttribute === key;

            return (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                onClick={() => handleAttributeClick(key)}
                className={`bg-[#0c1017] hover:bg-[#101622] p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-500/30'
                    : isFastest
                    ? 'border-cyan-500/40'
                    : isLowest
                    ? 'border-emerald-500/40'
                    : 'border-white/[0.08] hover:border-white/[0.18]'
                }`}
              >
                {/* Accent ambient glow */}
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-10 pointer-events-none"
                  style={{ backgroundColor: meta.color }}
                />

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        borderColor: `${meta.color}40`,
                        color: meta.color
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors uppercase">
                          {meta.label}
                        </h4>
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
                      <span className="text-[11px] text-slate-400 font-mono">
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

                {/* Quests contributing info */}
                <div className="text-[11px] text-slate-300 font-mono mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {deltaInfo.questsCount} quests
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    Target: +{deltaInfo.target} pts
                  </span>
                </div>

                {/* Target Progress Bar */}
                <div className="space-y-1.5">
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

                {/* Card Action Link */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] font-mono text-slate-400">
                  <span className="text-slate-400">
                    {isSelected ? 'Viewing contributing quests' : 'Click to inspect quests'}
                  </span>
                  <span className="text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-0.5">
                    {isSelected ? 'Close' : 'Inspect'} &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contributing Quests Expansion Drawer */}
        <AnimatePresence>
          {inspectedAttribute && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#070b12] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: `${ATTRIBUTE_METADATA[inspectedAttribute].color}30` }}
                  >
                    {ATTRIBUTE_METADATA[inspectedAttribute].icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-mono font-bold text-white uppercase">
                      {ATTRIBUTE_METADATA[inspectedAttribute].label} — Contributing Quests
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Verified logs that powered the +{attributeDeltas[inspectedAttribute].delta} growth this week.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedAttribute(null)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(ATTRIBUTE_CONTRIBUTING_QUESTS[inspectedAttribute] || []).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleQuestInspect(item.id)}
                    className="bg-[#0b1019] hover:bg-[#111726] border border-white/[0.06] hover:border-cyan-500/40 p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-slate-200 text-xs group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                        <span className="text-slate-400">{item.date}</span>
                        <span>•</span>
                        <span className="text-cyan-400">+{item.gain} {inspectedAttribute}</span>
                        <span>•</span>
                        <span className="text-amber-300">+{item.xpReward} XP</span>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 group-hover:text-cyan-400 font-mono flex items-center gap-1 shrink-0">
                      Details &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* 10. "WHAT CHANGED THIS WEEK?" SECTION                        */}
      {/* ============================================================ */}
      <div className="bg-[#0b1019] border border-white/[0.09] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            WHAT CHANGED THIS WEEK?
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Net Attribute Deltas
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Ranked Deltas */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="bg-[#070a10] border border-cyan-500/20 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Intellect
              </span>
              <span className="font-black text-cyan-300">+{attributeDeltas.intellect.delta}</span>
            </div>

            <div className="bg-[#070a10] border border-violet-500/20 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                Discipline
              </span>
              <span className="font-black text-violet-300">+{attributeDeltas.discipline.delta}</span>
            </div>

            <div className="bg-[#070a10] border border-amber-500/20 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Creativity
              </span>
              <span className="font-black text-amber-300">+{attributeDeltas.creativity.delta}</span>
            </div>

            <div className="bg-[#070a10] border border-rose-500/20 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                Strength
              </span>
              <span className="font-black text-rose-300">+{attributeDeltas.strength.delta}</span>
            </div>

            <div className="bg-[#070a10] border border-sky-500/20 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                Social
              </span>
              <span className="font-black text-sky-300">+{attributeDeltas.social.delta}</span>
            </div>

            <div className="bg-[#070a10] border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Wellness
              </span>
              <span className="font-black text-emerald-300">+{attributeDeltas.wellness.delta}</span>
            </div>
          </div>

          {/* Right: Key Summary Highlights */}
          <div className="bg-[#070a10] border border-white/[0.06] p-4 rounded-xl flex flex-col justify-around gap-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase text-[10px]">MOST ACTIVE</span>
              <span className="font-bold text-cyan-300 uppercase">
                {fastestKey} (11 Quests)
              </span>
            </div>
            <div className="h-px bg-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase text-[10px]">MOST IMPROVED</span>
              <span className="font-bold text-cyan-300 uppercase">
                {fastestKey} (+{fastestDelta})
              </span>
            </div>
            <div className="h-px bg-white/[0.04]" />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase text-[10px]">LOWEST GROWTH</span>
              <span className="font-bold text-emerald-300 uppercase">
                {slowestKey} (+{slowestDelta})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. YOUR WEEK, DAY BY DAY (RENAMED & STORY-DRIVEN)            */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            YOUR WEEK, DAY BY DAY
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Chronological progression story
          </span>
        </div>

        <div className="space-y-2.5">
          {replayDays.map((day, idx) => {
            const milestoneMeta = getMilestoneMeta(day.milestone);
            const isSelected = idx === selectedDayIndex;

            return (
              <div
                key={day.dateStr}
                onClick={() => handleDaySelect(idx)}
                className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#101726] border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.12)]'
                    : 'bg-[#0c1017] border border-white/[0.06] hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center text-center shrink-0 border ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#080c13] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold">
                      {day.dayName.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {day.dateStr.split(' ')[1]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white font-sans text-sm">
                        {day.dayName} — {day.dateStr}
                      </span>
                      <Badge variant="cyan" size="xs">
                        {day.topAttribute} FOCUS
                      </Badge>
                      {milestoneMeta && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${milestoneMeta.color}`}
                        >
                          {milestoneMeta.icon}
                          {milestoneMeta.label}
                        </span>
                      )}
                    </div>

                    {day.milestone ? (
                      <p className="text-xs text-amber-300 flex items-center gap-1 font-sans">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold text-white">{day.milestone}</span>
                      </p>
                    ) : (
                      <span className="text-xs text-slate-500 font-sans">
                        Standard execution cycle and habit momentum
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right self-end sm:self-auto shrink-0">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">CLEARED</span>
                    <span className="font-bold text-slate-200">{day.questsCompleted} Quests</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">MOMENTUM</span>
                    <span className="font-bold text-cyan-400">{day.momentumScore}%</span>
                  </div>

                  <div className="bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-300 font-bold">
                    +{day.xpEarned} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 11 & 12. ORACLE CONNECTION & NEXT WEEK FORECAST              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 11. ORACLE'S TAKE */}
        <div className="bg-gradient-to-br from-violet-950/30 via-[#0c101b] to-[#070a12] border border-violet-500/30 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                ORACLE&apos;S TAKE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Weekly Strategic Diagnostic
              </span>
            </div>

            <p className="text-sm sm:text-base font-sans font-medium text-slate-200 leading-relaxed italic">
              &ldquo;Your Intellect progression is accelerating, but your Wellness growth has slowed for two consecutive periods.&rdquo;
            </p>

            <div className="bg-[#070a10] border border-violet-500/20 rounded-xl p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[10px]">NEXT WEEK&apos;S PRIORITY</span>
                <span className="font-bold text-emerald-300 uppercase flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5" />
                  WELLNESS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[10px]">SUGGESTED TARGET</span>
                <span className="font-bold text-white">+12 Wellness</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[10px]">SUGGESTED QUESTS</span>
                <span className="text-cyan-300 font-bold">3 recovery quests • 2 social quests</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Synchronized with Oracle AI Game Master
            </span>
            {onNavigateTab && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  audioService.playTactileClick();
                  onNavigateTab('oracle');
                }}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                ASK ORACLE FOR NEXT WEEK
              </Button>
            )}
          </div>
        </div>

        {/* 12. NEXT WEEK FORECAST */}
        <div className="bg-[#0b1019] border border-white/[0.09] rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                NEXT WEEK
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                SUGGESTED FOCUS
              </span>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Derived from current progression momentum, territory mastery trajectories, and attribute balance.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="bg-[#070a10] border border-white/[0.06] p-3 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[10px]">PRIMARY FOCUS</span>
                <span className="font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                  Wellness (+12 Target)
                </span>
              </div>

              <div className="bg-[#070a10] border border-white/[0.06] p-3 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[10px]">SECONDARY FOCUS</span>
                <span className="font-bold text-violet-300 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  Discipline (Habit Locks)
                </span>
              </div>

              <div className="bg-[#070a10] border border-cyan-500/20 p-3 rounded-xl flex items-center justify-between">
                <span className="text-slate-400 uppercase text-[10px]">MILESTONE</span>
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Archive of Light &rarr; 100%
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">
              Trajectory projection derived from 7-day data
            </span>
            {onNavigateTab && (
              <button
                onClick={() => {
                  audioService.playTactileClick();
                  onNavigateTab('world');
                }}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                View World Map &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

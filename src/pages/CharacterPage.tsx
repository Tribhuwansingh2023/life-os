import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'motion/react';
import {
  PlayerProfile,
  AttributeInfo,
  InventoryItem,
  Badge as BadgeType
} from '../types';
import { useGame } from '../context/GameStateContext';
import { CharacterAvatar } from '../components/rpg/CharacterAvatar';
import { audioService } from '../services/audioService';
import {
  Brain,
  ShieldCheck,
  Sparkles,
  Dumbbell,
  HeartPulse,
  Users,
  Check,
  Lock,
  ArrowRight,
  Sparkle,
  Compass,
  Award,
  ChevronRight,
  TrendingUp,
  Shield,
  Zap,
  Info
} from 'lucide-react';

interface CharacterPageProps {
  player: PlayerProfile;
  attributes: Record<string, AttributeInfo>;
  inventory: InventoryItem[];
  badges: BadgeType[];
}

// Hook for upward number animation on page load with reduced motion check
function useCountUp(target: number, duration: number = 750): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let startTime: number | null = null;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [target, duration]);

  return value;
}

// Attribute semantic configuration
interface AttributeVisualMeta {
  key: string;
  name: string;
  humanMeaning: string;
  questsCount: number;
  nextMilestone: number;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  borderActive: string;
  weeklyDelta: number;
  highlight?: string;
}

const ATTRIBUTE_METAS: Record<string, AttributeVisualMeta> = {
  intellect: {
    key: 'intellect',
    name: 'Intellect',
    humanMeaning: 'Knowledge, logic & system design',
    questsCount: 14,
    nextMilestone: 100,
    icon: <Brain className="w-4 h-4" />,
    color: '#00f0ff',
    bgLight: 'rgba(0, 240, 255, 0.08)',
    borderActive: 'rgba(0, 240, 255, 0.4)',
    weeklyDelta: 12,
    highlight: 'Strongest trait this week'
  },
  discipline: {
    key: 'discipline',
    name: 'Discipline',
    humanMeaning: 'Willpower & habit consistency',
    questsCount: 12,
    nextMilestone: 90,
    icon: <ShieldCheck className="w-4 h-4" />,
    color: '#a855f7',
    bgLight: 'rgba(168, 85, 247, 0.08)',
    borderActive: 'rgba(168, 85, 247, 0.4)',
    weeklyDelta: 8
  },
  creativity: {
    key: 'creativity',
    name: 'Creativity',
    humanMeaning: 'Ideation, expression & craft',
    questsCount: 8,
    nextMilestone: 85,
    icon: <Sparkles className="w-4 h-4" />,
    color: '#fbbf24',
    bgLight: 'rgba(251, 191, 36, 0.08)',
    borderActive: 'rgba(251, 191, 36, 0.4)',
    weeklyDelta: 6
  },
  strength: {
    key: 'strength',
    name: 'Strength',
    humanMeaning: 'Physical vitality & resilience',
    questsCount: 7,
    nextMilestone: 75,
    icon: <Dumbbell className="w-4 h-4" />,
    color: '#f43f5e',
    bgLight: 'rgba(244, 63, 94, 0.08)',
    borderActive: 'rgba(244, 63, 94, 0.4)',
    weeklyDelta: 4
  },
  wellness: {
    key: 'wellness',
    name: 'Wellness',
    humanMeaning: 'Sleep, recovery & mental peace',
    questsCount: 4,
    nextMilestone: 65,
    icon: <HeartPulse className="w-4 h-4" />,
    color: '#10b981',
    bgLight: 'rgba(16, 185, 129, 0.08)',
    borderActive: 'rgba(16, 185, 129, 0.4)',
    weeklyDelta: 2,
    highlight: 'Needs attention this week'
  },
  social: {
    key: 'social',
    name: 'Social',
    humanMeaning: 'Community, mentorship & bonds',
    questsCount: 6,
    nextMilestone: 70,
    icon: <Users className="w-4 h-4" />,
    color: '#38bdf8',
    bgLight: 'rgba(56, 189, 248, 0.08)',
    borderActive: 'rgba(56, 189, 248, 0.4)',
    weeklyDelta: 5
  }
};

// Meaningful equipment items mapping
interface MeaningfulGearMeta {
  origin: string;
  effect: string;
}

const GEAR_STORY_MAP: Record<string, MeaningfulGearMeta> = {
  item_01: {
    origin: 'Earned after 5 deep-focus quests.',
    effect: '+15% Intellect XP during 60+ minute focus sessions.'
  },
  item_02: {
    origin: 'Earned after sustaining a 10-day momentum streak.',
    effect: 'Protects your momentum when you miss a day.'
  },
  item_03: {
    origin: 'Earned by alternating mental and physical quests in the same week.',
    effect: '+10% XP when balancing disparate attributes.'
  },
  item_06: {
    origin: 'Earned by achieving 50%+ world mastery.',
    effect: 'Doubles critical damage during boss battles.'
  },
  item_07: {
    origin: 'Forged during morning kinetic workouts.',
    effect: '+5% Strength yield on physical check-ins.'
  }
};

// Milestone badges story mapping
interface BadgeStoryMeta {
  condition: string;
  humanNote: string;
}

const BADGE_STORY_MAP: Record<string, BadgeStoryMeta> = {
  bdg_01: {
    condition: '100 quests completed',
    humanNote: 'You kept showing up.'
  },
  bdg_02: {
    condition: 'Intellect reached Level 20',
    humanNote: 'Deep system architecture mastery.'
  },
  bdg_03: {
    condition: 'Defeated an S-tier Procrastination Boss',
    humanNote: 'You broke through resistance.'
  },
  bdg_04: {
    condition: '14-day unbroken daily streak',
    humanNote: 'Built by daily consistency.'
  },
  bdg_05: {
    condition: 'Level 15 across all 6 attributes',
    humanNote: 'True equilibrium in work and life.'
  },
  bdg_06: {
    condition: '100% world mastery completed',
    humanNote: 'Master of all six territories.'
  }
};

export const CharacterPage: React.FC<CharacterPageProps> = ({
  player: propPlayer,
  attributes: propAttributes,
  inventory: propInventory,
  badges: propBadges
}) => {
  const navigate = useNavigate();
  const { player: gamePlayer, attributes: gameAttributes, inventory: gameInventory, badges: gameBadges, toggleEquipItem } = useGame();

  // Prefer context data for live responsiveness, fallback to props
  const player = gamePlayer || propPlayer;
  const attributes = gameAttributes || propAttributes;
  const inventory = gameInventory || propInventory;
  const badges = gameBadges || propBadges;

  // Selected attribute for inspecting details
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>('intellect');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Animated counters
  const animatedXp = useCountUp(player.currentXp);
  const animatedStreak = useCountUp(player.streakDays);
  const animatedQuests = useCountUp(player.completedQuestsCount);
  const animatedMastery = useCountUp(player.worldMasteryPercentage);

  // Animated delta values for weekly summary
  const dIntellect = useCountUp(12);
  const dDiscipline = useCountUp(8);
  const dCreativity = useCountUp(6);
  const dStrength = useCountUp(4);
  const dWellness = useCountUp(2);
  const dSocial = useCountUp(5);

  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  const equippedGear = inventory.filter((i) => i.equipped);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 px-1 sm:px-2">
      {/* ========================================================================= */}
      {/* 1. CHARACTER HERO — Genuine RPG Character Screen Centerpiece */}
      {/* ========================================================================= */}
      <section
        aria-label="Character Profile"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f1420] via-[#0a0e16] to-[#07090e] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl"
      >
        {/* Ambient subtle light accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 w-full lg:w-auto">
            {/* Prominent Abstract RPG Avatar Silhouette */}
            <CharacterAvatar level={player.level} size="lg" className="shrink-0" />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-wider">
                  {player.username || 'TRIBHUWAN'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold tracking-wide">
                  LEVEL {player.level}
                </span>
              </div>

              {/* Class Title */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-amber-400 font-mono font-bold text-sm tracking-wide">
                  DISCIPLINED SAGE
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">
                  {player.characterClass || 'Quantum Architect'}
                </span>
              </div>

              {/* Short Human Character Statement */}
              <p className="text-sm text-slate-300 italic font-sans pt-1 max-w-md">
                "Built by consistency."
              </p>
            </div>
          </div>

          {/* Three Meaningful Progression Stats (NOT Generic KPI Cards) */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto max-w-lg lg:max-w-none">
            <div className="bg-[#0c1017]/90 border border-white/[0.08] rounded-xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Momentum
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-cyan-300 tabular-nums">
                {animatedStreak}
              </span>
              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                Day Streak
              </span>
            </div>

            <div className="bg-[#0c1017]/90 border border-white/[0.08] rounded-xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Quests
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tabular-nums">
                {animatedQuests}
              </span>
              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                Completed
              </span>
            </div>

            <div className="bg-[#0c1017]/90 border border-white/[0.08] rounded-xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                World
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-purple-300 tabular-nums">
                {animatedMastery}%
              </span>
              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                Progress
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold">EXPERIENCE PROGRESS</span>
              <span className="text-cyan-400">({xpPercent}%)</span>
            </div>
            <div className="text-slate-300">
              <span className="text-cyan-300 font-bold tabular-nums">
                {animatedXp.toLocaleString()}
              </span>{' '}
              <span className="text-slate-500">/</span>{' '}
              <span className="text-slate-400 tabular-nums">
                {player.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
          </div>

          <div className="w-full bg-[#07090e] rounded-full h-2.5 overflow-hidden border border-white/10 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Level {player.level}</span>
            <span>{player.nextLevelXp - player.currentXp} XP until Level {player.level + 1}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BUILD SUMMARY — "YOUR BUILD THIS WEEK" */}
      {/* ========================================================================= */}
      <section
        aria-label="Weekly Build Progression"
        className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-6 shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>YOUR BUILD THIS WEEK</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Attribute shifts recorded across your last 7 days of completed quests.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono self-start sm:self-auto">
            <Sparkle className="w-3 h-3 text-cyan-400" />
            <span>Active Momentum</span>
          </div>
        </div>

        {/* 6 Attributes Weekly Deltas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Intellect */}
          <div className="bg-[#07090e] border border-cyan-500/20 rounded-xl p-3 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Intellect
            </span>
            <span className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
              +{dIntellect}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              420 XP gained
            </span>
          </div>

          {/* Discipline */}
          <div className="bg-[#07090e] border border-purple-500/20 rounded-xl p-3 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Discipline
            </span>
            <span className="text-lg font-mono font-bold text-purple-400 tabular-nums">
              +{dDiscipline}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              310 XP gained
            </span>
          </div>

          {/* Creativity */}
          <div className="bg-[#07090e] border border-amber-500/20 rounded-xl p-3 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Creativity
            </span>
            <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
              +{dCreativity}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              240 XP gained
            </span>
          </div>

          {/* Strength */}
          <div className="bg-[#07090e] border border-rose-500/20 rounded-xl p-3 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Strength
            </span>
            <span className="text-lg font-mono font-bold text-rose-400 tabular-nums">
              +{dStrength}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              180 XP gained
            </span>
          </div>

          {/* Wellness */}
          <div className="bg-[#07090e] border border-emerald-500/20 rounded-xl p-3 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Wellness
            </span>
            <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
              +{dWellness}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              90 XP gained
            </span>
          </div>

          {/* Social */}
          <div className="bg-[#07090e] border border-sky-500/20 rounded-xl p-3 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Social
            </span>
            <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">
              +{dSocial}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              190 XP gained
            </span>
          </div>
        </div>

        {/* Natural Language Interpretation */}
        <div className="mt-5 p-4 rounded-xl bg-[#07090e]/90 border border-white/[0.06] flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            <strong className="text-white font-mono font-medium">Build Interpretation: </strong>
            "You spent most of this week learning, building and staying consistent."
            <span className="text-slate-400 block sm:inline sm:ml-1 mt-1 sm:mt-0">
              Intellect and Discipline are powering ahead, while Wellness presents an opportunity for rest and restoration.
            </span>
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIX ATTRIBUTES — Meaningful, Understandable RPG Cards */}
      {/* ========================================================================= */}
      <section aria-label="Six Attributes" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wide">
              ATTRIBUTES
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Every real action shapes one of these six foundational traits.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Click any attribute to inspect milestones
          </span>
        </div>

        {/* 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(ATTRIBUTE_METAS).map((meta) => {
            const attrData = attributes[meta.key];
            const currentValue = attrData?.value ?? 60;
            const maxValue = attrData?.maxValue ?? 100;
            const percent = Math.min(100, Math.round((currentValue / maxValue) * 100));
            const isSelected = selectedAttributeKey === meta.key;

            return (
              <div
                key={meta.key}
                onClick={() => {
                  audioService.playTactileClick();
                  setSelectedAttributeKey(meta.key);
                }}
                className={`group relative rounded-xl p-5 transition-all cursor-pointer bg-[#0b0f17] border ${
                  isSelected
                    ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-[#0f1422]'
                    : 'border-white/[0.08] hover:border-white/[0.2] hover:bg-[#0e131e]'
                }`}
              >
                {/* Header: Name, Icon, Level */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: meta.bgLight,
                        color: meta.color,
                        border: `1px solid ${meta.color}44`
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                        {meta.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Level {attrData?.level ?? 15}
                      </span>
                    </div>
                  </div>

                  {/* Value & Weekly Change */}
                  <div className="text-right font-mono">
                    <div className="text-base font-black text-white tabular-nums">
                      {currentValue} <span className="text-xs text-slate-500 font-normal">/ {maxValue}</span>
                    </div>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: meta.color }}
                    >
                      +{meta.weeklyDelta} this week
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#07090e] rounded-full h-2 overflow-hidden border border-white/[0.06] mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: meta.color,
                      boxShadow: `0 0 8px ${meta.color}66`
                    }}
                  />
                </div>

                {/* What the attribute represents */}
                <p className="text-xs text-slate-300 font-sans italic mb-3">
                  "{meta.humanMeaning}"
                </p>

                {/* Footer: Quests completed & Next Milestone */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {meta.questsCount} quests completed
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 uppercase">NEXT MILESTONE</span>
                    <span className="font-bold text-amber-300 tabular-nums">
                      {meta.nextMilestone}
                    </span>
                  </div>
                </div>

                {/* Highlight chip if present */}
                {meta.highlight && (
                  <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{meta.highlight}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ORACLE BUILD INSIGHT — Meaningful Game Engine Guidance */}
      {/* ========================================================================= */}
      <section
        aria-label="Oracle Build Insight"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c121e] via-[#090e17] to-[#070a10] border border-cyan-500/30 p-6 sm:p-7 shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase">
              <Sparkle className="w-4 h-4" />
              <span>THE ORACLE NOTICED SOMETHING</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Generated from weekly gameplay
            </span>
          </div>

          {/* Observation */}
          <div className="p-4 rounded-xl bg-[#07090e]/80 border border-white/[0.06]">
            <p className="text-sm sm:text-base text-white font-sans leading-relaxed">
              "Your <strong className="text-cyan-300">Intellect</strong> has grown{' '}
              <span className="text-cyan-400 font-mono font-bold">+12</span> this week,
              but <strong className="text-emerald-300">Wellness</strong> has slowed by{' '}
              <span className="text-rose-400 font-mono font-bold">18%</span>."
            </p>
          </div>

          {/* Recommendation & Why */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Next Best Quest */}
            <div className="bg-[#0a0f18] rounded-xl p-4 border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  NEXT BEST QUEST
                </span>
                <h4 className="text-base font-mono font-bold text-white tracking-wide">
                  "20-Minute Warrior"
                </h4>
                <div className="flex items-center gap-2.5 mt-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                    +35 Wellness XP
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">
                    +10 Momentum
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    audioService.playTactileClick();
                    navigate({ to: '/quests' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] cursor-pointer"
                >
                  <span>VIEW QUEST</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Why */}
            <div className="bg-[#0a0f18] rounded-xl p-4 border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  WHY?
                </span>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  "Your recent activity is heavily weighted toward learning and coding. This quest helps restore balance before momentum decay sets in."
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Sanctuary Grove Realm</span>
                <span className="text-emerald-400">Recommended for today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CLASS EVOLUTION — Visual Progression Path with Nodes */}
      {/* ========================================================================= */}
      <section
        aria-label="Class Evolution"
        className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-md space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wide">
              CLASS EVOLUTION
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Higher classes unlock passive mastery multipliers and unique abilities.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400">
            <Sparkle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">7 levels until your next evolution</span>
          </div>
        </div>

        {/* Visual Progression Path with Connecting Nodes */}
        <div className="relative">
          {/* Vertical Connecting line on mobile, Horizontal on larger screens */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-emerald-500/40 via-cyan-500 to-slate-700 -translate-y-1/2 z-0" />
          <div className="md:hidden absolute top-8 bottom-8 left-6 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-400 to-slate-700 z-0" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Completed */}
            <div
              onMouseEnter={() => setHoveredNode('tier1')}
              onMouseLeave={() => setHoveredNode(null)}
              className="bg-[#07090e]/95 border border-emerald-500/30 rounded-xl p-4 transition-all hover:border-emerald-400 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    COMPLETED
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Lv. 1 – 10</span>
              </div>

              <h4 className="text-sm font-mono font-bold text-slate-200">
                SYSTEM INITIATE
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Unlocked basic habit logging and momentum tracker.
              </p>
            </div>

            {/* Step 2: CURRENT CLASS (Prominent) */}
            <div
              onMouseEnter={() => setHoveredNode('tier2')}
              onMouseLeave={() => setHoveredNode(null)}
              className="relative bg-gradient-to-b from-[#0f1826] to-[#0a101a] border-2 border-cyan-400 rounded-xl p-5 shadow-[0_0_25px_rgba(0,240,255,0.2)] transform md:-translate-y-1 transition-all"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black font-mono font-black text-[10px] px-3 py-0.5 rounded-full tracking-wider shadow-md whitespace-nowrap">
                CURRENT CLASS
              </div>

              <div className="flex items-center justify-between mb-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center font-black text-xs">
                    17
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                    ACTIVE TIER
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">Lv. 11 – 24</span>
              </div>

              <h4 className="text-base font-mono font-black text-white tracking-wide">
                QUANTUM ARCHITECT
              </h4>
              <p className="text-xs text-slate-300 font-sans mt-1">
                +15% XP on architecture & deep focus quests. +10% Momentum defense against burnout.
              </p>
            </div>

            {/* Step 3: Locked */}
            <div
              onMouseEnter={() => setHoveredNode('tier3')}
              onMouseLeave={() => setHoveredNode(null)}
              className="bg-[#07090e]/80 border border-white/[0.08] rounded-xl p-4 opacity-75 hover:opacity-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    LOCKED — LEVEL 25
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-500 font-bold">Lv. 25+</span>
              </div>

              <h4 className="text-sm font-mono font-bold text-slate-300">
                NEXUS SOVEREIGN
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Global momentum decay immunity and multi-domain resonance across all six territories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EQUIPMENT — Meaningful, Behavior-Linked Relics */}
      {/* ========================================================================= */}
      <section
        aria-label="Equipped Gear and Relics"
        className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-md space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wide">
              EQUIPMENT
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Every relic was forged from an actual habit milestone.
            </p>
          </div>

          <button
            onClick={() => {
              audioService.playTactileClick();
              navigate({ to: '/inventory' });
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Armory & Relic Forge</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gear Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.slice(0, 4).map((item) => {
            const story = GEAR_STORY_MAP[item.id] || {
              origin: 'Earned through focused persistence.',
              effect: item.perkDescription
            };

            const rarityBadge = {
              legendary: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
              epic: 'bg-purple-500/15 border-purple-400/40 text-purple-300',
              rare: 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300',
              common: 'bg-slate-700/20 border-slate-600/30 text-slate-300'
            }[item.rarity] || 'bg-slate-700/20 border-slate-600/30 text-slate-300';

            return (
              <div
                key={item.id}
                className={`rounded-xl p-4 bg-[#07090e] border transition-all ${
                  item.equipped
                    ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                    : 'border-white/[0.06] opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans italic mt-0.5">
                      "{story.origin}"
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${rarityBadge}`}>
                      {item.rarity}
                    </span>
                    {item.equipped && (
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Effect</span>
                    <span className="text-slate-200">{story.effect}</span>
                  </div>

                  <button
                    onClick={() => {
                      audioService.playTactileClick();
                      toggleEquipItem(item.id);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ml-3 shrink-0 ${
                      item.equipped
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30'
                    }`}
                  >
                    {item.equipped ? 'Unequip' : 'Equip'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BADGES — Collectible Showcase with Real Achievement Conditions */}
      {/* ========================================================================= */}
      <section
        aria-label="Milestone Badges"
        className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-md space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wide">
              MILESTONE BADGES
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Permanent proof of commitments kept.
            </p>
          </div>

          <span className="text-xs font-mono text-amber-400">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.map((badge) => {
            const story = BADGE_STORY_MAP[badge.id] || {
              condition: badge.description,
              humanNote: 'Milestone earned.'
            };

            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 transition-all ${
                  badge.unlocked
                    ? 'bg-[#07090e] border border-amber-500/30 hover:border-amber-400/60 shadow-sm'
                    : 'bg-[#07090e]/50 border border-white/[0.04] opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-800 text-slate-600 border border-slate-700'
                    }`}
                  >
                    {badge.unlocked ? (
                      <Award className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-mono font-bold text-white tracking-wide truncate">
                        {badge.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {badge.unlocked ? badge.unlockedDate || 'Unlocked' : 'Locked'}
                      </span>
                    </div>

                    <p className="text-xs text-amber-300/90 font-mono mt-1">
                      {story.condition}
                    </p>

                    <p className="text-xs text-slate-400 font-sans italic mt-0.5">
                      "{story.humanNote}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

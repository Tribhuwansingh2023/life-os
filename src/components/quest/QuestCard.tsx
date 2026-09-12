import React, { useState } from 'react';
import { Quest, AttributeKey, QuestDifficulty } from '../../types';
import { Badge } from '../ui/Badge';
import {
  Clock,
  Zap,
  Coins,
  Check,
  Sparkles,
  Flame,
  Swords,
  Brain,
  Dumbbell,
  ShieldCheck,
  HeartPulse,
  Users,
  Play,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Trash2,
  Pencil
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onInspect: (quest: Quest) => void;
  onDelete?: (id: string) => void;
  onEdit?: (quest: Quest) => void;
  isInProgress?: boolean;
  onToggleStart?: (id: string) => void;
  className?: string;
}

const DIFFICULTY_CONFIG: Record<
  QuestDifficulty,
  { label: string; tooltip: string; badgeClass: string }
> = {
  E: {
    label: 'C',
    tooltip: 'Quick win — Takes little time, easy momentum',
    badgeClass: 'text-slate-300 border-slate-600 bg-slate-800/60'
  },
  D: {
    label: 'C',
    tooltip: 'Quick win — Immediate momentum builder',
    badgeClass: 'text-emerald-300 border-emerald-500/50 bg-emerald-950/40'
  },
  C: {
    label: 'C',
    tooltip: 'Quick win — Takes under 30 min, great momentum',
    badgeClass: 'text-emerald-300 border-emerald-500/50 bg-emerald-950/40'
  },
  B: {
    label: 'B',
    tooltip: 'Solid challenge — Core daily habit or focus session',
    badgeClass: 'text-amber-300 border-amber-500/50 bg-amber-950/40'
  },
  A: {
    label: 'A',
    tooltip: 'High leverage — Deep work, big attribute advancement',
    badgeClass: 'text-violet-300 border-violet-500/50 bg-violet-950/40'
  },
  S: {
    label: 'S',
    tooltip: 'Major milestone — Peak challenge, highest rewards',
    badgeClass: 'text-rose-300 border-rose-500/60 bg-rose-950/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
  }
};

const ATTRIBUTE_ICONS: Record<AttributeKey, React.ReactNode> = {
  intellect: <Brain className="w-3.5 h-3.5 text-cyan-400" />,
  strength: <Dumbbell className="w-3.5 h-3.5 text-rose-400" />,
  discipline: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />,
  creativity: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
  wellness: <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />,
  social: <Users className="w-3.5 h-3.5 text-sky-400" />
};

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  intellect: 'Intellect',
  strength: 'Strength',
  discipline: 'Discipline',
  creativity: 'Creativity',
  wellness: 'Wellness',
  social: 'Social'
};

const ATTRIBUTE_COLORS: Record<AttributeKey, string> = {
  intellect: 'text-cyan-300 border-cyan-500/30 bg-cyan-950/25',
  strength: 'text-rose-300 border-rose-500/30 bg-rose-950/25',
  discipline: 'text-purple-300 border-purple-500/30 bg-purple-950/25',
  creativity: 'text-amber-300 border-amber-500/30 bg-amber-950/25',
  wellness: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/25',
  social: 'text-sky-300 border-sky-500/30 bg-sky-950/25'
};

const TYPE_LABELS: Record<string, string> = {
  daily: 'Daily',
  epic: 'Milestone',
  habit: 'Habit',
  boss_raid: 'Boss Battle'
};

// Generates dynamic, meaningful "Why this quest?" explanations
function getWhyThisQuestReason(quest: Quest): string | null {
  if (quest.isRecommendedByOracle) {
    return "The Oracle recommended this to balance your recent high-focus Intellect sprints.";
  }
  if (quest.type === 'boss_raid') {
    return "Deals 350 direct damage to defeat Chronos the Procrastinator.";
  }
  if (quest.streakCount && quest.streakCount >= 5) {
    return `Continues your ${quest.streakCount}-day consistency streak for bonus momentum.`;
  }
  if (quest.category === 'intellect') {
    return "You're close to your next Intellect milestone (92/100).";
  }
  if (quest.category === 'wellness') {
    return "Your Wellness progression has fallen behind this week — perfect for restorative balance.";
  }
  if (quest.category === 'strength') {
    return "Maintains physical energy and vital stamina for deep work.";
  }
  if (quest.category === 'discipline') {
    return "High-leverage focus session that shields your momentum against decay.";
  }
  if (quest.category === 'creativity') {
    return "Unlocks higher craft output and builds toward your next milestone.";
  }
  if (quest.category === 'social') {
    return "Expands team mentorship and builds collaboration capital.";
  }
  return null;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onInspect,
  onDelete,
  onEdit,
  isInProgress = false,
  onToggleStart,
  className = ''
}) => {
  const isCompleted = quest.status === 'completed';
  const isBossQuest = quest.type === 'boss_raid';
  const [showTooltip, setShowTooltip] = useState(false);

  const diffConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.C;
  const whyReason = getWhyThisQuestReason(quest);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      audioService.playTactileClick();
      onComplete(quest.id);
    }
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playTactileClick();
    if (onToggleStart) {
      onToggleStart(quest.id);
    }
  };

  return (
    <div
      onClick={() => onInspect(quest)}
      className={`group relative rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border ${
        isCompleted
          ? 'bg-[#080c13]/70 border-white/[0.05] opacity-75'
          : isBossQuest
          ? 'bg-[#0d0910] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.12)] hover:border-rose-400'
          : quest.isRecommendedByOracle
          ? 'bg-[#0b121e] border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:border-cyan-400'
          : isInProgress
          ? 'bg-[#0a121c] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.18)]'
          : 'bg-[#0b0f17] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#0e1420]'
      } ${className}`}
    >
      {/* Top Banner for Special Quests */}
      {quest.isRecommendedByOracle && !isCompleted && (
        <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-black px-4 py-1 flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-black" />
            <span>ORACLE RECOMMENDED QUEST</span>
          </div>
          <span className="text-[9px] font-bold text-black/80">HIGH LEVERAGE</span>
        </div>
      )}

      {isBossQuest && !isCompleted && (
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white px-4 py-1 flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Swords className="w-3 h-3 text-white" />
            <span>BOSS BATTLE // CHRONOS THE PROCRASTINATOR</span>
          </div>
          <span className="text-[9px] font-bold text-amber-200">DEALS 350 BOSS DAMAGE</span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Row 1: Badges & Tags ([DIFFICULTY] [ATTRIBUTE] [TYPE] [STREAK]) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Difficulty Badge with Tooltip */}
            <div
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded border inline-flex items-center gap-1 ${diffConfig.badgeClass}`}
              >
                <span>TIER {diffConfig.label}</span>
                <HelpCircle className="w-2.5 h-2.5 opacity-60" />
              </span>

              {showTooltip && (
                <div className="absolute left-0 -top-8 z-30 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {diffConfig.tooltip}
                </div>
              )}
            </div>

            {/* Attribute Badge */}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1.5 ${
                ATTRIBUTE_COLORS[quest.category]
              }`}
            >
              {ATTRIBUTE_ICONS[quest.category]}
              <span>{ATTRIBUTE_LABELS[quest.category]}</span>
            </span>

            {/* Quest Type */}
            <span className="text-[10px] text-slate-400 uppercase font-mono px-2 py-0.5 rounded bg-[#07090e] border border-white/[0.06]">
              {TYPE_LABELS[quest.type] || quest.type}
            </span>

            {/* Streak Badge if applicable */}
            {quest.streakCount && quest.streakCount > 1 && (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/30 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{quest.streakCount} DAY STREAK</span>
              </span>
            )}
          </div>

          {/* Time Estimate & Delete action */}
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{quest.timeEstimateMinutes} min</span>
            </div>
            {onEdit && !isCompleted && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  audioService.playTactileClick();
                  onEdit(quest);
                }}
                title="Edit Quest Parameters"
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all cursor-pointer"
                aria-label="Edit Quest"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Permanently delete quest "${quest.title}"?`)) {
                    audioService.playTactileClick();
                    onDelete(quest.id);
                  }
                }}
                title="Delete Quest"
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label="Delete Quest"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Title & Completion Checkbox */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <h3
              className={`text-base sm:text-lg font-bold font-sans tracking-tight transition-colors ${
                isCompleted
                  ? 'text-slate-400 font-medium'
                  : 'text-white group-hover:text-cyan-300'
              }`}
            >
              {quest.title}
            </h3>

            {/* What I need to do (Description) */}
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mt-1">
              {quest.description}
            </p>
          </div>

          {/* Quick Checkbox Button */}
          <button
            onClick={handleCheckboxClick}
            disabled={isCompleted}
            aria-label={isCompleted ? 'Completed' : 'Mark quest complete'}
            className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 cursor-default'
                : 'bg-[#07090e] border-white/20 hover:border-cyan-400 hover:bg-cyan-500/20 text-transparent hover:text-cyan-300'
            }`}
          >
            <Check className={`w-4 h-4 stroke-[2.5] ${isCompleted ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
          </button>
        </div>

        {/* Tags */}
        {quest.dnaTags && quest.dnaTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {quest.dnaTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-slate-400 bg-[#07090e] px-2 py-0.5 rounded border border-white/[0.04]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Rewards Bar */}
        <div className="flex flex-wrap items-center gap-3 py-2.5 px-3 rounded-lg bg-[#07090e]/90 border border-white/[0.05] font-mono text-xs mb-3">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>+{quest.xpReward} XP</span>
          </div>

          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>+{quest.goldReward} GOLD</span>
          </div>

          {quest.momentumBoost > 0 && (
            <div className="flex items-center gap-1 text-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>+{quest.momentumBoost}% Momentum</span>
            </div>
          )}

          {isBossQuest && (
            <div className="ml-auto text-rose-400 font-bold flex items-center gap-1 text-[11px]">
              <Swords className="w-3.5 h-3.5" />
              <span>CHRONOS −{quest.xpReward} HP</span>
            </div>
          )}
        </div>

        {/* "WHY THIS QUEST?" Explanation Block */}
        {!isCompleted && whyReason && (
          <div className="p-2.5 rounded-lg bg-[#0c121e]/80 border border-cyan-500/20 mb-3 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                WHY THIS QUEST?
              </span>
              <p className="text-xs text-slate-300 font-sans italic">
                "{whyReason}"
              </p>
            </div>
          </div>
        )}

        {/* Bottom Interactive Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">COMPLETED TODAY</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">+{quest.xpReward} XP earned</span>
            </div>
          ) : isInProgress ? (
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold">IN PROGRESS // ACTIVE FOCUS BLOCK</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">
              Click card to view details
            </span>
          )}

          {/* Action CTA Button */}
          {!isCompleted && (
            <button
              onClick={isInProgress ? handleCheckboxClick : handleStartClick}
              className={`px-3.5 py-1.5 rounded-lg font-mono font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                isInProgress
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                  : isBossQuest
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : quest.isRecommendedByOracle
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'bg-white/10 hover:bg-cyan-400 hover:text-black text-slate-200 border border-white/20 hover:border-cyan-300'
              }`}
            >
              {isInProgress ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COMPLETE QUEST ✓</span>
                </>
              ) : quest.isRecommendedByOracle ? (
                <>
                  <span>ACCEPT QUEST</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              ) : isBossQuest ? (
                <>
                  <Swords className="w-3 h-3" />
                  <span>START BATTLE →</span>
                </>
              ) : (
                <>
                  <span>START QUEST →</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

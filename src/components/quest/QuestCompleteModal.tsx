import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Quest, AttributeKey, LevelUpEvent } from '../../types';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  Coins,
  Zap,
  Swords,
  CheckCircle2,
  Sliders,
  ArrowRight,
  TrendingUp,
  Brain,
  Dumbbell,
  ShieldCheck,
  HeartPulse,
  Users
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export type DifficultyRating = 'trivial' | 'accurate' | 'challenging' | 'extreme';

interface QuestCompleteModalProps {
  isOpen: boolean;
  quest: Quest | null;
  xpEarned?: number;
  goldEarned?: number;
  momentumEarned?: number;
  bossDamageDealt?: number;
  levelUpEvent?: LevelUpEvent | null;
  onClose: () => void;
  onConfirmRating: (
    questId: string,
    rating: DifficultyRating,
    attributeAdjustments: { attribute: AttributeKey; gain: number }[]
  ) => void;
}

const RATING_OPTIONS: {
  id: DifficultyRating;
  label: string;
  tag: string;
  multiplier: number;
  color: string;
}[] = [
  {
    id: 'trivial',
    label: 'Quick Win',
    tag: 'Felt effortless',
    multiplier: 0.8,
    color: '#94a3b8'
  },
  {
    id: 'accurate',
    label: 'Accurate',
    tag: 'Just right',
    multiplier: 1.0,
    color: '#00f0ff'
  },
  {
    id: 'challenging',
    label: 'Challenging',
    tag: 'Pushed limits (+25% XP)',
    multiplier: 1.25,
    color: '#f59e0b'
  },
  {
    id: 'extreme',
    label: 'Breakthrough',
    tag: 'Peak output (+50% XP)',
    multiplier: 1.5,
    color: '#f43f5e'
  }
];

const ATTRIBUTE_ICONS: Record<string, React.ReactNode> = {
  intellect: <Brain className="w-3.5 h-3.5 text-cyan-400" />,
  strength: <Dumbbell className="w-3.5 h-3.5 text-rose-400" />,
  discipline: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />,
  creativity: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
  wellness: <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />,
  social: <Users className="w-3.5 h-3.5 text-sky-400" />
};

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({
  isOpen,
  quest,
  xpEarned = 0,
  goldEarned = 0,
  momentumEarned = 0,
  bossDamageDealt = 0,
  levelUpEvent,
  onClose,
  onConfirmRating
}) => {
  const [selectedRating, setSelectedRating] = useState<DifficultyRating>('accurate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Trigger high-impact celebratory feedback
  useEffect(() => {
    if (isOpen) {
      setSelectedRating('accurate');
      audioService.playQuestComplete();

      if (!shouldReduceMotion) {
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#f59e0b', '#8b5cf6', '#10b981', '#ffffff']
          });
        } catch {
          // Fallback
        }
      }
    }
  }, [isOpen, shouldReduceMotion]);

  if (!isOpen || !quest) return null;

  const currentOption = RATING_OPTIONS.find((opt) => opt.id === selectedRating) || RATING_OPTIONS[1];

  // Calculate adjusted attribute values based on selected difficulty rating
  const adjustedAttributes = (quest.attributesAffected || []).map((attr) => {
    const baseGain = attr.gain;
    const calibratedGain = Math.max(1, Math.round(baseGain * currentOption.multiplier));
    return {
      attribute: attr.attribute,
      baseGain,
      calibratedGain,
      delta: calibratedGain - baseGain
    };
  });

  const handleConfirm = () => {
    audioService.playTactileClick();
    setIsSubmitting(true);

    const payload = adjustedAttributes.map((a) => ({
      attribute: a.attribute,
      gain: a.calibratedGain
    }));

    onConfirmRating(quest.id, selectedRating, payload);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  const primaryAttribute = quest.attributesAffected?.[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />
        {/* Centering wrapper */}
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        {/* Modal Container */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 15 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0b0f17] border border-cyan-500/40 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.2)] z-10 overflow-hidden my-8"
          style={{ maxHeight: '90dvh', overflowY: 'auto', overscrollBehavior: 'contain' }}
          id="quest-complete-celebration-modal"
        >
          {/* Subtle Ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Celebratory Header */}
          <div className="text-center mb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>

            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-black bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 inline-block mb-1.5">
              QUEST COMPLETE
            </span>

            <h2 className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight">
              {quest.title}
            </h2>

            <p className="text-sm font-sans text-cyan-300 font-medium mt-1">
              "Your character just got stronger."
            </p>
          </div>

          {/* Core Rewards Breakdown: XP, Gold, Attribute, Momentum */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono mb-5">
            <div className="bg-[#07090e] p-3 rounded-xl border border-cyan-500/30 text-center">
              <span className="text-[10px] text-slate-400 block uppercase mb-0.5">XP GAINED</span>
              <div className="flex items-center justify-center gap-1 text-cyan-300 font-black text-base">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                +{xpEarned || quest.xpReward}
              </div>
            </div>

            <div className="bg-[#07090e] p-3 rounded-xl border border-amber-500/30 text-center">
              <span className="text-[10px] text-slate-400 block uppercase mb-0.5">GOLD EARNED</span>
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-base">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                +{goldEarned || quest.goldReward}
              </div>
            </div>

            <div className="bg-[#07090e] p-3 rounded-xl border border-purple-500/30 text-center">
              <span className="text-[10px] text-slate-400 block uppercase mb-0.5">ATTRIBUTE</span>
              <div className="flex items-center justify-center gap-1 text-purple-300 font-black text-base capitalize">
                {ATTRIBUTE_ICONS[primaryAttribute?.attribute || quest.category]}
                +{primaryAttribute?.gain || 6}
              </div>
            </div>

            <div className="bg-[#07090e] p-3 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-[10px] text-slate-400 block uppercase mb-0.5">MOMENTUM</span>
              <div className="flex items-center justify-center gap-1 text-emerald-300 font-black text-base">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                +{momentumEarned || quest.momentumBoost}%
              </div>
            </div>
          </div>

          {/* Level Up Banner if triggered */}
          {levelUpEvent && (
            <div className="mb-5 bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-violet-500/20 border border-amber-400/50 p-3.5 rounded-xl flex items-center gap-3 text-xs font-mono">
              <div className="p-2 rounded-lg bg-amber-500/30 text-amber-300 font-black text-sm">
                LV.{levelUpEvent.newLevel}
              </div>
              <div>
                <span className="font-bold text-amber-300 block">LEVEL UP! YOU ARE NOW LEVEL {levelUpEvent.newLevel}</span>
                <span className="text-slate-300 text-[11px] font-sans">
                  +{levelUpEvent.bonusGold} Gold bonus added to your vault.
                </span>
              </div>
            </div>
          )}

          {/* Difficulty Feeling Calibration (Optional fine-tuning) */}
          <div className="bg-[#07090e] border border-white/[0.08] rounded-xl p-3.5 mb-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                HOW DID THIS QUEST FEEL?
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Optional attribute calibration
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RATING_OPTIONS.map((opt) => {
                const isSelected = selectedRating === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      audioService.playTactileClick();
                      setSelectedRating(opt.id);
                    }}
                    className={`p-2 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white'
                        : 'bg-[#0b0f17] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className="text-xs font-bold"
                        style={{ color: isSelected ? opt.color : undefined }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                    </div>
                    <span className="text-[9px] text-slate-400 block font-sans truncate">
                      {opt.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={isSubmitting}
              icon={<TrendingUp className="w-4 h-4" />}
            >
              {isSubmitting ? 'SAVING...' : 'CLAIM REWARDS'}
            </Button>
          </div>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

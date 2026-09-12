import React from 'react';
import { Quest } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Clock, Zap, Coins, CheckCircle, Tag, TrendingUp, Sparkles, Swords } from 'lucide-react';

interface QuestDetailModalProps {
  quest: Quest | null;
  onClose: () => void;
  onComplete: (id: string) => void;
}

export const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  quest,
  onClose,
  onComplete
}) => {
  if (!quest) return null;

  const isCompleted = quest.status === 'completed';
  const isBossQuest = quest.type === 'boss_raid';

  return (
    <Modal
      isOpen={!!quest}
      onClose={onClose}
      title="QUEST DETAILS"
      subtitle={`Tier ${quest.difficulty} • ${quest.category.toUpperCase()} • ${quest.type.replace('_', ' ').toUpperCase()}`}
      maxWidth="lg"
    >
      <div className="space-y-4 font-mono">
        {/* Title and status */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded font-black border border-cyan-500/40 bg-cyan-950/30 text-cyan-300">
                TIER {quest.difficulty}
              </span>
              <Badge variant="cyan" size="xs">
                {quest.category}
              </Badge>
              <span className="text-xs text-slate-400 capitalize">
                {quest.type.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-sans">{quest.title}</h3>
          </div>

          <div className="shrink-0 text-right">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" />
                COMPLETED
              </span>
            ) : (
              <span className="text-xs text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-500/30 font-bold">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Narrative Description */}
        <div className="bg-[#090d14] p-3.5 rounded-xl border border-white/[0.05]">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
            WHAT YOU NEED TO DO
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            {quest.description}
          </p>
        </div>

        {/* Tags breakdown */}
        <div className="bg-[#090d14] p-3.5 rounded-xl border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 mb-2">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">TAGS & TIME COMMITMENT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {quest.dnaTags.map((tag) => (
              <div
                key={tag}
                className="bg-[#101622] p-2 rounded-lg border border-white/[0.06] flex items-center justify-between"
              >
                <span className="text-slate-300">#{tag}</span>
                <span className="text-[10px] text-cyan-400 font-medium">Tag</span>
              </div>
            ))}
            <div className="bg-[#101622] p-2 rounded-lg border border-white/[0.06] flex items-center justify-between">
              <span className="text-slate-300">Time Estimate</span>
              <span className="text-[10px] text-amber-400 font-bold">{quest.timeEstimateMinutes} MIN</span>
            </div>
          </div>
        </div>

        {/* Rewards and Attribute Gains */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#090d14] p-3 rounded-xl border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1.5">
              REWARDS EARNED
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-cyan-300">
                <span>Experience:</span>
                <span className="font-bold">+{quest.xpReward} XP</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Gold Rewards:</span>
                <span className="font-bold">+{quest.goldReward} GOLD</span>
              </div>
              <div className="flex justify-between text-emerald-300">
                <span>Momentum:</span>
                <span className="font-bold">+{quest.momentumBoost}%</span>
              </div>
              {isBossQuest && (
                <div className="flex justify-between text-rose-300 font-bold pt-1 border-t border-white/[0.05]">
                  <span>Boss Damage:</span>
                  <span>-{quest.xpReward} HP</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#090d14] p-3 rounded-xl border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1.5">
              ATTRIBUTE GROWTH
            </span>
            <div className="space-y-1 text-xs">
              {quest.attributesAffected.map((attr) => (
                <div key={attr.attribute} className="flex justify-between text-slate-200">
                  <span className="capitalize">{attr.attribute}:</span>
                  <span className="font-bold text-emerald-400">+{attr.gain} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            CLOSE
          </Button>
          {!isCompleted && (
            <Button
              variant="primary"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => {
                onComplete(quest.id);
                onClose();
              }}
            >
              COMPLETE QUEST
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

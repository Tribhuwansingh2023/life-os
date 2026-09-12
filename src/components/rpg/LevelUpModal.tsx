import React from 'react';
import { Modal } from '../ui/Modal';
import { LevelUpEvent } from '../../services/gameService';
import { Button } from '../ui/Button';
import { Trophy, Sparkles, Coins, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LevelUpModalProps {
  levelUpEvent: LevelUpEvent | null;
  onDismiss: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  levelUpEvent,
  onDismiss
}) => {
  if (!levelUpEvent) return null;

  return (
    <Modal
      isOpen={!!levelUpEvent}
      onClose={onDismiss}
      title="SYSTEM ASCENSION DETECTED"
      subtitle="Neural threshold exceeded. Character parameters amplified."
      maxWidth="md"
    >
      <div className="text-center py-4">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-violet-500/30 to-amber-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] mb-4"
        >
          <Trophy className="w-10 h-10 text-cyan-300" />
        </motion.div>

        {/* Level change */}
        <div className="flex items-center justify-center gap-4 my-3 font-mono">
          <div className="bg-[#090d14] px-4 py-2 rounded-xl border border-white/10">
            <span className="text-xs text-slate-500 block">PRIOR LEVEL</span>
            <span className="text-xl font-bold text-slate-400">LV.{levelUpEvent.oldLevel}</span>
          </div>

          <ArrowUpRight className="w-6 h-6 text-cyan-400 animate-pulse" />

          <div className="bg-cyan-950/40 px-5 py-2 rounded-xl border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span className="text-xs text-cyan-300 block">ASCENDED</span>
            <span className="text-2xl font-black text-cyan-200">LV.{levelUpEvent.newLevel}</span>
          </div>
        </div>

        {levelUpEvent.unlockedTitle && (
          <div className="my-4 p-3 bg-violet-950/30 border border-violet-500/30 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              NEW TITLE UNLOCKED
            </span>
            <h4 className="text-base font-bold text-white font-mono">
              {levelUpEvent.unlockedTitle}
            </h4>
          </div>
        )}

        {/* Bonus reward */}
        <div className="flex items-center justify-center gap-2 bg-[#090d14] border border-amber-500/30 py-2.5 px-4 rounded-xl max-w-xs mx-auto mb-6">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-mono font-bold text-amber-300">
            +{levelUpEvent.bonusGold} Ascension Gold Awarded
          </span>
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={onDismiss}>
          SYNCHRONIZE & CONTINUE
        </Button>
      </div>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusEffect } from '../../types';
import {
  Zap,
  Shield,
  AlertTriangle,
  Clock,
  Sparkles,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface StatusEffectsProps {
  effects?: StatusEffect[];
  onToggleEffect?: (effectId: string) => void;
  className?: string;
  compact?: boolean;
}

export const StatusEffects: React.FC<StatusEffectsProps> = ({
  effects,
  onToggleEffect,
  className = '',
  compact = false
}) => {
  const activeEffects: StatusEffect[] = effects && effects.length > 0 ? effects : [];
  const [expanded, setExpanded] = useState(!compact);
  const [selectedEffect, setSelectedEffect] = useState<StatusEffect | null>(null);
  const [ticker, setTicker] = useState(0);

  // Live timer tick to animate pulse and countdown seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getEffectIcon = (effect: StatusEffect) => {
    switch (effect.iconName) {
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Shield':
        return <Shield className="w-3.5 h-3.5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5" />;
      default:
        return effect.type === 'buff' ? <Sparkles className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  const buffs = activeEffects.filter((e: StatusEffect) => e.type === 'buff');
  const debuffs = activeEffects.filter((e: StatusEffect) => e.type === 'debuff');

  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-[#0c1017] p-3 sm:p-4 relative overflow-hidden ${className}`}
      id="player-status-effects"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              NEURAL STATUS EFFECTS
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                {activeEffects.length} ACTIVE
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audioService.playTactileClick();
              setExpanded(!expanded);
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.05] transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Compact Mini Bar Mode */}
      {!expanded && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activeEffects.map((effect: StatusEffect) => {
            const isBuff = effect.type === 'buff';

            return (
              <button
                key={effect.id}
                type="button"
                onClick={() => {
                  audioService.playTactileClick();
                  setSelectedEffect(selectedEffect?.id === effect.id ? null : effect);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
                  isBuff
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:border-rose-400'
                }`}
              >
                {getEffectIcon(effect)}
                <span className="font-medium text-[11px]">{effect.name}</span>
                <span className="text-[10px] text-slate-400 font-bold">({effect.statModifier})</span>
                <span className="text-[9px] text-slate-400">{effect.durationLeftHours}h</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Detailed Expanded Mode */}
      {expanded && (
        <div className="space-y-2.5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeEffects.map((effect: StatusEffect) => {
              const isBuff = effect.type === 'buff';
              const progressPercent = Math.min(100, Math.max(5, (effect.durationLeftHours / effect.durationTotalHours) * 100));
              const hours = Math.floor(effect.durationLeftHours);
              const minutes = Math.floor((effect.durationLeftHours - hours) * 60);

              return (
                <motion.div
                  key={effect.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-2.5 rounded-lg border relative overflow-hidden transition-all ${
                    isBuff
                      ? 'bg-gradient-to-r from-cyan-950/20 via-[#0e1624] to-[#0a101a] border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                      : 'bg-gradient-to-r from-rose-950/20 via-[#160d17] to-[#120a14] border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
                  }`}
                >
                  {/* Gauge indicator background */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                          isBuff
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {getEffectIcon(effect)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-white leading-tight">
                            {effect.name}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1 rounded uppercase font-bold ${
                              isBuff ? 'bg-cyan-500/20 text-cyan-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {isBuff ? 'BUFF' : 'DEBUFF'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 block">
                          {effect.statModifier}
                        </span>
                      </div>
                    </div>

                    {/* Active timer badge */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-300">
                        <Clock className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>{hours}h {minutes}m</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {Math.round(progressPercent)}% left
                      </span>
                    </div>
                  </div>

                  {/* Animated Duration Progress Bar */}
                  <div className="w-full bg-[#05070c] rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        isBuff
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      }`}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans mt-1.5 leading-snug line-clamp-1">
                    {effect.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

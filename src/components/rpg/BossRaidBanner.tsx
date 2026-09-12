import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BossBattle } from '../../types';
import { Skull, Clock, Swords, ShieldAlert, Award, Zap, Crosshair } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { audioService } from '../../services/audioService';

interface BossRaidBannerProps {
  boss: BossBattle;
  onInspectBoss?: () => void;
  onSimulateHit?: (damage: number) => void;
  className?: string;
}

export const BossRaidBanner: React.FC<BossRaidBannerProps> = ({
  boss,
  onInspectBoss,
  onSimulateHit,
  className = ''
}) => {
  const hpPercentage = Math.min(100, Math.max(0, Math.round((boss.currentHp / boss.totalHp) * 100)));
  const isDefeated = boss.currentHp === 0;

  // Track damage hits and previous HP for lag trail
  const prevHpRef = useRef(boss.currentHp);
  const [isPulsating, setIsPulsating] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; damage: number }[]>([]);
  const [trailHpPercentage, setTrailHpPercentage] = useState(hpPercentage);

  useEffect(() => {
    if (boss.currentHp < prevHpRef.current) {
      const damage = prevHpRef.current - boss.currentHp;
      triggerHitPulse(damage);
    }
    prevHpRef.current = boss.currentHp;
  }, [boss.currentHp]);

  const triggerHitPulse = (damage: number) => {
    setIsPulsating(true);
    audioService.playBossHit();

    // Add floating damage number
    const hitId = Date.now() + Math.random();
    setFloatingDamage((prev) => [...prev, { id: hitId, damage }]);

    setTimeout(() => {
      setFloatingDamage((prev) => prev.filter((d) => d.id !== hitId));
    }, 1500);

    // After 450ms, animate lag trail catching up
    setTimeout(() => {
      setTrailHpPercentage(hpPercentage);
      setIsPulsating(false);
    }, 600);
  };

  const handleQuickStrike = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playTactileClick();
    if (onSimulateHit) {
      onSimulateHit(150);
    } else {
      triggerHitPulse(150);
    }
  };

  return (
    <motion.div
      animate={
        isPulsating
          ? {
              scale: [1, 1.015, 0.99, 1],
              borderColor: ['rgba(244,63,94,0.3)', 'rgba(244,63,94,1)', 'rgba(251,191,36,0.8)', 'rgba(244,63,94,0.3)']
            }
          : {}
      }
      transition={{ duration: 0.5 }}
      onClick={() => {
        audioService.playTactileClick();
        if (onInspectBoss) onInspectBoss();
      }}
      className={`relative overflow-hidden bg-gradient-to-r from-[#1a0c16] via-[#120f20] to-[#0c121e] border ${
        isDefeated ? 'border-emerald-500/40' : 'border-rose-500/30'
      } rounded-xl p-4 sm:p-5 shadow-lg group cursor-pointer transition-all hover:border-rose-400/50 ${className}`}
      id="active-boss-raid-banner"
    >
      {/* Red ambient raid danger glow */}
      <div
        className={`absolute top-0 right-0 w-72 h-full rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
          isPulsating ? 'bg-rose-500/25 opacity-100' : 'bg-rose-500/10 opacity-60'
        }`}
      />

      {/* Floating Damage Text Indicators */}
      <div className="absolute top-4 right-1/4 pointer-events-none z-30">
        <AnimatePresence>
          {floatingDamage.map((hit) => (
            <motion.div
              key={hit.id}
              initial={{ opacity: 1, y: 0, scale: 1.2 }}
              animate={{ opacity: 0, y: -45, scale: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="font-mono font-black text-rose-300 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] flex items-center gap-1"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>-{hit.damage} CRITICAL HIT!</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Boss Metadata */}
        <div className="flex items-start gap-3.5">
          <motion.div
            animate={isPulsating ? { x: [-4, 4, -3, 3, 0], rotate: [-3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.3)] group-hover:scale-105 transition-transform"
          >
            <Skull className="w-7 h-7" />
          </motion.div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                ACTIVE RAID BOSS
              </span>
              <Badge variant="rose" size="xs">
                WEAK TO {boss.vulnerabilityAttribute.toUpperCase()}
              </Badge>
              {isDefeated && (
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  DEFEATED
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-mono font-bold text-white tracking-wide mt-1 group-hover:text-rose-300 transition-colors flex items-center gap-2">
              {boss.name}
              {isPulsating && (
                <span className="text-[10px] font-mono text-amber-300 animate-pulse bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-400/40">
                  DAMAGE IMPACT
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-sans italic">
              "{boss.epithet}"
            </p>
          </div>
        </div>

        {/* Pulsating Health Bar & Boss Integrity */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-rose-300 flex items-center gap-1.5 font-bold">
              <Swords className={`w-3.5 h-3.5 text-rose-400 ${isPulsating ? 'animate-spin' : ''}`} />
              BOSS INTEGRITY
            </span>
            <span className="text-slate-200 font-bold tabular-nums">
              {boss.currentHp.toLocaleString()} / {boss.totalHp.toLocaleString()} HP ({hpPercentage}%)
            </span>
          </div>

          {/* Health Bar Container with Damage Pulse Glow */}
          <motion.div
            animate={
              isPulsating
                ? {
                    boxShadow: [
                      '0 0 0px rgba(244,63,94,0)',
                      '0 0 20px rgba(244,63,94,0.8)',
                      '0 0 5px rgba(244,63,94,0.3)'
                    ]
                  }
                : {}
            }
            transition={{ duration: 0.6 }}
            className="w-full bg-[#080a10] rounded-full h-3.5 overflow-hidden border border-rose-500/30 p-0.5 relative"
          >
            {/* Lagging damage trail (yellow/white) */}
            <div
              className="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-amber-300/60 transition-all duration-500 pointer-events-none"
              style={{ width: `${trailHpPercentage}%` }}
            />

            {/* Foreground Active HP Bar */}
            <motion.div
              animate={
                isPulsating
                  ? {
                      filter: ['brightness(1)', 'brightness(1.9)', 'brightness(1)'],
                      scaleY: [1, 1.15, 1]
                    }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className={`relative h-full rounded-full transition-all duration-300 ${
                isDefeated
                  ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                  : 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
              }`}
              style={{ width: `${hpPercentage}%` }}
            >
              {/* Shimmer line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </motion.div>

          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{boss.deadlineHours}h reset</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick strike trigger for tactile testing */}
              <button
                type="button"
                onClick={handleQuickStrike}
                className="text-[10px] text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 transition-colors flex items-center gap-1"
                title="Simulate quick tactical strike to test pulsating health bar animation"
              >
                <Crosshair className="w-3 h-3" />
                <span>Strike (-150)</span>
              </button>

              <div className="flex items-center gap-1 text-amber-300">
                <Award className="w-3 h-3 text-amber-400" />
                <span>+{boss.rewardGold} G</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debuff warning footnote */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-sans">
        <div className="flex items-center gap-2 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">
            <strong className="text-slate-200">Active Raid Debuff:</strong> {boss.debuffDescription}
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 shrink-0 ml-2 hidden sm:inline">
          1 XP = 1 Boss DMG
        </span>
      </div>
    </motion.div>
  );
};

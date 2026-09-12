import React from 'react';
import { Zap, Flame, ShieldAlert, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface MomentumMeterProps {
  momentum: number; // 0-100
  streakDays: number;
  className?: string;
}

export const MomentumMeter: React.FC<MomentumMeterProps> = ({
  momentum,
  streakDays,
  className = ''
}) => {
  let statusText = 'STABLE';
  let badgeVariant: 'slate' | 'amber' | 'cyan' | 'rose' = 'slate';
  let multiplier = '1.0x';

  if (momentum >= 90) {
    statusText = 'HYPER-DRIVE';
    badgeVariant = 'cyan';
    multiplier = '1.35x XP';
  } else if (momentum >= 75) {
    statusText = 'FLOW STATE';
    badgeVariant = 'amber';
    multiplier = '1.15x XP';
  } else if (momentum < 40) {
    statusText = 'ENTROPY RISK';
    badgeVariant = 'rose';
    multiplier = '0.85x XP';
  }

  return (
    <div className={`bg-[#0c1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden ${className}`}>
      {/* Glow pulse in corner when momentum is high */}
      {momentum >= 75 && (
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              MOMENTUM ENGINE
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Velocity & Streak Multiplier
            </span>
          </div>
        </div>

        <Badge variant={badgeVariant} size="xs">
          {statusText}
        </Badge>
      </div>

      {/* Main Gauge Visual */}
      <div className="flex items-end justify-between gap-4 mb-2">
        <div className="font-mono">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
            <span className="text-cyan-400">{momentum}</span>
            <span className="text-xs text-slate-500">/ 100%</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Active Reward Yield: <span className="font-mono font-bold text-cyan-300">{multiplier}</span>
          </p>
        </div>

        <div className="text-right font-mono bg-[#090d14] px-3 py-1.5 rounded-lg border border-white/[0.06]">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>CHAIN</span>
          </div>
          <span className="text-xs font-bold text-amber-300">{streakDays} Consecutive</span>
        </div>
      </div>

      {/* Segmented Momentum Bar */}
      <div className="w-full bg-[#090d14] rounded-full h-2.5 overflow-hidden border border-white/[0.06] p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-300 transition-all duration-500"
          style={{ width: `${momentum}%`, boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)' }}
        />
      </div>

      {momentum < 50 && (
        <div className="mt-2 text-[10px] text-rose-400 flex items-center gap-1.5 font-mono">
          <ShieldAlert className="w-3 h-3 shrink-0" />
          <span>Complete 1 quest today to arrest momentum decay.</span>
        </div>
      )}
    </div>
  );
};

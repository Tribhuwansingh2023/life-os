import React from 'react';
import { PlayerProfile } from '../../types';
import { StatProgressBar } from '../ui/StatProgressBar';
import { Badge } from '../ui/Badge';
import { Shield, Sparkles, Flame, Coins, Zap } from 'lucide-react';
import { StatusEffects } from './StatusEffects';

interface CharacterCardProps {
  player: PlayerProfile;
  onOpenProfile?: () => void;
  className?: string;
  showEmbeddedEffects?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  player,
  onOpenProfile,
  className = '',
  showEmbeddedEffects = false
}) => {
  return (
    <div
      onClick={onOpenProfile}
      className={`relative overflow-hidden bg-gradient-to-b from-[#111722] to-[#0a0e16] border border-white/[0.1] hover:border-cyan-500/40 rounded-xl p-5 shadow-lg transition-all cursor-pointer group ${className}`}
    >
      {/* Background ambient radial grid */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Identity & Class */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          {/* Avatar frame */}
          <div className="relative">
            <div className="w-13 h-13 rounded-xl bg-[#090d14] border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-shadow">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
            {/* Level Pill */}
            <div className="absolute -bottom-2 -right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-extrabold text-[10px] px-1.5 py-0.5 rounded-md shadow-md border border-cyan-300/40">
              LV.{player.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-white tracking-wider text-base sm:text-lg group-hover:text-cyan-300 transition-colors">
                {player.username}
              </h3>
              <Badge variant="cyan" size="xs">
                {player.characterClass}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-sans tracking-wide mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {player.title}
            </p>
          </div>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center gap-2 bg-[#090d14] border border-amber-500/30 px-3 py-1.5 rounded-lg shadow-sm">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold text-xs sm:text-sm text-amber-300 tabular-nums">
            {player.gold.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-500 font-mono uppercase">Gold</span>
        </div>
      </div>

      {/* XP Progression */}
      <div className="mb-4">
        <StatProgressBar
          label="EXPERIENCE TO NEXT ASCENSION"
          current={player.currentXp}
          max={player.nextLevelXp}
          color="cyan"
          unit="XP"
          showPercent
          size="md"
        />
      </div>

      {/* Key Quick Stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-center font-mono">
        <div className="bg-[#090d14]/70 p-2 rounded-lg border border-white/[0.04]">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] mb-0.5">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>MOMENTUM</span>
          </div>
          <span className="text-sm font-bold text-cyan-300">{player.momentum}%</span>
        </div>

        <div className="bg-[#090d14]/70 p-2 rounded-lg border border-white/[0.04]">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] mb-0.5">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>STREAK</span>
          </div>
          <span className="text-sm font-bold text-amber-300">{player.streakDays} DAYS</span>
        </div>

        <div className="bg-[#090d14]/70 p-2 rounded-lg border border-white/[0.04]">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] mb-0.5">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>QUESTS</span>
          </div>
          <span className="text-sm font-bold text-violet-300">{player.completedQuestsCount} CLEARED</span>
        </div>
      </div>

      {/* Embedded Status Effects or Footnote */}
      {showEmbeddedEffects && player.statusEffects && player.statusEffects.length > 0 ? (
        <div className="mt-3.5 pt-3 border-t border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
          <StatusEffects effects={player.statusEffects} compact />
        </div>
      ) : player.activeBuffs.length > 0 ? (
        <div className="mt-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-cyan-300 truncate">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-mono font-medium truncate">{player.activeBuffs[0].name}</span>
          </div>
          <span className="font-mono text-cyan-400/80 text-[10px] shrink-0">
            {player.activeBuffs[0].durationLeftHours}h remaining
          </span>
        </div>
      ) : null}
    </div>
  );
};

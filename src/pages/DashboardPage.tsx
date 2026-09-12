import React, { useState } from 'react';
import {
  PlayerProfile,
  AttributeInfo,
  Quest,
  BossBattle,
  WorldRegion,
  OracleInsight,
  ReplayDay,
  AttributeKey
} from '../types';
import { CharacterCard } from '../components/rpg/CharacterCard';
import { MomentumMeter } from '../components/rpg/MomentumMeter';
import { MomentumChart } from '../components/rpg/MomentumChart';
import { StatusEffects } from '../components/rpg/StatusEffects';
import { BossRaidBanner } from '../components/rpg/BossRaidBanner';
import { WeeklyReplay } from '../components/rpg/WeeklyReplay';
import { AttributeGrid } from '../components/rpg/AttributeGrid';
import { QuestCard } from '../components/quest/QuestCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Globe2,
  Plus,
  Compass,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  player: PlayerProfile;
  attributes: Record<string, AttributeInfo>;
  quests: Quest[];
  boss: BossBattle;
  regions: WorldRegion[];
  oracle: OracleInsight;
  replayDays?: ReplayDay[];
  onCompleteQuest: (id: string) => void;
  onInspectQuest: (quest: Quest) => void;
  onOpenCreateQuest: () => void;
  onNavigateTab: (tab: any) => void;
  onSimulateBossHit?: (damage: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  player,
  attributes,
  quests,
  boss,
  regions,
  oracle,
  replayDays = [],
  onCompleteQuest,
  onInspectQuest,
  onOpenCreateQuest,
  onNavigateTab,
  onSimulateBossHit
}) => {
  const [showWeeklyDeltas, setShowWeeklyDeltas] = useState(false);
  const activeQuests = quests.filter((q) => q.status === 'active');
  const completedTodayCount = quests.filter((q) => q.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12" id="dashboard-viewport">
      {/* 1. Top Hero Grid: Character Profile, Status Effects, Momentum Engine & 7-Day Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Character Profile Card & Status Effects */}
        <div className="lg:col-span-2 space-y-4">
          <CharacterCard
            player={player}
            onOpenProfile={() => onNavigateTab('character')}
          />

          {/* Status Effects: Temporary Buffs and Debuffs with Animated Timers */}
          <StatusEffects
            effects={player.statusEffects}
            compact={false}
          />
        </div>

        {/* Right 1 Col: Momentum Engine & Recharts 7-Day Trend */}
        <div className="flex flex-col gap-4">
          <MomentumMeter
            momentum={player.momentum}
            streakDays={player.streakDays}
          />

          {/* Small Recharts Line Chart: 7-Day Momentum Trajectory */}
          <MomentumChart
            replayDays={replayDays}
            currentMomentum={player.momentum}
          />
        </div>
      </div>

      {/* 2. Active Raid Boss Battle Banner with Animated Pulsating Health Bar */}
      <BossRaidBanner
        boss={boss}
        onInspectBoss={() => onNavigateTab('quests')}
        onSimulateHit={onSimulateBossHit}
      />

      {/* 3. Oracle Live Intelligence Direct Line */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-950/20 via-[#0d121c] to-[#0a0f16] border border-violet-500/30 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold block">
                AI GAME MASTER // ORACLE DIRECTIVE
              </span>
              <h3 className="text-sm font-mono font-bold text-white">
                {oracle.statusHeadline}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('oracle')}
            className="text-xs font-mono text-violet-300 hover:text-white flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            Deep Life Analysis &rarr;
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          {oracle.coreDiagnosis}
        </p>

        {oracle.balanceAlert.hasImbalance && (
          <div className="mt-3 bg-rose-950/20 border border-rose-500/30 rounded-lg p-2.5 flex items-center gap-2 text-xs text-rose-300 font-sans">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Life Balance Deficit:</strong> {oracle.balanceAlert.actionAdvice}
            </span>
          </div>
        )}
      </div>

      {/* 4. Weekly Replay Attribute Deltas Toggle Banner */}
      <div className="bg-[#0b1019] border border-cyan-500/20 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider flex items-center gap-2">
              WEEKLY REPLAY & ATTRIBUTE DELTAS
              <Badge variant="cyan" size="xs">
                6 VECTORS
              </Badge>
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Summary of progress deltas in Strength, Intellect, Discipline, Creativity, Wellness, and Social over the last week.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={showWeeklyDeltas ? 'primary' : 'secondary'}
            size="xs"
            onClick={() => setShowWeeklyDeltas(!showWeeklyDeltas)}
          >
            {showWeeklyDeltas ? 'HIDE 7D DELTAS' : 'EXPAND 7D DELTAS'}
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onNavigateTab('replay')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            FULL REPLAY
          </Button>
        </div>
      </div>

      {/* Expanded Weekly Replay Component on Dashboard */}
      {showWeeklyDeltas && (
        <WeeklyReplay
          attributes={attributes}
          quests={quests}
          replayDays={replayDays}
          player={player}
          onSelectAttribute={() => onNavigateTab('character')}
        />
      )}

      {/* 5. Main Two-Column Layout: Today's Quest Stack & Biosystem World Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Quest Stack */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                TODAY'S QUEST STACK
              </h3>
              <Badge variant="cyan" size="xs">
                {activeQuests.length} ACTIVE
              </Badge>
              {completedTodayCount > 0 && (
                <Badge variant="emerald" size="xs">
                  {completedTodayCount} CLEARED
                </Badge>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={onOpenCreateQuest}
            >
              CREATE QUEST
            </Button>
          </div>

          {activeQuests.length === 0 ? (
            <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-mono font-bold text-white text-sm uppercase mb-1">
                ALL DAILY QUESTS COMPLETED
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 font-sans">
                You have cleared today's stack. Momentum is secured. Create a bonus quest to continue your character progression.
              </p>
              <Button variant="primary" size="sm" onClick={onOpenCreateQuest}>
                CREATE NEW QUEST
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeQuests.slice(0, 5).map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={onCompleteQuest}
                  onInspect={onInspectQuest}
                />
              ))}
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigateTab('quests')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              <span>View Full Quest Matrix & Archive ({quests.length} Total)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: World Biosystems & Quick Attributes */}
        <div className="space-y-5">
          {/* World Biome Status Card */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  WORLD REGIONS
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('world')}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Full Map &rarr;
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans mb-3">
              Your real-life domains manifest as living world regions:
            </p>

            <div className="space-y-2.5">
              {regions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => onNavigateTab('world')}
                  className="group bg-[#090d14] hover:bg-[#111722] p-2.5 rounded-lg border border-white/[0.04] hover:border-white/[0.15] cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: region.accentColor }}
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300">
                        {region.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {region.domain.split('&')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-white">
                      {region.influenceScore}%
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase block">
                      {region.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Life Balance Hex/Grid Summary */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                CORE ATTRIBUTES (6 VECTORS)
              </h4>
              <button
                onClick={() => onNavigateTab('character')}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
              >
                Inspect All &rarr;
              </button>
            </div>

            <AttributeGrid
              attributes={attributes}
              onSelectAttribute={() => onNavigateTab('character')}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
};

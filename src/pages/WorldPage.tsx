import React, { useState } from 'react';
import { WorldRegion, Quest } from '../types';
import { useGame } from '../context/GameStateContext';
import { audioService } from '../services/audioService';
import { WorldMap } from '../components/world/WorldMap';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Globe2,
  Sparkles,
  ArrowRight,
  Crown,
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  Flame,
  Award,
  Zap,
  TrendingUp,
  Compass,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  REGION_CONFIGS,
  getRegionStateDisplay,
  getProgressTier,
  getDynamicWorldNarrative
} from '../data/worldData';

interface WorldPageProps {
  regions: WorldRegion[];
  quests: Quest[];
  onInspectQuest: (quest: Quest) => void;
  onNavigateTab: (tab: any) => void;
}

export const WorldPage: React.FC<WorldPageProps> = ({
  regions,
  quests,
  onInspectQuest,
  onNavigateTab
}) => {
  const { attributes, player, oracle } = useGame();

  // Default selected to region with high progress or second region
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    regions[1]?.id || regions[0]?.id || 'reg_archive'
  );

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];
  const regionConfig = selectedRegion ? REGION_CONFIGS[selectedRegion.id] : undefined;

  // Filter quests relevant to this territory (by regionId or category attribute)
  const regionQuests = quests.filter(
    (q) => q.regionId === selectedRegion?.id || q.category === selectedRegion?.associatedAttribute
  );
  const completedQuests = regionQuests.filter((q) => q.status === 'completed');
  const activeQuests = regionQuests.filter((q) => q.status === 'active');

  // Dynamic state and metrics
  const stateDisplay = selectedRegion
    ? getRegionStateDisplay(selectedRegion.status, selectedRegion.influenceScore)
    : { key: 'ACTIVE', label: 'ACTIVE', color: 'text-cyan-300', badgeBg: 'bg-cyan-950/50', borderColor: 'border-cyan-400/50' };
  
  const tierInfo = selectedRegion ? getProgressTier(selectedRegion.influenceScore) : { tier: 3, label: 'Established', stageName: 'Expanded Outposts', nextThreshold: 75, percentageToNext: 6 };
  const worldNarrative = getDynamicWorldNarrative(regions);
  const isMastered = selectedRegion?.influenceScore >= 90 || selectedRegion?.status === 'mastered';
  const isLocked = stateDisplay.key === 'LOCKED';

  // XP contributed calculation grounded in actual state
  const attributeLevel = selectedRegion ? attributes[selectedRegion.associatedAttribute]?.level || 12 : 12;
  const xpContributed = completedQuests.reduce((sum, q) => sum + (q.xpReward || 0), 0) + attributeLevel * 280;

  // Next milestone calculation
  const nextMilestoneScore = isMastered ? 100 : selectedRegion?.influenceScore < 50 ? 50 : selectedRegion?.influenceScore < 75 ? 75 : 100;
  const pointsRemaining = Math.max(0, nextMilestoneScore - (selectedRegion?.influenceScore || 0));

  // Oracle recommended quest in this region
  const oracleQuest =
    regionQuests.find((q) => q.isRecommendedByOracle && q.status === 'active') ||
    activeQuests[0] ||
    regionQuests[0];

  const handleSelectRegion = (region: WorldRegion) => {
    audioService.playTactileClick();
    setSelectedRegionId(region.id);
  };

  const handleInspectQuest = (quest: Quest) => {
    audioService.playTactileClick();
    onInspectQuest(quest);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Dynamic World Story Narrative Banner */}
      <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                  {worldNarrative.headline}
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300">
                  LIVING RPG WORLD
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-3xl leading-relaxed">
                {worldNarrative.subtext}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('quests')}
            className="self-start md:self-center shrink-0 px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5"
          >
            Forge New Quest &rarr;
          </button>
        </div>
      </div>

      {/* 2. Interactive World Map Component */}
      <WorldMap
        regions={regions}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        disciplineAttribute={attributes.discipline}
      />

      {/* 3. Quick Region Switcher Cards (Accessible for mobile & fast navigation) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {regions.map((region) => {
          const isSelected = region.id === selectedRegionId;
          const config = REGION_CONFIGS[region.id];
          const IconComp = config?.attributeIcon || Globe2;
          const state = getRegionStateDisplay(region.status, region.influenceScore);

          return (
            <button
              key={region.id}
              onClick={() => handleSelectRegion(region)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-[#101724] border-white/40 ring-2 shadow-lg shadow-cyan-950/30'
                  : 'bg-[#090d14] hover:bg-[#0e1420] border-white/[0.07] hover:border-white/20'
              }`}
              style={{
                borderColor: isSelected ? region.accentColor : undefined
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                style={{ backgroundColor: region.accentColor }}
              />
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <IconComp className="w-3.5 h-3.5" style={{ color: region.accentColor }} />
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    {config?.attributeLabel || region.associatedAttribute}
                  </span>
                </div>
                {region.influenceScore >= 90 && (
                  <Crown className="w-3 h-3 text-amber-400" />
                )}
              </div>
              <h4 className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {region.name}
              </h4>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span style={{ color: region.accentColor }} className="font-bold">
                  {region.influenceScore}%
                </span>
                <span className={`text-[9px] uppercase ${state.color}`}>
                  {state.label}
                </span>
              </div>
              {/* Micro progress bar */}
              <div className="w-full h-1 bg-white/[0.06] rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${region.influenceScore}%`,
                    backgroundColor: region.accentColor
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Selected Region Deep Inspector Panel */}
      {selectedRegion && (
        <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden space-y-6">
          {/* Ambient accent top lightbar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              backgroundColor: selectedRegion.accentColor,
              boxShadow: `0 0 16px ${selectedRegion.accentColor}`
            }}
          />

          {/* Region Header and Real-Life Connection */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {selectedRegion.codeName}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${stateDisplay.badgeBg} ${stateDisplay.borderColor} ${stateDisplay.color}`}
                >
                  {stateDisplay.label}
                </span>
                <span className="text-slate-600">&bull;</span>
                <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
                  {regionConfig && (
                    <regionConfig.attributeIcon
                      className="w-3.5 h-3.5"
                      style={{ color: selectedRegion.accentColor }}
                    />
                  )}
                  <span>
                    Powered by{' '}
                    <strong className="text-white capitalize">
                      {regionConfig?.attributeLabel || selectedRegion.associatedAttribute}
                    </strong>
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wide flex items-center gap-2.5">
                {selectedRegion.name}
                {isMastered && <Crown className="w-6 h-6 text-amber-400 inline" />}
              </h2>
              <p className="text-sm text-slate-300 font-sans mt-1">
                {regionConfig?.humanNarrative || selectedRegion.description}
              </p>
              <div className="mt-2 text-xs font-mono text-cyan-300/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Real-Life Fuel: <strong className="text-white">{regionConfig?.realLifeAction}</strong>
              </div>
            </div>

            {/* Region Progress Meter Card */}
            <div className="bg-[#080c13] px-6 py-4 rounded-xl border border-white/[0.08] font-mono text-left lg:text-right shrink-0">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                REGION PROGRESS
              </span>
              <div className="text-3xl font-black text-white flex items-baseline gap-1.5 lg:justify-end mt-0.5">
                <span style={{ color: selectedRegion.accentColor }}>
                  {selectedRegion.influenceScore}%
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 100% EXPLORED</span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                {isMastered ? (
                  <span className="text-amber-300 font-bold flex items-center gap-1 lg:justify-end">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Mastery Achieved
                  </span>
                ) : (
                  <span>{pointsRemaining}% until Next Milestone</span>
                )}
              </span>
            </div>
          </div>

          {/* High-Contrast Region Progress Bar & Milestones */}
          <div className="bg-[#080c13] p-5 rounded-xl border border-white/[0.06] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase">{selectedRegion.name}</span>
                <span className="text-slate-500">&bull;</span>
                <span style={{ color: selectedRegion.accentColor }} className="font-bold">
                  {selectedRegion.influenceScore}% EXPLORED
                </span>
              </div>
              <div className="text-slate-400">
                {isMastered ? (
                  <span className="text-amber-300 font-semibold">Max Territory Expansion</span>
                ) : (
                  <span>{pointsRemaining}% progress needed for next milestone</span>
                )}
              </div>
            </div>

            {/* Visual Multi-stop Progress Track */}
            <div className="relative w-full h-3 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: `${selectedRegion.influenceScore}%`,
                  backgroundColor: selectedRegion.accentColor,
                  boxShadow: `0 0 12px ${selectedRegion.accentColor}88`
                }}
              />
            </div>

            {/* Checkpoint Indicators */}
            <div className="grid grid-cols-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-white/[0.04]">
              <div className="text-left">
                <span className={selectedRegion.influenceScore >= 25 ? 'text-white font-bold' : 'text-slate-600'}>
                  25% &bull; Outpost
                </span>
              </div>
              <div className="text-center">
                <span className={selectedRegion.influenceScore >= 50 ? 'text-white font-bold' : 'text-slate-600'}>
                  50% &bull; Settlement
                </span>
              </div>
              <div className="text-center">
                <span className={selectedRegion.influenceScore >= 75 ? 'text-white font-bold' : 'text-slate-600'}>
                  75% &bull; Metropolis
                </span>
              </div>
              <div className="text-right">
                <span className={selectedRegion.influenceScore >= 100 ? 'text-amber-300 font-bold' : 'text-slate-600'}>
                  100% &bull; Landmark
                </span>
              </div>
            </div>

            {/* Next Milestone Banner Callout */}
            <div className="pt-1 text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">NEXT MILESTONE:</span>
              <span>
                {regionConfig?.milestones.find((m) => m.percentage > selectedRegion.influenceScore)?.title ||
                  regionConfig?.landmark.name}{' '}
                &bull;{' '}
                <strong className="text-white">
                  {regionConfig?.landmark.rewardBadgeTitle}
                </strong>
              </span>
            </div>
          </div>

          {/* 4 Key Progression Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#080c13] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                QUESTS COMPLETED
              </span>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {completedQuests.length}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {activeQuests.length} currently active
              </span>
            </div>

            <div className="bg-[#080c13] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                XP CONTRIBUTED
              </span>
              <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
                +{xpContributed.toLocaleString()} XP
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Attribute Level {attributeLevel}
              </span>
            </div>

            <div className="bg-[#080c13] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                CURRENT STREAK
              </span>
              <div className="text-2xl font-mono font-bold text-rose-400 mt-1 flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                {player.streakDays} Days
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                Unbroken habit momentum
              </span>
            </div>

            <div className="bg-[#080c13] p-4 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                NEXT MILESTONE
              </span>
              <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                {nextMilestoneScore}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block truncate">
                {isMastered ? 'Mastery Unlocked' : `${pointsRemaining}% remaining`}
              </span>
            </div>
          </div>

          {/* Region Landmark & Reward Showcase */}
          {regionConfig && (
            <div className="bg-[#080c13] p-5 rounded-xl border border-white/[0.08] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isMastered
                        ? 'bg-amber-950/30 border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'
                    }`}
                  >
                    <regionConfig.landmark.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        TERRITORY LANDMARK
                      </span>
                      {isMastered ? (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-400/40 text-amber-300 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" /> UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/10 text-slate-400 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> UNLOCKS AT 100%
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-mono font-bold text-white mt-0.5">
                      {regionConfig.landmark.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-2xl leading-relaxed">
                      {regionConfig.landmark.description}
                    </p>
                  </div>
                </div>

                {/* Reward Perk Card */}
                <div className="bg-[#0c121e] px-4 py-3 rounded-lg border border-cyan-500/20 text-right shrink-0">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">
                    REWARD PERK
                  </span>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">
                    {regionConfig.landmark.rewardBadgeTitle}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-xs">
                    {regionConfig.landmark.rewardPerk}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Oracle Recommendation Card */}
          {oracleQuest && (
            <div className="bg-[#090d14] p-5 rounded-xl border border-cyan-500/30 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        THE ORACLE SUGGESTS
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">&bull;</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Expand {selectedRegion.name}
                      </span>
                    </div>
                    <h4 className="text-sm font-mono font-bold text-white mt-0.5">
                      {oracleQuest.title}
                    </h4>
                    <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-2">
                      {oracleQuest.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-amber-300">
                      <span>+{oracleQuest.xpReward} XP</span>
                      <span className="text-slate-600">&bull;</span>
                      <span>+{oracleQuest.goldReward} Gold</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-cyan-300 font-bold">
                        +{Math.ceil(oracleQuest.xpReward / 70)}% Region Progress
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-center shrink-0">
                  <button
                    onClick={() => handleInspectQuest(oracleQuest)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                  >
                    View Quest &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quests Inside this Region */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  QUESTS IN THIS REGION ({regionQuests.length})
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Real-world tasks contributing to {selectedRegion.name} expansion.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('quests')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Create Quest in Region &rarr;
              </button>
            </div>

            {regionQuests.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#080c13] border border-white/[0.06] text-center">
                <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-mono font-bold text-slate-300">
                  No Quests Currently Active in this Region
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-1 max-w-md mx-auto">
                  Turn something you want to accomplish in real life into a quest categorized under{' '}
                  <strong className="text-white capitalize">
                    {regionConfig?.attributeLabel || selectedRegion.associatedAttribute}
                  </strong>{' '}
                  to develop this territory.
                </p>
                <button
                  onClick={() => onNavigateTab('quests')}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-colors shadow-md"
                >
                  Create Quest Now &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regionQuests.map((quest) => {
                  const isCompleted = quest.status === 'completed';

                  return (
                    <div
                      key={quest.id}
                      onClick={() => handleInspectQuest(quest)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                        isCompleted
                          ? 'bg-[#090d14]/70 border-white/[0.05] opacity-80 hover:opacity-100 hover:border-emerald-500/40'
                          : 'bg-[#090d14] hover:bg-[#101724] border-white/[0.08] hover:border-cyan-500/40 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            <span
                              className={`text-[10px] font-mono font-bold uppercase ${
                                isCompleted ? 'text-emerald-400' : 'text-cyan-400'
                              }`}
                            >
                              {isCompleted ? 'COMPLETED' : `RANK-${quest.difficulty} • ${quest.type}`}
                            </span>
                          </div>

                          <div className="font-mono text-xs text-amber-300 font-bold shrink-0">
                            +{quest.xpReward} XP
                          </div>
                        </div>

                        <h4
                          className={`text-xs font-mono font-semibold transition-colors line-clamp-2 ${
                            isCompleted
                              ? 'text-slate-400 line-through'
                              : 'text-white group-hover:text-cyan-300'
                          }`}
                        >
                          {quest.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-white/[0.04]">
                        <span>
                          {isCompleted
                            ? `Finished ${quest.completedAt || 'Today'}`
                            : quest.dueDate || 'Ready to deploy'}
                        </span>
                        <span className="text-cyan-400/80 group-hover:text-cyan-300">
                          Inspect &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

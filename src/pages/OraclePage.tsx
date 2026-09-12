import React, { useState } from 'react';
import { OracleInsight, Quest, AttributeKey } from '../types';
import { oracleService } from '../services/oracleService';
import { useGame } from '../context/GameStateContext';
import { audioService } from '../services/audioService';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Brain,
  Compass,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Globe2,
  Flame,
  Award,
  TrendingUp,
  Clock,
  Coins,
  Shield,
  Activity,
  Check,
  Crown
} from 'lucide-react';

interface OraclePageProps {
  oracle: OracleInsight;
  quests: Quest[];
  onInspectQuest: (quest: Quest) => void;
  onNavigateTab: (tab: any) => void;
}

export const OraclePage: React.FC<OraclePageProps> = ({
  oracle: initialOracle,
  quests: initialQuests,
  onInspectQuest,
  onNavigateTab
}) => {
  const {
    player,
    attributes,
    quests,
    regions,
    acceptOracleQuest,
    setOracle
  } = useGame();

  const [oracleState, setOracleState] = useState<OracleInsight>(initialOracle);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [acceptedNotice, setAcceptedNotice] = useState<string | null>(null);
  const [showExplainability, setShowExplainability] = useState(false);
  const [simulatedChoice, setSimulatedChoice] = useState<'intellect' | 'wellness' | 'skip'>('intellect');
  const [overrideQuestId, setOverrideQuestId] = useState<string | null>(null);

  // Determine the active recommended quest
  const currentRecommendedId = overrideQuestId || oracleState.recommendedQuestId;
  const recommendedQuest =
    quests.find((q) => q.id === currentRecommendedId) ||
    quests.find((q) => q.id === 'qst_01') ||
    quests[0];

  const isRecommendedAlreadyActive =
    recommendedQuest && recommendedQuest.status === 'active';
  const isRecommendedAcceptedInStack =
    recommendedQuest && (recommendedQuest.isRecommendedByOracle || acceptedNotice === recommendedQuest.id);

  // Attributes list sorted by value to detect strongest & needs attention
  const attrList = Object.values(attributes).sort((a, b) => a.value - b.value);
  const lowestAttr = attrList[0];
  const highestAttr = attrList[attrList.length - 1];

  // Refresh Oracle calculation
  const handleRefresh = () => {
    audioService.playTactileClick();
    setIsRefreshing(true);
    setTimeout(() => {
      const fresh = oracleService.generateLiveDiagnostic(overrideQuestId || undefined);
      setOracleState(fresh);
      setOracle(fresh);
      setIsRefreshing(false);
    }, 200);
  };

  // Accept Quest Action Flow
  const handleAcceptQuest = (quest: Quest) => {
    audioService.playTactileClick();
    acceptOracleQuest(quest.id);
    setAcceptedNotice(quest.id);
    audioService.playQuestComplete();

    // Auto-clear notice after 4 seconds
    setTimeout(() => {
      setAcceptedNotice(null);
    }, 4000);
  };

  // Switch to alternative recommendation
  const handleSelectAlternative = (questId: string) => {
    audioService.playTactileClick();
    setOverrideQuestId(questId);
    const fresh = oracleService.generateLiveDiagnostic(questId);
    setOracleState(fresh);
    setOracle(fresh);
  };

  // World region impacted by recommended quest
  const impactedRegion =
    regions.find((r) => r.id === recommendedQuest?.regionId || r.associatedAttribute === recommendedQuest?.category) ||
    regions[0];
  const currentRegionScore = impactedRegion?.influenceScore || 48;
  const projectedRegionScore = Math.min(100, currentRegionScore + 4);

  return (
    <div className="space-y-6 pb-14">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#140f26] via-[#0e1220] to-[#080d16] border border-violet-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-violet-950/50 border-2 border-violet-400/60 flex items-center justify-center text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] shrink-0">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-violet-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded border border-violet-500/30">
                  TACTICAL DECISION ENGINE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {oracleState.generatedAt}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-black text-white tracking-wide">
                ORACLE AI GAME MASTER
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                Your progress, analyzed. Your next move, recommended.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            {/* Recommendation Confidence Indicator */}
            <div
              className="bg-[#080c13] px-3 py-1.5 rounded-xl border border-violet-500/30 flex items-center gap-2 group cursor-help"
              title="Confidence reflects how strongly your current progression signals point toward this recommendation."
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                CONFIDENCE
              </span>
              <span className="text-xs font-mono font-black text-violet-300">
                {oracleState.confidenceScore || 87}%
              </span>
              <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-300 transition-colors" />
            </div>

            <Button
              variant="accent"
              size="md"
              icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'REFRESHING...' : 'REFRESH ORACLE'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Oracle Insight, Balance, World Impact, Explainability (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          {/* 2. Main Oracle Card: ORACLE INSIGHT */}
          <div className="bg-[#0c1017] border border-violet-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>ORACLE INSIGHT</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/30 uppercase font-bold">
                CURRENT STATE
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-mono font-bold text-white tracking-wide">
              {oracleState.statusHeadline}
            </h2>

            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {oracleState.coreDiagnosis}
            </p>

            {/* Tactical Tip */}
            <div className="p-3.5 rounded-xl bg-[#080c13] border border-white/[0.06] flex items-start gap-2.5 text-xs text-amber-300 font-mono">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{oracleState.tacticalTip}</span>
            </div>
          </div>

          {/* 3. YOUR BALANCE (Life Balance) */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-mono font-bold text-white tracking-wide flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  YOUR BALANCE
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Six core operating dimensions evaluated against long-term sustainability.
                </p>
              </div>

              {/* Strongest & Needs Attention Badges */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-cyan-400" /> STRONGEST: {highestAttr.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/50 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> NEEDS ATTENTION: {lowestAttr.label}
                </span>
              </div>
            </div>

            {/* Visual Attributes Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {attrList.map((attr) => {
                const isStrongest = attr.key === highestAttr.key;
                const isWeakest = attr.key === lowestAttr.key;

                return (
                  <div
                    key={attr.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isWeakest
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : isStrongest
                        ? 'bg-cyan-950/15 border-cyan-500/30'
                        : 'bg-[#080c13] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: attr.color }}
                        />
                        {attr.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold" style={{ color: attr.color }}>
                          {attr.value}
                        </span>
                        <span className="text-[10px] text-slate-500">/ 100</span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${attr.value}%`,
                          backgroundColor: attr.color
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                      <span>Level {attr.level}</span>
                      {isStrongest && <span className="text-cyan-400 font-bold">Highest Vector</span>}
                      {isWeakest && <span className="text-rose-400 font-bold">In Deficit</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs font-sans text-violet-200 leading-relaxed italic">
              &ldquo;Your biggest opportunity is not always your strongest attribute.&rdquo;
              <span className="block text-[11px] text-slate-400 not-italic mt-0.5">
                Strengthening {lowestAttr.label} eliminates compounding bottlenecks and elevates all other areas.
              </span>
            </div>
          </div>

          {/* 4. WORLD IMPACT */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wide">
                  WORLD IMPACT
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                TERRITORY EXPANSION
              </span>
            </div>

            <div className="bg-[#080c13] p-4 sm:p-5 rounded-xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-bold text-white">
                    {impactedRegion.name.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    {currentRegionScore}% &rarr; {projectedRegionScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Complete this recommended quest to expand {impactedRegion.name} by +4% and advance toward its territory landmark perk.
                </p>
                {/* Progress bar preview */}
                <div className="w-full sm:w-64 h-2 bg-white/[0.08] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${projectedRegionScore}%`,
                      backgroundColor: impactedRegion.accentColor || '#10b981'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('world')}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5"
              >
                VIEW WORLD &rarr;
              </button>
            </div>
          </div>

          {/* 5. RECENT PATTERN (Oracle Memory) */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-violet-400" />
              <span>RECENT PATTERN</span>
            </div>

            <h4 className="text-base font-mono font-bold text-white">
              {oracleState.recentPattern?.summary ||
                "You've completed 4 Intellect quests this week but only 1 Wellness quest."}
            </h4>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {oracleState.recentPattern?.priorityReason ||
                "That's why Wellness is currently receiving priority."}
            </p>
          </div>

          {/* 6. HOW ORACLE DECIDES (Collapsible Explainability) */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowExplainability(!showExplainability)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  HOW ORACLE DECIDES
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  (STRATEGIC PIPELINE)
                </span>
              </div>
              {showExplainability ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showExplainability && (
              <div className="px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-4">
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Oracle continuously monitors live game state without relying on generic chat loops. Every decision synthesizes five key signals into one clear next move:
                </p>

                {/* Pipeline visual diagram */}
                <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] font-mono text-xs text-center space-y-2">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-cyan-300 font-bold">
                    <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/10">Player State</span>
                    <span className="text-slate-500">+</span>
                    <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/10">Recent Behavior</span>
                    <span className="text-slate-500">+</span>
                    <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/10">Quest Options</span>
                    <span className="text-slate-500">+</span>
                    <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/10">Milestones</span>
                    <span className="text-slate-500">+</span>
                    <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/10">World Balance</span>
                  </div>
                  <div className="text-violet-400 font-black text-sm">&darr;</div>
                  <div className="inline-block px-3 py-1 rounded bg-violet-950/60 border border-violet-500/40 text-violet-200 font-black">
                    NEXT BEST MOVE
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 font-sans">
                  <div>&bull; Prioritizes deficit recovery when imbalance exceeds 20 points</div>
                  <div>&bull; Leverages active streak and momentum multipliers</div>
                  <div>&bull; Aligns quest completion with territory milestone unlocks</div>
                  <div>&bull; Protects long-term habit consistency over short-term burn</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: YOUR BEST MOVE RIGHT NOW, Current State, Reasoning, Alternatives, What If (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          {/* 7. MOST IMPORTANT SECTION: YOUR BEST MOVE RIGHT NOW */}
          {recommendedQuest && (
            <div className="bg-[#0c1017] border-2 border-cyan-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/30 relative overflow-hidden space-y-5">
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-black uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>YOUR BEST MOVE RIGHT NOW</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40 font-bold">
                  RECOMMENDED
                </span>
              </div>

              {/* Quest Identity Card */}
              <div className="bg-[#080c13] p-5 rounded-xl border border-white/[0.08] space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 px-2 py-0.5 rounded uppercase">
                    {recommendedQuest.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-300 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded">
                    RANK {recommendedQuest.difficulty}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5 py-0.5">
                    {recommendedQuest.type}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{recommendedQuest.timeEstimateMinutes} MIN</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-mono font-bold text-white leading-snug">
                  {recommendedQuest.title}
                </h3>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {recommendedQuest.description}
                </p>

                {/* Rewards Bar */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{recommendedQuest.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-300 font-bold">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span>+{recommendedQuest.goldReward} GOLD</span>
                  </div>
                </div>
              </div>

              {/* WHY THIS QUEST? */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
                  WHY THIS QUEST?
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {oracleState.recommendationBullets ? (
                    oracleState.recommendationBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                        <span>{bullet}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                        <span>Strong alignment with your current Intellect progression</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                        <span>Your current momentum increases the expected reward</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                        <span>This moves you closer to your next milestone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
                        <span>It fits your current active state</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {acceptedNotice === recommendedQuest.id || isRecommendedAcceptedInStack ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 font-bold">
                      <Check className="w-4 h-4 text-emerald-400" />
                      ACCEPTED & ACTIVE IN TODAY&apos;S STACK
                    </span>
                    <button
                      onClick={() => onInspectQuest(recommendedQuest)}
                      className="text-xs text-white hover:text-emerald-200 underline font-bold"
                    >
                      Inspect &rarr;
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => handleAcceptQuest(recommendedQuest)}
                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-black transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group"
                  >
                    <span>ACCEPT QUEST</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onInspectQuest(recommendedQuest)}
                    className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-xs font-bold transition-colors"
                  >
                    Inspect Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. CURRENT STATE SUMMARY */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
              YOUR CURRENT STATE
            </span>

            {/* Compact Visual 5-Metric Grid */}
            <div className="grid grid-cols-5 gap-2 text-center font-mono">
              <div className="bg-[#080c13] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] text-slate-500 block uppercase">LEVEL</span>
                <span className="text-base font-bold text-white mt-0.5 block">{player.level}</span>
              </div>
              <div className="bg-[#080c13] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] text-slate-500 block uppercase">MOMENTUM</span>
                <span className="text-base font-bold text-cyan-300 mt-0.5 block">{player.momentum}%</span>
              </div>
              <div className="bg-[#080c13] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] text-slate-500 block uppercase">STREAK</span>
                <span className="text-base font-bold text-rose-400 mt-0.5 block">{player.streakDays}D</span>
              </div>
              <div className="bg-[#080c13] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] text-slate-500 block uppercase">QUESTS</span>
                <span className="text-base font-bold text-amber-300 mt-0.5 block">142</span>
              </div>
              <div className="bg-[#080c13] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[9px] text-slate-500 block uppercase">NEXT LVL</span>
                <span className="text-base font-bold text-violet-300 mt-0.5 block">75%</span>
              </div>
            </div>

            {/* Six Attribute Indicators */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 border-t border-white/[0.06]">
              {Object.values(attributes).map((attr) => (
                <div key={attr.key} className="text-center font-mono py-1">
                  <span className="text-[10px] text-slate-400 block truncate">{attr.label}</span>
                  <span className="text-xs font-bold" style={{ color: attr.color }}>
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 9. ORACLE REASONING: WHY I'M RECOMMENDING THIS */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
              WHY I&apos;M RECOMMENDING THIS
            </span>

            <div className="space-y-2.5 pt-1">
              {(oracleState.reasons || [
                { number: '01', title: 'MOMENTUM', detail: `${player.momentum}% current momentum` },
                { number: '02', title: 'MILESTONE', detail: '1 high-value quest from Hyper-Drive' },
                { number: '03', title: 'ATTRIBUTE', detail: 'Intellect is currently your strongest growth vector' },
                { number: '04', title: 'BALANCE', detail: 'Wellness is your weakest region' }
              ]).map((reason, idx) => (
                <div
                  key={idx}
                  className="bg-[#080c13] p-3 rounded-xl border border-white/[0.06] flex items-start gap-3"
                >
                  <span className="font-mono text-xs font-black text-cyan-400 shrink-0 mt-0.5">
                    {reason.number}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      {reason.title}
                    </span>
                    <span className="text-xs font-sans text-slate-200 mt-0.5 block">
                      {reason.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10. ALTERNATIVE RECOMMENDATIONS (Max 2) */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                ALTERNATIVE MOVES
              </span>
              <span className="text-[10px] font-mono text-slate-500">MAX 2 CHOICES</span>
            </div>

            <div className="space-y-2 pt-1">
              {(oracleState.alternativeMoves || [
                {
                  questId: 'qst_04',
                  title: '30-minute Wellness Reset',
                  category: 'wellness' as AttributeKey,
                  xpReward: 180,
                  timeEstimateMinutes: 30,
                  reason: 'Restores Wellness balance'
                },
                {
                  questId: 'qst_05',
                  title: 'Lead Technical Masterclass',
                  category: 'social' as AttributeKey,
                  xpReward: 240,
                  timeEstimateMinutes: 45,
                  reason: 'Strengthens Social'
                }
              ]).map((alt, idx) => {
                const questObj = quests.find((q) => q.id === alt.questId);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#080c13] hover:bg-[#101724] border border-white/[0.06] hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    onClick={() => handleSelectAlternative(alt.questId)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-cyan-300 shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {alt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-amber-300 mt-1">
                          <span>+{alt.xpReward} XP</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="text-slate-400 capitalize">{alt.category}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-cyan-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
                      Switch &rarr;
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 font-sans italic pt-1">
              &ldquo;Oracle recommends the first option because it improves life balance.&rdquo;
            </p>
          </div>

          {/* 11. WHAT IF? SIMULATOR */}
          <div className="bg-[#0c1017] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  WHAT IF?
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  See how different choices change your progression.
                </p>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-slate-400">
                PLANNING
              </span>
            </div>

            {/* 3 Interactive Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  audioService.playTactileClick();
                  setSimulatedChoice('intellect');
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-mono font-bold transition-all border ${
                  simulatedChoice === 'intellect'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/40'
                    : 'bg-[#080c13] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                [ INTELLECT ]
              </button>

              <button
                onClick={() => {
                  audioService.playTactileClick();
                  setSimulatedChoice('wellness');
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-mono font-bold transition-all border ${
                  simulatedChoice === 'wellness'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950/40'
                    : 'bg-[#080c13] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                [ WELLNESS ]
              </button>

              <button
                onClick={() => {
                  audioService.playTactileClick();
                  setSimulatedChoice('skip');
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-mono font-bold transition-all border ${
                  simulatedChoice === 'skip'
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-950/40'
                    : 'bg-[#080c13] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                [ SKIP TODAY ]
              </button>
            </div>

            {/* Simulation Comparison Output */}
            <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] space-y-2.5">
              {simulatedChoice === 'intellect' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold mb-1">
                    <span>INTELLECT QUEST</span>
                    <span>+1 MOMENTUM</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-amber-300 mb-2">
                    <span>+420 XP</span>
                    <span className="text-slate-600">&bull;</span>
                    <span>+160 GOLD</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-cyan-300">+7 Intellect</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    Archive of Light expands to 97%. Strong immediate compound on your dominant vector, but the 34-point Wellness gap remains unaddressed.
                  </p>
                </div>
              )}

              {simulatedChoice === 'wellness' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold mb-1">
                    <span>WELLNESS QUEST</span>
                    <span>+4% WELLNESS</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-amber-300 mb-2">
                    <span>+180 XP</span>
                    <span className="text-slate-600">&bull;</span>
                    <span>+60 GOLD</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-emerald-300">Sanctuary 52%</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    Restores your weakest dimension, purges the Fatigue risk, and stabilizes your biological foundation for tomorrow&apos;s high-stakes sprints.
                  </p>
                </div>
              )}

              {simulatedChoice === 'skip' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-rose-400 font-bold mb-1">
                    <span>SKIP TODAY</span>
                    <span>MOMENTUM DECREASES</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-rose-300 mb-2">
                    <span>0 XP</span>
                    <span className="text-slate-600">&bull;</span>
                    <span>-10% Momentum</span>
                    <span className="text-slate-600">&bull;</span>
                    <span>Streak may be affected</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    Momentum drops to 78%, losing the active Flow State multiplier. Chronos the Procrastinator deals counter-damage to daily progress.
                  </p>
                </div>
              )}

              {/* Simulation Safety Label */}
              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="uppercase text-amber-400/80 font-bold">
                  SIMULATION — NO CHANGES WILL BE SAVED
                </span>
                <span>STRATEGIC PREVIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


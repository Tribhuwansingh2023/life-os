import React, { useState } from 'react';
import { Quest, AttributeKey, QuestType } from '../types';
import { QuestCard } from '../components/quest/QuestCard';
import { Button } from '../components/ui/Button';
import { useGame } from '../context/GameStateContext';
import { audioService } from '../services/audioService';
import {
  Plus,
  Search,
  Swords,
  Sparkles,
  Flame,
  Zap,
  Coins,
  TrendingUp,
  Brain,
  Dumbbell,
  ShieldCheck,
  HeartPulse,
  Users,
  CheckCircle2,
  FilterX,
  Target,
  ArrowRight
} from 'lucide-react';

interface QuestsPageProps {
  quests: Quest[];
  onCompleteQuest: (id: string) => void;
  onInspectQuest: (quest: Quest) => void;
  onOpenCreateQuest: () => void;
  onEditQuest?: (quest: Quest) => void;
}

type CategoryTab = 'all' | QuestType | 'completed';

export const QuestsPage: React.FC<QuestsPageProps> = ({
  quests: propQuests,
  onCompleteQuest,
  onInspectQuest,
  onOpenCreateQuest,
  onEditQuest
}) => {
  const { player, attributes, boss, quests: gameQuests, deleteQuest } = useGame();
  const quests = gameQuests || propQuests;

  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inProgressQuestIds, setInProgressQuestIds] = useState<Set<string>>(new Set());

  // Toggle in-progress status for a quest
  const handleToggleStart = (questId: string) => {
    setInProgressQuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(questId)) {
        next.delete(questId);
      } else {
        next.add(questId);
      }
      return next;
    });
  };

  // Attribute filter counts
  const attributeCounts: Record<AttributeKey, number> = {
    intellect: quests.filter((q) => q.category === 'intellect').length,
    strength: quests.filter((q) => q.category === 'strength').length,
    discipline: quests.filter((q) => q.category === 'discipline').length,
    creativity: quests.filter((q) => q.category === 'creativity').length,
    wellness: quests.filter((q) => q.category === 'wellness').length,
    social: quests.filter((q) => q.category === 'social').length
  };

  // Tab counts
  const tabCounts = {
    all: quests.length,
    daily: quests.filter((q) => q.type === 'daily' && q.status !== 'completed').length,
    epic: quests.filter((q) => q.type === 'epic' && q.status !== 'completed').length,
    habit: quests.filter((q) => q.type === 'habit' && q.status !== 'completed').length,
    boss_raid: quests.filter((q) => q.type === 'boss_raid' && q.status !== 'completed').length,
    completed: quests.filter((q) => q.status === 'completed').length
  };

  // Filter pipeline
  const filteredQuests = quests.filter((q) => {
    // Search query matching title, description, or tags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = q.title.toLowerCase().includes(query);
      const matchesDesc = q.description.toLowerCase().includes(query);
      const matchesTags = (q.dnaTags || []).some((t) => t.toLowerCase().includes(query));
      if (!matchesTitle && !matchesDesc && !matchesTags) return false;
    }

    // Attribute filter
    if (selectedAttribute !== 'all' && q.category !== selectedAttribute) {
      return false;
    }

    // Category tab filter
    if (activeTab === 'completed') {
      return q.status === 'completed';
    } else if (activeTab === 'all') {
      return true;
    } else {
      return q.type === activeTab && q.status !== 'completed';
    }
  });

  // Calculate today's XP earned from completed quests
  const completedTodayQuests = quests.filter((q) => q.status === 'completed');
  const todayXpEarned = completedTodayQuests.reduce((sum, q) => sum + q.xpReward, 0);

  // Oracle recommended quest (first active one)
  const oracleRecommendedQuest = quests.find(
    (q) => q.isRecommendedByOracle && q.status !== 'completed'
  );

  const handleUseOracleSuggestion = () => {
    audioService.playTactileClick();
    if (oracleRecommendedQuest) {
      onInspectQuest(oracleRecommendedQuest);
    } else {
      onOpenCreateQuest();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER & ACTIONS */}
      {/* ========================================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b0f17] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider">
              QUEST MATRIX
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold">
              {quests.filter((q) => q.status !== 'completed').length} ACTIVE
            </span>
          </div>
          <p className="text-sm text-slate-300 font-sans">
            Turn real-life goals into quests, rewards, and progression.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleUseOracleSuggestion}
            className="px-3.5 py-2 rounded-xl bg-[#07090e] hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Use Oracle suggestion</span>
          </button>

          <button
            onClick={() => {
              audioService.playTactileClick();
              onOpenCreateQuest();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>+ CREATE QUEST</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SEARCH & ATTRIBUTE FILTER BAR */}
      {/* ========================================================================= */}
      <section className="bg-[#0b0f17] p-4 rounded-xl border border-white/[0.08] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#07090e] border border-white/[0.1] focus:border-cyan-400 focus:outline-none rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white font-mono placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Quick Clear Filter if active */}
          {(selectedAttribute !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                audioService.playTactileClick();
                setSelectedAttribute('all');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Attribute Pills with Real Count Indicators */}
        <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-slate-500 uppercase mr-1 shrink-0">
            Attribute:
          </span>

          <button
            onClick={() => {
              audioService.playTactileClick();
              setSelectedAttribute('all');
            }}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              selectedAttribute === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                : 'bg-[#07090e] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            <span>All</span>
            <span className="text-[10px] opacity-75">{quests.length}</span>
          </button>

          {(
            [
              'strength',
              'intellect',
              'discipline',
              'creativity',
              'wellness',
              'social'
            ] as AttributeKey[]
          ).map((attr) => (
            <button
              key={attr}
              onClick={() => {
                audioService.playTactileClick();
                setSelectedAttribute(attr);
              }}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedAttribute === attr
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                  : 'bg-[#07090e] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span>{attr}</span>
              <span className="text-[10px] opacity-75">{attributeCounts[attr]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: QUESTS LIST + RIGHT-SIDE ACTION PANEL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Tabs and Quest Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 font-mono text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                audioService.playTactileClick();
                setActiveTab('all');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white/10 text-white font-bold border border-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>ALL QUESTS</span>
              <span className="text-[10px] opacity-75">({tabCounts.all})</span>
            </button>

            <button
              onClick={() => {
                audioService.playTactileClick();
                setActiveTab('daily');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>DAILY</span>
              <span className="text-[10px] opacity-75">({tabCounts.daily})</span>
            </button>

            <button
              onClick={() => {
                audioService.playTactileClick();
                setActiveTab('epic');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'epic'
                  ? 'bg-violet-500/15 text-violet-300 font-bold border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>MILESTONES</span>
              <span className="text-[10px] opacity-75">({tabCounts.epic})</span>
            </button>

            <button
              onClick={() => {
                audioService.playTactileClick();
                setActiveTab('habit');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'habit'
                  ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>HABITS</span>
              <span className="text-[10px] opacity-75">({tabCounts.habit})</span>
            </button>

            <button
              onClick={() => {
                audioService.playTactileClick();
                setActiveTab('boss_raid');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'boss_raid'
                  ? 'bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>BOSS BATTLES</span>
              <span className="text-[10px] opacity-75">({tabCounts.boss_raid})</span>
            </button>

            <button
              onClick={() => {
                audioService.playTactileClick();
                setActiveTab('completed');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>COMPLETED</span>
              <span className="text-[10px] opacity-75">({tabCounts.completed})</span>
            </button>
          </div>

          {/* Empty State: No Quests found */}
          {filteredQuests.length === 0 ? (
            <div className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#07090e] border border-white/[0.08] flex items-center justify-center text-slate-400">
                <Target className="w-7 h-7 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-base font-mono font-bold text-white tracking-wide">
                  {quests.length === 0 ? 'Your quest board is empty.' : 'No quests in this path yet.'}
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1 max-w-sm mx-auto">
                  {quests.length === 0
                    ? 'Give yourself something worth completing. Transform any real task into XP and progression.'
                    : 'Try clearing your search query or switching to another category.'}
                </p>
              </div>

              <div className="pt-2">
                {quests.length === 0 ? (
                  <button
                    onClick={() => {
                      audioService.playTactileClick();
                      onOpenCreateQuest();
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>CREATE YOUR FIRST QUEST</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      audioService.playTactileClick();
                      setSelectedAttribute('all');
                      setActiveTab('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <FilterX className="w-4 h-4" />
                    <span>CLEAR FILTER</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isInProgress={inProgressQuestIds.has(quest.id)}
                  onToggleStart={handleToggleStart}
                  onComplete={onCompleteQuest}
                  onInspect={onInspectQuest}
                  onDelete={deleteQuest}
                  onEdit={onEditQuest}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: Supporting Information Panel (Action-focused) */}
        <div className="space-y-4">
          {/* Today's Progress Card */}
          <div className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>TODAY'S PROGRESS</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Live Feedback</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="bg-[#07090e] p-3 rounded-xl border border-cyan-500/20">
                <span className="text-[10px] text-slate-400 block uppercase mb-0.5">XP Earned Today</span>
                <span className="text-base font-black text-cyan-300 tabular-nums">+{todayXpEarned} XP</span>
              </div>

              <div className="bg-[#07090e] p-3 rounded-xl border border-amber-500/20">
                <span className="text-[10px] text-slate-400 block uppercase mb-0.5">Quests Cleared</span>
                <span className="text-base font-black text-amber-300 tabular-nums">{completedTodayQuests.length}</span>
              </div>

              <div className="bg-[#07090e] p-3 rounded-xl border border-rose-500/20">
                <span className="text-[10px] text-slate-400 block uppercase mb-0.5">Current Streak</span>
                <span className="text-base font-black text-rose-300 tabular-nums">{player.streakDays} Days</span>
              </div>

              <div className="bg-[#07090e] p-3 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block uppercase mb-0.5">Momentum</span>
                <span className="text-base font-black text-emerald-300 tabular-nums">{player.momentum}%</span>
              </div>
            </div>
          </div>

          {/* Attribute Progress Card */}
          <div className="bg-[#0b0f17] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                ATTRIBUTE PROGRESS
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Current Levels</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {(
                [
                  { key: 'intellect', name: 'Intellect', color: '#00f0ff', icon: <Brain className="w-3.5 h-3.5 text-cyan-400" /> },
                  { key: 'discipline', name: 'Discipline', color: '#a855f7', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> },
                  { key: 'strength', name: 'Strength', color: '#f43f5e', icon: <Dumbbell className="w-3.5 h-3.5 text-rose-400" /> },
                  { key: 'creativity', name: 'Creativity', color: '#fbbf24', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
                  { key: 'wellness', name: 'Wellness', color: '#10b981', icon: <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> },
                  { key: 'social', name: 'Social', color: '#38bdf8', icon: <Users className="w-3.5 h-3.5 text-sky-400" /> }
                ] as const
              ).map(({ key, name, color, icon }) => {
                const attr = attributes[key];
                const val = attr?.value || 60;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        {icon}
                        <span>{name}</span>
                      </div>
                      <span className="font-bold text-white tabular-nums">{val} / 100</span>
                    </div>

                    <div className="w-full bg-[#07090e] rounded-full h-1.5 overflow-hidden border border-white/[0.05]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${val}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Boss Battle Status Card */}
          {boss && (
            <div className="bg-[#0e0912] border border-rose-500/30 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    BOSS BATTLE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-rose-300 font-bold uppercase">
                  ACTIVE RAID
                </span>
              </div>

              <div>
                <h4 className="text-sm font-mono font-bold text-white">
                  {boss.name || 'Chronos the Procrastinator'}
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Complete discipline & high-focus quests to deal direct strike damage.
                </p>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Boss HP</span>
                  <span className="text-rose-400 font-bold tabular-nums">
                    {boss.currentHp.toLocaleString()} / {boss.totalHp.toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-[#07090e] rounded-full h-2 overflow-hidden border border-rose-500/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.round((boss.currentHp / boss.totalHp) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

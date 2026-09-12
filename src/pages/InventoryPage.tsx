import React, { useState, useMemo } from 'react';
import { InventoryItem, Badge as BadgeType, PlayerProfile, WorldRegion } from '../types';
import { Button } from '../components/ui/Button';
import {
  Coins,
  Shield,
  Award,
  Sparkles,
  Check,
  Lock,
  Unlock,
  ShoppingBag,
  Zap,
  Radio,
  FlaskConical,
  Palette,
  Box,
  Eye,
  Compass,
  Brain,
  Swords,
  Flame,
  Scale,
  Globe,
  X,
  Search,
  SlidersHorizontal,
  Layers,
  ArrowUpRight,
  Info,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface InventoryPageProps {
  inventory: InventoryItem[];
  badges: BadgeType[];
  player: PlayerProfile;
  regions?: WorldRegion[];
  onPurchaseItem: (id: string) => boolean;
  onToggleEquip: (id: string) => boolean | void;
}

const ITEM_ICONS: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Box: <Box className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Award: <Award className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />
};

const RARITY_THEMES: Record<
  string,
  {
    border: string;
    borderActive: string;
    text: string;
    bg: string;
    badgeBg: string;
    badgeBorder: string;
    glow: string;
    label: string;
  }
> = {
  common: {
    border: 'border-slate-700/60',
    borderActive: 'border-slate-500',
    text: 'text-slate-300',
    bg: 'bg-slate-900/40',
    badgeBg: 'bg-slate-800/60',
    badgeBorder: 'border-slate-700',
    glow: 'shadow-none',
    label: 'Common Standard'
  },
  rare: {
    border: 'border-cyan-500/30',
    borderActive: 'border-cyan-400',
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/20',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-500/40',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.08)]',
    label: 'Rare Tech'
  },
  epic: {
    border: 'border-purple-500/30',
    borderActive: 'border-purple-400',
    text: 'text-purple-400',
    bg: 'bg-purple-950/20',
    badgeBg: 'bg-purple-950/60',
    badgeBorder: 'border-purple-500/40',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.1)]',
    label: 'Epic Relic'
  },
  legendary: {
    border: 'border-amber-500/40',
    borderActive: 'border-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-950/20',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-500/40',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.14)]',
    label: 'Legendary Artifact'
  }
};

const BADGE_RARITY_STYLES: Record<string, { border: string; text: string; bg: string; glow: string }> = {
  bronze: { border: 'border-amber-700/50', text: 'text-amber-600', bg: 'bg-amber-950/30', glow: '' },
  silver: { border: 'border-slate-400/50', text: 'text-slate-300', bg: 'bg-slate-800/30', glow: 'shadow-[0_0_12px_rgba(203,213,225,0.1)]' },
  gold: { border: 'border-amber-400/50', text: 'text-amber-300', bg: 'bg-amber-950/40', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
  platinum: { border: 'border-cyan-400/60', text: 'text-cyan-300', bg: 'bg-cyan-950/40', glow: 'shadow-[0_0_18px_rgba(0,240,255,0.25)]' }
};

const MAX_EQUIPPED_SLOTS = 4;
const TOTAL_INVENTORY_CAPACITY = 20;

export const InventoryPage: React.FC<InventoryPageProps> = ({
  inventory,
  badges,
  player,
  regions = [],
  onPurchaseItem,
  onToggleEquip
}) => {
  // Navigation tabs: 'all' | 'equipped' | 'available' | 'locked' | 'badges'
  const [filterTab, setFilterTab] = useState<'all' | 'equipped' | 'available' | 'locked' | 'badges'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Interactive feedback toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3800);
  };

  // State calculations
  const totalItemsCount = inventory.length;
  const equippedItems = useMemo(() => inventory.filter((i) => i.equipped), [inventory]);
  const equippedCount = equippedItems.length;
  const masteredTerritoriesCount = useMemo(
    () => (regions || []).filter((r: WorldRegion) => r.status === 'mastered' || r.influenceScore >= 90).length,
    [regions]
  );

  // Helper to check if an item is locked by progression
  const isItemProgressionLocked = (item: InventoryItem): boolean => {
    if (item.unlockRequirement?.type === 'level') {
      return player.level < Number(item.unlockRequirement.targetValue);
    }
    return false;
  };

  // Synergy calculation: Focus Prism (item_01) + Neural Synchronizer Band (item_03)
  const hasFocusPrismEquipped = equippedItems.some((i) => i.id === 'item_01');
  const hasNeuralBandEquipped = equippedItems.some((i) => i.id === 'item_03');
  const isSynergyActive = hasFocusPrismEquipped && hasNeuralBandEquipped;

  // Derive Current Build Archetype
  const currentArchetype = useMemo(() => {
    if (isSynergyActive) return 'NEURAL COGNITIVE ARCHITECT';
    if (hasFocusPrismEquipped) return 'DEEP WORK FOCUS VANGUARD';
    if (equippedItems.some((i) => i.id === 'item_02')) return 'CHRONO MOMENTUM PRESERVER';
    if (equippedItems.length === 0) return 'UNALIGNED SOVEREIGN';
    return 'SYSTEM SPECIALIST';
  }, [isSynergyActive, hasFocusPrismEquipped, equippedItems]);

  // Filtered inventory list
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      // Tab filter
      if (filterTab === 'equipped' && !item.equipped) return false;
      if (filterTab === 'available') {
        // Available means acquired but unequipped OR unpurchased and affordable/unlocked
        if (item.equipped) return false;
        if (!item.purchased && isItemProgressionLocked(item)) return false;
      }
      if (filterTab === 'locked') {
        const locked = isItemProgressionLocked(item) || (!item.purchased && player.gold < item.cost);
        if (!locked) return false;
      }

      // Rarity filter
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;

      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesPerk = item.perkDescription.toLowerCase().includes(query);
        const matchesLore = (item.loreDescription || '').toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesPerk && !matchesLore && !matchesCategory) return false;
      }

      return true;
    });
  }, [inventory, filterTab, rarityFilter, searchQuery, player.gold, player.level]);

  // Filtered badges list
  const filteredBadges = useMemo(() => {
    return badges.filter((b) => {
      if (badgeFilter === 'unlocked' && !b.unlocked) return false;
      if (badgeFilter === 'locked' && b.unlocked) return false;
      return true;
    });
  }, [badges, badgeFilter]);

  // Handle equip / unequip action
  const handleToggleEquip = (item: InventoryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!item.purchased) return;

    if (item.equipped) {
      onToggleEquip(item.id);
      showToast(`${item.name} unequipped.`, 'info');
      if (selectedItem?.id === item.id) {
        setSelectedItem({ ...item, equipped: false });
      }
    } else {
      if (equippedCount >= MAX_EQUIPPED_SLOTS) {
        audioService.playError();
        showToast(`All ${MAX_EQUIPPED_SLOTS} Armory slots are occupied. Unequip an item first.`, 'warning');
        return;
      }
      const res = onToggleEquip(item.id);
      if (res !== false) {
        showToast(`${item.name} equipped. Active bonus activated!`, 'success');
        if (selectedItem?.id === item.id) {
          setSelectedItem({ ...item, equipped: true });
        }
      }
    }
  };

  // Handle purchase action
  const handlePurchase = (item: InventoryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.purchased) return;

    if (isItemProgressionLocked(item)) {
      audioService.playError();
      showToast(`Item is locked: ${item.unlockRequirement?.description || 'Progression criteria unmet'}`, 'warning');
      return;
    }

    if (player.gold < item.cost) {
      audioService.playError();
      const needed = item.cost - player.gold;
      showToast(`Insufficient treasury balance. You need ${needed.toLocaleString()} more Gold.`, 'warning');
      return;
    }

    const success = onPurchaseItem(item.id);
    if (success) {
      showToast(`Successfully purchased ${item.name} for ${item.cost} Gold!`, 'success');
      if (selectedItem?.id === item.id) {
        setSelectedItem({ ...item, purchased: true, equipped: equippedCount < MAX_EQUIPPED_SLOTS });
      }
    } else {
      showToast('Purchase transaction could not be completed.', 'warning');
    }
  };

  return (
    <div className="space-y-7 pb-16 max-w-7xl mx-auto px-1 sm:px-2">
      {/* Dynamic Toast Feedback Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#0a151b]/95 border-cyan-500/50 text-cyan-200'
              : toastMessage.type === 'warning'
              ? 'bg-[#181008]/95 border-amber-500/50 text-amber-200'
              : 'bg-[#10141f]/95 border-slate-600/50 text-slate-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <span className="font-mono text-xs tracking-wide">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PAGE HEADER & TREASURY STATUS                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-[#0b1019] via-[#090d14] to-[#07090f] p-6 sm:p-7 rounded-2xl border border-white/[0.08] relative overflow-hidden shadow-xl">
        {/* Subtle decorative glow accents */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-32 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 tracking-wider uppercase mb-1">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>LIFE//OS ARSENAL & REPOSITORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider uppercase">
            INVENTORY & ARMORY
          </h1>
          <p className="text-sm text-slate-400 font-sans mt-1 max-w-xl leading-relaxed">
            Your earned relics, equipment and progression rewards.
          </p>
        </div>

        {/* Treasury & Capacity Telemetry */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Treasury Card */}
          <div className="flex items-center gap-4 bg-[#080d15] px-5 py-3.5 rounded-xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.06)] font-mono min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-500/90 font-bold uppercase tracking-wider block leading-none">
                TREASURY
              </span>
              <span className="text-xl font-black text-amber-300 tabular-nums leading-tight block mt-0.5">
                {player.gold.toLocaleString()} <span className="text-xs text-amber-400 font-normal">GOLD</span>
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <span>{totalItemsCount} ITEMS</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-semibold">{equippedCount} EQUIPPED</span>
              </div>
            </div>
          </div>

          {/* Capacity Card */}
          <div className="flex flex-col justify-between bg-[#080d15] px-4 py-3.5 rounded-xl border border-white/[0.08] font-mono min-w-[170px]">
            <div className="flex items-center justify-between text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> CAPACITY
              </span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {totalItemsCount} / {TOTAL_INVENTORY_CAPACITY}
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalItemsCount / TOTAL_INVENTORY_CAPACITY) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 mt-1 block uppercase">
              {TOTAL_INVENTORY_CAPACITY - totalItemsCount} SLOTS AVAILABLE
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUMMARY SECTION: CURRENT BUILD & BUILD SYNERGY                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Build Card */}
        <div className="lg:col-span-2 bg-[#090d15] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                    CURRENT BUILD // ACTIVE ARSENAL
                  </span>
                  <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                    {currentArchetype}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold">
                  {equippedCount} / {MAX_EQUIPPED_SLOTS} SLOTS FILLED
                </span>
              </div>
            </div>

            {/* Active Bonuses List */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-1">
                Active Passive Modifiers ({equippedItems.length}):
              </span>
              {equippedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {equippedItems.map((item) => (
                    <div
                      key={`build-bonus-${item.id}`}
                      className="flex items-start gap-2 bg-[#0d131f] p-2.5 rounded-xl border border-cyan-500/20 text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-mono font-semibold block text-[11px]">
                          {item.name}
                        </span>
                        <span className="text-slate-300 font-sans text-[11px] leading-snug block">
                          {item.effectSummary || item.perkDescription}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-mono py-2 italic">
                  No gear or relics currently equipped. Select items from your armory below to activate passive progression buffs.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>ARMORY INTEGRATION: REAL-TIME XP & ATTRIBUTE ENGINES</span>
            <span className="text-cyan-400">MAX {MAX_EQUIPPED_SLOTS} CONCURRENT RELICS</span>
          </div>
        </div>

        {/* Build Synergy Card */}
        <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
          isSynergyActive
            ? 'bg-[#0a151b] border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.12)]'
            : 'bg-[#080d14] border-white/[0.08]'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                BUILD SYNERGY
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                  isSynergyActive
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {isSynergyActive ? 'SYNERGY ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <h4 className="font-mono font-bold text-white text-sm tracking-wide mb-1 flex items-center gap-1.5">
              <Zap className={`w-4 h-4 ${isSynergyActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              COGNITIVE OVERCLOCK
            </h4>

            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-3">
              Focus Prism (+15% Deep Work) + Neural Band (+10% Alternate XP)
            </p>

            <div className={`p-3 rounded-xl border text-xs font-mono mb-2 ${
              isSynergyActive
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                : 'bg-[#0e1422] border-white/[0.06] text-slate-400'
            }`}>
              <div className="text-[10px] uppercase text-slate-500 mb-0.5">Synergy Perk:</div>
              <div className="font-semibold">
                +5% overall focus XP bonus when both cognitive relics are equipped together.
              </div>
            </div>
          </div>

          <div className="pt-2">
            {!isSynergyActive ? (
              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Prerequisites:</span>
                <span className="text-cyan-400">
                  {hasFocusPrismEquipped ? '1/2 Equipped' : '0/2 Equipped'}
                </span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
                <Check className="w-3.5 h-3.5" /> Bonus applied to all Intellect & Discipline quests.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTERS & SEARCH CONTROLS ROW                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#080d14] p-4 rounded-xl border border-white/[0.08]">
        {/* Navigation / Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            ALL ({totalItemsCount})
          </button>
          <button
            onClick={() => setFilterTab('equipped')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filterTab === 'equipped'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            EQUIPPED ({equippedCount})
          </button>
          <button
            onClick={() => setFilterTab('available')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filterTab === 'available'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            AVAILABLE ({inventory.filter((i) => !i.equipped && (i.purchased || !isItemProgressionLocked(i))).length})
          </button>
          <button
            onClick={() => setFilterTab('locked')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filterTab === 'locked'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            LOCKED ({inventory.filter((i) => isItemProgressionLocked(i) || (!i.purchased && player.gold < i.cost)).length})
          </button>
          <button
            onClick={() => setFilterTab('badges')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              filterTab === 'badges'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            BADGES ({badges.length})
          </button>
        </div>

        {/* Right side: Search & Rarity Filter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search relics, perks..."
              className="w-full bg-[#0b1019] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Rarity selector */}
          {filterTab !== 'badges' && (
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as any)}
              className="bg-[#0b1019] border border-white/[0.08] text-xs text-slate-300 font-mono px-3 py-1.5 rounded-lg outline-none cursor-pointer focus:border-cyan-500/50"
            >
              <option value="all">ALL RARITIES</option>
              <option value="common">COMMON</option>
              <option value="rare">RARE</option>
              <option value="epic">EPIC</option>
              <option value="legendary">LEGENDARY</option>
            </select>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN VIEW: ARMORY ITEMS GRID                                          */}
      {/* ========================================================================= */}
      {filterTab !== 'badges' && (
        <div>
          {filteredItems.length === 0 ? (
            <div className="bg-[#090d15] border border-white/[0.08] rounded-2xl p-12 text-center font-mono">
              <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-60" />
              <h3 className="text-white text-base font-bold uppercase mb-1">No Matching Equipment Found</h3>
              <p className="text-slate-400 text-xs font-sans max-w-md mx-auto">
                No items match your active filters or search terms. Try adjusting the status or rarity filters.
              </p>
              <button
                onClick={() => {
                  setFilterTab('all');
                  setRarityFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-bold hover:bg-cyan-500/25 transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const theme = RARITY_THEMES[item.rarity] || RARITY_THEMES.common;
                const isLocked = isItemProgressionLocked(item);
                const canAfford = player.gold >= item.cost;
                const goldNeeded = item.cost - player.gold;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      audioService.playTactileClick();
                      setSelectedItem(item);
                    }}
                    className={`group rounded-2xl p-5 border flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden ${
                      item.equipped
                        ? 'bg-gradient-to-b from-[#101726] to-[#0a101c] border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.12)] ring-1 ring-cyan-500/30'
                        : isLocked
                        ? 'bg-[#080b12] border-white/[0.05] opacity-85 hover:border-white/[0.15]'
                        : 'bg-[#0a0e17] border-white/[0.08] hover:border-cyan-500/30 hover:bg-[#0c121e]'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon, Rarity & Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border ${theme.bg} ${theme.border} ${theme.text} ${theme.glow}`}
                        >
                          {ITEM_ICONS[item.iconName] || <Shield className="w-5 h-5" />}
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${theme.badgeBg} ${theme.badgeBorder} ${theme.text}`}
                          >
                            {item.rarity}
                          </span>

                          {item.equipped ? (
                            <span className="text-[9px] font-mono font-bold uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              EQUIPPED
                            </span>
                          ) : item.purchased ? (
                            <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                              ACQUIRED
                            </span>
                          ) : isLocked ? (
                            <span className="text-[9px] font-mono uppercase text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30 font-semibold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> LOCKED
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono uppercase text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                              AVAILABLE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Name & Category */}
                      <div className="mb-2">
                        <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
                          {item.slotType || item.category}
                        </span>
                        <h4 className="font-mono font-bold text-white text-base tracking-wide group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </h4>
                      </div>

                      {/* Lore Snippet */}
                      {item.loreDescription && (
                        <p className="text-xs text-slate-400 font-sans italic line-clamp-2 mb-3 leading-relaxed">
                          "{item.loreDescription}"
                        </p>
                      )}

                      {/* Effect Box */}
                      <div className="bg-[#070b13] p-3 rounded-xl border border-white/[0.05] mb-4">
                        <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                          ACTIVE EFFECT:
                        </span>
                        <p className="text-xs font-mono text-slate-200 leading-snug">
                          {item.perkDescription}
                        </p>
                      </div>

                      {/* Unlock requirement banner if locked */}
                      {isLocked && item.unlockRequirement && (
                        <div className="mb-4 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 font-mono text-[11px] text-rose-300 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                          <span>
                            {item.unlockRequirement.description} (Current: Lvl {player.level})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                      {item.purchased ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            <span>DETAILS</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={(e) => handleToggleEquip(item, e)}
                            className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                              item.equipped
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 shadow-sm'
                                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-sm'
                            }`}
                          >
                            {item.equipped ? 'UNEQUIP' : 'EQUIP'}
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                              <Coins className="w-3.5 h-3.5 text-amber-400" />
                              <span>{item.cost.toLocaleString()} G</span>
                            </div>
                            {!canAfford && !isLocked && (
                              <span className="text-[10px] text-rose-400/90 font-mono">
                                {goldNeeded.toLocaleString()} G MORE REQUIRED
                              </span>
                            )}
                          </div>

                          <Button
                            variant={canAfford && !isLocked ? 'gold' : 'ghost'}
                            size="sm"
                            disabled={!canAfford || isLocked}
                            onClick={(e) => handlePurchase(item, e)}
                            className="font-mono text-xs"
                          >
                            {isLocked ? (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" /> LOCKED
                              </span>
                            ) : canAfford ? (
                              'PURCHASE'
                            ) : (
                              'NEED GOLD'
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MILESTONE BADGES COLLECTION VIEW                                      */}
      {/* ========================================================================= */}
      {filterTab === 'badges' && (
        <div className="space-y-4">
          {/* Badges Filter Sub-bar */}
          <div className="flex items-center justify-between bg-[#080d14] px-5 py-3 rounded-xl border border-white/[0.08] font-mono text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold uppercase tracking-wider">
                VERIFIED HABIT & EXPEDITION MILESTONES
              </span>
              <span className="text-slate-400 text-[11px]">
                ({badges.filter((b) => b.unlocked).length} OF {badges.length} UNLOCKED)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBadgeFilter('all')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  badgeFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setBadgeFilter('unlocked')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  badgeFilter === 'unlocked'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                UNLOCKED
              </button>
              <button
                onClick={() => setBadgeFilter('locked')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  badgeFilter === 'locked'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LOCKED
              </button>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => {
              const rarityStyle = BADGE_RARITY_STYLES[badge.rarity] || BADGE_RARITY_STYLES.silver;

              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative overflow-hidden ${
                    badge.unlocked
                      ? `bg-[#0a0f19] ${rarityStyle.border} ${rarityStyle.glow}`
                      : 'bg-[#070a10] border-white/[0.04] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                          badge.unlocked
                            ? `${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.text}`
                            : 'bg-slate-900 border-white/10 text-slate-600'
                        }`}
                      >
                        {badge.unlocked ? (
                          BADGE_ICONS[badge.iconName] || <Award className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-mono uppercase font-bold ${rarityStyle.text}`}>
                          {badge.rarity}
                        </span>
                        {badge.unlocked ? (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            UNLOCKED
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">
                        {badge.category}
                      </span>
                      <h4 className="font-mono font-bold text-white text-base">
                        {badge.name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] font-mono text-[11px] flex justify-between items-center text-slate-400">
                    <span>STATUS:</span>
                    {badge.unlocked ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {badge.unlockedDate || 'VERIFIED'}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-bold">LOCKED REQUIREMENT</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ITEM DETAIL MODAL / DRAWER                                            */}
      {/* ========================================================================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-gradient-to-b from-[#0e1422] to-[#090d15] border border-cyan-500/40 rounded-2xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/[0.05] border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
                  RARITY_THEMES[selectedItem.rarity]?.bg || 'bg-slate-900'
                } ${RARITY_THEMES[selectedItem.rarity]?.border || 'border-slate-700'} ${
                  RARITY_THEMES[selectedItem.rarity]?.text || 'text-slate-300'
                } ${RARITY_THEMES[selectedItem.rarity]?.glow || ''}`}
              >
                {ITEM_ICONS[selectedItem.iconName] || <Shield className="w-7 h-7" />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      RARITY_THEMES[selectedItem.rarity]?.badgeBg || 'bg-slate-800'
                    } ${RARITY_THEMES[selectedItem.rarity]?.badgeBorder || 'border-slate-700'} ${
                      RARITY_THEMES[selectedItem.rarity]?.text || 'text-slate-300'
                    }`}
                  >
                    {selectedItem.rarity} {selectedItem.slotType || selectedItem.category}
                  </span>

                  {selectedItem.equipped ? (
                    <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      EQUIPPED
                    </span>
                  ) : selectedItem.purchased ? (
                    <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      ACQUIRED
                    </span>
                  ) : isItemProgressionLocked(selectedItem) ? (
                    <span className="text-[10px] font-mono uppercase text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                      LOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                      AVAILABLE
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-mono font-bold text-white tracking-wide">
                  {selectedItem.name}
                </h2>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-4 font-sans text-sm">
              {/* Lore / Description */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-1">
                  DESCRIPTION & LORE
                </span>
                <p className="text-slate-300 leading-relaxed bg-[#070b13] p-3.5 rounded-xl border border-white/[0.05]">
                  {selectedItem.loreDescription || selectedItem.perkDescription}
                </p>
              </div>

              {/* Exact Effect */}
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider block mb-1">
                  TACTICAL EFFECT
                </span>
                <div className="bg-cyan-950/30 border border-cyan-500/30 p-3.5 rounded-xl font-mono text-xs text-cyan-200">
                  {selectedItem.perkDescription}
                </div>
              </div>

              {/* Character Impact */}
              {selectedItem.characterImpact && selectedItem.characterImpact.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-1.5">
                    CHARACTER & PROGRESSION IMPACT
                  </span>
                  <ul className="space-y-1.5 bg-[#070b13] p-3.5 rounded-xl border border-white/[0.05] text-xs font-mono text-slate-300">
                    {selectedItem.characterImpact.map((impact, idx) => (
                      <li key={`impact-${idx}`} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source / Provenance */}
              {selectedItem.source && (
                <div className="flex items-center justify-between text-xs font-mono bg-[#070b13] px-3.5 py-2.5 rounded-xl border border-white/[0.05]">
                  <span className="text-slate-500 uppercase">SOURCE:</span>
                  <span className="text-slate-300">{selectedItem.source}</span>
                </div>
              )}

              {/* Unlock Requirement (if locked) */}
              {selectedItem.unlockRequirement && (
                <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl text-xs font-mono text-rose-300 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase mb-0.5">UNLOCK CONDITION</span>
                    <span>{selectedItem.unlockRequirement.description}</span>
                    <span className="text-rose-400/80 block mt-1">
                      (Your Level: {player.level} / Required: {selectedItem.unlockRequirement.targetValue})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 font-mono">
              <div>
                {!selectedItem.purchased && (
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>{selectedItem.cost.toLocaleString()} GOLD</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      (Balance: {player.gold.toLocaleString()} G)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  CLOSE
                </Button>

                {selectedItem.purchased ? (
                  <Button
                    variant={selectedItem.equipped ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleEquip(selectedItem)}
                  >
                    {selectedItem.equipped ? 'UNEQUIP RELIC' : 'EQUIP TO BUILD'}
                  </Button>
                ) : (
                  <Button
                    variant="gold"
                    size="sm"
                    disabled={player.gold < selectedItem.cost || isItemProgressionLocked(selectedItem)}
                    onClick={() => handlePurchase(selectedItem)}
                  >
                    {isItemProgressionLocked(selectedItem)
                      ? 'LOCKED'
                      : player.gold >= selectedItem.cost
                      ? `PURCHASE (${selectedItem.cost} G)`
                      : `NEED ${(selectedItem.cost - player.gold).toLocaleString()} G`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

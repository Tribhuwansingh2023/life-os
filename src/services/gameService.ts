import {
  PlayerProfile,
  AttributeInfo,
  Quest,
  WorldRegion,
  BossBattle,
  InventoryItem,
  Badge,
  OracleInsight,
  ReplayDay,
  AttributeKey
} from '../types';
import {
  INITIAL_PLAYER,
  INITIAL_ATTRIBUTES,
  INITIAL_QUESTS,
  INITIAL_REGIONS,
  INITIAL_BOSS,
  INITIAL_INVENTORY,
  INITIAL_BADGES,
  INITIAL_ORACLE,
  INITIAL_REPLAY_DAYS
} from '../data/mockData';
import { audioService } from './audioService';
import confetti from 'canvas-confetti';

export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  unlockedTitle?: string;
  bonusGold: number;
}

export interface QuestCompletionEvent {
  quest: Quest;
  xpGained: number;
  goldGained: number;
  momentumGained: number;
  bossDamageDealt: number;
  leveledUp?: LevelUpEvent;
}

export type StateListener = () => void;

class GameService {
  private player: PlayerProfile = { ...INITIAL_PLAYER };
  private attributes: Record<string, AttributeInfo> = JSON.parse(JSON.stringify(INITIAL_ATTRIBUTES));
  private quests: Quest[] = JSON.parse(JSON.stringify(INITIAL_QUESTS));
  private regions: WorldRegion[] = JSON.parse(JSON.stringify(INITIAL_REGIONS));
  private boss: BossBattle = { ...INITIAL_BOSS };
  private inventory: InventoryItem[] = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
  private badges: Badge[] = JSON.parse(JSON.stringify(INITIAL_BADGES));
  private oracle: OracleInsight = { ...INITIAL_ORACLE };
  private replayDays: ReplayDay[] = JSON.parse(JSON.stringify(INITIAL_REPLAY_DAYS));

  private listeners: Set<StateListener> = new Set();
  public lastCompletionEvent: QuestCompletionEvent | null = null;
  public pendingLevelUp: LevelUpEvent | null = null;

  // Non-linear XP curve: Each level requires progressively more effort
  public calculateXpForNextLevel(level: number): number {
    return Math.floor(1250 * Math.pow(level, 1.32));
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Getters
  public getPlayer(): PlayerProfile {
    return { ...this.player };
  }

  public getAttributes(): Record<string, AttributeInfo> {
    return { ...this.attributes };
  }

  public getQuests(): Quest[] {
    return [...this.quests];
  }

  public getRegions(): WorldRegion[] {
    return [...this.regions];
  }

  public getBoss(): BossBattle {
    return { ...this.boss };
  }

  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public getBadges(): Badge[] {
    return [...this.badges];
  }

  public getOracle(): OracleInsight {
    return { ...this.oracle };
  }

  public setOracle(oracle: OracleInsight) {
    this.oracle = { ...oracle };
    this.notify();
  }

  public getReplayDays(): ReplayDay[] {
    return [...this.replayDays];
  }

  // Complete a quest with tactile feedback, progression calculation, and boss damage
  public completeQuest(questId: string): QuestCompletionEvent | null {
    const questIdx = this.quests.findIndex((q) => q.id === questId);
    if (questIdx === -1) return null;

    const quest = this.quests[questIdx];
    if (quest.status === 'completed') return null;

    audioService.playQuestComplete();

    // Fire celebratory particle burst
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981']
      });
    } catch {
      // Confetti fallback
    }

    // Calculate active equipment multipliers and perks
    const equippedItems = this.inventory.filter((i) => i.equipped);
    const hasFocusPrism = equippedItems.some((i) => i.id === 'item_01');
    const hasNeuralBand = equippedItems.some((i) => i.id === 'item_03');
    const hasBracers = equippedItems.some((i) => i.id === 'item_07');
    const hasSynergy = hasFocusPrism && hasNeuralBand; // Cognitive Overclock Synergy

    let xpMultiplier = 1.0;
    if (hasNeuralBand) xpMultiplier += 0.10;
    if (hasSynergy) xpMultiplier += 0.05;

    // Calculate rewards
    const xpGained = Math.round(quest.xpReward * xpMultiplier);
    const goldGained = quest.goldReward;
    const momentumGained = quest.momentumBoost;
    const bossDamage = xpGained; // 1 XP = 1 Boss DMG

    // Update quest status
    this.quests[questIdx] = {
      ...quest,
      status: 'completed',
      completedAt: 'Just now'
    };

    // Update Player stats
    let newXp = this.player.currentXp + xpGained;
    let newLevel = this.player.level;
    let nextLevelThreshold = this.player.nextLevelXp;
    let levelUpEvent: LevelUpEvent | undefined = undefined;

    // Check level-up
    if (newXp >= nextLevelThreshold) {
      newXp = newXp - nextLevelThreshold;
      newLevel += 1;
      nextLevelThreshold = this.calculateXpForNextLevel(newLevel);

      levelUpEvent = {
        oldLevel: this.player.level,
        newLevel: newLevel,
        unlockedTitle: newLevel >= 18 ? 'Dimensional Vanguard' : undefined,
        bonusGold: 250
      };

      this.pendingLevelUp = levelUpEvent;
      audioService.playLevelUp();

      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#ffd700', '#00f0ff', '#ffffff', '#8b5cf6']
        });
      } catch {
        // Fallback
      }
    }

    const newMomentum = Math.min(100, this.player.momentum + momentumGained);
    const newGold = this.player.gold + goldGained + (levelUpEvent ? levelUpEvent.bonusGold : 0);

    this.player = {
      ...this.player,
      level: newLevel,
      currentXp: newXp,
      nextLevelXp: nextLevelThreshold,
      gold: newGold,
      momentum: newMomentum,
      completedQuestsCount: this.player.completedQuestsCount + 1,
      title: levelUpEvent?.unlockedTitle || this.player.title
    };

    // Update Attributes affected (with relic boosts)
    quest.attributesAffected.forEach(({ attribute, gain }) => {
      const currentAttr = this.attributes[attribute];
      if (currentAttr) {
        let effectiveGain = gain;
        // Focus Prism relic: +15% Discipline and Intellect gains
        if (hasFocusPrism && (attribute === 'discipline' || attribute === 'intellect')) {
          effectiveGain = Math.round(gain * 1.15);
        }
        // Kinetic Wrist Bracers: +5% Strength gains
        if (hasBracers && attribute === 'strength') {
          effectiveGain = Math.round(gain * 1.05);
        }

        const newValue = Math.min(100, currentAttr.value + effectiveGain);
        const newAttrLevel = Math.floor(newValue / 5) + 1;
        this.attributes[attribute] = {
          ...currentAttr,
          value: newValue,
          level: newAttrLevel,
          recentGain: currentAttr.recentGain + effectiveGain
        };
      }
    });

    // Update Boss battle
    const updatedBossHp = Math.max(0, this.boss.currentHp - bossDamage);
    this.boss = {
      ...this.boss,
      currentHp: updatedBossHp
    };
    if (updatedBossHp === 0) {
      audioService.playBossHit();
    }

    // Update Region influence
    const regionIdx = this.regions.findIndex((r) => r.id === quest.regionId);
    if (regionIdx !== -1) {
      const region = this.regions[regionIdx];
      const newScore = Math.min(100, region.influenceScore + 3);
      this.regions[regionIdx] = {
        ...region,
        influenceScore: newScore,
        status: newScore >= 90 ? 'mastered' : 'unlocked'
      };
    }

    const eventPayload: QuestCompletionEvent = {
      quest,
      xpGained,
      goldGained,
      momentumGained,
      bossDamageDealt: bossDamage,
      leveledUp: levelUpEvent
    };

    this.lastCompletionEvent = eventPayload;
    this.notify();
    return eventPayload;
  }

  // Create new user-defined quest
  public createQuest(questData: Omit<Quest, 'id' | 'status'>): Quest {
    audioService.playTactileClick();
    const newQuest: Quest = {
      ...questData,
      id: `qst_${Date.now()}`,
      status: 'active'
    };

    this.quests = [newQuest, ...this.quests];
    this.notify();
    return newQuest;
  }

  // Accept and prioritize quest recommended by Oracle
  public acceptOracleQuest(questId: string): Quest | null {
    audioService.playTactileClick();
    const qIndex = this.quests.findIndex((q) => q.id === questId);
    if (qIndex === -1) return null;

    // Set recommended flag and ensure status is active
    this.quests = this.quests.map((q) => ({
      ...q,
      isRecommendedByOracle: q.id === questId
    }));

    const quest = {
      ...this.quests[qIndex],
      status: 'active' as const,
      isRecommendedByOracle: true
    };

    // Move to front of active quests stack
    this.quests.splice(qIndex, 1);
    this.quests.unshift(quest);

    this.notify();
    return quest;
  }

  // Purchase item from inventory shop
  public purchaseItem(itemId: string): boolean {
    const itemIdx = this.inventory.findIndex((i) => i.id === itemId);
    if (itemIdx === -1) return false;

    const item = this.inventory[itemIdx];
    if (item.purchased) return false;
    if (this.player.gold < item.cost) return false;

    // Progression gate check (e.g. Level Requirement)
    if (item.unlockRequirement?.type === 'level' && this.player.level < Number(item.unlockRequirement.targetValue)) {
      return false;
    }

    audioService.playGoldPurchase();

    this.player = {
      ...this.player,
      gold: this.player.gold - item.cost
    };

    const currentlyEquippedCount = this.inventory.filter((i) => i.equipped).length;
    const shouldAutoEquip = (item.category === 'gear' || item.category === 'artifact') && currentlyEquippedCount < 4;

    this.inventory[itemIdx] = {
      ...item,
      purchased: true,
      equipped: shouldAutoEquip
    };

    this.notify();
    return true;
  }

  // Toggle item equip
  public toggleEquipItem(itemId: string): boolean {
    audioService.playTactileClick();
    const itemIdx = this.inventory.findIndex((i) => i.id === itemId);
    if (itemIdx === -1) return false;

    const item = this.inventory[itemIdx];
    if (!item.purchased) return false;

    if (!item.equipped) {
      const equippedCount = this.inventory.filter((i) => i.equipped).length;
      if (equippedCount >= 4) {
        return false;
      }
    }

    this.inventory[itemIdx] = {
      ...item,
      equipped: !item.equipped
    };

    this.notify();
    return true;
  }

  // Update XP directly (in-memory)
  public updateXp(amount: number) {
    let newXp = this.player.currentXp + amount;
    let newLevel = this.player.level;
    let nextThreshold = this.player.nextLevelXp;

    while (newXp >= nextThreshold) {
      newXp -= nextThreshold;
      newLevel += 1;
      nextThreshold = this.calculateXpForNextLevel(newLevel);
    }

    this.player = {
      ...this.player,
      level: newLevel,
      currentXp: Math.max(0, newXp),
      nextLevelXp: nextThreshold
    };
    this.notify();
  }

  // Update Gold directly (in-memory)
  public updateGold(amount: number) {
    this.player = {
      ...this.player,
      gold: Math.max(0, this.player.gold + amount)
    };
    this.notify();
  }

  // Update Quest Status directly (in-memory)
  public updateQuestStatus(questId: string, status: Quest['status']) {
    const qIndex = this.quests.findIndex((q) => q.id === questId);
    if (qIndex === -1) return;

    this.quests[qIndex] = {
      ...this.quests[qIndex],
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined
    };
    this.notify();
  }

  // Apply user difficulty rating to boost attribute stats and XP
  public rateQuestDifficulty(
    questId: string,
    rating: 'trivial' | 'accurate' | 'challenging' | 'extreme',
    attributeAdjustments: { attribute: AttributeKey; gain: number }[]
  ) {
    audioService.playTactileClick();
    attributeAdjustments.forEach(({ attribute, gain }) => {
      const currentAttr = this.attributes[attribute];
      if (currentAttr) {
        const newValue = Math.min(100, currentAttr.value + gain);
        const newAttrLevel = Math.floor(newValue / 5) + 1;
        this.attributes[attribute] = {
          ...currentAttr,
          value: newValue,
          level: newAttrLevel,
          recentGain: currentAttr.recentGain + gain
        };
      }
    });

    // Extra momentum bonus for challenging / extreme
    if (rating === 'challenging') {
      this.player = {
        ...this.player,
        momentum: Math.min(100, this.player.momentum + 3),
        gold: this.player.gold + 30
      };
    } else if (rating === 'extreme') {
      this.player = {
        ...this.player,
        momentum: Math.min(100, this.player.momentum + 8),
        gold: this.player.gold + 75
      };
    }
    this.notify();
  }

  // Damage active boss (simulated or direct assault)
  public damageBoss(damageAmount: number) {
    const updatedHp = Math.max(0, this.boss.currentHp - damageAmount);
    this.boss = {
      ...this.boss,
      currentHp: updatedHp
    };
    audioService.playBossHit();
    this.notify();
  }

  // Dismiss quest complete modal
  public dismissCompletionModal() {
    this.lastCompletionEvent = null;
    this.notify();
  }

  // Dismiss level-up modal
  public dismissLevelUpModal() {
    this.pendingLevelUp = null;
    this.notify();
  }

  // Update Player username
  public updateUsername(name: string) {
    if (!name.trim()) return;
    this.player = {
      ...this.player,
      username: name.trim().toUpperCase()
    };
    this.notify();
  }

  // Reset demo state back to pristine seed
  public resetToDefault() {
    audioService.playTactileClick();
    this.player = { ...INITIAL_PLAYER };
    this.attributes = JSON.parse(JSON.stringify(INITIAL_ATTRIBUTES));
    this.quests = JSON.parse(JSON.stringify(INITIAL_QUESTS));
    this.regions = JSON.parse(JSON.stringify(INITIAL_REGIONS));
    this.boss = { ...INITIAL_BOSS };
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.badges = JSON.parse(JSON.stringify(INITIAL_BADGES));
    this.oracle = { ...INITIAL_ORACLE };
    this.replayDays = JSON.parse(JSON.stringify(INITIAL_REPLAY_DAYS));
    this.lastCompletionEvent = null;
    this.pendingLevelUp = null;
    this.notify();
  }
}

export const gameService = new GameService();

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
import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

  public currentUserId: string | null = null;
  public syncStatus: 'synced' | 'syncing' | 'offline' | 'error' = 'offline';
  private unsubscribeSnapshot: Unsubscribe | null = null;
  private saveDebounceTimer: any = null;

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

  // Bind authenticated user to Firestore cloud document
  public async bindUser(userId: string | null, callsign?: string) {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }

    if (!userId) {
      this.currentUserId = null;
      this.syncStatus = 'offline';
      this.notify();
      return;
    }

    this.currentUserId = userId;
    this.syncStatus = 'syncing';
    this.notify();

    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data.player) this.player = { ...this.player, ...data.player };
        if (data.attributes) this.attributes = data.attributes;
        if (data.quests && Array.isArray(data.quests)) this.quests = data.quests;
        if (data.regions && Array.isArray(data.regions)) this.regions = data.regions;
        if (data.boss) this.boss = { ...this.boss, ...data.boss };
        if (data.inventory && Array.isArray(data.inventory)) this.inventory = data.inventory;
        if (data.badges && Array.isArray(data.badges)) this.badges = data.badges;
        if (data.replayDays && Array.isArray(data.replayDays)) this.replayDays = data.replayDays;
        this.syncStatus = 'synced';
        this.notify();
      } else {
        if (callsign) {
          this.player.username = callsign.toUpperCase();
        }
        await setDoc(userRef, {
          userId,
          callsign: callsign || this.player.username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          player: this.player,
          attributes: this.attributes,
          quests: this.quests,
          regions: this.regions,
          boss: this.boss,
          inventory: this.inventory,
          badges: this.badges,
          replayDays: this.replayDays
        });
        this.syncStatus = 'synced';
        this.notify();
      }

      // Live Firestore synchronization
      this.unsubscribeSnapshot = onSnapshot(
        userRef,
        (remoteSnap) => {
          if (remoteSnap.exists() && !remoteSnap.metadata.hasPendingWrites) {
            const remoteData = remoteSnap.data();
            if (remoteData.player) this.player = { ...this.player, ...remoteData.player };
            if (remoteData.quests) this.quests = remoteData.quests;
            if (remoteData.attributes) this.attributes = remoteData.attributes;
            if (remoteData.inventory) this.inventory = remoteData.inventory;
            this.syncStatus = 'synced';
            this.notify();
          }
        },
        (err) => {
          console.warn('Firestore snapshot error:', err);
          this.syncStatus = 'error';
          this.notify();
        }
      );
    } catch (err) {
      console.error('Failed to bind user to Firestore:', err);
      this.syncStatus = 'error';
      this.notify();
    }
  }

  public getSyncStatus(): 'synced' | 'syncing' | 'offline' | 'error' {
    return this.syncStatus;
  }

  public async persistToCloud() {
    if (!this.currentUserId) return;
    this.syncStatus = 'syncing';
    this.notify();

    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }

    this.saveDebounceTimer = setTimeout(async () => {
      try {
        if (!this.currentUserId) return;
        const userRef = doc(db, 'users', this.currentUserId);
        await setDoc(
          userRef,
          {
            userId: this.currentUserId,
            updatedAt: new Date().toISOString(),
            player: this.player,
            attributes: this.attributes,
            quests: this.quests,
            regions: this.regions,
            boss: this.boss,
            inventory: this.inventory,
            badges: this.badges,
            replayDays: this.replayDays
          },
          { merge: true }
        );
        this.syncStatus = 'synced';
        this.notify();
      } catch (err) {
        console.error('Firestore persist error:', err);
        this.syncStatus = 'error';
        this.notify();
      }
    }, 250);
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
    audioService.playTactileClick();
    const questIdx = this.quests.findIndex((q) => q.id === questId);
    if (questIdx === -1) return null;

    const quest = this.quests[questIdx];
    if (quest.status === 'completed') return null;

    // Check equipped items perks for synergy boosts
    const equippedItems = this.inventory.filter((i) => i.equipped);
    const hasNeuralBand = equippedItems.some((i) => i.id === 'item_03');
    const hasFocusPrism = equippedItems.some((i) => i.id === 'item_01');
    const hasSynergy = hasFocusPrism && hasNeuralBand;

    let xpMultiplier = 1.0;
    if (hasNeuralBand) xpMultiplier += 0.10;
    if (hasSynergy) xpMultiplier += 0.05;

    // Calculate rewards
    const xpGained = Math.round(quest.xpReward * xpMultiplier);
    const goldGained = quest.goldReward;
    const momentumGained = quest.momentumBoost;
    const bossDamage = xpGained;

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
      currentXp: Math.max(0, newXp),
      nextLevelXp: nextLevelThreshold,
      gold: newGold,
      momentum: newMomentum,
      completedQuestsCount: this.player.completedQuestsCount + 1
    };

    // Attribute Gains
    quest.attributesAffected.forEach(({ attribute, gain }) => {
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

    // Boss damage
    this.boss = {
      ...this.boss,
      currentHp: Math.max(0, this.boss.currentHp - bossDamage)
    };

    // Region influence boost
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
    this.persistToCloud();
    this.notify();
    return eventPayload;
  }

  // Create new user-defined quest (CRUD: Create)
  public createQuest(questData: Omit<Quest, 'id' | 'status'>): Quest {
    audioService.playTactileClick();
    const newQuest: Quest = {
      ...questData,
      id: `qst_${Date.now()}`,
      status: 'active'
    };

    this.quests = [newQuest, ...this.quests];
    this.persistToCloud();
    this.notify();
    return newQuest;
  }

  // Delete an existing quest (CRUD: Delete)
  public deleteQuest(questId: string): boolean {
    audioService.playTactileClick();
    const beforeCount = this.quests.length;
    this.quests = this.quests.filter((q) => q.id !== questId);
    if (this.quests.length !== beforeCount) {
      this.persistToCloud();
      this.notify();
      return true;
    }
    return false;
  }

  // Update an existing quest (CRUD: Update)
  public updateQuest(questId: string, updates: Partial<Quest>): Quest | null {
    audioService.playTactileClick();
    const idx = this.quests.findIndex((q) => q.id === questId);
    if (idx === -1) return null;

    this.quests[idx] = {
      ...this.quests[idx],
      ...updates
    };

    this.persistToCloud();
    this.notify();
    return this.quests[idx];
  }

  // Accept and prioritize quest recommended by Oracle
  public acceptOracleQuest(questId: string): Quest | null {
    audioService.playTactileClick();
    const qIndex = this.quests.findIndex((q) => q.id === questId);
    if (qIndex === -1) return null;

    this.quests = this.quests.map((q) => ({
      ...q,
      isRecommendedByOracle: q.id === questId
    }));

    const quest = {
      ...this.quests[qIndex],
      status: 'active' as const,
      isRecommendedByOracle: true
    };

    this.quests.splice(qIndex, 1);
    this.quests.unshift(quest);

    this.persistToCloud();
    this.notify();
    return quest;
  }

  // Purchase item from Armory
  public purchaseItem(itemId: string): boolean {
    const itemIdx = this.inventory.findIndex((i) => i.id === itemId);
    if (itemIdx === -1) return false;

    const item = this.inventory[itemIdx];
    if (item.purchased) return false;
    if (this.player.gold < item.cost) {
      audioService.playError();
      return false;
    }

    this.player = {
      ...this.player,
      gold: this.player.gold - item.cost
    };

    const isTheme = item.category === 'theme';
    const equippedCount = this.inventory.filter((i) => i.equipped).length;
    const shouldAutoEquip = isTheme ? true : equippedCount < 4;

    this.inventory[itemIdx] = {
      ...item,
      purchased: true,
      equipped: shouldAutoEquip
    };

    this.persistToCloud();
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

    this.persistToCloud();
    this.notify();
    return true;
  }

  // Update XP directly
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
    this.persistToCloud();
    this.notify();
  }

  // Update Gold directly
  public updateGold(amount: number) {
    this.player = {
      ...this.player,
      gold: Math.max(0, this.player.gold + amount)
    };
    this.persistToCloud();
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

  // Delete Quest (CRUD Delete)
  public deleteQuest(questId: string) {
    this.quests = this.quests.filter((q) => q.id !== questId);
    audioService.playTactileClick();
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
    this.persistToCloud();
    this.notify();
  }

  // Damage active boss
  public damageBoss(damageAmount: number) {
    const updatedHp = Math.max(0, this.boss.currentHp - damageAmount);
    this.boss = {
      ...this.boss,
      currentHp: updatedHp
    };
    audioService.playBossHit();
    this.persistToCloud();
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
    this.persistToCloud();
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
    this.persistToCloud();
    this.notify();
  }
}

export const gameService = new GameService();

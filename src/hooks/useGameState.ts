import { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import {
  PlayerProfile,
  AttributeInfo,
  Quest,
  WorldRegion,
  BossBattle,
  InventoryItem,
  Badge,
  OracleInsight,
  ReplayDay
} from '../types';

export function useGameState() {
  const [player, setPlayer] = useState<PlayerProfile>(gameService.getPlayer());
  const [attributes, setAttributes] = useState<Record<string, AttributeInfo>>(gameService.getAttributes());
  const [quests, setQuests] = useState<Quest[]>(gameService.getQuests());
  const [regions, setRegions] = useState<WorldRegion[]>(gameService.getRegions());
  const [boss, setBoss] = useState<BossBattle>(gameService.getBoss());
  const [inventory, setInventory] = useState<InventoryItem[]>(gameService.getInventory());
  const [badges, setBadges] = useState<Badge[]>(gameService.getBadges());
  const [oracle, setOracle] = useState<OracleInsight>(gameService.getOracle());
  const [replayDays, setReplayDays] = useState<ReplayDay[]>(gameService.getReplayDays());
  const [lastCompletionEvent, setLastCompletionEvent] = useState(gameService.lastCompletionEvent);
  const [pendingLevelUp, setPendingLevelUp] = useState(gameService.pendingLevelUp);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>(gameService.getSyncStatus());

  useEffect(() => {
    const unsubscribe = gameService.subscribe(() => {
      setPlayer(gameService.getPlayer());
      setAttributes(gameService.getAttributes());
      setQuests(gameService.getQuests());
      setRegions(gameService.getRegions());
      setBoss(gameService.getBoss());
      setInventory(gameService.getInventory());
      setBadges(gameService.getBadges());
      setOracle(gameService.getOracle());
      setReplayDays(gameService.getReplayDays());
      setLastCompletionEvent(gameService.lastCompletionEvent);
      setPendingLevelUp(gameService.pendingLevelUp);
      setSyncStatus(gameService.getSyncStatus());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    player,
    attributes,
    quests,
    regions,
    boss,
    inventory,
    badges,
    oracle,
    replayDays,
    lastCompletionEvent,
    pendingLevelUp,
    syncStatus,
    completeQuest: (id: string) => gameService.completeQuest(id),
    acceptOracleQuest: (id: string) => gameService.acceptOracleQuest(id),
    setOracle: (o: OracleInsight) => gameService.setOracle(o),
    createQuest: (q: Omit<Quest, 'id' | 'status'>) => gameService.createQuest(q),
    deleteQuest: (id: string) => gameService.deleteQuest(id),
    updateQuest: (id: string, updates: Partial<Quest>) => gameService.updateQuest(id, updates),
    purchaseItem: (id: string) => gameService.purchaseItem(id),
    toggleEquipItem: (id: string) => gameService.toggleEquipItem(id),
    updateUsername: (name: string) => gameService.updateUsername(name),
    updateXp: (amount: number) => gameService.updateXp(amount),
    updateGold: (amount: number) => gameService.updateGold(amount),
    updateQuestStatus: (questId: string, status: Quest['status']) => gameService.updateQuestStatus(questId, status),
    rateQuestDifficulty: (questId: string, rating: any, adjustments: any) =>
      gameService.rateQuestDifficulty(questId, rating, adjustments),
    damageBoss: (amount: number) => gameService.damageBoss(amount),
    dismissCompletionModal: () => gameService.dismissCompletionModal(),
    resetToDefault: () => gameService.resetToDefault(),
    dismissLevelUp: () => gameService.dismissLevelUpModal(),
    getProfiles: () => gameService.getProfiles(),
    switchProfile: (profileId: string) => gameService.switchProfile(profileId),
    createNewProfile: (name: string, characterClass?: string) => gameService.createNewProfile(name, characterClass),
    deleteProfile: (profileId: string) => gameService.deleteProfile(profileId)
  };
}

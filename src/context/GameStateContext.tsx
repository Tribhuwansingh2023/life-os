import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import {
  PlayerProfile,
  AttributeInfo,
  Quest,
  BossBattle,
  WorldRegion,
  InventoryItem,
  Badge,
  OracleInsight,
  ReplayDay,
  LevelUpEvent,
  AttributeKey,
  ProfileRecord
} from '../types';
import { QuestCompletionEvent } from '../services/gameService';

interface GameStateContextValue {
  player: PlayerProfile;
  attributes: Record<string, AttributeInfo>;
  quests: Quest[];
  regions: WorldRegion[];
  boss: BossBattle;
  inventory: InventoryItem[];
  badges: Badge[];
  oracle: OracleInsight;
  replayDays: ReplayDay[];
  lastCompletionEvent: QuestCompletionEvent | null;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  completeQuest: (id: string) => void;
  acceptOracleQuest: (id: string) => Quest | null;
  setOracle: (oracle: OracleInsight) => void;
  createQuest: (questData: Partial<Quest>) => void;
  deleteQuest: (id: string) => boolean;
  updateQuest: (id: string, updates: Partial<Quest>) => Quest | null;
  purchaseItem: (id: string) => boolean;
  toggleEquipItem: (id: string) => boolean | void;
  updateUsername: (name: string) => void;
  updateXp: (amount: number) => void;
  updateGold: (amount: number) => void;
  updateQuestStatus: (questId: string, status: Quest['status']) => void;
  rateQuestDifficulty: (
    questId: string,
    rating: 'trivial' | 'accurate' | 'challenging' | 'extreme',
    attributeAdjustments: { attribute: AttributeKey; gain: number }[]
  ) => void;
  damageBoss: (damageAmount: number) => void;
  dismissCompletionModal: () => void;
  resetToDefault: () => void;
  pendingLevelUp: LevelUpEvent | null;
  dismissLevelUp: () => void;
  getProfiles: () => ProfileRecord[];
  switchProfile: (profileId: string) => boolean;
  createNewProfile: (name: string, characterClass?: string) => ProfileRecord;
  deleteProfile: (profileId: string) => boolean;
}

export const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const gameState = useGameState();

  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
};

export function useGame(): GameStateContextValue {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGame must be used within a GameStateProvider');
  }
  return context;
}

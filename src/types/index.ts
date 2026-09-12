export type AttributeKey = 'strength' | 'intellect' | 'discipline' | 'creativity' | 'wellness' | 'social';

export interface AttributeInfo {
  key: AttributeKey;
  label: string;
  value: number; // e.g. 1-100
  maxValue: number;
  level: number;
  domain: string;
  color: string;
  iconName: string;
  recentGain: number;
  description: string;
}

export type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type QuestType = 'daily' | 'epic' | 'habit' | 'boss_raid';
export type QuestStatus = 'active' | 'completed' | 'abandoned';

export interface Quest {
  id: string;
  title: string;
  category: AttributeKey;
  type: QuestType;
  difficulty: QuestDifficulty;
  timeEstimateMinutes: number;
  xpReward: number;
  goldReward: number;
  momentumBoost: number; // e.g. +5%
  attributesAffected: {
    attribute: AttributeKey;
    gain: number;
  }[];
  description: string;
  dnaTags: string[]; // e.g. ["Deep Work", "High Energy", "Solo"]
  regionId: string;
  status: QuestStatus;
  completedAt?: string;
  dueDate?: string;
  streakCount?: number;
  isRecommendedByOracle?: boolean;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff';
  description: string;
  statModifier: string;
  multiplier: number;
  durationTotalHours: number;
  durationLeftHours: number;
  iconName?: string;
  color?: string;
}

export interface PlayerProfile {
  id: string;
  username: string;
  title: string;
  characterClass: string;
  avatarSeed: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  gold: number;
  momentum: number; // 0 - 100%
  streakDays: number;
  worldMasteryPercentage: number;
  completedQuestsCount: number;
  activeBuffs: {
    name: string;
    description: string;
    multiplier: number;
    durationLeftHours: number;
  }[];
  statusEffects?: StatusEffect[];
}

export interface WorldRegion {
  id: string;
  name: string;
  codeName: string;
  domain: string;
  associatedAttribute: AttributeKey;
  status: 'discovered' | 'unlocked' | 'mastered';
  influenceScore: number; // 0 - 100
  biomeType: 'citadel' | 'archive' | 'foundry' | 'grove' | 'agora';
  description: string;
  activeQuestsCount: number;
  coordinates: { x: number; y: number };
  accentColor: string;
}

export interface BossBattle {
  id: string;
  name: string;
  epithet: string;
  totalHp: number;
  currentHp: number;
  deadlineHours: number;
  vulnerabilityAttribute: AttributeKey;
  debuffDescription: string;
  rewardXp: number;
  rewardGold: number;
  rewardItemName: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'artifact' | 'consumable' | 'gear' | 'theme';
  cost: number;
  purchased: boolean;
  equipped: boolean;
  perkDescription: string;
  iconName: string;
  loreDescription?: string;
  effectSummary?: string;
  characterImpact?: string[];
  source?: string;
  unlockRequirement?: {
    type: 'level' | 'territories' | 'badge';
    targetValue: number | string;
    description: string;
  };
  slotType?: 'artifact' | 'gear' | 'theme' | 'consumable';
}

export interface Badge {
  id: string;
  name: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: string;
  unlocked: boolean;
  unlockedDate?: string;
  description: string;
  iconName: string;
}

export interface OracleReasonItem {
  number: string;
  title: string;
  detail: string;
}

export interface OracleAlternativeMove {
  questId: string;
  title: string;
  category: AttributeKey;
  xpReward: number;
  timeEstimateMinutes: number;
  reason: string;
}

export interface OracleInsight {
  id: string;
  generatedAt: string;
  statusHeadline: string;
  coreDiagnosis: string;
  recommendedQuestId: string;
  recommendationReason: string;
  recommendationBullets?: string[];
  confidenceScore?: number;
  reasons?: OracleReasonItem[];
  alternativeMoves?: OracleAlternativeMove[];
  recentPattern?: {
    summary: string;
    priorityReason: string;
  };
  worldImpact?: {
    regionId: string;
    regionName: string;
    currentScore: number;
    projectedScore: number;
    note: string;
  };
  balanceAlert: {
    hasImbalance: boolean;
    neglectedDomain?: AttributeKey;
    dominantDomain?: AttributeKey;
    actionAdvice: string;
  };
  tacticalTip: string;
}

export interface ReplayDay {
  dayName: string;
  dateStr: string;
  xpEarned: number;
  questsCompleted: number;
  momentumScore: number;
  topAttribute: AttributeKey;
  milestone?: string;
}

export type Player = PlayerProfile;
export type Attribute = AttributeInfo;
export type Region = WorldRegion;
export type Boss = BossBattle;
export type ReplayData = ReplayDay;

export interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  unlockedTitle?: string;
  bonusGold: number;
}

export type ActiveTab = 'dashboard' | 'quests' | 'character' | 'world' | 'oracle' | 'replay' | 'inventory' | 'settings' | 'landing' | 'auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthScreenMode = 'entry' | 'signin' | 'signup' | 'forgot' | 'verify';

export interface OperatorUser {
  uid: string;
  email: string | null;
  callsign: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  photoURL?: string | null;
}

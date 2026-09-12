# 04 // DATA MODEL & SCHEMA SPECIFICATION

## 1. CORE TYPES & INTERFACES (CLIENT SCHEMA)

### PlayerProfile
```typescript
interface PlayerProfile {
  id: string;
  username: string;
  title: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  gold: number;
  momentum: number; // 0 - 100%
  streakDays: number;
  characterClass: string;
  avatarUrl?: string;
  worldMasteryPercentage: number;
  completedQuestsCount: number;
}
```

### AttributeInfo (6 Vectors)
```typescript
type AttributeKey = 'strength' | 'intellect' | 'discipline' | 'creativity' | 'wellness' | 'social';

interface AttributeInfo {
  key: AttributeKey;
  label: string;
  domain: string;
  value: number;
  maxValue: number;
  level: number;
  color: string;
  iconName: string;
  recentGain: number;
  description: string;
}
```

### Quest
```typescript
type QuestType = 'daily' | 'epic' | 'habit' | 'boss_raid';
type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
type QuestStatus = 'active' | 'completed' | 'abandoned';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: AttributeKey;
  type: QuestType;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  status: QuestStatus;
  streakContribution: boolean;
  bossDamageContribution: number;
  regionId: string;
  estimatedMinutes?: number;
  dnaTags: string[];
  createdAt: string;
  completedAt?: string;
}
```

### WorldRegion
```typescript
interface WorldRegion {
  id: string;
  name: string;
  codeName: string;
  associatedAttribute: AttributeKey;
  domain: string;
  influenceScore: number; // 0 - 100%
  status: 'locked' | 'unlocked' | 'mastered';
  accentColor: string;
  description: string;
  coordinates: { x: number; y: number };
}
```

### BossBattle
```typescript
interface BossBattle {
  id: string;
  name: string;
  title: string;
  currentHp: number;
  maxHp: number;
  deadline: string;
  rewardPool: { xp: number; gold: number; title: string };
  weaknessAttribute: AttributeKey;
  status: 'active' | 'defeated' | 'expired';
}
```

## 2. FUTURE RELATIONAL SQL SCHEMA (POSTGRESQL SPEC)
Tables planned for backend deployment:
1. `users` (id UUID PRIMARY KEY, username VARCHAR(50), level INT, xp INT, gold INT, streak INT, class VARCHAR(50), created_at TIMESTAMP)
2. `attributes` (user_id UUID, attribute_key VARCHAR(20), level INT, current_val INT, PRIMARY KEY(user_id, attribute_key))
3. `quests` (id UUID PRIMARY KEY, user_id UUID, title TEXT, category VARCHAR(20), type VARCHAR(20), difficulty CHAR(1), xp_reward INT, gold_reward INT, status VARCHAR(15), created_at TIMESTAMP)
4. `world_regions` (user_id UUID, region_id VARCHAR(50), influence_score INT, status VARCHAR(15))
5. `inventory_items` (user_id UUID, item_id VARCHAR(50), equipped BOOLEAN, purchased_at TIMESTAMP)

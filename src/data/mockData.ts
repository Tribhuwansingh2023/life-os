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

export const INITIAL_PLAYER: PlayerProfile = {
  id: 'usr_initiate_01',
  username: 'RECRUIT',
  title: 'Initiate Architect',
  characterClass: 'Quantum Architect',
  avatarSeed: 'recruit-core',
  level: 1,
  currentXp: 0,
  nextLevelXp: 1250,
  gold: 150,
  momentum: 50,
  streakDays: 1,
  worldMasteryPercentage: 15,
  completedQuestsCount: 0,
  activeBuffs: [],
  statusEffects: [
    {
      id: 'eff_high_focus',
      name: 'High Focus',
      type: 'buff',
      description: 'Heightened cognitive flow state accelerating problem resolution speed and insight generation.',
      statModifier: '+10% Intellect & XP',
      multiplier: 1.10,
      durationTotalHours: 8,
      durationLeftHours: 6.0,
      iconName: 'Zap',
      color: '#00f0ff'
    }
  ]
};

export const INITIAL_ATTRIBUTES: Record<string, AttributeInfo> = {
  strength: {
    key: 'strength',
    label: 'Strength',
    value: 25,
    maxValue: 100,
    level: 5,
    domain: 'Physical Vitality & Resilience',
    color: '#f43f5e',
    iconName: 'Dumbbell',
    recentGain: 0,
    description: 'Physical power, endurance training, posture, and kinetic fortitude.'
  },
  intellect: {
    key: 'intellect',
    label: 'Intellect',
    value: 30,
    maxValue: 100,
    level: 6,
    domain: 'Knowledge, Logic & System Design',
    color: '#00f0ff',
    iconName: 'Brain',
    recentGain: 0,
    description: 'Problem-solving speed, technical mastery, reading, and architectural synthesis.'
  },
  discipline: {
    key: 'discipline',
    label: 'Discipline',
    value: 25,
    maxValue: 100,
    level: 5,
    domain: 'Willpower & Habit Consistency',
    color: '#8b5cf6',
    iconName: 'ShieldCheck',
    recentGain: 0,
    description: 'Friction tolerance, deep work continuity, resistance to impulse distractions.'
  },
  creativity: {
    key: 'creativity',
    label: 'Creativity',
    value: 20,
    maxValue: 100,
    level: 4,
    domain: 'Ideation, Expression & Craft',
    color: '#f59e0b',
    iconName: 'Sparkles',
    recentGain: 0,
    description: 'Generative thinking, aesthetic intuition, novel synthesis, and expressive writing.'
  },
  wellness: {
    key: 'wellness',
    label: 'Wellness',
    value: 25,
    maxValue: 100,
    level: 5,
    domain: 'Sleep, Recovery & Mental Peace',
    color: '#10b981',
    iconName: 'HeartPulse',
    recentGain: 0,
    description: 'Circadian alignment, nervous system regulation, hydration, and restorative stillness.'
  },
  social: {
    key: 'social',
    label: 'Social',
    value: 20,
    maxValue: 100,
    level: 4,
    domain: 'Community, Mentorship & Bonds',
    color: '#38bdf8',
    iconName: 'Users',
    recentGain: 0,
    description: 'Interpersonal depth, team synchronization, empathy, and active networking.'
  }
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'qst_01',
    title: 'Initialize Daily Deep Work Routine',
    category: 'intellect',
    type: 'daily',
    difficulty: 'C',
    timeEstimateMinutes: 45,
    xpReward: 200,
    goldReward: 80,
    momentumBoost: 5,
    attributesAffected: [
      { attribute: 'intellect', gain: 5 },
      { attribute: 'discipline', gain: 3 }
    ],
    description: 'Execute 45 minutes of uninterrupted high-leverage focus on your primary technical or learning objective.',
    dnaTags: ['Deep Focus', 'Productivity', 'Habit'],
    regionId: 'reg_archive',
    status: 'active',
    dueDate: 'Today, 18:00',
    streakCount: 1,
    isRecommendedByOracle: true
  },
  {
    id: 'qst_02',
    title: '30-Minute Physical Conditioning',
    category: 'strength',
    type: 'daily',
    difficulty: 'C',
    timeEstimateMinutes: 30,
    xpReward: 150,
    goldReward: 60,
    momentumBoost: 4,
    attributesAffected: [
      { attribute: 'strength', gain: 5 },
      { attribute: 'wellness', gain: 2 }
    ],
    description: 'Complete a 30-minute workout, cardio session, or physical movement circuit.',
    dnaTags: ['Fitness', 'Health', 'Workout'],
    regionId: 'reg_citadel',
    status: 'active',
    dueDate: 'Today, 17:00',
    streakCount: 1
  },
  {
    id: 'qst_03',
    title: 'Defeat Procrastination: Clear Core Bottleneck',
    category: 'discipline',
    type: 'boss_raid',
    difficulty: 'B',
    timeEstimateMinutes: 60,
    xpReward: 300,
    goldReward: 120,
    momentumBoost: 8,
    attributesAffected: [
      { attribute: 'discipline', gain: 6 },
      { attribute: 'intellect', gain: 4 }
    ],
    description: 'Tackle and resolve your single highest-priority bottleneck task to deal 300 damage to Chronos.',
    dnaTags: ['Boss Battle', 'Milestone', 'Focus'],
    regionId: 'reg_foundry',
    status: 'active',
    dueDate: 'Today, 20:00',
    streakCount: 0
  }
];

export const INITIAL_REGIONS: WorldRegion[] = [
  {
    id: 'reg_citadel',
    name: 'The Iron Citadel',
    codeName: 'CITADEL-01',
    domain: 'Physical Vitality & Strength',
    associatedAttribute: 'strength',
    status: 'unlocked',
    influenceScore: 25,
    biomeType: 'citadel',
    description: 'Fortress forged from carbonized basalt and kinetic power generators. Thrives when physical resistance training is executed.',
    activeQuestsCount: 1,
    coordinates: { x: 22, y: 35 },
    accentColor: '#f43f5e'
  },
  {
    id: 'reg_archive',
    name: 'Archive of Light',
    codeName: 'ARCHIVE-02',
    domain: 'Intellect & Deep Knowledge',
    associatedAttribute: 'intellect',
    status: 'unlocked',
    influenceScore: 30,
    biomeType: 'archive',
    description: 'Crystalline spires housing petabytes of synthesized wisdom and algorithmic schematics. Radiates brilliant cyan bioluminescence.',
    activeQuestsCount: 1,
    coordinates: { x: 50, y: 20 },
    accentColor: '#00f0ff'
  },
  {
    id: 'reg_foundry',
    name: 'The Neon Foundry',
    codeName: 'FOUNDRY-03',
    domain: 'Creativity, Code & Craft',
    associatedAttribute: 'creativity',
    status: 'unlocked',
    influenceScore: 20,
    biomeType: 'foundry',
    description: 'Molten plasma kilns transforming raw ideas into shipping prototypes, digital artifacts, and visual systems.',
    activeQuestsCount: 1,
    coordinates: { x: 78, y: 38 },
    accentColor: '#f59e0b'
  },
  {
    id: 'reg_grove',
    name: 'Sanctuary Grove',
    codeName: 'GROVE-04',
    domain: 'Wellness, Recovery & Stillness',
    associatedAttribute: 'wellness',
    status: 'discovered',
    influenceScore: 25,
    biomeType: 'grove',
    description: 'Bioluminescent cedar forest with zero digital interference. Mists cleanse neurotoxins and restore dopamine sensitivity.',
    activeQuestsCount: 0,
    coordinates: { x: 30, y: 72 },
    accentColor: '#10b981'
  },
  {
    id: 'reg_agora',
    name: 'The Grand Agora',
    codeName: 'AGORA-05',
    domain: 'Social Affinity & Leadership',
    associatedAttribute: 'social',
    status: 'unlocked',
    influenceScore: 20,
    biomeType: 'agora',
    description: 'Floating amphitheater where decentralized guilds assemble to forge alliances, exchange high-value insights, and coordinate expeditions.',
    activeQuestsCount: 0,
    coordinates: { x: 70, y: 75 },
    accentColor: '#38bdf8'
  }
];

export const INITIAL_BOSS: BossBattle = {
  id: 'boss_01',
  name: 'Chronos the Procrastinator',
  epithet: 'Devourer of Unlived Potential',
  totalHp: 1000,
  currentHp: 1000,
  deadlineHours: 24,
  vulnerabilityAttribute: 'discipline',
  debuffDescription: 'Casts "Entropy Veil": passive -10% XP if quests are delayed past their targeted scheduled time window.',
  rewardXp: 500,
  rewardGold: 300,
  rewardItemName: 'Sands of Sovereign Focus (Relic)'
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item_01',
    name: 'Focus Prism of Hyperion',
    rarity: 'legendary',
    category: 'artifact',
    cost: 500,
    purchased: true,
    equipped: true,
    perkDescription: 'Increases Discipline and Intellect gains by +15% during continuous deep work blocks.',
    loreDescription: 'A crystalline prism resonant with high-frequency cognitive focus, forged in the Archive of Light.',
    effectSummary: '+15% Discipline and Intellect gains during focus sessions',
    characterImpact: [
      'Accelerated Discipline leveling on deep work quests',
      'Higher Intellect gains during complex system design'
    ],
    source: 'Starter Architect artifact.',
    slotType: 'artifact',
    iconName: 'Compass'
  },
  {
    id: 'item_02',
    name: 'Obsidian Chrono Cloak',
    rarity: 'epic',
    category: 'gear',
    cost: 450,
    purchased: false,
    equipped: false,
    perkDescription: 'Reduces momentum decay rate by 30% on low activity days.',
    loreDescription: 'Woven from chronological dampening fibers that insulate the wearer against procrastination decay.',
    effectSummary: '-30% Momentum decay rate protection',
    characterImpact: [
      'Softens streak vulnerability during high-fatigue days'
    ],
    source: 'Available in the Armory Shop (450 G).',
    slotType: 'gear',
    iconName: 'Shield'
  },
  {
    id: 'item_03',
    name: 'Neural Synchronizer Band',
    rarity: 'rare',
    category: 'gear',
    cost: 300,
    purchased: false,
    equipped: false,
    perkDescription: '+10% XP when alternating between physical (Strength) and cognitive (Intellect) quests.',
    loreDescription: 'A biomorphic wristband that optimizes cognitive cross-training.',
    effectSummary: '+10% XP on cross-domain attribute training',
    characterImpact: [
      'Increases overall level progression speed'
    ],
    source: 'Available in the Armory Shop (300 G).',
    slotType: 'gear',
    iconName: 'Radio'
  },
  {
    id: 'item_04',
    name: 'Elixir of Somatic Restoration',
    rarity: 'rare',
    category: 'consumable',
    cost: 150,
    purchased: false,
    equipped: false,
    perkDescription: 'Instant +20 Momentum boost and removes active procrastination debuffs for 12 hours.',
    loreDescription: 'An organic botanical blend synthesized from Sanctuary Grove flora.',
    effectSummary: '+20 Instant Momentum & debuff cleanse',
    characterImpact: [
      'Restores momentum instantly to maximum flow threshold'
    ],
    source: 'Sanctuary Grove shop depot.',
    slotType: 'consumable',
    iconName: 'FlaskConical'
  },
  {
    id: 'item_05',
    name: 'Cyberpunk Aurora Theme Skin',
    rarity: 'epic',
    category: 'theme',
    cost: 500,
    purchased: false,
    equipped: false,
    perkDescription: 'Transforms UI ambient lighting into prismatic quantum radiation particles.',
    loreDescription: 'Visual customization package extracted from high-yield Neon Foundry plasma conduits.',
    effectSummary: 'Prismatic HUD ambiance & glowing UI accents',
    characterImpact: [
      'Cosmetic immersion overhaul across all views'
    ],
    source: 'Neon Foundry shop release.',
    slotType: 'theme',
    iconName: 'Palette'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'bdg_01',
    name: 'First Step',
    rarity: 'bronze',
    category: 'Initiation',
    unlocked: true,
    unlockedDate: 'Today',
    description: 'Initialized LIFE//OS and logged into the Quantum Command Center.',
    iconName: 'Award'
  },
  {
    id: 'bdg_02',
    name: 'Century Striker',
    rarity: 'platinum',
    category: 'Consistency',
    unlocked: false,
    description: 'Surpass 100 verified quest executions with pristine documentation.',
    iconName: 'Award'
  },
  {
    id: 'bdg_03',
    name: 'Cognitive Colossus',
    rarity: 'gold',
    category: 'Intellect',
    unlocked: false,
    description: 'Elevate the Intellect attribute beyond Level 20.',
    iconName: 'Brain'
  },
  {
    id: 'bdg_04',
    name: 'Boss Decimator',
    rarity: 'silver',
    category: 'Combat',
    unlocked: false,
    description: 'Defeat a Boss Raid with at least 12 hours to spare.',
    iconName: 'Swords'
  },
  {
    id: 'bdg_05',
    name: 'Fortnight of Iron',
    rarity: 'gold',
    category: 'Streaks',
    unlocked: false,
    description: 'Sustain an unbroken 14-day daily progression streak.',
    iconName: 'Flame'
  }
];

export const INITIAL_ORACLE: OracleInsight = {
  id: 'orc_001',
  generatedAt: 'Just now',
  statusHeadline: 'Command Center Initialized // Active Quests Stack Ready',
  coreDiagnosis: 'Your LIFE//OS system is online at Level 1. Completing your active Daily Deep Work and Physical Conditioning quests will build momentum and deal initial damage to Chronos.',
  recommendedQuestId: 'qst_01',
  recommendationReason: 'Starting with "Initialize Daily Deep Work Routine" capitalizes on your high focus to earn 200 XP and deal 200 damage to Chronos.',
  recommendationBullets: [
    'Establishes baseline Intellect and Discipline progression',
    'Builds daily momentum baseline (+5%)',
    'Deals 200 direct damage to Chronos the Procrastinator',
    'Estimated time: 45 minutes'
  ],
  confidenceScore: 92,
  reasons: [
    {
      number: '01',
      title: 'MOMENTUM',
      detail: '50% baseline momentum ready for flow acceleration'
    },
    {
      number: '02',
      title: 'STARTING',
      detail: 'Level 1 initialization with 3 active starter quests'
    },
    {
      number: '03',
      title: 'ATTRIBUTE',
      detail: 'Intellect (30) is your primary starting attribute vector'
    },
    {
      number: '04',
      title: 'BOSS RAID',
      detail: 'Chronos at 1000/1000 HP waiting for your first strike'
    }
  ],
  alternativeMoves: [
    {
      questId: 'qst_02',
      title: '30-Minute Physical Conditioning',
      category: 'strength',
      xpReward: 150,
      timeEstimateMinutes: 30,
      reason: 'Builds physical vitality and boosts Strength attribute by +5.'
    },
    {
      questId: 'qst_03',
      title: 'Defeat Procrastination: Clear Core Bottleneck',
      category: 'discipline',
      xpReward: 300,
      timeEstimateMinutes: 60,
      reason: 'Deals 300 damage directly to Chronos.'
    }
  ],
  recentPattern: {
    summary: 'System initialized today with clean baseline metrics.',
    priorityReason: 'Complete your first daily quest to start your streak.'
  },
  worldImpact: {
    regionId: 'reg_archive',
    regionName: 'Archive of Light',
    currentScore: 30,
    projectedScore: 35,
    note: 'Complete this Intellect quest to expand Archive of Light influence.'
  },
  balanceAlert: {
    hasImbalance: false,
    neglectedDomain: 'social',
    dominantDomain: 'intellect',
    actionAdvice: 'Sustain your daily habit stack to earn XP and level up your character.'
  },
  tacticalTip: 'Complete your active quests today to increase your streak and earn gold in the Armory!'
};

export const INITIAL_REPLAY_DAYS: ReplayDay[] = [
  {
    dayName: 'Mon',
    dateStr: 'Day 1',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'intellect',
    milestone: 'Baseline set'
  },
  {
    dayName: 'Tue',
    dateStr: 'Day 2',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'strength',
    milestone: 'Baseline set'
  },
  {
    dayName: 'Wed',
    dateStr: 'Day 3',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'discipline',
    milestone: 'Baseline set'
  },
  {
    dayName: 'Thu',
    dateStr: 'Day 4',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'creativity',
    milestone: 'Baseline set'
  },
  {
    dayName: 'Fri',
    dateStr: 'Day 5',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'wellness',
    milestone: 'Baseline set'
  },
  {
    dayName: 'Sat',
    dateStr: 'Day 6',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'social',
    milestone: 'Baseline set'
  },
  {
    dayName: 'Sun (Today)',
    dateStr: 'Today',
    xpEarned: 0,
    questsCompleted: 0,
    momentumScore: 50,
    topAttribute: 'intellect',
    milestone: 'System Initialized'
  }
];

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
  id: 'usr_tribhuwan_01',
  username: 'TRIBHUWAN',
  title: 'Grand Nexus Sovereign',
  characterClass: 'Quantum Architect',
  avatarSeed: 'tribhuwan-core',
  level: 17,
  currentXp: 4850,
  nextLevelXp: 6500,
  gold: 1240,
  momentum: 88,
  streakDays: 14,
  worldMasteryPercentage: 64,
  completedQuestsCount: 142,
  activeBuffs: [
    {
      name: 'Flow State Surge',
      description: '+15% XP on Intellect and Creativity quests completed before noon',
      multiplier: 1.15,
      durationLeftHours: 6
    },
    {
      name: 'Titan Discipline',
      description: 'Streaks decay 50% slower during active Boss Raids',
      multiplier: 1.0,
      durationLeftHours: 28
    }
  ],
  statusEffects: [
    {
      id: 'eff_high_focus',
      name: 'High Focus',
      type: 'buff',
      description: 'Heightened cognitive flow state accelerating problem resolution speed and insight generation.',
      statModifier: '+18% Intellect & XP',
      multiplier: 1.18,
      durationTotalHours: 8,
      durationLeftHours: 5.4,
      iconName: 'Zap',
      color: '#00f0ff'
    },
    {
      id: 'eff_titan_discipline',
      name: 'Titan Discipline',
      type: 'buff',
      description: 'Synaptic reinforcement protecting streaks against procrastination decay during high-stakes raids.',
      statModifier: '+12% Momentum Retention',
      multiplier: 1.12,
      durationTotalHours: 24,
      durationLeftHours: 18.2,
      iconName: 'Shield',
      color: '#8b5cf6'
    },
    {
      id: 'eff_fatigued',
      name: 'Fatigued',
      type: 'debuff',
      description: 'Residual neural exhaustion from midnight deep work sprints. Reduces recovery kinetics until hydration and somatic rest are achieved.',
      statModifier: '-10% Wellness Regen',
      multiplier: 0.90,
      durationTotalHours: 6,
      durationLeftHours: 2.1,
      iconName: 'AlertTriangle',
      color: '#f43f5e'
    }
  ]
};

export const INITIAL_ATTRIBUTES: Record<string, AttributeInfo> = {
  strength: {
    key: 'strength',
    label: 'Strength',
    value: 68,
    maxValue: 100,
    level: 14,
    domain: 'Physical Vitality & Resilience',
    color: '#f43f5e',
    iconName: 'Dumbbell',
    recentGain: 4,
    description: 'Physical power, endurance training, posture, and kinetic fortitude.'
  },
  intellect: {
    key: 'intellect',
    label: 'Intellect',
    value: 92,
    maxValue: 100,
    level: 21,
    domain: 'Knowledge, Logic & System Design',
    color: '#00f0ff',
    iconName: 'Brain',
    recentGain: 12,
    description: 'Problem-solving speed, technical mastery, reading, and architectural synthesis.'
  },
  discipline: {
    key: 'discipline',
    label: 'Discipline',
    value: 84,
    maxValue: 100,
    level: 18,
    domain: 'Willpower & Habit Consistency',
    color: '#8b5cf6',
    iconName: 'ShieldCheck',
    recentGain: 8,
    description: 'Friction tolerance, deep work continuity, resistance to impulse distractions.'
  },
  creativity: {
    key: 'creativity',
    label: 'Creativity',
    value: 78,
    maxValue: 100,
    level: 16,
    domain: 'Ideation, Expression & Craft',
    color: '#f59e0b',
    iconName: 'Sparkles',
    recentGain: 6,
    description: 'Generative thinking, aesthetic intuition, novel synthesis, and expressive writing.'
  },
  wellness: {
    key: 'wellness',
    label: 'Wellness',
    value: 58,
    maxValue: 100,
    level: 11,
    domain: 'Sleep, Recovery & Mental Peace',
    color: '#10b981',
    iconName: 'HeartPulse',
    recentGain: 2,
    description: 'Circadian alignment, nervous system regulation, hydration, and restorative stillness.'
  },
  social: {
    key: 'social',
    label: 'Social',
    value: 62,
    maxValue: 100,
    level: 13,
    domain: 'Community, Mentorship & Bonds',
    color: '#38bdf8',
    iconName: 'Users',
    recentGain: 5,
    description: 'Interpersonal depth, team synchronization, empathy, and active networking.'
  }
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'qst_01',
    title: 'Deploy Production Architecture Pipeline',
    category: 'intellect',
    type: 'epic',
    difficulty: 'A',
    timeEstimateMinutes: 90,
    xpReward: 420,
    goldReward: 160,
    momentumBoost: 8,
    attributesAffected: [
      { attribute: 'intellect', gain: 7 },
      { attribute: 'discipline', gain: 4 }
    ],
    description: 'Finalize serverless container manifests, verify HTTPS endpoints, and integrate automated regression suites for zero-downtime deployment.',
    dnaTags: ['Deep Focus', 'Systems Architecture', 'High Leverage'],
    regionId: 'reg_archive',
    status: 'active',
    dueDate: 'Today, 18:00',
    streakCount: 3,
    isRecommendedByOracle: true
  },
  {
    id: 'qst_02',
    title: 'Heavy Strength Training (Squats & Deadlifts)',
    category: 'strength',
    type: 'daily',
    difficulty: 'B',
    timeEstimateMinutes: 50,
    xpReward: 260,
    goldReward: 90,
    momentumBoost: 6,
    attributesAffected: [
      { attribute: 'strength', gain: 6 },
      { attribute: 'discipline', gain: 3 }
    ],
    description: 'Execute 5 sets of compound lower body movements with strict form, controlled tempo, and steady cadence.',
    dnaTags: ['Strength', 'Power', 'Workout'],
    regionId: 'reg_citadel',
    status: 'active',
    dueDate: 'Today, 15:30',
    streakCount: 14
  },
  {
    id: 'qst_03',
    title: 'Design Architecture Specifications for New Core',
    category: 'creativity',
    type: 'epic',
    difficulty: 'S',
    timeEstimateMinutes: 120,
    xpReward: 580,
    goldReward: 220,
    momentumBoost: 12,
    attributesAffected: [
      { attribute: 'creativity', gain: 9 },
      { attribute: 'intellect', gain: 8 }
    ],
    description: 'Author rigorous system specifications across living modules with clear schemas, error handling, and clean boundaries.',
    dnaTags: ['CreativeWork', 'DeepWork', 'SystemDesign'],
    regionId: 'reg_foundry',
    status: 'active',
    dueDate: 'Today, 21:00'
  },
  {
    id: 'qst_04',
    title: 'Digital Fast & 20-Minute Recovery Reset',
    category: 'wellness',
    type: 'habit',
    difficulty: 'C',
    timeEstimateMinutes: 30,
    xpReward: 180,
    goldReward: 60,
    momentumBoost: 5,
    attributesAffected: [
      { attribute: 'wellness', gain: 8 },
      { attribute: 'discipline', gain: 2 }
    ],
    description: 'Zero blue light after 22:00. Perform 15 minutes of box breathing followed by quiet hydration and journal reflection.',
    dnaTags: ['Recovery', 'Sleep', 'Mindfulness'],
    regionId: 'reg_grove',
    status: 'active',
    dueDate: 'Today, 22:30',
    streakCount: 5
  },
  {
    id: 'qst_05',
    title: 'Lead Technical Masterclass with 3 Engineering Peers',
    category: 'social',
    type: 'daily',
    difficulty: 'B',
    timeEstimateMinutes: 45,
    xpReward: 240,
    goldReward: 80,
    momentumBoost: 6,
    attributesAffected: [
      { attribute: 'social', gain: 7 },
      { attribute: 'intellect', gain: 3 }
    ],
    description: 'Host a live walkthrough analyzing distributed state machines, answering architectural bottlenecks, and elevating squad skills.',
    dnaTags: ['Leadership', 'Mentorship', 'Learning'],
    regionId: 'reg_agora',
    status: 'active',
    dueDate: 'Today, 16:00'
  },
  {
    id: 'qst_06',
    title: 'Chronos the Procrastinator: Clear 3 Pending Tasks',
    category: 'discipline',
    type: 'boss_raid',
    difficulty: 'A',
    timeEstimateMinutes: 40,
    xpReward: 350,
    goldReward: 140,
    momentumBoost: 10,
    attributesAffected: [
      { attribute: 'discipline', gain: 6 },
      { attribute: 'intellect', gain: 5 }
    ],
    description: 'Clear 3 pending tasks and reviews to deal 350 direct boss damage to Chronos the Procrastinator.',
    dnaTags: ['Boss Battle', 'DeepWork', 'Focus'],
    regionId: 'reg_archive',
    status: 'active',
    dueDate: 'Today, 14:00'
  },
  {
    id: 'qst_07',
    title: 'Read 20 Pages of Distributed Systems Engineering',
    category: 'intellect',
    type: 'habit',
    difficulty: 'D',
    timeEstimateMinutes: 25,
    xpReward: 140,
    goldReward: 40,
    momentumBoost: 4,
    attributesAffected: [
      { attribute: 'intellect', gain: 4 },
      { attribute: 'discipline', gain: 2 }
    ],
    description: 'Study Byzantine fault tolerance and vector clock causal ordering with analog margin annotations.',
    dnaTags: ['Learning', 'Consistency', 'Reading'],
    regionId: 'reg_archive',
    status: 'completed',
    completedAt: '08:45 AM',
    streakCount: 22
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
    influenceScore: 72,
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
    status: 'mastered',
    influenceScore: 94,
    biomeType: 'archive',
    description: 'Crystalline spires housing petabytes of synthesized wisdom and algorithmic schematics. Radiates brilliant cyan bioluminescence.',
    activeQuestsCount: 3,
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
    influenceScore: 81,
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
    influenceScore: 48,
    biomeType: 'grove',
    description: 'Bioluminescent cedar forest with zero digital interference. Mists cleanse neurotoxins and restore dopamine sensitivity.',
    activeQuestsCount: 1,
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
    influenceScore: 66,
    biomeType: 'agora',
    description: 'Floating amphitheater where decentralized guilds assemble to forge alliances, exchange high-value insights, and coordinate expeditions.',
    activeQuestsCount: 1,
    coordinates: { x: 70, y: 75 },
    accentColor: '#38bdf8'
  }
];

export const INITIAL_BOSS: BossBattle = {
  id: 'boss_01',
  name: 'Chronos the Procrastinator',
  epithet: 'Devourer of Unlived Potential',
  totalHp: 1800,
  currentHp: 780,
  deadlineHours: 18,
  vulnerabilityAttribute: 'discipline',
  debuffDescription: 'Casts "Entropy Veil": passive -10% XP if quests are delayed past their targeted scheduled time window.',
  rewardXp: 850,
  rewardGold: 500,
  rewardItemName: 'Sands of Sovereign Focus (Legendary Relic)'
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item_01',
    name: 'Focus Prism of Hyperion',
    rarity: 'legendary',
    category: 'artifact',
    cost: 800,
    purchased: true,
    equipped: true,
    perkDescription: 'Increases Discipline and Intellect gains by +15% during 60+ minute continuous deep work blocks.',
    loreDescription: 'A crystalline prism resonant with high-frequency cognitive focus, forged in the depths of the Archive of Light.',
    effectSummary: '+15% Discipline and Intellect gains during 60+ min focus sessions',
    characterImpact: [
      'Accelerated Discipline leveling on deep work quests',
      'Higher Intellect gains during complex system design',
      'Synergizes with Neural Synchronizer Band (+5% total XP)'
    ],
    source: 'Earned by completing 10 consecutive focus sessions.',
    slotType: 'artifact',
    iconName: 'Compass'
  },
  {
    id: 'item_02',
    name: 'Obsidian Chrono Cloak',
    rarity: 'epic',
    category: 'gear',
    cost: 550,
    purchased: true,
    equipped: true,
    perkDescription: 'Reduces momentum decay rate by 30% when a day has fewer than 2 completed quests.',
    loreDescription: 'Woven from chronological dampening fibers that insulate the wearer against procrastination decay.',
    effectSummary: '-30% Momentum decay rate protection',
    characterImpact: [
      'Softens streak vulnerability during high-fatigue days',
      'Maintains flow state momentum baseline above 70%'
    ],
    source: 'Crafted following an unbroken 14-day streak milestone.',
    slotType: 'gear',
    iconName: 'Shield'
  },
  {
    id: 'item_03',
    name: 'Neural Synchronizer Band',
    rarity: 'rare',
    category: 'gear',
    cost: 320,
    purchased: true,
    equipped: false,
    perkDescription: '+10% XP when alternating between physical (Strength) and cognitive (Intellect) quests.',
    loreDescription: 'A biomorphic wristband that optimizes cognitive cross-training by harmonizing motor and mental pathways.',
    effectSummary: '+10% XP on cross-domain attribute training',
    characterImpact: [
      'Increases overall level progression speed',
      'Rewards multi-attribute daily balance'
    ],
    source: 'Acquired from the Grand Agora tech exchange.',
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
    perkDescription: 'Instant +20 Momentum boost and removes any active procrastination debuffs for 12 hours.',
    loreDescription: 'An organic botanical blend synthesized from Sanctuary Grove bioluminescent flora.',
    effectSummary: '+20 Instant Momentum & debuff cleanse',
    characterImpact: [
      'Restores momentum instantly to maximum flow threshold',
      'Neutralizes Chronos procrastination curse'
    ],
    source: 'Sanctuary Grove herbalist laboratory.',
    slotType: 'consumable',
    iconName: 'FlaskConical'
  },
  {
    id: 'item_05',
    name: 'Cyberpunk Aurora Theme Skin',
    rarity: 'epic',
    category: 'theme',
    cost: 600,
    purchased: true,
    equipped: true,
    perkDescription: 'Transforms UI ambient lighting into prismatic quantum radiation particles.',
    loreDescription: 'Visual customization package extracted from high-yield Neon Foundry plasma conduits.',
    effectSummary: 'Prismatic HUD ambiance & glowing UI accents',
    characterImpact: [
      'Cosmetic immersion overhaul across all LIFE//OS views',
      'High-contrast neon particle aesthetics'
    ],
    source: 'Neon Foundry prototype release.',
    slotType: 'theme',
    iconName: 'Palette'
  },
  {
    id: 'item_06',
    name: 'Architects Tesseract',
    rarity: 'legendary',
    category: 'artifact',
    cost: 1400,
    purchased: false,
    equipped: false,
    perkDescription: 'Unlocks advanced holographic regional topology projections and doubles boss raid critical hits.',
    loreDescription: 'A 4-dimensional hypercube pulsing with latent spatial energy, accessible only to true system masters.',
    effectSummary: '2x Boss raid critical damage & topology projection',
    characterImpact: [
      'Doubles damage dealt to Chronos the Procrastinator',
      'Reveals hidden territory micro-expeditions'
    ],
    source: 'Requires Player Level 18 to unlock purchase authorization.',
    unlockRequirement: {
      type: 'level',
      targetValue: 18,
      description: 'Requires: LEVEL 18'
    },
    slotType: 'artifact',
    iconName: 'Box'
  },
  {
    id: 'item_07',
    name: 'Kinetic Wrist Bracers',
    rarity: 'common',
    category: 'gear',
    cost: 180,
    purchased: true,
    equipped: false,
    perkDescription: '+5% bonus Strength attribute yield on gym workout check-ins.',
    loreDescription: 'Reinforced carbon bracers engineered in the Iron Citadel to stabilize kinetic lift tracking.',
    effectSummary: '+5% Strength progression yield',
    characterImpact: [
      'Elevates physical attribute gains on heavy workouts',
      'Accelerates Citadel territory influence'
    ],
    source: 'Iron Citadel training grounds depot.',
    slotType: 'gear',
    iconName: 'Zap'
  },
  {
    id: 'item_08',
    name: 'Cognitive Filter Monocle',
    rarity: 'rare',
    category: 'artifact',
    cost: 420,
    purchased: false,
    equipped: false,
    perkDescription: 'Suppresses notification alerts and highlights high-leverage quests with a cyan aura.',
    loreDescription: 'Optical lenses crafted in the Archive of Light that filter extraneous sensory noise.',
    effectSummary: 'Cyan highlight on Oracle-recommended quests',
    characterImpact: [
      'Visual guidance directly in the Command Center',
      'Enhanced focus on priority S-tier objectives'
    ],
    source: 'Available in the Armory Vault (420 G).',
    slotType: 'artifact',
    iconName: 'Eye'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'bdg_01',
    name: 'Century Striker',
    rarity: 'platinum',
    category: 'Consistency',
    unlocked: true,
    unlockedDate: '2 days ago',
    description: 'Surpassed 100 verified quest executions with pristine documentation.',
    iconName: 'Award'
  },
  {
    id: 'bdg_02',
    name: 'Cognitive Colossus',
    rarity: 'gold',
    category: 'Intellect',
    unlocked: true,
    unlockedDate: '5 days ago',
    description: 'Elevated the Intellect attribute beyond Level 20, uncovering the deepest Archive mysteries.',
    iconName: 'Brain'
  },
  {
    id: 'bdg_03',
    name: 'Boss Decimator',
    rarity: 'silver',
    category: 'Combat',
    unlocked: true,
    unlockedDate: '1 week ago',
    description: 'Single-handedly defeated an S-tier Procrastination Boss with 12 hours to spare.',
    iconName: 'Swords'
  },
  {
    id: 'bdg_04',
    name: 'Fortnight of Iron',
    rarity: 'gold',
    category: 'Streaks',
    unlocked: true,
    unlockedDate: 'Yesterday',
    description: 'Sustained an unbroken 14-day daily progression streak across all 6 core attributes.',
    iconName: 'Flame'
  },
  {
    id: 'bdg_05',
    name: 'Master of Equilibrium',
    rarity: 'platinum',
    category: 'Balance',
    unlocked: false,
    description: 'Attain Level 15 or higher across all 6 life domains simultaneously.',
    iconName: 'Scale'
  },
  {
    id: 'bdg_06',
    name: 'Architect of Worlds',
    rarity: 'gold',
    category: 'Exploration',
    unlocked: false,
    description: 'Achieve 100% mastery score across all 5 territories on the living world map.',
    iconName: 'Globe'
  }
];

export const INITIAL_ORACLE: OracleInsight = {
  id: 'orc_001',
  generatedAt: '12 minutes ago',
  statusHeadline: 'Intellect Surging // Wellness Needs Attention',
  coreDiagnosis: 'Your Intellect and Discipline are progressing quickly, but Wellness has fallen behind. One short recovery quest would improve your balance without slowing your overall progression.',
  recommendedQuestId: 'qst_01',
  recommendationReason: 'Deploying the production architecture pipeline capitalizes on your 88% momentum to advance toward the Archive of Light mastery milestone and deal 420 damage to Chronos.',
  recommendationBullets: [
    'Strong alignment with your current Intellect progression (Level 21)',
    'Your current momentum (88%) increases the expected reward yield',
    'Moves you closer to your next milestone (Archive of Light 94% → 97%)',
    'Fits your active morning focus window (90 min estimated)'
  ],
  confidenceScore: 87,
  reasons: [
    {
      number: '01',
      title: 'MOMENTUM',
      detail: '88% current momentum with Flow State multiplier active'
    },
    {
      number: '02',
      title: 'MILESTONE',
      detail: '1 high-value quest away from Hyper-Drive unlock (+25% gold)'
    },
    {
      number: '03',
      title: 'ATTRIBUTE',
      detail: 'Intellect (92) is currently your strongest growth vector'
    },
    {
      number: '04',
      title: 'BALANCE',
      detail: 'Wellness (58) is your weakest region and needs a recovery session'
    }
  ],
  alternativeMoves: [
    {
      questId: 'qst_04',
      title: '30-minute Wellness Reset',
      category: 'wellness',
      xpReward: 180,
      timeEstimateMinutes: 30,
      reason: 'Restores Wellness balance and prevents fatigue from slowing your progression.'
    },
    {
      questId: 'qst_05',
      title: 'Lead Technical Masterclass',
      category: 'social',
      xpReward: 240,
      timeEstimateMinutes: 45,
      reason: 'Strengthens Social affinity and advances The Grand Agora territory.'
    }
  ],
  recentPattern: {
    summary: "You've completed 4 Intellect quests this week but only 1 Wellness quest.",
    priorityReason: "That's why Wellness is currently receiving priority for follow-up sessions."
  },
  worldImpact: {
    regionId: 'reg_archive',
    regionName: 'Archive of Light',
    currentScore: 94,
    projectedScore: 97,
    note: 'Complete this Intellect quest to expand Archive of Light toward full 100% mastery.'
  },
  balanceAlert: {
    hasImbalance: true,
    neglectedDomain: 'wellness',
    dominantDomain: 'intellect',
    actionAdvice: 'Complete one Wellness recovery quest today to restore life balance and clear the fatigue debuff.'
  },
  tacticalTip: 'Your momentum is currently at 88%. Completing one more high-difficulty quest today will trigger "Hyper-Drive Mode", granting +25% gold across all remaining daily bounties.'
};

export const INITIAL_REPLAY_DAYS: ReplayDay[] = [
  {
    dayName: 'Mon',
    dateStr: 'Sep 06',
    xpEarned: 1150,
    questsCompleted: 5,
    momentumScore: 82,
    topAttribute: 'intellect',
    milestone: 'Archive of Light reached 90%'
  },
  {
    dayName: 'Tue',
    dateStr: 'Sep 07',
    xpEarned: 980,
    questsCompleted: 4,
    momentumScore: 84,
    topAttribute: 'strength',
    milestone: 'Heavy Kinetic Circuit Completed'
  },
  {
    dayName: 'Wed',
    dateStr: 'Sep 08',
    xpEarned: 1420,
    questsCompleted: 6,
    momentumScore: 91,
    topAttribute: 'creativity',
    milestone: 'Created 4 System Schematics'
  },
  {
    dayName: 'Thu',
    dateStr: 'Sep 09',
    xpEarned: 820,
    questsCompleted: 3,
    momentumScore: 85,
    topAttribute: 'discipline',
    milestone: '14-Day Consistency Streak Maintained'
  },
  {
    dayName: 'Fri',
    dateStr: 'Sep 10',
    xpEarned: 1650,
    questsCompleted: 7,
    momentumScore: 94,
    topAttribute: 'intellect',
    milestone: 'Reached Level 17'
  },
  {
    dayName: 'Sat',
    dateStr: 'Sep 11',
    xpEarned: 1200,
    questsCompleted: 5,
    momentumScore: 89,
    topAttribute: 'social',
    milestone: 'Completed Tech Guild Expedition'
  },
  {
    dayName: 'Sun (Today)',
    dateStr: 'Sep 12',
    xpEarned: 680,
    questsCompleted: 2,
    momentumScore: 88,
    topAttribute: 'intellect',
    milestone: 'Inflicted 350 DMG to Boss'
  }
];

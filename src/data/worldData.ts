import { AttributeKey, WorldRegion, Quest } from '../types';
import {
  Brain,
  Dumbbell,
  Sparkles,
  HeartPulse,
  Users,
  ShieldCheck,
  Building2,
  Library,
  Flame,
  Trees,
  Landmark,
  Crown,
  Lock,
  Compass
} from 'lucide-react';

export interface RegionLandmarkInfo {
  id: string;
  regionId: string;
  name: string;
  tagline: string;
  description: string;
  requiredScore: number;
  rewardBadgeTitle: string;
  rewardPerk: string;
  icon: any;
}

export interface RegionMetaConfig {
  regionId: string;
  attributeKey: AttributeKey;
  attributeLabel: string;
  attributeIcon: any;
  realLifeAction: string;
  humanNarrative: string;
  accentColor: string;
  bgGlowColor: string;
  landmark: RegionLandmarkInfo;
  milestones: {
    percentage: number;
    title: string;
    description: string;
  }[];
}

export const REGION_CONFIGS: Record<string, RegionMetaConfig> = {
  reg_citadel: {
    regionId: 'reg_citadel',
    attributeKey: 'strength',
    attributeLabel: 'Strength',
    attributeIcon: Dumbbell,
    realLifeAction: 'Exercise & Movement',
    humanNarrative:
      'Your physical workouts, resistance training, and kinetic discipline expand this basalt fortress.',
    accentColor: '#f43f5e',
    bgGlowColor: 'rgba(244, 63, 94, 0.15)',
    landmark: {
      id: 'lm_citadel',
      regionId: 'reg_citadel',
      name: 'The Basalt Bastion',
      tagline: 'Kinetic Forge of the Ironbound',
      description:
        'A towering monolith of carbonized basalt and hydraulic training rings, powered by every lift and sprint in real life.',
      requiredScore: 100,
      rewardBadgeTitle: 'Ironbound Bastion Badge',
      rewardPerk: '+10% Strength XP bonus and faster recovery multiplier',
      icon: Building2
    },
    milestones: [
      { percentage: 25, title: 'Iron Outpost', description: 'Scouting camp established from your first training sessions.' },
      { percentage: 50, title: 'Kinetic Forge', description: 'Power generators hum as consistency increases.' },
      { percentage: 75, title: 'Fortress Ramparts', description: 'Heavy battlements defend against physical stagnation.' },
      { percentage: 100, title: 'The Basalt Bastion', description: 'Legendary fortress fully unlocked. Strength Mastery achieved.' }
    ]
  },
  reg_archive: {
    regionId: 'reg_archive',
    attributeKey: 'intellect',
    attributeLabel: 'Intellect',
    attributeIcon: Brain,
    realLifeAction: 'Learning & Building',
    humanNarrative:
      'Your learning, reading, deep work, and system design quests illuminate these crystal spires.',
    accentColor: '#00f0ff',
    bgGlowColor: 'rgba(0, 240, 255, 0.15)',
    landmark: {
      id: 'lm_archive',
      regionId: 'reg_archive',
      name: 'The Great Crystal Library',
      tagline: 'Infinite Spires of Synthesized Knowledge',
      description:
        'Floating prismatic towers housing petabytes of curated insight, glowing brighter with every book finished and concept mastered.',
      requiredScore: 100,
      rewardBadgeTitle: 'Master Scholar Badge',
      rewardPerk: '+15% Intellect research efficiency and cognitive clarity',
      icon: Library
    },
    milestones: [
      { percentage: 25, title: 'Scholar\'s Beacon', description: 'Initial crystal prism ignited from steady reading.' },
      { percentage: 50, title: 'Archive Spire', description: 'Towers of reference materials rise into the skyline.' },
      { percentage: 75, title: 'Neural Observatory', description: 'Synthesized logic channels illuminate the territory.' },
      { percentage: 100, title: 'The Great Crystal Library', description: 'Mastery landmark unlocked. Intellect zenith reached.' }
    ]
  },
  reg_foundry: {
    regionId: 'reg_foundry',
    attributeKey: 'creativity',
    attributeLabel: 'Creativity',
    attributeIcon: Sparkles,
    realLifeAction: 'Creative Work & Craft',
    humanNarrative:
      'Your creative projects, writing, visual design, and code craftsmanship fuel these molten kilns.',
    accentColor: '#f59e0b',
    bgGlowColor: 'rgba(245, 158, 11, 0.15)',
    landmark: {
      id: 'lm_foundry',
      regionId: 'reg_foundry',
      name: 'The Prismatic Plasma Spire',
      tagline: 'Heart of Infinite Innovation',
      description:
        'Molten plasma kilns transforming raw ideas into shipping prototypes, digital artifacts, and creative breakthroughs.',
      requiredScore: 100,
      rewardBadgeTitle: 'Creator\'s Sigil Badge',
      rewardPerk: '+15% Gold bounty on creative quests and higher relic drop chance',
      icon: Flame
    },
    milestones: [
      { percentage: 25, title: 'Drafting Kiln', description: 'First creative drafts ignited with steady flow.' },
      { percentage: 50, title: 'Synthesis Foundry', description: 'Production lines forge original solutions.' },
      { percentage: 75, title: 'Aesthetic Bastion', description: 'High-craft designs shape the territory skyline.' },
      { percentage: 100, title: 'The Prismatic Plasma Spire', description: 'Creative mastery unlocked. The foundry shines across all realms.' }
    ]
  },
  reg_grove: {
    regionId: 'reg_grove',
    attributeKey: 'wellness',
    attributeLabel: 'Wellness',
    attributeIcon: HeartPulse,
    realLifeAction: 'Wellness & Recovery',
    humanNarrative:
      'Your mindfulness, restorative sleep, hydration, and recovery resets bring vitality to this sanctuary.',
    accentColor: '#10b981',
    bgGlowColor: 'rgba(16, 185, 129, 0.15)',
    landmark: {
      id: 'lm_grove',
      regionId: 'reg_grove',
      name: 'The Celestial Ancient Grove',
      tagline: 'Oasis of Restorative Stillness',
      description:
        'A sacred cedar forest of bioluminescent flora and clean air, shielding your nervous system and restoring dopamine sensitivity.',
      requiredScore: 100,
      rewardBadgeTitle: 'Restoration Sigil Badge',
      rewardPerk: 'Streak Freeze protection buffer and +20% sleep quality bonus',
      icon: Trees
    },
    milestones: [
      { percentage: 25, title: 'Misty Clearing', description: 'Quiet space carved out through intentional recovery.' },
      { percentage: 50, title: 'Spring of Renewal', description: 'Bioluminescent flora begins to flourish.' },
      { percentage: 75, title: 'Sacred Canopy', description: 'Ancient roots create a protective restorative dome.' },
      { percentage: 100, title: 'The Celestial Ancient Grove', description: 'Peak wellness achieved. Perfect nervous system balance.' }
    ]
  },
  reg_agora: {
    regionId: 'reg_agora',
    attributeKey: 'social',
    attributeLabel: 'Social',
    attributeIcon: Users,
    realLifeAction: 'Relationships & Community',
    humanNarrative:
      'Your check-ins, mentoring, leadership, and community bonds assemble this floating amphitheater.',
    accentColor: '#38bdf8',
    bgGlowColor: 'rgba(56, 189, 248, 0.15)',
    landmark: {
      id: 'lm_agora',
      regionId: 'reg_agora',
      name: 'The Sunken Colosseum Forum',
      tagline: 'Amphitheater of Collective Growth',
      description:
        'A floating assembly arena where friendships, mentorship alliances, and community trust compound over time.',
      requiredScore: 100,
      rewardBadgeTitle: 'Community Builder Badge',
      rewardPerk: '+20% Squad Synergy boost and social accountability shield',
      icon: Landmark
    },
    milestones: [
      { percentage: 25, title: 'Gathering Plaza', description: 'First meaningful check-ins lay the foundations.' },
      { percentage: 50, title: 'Alliance Forum', description: 'Regular conversations strengthen relational bonds.' },
      { percentage: 75, title: 'Civic Amphitheater', description: 'Leadership and mutual support elevate the entire guild.' },
      { percentage: 100, title: 'The Sunken Colosseum Forum', description: 'Social mastery unlocked. Deep relationships enrich your world.' }
    ]
  },
  reg_nexus: {
    regionId: 'reg_nexus',
    attributeKey: 'discipline',
    attributeLabel: 'Discipline',
    attributeIcon: ShieldCheck,
    realLifeAction: 'Habits & Unbroken Consistency',
    humanNarrative:
      'Your streak momentum, habit consistency, and impulse control fortify this central Meridian Spire.',
    accentColor: '#8b5cf6',
    bgGlowColor: 'rgba(139, 92, 246, 0.15)',
    landmark: {
      id: 'lm_nexus',
      regionId: 'reg_nexus',
      name: 'The Chrono Meridian Spire',
      tagline: 'Heart of Unbroken Consistency',
      description:
        'A quantum clockwork tower measuring your daily habit execution, shielding your momentum against decay.',
      requiredScore: 100,
      rewardBadgeTitle: 'Chrono Warden Badge',
      rewardPerk: '+15% Discipline gain and 50% slower momentum decay rate',
      icon: Compass
    },
    milestones: [
      { percentage: 25, title: 'Habit Anchor', description: 'First consistent streak milestones established.' },
      { percentage: 50, title: 'Chrono Matrix', description: 'Daily routines run smoothly with low friction.' },
      { percentage: 75, title: 'Meridian Barrier', description: 'Procrastination entropy deflected.' },
      { percentage: 100, title: 'The Chrono Meridian Spire', description: 'Discipline mastery achieved. Unbroken momentum zenith.' }
    ]
  }
};

/**
 * Returns progression tier descriptor based on influenceScore (0-100)
 */
export function getProgressTier(score: number): {
  tier: number;
  label: string;
  stageName: string;
  nextThreshold: number;
  percentageToNext: number;
} {
  if (score >= 90) {
    return { tier: 5, label: 'Mastered', stageName: 'Region Mastered', nextThreshold: 100, percentageToNext: 100 - score };
  }
  if (score >= 75) {
    return { tier: 4, label: 'Developed', stageName: 'Metropolitan Tier', nextThreshold: 90, percentageToNext: 90 - score };
  }
  if (score >= 50) {
    return { tier: 3, label: 'Established', stageName: 'Expanded Outposts', nextThreshold: 75, percentageToNext: 75 - score };
  }
  if (score >= 25) {
    return { tier: 2, label: 'Early Settlement', stageName: 'Settlement Tier', nextThreshold: 50, percentageToNext: 50 - score };
  }
  return { tier: 1, label: 'Unexplored', stageName: 'Frontier Territory', nextThreshold: 25, percentageToNext: 25 - score };
}

/**
 * Returns human-readable state definition
 */
export function getRegionStateDisplay(status: WorldRegion['status'], score: number): {
  key: 'LOCKED' | 'DISCOVERED' | 'ACTIVE' | 'MASTERED';
  label: string;
  color: string;
  badgeBg: string;
  borderColor: string;
} {
  if (score >= 90 || status === 'mastered') {
    return {
      key: 'MASTERED',
      label: 'MASTERED',
      color: 'text-amber-300',
      badgeBg: 'bg-amber-950/50',
      borderColor: 'border-amber-400/50'
    };
  }
  if (score >= 60 || status === 'unlocked') {
    return {
      key: 'ACTIVE',
      label: 'ACTIVE',
      color: 'text-cyan-300',
      badgeBg: 'bg-cyan-950/50',
      borderColor: 'border-cyan-400/50'
    };
  }
  if (score > 0 || status === 'discovered') {
    return {
      key: 'DISCOVERED',
      label: 'DISCOVERED',
      color: 'text-slate-300',
      badgeBg: 'bg-slate-900/60',
      borderColor: 'border-slate-500/40'
    };
  }
  return {
    key: 'LOCKED',
    label: 'LOCKED',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40'
  };
}

/**
 * Computes dynamic world narrative based on current region scores
 */
export function getDynamicWorldNarrative(regions: WorldRegion[]): {
  headline: string;
  subtext: string;
  highestRegion?: WorldRegion;
  lowestRegion?: WorldRegion;
} {
  if (!regions || regions.length === 0) {
    return {
      headline: 'Your world is a reflection of what you choose to do.',
      subtext: 'Complete a quest in real life to begin shaping territories.'
    };
  }

  const sorted = [...regions].sort((a, b) => b.influenceScore - a.influenceScore);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const highestConfig = REGION_CONFIGS[highest.id];
  const lowestConfig = REGION_CONFIGS[lowest.id];

  if (highest.influenceScore >= 90 && lowest.influenceScore < 60) {
    return {
      headline: `Your ${highestConfig?.attributeLabel || 'Core'} is thriving. ${lowest.name} needs attention.`,
      subtext: `Completing quests in ${lowestConfig?.attributeLabel || 'wellness'} will expand ${lowest.name} and bring balance to your world.`,
      highestRegion: highest,
      lowestRegion: lowest
    };
  }

  if (sorted.every((r) => r.influenceScore >= 70)) {
    return {
      headline: 'All 5 regions are resonating in harmony with your daily habits.',
      subtext: 'Your balanced real-life efforts have expanded all corners of your world.',
      highestRegion: highest,
      lowestRegion: lowest
    };
  }

  return {
    headline: 'Your real-life progress shapes the world around you.',
    subtext: 'Every workout, book, creative project, and conversation expands your map.',
    highestRegion: highest,
    lowestRegion: lowest
  };
}

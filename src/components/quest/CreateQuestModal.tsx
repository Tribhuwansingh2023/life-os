import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quest, AttributeKey, QuestDifficulty, QuestType } from '../../types';
import { useGame } from '../../context/GameStateContext';
import { audioService } from '../../services/audioService';
import {
  Brain,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  Wand2,
  Clock,
  Flame,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Swords,
  Coins,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuest: (questData: Omit<Quest, 'id' | 'status'>) => void;
}

// Human attribute definitions
const ATTRIBUTES: {
  key: AttributeKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderActive: string;
  bgActive: string;
}[] = [
  {
    key: 'intellect',
    label: 'Intellect',
    description: 'Learning, thinking & building',
    icon: Brain,
    color: 'text-cyan-400',
    borderActive: 'border-cyan-400',
    bgActive: 'bg-cyan-500/15'
  },
  {
    key: 'strength',
    label: 'Strength',
    description: 'Movement & physical effort',
    icon: Dumbbell,
    color: 'text-rose-400',
    borderActive: 'border-rose-400',
    bgActive: 'bg-rose-500/15'
  },
  {
    key: 'discipline',
    label: 'Discipline',
    description: 'Consistency & habits',
    icon: ShieldCheck,
    color: 'text-purple-400',
    borderActive: 'border-purple-400',
    bgActive: 'bg-purple-500/15'
  },
  {
    key: 'creativity',
    label: 'Creativity',
    description: 'Making & expressing',
    icon: Sparkles,
    color: 'text-amber-400',
    borderActive: 'border-amber-400',
    bgActive: 'bg-amber-500/15'
  },
  {
    key: 'wellness',
    label: 'Wellness',
    description: 'Recovery & healthy routines',
    icon: HeartPulse,
    color: 'text-emerald-400',
    borderActive: 'border-emerald-400',
    bgActive: 'bg-emerald-500/15'
  },
  {
    key: 'social',
    label: 'Social',
    description: 'Relationships & community',
    icon: Users,
    color: 'text-sky-400',
    borderActive: 'border-sky-400',
    bgActive: 'bg-sky-500/15'
  }
];

// Difficulty configuration with human explanations
const DIFFICULTY_CONFIG: Record<
  QuestDifficulty,
  { label: string; name: string; multiplier: number; hint: string }
> = {
  E: { label: 'E', name: 'Quick win', multiplier: 0.8, hint: 'Felt effortless, immediate momentum' },
  D: { label: 'D', name: 'Easy', multiplier: 1.0, hint: 'Light effort, routine action' },
  C: { label: 'C', name: 'Moderate', multiplier: 1.4, hint: 'Standard focus, healthy resistance' },
  B: { label: 'B', name: 'Challenging', multiplier: 2.0, hint: 'Requires deep focus and will' },
  A: { label: 'A', name: 'High effort', multiplier: 2.8, hint: 'Pushes limits, major concentration' },
  S: { label: 'S', name: 'Major milestone', multiplier: 4.0, hint: 'Peak endurance and breakthrough achievement' }
};

// Quest Types with human labels
const QUEST_TYPES: {
  id: QuestType;
  label: string;
  tagline: string;
  multiplier: number;
}[] = [
  { id: 'daily', label: 'Daily', tagline: "Repeatable focus for today", multiplier: 1.0 },
  { id: 'epic', label: 'Milestone', tagline: 'High-impact project goal', multiplier: 1.3 },
  { id: 'habit', label: 'Habit', tagline: 'Consistency & routine building', multiplier: 0.85 },
  { id: 'boss_raid', label: 'Boss Battle', tagline: 'Direct strike on Chronos', multiplier: 1.4 }
];

// Real-world goal rotating examples & 1-click seeds
const REAL_LIFE_EXAMPLES = [
  {
    name: 'Study Java for 60 minutes',
    category: 'intellect' as AttributeKey,
    difficulty: 'B' as QuestDifficulty,
    duration: 60,
    type: 'daily' as QuestType,
    criteria: 'Complete the concurrency chapter and write 3 working test programs.',
    tag: 'Learning'
  },
  {
    name: "Complete today's workout",
    category: 'strength' as AttributeKey,
    difficulty: 'B' as QuestDifficulty,
    duration: 45,
    type: 'daily' as QuestType,
    criteria: 'Finish 4 sets of heavy squats, 3 sets of pullups, and 10 min stretching.',
    tag: 'Fitness'
  },
  {
    name: 'Read 20 pages',
    category: 'intellect' as AttributeKey,
    difficulty: 'C' as QuestDifficulty,
    duration: 30,
    type: 'habit' as QuestType,
    criteria: 'Read 20 pages of non-fiction without checking phone notifications.',
    tag: 'Reading'
  },
  {
    name: 'Build the login screen',
    category: 'intellect' as AttributeKey,
    difficulty: 'B' as QuestDifficulty,
    duration: 60,
    type: 'daily' as QuestType,
    criteria: 'Implement the input forms, validation states, and auth callback tests.',
    tag: 'DeepWork'
  },
  {
    name: 'Call a friend',
    category: 'social' as AttributeKey,
    difficulty: 'C' as QuestDifficulty,
    duration: 30,
    type: 'habit' as QuestType,
    criteria: 'Check in on family or a close friend with an attentive 20+ minute conversation.',
    tag: 'Community'
  },
  {
    name: 'Finish my assignment',
    category: 'discipline' as AttributeKey,
    difficulty: 'B' as QuestDifficulty,
    duration: 45,
    type: 'daily' as QuestType,
    criteria: 'Review all rubric requirements, finalize citations, and submit to portal.',
    tag: 'Focus'
  }
];

const SUGGESTED_TAG_PILLS = [
  'DeepWork',
  'Learning',
  'Fitness',
  'Consistency',
  'Recovery',
  'CreativeWork'
];

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  onCreateQuest
}) => {
  const { player } = useGame();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AttributeKey>('intellect');
  const [type, setType] = useState<QuestType>('daily');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('B');
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['DeepWork', 'Focus']);

  // Validation & UI states
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [showHowCalculated, setShowHowCalculated] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isForgingSuccess, setIsForgingSuccess] = useState(false);
  const [oracleSuggestion, setOracleSuggestion] = useState<{
    reason: string;
    title: string;
    category: AttributeKey;
    difficulty: QuestDifficulty;
    duration: number;
    criteria: string;
    tag: string;
  } | null>(null);

  // Rotating placeholder index
  const [exampleIndex, setExampleIndex] = useState(0);

  // Cycle placeholder every 3.5 seconds if title is empty
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % REAL_LIFE_EXAMPLES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('intellect');
      setType('daily');
      setDifficulty('B');
      setTimeMinutes(45);
      setDescription('');
      setTagInput('');
      setTags(['DeepWork', 'Focus']);
      setErrors({});
      setShowHowCalculated(false);
      setShowDiscardConfirm(false);
      setIsForgingSuccess(false);
      setOracleSuggestion(null);
    }
  }, [isOpen]);

  // Is the form dirty (user has typed meaningful content)?
  const isDirty = title.trim().length > 0 || description.trim().length > 0;

  // Intercept close requests
  const handleAttemptClose = () => {
    if (isForgingSuccess) return;
    if (isDirty) {
      audioService.playTactileClick();
      setShowDiscardConfirm(true);
    } else {
      audioService.playTactileClick();
      onClose();
    }
  };

  // Keyboard shortcut: Esc handled cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        handleAttemptClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty, isForgingSuccess]);

  // Handle Tag Input (Comma or Enter)
  const handleAddTag = (rawTag: string) => {
    const cleaned = rawTag.trim().replace(/^#/, '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleaned) return;
    if (!tags.includes(cleaned) && tags.length < 8) {
      setTags([...tags, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    audioService.playTactileClick();
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Apply seed example
  const applySeedExample = (example: typeof REAL_LIFE_EXAMPLES[0]) => {
    audioService.playTactileClick();
    setTitle(example.name);
    setCategory(example.category);
    setDifficulty(example.difficulty);
    setTimeMinutes(example.duration);
    setType(example.type);
    setDescription(example.criteria);
    if (!tags.includes(example.tag)) {
      setTags([example.tag, 'Focus']);
    }
    // Clear inline errors
    setErrors({});
  };

  // Dynamic reward calculation based on real game parameters
  const diffMultiplier = DIFFICULTY_CONFIG[difficulty]?.multiplier || 2.0;
  const questTypeMultiplier = QUEST_TYPES.find((q) => q.id === type)?.multiplier || 1.0;
  // Consistency bonus based on player's current streak (e.g. 7 days streak gives +10%)
  const streakDays = player?.streakDays || 1;
  const consistencyMultiplier = 1.0 + Math.min(0.25, (streakDays > 1 ? streakDays * 0.02 : 0));

  // Projected rewards
  const calculatedXp = Math.round(
    timeMinutes * 3.5 * diffMultiplier * questTypeMultiplier * consistencyMultiplier
  );
  const calculatedGold = Math.max(15, Math.round(calculatedXp * 0.38));
  const calculatedMomentum = Math.min(
    15,
    Math.max(3, Math.round((timeMinutes / 12) * Math.min(2.0, diffMultiplier * 0.7)))
  );
  const primaryAttributeGain = Math.max(2, Math.round(4 * diffMultiplier));

  // Ask Oracle feature
  const handleAskOracle = () => {
    audioService.playTactileClick();
    const currentGoal = title.trim().toLowerCase();

    let suggestedCat: AttributeKey = 'intellect';
    let suggestedDiff: QuestDifficulty = 'B';
    let suggestedDur = 60;
    let suggestedTag = 'DeepWork';
    let suggestedCriteria = 'Finish core implementation and run verified tests.';
    let suggestionReason =
      'Based on your goal, this is best configured as a focused Intellect session for high yield.';

    if (/workout|gym|run|lift|cardio|squat|exercise|stretch/.test(currentGoal)) {
      suggestedCat = 'strength';
      suggestedDur = 45;
      suggestedDiff = 'B';
      suggestedTag = 'Fitness';
      suggestedCriteria = 'Complete target sets with progressive overload and proper recovery.';
      suggestionReason = 'Physical training detected. Optimized for Strength and discipline compounding.';
    } else if (/read|book|chapter|article|paper/.test(currentGoal)) {
      suggestedCat = 'intellect';
      suggestedDur = 30;
      suggestedDiff = 'C';
      suggestedTag = 'Reading';
      suggestedCriteria = 'Read continuously without distractions and record key synthesis notes.';
      suggestionReason = 'Compound reading habit identified. Set for high retention and steady XP.';
    } else if (/call|meet|friend|family|mentor|sync/.test(currentGoal)) {
      suggestedCat = 'social';
      suggestedDur = 30;
      suggestedDiff = 'C';
      suggestedTag = 'Community';
      suggestedCriteria = 'Connect with full presence and meaningful discussion.';
      suggestionReason = 'Social alignment quest. Builds relational health and character balance.';
    } else if (/meditat|sleep|walk|breathe|rest|hydrate/.test(currentGoal)) {
      suggestedCat = 'wellness';
      suggestedDur = 20;
      suggestedDiff = 'C';
      suggestedTag = 'Recovery';
      suggestedCriteria = 'Complete routine calmly, keeping momentum meter primed.';
      suggestionReason = 'Wellness restoration detected. Essential for maintaining high-flow multiplier.';
    } else if (title.trim()) {
      suggestedCat = category;
      suggestedDur = Math.max(30, timeMinutes);
      suggestedDiff = 'B';
      suggestedTag = 'Focus';
      suggestedCriteria = `Complete ${suggestedDur} minutes of deep progress toward: "${title.trim()}".`;
      suggestionReason = 'Balanced RPG parameters synthesized from your objective directive.';
    }

    setOracleSuggestion({
      reason: suggestionReason,
      title: title.trim() || 'Mastery Focus Session',
      category: suggestedCat,
      difficulty: suggestedDiff,
      duration: suggestedDur,
      criteria: suggestedCriteria,
      tag: suggestedTag
    });
  };

  const handleApplyOracleSuggestion = () => {
    if (!oracleSuggestion) return;
    audioService.playTactileClick();
    setTitle(oracleSuggestion.title);
    setCategory(oracleSuggestion.category);
    setDifficulty(oracleSuggestion.difficulty);
    setTimeMinutes(oracleSuggestion.duration);
    setDescription(oracleSuggestion.criteria);
    if (!tags.includes(oracleSuggestion.tag)) {
      setTags([...tags, oracleSuggestion.tag]);
    }
    setOracleSuggestion(null);
    setErrors({});
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Give this quest a name.';
    }
    if (!description.trim()) {
      newErrors.description = 'Tell us what counts as complete.';
    }

    if (Object.keys(newErrors).length > 0) {
      audioService.playTactileClick();
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsForgingSuccess(true);
    audioService.playTactileClick();

    // Prepare quest payload
    const questPayload: Omit<Quest, 'id' | 'status'> = {
      title: title.trim(),
      category,
      type,
      difficulty,
      timeEstimateMinutes: timeMinutes,
      xpReward: calculatedXp,
      goldReward: calculatedGold,
      momentumBoost: calculatedMomentum,
      attributesAffected: [
        { attribute: category, gain: primaryAttributeGain },
        { attribute: 'discipline', gain: 2 }
      ],
      description: description.trim(),
      dnaTags: tags.length > 0 ? tags : ['Focus'],
      regionId:
        category === 'strength'
          ? 'reg_basalt'
          : category === 'wellness'
          ? 'reg_aurora'
          : 'reg_archive',
      streakCount: streakDays,
      dueDate: 'Today'
    };

    onCreateQuest(questPayload);

    // Show brief "QUEST FORGED" animation before closing
    setTimeout(() => {
      setIsForgingSuccess(false);
      onClose();
    }, 650);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleAttemptClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />
      {/* Centering wrapper */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
      {/* Main Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-[#090d15] border border-cyan-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden my-4 sm:my-8 flex flex-col"
        style={{ maxHeight: '90dvh' }}
        id="create-quest-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-quest-modal-title"
      >
        {/* Subtle top ambient cyber line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        {/* Modal Header */}
        <div className="flex items-start justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-white/[0.08] bg-[#070a10]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-400 rounded-xs shadow-[0_0_8px_#00f0ff]" />
              <h2
                id="create-quest-modal-title"
                className="text-base sm:text-lg font-mono font-black text-white tracking-wide uppercase flex items-center gap-2"
              >
                CREATE NEW QUEST
                <span className="text-[10px] font-normal tracking-widest text-slate-400 normal-case border border-white/[0.1] px-2 py-0.5 rounded bg-white/[0.03]">
                  // FORGE QUEST
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
              Turn something you want to accomplish into a quest.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAttemptClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            aria-label="Close quest forge modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creation Success Overlay */}
        <AnimatePresence>
          {isForgingSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#070a10]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.85, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/50 mb-4 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                <Sparkles className="w-10 h-10 text-cyan-300 animate-pulse" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight uppercase">
                QUEST FORGED
              </h3>
              <p className="text-sm font-mono text-cyan-300 font-bold mt-1">
                + QUEST ADDED TO TODAY
              </p>
              <p className="text-xs text-slate-400 font-sans mt-2">
                Updating your active quest stack & character progression...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draft Protection Discard Confirmation Overlay */}
        <AnimatePresence>
          {showDiscardConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.92, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 10 }}
                className="max-w-md w-full bg-[#0d121c] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-center font-sans space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-mono font-bold text-white">
                    Discard this quest draft?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    You have entered quest details that will be lost if you leave now.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDiscardConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    KEEP EDITING
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDiscardConfirm(false);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    DISCARD
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
        <div className="p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Desktop 2-column layout: Left = Form Fields, Right = Live Quest Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form Fields (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Quest Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="quest-name-input"
                      className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>QUEST NAME</span>
                      <span className="text-cyan-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAskOracle}
                      className="text-[11px] font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors cursor-pointer group"
                    >
                      <Wand2 className="w-3 h-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
                      <span>ASK ORACLE</span>
                    </button>
                  </div>

                  <input
                    id="quest-name-input"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    placeholder={`e.g. ${REAL_LIFE_EXAMPLES[exampleIndex].name}`}
                    className={`w-full bg-[#06080e] border ${
                      errors.title ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-white/[0.12]'
                    } focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-white font-sans text-sm placeholder:text-slate-500 transition-colors`}
                  />

                  {errors.title && (
                    <p className="text-xs text-rose-400 font-sans flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.title}
                    </p>
                  )}

                  {/* Rotating examples / Quick suggestion chips */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span>Real-life examples:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {REAL_LIFE_EXAMPLES.map((ex) => (
                        <button
                          type="button"
                          key={ex.name}
                          onClick={() => applySeedExample(ex)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/15 border border-white/[0.07] hover:border-cyan-400/40 text-slate-300 hover:text-cyan-200 text-xs font-sans transition-all cursor-pointer text-left"
                        >
                          {ex.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optional Oracle Suggestion Card (Assist, not overwrite) */}
                <AnimatePresence>
                  {oracleSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-cyan-950/30 border border-cyan-400/40 rounded-xl p-3.5 space-y-2.5 text-xs font-sans"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold text-xs uppercase">
                          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>ORACLE SUGGESTION</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOracleSuggestion(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-slate-300 italic text-[11px] leading-relaxed">
                        "{oracleSuggestion.reason}"
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#070a10] p-2 rounded-lg border border-white/[0.05]">
                        <div>
                          <span className="text-slate-400 block text-[9px]">ATTRIBUTE</span>
                          <span className="text-cyan-300 font-bold capitalize">
                            {oracleSuggestion.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">DIFFICULTY</span>
                          <span className="text-amber-300 font-bold">
                            Tier {oracleSuggestion.difficulty} (
                            {DIFFICULTY_CONFIG[oracleSuggestion.difficulty].name})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">DURATION</span>
                          <span className="text-slate-200">{oracleSuggestion.duration} MIN</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">TAG</span>
                          <span className="text-slate-200">#{oracleSuggestion.tag}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setOracleSuggestion(null)}
                          className="px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 text-xs font-mono"
                        >
                          DISMISS
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyOracleSuggestion}
                          className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>APPLY SUGGESTION</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 2. Primary Attribute (Human descriptions, no jargon) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                      PRIMARY ATTRIBUTE
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      What does this activity build?
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ATTRIBUTES.map((attr) => {
                      const Icon = attr.icon;
                      const isSelected = category === attr.key;
                      return (
                        <button
                          type="button"
                          key={attr.key}
                          onClick={() => {
                            audioService.playTactileClick();
                            setCategory(attr.key);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            isSelected
                              ? `${attr.bgActive} ${attr.borderActive} text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]`
                              : 'bg-[#06080e] border-white/[0.08] text-slate-400 hover:border-white/[0.2] hover:text-slate-200'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected ? 'bg-white/10' : 'bg-white/[0.04]'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${attr.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-white">
                                {attr.label}
                              </span>
                              {isSelected && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                            </div>
                            <span className="text-[11px] font-sans text-slate-400 block leading-tight mt-0.5">
                              {attr.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Quest Type */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block">
                    QUEST TYPE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    {QUEST_TYPES.map((qType) => {
                      const isSelected = type === qType.id;
                      return (
                        <button
                          type="button"
                          key={qType.id}
                          onClick={() => {
                            audioService.playTactileClick();
                            setType(qType.id);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                              : 'bg-[#06080e] border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-xs block font-bold">{qType.label}</span>
                          <span className="text-[9px] block text-slate-400 font-sans truncate mt-0.5">
                            {qType.tagline}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Difficulty & Time Estimate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Difficulty Tier */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block">
                      DIFFICULTY
                    </label>
                    <div className="grid grid-cols-6 gap-1 font-mono">
                      {(['E', 'D', 'C', 'B', 'A', 'S'] as QuestDifficulty[]).map((diffKey) => {
                        const isSelected = difficulty === diffKey;
                        return (
                          <button
                            type="button"
                            key={diffKey}
                            onClick={() => {
                              audioService.playTactileClick();
                              setDifficulty(diffKey);
                            }}
                            className={`py-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                                : 'bg-[#06080e] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'
                            }`}
                          >
                            {diffKey}
                          </button>
                        );
                      })}
                    </div>
                    {/* Subtle helper text below selected difficulty */}
                    <div className="text-[11px] font-mono text-slate-300 bg-[#06080e] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
                      <span>
                        <strong className="text-cyan-400">Tier {difficulty}</strong> —{' '}
                        {DIFFICULTY_CONFIG[difficulty].name}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {DIFFICULTY_CONFIG[difficulty].multiplier}x yield
                      </span>
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="time-estimate-slider"
                        className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider"
                      >
                        TIME ESTIMATE
                      </label>
                      <span className="text-xs font-mono font-black text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                        {timeMinutes} MIN
                      </span>
                    </div>

                    <input
                      id="time-estimate-slider"
                      type="range"
                      min="15"
                      max="120"
                      step="5"
                      value={timeMinutes}
                      onChange={(e) => setTimeMinutes(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-2 bg-[#06080e] rounded-lg border border-white/[0.1]"
                      aria-label="Time estimate in minutes"
                      aria-valuemin={15}
                      aria-valuemax={120}
                      aria-valuenow={timeMinutes}
                    />

                    {/* Sensible increments */}
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
                      <button
                        type="button"
                        onClick={() => setTimeMinutes(15)}
                        className="hover:text-cyan-300 cursor-pointer"
                      >
                        15
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeMinutes(30)}
                        className="hover:text-cyan-300 cursor-pointer"
                      >
                        30
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeMinutes(45)}
                        className="hover:text-cyan-300 cursor-pointer"
                      >
                        45
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeMinutes(60)}
                        className="hover:text-cyan-300 cursor-pointer"
                      >
                        60
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeMinutes(90)}
                        className="hover:text-cyan-300 cursor-pointer"
                      >
                        90
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeMinutes(120)}
                        className="hover:text-cyan-300 cursor-pointer"
                      >
                        120+
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. What Does Completion Look Like? (Success Criteria) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="criteria-input"
                    className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>WHAT DOES COMPLETION LOOK LIKE?</span>
                    <span className="text-cyan-400">*</span>
                  </label>

                  <textarea
                    id="criteria-input"
                    rows={2}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) {
                        setErrors((prev) => ({ ...prev, description: undefined }));
                      }
                    }}
                    placeholder="Describe the result that counts as complete... e.g. Finish the API integration and test the login flow."
                    className={`w-full bg-[#06080e] border ${
                      errors.description
                        ? 'border-rose-500 ring-1 ring-rose-500/50'
                        : 'border-white/[0.12]'
                    } focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2 text-white font-sans text-xs sm:text-sm placeholder:text-slate-500 transition-colors leading-relaxed`}
                  />

                  <div className="flex items-center justify-between text-[11px] font-sans">
                    {errors.description ? (
                      <p className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.description}
                      </p>
                    ) : (
                      <span className="text-slate-400 text-[10px]">
                        Clear criteria make your quests easier to complete and reward.
                      </span>
                    )}
                  </div>
                </div>

                {/* 6. Tags */}
                <div className="space-y-2">
                  <label
                    htmlFor="tag-input"
                    className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block"
                  >
                    TAGS
                  </label>

                  <div className="flex gap-2">
                    <input
                      id="tag-input"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="DeepWork, Learning, Fitness (Press Enter to add)"
                      className="flex-1 bg-[#06080e] border border-white/[0.12] focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2 text-white font-sans text-xs placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag(tagInput)}
                      className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 font-mono text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Active tags pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-400 text-slate-400 ml-0.5"
                          aria-label={`Remove tag ${t}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {/* Quick suggested pills */}
                    <div className="flex flex-wrap gap-1 items-center ml-1">
                      <span className="text-[10px] font-mono text-slate-500">Quick add:</span>
                      {SUGGESTED_TAG_PILLS.filter((st) => !tags.includes(st)).map((st) => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => handleAddTag(st)}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.05] cursor-pointer"
                        >
                          +{st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Quest Preview & Reward Strip (5 cols on lg) */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-0">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    QUEST PREVIEW
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    Live updates
                  </span>
                </div>

                {/* RPG Quest Card Preview */}
                <div className="bg-[#05080e] border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.08)] space-y-3 font-mono relative overflow-hidden">
                  {/* Subtle top indicator */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-cyan-950/60 border border-cyan-400/50 text-cyan-300">
                        TIER {difficulty}
                      </span>
                      <span className="text-xs text-slate-300 font-bold uppercase">
                        {category}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300 capitalize">
                      {type === 'epic' ? 'Milestone' : type === 'boss_raid' ? 'Boss Battle' : type}
                    </span>
                  </div>

                  {/* Quest Title Preview */}
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white font-sans leading-snug break-words">
                      {title.trim() || 'Your Quest Name'}
                    </h4>
                    <p className="text-xs font-sans text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {description.trim() || 'Describe what counts as complete...'}
                    </p>
                  </div>

                  {/* Rewards Breakdown Strip */}
                  <div className="grid grid-cols-3 gap-2 py-2 bg-[#0a0f19] p-2.5 rounded-xl border border-white/[0.06] text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">XP</span>
                      <span className="text-xs font-bold text-cyan-300 font-mono">
                        +{calculatedXp}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">GOLD</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        +{calculatedGold}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">DURATION</span>
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        {timeMinutes} MIN
                      </span>
                    </div>
                  </div>

                  {/* Streak and Boss tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-500/30 text-[11px]">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {streakDays} day streak
                    </span>
                    {type === 'boss_raid' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-500/30 text-[11px] font-bold">
                        <Swords className="w-3 h-3 text-rose-400" />
                        -{calculatedXp} Boss HP
                      </span>
                    )}
                  </div>

                  {/* Tags Preview */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tags.map((tg) => (
                        <span key={tg} className="text-[10px] text-slate-400 font-mono">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Reward Preview Box */}
                <div className="bg-[#05080e] border border-white/[0.08] rounded-2xl p-4 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">
                      ESTIMATED REWARD
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowHowCalculated(!showHowCalculated)}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>How is this calculated?</span>
                      {showHowCalculated ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Key Stats Row */}
                  <div className="flex items-center justify-between py-1 px-3 bg-[#0a0f19] rounded-xl border border-white/[0.06]">
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black text-cyan-300">
                        +{calculatedXp} XP
                      </span>
                    </div>
                    <div className="text-slate-600">•</div>
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black text-amber-300">
                        +{calculatedGold} GOLD
                      </span>
                    </div>
                    <div className="text-slate-600">•</div>
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-black text-emerald-300">
                        +{calculatedMomentum}% MOMENTUM
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-sans text-slate-400">
                    Based on difficulty, duration, attribute and consistency.
                  </p>

                  {/* Expandable "How is this calculated?" */}
                  <AnimatePresence>
                    {showHowCalculated && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-300 space-y-1.5"
                      >
                        <div className="flex justify-between">
                          <span className="text-slate-400">Difficulty:</span>
                          <span className="font-bold text-white">
                            Tier {difficulty} ({diffMultiplier}x)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time:</span>
                          <span className="font-bold text-white">{timeMinutes} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Attribute:</span>
                          <span className="font-bold text-white capitalize">
                            {category} (+{primaryAttributeGain} pts)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Consistency:</span>
                          <span className="font-bold text-amber-400">
                            {streakDays} day streak (+{Math.round((consistencyMultiplier - 1) * 100)}%)
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-white/[0.06] text-cyan-300 font-bold">
                          <span>→ Estimated yield:</span>
                          <span>+{calculatedXp} XP / +{calculatedGold} Gold</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] font-sans text-slate-400 text-center sm:text-left">
                Normal life goal → Quest → Attribute growth → Character progression.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleAttemptClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-mono text-xs font-black tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CREATE QUEST →</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

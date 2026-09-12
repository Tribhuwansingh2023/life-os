import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Flame,
  Swords,
  Trophy,
  CheckCircle2,
  BookOpen,
  Dumbbell,
  Code2,
  Compass,
  Award,
  ChevronRight,
  Activity,
  Play,
  Check,
  Crown,
  Heart,
  Lightbulb,
  Crosshair,
  Volume2,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { audioService } from '../services/audioService';
import { useAuth } from '../context/AuthContext';
import { InlineAuthCard } from '../components/auth/InlineAuthCard';

interface LandingPageProps {
  onEnterApp: () => void;
}

type ExampleActivity = 'code' | 'workout' | 'read';

interface RegionData {
  id: string;
  name: string;
  attribute: string;
  resonance: number;
  questsCompleted: number;
  nextMilestone: string;
  reward: string;
  color: string;
  description: string;
}

const REGIONS: RegionData[] = [
  {
    id: 'forge',
    name: 'THE FORGE',
    attribute: 'Strength',
    resonance: 84,
    questsCompleted: 14,
    nextMilestone: '15 Quests Completed',
    reward: 'IRONBOUND BADGE',
    color: '#f43f5e', // coral/rose
    description: 'Where physical discipline, heavy iron, and physical endurance take shape.'
  },
  {
    id: 'archive',
    name: 'THE ARCHIVE',
    attribute: 'Intellect',
    resonance: 92,
    questsCompleted: 21,
    nextMilestone: '25 Quests Completed',
    reward: 'SCHOLAR’S CIPHER',
    color: '#38bdf8', // sky/cyan
    description: 'Repository of deep focus, algorithms, reading hours, and technical mastery.'
  },
  {
    id: 'nexus',
    name: 'THE NEXUS',
    attribute: 'Discipline',
    resonance: 88,
    questsCompleted: 18,
    nextMilestone: '20 Quests Completed',
    reward: 'CHRONO DIAL',
    color: '#00f0ff', // cyan
    description: 'The core meridian of daily habits, unbroken consistency, and streak velocity.'
  },
  {
    id: 'spire',
    name: 'THE SPIRE',
    attribute: 'Creativity',
    resonance: 81,
    questsCompleted: 11,
    nextMilestone: '15 Quests Completed',
    reward: 'PRISMATIC INK',
    color: '#a855f7', // purple
    description: 'Ascended towers of creative writing, architectural design, and novel ideation.'
  },
  {
    id: 'haven',
    name: 'THE HAVEN',
    attribute: 'Wellness',
    resonance: 79,
    questsCompleted: 13,
    nextMilestone: '15 Quests Completed',
    reward: 'SERENE EMBLEM',
    color: '#10b981', // emerald
    description: 'Sanctuary of restorative sleep, hydration, mindfulness, and recovery.'
  },
  {
    id: 'agora',
    name: 'THE AGORA',
    attribute: 'Social',
    resonance: 75,
    questsCompleted: 10,
    nextMilestone: '15 Quests Completed',
    reward: 'CIVIC EMBLEM',
    color: '#38bdf8', // sky
    description: 'Floating forum of mentorship, team synchronization, active networking, and community.'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { user, callsign, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAuthCard, setShowAuthCard] = useState(false);

  const openAuthCard = () => {
    setShowAuthCard(true);
    // Smooth scroll to the auth card after state update
    setTimeout(() => {
      const el = document.getElementById('auth-card-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // Section 2: Real Life Transformation State
  const [selectedActivity, setSelectedActivity] = useState<ExampleActivity>('code');
  const [transformStep, setTransformStep] = useState<'real' | 'quest' | 'complete'>('quest');

  // Section 4: Interactive World State
  const [activeRegion, setActiveRegion] = useState<RegionData>(REGIONS[0]);

  // Section 6: Boss Battle Interactive Simulation State
  const [bossHp, setBossHp] = useState<number>(640);
  const [recentDamage, setRecentDamage] = useState<{ id: number; amount: number; quest: string }[]>([]);
  const [isBossShaking, setIsBossShaking] = useState(false);

  // Section 5: Oracle Accepted State
  const [oracleAccepted, setOracleAccepted] = useState(false);

  // Transform config mapping
  const activityDetails = {
    code: {
      real: 'Complete 2 hours of coding & refactor state manager',
      questTitle: "THE DEBUGGER'S TRIAL",
      duration: '2h Focus',
      difficulty: '★★★☆☆',
      attribute: 'Intellect',
      xp: 150,
      gold: 30,
      statDelta: '+8 Intellect',
      icon: <Code2 className="w-4 h-4 text-cyan-400" />
    },
    workout: {
      real: '45-minute compound barbell lifts & mobility drills',
      questTitle: 'TITAN’S RESISTANCE',
      duration: '45m Session',
      difficulty: '★★★★☆',
      attribute: 'Strength',
      xp: 130,
      gold: 25,
      statDelta: '+9 Strength',
      icon: <Dumbbell className="w-4 h-4 text-rose-400" />
    },
    read: {
      real: 'Read 25 pages of cognitive science & take notes',
      questTitle: 'CODEX OF THE ARCHIVE',
      duration: '35m Session',
      difficulty: '★★☆☆☆',
      attribute: 'Intellect & Wellness',
      xp: 95,
      gold: 20,
      statDelta: '+6 Intellect',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />
    }
  };

  const currentActivity = activityDetails[selectedActivity];

  const scrollToSection = (id: string) => {
    audioService.playTactileClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSimulateBossHit = (amount: number, questName: string) => {
    audioService.playBossHit();
    setIsBossShaking(true);
    setTimeout(() => setIsBossShaking(false), 400);

    setBossHp((prev) => Math.max(0, prev - amount));
    const newEntry = { id: Date.now(), amount, quest: questName };
    setRecentDamage((prev) => [newEntry, ...prev.slice(0, 3)]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden">
      {/* Background Obsidian Atmospheric Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Soft cyan gradient origin at top */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/[0.07] via-violet-500/[0.03] to-transparent blur-3xl" />
        {/* Warm gold ambient focal spot */}
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-amber-500/[0.025] blur-[120px]" />
        {/* Deep bottom glow */}
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[400px] bg-cyan-600/[0.03] blur-[100px]" />
        {/* Subtle geometric dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="relative z-30 border-b border-white/[0.06] bg-[#07090e]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0d131f] border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              //
            </div>
            <div>
              <span className="font-mono font-bold text-white text-base tracking-wider">
                LIFE<span className="text-cyan-400">//OS</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-2.5 pl-2.5 border-l border-white/10 font-normal">
                A game for real life
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('character')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Character
            </button>
            <button
              onClick={() => scrollToSection('world')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              The World
            </button>
            <button
              onClick={() => scrollToSection('oracle')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Oracle
            </button>
            <button
              onClick={() => scrollToSection('boss-battle')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Boss Battles
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="max-w-[100px] truncate">{callsign || user.email?.split('@')[0] || 'Operator'}</span>
                </div>
                <button
                  onClick={() => {
                    audioService.playTactileClick();
                    signOut();
                  }}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  audioService.playTactileClick();
                  openAuthCard();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-mono text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </button>
            )}

            <button
              onClick={() => {
                audioService.playLevelUp();
                onEnterApp();
              }}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#07090e] font-mono font-bold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer"
            >
              <span>ENTER APP</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Narrative & Actions */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1422] border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>LIFE//OS — A GAME FOR REAL LIFE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white leading-[1.08]">
              TURN PROGRESS INTO A{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
                WORLD WORTH RETURNING TO.
              </span>
            </h1>

            {/* Supporting Copy */}
            <div className="space-y-1.5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80" />
                <span>Your workout becomes <strong className="text-white font-medium">Strength</strong>.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
                <span>Your coding session becomes <strong className="text-white font-medium">Intellect</strong>.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                <span>Your consistency becomes <strong className="text-white font-medium">Momentum</strong>.</span>
              </p>
              <p className="pt-2 text-slate-400 text-sm sm:text-base">
                Every small win changes your character.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => {
                  audioService.playLevelUp();
                  if (user) {
                    onEnterApp();
                  } else {
                    openAuthCard();
                  }
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#07090e] font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] active:scale-98 cursor-pointer"
              >
                <span>{user ? 'ENTER COMMAND CENTER' : 'START YOUR JOURNEY'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {!user && (
                <button
                  onClick={() => {
                    audioService.playTactileClick();
                    openAuthCard();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-mono text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span>SIGN IN / CREATE ACCOUNT</span>
                </button>
              )}

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#0d121c] hover:bg-[#121927] border border-white/10 text-slate-300 hover:text-white font-mono text-xs tracking-wider transition-colors cursor-pointer"
              >
                <span>SEE HOW IT WORKS</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span>No perfect days required. Zero punitive streaks.</span>
            </p>
          </div>

          {/* Right Column: Auth card — revealed on demand */}
          <div id="auth-card-anchor" className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {showAuthCard ? (
                <motion.div
                  key="auth-card"
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                >
                  <InlineAuthCard onEnterApp={onEnterApp} />
                </motion.div>
              ) : (
                <motion.div
                  key="auth-teaser"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-white/[0.08] bg-[#0c111c]/80 backdrop-blur-sm p-8 flex flex-col items-center gap-6 text-center cursor-pointer group"
                  onClick={() => openAuthCard()}
                >
                  {/* Logo / Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#0d131f] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_40px_rgba(0,240,255,0.25)] transition-all">
                    <span className="font-mono font-black text-cyan-400 text-2xl">//</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-mono font-bold text-white text-base tracking-wider">OPERATOR ACCESS PORTAL</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Sign in to sync your progress across devices and unlock cloud persistence.</p>
                  </div>

                  {/* Feature bullets */}
                  <div className="w-full space-y-2 text-left">
                    {[
                      { icon: '⚡', text: 'Google Sign-In or Email' },
                      { icon: '☁️', text: 'Cloud-synced across devices' },
                      { icon: '👤', text: 'Guest mode — no sign-up needed' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); audioService.playTactileClick(); openAuthCard(); }}
                    className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#07090e] font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    SIGN IN / CREATE ACCOUNT
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); audioService.playLevelUp(); onEnterApp(); }}
                    className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono cursor-pointer underline underline-offset-4"
                  >
                    Continue as Guest — no sign-up
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 2 — YOU DO THE WORK. WE MAKE IT MATTER. (Interactive Transformation) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 px-5 sm:px-8 border-t border-white/[0.06] relative z-10 bg-[#080b12]">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              THE CORE TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              YOU DO THE WORK. WE MAKE IT MATTER.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3 font-normal">
              Every real activity is codified into a tailored RPG quest with tangible rewards, stat growth, and compound progression.
            </p>
          </div>

          {/* Activity Selector Tabs */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'code' as ExampleActivity, label: 'Coding Session', icon: Code2 },
              { id: 'workout' as ExampleActivity, label: 'Strength Workout', icon: Dumbbell },
              { id: 'read' as ExampleActivity, label: 'Deep Reading', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedActivity === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audioService.playTactileClick();
                    setSelectedActivity(tab.id);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-[#0d121c] text-slate-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Transformation Flow: 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Step 1: REAL LIFE */}
            <div
              onClick={() => {
                audioService.playTactileClick();
                setTransformStep('real');
              }}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                transformStep === 'real'
                  ? 'bg-[#0c121d] border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'bg-[#090d15] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                  STEP 01
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                  REAL LIFE
                </span>
              </div>
              <h3 className="text-base font-bold font-mono text-white mb-2">
                What you actually do
              </h3>
              <p className="text-xs text-slate-300 font-sans italic bg-[#05080e] p-3 rounded-lg border border-white/[0.06]">
                "{currentActivity.real}"
              </p>
              <span className="text-[11px] text-slate-400 block mt-4 font-mono">
                No gamification gimmicks or distractions. Just your actual life priorities.
              </span>
            </div>

            {/* Step 2: QUEST CREATED */}
            <div
              onClick={() => {
                audioService.playTactileClick();
                setTransformStep('quest');
              }}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                transformStep === 'quest'
                  ? 'bg-[#0c121d] border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'bg-[#090d15] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  STEP 02
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  QUEST CREATED
                </span>
              </div>

              <div className="bg-[#05080e] p-3.5 rounded-xl border border-cyan-500/30 space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    {currentActivity.icon}
                    {currentActivity.questTitle}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {currentActivity.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Duration: {currentActivity.duration}</span>
                  <span className="text-cyan-400">{currentActivity.attribute}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                  <span>REWARD</span>
                  <span>+{currentActivity.xp} XP &bull; +{currentActivity.gold} GOLD</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 block font-mono">
                Codified with difficulty tiers, time horizons, and attribute alignment.
              </span>
            </div>

            {/* Step 3: QUEST COMPLETE */}
            <div
              onClick={() => {
                audioService.playQuestComplete();
                setTransformStep('complete');
              }}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                transformStep === 'complete'
                  ? 'bg-[#0c121d] border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                  : 'bg-[#090d15] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  STEP 03
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                  QUEST COMPLETE
                </span>
              </div>

              <div className="bg-[#05080e] p-3.5 rounded-xl border border-amber-500/30 space-y-2 mb-3">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  OBJECTIVE RESOLVED
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center font-mono py-1">
                  <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-slate-400 block">XP</span>
                    <span className="text-xs font-bold text-amber-300">+{currentActivity.xp}</span>
                  </div>
                  <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-slate-400 block">GOLD</span>
                    <span className="text-xs font-bold text-amber-300">+{currentActivity.gold}</span>
                  </div>
                  <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-[10px] text-slate-400 block">STAT</span>
                    <span className="text-[11px] font-bold text-cyan-300">{currentActivity.statDelta}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 block font-mono">
                Instant dopamine bridge: immediate game payoff while real results compound.
              </span>
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                audioService.playQuestComplete();
                setTransformStep('complete');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0e1420] hover:bg-[#141d2e] border border-amber-500/30 text-amber-300 hover:text-amber-200 font-mono text-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Click to test completing this quest</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3 — CHARACTER IDENTITY & BUILD */}
      {/* ========================================================================= */}
      <section id="character" className="py-20 px-5 sm:px-8 relative z-10 max-w-6xl mx-auto">
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              CHARACTER EVOLUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              YOUR CHARACTER IS BUILT BY WHAT YOU ACTUALLY DO.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 font-normal">
              No arbitrary character levels. Every stat is a direct mirror of the hours you put into your body, intellect, craft, and recovery.
            </p>
          </div>

          {/* Large Visual Character / Build Composition */}
          <div className="rounded-2xl bg-[#090d15] border border-white/[0.08] p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Profile Card & Badges */}
              <div className="lg:col-span-4 space-y-5">
                <div className="p-5 rounded-xl bg-[#06090e] border border-white/[0.06] space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg">
                      T
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-base text-white">Tribhuwan</h3>
                      <span className="text-xs font-mono text-amber-400">Class: Disciplined Sage</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-300 space-y-1.5 pt-2 border-t border-white/[0.06]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rank Progression:</span>
                      <span className="text-white">Tier IV Ascended</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quests Completed:</span>
                      <span className="text-cyan-400 font-bold">142 total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gold In Treasury:</span>
                      <span className="text-amber-400 font-bold">1,840 G</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Velocity:</span>
                      <span className="text-emerald-400 font-bold">1.4x Multiplier</span>
                    </div>
                  </div>
                </div>

                {/* Unlocked Badges */}
                <div className="p-4 rounded-xl bg-[#06090e] border border-white/[0.06] text-left space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    EARNED MILESTONE BADGES
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[9px] text-amber-300 font-bold block leading-tight">IRONBOUND</span>
                      <span className="text-[8px] text-slate-400">7-Day Chain</span>
                    </div>
                    <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30">
                      <Lightbulb className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                      <span className="text-[9px] text-sky-300 font-bold block leading-tight">POLYMATH</span>
                      <span className="text-[8px] text-slate-400">50h Focus</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <Swords className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                      <span className="text-[9px] text-rose-300 font-bold block leading-tight">SLAYER</span>
                      <span className="text-[8px] text-slate-400">3 Bosses Slain</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center & Right: Armory Equipment & Attribute Radial Breakdown */}
              <div className="lg:col-span-8 space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Equipped Loadout */}
                  <div className="p-5 rounded-xl bg-[#06090e] border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        ACTIVE ARMORY LOADOUT
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">3/3 EQUIPPED</span>
                    </div>

                    <div className="space-y-2.5 font-mono text-xs">
                      <div className="flex items-center gap-3 p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                        <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">Crown of Deep Concentration</span>
                          <span className="text-[10px] text-slate-400">+12% Intellect XP</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                        <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">Chrono Dial of Momentum</span>
                          <span className="text-[10px] text-slate-400">Prevents Streak Decay</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                        <div className="w-7 h-7 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <Dumbbell className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">Titan's Grip Bracers</span>
                          <span className="text-[10px] text-slate-400">+15 Boss Strike Power</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Progression Chronicle */}
                  <div className="p-5 rounded-xl bg-[#06090e] border border-white/[0.06] space-y-3">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                      RECENT PROGRESSION CHRONICLE
                    </span>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2 rounded bg-white/[0.02] border-l-2 border-sky-400">
                        <span className="text-[10px] text-slate-400 block">TODAY &bull; 2H AGO</span>
                        <span className="text-white">Completed: Refactor State Store</span>
                        <span className="text-[10px] text-amber-400 font-bold block">+150 XP &bull; +8 Intellect</span>
                      </div>

                      <div className="p-2 rounded bg-white/[0.02] border-l-2 border-rose-400">
                        <span className="text-[10px] text-slate-400 block">YESTERDAY</span>
                        <span className="text-white">Completed: 5x5 Deadlift Session</span>
                        <span className="text-[10px] text-amber-400 font-bold block">+120 XP &bull; +9 Strength</span>
                      </div>

                      <div className="p-2 rounded bg-white/[0.02] border-l-2 border-amber-400">
                        <span className="text-[10px] text-slate-400 block">3 DAYS AGO</span>
                        <span className="text-white">Level Ascension: Level 16 → Level 17</span>
                        <span className="text-[10px] text-cyan-400 font-bold block">Unlocked: The Haven Sanctuary</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 4 — THE LIVING WORLD (5 Understandable RPG Realms) */}
      {/* ========================================================================= */}
      <section id="world" className="py-20 px-5 sm:px-8 border-t border-white/[0.06] relative z-10 bg-[#080b12]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              THE WORLD EXPANSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              EVERY PART OF YOUR LIFE HAS A PLACE.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 font-normal">
              Your productivity isn't a spreadsheet or endless checklist. It's an expanding realm where each life domain flourishes through your attention.
            </p>
          </div>

          {/* Interactive World Map & Region Inspect */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* World Realm Selection Grid */}
            <div className="lg:col-span-7 space-y-3">
              {REGIONS.map((region) => {
                const isSelected = activeRegion.id === region.id;
                return (
                  <div
                    key={region.id}
                    onMouseEnter={() => {
                      audioService.playTactileClick();
                      setActiveRegion(region);
                    }}
                    onClick={() => {
                      audioService.playTactileClick();
                      setActiveRegion(region);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0e1522] border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                        : 'bg-[#090d15] border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                        style={{
                          backgroundColor: `${region.color}15`,
                          border: `1px solid ${region.color}40`,
                          color: region.color
                        }}
                      >
                        {region.name.split(' ')[1]?.[0] || 'R'}
                      </div>
                      <div>
                        <h4 className="font-mono font-bold text-sm text-white">{region.name}</h4>
                        <span className="text-xs text-slate-400 font-sans">
                          Governs <strong className="text-slate-300 font-medium">{region.attribute}</strong> &bull; {region.questsCompleted} quests completed
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-white block">{region.resonance}%</span>
                      <span className="text-[10px] text-slate-500">Resonance</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Region Detail Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#0a0e16] border border-cyan-500/30 text-left space-y-5 shadow-xl relative overflow-hidden">
                <div
                  className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-20"
                  style={{ backgroundColor: activeRegion.color }}
                />

                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                      REALM TERRITORY
                    </span>
                    <h3 className="text-xl font-mono font-bold text-white">{activeRegion.name}</h3>
                  </div>

                  <span
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded border"
                    style={{
                      backgroundColor: `${activeRegion.color}15`,
                      borderColor: `${activeRegion.color}40`,
                      color: activeRegion.color
                    }}
                  >
                    {activeRegion.attribute}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {activeRegion.description}
                </p>

                <div className="space-y-3 font-mono text-xs pt-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Current Territory Resonance:</span>
                      <span className="text-white font-bold">{activeRegion.resonance}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#05070c] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${activeRegion.resonance}%`,
                          backgroundColor: activeRegion.color
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#06090e] border border-white/[0.06] space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>NEXT REGIONAL MILESTONE</span>
                      <span className="text-amber-400 font-bold">{activeRegion.nextMilestone}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-white">UNLOCKED REWARD:</span>
                      <span className="text-amber-300">{activeRegion.reward}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audioService.playTactileClick();
                    onEnterApp();
                  }}
                  className="w-full py-2.5 rounded-lg bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold transition-colors"
                >
                  EXPLORE {activeRegion.name} IN-GAME →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 5 — THE ORACLE (Game Master Intelligence) */}
      {/* ========================================================================= */}
      <section id="oracle" className="py-20 px-5 sm:px-8 relative z-10 max-w-5xl mx-auto">
        <div className="space-y-12 text-center">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              GAME MASTER INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              NEVER WONDER WHAT TO DO NEXT.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3 font-normal">
              Not an intrusive chatbot. The Oracle is your personal RPG Game Master, balancing your progression so you never burn out on one domain.
            </p>
          </div>

          {/* Oracle Directive Box */}
          <div className="p-7 rounded-2xl bg-[#090d15] border border-cyan-500/30 text-left space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                    ORACLE DIRECTIVE // GAME MASTER
                  </span>
                  <span className="text-xs font-mono text-slate-300">Equilibrium Analysis Active</span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                LIFE BALANCE SENSOR
              </span>
            </div>

            {/* Oracle Insight Quote */}
            <div className="p-4 rounded-xl bg-[#06090e] border-l-2 border-cyan-400 font-sans text-sm sm:text-base text-slate-200 leading-relaxed">
              "You've been progressing quickly in <strong className="text-sky-300">Intellect</strong>, but your <strong className="text-rose-300">Strength</strong> progression has slowed this week."
            </div>

            {/* Recommended Quest Directive */}
            <div className="p-5 rounded-xl bg-[#0c121d] border border-cyan-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    RECOMMENDED QUEST
                  </span>
                  <h4 className="text-base font-mono font-bold text-white">
                    20-MINUTE WARRIOR TRAINING
                  </h4>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-amber-300 font-bold">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    +60 Strength XP
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                    +10 Momentum
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-xs text-slate-400 font-sans">
                <strong className="text-slate-300 font-medium">Why this directive? </strong>
                "Your recent activity is heavily weighted toward learning and code. This quest helps restore neuromuscular equilibrium before fatigue sets in."
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">Estimated time: 20 minutes</span>
                <button
                  onClick={() => {
                    audioService.playQuestComplete();
                    setOracleAccepted(true);
                  }}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                    oracleAccepted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  {oracleAccepted ? '✓ DIRECTIVE BOUND TO MATRIX' : 'ACCEPT DIRECTIVE →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 6 — BOSS BATTLE (Procrastination Demon) */}
      {/* ========================================================================= */}
      <section id="boss-battle" className="py-20 px-5 sm:px-8 border-t border-white/[0.06] relative z-10 bg-[#080b12]">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div>
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest block mb-2">
              WEEKLY RAID ENCOUNTER
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              SOME DAYS, THE ENEMY IS PROCRASTINATION.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3 font-normal">
              When willpower is low, you don't fight alone. Every completed habit strikes down the boss standing between you and your goals.
            </p>
          </div>

          {/* Boss Encounter Stage */}
          <div
            className={`p-7 rounded-2xl bg-[#0a0e16] border border-rose-500/30 text-left space-y-6 shadow-2xl relative transition-transform ${
              isBossShaking ? 'translate-x-1 -translate-y-1' : ''
            }`}
          >
            {/* Boss Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 font-mono font-bold text-xl shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  ☠
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-mono font-bold text-white">PROCRASTINATION DEMON</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                      WEEKLY BOSS
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Phase 2: Sloth & Resistance &bull; Cycle resets in 3 days
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-rose-400 font-bold text-sm sm:text-base">
                  {bossHp} / 1,000 HP
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {Math.round((bossHp / 1000) * 100)}% Health Remaining
                </span>
              </div>
            </div>

            {/* Boss Health Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 bg-[#05070c] rounded-full overflow-hidden border border-white/[0.08] p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 transition-all duration-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  style={{ width: `${(bossHp / 1000) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Completed quests deal direct damage</span>
                <span className="text-amber-400 font-bold">Reward on Defeat: +300 XP &bull; Raid Slayer Badge</span>
              </div>
            </div>

            {/* Quest Strikes Simulation Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                COMPLETED QUEST STRIKES (CLICK TO SIMULATE DAMAGE)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <button
                  onClick={() => handleSimulateBossHit(15, 'Coding Quest')}
                  className="p-3.5 rounded-xl bg-[#06090e] hover:bg-[#0e1422] border border-white/[0.08] hover:border-cyan-400/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-slate-300 group-hover:text-white">
                    <span className="font-bold">Coding Quest</span>
                    <span className="text-rose-400 font-bold">-15 HP</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Refactor Algorithm &bull; Critical strike
                  </span>
                </button>

                <button
                  onClick={() => handleSimulateBossHit(12, 'Workout Quest')}
                  className="p-3.5 rounded-xl bg-[#06090e] hover:bg-[#0e1422] border border-white/[0.08] hover:border-rose-400/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-slate-300 group-hover:text-white">
                    <span className="font-bold">Workout Quest</span>
                    <span className="text-rose-400 font-bold">-12 HP</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Heavy Barbell Squats &bull; Physical strike
                  </span>
                </button>

                <button
                  onClick={() => handleSimulateBossHit(10, 'Reading Quest')}
                  className="p-3.5 rounded-xl bg-[#06090e] hover:bg-[#0e1422] border border-white/[0.08] hover:border-amber-400/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-slate-300 group-hover:text-white">
                    <span className="font-bold">Reading Quest</span>
                    <span className="text-rose-400 font-bold">-10 HP</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Deep Study &bull; Mental strike
                  </span>
                </button>
              </div>
            </div>

            {/* Live Damage Feed */}
            {recentDamage.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-500 text-[10px] uppercase">COMBAT LOG:</span>
                <span className="text-rose-400 font-bold animate-pulse">
                  {recentDamage[0].quest} struck the demon for -{recentDamage[0].amount} HP!
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 7 — WEEKLY REPLAY (Game Recap) */}
      {/* ========================================================================= */}
      <section className="py-20 px-5 sm:px-8 relative z-10 max-w-5xl mx-auto">
        <div className="space-y-12 text-center">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-2">
              WEEKLY PROGRESSION SUMMARY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              LOOK HOW FAR YOU'VE COME.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3 font-normal">
              Every Sunday night, LIFE//OS rolls up your real-world achievements into a cinematic RPG recap.
            </p>
          </div>

          {/* Game Recap Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090d15] border border-white/[0.08] text-left space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  CHRONO TELEMETRY RECAP
                </span>
                <h3 className="text-lg font-mono font-bold text-white">
                  CYCLE 37 PROGRESSION CHRONICLE
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>LEVEL 16 → LEVEL 17 ASCENSION</span>
              </div>
            </div>

            {/* Core Compound Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-4 rounded-xl bg-[#06090e] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block mb-1">TOTAL XP EARNED</span>
                <span className="text-xl font-bold text-amber-400">+420 XP</span>
              </div>

              <div className="p-4 rounded-xl bg-[#06090e] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block mb-1">INTELLECT DELTA</span>
                <span className="text-xl font-bold text-sky-400">+12 INT</span>
              </div>

              <div className="p-4 rounded-xl bg-[#06090e] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block mb-1">STRENGTH DELTA</span>
                <span className="text-xl font-bold text-rose-400">+8 STR</span>
              </div>

              <div className="p-4 rounded-xl bg-[#06090e] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block mb-1">MOMENTUM VELOCITY</span>
                <span className="text-xl font-bold text-emerald-400">+15 MOM</span>
              </div>
            </div>

            {/* 7-Day Consistency Cadence */}
            <div className="p-4 rounded-xl bg-[#06090e] border border-white/[0.06] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300">7-Day Quest Completion Cadence</span>
                <span className="text-cyan-400 font-bold">18 Quests Completed &bull; 0 Burnout</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
                  <div key={day} className="p-2 rounded bg-white/[0.02] border border-white/[0.04] text-center font-mono">
                    <span className="text-[9px] text-slate-500 block">{day}</span>
                    <span className="text-xs font-bold text-cyan-400 mt-1 block">
                      {idx === 6 ? '✓ 4' : '✓ 2'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL EMOTIONAL CTA */}
      {/* ========================================================================= */}
      <section className="py-24 px-5 sm:px-8 border-t border-white/[0.06] relative z-10 text-center bg-[#07090e]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1422] border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>A GAME FOR REAL LIFE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white leading-tight">
            YOUR NEXT LEVEL STARTS WITH ONE SMALL QUEST.
          </h2>

          <p className="text-slate-400 text-base max-w-lg mx-auto font-normal font-sans">
            No perfect days required. No arbitrary spreadsheets. Build a character and an expanding world that reflects the work you actually do.
          </p>

          <div className="pt-3">
            <button
              onClick={() => {
                audioService.playLevelUp();
                onEnterApp();
              }}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#07090e] font-mono font-bold text-sm tracking-wider transition-all shadow-[0_0_30px_rgba(0,240,255,0.35)] hover:shadow-[0_0_45px_rgba(0,240,255,0.6)] active:scale-98"
            >
              <span>ENTER LIFE//OS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <p className="text-xs font-mono text-slate-500">
            Instant load &bull; In-browser execution &bull; Free to explore
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/[0.06] py-8 px-5 sm:px-8 relative z-10 bg-[#06080d] text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">LIFE<span className="text-cyan-400">//OS</span></span>
            <span>&bull;</span>
            <span>Turn progress into a world worth returning to.</span>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('character')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Character Build
            </button>
            <button
              onClick={() => scrollToSection('world')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              The 5 Realms
            </button>
            <button
              onClick={() => {
                audioService.playLevelUp();
                onEnterApp();
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
            >
              Launch App →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

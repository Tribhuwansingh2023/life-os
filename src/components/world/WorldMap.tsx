import React, { useState } from 'react';
import { WorldRegion, AttributeInfo } from '../../types';
import { audioService } from '../../services/audioService';
import {
  Brain,
  Dumbbell,
  Sparkles,
  HeartPulse,
  Users,
  ShieldCheck,
  Crown,
  Lock,
  Compass,
  Zap,
  Building2,
  Library,
  Flame,
  Trees,
  Landmark,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { REGION_CONFIGS, getRegionStateDisplay, getProgressTier } from '../../data/worldData';

interface WorldMapProps {
  regions: WorldRegion[];
  selectedRegion: WorldRegion | null;
  onSelectRegion: (region: WorldRegion) => void;
  disciplineAttribute?: AttributeInfo;
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  disciplineAttribute,
  className = ''
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Derive counts from actual data
  const totalCount = regions.length;
  const masteredCount = regions.filter((r) => r.influenceScore >= 90 || r.status === 'mastered').length;
  const activeCount = regions.filter(
    (r) => (r.influenceScore >= 60 || r.status === 'unlocked') && r.influenceScore < 90
  ).length;
  const discoveredCount = regions.filter(
    (r) => r.influenceScore > 0 && r.influenceScore < 60
  ).length;

  const disciplineLevel = disciplineAttribute?.level || 18;
  const disciplineScore = disciplineAttribute?.value || 84;

  const handleSelectRegion = (region: WorldRegion) => {
    audioService.playTactileClick();
    onSelectRegion(region);
  };

  const handleZoomIn = () => {
    audioService.playTactileClick();
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
  };

  const handleZoomOut = () => {
    audioService.playTactileClick();
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
  };

  const handleResetZoom = () => {
    audioService.playTactileClick();
    setZoomLevel(1);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-[#07090e] border border-white/[0.08] shadow-2xl transition-all ${className}`}
    >
      {/* Top Map HUD Status Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/[0.06] bg-[#07090e]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '45s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
                YOUR WORLD
              </h2>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                // WORLD MAP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Every quest changes something. Your real-life progress shapes the world around you.
            </p>
          </div>
        </div>

        {/* Dynamic World Statistics Counters */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300">
            <span className="text-slate-500 mr-1.5 text-[10px] uppercase">Regions</span>
            <strong className="text-white font-bold">{totalCount}</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300">
            <span className="text-amber-500/80 mr-1.5 text-[10px] uppercase">Mastered</span>
            <strong className="text-amber-200 font-bold">{masteredCount}</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-300">
            <span className="text-cyan-500/80 mr-1.5 text-[10px] uppercase">Active</span>
            <strong className="text-cyan-200 font-bold">{activeCount}</strong>
          </div>
          {discoveredCount > 0 && (
            <div className="hidden md:flex px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/[0.08] text-slate-300">
              <span className="text-slate-500 mr-1.5 text-[10px] uppercase">Discovered</span>
              <strong className="text-slate-300 font-bold">{discoveredCount}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] max-h-[620px] overflow-hidden">
        {/* Zoomable Container Layer */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: selectedRegion
              ? `${selectedRegion.coordinates.x}% ${selectedRegion.coordinates.y}%`
              : '50% 50%'
          }}
        >
          {/* SVG Canvas Map: Terrain, Organic Contours, and Discipline Momentum Roads */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle Cyber Grid */}
              <pattern id="rpg-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="1" />
                <circle cx="50" cy="50" r="1" fill="rgba(255, 255, 255, 0.1)" />
              </pattern>

              {/* Radial ambient glow */}
              <radialGradient id="world-center-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Momentum road animated pulse gradient */}
              <linearGradient id="momentum-pulse" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>

              {/* Glow filter for active roads & landmarks */}
              <filter id="road-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid Pattern Background */}
            <rect width="100%" height="100%" fill="url(#rpg-grid)" />
            <circle cx="500" cy="300" r="320" fill="url(#world-center-glow)" />

            {/* Global Meridian Circles */}
            <ellipse cx="500" cy="300" rx="420" ry="240" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="6 6" />
            <ellipse cx="500" cy="300" rx="280" ry="160" fill="none" stroke="rgba(139, 92, 246, 0.08)" />

            {/* ============================================================== */}
            {/* TERRITORY TERRAIN CONTOURS (Progression-responsive density)   */}
            {/* ============================================================== */}

            {/* 1. IRON CITADEL (Strength - Rose) - Top Left (22%, 35% -> 220, 210) */}
            <g opacity={regions.find((r) => r.id === 'reg_citadel')?.influenceScore ? 0.9 : 0.4}>
              {/* Outer boundary contour */}
              <path
                d="M 120 120 Q 220 70 320 130 T 350 280 T 230 330 T 110 250 Z"
                fill="rgba(244, 63, 94, 0.04)"
                stroke="rgba(244, 63, 94, 0.25)"
                strokeWidth="1.5"
              />
              <path
                d="M 150 150 Q 220 110 290 150 T 310 250 T 220 290 T 140 230 Z"
                fill="rgba(244, 63, 94, 0.06)"
                stroke="rgba(244, 63, 94, 0.4)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Fortress Bastion battlements icons */}
              <rect x="195" y="185" width="50" height="50" rx="10" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.45)" strokeWidth="1.5" />
              <path d="M 205 185 L 205 175 L 215 175 L 215 185 M 225 185 L 225 175 L 235 175 L 235 185" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="1.5" />
            </g>

            {/* 2. ARCHIVE OF LIGHT (Intellect - Cyan) - Top Center (50%, 20% -> 500, 120) */}
            <g opacity={regions.find((r) => r.id === 'reg_archive')?.influenceScore ? 0.95 : 0.4}>
              <path
                d="M 390 40 Q 500 10 610 50 T 630 190 T 490 220 T 370 140 Z"
                fill="rgba(0, 240, 255, 0.05)"
                stroke="rgba(0, 240, 255, 0.35)"
                strokeWidth="1.5"
              />
              <path
                d="M 420 70 Q 500 40 580 80 T 590 170 T 490 190 T 400 130 Z"
                fill="rgba(0, 240, 255, 0.08)"
                stroke="rgba(0, 240, 255, 0.5)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Crystalline spire geometry */}
              <polygon points="500,60 525,120 500,140 475,120" fill="rgba(0, 240, 255, 0.2)" stroke="#00f0ff" strokeWidth="1.5" />
              <polygon points="460,100 475,130 460,145 445,130" fill="rgba(0, 240, 255, 0.15)" stroke="rgba(0, 240, 255, 0.6)" strokeWidth="1" />
              <polygon points="540,100 555,130 540,145 525,130" fill="rgba(0, 240, 255, 0.15)" stroke="rgba(0, 240, 255, 0.6)" strokeWidth="1" />
            </g>

            {/* 3. NEON FOUNDRY (Creativity - Amber) - Top Right (78%, 38% -> 780, 228) */}
            <g opacity={regions.find((r) => r.id === 'reg_foundry')?.influenceScore ? 0.9 : 0.4}>
              <path
                d="M 680 140 Q 790 90 890 160 T 910 320 T 770 360 T 660 260 Z"
                fill="rgba(245, 158, 11, 0.04)"
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1.5"
              />
              <path
                d="M 710 170 Q 790 130 860 180 T 870 280 T 770 310 T 690 230 Z"
                fill="rgba(245, 158, 11, 0.07)"
                stroke="rgba(245, 158, 11, 0.45)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Plasma Kiln foundry furnace shape */}
              <path d="M 760 250 L 780 190 L 800 250 Z" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="780" cy="230" r="8" fill="#f59e0b" opacity="0.6" />
            </g>

            {/* 4. SANCTUARY GROVE (Wellness - Emerald) - Bottom Left (30%, 72% -> 300, 432) */}
            <g opacity={regions.find((r) => r.id === 'reg_grove')?.influenceScore ? 0.9 : 0.4}>
              <path
                d="M 190 350 Q 310 290 410 360 T 410 520 T 260 540 T 170 440 Z"
                fill="rgba(16, 185, 129, 0.04)"
                stroke="rgba(16, 185, 129, 0.3)"
                strokeWidth="1.5"
              />
              <path
                d="M 230 380 Q 310 330 380 380 T 370 480 T 270 500 T 200 430 Z"
                fill="rgba(16, 185, 129, 0.07)"
                stroke="rgba(16, 185, 129, 0.45)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Sacred Tree canopy silhouettes */}
              <circle cx="300" cy="420" r="22" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="280" cy="435" r="16" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="1" />
              <circle cx="320" cy="435" r="16" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="1" />
            </g>

            {/* 5. GRAND AGORA (Social - Sky) - Bottom Right (70%, 75% -> 700, 450) */}
            <g opacity={regions.find((r) => r.id === 'reg_agora')?.influenceScore ? 0.9 : 0.4}>
              <path
                d="M 590 370 Q 710 300 820 370 T 820 540 T 670 560 T 560 460 Z"
                fill="rgba(56, 189, 248, 0.04)"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="1.5"
              />
              <path
                d="M 620 400 Q 710 340 780 400 T 780 500 T 670 520 T 590 440 Z"
                fill="rgba(56, 189, 248, 0.07)"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Amphitheater forum tiered arcs */}
              <ellipse cx="700" cy="445" rx="34" ry="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="700" cy="445" rx="22" ry="12" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />
              <circle cx="700" cy="445" r="5" fill="#38bdf8" />
            </g>

            {/* ============================================================== */}
            {/* DISCIPLINE SYSTEM: MOMENTUM ROADS (Connecting highways)        */}
            {/* ============================================================== */}
            <g className="momentum-roads-network">
              {/* Central Discipline Nexus Hub at 500, 290 */}
              <circle cx="500" cy="290" r="30" fill="rgba(139, 92, 246, 0.12)" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="500" cy="290" r="8" fill="#8b5cf6" opacity="0.8" />

              {/* Base Roadways (Citadel 220,210; Archive 500,120; Foundry 780,228; Grove 300,432; Agora 700,450) */}
              {/* Citadel -> Archive */}
              <line x1="220" y1="210" x2="500" y2="120" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Archive -> Foundry */}
              <line x1="500" y1="120" x2="780" y2="228" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Citadel -> Grove */}
              <line x1="220" y1="210" x2="300" y2="432" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Grove -> Agora */}
              <line x1="300" y1="432" x2="700" y2="450" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Foundry -> Agora */}
              <line x1="780" y1="228" x2="700" y2="450" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Central Nexus Connectors */}
              <line x1="500" y1="290" x2="220" y2="210" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="500" y1="290" x2="500" y2="120" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="500" y1="290" x2="780" y2="228" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="500" y1="290" x2="300" y2="432" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="500" y1="290" x2="700" y2="450" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Glowing Pulse Lines (Discipline Momentum Streams) */}
              <line
                x1="220"
                y1="210"
                x2="500"
                y2="120"
                stroke="url(#momentum-pulse)"
                strokeWidth={disciplineLevel >= 15 ? 2.5 : 1.5}
                strokeDasharray="8 8"
                className="animate-pulse"
                filter="url(#road-glow)"
              />
              <line
                x1="500"
                y1="120"
                x2="780"
                y2="228"
                stroke="url(#momentum-pulse)"
                strokeWidth={disciplineLevel >= 15 ? 2.5 : 1.5}
                strokeDasharray="8 8"
                className="animate-pulse"
                filter="url(#road-glow)"
              />
              <line
                x1="220"
                y1="210"
                x2="300"
                y2="432"
                stroke="url(#momentum-pulse)"
                strokeWidth={disciplineLevel >= 15 ? 2.5 : 1.5}
                strokeDasharray="8 8"
                className="animate-pulse"
                filter="url(#road-glow)"
              />
              <line
                x1="300"
                y1="432"
                x2="700"
                y2="450"
                stroke="url(#momentum-pulse)"
                strokeWidth={disciplineLevel >= 15 ? 2.5 : 1.5}
                strokeDasharray="8 8"
                className="animate-pulse"
                filter="url(#road-glow)"
              />
              <line
                x1="780"
                y1="228"
                x2="700"
                y2="450"
                stroke="url(#momentum-pulse)"
                strokeWidth={disciplineLevel >= 15 ? 2.5 : 1.5}
                strokeDasharray="8 8"
                className="animate-pulse"
                filter="url(#road-glow)"
              />
            </g>
          </svg>

          {/* ============================================================== */}
          {/* INTERACTIVE TERRITORY NODES (DOM Positioned)                   */}
          {/* ============================================================== */}
          <div className="absolute inset-0 z-20">
            {regions.map((region) => {
              const isSelected = selectedRegion?.id === region.id;
              const isHovered = hoveredRegionId === region.id;
              const config = REGION_CONFIGS[region.id];
              const stateDisplay = getRegionStateDisplay(region.status, region.influenceScore);
              const tierInfo = getProgressTier(region.influenceScore);
              const isMastered = stateDisplay.key === 'MASTERED';
              const isLocked = stateDisplay.key === 'LOCKED';
              const IconComponent = config?.attributeIcon || Compass;

              return (
                <div
                  key={region.id}
                  onClick={() => handleSelectRegion(region)}
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  style={{
                    left: `${region.coordinates.x}%`,
                    top: `${region.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute cursor-pointer group select-none transition-all duration-200 ${
                    isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                  }`}
                >
                  {/* Subtle pulsing beacon aura */}
                  <div
                    className="absolute -inset-5 rounded-full opacity-30 group-hover:opacity-75 transition-opacity animate-ping"
                    style={{
                      backgroundColor: region.accentColor,
                      animationDuration: isMastered ? '2.5s' : '4s'
                    }}
                  />

                  {/* Core Node Emblem Frame */}
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-xl backdrop-blur-md ${
                      isSelected
                        ? 'border-white bg-[#0e1420] ring-4 ring-cyan-400/40 shadow-[0_0_30px_rgba(0,240,255,0.5)]'
                        : isHovered
                        ? 'border-white/80 bg-[#0c111c]'
                        : 'bg-[#090d14]/90 border-white/20'
                    }`}
                    style={{
                      borderColor: isSelected ? '#ffffff' : region.accentColor,
                      boxShadow: isSelected
                        ? `0 0 30px ${region.accentColor}88`
                        : `0 0 15px ${region.accentColor}33`
                    }}
                  >
                    {/* Inner Attribute Icon */}
                    <IconComponent
                      className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
                      style={{ color: region.accentColor }}
                    />

                    {/* Mastered Crown Badge */}
                    {isMastered && (
                      <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md">
                        <Crown className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}

                    {/* Locked Indicator */}
                    {isLocked && (
                      <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                        <Lock className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}

                    {/* Active Quests Pill Badge */}
                    {region.activeQuestsCount > 0 && (
                      <div
                        className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full font-mono font-black text-[10px] flex items-center justify-center shadow-md text-black"
                        style={{ backgroundColor: region.accentColor }}
                        title={`${region.activeQuestsCount} Active Quests`}
                      >
                        {region.activeQuestsCount}
                      </div>
                    )}
                  </div>

                  {/* Territory Label Pill (Always visible & High Contrast) */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center pointer-events-none">
                    <div
                      className={`inline-flex flex-col items-center px-2.5 py-1 rounded-lg border backdrop-blur-md transition-all shadow-xl ${
                        isSelected
                          ? 'bg-[#0c121e] border-cyan-400 text-white shadow-cyan-950/50'
                          : 'bg-[#090d14]/95 border-white/15 text-slate-200 group-hover:border-white/40'
                      }`}
                    >
                      <span className="font-mono font-bold text-xs tracking-tight text-white group-hover:text-cyan-300">
                        {region.name}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] mt-0.5">
                        <span style={{ color: region.accentColor }} className="font-semibold">
                          {region.influenceScore}% EXPLORED
                        </span>
                        <span className="text-slate-500">&bull;</span>
                        <span className={`text-[9px] uppercase font-bold ${stateDisplay.color}`}>
                          {stateDisplay.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Discipline Roads HUD Indicator (Bottom Center / Left) */}
        <div className="absolute top-4 left-4 z-20 hidden lg:flex items-center gap-2.5 bg-[#090d14]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-purple-500/30 text-slate-300 shadow-xl font-mono text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-purple-300 font-bold tracking-wider">
                MOMENTUM ROADS
              </span>
              <span className="text-[10px] text-slate-500">&bull;</span>
              <span className="text-[10px] text-slate-400">DISCIPLINE LVL {disciplineLevel}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Unbroken habits energize the roads connecting all 5 territories.
            </p>
          </div>
        </div>

        {/* Map Zoom Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-1.5 bg-[#090d14]/85 backdrop-blur-md p-1.5 rounded-xl border border-white/[0.08] shadow-lg">
          <button
            onClick={handleZoomIn}
            title="Zoom in"
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom out"
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
          >
            &minus;
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset zoom"
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Territory RPG Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex flex-wrap items-center gap-3 bg-[#090d14]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.08] font-mono text-[10px] text-slate-300 shadow-xl">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Strength
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" /> Intellect
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Creativity
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Wellness
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> Social
          </span>
          <span className="flex items-center gap-1.5 text-purple-400 font-semibold border-l border-white/10 pl-2">
            <Zap className="w-2.5 h-2.5 text-purple-400" /> Momentum Roads
          </span>
        </div>

        {/* Selected Region Prompt Notice (Bottom Right) */}
        {selectedRegion && (
          <div className="absolute bottom-4 right-4 z-20 bg-[#090d14]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.08] font-mono text-[11px] text-slate-300 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedRegion.accentColor }} />
            <span>Selected: <strong className="text-white">{selectedRegion.name}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

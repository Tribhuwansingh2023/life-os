import React from 'react';
import { motion } from 'motion/react';

interface CharacterAvatarProps {
  level: number;
  className?: string;
  size?: 'md' | 'lg' | 'xl';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  level,
  className = '',
  size = 'lg'
}) => {
  const sizeClasses = {
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
    xl: 'w-36 h-36 sm:w-44 sm:h-44'
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer ambient aura */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-amber-500/10 blur-xl pointer-events-none" />

      {/* Main Avatar Container */}
      <div
        className={`relative ${sizeClasses} rounded-3xl bg-[#090d15] border border-cyan-400/30 p-2 shadow-[0_0_25px_rgba(0,240,255,0.2)] flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle geometric background grid lines inside portrait */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Ambient top light */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-16 bg-cyan-400/25 rounded-full blur-lg" />

        {/* Stylized Abstract RPG Sage Silhouette */}
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="armorGrad" x1="80" y1="50" x2="80" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="hoodGrad" x1="80" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="cyanEdge" x1="30" y1="30" x2="130" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="goldAccent" x1="60" y1="100" x2="100" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Halo / Halo Ring */}
          <circle
            cx="80"
            cy="52"
            r="38"
            stroke="url(#cyanEdge)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="opacity-40"
          />

          {/* Shoulders & Mantle / Pauldrons */}
          <path
            d="M20 152 C 24 122, 45 106, 62 102 L 80 114 L 98 102 C 115 106, 136 122, 140 152 Z"
            fill="url(#armorGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Pauldron Edge Highlight */}
          <path
            d="M 28 144 C 36 124, 52 112, 65 106"
            stroke="url(#cyanEdge)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-70"
          />
          <path
            d="M 132 144 C 124 124, 108 112, 95 106"
            stroke="url(#cyanEdge)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-70"
          />

          {/* Chest Core Rune Plate */}
          <path
            d="M 70 114 L 80 106 L 90 114 L 80 134 Z"
            fill="#090d16"
            stroke="url(#goldAccent)"
            strokeWidth="1.5"
          />
          <circle
            cx="80"
            cy="119"
            r="3.5"
            fill="#00f0ff"
            filter="url(#cyanGlow)"
          />

          {/* Deep Cowl / Hood Outer */}
          <path
            d="M 46 72 C 44 40, 60 22, 80 20 C 100 22, 116 40, 114 72 C 113 90, 106 100, 80 106 C 54 100, 47 90, 46 72 Z"
            fill="url(#hoodGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Hood Inner Shadow (Deep face void) */}
          <path
            d="M 54 70 C 53 46, 65 34, 80 33 C 95 34, 107 46, 106 70 C 105 84, 98 94, 80 97 C 62 94, 55 84, 54 70 Z"
            fill="#050810"
          />

          {/* Visor / Keen Eyes of the Sage */}
          <g filter="url(#cyanGlow)">
            {/* Left Eye Slit */}
            <path
              d="M 64 64 L 75 66 L 73 68 L 65 67 Z"
              fill="#00f0ff"
            />
            {/* Right Eye Slit */}
            <path
              d="M 96 64 L 85 66 L 87 68 L 95 67 Z"
              fill="#00f0ff"
            />
            {/* Forehead Mind Rune / Gem */}
            <polygon
              points="80,48 83,53 80,58 77,53"
              fill="#38bdf8"
            />
          </g>

          {/* Subtle Collar Crest Points */}
          <path
            d="M 72 98 L 80 94 L 88 98"
            stroke="url(#goldAccent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Level Emblem Badge */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono font-black text-[11px] px-3 py-0.5 rounded-full shadow-[0_2px_10px_rgba(245,158,11,0.4)] border border-amber-300/60 z-20 flex items-center gap-1">
          <span className="text-[9px] tracking-wider text-black/75">LV</span>
          <span>{level}</span>
        </div>
      </div>
    </div>
  );
};

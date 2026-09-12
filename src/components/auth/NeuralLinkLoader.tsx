import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Database, Terminal } from 'lucide-react';

export const NeuralLinkLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#07090e] z-50 flex flex-col items-center justify-center p-6 text-slate-100 cyber-grid">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Radar / Core animation */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-purple-500/30"
          />
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-sm font-mono font-black tracking-widest text-white uppercase flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>SYNCHRONIZING NEURAL LINK</span>
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Hydrating operator vault from Firestore cloud...
        </p>

        {/* Progress bar */}
        <div className="w-full bg-[#0d121c] border border-white/10 h-1.5 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: '10%' }}
            animate={{ width: ['10%', '65%', '95%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_#00f0ff]"
          />
        </div>

        <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-500">
          <span>ISOLATION: /users/{'{uid}'}</span>
          <span className="text-cyan-400">FIRESTORE ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

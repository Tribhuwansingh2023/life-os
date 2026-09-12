import React from 'react';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Swords,
  User,
  Globe2,
  Sparkles,
  History,
  ShoppingBag,
  Settings,
  Compass
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface MobileNavProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'landing', label: 'Story', icon: <Compass className="w-5 h-5" /> },
    { tab: 'dashboard', label: 'Command', icon: <LayoutDashboard className="w-5 h-5" /> },
    { tab: 'quests', label: 'Quests', icon: <Swords className="w-5 h-5" /> },
    { tab: 'world', label: 'World', icon: <Globe2 className="w-5 h-5" /> },
    { tab: 'character', label: 'Character', icon: <User className="w-5 h-5" /> },
    { tab: 'oracle', label: 'Oracle', icon: <Sparkles className="w-5 h-5" /> },
    { tab: 'settings', label: 'Config', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const isActive = currentTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => {
              audioService.playTactileClick();
              onSelectTab(item.tab);
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors font-mono text-[10px] ${
              isActive
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-md ${isActive ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
              {item.icon}
            </div>
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

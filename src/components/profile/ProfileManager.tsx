import React, { useState } from 'react';
import { useGame } from '../../context/GameStateContext';
import { ProfileRecord } from '../../types';
import { User, Plus, Check, Trash2, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProfileManagerProps {
  onShowToast?: (text: string, type: 'success' | 'warning' | 'info') => void;
}

const CHARACTER_CLASSES = [
  'Quantum Architect',
  'Cyber Monk',
  'Bio Sentinel',
  'Shadow Paladin',
  'Chrono Sage',
  'Neural Specialist'
];

export const ProfileManager: React.FC<ProfileManagerProps> = ({ onShowToast }) => {
  const { player, getProfiles, switchProfile, createNewProfile, deleteProfile } = useGame();

  const [profiles, setProfiles] = useState<ProfileRecord[]>(() => getProfiles());
  const [isCreating, setIsCreating] = useState(false);
  const [newCallsign, setNewCallsign] = useState('');
  const [newClass, setNewClass] = useState('Quantum Architect');

  const refreshProfiles = () => {
    setProfiles(getProfiles());
  };

  const handleSwitch = (id: string) => {
    if (id === player.id) return;
    const success = switchProfile(id);
    if (success) {
      refreshProfiles();
      onShowToast?.(`✓ ACTIVATED PROFILE: ${profiles.find(p => p.id === id)?.username}`, 'success');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCallsign.trim()) return;

    const record = createNewProfile(newCallsign.trim(), newClass);
    refreshProfiles();
    setIsCreating(false);
    setNewCallsign('');
    onShowToast?.(`✓ CREATED PROFILE: ${record.username}`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (profiles.length <= 1) {
      onShowToast?.('Cannot delete the only remaining profile.', 'warning');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete profile "${name}"?`);
    if (confirmed) {
      deleteProfile(id);
      refreshProfiles();
      onShowToast?.(`Deleted profile "${name}".`, 'info');
    }
  };

  return (
    <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm space-y-5" id="profile-manager-card">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>OPERATOR PROFILES</span>
              <Badge variant="purple" size="xs">
                {profiles.length} SAVED
              </Badge>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Create, switch between, and manage multiple player character profiles.
            </p>
          </div>
        </div>

        <Button
          variant={isCreating ? 'secondary' : 'primary'}
          size="xs"
          onClick={() => setIsCreating(!isCreating)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          {isCreating ? 'CANCEL' : 'NEW PROFILE'}
        </Button>
      </div>

      {/* Create New Profile Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#080d14] border border-purple-500/30 p-4 rounded-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold uppercase">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>CREATE NEW CHARACTER PROFILE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 font-mono mb-1.5 uppercase font-bold">
                OPERATOR CALLSIGN / NAME
              </label>
              <input
                type="text"
                value={newCallsign}
                onChange={(e) => setNewCallsign(e.target.value)}
                placeholder="e.g. VALKYRIE"
                className="w-full bg-[#05080c] border border-white/10 focus:border-purple-400 text-white rounded-lg px-3 py-2 text-xs font-mono outline-none"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-mono mb-1.5 uppercase font-bold">
                CHARACTER CLASS
              </label>
              <select
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                className="w-full bg-[#05080c] border border-white/10 focus:border-purple-400 text-white rounded-lg px-3 py-2 text-xs font-mono outline-none"
              >
                {CHARACTER_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="purple"
              size="xs"
              icon={<Check className="w-3.5 h-3.5" />}
            >
              CREATE & INITIALIZE PROFILE
            </Button>
          </div>
        </form>
      )}

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {profiles.map((p) => {
          const isActive = p.id === player.id;

          return (
            <div
              key={p.id}
              className={`relative bg-[#080c13] border rounded-xl p-4 transition-all flex flex-col justify-between gap-3 ${
                isActive
                  ? 'border-purple-500/50 bg-gradient-to-b from-[#12101f] to-[#080c13] shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 font-mono font-bold text-xs">
                      {p.username.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {p.username}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {p.characterClass}
                      </span>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-purple-950 text-purple-300 border border-purple-500/40">
                      ACTIVE
                    </span>
                  ) : (
                    profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id, p.username);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/[0.04] text-center font-mono text-[10px]">
                  <div className="bg-[#05080c] p-1.5 rounded border border-white/[0.04]">
                    <span className="text-slate-500 block text-[9px]">LEVEL</span>
                    <span className="text-white font-bold">LV.{p.level}</span>
                  </div>
                  <div className="bg-[#05080c] p-1.5 rounded border border-white/[0.04]">
                    <span className="text-slate-500 block text-[9px]">GOLD</span>
                    <span className="text-amber-300 font-bold">{p.gold}G</span>
                  </div>
                  <div className="bg-[#05080c] p-1.5 rounded border border-white/[0.04]">
                    <span className="text-slate-500 block text-[9px]">STREAK</span>
                    <span className="text-cyan-300 font-bold">{p.streakDays}d</span>
                  </div>
                </div>
              </div>

              {!isActive && (
                <button
                  type="button"
                  onClick={() => handleSwitch(p.id)}
                  className="w-full py-1.5 px-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>SWITCH TO PROFILE</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Quest, AttributeKey, QuestDifficulty, QuestType } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { audioService } from '../../services/audioService';
import {
  Brain,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';

interface EditQuestModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (questId: string, updates: Partial<Quest>) => void;
}

const ATTRIBUTES: {
  key: AttributeKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { key: 'intellect', label: 'Intellect', icon: Brain, color: 'text-cyan-400' },
  { key: 'strength', label: 'Strength', icon: Dumbbell, color: 'text-rose-400' },
  { key: 'discipline', label: 'Discipline', icon: ShieldCheck, color: 'text-purple-400' },
  { key: 'creativity', label: 'Creativity', icon: Sparkles, color: 'text-amber-400' },
  { key: 'wellness', label: 'Wellness', icon: HeartPulse, color: 'text-emerald-400' },
  { key: 'social', label: 'Social', icon: Users, color: 'text-sky-400' }
];

const DIFFICULTIES: {
  tier: QuestDifficulty;
  label: string;
  desc: string;
}[] = [
  { tier: 'C', label: 'Tier C', desc: 'Quick win (<30m)' },
  { tier: 'B', label: 'Tier B', desc: 'Solid challenge (30-60m)' },
  { tier: 'A', label: 'Tier A', desc: 'High leverage (1-2h)' },
  { tier: 'S', label: 'Tier S', desc: 'Epic milestone (2h+)' }
];

export const EditQuestModal: React.FC<EditQuestModalProps> = ({
  quest,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AttributeKey>('intellect');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('B');
  const [timeEstimate, setTimeEstimate] = useState<number>(30);
  const [type, setType] = useState<QuestType>('daily');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.description);
      setCategory(quest.category);
      setDifficulty(quest.difficulty);
      setTimeEstimate(quest.timeEstimateMinutes);
      setType(quest.type);
      setError(null);
    }
  }, [quest, isOpen]);

  if (!quest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playTactileClick();

    if (!title.trim()) {
      setError('Quest title cannot be empty.');
      audioService.playError();
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief description.');
      audioService.playError();
      return;
    }

    const updates: Partial<Quest> = {
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      timeEstimateMinutes: Number(timeEstimate) || 30,
      type
    };

    onSave(quest.id, updates);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EDIT QUEST PARAMETERS"
      subtitle={`Updating quest ID: ${quest.id}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-slate-300 uppercase tracking-wider mb-1 font-bold">
            QUEST TITLE
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2 text-white font-sans text-sm"
            placeholder="e.g. Deep Work: System Architecture"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-300 uppercase tracking-wider mb-1 font-bold">
            DESCRIPTION / ACTION STEPS
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2 text-slate-200 font-sans text-xs"
            placeholder="What exact deliverables or milestones define completion?"
          />
        </div>

        {/* Category / Attribute */}
        <div>
          <label className="block text-slate-300 uppercase tracking-wider mb-1.5 font-bold">
            ATTRIBUTE CATEGORY
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
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
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-[#090d14] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${attr.color}`} />
                  <span className="text-[10px] font-bold">{attr.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Tier & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-bold">
              DIFFICULTY TIER
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {DIFFICULTIES.map((diff) => (
                <button
                  type="button"
                  key={diff.tier}
                  onClick={() => {
                    audioService.playTactileClick();
                    setDifficulty(diff.tier);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    difficulty === diff.tier
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-[#090d14] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">{diff.label}</div>
                  <div className="text-[9px] text-slate-400 font-sans">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-bold">
              ESTIMATED TIME (MIN)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={5}
                max={480}
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(Number(e.target.value))}
                className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl pl-9 pr-3.5 py-2 text-white text-xs font-mono"
              />
            </div>

            <label className="block text-slate-300 uppercase tracking-wider mt-3 mb-1 font-bold">
              QUEST TYPE
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as QuestType)}
              className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none rounded-xl px-3 py-2 text-white text-xs font-mono"
            >
              <option value="daily">Daily Operation</option>
              <option value="epic">Epic Milestone</option>
              <option value="habit">Habit Routine</option>
              <option value="boss_raid">Boss Raid Encounter</option>
            </select>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
          <Button variant="ghost" type="button" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<Check className="w-4 h-4" />}
          >
            SAVE CHANGES
          </Button>
        </div>
      </form>
    </Modal>
  );
};

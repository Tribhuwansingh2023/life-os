import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: '1', action: 'Navigate to Command Center Dashboard' },
    { key: '2', action: 'Open Quest Matrix' },
    { key: '3', action: 'Open Character & Build' },
    { key: '4', action: 'Open World Biosystems Map' },
    { key: '5', action: 'Open Oracle AI Game Master' },
    { key: '6', action: 'Open Weekly Chrono Replay' },
    { key: '7', action: 'Open Armory & Rewards' },
    { key: '8', action: 'Open Settings' },
    { key: 'Q', action: 'Create New Quest' },
    { key: 'M', action: 'Toggle Procedural Audio Synthesizer' },
    { key: 'Esc', action: 'Dismiss Dialogs & Modals' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="TACTICAL HOTKEY MATRIX"
      subtitle="Rapid keyboard execution shortcuts"
      maxWidth="md"
    >
      <div className="space-y-3 font-mono text-xs">
        <div className="divide-y divide-white/[0.06]">
          {shortcuts.map((s) => (
            <div key={s.key} className="py-2 flex items-center justify-between">
              <span className="text-slate-300 font-sans">{s.action}</span>
              <kbd className="bg-[#080c13] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            DISMISS
          </Button>
        </div>
      </div>
    </Modal>
  );
};

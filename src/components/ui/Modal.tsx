import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioService } from '../../services/audioService';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioService.playTactileClick();
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWStyles: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              audioService.playTactileClick();
              onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          {/* Centering wrapper */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`relative w-full ${maxWStyles[maxWidth] ?? 'max-w-md'} bg-[#0d121b] border border-cyan-500/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden my-8 flex flex-col`}
              style={{ maxHeight: '90dvh' }}
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80 flex-shrink-0" />
              <div className="flex items-start justify-between p-5 border-b border-white/[0.08] bg-[#090d14]/60 flex-shrink-0">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                    <span className="inline-block w-1.5 h-3.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#00f0ff]" />
                    {title}
                  </h2>
                  {subtitle && <p className="text-xs text-slate-400 mt-0.5 font-sans">{subtitle}</p>}
                </div>
                <button
                  onClick={() => {
                    audioService.playTactileClick();
                    onClose();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div
                className="p-5 overflow-y-auto flex-1"
                style={{ overscrollBehavior: 'contain' }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

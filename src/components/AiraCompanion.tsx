import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface AiraCompanionProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onSetMode?: (mode: 'machine' | 'mind' | 'hybrid') => void;
  onOpenModal?: () => void;
}

export const AiraCompanion: React.FC<AiraCompanionProps> = ({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  onSetMode,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const setIsOpen = controlledSetIsOpen || setInternalOpen;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 liquid-glass-card p-5 transform transition-all duration-300 origin-bottom-right">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white tracking-wide">Aira Concierge</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            Welcome to CyberSteed. Select a service track below to orient the interface.
          </p>
          <div className="flex flex-col gap-2">
            {/* Navigation Buttons */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playModeMorph('machine');
                onSetMode?.('machine');
                setIsOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors"
            >
              Automation Services
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playModeMorph('mind');
                onSetMode?.('mind');
                setIsOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors"
            >
              Marketing Services
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        aria-label="Toggle Aira Concierge"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.15] hover:border-white/[0.4] flex items-center justify-center transition-all shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00D8FF]" />
      </button>
    </div>
  );
};

export default AiraCompanion;

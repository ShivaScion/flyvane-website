import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface AiraVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (query: string) => void;
}

export const AiraVoiceModal: React.FC<AiraVoiceModalProps> = ({
  isOpen,
  onClose,
  onCommand,
}) => {
  const [textInput, setTextInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    soundEngine.playModalSweep(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playModalSweep(false);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitQuery = () => {
    if (!textInput.trim()) return;
    soundEngine.playPop(0.08);
    onCommand(textInput.trim());
    setTextInput('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textInput.trim()) {
      handleSubmitQuery();
    }
  };

  const quickPrompts = [
    { label: 'Automation Services', cmd: 'mode machine' },
    { label: 'Marketing Services', cmd: 'mode mind' },
    { label: 'Value Calculator', cmd: 'calc' },
    { label: 'Direct Project Intake', cmd: 'contact' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aira-modal-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-end p-4 sm:p-6 pointer-events-auto"
      onClick={() => {
        soundEngine.playModalSweep(false);
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[380px] max-w-[90vw] backdrop-blur-2xl bg-white/[0.04] border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.55),inset_0_1px_1px_0_rgba(255,255,255,0.2)] rounded-2xl p-6 space-y-5 relative mb-16"
      >
        <button
          type="button"
          onClick={() => {
            soundEngine.playModalSweep(false);
            onClose();
          }}
          aria-label="Close Aira assistant"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 id="aira-modal-title" className="text-base font-sans font-semibold text-white">
              Aira Studio Concierge
            </h3>
            <p className="text-xs font-sans text-zinc-400">
              Interactive Navigation &amp; Advisory Guide
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <p className="text-xs sm:text-sm font-sans text-zinc-200 leading-relaxed">
            Welcome to Flyvane. Select a studio destination below or enter a direct query to switch service modes, inspect estimators, or open project intake.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-400 block">
            Quick Navigation
          </span>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => soundEngine.playHoverHum()}
                onClick={() => {
                  soundEngine.playClick(0.06);
                  onCommand(qp.cmd);
                  onClose();
                }}
                className="px-3 py-2.5 rounded-xl bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.09] text-xs font-sans text-zinc-200 hover:text-white flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="truncate">{qp.label}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400 flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="aira-concierge-input" className="sr-only">
            Navigate studio sections
          </label>
          <div className="flex items-center gap-2">
            <input
              id="aira-concierge-input"
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type destination (e.g. intake, calculator)..."
              className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={handleSubmitQuery}
              aria-label="Go to destination"
              className="px-3.5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-sans font-medium text-xs transition-colors cursor-pointer"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiraVoiceModal;


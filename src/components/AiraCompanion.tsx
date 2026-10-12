import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface AiraCompanionProps {
  onOpenModal: () => void;
}

export const AiraCompanion: React.FC<AiraCompanionProps> = ({
  onOpenModal,
}) => {
  return (
    <div
      id="aira-companion-fab"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center pointer-events-auto"
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => soundEngine.playHoverHum()}
        onClick={() => {
          soundEngine.playClick(0.07);
          onOpenModal();
        }}
        aria-label="Open Aira Assistant"
        title="Open Aira Assistant"
        className="w-14 h-14 rounded-full backdrop-blur-2xl bg-white/[0.045] hover:bg-white/[0.08] border border-white/[0.12] hover:border-cyan-400/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.55),inset_0_1px_1px_0_rgba(255,255,255,0.22)] flex items-center justify-center group transition-all duration-500 ease-out cursor-pointer"
      >
        <span className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400/90 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </span>
        <span className="sr-only">Open Aira Assistant</span>
      </motion.button>
    </div>
  );
};

export default AiraCompanion;


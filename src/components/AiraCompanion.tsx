import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AiraCompanionProps {
  onOpenModal: () => void;
  speakText?: (text: string) => void;
  isSpeaking?: boolean;
  isAudioEnabled?: boolean;
  onToggleAudio?: () => void;
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
        onClick={onOpenModal}
        aria-label="Open Aira Assistant"
        title="Open Aira Assistant"
        className="w-14 h-14 rounded-full bg-zinc-950/90 backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.2] shadow-[0_16px_40px_rgba(0,0,0,0.65)] flex items-center justify-center group hover:border-emerald-400/50 transition-all duration-300 cursor-pointer"
      >
        <span className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400/80" />
        </span>
        <span className="sr-only">Open Aira Assistant</span>
      </motion.button>
    </div>
  );
};

export default AiraCompanion;

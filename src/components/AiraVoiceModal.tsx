import React, { useState } from 'react';
import { X, Mic } from 'lucide-react';

interface AiraVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (query: string) => void;
  transcript: string;
}

export const AiraVoiceModal: React.FC<AiraVoiceModalProps> = ({
  isOpen,
  onClose,
  onCommand,
  transcript,
}) => {
  const [textInput, setTextInput] = useState('');

  if (!isOpen) return null;

  const handleStartVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTextInput(result);
        onCommand(result);
        onClose();
      };
    } else {
      alert("Speech recognition is not supported in this browser. Please type your query in the input box.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCommand(textInput);
      setTextInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-card border border-cyanAccent/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full bg-surface-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 bg-surface-elevated flex-shrink-0">
            <img src="/assets/aira/aira_coffee.png" alt="Aira Mascot" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Aira Voice Assistant</h3>
            <p className="text-xs font-mono text-cyan-400">Automation & Strategy Companion</p>
          </div>
        </div>

        {/* Sound Wave Frequency Visualizer */}
        <div className="h-14 bg-void rounded-2xl border border-surface-border flex items-center justify-center gap-1">
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
        </div>

        <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-border">
          <p className="text-xs sm:text-sm font-sans text-neutral-200 leading-relaxed">
            "{transcript || "What can I help you with? Ask me to explore our automation pipelines, review our brand strategy services, calculate ROI, or get in touch with Flyvane."}"
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Speak or type a command (e.g. 'open scraper', 'calc')..."
            className="flex-1 bg-void border border-surface-border rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyanAccent"
          />

          <button
            onClick={handleStartVoice}
            className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all"
            title="Listen to Voice"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

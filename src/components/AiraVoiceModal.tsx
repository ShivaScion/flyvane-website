import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

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
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setIsListening(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  const handleStartVoice = () => {
    setErrorMessage(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser. Please type your query below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const result = event.results[0][0].transcript;
        setTextInput(result);
        onCommand(result);
        onClose();
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage("Microphone access was denied. Please allow microphone permissions or type below.");
        } else if (event.error === 'no-speech') {
          setErrorMessage("No speech was detected. Please try speaking again or type your command.");
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}. You can type your query below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMessage("Unable to initialize microphone. Please type your query.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textInput.trim()) {
      onCommand(textInput.trim());
      setTextInput('');
      onClose();
    }
  };

  const quickPrompts = [
    { label: "Explore Architecture", cmd: "capabilities" },
    { label: "Value Calculator", cmd: "calc" },
    { label: "Direct Project Intake", cmd: "contact" },
    { label: "Latest Insights", cmd: "updates" }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aira-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-end sm:justify-center p-4 sm:p-6 pointer-events-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[380px] max-w-[90vw] bg-zinc-950/90 backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-2xl shadow-2xl p-6 space-y-5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Aira assistant"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 id="aira-modal-title" className="text-base font-sans font-semibold text-white">
              Aira Studio Concierge
            </h3>
            <p className="text-xs font-sans text-zinc-400">
              Interactive Navigation & Advisory Guide
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 font-sans">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">
            {transcript || "Welcome to Flyvane. Select a destination below or enter a direct query to navigate our studio architecture and advisory intake."}
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
                onClick={() => {
                  onCommand(qp.cmd);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-sans text-zinc-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate">{qp.label}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="aira-voice-input" className="sr-only">
            Ask Aira or navigate
          </label>
          <div className="flex items-center gap-2.5">
            <input
              id="aira-voice-input"
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Aira or type destination..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-emerald-400 transition-colors"
            />

            <button
              type="button"
              onClick={handleStartVoice}
              disabled={isListening}
              className={`p-2.5 rounded-xl ${
                isListening ? 'bg-amber-400 text-black animate-pulse' : 'bg-emerald-400 hover:bg-emerald-300 text-black'
              } font-medium transition-all cursor-pointer`}
              title={isListening ? "Listening..." : "Speak query"}
              aria-label="Speak query through microphone"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiraVoiceModal;

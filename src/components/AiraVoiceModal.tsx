import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, AlertCircle, ArrowRight } from 'lucide-react';

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

  // Close on Escape & autofocus input
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
      setErrorMessage("Speech recognition is not supported in this browser. Please type your query in the input below.");
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
          setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser or type below.");
        } else if (event.error === 'no-speech') {
          setErrorMessage("No speech was detected. Please try speaking again or type your command.");
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}. You can type your command below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
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
    { label: "Open Headless Scraper", cmd: "open scraper" },
    { label: "Calculate Economic ROI", cmd: "calc" },
    { label: "Switch to Mind Strategy", cmd: "mode mind" },
    { label: "Direct Client Intake", cmd: "contact" }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aira-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg bg-[#0b0c10] border border-cyan-400/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Close voice modal"
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full bg-surface-elevated hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 bg-surface-elevated flex-shrink-0">
            <img src="/assets/aira/aira_coffee.png" alt="Aira Mascot" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <h3 id="aira-modal-title" className="text-xl font-display font-bold text-white">Aira Voice Assistant</h3>
            <p className="text-xs font-mono text-cyan-400">Automation & Strategy Companion</p>
          </div>
        </div>

        {/* Sound Wave Frequency Visualizer */}
        <div className="h-12 bg-black/60 rounded-xl border border-white/10 flex items-center justify-center gap-1">
          <span className={`sound-bar ${isListening ? 'animate-pulse' : ''}`} />
          <span className={`sound-bar ${isListening ? 'animate-pulse' : ''}`} />
          <span className={`sound-bar ${isListening ? 'animate-pulse' : ''}`} />
          <span className={`sound-bar ${isListening ? 'animate-pulse' : ''}`} />
          <span className={`sound-bar ${isListening ? 'animate-pulse' : ''}`} />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200 font-sans">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs sm:text-sm font-sans text-neutral-200 leading-relaxed">
            "{transcript || "What can I help you with? Ask me to explore our automation pipelines, review our brand strategy services, calculate ROI, or get in touch with Flyvane."}"
          </p>
        </div>

        {/* Quick Action Suggestions */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Suggested Inquiries</span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onCommand(qp.cmd);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{qp.label}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div>
          <label htmlFor="aira-voice-input" className="sr-only">
            Type command or query for Aira
          </label>
          <div className="flex items-center gap-3">
            <input
              id="aira-voice-input"
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak or type a command (e.g. 'open scraper', 'calc')..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />

            <button
              onClick={handleStartVoice}
              disabled={isListening}
              className={`p-3 rounded-xl ${
                isListening ? 'bg-amber-400 text-black animate-pulse' : 'bg-cyan-400 hover:bg-cyan-300 text-black'
              } font-bold transition-all cursor-pointer`}
              title={isListening ? "Listening..." : "Click to speak"}
              aria-label="Click to speak through microphone"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Terminal, Cpu, Calculator, Code, Brain, Mic, Search, User, Mail, Hash } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Automation' | 'Theme' | 'Voice' | 'Identity';
  icon: React.ReactNode;
  shortcut?: string;
  action: string;
  keywords: string[];
}

const COMMAND_REGISTRY: CommandItem[] = [
  {
    id: 'cmd-workbench',
    title: 'Open Interactive Shell & Terminal',
    subtitle: 'Run live CLI commands, scrapers, and copy audits',
    category: 'Automation',
    icon: <Terminal className="w-4 h-4 text-cyan-400" />,
    shortcut: '#workbench',
    action: 'workbench',
    keywords: ['shell', 'cli', 'terminal', 'sandbox', 'run', 'python']
  },
  {
    id: 'cmd-scraper',
    title: 'Launch Live Web Scraper & DOM Engine',
    subtitle: 'Extract live web elements into capped 3-record format',
    category: 'Automation',
    icon: <Code className="w-4 h-4 text-cyan-400" />,
    shortcut: 'SCRAPE',
    action: 'scrape',
    keywords: ['scraper', 'playwright', 'dom', 'extract', 'crawl', 'contacts', 'emails']
  },
  {
    id: 'cmd-roi',
    title: 'Calculate Automation ROI & Bottleneck Losses',
    subtitle: 'Quantify wasted payroll hours vs automation savings',
    category: 'Navigation',
    icon: <Calculator className="w-4 h-4 text-emerald-400" />,
    shortcut: '#roi',
    action: 'roi',
    keywords: ['roi', 'calculator', 'arbitrage', 'loss', 'pricing', 'hours', 'savings']
  },
  {
    id: 'cmd-mind',
    title: 'Switch to "MIND" Behavioral Mode',
    subtitle: 'Warm amber palette & psychological conversion architecture',
    category: 'Theme',
    icon: <Brain className="w-4 h-4 text-amber-400" />,
    shortcut: 'MIND',
    action: 'mode mind',
    keywords: ['mind', 'theme', 'behavioral', 'psychology', 'amber']
  },
  {
    id: 'cmd-machine',
    title: 'Switch to "MACHINE" Technical Mode',
    subtitle: 'Electric cyan palette & systems automation view',
    category: 'Theme',
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    shortcut: 'MACHINE',
    action: 'mode machine',
    keywords: ['machine', 'theme', 'automation', 'cyan', 'technical']
  },
  {
    id: 'cmd-hybrid',
    title: 'Switch to "HYBRID" Unified Matrix',
    subtitle: 'Emerald palette combining engineering & psychology',
    category: 'Theme',
    icon: <Hash className="w-4 h-4 text-emerald-400" />,
    shortcut: 'HYBRID',
    action: 'mode hybrid',
    keywords: ['hybrid', 'matrix', 'emerald', 'unified']
  },
  {
    id: 'cmd-aira',
    title: 'Voice Session: Speak with Aira Companion',
    subtitle: 'Initiate voice speech synthesis & direct companion tour',
    category: 'Voice',
    icon: <Mic className="w-4 h-4 text-cyan-400" />,
    shortcut: 'VOICE',
    action: 'aira',
    keywords: ['aira', 'voice', 'companion', 'speak', 'audio', 'tour']
  },
  {
    id: 'cmd-whoami',
    title: 'Inspect Studio Architecture & Standards (capabilities)',
    subtitle: 'Flyvane // Engineering, Automation & Strategy Practice',
    category: 'Identity',
    icon: <User className="w-4 h-4 text-neutral-300" />,
    shortcut: '#capabilities',
    action: 'capabilities',
    keywords: ['capabilities', 'architecture', 'standards', 'security', 'sla', 'flyvane']
  },
  {
    id: 'cmd-contact',
    title: 'Retain Advisory & Enterprise Intake',
    subtitle: 'Selective 2-slot retainer intake and direct brief dispatch',
    category: 'Navigation',
    icon: <Mail className="w-4 h-4 text-emerald-400" />,
    shortcut: '#contact',
    action: 'contact',
    keywords: ['contact', 'retain', 'hire', 'email', 'phone', 'call', 'consulting']
  }
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand: (cmd: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectCommand }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands dynamically with fuzzy keyword matching
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_REGISTRY;
    return COMMAND_REGISTRY.filter(cmd => 
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords.some(kw => kw.includes(q))
    );
  }, [query]);

  // Keep selectedIndex in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-focus input when palette opens & play modal sweep sound
  useEffect(() => {
    if (isOpen) {
      soundEngine.playModalSweep(true);
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playModalSweep(false);
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        soundEngine.playClick(0.04);
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        soundEngine.playClick(0.04);
        setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        soundEngine.playPop(0.08);
        if (filteredCommands.length > 0) {
          const selected = filteredCommands[selectedIndex];
          onSelectCommand(selected.action);
          onClose();
        } else if (query.trim()) {
          onSelectCommand(query.trim());
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, query, onClose, onSelectCommand]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={() => {
        soundEngine.playModalSweep(false);
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div 
        className="w-full max-w-2xl bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-surface-border flex items-center gap-3 bg-surface-elevated/40">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, tools, or run actions... (e.g. 'scrape', 'roi', 'mind')"
            className="w-full bg-transparent text-sm font-mono text-white focus:outline-none placeholder:text-neutral-500"
            role="combobox"
            aria-expanded={filteredCommands.length > 0}
            aria-autocomplete="list"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-surface-elevated border border-surface-border">
              ESC
            </span>
          </div>
        </div>

        {/* Dynamic Command List */}
        <div 
          ref={listRef}
          className="p-2 max-h-80 overflow-y-auto font-mono text-xs space-y-1"
          role="listbox"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 font-mono text-xs">
              No matching commands found for <span className="text-white">"{query}"</span>.
              <p className="text-[11px] text-neutral-600 mt-1">Press <strong className="text-neutral-400">Enter</strong> to send directly to shell engine.</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    soundEngine.playPop(0.08);
                    onSelectCommand(cmd.action);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-surface-elevated text-white border border-cyan-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-white border border-transparent'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-black/60 border border-white/10' : 'bg-surface'}`}>
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate text-xs">{cmd.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 uppercase">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-surface border border-surface-border">
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] text-cyan-400 font-bold">↵</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2.5 bg-void border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span><strong className="text-neutral-300">↑↓</strong> Navigate</span>
            <span><strong className="text-neutral-300">↵</strong> Execute</span>
            <span><strong className="text-neutral-300">Esc</strong> Dismiss</span>
          </div>
          <span className="text-cyan-400/80">Raycast / Linear Architecture</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Terminal, Cpu, Calculator, Code, Brain, Search, User, Mail, Hash, Sparkles, Volume2, BookOpen, ShieldCheck, FileText } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { sanitizeText } from '../utils/security';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Automation' | 'Theme' | 'Audio' | 'Identity';
  icon: React.ReactNode;
  shortcut?: string;
  action: string;
  keywords: string[];
}

const COMMAND_REGISTRY: CommandItem[] = [
  {
    id: 'cmd-workbench',
    title: 'Open Execution Sandbox',
    subtitle: 'Run live pipelines and extraction workflows',
    category: 'Automation',
    icon: <Terminal className="w-4 h-4 text-cyan-400" />,
    shortcut: 'SANDBOX',
    action: 'workbench',
    keywords: ['shell', 'sandbox', 'run', 'python', 'workbench']
  },
  {
    id: 'cmd-scraper',
    title: 'Launch Extraction Engine',
    subtitle: 'Extract live web elements into capped 3-record format',
    category: 'Automation',
    icon: <Code className="w-4 h-4 text-cyan-400" />,
    shortcut: 'EXTRACT',
    action: 'scrape',
    keywords: ['dom', 'extract', 'crawl', 'contacts', 'emails']
  },
  {
    id: 'cmd-roi',
    title: 'Open Economic & Pipeline Calculator',
    subtitle: 'Quantify workflow savings or executive pipeline value',
    category: 'Navigation',
    icon: <Calculator className="w-4 h-4 text-emerald-400" />,
    shortcut: 'CALC',
    action: 'roi',
    keywords: ['roi', 'calculator', 'arbitrage', 'loss', 'pricing', 'hours', 'savings', 'pipeline']
  },
  {
    id: 'cmd-machine',
    title: 'Switch to Automation Services',
    subtitle: 'Autonomous engineering & process infrastructure view',
    category: 'Theme',
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    shortcut: 'AUTOMATION',
    action: 'mode machine',
    keywords: ['machine', 'theme', 'automation', 'cyan', 'technical', 'services']
  },
  {
    id: 'cmd-mind',
    title: 'Switch to Marketing Services',
    subtitle: 'Executive positioning & demand architecture view',
    category: 'Theme',
    icon: <Brain className="w-4 h-4 text-amber-400" />,
    shortcut: 'MARKETING',
    action: 'mode mind',
    keywords: ['mind', 'theme', 'marketing', 'behavioral', 'psychology', 'amber', 'strategy']
  },
  {
    id: 'cmd-hybrid',
    title: 'Switch to Hybrid Mode',
    subtitle: 'Unified engineering & executive authority view',
    category: 'Theme',
    icon: <Hash className="w-4 h-4 text-emerald-400" />,
    shortcut: 'HYBRID',
    action: 'mode hybrid',
    keywords: ['hybrid', 'matrix', 'emerald', 'unified']
  },
  {
    id: 'cmd-updates',
    title: 'View Studio Updates & Insights',
    subtitle: 'Recent LinkedIn dispatches and architectural notes',
    category: 'Navigation',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    shortcut: 'UPDATES',
    action: 'updates',
    keywords: ['updates', 'insights', 'linkedin', 'posts', 'news']
  },
  {
    id: 'cmd-aira',
    title: 'Open Aira Studio Concierge',
    subtitle: 'Launch interactive studio navigation assistant',
    category: 'Navigation',
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    shortcut: 'CONCIERGE',
    action: 'aira',
    keywords: ['aira', 'concierge', 'companion', 'assistant', 'navigation']
  },
  {
    id: 'cmd-mute',
    title: 'Toggle Tactile UI Sounds',
    subtitle: 'Mute or unmute Web Audio mechanical interaction feedback',
    category: 'Audio',
    icon: <Volume2 className="w-4 h-4 text-cyan-400" />,
    shortcut: 'MUTE',
    action: 'mute',
    keywords: ['mute', 'sound', 'audio', 'tactile', 'silence']
  },
  {
    id: 'cmd-whoami',
    title: 'Inspect Studio Capabilities & Standards',
    subtitle: 'CyberSteed — Engineering, Automation & Strategy Practice',
    category: 'Identity',
    icon: <User className="w-4 h-4 text-zinc-300" />,
    shortcut: 'STANDARDS',
    action: 'capabilities',
    keywords: ['capabilities', 'architecture', 'standards', 'security', 'sla', 'cybersteed']
  },
  {
    id: 'cmd-blog',
    title: 'Browse Publications & Insights',
    subtitle: 'Technical post-mortems, whitepapers & system architecture briefs',
    category: 'Navigation',
    icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
    shortcut: 'BLOG',
    action: 'blog',
    keywords: ['blog', 'publications', 'articles', 'posts', 'insights', 'reading', 'manifesto']
  },
  {
    id: 'cmd-about',
    title: 'About CyberSteed & Founder',
    subtitle: 'Meet Ansh Rudra, our ethics, practice capabilities & trajectory',
    category: 'Identity',
    icon: <User className="w-4 h-4 text-emerald-400" />,
    shortcut: 'ABOUT',
    action: 'about',
    keywords: ['about', 'founder', 'ansh', 'rudra', 'ethics', 'vision', 'story', 'team']
  },
  {
    id: 'cmd-terms',
    title: 'Terms of Engagement & Standards',
    subtitle: 'Client IP sovereignty, deterministic SLAs & architecture protocols',
    category: 'Identity',
    icon: <FileText className="w-4 h-4 text-cyan-400" />,
    shortcut: 'TERMS',
    action: 'terms',
    keywords: ['terms', 'legal', 'conditions', 'sla', 'ip', 'privacy', 'security', 'governance']
  },
  {
    id: 'cmd-admin',
    title: 'Administrative Command Center',
    subtitle: '2FA dual-channel protected console for content, leads & blogs',
    category: 'Identity',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    shortcut: 'ADMIN',
    action: 'admin',
    keywords: ['admin', 'dashboard', 'cms', 'manage', 'leads', '2fa', 'settings', 'auth']
  },
  {
    id: 'cmd-contact',
    title: 'Retain Advisory & Direct Project Intake',
    subtitle: 'Submit project scope brief for 24-hour partner review',
    category: 'Navigation',
    icon: <Mail className="w-4 h-4 text-emerald-400" />,
    shortcut: 'INTAKE',
    action: 'contact',
    keywords: ['contact', 'retain', 'hire', 'email', 'advisory', 'consulting']
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

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_REGISTRY.filter((cmd) => cmd.id !== 'cmd-admin');
    return COMMAND_REGISTRY.filter((cmd) => {
      if (cmd.id === 'cmd-admin') {
        return q === 'admin' || q === 'vault' || q === 'secret';
      }
      return (
        cmd.title.toLowerCase().includes(q) ||
        cmd.subtitle.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.keywords.some((kw) => kw.includes(q))
      );
    });
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      soundEngine.playModalSweep(true);
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playModalSweep(false);
        onClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        inputRef.current?.focus();
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
      className="fixed inset-0 z-50 bg-[#030406]/70 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={() => {
        soundEngine.playModalSweep(false);
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-2xl liquid-glass-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/[0.09] flex items-center gap-3 bg-white/[0.02]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(sanitizeText(e.target.value, 80))}
            placeholder="Search studio actions, modes, or sections..."
            className="w-full bg-transparent text-sm font-sans text-white focus:outline-none placeholder:text-zinc-500"
            role="combobox"
            aria-expanded={filteredCommands.length > 0}
            aria-autocomplete="list"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
              ESC
            </span>
          </div>
        </div>

        <div
          ref={listRef}
          className="p-2 max-h-80 overflow-y-auto font-sans text-xs space-y-1"
          role="listbox"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 font-sans text-xs">
              No matching commands found for <span className="text-white">"{query}"</span>.
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
                      ? 'bg-white/[0.08] text-white border border-emerald-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-white border border-transparent'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/[0.08] border border-white/15' : 'bg-white/[0.03]'}`}>
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate text-xs font-sans">{cmd.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 uppercase tracking-wider font-sans">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-sans">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08]">
                        {cmd.shortcut}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.09] flex items-center justify-between text-[11px] font-sans text-zinc-400">
          <div className="flex items-center gap-3">
            <span><strong className="text-zinc-200">↑↓</strong> Navigate</span>
            <span><strong className="text-zinc-200">↵</strong> Execute</span>
            <span><strong className="text-zinc-200">Esc</strong> Dismiss</span>
          </div>
          <span className="text-emerald-400/80 font-medium">CyberSteed Command</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

import React from 'react';
import { Mic, Terminal } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  mode: 'machine' | 'mind' | 'hybrid';
  setMode: (mode: 'machine' | 'mind' | 'hybrid') => void;
  onOpenAira: () => void;
  onOpenCmd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, setMode, onOpenAira, onOpenCmd }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-void/85 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Link */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center font-mono text-sm font-bold text-white group-hover:border-cyanAccent transition-colors shadow-inner">
            FV
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-void" />
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-white block text-sm sm:text-base leading-none">
              Flyvane
            </span>
            <span className="text-[10px] font-mono text-neutral-400 block tracking-wider uppercase mt-1">
              Engineering, Automation & Strategy
            </span>
          </div>
        </a>

        {/* 3-State Theme Morphing Machine */}
        <div className="hidden md:flex items-center bg-surface-card p-1 rounded-full border border-surface-border">
          <button
            onClick={() => {
              setMode('machine');
              soundEngine.playModeMorph('machine');
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn ${
              mode === 'machine'
                ? 'text-white bg-cyanAccent/20 border border-cyanAccent/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> MACHINE
          </button>
          <button
            onClick={() => {
              setMode('mind');
              soundEngine.playModeMorph('mind');
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn ${
              mode === 'mind'
                ? 'text-white bg-amberAccent/20 border border-amberAccent/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> MIND
          </button>
          <button
            onClick={() => {
              setMode('hybrid');
              soundEngine.playModeMorph('hybrid');
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn ${
              mode === 'hybrid'
                ? 'text-white bg-emeraldAccent/20 border border-emeraldAccent/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> HYBRID
          </button>
        </div>

        {/* Quick Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.playClick(0.06);
              onOpenAira();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-neutral-300 hover:text-white transition-colors group tactile-btn"
            title="Talk to Aira (Mascot Companion)"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
            <span className="hidden sm:inline">Talk to Aira</span>
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(0.06);
              onOpenCmd();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-neutral-400 hover:text-white transition-colors tactile-btn"
          >
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Cmd+K</span>
          </button>

          <a
            href="#contact"
            onClick={() => soundEngine.playClick(0.08)}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-md tactile-btn"
          >
            Retain Advisory
          </a>
        </div>

      </div>
    </header>
  );
};

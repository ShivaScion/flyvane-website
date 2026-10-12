import React from 'react';
import { Search } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  mode: 'machine' | 'mind' | 'hybrid';
  setMode: (mode: 'machine' | 'mind' | 'hybrid') => void;
  onOpenAira?: () => void;
  onOpenCmd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, setMode, onOpenCmd }) => {
  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/40 border-b border-white/[0.08] h-16 px-4 sm:px-6 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3">
        
        {/* Left Brand Block */}
        <a href="#hero" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl bg-zinc-950/60 border border-white/[0.08] border-t-white/[0.16] flex items-center justify-center font-sans text-xs font-semibold tracking-wider text-white group-hover:border-white/20 transition-colors shadow-inner">
            FV
          </div>
          <div className="hidden xs:block sm:block">
            <span className="font-sans font-semibold tracking-tight text-white block text-sm sm:text-base leading-none">
              Flyvane
            </span>
            <span className="text-[10px] font-sans font-medium text-zinc-400 block tracking-[0.16em] uppercase mt-1">
              {mode === 'machine'
                ? 'Systems Architecture'
                : mode === 'mind'
                ? 'Executive Advisory'
                : 'Integrated Practice'}
            </span>
          </div>
        </a>

        {/* Mode Selector: Segmented Pill Toggle */}
        <div
          role="group"
          aria-label="Studio Mode Selector"
          className="flex items-center bg-zinc-950/60 p-1 rounded-full border border-white/[0.08]"
        >
          <button
            type="button"
            onClick={() => {
              setMode('machine');
              soundEngine.playModeMorph('machine');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn ${
              mode === 'machine'
                ? 'text-white bg-emerald-500/20 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Machine</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('mind');
              soundEngine.playModeMorph('mind');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn ${
              mode === 'mind'
                ? 'text-white bg-amber-500/20 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Mind</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('hybrid');
              soundEngine.playModeMorph('hybrid');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn ${
              mode === 'hybrid'
                ? 'text-white bg-cyan-500/20 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Hybrid</span>
          </button>
        </div>

        {/* Central / Right Navigation Links */}
        <nav aria-label="Primary Navigation" className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a
            href="#updates"
            onClick={() => soundEngine.playClick(0.05)}
            className="text-xs font-sans font-medium text-zinc-300 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/[0.04]"
          >
            Updates
          </a>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(0.06);
              onOpenCmd();
            }}
            aria-label="Open Command Palette"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/[0.08] text-xs font-sans font-medium text-zinc-300 hover:text-white transition-colors tactile-btn"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Command + K</span>
          </button>

          <a
            href="#contact"
            onClick={() => soundEngine.playClick(0.08)}
            className="bg-white text-black hover:bg-zinc-200 font-sans font-medium text-xs tracking-wide px-3.5 sm:px-4 py-2 rounded-lg transition-colors shadow-sm tactile-btn whitespace-nowrap"
          >
            Retain Advisory
          </a>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;

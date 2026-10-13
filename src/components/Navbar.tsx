import React from 'react';
import { Search, Volume2, VolumeX, Shield } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  mode: 'machine' | 'mind' | 'hybrid';
  setMode: (mode: 'machine' | 'mind' | 'hybrid') => void;
  onOpenCmd: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  onOpenCmd,
  isMuted,
  onToggleMute,
  currentPath = '/',
  onNavigate,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 backdrop-blur-2xl bg-[#07080B]/75 border-b border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] h-16 px-4 sm:px-6 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Brand Block */}
        <a
          href="/"
          onMouseEnter={() => soundEngine.playHoverHum()}
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              soundEngine.playClick(0.06);
              onNavigate('/');
            }
          }}
          className="flex items-center gap-3 group shrink-0 cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-xl backdrop-blur-2xl bg-white/[0.04] border border-white/[0.12] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center font-sans text-xs font-semibold tracking-wider text-white group-hover:border-white/25 transition-all">
            FV
          </div>
          <div className="hidden lg:block">
            <span className="font-sans font-semibold tracking-tight text-white block text-sm sm:text-base leading-none">
              Flyvane
            </span>
            <span className="text-[10px] font-sans font-medium text-zinc-400 block tracking-[0.16em] uppercase mt-1">
              {mode === 'machine'
                ? 'Automation Services'
                : mode === 'mind'
                ? 'Marketing Services'
                : 'Unified Practice'}
            </span>
          </div>
        </a>

        {/* Mode Selector: Segmented Liquid Glass Pill Toggle */}
        <div
          role="group"
          aria-label="Studio Mode Selector"
          className="flex items-center backdrop-blur-2xl bg-white/[0.03] p-1 rounded-full border border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.14)]"
        >
          <button
            type="button"
            onMouseEnter={() => soundEngine.playHoverHum()}
            onClick={() => {
              setMode('machine');
              soundEngine.playModeMorph('machine');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn whitespace-nowrap ${
              mode === 'machine'
                ? 'text-white backdrop-blur-2xl bg-cyan-500/[0.16] border border-cyan-400/40 shadow-[0_4px_20px_rgba(0,216,255,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.28)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span>Automation Services</span>
          </button>

          <button
            type="button"
            onMouseEnter={() => soundEngine.playHoverHum()}
            onClick={() => {
              setMode('mind');
              soundEngine.playModeMorph('mind');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn whitespace-nowrap ${
              mode === 'mind'
                ? 'text-white backdrop-blur-2xl bg-amber-500/[0.16] border border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.28)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>Marketing Services</span>
          </button>

          <button
            type="button"
            onMouseEnter={() => soundEngine.playHoverHum()}
            onClick={() => {
              setMode('hybrid');
              soundEngine.playModeMorph('hybrid');
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 tactile-btn whitespace-nowrap ${
              mode === 'hybrid'
                ? 'text-white backdrop-blur-2xl bg-emerald-500/[0.16] border border-emerald-400/40 shadow-[0_4px_20px_rgba(16,185,129,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.28)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>Hybrid</span>
          </button>
        </div>

        {/* Right Navigation Links & Tactile Audio Mute Toggle */}
        <nav aria-label="Primary Navigation" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="/blog"
            onMouseEnter={() => soundEngine.playHoverHum()}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                soundEngine.playClick(0.05);
                onNavigate('/blog');
              }
            }}
            className={`hidden sm:inline-block text-xs font-sans font-medium transition-colors px-2.5 py-1.5 rounded-lg ${
              currentPath.startsWith('/blog')
                ? 'text-cyan-400 bg-white/[0.08] border border-cyan-400/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Publications
          </a>

          <a
            href="/admin"
            onMouseEnter={() => soundEngine.playHoverHum()}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                soundEngine.playClick(0.06);
                onNavigate('/admin');
              }
            }}
            aria-label="Admin Control Vault"
            title="Admin Control Vault (2FA Protected)"
            className={`p-2 rounded-lg backdrop-blur-2xl transition-all tactile-btn ${
              currentPath === '/admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.09] text-zinc-400 hover:text-zinc-200 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.16)]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute tactile UI sounds' : 'Mute tactile UI sounds'}
            title={isMuted ? 'Unmute tactile UI sounds' : 'Mute tactile UI sounds'}
            className="p-2 rounded-lg backdrop-blur-2xl bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.09] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.16)] text-zinc-300 hover:text-white transition-all tactile-btn"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          <button
            type="button"
            onMouseEnter={() => soundEngine.playHoverHum()}
            onClick={() => {
              soundEngine.playClick(0.06);
              onOpenCmd();
            }}
            aria-label="Open Command Palette"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-2xl bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.09] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.16)] text-xs font-sans font-medium text-zinc-300 hover:text-white transition-all tactile-btn"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Command + K</span>
          </button>

          <a
            href="#contact"
            onMouseEnter={() => soundEngine.playHoverHum()}
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


import React from 'react';
import { motion } from 'framer-motion';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT, ModeConfig, ProofMetric } from '../data/modeContent';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';
import { Layers, TrendingUp, Brain, Sparkles } from 'lucide-react';

interface HeroProps {
  mode: 'machine' | 'mind' | 'hybrid';
  contentOverride?: ModeConfig;
}

export const Hero: React.FC<HeroProps> = ({ mode, contentOverride }) => {
  const content = contentOverride || MODE_CONTENT[mode];

  const scrollToHash = (hash: string) => {
    soundEngine.playClick(0.07);
    const el = document.querySelector(hash);
    if (el && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
    } else {
      window.location.href = hash;
    }
  };

  const accentColor =
    mode === 'mind'
      ? 'text-amber-500'
      : mode === 'hybrid'
      ? 'text-emerald-400'
      : 'text-cyan-400';

  const dotBg =
    mode === 'mind'
      ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
      : mode === 'hybrid'
      ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
      : 'bg-cyan-400 shadow-[0_0_8px_#00D8FF]';

  return (
    <section
      id="hero"
      className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[82vh] flex flex-col justify-center py-10"
    >
      {/* Main Split Layout — Left Typography + Right Open Viewport for Fixed CinematicBackground */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-2 h-2 rounded-full ${dotBg} animate-pulse`} />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-300">
              {content.badge}
            </span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-4">
            {content.heroHeadline.lead}{' '}
            <span className={accentColor}>{content.heroHeadline.emphasis}</span>
          </h1>

          <h2 className={`text-3xl lg:text-4xl font-medium tracking-tight mb-8 ${accentColor}`}>
            {content.heroHeadline.subLead}{' '}
            <span className="text-white">{content.heroHeadline.subEmphasis}</span>
          </h2>

          <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-10">
            {content.heroDescription}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToHash(content.ctaPrimaryHash)}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
            >
              {content.ctaPrimary} →
            </button>
            <button
              type="button"
              onClick={() => scrollToHash(content.ctaSecondaryHash)}
              className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
            >
              {content.ctaSecondary} ↗
            </button>
          </div>
        </div>

        {/* Right Spatial Architecture Panel Card */}
        <div className="w-full lg:w-[46%] z-10">
          <InteractiveTiltWrapper
            className="p-6 sm:p-8 space-y-6 relative overflow-hidden"
            maxTilt={6}
          >
            {/* Header row with overline and status badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
                {content.architecturePanel.overline}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border ${
                  mode === 'machine'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : mode === 'mind'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}
              >
                {content.architecturePanel.statusLabel}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
              {content.architecturePanel.title}
            </h3>

            {/* Spec list */}
            <div className="space-y-2.5">
              {content.architecturePanel.specs.map((spec: { label: string; value: string }, sIdx: number) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs hover:border-white/[0.12] transition-colors"
                >
                  <span className="font-mono text-zinc-400">{spec.label}</span>
                  <span className="font-mono text-zinc-200 font-medium text-right ml-2">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Summary description */}
            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              {content.architecturePanel.summary}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              {mode === 'machine' && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToHash('#workbench')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Live Sandbox ↗</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToHash('#roi-arbitrage')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Value Model ↗</span>
                  </button>
                </>
              )}
              {mode === 'mind' && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToHash('#strategy-board')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <Brain className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Strategy Board ↗</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToHash('#contact')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Authority Model ↗</span>
                  </button>
                </>
              )}
              {mode === 'hybrid' && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToHash('#capabilities')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Unified Stack ↗</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToHash('#contact')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Retain Advisory ↗</span>
                  </button>
                </>
              )}
            </div>
          </InteractiveTiltWrapper>
        </div>
      </div>

      {/* Phase 3.1: 3-Column Proof Bar using .liquid-glass-card */}
      <motion.div
        key={`proof-${mode}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: stitchEase }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/[0.08]"
      >
        {content.proofBar.map((item: ProofMetric, idx: number) => (
          <InteractiveTiltWrapper
            key={idx}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className="p-6 sm:p-8 space-y-2.5 relative overflow-hidden"
          >
            <div className="flex items-baseline justify-between gap-2 relative z-10">
              <span className="text-3xl sm:text-4xl font-mono font-semibold text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] theme-accent">
                Verified Benchmark
              </span>
            </div>
            <h3 className="text-base font-sans font-semibold text-white relative z-10">
              {item.title}
            </h3>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed relative z-10">
              {item.description}
            </p>
          </InteractiveTiltWrapper>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;

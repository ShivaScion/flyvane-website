import React from 'react';
import { motion } from 'framer-motion';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT, ModeConfig, ProofMetric } from '../data/modeContent';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

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

        {/* Right Spatial Viewport: Open window allowing the Global Fixed CinematicBackground to command depth */}
        <div
          aria-hidden="true"
          className="w-full lg:w-[45%] min-h-[380px] sm:min-h-[460px] pointer-events-none relative"
        />
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

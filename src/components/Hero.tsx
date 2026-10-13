import React from 'react';
import { motion } from 'framer-motion';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';
import { soundEngine } from '../utils/soundEngine';

interface HeroProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const Hero: React.FC<HeroProps> = ({ mode }) => {
  const content = MODE_CONTENT[mode];

  const scrollToHash = (hash: string) => {
    soundEngine.playClick(0.07);
    const el = document.querySelector(hash);
    if (el && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
    } else {
      window.location.href = hash;
    }
  };

  return (
    <section
      id="hero"
      className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[82vh] flex flex-col justify-center py-10"
    >
      {/* Main Split Layout — Left Typography + Right Open Viewport for Fixed CinematicBackground */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {mode === 'machine' && (
          <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D8FF]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-300">
                Engineering & Autonomous Process Infrastructure
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-4">
              Automate the boring.
            </h1>

            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-cyan-400 mb-8">
              Architect the autonomous.
            </h2>

            <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-10">
              We engineer bespoke data extraction pipelines, intelligent worker swarms, and headless systems that replace fragile manual labor with zero-operator reliability.
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToHash(content.ctaPrimaryHash)}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
              >
                Explore Architecture →
              </button>
              <button
                type="button"
                onClick={() => scrollToHash(content.ctaSecondaryHash)}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Initialize Advisory ↗
              </button>
            </div>
          </div>
        )}

        {mode === 'mind' && (
          <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-300">
                Behavioral Strategy & Executive Positioning
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-4">
              Market the brilliant.
            </h1>

            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-amber-500 mb-8">
              Command the authority.
            </h2>

            <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-10">
              Transforming technical complexity into category-defining market authority. We architect founder positioning, high-intent narrative funnels, and enterprise demand engines.
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToHash(content.ctaPrimaryHash)}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
              >
                View Strategy Frameworks →
              </button>
              <button
                type="button"
                onClick={() => scrollToHash(content.ctaSecondaryHash)}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Retain Advisory ↗
              </button>
            </div>
          </div>
        )}

        {mode === 'hybrid' && (
          <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D8FF]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-300">
                Full-Spectrum Autonomous Systems & Brand Authority
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-4">
              Automate the boring.
            </h1>

            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-cyan-400 mb-8">
              Market the brilliant.
            </h2>

            <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-10">
              Flyvane unifies autonomous backend infrastructure with category-defining brand architecture—building companies that operate with machine precision and market dominance.
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToHash(content.ctaPrimaryHash)}
                className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
              >
                Explore Unified Systems →
              </button>
              <button
                type="button"
                onClick={() => scrollToHash(content.ctaSecondaryHash)}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Retain Full-Stack Advisory ↗
              </button>
            </div>
          </div>
        )}

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
        {content.proofBar.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className="liquid-glass-card p-6 sm:p-8 space-y-2.5 relative overflow-hidden"
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
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;

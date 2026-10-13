import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { stitchEase, stitchSpring } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';
import { HeroCenterpiece3D } from './HeroCenterpiece3D';
import { soundEngine } from '../utils/soundEngine';

interface HeroProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const Hero: React.FC<HeroProps> = ({ mode }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[82vh] flex flex-col justify-center py-10">
      
      {/* Main 45% / 55% Split Layout (Section 2.1 & 2.2) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        
        {/* Left Column: 45% Editorial Typography */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: stitchEase }}
          className="w-full lg:w-[45%] space-y-6"
        >
          {/* Category Badge in Liquid Glass */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full backdrop-blur-2xl bg-white/[0.035] border border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18)]">
            <span
              className={`w-2 h-2 rounded-full ${
                mode === 'mind' ? 'bg-amber-400' : mode === 'hybrid' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <span className="text-[11px] font-sans text-zinc-200 uppercase tracking-[0.2em] font-semibold">
              {content.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl xl:text-[58px] font-sans font-semibold tracking-[-0.03em] leading-[1.08] text-white text-balance">
            {content.heroHeadline.lead}{' '}
            <span className="text-zinc-100">{content.heroHeadline.emphasis}</span>
            <br />
            {content.heroHeadline.subLead}{' '}
            <span className="theme-accent">{content.heroHeadline.subEmphasis}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl font-sans text-pretty">
            {content.heroDescription}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.a
              href={content.ctaPrimaryHash}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={stitchSpring.snappy}
              onMouseEnter={() => soundEngine.playHoverHum()}
              onClick={() => soundEngine.playClick(0.07)}
              className="px-6 py-3.5 rounded-xl font-sans text-xs font-semibold tracking-wide bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg tactile-btn"
            >
              <span>{content.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href={content.ctaSecondaryHash}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={stitchSpring.snappy}
              onMouseEnter={() => soundEngine.playHoverHum()}
              onClick={() => soundEngine.playClick(0.07)}
              className="px-6 py-3.5 rounded-xl font-sans text-xs font-semibold tracking-wide backdrop-blur-2xl bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.09] hover:border-white/[0.22] shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18)] text-white transition-all duration-500 ease-out flex items-center gap-2 tactile-btn"
            >
              <span>{content.ctaSecondary}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-300" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column: 55% Full-Bleed Living 3D Visual Centerpiece */}
        <motion.div
          key={`centerpiece-${mode}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: stitchEase }}
          className="w-full lg:w-[55%]"
        >
          <HeroCenterpiece3D mode={mode} />
        </motion.div>

      </div>

      {/* 3-Column Liquid Glass Quantitative Proof Bar */}
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
            className="tilt-card backdrop-blur-2xl bg-white/[0.035] border border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18)] hover:bg-white/[0.06] hover:border-white/[0.22] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.65),inset_0_1px_2px_0_rgba(255,255,255,0.3)] transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-2.5"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-semibold text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] theme-accent">
                Verified Benchmark
              </span>
            </div>
            <h2 className="text-sm font-sans font-semibold text-zinc-100">
              {item.title}
            </h2>
            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </motion.div>

    </section>
  );
};

export default Hero;


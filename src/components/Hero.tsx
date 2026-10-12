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

  const primaryTitle = `${content.heroHeadline.lead} ${content.heroHeadline.emphasis}`;
  const subordinateHeader = `${content.heroHeadline.subLead} ${content.heroHeadline.subEmphasis}`;

  const subordinateColorClass =
    mode === 'mind'
      ? 'text-amber-400'
      : mode === 'hybrid'
      ? 'text-cyan-400'
      : 'text-emerald-400';

  const dotColorClass =
    mode === 'mind'
      ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
      : mode === 'hybrid'
      ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,216,255,0.8)]'
      : 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]';

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[82vh] flex flex-col justify-center py-10">
      
      {/* Main 45% / 55% Split Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        
        {/* Left Column: 45% Strict 4-Tier Editorial Typography (Section 1 & Section 3) */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: stitchEase }}
          className="w-full lg:w-[45%]"
        >
          {/* Role 4: Micro Overline in Liquid Glass */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mb-6 rounded-full backdrop-blur-xl bg-white/[0.035] border border-white/[0.12] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)]">
            <span className={`w-2 h-2 rounded-full ${dotColorClass}`} />
            <span className="text-[10px] sm:text-[11px] font-sans text-zinc-200 uppercase tracking-[0.2em] font-semibold">
              {content.badge}
            </span>
          </div>

          {/* Role 1: Display Brand Title (The Primary Punch — 52px+ Desktop) */}
          <h1 className="text-5xl lg:text-6xl font-sans font-bold tracking-tight leading-[1.08] text-white mb-2">
            {primaryTitle}
          </h1>

          {/* Role 2: Subordinate Header / Counter-Phrase (Scaled down — 24px-36px) */}
          <h2
            id="hero-subordinate-header"
            className={`hero-subhead text-2xl sm:text-3xl lg:text-4xl font-sans font-medium tracking-normal leading-[1.2] ${subordinateColorClass} mb-6`}
          >
            {subordinateHeader}
          </h2>

          {/* Role 3: Executive Prose & Interactive Body */}
          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-xl font-sans mb-8 text-pretty">
            {content.heroDescription}
          </p>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-4">
            <motion.a
              href={content.ctaPrimaryHash}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={stitchSpring.snappy}
              onMouseEnter={() => soundEngine.playHoverHum()}
              onClick={() => soundEngine.playClick(0.07)}
              className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-semibold tracking-wide bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-[0_12px_32px_rgba(255,255,255,0.16)] tactile-btn"
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
              className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-medium tracking-wide bg-white/[0.025] backdrop-blur-2xl hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.18] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2)] text-zinc-100 transition-all duration-500 ease-out flex items-center gap-2 tactile-btn"
            >
              <span>{content.ctaSecondary}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-300" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column: 55% Studio-Grade 3D Visual Centerpiece (Section 4) */}
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

      {/* 3-Column Liquid Glass Quantitative Proof Bar (Section 2.1 Master Tokens) */}
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
            className="tilt-card liquid-glass bg-white/[0.025] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)] hover:bg-white/[0.045] hover:border-white/[0.18] hover:shadow-[0_24px_56px_0_rgba(0,0,0,0.8),inset_0_1px_2px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-2.5"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-semibold text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] theme-accent">
                Verified Benchmark
              </span>
            </div>
            <h3 className="text-base font-sans font-semibold text-white">
              {item.title}
            </h3>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </motion.div>

    </section>
  );
};

export default Hero;

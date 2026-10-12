import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Layers, TrendingUp } from 'lucide-react';
import { stitchEase, stitchSpring } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';

interface HeroProps {
  mode: 'machine' | 'mind' | 'hybrid';
  onAiraTour?: () => void;
  onOpenScraper: () => void;
  onOpenRoi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ mode, onOpenScraper, onOpenRoi }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[82vh] flex flex-col justify-center py-12">
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (7 cols) */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: stitchEase }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/60 border border-white/[0.08] border-t-white/[0.14]">
            <span
              className={`w-2 h-2 rounded-full ${
                mode === 'mind' ? 'bg-amber-400' : mode === 'hybrid' ? 'bg-cyan-400' : 'bg-emerald-400'
              }`}
            />
            <span className="text-[11px] font-sans text-zinc-300 uppercase tracking-[0.2em] font-semibold">
              {content.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl xl:text-[64px] font-sans font-semibold tracking-[-0.03em] leading-[1.08] text-white text-balance">
            {content.heroHeadline.lead}{' '}
            <span className="text-zinc-200">{content.heroHeadline.emphasis}</span>
            <br />
            {content.heroHeadline.subLead}{' '}
            <span className="theme-accent">{content.heroHeadline.subEmphasis}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl font-sans text-pretty">
            {content.heroDescription}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.a
              href={content.ctaPrimaryHash}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={stitchSpring.snappy}
              className="px-6 py-3 rounded-xl font-sans text-xs font-semibold tracking-wide bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg tactile-btn"
            >
              <span>{content.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href={content.ctaSecondaryHash}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={stitchSpring.snappy}
              className="px-6 py-3 rounded-xl font-sans text-xs font-semibold tracking-wide bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/[0.08] border-t-white/[0.14] text-white transition-colors flex items-center gap-2 tactile-btn"
            >
              <span>{content.ctaSecondary}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column: Mode-Isolated Architecture Panel (5 cols) */}
        <motion.div
          key={`panel-${mode}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: stitchEase }}
          className="lg:col-span-5"
        >
          <div className="tilt-card rounded-2xl p-6 sm:p-7 relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-zinc-400 block">
                  {content.architecturePanel.overline}
                </span>
                <h2 className="text-base font-sans font-semibold text-white mt-0.5">
                  {content.architecturePanel.title}
                </h2>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-1 rounded-md border font-medium ${
                  mode === 'mind'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {content.architecturePanel.statusLabel}
              </span>
            </div>

            <div className="space-y-2.5">
              {content.architecturePanel.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4 text-xs"
                >
                  <span className="font-sans text-zinc-400">{spec.label}</span>
                  <span className="font-mono text-zinc-200 font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              {content.architecturePanel.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenScraper}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-colors flex items-center justify-between group/btn tactile-btn"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 theme-accent" />
                  <span>{mode === 'mind' ? 'Strategy Board' : 'Live Sandbox'}</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover/btn:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={onOpenRoi}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-colors flex items-center justify-between group/btn tactile-btn"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 theme-accent" />
                  <span>{mode === 'mind' ? 'Pipeline Model' : 'Value Model'}</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover/btn:text-white transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* 3-Column Glass Quantitative Proof Bar */}
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
            className="tilt-card rounded-2xl p-6 space-y-2"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-semibold text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] theme-accent">
                Verified Benchmark
              </span>
            </div>
            <h3 className="text-sm font-sans font-semibold text-zinc-100">
              {item.title}
            </h3>
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

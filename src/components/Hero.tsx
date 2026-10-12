import React from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, ArrowUpRight, Zap, TrendingUp } from 'lucide-react';
import { stitchEase, stitchSpring } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';

interface HeroProps {
  mode: 'machine' | 'mind' | 'hybrid';
  onAiraTour: () => void;
  onOpenScraper: () => void;
  onOpenRoi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ mode, onAiraTour, onOpenScraper, onOpenRoi }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[85vh] flex flex-col justify-center">
      
      {/* Top Telemetry Strip */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: stitchEase }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-surface-border/60"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-card border border-surface-border text-[11px] font-mono text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            FLYVANE // TECHNOLOGY, AUTOMATION & STRATEGY
          </span>
          <span className="text-xs font-mono text-neutral-500 hidden md:inline">GLOBAL ARCHITECTURE // ENTERPRISE PIPELINES</span>
        </div>
        <div className="text-xs font-mono text-neutral-400 flex items-center gap-4">
          <span className="text-cyan-400 font-semibold">IITM PRAVARTAK CEH // CYBERSECURITY</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-300">HIGH-THROUGHPUT SYSTEMS</span>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (7 cols) */}
        <motion.div
          key={mode} // Re-animate cleanly on mode switch
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: stitchEase }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                mode === 'mind' ? 'bg-amber-400' : mode === 'hybrid' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <span className="text-neutral-300 uppercase tracking-wider font-semibold">
              {content.badge}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-extrabold tracking-[-0.03em] leading-[1.08] text-white text-balance">
            {content.heroHeadline.lead} <span className="font-serif italic font-normal text-neutral-300 hover:text-cyanAccent transition-colors">{content.heroHeadline.emphasis}</span><br />
            {content.heroHeadline.subLead} <span className="theme-accent font-serif italic font-normal underline decoration-white/20 underline-offset-8">{content.heroHeadline.subEmphasis}</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-2xl font-sans text-pretty">
            {content.heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <motion.a
              href={content.ctaPrimaryHash}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stitchSpring.snappy}
              className="px-6 py-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg hover:shadow-white/10 tactile-btn"
            >
              <Play className="w-4 h-4 fill-black" />
              {content.ctaPrimary}
            </motion.a>
            <motion.button
              onClick={onAiraTour}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={stitchSpring.snappy}
              className="px-6 py-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider bg-surface-card hover:bg-surface-elevated border border-surface-border text-white transition-colors flex items-center gap-2 group tactile-btn"
            >
              <Volume2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Listen to Aira</span>
            </motion.button>
          </div>

          {/* Mode-Specific Credential Counters */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-border/60">
            <div>
              <span className="block text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">{content.telemetry.metric1Val}</span>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.1em]">{content.telemetry.metric1Label}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-display font-bold text-cyan-400 tracking-tight">{content.telemetry.metric2Val}</span>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.1em]">{content.telemetry.metric2Label}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-display font-bold text-emerald-400 tracking-tight">{content.telemetry.metric3Val}</span>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.1em]">{content.telemetry.metric3Label}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Telemetry Tilt Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: stitchEase }}
          className="lg:col-span-5"
        >
          <div className="tilt-card rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">TELEMETRY // AIRA ORBITAL RIG</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 font-semibold">3D ACTIVE</span>
            </div>

            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border font-mono text-xs space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>RUNTIME PROTOCOL:</span>
                  <span className="text-emerald-400 font-semibold">{content.telemetry.runtimeProtocol}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>STRATEGY METHOD:</span>
                  <span className="text-amber-400 font-semibold">{content.telemetry.positioningMethod}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>SECURITY POSTURE:</span>
                  <span className="text-cyan-400 font-semibold">{content.telemetry.securityPosture}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-void border border-surface-border">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Aira Live Companion Status</span>
                <p className="text-xs font-sans text-neutral-200 leading-relaxed">
                  {mode === 'machine' && "Aira is tracking engineering pipelines. Test our headless scraper or run live commands in the terminal below."}
                  {mode === 'mind' && "Aira is analyzing market rhetoric. Enter your marketing copy into the teardown tool to expose cognitive leaks."}
                  {mode === 'hybrid' && "Aira is orchestrating full-stack systems. Check the calculator to verify how software eliminates operational drag."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenScraper}
                  className="p-2.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-neutral-300 hover:text-white transition-colors flex items-center justify-between group/btn"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Run Workbench
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenRoi}
                  className="p-2.5 rounded-lg bg-surface-card hover:bg-surface-elevated border border-surface-border text-xs font-mono text-neutral-300 hover:text-white transition-colors flex items-center justify-between group/btn"
                >
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> ROI Calculator
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;

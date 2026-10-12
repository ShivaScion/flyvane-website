import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { stitchEase, stitchSpring } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';
import { soundEngine } from '../utils/soundEngine';

interface HeroProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const Hero: React.FC<HeroProps> = ({ mode }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section
      id="hero"
      className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[82vh] flex flex-col justify-center py-10"
    >
      {/* Main Split Layout — Left Typography + Right Spatial Viewport for Global Fixed 3D Model */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {mode === 'machine' && (
          <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">
                Engineering & Autonomous Process Infrastructure
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-2">
              Automate the boring.
            </h1>

            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-cyan-400 mb-6">
              Architect the autonomous.
            </h2>

            <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-8">
              We engineer bespoke data extraction pipelines, intelligent worker swarms, and headless systems that replace fragile manual labor with zero-operator reliability.
            </p>

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
                className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-medium tracking-wide bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-zinc-100 transition-all duration-500 ease-out flex items-center gap-2 tactile-btn"
              >
                <span>{content.ctaSecondary}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </motion.a>
            </div>
          </div>
        )}

        {mode === 'mind' && (
          <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">
                Behavioral Strategy & Executive Positioning
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-2">
              Market the brilliant.
            </h1>

            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-amber-400 mb-6">
              Command the authority.
            </h2>

            <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-8">
              Transforming technical complexity into category-defining market authority. We architect founder positioning, high-intent narrative funnels, and enterprise demand engines.
            </p>

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
                className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-medium tracking-wide bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-zinc-100 transition-all duration-500 ease-out flex items-center gap-2 tactile-btn"
              >
                <span>{content.ctaSecondary}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </motion.a>
            </div>
          </div>
        )}

        {mode === 'hybrid' && (
          <div className="flex flex-col items-start z-10 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">
                Full-Spectrum Autonomous Systems & Brand Authority
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05] mb-2">
              Automate the boring.
            </h1>

            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-cyan-400 mb-6">
              Market the brilliant.
            </h2>

            <p className="text-base lg:text-lg font-normal text-zinc-400 leading-relaxed max-w-xl mb-8">
              Flyvane unifies autonomous backend infrastructure with category-defining brand architecture—building companies that operate with machine precision and market dominance.
            </p>

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
                className="px-6 py-3.5 rounded-xl font-sans text-xs sm:text-sm font-medium tracking-wide bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-zinc-100 transition-all duration-500 ease-out flex items-center gap-2 tactile-btn"
              >
                <span>{content.ctaSecondary}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </motion.a>
            </div>
          </div>
        )}

        {/* Right Spatial Viewport: Open window allowing the Global Fixed 3D BackgroundCanvas model to command depth */}
        <div
          aria-hidden="true"
          className="w-full lg:w-[45%] min-h-[380px] sm:min-h-[460px] pointer-events-none relative flex items-end justify-end p-4"
        >
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {mode === 'machine'
              ? 'GLTF 3D · Cybernetic Android Rig'
              : mode === 'mind'
              ? 'GLTF 3D · Anatomical Neural Cortex'
              : 'WebGL 3D · Crystalline Transmission Core'}
          </div>
        </div>
      </div>

      {/* 3-Column Liquid Glass Quantitative Proof Bar (Section 4.2 & 4.3 Master Tokens) */}
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
            className="tilt-card liquid-glass relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-500 ease-out space-y-2.5"
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-gradient-to-b from-white/[0.1] to-transparent opacity-50" />
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

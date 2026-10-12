import React from 'react';
import { motion } from 'framer-motion';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';
import { soundEngine } from '../utils/soundEngine';

interface CaseStudiesProps {
  mode?: 'machine' | 'mind' | 'hybrid';
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ mode = 'machine' }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      
      {/* Capabilities Heading (4-Tier Typographic System) */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-14"
      >
        <span
          className={`text-[11px] font-sans uppercase tracking-[0.2em] block mb-2.5 font-semibold ${
            mode === 'mind' ? 'text-amber-400' : mode === 'hybrid' ? 'text-cyan-400' : 'text-emerald-400'
          }`}
        >
          {mode === 'machine'
            ? 'AUTONOMOUS INFRASTRUCTURE CAPABILITIES'
            : mode === 'mind'
            ? 'EXECUTIVE POSITIONING CAPABILITIES'
            : 'INTEGRATED PRACTICE CAPABILITIES'}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight leading-[1.08] text-balance">
          {content.servicesHeading}
        </h2>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-2xl mt-3 leading-relaxed text-pretty">
          {content.servicesSubheading}
        </p>
      </motion.div>

      {/* 4 Dedicated Mode Capability Cards in Section 2.1 Liquid Glass Master Tokens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.services.map((svc, sIdx) => (
          <motion.div
            key={`${mode}-${sIdx}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: sIdx * 0.08, ease: stitchEase }}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className={`tilt-card liquid-glass bg-white/[0.025] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)] hover:bg-white/[0.045] hover:border-white/[0.18] hover:shadow-[0_24px_56px_0_rgba(0,0,0,0.8),inset_0_1px_2px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between group ${
              mode === 'mind' ? 'liquid-glass-amber' : 'liquid-glass-cyan'
            }`}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-sans text-zinc-300 font-semibold tracking-[0.2em] uppercase">
                  {svc.badge}
                </span>
                <span
                  className={`text-[11px] font-sans font-semibold tracking-wide ${
                    mode === 'mind' ? 'text-amber-400' : mode === 'hybrid' ? 'text-cyan-400' : 'text-emerald-400'
                  }`}
                >
                  {svc.metric}
                </span>
              </div>

              <h3 className="text-2xl font-sans font-medium tracking-normal text-white group-hover:text-zinc-100 transition-colors">
                {svc.title}
              </h3>

              <div className="text-sm sm:text-base font-sans space-y-2.5 pt-1 leading-relaxed">
                <div className="text-zinc-400">
                  <span className="text-rose-400 font-medium">Bottleneck: </span>
                  {svc.problem}
                </div>
                <div className="text-zinc-300">
                  <span
                    className={
                      mode === 'mind'
                        ? 'text-amber-400 font-medium'
                        : mode === 'hybrid'
                        ? 'text-cyan-400 font-medium'
                        : 'text-emerald-400 font-medium'
                    }
                  >
                    Architecture:{' '}
                  </span>
                  {svc.solution}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <span className="text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-[0.2em] block mb-2.5">
                Core Deliverables
              </span>
              <div className="flex flex-wrap gap-1.5">
                {svc.deliverables.map((item, dIdx) => (
                  <span
                    key={dIdx}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] text-[11px] font-sans font-semibold text-zinc-300 border border-white/[0.08]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default CaseStudies;

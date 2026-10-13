import React from 'react';
import { motion } from 'framer-motion';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';

interface CaseStudiesProps {
  mode?: 'machine' | 'mind' | 'hybrid';
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ mode = 'machine' }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      
      {/* Capabilities Heading */}
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
            mode === 'mind' ? 'text-amber-400' : 'text-emerald-400'
          }`}
        >
          {mode === 'machine'
            ? 'AUTONOMOUS INFRASTRUCTURE CAPABILITIES'
            : mode === 'mind'
            ? 'EXECUTIVE POSITIONING CAPABILITIES'
            : 'INTEGRATED PRACTICE CAPABILITIES'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-tight text-balance">
          {content.servicesHeading}
        </h2>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-2xl mt-3 leading-relaxed text-pretty">
          {content.servicesSubheading}
        </p>
      </motion.div>

      {/* 4 Dedicated Mode Capability Cards in Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.services.map((svc, sIdx) => (
          <motion.div
            key={`${mode}-${sIdx}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: sIdx * 0.08, ease: stitchEase }}
            whileHover={{ y: -3 }}
            className={`tilt-card backdrop-blur-2xl bg-white/[0.035] border border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18)] hover:bg-white/[0.06] hover:border-white/[0.22] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.65),inset_0_1px_2px_0_rgba(255,255,255,0.3)] transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between group ${
              mode === 'mind' ? 'liquid-glass-amber' : 'liquid-glass-cyan'
            }`}
          >
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-sans text-zinc-300 font-semibold tracking-[0.15em] uppercase">
                  {svc.badge}
                </span>
                <span
                  className={`text-xs font-mono font-medium ${
                    mode === 'mind' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {svc.metric}
                </span>
              </div>

              <h3 className="text-xl font-sans font-semibold text-white group-hover:text-zinc-100 transition-colors">
                {svc.title}
              </h3>

              <div className="text-xs font-sans space-y-2.5 pt-1 leading-relaxed">
                <div className="text-zinc-400">
                  <span className="text-rose-400 font-semibold">Bottleneck: </span>
                  {svc.problem}
                </div>
                <div className="text-zinc-300">
                  <span className={mode === 'mind' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                    Architecture:{' '}
                  </span>
                  {svc.solution}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <span className="text-[10px] font-sans font-semibold text-zinc-500 uppercase tracking-[0.16em] block mb-2">
                Core Deliverables
              </span>
              <div className="flex flex-wrap gap-1.5">
                {svc.deliverables.map((item, dIdx) => (
                  <span
                    key={dIdx}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] text-[11px] font-sans text-zinc-300 border border-white/[0.06]"
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

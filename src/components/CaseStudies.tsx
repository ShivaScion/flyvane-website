import React from 'react';
import { motion } from 'framer-motion';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT, ModeConfig, ModeService } from '../data/modeContent';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

interface CaseStudiesProps {
  mode?: 'machine' | 'mind' | 'hybrid';
  contentOverride?: ModeConfig;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ mode = 'machine', contentOverride }) => {
  const content = contentOverride || MODE_CONTENT[mode];

  return (
    <section id="services" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      
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

      {/* 4 Dedicated Mode Capability Cards in InteractiveTiltWrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.services.map((svc: ModeService, sIdx: number) => (
          <InteractiveTiltWrapper
            key={`${mode}-${sIdx}`}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className="p-6 sm:p-8 space-y-5 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
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
                {svc.deliverables.map((item: string, dIdx: number) => (
                  <span
                    key={dIdx}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] text-[11px] font-sans font-semibold text-zinc-300 border border-white/[0.08]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </InteractiveTiltWrapper>
        ))}
      </div>

    </section>
  );
};

export default CaseStudies;

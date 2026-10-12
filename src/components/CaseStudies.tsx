import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Activity, Sparkles } from 'lucide-react';
import { stitchEase } from '../utils/motion';
import { MODE_CONTENT } from '../data/modeContent';

interface CaseStudiesProps {
  mode?: 'machine' | 'mind' | 'hybrid';
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ mode = 'machine' }) => {
  const content = MODE_CONTENT[mode];

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-surface-border">
      
      {/* Services Heading */}
      <motion.div
        key={mode} // Re-animate on mode switch
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-16"
      >
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-cyan-400 block mb-2 font-semibold">
          // {mode.toUpperCase()} SERVICE ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight text-balance">
          {content.servicesHeading}
        </h2>
        <p className="text-sm font-mono text-neutral-400 max-w-2xl mt-3 text-pretty">
          {content.servicesSubheading}
        </p>
      </motion.div>

      {/* 4 Dedicated Mode Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {content.services.map((svc, sIdx) => (
          <motion.div
            key={sIdx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: sIdx * 0.08, ease: stitchEase }}
            whileHover={{ y: -3 }}
            className="tilt-card rounded-2xl p-7 space-y-4 bg-surface-card border border-surface-border hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-surface-elevated border border-surface-border text-[10px] font-mono text-neutral-300 font-semibold tracking-wider">
                  {svc.badge}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {svc.metric}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                {svc.title}
              </h3>

              <div className="text-xs font-mono space-y-2 pt-1">
                <div className="text-neutral-400">
                  <span className="text-red-400/90 font-semibold">Problem: </span>
                  {svc.problem}
                </div>
                <div className="text-neutral-300">
                  <span className="text-emerald-400 font-semibold">Solution: </span>
                  {svc.solution}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border/60">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1.5">Deliverables:</span>
              <div className="flex flex-wrap gap-1.5">
                {svc.deliverables.map((item, dIdx) => (
                  <span
                    key={dIdx}
                    className="px-2 py-0.5 rounded bg-surface-elevated text-[10px] font-mono text-neutral-300 border border-surface-border"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Studies Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-12 pt-8 border-t border-surface-border/60"
      >
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-neutral-400 block mb-2">// PROVEN CASE STUDIES</span>
        <h3 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight text-balance">
          Selected <span className="font-serif italic font-normal text-neutral-400">Production</span> Deployments
        </h3>
      </motion.div>

      {/* Mode-Specific Case Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {content.caseStudyScope.map((cs, cIdx) => (
          <motion.div
            key={cIdx}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: cIdx * 0.1, ease: stitchEase }}
            whileHover={{ y: -4 }}
            className={`${
              cIdx === 0 ? 'lg:col-span-7' : 'lg:col-span-5'
            } tilt-card rounded-2xl p-8 space-y-6 flex flex-col justify-between group`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 ${
                  mode === 'mind'
                    ? 'bg-amber-950/60 border border-amber-800 text-amber-400'
                    : mode === 'hybrid'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                    : 'bg-cyan-950/60 border border-cyan-800 text-cyan-400'
                }`}>
                  {mode === 'mind' ? <Sparkles className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                  {cs.tag}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-surface-border text-neutral-400 uppercase tracking-wider">
                  {cs.nature}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>Model Scope: {cs.client}</span>
              </div>

              <h4 className="text-2xl font-display font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                {cs.title}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
                <div className="bg-surface-elevated p-3 rounded-lg border border-surface-border">
                  <span className="text-neutral-500 block mb-1">BOTTLENECK</span>
                  <span className="text-neutral-300 leading-tight block">{cs.bottleneck}</span>
                </div>
                <div className="bg-surface-elevated p-3 rounded-lg border border-surface-border">
                  <span className="text-cyan-400 block mb-1">SYSTEM</span>
                  <span className="text-neutral-300 leading-tight block">{cs.system}</span>
                </div>
                <div className="bg-surface-elevated p-3 rounded-lg border border-surface-border">
                  <span className="text-emerald-400 block mb-1">METRIC</span>
                  <span className="text-white font-bold leading-tight block">{cs.metric}</span>
                </div>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed font-sans text-pretty">
                {cs.description}
              </p>
            </div>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs font-mono">
              <div className="flex flex-wrap gap-1 text-[11px] text-neutral-500">
                {cs.architectureTags.join(' • ')}
              </div>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                Verified <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default CaseStudies;

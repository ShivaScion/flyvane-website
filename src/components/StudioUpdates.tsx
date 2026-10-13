import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import { stitchEase } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

interface StudioUpdatesProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const StudioUpdates: React.FC<StudioUpdatesProps> = ({ mode }) => {
  const machineUpdates = [
    {
      date: "OCTOBER 2026",
      category: "AUTONOMOUS INFRASTRUCTURE",
      title: "Eliminating Fragile Cron Jobs with Deterministic LangGraph State Machines",
      summary:
        "Why linear scripts fail under production load, and how checkpointed state graphs with dead-letter recovery achieve 99.4% extraction precision.",
      readTime: "4 min technical note"
    },
    {
      date: "SEPTEMBER 2026",
      category: "DATA EXTRACTION",
      title: "Pydantic V2 Schema Enforcement at the Edge of Headless Browser Clusters",
      summary:
        "Validating unstructured DOM payloads before database ingestion to prevent silent downstream data corruption across enterprise pipelines.",
      readTime: "5 min architecture brief"
    },
    {
      date: "AUGUST 2026",
      category: "WORKER SWARMS",
      title: "Reducing Manual Document Reconciliation Cycles by 8x with AsyncIO Pools",
      summary:
        "Architectural breakdown of high-concurrency worker queues replacing 40+ hours of weekly human triage.",
      readTime: "3 min case note"
    }
  ];

  const mindUpdates = [
    {
      date: "OCTOBER 2026",
      category: "CATEGORY DESIGN",
      title: "Why Feature-Led Messaging Forces Enterprise Vendors into Price Wars",
      summary:
        "How high-contrast category framing and quantified cost-of-inaction narratives establish immediate pricing power with C-suite buyers.",
      readTime: "4 min advisory brief"
    },
    {
      date: "SEPTEMBER 2026",
      category: "EXECUTIVE AUTHORITY",
      title: "Engineering 4.2x Organic Executive Reach Without Generic Content Fluff",
      summary:
        "Extracting proprietary founder observations and structuring them into repeatable omnichannel syndication that drives qualified inbound intent.",
      readTime: "5 min strategy note"
    },
    {
      date: "AUGUST 2026",
      category: "DEMAND VALIDATION",
      title: "Designing Self-Qualifying Value Models for High-Ticket B2B Retainers",
      summary:
        "How interactive pipeline estimators pre-validate 82% of buyer intent before the initial partner discovery conversation.",
      readTime: "3 min conversion brief"
    }
  ];

  const posts = mode === 'mind' ? mindUpdates : machineUpdates;

  return (
    <section id="updates" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
      >
        <div>
          <span
            className={`text-[11px] font-sans uppercase tracking-[0.2em] block mb-2.5 font-semibold ${
              mode === 'mind' ? 'text-amber-400' : 'text-cyan-400'
            }`}
          >
            STUDIO DISPATCHES &amp; LINKEDIN INSIGHTS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-white tracking-tight leading-[1.15] text-balance">
            Recent Studio Updates
          </h2>
        </div>

        <a
          href="https://www.linkedin.com/company/flyvane"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-xs font-sans font-medium text-zinc-200 hover:text-white transition-all duration-500 ease-out self-start sm:self-auto"
        >
          <Linkedin className="w-3.5 h-3.5 text-sky-400" />
          <span>Follow Flyvane on LinkedIn</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <InteractiveTiltWrapper
            key={`${mode}-update-${idx}`}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className="p-6 sm:p-8 flex flex-col justify-between space-y-5 group relative overflow-hidden"
          >
            <a
              href="https://www.linkedin.com/company/flyvane"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between h-full space-y-5"
            >
              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-zinc-400">
                  <span className={mode === 'mind' ? 'text-amber-400' : 'text-emerald-400'}>
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-sans font-semibold tracking-tight text-white group-hover:text-zinc-200 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-zinc-300">
                <span className="text-[11px] font-semibold tracking-wide text-zinc-500">{post.readTime}</span>
                <span className="flex items-center gap-1 font-medium group-hover:text-white transition-colors">
                  <span>Read on LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </InteractiveTiltWrapper>
        ))}
      </div>
    </section>
  );
};

export default StudioUpdates;

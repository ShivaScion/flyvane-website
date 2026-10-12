import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  FileText,
  Target,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { stitchEase } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';

export const MindStrategyBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'positioning' | 'narrative' | 'campaign'>('positioning');

  const frameworks = {
    positioning: {
      title: "Category Framing & Positioning Matrix",
      badge: "DIFFERENTIATION ARCHITECTURE",
      summary: "How Flyvane structures high-contrast positioning to elevate clients out of commoditized price wars.",
      pillars: [
        {
          label: "Current State (The Commoditized Trap)",
          description: "Competing on incremental features, responding to RFP price wars, and sounding indistinguishable from five other vendors.",
          tone: "Vulnerable to fee compression"
        },
        {
          label: "Category Diagnosis",
          description: "Exposing the fundamental flaw in the standard industry consensus and revealing why traditional approaches create hidden costs.",
          tone: "Intellectual authority"
        },
        {
          label: "High-Contrast Position",
          description: "Framing your business around a singular high-leverage outcome that makes legacy alternatives appear obsolete.",
          tone: "Premium pricing power"
        }
      ]
    },
    narrative: {
      title: "Loss-Aversion Messaging & Narrative Architecture",
      badge: "PSYCHOLOGICAL COMMUNICATION",
      summary: "Transforming vague feature lists into urgent commercial imperatives structured around the cost of inaction.",
      pillars: [
        {
          label: "Quantified Cost of Inaction",
          description: "Decision-makers rarely act on minor potential gains; they act decisively to eliminate compounded operational hemorrhage.",
          tone: "Measurable urgency"
        },
        {
          label: "Zero-Jargon Transparency",
          description: "Purging generic buzzwords ('cutting-edge', 'innovative', 'seamless') in favor of plainspoken, precise commercial language.",
          tone: "Earned credibility"
        },
        {
          label: "Executive Proof Architecture",
          description: "Structuring claims with transparent formulas, verified technical boundaries, and documented return horizons.",
          tone: "Reduced decision risk"
        }
      ]
    },
    campaign: {
      title: "Structured Editorial & Thought Leadership Program",
      badge: "DISTRIBUTION METHODOLOGY",
      summary: "Turning deep subject-matter expertise into a predictable engine of inbound executive conversations.",
      pillars: [
        {
          label: "Proprietary Insight Extraction",
          description: "Interviewing technical leaders to extract raw, counter-intuitive observations from real client projects.",
          tone: "Uncopyable substance"
        },
        {
          label: "Multi-Tier Distribution Cadence",
          description: "Translating deep technical insights into executive summaries, industry teardowns, and actionable case frameworks.",
          tone: "Consistent visibility"
        },
        {
          label: "Inbound Conversion Calibration",
          description: "Ensuring every published piece connects seamlessly to structured intake briefs and qualification paths.",
          tone: "Commercial pipeline velocity"
        }
      ]
    }
  };

  const current = frameworks[activeTab];

  return (
    <section id="strategy-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-surface-border">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-12"
      >
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-amber-400 block mb-2 font-semibold">
          // STRATEGIC METHODOLOGY & BRAND ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight text-balance">
          The Flyvane Strategy Board
        </h2>
        <p className="text-sm font-mono text-neutral-400 max-w-2xl mt-3 text-pretty">
          A visual walkthrough of our strategic marketing methodology. We build commercial positioning designed for senior buyers, not developer sandboxes.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => {
            setActiveTab('positioning');
            soundEngine.playClick(0.06);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 tactile-btn ${
            activeTab === 'positioning'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/60 shadow-lg'
              : 'bg-surface-card text-neutral-400 hover:text-white border border-surface-border'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Category Positioning</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('narrative');
            soundEngine.playClick(0.06);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 tactile-btn ${
            activeTab === 'narrative'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/60 shadow-lg'
              : 'bg-surface-card text-neutral-400 hover:text-white border border-surface-border'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Loss-Aversion Narrative</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('campaign');
            soundEngine.playClick(0.06);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 tactile-btn ${
            activeTab === 'campaign'
              ? 'bg-amber-950/70 text-amber-300 border border-amber-600/60 shadow-lg'
              : 'bg-surface-card text-neutral-400 hover:text-white border border-surface-border'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Editorial Program</span>
        </button>
      </div>

      {/* Board Presentation Surface */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: stitchEase }}
        className="tilt-card rounded-2xl p-7 sm:p-10 bg-gradient-to-br from-[#120e07] via-[#090806] to-[#040406] border border-amber-500/20 shadow-2xl space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-400 block mb-1">
              {current.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {current.title}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-xs font-mono text-amber-300">
            STRATEGY PILLAR
          </span>
        </div>

        <p className="text-sm font-sans text-neutral-300 max-w-3xl leading-relaxed">
          {current.summary}
        </p>

        {/* 3 Step Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {current.pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-black/40 border border-amber-500/15 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-400 flex items-center justify-center font-bold">
                  0{idx + 1}
                </span>
                <h4 className="text-base font-display font-bold text-white leading-snug">
                  {p.label}
                </h4>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{p.tone}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Footer */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="text-neutral-300">
            <span className="text-amber-400 font-bold">Flyvane Standard: </span>
            Strategy is never delivered as an abstract slide deck. Every recommendation is written as actionable positioning and validated against commercial objectives.
          </div>
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Request Brand Strategy Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>

    </section>
  );
};

export default MindStrategyBoard;

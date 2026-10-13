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
      summary: "How Flyvane structures high-contrast positioning to elevate enterprise organizations out of commoditized price wars.",
      pillars: [
        {
          label: "Current State (The Commoditized Trap)",
          description: "Competing on incremental features, responding to RFP price wars, and sounding indistinguishable from legacy vendors.",
          tone: "Vulnerable to fee compression"
        },
        {
          label: "Category Diagnosis",
          description: "Exposing the fundamental flaw in the standard industry consensus and revealing why conventional approaches create hidden costs.",
          tone: "Intellectual authority"
        },
        {
          label: "High-Contrast Position",
          description: "Framing your organization around a singular high-leverage outcome that makes legacy alternatives appear obsolete.",
          tone: "Premium pricing power"
        }
      ]
    },
    narrative: {
      title: "Loss-Aversion Messaging & Narrative Architecture",
      badge: "EXECUTIVE COMMUNICATION",
      summary: "Transforming complex capabilities into urgent commercial imperatives structured around the quantified cost of inaction.",
      pillars: [
        {
          label: "Quantified Cost of Inaction",
          description: "Decision-makers rarely act on minor potential gains; they act decisively to eliminate compounded commercial leakage.",
          tone: "Measurable urgency"
        },
        {
          label: "Zero-Jargon Transparency",
          description: "Purging generic buzzwords in favor of plainspoken, high-precision commercial language tailored for C-suite buyers.",
          tone: "Earned credibility"
        },
        {
          label: "Executive Proof Architecture",
          description: "Structuring claims with transparent commercial models, verified market benchmarks, and documented return horizons.",
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
          description: "Interviewing leadership teams to extract counter-intuitive market observations and authoritative industry perspectives.",
          tone: "Uncopyable substance"
        },
        {
          label: "Multi-Tier Distribution Cadence",
          description: "Translating core thesis statements into executive briefs, industry position papers, and high-intent social syndication.",
          tone: "Consistent visibility"
        },
        {
          label: "Inbound Conversion Calibration",
          description: "Ensuring every published piece connects seamlessly to structured advisory intake briefs and qualification paths.",
          tone: "Commercial pipeline velocity"
        }
      ]
    }
  };

  const current = frameworks[activeTab];

  return (
    <section id="strategy-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.08]">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-12"
      >
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-amber-400 block mb-2.5 font-semibold">
          STRATEGIC METHODOLOGY & EXECUTIVE ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-tight text-balance">
          The Flyvane Strategy Board
        </h2>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-2xl mt-3 leading-relaxed text-pretty">
          A structured walkthrough of our executive positioning methodology. We architect category authority and demand frameworks engineered for senior decision-makers.
        </p>
      </motion.div>

      {/* Segmented Pillar Selector in Liquid Glass */}
      <div className="flex flex-wrap items-center gap-2.5 mb-8">
        <button
          type="button"
          onMouseEnter={() => soundEngine.playHoverHum()}
          onClick={() => {
            setActiveTab('positioning');
            soundEngine.playClick(0.06);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-sans font-medium transition-all duration-500 ease-out flex items-center gap-2 tactile-btn ${
            activeTab === 'positioning'
              ? 'backdrop-blur-2xl bg-amber-500/20 text-white border border-amber-400/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.22)]'
              : 'backdrop-blur-2xl bg-white/[0.035] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/[0.09]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Category Positioning</span>
        </button>

        <button
          type="button"
          onMouseEnter={() => soundEngine.playHoverHum()}
          onClick={() => {
            setActiveTab('narrative');
            soundEngine.playClick(0.06);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-sans font-medium transition-all duration-500 ease-out flex items-center gap-2 tactile-btn ${
            activeTab === 'narrative'
              ? 'backdrop-blur-2xl bg-amber-500/20 text-white border border-amber-400/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.22)]'
              : 'backdrop-blur-2xl bg-white/[0.035] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/[0.09]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Loss-Aversion Narrative</span>
        </button>

        <button
          type="button"
          onMouseEnter={() => soundEngine.playHoverHum()}
          onClick={() => {
            setActiveTab('campaign');
            soundEngine.playClick(0.06);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-sans font-medium transition-all duration-500 ease-out flex items-center gap-2 tactile-btn ${
            activeTab === 'campaign'
              ? 'backdrop-blur-2xl bg-amber-500/20 text-white border border-amber-400/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.22)]'
              : 'backdrop-blur-2xl bg-white/[0.035] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/[0.09]'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Editorial Authority Program</span>
        </button>
      </div>

      {/* Board Presentation Surface in Liquid Glass */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: stitchEase }}
        className="tilt-card liquid-glass-amber backdrop-blur-2xl bg-white/[0.035] border border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18)] hover:bg-white/[0.06] hover:border-white/[0.22] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.65),inset_0_1px_2px_0_rgba(255,255,255,0.3)] transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.09]">
          <div>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-amber-400 block mb-1">
              {current.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-sans font-semibold text-white">
              {current.title}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-sans font-medium text-amber-300">
            Strategy Pillar
          </span>
        </div>

        <p className="text-sm sm:text-base font-sans text-zinc-300 max-w-3xl leading-relaxed">
          {current.summary}
        </p>

        {/* 3 Step Editorial Cards in Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {current.pillars.map((p, idx) => (
            <div
              key={idx}
              className="liquid-glass-amber backdrop-blur-2xl bg-white/[0.035] border border-white/[0.09] shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18)] hover:bg-white/[0.06] hover:border-white/[0.22] transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-400 flex items-center justify-center font-semibold">
                  0{idx + 1}
                </span>
                <h4 className="text-base font-sans font-semibold text-white leading-snug">
                  {p.label}
                </h4>
                <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-sans font-medium text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{p.tone}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Footer */}
        <div className="p-5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
          <div className="text-zinc-300 leading-relaxed">
            <span className="text-amber-400 font-semibold">Flyvane Advisory Standard: </span>
            Strategy is never delivered as an abstract slide deck. Every recommendation is architected as actionable market positioning and validated against commercial pipeline objectives.
          </div>
          <a
            href="#contact"
            className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-sans font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Request Positioning Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>

    </section>
  );
};

export default MindStrategyBoard;

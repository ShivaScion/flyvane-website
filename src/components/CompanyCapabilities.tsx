import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Lock,
  Activity,
  Compass,
  Share2,
  Target
} from 'lucide-react';
import { stitchEase } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

interface CompanyCapabilitiesProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const CompanyCapabilities: React.FC<CompanyCapabilitiesProps> = ({ mode }) => {
  const positioningStandards = [
    {
      icon: <Compass className="w-5 h-5 text-amber-400" />,
      badge: "COGNITIVE VELOCITY",
      title: "Hook Retention Benchmarks",
      metric: "Zero Jargon Penalty",
      description:
        "Calibrating opening thesis statements and executive headlines for immediate comprehension. Every claim is tested against cognitive velocity standards to eliminate vendor fatigue within the first three seconds of buyer attention.",
      criteria: [
        "High-Contrast Problem Framing",
        "Zero Empty Buzzword Tolerance",
        "Immediate Economic Relevance"
      ]
    },
    {
      icon: <Share2 className="w-5 h-5 text-violet-400" />,
      badge: "EXECUTIVE SYNDICATION",
      title: "Narrative Distribution Protocols",
      metric: "Omnichannel Authority",
      description:
        "Structuring founder and partner insights into repeatable omnichannel distribution. Proprietary observations are distilled into position papers, executive briefs, and high-intent social cadences.",
      criteria: [
        "Multi-Tier Editorial Cadence",
        "Subject-Matter Extraction",
        "Consistent Market Presence"
      ]
    },
    {
      icon: <Target className="w-5 h-5 text-amber-400" />,
      badge: "CONVERSION ARCHITECTURE",
      title: "Demand Validation Architecture",
      metric: "Friction-Free Qualification",
      description:
        "Connecting thought leadership directly to commercial pipeline. Every narrative asset routes senior decision-makers toward transparent value models and structured advisory intake.",
      criteria: [
        "Pre-Discovery Intent Validation",
        "Self-Qualifying Value Models",
        "Direct Partner Intake Routing"
      ]
    }
  ];

  const guarantees = [
    {
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      badge: "STATE INTEGRITY",
      title: "Idempotent Execution",
      metric: "Zero Duplicate Side-Effects",
      description:
        "Task consumers engineered with deterministic state keys, dead-letter persistence, and automated checkpoint recovery so interrupted runs resume cleanly without data duplication.",
      specs: ["Deterministic Task Keys", "Dead-Letter Queue Replay", "Atomic State Transitions"]
    },
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      badge: "DEFENSIVE SECURITY",
      title: "TLS 1.3 Vaults",
      metric: "AES-256 & Secret Isolation",
      description:
        "Every autonomous pipeline enforces strict credential isolation, encrypted transport, zero hardcoded tokens, and scoped least-privilege service execution.",
      specs: ["Isolated Environment Vaults", "End-to-End TLS 1.3 Transit", "Scoped IAM Execution Roles"]
    },
    {
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      badge: "OBSERVABILITY",
      title: "Structured Tracing",
      metric: "100% Run Auditability",
      description:
        "Comprehensive execution logging across every worker step, schema validation gate, and external API call, providing instant root-cause visibility and SLA verification.",
      specs: ["Pydantic Schema Enforcement", "Per-Step Latency Metrics", "Automated Anomaly Alerts"]
    }
  ];

  const renderGuarantees = (isHybrid = false) => (
    <div className="space-y-6">
      {isHybrid && (
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
              PART 01
            </span>
            <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
              Systems Engineering &amp; Fault Tolerance (The Machine)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">PRODUCTION SLA</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guarantees.map((g, idx) => (
          <InteractiveTiltWrapper
            key={idx}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className="p-6 sm:p-8 space-y-5 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  {g.icon}
                </div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  {g.metric}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                  {g.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-sans font-semibold tracking-tight text-white">
                  {g.title}
                </h3>
              </div>

              <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                {g.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              {g.specs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2 text-xs font-sans text-zinc-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </InteractiveTiltWrapper>
        ))}
      </div>
    </div>
  );

  const renderPositioningStandards = (isHybrid = false) => (
    <div className="space-y-6">
      {isHybrid && (
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
              PART 02
            </span>
            <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
              Positioning Standards &amp; Commercial Protocols (The Mind)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">AUTHORITY CRITERIA</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {positioningStandards.map((item, idx) => (
          <InteractiveTiltWrapper
            key={idx}
            onMouseEnter={() => soundEngine.playHoverHum()}
            className="p-6 sm:p-8 space-y-5 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-amber-400 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                  {item.metric}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                  {item.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-sans font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm font-sans text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2 relative z-10">
              {item.criteria.map((c, cIdx) => (
                <div key={cIdx} className="flex items-center gap-2 text-xs font-sans text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </InteractiveTiltWrapper>
        ))}
      </div>
    </div>
  );

  return (
    <section id="capabilities" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-14"
      >
        <span
          className={`text-[11px] font-sans uppercase tracking-[0.2em] block mb-2.5 font-semibold ${
            mode === 'mind'
              ? 'text-amber-400'
              : mode === 'hybrid'
                ? 'text-cyan-400'
                : 'text-cyan-400'
          }`}
        >
          {mode === 'mind'
            ? 'AUTHORITY STANDARDS & COMMERCIAL PROTOCOLS'
            : mode === 'hybrid'
              ? 'THE DUAL PRACTICE: SYSTEMS RIGOR & MARKET AUTHORITY'
              : 'PRODUCTION RELIABILITY & SECURITY STANDARDS'}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-white tracking-tight leading-[1.15] text-balance">
          {mode === 'mind'
            ? 'Positioning Standards & Authority Frameworks'
            : mode === 'hybrid'
              ? 'Two Complementary Standards: Engineering Rigor & Commercial Clarity'
              : 'Architecture Guarantees & Fault Tolerance'}
        </h2>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-2xl mt-3 leading-relaxed text-pretty">
          {mode === 'mind'
            ? 'Every CrystalSteed advisory engagement adheres to strict commercial clarity benchmarks designed to command executive attention and accelerate deal qualification.'
            : mode === 'hybrid'
              ? 'CrystalSteed bridges two critical operational pillars: fault-tolerant backend software infrastructure and category-defining commercial authority frameworks.'
              : 'CrystalSteed engineers production-grade autonomous infrastructure designed for continuous operation, strict schema integrity, and defensive security.'}
        </p>
      </motion.div>

      {mode === 'machine' && renderGuarantees(false)}
      {mode === 'mind' && renderPositioningStandards(false)}
      {mode === 'hybrid' && (
        <div className="space-y-16">
          {renderGuarantees(true)}
          {renderPositioningStandards(true)}
        </div>
      )}
    </section>
  );
};

export default CompanyCapabilities;

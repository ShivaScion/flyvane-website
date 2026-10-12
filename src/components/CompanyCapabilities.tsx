import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Cpu,
  Terminal,
  CheckCircle2,
  Lock,
  Workflow
} from 'lucide-react';
import { stitchEase } from '../utils/motion';

interface CompanyCapabilitiesProps {
  mode: 'machine' | 'mind' | 'hybrid';
}

export const CompanyCapabilities: React.FC<CompanyCapabilitiesProps> = ({ mode: _mode }) => {
  const capabilities = [
    {
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      category: "CORE RUNTIME & HEADLESS INFRASTRUCTURE",
      title: "Fault-Tolerant Python & Distributed Scraper Fleets",
      description:
        "High-concurrency AsyncIO microservices powering distributed headless browser clusters (Playwright, Crawl4AI, Chromium). Integrated with residential proxy rotation, canvas anti-fingerprinting, and strict Pydantic JSON schema normalization.",
      badges: ["Python 3.12", "Playwright Async", "Crawl4AI", "Pydantic V2", "Redis Streams"]
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      category: "AUTONOMOUS WORKER AGENTS & ORCHESTRATION",
      title: "Deterministic State Machines & Multi-Agent Swarms",
      description:
        "Robust AI agent frameworks built with LangGraph and Celery task queues. Designed with strict guardrails, zero-hallucination validation loops, failure auto-recovery, and seamless human-in-the-loop review queues.",
      badges: ["LangGraph", "Celery", "FastAPI", "RabbitMQ", "PostgreSQL"]
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      category: "ENTERPRISE SECURITY & COMPLIANCE HARDENING",
      title: "IITM Pravartak CEH Certified Security Hardening",
      description:
        "Every deployed automation pipeline undergoes rigorous penetration testing and vulnerability auditing. Architected with end-to-end data encryption (AES-256 at rest, TLS 1.3 in transit), strict secret vault segregation, and zero credential hardcoding.",
      badges: ["CEH Certified", "SOC 2 Ready", "AES-256", "TLS 1.3", "Vault KMS"]
    },
    {
      icon: <Workflow className="w-5 h-5 text-purple-400" />,
      category: "HIGH-YIELD BEHAVIORAL SYSTEMS & CONVERSION",
      title: "Psychological Architecture & Distribution Engines",
      description:
        "Turning operational engineering into commercial leverage. We design high-converting value architectures, loss-aversion positioning frameworks, and automated multi-channel distribution systems that convert enterprise attention into retained revenue.",
      badges: ["Loss-Aversion Framing", "Category Architecture", "Authority Funnels", "Conversion Telemetry"]
    }
  ];

  const standards = [
    {
      title: "99.98% System Availability SLA",
      detail: "Multi-region failover and automatic cluster redeployment on worker degradation."
    },
    {
      title: "Zero-Data-Loss Architecture",
      detail: "Idempotent queue consumers with dead-letter storage and automated replay capabilities."
    },
    {
      title: "Sub-Second Telemetry & Auditing",
      detail: "Full structured logging and distributed tracing across every autonomous execution cycle."
    },
    {
      title: "Dedicated Systems Sentry",
      detail: "Continuous monitoring for breaking target website DOM changes, proxy health, and API drift."
    }
  ];

  return (
    <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-surface-border">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-16"
      >
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-neutral-400 block mb-2 font-semibold">
          // STUDIO CAPABILITIES & ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight text-balance">
          Enterprise Systems & <span className="font-serif italic font-normal text-neutral-400">Engineering Standards</span>
        </h2>
        <p className="text-sm font-mono text-neutral-400 max-w-2xl mt-3 text-pretty">
          Flyvane operates at the intersection of fault-tolerant software engineering and strategic distribution architecture. We do not build throwaway scripts; we build autonomous operational engines.
        </p>
      </motion.div>

      {/* Capabilities 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {capabilities.map((cap, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: stitchEase }}
            whileHover={{ y: -3 }}
            className="tilt-card rounded-2xl p-7 space-y-5 bg-surface-card border border-surface-border hover:border-cyan-500/30 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center group-hover:scale-105 transition-transform">
                  {cap.icon}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  {cap.category}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                {cap.title}
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans text-pretty">
                {cap.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/60">
              {cap.badges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="px-2.5 py-1 rounded-md bg-surface-elevated border border-surface-border text-[10px] font-mono text-neutral-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Standards Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="tilt-card rounded-2xl p-6 sm:p-8 bg-void border border-surface-border"
      >
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-border">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            OPERATIONAL GUARANTEES & PRODUCTION PROTOCOLS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          {standards.map((std, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{std.title}</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                {std.detail}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
};

export default CompanyCapabilities;

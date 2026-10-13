import { useState } from 'react';
import { ArrowLeft, Shield, FileCheck, Lock, Terminal, Share2, Check } from 'lucide-react';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';
import { HeadSEO } from './HeadSEO';

interface TermsPageProps {
  onNavigateHome: () => void;
}

export function TermsPage({ onNavigateHome }: TermsPageProps) {
  const [copied, setCopied] = useState(false);

  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Autonomous Systems Service Terms & Engineering Governance',
    description: 'Review the autonomous systems service terms, AI automation governance protocols, and engineering SLA architecture governing all Flyvane client engagements.',
    url: 'https://flyvane.com/terms',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Studio',
          item: 'https://flyvane.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Terms & Governance',
          item: 'https://flyvane.com/terms'
        }
      ]
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sections = [
    {
      id: '01',
      title: 'Architectural Scope & Advisory Mandate',
      badge: 'MANDATE & DELIVERABLES',
      content:
        'Flyvane operates as a specialized Systems Engineering and Behavioral Strategy practice founded by Ansh Rudra. All engagements encompass bespoke autonomous infrastructure, distributed extraction pipelines, deterministic multi-agent swarms, and executive brand positioning. Our mandate is rooted in deterministic engineering: we build resilient production systems that eliminate repetitive operational friction and replace fragile manual workflows with verifiable machine execution.',
    },
    {
      id: '02',
      title: 'Data Sovereignty & Absolute Client IP Ownership',
      badge: 'INTELLECTUAL PROPERTY',
      content:
        'Clients retain 100% unconditional ownership of all proprietary code, extraction scrapers, database schemas, model orchestration graphs, and datasets generated during the engagement. Flyvane asserts zero vendor lock-in. We do not license proprietary black-box wrappers: all infrastructure is deployed directly into client-controlled cloud environments (AWS, GCP, Supabase, Vercel). Crucially, client data is strictly quarantined: we enforce cryptographic isolation and never train public machine learning models on client confidential records.',
    },
    {
      id: '03',
      title: 'Deterministic Reliability & Performance Benchmarks',
      badge: 'SERVICE LEVEL STANDARDS',
      content:
        'Autonomous systems engineered by Flyvane target strict engineering benchmarks: 99.4%+ schema validation accuracy, sub-second webhook ingestion latency, and zero-loss state recovery through idempotent checkpointing. While external third-party APIs and target websites may alter structures dynamically, our systems incorporate automated backpressure throttles, residential proxy rotations, and dead-letter queues to isolate anomalies before they impact core financial or operational databases.',
    },
    {
      id: '04',
      title: 'Security Architecture & Isolated Secret Vaults',
      badge: 'CRYPTOGRAPHIC SECURITY',
      content:
        'All client credentials, API tokens, database connections, and session hashes must be stored exclusively within encrypted environment secret managers. Hardcoded secrets are strictly prohibited. In-transit traffic enforces TLS 1.3 encryption, and administrative panels are governed by dual-channel Two-Factor Authentication (2FA) with cryptographic OTP dispatch. Ephemeral sandbox environments operate in isolated subnets with least-privilege role boundaries.',
    },
    {
      id: '05',
      title: 'Commercial Arbitrage, Retainers & Engagements',
      badge: 'COMMERCIAL TERMS',
      content:
        'Advisory and engineering retainers are billed on monthly or quarterly schedules as outlined in the customized enterprise brief. Pricing is calibrated against quantified labor-hour savings and economic arbitrage rather than subjective hourly billing. Retainers include continuous proactive maintenance, pipeline refactoring, and weekly technical syncs with Principal Architect Ansh Rudra. Either party may terminate ongoing monthly retainers with a thirty (30) day written notice period.',
    },
    {
      id: '06',
      title: 'Data Privacy, Ethics & Compliance Posture',
      badge: 'ETHICAL CRAWLING & PRIVACY',
      content:
        'Flyvane complies with international privacy frameworks and ethical web crawling protocols (respecting robots.txt guidelines where applicable, rate-limiting outbound requests to prevent server denial-of-service, and eliminating personal identity exposure). Clients are solely responsible for ensuring that their target data collection initiatives align with their jurisdiction\'s statutory frameworks and commercial terms of service.',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-zinc-200 pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      <HeadSEO
        title="Terms of Service & Governance | Flyvane Systems"
        description="Review the autonomous systems service terms, AI automation governance protocols, and engineering SLA architecture governing all Flyvane client engagements."
        canonicalPath="/terms"
        schema={termsSchema}
      />

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-8 border-b border-white/[0.08]">
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 hidden sm:inline-block">
            LEGAL SPECIFICATION — v2.4
          </span>
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="py-16 space-y-5 max-w-3xl">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold">
            TERMS OF ENGAGEMENT & ARCHITECTURE GOVERNANCE
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight leading-[1.1]">
          Autonomous Systems Service Terms & Engineering Governance
        </h1>
        <p className="text-base font-sans text-zinc-400 leading-relaxed text-pretty">
          Ambiguous software service agreements create operational vulnerability and unexpected intellectual property disputes. Without clear governance, companies face vendor lock-in, data security risks, and unpredictable automation downtime. These terms establish transparent engineering standards, unconditional client IP ownership, and verifiable SLA frameworks for all Flyvane autonomous partnerships.
        </p>
        <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span>Effective: October 14, 2026</span>
          <span>•</span>
          <span>Jurisdiction: Bangalore, India / Global Enterprise</span>
        </div>
      </div>

      {/* Highlight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        <InteractiveTiltWrapper className="p-6 space-y-3 relative overflow-hidden" maxTilt={4}>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-sans font-semibold text-white">100% Client IP Ownership</h3>
          <p className="text-xs font-sans text-zinc-400 leading-relaxed">
            All code, schemas, and pipelines belong entirely to you with zero black-box vendor lock-in.
          </p>
        </InteractiveTiltWrapper>

        <InteractiveTiltWrapper className="p-6 space-y-3 relative overflow-hidden" maxTilt={4}>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-sans font-semibold text-white">99.4% Extraction Precision</h3>
          <p className="text-xs font-sans text-zinc-400 leading-relaxed">
            Rigorous Pydantic schema validation preventing downstream data corruption across databases.
          </p>
        </InteractiveTiltWrapper>

        <InteractiveTiltWrapper className="p-6 space-y-3 relative overflow-hidden" maxTilt={4}>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-sans font-semibold text-white">Zero Model Leakage</h3>
          <p className="text-xs font-sans text-zinc-400 leading-relaxed">
            Client data is quarantined; private records are never fed into public training datasets.
          </p>
        </InteractiveTiltWrapper>
      </div>

      {/* Detailed Sections List */}
      <div className="space-y-6 pt-4 border-t border-white/[0.08]">
        {sections.map((sec) => (
          <InteractiveTiltWrapper
            key={sec.id}
            className="p-8 sm:p-10 space-y-4 relative overflow-hidden"
            maxTilt={3}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-cyan-400 font-semibold tracking-[0.2em] uppercase">
                {sec.badge}
              </span>
              <span className="text-xs font-mono text-zinc-600">SECTION {sec.id}</span>
            </div>

            <h2 className="text-2xl font-display font-medium text-white tracking-tight">
              {sec.title}
            </h2>

            <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed">
              {sec.content}
            </p>
          </InteractiveTiltWrapper>
        ))}
      </div>

      {/* Bottom CTA / Inquiry Link */}
      <div className="mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-display font-medium text-white">Questions regarding customized SLAs?</h3>
          <p className="text-xs font-sans text-zinc-400 mt-1">
            Enterprise procurement teams can request customized NDA and MSA addendums directly from our principal team.
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 rounded-xl bg-white text-black font-sans font-semibold text-xs tracking-wider hover:bg-zinc-200 transition-colors shrink-0"
        >
          Initialize Advisory Brief →
        </button>
      </div>
    </div>
  );
}

export default TermsPage;

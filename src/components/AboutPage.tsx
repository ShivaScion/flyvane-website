import { ArrowLeft, Cpu, Shield, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';
import { HeadSEO } from './HeadSEO';
import { SiteFooter } from './SiteFooter';

interface AboutPageProps {
  onNavigate?: (path: string) => void;
  onNavigateHome: () => void;
  onNavigateContact?: () => void;
}

export function AboutPage({ onNavigate, onNavigateHome, onNavigateContact }: AboutPageProps) {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About CyberSteed — AI Systems Engineering Practice',
    description: 'Learn how CyberSteed pairs deterministic automation ethics with resilient autonomous infrastructure built by founder Ansh Rudra.',
    url: 'https://cybersteed.com/about',
    mainEntity: {
      '@type': 'Person',
      name: 'Ansh Rudra',
      jobTitle: 'Founder & Principal Systems Architect',
      worksFor: {
        '@type': 'Organization',
        name: 'CyberSteed',
        url: 'https://cybersteed.com/'
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Studio',
          item: 'https://cybersteed.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About & Practice',
          item: 'https://cybersteed.com/about'
        }
      ]
    }
  };

  // Part 1: Systems Engineering Ethics (Machine)
  const engineeringEthics = [
    {
      title: 'Anti-Slop Architecture',
      subtitle: 'Zero vanity features or fragile wrappers',
      description:
        'We refuse to deploy superficial AI wrappers, generic 3-column cookie-cutter templates, or fragile low-code automations that collapse on schema shifts. Every piece of code is bespoke, hardened, and mathematically necessary.',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
    },
    {
      title: 'Deterministic State Persistence',
      subtitle: 'Idempotence over probabilistic guessing',
      description:
        'Our systems are engineered around idempotent task queues, cryptographic verification, and strict Pydantic schemas. If an upstream endpoint times out, state machines recover automatically without duplicate ledger transactions.',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: 'Radical Client Sovereignty',
      subtitle: '100% intellectual property ownership',
      description:
        'We build in your cloud accounts (AWS, GCP, Supabase, Vercel). You own the repositories, the scraping logic, the database models, and the output data. No proprietary vendor lock-in or hostage licensing.',
      icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
    },
  ];

  // Part 2: Behavioral & Commercial Ethics (Mind)
  const behavioralEthics = [
    {
      title: 'Non-Manipulative Cognitive Framing',
      subtitle: 'Empirical clarity over psychological dark patterns',
      description:
        'We reject deceptive growth-hacking tricks, artificial countdown timers, and predatory psychological traps. Every positioning asset is calibrated around genuine economic utility and authentic cognitive clarity.',
      icon: <Target className="w-4 h-4 text-amber-400" />,
    },
    {
      title: 'Economic Arbitrage Accountability',
      subtitle: 'Tied directly to quantified downside eliminated',
      description:
        'We measure our impact in hard annualized dollar savings and qualified enterprise pipeline, not vague creative agency vanity metrics. We align our retainers directly with the cost of manual labor eliminated.',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    },
    {
      title: 'Competitive Playbook Quarantining',
      subtitle: 'Absolute strategic isolation & client firewalling',
      description:
        'Strict ethical information boundaries govern all advisory relationships. We never cross-contaminate proprietary positioning strategies, target account intelligence, or market playbooks between competing accounts.',
      icon: <Shield className="w-4 h-4 text-violet-400" />,
    },
  ];

  // Part 1: Autonomous Engineering Systems (Machine)
  const engineeringCapabilities = [
    {
      tag: 'MACHINE',
      title: 'Headless Extraction Fleets & Anti-Detection',
      desc: 'Distributed browser clusters, residential proxy rotation, and strict Pydantic schemas processing web-scale intelligence with 99.4% schema validation SLA.',
      metrics: 'Sub-second event bus · Anti-bot stealth · Automated delta sync',
    },
    {
      tag: 'MACHINE',
      title: 'Deterministic State Machines & Queues',
      desc: 'Stateful workflow graphs built with checkpoint persistence, dead-letter recovery queues, and idempotent retry guarantees that never drop transactions.',
      metrics: 'Zero-drop persistence · Idempotent task keys · Atomic rollback',
    },
    {
      tag: 'MACHINE',
      title: 'Intelligent AI Worker Swarms',
      desc: 'Deterministic background worker agents executing authenticated API calls, document synthesis, and automated reconciliation with human-in-the-loop safeguards.',
      metrics: '85% manual triage reduction · Strict validation gates · Zero hallucinations',
    },
  ];

  // Part 2: Behavioral Strategy & Executive Positioning (Mind)
  const strategyCapabilities = [
    {
      tag: 'MIND',
      title: 'Category Framing & Market Differentiation',
      desc: 'High-contrast market positioning that breaks commoditized price wars, exposes competitor blind spots, and commands executive pricing authority.',
      metrics: 'Category design blueprint · Competitor contrast matrix · Premium pricing leverage',
    },
    {
      tag: 'MIND',
      title: 'Loss-Aversion Copywriting & Narrative Funnels',
      desc: 'Rigorously crafted copy and narrative funnels structured around the cost of inaction, organizational risk reduction, and enterprise procurement psychology.',
      metrics: 'Immediate cognitive clarity · Reduced decision hesitation · High-ticket conversion',
    },
    {
      tag: 'MIND',
      title: 'Executive Thought Leadership & Syndication',
      desc: 'Transforming proprietary technical domain insights into repeatable omnichannel distribution, executive position papers, and high-intent inbound pipeline.',
      metrics: '4.2x executive reach · Inbound qualification · Industry authority',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-zinc-200 pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      <HeadSEO
        title="About CyberSteed | AI Systems Engineering Practice & Ethics"
        description="Learn how CyberSteed's AI systems engineering practice pairs strict automation ethics with resilient autonomous infrastructure built by founder Ansh Rudra."
        canonicalPath="/about"
        schema={aboutSchema}
      />

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-8 border-b border-white/[0.08]">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </a>

        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400">
          PRACTICE OVERVIEW &amp; FOUNDER MANIFESTO
        </span>
      </div>

      {/* Hero Title Section */}
      <div className="py-16 space-y-6 max-w-3xl">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
            ABOUT CYBERSTEED & LEADERSHIP
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-[1.15] text-balance">
          The AI Systems Engineering Practice Built for Deterministic Leverage
        </h1>
        <p className="text-lg font-sans text-zinc-300 leading-relaxed">
          Growing enterprises are flooded with fragile AI wrappers that collapse under real-world loads. When automations break, they pollute production databases and burn expensive engineering hours. CyberSteed operates as a specialized AI systems engineering practice founded by Ansh Rudra, pairing strict automation ethics with self-healing, deterministic infrastructure that turns manual operations into reliable software leverage.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <InteractiveTiltWrapper
        className="p-8 sm:p-12 mb-16 relative overflow-hidden border border-white/[0.1] bg-gradient-to-br from-white/[0.03] to-white/[0.01]"
        maxTilt={4}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-amber-500/20 to-emerald-500/20 p-1 border border-white/10 shadow-[0_0_40px_rgba(0,216,255,0.15)] mb-4">
              <div className="w-full h-full rounded-xl bg-[#090a0f] flex items-center justify-center font-display text-3xl font-bold text-white tracking-tight">
                AR
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-cyan-400 text-black font-mono text-[9px] font-bold uppercase tracking-wider">
                PRINCIPAL
              </div>
            </div>
            <h2 className="text-2xl font-display font-medium text-white">Ansh Rudra</h2>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">Founder & Principal Systems Architect</p>
            <p className="text-xs font-mono text-zinc-500 mt-1">Bangalore, India</p>
          </div>

          <div className="lg:col-span-8 space-y-4 text-sm sm:text-base font-sans text-zinc-300 leading-relaxed border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8">
            <p>
              I engineer autonomous infrastructure for businesses that have outgrown fragile manual workarounds. With a multidisciplinary background bridging distributed asynchronous software engineering (Python, Node.js, Playwright, LangGraph) and cognitive behavioral economics, I help founders replace operations bottlenecks with self-healing machine swarms.
            </p>
            <p className="text-zinc-400 text-sm">
              Prior to establishing CyberSteed, I identified that 90% of enterprise software failures stem not from technology limitations, but from the mismatch between technical execution and how buyers evaluate risk. We bridge that gap permanently.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
              <span className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">Python AsyncIO & FastAPI</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">Distributed Headless Fleets</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">Loss-Aversion Frameworks</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">React & WebGL Systems</span>
            </div>
          </div>
        </div>
      </InteractiveTiltWrapper>

      {/* Ethics & Principles Section - Divided into 2 Explicit Pillars */}
      <div className="mb-20 space-y-12">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold block">
            CORE OPERATING DOCTRINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
            Our Ethics &amp; Operating Standards
          </h2>
          <p className="text-sm font-sans text-zinc-400 max-w-2xl leading-relaxed">
            Divided into two non-negotiable disciplines: mathematical software engineering rigor paired with uncompromised commercial integrity.
          </p>
        </div>

        {/* Part 1: Systems Engineering Ethics (Machine) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
              PILLAR 01
            </span>
            <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
              Systems Engineering Doctrine (The Machine)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engineeringEthics.map((item, idx) => (
              <InteractiveTiltWrapper key={idx} className="p-7 space-y-4 relative overflow-hidden" maxTilt={3}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-sans font-semibold text-white leading-tight">{item.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{item.subtitle}</span>
                  </div>
                </div>
                <p className="text-xs font-sans text-zinc-400 leading-relaxed">{item.description}</p>
              </InteractiveTiltWrapper>
            ))}
          </div>
        </div>

        {/* Part 2: Behavioral & Commercial Ethics (Mind) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
              PILLAR 02
            </span>
            <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
              Behavioral & Commercial Ethics (The Mind)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {behavioralEthics.map((item, idx) => (
              <InteractiveTiltWrapper key={idx} className="p-7 space-y-4 relative overflow-hidden" maxTilt={3}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-sans font-semibold text-white leading-tight">{item.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{item.subtitle}</span>
                  </div>
                </div>
                <p className="text-xs font-sans text-zinc-400 leading-relaxed">{item.description}</p>
              </InteractiveTiltWrapper>
            ))}
          </div>
        </div>
      </div>

      {/* Services / Practice Capabilities Section - Divided into 2 Explicit Parts */}
      <div className="mb-20 space-y-12">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold block">
            PRACTICE CAPABILITIES & SERVICES
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
            What We Do: Two Complementary Disciplines
          </h2>
          <p className="text-sm font-sans text-zinc-400 max-w-2xl leading-relaxed">
            Eliminating operational friction with autonomous software machinery while establishing category dominance with high-contrast positioning.
          </p>
        </div>

        {/* Services Part 1: Autonomous Systems Engineering (Machine) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
                PART 01
              </span>
              <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
                Autonomous Systems Engineering (The Machine)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">INFRASTRUCTURE & CODE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engineeringCapabilities.map((cap, idx) => (
              <InteractiveTiltWrapper key={idx} className="p-7 space-y-3 relative overflow-hidden flex flex-col justify-between" maxTilt={3}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                      MACHINE
                    </span>
                    <span className="text-xs font-mono text-zinc-600">0{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-display font-medium text-white">{cap.title}</h4>
                  <p className="text-xs font-sans text-zinc-400 leading-relaxed">{cap.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/[0.08] text-[10px] font-mono text-cyan-400/80">
                  {cap.metrics}
                </div>
              </InteractiveTiltWrapper>
            ))}
          </div>
        </div>

        {/* Services Part 2: Behavioral Strategy & Executive Positioning (Mind) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
                PART 02
              </span>
              <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
                Behavioral Strategy & Executive Positioning (The Mind)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">COMMERCIAL & AUTHORITY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategyCapabilities.map((cap, idx) => (
              <InteractiveTiltWrapper key={idx} className="p-7 space-y-3 relative overflow-hidden flex flex-col justify-between" maxTilt={3}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-semibold tracking-wider text-amber-400 uppercase">
                      MIND
                    </span>
                    <span className="text-xs font-mono text-zinc-600">0{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-display font-medium text-white">{cap.title}</h4>
                  <p className="text-xs font-sans text-zinc-400 leading-relaxed">{cap.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/[0.08] text-[10px] font-mono text-amber-400/80">
                  {cap.metrics}
                </div>
              </InteractiveTiltWrapper>
            ))}
          </div>
        </div>
      </div>

      {/* Goals & Vision Section */}
      <InteractiveTiltWrapper className="p-8 sm:p-12 mb-16 relative overflow-hidden border border-white/[0.09]" maxTilt={4}>
        <div className="space-y-6 max-w-3xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold block">
            MISSION & 5-YEAR TRAJECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight leading-[1.15]">
            Eliminating 1,000,000 hours of soul-crushing human operational toil.
          </h2>
          <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed">
            Human talent is wasted when brilliant operators spend 30 hours a week manually copy-pasting CRM data, scraping directories by hand, or babysitting fragile spreadsheet pipelines. Our goal is to equip forward-thinking firms with autonomous software machinery that frees human minds for pure strategy, high-ticket deal negotiation, and deep creative judgment.
          </p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/[0.08]">
            <div>
              <div className="text-2xl font-mono font-semibold text-white">65%+</div>
              <div className="text-xs font-mono text-zinc-500 mt-1">Average OpEx Waste Reduced</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-semibold text-white">99.4%</div>
              <div className="text-xs font-mono text-zinc-500 mt-1">Verifiable Extraction Schema SLA</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-semibold text-white">Zero</div>
              <div className="text-xs font-mono text-zinc-500 mt-1">Proprietary Lock-in Guarantee</div>
            </div>
          </div>
        </div>
      </InteractiveTiltWrapper>

      {/* Bottom CTA to Contact / Advisory */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-display font-medium text-white">Ready to architect your autonomous system?</h3>
          <p className="text-xs font-sans text-zinc-400 mt-1">
            Submit your bottleneck brief for a direct 24-hour architectural assessment by Ansh Rudra.
          </p>
        </div>
        <button
          onClick={() => {
            if (onNavigateContact) {
              onNavigateContact();
            } else {
              onNavigateHome();
            }
          }}
          className="px-6 py-3 rounded-xl bg-white text-black font-sans font-semibold text-xs tracking-wider hover:bg-zinc-200 transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Initialize Advisory Brief</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sub-URL Interlinking Matrix */}
      <div className="mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('/blog');
            else onNavigateHome();
          }}
          className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-300 group block cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-2 font-semibold">
            ENGINEERING PUBLICATIONS
          </span>
          <h4 className="text-base font-sans font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
            <span>Explore Technical Architecture Logs</span>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </h4>
          <p className="text-xs font-sans text-zinc-400 mt-2 leading-relaxed">
            Deep-dive production blueprints analyzing autonomous data pipelines at scale, LangGraph state persistence, and B2B procurement psychology.
          </p>
        </a>

        <a
          href="/terms"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('/terms');
            else onNavigateHome();
          }}
          className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/30 transition-all duration-300 group block cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block mb-2 font-semibold">
            GOVERNANCE &amp; SLA STANDARDS
          </span>
          <h4 className="text-base font-sans font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
            <span>Review Terms of Engagement &amp; SLAs</span>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </h4>
          <p className="text-xs font-sans text-zinc-400 mt-2 leading-relaxed">
            Examine our 100% client IP ownership guarantee, 99.4% extraction schema precision benchmarks, and isolated cryptographic secret vaults.
          </p>
        </a>
      </div>

      {/* Global Unified Footer */}
      <SiteFooter onNavigate={onNavigate || onNavigateHome} />
    </div>
  );
}

export default AboutPage;

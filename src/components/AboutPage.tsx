import { ArrowLeft, Cpu, Shield, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateContact?: () => void;
}

export function AboutPage({ onNavigateHome, onNavigateContact }: AboutPageProps) {
  const ethics = [
    {
      title: 'Anti-Slop Architecture',
      subtitle: 'Zero vanity features or fragile gimmicks',
      description:
        'We refuse to deploy superficial AI wrappers, generic 3-column cookie-cutter templates, or fragile low-code automations that collapse on schema shifts. Every piece of code is bespoke, hardened, and mathematically necessary.',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
    },
    {
      title: 'Deterministic Engineering',
      subtitle: 'State persistence over probabilistic guesses',
      description:
        'Our systems are engineered around idempotent task queues, cryptographic verification, and strict Pydantic schemas. If an upstream endpoint times out, state machines recover automatically without duplicate ledger transactions.',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: 'Radical Client Sovereignty',
      subtitle: '100% intellectual property ownership',
      description:
        'We build in your cloud accounts (AWS, GCP, Supabase, Vercel). You own the repositories, the scraping logic, the database models, and the output data. No proprietary vendor lock-in or ongoing hostage licensing.',
      icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
    },
    {
      title: 'Loss-Aversion & Economic Arbitrage',
      subtitle: 'Quantified commercial accountability',
      description:
        'We measure our impact in hard annualized dollar savings and qualified enterprise pipeline, not vague creative agency metrics. We align our retainers directly with the cost of manual labor eliminated.',
      icon: <Target className="w-4 h-4 text-cyan-400" />,
    },
  ];

  const capabilities = [
    {
      tag: 'MACHINE',
      title: 'Autonomous Systems & Data Pipelines',
      desc: 'Headless browser fleets, anti-detection proxy swarms, residential IP rotation, and high-throughput async event buses processing millions of data records without manual intervention.',
    },
    {
      tag: 'MIND',
      title: 'Behavioral Strategy & Executive Positioning',
      desc: 'Transforming technical complexity into category-defining market authority. Framing commercial offers around loss-aversion, category design, and high-intent enterprise procurement criteria.',
    },
    {
      tag: 'HYBRID',
      title: 'The Integrated Enterprise Engine',
      desc: 'The rare synthesis of deep backend software engineering with high-ticket commercial positioning—enabling companies to operate with machine efficiency and command market dominance.',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-zinc-200 pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-8 border-b border-white/[0.08]">
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </button>

        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400">
          PRACTICE OVERVIEW & FOUNDER MANIFESTO
        </span>
      </div>

      {/* Hero Title Section */}
      <div className="py-16 space-y-6 max-w-3xl">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
            ABOUT FLYVANE & LEADERSHIP
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white tracking-tight leading-[1.08] text-balance">
          Engineering autonomous leverage. Commanding commercial authority.
        </h1>
        <p className="text-lg font-sans text-zinc-300 leading-relaxed">
          Flyvane was founded on a singular conviction: the most valuable companies of the next decade will be built by small, elite teams leveraging deterministic automation on the backend and category-defining behavioral positioning on the frontend.
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
              Prior to establishing Flyvane, I identified that 90% of enterprise software failures stem not from technology limitations, but from the mismatch between technical execution and how buyers evaluate risk. We bridge that gap permanently.
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

      {/* Ethics & Principles Section */}
      <div className="mb-20 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold block">
            CORE OPERATING DOCTRINE
          </span>
          <h2 className="text-3xl font-display font-medium text-white tracking-tight">
            Our Ethics & Engineering Standards
          </h2>
          <p className="text-sm font-sans text-zinc-400 max-w-2xl leading-relaxed">
            The principles that govern every line of code we push, every architecture we design, and every advisory relationship we enter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ethics.map((item, idx) => (
            <InteractiveTiltWrapper key={idx} className="p-8 space-y-4 relative overflow-hidden" maxTilt={4}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-sans font-semibold text-white leading-tight">{item.title}</h3>
                  <span className="text-[11px] font-mono text-zinc-500">{item.subtitle}</span>
                </div>
              </div>
              <p className="text-sm font-sans text-zinc-400 leading-relaxed">{item.description}</p>
            </InteractiveTiltWrapper>
          ))}
        </div>
      </div>

      {/* What We Do Section */}
      <div className="mb-20 space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold block">
            PRACTICE PILLARS
          </span>
          <h2 className="text-3xl font-display font-medium text-white tracking-tight">
            What We Do: Systems That Compound
          </h2>
        </div>

        <div className="space-y-4">
          {capabilities.map((cap, idx) => (
            <InteractiveTiltWrapper key={idx} className="p-8 space-y-3 relative overflow-hidden" maxTilt={3}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                  {cap.tag} CAPABILITY
                </span>
                <span className="text-xs font-mono text-zinc-600">0{idx + 1}</span>
              </div>
              <h3 className="text-xl font-display font-medium text-white">{cap.title}</h3>
              <p className="text-sm font-sans text-zinc-400 leading-relaxed">{cap.desc}</p>
            </InteractiveTiltWrapper>
          ))}
        </div>
      </div>

      {/* Goals & Vision Section */}
      <InteractiveTiltWrapper className="p-8 sm:p-12 mb-16 relative overflow-hidden border border-white/[0.09]" maxTilt={4}>
        <div className="space-y-6 max-w-3xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold block">
            MISSION & 5-YEAR TRAJECTORY
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight leading-[1.15]">
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
          className="px-6 py-3 rounded-xl bg-white text-black font-sans font-semibold text-xs tracking-wider hover:bg-zinc-200 transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Initialize Advisory Brief</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default AboutPage;

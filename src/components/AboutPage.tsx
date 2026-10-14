import { ArrowLeft, Cpu, Shield, Target, Sparkles, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
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
    name: 'About CrystalSteed — Systems Engineering & Strategic Marketing Practice',
    description: 'CrystalSteed pairs autonomous systems engineering with strategic brand authority, co-founded by Ansh Rudra and Swetaa Dhuliya.',
    url: 'https://crystalsteed.in/about',
    mainEntity: [
      {
        '@type': 'Person',
        name: 'Ansh Rudra',
        jobTitle: 'Co-Founder & Principal Architect, Systems & Automation',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Asansol',
          addressRegion: 'West Bengal',
          addressCountry: 'IN'
        },
        worksFor: {
          '@type': 'Organization',
          name: 'CrystalSteed',
          url: 'https://crystalsteed.in/'
        }
      },
      {
        '@type': 'Person',
        name: 'Swetaa Dhuliya',
        jobTitle: 'Co-Founder & Principal Strategist, Branding, Marketing & Positioning',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Surat',
          addressRegion: 'Gujarat',
          addressCountry: 'IN'
        },
        worksFor: {
          '@type': 'Organization',
          name: 'CrystalSteed',
          url: 'https://crystalsteed.in/'
        }
      }
    ],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Studio',
          item: 'https://crystalsteed.in/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About & Practice',
          item: 'https://crystalsteed.in/about'
        }
      ]
    }
  };

  // Step 6: Disciplines Grid - PART 01: Digital Marketing & Brand Authority (Crystal)
  const crystalServices = [
    {
      id: 'CRYSTAL 01',
      title: 'LinkedIn Personal Branding',
      desc: 'Turning founders and leaders into the face of the business. We shape the profile, the positioning and a steady content rhythm that builds trust before the first conversation.',
      tags: ['Profile positioning', 'Content calendar', 'Founder-led visibility'],
    },
    {
      id: 'CRYSTAL 02',
      title: 'LinkedIn Corporate Branding',
      desc: 'A company page that does more than exist. Clear messaging, consistent publishing and content that supports sales, hiring and credibility.',
      tags: ['Company page strategy', 'Employee advocacy', 'Authority content'],
    },
    {
      id: 'CRYSTAL 03',
      title: 'Social Media Marketing',
      desc: "Planned, on-brand content across the platforms that matter to your audience, built around what your buyers want to see instead of what's easy to post.",
      tags: ['Platform strategy', 'Content creation', 'Community engagement'],
    },
    {
      id: 'CRYSTAL 04',
      title: 'Newsletters',
      desc: 'A direct line to your audience that you own. We plan, write and run newsletters that keep you in front of prospects, clients and partners.',
      tags: ['Editorial planning', 'Audience growth', 'Consistent delivery'],
    },
    {
      id: 'CRYSTAL 05',
      title: 'Email Marketing',
      desc: 'Targeted campaigns and sequences that nurture leads, re-engage past clients and move people toward a decision, without spamming anyone.',
      tags: ['Campaign design', 'Segmentation', 'Nurture sequences'],
    },
    {
      id: 'CRYSTAL 06',
      title: 'Blogging',
      desc: "Long-form articles that answer your buyers' real questions, build search visibility and give your sales conversations something to point to.",
      tags: ['Topic strategy', 'SEO-aware writing', 'Evergreen authority'],
    },
    {
      id: 'CRYSTAL 07',
      title: 'OpenAI Ads',
      desc: 'Paid placement on OpenAI’s advertising platform, planned and managed with tight targeting and clear tracking, so spend is tied to leads, not guesses.',
      tags: ['Campaign setup', 'Targeting', 'Performance reporting'],
    },
  ];

  // Step 6: Disciplines Grid - PART 02: Systems & Automation (Steed)
  const steedServices = [
    {
      id: 'STEED 01',
      title: 'CRM Architecture & Sales Automation',
      desc: "A structured pipeline with automated capture, routing, reminders and follow-up sequences that keep prospects warm until they're ready.",
      tags: ['Single pipeline view', 'Instant lead assignment', 'Smart nurture'],
    },
    {
      id: 'STEED 02',
      title: 'Workflow Automation',
      desc: 'Repetitive internal processes, such as approvals, reports, onboarding and data entry, replaced with reliable automated flows.',
      tags: ['Trigger-based actions', 'Error alerts', 'Human-in-the-loop checks'],
    },
    {
      id: 'STEED 03',
      title: 'System Integration',
      desc: 'Your CRM, website, ad platforms, accounts and communication tools connected so data moves once and stays correct.',
      tags: ['App-to-app connections', 'Clean data sync', 'Live dashboards'],
    },
  ];

  // Operating Doctrine Ethics
  const engineeringEthics = [
    {
      title: 'Anti-Slop Architecture',
      subtitle: 'Zero vanity features or fragile wrappers',
      description:
        'We refuse to deploy superficial AI wrappers, generic cookie-cutter templates, or fragile low-code automations that collapse on schema shifts. Every piece of code is hardened, documented, and mathematically necessary.',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
    },
    {
      title: 'Deterministic State Persistence',
      subtitle: 'Idempotence over probabilistic guessing',
      description:
        'Our systems are engineered around idempotent task queues, cryptographic verification, and strict schema validation. If an upstream endpoint times out, state machines recover automatically without duplicate ledger transactions.',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: 'Radical Client Sovereignty',
      subtitle: '100% intellectual property ownership',
      description:
        'We build directly in client-controlled cloud environments (AWS, GCP, Supabase, Vercel). You own the repositories, workflow graphs, database models, and output datasets. Zero proprietary vendor lock-in.',
      icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
    },
  ];

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

  return (
    <div className="min-h-screen bg-transparent text-zinc-200 pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      <HeadSEO
        title="About CrystalSteed | Business Growth Practice Built for Clarity & Endurance"
        description="CrystalSteed is a business growth practice founded by Ansh Rudra and Swetaa Dhuliya, pairing autonomous systems engineering with strategic personal and corporate brand authority."
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
          PRACTICE OVERVIEW &amp; PARTNER MANIFESTO
        </span>
      </div>

      {/* STEP 3: Mission & Dual 5-Year Trajectory Block */}
      <div className="py-16 space-y-8">
        <InteractiveTiltWrapper
          className="p-8 sm:p-12 relative overflow-hidden border border-white/[0.09] bg-gradient-to-br from-white/[0.03] to-white/[0.01]"
          maxTilt={3}
        >
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
                MISSION &amp; 5-YEAR TRAJECTORY
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-white tracking-tight leading-[1.15] text-balance">
              Eliminating 1,000,000 hours of operational toil and building durable market authority.
            </h1>

            <div className="space-y-4 text-sm sm:text-base font-sans text-zinc-300 leading-relaxed text-pretty">
              <p>
                Human talent is wasted when brilliant operators spend 30 hours a week manually copy-pasting CRM data, scraping directories by hand, or babysitting fragile spreadsheet pipelines. Simultaneously, authority is lost when industry leaders waste capital on fragmented, disposable marketing tactics that fail to convert or endure.
              </p>
              <p className="text-zinc-400">
                Our 5-year trajectory pairs autonomous software machinery with psychology-driven brand positioning. We equip forward-thinking firms with systems that free human capital for pure strategy and deal negotiation, backed by clear market authority that compounds over distance.
              </p>
            </div>

            {/* Metrics Grid (4-Column Layout) */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.08]">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white">65%+</div>
                <div className="text-xs font-sans text-zinc-400 mt-1">Average OpEx Waste Reduced</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white">99.4%</div>
                <div className="text-xs font-sans text-zinc-400 mt-1">Verifiable Extraction &amp; Pipeline SLA</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white">10x</div>
                <div className="text-xs font-sans text-zinc-400 mt-1">Compounded Pipeline Velocity &amp; Brand Recall</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-white">Zero</div>
                <div className="text-xs font-sans text-zinc-400 mt-1">Proprietary Lock-in Guarantee</div>
              </div>
            </div>
          </div>
        </InteractiveTiltWrapper>
      </div>

      {/* STEP 4: Practice Overview & Partner Manifesto */}
      <div className="pb-16 space-y-6 max-w-3xl">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold block">
          PRACTICE OVERVIEW &amp; PARTNER MANIFESTO
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium text-white tracking-tight leading-[1.15] text-balance">
          A Business Growth Practice Built for Clarity and Endurance
        </h2>
        <div className="space-y-4 text-sm sm:text-base font-sans text-zinc-300 leading-relaxed text-pretty">
          <p>
            Growing businesses are flooded with disconnected tools, one-off campaigns and agencies that each own a small piece. Leads leak between systems. Marketing can&apos;t prove what it earns. Teams spend their week moving data from one tab to another.
          </p>
          <p>
            CrystalSteed is a business growth practice founded by Ansh Rudra and Swetaa Dhuliya. We pair clear market-facing strategy with systems that run every day, so growth stops depending on who remembered what.
          </p>
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1.5 text-sm font-sans">
            <p>
              <strong className="text-cyan-400 font-semibold">Crystal</strong> is how we see: structure, transparency, nothing hidden.
            </p>
            <p>
              <strong className="text-amber-400 font-semibold">Steed</strong> is how we run: built for distance, speed and reliability.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 5: Partner Profile Cards */}
      <div className="mb-20 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Partner 1: Ansh Rudra */}
          <InteractiveTiltWrapper
            className="p-8 sm:p-10 relative overflow-hidden border border-white/[0.1] bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex flex-col justify-between"
            maxTilt={3}
          >
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden p-1 border border-white/10 shadow-[0_0_35px_rgba(0,216,255,0.15)] shrink-0 bg-[#090a0f]">
                  <img
                    src="/images/team/ansh-rudra.jpg"
                    alt="Ansh Rudra"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-cyan-400 text-black font-mono text-[9px] font-bold uppercase tracking-wider">
                    SYSTEMS
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-display font-medium text-white">Ansh Rudra</h3>
                  <p className="text-xs font-mono text-cyan-400 font-medium">
                    Co-Founder &amp; Principal Architect, Systems &amp; Automation
                  </p>
                  <p className="text-xs font-mono text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Asansol, West Bengal, India <span className="text-zinc-500 font-sans">(Company Headquarters)</span></span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm font-sans text-zinc-300 leading-relaxed border-t border-white/[0.08] pt-6">
                <p>
                  &ldquo;I&apos;ve been coding for 5 years and building automations for about 3. I turn manual work like lead generation, daily data records, website analysis and spreadsheet upkeep into systems that run on their own.
                </p>
                <p className="text-zinc-400 text-xs">
                  BCA graduate in Cloud and Security, certified in ethical hacking (IIT Madras Pravartak) and agile marketing.
                </p>
                <p className="text-zinc-400 text-xs">
                  I won&apos;t build anything that breaks the law or a platform&apos;s terms. If it only works through a loophole, it won&apos;t last.&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08] mt-6 flex flex-wrap gap-2 text-[11px] font-mono text-cyan-400/90">
              <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">Workflow Automation</span>
              <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">CRM Architecture</span>
              <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">System Integration</span>
            </div>
          </InteractiveTiltWrapper>

          {/* Partner 2: Swetaa Dhuliya */}
          <InteractiveTiltWrapper
            className="p-8 sm:p-10 relative overflow-hidden border border-white/[0.1] bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex flex-col justify-between"
            maxTilt={3}
          >
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden p-1 border border-white/10 shadow-[0_0_35px_rgba(245,158,11,0.15)] shrink-0 bg-[#090a0f]">
                  <img
                    src="/images/team/swetaa-dhuliya.jpg"
                    alt="Swetaa Dhuliya"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[9px] font-bold uppercase tracking-wider">
                    STRATEGY
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-display font-medium text-white">Swetaa Dhuliya</h3>
                  <p className="text-xs font-mono text-amber-400 font-medium">
                    Co-Founder &amp; Principal Strategist, Branding, Marketing &amp; Positioning
                  </p>
                  <p className="text-xs font-mono text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Surat, Gujarat, India <span className="text-zinc-500 font-sans">(Sales Headquarters)</span></span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm font-sans text-zinc-300 leading-relaxed border-t border-white/[0.08] pt-6">
                <p>
                  &ldquo;I help established B2B founders build authentic personal brands on LinkedIn, not through daily posting or viral tactics, but through deep psychological understanding and strategic clarity.
                </p>
                <p className="text-zinc-400 text-xs">
                  After 10+ years across operations consulting, HR, and digital marketing, I found my calling at the intersection of business psychology and personal expression.
                </p>
                <p className="text-zinc-400 text-xs">
                  My approach is simple but uncommon: I don&apos;t create your personal brand. I reveal it.&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08] mt-6 flex flex-wrap gap-2 text-[11px] font-mono text-amber-400/90">
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">Digital Marketing</span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">Brand Positioning</span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">Funnel Strategy</span>
            </div>
          </InteractiveTiltWrapper>
        </div>

        {/* Inter-Card Value Thesis */}
        <InteractiveTiltWrapper
          className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-500/[0.05] via-white/[0.02] to-amber-500/[0.05] border border-white/[0.1] text-center sm:text-left"
          maxTilt={2}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-sm font-sans text-zinc-200 leading-relaxed">
              <strong className="text-white font-semibold">Why two of us: </strong>
              Strategy without systems is a good idea that never ships. Systems without strategy is efficient work on the wrong thing. Every client gets both partners from day one.
            </div>
          </div>
        </InteractiveTiltWrapper>
      </div>

      {/* STEP 6: Disciplines Grid ("What We Do: Two Complementary Disciplines") */}
      <div className="mb-24 space-y-14">
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold block">
            PRACTICE CAPABILITIES &amp; SERVICES
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
            What We Do: Two Complementary Disciplines
          </h2>
          <p className="text-sm font-sans text-zinc-400 max-w-2xl leading-relaxed text-pretty">
            Eliminating operational friction with autonomous software machinery while establishing category dominance with high-contrast positioning.
          </p>
        </div>

        {/* PART 01: Digital Marketing & Brand Authority (Crystal) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
                PART 01
              </span>
              <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
                Digital Marketing &amp; Brand Authority (Crystal)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">VISIBILITY &amp; DEMAND</span>
          </div>

          <p className="text-xs font-sans text-zinc-400 leading-relaxed">
            <strong className="text-zinc-300">VISIBILITY &amp; DEMAND</strong> — Getting your business seen, trusted and remembered, on the channels where your buyers already pay attention.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crystalServices.map((service, idx) => (
              <InteractiveTiltWrapper
                key={idx}
                className="p-7 space-y-4 relative overflow-hidden flex flex-col justify-between"
                maxTilt={3}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-semibold tracking-wider text-amber-400 uppercase">
                      {service.id}
                    </span>
                    <span className="text-xs font-mono text-zinc-600">0{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-display font-medium text-white leading-tight">
                    {service.title}
                  </h4>
                  <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                  {service.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.07] text-[10px] font-mono text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </InteractiveTiltWrapper>
            ))}
          </div>
        </div>

        {/* PART 02: Systems & Automation (Steed) */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
                PART 02
              </span>
              <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
                Systems &amp; Automation (Steed)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">WORKFLOWS &amp; INFRASTRUCTURE</span>
          </div>

          <p className="text-xs font-sans text-zinc-400 leading-relaxed">
            <strong className="text-zinc-300">WORKFLOWS &amp; INFRASTRUCTURE</strong> — Eliminating manual bottlenecks with fault-tolerant autonomous pipelines and resilient system integration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steedServices.map((service, idx) => (
              <InteractiveTiltWrapper
                key={idx}
                className="p-7 space-y-4 relative overflow-hidden flex flex-col justify-between"
                maxTilt={3}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                      {service.id}
                    </span>
                    <span className="text-xs font-mono text-zinc-600">0{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-display font-medium text-white leading-tight">
                    {service.title}
                  </h4>
                  <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                  {service.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.07] text-[10px] font-mono text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </InteractiveTiltWrapper>
            ))}
          </div>
        </div>
      </div>

      {/* Ethics & Principles Section - Core Operating Doctrine */}
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

        {/* Doctrine Pillar 1: Systems Engineering Ethics (The Machine) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
              DOCTRINE 01
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

        {/* Doctrine Pillar 2: Behavioral & Commercial Ethics (The Mind) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
              DOCTRINE 02
            </span>
            <h3 className="text-lg font-sans font-semibold text-white tracking-wide">
              Behavioral &amp; Commercial Ethics (The Mind)
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

      {/* Bottom CTA to Contact / Advisory */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
        <div>
          <h3 className="text-lg font-display font-medium text-white">
            Ready to architect your autonomous system &amp; brand authority?
          </h3>
          <p className="text-xs font-sans text-zinc-400 mt-1">
            Submit your inquiry to collaborate directly with co-founders Ansh Rudra and Swetaa Dhuliya within our 24-hour SLA.
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
          <span>Initialize Partner Brief</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sub-URL Interlinking Matrix */}
      <div className="pt-10 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-6">
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

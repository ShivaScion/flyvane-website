import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, CheckCircle2, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { stitchEase } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

export interface DirectProjectIntakeProps {
  mode?: 'machine' | 'mind' | 'hybrid';
  inquiryContext?: string;
}

const SCOPE_OPTIONS_BY_MODE: Record<'machine' | 'mind' | 'hybrid', string[]> = {
  machine: [
    'Automation Services',
    'Autonomous Data Pipelines',
    'Autonomous Pipeline Architecture',
    'Deterministic State Machines & Worker Swarms',
    'Headless Extraction & Webhook Infrastructure'
  ],
  mind: [
    'Marketing Services',
    'Executive Brand Architecture',
    'Category Positioning & Differentiation Matrix',
    'Loss-Aversion Narrative & Demand Funnels',
    'Executive Thought Leadership & Syndication'
  ],
  hybrid: [
    'Automation Services',
    'Marketing Services',
    'Autonomous Data Pipelines',
    'Executive Brand Architecture',
    'Integrated Systems & Commercial Authority'
  ]
};

export const DirectProjectIntake: React.FC<DirectProjectIntakeProps> = ({
  mode = 'machine',
  inquiryContext = '',
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [serviceScope, setServiceScope] = useState<string>(
    mode === 'mind' ? 'Marketing Services' : 'Automation Services'
  );
  const [projectBrief, setProjectBrief] = useState(
    inquiryContext ||
      (mode === 'mind'
        ? 'Seeking executive positioning and category architecture to elevate inbound commercial pipeline.'
        : 'Seeking custom autonomous pipelines to eliminate manual workflow bottlenecks and scale throughput.')
  );
  const [trapField, setTrapField] = useState('');

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [leadId, setLeadId] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Dynamically update default Service Scope when active mode changes
  useEffect(() => {
    const modeDefault =
      mode === 'mind' ? 'Marketing Services' : 'Automation Services';
    setServiceScope(modeDefault);
    if (!inquiryContext) {
      setProjectBrief(
        mode === 'mind'
          ? 'Seeking executive positioning and category architecture to elevate inbound commercial pipeline.'
          : 'Seeking custom autonomous pipelines to eliminate manual workflow bottlenecks and scale throughput.'
      );
    }
  }, [mode, inquiryContext]);

  useEffect(() => {
    if (inquiryContext) {
      setProjectBrief(inquiryContext);
    }
  }, [inquiryContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetail(null);
    setStatus('submitting');
    soundEngine.playPop(0.08);

    try {
      const response = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          serviceScope,
          projectBrief: projectBrief.trim(),
          activeMode: mode,
          trapField,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLeadId(data.leadId || null);
        setStatus('success');
      } else {
        setErrorDetail(
          data.error ||
            'We encountered an issue logging your brief. Please connect directly via LinkedIn.'
        );
        setStatus('error');
      }
    } catch {
      setErrorDetail(
        'Network connection interrupted. Please connect directly with our partners via LinkedIn.'
      );
      setStatus('error');
    }
  };

  const scopeOptions = SCOPE_OPTIONS_BY_MODE[mode];

  return (
    <section id="contact" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      <InteractiveTiltWrapper
        onMouseEnter={() => soundEngine.playHoverHum()}
        className="p-6 sm:p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Column: Advisory Overview & Direct LinkedIn Touchpoint (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span
              className={`text-[11px] font-sans uppercase tracking-[0.2em] block font-semibold ${
                mode === 'mind' ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              INITIATE ENGAGEMENT
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-medium text-white tracking-normal leading-[1.15] text-balance">
              {mode === 'mind'
                ? 'Command your category authority.'
                : 'Eliminate operational bottlenecks.'}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed text-pretty">
              {mode === 'mind'
                ? 'Partner with Flyvane to architect high-contrast positioning, loss-aversion messaging, and executive demand systems.'
                : 'Partner with Flyvane to engineer fault-tolerant autonomous pipelines, worker swarms, and custom systems architecture.'}
            </p>

            {/* Restricted Public Touchpoint (Section 4.2 — Strictly Direct LinkedIn + Intake Form, Zero phone numbers) */}
            <div className="pt-4 space-y-3 font-sans text-xs">
              <a
                href="https://www.linkedin.com/company/flyvane"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white font-medium transition-all duration-500 ease-out flex items-center justify-between group"
              >
                <span className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-sky-400" />
                  <span>Connect on LinkedIn</span>
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-semibold group-hover:text-white flex items-center gap-1">
                  <span>Direct Network</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Liquid Glass Inner Direct Project Intake Form (7 cols) */}
          <div className="lg:col-span-7 liquid-glass-inner relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-white font-semibold">
                Direct Project Intake
              </h3>
              <span className="text-[11px] font-sans text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>24-Hour Partner SLA</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="intake-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: stitchEase }}
                  className="space-y-5 py-6"
                >
                  <div className="p-6 rounded-2xl backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-emerald-400 uppercase tracking-[0.16em] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Advisory Brief Logged</span>
                      </span>
                      {leadId && (
                        <span className="text-[11px] font-mono text-emerald-300 px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                          {leadId.slice(0, 8).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-sans text-white font-medium leading-relaxed">
                      Brief Received. Our partners will review your scope and initiate contact within 24 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs font-sans">
                    <div className="flex justify-between text-zinc-400">
                      <span>Organization / Partner</span>
                      <span className="text-white font-medium">{name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Service Scope</span>
                      <span className="text-white font-medium">{serviceScope}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Contact Channel</span>
                      <span className="text-zinc-200 font-mono">{contact}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setLeadId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-zinc-300 hover:text-white font-sans text-xs font-medium transition-colors cursor-pointer"
                  >
                    Submit Additional Brief
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="intake-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 font-sans text-xs"
                >
                  {/* Invisible Honeypot Input (Section 5.3) */}
                  <div className="sr-only opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="intake-trap-field">Leave this field blank</label>
                    <input
                      id="intake-trap-field"
                      name="trapField"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={trapField}
                      onChange={(e) => setTrapField(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="intake-name"
                        className="block text-[11px] font-sans font-semibold text-zinc-300 uppercase tracking-[0.15em] mb-2"
                      >
                        Name / Organization
                      </label>
                      <input
                        id="intake-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Mercer / Vanguard Systems"
                        className="w-full px-3.5 py-2.5 rounded-xl backdrop-blur-xl bg-white/[0.035] border border-white/[0.09] text-white font-sans focus:outline-none focus:border-emerald-400 transition-colors text-xs shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="intake-contact"
                        className="block text-[11px] font-sans font-semibold text-zinc-300 uppercase tracking-[0.15em] mb-2"
                      >
                        Email or LinkedIn Profile URL
                      </label>
                      <input
                        id="intake-contact"
                        name="contact"
                        type="text"
                        required
                        minLength={3}
                        maxLength={200}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="partner@organization.com or linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 rounded-xl backdrop-blur-xl bg-white/[0.035] border border-white/[0.09] text-white font-sans focus:outline-none focus:border-emerald-400 transition-colors text-xs shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="intake-scope"
                      className="block text-[11px] font-sans font-semibold text-zinc-300 uppercase tracking-[0.15em] mb-2"
                    >
                      Service Scope
                    </label>
                    <select
                      id="intake-scope"
                      name="serviceScope"
                      value={serviceScope}
                      onChange={(e) => setServiceScope(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl backdrop-blur-xl bg-white/[0.035] border border-white/[0.09] text-white font-sans focus:outline-none focus:border-emerald-400 transition-colors text-xs shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)]"
                    >
                      {scopeOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#050608] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="intake-brief"
                      className="block text-[11px] font-sans font-semibold text-zinc-300 uppercase tracking-[0.15em] mb-2 flex justify-between items-center"
                    >
                      <span>Project Brief &amp; Bottlenecks</span>
                      {inquiryContext && (
                        <span className="text-[10px] text-emerald-400 font-mono">Model Parameters Attached</span>
                      )}
                    </label>
                    <textarea
                      id="intake-brief"
                      name="projectBrief"
                      rows={4}
                      required
                      minLength={10}
                      maxLength={2000}
                      value={projectBrief}
                      onChange={(e) => setProjectBrief(e.target.value)}
                      placeholder="Describe your target architecture, operational bottlenecks, or commercial positioning objectives..."
                      className="w-full px-3.5 py-2.5 rounded-xl backdrop-blur-xl bg-white/[0.035] border border-white/[0.09] text-white font-sans focus:outline-none focus:border-emerald-400 transition-colors text-xs leading-relaxed shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)]"
                    />
                  </div>

                  {status === 'error' && errorDetail && (
                    <div className="p-3.5 rounded-xl backdrop-blur-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 font-sans">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span>{errorDetail} </span>
                        <a
                          href="https://www.linkedin.com/company/flyvane"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-white font-medium"
                        >
                          Connect via LinkedIn
                        </a>
                        .
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      id="submit-project-brief"
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-sans font-medium text-xs tracking-wide hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Securing Brief...</span>
                        </>
                      ) : (
                        <span>Send Project Brief</span>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </InteractiveTiltWrapper>
    </section>
  );
};

export default DirectProjectIntake;

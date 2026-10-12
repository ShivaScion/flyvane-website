import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Phone, Send, CheckCircle2, Copy } from 'lucide-react';
import { stitchEase } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';

interface ContactSectionProps {
  inquiryContext?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ inquiryContext = '' }) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [projectType, setProjectType] = useState('Data Extraction & Custom Scraping');
  const [message, setMessage] = useState(
    inquiryContext || "Interested in custom automation to eliminate manual repetitive bottlenecks and optimize throughput."
  );
  const [isCopied, setIsCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (inquiryContext) {
      setMessage(inquiryContext);
    }
  }, [inquiryContext]);

  const handleCopyBrief = () => {
    soundEngine.playPop(0.08);
    const brief = `PROJECT BRIEF FOR FLYVANE:
Name: ${name || 'Prospective Client'}
Contact: ${contactInfo || 'N/A'}
Service Scope: ${projectType}
Details: ${message}`;

    navigator.clipboard.writeText(brief);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPop(0.08);
    setSubmitted(true);

    const brief = `[PROJECT BRIEF FOR FLYVANE]\nName: ${name || 'Prospective Client'}\nContact: ${contactInfo || 'N/A'}\nScope: ${projectType}\n\nProject Scope:\n${message}`;
    navigator.clipboard?.writeText(brief);

    const subject = encodeURIComponent(`[Project Intake] ${projectType} - ${name || 'Client'}`);
    const body = encodeURIComponent(brief);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contact@flyvane.com&su=${subject}&body=${body}`;
    const win = window.open(gmailUrl, '_blank');
    if (!win) {
      window.location.href = `mailto:contact@flyvane.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: stitchEase }}
        className="tilt-card rounded-3xl p-8 sm:p-14 relative overflow-hidden bg-gradient-to-br from-[#0c0d12] via-[#08090d] to-[#040406] border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
      >
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading & Value Proposition (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.1em] text-cyan-400 block font-semibold">
              // INITIATE ENGAGEMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-[-0.03em] leading-[1.08] text-balance">
              Have a bottleneck?<br />
              <span className="font-serif italic font-normal text-neutral-300">Let's automate it away.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed text-pretty">
              Whether you need a custom headless data scraper, an automated workflow pipeline, or executive positioning to convert attention into revenue, let's talk metrics.
            </p>

            {/* Direct Channels */}
            <div className="pt-4 space-y-3 font-mono text-xs">
              <a
                href="mailto:contact@flyvane.com"
                className="w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400" /> contact@flyvane.com
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest group-hover:text-white">Email</span>
              </a>

              <a
                href="https://www.linkedin.com/company/flyvane"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-blue-400" /> Connect on LinkedIn
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest group-hover:text-white">Direct</span>
              </a>

              <a
                href="tel:+919800488177"
                className="w-full px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400" /> +91 9800488177
                </span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest group-hover:text-white">Phone</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Value Client Intake Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#0b0c10]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-sm font-mono uppercase tracking-[0.1em] text-white font-semibold">
                Direct Project Intake
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available for Q4 Engagements
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer / TechCorp"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Email or LinkedIn
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="alex@techcorp.io"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Service Scope
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-xs"
                >
                  <option value="Data Extraction & Custom Scraping">Data Extraction & Headless Web Scraping</option>
                  <option value="Workflow Automation & Task Elimination">Workflow Automation & Task Elimination</option>
                  <option value="Psychological Copy & B2B Growth Strategy">Psychological Copy & B2B Positioning</option>
                  <option value="Full-Stack Engineering & Microservices">Full-Stack Architecture & Microservices</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                  <span>Project Overview / Economic Metrics</span>
                  {inquiryContext && (
                    <span className="text-[10px] text-emerald-400 font-mono">ROI Calculation Pre-filled</span>
                  )}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-wrap gap-3 items-center justify-between">
                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  title="Copy full brief to clipboard"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied Brief!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" /> Copy Brief
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitted ? 'Inquiry Formatted' : 'Send Project Brief'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </motion.div>
    </section>
  );
};

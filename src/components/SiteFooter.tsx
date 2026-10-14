import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface SiteFooterProps {
  onNavigate: (path: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    soundEngine.playClick(0.06);
    if (path.startsWith('#')) {
      const el = document.querySelector(path);
      if (el && (window as any).__lenis) {
        e.preventDefault();
        (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
      } else if (window.location.pathname !== '/') {
        e.preventDefault();
        onNavigate('/');
        setTimeout(() => {
          const target = document.querySelector(path);
          if (target && (window as any).__lenis) {
            (window as any).__lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.0 });
          }
        }, 150);
      }
      return;
    }

    if (path.startsWith('/')) {
      e.preventDefault();
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-24 pt-16 pb-16 border-t border-white/[0.08] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-sans text-zinc-400">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/[0.06]">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="inline-flex items-center gap-3 group cursor-pointer"
          >
            <img
              src="/images/logo.png"
              alt="CrystalSteed"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Engineering bespoke autonomous pipelines, worker swarms, and category-defining commercial positioning. Turning manual operations into reliable software leverage.
          </p>
          <div className="pt-2 space-y-1 text-[11px] font-mono text-zinc-500">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-zinc-400 font-semibold">Company HQ:</span>
              <span className="text-zinc-300">Asansol, West Bengal, India</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-zinc-400 font-semibold">Sales HQ:</span>
              <span className="text-zinc-300">Surat, Gujarat, India</span>
            </div>
            <div className="text-[10px] text-zinc-500 pt-0.5">Worldwide Execution</div>
          </div>
        </div>

        {/* Practice Capabilities Column */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold block">
            Practice Tracks
          </span>
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, '/')}
                className="hover:text-white transition-colors"
              >
                Autonomous Engineering
              </a>
            </li>
            <li>
              <a
                href="#workbench"
                onClick={(e) => handleLinkClick(e, '#workbench')}
                className="hover:text-white transition-colors"
              >
                Extraction Sandbox &amp; Playwright
              </a>
            </li>
            <li>
              <a
                href="#roi-arbitrage"
                onClick={(e) => handleLinkClick(e, '#roi-arbitrage')}
                className="hover:text-white transition-colors"
              >
                Labor Arbitrage Calculator
              </a>
            </li>
            <li>
              <a
                href="#capabilities"
                onClick={(e) => handleLinkClick(e, '#capabilities')}
                className="hover:text-white transition-colors"
              >
                Production SLA Guarantees
              </a>
            </li>
          </ul>
        </div>

        {/* Publications Column */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold block">
            Publications &amp; Logs
          </span>
          <ul className="space-y-2">
            <li>
              <a
                href="/blog"
                onClick={(e) => handleLinkClick(e, '/blog')}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>All Technical Briefs</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">Index</span>
              </a>
            </li>
            <li>
              <a
                href="/blog/autonomous-data-pipelines-at-scale"
                onClick={(e) => handleLinkClick(e, '/blog/autonomous-data-pipelines-at-scale')}
                className="hover:text-white transition-colors leading-snug block line-clamp-1"
                title="Autonomous Data Pipelines at Scale"
              >
                Autonomous Data Pipelines
              </a>
            </li>
            <li>
              <a
                href="/blog/loss-aversion-and-b2b-procurement-psychology"
                onClick={(e) => handleLinkClick(e, '/blog/loss-aversion-and-b2b-procurement-psychology')}
                className="hover:text-white transition-colors leading-snug block line-clamp-1"
                title="B2B Procurement Psychology & Loss Aversion"
              >
                B2B Procurement Psychology
              </a>
            </li>
          </ul>
        </div>

        {/* Governance & About Column */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold block">
            Practice &amp; Legal
          </span>
          <ul className="space-y-2">
            <li>
              <a
                href="/about"
                onClick={(e) => handleLinkClick(e, '/about')}
                className="hover:text-white transition-colors"
              >
                About CrystalSteed &amp; Partners
              </a>
            </li>
            <li>
              <a
                href="/terms"
                onClick={(e) => handleLinkClick(e, '/terms')}
                className="hover:text-white transition-colors"
              >
                Terms &amp; Engineering Governance
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="hover:text-white transition-colors"
              >
                Initialize Advisory Brief
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/crystalsteed/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1 text-zinc-400"
              >
                <span>LinkedIn Dispatches</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar with Copyright & Sub-links */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <div>
          © 2026 CrystalSteed. All rights reserved. Zero-operator reliability practice.
        </div>
        <div className="flex items-center gap-5">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="hover:text-zinc-300 transition-colors"
          >
            Home
          </a>
          <span>•</span>
          <a
            href="/about"
            onClick={(e) => handleLinkClick(e, '/about')}
            className="hover:text-zinc-300 transition-colors"
          >
            About
          </a>
          <span>•</span>
          <a
            href="/blog"
            onClick={(e) => handleLinkClick(e, '/blog')}
            className="hover:text-zinc-300 transition-colors"
          >
            Publications
          </a>
          <span>•</span>
          <a
            href="/terms"
            onClick={(e) => handleLinkClick(e, '/terms')}
            className="hover:text-zinc-300 transition-colors"
          >
            Terms &amp; SLAs
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

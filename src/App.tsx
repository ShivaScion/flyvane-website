import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { soundEngine } from './utils/soundEngine';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import BackgroundCanvas from './components/BackgroundCanvas';
import { AiraCompanion } from './components/AiraCompanion';
import { TerminalWorkbench } from './components/TerminalWorkbench';
import { PainPointArbitrage } from './components/PainPointArbitrage';
import { BrandAuthorityEstimator } from './components/BrandAuthorityEstimator';
import { CaseStudies } from './components/CaseStudies';
import { CompanyCapabilities } from './components/CompanyCapabilities';
import { MindStrategyBoard } from './components/MindStrategyBoard';
import { StudioUpdates } from './components/StudioUpdates';
import { ContactSection } from './components/ContactSection';
import { CommandPalette } from './components/CommandPalette';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  const [mode, setMode] = useState<'machine' | 'mind' | 'hybrid'>('machine');
  const [isAiraModalOpen, setIsAiraModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());
  const [inquiryContext, setInquiryContext] = useState<string>('');

  // 1. Initialize Lenis Smooth Momentum Scrolling & Anchor Link Interceptor
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    (window as any).__lenis = lenis;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const id = anchor.getAttribute('href');
        if (id && id !== '#') {
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // 2. Update data-mode attribute on body
  useEffect(() => {
    document.body.setAttribute('data-mode', mode);
  }, [mode]);

  // 3. Pointer move for subtle 3D card tilt & perimeter glow
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const cards = document.querySelectorAll<HTMLElement>('.tilt-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -2.8;
        const rotateY = ((x - centerX) / centerX) * 2.8;

        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.008, 1.008, 1.008)`;
        } else {
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // 4. Global hotkey Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick(0.06);
    }
  };

  const handleCommand = (cmd: string) => {
    const clean = cmd.toLowerCase().trim();

    const scrollToSection = (hash: string) => {
      const el = document.querySelector(hash);
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = hash;
      }
    };

    if (clean === 'mute') {
      handleToggleMute();
    } else if (clean.includes('scraper') || clean.includes('terminal') || clean.includes('workbench')) {
      scrollToSection('#workbench');
    } else if (clean.includes('roi') || clean.includes('calc') || clean.includes('loss') || clean.includes('revenue')) {
      scrollToSection('#roi-arbitrage');
    } else if (clean.includes('update')) {
      scrollToSection('#updates');
    } else if (clean.includes('contact') || clean.includes('advisory')) {
      scrollToSection('#contact');
    } else if (clean.includes('mind')) {
      setMode('mind');
      soundEngine.playModeMorph('mind');
    } else if (clean.includes('machine')) {
      setMode('machine');
      soundEngine.playModeMorph('machine');
    } else if (clean.includes('hybrid')) {
      setMode('hybrid');
      soundEngine.playModeMorph('hybrid');
    } else if (clean.includes('aira')) {
      setIsAiraModalOpen(true);
    } else if (clean.includes('who') || clean.includes('company') || clean.includes('capabilities') || clean.includes('experience')) {
      scrollToSection('#capabilities');
    } else {
      scrollToSection('#hero');
    }
  };

  const activeModeLabel =
    mode === 'machine'
      ? 'Automation Services'
      : mode === 'mind'
        ? 'Marketing Services'
        : 'Hybrid';

  return (
    <div className="relative isolate min-h-screen bg-transparent text-zinc-200 overflow-x-hidden">
      <Preloader onComplete={() => {}} />

      {/* Phase 3 & 7: Global Fixed Procedural WebGL Background Canvas */}
      <BackgroundCanvas activeMode={activeModeLabel} />

      {/* Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        onOpenCmd={() => setIsCmdOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Viewport Content */}
      <main className="relative z-10 pt-24 pb-24 bg-transparent">
        <Hero mode={mode} />

        {/* Automation Services Mode: Dedicated Automation Workbench & Arbitrage Calculator */}
        {mode === 'machine' && (
          <>
            <ErrorBoundary>
              <TerminalWorkbench onSetMode={setMode} />
            </ErrorBoundary>
            <PainPointArbitrage
              onDeployPlan={(teamSize, hours, rate, loss, tierLabel, retainerMonthly) => {
                setInquiryContext(
                  `[ENTERPRISE SCOPE BRIEF]\n` +
                  `• Quantified Bottleneck: ${teamSize} operators spending ${hours} hrs/wk each at $${rate}/hr\n` +
                  `• Annualized Labor Cost: $${loss.toLocaleString()} / year (~$${Math.round(loss / 12).toLocaleString()} / mo)\n` +
                  `• Target Retainer Tier: ${tierLabel} ($${retainerMonthly.toLocaleString()} / month)\n` +
                  `• Objective: Engineering assessment & deployment architecture for autonomous pipeline.`
                );
              }}
            />
          </>
        )}

        {/* Marketing Services Mode: Dedicated Editorial Brand Strategy Surface & Authority Estimator */}
        {mode === 'mind' && (
          <>
            <ErrorBoundary>
              <MindStrategyBoard />
            </ErrorBoundary>
            <BrandAuthorityEstimator
              onSelectBrief={(brief) => setInquiryContext(brief)}
            />
          </>
        )}

        {/* Hybrid Mode: Integrated System Capabilities */}
        {mode === 'hybrid' && (
          <>
            <ErrorBoundary>
              <MindStrategyBoard />
            </ErrorBoundary>
            <ErrorBoundary>
              <TerminalWorkbench onSetMode={setMode} />
            </ErrorBoundary>
            <PainPointArbitrage
              onDeployPlan={(teamSize, hours, rate, loss, tierLabel, retainerMonthly) => {
                setInquiryContext(
                  `[ENTERPRISE SCOPE BRIEF]\n` +
                  `• Quantified Bottleneck: ${teamSize} operators spending ${hours} hrs/wk each at $${rate}/hr\n` +
                  `• Annualized Labor Cost: $${loss.toLocaleString()} / year (~$${Math.round(loss / 12).toLocaleString()} / mo)\n` +
                  `• Target Retainer Tier: ${tierLabel} ($${retainerMonthly.toLocaleString()} / month)\n` +
                  `• Objective: Unified technical automation & brand authority system.`
                );
              }}
            />
            <BrandAuthorityEstimator
              onSelectBrief={(brief) => setInquiryContext(brief)}
            />
          </>
        )}

        <CaseStudies mode={mode} />

        <CompanyCapabilities mode={mode} />

        <StudioUpdates mode={mode} />

        <ContactSection mode={mode} inquiryContext={inquiryContext} />
      </main>

      {/* Phase 5: Minimal Liquid Glass Aira Concierge Drawer */}
      <AiraCompanion
        isOpen={isAiraModalOpen}
        setIsOpen={setIsAiraModalOpen}
        onSetMode={setMode}
      />

      {/* Cmd+K Command Palette */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectCommand={handleCommand}
      />
    </div>
  );
}

export default App;

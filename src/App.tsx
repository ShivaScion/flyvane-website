import React, { useState, useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { soundEngine } from './utils/soundEngine';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

const ThreeCanvas = React.lazy(() =>
  import('./components/ThreeCanvas').then((m) => ({ default: m.ThreeCanvas }))
);
import { AiraCompanion } from './components/AiraCompanion';
import { AiraVoiceModal } from './components/AiraVoiceModal';
import { TerminalWorkbench } from './components/TerminalWorkbench';
import { PainPointArbitrage } from './components/PainPointArbitrage';
import { CaseStudies } from './components/CaseStudies';
import { CompanyCapabilities } from './components/CompanyCapabilities';
import { MindStrategyBoard } from './components/MindStrategyBoard';
import { ContactSection } from './components/ContactSection';
import { CommandPalette } from './components/CommandPalette';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  const [mode, setMode] = useState<'machine' | 'mind' | 'hybrid'>('machine');
  const [isAiraModalOpen, setIsAiraModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [airaTranscript, setAiraTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false); // SILENT BY DEFAULT
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

  // 5. Speech Synthesis (Respecting Silence State)
  const speakText = (text: string, forcePlay = false) => {
    setAiraTranscript(text);
    if (!isAudioEnabled && !forcePlay) {
      return; // Respect silent mode
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.98; // Natural, calm pacing
      utterance.pitch = 1.15; // Gentle, pleasant feminine tone
      utterance.volume = 0.72; // Reduced default volume to prevent harsh playback

      const voices = window.speechSynthesis.getVoices();
      // Select natural, premium feminine voices (Google UK English Female, Samantha, Victoria, Karen, Zira, etc.)
      const femaleVoice = voices.find(v => 
        (v.name.includes('Google') && v.name.includes('Female')) ||
        v.name.includes('Samantha') ||
        v.name.includes('Victoria') ||
        v.name.includes('Karen') ||
        v.name.includes('Zira') ||
        (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
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

    if (clean.includes('scraper') || clean.includes('terminal') || clean.includes('workbench')) {
      scrollToSection('#workbench');
      speakText("Opening the live workbench. Enter your target URL or run live automation scripts.", true);
    } else if (clean.includes('roi') || clean.includes('calc') || clean.includes('loss') || clean.includes('revenue')) {
      scrollToSection('#roi-arbitrage');
      speakText("Navigating to the Pain-Point & ROI Arbitrage matrix.", true);
    } else if (clean.includes('mind')) {
      setMode('mind');
      soundEngine.playModeMorph('mind');
      speakText("Switched to Mind Behavioral Strategy mode.", true);
    } else if (clean.includes('machine')) {
      setMode('machine');
      soundEngine.playModeMorph('machine');
      speakText("Switched to Machine Technical Automation mode.", true);
    } else if (clean.includes('hybrid')) {
      setMode('hybrid');
      soundEngine.playModeMorph('hybrid');
      speakText("Switched to Hybrid Unified Matrix.", true);
    } else if (clean.includes('aira')) {
      setIsAiraModalOpen(true);
    } else if (clean.includes('who') || clean.includes('company') || clean.includes('capabilities') || clean.includes('experience')) {
      scrollToSection('#capabilities');
      speakText("Flyvane is an enterprise studio uniting engineering and automation with strategic brand growth.", true);
    } else {
      scrollToSection('#hero');
      speakText("Automate the boring. Market the brilliant.", true);
    }
  };

  return (
    <div className="relative min-h-screen bg-void text-neutral-200">
      <Preloader onComplete={() => {
        // Silent on completion by default
      }} />

      {/* 3D Three.js Spatial Background Canvas */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ThreeCanvas mode={mode} />
        </Suspense>
      </ErrorBoundary>
      <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        onOpenAira={() => setIsAiraModalOpen(true)}
        onOpenCmd={() => setIsCmdOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="relative z-10 pt-28 pb-24">
        <Hero
          mode={mode}
          onAiraTour={() => {
            setIsAudioEnabled(true);
            speakText("Welcome to Flyvane. We combine engineering and automation with strategic brand growth. Explore our live tools and services below.", true);
          }}
          onOpenScraper={() => {
            const el = document.querySelector('#workbench');
            if (el && (window as any).__lenis) {
              (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
            } else {
              window.location.href = '#workbench';
            }
          }}
          onOpenRoi={() => {
            const el = document.querySelector('#roi-arbitrage');
            if (el && (window as any).__lenis) {
              (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
            } else {
              window.location.href = '#roi-arbitrage';
            }
          }}
        />

        {/* Machine Mode Terminal Workbench (Dedicated Automation Tool) */}
        {mode === 'machine' && (
          <ErrorBoundary>
            <TerminalWorkbench
              onSetMode={setMode}
              onAiraSpeak={(t) => speakText(t, true)}
            />
          </ErrorBoundary>
        )}

        {/* Mind Mode Strategy Board (Dedicated Editorial Brand Strategy Surface) */}
        {mode === 'mind' && (
          <ErrorBoundary>
            <MindStrategyBoard />
          </ErrorBoundary>
        )}

        {/* Hybrid Mode: Both Integrated System Capabilities */}
        {mode === 'hybrid' && (
          <>
            <ErrorBoundary>
              <MindStrategyBoard />
            </ErrorBoundary>
            <ErrorBoundary>
              <TerminalWorkbench
                onSetMode={setMode}
                onAiraSpeak={(t) => speakText(t, true)}
              />
            </ErrorBoundary>
          </>
        )}

        <PainPointArbitrage
          onDeployPlan={(teamSize, hours, rate, loss, tierLabel, retainerMonthly) => {
            setInquiryContext(
              `[ENTERPRISE SCOPE BRIEF]\n` +
              `• Quantified Bottleneck: ${teamSize} operators bleeding ${hours} hrs/wk each at $${rate}/hr\n` +
              `• Annualized Labor Waste: $${loss.toLocaleString()} / year (Cost of Inaction: ~$${Math.round(loss / 12).toLocaleString()} / mo)\n` +
              `• Target Retainer Tier: ${tierLabel} ($${retainerMonthly.toLocaleString()} / month)\n` +
              `• Objective: Engineering assessment & deployment architecture for autonomous pipeline.`
            );
          }}
        />

        <CaseStudies mode={mode} />

        <CompanyCapabilities mode={mode} />

        <ContactSection inquiryContext={inquiryContext} />
      </main>

      {/* Autonomous Traveling Aira Companion */}
      <AiraCompanion
        onOpenModal={() => setIsAiraModalOpen(true)}
        speakText={(t) => speakText(t, true)}
        isSpeaking={isSpeaking}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => {
          setIsAudioEnabled(prev => !prev);
          if (!isAudioEnabled) {
            speakText("Audio enabled.", true);
          } else {
            window.speechSynthesis?.cancel();
            setIsSpeaking(false);
          }
        }}
      />

      {/* Aira Voice & Speech Modal */}
      <AiraVoiceModal
        isOpen={isAiraModalOpen}
        onClose={() => setIsAiraModalOpen(false)}
        onCommand={handleCommand}
        transcript={airaTranscript}
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

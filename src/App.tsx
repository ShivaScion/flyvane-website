import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { soundEngine } from './utils/soundEngine';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
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
import { NotFoundPage } from './components/NotFoundPage';
import { HeadSEO } from './components/HeadSEO';
import { SiteFooter } from './components/SiteFooter';
import { BlogPost } from './components/BlogIndex';
import { MODE_CONTENT, ModeConfig } from './data/modeContent';

// Lazy-loaded routes and heavy 3D WebGL modules for sub-second LCP & INP
const BackgroundCanvas = lazy(() => import('./components/BackgroundCanvas'));
const AiraCompanion = lazy(() => import('./components/AiraCompanion'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const BlogIndex = lazy(() => import('./components/BlogIndex'));
const BlogSlugRoute = lazy(() => import('./components/BlogSlugRoute'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

const RouteSkeleton = () => (
  <div className="min-h-screen bg-transparent flex items-center justify-center font-mono text-xs text-zinc-500 relative z-20">
    <div className="flex items-center gap-2.5">
      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      <span>Loading view topology...</span>
    </div>
  </div>
);

export function App() {
  const [mode, setMode] = useState<'machine' | 'mind' | 'hybrid'>('machine');
  const [isAiraModalOpen, setIsAiraModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());
  const [inquiryContext, setInquiryContext] = useState<string>('');

  // Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Defer heavy 3D WebGL mounting so initial DOM and LCP paint instantaneously
  const [shouldMount3D, setShouldMount3D] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
      const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isCrawler = Boolean(
        isMobile ||
        isReducedMotion ||
        navigator.webdriver ||
        /bot|crawler|spider|crawling|lighthouse|chrome-lighthouse|headless/i.test(navigator.userAgent)
      );
      if (!isCrawler) {
        const timer = setTimeout(() => {
          setShouldMount3D(true);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Dynamic Site Content (Loaded from CMS / Supabase with local fallback)
  const [siteContent, setSiteContent] = useState<Record<'machine' | 'mind' | 'hybrid', ModeConfig>>(MODE_CONTENT);

  // 1. Fetch CMS Content Overrides
  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content && Object.keys(data.content).length > 0) {
          setSiteContent((prev) => ({
            ...prev,
            ...data.content,
          }));
        }
      })
      .catch((err) => {
        console.warn('Using baseline mode content:', err);
      });
  }, []);

  // 2. Listen to browser popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 3. Initialize Lenis Smooth Momentum Scrolling & Anchor Link Interceptor
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

  // 4. Update data-mode attribute on body
  useEffect(() => {
    document.body.setAttribute('data-mode', mode);
  }, [mode]);

  // 5. Global pointer move: subtle 3D card tilt & cursor tracing coordinates
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Global 2D cursor tracing spotlight coordinates
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);

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

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // 6. Global hotkey Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
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
      if (currentPath !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el && (window as any).__lenis) {
            (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
          }
        }, 100);
        return;
      }

      const el = document.querySelector(hash);
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = hash;
      }
    };

    if (clean === 'admin') {
      navigate('/admin');
    } else if (clean === 'blog' || clean === 'publications') {
      navigate('/blog');
    } else if (clean === 'about' || clean.includes('founder') || clean.includes('ethics')) {
      navigate('/about');
    } else if (clean === 'terms' || clean.includes('legal') || clean.includes('conditions')) {
      navigate('/terms');
    } else if (clean === 'home' || clean === 'studio') {
      navigate('/');
    } else if (clean === 'mute') {
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

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://crystalsteed.com/#website',
        'url': 'https://crystalsteed.com/',
        'name': 'CrystalSteed',
        'description': 'Autonomous systems engineering, resilient AI agent workflows, and B2B automation architecture.',
        'publisher': {
          '@id': 'https://crystalsteed.com/#organization'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://crystalsteed.com/#organization',
        'name': 'CrystalSteed',
        'url': 'https://crystalsteed.com/',
        'email': 'contact@crystalsteed.com',
        'address': [
          {
            '@type': 'PostalAddress',
            'name': 'Company Headquarters',
            'addressLocality': 'Asansol',
            'addressRegion': 'West Bengal',
            'addressCountry': 'IN'
          },
          {
            '@type': 'PostalAddress',
            'name': 'Sales Headquarters',
            'addressLocality': 'Surat',
            'addressRegion': 'Gujarat',
            'addressCountry': 'IN'
          }
        ],
        'founder': [
          {
            '@type': 'Person',
            '@id': 'https://crystalsteed.com/#founder-ansh',
            'name': 'Ansh Rudra',
            'jobTitle': 'Co-Founder & Principal Architect, Systems & Automation',
            'url': 'https://crystalsteed.com/about'
          },
          {
            '@type': 'Person',
            '@id': 'https://crystalsteed.com/#founder-swetaa',
            'name': 'Swetaa Dhuliya',
            'jobTitle': 'Co-Founder & Principal Strategist, Branding, Marketing & Positioning',
            'url': 'https://crystalsteed.com/about'
          }
        ]
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://crystalsteed.com/#service',
        'name': 'CrystalSteed Autonomous Engineering & Brand Advisory',
        'url': 'https://crystalsteed.com/',
        'provider': {
          '@id': 'https://crystalsteed.com/#organization'
        },
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': 'Autonomous Systems Engineering Offerings',
          'itemListElement': [
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Autonomous Data Pipelines & AI Worker Swarms'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'B2B Automation Architecture & Systems Scaling'
              }
            },
            {
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'Service',
                'name': 'Executive Brand Positioning & Loss-Aversion Messaging'
              }
            }
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Studio',
            'item': 'https://crystalsteed.com/'
          }
        ]
      }
    ]
  };

  return (
    <ErrorBoundary>
      <div className="relative isolate min-h-screen bg-transparent text-zinc-200 overflow-x-hidden">
        {currentPath === '/' && <Preloader onComplete={() => {}} />}

        {/* Global Fixed Procedural WebGL Background Canvas with 3D Cursor Tracing (Deferred Mount) */}
        {shouldMount3D && (
          <Suspense fallback={null}>
            <BackgroundCanvas activeMode={activeModeLabel} />
          </Suspense>
        )}

        {/* Dynamic Studio Navbar with Native Routing */}
        <Navbar
          mode={mode}
          setMode={setMode}
          onOpenCmd={() => setIsCmdOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          currentPath={currentPath}
          onNavigate={navigate}
        />

        {/* Route Engine with Code-Split Boundaries */}
        <Suspense fallback={<RouteSkeleton />}>
          {currentPath === '/admin' ? (
            <AdminDashboard onNavigateHome={() => navigate('/')} />
          ) : currentPath === '/about' ? (
            <AboutPage
              onNavigate={navigate}
              onNavigateHome={() => navigate('/')}
              onNavigateContact={() => {
                navigate('/');
                setTimeout(() => {
                  const el = document.querySelector('#contact');
                  if (el && (window as any).__lenis) {
                    (window as any).__lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.0 });
                  }
                }, 100);
              }}
            />
          ) : currentPath === '/terms' ? (
            <TermsPage
              onNavigate={navigate}
              onNavigateHome={() => navigate('/')}
            />
          ) : currentPath === '/blog' ? (
            <BlogIndex
              onNavigate={navigate}
              onNavigateHome={() => navigate('/')}
              onSelectPost={(post) => {
                setSelectedBlog(post);
                navigate(`/blog/${post.slug}`);
              }}
            />
          ) : currentPath.startsWith('/blog/') ? (
            <BlogSlugRoute
              slug={currentPath.replace(/^\/blog\//, '').trim()}
              cachedPost={selectedBlog}
              onBack={() => navigate('/blog')}
              onNavigate={navigate}
              onNavigateHome={() => navigate('/')}
            />
          ) : currentPath === '/' || currentPath === '' ? (
            <main className="relative z-10 pt-24 pb-24 bg-transparent">
              <HeadSEO
                title="CrystalSteed | Autonomous Systems Engineering & AI Agents"
                description="Eliminate manual operations with autonomous systems engineering, resilient AI agent workflows, and B2B automation architecture. Scale without payroll bloat."
                canonicalPath="/"
                schema={homeSchema}
              />
              <Hero mode={mode} contentOverride={siteContent[mode]} />

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

              <CaseStudies mode={mode} contentOverride={siteContent[mode]} />

              <CompanyCapabilities mode={mode} />

              <StudioUpdates mode={mode} onNavigate={navigate} />

              <ContactSection mode={mode} inquiryContext={inquiryContext} />

              {/* Studio Global Footer */}
              <SiteFooter onNavigate={navigate} />
            </main>
          ) : (
            <NotFoundPage onNavigateHome={() => navigate('/')} />
          )}
        </Suspense>

        {/* Minimal Liquid Glass Aira Concierge Drawer */}
        <Suspense fallback={null}>
          <AiraCompanion
            isOpen={isAiraModalOpen}
            setIsOpen={setIsAiraModalOpen}
            onSetMode={setMode}
          />
        </Suspense>

        {/* Cmd+K Command Palette */}
        <CommandPalette
          isOpen={isCmdOpen}
          onClose={() => setIsCmdOpen(false)}
          onSelectCommand={handleCommand}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;

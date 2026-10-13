import { useEffect, useState } from 'react';
import { ArrowLeft, Compass, RefreshCw } from 'lucide-react';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';
import { HeadSEO } from './HeadSEO';

interface NotFoundProps {
  onNavigateHome: () => void;
}

export function NotFoundPage({ onNavigateHome }: NotFoundProps) {
  const [countdown, setCountdown] = useState<number>(12);

  useEffect(() => {
    if (countdown <= 0) {
      onNavigateHome();
      return;
    }
    const timer = setInterval(() => setCountdown((c: number) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, onNavigateHome]);

  return (
    <div className="min-h-screen bg-[#030406] text-zinc-200 flex items-center justify-center p-4 sm:p-6 select-none relative z-20">
      <HeadSEO
        title="404 — Page Not Found | Flyvane Systems"
        description="The requested trajectory does not exist in the Flyvane network topology. Auto-redirecting to Studio."
        canonicalPath="/404"
        robots="noindex, nofollow"
      />
      <InteractiveTiltWrapper className="max-w-xl w-full p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
        {/* Optical Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm" />

        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 text-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(0,216,255,0.15)]">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-cyan-400 block font-semibold">
            STATUS 404 — UNRESOLVED ROUTE
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
            Coordinate Out of Range
          </h1>
          <p className="text-sm font-sans text-zinc-400 leading-relaxed max-w-md mx-auto">
            The requested trajectory does not exist in the Flyvane network topology. Our fault-tolerant gateway is ready to redirect your session.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.08] text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Auto-redirecting to Studio in {countdown}s</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Portfolio</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 font-sans text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Route</span>
          </button>
        </div>
      </InteractiveTiltWrapper>
    </div>
  );
}

export default NotFoundPage;

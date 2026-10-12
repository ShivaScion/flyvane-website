import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, ArrowRight, Users, Sparkles } from 'lucide-react';
import { stitchEase, stitchSpring } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';

export type ContentCadence = '2x/week' | '4x/week' | 'Daily Authority';

interface BrandAuthorityEstimatorProps {
  onSelectBrief?: (summary: string) => void;
}

export const BrandAuthorityEstimator: React.FC<BrandAuthorityEstimatorProps> = ({ onSelectBrief }) => {
  const [networkReach, setNetworkReach] = useState<number>(15000);
  const [cadence, setCadence] = useState<ContentCadence>('4x/week');
  const [averageAcv, setAverageAcv] = useState<number>(35000);

  const cadenceMultiplier: Record<ContentCadence, { postsPerMonth: number; reachFactor: number; intentRate: number }> = {
    '2x/week': { postsPerMonth: 8, reachFactor: 0.28, intentRate: 0.0014 },
    '4x/week': { postsPerMonth: 17, reachFactor: 0.36, intentRate: 0.0018 },
    'Daily Authority': { postsPerMonth: 26, reachFactor: 0.44, intentRate: 0.0022 },
  };

  const activeConfig = cadenceMultiplier[cadence];
  const monthlyImpressions = Math.round(networkReach * activeConfig.reachFactor * activeConfig.postsPerMonth);
  const monthlyProfileVisits = Math.round(monthlyImpressions * 0.018);
  const quarterlyInboundConversations = Math.max(
    2,
    Math.round(monthlyProfileVisits * 3 * (activeConfig.intentRate * 10))
  );
  const qualifiedOpportunitiesPerQuarter = Math.max(1, Math.round(quarterlyInboundConversations * 0.42));
  const projectedPipelineValue = qualifiedOpportunitiesPerQuarter * averageAcv;

  const handleApplyToIntake = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playPop(0.08);
    if (onSelectBrief) {
      onSelectBrief(
        `Executive Authority & Pipeline Projection:\n` +
        `• Current Relevant Network Reach: ${networkReach.toLocaleString()} connections\n` +
        `• Target Executive Content Cadence: ${cadence}\n` +
        `• Average Customer ACV: $${averageAcv.toLocaleString()}\n` +
        `• Projected Monthly Impressions: ${monthlyImpressions.toLocaleString()}\n` +
        `• Estimated Qualified Inbound Conversations / Quarter: ${quarterlyInboundConversations}\n` +
        `• Projected Attributable Pipeline Value: $${projectedPipelineValue.toLocaleString()} / quarter`
      );
    }
    const contactEl = document.getElementById('contact');
    if (contactEl && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(contactEl, { offset: -70, duration: 1.0 });
    } else if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="roi-arbitrage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-12"
      >
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-amber-400 block mb-2.5 font-semibold">
          COMMERCIAL AUTHORITY &amp; DEMAND MODELING
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight leading-[1.08] text-balance">
          Brand Authority &amp; Inbound Pipeline Estimator
        </h2>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-2xl mt-3 leading-relaxed text-pretty">
          Model the compounding commercial impact of high-contrast executive positioning and structured thought leadership across your addressable network.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Authority Inputs (6 cols) */}
        <div
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="lg:col-span-6 tilt-card liquid-glass liquid-glass-amber bg-white/[0.025] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)] hover:bg-white/[0.045] hover:border-white/[0.18] hover:shadow-[0_24px_56px_0_rgba(0,0,0,0.8),inset_0_1px_2px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-7"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="text-[11px] font-sans font-semibold text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Executive Distribution Inputs</span>
            </span>
            <span className="text-[10px] font-sans font-semibold text-zinc-400 uppercase tracking-[0.2em]">
              CALIBRATED MODEL
            </span>
          </div>

          {/* Input 1: Current Relevant Network Reach */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-sans">
              <label htmlFor="network-reach-slider" className="text-zinc-300 font-medium">
                Current Relevant Network Reach
              </label>
              <span className="text-base font-mono font-semibold text-white">
                {networkReach.toLocaleString()} connections
              </span>
            </div>
            <input
              id="network-reach-slider"
              type="range"
              aria-label="Current Relevant Network Reach"
              min={1000}
              max={100000}
              step={1000}
              value={networkReach}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setNetworkReach(val);
                soundEngine.playTick(val / 100000, 0.03);
              }}
              style={{
                background: `linear-gradient(to right, #F59E0B ${((networkReach - 1000) / 99000) * 100}%, rgba(255,255,255,0.12) ${((networkReach - 1000) / 99000) * 100}%)`,
              }}
              className="luxury-slider w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>1,000</span>
              <span>50,000</span>
              <span>100,000</span>
            </div>
          </div>

          {/* Input 2: Executive Content Cadence */}
          <div className="space-y-2.5">
            <span className="block text-sm font-sans text-zinc-300 font-medium">
              Executive Content Cadence
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {(['2x/week', '4x/week', 'Daily Authority'] as ContentCadence[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setCadence(option);
                    soundEngine.playClick(0.06);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-sans font-medium transition-all border cursor-pointer ${
                    cadence === option
                      ? 'backdrop-blur-xl bg-amber-500/20 border-amber-400/60 text-white shadow-sm'
                      : 'backdrop-blur-xl bg-white/[0.025] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Average Customer ACV / Deal Value */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-sans">
              <label htmlFor="acv-slider" className="text-zinc-300 font-medium">
                Average Customer ACV / Deal Value
              </label>
              <span className="text-base font-mono font-semibold text-amber-400">
                ${averageAcv.toLocaleString()}
              </span>
            </div>
            <input
              id="acv-slider"
              type="range"
              aria-label="Average Customer ACV Deal Value"
              min={5000}
              max={100000}
              step={2500}
              value={averageAcv}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAverageAcv(val);
                soundEngine.playTick(val / 100000, 0.03);
              }}
              style={{
                background: `linear-gradient(to right, #F59E0B ${((averageAcv - 5000) / 95000) * 100}%, rgba(255,255,255,0.12) ${((averageAcv - 5000) / 95000) * 100}%)`,
              }}
              className="luxury-slider w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>$5,000</span>
              <span>$50,000</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] text-sm font-sans text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium block mb-1">Methodology Note</span>
            Projections model organic executive distribution combined with loss-aversion category framing and conversion-calibrated profile funnels.
          </div>
        </div>

        {/* Right Column: Calculated Authority & Pipeline Outputs (6 cols) */}
        <div
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="lg:col-span-6 tilt-card liquid-glass liquid-glass-amber bg-white/[0.025] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)] hover:bg-white/[0.045] hover:border-white/[0.18] hover:shadow-[0_24px_56px_0_rgba(0,0,0,0.8),inset_0_1px_2px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="text-[11px] font-sans font-semibold text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Projected Pipeline Yield</span>
            </span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-amber-300 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              QUARTERLY HORIZON
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)] space-y-1.5">
              <span className="text-xs font-sans text-zinc-400 block">
                Projected Monthly High-Intent Profile Impressions
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-semibold text-white block">
                {monthlyImpressions.toLocaleString()}
              </span>
              <span className="text-xs font-sans text-amber-400/90 block">
                Across {activeConfig.postsPerMonth} monthly authority assets
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)] space-y-1.5">
              <span className="text-xs font-sans text-zinc-400 block">
                Estimated Qualified Inbound Conversations per Quarter
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-semibold text-amber-400 block">
                {quarterlyInboundConversations}
              </span>
              <span className="text-xs font-sans text-zinc-400 block">
                ~{qualifiedOpportunitiesPerQuarter} qualified sales opportunities
              </span>
            </div>
          </div>

          {/* Primary Pipeline Value Output */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.025] to-transparent border border-amber-500/30 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.16)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-amber-300">
                Projected Attributable Pipeline Value
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-mono font-semibold text-white">
                ${projectedPipelineValue.toLocaleString()}
              </span>
              <span className="text-xs font-sans text-zinc-400">per quarter</span>
            </div>
            <p className="text-sm font-sans text-zinc-300 leading-relaxed pt-1">
              Based on {qualifiedOpportunitiesPerQuarter} qualified enterprise opportunities per quarter at a ${averageAcv.toLocaleString()} average contract value.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={stitchSpring.snappy}
            onClick={handleApplyToIntake}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-sans font-semibold text-xs uppercase tracking-wider text-center transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 tactile-btn"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Initialize Executive Positioning Brief</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default BrandAuthorityEstimator;

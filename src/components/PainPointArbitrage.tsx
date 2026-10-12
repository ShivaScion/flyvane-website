import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { stitchEase, stitchSpring } from '../utils/motion';
import { soundEngine } from '../utils/soundEngine';

interface PainPointArbitrageProps {
  onDeployPlan?: (
    teamSize: number,
    hours: number,
    rate: number,
    loss: number,
    tierLabel: string,
    retainerMonthly: number
  ) => void;
}

export const PainPointArbitrage: React.FC<PainPointArbitrageProps> = ({ onDeployPlan }) => {
  const [teamSize, setTeamSize] = useState<number>(1);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(1);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [automationCoverage, setAutomationCoverage] = useState<number>(100);
  const [costModel, setCostModel] = useState<'fixed' | 'retainer'>('fixed');
  const [oneTimeCost, setOneTimeCost] = useState<number>(25);
  const [recurringMonthlyCost, setRecurringMonthlyCost] = useState<number>(0);

  const weeklyLaborCostTotal = teamSize * hoursPerWeek * hourlyRate;
  const weeklySavings = weeklyLaborCostTotal * (automationCoverage / 100);
  const grossAnnualSavings = weeklySavings * 52;
  const monthlySavings = grossAnnualSavings / 12;

  const annualOperatingExpenses = recurringMonthlyCost * 12;
  const firstYearTotalInvestment = oneTimeCost + annualOperatingExpenses;
  const firstYearNetSavings = grossAnnualSavings - firstYearTotalInvestment;

  const firstYearRoi = firstYearTotalInvestment > 0
    ? ((firstYearNetSavings / firstYearTotalInvestment) * 100)
    : 0;

  const effectiveWeeklyNetYield = weeklySavings - (recurringMonthlyCost * 12 / 52);
  let paybackWeeksText = "Immediate";
  if (oneTimeCost > 0 && effectiveWeeklyNetYield > 0) {
    const weeks = oneTimeCost / effectiveWeeklyNetYield;
    if (weeks <= 1) {
      paybackWeeksText = "1 week";
    } else if (weeks < 8) {
      paybackWeeksText = `${weeks.toFixed(1)} weeks`;
    } else {
      const months = weeks / 4.33;
      paybackWeeksText = `${months.toFixed(1)} months`;
    }
  } else if (effectiveWeeklyNetYield <= 0) {
    paybackWeeksText = "N/A (Costs exceed savings)";
  }

  const handleDeploy = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playPop(0.08);
    if (onDeployPlan) {
      onDeployPlan(
        teamSize,
        hoursPerWeek,
        hourlyRate,
        grossAnnualSavings,
        costModel === 'fixed' ? `One-Time System Deploy ($${oneTimeCost})` : `Monthly Managed Retainer ($${recurringMonthlyCost}/mo)`,
        recurringMonthlyCost || Math.round(oneTimeCost / 12)
      );
    }
    const contactEl = document.getElementById('contact');
    if (contactEl && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(contactEl, { offset: -70, duration: 1.0 });
    } else if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
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
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-cyan-400 block mb-2.5 font-semibold">
          TRANSPARENT ECONOMIC VALUE ARBITRAGE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight leading-[1.08] text-balance">
          Automation Arbitrage &amp; Savings Calculator
        </h2>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-2xl mt-3 leading-relaxed text-pretty">
          Accurately calculate the tangible economic return of replacing repetitive manual workflows with custom software. No inflated theoretical metrics—just transparent labor accounting.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sliders for Manual Labor Inputs (6 cols) */}
        <div
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="lg:col-span-6 tilt-card liquid-glass liquid-glass-cyan bg-white/[0.025] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)] hover:bg-white/[0.045] hover:border-white/[0.18] hover:shadow-[0_24px_56px_0_rgba(0,0,0,0.8),inset_0_1px_2px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="text-[11px] font-sans font-semibold text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-cyan-400" /> 1. Quantify Current Manual Task
            </span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-400">LABOR VARIABLES</span>
          </div>

          {/* Preset Buttons for Instant Verification */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-zinc-400">Benchmarks:</span>
            <button
              type="button"
              onClick={() => {
                setTeamSize(1);
                setHoursPerWeek(1);
                setHourlyRate(25);
                setAutomationCoverage(100);
                setCostModel('fixed');
                setOneTimeCost(25);
                setRecurringMonthlyCost(0);
                soundEngine.playClick(0.06);
              }}
              className="px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-sans text-zinc-200 transition-colors cursor-pointer"
            >
              Low Frequency (1 hr/wk @ $25/hr)
            </button>
            <button
              type="button"
              onClick={() => {
                setTeamSize(3);
                setHoursPerWeek(10);
                setHourlyRate(45);
                setAutomationCoverage(90);
                setCostModel('retainer');
                setOneTimeCost(500);
                setRecurringMonthlyCost(400);
                soundEngine.playClick(0.06);
              }}
              className="px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-sans text-zinc-200 transition-colors cursor-pointer"
            >
              Mid Enterprise (3 ops @ 10 hrs)
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-sans text-zinc-300">
              <label htmlFor="team-size-slider" className="font-medium">Operators Performing Task</label>
              <span className="text-base font-mono font-semibold text-white">{teamSize} {teamSize === 1 ? 'operator' : 'operators'}</span>
            </div>
            <input
              id="team-size-slider"
              type="range"
              aria-label="Operators Performing Task"
              min={1}
              max={30}
              value={teamSize}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTeamSize(val);
                soundEngine.playTick(val / 30, 0.03);
              }}
              style={{
                background: `linear-gradient(to right, #00D8FF ${((teamSize - 1) / 29) * 100}%, rgba(255,255,255,0.12) ${((teamSize - 1) / 29) * 100}%)`,
              }}
              className="luxury-slider w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-sans text-zinc-300">
              <label htmlFor="hours-per-week-slider" className="font-medium">Task Frequency &amp; Hours Spent (Per Person / Week)</label>
              <span className="text-base font-mono font-semibold text-white">{hoursPerWeek} {hoursPerWeek === 1 ? 'hour' : 'hours'} / wk</span>
            </div>
            <input
              id="hours-per-week-slider"
              type="range"
              aria-label="Task Frequency & Hours Spent Per Person Per Week"
              min={1}
              max={40}
              value={hoursPerWeek}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setHoursPerWeek(val);
                soundEngine.playTick(val / 40, 0.03);
              }}
              style={{
                background: `linear-gradient(to right, #00D8FF ${((hoursPerWeek - 1) / 39) * 100}%, rgba(255,255,255,0.12) ${((hoursPerWeek - 1) / 39) * 100}%)`,
              }}
              className="luxury-slider w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-sans text-zinc-300">
              <label htmlFor="hourly-rate-slider" className="font-medium">Fully Loaded Hourly Labor Rate</label>
              <span className="text-base font-mono font-semibold text-white">${hourlyRate} / hr</span>
            </div>
            <input
              id="hourly-rate-slider"
              type="range"
              aria-label="Fully Loaded Hourly Labor Rate"
              min={15}
              max={200}
              value={hourlyRate}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setHourlyRate(val);
                soundEngine.playTick(val / 200, 0.03);
              }}
              style={{
                background: `linear-gradient(to right, #00D8FF ${((hourlyRate - 15) / 185) * 100}%, rgba(255,255,255,0.12) ${((hourlyRate - 15) / 185) * 100}%)`,
              }}
              className="luxury-slider w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm font-sans text-zinc-300">
              <label htmlFor="automation-coverage-slider" className="font-medium">Portion of Work Actually Automated</label>
              <span className="text-base font-mono font-semibold text-emerald-400">{automationCoverage}%</span>
            </div>
            <input
              id="automation-coverage-slider"
              type="range"
              aria-label="Portion of Work Actually Automated"
              min={10}
              max={100}
              step={5}
              value={automationCoverage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAutomationCoverage(val);
                soundEngine.playTick(val / 100, 0.03);
              }}
              style={{
                background: `linear-gradient(to right, #10B981 ${((automationCoverage - 10) / 90) * 100}%, rgba(255,255,255,0.12) ${((automationCoverage - 10) / 90) * 100}%)`,
              }}
              className="luxury-slider w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing"
            />
            <p className="text-sm font-sans text-zinc-400 mt-1 leading-relaxed">
              {automationCoverage === 100
                ? "Full replacement: 100% of task time is eliminated."
                : `Assisted automation: Saves ${automationCoverage}% of time, remaining ${(100 - automationCoverage)}% requires human touch.`}
            </p>
          </div>

          {/* Current Manual Labor Costs Summary in Liquid Glass */}
          <div className="backdrop-blur-2xl bg-white/[0.025] p-5 rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] font-sans text-sm space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Weekly Labor Cost:</span>
              <span className="text-white font-mono font-semibold">${weeklyLaborCostTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Monthly Labor Cost (52 wks / 12 mo):</span>
              <span className="text-white font-mono font-semibold">~${((weeklyLaborCostTotal * 52) / 12).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-2 border-t border-white/[0.08]">
              <span>Annual Labor Cost:</span>
              <span className="text-rose-400 font-mono font-semibold">${(weeklyLaborCostTotal * 52).toLocaleString()} / yr</span>
            </div>
          </div>
        </div>

        {/* Right Column: Automation Investment & ROI Yield (6 cols) */}
        <div
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="lg:col-span-6 tilt-card liquid-glass liquid-glass-cyan bg-white/[0.025] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_0_rgba(0,0,0,0.65),inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_0_20px_0_rgba(255,255,255,0.02)] hover:bg-white/[0.045] hover:border-white/[0.18] hover:shadow-[0_24px_56px_0_rgba(0,0,0,0.8),inset_0_1px_2px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-500 ease-out rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <span className="text-[11px] font-sans font-semibold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Automation Costs &amp; Net Arbitrage
            </span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-emerald-300 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              NET CALCULATOR
            </span>
          </div>

          {/* Investment Pricing Structure Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm font-sans">
              <div>
                <label htmlFor="one-time-cost-input" className="text-zinc-300 font-medium block mb-1.5">One-Time Build Cost ($)</label>
                <input
                  id="one-time-cost-input"
                  type="number"
                  min={0}
                  step={5}
                  value={oneTimeCost}
                  onChange={(e) => setOneTimeCost(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-white/[0.025] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white font-mono font-semibold text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="recurring-cost-input" className="text-zinc-300 font-medium block mb-1.5">Recurring Support ($ / Mo)</label>
                <input
                  id="recurring-cost-input"
                  type="number"
                  min={0}
                  step={25}
                  value={recurringMonthlyCost}
                  onChange={(e) => setRecurringMonthlyCost(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-white/[0.025] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white font-mono font-semibold text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-sm font-sans text-zinc-400 leading-relaxed">
              Accounts for one-time implementation plus any ongoing maintenance or proxy infrastructure fees.
            </p>
          </div>

          {/* Financial Breakdown Card in Liquid Glass */}
          <div className="backdrop-blur-2xl bg-white/[0.025] p-5 rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] space-y-3 font-sans text-sm">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Weekly Labor Saved:</span>
              <span className="text-white font-mono font-semibold">${weeklySavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Monthly Avoided Labor:</span>
              <span className="text-white font-mono font-semibold">~${monthlySavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Gross Annual Savings:</span>
              <span className="text-white font-mono font-semibold">${grossAnnualSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>First-Year Total Cost:</span>
              <span className="text-zinc-200 font-mono">${firstYearTotalInvestment.toLocaleString()}</span>
            </div>
            
            <div className="pt-2.5 border-t border-white/[0.08] flex justify-between items-center">
              <span className="text-emerald-400 font-medium">First-Year Net Savings:</span>
              <span className="text-2xl font-mono font-semibold text-emerald-400">
                {firstYearNetSavings >= 0 ? `+$${firstYearNetSavings.toLocaleString()}` : `-$${Math.abs(firstYearNetSavings).toLocaleString()}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.08]">
              <div className="bg-white/[0.025] p-3.5 rounded-xl border border-white/[0.08]">
                <span className="text-[10px] font-sans font-semibold text-zinc-400 uppercase tracking-[0.2em] block mb-0.5">First-Year ROI</span>
                <span className="text-base font-mono font-semibold text-emerald-400">
                  {firstYearTotalInvestment > 0 ? `${Math.round(firstYearRoi).toLocaleString()}%` : 'Infinite'}
                </span>
              </div>
              <div className="bg-white/[0.025] p-3.5 rounded-xl border border-white/[0.08]">
                <span className="text-[10px] font-sans font-semibold text-zinc-400 uppercase tracking-[0.2em] block mb-0.5">Payback Period</span>
                <span className="text-base font-mono font-semibold text-cyan-400">
                  {paybackWeeksText}
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Assumptions Footnote */}
          <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.08] text-sm font-sans text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium block mb-0.5">Formula Transparency:</span>
            Calculated across 52 weeks/year (monthly = 52/12 ≈ 4.33 weeks). First-year net savings deducts initial setup and annual recurring operations.
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={stitchSpring.snappy}
            onClick={handleDeploy}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-black font-sans font-semibold text-xs uppercase tracking-wider text-center transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 tactile-btn"
          >
            <span>Lock Architecture Scope &amp; Generate Intake Brief</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default PainPointArbitrage;

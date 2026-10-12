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
  // Input parameters
  const [teamSize, setTeamSize] = useState<number>(1);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(1);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [automationCoverage, setAutomationCoverage] = useState<number>(100); // 10% to 100%
  const [costModel, setCostModel] = useState<'fixed' | 'retainer'>('fixed');
  const [oneTimeCost, setOneTimeCost] = useState<number>(25);
  const [recurringMonthlyCost, setRecurringMonthlyCost] = useState<number>(0);

  // Exact mathematical calculations (matching the benchmark requirements)
  // Weekly labor cost bound to task = teamSize * hoursPerWeek * hourlyRate
  const weeklyLaborCostTotal = teamSize * hoursPerWeek * hourlyRate;
  
  // Savings based on actual percentage automated
  const weeklySavings = weeklyLaborCostTotal * (automationCoverage / 100);
  
  // Annual labor cost avoided = weekly savings * 52 weeks
  const grossAnnualSavings = weeklySavings * 52;
  
  // Monthly labor cost avoided = 52 weeks / 12 months
  const monthlySavings = grossAnnualSavings / 12;

  // Investment costs
  const annualOperatingExpenses = recurringMonthlyCost * 12;
  const firstYearTotalInvestment = oneTimeCost + annualOperatingExpenses;

  // First-year net savings = Gross annual savings - First year total investment
  const firstYearNetSavings = grossAnnualSavings - firstYearTotalInvestment;

  // First-year ROI % = (firstYearNetSavings / firstYearTotalInvestment) * 100
  const firstYearRoi = firstYearTotalInvestment > 0
    ? ((firstYearNetSavings / firstYearTotalInvestment) * 100)
    : 0;

  // Payback period in weeks: time required to recover initial one-time setup cost from weekly avoided labor
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
    <section id="roi-arbitrage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-surface-border">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: stitchEase }}
        className="mb-12"
      >
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-emerald-400 block mb-2 font-semibold">
          // TRANSPARENT ECONOMIC VALUE ARBITRAGE
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight text-balance">
          Automation ROI & <span className="font-serif italic font-normal text-neutral-400">Savings Calculator</span>
        </h2>
        <p className="text-sm font-mono text-neutral-400 max-w-2xl mt-2 text-pretty">
          Accurately calculate the tangible economic return of replacing repetitive manual workflows with custom software. No inflated theoretical metrics—just transparent labor accounting.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sliders for Manual Labor Inputs (6 cols) */}
        <div className="lg:col-span-6 tilt-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-400" /> 1. QUANTIFY CURRENT MANUAL TASK
            </span>
            <span className="text-[10px] font-mono text-neutral-500">LABOR VARIABLES</span>
          </div>

          {/* Preset Buttons for Instant Verification */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-400">Benchmarks:</span>
            <button
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
              className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-neutral-800 border border-surface-border text-[11px] font-mono text-neutral-200 transition-colors"
            >
              Low Frequency (1 hr/wk @ $25/hr)
            </button>
            <button
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
              className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-neutral-800 border border-surface-border text-[11px] font-mono text-neutral-200 transition-colors"
            >
              Mid Enterprise (3 ops @ 10 hrs)
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono text-neutral-300 mb-2">
              <span>Operators Performing Task</span>
              <span className="text-base font-bold text-white">{teamSize} {teamSize === 1 ? 'operator' : 'operators'}</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={teamSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setTeamSize(val);
                soundEngine.playTick(val / 30, 0.03);
              }}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-red-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono text-neutral-300 mb-2">
              <span>Task Frequency & Hours Spent (Per Person / Week)</span>
              <span className="text-base font-bold text-white">{hoursPerWeek} {hoursPerWeek === 1 ? 'hour' : 'hours'} / wk</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={hoursPerWeek}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setHoursPerWeek(val);
                soundEngine.playTick(val / 40, 0.03);
              }}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-red-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono text-neutral-300 mb-2">
              <span>Fully Loaded Hourly Labor Rate</span>
              <span className="text-base font-bold text-white">${hourlyRate} / hr</span>
            </div>
            <input
              type="range"
              min={15}
              max={200}
              value={hourlyRate}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setHourlyRate(val);
                soundEngine.playTick(val / 200, 0.03);
              }}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-red-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono text-neutral-300 mb-2">
              <span>Portion of Work Actually Automated</span>
              <span className="text-base font-bold text-emerald-400">{automationCoverage}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={automationCoverage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setAutomationCoverage(val);
                soundEngine.playTick(val / 100, 0.03);
              }}
              className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <p className="text-[11px] font-mono text-neutral-500 mt-1">
              {automationCoverage === 100
                ? "Full replacement: 100% of task time is eliminated."
                : `Assisted automation: Saves ${automationCoverage}% of time, remaining ${(100 - automationCoverage)}% requires human touch.`}
            </p>
          </div>

          {/* Current Manual Labor Costs Summary */}
          <div className="bg-void p-5 rounded-xl border border-red-500/30 font-mono text-xs space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>Weekly Labor Cost:</span>
              <span className="text-white font-bold">${weeklyLaborCostTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Monthly Labor Cost (52 wks / 12 mo):</span>
              <span className="text-white font-bold">~${((weeklyLaborCostTotal * 52) / 12).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400 pt-1 border-t border-white/5">
              <span>Annual Labor Cost:</span>
              <span className="text-red-400 font-bold text-sm">${(weeklyLaborCostTotal * 52).toLocaleString()} / yr</span>
            </div>
          </div>
        </div>

        {/* Right Column: Automation Investment & ROI Yield (6 cols) */}
        <div className="lg:col-span-6 tilt-card rounded-2xl p-6 sm:p-8 space-y-6 bg-gradient-to-b from-surface-card to-surface-elevated border-emerald-500/30">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. AUTOMATION COSTS & NET ARBITRAGE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              NET CALCULATOR
            </span>
          </div>

          {/* Investment Pricing Structure Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-neutral-400 block mb-1">One-Time Build Cost ($)</label>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={oneTimeCost}
                  onChange={(e) => setOneTimeCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-void border border-surface-border rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Recurring Support ($ / Mo)</label>
                <input
                  type="number"
                  min={0}
                  step={25}
                  value={recurringMonthlyCost}
                  onChange={(e) => setRecurringMonthlyCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-void border border-surface-border rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] font-mono text-neutral-500">
              Accounts for one-time implementation plus any ongoing maintenance or proxy fees.
            </p>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-void p-5 rounded-xl border border-surface-border space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-neutral-400">
              <span>Weekly Labor Saved:</span>
              <span className="text-white font-bold">${weeklySavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>Monthly Avoided Labor:</span>
              <span className="text-white font-bold">~${monthlySavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>Gross Annual Savings:</span>
              <span className="text-white font-bold">${grossAnnualSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>First-Year Total Cost:</span>
              <span className="text-neutral-300">${firstYearTotalInvestment.toLocaleString()}</span>
            </div>
            
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-emerald-400 font-bold">First-Year Net Savings:</span>
              <span className="text-xl font-display font-bold text-emerald-400">
                {firstYearNetSavings >= 0 ? `+$${firstYearNetSavings.toLocaleString()}` : `-$${Math.abs(firstYearNetSavings).toLocaleString()}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-border/60">
              <div className="bg-surface-elevated p-3 rounded-lg border border-surface-border">
                <span className="text-[10px] text-neutral-500 uppercase block mb-0.5">First-Year ROI</span>
                <span className="text-base font-bold text-emerald-400">
                  {firstYearTotalInvestment > 0 ? `${Math.round(firstYearRoi).toLocaleString()}%` : 'Infinite'}
                </span>
              </div>
              <div className="bg-surface-elevated p-3 rounded-lg border border-surface-border">
                <span className="text-[10px] text-neutral-500 uppercase block mb-0.5">Payback Period</span>
                <span className="text-base font-bold text-cyan-400">
                  {paybackWeeksText}
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Assumptions Footnote */}
          <div className="p-3.5 rounded-lg bg-surface-elevated border border-surface-border/60 text-[11px] font-sans text-neutral-400 leading-relaxed">
            <span className="font-mono text-neutral-300 font-semibold block mb-0.5">Formula Transparency:</span>
            Calculated across 52 weeks/year (monthly = 52/12 ≈ 4.33 weeks). First-year net savings deducts initial setup and annual recurring operations. Payback reflects time required to recover one-time capital from avoided labor.
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={stitchSpring.snappy}
            onClick={handleDeploy}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-lg hover:shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 tactile-btn"
          >
            <span>Lock Architecture Scope & Generate Intake Brief</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default PainPointArbitrage;

import React, { useState, useEffect } from 'react';
import bwiseLogo from '../assets/bwiseLogo.png';
import { ArrowRight, LayoutGrid, Sparkles, ShieldAlert, Users, FileCheck, Wallet, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

const PHASES = {
  assistant: [
    { num: 'Phase 1', title: 'Foundation', desc: 'User creation via POST /v1/users, KYC flow integration, and onboarding state tracking.' },
    { num: 'Phase 2', title: 'Core build', desc: 'Chat UI wired to kyc/status and transactions/{smartWalletId} for real-time answers.' },
    { num: 'Phase 3', title: 'AI layer', desc: 'LLM prompts with transactions + KYC status. Intent detection and adaptive onboarding.' },
    { num: 'Phase 4', title: 'Polish', desc: 'Proactive nudges, multi-turn memory, and tone tuning for non-technical owners.' },
  ],
  fraud: [
    { num: 'Phase 1', title: 'Foundation', desc: 'Register webhooks for near real-time transaction events instead of polling.' },
    { num: 'Phase 2', title: 'Core build', desc: 'Baseline behavior profiles and rule-based flags (5x normal size, new merchant, etc).' },
    { num: 'Phase 3', title: 'AI layer', desc: 'Anomaly-detection model trained on history. Real-time scoring on each webhook event.' },
    { num: 'Phase 4', title: 'Polish', desc: 'Push alerts + optional auto-freeze card. False-positive feedback loop to retrain.' },
  ],
  payroll: [
    { num: 'Phase 1', title: 'Foundation', desc: 'Employee invite flow via POST /v1/partners/employees/invite and status tracking.' },
    { num: 'Phase 2', title: 'Core build', desc: 'Card issuance, spending limits, funding from main wallet, and admin dashboard.' },
    { num: 'Phase 3', title: 'AI layer', desc: 'Cash-flow-aware payroll suggestions and per-employee spend anomaly detection.' },
    { num: 'Phase 4', title: 'Polish', desc: 'Offboarding flows, employee self-service view, and admin freeze/unfreeze controls.' },
  ],
  tax: [
    { num: 'Phase 1', title: 'Foundation', desc: 'Receipt generation via POST /v1/users/{id}/transactions/receipt/pdf and DB linking.' },
    { num: 'Phase 2', title: 'Core build', desc: 'Category/tag system with manual override for deductible vs non-deductible.' },
    { num: 'Phase 3', title: 'AI layer', desc: 'Auto-tagging with jurisdiction-aware rules and receipt auto-attachment.' },
    { num: 'Phase 4', title: 'Polish', desc: 'Year-end PDF/CSV export and missing-receipt flags.' },
  ],
  accounts: [
    { num: 'Phase 1', title: 'Foundation', desc: 'Labeling model in DB: walletId mapped to purpose tags (payroll, inventory, tax).' },
    { num: 'Phase 2', title: 'Core build', desc: 'UI to create labeled sub-accounts via POST .../smart-wallets/create-managed.' },
    { num: 'Phase 3', title: 'AI layer', desc: 'Auto-suggest deposit routing and low-balance alerts ahead of payroll dates.' },
    { num: 'Phase 4', title: 'Polish', desc: 'Wallet-to-wallet transfers and automated percentage-based routing rules.' },
  ],
};

const ROADMAP = [
  { num: 1, title: 'Employee payroll cards', desc: 'Fully supported today, clearest business value', tag: 'Ready', tagClass: 'text-green-500 bg-green-500/10' },
  { num: 2, title: 'Spending summaries + leak detection', desc: 'Core cash visibility promise', tag: 'Ready', tagClass: 'text-green-500 bg-green-500/10' },
  { num: 3, title: 'AI financial assistant', desc: 'Conversational layer on top of #2 data', tag: 'LLM', tagClass: 'text-[#AF01AF] bg-[#AF01AF]/10' },
  { num: 4, title: 'Fraud detection', desc: 'Needs webhook + history from #2', tag: 'Webhook', tagClass: 'text-amber-500 bg-amber-500/10' },
  { num: 5, title: 'Tax / expense prep', desc: 'Needs categorisation from #2', tag: 'Review', tagClass: 'text-amber-500 bg-amber-500/10' },
  { num: 6, title: 'Labeled wallets', desc: 'UX layer, ships incrementally', tag: 'UX', tagClass: 'text-green-500 bg-green-500/10' },
  { num: 7, title: 'Restock predictor', desc: 'Blocked until inventory data source chosen', tag: 'V2', tagClass: 'text-gray-400 bg-gray-400/10', muted: true },
];

const NAV_ITEMS = [
  { label: 'Assistant', id: 'assistant' },
  { label: 'Summaries', id: 'summaries' },
  { label: 'Fraud', id: 'fraud' },
  { label: 'Payroll', id: 'payroll' },
  { label: 'Tax', id: 'tax' },
  { label: 'Accounts', id: 'accounts' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_ITEMS.map((item) => item.id);
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-[#333333] w-full overflow-x-hidden bg-[#1a0a1a]">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#1a0a1a]/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer">
            <img src={bwiseLogo} alt="B-Wise" className="h-10 w-auto object-contain" />
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-[13px]">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`transition-colors cursor-pointer ${
                  activeSection === item.id ? 'text-[#AF01AF] font-medium' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchDashboard}
              className="hidden sm:block text-[13px] text-gray-300 hover:text-white transition-colors cursor-pointer font-medium"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchDashboard}
              className="text-[13px] bg-[#AF01AF] hover:bg-[#8F018F] text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md hover:scale-105 cursor-pointer flex items-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#1a0a1a] via-[#0d040d] to-[#1a0a1a] text-white text-center px-6 pt-28 pb-24 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#AF01AF]/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/5 w-[400px] h-[400px] bg-[#AF01AF]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-[#AF01AF]/15 border border-[#AF01AF]/30 text-purple-200 text-[13px] px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#DFFF4F]" />
            <span>Built for BMoni AI Hackathon 2026</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Smarter business banking,<br />
            <span className="text-[#AF01AF] bwise-glare-text">powered by AI Copilot</span>
          </h1>

          <p className="text-[17px] text-gray-300 max-w-[580px] mx-auto leading-relaxed mb-8 font-medium">
            B-Wise is an AI-powered financial companion for Nigerian SMEs. Track cash flow, manage payroll, detect fraud, and prep taxes seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center justify-center gap-2 border border-[#DFFF4F]/20"
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Open Business Dashboard</span>
            </button>
            <button
              onClick={() => scrollTo('assistant')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white px-6 py-4 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Phone Mockup */}
          <div className="relative w-full max-w-[720px] h-[540px] mx-auto" style={{ perspective: '1200px' }}>
            <div className="absolute top-4 left-0 md:-left-8 lg:left-0 z-20 animate-float">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[165px] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">₦</div>
                  <span className="text-[11px] text-gray-400">Cash Flow</span>
                </div>
                <div className="text-xl font-bold text-white">₦2.4M</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-semibold">+12% this month</div>
              </div>
            </div>

            <div className="absolute top-8 right-0 md:-right-8 lg:right-0 z-20 animate-float" style={{ animationDelay: '1s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[175px] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#AF01AF]/30 flex items-center justify-center text-[#AF01AF]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-gray-400">AI Insight</span>
                </div>
                <div className="text-lg font-bold text-white">Restock soon</div>
                <div className="text-[11px] text-amber-400 mt-1 font-semibold">Inventory low</div>
              </div>
            </div>

            <div className="absolute top-[42%] -left-12 md:-left-20 lg:-left-12 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[155px] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">$</div>
                  <span className="text-[11px] text-gray-400">Spending</span>
                </div>
                <div className="text-xl font-bold text-white">₦845K</div>
                <div className="text-[11px] text-red-400 mt-1 font-semibold">+8% vs last month</div>
              </div>
            </div>

            <div className="absolute top-[38%] -right-12 md:-right-20 lg:-right-12 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[155px] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-gray-400">Payroll</span>
                </div>
                <div className="text-xl font-bold text-white">₦450K</div>
                <div className="text-[11px] text-gray-400 mt-1">Due in 3 days</div>
              </div>
            </div>

            {/* Central Phone Mockup Container */}
            <div className="absolute left-1/2 top-1/2 z-10" style={{ transform: 'translate(-50%, -50%) rotateX(4deg)' }}>
              <div className="relative w-[280px] h-[520px] bg-[#1a1a1a] rounded-[44px] p-[10px] shadow-[0_0_0_2px_#333,0_25px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(175,1,175,0.25)] border border-[#AF01AF]/30">
                <div className="w-full h-full bg-black rounded-[36px] overflow-hidden relative text-left">
                  <div className="w-full h-full bg-gradient-to-br from-[#0d0d0d] via-[#1a0a1a] to-[#0d0d0d] pt-8 px-4 pb-6 flex flex-col gap-3">
                    <div className="text-center mt-2">
                      <div className="text-[11px] text-gray-400 tracking-wide font-medium">Total Operating Balance</div>
                      <div className="text-[28px] font-black text-white tracking-tight">₦2,438,920</div>
                      <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                        +₦284,000 (13.2%)
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button onClick={onLaunchDashboard} className="flex-1 bg-[#AF01AF] text-white rounded-xl py-2 text-center text-xs font-bold cursor-pointer hover:bg-[#8F018F]">
                        Open Dashboard
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-[#AF01AF]/20 to-[#AF01AF]/5 border border-[#AF01AF]/30 rounded-xl p-3 mt-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 bg-[#AF01AF] rounded-full flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-[11px] text-[#AF01AF] font-bold">Ask B-AI Copilot</div>
                          <div className="text-xs text-white leading-snug font-medium">Should I restock inventory this week?</div>
                          <div className="text-[10px] text-gray-400 mt-1">Based on cash flow, yes — wait 2 days for payout.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="relative px-6 py-16 overflow-hidden bg-[#120712] border-y border-white/5">
        <div className="relative z-10 max-w-[720px] mx-auto">
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-[#AF01AF]/30 px-5 py-2.5 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold text-gray-300">Powered by BMoni Embedded API & Gemini AI</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '6', label: 'AI Modules' },
              { num: 'NGN/USD', label: 'Multi-Currency' },
              { num: '24/7', label: 'Fraud Shield' },
              { num: '0', label: 'Hidden Fees' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-2xl font-black text-[#DFFF4F]">{s.num}</div>
                <div className="text-xs text-gray-400 mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 01: ASSISTANT */}
      <section id="assistant" className="relative px-6 py-24 bg-[#1a0a1a] text-left">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-extrabold text-[#AF01AF] uppercase tracking-widest border border-[#AF01AF]/30 bg-[#AF01AF]/10 px-4 py-1.5 rounded-full mb-4">
              Feature 01
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              AI Financial Copilot
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto mt-3">
              Conversational AI powered by Gemini that answers questions about cash flow, explains KYC status in plain language, and generates real-time forecasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASES.assistant.map((p) => (
              <div key={p.num} className="bg-[#0d040d] border border-white/10 rounded-2xl p-6 hover:border-[#AF01AF]/40 transition-all">
                <span className="text-[10px] font-black text-white uppercase bg-[#AF01AF] px-2.5 py-1 rounded-full">{p.num}</span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">{p.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 02: SUMMARIES */}
      <section id="summaries" className="relative px-6 py-24 bg-[#120712] text-left">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Smart Spending Insights
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto mt-3">
              Turn raw transaction logs into actionable business intelligence with live charts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a0a1a] border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-[#AF01AF] rounded-full flex items-center justify-center text-white mb-6">
                <LayoutGrid className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Spending Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Automatically categorize every transaction and visualize cash flows across all accounts.
              </p>
            </div>

            <div className="bg-[#1a0a1a] border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-[#AF01AF] rounded-full flex items-center justify-center text-white mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Pattern Recognition</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Detect recurring payments, flag unexpected supplier price jumps, and spot duplicate charges.
              </p>
            </div>

            <div className="bg-[#1a0a1a] border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-[#AF01AF] rounded-full flex items-center justify-center text-white mb-6">
                <ArrowRight className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Restock & Cash Alerts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Get proactive notifications when inventory levels dip or vendor payments are due.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 03: FRAUD */}
      <section id="fraud" className="relative px-6 py-24 bg-[#1a0a1a] text-left">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-extrabold text-red-400 uppercase tracking-widest border border-red-500/30 bg-red-500/10 px-4 py-1.5 rounded-full mb-4">
              Feature 03
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Real-Time Fraud Detection
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto mt-3">
              Webhook-powered anomaly detection that flags suspicious card activity before it impacts your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASES.fraud.map((p) => (
              <div key={p.num} className="bg-[#0d040d] border border-red-500/20 rounded-2xl p-6">
                <span className="text-[10px] font-black text-white uppercase bg-red-600 px-2.5 py-1 rounded-full">{p.num}</span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">{p.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 04: PAYROLL */}
      <section id="payroll" className="relative px-6 py-24 bg-[#120712] text-left">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-extrabold text-[#DFFF4F] uppercase tracking-widest border border-[#DFFF4F]/30 bg-[#DFFF4F]/10 px-4 py-1.5 rounded-full mb-4">
              Feature 04
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Employee Payroll & Cards
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto mt-3">
              Issue team cards, set custom spending limits, and execute payroll directly from smart wallets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-[#DFFF4F] mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Invite & Onboard</h3>
              <p className="text-xs text-gray-400">Send employee invites and link company spending accounts in seconds.</p>
            </div>
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 text-center">
              <Wallet className="w-8 h-8 text-[#DFFF4F] mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Virtual Expense Cards</h3>
              <p className="text-xs text-gray-400">Issue sub-wallets with hardware or software spending caps.</p>
            </div>
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 text-center">
              <Sparkles className="w-8 h-8 text-[#DFFF4F] mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Automated Timing</h3>
              <p className="text-xs text-gray-400">Cash-flow aware recommendations ensure payroll runs safely on schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 05: TAX */}
      <section id="tax" className="relative px-6 py-24 bg-[#1a0a1a] text-left">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-extrabold text-emerald-400 uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 rounded-full mb-4">
              Feature 05
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Tax Prep & Receipt PDF Matcher
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto mt-3">
              Automatically tag tax-deductible expenses and generate audit-ready receipts for accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASES.tax.map((p) => (
              <div key={p.num} className="bg-[#0d040d] border border-emerald-500/20 rounded-2xl p-6">
                <span className="text-[10px] font-black text-white uppercase bg-emerald-600 px-2.5 py-1 rounded-full">{p.num}</span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">{p.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 06: ACCOUNTS */}
      <section id="accounts" className="relative px-6 py-24 bg-[#120712] text-left">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-extrabold text-[#AF01AF] uppercase tracking-widest border border-[#AF01AF]/30 bg-[#AF01AF]/10 px-4 py-1.5 rounded-full mb-4">
              Feature 06
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Purpose-Driven Sub-Accounts
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto mt-3">
              Isolate funds into designated vaults (Tax, Payroll, Inventory) under a single profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PHASES.accounts.slice(0, 3).map((p) => (
              <div key={p.title} className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MVP ROADMAP */}
      <section id="roadmap" className="relative px-6 py-24 bg-[#1a0a1a]">
        <div className="max-w-3xl mx-auto text-left">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Hackathon Build Roadmap
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Prioritized by API readiness and business impact.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {ROADMAP.map((item) => (
              <div key={item.num} className="bg-[#0d040d] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                    0{item.num}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${item.tagClass}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="cta" className="relative px-6 py-20 bg-gradient-to-b from-[#1a0a1a] to-[#0d040d] border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <img src={bwiseLogo} alt="B-Wise" className="h-10 mx-auto mb-6 object-contain" />
          <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Ready to test the B-Wise Copilot?</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-lg mx-auto">
            Experience real-time AI treasury management, instant transfers, and intelligent expense prep.
          </p>
          <button
            onClick={onLaunchDashboard}
            className="inline-flex items-center gap-2 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-xl hover:scale-105 cursor-pointer border border-[#DFFF4F]/30"
          >
            <span>Launch B-Wise App</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 text-center bg-[#0a030a] border-t border-white/5 text-xs text-gray-500">
        B-Wise · BMoni AI Hackathon 2026 · Built with React, TypeScript & Vite
      </footer>
    </div>
  );
};

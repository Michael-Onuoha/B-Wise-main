import { useState, useEffect } from 'react';
import bwiseLogo from './assets/bwiseLogo.png';

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
    { num: 'Phase 1', title: 'Foundation', desc: 'Labeling model in your DB: walletId mapped to purpose tags (payroll, inventory, tax).' },
    { num: 'Phase 2', title: 'Core build', desc: 'UI to create labeled sub-accounts via POST .../smart-wallets/create-managed.' },
    { num: 'Phase 3', title: 'AI layer', desc: 'Auto-suggest deposit routing and low-balance alerts ahead of payroll dates.' },
    { num: 'Phase 4', title: 'Polish', desc: 'Wallet-to-wallet transfers and automated percentage-based routing rules.' },
  ],
};

const ROADMAP = [
  { num: 1, title: 'Employee payroll cards', desc: 'Fully supported today, clearest business value', tag: 'Ready', tagClass: 'text-green-500 bg-green-500/10' },
  { num: 2, title: 'Spending summaries + leak detection', desc: 'Core cash visibility promise', tag: 'Ready', tagClass: 'text-green-500 bg-green-500/10' },
  { num: 3, title: 'AI financial assistant', desc: 'Conversational layer on top of #2 data', tag: 'LLM', tagClass: 'text-bwise-purple bg-bwise-purple/10' },
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

function SectionLabel({ children }) {
  return <div className="text-xs text-bwise-purple font-medium uppercase tracking-[2px] mb-3">{children}</div>;
}

function PhaseGrid({ phases }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      {phases.map((p) => (
        <div key={p.num} className="bg-white/60 border border-gray-200 rounded-xl p-4 hover:border-bwise-purple/30 transition-colors">
          <div className="text-[11px] text-bwise-purple font-medium uppercase tracking-wider mb-1">{p.num}</div>
          <div className="text-sm font-medium text-bwise-dark mb-1">{p.title}</div>
          <div className="text-[13px] text-gray-500 leading-snug">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_ITEMS.map(item => item.id);
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-bwise-dark w-full overflow-x-hidden">
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bwise-darkbg/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center">
            <img src={bwiseLogo} alt="B-Wise" className="h-[3.75rem] w-auto " />
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-[13px]">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`transition-colors ${
                  activeSection === item.id ? 'text-bwise-purple font-medium' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-[13px] text-gray-400 hover:text-white transition-colors">Login</button>
            <button 
              onClick={() => scrollTo('cta')}
              className="text-[13px] bg-bwise-purple text-white px-4 py-2 rounded-lg font-medium hover:bg-bwise-purple/90 transition-colors"
            >
              Try Demo
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-bwise-darkbg to-bwise-darkbgdeep text-white text-center px-6 pt-28 pb-24 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-bwise-purple/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/5 w-[400px] h-[400px] bg-bwise-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bwise-purple/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-bwise-purple/15 border border-bwise-purple/30 text-purple-200 text-[13px] px-4 py-2 rounded-full mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Built for BMoni AI Hackathon 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-medium leading-[1.05] tracking-tight mb-5">
            Smarter business banking,<br />
            <span className="text-bwise-purple">powered by AI</span>
          </h1>
          <p className="text-[17px] text-gray-400 max-w-[520px] mx-auto leading-relaxed mb-16">
            B-Wise is an AI-powered financial companion for Nigerian SMEs. Track cash, manage payroll, detect fraud, and prep taxes.
          </p>

          <div className="relative w-full max-w-[720px] h-[600px] mx-auto" style={{ perspective: '1200px' }}>

            <div className="absolute top-4 left-0 md:-left-8 lg:left-0 z-20 animate-float">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[165px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><path d="M12 2v20M2 12h20"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-400">Cash flow</span>
                </div>
                <div className="text-xl font-semibold text-white">₦2.4M</div>
                <div className="text-[11px] text-green-400 mt-1 font-medium">+12% this month</div>
              </div>
            </div>

            <div className="absolute top-8 right-0 md:-right-8 lg:right-0 z-20 animate-float" style={{ animationDelay: '1s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[175px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-bwise-purple/30 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AF01AF" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 15v-4m0-4h.01"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-400">AI insight</span>
                </div>
                <div className="text-lg font-semibold text-white">Restock soon</div>
                <div className="text-[11px] text-amber-400 mt-1 font-medium">Inventory low</div>
              </div>
            </div>

            <div className="absolute top-[42%] -left-12 md:-left-20 lg:-left-12 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[155px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-400">Spending</span>
                </div>
                <div className="text-xl font-semibold text-white">₦845K</div>
                <div className="text-[11px] text-red-400 mt-1 font-medium">+8% vs last month</div>
              </div>
            </div>

            <div className="absolute top-[38%] -right-12 md:-right-20 lg:-right-12 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[155px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-400">Payroll</span>
                </div>
                <div className="text-xl font-semibold text-white">₦450K</div>
                <div className="text-[11px] text-gray-400 mt-1">Due in 3 days</div>
              </div>
            </div>

            <div className="absolute bottom-24 left-0 md:-left-4 lg:left-4 z-20 animate-float" style={{ animationDelay: '2s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[160px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-400">Tax saved</span>
                </div>
                <div className="text-xl font-semibold text-white">₦128K</div>
                <div className="text-[11px] text-green-400 mt-1 font-medium">Deductibles tagged</div>
              </div>
            </div>

            <div className="absolute bottom-20 right-0 md:-right-4 lg:right-4 z-20 animate-float" style={{ animationDelay: '0.8s' }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[165px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-400">Fraud alert</span>
                </div>
                <div className="text-lg font-semibold text-white">Blocked</div>
                <div className="text-[11px] text-red-400 mt-1 font-medium">Suspicious txn flagged</div>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 z-10" style={{ transform: 'translate(-50%, -50%) rotateX(5deg) rotateY(-2deg)' }}>
              <div className="relative w-[290px] h-[580px] bg-[#1a1a1a] rounded-[48px] p-[10px] shadow-[0_0_0_2px_#333,0_25px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(175,1,175,0.15)]">
                <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-[#333] rounded-l-sm" />
                <div className="absolute -left-[3px] top-36 w-[3px] h-12 bg-[#333] rounded-l-sm" />
                <div className="absolute -right-[3px] top-28 w-[3px] h-16 bg-[#333] rounded-r-sm" />

                <div className="w-full h-full bg-black rounded-[38px] overflow-hidden relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0f3] opacity-40" />
                  </div>

                  <div className="w-full h-full bg-gradient-to-br from-[#0d0d0d] via-[#1a0a1a] to-[#0d0d0d] pt-12 px-4 pb-6 flex flex-col gap-3 overflow-hidden">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] text-gray-500 font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="opacity-60"><path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11.53-.29-.71C20.66 4.78 16.54 3 12 3z"/></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="opacity-60"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                      </div>
                    </div>

                    <div className="text-center mt-1">
                      <div className="text-[11px] text-gray-500 mb-1 tracking-wide">Total balance</div>
                      <div className="text-[30px] font-semibold text-white tracking-tight">₦2,438,920</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><path d="M7 17l5-5 5 5M7 7l5 5 5-5"/></svg>
                        <span className="text-xs text-green-400 font-medium">+₦284,000 (13.2%)</span>
                      </div>
                    </div>

                    <div className="w-full h-[90px] mt-1 relative">
                      <svg viewBox="0 0 240 80" preserveAspectRatio="none" className="w-full h-full">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#AF01AF" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#AF01AF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,60 Q30,55 60,40 T120,35 T180,20 T240,10" fill="none" stroke="#AF01AF" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M0,60 Q30,55 60,40 T120,35 T180,20 T240,10 V80 H0 Z" fill="url(#chartGrad)" />
                        <circle cx="60" cy="40" r="3" fill="#AF01AF" />
                        <circle cx="120" cy="35" r="3" fill="#AF01AF" />
                        <circle cx="180" cy="20" r="3" fill="#AF01AF" />
                        <circle cx="240" cy="10" r="4" fill="#AF01AF" stroke="white" strokeWidth="1.5" />
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-gray-600 px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                      {[
                        { label: 'Send', icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
                        { label: 'Receive', icon: 'M7 17l5 5 5-5M7 12l5 5 5-5M7 7l5 5 5-5' },
                        { label: 'Payroll', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87' },
                      ].map((a) => (
                        <div key={a.label} className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl py-2.5 flex flex-col items-center gap-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AF01AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={a.icon} />
                          </svg>
                          <span className="text-[10px] text-gray-400">{a.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-bwise-purple/20 to-bwise-purple/5 border border-bwise-purple/20 rounded-xl p-3 mt-1">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 bg-bwise-purple rounded-full flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(175,1,175,0.4)]">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] text-bwise-purple font-medium mb-0.5">B-Wise AI</div>
                          <div className="text-xs text-white leading-snug">Should I restock inventory this week?</div>
                          <div className="text-[10px] text-gray-500 mt-1">Based on cash flow, yes — but wait 2 days.</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-1">
                      <div className="text-[11px] text-gray-500 mb-2 text-left">Recent</div>
                      <div className="flex flex-col gap-2">
                        {[
                          { name: 'Supplier Payment', amt: '-₦120,000', color: 'text-red-400', time: '2h ago' },
                          { name: 'Sales Revenue', amt: '+₦350,000', color: 'text-green-400', time: '5h ago' },
                        ].map((t) => (
                          <div key={t.name} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                              </div>
                              <div className="text-left">
                                <div className="text-[11px] text-white">{t.name}</div>
                                <div className="text-[9px] text-gray-600">{t.time}</div>
                              </div>
                            </div>
                            <span className={`text-[11px] font-medium ${t.color}`}>{t.amt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
            {/* TRUST BAR — ENHANCED WITH ANIMATIONS */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-bwise-darkbg via-[#2a1a2a] to-white pointer-events-none" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-bwise-purple/20 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[720px] mx-auto">
          {/* Badge — more pop */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-bwise-purple/20 px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(175,1,175,0.15)] hover:shadow-[0_8px_30px_rgba(175,1,175,0.25)] transition-shadow duration-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-gray-600">Powered by BMoni Embedded API</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '5', label: 'AI features', suffix: '' },
              { num: '₦', label: 'NGN native', suffix: '' },
              { num: '24', label: 'Fraud watch', suffix: '/7' },
              { num: '0', label: 'Hidden fees', suffix: '' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(175,1,175,0.12)] cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease forwards`,
                  animationDelay: `${0.2 + i * 0.15}s`,
                  opacity: 0,
                }}
              >
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-bwise-purple rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="text-[32px] font-bold text-bwise-dark group-hover:text-bwise-purple transition-colors duration-300">
                  {s.num}
                  <span className="text-[20px]">{s.suffix}</span>
                </div>
                <div className="text-[13px] text-gray-500 mt-2 font-medium group-hover:text-gray-700 transition-colors duration-300">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add this to your index.css or a <style> tag for the animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* FEATURE: ASSISTANT */}
            {/* FEATURE: ASSISTANT — BOLD DARK SECTION */}
      <section id="assistant" className="relative px-6 py-28 bg-[#1a0a1a] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-bwise-purple/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-bwise-purple/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <span className="inline-block text-[11px] font-semibold text-bwise-purple uppercase tracking-[3px] border border-bwise-purple/30 bg-bwise-purple/10 px-4 py-1.5 rounded-full">
              Feature 01
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 tracking-tight leading-[1.1]">
            AI Financial<br />
            <span className="text-bwise-purple">Assistant</span>
          </h2>
          
          <p className="text-[17px] text-gray-400 text-center max-w-2xl mx-auto leading-relaxed mb-16">
            A conversational AI that helps business owners onboard, understand KYC rejections in plain language, and get real-time answers about their cash flow. It pulls live transaction data from BMoni and never leaves the owner guessing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASES.assistant.map((p) => (
              <div
                key={p.num}
                className="group relative bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-8 transition-all duration-300 hover:scale-[1.03] hover:border-bwise-purple/40 hover:shadow-[0_20px_50px_rgba(175,1,175,0.15)] cursor-default"
              >
                <div className="absolute -top-3 left-8">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-bwise-purple px-3 py-1 rounded-full">
                    {p.num}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mt-3 mb-3 group-hover:text-bwise-purple transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors duration-300">
                  {p.desc}
                </p>
                
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-bwise-purple/5 rotate-45 transform origin-top-right group-hover:bg-bwise-purple/10 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE: SUMMARIES — DARK CARD GRID WITH HOVER ZOOM */}
      <section id="summaries" className="relative px-6 py-24 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-semibold text-bwise-dark mb-4 tracking-tight">
              Smart spending insights
            </h2>
            <p className="text-[16px] text-gray-500 leading-relaxed max-w-xl mx-auto">
              Turn raw transaction data into actionable business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group bg-[#1a0a1a] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[380px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-5 leading-snug">
                Spending Intelligence
              </h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Automatically categorize every transaction by merchant and amount. Generate weekly and monthly summaries with visual dashboards that show exactly where your money goes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#1a0a1a] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[380px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-5 leading-snug">
                Pattern Recognition
              </h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Detect recurring charges, spot trend changes like "marketing spend up 40% this month," and flag forgotten subscriptions or duplicate charges before they drain your account.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#1a0a1a] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[380px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-5 leading-snug">
                AI-Powered Advice
              </h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                Ask questions in plain language — "How much did I spend on inventory in June?" — and get instant answers. One-tap LLM calls use your latest financial summary as context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE: FRAUD */}
            {/* FEATURE: FRAUD — WHITE BOLD UNIQUE */}
      <section id="fraud" className="relative px-6 py-28 bg-white overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 mb-16">
            <div className="flex-1">
              <span className="inline-block text-[11px] font-semibold text-red-500 uppercase tracking-[3px] border border-red-200 bg-red-50 px-4 py-1.5 rounded-full mb-6">
                Feature 03
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-bwise-dark mb-6 tracking-tight leading-[1.1]">
                Real-time<br />
                <span className="text-red-500">Fraud Detection</span>
              </h2>
              <p className="text-[17px] text-gray-500 leading-relaxed max-w-lg">
                Webhook-powered anomaly detection that learns what "normal" looks like for your business. Flags suspicious activity before it hurts.
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="inline-flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-6 py-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-bwise-dark">Threat Level</div>
                  <div className="text-xs text-red-500 font-medium">Monitoring 24/7</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASES.fraud.map((p) => (
              <div
                key={p.num}
                className="group relative bg-gray-50 border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:border-red-200 hover:shadow-[0_12px_40px_rgba(239,68,68,0.08)] cursor-default"
              >
                <div className="absolute -top-3 left-8">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-red-500 px-3 py-1 rounded-full">
                    {p.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-bwise-dark mt-3 mb-3 group-hover:text-red-500 transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE: PAYROLL */}
            {/* FEATURE: PAYROLL — DARK CARD FORMAT */}
      <section id="payroll" className="relative px-6 py-24 bg-[#1a0a1a] overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-bwise-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-bwise-purple/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] font-semibold text-bwise-purple uppercase tracking-[3px] border border-bwise-purple/30 bg-bwise-purple/10 px-4 py-1.5 rounded-full mb-6">
              Feature 04
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Employee payroll cards
            </h2>
            <p className="text-[16px] text-gray-400 leading-relaxed max-w-xl mx-auto">
              Issue cards, set limits, and run payroll directly from your business wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-[#0d0d0d] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[320px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">Invite & Onboard</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">Send invites via POST /v1/partners/employees/invite. Employees link their own BMoni accounts and accept in one tap.</p>
            </div>

            <div className="group bg-[#0d0d0d] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[320px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">Issue & Control</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">Create cards per employee with custom spending limits. Fund them instantly from your main business wallet.</p>
            </div>

            <div className="group bg-[#0d0d0d] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[320px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">AI Payroll Timing</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">Get cash-flow-aware suggestions on safe payroll amounts and optimal timing so you never overextend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE: TAX */}
            {/* FEATURE: TAX — WHITE BOLD UNIQUE */}
      <section id="tax" className="relative px-6 py-28 bg-white overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-8 md:gap-16 mb-16">
            <div className="flex-1 text-left md:text-right">
              <span className="inline-block text-[11px] font-semibold text-emerald-600 uppercase tracking-[3px] border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-full mb-6">
                Feature 05
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-bwise-dark mb-6 tracking-tight leading-[1.1]">
                Tax &<br />
                <span className="text-emerald-600">Expense Prep</span>
              </h2>
              <p className="text-[17px] text-gray-500 leading-relaxed max-w-lg ml-auto">
                Auto-tag deductible transactions, match receipts to payments, and generate year-end reports ready for your accountant.
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-bwise-dark">Tax Saved</div>
                  <div className="text-xs text-emerald-600 font-medium">₦128K deducted</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PHASES.tax.map((p) => (
              <div
                key={p.num}
                className="group relative bg-gray-50 border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-200 hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] cursor-default"
              >
                <div className="absolute -top-3 left-8">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-emerald-500 px-3 py-1 rounded-full">
                    {p.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-bwise-dark mt-3 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE: ACCOUNTS */}
            {/* FEATURE: ACCOUNTS — DARK CARD FORMAT */}
      <section id="accounts" className="relative px-6 py-24 bg-[#1a0a1a] overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-bwise-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-bwise-purple/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] font-semibold text-bwise-purple uppercase tracking-[3px] border border-bwise-purple/30 bg-bwise-purple/10 px-4 py-1.5 rounded-full mb-6">
              Feature 06
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Labeled account types
            </h2>
            <p className="text-[16px] text-gray-400 leading-relaxed max-w-xl mx-auto">
              Purpose-driven wallets under one profile. Auto-route payments by rule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-[#0d0d0d] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[320px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">Label & Organize</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">Map wallet IDs to purpose tags — Payroll, Inventory, Tax — stored in your own DB layer on top of BMoni.</p>
            </div>

            <div className="group bg-[#0d0d0d] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[320px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">Auto-Routing</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">AI suggests which account deposits should route to, based on transaction description and merchant patterns.</p>
            </div>

            <div className="group bg-[#0d0d0d] rounded-[32px] p-10 text-center transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_64px_rgba(175,1,175,0.25)] cursor-default min-h-[320px] flex flex-col">
              <div className="w-16 h-16 bg-bwise-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(175,1,175,0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">Low-Balance Alerts</h3>
              <p className="text-[14px] text-gray-400 leading-relaxed">Get warned when a labeled account like "Payroll" is running low ahead of a known payroll date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      {/* ROADMAP — TIMELINE FORMAT */}
<section id="roadmap" className="relative px-6 py-28 bg-[#1a0a1a] overflow-hidden">
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-bwise-purple/10 rounded-full blur-[150px] pointer-events-none" />

  <div className="max-w-3xl mx-auto relative z-10">
    <div className="text-center mb-16">
      <span className="inline-block text-[11px] font-semibold text-bwise-purple uppercase tracking-[3px] border border-bwise-purple/30 bg-bwise-purple/10 px-4 py-1.5 rounded-full mb-6">
        MVP Roadmap
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        Suggested build order
      </h2>
      <p className="text-[16px] text-gray-400 leading-relaxed max-w-xl mx-auto">
        Prioritised by API readiness, business value, and dependency chains.
      </p>
    </div>

    <div className="relative">
      {/* Connecting vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-bwise-purple via-white/10 to-transparent" />

      <div className="flex flex-col gap-4">
        {ROADMAP.map((item, i) => {
          const statusColor =
            item.tag === 'Ready' ? { dot: 'bg-emerald-400', ring: 'ring-emerald-400/30', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30' } :
            item.tag === 'LLM' ? { dot: 'bg-bwise-purple', ring: 'ring-bwise-purple/30', text: 'text-bwise-purple', badge: 'bg-bwise-purple/10 border-bwise-purple/30' } :
            item.tag === 'UX' ? { dot: 'bg-blue-400', ring: 'ring-blue-400/30', text: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/30' } :
            item.muted ? { dot: 'bg-gray-500', ring: 'ring-gray-500/20', text: 'text-gray-500', badge: 'bg-gray-500/10 border-gray-500/20' } :
            { dot: 'bg-amber-400', ring: 'ring-amber-400/30', text: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/30' };

          return (
            <div key={item.num} className="relative flex items-start gap-5 group">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full bg-[#0d0d0d] border-2 ${item.muted ? 'border-gray-700' : 'border-white/10'} flex items-center justify-center ring-4 ${statusColor.ring} transition-all group-hover:ring-8`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${statusColor.dot}`} />
                </div>
              </div>

              {/* Card */}
              <div className={`flex-1 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 transition-all duration-300 group-hover:border-white/20 group-hover:translate-x-1 ${item.muted ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono text-gray-600">0{item.num}</span>
                      <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColor.badge} ${statusColor.text}`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>

      {/* CTA */}
      <section id="cta" className="relative px-6 pt-16 pb-20 bg-gradient-to-b from-gray-50 to-bwise-darkbg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-bwise-purple/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-[640px] mx-auto relative z-10">
          <div className="bg-gradient-to-br from-bwise-darkbg to-[#2d0a2d] border border-bwise-purple/30 rounded-[20px] p-12 px-8 text-center text-white shadow-[0_20px_60px_rgba(175,1,175,0.15)]">
            <img src={bwiseLogo} alt="B-Wise" className="h-8 mx-auto mb-6 " />
            <h2 className="text-[28px] font-medium mb-3">Ready to build smarter?</h2>
            <p className="text-[15px] text-gray-400 mb-6">
              B-Wise combines BMoni's embedded financial infrastructure with intelligent AI to give Nigerian SMEs the clarity they need to grow.
            </p>
            <button className="inline-flex items-center gap-2 bg-bwise-purple text-white px-7 py-3.5 rounded-[10px] text-[15px] font-medium hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(175,1,175,0.3)] transition-all duration-200">
              <span>View integration plan</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 text-center bg-bwise-darkbg border-t border-white/10 text-[13px] text-gray-500">
        <img src={bwiseLogo} alt="B-Wise" className="h-5 mx-auto mb-3  opacity-60" />
        B-Wise · BMoni AI Hackathon 2026 · Built with React, Vite & Tailwind CSS
      </footer>
    </div>
  );
}
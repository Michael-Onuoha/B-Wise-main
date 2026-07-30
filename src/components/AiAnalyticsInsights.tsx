import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  Box,
  Clock,
  ArrowRight,
  RefreshCw,
  PieChart,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  X,
  Zap,
  DollarSign
} from 'lucide-react';

interface AiAnalyticsInsightsProps {
  onOpenAskBAI: (initialPrompt?: string) => void;
}

export const AiAnalyticsInsights: React.FC<AiAnalyticsInsightsProps> = ({ onOpenAskBAI }) => {
  const [selectedAdvice, setSelectedAdvice] = useState<{ title: string; advice: string; category: string } | null>(null);
  const [reorderStatus, setReorderStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [activeFilter, setActiveFilter] = useState<'all' | 'leaks' | 'fraud' | 'restock'>('all');

  const fraudAlerts = [
    {
      id: 'f1',
      type: 'Duplicate Charge',
      merchant: 'SaaS Cloud Hosting Inc',
      amount: '$149.00',
      date: 'Today at 02:14 PM',
      severity: 'high',
      description: 'Two identical charges of $149.00 detected within 3 minutes of each other.',
      advice: 'We recommend requesting an immediate charge reversal via BMoni dispute API or contacting SaaS Cloud Support.'
    },
    {
      id: 'f2',
      type: 'Unusual Geo Location',
      merchant: 'Digital Ocean London Node',
      amount: '$420.50',
      date: 'Yesterday at 11:45 PM',
      severity: 'medium',
      description: 'Transaction originated from un-whitelisted IP subnet outside primary operating region.',
      advice: 'Review API key authorization settings and enable IP restriction policies on your BMoni embedded developer dashboard.'
    }
  ];

  const spendingLeaks = [
    {
      id: 'l1',
      title: 'Unused Design Software Seats',
      monthlyCost: '$180/mo',
      annualImpact: '$2,160/yr',
      recommendation: '3 out of 8 licensed seats have had zero activity for 45 consecutive days.',
      potentialSavings: '$67.50/mo'
    },
    {
      id: 'l2',
      title: 'Redundant Cloud Storage Plans',
      monthlyCost: '$95/mo',
      annualImpact: '$1,140/yr',
      recommendation: 'Overlap detected between AWS S3 storage tier and Google Cloud Storage bucket.',
      potentialSavings: '$45.00/mo'
    },
    {
      id: 'l3',
      title: 'Un-Optimized Foreign Wire Fees',
      monthlyCost: '$210/mo',
      annualImpact: '$2,520/yr',
      recommendation: 'Switching cross-border USD payments to BMoni CNGN Smart Wallet settlement saves 1.8% per transfer.',
      potentialSavings: '$140.00/mo'
    }
  ];

  const handleReorderInventory = () => {
    setReorderStatus('processing');
    setTimeout(() => {
      setReorderStatus('done');
      setTimeout(() => setReorderStatus('idle'), 3500);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & AI Advice Banner */}
      <div className="bg-gradient-to-r from-[#3B1053] to-[#2F0B43] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#DFFF4F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-[#DFFF4F] text-[#3B1053] text-xs font-black uppercase rounded-full tracking-wider">
                AI Financial Copilot
              </span>
              <span className="text-white/60 text-xs font-semibold">Real-time Spend Intelligence</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">AI Summaries, Fraud Protection & Optimization</h2>
            <p className="text-white/70 text-sm max-w-xl">
              Automated leak detection, restock timing forecasts, and transaction anomaly monitoring for your BMoni smart accounts.
            </p>
          </div>

          <button
            onClick={() => onOpenAskBAI('Perform a full AI health check on my spend leaks and restock timing.')}
            className="flex items-center gap-2.5 px-5 py-3 bg-[#DFFF4F] text-[#3B1053] hover:bg-[#cbe646] font-extrabold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 fill-[#3B1053]" />
            <span>Get AI Executive Advice</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
          {[
            { id: 'all', label: 'All AI Signals' },
            { id: 'leaks', label: 'Spending Leaks ($252/mo saved)' },
            { id: 'fraud', label: 'Fraud Detection (2 Alerts)' },
            { id: 'restock', label: 'Restock Forecast (9 Days Left)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-white text-[#3B1053] shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Restock Timing Predictor & Fraud Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restock Timing Predictor */}
        {(activeFilter === 'all' || activeFilter === 'restock') && (
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1C1C1E]">Restock Timing Predictor</h3>
                    <p className="text-xs text-[#8E8E93]">Inventory burn rate & automated reorder forecast</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedAdvice({
                      title: 'Inventory Restock Strategy',
                      category: 'Restock Predictor',
                      advice:
                        'Based on sales velocity over the past 14 days, your inventory for "SKU-8820 Packaging Units" will deplete in 9 days. Ordering today avoids a potential $1,800 stockout loss.'
                    })
                  }
                  className="px-3 py-1.5 bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-[#DFFF4F] text-[#1C1C1E] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Get Advice</span>
                </button>
              </div>

              {/* Inventory Burn Gauge */}
              <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 rounded-2xl p-4 border border-amber-200/60 space-y-3 mb-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-amber-800 font-bold block">Estimated Days Remaining</span>
                    <span className="text-3xl font-black text-amber-900">9 Days</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#8E8E93] font-medium block">Stock Velocity</span>
                    <span className="text-sm font-extrabold text-amber-700">42 units/day</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-amber-200/80 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-[28%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-amber-800 font-semibold">
                    <span>Current: 378 units</span>
                    <span>Reorder Point: 300 units</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#3A3A3C]">
                <div className="flex items-center justify-between p-2.5 bg-[#F9F9FB] rounded-xl">
                  <span className="text-[#8E8E93] font-medium">Recommended Reorder Batch:</span>
                  <span className="font-extrabold text-[#1C1C1E]">1,200 Units (~₦450,000 / CNGN)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#F9F9FB] rounded-xl">
                  <span className="text-[#8E8E93] font-medium">Optimal Order Date:</span>
                  <span className="font-extrabold text-emerald-600">July 31, 2026 (In 2 days)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F2F2F7] flex items-center justify-between">
              <span className="text-xs text-[#8E8E93]">Auto-settle via BMoni Inventory Vault</span>
              <button
                onClick={handleReorderInventory}
                disabled={reorderStatus !== 'idle'}
                className="px-4 py-2 bg-[#1C1C1E] hover:bg-[#3B1053] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                {reorderStatus === 'processing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing BMoni Order...</span>
                  </>
                ) : reorderStatus === 'done' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFFF4F]" />
                    <span>Inventory Reorder Sent!</span>
                  </>
                ) : (
                  <>
                    <span>1-Click Reorder Inventory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* AI Fraud & Anomaly Protection */}
        {(activeFilter === 'all' || activeFilter === 'fraud') && (
          <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1C1C1E]">AI Fraud & Anomaly Flags</h3>
                    <p className="text-xs text-[#8E8E93]">Autonomous payment risk monitoring</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-full">
                  2 Active Warnings
                </span>
              </div>

              <div className="space-y-3">
                {fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl bg-[#F9F9FB] border border-rose-100 hover:border-rose-300 transition-colors space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span className="text-xs font-extrabold text-[#1C1C1E]">{alert.type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold uppercase">
                          {alert.severity} Risk
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-rose-600">{alert.amount}</span>
                    </div>

                    <p className="text-xs text-[#3A3A3C] leading-relaxed">{alert.description}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#8E8E93]">{alert.date}</span>
                      <button
                        onClick={() =>
                          setSelectedAdvice({
                            title: `Advice for ${alert.type}`,
                            category: 'Fraud Protection',
                            advice: alert.advice
                          })
                        }
                        className="text-xs font-bold text-[#3B1053] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                        <span>Get AI Advice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#F2F2F7] flex justify-end">
              <button
                onClick={() => onOpenAskBAI('Analyze all my merchant charges for suspicious or duplicate billing.')}
                className="text-xs font-extrabold text-[#3B1053] hover:text-[#2F0B43] cursor-pointer flex items-center gap-1.5"
              >
                <span>Run Full Fraud Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spending Leak Detection Section */}
      {(activeFilter === 'all' || activeFilter === 'leaks') && (
        <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#3B1053] flex items-center justify-center font-bold">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1C1C1E]">Spending Leak Detection & Optimization</h3>
                <p className="text-xs text-[#8E8E93]">Visual breakdown of redundant SaaS subscriptions & fees</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">Identified Savings</span>
                <span className="text-base font-black text-emerald-700">$252.50 / Month ($3,030 / Yr)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spendingLeaks.map((leak) => (
              <div
                key={leak.id}
                className="p-5 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA] flex flex-col justify-between hover:border-[#3B1053]/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-extrabold text-[#1C1C1E] group-hover:text-[#3B1053] transition-colors">
                      {leak.title}
                    </h4>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                      Save {leak.potentialSavings}
                    </span>
                  </div>

                  <p className="text-xs text-[#3A3A3C] leading-relaxed">{leak.recommendation}</p>

                  <div className="space-y-1 text-[11px] pt-1">
                    <div className="flex justify-between text-[#8E8E93]">
                      <span>Current Monthly:</span>
                      <span className="font-bold text-[#1C1C1E]">{leak.monthlyCost}</span>
                    </div>
                    <div className="flex justify-between text-[#8E8E93]">
                      <span>Annualized Leak:</span>
                      <span className="font-bold text-rose-600">{leak.annualImpact}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedAdvice({
                      title: leak.title,
                      category: 'Spending Leak',
                      advice: `Optimization steps for ${leak.title}:\n\n1. Downgrade unused plan tiers.\n2. Consolidate redundant tooling into single enterprise seats.\n3. Estimated instant reduction: ${leak.potentialSavings}.`
                    })
                  }
                  className="mt-4 pt-3 border-t border-[#E5E5EA] text-xs font-bold text-[#3B1053] flex items-center justify-between group-hover:underline cursor-pointer"
                >
                  <span>Get Advice</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advice Drawer Modal */}
      {selectedAdvice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-lg w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedAdvice(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#8B5CF6]">
                  {selectedAdvice.category}
                </span>
                <h3 className="text-lg font-extrabold text-[#1C1C1E]">{selectedAdvice.title}</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA] text-xs text-[#3A3A3C] leading-relaxed whitespace-pre-wrap font-sans">
              {selectedAdvice.advice}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAdvice(null)}
                className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-xs font-bold rounded-xl cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  const prompt = `Give me detailed execution steps for ${selectedAdvice.title}`;
                  setSelectedAdvice(null);
                  onOpenAskBAI(prompt);
                }}
                className="px-4 py-2 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask B-AI Copilot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

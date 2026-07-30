import { useState } from 'react';
import bwiseLogo from '../assets/bwiseLogo.png';

export default function Dashboard({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(2438920);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your B-Wise AI Financial Assistant connected to your BMoni accounts. How can I help you optimize your business cash flow today?' },
    { sender: 'user', text: 'Can I safely run ₦450,000 payroll this Friday?' },
    { sender: 'ai', text: 'Based on your current balance (₦2.43M) and projected receivables of ₦350,000 by Thursday, yes! After ₦450k payroll, your remaining buffer will be ₦2.33M, which comfortably covers your ₦120k supplier invoice due next week.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  // Transactions state
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Mainland Electronics Dist.', category: 'Inventory', amount: -120000, date: 'Today, 2:15 PM', status: 'Completed', deductible: true, merchant: 'Mainland Dist.' },
    { id: 2, name: 'Paystack Payout (POS Sales)', category: 'Revenue', amount: 350000, date: 'Today, 9:30 AM', status: 'Completed', deductible: false, merchant: 'Paystack' },
    { id: 3, name: 'AWS Cloud Services', category: 'Software & IT', amount: -45000, date: 'Yesterday', status: 'Completed', deductible: true, merchant: 'Amazon Web Services' },
    { id: 4, name: 'Unknown POS Merchant Ikeja', category: 'Uncategorized', amount: -85000, date: 'Yesterday', status: 'Flagged', deductible: false, merchant: 'POS Ikeja', flagged: true },
    { id: 5, name: 'Ikeja Electric Utility', category: 'Utilities', amount: -28500, date: 'Jul 28, 2026', status: 'Completed', deductible: true, merchant: 'IKEDC' },
    { id: 6, name: 'Client Invoice: TechCorp', category: 'Revenue', amount: 820000, date: 'Jul 26, 2026', status: 'Completed', deductible: false, merchant: 'TechCorp NG' },
  ]);

  // Employee Payroll Cards state
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Chidi Okonkwo', role: 'Sales Manager', cardNo: '•••• 4892', limit: 150000, spent: 42000, status: 'Active' },
    { id: 2, name: 'Amina Bello', role: 'Operations Lead', cardNo: '•••• 7120', limit: 250000, spent: 180000, status: 'Active' },
    { id: 3, name: 'Tunde Bakare', role: 'Field Representative', cardNo: '•••• 3091', limit: 100000, spent: 89000, status: 'Frozen' }
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpLimit, setNewEmpLimit] = useState('');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);

  // Labeled Wallets
  const [wallets, setWallets] = useState([
    { id: 'main', name: 'Main Business Wallet', balance: 1438920, tag: 'Primary', color: 'bg-[#AF01AF]' },
    { id: 'payroll', name: 'Payroll Reserve', balance: 500000, tag: 'Automated', color: 'bg-emerald-600' },
    { id: 'tax', name: 'Tax & VAT Vault', balance: 350000, tag: 'Locked', color: 'bg-amber-600' },
    { id: 'inventory', name: 'Inventory & Restock', balance: 150000, tag: 'Flexible', color: 'bg-blue-600' }
  ]);

  // Quick Notification Banner State
  const [notification, setNotification] = useState(null);
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Chat Submission Handler
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setAiTyping(true);

    setTimeout(() => {
      let reply = "I analyzed your latest BMoni financial feed. ";
      const lower = userMsg.toLowerCase();
      if (lower.includes('tax') || lower.includes('deduct')) {
        reply += "You currently have ₦193,500 in tagged deductible business expenses for Q3. This projects to save you approximately ₦58,050 in corporate income tax!";
      } else if (lower.includes('restock') || lower.includes('inventory')) {
        reply += "Inventory wallet has ₦150,000 available. Based on sales velocity, restocking Mainland Electronics components by Thursday is recommended before supplier prices increase.";
      } else if (lower.includes('fraud') || lower.includes('flag')) {
        reply += "You have 1 flagged transaction (₦85,000 POS charge at Ikeja). I recommend keeping Tunde's card frozen until verified.";
      } else {
        reply += `Your current net cash balance is ₦${balance.toLocaleString()}. All accounts are healthy with 0 critical payment bottlenecks.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setAiTyping(false);
    }, 1000);
  };

  // Toggle Card Freeze
  const toggleEmployeeCard = (id) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'Active' ? 'Frozen' : 'Active';
        showToast(`${e.name}'s card is now ${nextStatus.toLowerCase()}`);
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  // Add Employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpName || !newEmpRole) return;
    const newEmp = {
      id: Date.now(),
      name: newEmpName,
      role: newEmpRole,
      cardNo: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      limit: Number(newEmpLimit) || 100000,
      spent: 0,
      status: 'Active'
    };
    setEmployees(prev => [...prev, newEmp]);
    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpLimit('');
    setShowAddEmpModal(false);
    showToast(`Issued new payroll card for ${newEmp.name}`);
  };

  // Toggle Tax Deductible Status
  const toggleDeductible = (id) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const updated = !t.deductible;
        showToast(`Transaction tagged as ${updated ? 'Tax Deductible' : 'Non-Deductible'}`);
        return { ...t, deductible: updated };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0d040d] text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#AF01AF] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* TOP DASHBOARD NAVIGATION BAR */}
      <header className="bg-[#1a0a1a]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBackToHome} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-medium bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Landing Page
          </button>
          <div className="h-5 w-[1px] bg-white/10" />
          <img src={bwiseLogo} alt="B-Wise" className="h-8 w-auto" />
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Lagos Electronics Ltd • BMoni API</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-[11px] text-gray-400">Total Net Liquidity</div>
            <div className="text-sm font-bold text-emerald-400">₦{balance.toLocaleString()}</div>
          </div>
          <button 
            onClick={() => showToast('Refreshed live BMoni telemetry data!')}
            className="bg-[#AF01AF] hover:bg-[#AF01AF]/90 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(175,1,175,0.4)] flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 4.1-10.74L2.5 8"/></svg>
            Sync BMoni
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDE NAVIGATION TABS */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider px-3 mb-1">Navigation</div>
            {[
              { id: 'overview', label: 'Overview & Insights', icon: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3' },
              { id: 'assistant', label: 'AI Financial Assistant', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', badge: 'Live AI' },
              { id: 'payroll', label: 'Employee Payroll & Cards', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
              { id: 'fraud', label: 'Fraud Watch & Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', alert: true },
              { id: 'tax', label: 'Tax & Expense Prep', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
              { id: 'wallets', label: 'Labeled Account Wallets', icon: 'M20 7h-7L10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#AF01AF] text-white shadow-[0_4px_20px_rgba(175,1,175,0.3)]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={tab.icon}/></svg>
                  <span>{tab.label}</span>
                </div>
                {tab.badge && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">{tab.badge}</span>}
                {tab.alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
              </button>
            ))}
          </div>

          {/* Quick Metrics Card */}
          <div className="bg-gradient-to-br from-[#1a0a1a] to-[#250d25] border border-[#AF01AF]/30 rounded-2xl p-4 text-xs">
            <div className="text-gray-400 text-[11px] mb-1">BMoni Account Status</div>
            <div className="text-white font-semibold text-sm mb-3">Verified • Tier 3 Business</div>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Volume</span>
                <span className="font-medium text-white">₦8.4M / ₦20M</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#AF01AF] h-full w-[42%]" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 pt-1">
                <span>Webhook Health: 99.9%</span>
                <span className="text-emerald-400">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT DISPLAY AREA */}
        <div className="lg:col-span-9 flex flex-col gap-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                  <div className="text-xs text-gray-400 mb-1">Total Available Cash</div>
                  <div className="text-2xl font-bold text-white mb-2">₦{balance.toLocaleString()}</div>
                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17l5-5 5 5M7 7l5 5 5-5"/></svg>
                    +13.2% vs last month
                  </div>
                </div>

                <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                  <div className="text-xs text-gray-400 mb-1">Est. Q3 Tax Deductions</div>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">₦193,500</div>
                  <div className="text-xs text-gray-400">6 transactions tagged</div>
                </div>

                <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                  <div className="text-xs text-gray-400 mb-1">Security & Fraud Watch</div>
                  <div className="text-2xl font-bold text-amber-400 mb-2">1 Flagged</div>
                  <div className="text-xs text-red-400 font-medium">Action required in Ikeja POS</div>
                </div>
              </div>

              {/* Cash Flow Visual Chart Simulation */}
              <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white">Cash Flow Analytics (BMoni Feed)</h3>
                    <p className="text-xs text-gray-400">Real-time revenue vs operational outflow</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-3 py-1 rounded-lg bg-[#AF01AF]/20 text-[#AF01AF] border border-[#AF01AF]/30 font-medium">Weekly</span>
                    <span className="px-3 py-1 rounded-lg bg-white/5 text-gray-400">Monthly</span>
                  </div>
                </div>

                <div className="h-44 w-full relative flex items-end gap-3 pt-6 border-b border-white/10 pb-2">
                  {[
                    { day: 'Mon', income: 60, expense: 30 },
                    { day: 'Tue', income: 85, expense: 45 },
                    { day: 'Wed', income: 40, expense: 90 },
                    { day: 'Thu', income: 110, expense: 50 },
                    { day: 'Fri', income: 95, expense: 35 },
                    { day: 'Sat', income: 130, expense: 40 },
                    { day: 'Sun', income: 75, expense: 20 },
                  ].map(item => (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div style={{ height: `${item.income}%` }} className="w-3 bg-emerald-500 rounded-t-sm shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        <div style={{ height: `${item.expense}%` }} className="w-3 bg-[#AF01AF] rounded-t-sm shadow-[0_0_10px_rgba(175,1,175,0.3)]" />
                      </div>
                      <span className="text-[10px] text-gray-400">{item.day}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                    <span>Inflow / Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#AF01AF]" />
                    <span>Outflow / Expenses</span>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#AF01AF]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="pb-3 font-medium">Merchant / Description</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium text-right">Tax Deductible</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions
                        .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(t => (
                          <tr key={t.id} className="hover:bg-white/[0.02]">
                            <td className="py-3 font-medium text-white flex items-center gap-2">
                              {t.flagged && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                              {t.name}
                            </td>
                            <td className="py-3 text-gray-400">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300 border border-white/10">{t.category}</span>
                            </td>
                            <td className="py-3 text-gray-400">{t.date}</td>
                            <td className={`py-3 font-semibold ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                              {t.amount > 0 ? `+₦${t.amount.toLocaleString()}` : `-₦${Math.abs(t.amount).toLocaleString()}`}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => toggleDeductible(t.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                                  t.deductible
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-gray-500 border border-white/10 hover:text-white'
                                }`}
                              >
                                {t.deductible ? '✓ Tagged Deductible' : '+ Tag Expense'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI ASSISTANT */}
          {activeTab === 'assistant' && (
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 flex flex-col h-[600px]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#AF01AF] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(175,1,175,0.5)]">
                    AI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">B-Wise Intelligent Financial Copilot</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live LLM Prompting over BMoni KYC & Txn Data
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatMessages([{ sender: 'ai', text: 'Chat history cleared. How can B-Wise assist your business today?' }])}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear History
                </button>
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#AF01AF] text-white rounded-tr-none'
                        : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-gray-400 rounded-2xl p-3 text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#AF01AF] animate-ping" />
                      Analyzing business accounts & generating insight...
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Quick Questions */}
              <div className="flex flex-wrap gap-2 pt-3 pb-2 border-t border-white/10">
                {[
                  'Should I restock inventory now?',
                  'What is my tax saving projection?',
                  'Check for suspicious charges'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q); }}
                    className="text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1 rounded-full border border-white/10 transition-colors"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Ask B-Wise anything about your cash flow, taxes, or payroll..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#AF01AF]"
                />
                <button
                  type="submit"
                  className="bg-[#AF01AF] hover:bg-[#AF01AF]/90 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-[0_0_15px_rgba(175,1,175,0.4)]"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PAYROLL & CARDS */}
          {activeTab === 'payroll' && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Employee Corporate Cards</h3>
                  <p className="text-xs text-gray-400">Issued via BMoni Partner API • Managed spend limits</p>
                </div>
                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className="bg-[#AF01AF] text-white text-xs px-4 py-2 rounded-xl font-medium hover:bg-[#AF01AF]/90 transition-all shadow-[0_0_15px_rgba(175,1,175,0.3)] flex items-center gap-1.5"
                >
                  + Issue New Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {employees.map(emp => (
                  <div key={emp.id} className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm font-bold text-white">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.role}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {emp.status}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-gray-900 to-black p-3.5 rounded-xl border border-white/10 mb-4 font-mono text-xs">
                      <div className="text-gray-500 text-[10px] mb-1">BMoni Business Debit</div>
                      <div className="text-white tracking-widest">{emp.cardNo}</div>
                    </div>

                    <div className="space-y-1 text-xs mb-4">
                      <div className="flex justify-between text-gray-400">
                        <span>Spent / Limit</span>
                        <span className="text-white font-medium">₦{emp.spent.toLocaleString()} / ₦{emp.limit.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.min(100, (emp.spent/emp.limit)*100)}%` }} className="bg-[#AF01AF] h-full" />
                      </div>
                    </div>

                    <button
                      onClick={() => toggleEmployeeCard(emp.id)}
                      className={`w-full py-2 rounded-xl text-xs font-medium transition-all ${
                        emp.status === 'Active'
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {emp.status === 'Active' ? 'Freeze Card' : 'Unfreeze Card'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Employee Modal */}
              {showAddEmpModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#1a0a1a] border border-white/20 rounded-2xl p-6 max-w-md w-full">
                    <h3 className="text-base font-bold text-white mb-4">Issue Employee Payroll Card</h3>
                    <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
                      <div>
                        <label className="text-gray-400 mb-1 block">Employee Full Name</label>
                        <input
                          type="text"
                          required
                          value={newEmpName}
                          onChange={e => setNewEmpName(e.target.value)}
                          placeholder="e.g. Babatunde Fashola"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#AF01AF]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 mb-1 block">Role / Department</label>
                        <input
                          type="text"
                          required
                          value={newEmpRole}
                          onChange={e => setNewEmpRole(e.target.value)}
                          placeholder="e.g. Senior Logistics Officer"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#AF01AF]"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 mb-1 block">Monthly Spend Limit (₦)</label>
                        <input
                          type="number"
                          required
                          value={newEmpLimit}
                          onChange={e => setNewEmpLimit(e.target.value)}
                          placeholder="150000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#AF01AF]"
                        />
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddEmpModal(false)}
                          className="flex-1 bg-white/10 text-gray-300 py-2.5 rounded-xl font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-[#AF01AF] text-white py-2.5 rounded-xl font-medium shadow-[0_0_15px_rgba(175,1,175,0.4)]"
                        >
                          Issue Card
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FRAUD WATCH */}
          {activeTab === 'fraud' && (
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    Real-time Webhook Anomaly Detection
                  </h3>
                  <p className="text-xs text-gray-400">Monitoring 24/7 for unusual spending spikes or new merchant IDs</p>
                </div>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1 rounded-full font-bold">
                  High Alert Mode Active
                </span>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-white text-sm mb-1">Flagged Transaction Detected</div>
                  <div className="text-gray-300 mb-2">
                    <span className="font-semibold text-white">₦85,000</span> charged at <span className="underline">Unknown POS Merchant Ikeja</span> via Tunde Bakare&apos;s card (3x higher than average transaction size).
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => showToast('Card frozen & transaction disputed with BMoni')} className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                      Freeze Card & Dispute
                    </button>
                    <button onClick={() => showToast('Marked as legitimate business transaction')} className="bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
                      Approve Transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TAX PREP */}
          {activeTab === 'tax' && (
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Tax & Expense Deductibles</h3>
                  <p className="text-xs text-gray-400">Jurisdiction-aware rules for Nigerian Tax Compliance</p>
                </div>
                <button
                  onClick={() => showToast('Generated Tax CSV & PDF Export for Accountant!')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  📥 Export Year-End Report (PDF/CSV)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Estimated Tax Savings (Q3)</div>
                  <div className="text-2xl font-bold text-emerald-400">₦58,050</div>
                  <div className="text-[11px] text-gray-400 mt-1">From ₦193,500 in verified tax deductible expenses</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Missing Receipts</div>
                  <div className="text-2xl font-bold text-amber-400">2 Items</div>
                  <div className="text-[11px] text-gray-400 mt-1">AWS & Ikeja Electric receipt auto-attachment pending</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LABELED WALLETS */}
          {activeTab === 'wallets' && (
            <div className="bg-[#1a0a1a] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Purpose-Driven Labeled Wallets</h3>
                  <p className="text-xs text-gray-400">Managed smart sub-accounts mapped to business functions</p>
                </div>
                <button onClick={() => showToast('Opened new managed sub-account modal')} className="bg-[#AF01AF] text-white text-xs px-3.5 py-2 rounded-xl font-medium">
                  + Create Sub-Account
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wallets.map(w => (
                  <div key={w.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${w.color}`} />
                        <span className="text-sm font-bold text-white">{w.name}</span>
                      </div>
                      <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded">{w.tag}</span>
                    </div>
                    <div className="text-xl font-bold text-white mb-3">₦{w.balance.toLocaleString()}</div>
                    <div className="flex gap-2">
                      <button onClick={() => showToast(`Deposit routed to ${w.name}`)} className="flex-1 bg-white/10 hover:bg-white/20 text-gray-200 py-1.5 rounded-lg text-xs font-medium">
                        Transfer Funds
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

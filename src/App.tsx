import React, { useState, useMemo } from 'react';
import { Sparkles, LayoutGrid, List, Users, FileCheck, Wallet, Check, X, Clock, ChevronDown, ArrowRight, RefreshCw, Plus, Home } from 'lucide-react';
import { AskBAIDrawer } from './components/AskBAIDrawer';
import { AccountOverview } from './components/AccountOverview';
import { Sidebar } from './components/Sidebar';
import { AiAnalyticsInsights } from './components/AiAnalyticsInsights';
import { EmployeePayroll } from './components/EmployeePayroll';
import { TaxExpensePrep } from './components/TaxExpensePrep';
import { MultiAccountVaults } from './components/MultiAccountVaults';
import { PaymentVolumeChart } from './components/PaymentVolumeChart';
import { QuickTransfer } from './components/QuickTransfer';
import { TransactionHistory } from './components/TransactionHistory';
import { Transaction, Recipient, TransactionStatus } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_RECIPIENTS, CURRENCIES } from './data/mockData';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { LandingPage } from './components/LandingPage';

type TabId = 'overview' | 'ai_analytics' | 'payroll' | 'tax_prep' | 'vaults' | 'transactions';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [recipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);

  const [isAskBAIOpen, setIsAskBAIOpen] = useState<boolean>(false);
  const [aiPromptOverride, setAiPromptOverride] = useState<string | undefined>(undefined);

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isAddTxOpen, setIsAddTxOpen] = useState<boolean>(false);

  const handleOpenAskBAI = (prompt?: string) => {
    setAiPromptOverride(prompt);
    setIsAskBAIOpen(true);
  };

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (selectedTx?.id === id) setSelectedTx(null);
  };

  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTx?.id === id) setSelectedTx({ ...selectedTx, status: newStatus });
  };

  if (viewMode === 'landing') {
    return <LandingPage onLaunchDashboard={() => setViewMode('dashboard')} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] flex font-sans antialiased text-[#1C1C1E]">
      <Sidebar
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as TabId)}
        onNavigateLanding={() => setViewMode('landing')}
      />

      <div className="flex-1 p-5 xl:p-8 flex flex-col bg-[#F5F5F7] max-w-[1700px] mx-auto w-full min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {[
              { id: 'overview' as TabId, label: 'Dashboard & Wallet', icon: LayoutGrid },
              { id: 'ai_analytics' as TabId, label: 'AI Analytics & Forecast', icon: Sparkles },
              { id: 'payroll' as TabId, label: 'Employee Payroll', icon: Users },
              { id: 'tax_prep' as TabId, label: 'Tax Prep & Receipts', icon: FileCheck },
              { id: 'vaults' as TabId, label: 'Purpose Accounts', icon: Wallet },
              { id: 'transactions' as TabId, label: 'Transactions', icon: List, dataAttr: 'tx-tab' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  data-tutorial={(tab as any).dataAttr}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                    isActive
                      ? 'bg-[#3B1053] text-[#DFFF4F] shadow-xs'
                      : 'bg-white text-[#1C1C1E] hover:bg-[#EDEDF0] border border-[#E5E5EA]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              data-tutorial="ask-bai"
              onClick={() => handleOpenAskBAI()}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <div className="w-4 h-4 rounded-md bg-[#DFFF4F] text-[#3B1053] flex items-center justify-center">
                <Sparkles className="w-3 h-3 fill-[#3B1053] text-[#3B1053]" />
              </div>
              <span>Ask B-AI Copilot</span>
            </button>

            <div data-tutorial="profile-pill" className="hidden sm:flex items-center gap-3 pl-2 border-l border-[#E5E5EA]">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] flex-shrink-0 border-2 border-white shadow-xs">
                <svg viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="14" r="8" fill="#FDBA74" />
                  <path d="M6 34C6 26 11 22 18 22C25 22 30 26 30 34" fill="#FDBA74" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#1C1C1E] leading-tight">Michael Onuoha</div>
                <div className="text-[11px] text-[#8E8E93] leading-tight font-semibold">Admin</div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <AccountOverview
            onOpenAskBAI={() => handleOpenAskBAI()}
            onNavigateToTransfers={() => setActiveTab('transactions')}
            transactions={transactions}
          />
        )}

        {activeTab === 'ai_analytics' && (
          <AiAnalyticsInsights onOpenAskBAI={handleOpenAskBAI} transactions={transactions} />
        )}

        {activeTab === 'payroll' && <EmployeePayroll onOpenAskBAI={handleOpenAskBAI} />}
        {activeTab === 'tax_prep' && <TaxExpensePrep onOpenAskBAI={handleOpenAskBAI} />}
        {activeTab === 'vaults' && <MultiAccountVaults onOpenAskBAI={handleOpenAskBAI} />}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            recipients={recipients}
            onAddTransaction={() => setIsAddTxOpen(true)}
            onSelectTransaction={(t) => setSelectedTx(t)}
            onDeleteTransaction={handleDeleteTransaction}
            onStatusChange={handleStatusChange}
            onExecuteTransfer={(recipient, fromAmount, fromCurrencySym, toAmount, toCurrencySym) => {
              const now = new Date();
              const dateStr =
                now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
                ' at ' +
                now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
              const newTx: Transaction = {
                id: `tx_transfer_${now.getTime()}`,
                merchant: {
                  name: recipient.name,
                  category: 'Money Transfer',
                  logoText: recipient.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase(),
                  bgColor: '#8B5CF6',
                  textColor: '#FFFFFF',
                },
                date: dateStr,
                timestamp: now.toISOString(),
                amount: -Math.abs(fromAmount),
                currency: fromCurrencySym,
                status: 'Completed',
                referenceId: `TRF-${now.getTime().toString().slice(-8)}`,
                fee: toAmount - fromAmount > 0 ? Number((toAmount - fromAmount).toFixed(2)) : 0,
              };
              setTransactions((prev) => [newTx, ...prev]);
            }}
          />
        )}
      </div>

      <AskBAIDrawer
        isOpen={isAskBAIOpen}
        onClose={() => {
          setIsAskBAIOpen(false);
          setAiPromptOverride(undefined);
        }}
        initialPrompt={aiPromptOverride}
        transactions={transactions.map((t) => ({
          id: t.id,
          merchantName: t.merchant.name,
          merchantCategory: t.merchant.category,
          merchantLogoBg: t.merchant.bgColor,
          merchantLogoColor: t.merchant.textColor,
          logoType: 'transfer' as any,
          date: t.date,
          amount: t.amount,
          status: t.status as any,
        }))}
      />

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onStatusChange={handleStatusChange}
      />

      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onAddTransaction={(tx) => {
          const now = new Date();
          const fullTx: Transaction = {
            ...tx,
            id: `tx_manual_${now.getTime()}`,
            timestamp: now.toISOString(),
          };
          handleAddTransaction(fullTx);
        }}
      />
    </div>
  );
}

function MerchantLogo({
  logoText,
  bg,
  color,
}: {
  logoText: string;
  bg: string;
  color: string;
}) {
  return (
    <div
      className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-xs border border-black/5"
      style={{ backgroundColor: bg, color }}
    >
      <span
        className={`font-black tracking-tighter ${
          logoText.length > 2 ? 'text-[11px]' : 'text-sm'
        }`}
      >
        {logoText}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === 'Completed')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-[#D1FAE5] text-[#065F46]">
        <Check className="w-3 h-3 stroke-[3]" />
        Completed
      </span>
    );
  if (status === 'Failed')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-[#FEE2E2] text-[#991B1B]">
        <X className="w-3 h-3 stroke-[3]" />
        Failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-[#FEF3C7] text-[#92400E]">
      <Clock className="w-3 h-3 stroke-[3]" />
      Pending
    </span>
  );
}

interface TransactionsViewProps {
  transactions: Transaction[];
  recipients: Recipient[];
  onAddTransaction: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onStatusChange: (id: string, status: TransactionStatus) => void;
  onExecuteTransfer: (
    recipient: Recipient,
    fromAmount: number,
    fromCurrencySym: string,
    toAmount: number,
    toCurrencySym: string
  ) => void;
}

function TransactionsView({
  transactions,
  recipients,
  onAddTransaction,
  onSelectTransaction,
  onDeleteTransaction,
  onStatusChange,
  onExecuteTransfer,
}: TransactionsViewProps) {
  return (
    <div className="flex-1 flex flex-col gap-5 xl:gap-6">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl xl:text-3xl font-extrabold text-[#1C1C1E] tracking-[-0.8px]">
            Transactions & Payment Hub
          </h1>
          <p className="text-xs text-[#8E8E93] font-semibold mt-1">
            Execute live transfers, send money, receive bank/crypto deposits, and manage every transaction
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E5EA] text-xs font-bold text-[#1C1C1E] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live BMoni Sync
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 items-start gap-5 xl:gap-6">
        <div className="lg:col-span-4 flex flex-col gap-5 xl:gap-6 flex-shrink-0 min-w-0">
          <QuickTransfer recipients={recipients} onExecuteTransfer={onExecuteTransfer} />
          <PaymentVolumeChart transactions={transactions} days={7} />
          <TransactionsSummaryCards transactions={transactions} />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-5 xl:gap-6 min-w-0">
          <TransactionHistory
            transactions={transactions}
            onOpenAddModal={onAddTransaction}
            onSelectTransaction={onSelectTransaction}
            onDeleteTransaction={onDeleteTransaction}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

function TransactionsSummaryCards({ transactions }: { transactions: Transaction[] }) {
  const summary = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'Completed');
    const inflow = completed.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const outflow = completed.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const fees = transactions.reduce((s, t) => s + (t.fee || 0), 0);
    const net = inflow - outflow - fees;
    return {
      count: transactions.length,
      completed: completed.length,
      failed: transactions.filter((t) => t.status === 'Failed').length,
      pending: transactions.filter((t) => t.status === 'Pending').length,
      inflow,
      outflow,
      fees,
      net,
    };
  }, [transactions]);

  const card = (label: string, value: string, tone: 'dark' | 'green' | 'red' | 'amber') => {
    const tones: Record<string, string> = {
      dark: 'text-[#1C1C1E]',
      green: 'text-emerald-700',
      red: 'text-[#FF3B30]',
      amber: 'text-amber-700',
    };
    return (
      <div className="bg-white rounded-[18px] p-4 border border-[#E5E5EA] shadow-xs">
        <div className="text-[10px] font-black uppercase tracking-wider text-[#8E8E93]">{label}</div>
        <div className={`mt-1.5 font-mono font-black text-lg ${tones[tone]}`}>{value}</div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {card('Net Position', `$${summary.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, summary.net >= 0 ? 'green' : 'red')}
      {card('Inflow', `+$${summary.inflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'green')}
      {card('Outflow', `-$${summary.outflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'red')}
      {card('Fees Paid', `$${summary.fees.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'amber')}
    </div>
  );
}

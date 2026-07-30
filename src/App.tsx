import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, LayoutGrid, List, CreditCard, Settings, Users, FileCheck, Wallet } from 'lucide-react';
import { AskBAIDrawer } from './components/AskBAIDrawer';
import { AccountOverview } from './components/AccountOverview';
import { Sidebar } from './components/Sidebar';
import { AiAnalyticsInsights } from './components/AiAnalyticsInsights';
import { EmployeePayroll } from './components/EmployeePayroll';
import { TaxExpensePrep } from './components/TaxExpensePrep';
import { MultiAccountVaults } from './components/MultiAccountVaults';

interface Transaction {
  id: string;
  merchantName: string;
  merchantCategory: string;
  merchantLogoBg: string;
  merchantLogoColor: string;
  logoType: 'amazon' | 'adobe' | 'paypal' | 'ebay' | 'wise' | 'airbnb' | 'spotify' | 'netflix' | 'apple' | 'transfer';
  date: string;
  amount: number;
  status: 'Completed' | 'Failed' | 'Pending';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    merchantName: 'Amazon',
    merchantCategory: 'Online Shopping',
    merchantLogoBg: '#FF9900',
    merchantLogoColor: '#FFFFFF',
    logoType: 'amazon',
    date: 'Sep 9, 2025 at 04:30pm',
    amount: -150.00,
    status: 'Completed',
  },
  {
    id: '2',
    merchantName: 'Adobe Photoshop',
    merchantCategory: 'Services',
    merchantLogoBg: '#FF0000',
    merchantLogoColor: '#FFFFFF',
    logoType: 'adobe',
    date: 'Sep 8, 2025 at 03:13pm',
    amount: -55.00,
    status: 'Completed',
  },
  {
    id: '3',
    merchantName: 'PayPal',
    merchantCategory: 'Money Transfer',
    merchantLogoBg: '#003087',
    merchantLogoColor: '#FFFFFF',
    logoType: 'paypal',
    date: 'Sep 7, 2025 at 01:00pm',
    amount: -3456.00,
    status: 'Failed',
  },
  {
    id: '4',
    merchantName: 'Ebay',
    merchantCategory: 'Online Shopping',
    merchantLogoBg: '#F5F5F7',
    merchantLogoColor: '#E53238',
    logoType: 'ebay',
    date: 'Sep 6, 2025 at 07:00am',
    amount: -220.80,
    status: 'Pending',
  },
  {
    id: '5',
    merchantName: 'Wise',
    merchantCategory: 'Money Transfer',
    merchantLogoBg: '#9FE870',
    merchantLogoColor: '#163300',
    logoType: 'wise',
    date: 'Sep 8, 2025 at 03:13pm',
    amount: 10000.00,
    status: 'Completed',
  },
  {
    id: '6',
    merchantName: 'AIRBNB',
    merchantCategory: 'Services',
    merchantLogoBg: '#FF5A5F',
    merchantLogoColor: '#FFFFFF',
    logoType: 'airbnb',
    date: 'Sep 6, 2025 at 07:00am',
    amount: -220.80,
    status: 'Completed',
  },
  {
    id: '7',
    merchantName: 'PayPal',
    merchantCategory: 'Money Transfer',
    merchantLogoBg: '#003087',
    merchantLogoColor: '#FFFFFF',
    logoType: 'paypal',
    date: 'Sep 8, 2025 at 03:13pm',
    amount: -1000.00,
    status: 'Failed',
  },
  {
    id: '8',
    merchantName: 'Spotify',
    merchantCategory: 'Entertainment',
    merchantLogoBg: '#1DB954',
    merchantLogoColor: '#FFFFFF',
    logoType: 'spotify',
    date: 'Sep 5, 2025 at 11:20am',
    amount: -14.99,
    status: 'Completed',
  },
  {
    id: '9',
    merchantName: 'Netflix',
    merchantCategory: 'Entertainment',
    merchantLogoBg: '#000000',
    merchantLogoColor: '#E50914',
    logoType: 'netflix',
    date: 'Sep 4, 2025 at 08:45pm',
    amount: -19.99,
    status: 'Completed',
  },
  {
    id: '10',
    merchantName: 'Apple Store',
    merchantCategory: 'Electronics',
    merchantLogoBg: '#1C1C1E',
    merchantLogoColor: '#FFFFFF',
    logoType: 'apple',
    date: 'Sep 3, 2025 at 02:15pm',
    amount: -1299.00,
    status: 'Completed',
  },
];

// SVG Logo Component for real brand logos
const MerchantLogo: React.FC<{ logoType: Transaction['logoType']; bg: string; color: string }> = ({ logoType, bg, color }) => {
  return (
    <div
      className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center flex-shrink-0 font-sans shadow-xs"
      style={{ backgroundColor: bg, color: color }}
    >
      {logoType === 'amazon' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
          <path d="M13.4 12.3c-1.3.1-2.4.5-3.3 1.1-.9.6-1.4 1.4-1.4 2.4 0 .9.4 1.6 1.1 2.1.7.5 1.7.8 2.8.8 1.5 0 2.8-.5 3.7-1.4.9-.9 1.4-2.1 1.4-3.5v-1.1c-.8-.2-1.8-.3-2.9-.3-.5 0-1 .1-1.4.1zm.9-6.3c-1.5 0-3 .3-4.3 1-.7.4-1.3.9-1.8 1.5-.2.3-.2.6.1.8l1.4 1.1c.3.2.6.2.9-.1.6-.7 1.4-1.1 2.2-1.3.9-.2 1.8-.2 2.7 0 1 .2 1.8.7 2.4 1.4.5.7.8 1.6.8 2.6v.5c-.8-.2-1.7-.3-2.7-.3-2.1 0-3.9.5-5.3 1.5-1.4 1-2.1 2.4-2.1 4.1 0 1.6.6 2.9 1.8 3.8 1.2.9 2.7 1.4 4.5 1.4 2 0 3.7-.6 5-1.9v1.3c0 .4.3.7.7.7h2.2c.4 0 .7-.3.7-.7v-9.6c0-2.3-.7-4.1-2.1-5.3-1.4-1.2-3.4-1.8-5.9-1.8z" />
          <path d="M21.2 19.8c-1.4.9-3.3 1.5-5.4 1.5-3.4 0-6.2-1.3-8.3-3.4-.3-.3-.1-.7.2-.6 2.5 1.1 5.3 1.7 8.2 1.7 1.7 0 3.4-.2 5.1-.7.4-.1.7.3.2.5z" />
        </svg>
      )}

      {logoType === 'adobe' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
          <path d="M13.966 22h6.034l-8.427-20h-4.706l7.099 20zm-7.932-20h-6.034l8.427 20h4.706l-7.099-20zm.566 12.5h10.8l-5.4-12.8-5.4 12.8z"/>
        </svg>
      )}

      {logoType === 'paypal' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.769.769 0 0 1 .758-.646h6.815c3.085 0 5.432.8 6.42 2.19.96 1.35.84 3.25-.36 5.64-.85 1.7-2.18 2.97-3.88 3.7-1.5.64-3.2.94-5.06.94H7.817a.641.641 0 0 0-.633.541l-.108.687-.001.005z"/>
        </svg>
      )}

      {logoType === 'ebay' && (
        <svg className="w-7 h-5" viewBox="0 0 100 40" fill="none">
          <path d="M18.8 19.3c0-4.1-3.2-6.5-7.7-6.5-4.8 0-8.2 2.8-8.2 7.7 0 5.1 3.5 7.6 8.7 7.6 4.3 0 7.2-2.1 7.2-5.7h-4.1c0 1.7-1.4 2.6-3.1 2.6-2.1 0-3.9-1.1-4.2-3.4h11.4c0-.7.0-1.5.0-2.3zm-11.4-1.3c.3-2.2 1.9-3.1 3.7-3.1 1.9 0 3.3.9 3.6 3.1H7.4z" fill="#E53238"/>
          <path d="M21.5 5.5h4.6v8.6c1.2-1.3 2.9-2 4.9-2 4.4 0 7.5 3.1 7.5 7.9 0 4.9-3.2 8.1-7.7 8.1-2 0-3.7-.7-4.8-2.1v1.7h-4.5V5.5zm8.8 11.2c0-2.5-1.6-4.2-3.9-4.2-2.3 0-4 1.7-4 4.2 0 2.5 1.7 4.2 4 4.2 2.3 0 3.9-1.7 3.9-4.2z" fill="#0064D2"/>
          <path d="M57.8 19.3c0-4.1-3.2-6.5-7.7-6.5-4.8 0-8.2 2.8-8.2 7.7 0 5.1 3.5 7.6 8.7 7.6 4.3 0 7.2-2.1 7.2-5.7h-4.1c0 1.7-1.4 2.6-3.1 2.6-2.1 0-3.9-1.1-4.2-3.4h11.4c0-.7.0-1.5.0-2.3zm-11.4-1.3c.3-2.2 1.9-3.1 3.7-3.1 1.9 0 3.3.9 3.6 3.1h-7.3z" fill="#F4AE01"/>
          <path d="M60.6 13.2h4.5v2.2c1.1-1.6 2.8-2.6 4.7-2.6 2.9 0 4.9 1.4 5.4 4.1.2 1 .1 1.8.1 3.1v8h-4.6v-7c0-1.7-.6-2.7-2.2-2.7-1.5 0-2.4 1.1-2.6 2.6v7.1h-5.3V13.2z" fill="#86B817"/>
        </svg>
      )}

      {logoType === 'wise' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#163300">
          <path d="M3 4h18l-8 16h-4l3.5-7H7.5L3 4z"/>
        </svg>
      )}

      {logoType === 'airbnb' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.5 2 5.5 5 5.5 9c0 4.5 5.5 11 6.5 13 1-2 6.5-8.5 6.5-13 0-4-3-7-6.5-7zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
        </svg>
      )}

      {logoType === 'spotify' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.746 3.812-.871 7.076-.496 9.722 1.121.294.18.386.563.207.848zm1.218-2.709c-.226.368-.703.483-1.07.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.85-.107-.976-.521-.125-.413.107-.85.521-.975 3.633-1.102 8.147-.568 11.233 1.334.367.226.483.704.257 1.071zm.127-2.834C14.686 8.943 9.071 8.755 5.86 9.73c-.507.154-1.04-.132-1.194-.638-.154-.506.132-1.04.638-1.194 3.7-1.123 9.888-.9 13.626 1.321.455.27.604.86.334 1.314-.27.454-.86.604-1.314.334z"/>
        </svg>
      )}

      {logoType === 'netflix' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#E50914">
          <path d="M5.398 0v24l4.796-2.583V9.752l4.881 11.832 4.727 2.416V0h-4.727v14.42L10.194 2.52 5.398 0z"/>
        </svg>
      )}

      {logoType === 'apple' && (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.46-.62.72-1.16 1.88-.99 3 1.08.08 2.2-.53 2.86-1.36z"/>
        </svg>
      )}

      {logoType === 'transfer' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Anabel Smith');
  const [fromAmount, setFromAmount] = useState<number>(275.00);
  const [toAmount, setToAmount] = useState<number>(324.50);
  const [fromCurrency] = useState<string>('€');
  const [toCurrency] = useState<string>('$');

  // Ask B-AI State
  const [isAskBAIOpen, setIsAskBAIOpen] = useState<boolean>(false);
  const [aiPromptOverride, setAiPromptOverride] = useState<string | undefined>(undefined);

  const handleOpenAskBAIWithPrompt = (prompt?: string) => {
    setAiPromptOverride(prompt);
    setIsAskBAIOpen(true);
  };

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  // Sorting State
  const [sortField, setSortField] = useState<'merchantName' | 'date' | 'amount'>('merchantName');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  // Drag Slider State
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Recipients list
  const recipients = [
    { id: '1', name: 'Anabel', fullName: 'Anabel Smith', bg: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)', avatarType: 'anabel' },
    { id: '2', name: 'Ethan', fullName: 'Ethan Vance', bg: 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)', avatarType: 'ethan' },
    { id: '3', name: 'Gabriel', fullName: 'Gabriel Ross', bg: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)', avatarType: 'gabriel' },
    { id: '4', name: 'Hermione', fullName: 'Hermione Granger', bg: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)', avatarType: 'hermione' },
  ];

  // Drag slider logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSending || sendSuccess) return;
    isDraggingRef.current = true;
    updateDrag(e);
  };

  const updateDrag = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const offsetX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (offsetX / width) * 100));

    setDragProgress(percentage);

    if (percentage >= 85) {
      isDraggingRef.current = false;
      triggerSend();
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (dragProgress < 85) {
          setDragProgress(0);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) updateDrag(e);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, [dragProgress]);

  const triggerSend = () => {
    setIsSending(true);
    setDragProgress(100);

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      const now = new Date();
      const dateStr =
        now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' at ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

      const newTx: Transaction = {
        id: String(Date.now()),
        merchantName: selectedRecipient,
        merchantCategory: 'Money Transfer',
        merchantLogoBg: '#8B5CF6',
        merchantLogoColor: '#FFFFFF',
        logoType: 'transfer',
        date: dateStr,
        amount: -fromAmount,
        status: 'Completed',
      };

      setTransactions((prev) => [newTx, ...prev]);

      setTimeout(() => {
        setSendSuccess(false);
        setDragProgress(0);
      }, 2500);
    }, 1200);
  };

  // Sort handler
  const handleSort = (field: 'merchantName' | 'date' | 'amount') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Sort logic
  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesSearch =
        tx.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.merchantCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.date.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortField === 'merchantName') {
        comp = a.merchantName.localeCompare(b.merchantName);
      } else if (sortField === 'amount') {
        comp = a.amount - b.amount;
      } else {
        comp = a.date.localeCompare(b.date);
      }
      return sortAsc ? comp : -comp;
    });

  // Pagination calculation
  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (checkedIds.length === paginatedTransactions.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(paginatedTransactions.map((t) => t.id));
    }
  };

  const toggleCheck = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((i) => i !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 p-5 xl:p-8 flex flex-col bg-[#F5F5F7] max-w-[1700px] mx-auto w-full min-h-screen">
        {/* Top Navigation Bar with View Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {[
              { id: 'overview', label: 'Dashboard & Wallet', icon: LayoutGrid },
              { id: 'ai_analytics', label: 'AI Analytics & Forecast', icon: Sparkles },
              { id: 'payroll', label: 'Employee Payroll', icon: Users },
              { id: 'tax_prep', label: 'Tax Prep & Receipts', icon: FileCheck },
              { id: 'vaults', label: 'Purpose Accounts', icon: Wallet },
              { id: 'transactions', label: 'Transactions', icon: List }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                    isActive
                      ? 'bg-[#3B1053] text-[#DFFF4F] shadow-xs'
                      : 'bg-white text-[#1C1C1E] hover:bg-[#E5E5EA]'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="ask-b-ai-btn"
              onClick={() => handleOpenAskBAIWithPrompt()}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] font-sans text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask B-AI Copilot</span>
            </button>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'overview' && (
          <AccountOverview
            onOpenAskBAI={() => handleOpenAskBAIWithPrompt()}
            onNavigateToTransfers={() => setActiveTab('transactions')}
          />
        )}

        {activeTab === 'ai_analytics' && (
          <AiAnalyticsInsights onOpenAskBAI={handleOpenAskBAIWithPrompt} />
        )}

        {activeTab === 'payroll' && (
          <EmployeePayroll onOpenAskBAI={handleOpenAskBAIWithPrompt} />
        )}

        {activeTab === 'tax_prep' && (
          <TaxExpensePrep onOpenAskBAI={handleOpenAskBAIWithPrompt} />
        )}

        {activeTab === 'vaults' && (
          <MultiAccountVaults onOpenAskBAI={handleOpenAskBAIWithPrompt} />
        )}

        {activeTab === 'transactions' && (
          <>
            {/* Top Header */}
        <div className="flex justify-between items-center mb-4 xl:mb-6 flex-shrink-0">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-[#1C1C1E] tracking-[-0.8px] font-sans">
            Transactions
          </h1>
          <div className="flex items-center gap-4 xl:gap-5">
            {/* Ask B-AI Button matching exact theme with Lucide Sparkles icon */}
            <button
              id="ask-b-ai-btn"
              onClick={() => setIsAskBAIOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] font-sans text-xs xl:text-sm font-extrabold rounded-[14px] shadow-xs hover:shadow-md transition-all cursor-pointer border border-[#3B1053] group"
            >
              <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-[8px] bg-[#DFFF4F] text-[#3B1053] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Sparkles className="w-3.5 h-3.5 fill-[#3B1053] text-[#3B1053]" />
              </div>
              <span className="tracking-[-0.2px]">Ask B-AI</span>
            </button>

            <div className="relative w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center text-[#1C1C1E] bg-white rounded-[14px] shadow-xs cursor-pointer hover:bg-[#F9F9FB]">
              <svg className="w-5 h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div className="absolute top-[8px] right-[8px] w-[8px] h-[8px] bg-[#FF3B30] rounded-full border-2 border-white" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] flex-shrink-0">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" fill="url(#grad1)" />
                  <circle cx="18" cy="14" r="8" fill="#FDBA74" />
                  <path d="M6 34C6 26 11 22 18 22C25 22 30 26 30 34" fill="#FDBA74" />
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="36" y2="36">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-bold text-[#1C1C1E] leading-tight font-sans">
                  William Grace
                </div>
                <div className="text-xs text-[#8E8E93] leading-tight font-sans font-medium">
                  Admin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="flex-1 flex gap-5 xl:gap-6 items-start">
          {/* Left Panel */}
          <div className="w-[340px] xl:w-[380px] flex flex-col gap-4 xl:gap-5 flex-shrink-0">
            {/* Quick Transfer Card */}
            <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-xs flex flex-col justify-between flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm xl:text-base font-extrabold text-[#1C1C1E] flex items-center gap-2 font-sans tracking-[-0.3px]">
                  <span className="w-1 h-4 bg-[#1C1C1E] rounded-full" />
                  <span>Quick transfer</span>
                </div>
                <button className="text-xs xl:text-sm font-bold text-[#8B5CF6] hover:underline font-sans cursor-pointer">
                  See All
                </button>
              </div>

              {/* Recipient Avatars */}
              <div className="flex gap-3 mb-4">
                {recipients.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecipient(rec.fullName);
                      setToAmount(Number((fromAmount * 1.18).toFixed(2)));
                    }}
                    className="flex flex-col items-center gap-1.5 cursor-pointer flex-1"
                  >
                    <div
                      className={`w-[48px] h-[48px] xl:w-[54px] xl:h-[54px] rounded-full overflow-hidden border-2 border-white shadow-md transition-transform ${
                        selectedRecipient === rec.fullName ? 'ring-2 ring-[#8B5CF6] scale-105' : 'hover:scale-105'
                      }`}
                      style={{ background: rec.bg }}
                    >
                      {rec.avatarType === 'anabel' && (
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="20" r="10" fill="#4A3020" />
                          <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#4A3020" />
                        </svg>
                      )}
                      {rec.avatarType === 'ethan' && (
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="20" r="10" fill="#5D4037" />
                          <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#5D4037" />
                        </svg>
                      )}
                      {rec.avatarType === 'gabriel' && (
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="20" r="10" fill="#FDBA74" />
                          <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#FDBA74" />
                          <rect x="14" y="18" width="20" height="6" rx="3" fill="#374151" opacity="0.6" />
                        </svg>
                      )}
                      {rec.avatarType === 'hermione' && (
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="20" r="10" fill="#FDBA74" />
                          <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#FDBA74" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[11px] xl:text-[12px] text-[#3A3A3C] font-semibold font-sans truncate max-w-[55px]">
                      {rec.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Transfer Details Form */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] font-semibold font-sans">
                    <div className="w-2 h-2 rounded-full bg-[#DFFF4F]" />
                    <span>From William Grace (You)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      step="0.01"
                      value={fromAmount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFromAmount(val);
                        setToAmount(Number((val * 1.18).toFixed(2)));
                      }}
                      className="text-2xl xl:text-3xl font-extrabold text-[#1C1C1E] tracking-tight font-sans bg-transparent outline-none w-36 xl:w-44"
                    />
                    <div className="flex items-center gap-1 text-sm xl:text-base text-[#8E8E93] font-bold font-sans">
                      <span>{fromCurrency}</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#C7C7CC] font-semibold font-sans pl-3.5">
                    1 € = 1.18 $
                  </div>
                </div>

                <div className="h-[1px] bg-[#F2F2F7]" />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] font-semibold font-sans">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]" />
                    <span>To {selectedRecipient}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl xl:text-3xl font-extrabold text-[#1C1C1E] tracking-tight font-sans">
                      {toAmount.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 text-sm xl:text-base text-[#8E8E93] font-bold font-sans">
                      <span>{toCurrency}</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Interactive Drag to Send Slider */}
                <div
                  ref={sliderRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  className="relative flex items-center gap-3 mt-1 py-1 cursor-pointer select-none"
                >
                  <div
                    className="w-10 h-10 bg-[#1C1C1E] rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform shadow-md"
                    style={{
                      transform: `translateX(${(dragProgress / 100) * 180}px)`,
                    }}
                  >
                    {sendSuccess ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isSending ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-xs text-[#8E8E93] font-semibold font-sans truncate">
                    {sendSuccess ? 'Sent Successfully!' : isSending ? 'Processing...' : 'Drag to send'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Volume Card */}
            <div className="bg-white rounded-[20px] p-5 xl:p-6 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm xl:text-base font-extrabold text-[#1C1C1E] flex items-center gap-2 font-sans tracking-[-0.3px]">
                  <span className="w-1 h-4 bg-[#1C1C1E] rounded-full" />
                  <span>Payment volume</span>
                </div>
                <div className="flex gap-3 text-[#8E8E93]">
                  <svg className="w-4 h-4 cursor-pointer hover:text-[#1C1C1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <svg className="w-4 h-4 cursor-pointer hover:text-[#1C1C1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="relative h-[150px] xl:h-[160px] flex items-end justify-between px-2 pt-12 pb-2">
                <div className="absolute left-0 right-0 border-t border-dashed border-[#E5E5EA] top-[60px]" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md" style={{ height: '60px' }} />
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md" style={{ height: '40px' }} />
                </div>
                <div className="flex flex-col items-center gap-2 flex-1 relative">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md relative" style={{ height: '95px' }}>
                    <div className="absolute -top-[48px] left-1/2 -translate-x-1/2 bg-[#1C1C1E] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap text-center leading-tight font-sans shadow-md z-10">
                      <div>Fri, Jan 12</div>
                      <div>$2,340.00</div>
                      <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1C1E] rotate-45 rounded-[1px]" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md" style={{ height: '75px' }} />
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md" style={{ height: '50px' }} />
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md" style={{ height: '35px' }} />
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-7 xl:w-8 bg-gradient-to-b from-[#C084FC] to-[#A855F7] rounded-t-xl rounded-b-md" style={{ height: '55px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - History Table */}
          <div className="flex-1 w-full bg-white rounded-[20px] p-5 xl:p-6 shadow-xs min-w-0 flex flex-col justify-between">
            <div className="flex flex-col flex-1">
              {/* Header & Filter Controls */}
              <div className="flex justify-between items-center mb-3 xl:mb-4 flex-shrink-0">
                <h2 className="text-lg xl:text-xl font-extrabold text-[#1C1C1E] font-sans tracking-[-0.4px]">
                  History
                </h2>
                <div className="flex items-center gap-3">
                  {showSearchInput ? (
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1.5 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] w-44 font-sans font-medium"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setShowSearchInput(true)}
                      className="w-9 h-9 flex items-center justify-center text-[#8E8E93] bg-[#F5F5F7] rounded-xl cursor-pointer hover:text-[#1C1C1E] transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#F2F2F7] bg-white text-xs font-bold text-[#1C1C1E] cursor-pointer shadow-xs hover:bg-[#F5F5F7] transition-colors"
                    >
                      <span>Filters</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                    </button>

                    {showFilterMenu && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#F2F2F7] p-2.5 z-30">
                        <div className="text-[11px] font-bold mb-1.5 text-[#1C1C1E]">Status Filter</div>
                        {['All', 'Completed', 'Pending', 'Failed'].map((st) => (
                          <div
                            key={st}
                            onClick={() => {
                              setStatusFilter(st);
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                              statusFilter === st ? 'bg-[#1C1C1E] text-white' : 'hover:bg-[#F5F5F7]'
                            }`}
                          >
                            {st}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="w-10 text-left py-2 px-3 border-b border-[#F2F2F7]">
                        <input
                          type="checkbox"
                          checked={checkedIds.length > 0 && checkedIds.length === paginatedTransactions.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 border-2 border-[#E5E5EA] rounded-[4px] cursor-pointer accent-[#1C1C1E]"
                        />
                      </th>
                      <th
                        onClick={() => handleSort('merchantName')}
                        className="text-left py-2 px-3 text-[11px] font-bold text-[#8E8E93] border-b border-[#F2F2F7] uppercase tracking-wider cursor-pointer select-none hover:text-[#1C1C1E]"
                      >
                        Merchant
                        <span className="inline-flex ml-1 text-[#C7C7CC]">
                          <svg className={`w-3 h-3 transition-transform ${sortField === 'merchantName' && !sortAsc ? 'rotate-180 text-[#1C1C1E]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                        </span>
                      </th>
                      <th
                        onClick={() => handleSort('date')}
                        className="text-left py-2 px-3 text-[11px] font-bold text-[#8E8E93] border-b border-[#F2F2F7] uppercase tracking-wider cursor-pointer select-none hover:text-[#1C1C1E]"
                      >
                        Transaction Date
                        <span className="inline-flex ml-1 text-[#C7C7CC]">
                          <svg className={`w-3 h-3 transition-transform ${sortField === 'date' && !sortAsc ? 'rotate-180 text-[#1C1C1E]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                        </span>
                      </th>
                      <th
                        onClick={() => handleSort('amount')}
                        className="text-left py-2 px-3 text-[11px] font-bold text-[#8E8E93] border-b border-[#F2F2F7] uppercase tracking-wider cursor-pointer select-none hover:text-[#1C1C1E]"
                      >
                        Amount
                        <span className="inline-flex ml-1 text-[#C7C7CC]">
                          <svg className={`w-3 h-3 transition-transform ${sortField === 'amount' && !sortAsc ? 'rotate-180 text-[#1C1C1E]' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                        </span>
                      </th>
                      <th className="text-left py-2 px-3 text-[11px] font-bold text-[#8E8E93] border-b border-[#F2F2F7] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="w-10 border-b border-[#F2F2F7]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F9F9FB] transition-colors">
                        <td className="py-2.5 px-3 border-b border-[#F2F2F7]">
                          <input
                            type="checkbox"
                            checked={checkedIds.includes(tx.id)}
                            onChange={() => toggleCheck(tx.id)}
                            className="w-4 h-4 border-2 border-[#E5E5EA] rounded-[4px] cursor-pointer accent-[#1C1C1E]"
                          />
                        </td>
                        <td className="py-2.5 px-3 border-b border-[#F2F2F7]">
                          <div className="flex items-center gap-3">
                            <MerchantLogo logoType={tx.logoType} bg={tx.merchantLogoBg} color={tx.merchantLogoColor} />
                            <div className="flex flex-col gap-0.5">
                              <div className="text-sm font-bold text-[#1C1C1E] font-sans tracking-tight">
                                {tx.merchantName}
                              </div>
                              <div className="text-xs text-[#8E8E93] font-medium font-sans">
                                {tx.merchantCategory}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-[#8E8E93] font-medium whitespace-nowrap border-b border-[#F2F2F7]">
                          {tx.date}
                        </td>
                        <td className="py-2.5 px-3 text-sm font-bold whitespace-nowrap border-b border-[#F2F2F7] tracking-tight">
                          <span className={tx.status === 'Failed' ? 'text-[#FF3B30]' : 'text-[#1C1C1E]'}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 border-b border-[#F2F2F7]">
                          {tx.status === 'Completed' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#D1FAE5] text-[#065F46] tracking-tight">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Completed
                            </span>
                          )}
                          {tx.status === 'Failed' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#FEE2E2] text-[#991B1B] tracking-tight">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Failed
                            </span>
                          )}
                          {tx.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#FEF3C7] text-[#92400E] tracking-tight">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-b border-[#F2F2F7] text-right">
                          <div className="text-[#C7C7CC] hover:text-[#1C1C1E] text-base cursor-pointer p-1 rounded-md hover:bg-[#F2F2F7] inline-block transition-colors">
                            ⋮
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer with Working Pagination */}
            <div className="pt-3 mt-2 border-t border-[#F2F2F7] flex items-center justify-between text-xs font-semibold text-[#8E8E93] font-sans flex-shrink-0">
              <div>
                Showing <span className="text-[#1C1C1E]">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
                <span className="text-[#1C1C1E]">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
                <span className="text-[#1C1C1E]">{totalItems}</span> transactions
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-[#E5E5EA] bg-white text-[#1C1C1E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F5F7] transition-colors cursor-pointer text-xs"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#1C1C1E] text-white shadow-xs'
                        : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-[#E5E5EA] bg-white text-[#1C1C1E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F5F7] transition-colors cursor-pointer text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Ask B-AI Drawer Copilot Modal */}
      <AskBAIDrawer
        isOpen={isAskBAIOpen}
        onClose={() => {
          setIsAskBAIOpen(false);
          setAiPromptOverride(undefined);
        }}
        initialPrompt={aiPromptOverride}
        transactions={transactions}
      />
    </div>
  );
}

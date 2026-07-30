import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  RefreshCw,
  CreditCard,
  DollarSign,
  ChevronDown,
  Check,
  Send,
  ArrowRight,
  Key,
  Globe,
  User,
  ShieldCheck,
  AlertCircle,
  Database,
  Copy,
  ExternalLink,
  X,
  Zap,
  Activity
} from 'lucide-react';

interface AccountOverviewProps {
  onOpenAskBAI: () => void;
  onNavigateToTransfers?: () => void;
}

interface SmartWalletBalanceItem {
  smartWalletId: string;
  currency: string;
  balance: string | null;
  error?: string | null;
}

interface BmoniUserProfile {
  id?: string;
  bmoniUserId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  employerName?: string;
  occupation?: string;
  partnerName?: string;
}

interface BankAccountItem {
  id: string;
  accountName: string;
  bankName: string;
  currency: string;
  accountNumber?: string;
  iban?: string;
  bankCode?: string;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({ onOpenAskBAI, onNavigateToTransfers }) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [selectedWalletCurrency, setSelectedWalletCurrency] = useState<string>('USD');
  const [showWalletDropdown, setShowWalletDropdown] = useState<boolean>(false);
  const [invoiceCreated, setInvoiceCreated] = useState<boolean>(false);
  
  // BMoni API Configuration & Live State
  const [showApiModal, setShowApiModal] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('bmoni_api_key') || 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4');
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('bmoni_user_id') || '1701f90b-2e62-401e-8c57-0d03c53b6525');
  const [baseUrl, setBaseUrl] = useState<string>(() => localStorage.getItem('bmoni_base_url') || 'https://embedded-dev.bmoni.com');
  
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [apiLogs, setApiErrorMessage] = useState<string>('');
  
  // Live API Data
  const [bmoniProfile, setBmoniProfile] = useState<BmoniUserProfile | null>(null);
  const [liveBalances, setLiveBalances] = useState<SmartWalletBalanceItem[]>([]);
  const [liveDepositAccounts, setLiveDepositAccounts] = useState<BankAccountItem[]>([]);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Send Money Live State & Modal
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [sendRecipient, setSendRecipient] = useState<string>('0x056fDa9011c70bA6cbABd865Cc012c7737CC899D');
  const [sendAmount, setSendAmount] = useState<string>('50.00');
  const [sendCurrency, setSendCurrency] = useState<string>('CNGN');
  const [isSendingMoney, setIsSendingMoney] = useState<boolean>(false);
  const [sendApiResult, setSendApiResult] = useState<{ status?: number; ok?: boolean; data?: any; error?: string } | null>(null);

  // Fund Wallet & Onboarding Live State & Modal
  const [showFundModal, setShowFundModal] = useState<boolean>(false);
  const [isFundingAction, setIsFundingAction] = useState<boolean>(false);
  const [fundApiResult, setFundApiResult] = useState<{ title?: string; status?: number; data?: any; error?: string } | null>(null);

  const fallbackCards = [
    {
      id: '1',
      brand: 'VISA',
      name: 'Primary Platinum',
      balance: '$50,000.00',
      number: '•••• •••• •••• 1234',
      expiry: '12/26',
      bgGradient: 'from-[#3B1053] via-[#521875] to-[#7B2CBF]',
      accentColor: '#DFFF4F'
    },
    {
      id: '2',
      brand: 'MasterCard',
      name: 'Black Rewards',
      balance: '$24,500.00',
      number: '•••• •••• •••• 8892',
      expiry: '09/27',
      bgGradient: 'from-[#1C1C1E] via-[#2C2C2E] to-[#3A3A3C]',
      accentColor: '#A78BFA'
    }
  ];

  const quickContacts = [
    { name: 'Tony', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'John', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Angel', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { name: 'Barry', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Allen', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  ];

  const recentActivities = [
    { id: '1', name: 'PayPal Receive', date: '04/11/2025', amount: '+$100.00', isPositive: true, type: 'paypal' },
    { id: '2', name: 'Top-Up Gopay', date: '04/11/2025', amount: '-$50.00', isPositive: false, type: 'gopay' },
    { id: '3', name: 'Wise Transfer', date: '03/11/2025', amount: '+$1,250.00', isPositive: true, type: 'wise' },
    { id: '4', name: 'Apple Store Purchase', date: '02/11/2025', amount: '-$199.00', isPositive: false, type: 'apple' },
  ];

  // Save config to localStorage
  const saveApiConfig = (newKey: string, newUid: string, newUrl: string) => {
    localStorage.setItem('bmoni_api_key', newKey);
    localStorage.setItem('bmoni_user_id', newUid);
    localStorage.setItem('bmoni_base_url', newUrl);
    setApiKey(newKey);
    setUserId(newUid);
    setBaseUrl(newUrl);
  };

  // Create & Provision a New Live BMoni User with Smart Wallet
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  const handleCreateNewUser = async () => {
    setIsCreatingUser(true);
    setApiErrorMessage('');

    try {
      const res = await fetch('/api/bmoni/users/provision-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Michael',
          lastName: 'Onuoha',
          email: 'michaelonuoha.01@gmail.com',
          phoneNumber: '+2349138663979',
          apiKey: apiKey || 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4',
          baseUrl: baseUrl || 'https://embedded-dev.bmoni.com'
        })
      });

      const data = await res.json();

      if (data.ok && data.bmoniUserId) {
        saveApiConfig(apiKey, data.bmoniUserId, baseUrl);
        setBmoniProfile({
          firstName: data.user?.firstName || 'Michael',
          lastName: data.user?.lastName || 'Onuoha',
          email: data.user?.email || 'michaelonuoha.01@gmail.com',
          phoneNumber: data.user?.phoneNumber || '+2349138663979',
          bmoniUserId: data.bmoniUserId
        });

        if (data.balances && data.balances.length > 0) {
          setLiveBalances(data.balances);
        } else if (data.wallet) {
          setLiveBalances([{
            smartWalletId: data.wallet.id,
            currency: data.wallet.currency || 'NGN',
            balance: '0'
          }]);
        }

        setApiStatus('connected');
        setApiErrorMessage(`Live User (+2349138663979) & Smart Wallet Provisioned! User ID: ${data.bmoniUserId}`);
      } else {
        setApiErrorMessage(`Provision Error: ${data.error || 'Unknown error'} ${JSON.stringify(data.details || {})}`);
      }
    } catch (err: any) {
      setApiErrorMessage(`User Provisioning Error: ${err.message}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Fetch Live Account Data from BMoni API
  const fetchLiveBmoniData = async (targetUid?: string, targetKey?: string, targetUrl?: string) => {
    const currentUid = targetUid || userId || '1701f90b-2e62-401e-8c57-0d03c53b6525';
    const currentKey = targetKey !== undefined ? targetKey : apiKey;
    const currentUrl = targetUrl || baseUrl || 'https://embedded-dev.bmoni.com';

    setApiStatus('loading');
    setApiErrorMessage('');

    try {
      // 1. Fetch Balances via BMoni API Proxy
      const balanceRes = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/v1/users/${currentUid}/smart-wallets/account/balances`,
          method: 'GET',
          apiKey: currentKey,
          baseUrl: currentUrl
        })
      });

      const balanceData = await balanceRes.json();
      const rawBalances = balanceData.data?.balances || balanceData.data?.data?.balances;

      if (balanceData.ok && rawBalances) {
        setLiveBalances(rawBalances);
        setApiStatus('connected');
      } else if (
        balanceData.data?.statusCode === 400 ||
        (typeof balanceData.data?.message === 'string' && balanceData.data.message.includes('No embedded smart wallet group')) ||
        currentUid === '550e8400-e29b-41d4-a716-446655440000'
      ) {
        // Automatically provision a live user & smart wallet for seamless testing
        console.log("No smart wallet found for user, auto-provisioning live BMoni user...");
        await handleCreateNewUser();
        return;
      } else {
        if (balanceData.status === 401 || balanceData.data?.statusCode === 401) {
          setApiErrorMessage('401 Unauthorized: Invalid or missing x-api-key.');
          setApiStatus('error');
        } else {
          setApiErrorMessage(`BMoni API Response: ${JSON.stringify(balanceData.data || balanceData)}`);
          setApiStatus('error');
        }
      }

      // 2. Fetch User Profile
      const profileRes = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/v1/users/${currentUid}`,
          method: 'GET',
          apiKey: currentKey,
          baseUrl: currentUrl
        })
      });

      const profileData = await profileRes.json();
      if (profileData.ok && profileData.data?.bmoniUserId) {
        setBmoniProfile(profileData.data);
      } else if (profileData.data?.user) {
        setBmoniProfile(profileData.data.user);
      }

      // 3. Fetch Deposit Bank Accounts
      const bankRes = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/v1/users/${currentUid}/bank-accounts/deposit-accounts`,
          method: 'GET',
          apiKey: currentKey,
          baseUrl: currentUrl
        })
      });

      const bankData = await bankRes.json();
      if (bankData.ok && bankData.data) {
        const nigerian = bankData.data.nigerianAccounts || [];
        const european = bankData.data.europeanAccounts || [];
        setLiveDepositAccounts([...nigerian, ...european]);
      } else {
        setLiveDepositAccounts([]);
      }

    } catch (err: any) {
      console.error('Failed to fetch live BMoni data:', err);
      setApiStatus('error');
      setApiErrorMessage(err.message || 'Connection failed');
    }
  };

  // Live Send Money API Action
  const [transferType, setTransferType] = useState<'internal' | 'crypto' | 'bank'>('internal');

  const handleSendMoneyLive = async () => {
    setIsSendingMoney(true);
    setSendApiResult(null);

    const activeWalletId = liveBalances[0]?.smartWalletId || '4be3f01b-f716-4faf-9c24-1a0778f0ea67';
    const isCryptoAddress = sendRecipient.startsWith('0x') && sendRecipient.length > 20;

    let endpoint = `/v1/users/${userId}/smart-wallets/account/send`;
    let payload: any = {};

    if (transferType === 'crypto' || (isCryptoAddress && transferType !== 'internal')) {
      endpoint = `/v1/users/${userId}/withdrawal/smart-wallet/crypto`;
      payload = {
        sourceSmartWalletId: activeWalletId,
        destinationChain: 'Base',
        destinationCurrency: ['USDC', 'USDT', 'USDB', 'DAI', 'EURC', 'PYUSD', 'USDP'].includes(sendCurrency) ? sendCurrency : 'USDC',
        destinationAddress: sendRecipient,
        amount: String(sendAmount)
      };
    } else if (transferType === 'bank') {
      endpoint = `/v1/users/${userId}/payouts`;
      payload = {
        sourceSmartWalletId: activeWalletId,
        amount: String(Math.round(parseFloat(sendAmount || '0') * 100)), // minor units
        country: 'NGA',
        currency: 'NGN',
        bankDetails: {
          bankId: '058', // GTBank default or selected
          accountNumber: sendRecipient.length === 10 ? sendRecipient : '0123456789',
          accountHolderName: 'Beneficiary Name'
        },
        note: `Payline Business Payout`
      };
    } else {
      // Default: Internal BMoni Smart Account Transfer
      endpoint = `/v1/users/${userId}/smart-wallets/account/send`;
      payload = {
        fromWalletId: activeWalletId,
        amount: String(sendAmount),
        note: `Transfer to ${sendRecipient}`
      };
    }

    try {
      const res = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint,
          method: 'POST',
          apiKey,
          baseUrl,
          payload
        })
      });

      const resData = await res.json();
      setSendApiResult({
        status: res.status,
        ok: resData.ok && resData.data?.statusCode !== 400 && resData.data?.statusCode !== 404,
        data: resData.data,
        error: Array.isArray(resData.data?.message)
          ? resData.data.message.join(', ')
          : resData.data?.message || resData.data?.error || (resData.ok ? null : 'Transfer request failed')
      });

      if (resData.ok && !resData.data?.error) {
        fetchLiveBmoniData();
      }
    } catch (err: any) {
      setSendApiResult({
        status: 500,
        ok: false,
        error: err.message
      });
    } finally {
      setIsSendingMoney(false);
    }
  };

  // Live Start Nigeria Onboarding (KYC) Action
  const handleStartNigeriaOnboarding = async () => {
    setIsFundingAction(true);
    setFundApiResult(null);

    try {
      const res = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/v1/users/${userId}/onboarding/start-nigeria`,
          method: 'POST',
          apiKey,
          baseUrl,
          payload: {
            bvn: "22222222222",
            countryCode: "NGA"
          }
        })
      });

      const resData = await res.json();
      setFundApiResult({
        title: 'Nigeria Onboarding (BVN 22222222222)',
        status: res.status,
        data: resData.data,
        error: resData.data?.message || resData.data?.error
      });
    } catch (err: any) {
      setFundApiResult({
        title: 'Nigeria Onboarding',
        status: 500,
        error: err.message
      });
    } finally {
      setIsFundingAction(false);
    }
  };

  // Live Get Crypto Deposit Address Action
  const handleFetchDepositWalletAddress = async () => {
    setIsFundingAction(true);
    setFundApiResult(null);

    try {
      const res = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/v1/users/${userId}/deposit/wallet`,
          method: 'POST',
          apiKey,
          baseUrl,
          payload: {
            currency: sendCurrency || 'CNGN'
          }
        })
      });

      const resData = await res.json();
      setFundApiResult({
        title: 'Deposit Address Request',
        status: res.status,
        data: resData.data,
        error: resData.data?.message || resData.data?.error
      });
    } catch (err: any) {
      setFundApiResult({
        title: 'Deposit Address Request',
        status: 500,
        error: err.message
      });
    } finally {
      setIsFundingAction(false);
    }
  };

  useEffect(() => {
    fetchLiveBmoniData();
  }, []);

  const activeCard = fallbackCards[activeCardIndex];

  const toggleSwapCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % fallbackCards.length);
  };

  const handleCreateInvoice = () => {
    setInvoiceCreated(true);
    setTimeout(() => setInvoiceCreated(false), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Resolve current active wallet balance display
  const currentSelectedBalanceItem = liveBalances.find(b => b.currency === selectedWalletCurrency) ||
    liveBalances[0] || { currency: 'USD', balance: '120000.00' };

  const formatBalanceDisplay = (item: SmartWalletBalanceItem) => {
    if (!item.balance) return '$120,000.00';
    const num = parseFloat(item.balance);
    if (isNaN(num)) return item.balance;
    const prefix = item.currency === 'NGN' ? '₦' : item.currency === 'EUR' ? '€' : item.currency === 'CAD' ? 'C$' : '$';
    return `${prefix}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex-1 flex flex-col gap-5 xl:gap-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-[#1C1C1E] tracking-[-0.8px] font-sans">
              Overview
            </h1>
            <button
              onClick={() => setShowApiModal(true)}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 bg-white border-[#E5E5EA] text-[#3B1053]"
            >
              <span className={`w-2 h-2 rounded-full ${apiStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : apiStatus === 'loading' ? 'bg-amber-500 animate-ping' : 'bg-purple-500'}`} />
              <span className="font-mono uppercase tracking-wider">{apiStatus === 'connected' ? 'BMoni API Live' : 'BMoni API Config'}</span>
              <Zap className="w-3 h-3 text-[#3B1053]" />
            </button>
          </div>
          <p className="text-xs text-[#8E8E93] hidden sm:block">
            Connected to BMoni Embedded API for live multi-currency smart wallet balances &amp; bank accounts
          </p>
        </div>

        <div className="flex items-center gap-3 xl:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-[240px] xl:w-[280px]">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search accounts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E5E5EA] text-sm text-[#1C1C1E] placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#3B1053]/20 focus:border-[#3B1053] transition-all shadow-2xs"
            />
          </div>

          {/* Notification Icon */}
          <button className="relative w-10 h-10 rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] hover:bg-[#F5F5F7] transition-colors shadow-2xs cursor-pointer">
            <Bell className="w-4 h-4 text-[#1C1C1E]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF3B30] border-2 border-white" />
          </button>

          {/* Ask B-AI CTA button */}
          <button
            onClick={onOpenAskBAI}
            className="px-4 py-2.5 rounded-full bg-[#3B1053] hover:bg-[#4E186E] text-white font-bold text-xs xl:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 group"
          >
            <div className="w-5 h-5 rounded-[6px] bg-[#DFFF4F] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#3B1053] fill-[#3B1053]" />
            </div>
            <span>Ask B-AI</span>
          </button>
        </div>
      </div>

      {/* Main Overview Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
        {/* Left Column - 8 Cols (Promo, Wallet Balance Chart, Quick Transactions) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5 xl:gap-6">
          
          {/* 1. Promo Banner Card */}
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#FAF6FF] via-[#F3E8FF] to-[#E9D5FF] p-6 xl:p-7 border border-[#E9D5FF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1053]/10 text-[#3B1053] text-[11px] font-bold tracking-wide uppercase mb-3">
                <Sparkles className="w-3 h-3 text-[#3B1053]" /> BMoni Embedded Wallets
              </span>
              <h2 className="text-2xl xl:text-3xl font-black text-[#1C1C1E] tracking-[-0.6px] leading-tight mb-2">
                Get NEO Cashback
              </h2>
              <p className="text-xs xl:text-sm text-[#48484A] max-w-[360px] leading-relaxed mb-5">
                Invite your friends to use Payline and get up to <strong className="text-[#3B1053] font-bold">$100 Cashback</strong> straight to your BMoni wallet.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowApiModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white text-xs xl:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-[#DFFF4F]" />
                  <span>API Settings</span>
                </button>
                <button
                  onClick={() => fetchLiveBmoniData()}
                  className="text-xs text-[#3B1053] hover:text-[#1C1C1E] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${apiStatus === 'loading' ? 'animate-spin' : ''}`} />
                  <span>Refresh Balances</span>
                </button>
              </div>
            </div>

            {/* Piggy Bank Visual Illustration */}
            <div className="relative w-36 h-36 xl:w-44 xl:h-44 flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/30 to-[#EC4899]/20 rounded-full blur-2xl" />
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl z-10">
                <rect x="30" y="150" width="140" height="18" rx="9" fill="#E9D5FF" opacity="0.6" />
                <path d="M50 115C50 80 75 60 110 60C145 60 170 80 170 115C170 135 155 150 135 150H85C65 150 50 135 50 115Z" fill="url(#piggy_body)" />
                <circle cx="155" cy="105" r="16" fill="#F472B6" />
                <circle cx="150" cy="105" r="4" fill="#831843" />
                <circle cx="160" cy="105" r="4" fill="#831843" />
                <circle cx="130" cy="90" r="5" fill="#1E1B4B" />
                <path d="M100 60C100 48 112 40 125 45" stroke="#F472B6" strokeWidth="6" strokeLinecap="round" />
                <path d="M60 145V165C60 168 64 170 68 170H75C79 170 82 167 82 163V150" fill="#EC4899" />
                <path d="M135 145V165C135 168 139 170 143 170H150C154 170 157 167 157 163V150" fill="#EC4899" />
                <circle cx="42" cy="135" r="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                <circle cx="42" cy="135" r="10" fill="#FDE047" />
                <text x="39" y="139" fill="#854D0E" fontSize="12" fontWeight="bold">$</text>
                <circle cx="34" cy="115" r="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                <circle cx="34" cy="115" r="10" fill="#FDE047" />
                <circle cx="100" cy="50" r="12" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                <circle cx="100" cy="50" r="8" fill="#FDE047" />
                <defs>
                  <linearGradient id="piggy_body" x1="50" y1="60" x2="170" y2="150" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F472B6" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* 2. My Wallet / Account Balance Card (Live from BMoni API) */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#F2F2F7] flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
                    My Wallet (Account Balance)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF5FF] text-[#3B1053] border border-[#E9D5FF] font-mono">
                    BMoni Live
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl xl:text-4xl font-extrabold text-[#1C1C1E] tracking-[-1px] font-mono">
                    {formatBalanceDisplay(currentSelectedBalanceItem)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" /> +32%
                  </span>
                </div>
              </div>

              {/* Multi-Currency Wallet Currency Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF5FF] text-[#3B1053] font-extrabold text-xs flex items-center gap-2 border border-[#E9D5FF] hover:bg-[#F3E8FF] transition-colors cursor-pointer shadow-2xs"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#3B1053]" />
                  <span>Currency: {selectedWalletCurrency}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#3B1053]" />
                </button>

                {showWalletDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E5EA] py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                      BMoni Smart Accounts
                    </div>
                    {(liveBalances.length > 0 ? liveBalances : [
                      { currency: 'USD', balance: '120000.00', smartWalletId: 'sw-usd' },
                      { currency: 'NGN', balance: '192000000.00', smartWalletId: 'sw-ngn' },
                      { currency: 'EUR', balance: '110000.00', smartWalletId: 'sw-eur' },
                      { currency: 'CAD', balance: '75000.00', smartWalletId: 'sw-cad' }
                    ]).map((b) => (
                      <button
                        key={b.currency}
                        onClick={() => {
                          setSelectedWalletCurrency(b.currency);
                          setShowWalletDropdown(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#FAF5FF] transition-colors ${
                          selectedWalletCurrency === b.currency ? 'text-[#3B1053] font-bold bg-[#FAF5FF]' : 'text-[#1C1C1E]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold">{b.currency} Wallet</span>
                          <span className="text-[10px] text-[#8E8E93] font-mono">{b.balance ? `$${parseFloat(b.balance).toLocaleString()}` : 'Active'}</span>
                        </div>
                        {selectedWalletCurrency === b.currency && <Check className="w-4 h-4 text-[#3B1053]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Balance Trend Area Chart */}
            <div className="relative h-[180px] w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="40" x2="600" y2="40" stroke="#F2F2F7" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#F2F2F7" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#F2F2F7" strokeWidth="1" />

                <path
                  d="M 0 140 Q 100 130 180 110 T 360 80 T 480 30 L 480 140 Z"
                  fill="url(#purpleAreaGrad)"
                />

                <path
                  d="M 0 140 Q 100 130 180 110 T 360 80 T 480 30 L 600 45"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <line x1="480" y1="30" x2="480" y2="140" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="480" cy="30" r="6" fill="#3B1053" stroke="#FFFFFF" strokeWidth="3" className="drop-shadow-md" />
              </svg>

              <div className="absolute top-1 right-[18%] bg-[#1C1C1E] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 animate-bounce font-mono">
                <span>{formatBalanceDisplay(currentSelectedBalanceItem)}</span>
                <span className="text-emerald-400 text-[10px]">+32%</span>
              </div>
            </div>

            {/* Connected Bank Accounts Quick Pills */}
            <div className="border-t border-[#F2F2F7] pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#1C1C1E] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Linked Virtual Deposit Bank Accounts</span>
                </span>
                <span className="text-[11px] text-[#8E8E93]">BMoni Auto-Sweep</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(liveDepositAccounts.length > 0 ? liveDepositAccounts : [
                  { id: '1', bankName: 'Access Bank NGN', accountNumber: '0129384756', currency: 'NGN', accountName: 'Kaylynn Calzoni' },
                  { id: '2', bankName: 'Lead Bank SEPA', iban: 'DE89370400440532013000', currency: 'EUR', accountName: 'Kaylynn Calzoni' }
                ]).map((acc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-[#1C1C1E]">{acc.bankName}</p>
                      <p className="text-[10px] font-mono text-[#636366]">{acc.accountNumber || acc.iban}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(acc.accountNumber || acc.iban || '', acc.bankName)}
                      className="p-1.5 rounded-lg bg-white border border-[#E5E5EA] hover:bg-[#3B1053] hover:text-white transition-colors cursor-pointer text-[#1C1C1E]"
                      title="Copy Account Number"
                    >
                      {copiedAccount === acc.bankName ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Quick Transactions Contacts */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#F2F2F7] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full">
              <h3 className="text-base font-extrabold text-[#1C1C1E] mb-4 font-sans tracking-[-0.3px]">
                Quick Transactions
              </h3>
              
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                {quickContacts.map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#3B1053] transition-all p-0.5 shadow-2xs">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-xs font-semibold text-[#1C1C1E] group-hover:text-[#3B1053] transition-colors">{c.name}</span>
                  </div>
                ))}

                <div className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#FAF5FF] border-2 border-dashed border-[#C084FC] flex items-center justify-center text-[#3B1053] group-hover:bg-[#3B1053] group-hover:text-white transition-all shadow-2xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#8E8E93]">Add</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex-shrink-0">
              <button
                onClick={handleCreateInvoice}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs xl:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
                  invoiceCreated
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#3B1053] hover:bg-[#4E186E] text-white'
                }`}
              >
                {invoiceCreated ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Invoice Created!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Invoice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - 5 Cols (User Profile, Card Stack Switcher, Recent Activity) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 xl:gap-6">
          
          {/* 1. User Profile Box (Hydrated from BMoni if available) */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#F2F2F7] flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#DFFF4F] shadow-md p-1 bg-[#3B1053]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt={bmoniProfile?.firstName ? `${bmoniProfile.firstName} ${bmoniProfile.lastName}` : 'Kaylynn Calzoni'}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#3B1053] text-[#DFFF4F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                ★ 4.9
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#1C1C1E] tracking-[-0.3px]">
              {bmoniProfile?.firstName ? `${bmoniProfile.firstName} ${bmoniProfile.lastName || ''}` : 'Kaylynn Calzoni'}
            </h2>
            <p className="text-xs text-[#8E8E93] mb-1 font-mono">
              {bmoniProfile?.email || 'kaylynncalzoni@odama.io'}
            </p>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full mt-1 mb-6">
              👑 {bmoniProfile?.employerName || 'Gold Partner User'}
            </span>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <button
                onClick={() => setShowSendModal(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white group transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1C1C1E] group-hover:text-white shadow-2xs mb-1.5 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#1C1C1E] group-hover:text-white">Send</span>
              </button>

              <button
                onClick={() => setShowFundModal(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white group transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1C1C1E] group-hover:text-white shadow-2xs mb-1.5 transition-all">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#1C1C1E] group-hover:text-white">Receive / Fund</span>
              </button>

              <button
                onClick={() => setShowApiModal(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white group transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1C1C1E] group-hover:text-white shadow-2xs mb-1.5 transition-all">
                  <Key className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#1C1C1E] group-hover:text-white">API Keys</span>
              </button>
            </div>
          </div>

          {/* 2. Swap Your Cards */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#F2F2F7] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-[#1C1C1E] font-sans tracking-[-0.3px]">
                  Swap Your Cards
                </h3>
                <p className="text-xs text-[#8E8E93]">
                  {fallbackCards.length} Cards registered to your account
                </p>
              </div>

              <button
                onClick={toggleSwapCard}
                className="w-9 h-9 rounded-full bg-[#FAF5FF] hover:bg-[#3B1053] text-[#3B1053] hover:text-white border border-[#E9D5FF] flex items-center justify-center transition-all shadow-2xs cursor-pointer active:rotate-180"
                title="Swap Active Card"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="relative h-[170px] w-full pt-2">
              <div className="absolute top-0 right-2 left-2 h-[140px] bg-[#1C1C1E]/80 rounded-2xl transform rotate-2 shadow-sm border border-white/20 opacity-40 transition-all" />

              <div
                className={`relative w-full h-[155px] rounded-2xl p-5 bg-gradient-to-br ${activeCard.bgGradient} text-white shadow-md border border-white/10 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01]`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-medium text-white/70 block uppercase tracking-wider">
                      Balance
                    </span>
                    <span className="text-2xl font-extrabold text-white tracking-[-0.5px]">
                      {activeCard.balance}
                    </span>
                  </div>
                  <span className="text-xs font-black tracking-widest bg-white/20 px-2.5 py-1 rounded-md uppercase">
                    {activeCard.brand}
                  </span>
                </div>

                <div className="flex justify-between items-end text-xs tracking-widest font-mono text-white/90">
                  <span>{activeCard.number}</span>
                  <span className="text-[11px] text-white/70">{activeCard.expiry}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Recent Activity */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#F2F2F7] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-[#1C1C1E] font-sans tracking-[-0.3px]">
                Recent Activity
              </h3>
              <button
                onClick={onNavigateToTransfers}
                className="text-xs font-bold text-[#3B1053] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[#F2F2F7]">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF5FF] flex items-center justify-center text-[#3B1053] border border-[#E9D5FF] flex-shrink-0">
                      {act.type === 'paypal' ? (
                        <span className="font-extrabold text-sm italic">P</span>
                      ) : act.type === 'gopay' ? (
                        <DollarSign className="w-4 h-4 text-[#3B1053]" />
                      ) : act.type === 'wise' ? (
                        <Send className="w-4 h-4 text-[#3B1053]" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-[#3B1053]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1C1E]">{act.name}</h4>
                      <p className="text-[11px] text-[#8E8E93]">{act.date}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold ${
                      act.isPositive ? 'text-emerald-600' : 'text-[#1C1C1E]'
                    }`}
                  >
                    {act.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BMoni API Configuration & Endpoint Tester Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[28px] p-6 xl:p-8 shadow-2xl border border-[#E5E5EA] flex flex-col gap-5 relative">
            <button
              onClick={() => setShowApiModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#1C1C1E] hover:text-white flex items-center justify-center transition-colors text-[#1C1C1E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#1C1C1E]">
                  BMoni Embedded API Setup
                </h2>
                <p className="text-xs text-[#8E8E93]">
                  Configure your Partner API Key (`x-api-key`) &amp; User ID to query live account balances
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                  Partner API Key (`x-api-key`)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="e.g. bmoni_partner_sec_..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-mono text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#1C1C1E]">
                    BMoni User ID (`bmoniUserId`)
                  </label>
                  <button
                    type="button"
                    onClick={handleCreateNewUser}
                    disabled={isCreatingUser}
                    className="text-[11px] font-bold text-[#3B1053] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3 text-[#3B1053]" />
                    <span>{isCreatingUser ? 'Creating...' : '+ Create New User via API'}</span>
                  </button>
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-mono text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                  BMoni Base API Host URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://embedded-dev.bmoni.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-mono text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                  />
                </div>
              </div>

              {/* Status / Log Box */}
              {apiLogs && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="break-all">{apiLogs}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const demoUid = '09d2e5f8-6284-4797-8163-7760ad1f97fb';
                  const demoKey = 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4';
                  const sandboxUrl = 'https://embedded-dev.bmoni.com';
                  saveApiConfig(demoKey, demoUid, sandboxUrl);
                  fetchLiveBmoniData(demoUid, demoKey, sandboxUrl);
                  setShowApiModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#3B1053] border border-[#E9D5FF] font-extrabold text-xs transition-colors cursor-pointer"
              >
                Use Shared Sandbox Key
              </button>

              <button
                onClick={() => {
                  saveApiConfig(apiKey, userId, baseUrl);
                  fetchLiveBmoniData(userId, apiKey, baseUrl);
                  setShowApiModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-[#DFFF4F]" />
                <span>Save &amp; Fetch Balance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Money Live BMoni API Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[28px] p-6 xl:p-8 shadow-2xl border border-[#E5E5EA] flex flex-col gap-5 relative">
            <button
              onClick={() => setShowSendModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#1C1C1E] hover:text-white flex items-center justify-center transition-colors text-[#1C1C1E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3B1053] text-white flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="w-5 h-5 text-[#DFFF4F]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#1C1C1E]">
                  Send Money (Live BMoni API)
                </h2>
                <p className="text-xs text-[#8E8E93]">
                  Transfer via <code className="font-mono text-[#3B1053]">{
                    transferType === 'crypto'
                      ? 'POST /v1/users/.../withdrawal/smart-wallet/crypto'
                      : transferType === 'bank'
                      ? 'POST /v1/users/.../payouts'
                      : 'POST /v1/users/.../smart-wallets/account/send'
                  }</code>
                </p>
              </div>
            </div>

            {/* Transfer Rail Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA]">
              <button
                type="button"
                onClick={() => setTransferType('internal')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  transferType === 'internal'
                    ? 'bg-[#3B1053] text-[#DFFF4F] shadow-xs'
                    : 'text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
              >
                Internal Transfer
              </button>
              <button
                type="button"
                onClick={() => setTransferType('bank')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  transferType === 'bank'
                    ? 'bg-[#3B1053] text-[#DFFF4F] shadow-xs'
                    : 'text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
              >
                Bank Payout
              </button>
              <button
                type="button"
                onClick={() => setTransferType('crypto')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  transferType === 'crypto'
                    ? 'bg-[#3B1053] text-[#DFFF4F] shadow-xs'
                    : 'text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
              >
                Crypto Offramp
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                  {transferType === 'crypto'
                    ? 'External Crypto Wallet Address (0x...)'
                    : transferType === 'bank'
                    ? 'Nigerian NUBAN Account Number (10 digits)'
                    : 'Recipient Smart Wallet / Personal Wallet ID'}
                </label>
                <input
                  type="text"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  placeholder={
                    transferType === 'crypto'
                      ? '0x056fDa9011c70bA6cbABd865Cc012c7737CC899D'
                      : transferType === 'bank'
                      ? '0123456789'
                      : '0x056fDa9011c70bA6cbABd865Cc012c7737CC899D or Wallet ID'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-mono text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="50.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-mono text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                    Currency
                  </label>
                  <select
                    value={sendCurrency}
                    onChange={(e) => setSendCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-bold text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                  >
                    <option value="CNGN">CNGN (Nigerian eNaira / Stablecoin)</option>
                    <option value="NGN">NGN (Nigerian Naira)</option>
                    <option value="USDB">USDB (Base Dollar)</option>
                  </select>
                </div>
              </div>

              {/* Real API Response Output Box */}
              {sendApiResult && (
                <div className={`p-4 rounded-xl text-xs font-mono border flex flex-col gap-1.5 ${
                  sendApiResult.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className={`w-4 h-4 ${sendApiResult.ok ? 'text-emerald-600' : 'text-red-600'}`} />
                    <span>BMoni API Response Status: {sendApiResult.status} ({sendApiResult.ok ? 'SUCCESS' : 'ERROR / REJECTED'})</span>
                  </div>
                  {sendApiResult.error && (
                    <p className="font-sans font-bold text-red-700">Message: {sendApiResult.error}</p>
                  )}

                  {/* Specific Solution Banner for Code E101 (Crypto offramp requires USDB) */}
                  {sendApiResult.data?.code === 'E101' && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] font-sans mt-1 space-y-1">
                      <span className="font-extrabold text-amber-900 block">💡 How to Fix "Crypto offramp requires a USDB group wallet":</span>
                      <p>
                        BMoni's <strong>Crypto Offramp API</strong> (<code className="font-mono text-xs">/withdrawal/smart-wallet/crypto</code>) requires a <strong>USDB (Dollar)</strong> wallet.
                      </p>
                      <p className="font-semibold">
                        • For <strong>CNGN (Naira)</strong> balances: Switch transfer rail to <strong>Internal Transfer</strong> or <strong>Bank Payout</strong> above.
                      </p>
                    </div>
                  )}

                  {sendApiResult.data && (
                    <pre className="text-[10px] bg-white/80 p-2 rounded-lg border overflow-x-auto max-h-36 font-mono leading-tight">
                      {JSON.stringify(sendApiResult.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8E8E93] hover:text-[#1C1C1E] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMoneyLive}
                disabled={isSendingMoney}
                className="px-6 py-2.5 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSendingMoney ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#DFFF4F]" />}
                <span>{isSendingMoney ? 'Sending Money...' : 'Execute Live API Transfer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fund Sandbox Wallet & Onboarding Live Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[28px] p-6 xl:p-8 shadow-2xl border border-[#E5E5EA] flex flex-col gap-5 relative">
            <button
              onClick={() => setShowFundModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#1C1C1E] hover:text-white flex items-center justify-center transition-colors text-[#1C1C1E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3B1053] text-white flex items-center justify-center flex-shrink-0">
                <ArrowDownLeft className="w-5 h-5 text-[#DFFF4F]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#1C1C1E]">
                  Fund Sandbox Wallet / Onboarding
                </h2>
                <p className="text-xs text-[#8E8E93]">
                  Interact with live BMoni onboarding &amp; deposit APIs
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] text-xs text-[#3B1053] font-mono">
                <p className="font-bold mb-1">Active BMoni User ID:</p>
                <p className="break-all text-[11px] bg-white p-1.5 rounded-lg border border-[#E9D5FF]">{userId}</p>
                {bmoniProfile?.phoneNumber && (
                  <p className="mt-2 text-[11px]"><strong className="font-bold">Phone Number:</strong> {bmoniProfile.phoneNumber}</p>
                )}
              </div>

              {/* Action 1: Activate Nigeria Onboarding */}
              <div className="p-4 rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1C1C1E]">1. Start Nigeria Onboarding (BVN 22222222222)</span>
                  <button
                    onClick={handleStartNigeriaOnboarding}
                    disabled={isFundingAction}
                    className="px-3 py-1.5 rounded-lg bg-[#3B1053] text-white text-[11px] font-bold hover:bg-[#4E186E] cursor-pointer disabled:opacity-50"
                  >
                    {isFundingAction ? 'Processing...' : 'Call API'}
                  </button>
                </div>
                <p className="text-[11px] text-[#8E8E93]">
                  Triggers <code className="font-mono">POST /v1/users/onboarding/start-nigeria</code> with sandbox test BVN.
                </p>
              </div>

              {/* Action 2: Get Deposit Wallet Address */}
              <div className="p-4 rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1C1C1E]">2. Get Crypto Deposit Address</span>
                  <button
                    onClick={handleFetchDepositWalletAddress}
                    disabled={isFundingAction}
                    className="px-3 py-1.5 rounded-lg bg-[#3B1053] text-white text-[11px] font-bold hover:bg-[#4E186E] cursor-pointer disabled:opacity-50"
                  >
                    {isFundingAction ? 'Processing...' : 'Fetch Address'}
                  </button>
                </div>
                <p className="text-[11px] text-[#8E8E93]">
                  Triggers <code className="font-mono">POST /v1/users/deposit/wallet</code> for CNGN / USDB deposit address.
                </p>
              </div>

              {/* Action 3: BMoni Hackathon Test Funds Notice */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>BMoni Hackathon Test Fund Request:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  BMoni Sandbox wallets start at <strong>₦0.00</strong>. To receive test funds (₦1,000 CNGN / $10 USDB), share your phone number 
                  <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 ml-1">{bmoniProfile?.phoneNumber || '+2348017687857'}</strong> 
                  or User ID with the BMoni technical team in the hackathon room.
                </p>
              </div>

              {/* Live API Action Output */}
              {fundApiResult && (
                <div className={`p-4 rounded-xl text-xs font-mono border flex flex-col gap-1.5 ${
                  fundApiResult.status && fundApiResult.status < 400 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <p className="font-bold">{fundApiResult.title} - Status: {fundApiResult.status}</p>
                  {fundApiResult.error && <p className="font-sans font-bold text-red-700">{fundApiResult.error}</p>}
                  {fundApiResult.data && (
                    <pre className="text-[10px] bg-white/80 p-2 rounded-lg border overflow-x-auto max-h-36 font-mono leading-tight">
                      {JSON.stringify(fundApiResult.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  fetchLiveBmoniData();
                  setShowFundModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#3B1053] border border-[#E9D5FF] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-check Live Balance</span>
              </button>

              <button
                onClick={() => setShowFundModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#1C1C1E] text-white font-bold text-xs hover:bg-black transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  Activity,
  UserPlus,
  CheckCircle2,
  Mail,
  Phone,
  Wallet
} from 'lucide-react';

import { Transaction } from '../types';

interface AccountOverviewProps {
  onOpenAskBAI: () => void;
  onNavigateToTransfers?: () => void;
  transactions?: Transaction[];
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

export const AccountOverview: React.FC<AccountOverviewProps> = ({ onOpenAskBAI, onNavigateToTransfers, transactions }) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [selectedWalletCurrency, setSelectedWalletCurrency] = useState<string>('USD');
  const [showWalletDropdown, setShowWalletDropdown] = useState<boolean>(false);
  const [invoiceCreated, setInvoiceCreated] = useState<boolean>(false);
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  
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

  const quickContacts = [
    { name: 'Tony', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'John', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'Angel', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { name: 'Barry', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'Allen', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  ];

  const [customLocalTxs, setCustomLocalTxs] = useState<any[]>(() => {
    try {
      const storedUid = localStorage.getItem('bmoni_user_id') || '1701f90b-2e62-401e-8c57-0d03c53b6525';
      return JSON.parse(localStorage.getItem(`bmoni_txs_${storedUid}`) || '[]');
    } catch (e) {
      return [];
    }
  });

  const defaultActivities = [
    { id: '1', name: 'PayPal Receive', date: '04/11/2025', amount: '+$100.00', isPositive: true, type: 'paypal' },
    { id: '2', name: 'Top-Up Gopay', date: '04/11/2025', amount: '-$50.00', isPositive: false, type: 'gopay' },
    { id: '3', name: 'Wise Transfer', date: '03/11/2025', amount: '+$1,250.00', isPositive: true, type: 'wise' },
    { id: '4', name: 'Apple Store Purchase', date: '02/11/2025', amount: '-$199.00', isPositive: false, type: 'apple' },
  ];

  const recentActivities = [...customLocalTxs, ...defaultActivities];

  // Save config to localStorage
  const saveApiConfig = (newKey: string, newUid: string, newUrl: string) => {
    localStorage.setItem('bmoni_api_key', newKey);
    localStorage.setItem('bmoni_user_id', newUid);
    localStorage.setItem('bmoni_base_url', newUrl);
    setApiKey(newKey);
    setUserId(newUid);
    setBaseUrl(newUrl);
  };

  const handleSwitchAccount = (targetUid: string, label: string) => {
    saveApiConfig(apiKey, targetUid, baseUrl);
    fetchLiveBmoniData(targetUid, apiKey, baseUrl);
    setApiErrorMessage(`Switched to account: ${label} (${targetUid})`);
  };

  // User Account Sign Up & Wallet Provisioning State
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [signUpFirstName, setSignUpFirstName] = useState<string>('Alex');
  const [signUpLastName, setSignUpLastName] = useState<string>('Payline');
  const [signUpEmail, setSignUpEmail] = useState<string>('alex.payline@example.com');
  const [signUpPhone, setSignUpPhone] = useState<string>('+2348129876543');
  const [signUpCurrency, setSignUpCurrency] = useState<string>('USDB');
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [signUpResult, setSignUpResult] = useState<{
    ok?: boolean;
    bmoniUserId?: string;
    smartAccountAddress?: string;
    currency?: string;
    error?: string;
  } | null>(null);

  // Create & Provision a New Live BMoni User with Smart Wallet
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

  const handleSignUpUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSigningUp(true);
    setIsCreatingUser(true);
    setSignUpResult(null);
    setApiErrorMessage('');

    try {
      const res = await fetch('/api/bmoni/users/provision-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signUpFirstName.trim() || 'Alex',
          lastName: signUpLastName.trim() || 'Payline',
          email: signUpEmail.trim() || 'alex.payline@example.com',
          phoneNumber: signUpPhone.trim() || '+2348129876543',
          currency: signUpCurrency || 'USDB',
          apiKey: apiKey || 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4',
          baseUrl: baseUrl || 'https://embedded-dev.bmoni.com'
        })
      });

      const data = await res.json();

      if (data.ok && data.bmoniUserId) {
        saveApiConfig(apiKey, data.bmoniUserId, baseUrl);
        setBmoniProfile({
          firstName: data.user?.firstName || signUpFirstName,
          lastName: data.user?.lastName || signUpLastName,
          email: data.user?.email || signUpEmail,
          phoneNumber: data.user?.phoneNumber || signUpPhone,
          bmoniUserId: data.bmoniUserId
        });

        if (data.balances && data.balances.length > 0) {
          setLiveBalances(data.balances);
        } else if (data.wallet) {
          setLiveBalances([{
            smartWalletId: data.wallet.id,
            currency: data.wallet.currency || signUpCurrency || 'USD',
            balance: '0'
          }]);
        }

        setApiStatus('connected');
        const walletAddress = data.smartAccountAddress || data.wallet?.walletAddress;
        setSignUpResult({
          ok: true,
          bmoniUserId: data.bmoniUserId,
          smartAccountAddress: walletAddress,
          currency: data.wallet?.currency || signUpCurrency
        });
        setApiErrorMessage(`Account created! User ID: ${data.bmoniUserId} | Smart Wallet: ${walletAddress}`);
        fetchLiveBmoniData(data.bmoniUserId, apiKey, baseUrl);
      } else {
        const errorMsg = data.error || (data.details ? JSON.stringify(data.details) : 'Failed to provision account');
        setSignUpResult({
          ok: false,
          error: errorMsg
        });
        setApiErrorMessage(`Provisioning failed: ${errorMsg}`);
      }
    } catch (err: any) {
      setSignUpResult({
        ok: false,
        error: err.message || 'Network error while creating account.'
      });
      setApiErrorMessage(`Error creating account: ${err.message}`);
    } finally {
      setIsSigningUp(false);
      setIsCreatingUser(false);
    }
  };

  const handleCreateNewUser = async () => {
    setShowSignUpModal(true);
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
        // Read local transfer deductions for this user ID
        const deductionKey = `bmoni_deductions_${currentUid}`;
        let localDeductions: Record<string, number> = {};
        try {
          localDeductions = JSON.parse(localStorage.getItem(deductionKey) || '{}');
        } catch (e) {
          localDeductions = {};
        }

        // Apply deduction to live display balances
        const adjustedBalances = rawBalances.map((b: any) => {
          const rawVal = parseFloat(b.balance || '0');
          const curr = (b.currency || 'USD').toUpperCase();
          const deductedAmt = localDeductions[curr] || 0;
          const netVal = Math.max(0, rawVal - deductedAmt);
          return {
            ...b,
            balance: netVal.toFixed(2),
            rawBalance: b.balance
          };
        });

        setLiveBalances(adjustedBalances);

        // Update local transactions state
        try {
          const localTxs = JSON.parse(localStorage.getItem(`bmoni_txs_${currentUid}`) || '[]');
          setCustomLocalTxs(localTxs);
        } catch (e) {
          setCustomLocalTxs([]);
        }

        if (Array.isArray(adjustedBalances) && adjustedBalances.length > 0) {
          const hasSelected = adjustedBalances.some((b: any) => b.currency === selectedWalletCurrency);
          if (!hasSelected && adjustedBalances[0]?.currency) {
            setSelectedWalletCurrency(adjustedBalances[0].currency);
          }
        }
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

    const activeWalletId = liveBalances[0]?.smartWalletId;
    const isCryptoAddress = sendRecipient.startsWith('0x') && sendRecipient.length > 20;

    if (transferType === 'bank') {
      // Bank payout endpoint
      const endpoint = `/v1/users/${userId}/payouts`;
      const payload = {
        sourceSmartWalletId: activeWalletId,
        amount: String(Math.round(parseFloat(sendAmount || '0') * 100)), // minor units
        country: 'NGA',
        currency: 'NGN',
        bankDetails: {
          bankId: '058',
          accountNumber: sendRecipient.length === 10 ? sendRecipient : '0123456789',
          accountHolderName: 'Beneficiary Name'
        },
        note: `Payline Payout`
      };

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
            : resData.data?.message || resData.data?.error || (resData.ok ? null : 'Bank payout request failed')
        });

        if (resData.ok && !resData.data?.error) {
          const curr = (sendCurrency || 'NGN').toUpperCase();
          const amt = parseFloat(sendAmount) || 0;
          const deductionKey = `bmoni_deductions_${userId}`;
          let localDeductions: Record<string, number> = {};
          try {
            localDeductions = JSON.parse(localStorage.getItem(deductionKey) || '{}');
          } catch (e) {
            localDeductions = {};
          }
          localDeductions[curr] = (localDeductions[curr] || 0) + amt;
          localStorage.setItem(deductionKey, JSON.stringify(localDeductions));

          const txKey = `bmoni_txs_${userId}`;
          let localTxs: any[] = [];
          try {
            localTxs = JSON.parse(localStorage.getItem(txKey) || '[]');
          } catch (e) {
            localTxs = [];
          }

          const symbol = curr === 'NGN' || curr === 'CNGN' ? '₦' : '$';
          localTxs.unshift({
            id: `tx_bank_${Date.now()}`,
            name: `Bank Payout (${sendRecipient})`,
            date: 'Just now',
            amount: `-${symbol}${amt.toFixed(2)}`,
            isPositive: false,
            type: 'gopay',
            currency: curr
          });
          localStorage.setItem(txKey, JSON.stringify(localTxs));
          setCustomLocalTxs(localTxs);

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
      return;
    }

    // Default: Proposal-based Smart Wallet Transfer or Crypto Offramp
    try {
      const res = await fetch('/api/bmoni/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          smartWalletId: activeWalletId,
          recipient: sendRecipient,
          amount: String(sendAmount),
          currency: sendCurrency || 'USDB',
          description: `Transfer to ${sendRecipient}`,
          apiKey,
          baseUrl
        })
      });

      const resData = await res.json();
      if (res.ok && resData.ok) {
        // Record deduction locally for immediate balance reduction
        const curr = (sendCurrency || 'USDB').toUpperCase();
        const amt = parseFloat(sendAmount) || 0;
        const deductionKey = `bmoni_deductions_${userId}`;
        let localDeductions: Record<string, number> = {};
        try {
          localDeductions = JSON.parse(localStorage.getItem(deductionKey) || '{}');
        } catch (e) {
          localDeductions = {};
        }
        localDeductions[curr] = (localDeductions[curr] || 0) + amt;
        localStorage.setItem(deductionKey, JSON.stringify(localDeductions));

        // Record local activity feed entry
        const txKey = `bmoni_txs_${userId}`;
        let localTxs: any[] = [];
        try {
          localTxs = JSON.parse(localStorage.getItem(txKey) || '[]');
        } catch (e) {
          localTxs = [];
        }

        const symbol = curr === 'NGN' || curr === 'CNGN' ? '₦' : '$';
        const recipientLabel = sendRecipient.length > 14 ? `${sendRecipient.slice(0, 6)}...${sendRecipient.slice(-4)}` : sendRecipient;
        localTxs.unshift({
          id: resData.proposal?.id || `tx_${Date.now()}`,
          name: `Transfer to ${recipientLabel}`,
          date: 'Just now',
          amount: `-${symbol}${amt.toFixed(2)}`,
          isPositive: false,
          type: 'wise',
          currency: curr
        });
        localStorage.setItem(txKey, JSON.stringify(localTxs));
        setCustomLocalTxs(localTxs);

        setSendApiResult({
          status: 200,
          ok: true,
          data: resData.proposal || resData.approval || resData,
          error: null
        });
        fetchLiveBmoniData();
      } else {
        setSendApiResult({
          status: res.status || 400,
          ok: false,
          data: resData.details || resData,
          error: resData.error || resData.message || 'Transfer failed'
        });
      }
    } catch (err: any) {
      setSendApiResult({
        status: 500,
        ok: false,
        error: err.message || 'Network error during transfer'
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

  // Resolve current active wallet balance display
  const currentSelectedBalanceItem = liveBalances.find(b => b.currency === selectedWalletCurrency) ||
    liveBalances[0] || { currency: 'CNGN', balance: '10000.00' };

  // Calculate dynamic connected balance based on initial 10,000 baseline and local transactions
  const computeDynamicBalance = (item: SmartWalletBalanceItem) => {
    const curr = (item?.currency || selectedWalletCurrency || 'CNGN').toUpperCase();
    
    // Starting base balance (10,000 CNGN/NGN default, or USD equivalent)
    let baseVal = 10000.0;
    if (curr === 'USD') baseVal = 1250.0;
    else if (curr === 'EUR') baseVal = 1100.0;
    else if (curr === 'CAD') baseVal = 950.0;

    // Calculate net adjustments from custom local transactions
    let netAdjustment = 0;
    customLocalTxs.forEach((tx) => {
      if (typeof tx.amount === 'string') {
        const cleaned = tx.amount.replace(/[^0-9.-]/g, '');
        const parsed = parseFloat(cleaned);
        if (!isNaN(parsed)) {
          netAdjustment += parsed;
        }
      } else if (typeof tx.amount === 'number') {
        netAdjustment += tx.isPositive ? tx.amount : -tx.amount;
      }
    });

    const finalVal = baseVal + netAdjustment;
    const prefix = (curr === 'NGN' || curr === 'CNGN') ? '₦' : curr === 'EUR' ? '€' : curr === 'CAD' ? 'C$' : '$';
    return {
      formatted: `${prefix}${Math.max(0, finalVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      numeric: Math.max(0, finalVal),
      currency: curr
    };
  };

  const activeLiveBalanceFormatted = computeDynamicBalance(currentSelectedBalanceItem).formatted;

  const fallbackCards = [
    {
      id: '1',
      brand: 'B-WISE Smart Wallet',
      name: `${currentSelectedBalanceItem.currency || 'CNGN'} Account`,
      balance: activeLiveBalanceFormatted,
      number: '•••• •••• •••• 1234',
      expiry: '12/28',
      bgGradient: 'from-[#3B1053] via-[#521875] to-[#7B2CBF]',
      accentColor: '#DFFF4F'
    },
    {
      id: '2',
      brand: 'MasterCard Vault',
      name: 'Multi-Sig Safe Vault',
      balance: '₦0.00',
      number: '•••• •••• •••• 8892',
      expiry: '09/27',
      bgGradient: 'from-[#1C1C1E] via-[#2C2C2E] to-[#3A3A3C]',
      accentColor: '#A78BFA'
    }
  ];

  const activeCard = fallbackCards[activeCardIndex] || fallbackCards[0];

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

          {/* Sign Up / Create Account CTA → explicit B-WISE Connect */}
          <button
            onClick={() => {
              setSignUpResult(null);
              setShowSignUpModal(true);
            }}
            className={`px-3.5 py-2.5 rounded-full font-extrabold text-xs xl:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
              apiStatus === 'connected'
                ? 'bg-[#DFFF4F] hover:bg-[#D0FF2E] text-[#1C1C1E]'
                : 'bg-[#3B1053] hover:bg-[#4E186E] text-white'
            }`}
          >
            {apiStatus === 'connected' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#3B1053]" />
                <span>B-WISE Connected</span>
              </>
            ) : apiStatus === 'loading' ? (
              <>
                <RefreshCw className="w-4 h-4 text-[#DFFF4F] animate-spin" />
                <span>Syncing B-WISE…</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#DFFF4F]" />
                <span>Connect B-WISE</span>
              </>
            )}
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
          
          {/* 1. B-WISE Connection Banner */}
          <div className={`relative overflow-hidden rounded-[24px] p-5 xl:p-6 border shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 transition-colors ${
            apiStatus === 'connected'
              ? 'bg-gradient-to-r from-[#F3FFF0] via-[#FAFFE8] to-[#F8FFD0] border-[#DFFFC4]'
              : apiStatus === 'loading'
              ? 'bg-gradient-to-r from-[#FFF7E6] via-[#FFF1D1] to-[#FFE8B8] border-[#FFE0A3]'
              : 'bg-gradient-to-r from-[#FAF6FF] via-[#F3E8FF] to-[#E9D5FF] border-[#E9D5FF]'
          }`}>
            <div className="flex-1 z-10 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-600 text-white'
                    : apiStatus === 'loading'
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#3B1053] text-[#DFFF4F]'
                }`}>
                  {apiStatus === 'connected' ? (
                    <><CheckCircle2 className="w-3 h-3" /> Connected</>
                  ) : apiStatus === 'loading' ? (
                    <><RefreshCw className="w-3 h-3 animate-spin" /> Syncing</>
                  ) : (
                    <><Zap className="w-3 h-3" /> B-WISE Treasury</>
                  )}
                </span>
                {bmoniProfile?.bmoniUserId && (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white/70 text-[#3B1053] border border-white">
                    UID {bmoniProfile.bmoniUserId.slice(0, 8)}…
                  </span>
                )}
              </div>
              <h2 className="text-2xl xl:text-3xl font-black tracking-tight leading-tight mb-1 font-sans text-[#1C1C1E]">
                {apiStatus === 'connected' && bmoniProfile
                  ? `${bmoniProfile.firstName || 'Michael'}'s B-WISE Wallet`
                  : apiStatus === 'loading'
                  ? 'Connecting to B-WISE…'
                  : 'Connect B-WISE'}
              </h2>
              <p className="text-xs text-[#48484A] max-w-[480px] font-semibold mb-4">
                {apiStatus === 'connected' && liveBalances.length > 0
                  ? `${liveBalances.length} smart wallet${liveBalances.length === 1 ? '' : 's'} · ${liveDepositAccounts.length} linked account${liveDepositAccounts.length === 1 ? '' : 's'} · live multi-currency treasury, payouts & deposits.`
                  : apiStatus === 'loading'
                  ? 'Pulling your wallet balances, linked deposit accounts & transaction ledger from B-WISE…'
                  : 'Link B-WISE Treasury to unlock live smart wallets in NGN / EUR / USD / GBP, instant payouts, virtual bank accounts & automated deductions.'}
              </p>

              {apiStatus === 'connected' && liveBalances.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {liveBalances.slice(0, 5).map((b) => {
                    const dynamic = computeDynamicBalance(b);
                    return (
                      <div
                        key={b.currency}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#E9D5FF] text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <span className="text-[#8E8E93]">{b.currency}</span>
                        <span className="text-[#1C1C1E] font-mono">{dynamic.formatted}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                {apiStatus !== 'connected' && (
                  <button
                    onClick={() => { setSignUpResult(null); setShowSignUpModal(true); }}
                    className="px-4 py-2.5 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#DFFF4F]" />
                    <span>Connect B-WISE</span>
                  </button>
                )}
                <button
                  onClick={() => setShowApiModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAFAFA] text-[#1C1C1E] border border-[#E5E5EA] text-xs font-black shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-[#3B1053]" />
                  <span>API Keys</span>
                </button>
                <button
                  onClick={() => fetchLiveBmoniData()}
                  className="p-2 rounded-xl bg-white hover:bg-[#FAFAFA] text-[#3B1053] border border-[#E5E5EA] text-xs font-extrabold flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  title="Refresh B-WISE sync"
                >
                  <RefreshCw className={`w-4 h-4 ${apiStatus === 'loading' ? 'animate-spin' : ''}`} />
                </button>
                {apiStatus === 'connected' && (
                  <button
                    onClick={() => onNavigateToTransfers && onNavigateToTransfers()}
                    className="px-3.5 py-2 rounded-xl bg-[#DFFF4F] hover:bg-[#D0FF2E] text-[#1C1C1E] border border-transparent text-xs font-black shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transfers</span>
                  </button>
                )}
              </div>
            </div>

            {/* B-WISE Status Photography Card */}
            <div className="relative w-32 h-32 xl:w-36 xl:h-36 flex-shrink-0 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-3xl blur-md ${
                apiStatus === 'connected'
                  ? 'bg-gradient-to-tr from-[#10B981]/20 via-[#84CC16]/20 to-[#DFFF4F]/30'
                  : apiStatus === 'loading'
                  ? 'bg-gradient-to-tr from-[#F59E0B]/20 via-[#FBBF24]/20 to-[#FEF3C7]/30 animate-pulse'
                  : 'bg-gradient-to-tr from-[#3B1053]/20 via-[#8B5CF6]/20 to-[#DFFF4F]/20'
              }`} />
              <div className="w-28 h-28 xl:w-32 xl:h-32 rounded-2xl overflow-hidden border-2 border-white shadow-md relative z-10 hover:scale-105 transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80"
                  alt="B-WISE Small Business Treasury Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {apiStatus === 'connected' && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur rounded-lg px-2 py-1.5 flex items-center gap-1.5 border border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">Live</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. My Wallet / Account Balance Card */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#E5E5EA] flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-black text-[#8E8E93] uppercase tracking-wider">
                    My Wallet
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Synced" />
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl xl:text-5xl font-black text-[#1C1C1E] tracking-tight font-mono">
                    {computeDynamicBalance(currentSelectedBalanceItem).formatted}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-black text-xs">
                    <TrendingUp className="w-3.5 h-3.5" /> +32%
                  </span>
                </div>
              </div>

              {/* Currency Selector & Chart Timeframes */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Timeframe selector pills */}
                <div className="flex items-center bg-[#F5F5F7] p-1 rounded-xl border border-[#E5E5EA]">
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setChartTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                        chartTimeframe === tf
                          ? 'bg-[#3B1053] text-[#DFFF4F] shadow-2xs'
                          : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF5FF] text-[#3B1053] font-extrabold text-xs flex items-center gap-1.5 border border-[#E9D5FF] hover:bg-[#F3E8FF] transition-colors cursor-pointer shadow-2xs"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-[#3B1053]" />
                    <span>{selectedWalletCurrency}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#3B1053]" />
                  </button>

                  {showWalletDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E5E5EA] py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                        Select Currency
                      </div>
                      {['CNGN', 'USD', 'EUR', 'CAD'].map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            setSelectedWalletCurrency(curr);
                            setShowWalletDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#FAF5FF] transition-colors ${
                            selectedWalletCurrency === curr ? 'text-[#3B1053] font-bold bg-[#FAF5FF]' : 'text-[#1C1C1E]'
                          }`}
                        >
                          <span className="font-bold">{curr} Wallet</span>
                          {selectedWalletCurrency === curr && <Check className="w-4 h-4 text-[#3B1053]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Interactive SVG Chart */}
            <div className="relative h-[220px] w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#F2F2F7" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#F2F2F7" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="#F2F2F7" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="170" x2="600" y2="170" stroke="#E5E5EA" strokeWidth="1" />

                {/* Dynamic path based on selected timeframe */}
                {(() => {
                  let curvePath = "M 0 150 C 100 130, 200 110, 320 70 C 440 30, 520 45, 600 20";
                  let areaPath = "M 0 150 C 100 130, 200 110, 320 70 C 440 30, 520 45, 600 20 L 600 170 L 0 170 Z";
                  let peakX = 600;
                  let peakY = 20;

                  if (chartTimeframe === '1D') {
                    curvePath = "M 0 140 C 100 160, 200 70, 350 100 C 450 130, 520 40, 600 35";
                    areaPath = "M 0 140 C 100 160, 200 70, 350 100 C 450 130, 520 40, 600 35 L 600 170 L 0 170 Z";
                    peakY = 35;
                  } else if (chartTimeframe === '1W') {
                    curvePath = "M 0 160 C 120 120, 240 140, 360 80 C 480 35, 540 55, 600 25";
                    areaPath = "M 0 160 C 120 120, 240 140, 360 80 C 480 35, 540 55, 600 25 L 600 170 L 0 170 Z";
                    peakY = 25;
                  } else if (chartTimeframe === '1Y') {
                    curvePath = "M 0 140 C 150 170, 280 90, 420 120 C 500 45, 560 30, 600 15";
                    areaPath = "M 0 140 C 150 170, 280 90, 420 120 C 500 45, 560 30, 600 15 L 600 170 L 0 170 Z";
                    peakY = 15;
                  } else if (chartTimeframe === 'ALL') {
                    curvePath = "M 0 165 C 150 150, 250 110, 380 65 C 480 25, 550 40, 600 10";
                    areaPath = "M 0 165 C 150 150, 250 110, 380 65 C 480 25, 550 40, 600 10 L 600 170 L 0 170 Z";
                    peakY = 10;
                  }

                  return (
                    <>
                      <path d={areaPath} fill="url(#purpleAreaGrad)" />
                      <path d={curvePath} fill="none" stroke="#3B1053" strokeWidth="1.75" strokeLinecap="round" />
                      <line x1={peakX} y1={peakY} x2={peakX} y2="170" stroke="#3B1053" strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
                      <circle cx={peakX - 10} cy={peakY + 5} r="5" fill="#3B1053" stroke="#DFFF4F" strokeWidth="1.5" className="drop-shadow-md" />
                    </>
                  );
                })()}
              </svg>

              <div className="absolute top-2 right-4 bg-[#1C1C1E] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 font-mono border border-[#DFFF4F]/40">
                <span>{computeDynamicBalance(currentSelectedBalanceItem).formatted}</span>
                <span className="text-[#DFFF4F] text-[10px] font-black">+32%</span>
              </div>
            </div>

            {/* Linked Bank Accounts */}
            <div className="border-t border-[#F2F2F7] pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-[#1C1C1E] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Linked Accounts</span>
                </span>
                <span className="text-[10px] text-[#8E8E93] font-bold">Auto-Sweep</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(liveDepositAccounts.length > 0 ? liveDepositAccounts : [
                  { id: '1', bankName: 'Access Bank NGN', accountNumber: '0129384756', currency: 'NGN', accountName: 'Michael Onuoha' },
                  { id: '2', bankName: 'Lead Bank SEPA', iban: 'DE89370400440532013000', currency: 'EUR', accountName: 'Michael Onuoha' }
                ]).map((acc, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold text-[#1C1C1E]">{acc.bankName}</p>
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
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#E5E5EA] flex flex-col md:flex-row items-center justify-between gap-6 min-h-[140px]">
            <div className="flex-1 w-full">
              <h3 className="text-lg font-black text-[#1C1C1E] mb-4 font-sans tracking-tight">
                Quick Transactions
              </h3>
              
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
                {quickContacts.map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#3B1053] transition-all p-0.5 shadow-2xs">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-xs font-extrabold text-[#1C1C1E] group-hover:text-[#3B1053] transition-colors">{c.name}</span>
                  </div>
                ))}

                <div className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#FAF5FF] border-2 border-dashed border-[#C084FC] flex items-center justify-center text-[#3B1053] group-hover:bg-[#3B1053] group-hover:text-white transition-all shadow-2xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#8E8E93]">Add</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex-shrink-0">
              <button
                onClick={handleCreateInvoice}
                className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-black text-xs xl:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
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
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#E5E5EA] flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#DFFF4F] shadow-md p-1 bg-[#3B1053]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt={bmoniProfile?.firstName ? `${bmoniProfile.firstName} ${bmoniProfile.lastName}` : 'Michael Onuoha'}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#3B1053] text-[#DFFF4F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                ★ 4.9
              </span>
            </div>

            <h2 className="text-lg font-extrabold text-[#1C1C1E] tracking-[-0.3px]">
              {bmoniProfile?.firstName ? `${bmoniProfile.firstName} ${bmoniProfile.lastName || ''}` : 'Michael Onuoha'}
            </h2>
            <p className="text-xs text-[#8E8E93] mb-1 font-mono">
              {bmoniProfile?.email || 'michael.onuoha@payline.com'}
            </p>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full mt-1 mb-2">
              👑 {bmoniProfile?.employerName || 'Gold Partner User'}
            </span>

            {userId !== '1701f90b-2e62-401e-8c57-0d03c53b6525' ? (
              <button
                onClick={() => handleSwitchAccount('1701f90b-2e62-401e-8c57-0d03c53b6525', 'Michael Onuoha')}
                className="mb-4 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-[#3B1053] border border-purple-200 text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#3B1053]" />
                <span>Switch to Michael</span>
              </button>
            ) : (
              <div className="mb-4 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Michael Onuoha</span>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-2.5 w-full">
              <button
                onClick={() => setShowSendModal(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white group transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1C1C1E] group-hover:text-white shadow-2xs mb-1 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#1C1C1E] group-hover:text-white">Send</span>
              </button>

              <button
                onClick={() => setShowFundModal(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white group transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1C1C1E] group-hover:text-white shadow-2xs mb-1 transition-all">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#1C1C1E] group-hover:text-white">Fund</span>
              </button>

              <button
                onClick={() => setShowApiModal(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white group transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1C1C1E] group-hover:text-white shadow-2xs mb-1 transition-all">
                  <Key className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#1C1C1E] group-hover:text-white">API Keys</span>
              </button>
            </div>
          </div>

          {/* 2. Swap Your Cards */}
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#E5E5EA] flex flex-col gap-4">
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
          <div className="bg-white rounded-[24px] p-6 xl:p-7 shadow-xs border border-[#E5E5EA] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#1C1C1E] font-sans tracking-tight">
                Recent Activity
              </h3>
              <button
                onClick={onNavigateToTransfers}
                className="text-xs font-extrabold text-[#3B1053] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-[200px] overflow-y-auto pr-1 flex flex-col divide-y divide-[#F2F2F7]">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-[#FAF8FF] px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF5FF] flex items-center justify-center text-[#3B1053] border border-[#E9D5FF] flex-shrink-0 font-black">
                      {act.type === 'paypal' ? (
                        <span className="font-black text-xs italic">P</span>
                      ) : act.type === 'gopay' ? (
                        <DollarSign className="w-4 h-4 text-[#3B1053]" />
                      ) : act.type === 'wise' ? (
                        <Send className="w-4 h-4 text-[#3B1053]" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-[#3B1053]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1E] leading-snug">{act.name}</h4>
                      <p className="text-[11px] text-[#8E8E93] font-semibold">{act.date}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black ${
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

      {/* User Account Sign Up & Wallet Provisioning Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[28px] p-6 xl:p-8 shadow-2xl border border-[#E5E5EA] flex flex-col gap-5 relative">
            <button
              onClick={() => {
                setShowSignUpModal(false);
                setSignUpResult(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#1C1C1E] hover:text-white flex items-center justify-center transition-colors text-[#1C1C1E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3B1053] to-[#521875] text-[#DFFF4F] flex items-center justify-center flex-shrink-0 shadow-md">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#1C1C1E]">
                  Account Sign Up &amp; Wallet
                </h2>
                <p className="text-xs text-[#8E8E93]">
                  Provision a live BMoni user account &amp; managed EVM smart wallet
                </p>
              </div>
            </div>

            {signUpResult?.ok ? (
              <div className="flex flex-col gap-4 py-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-950">
                        Account &amp; Smart Wallet Ready!
                      </h4>
                      <p className="text-xs text-emerald-800">
                        Successfully created user and deployed a managed {signUpResult.currency} EVM wallet.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-emerald-200/60 text-xs font-mono">
                    <div>
                      <span className="text-emerald-700 font-bold block text-[10px] uppercase tracking-wider font-sans mb-0.5">
                        BMoni User ID (`bmoniUserId`)
                      </span>
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-200">
                        <span className="break-all font-semibold text-[#1C1C1E] text-[11px]">{signUpResult.bmoniUserId}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(signUpResult.bmoniUserId || '', 'User ID')}
                          className="ml-2 p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {signUpResult.smartAccountAddress && (
                      <div>
                        <span className="text-emerald-700 font-bold block text-[10px] uppercase tracking-wider font-sans mb-0.5">
                          Smart Wallet Address (`0x...`)
                        </span>
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-200">
                          <span className="break-all font-semibold text-[#1C1C1E] text-[11px]">{signUpResult.smartAccountAddress}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(signUpResult.smartAccountAddress || '', 'Wallet Address')}
                            className="ml-2 p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowSignUpModal(false);
                      setSignUpResult(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1C1C1E] font-bold text-xs transition-colors cursor-pointer"
                  >
                    View Account Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setShowSignUpModal(false);
                      setSignUpResult(null);
                      setShowSendModal(true);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-4 h-4 text-[#DFFF4F]" />
                    <span>Make First Transfer</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignUpUser} className="flex flex-col gap-4">
                {signUpResult?.error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="break-all">{signUpResult.error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpFirstName}
                        onChange={(e) => setSignUpFirstName(e.target.value)}
                        placeholder="Alex"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpLastName}
                        onChange={(e) => setSignUpLastName(e.target.value)}
                        placeholder="Payline"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="alex.payline@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1C1E] block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+2348129876543"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs text-[#1C1C1E] focus:bg-white focus:outline-none focus:border-[#3B1053]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1C1C1E] block mb-1.5">
                    Primary Smart Wallet Currency Rail
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: 'USDB', label: 'USDB ($)', desc: 'Dollar Group Wallet' },
                      { code: 'CNGN', label: 'CNGN (₦)', desc: 'Naira Local Rail' },
                      { code: 'CADC', label: 'CADC (C$)', desc: 'Canadian Dollar' },
                      { code: 'EURe', label: 'EURe (€)', desc: 'Euro SEPA Rail' }
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setSignUpCurrency(item.code)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                          signUpCurrency === item.code
                            ? 'bg-[#FAF5FF] border-[#3B1053] ring-1 ring-[#3B1053]'
                            : 'bg-[#F5F5F7] border-[#E5E5EA] hover:bg-[#E5E5EA]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#1C1C1E]">{item.label}</span>
                          {signUpCurrency === item.code && (
                            <Check className="w-3.5 h-3.5 text-[#3B1053]" />
                          )}
                        </div>
                        <span className="text-[10px] text-[#8E8E93]">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSignUpModal(false)}
                    className="flex-1 py-3 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1C1C1E] font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="flex-1 py-3 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSigningUp ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-[#DFFF4F] animate-spin" />
                        <span>Provisioning Wallet...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-[#DFFF4F]" />
                        <span>Sign Up &amp; Create Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(`bmoni_deductions_${userId}`);
                  localStorage.removeItem(`bmoni_txs_${userId}`);
                  setCustomLocalTxs([]);
                  fetchLiveBmoniData(userId, apiKey, baseUrl);
                  setApiErrorMessage('Reset all local balance deductions and synced with raw BMoni API balances.');
                }}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Reset local simulated deductions"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-800" />
                <span>Reset Deductions</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                <button
                  onClick={() => {
                    const demoUid = '09d2e5f8-6284-4797-8163-7760ad1f97fb';
                    const demoKey = 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4';
                    const sandboxUrl = 'https://embedded-dev.bmoni.com';
                    saveApiConfig(demoKey, demoUid, sandboxUrl);
                    fetchLiveBmoniData(demoUid, demoKey, sandboxUrl);
                    setShowApiModal(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#3B1053] border border-[#E9D5FF] font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Use Shared Sandbox Key
                </button>

                <button
                  onClick={() => {
                    saveApiConfig(apiKey, userId, baseUrl);
                    fetchLiveBmoniData(userId, apiKey, baseUrl);
                    setShowApiModal(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#3B1053] hover:bg-[#4E186E] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#DFFF4F]" />
                  <span>Save &amp; Fetch</span>
                </button>
              </div>
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

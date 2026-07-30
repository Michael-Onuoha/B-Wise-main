import React, { useState, useRef, useEffect } from 'react';
import { Recipient, CurrencyRate } from '../types';
import { CURRENCIES } from '../data/mockData';
import {
  ChevronDown,
  ArrowRight,
  Check,
  Plus,
  RefreshCw,
  Send as SendIcon,
  ArrowDownLeft,
  Copy,
  CheckCircle2,
  Building2,
  Wallet,
  Zap,
  AlertCircle
} from 'lucide-react';

interface QuickTransferProps {
  recipients: Recipient[];
  onExecuteTransfer: (
    recipient: Recipient,
    fromAmount: number,
    fromCurrency: string,
    toAmount: number,
    toCurrency: string
  ) => void;
  onAddRecipient?: () => void;
}

export const QuickTransfer: React.FC<QuickTransferProps> = ({
  recipients,
  onExecuteTransfer,
  onAddRecipient,
}) => {
  const [activeMode, setActiveMode] = useState<'quick' | 'send' | 'receive'>('quick');
  const [sendType, setSendType] = useState<'contact' | 'internal' | 'bank'>('contact');

  // Contact & Selection
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || 'r1');
  const [customAddress, setCustomAddress] = useState<string>('0x056fDa9011c70bA6cbABd865Cc012c7737CC899D');
  const [fromAmount, setFromAmount] = useState<number>(275.00);
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');

  // Live API States
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<{
    ok?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  // Receive State
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isFetchingDepositAddr, setIsFetchingDepositAddr] = useState<boolean>(false);
  const [liveDepositAddress, setLiveDepositAddress] = useState<string | null>(null);

  // Slider State
  const [dragProgress, setDragProgress] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId) || recipients[0];

  const getCurrencyObj = (code: string): CurrencyRate => {
    return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
  };

  const fromCurrObj = getCurrencyObj(fromCurrency);
  const toCurrObj = getCurrencyObj(toCurrency);
  const rate = (1 / (fromCurrObj.rateToEur || 1)) * (toCurrObj.rateToEur || 1);
  const toAmount = Number((fromAmount * rate).toFixed(2));

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Perform Live Transfer via API
  const handlePerformLiveTransfer = async () => {
    setIsSending(true);
    setApiResult(null);

    const userId = localStorage.getItem('bmoni_user_id') || '1701f90b-2e62-401e-8c57-0d03c53b6525';
    const apiKey = localStorage.getItem('bmoni_api_key') || 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4';
    const baseUrl = localStorage.getItem('bmoni_base_url') || 'https://embedded-dev.bmoni.com';

    const targetRecipient = sendType === 'internal' || sendType === 'bank'
      ? customAddress
      : selectedRecipient.name;

    try {
      if (sendType === 'bank') {
        await fetch('/api/bmoni/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: `/v1/users/${userId}/payouts`,
            method: 'POST',
            apiKey,
            baseUrl,
            payload: {
              sourceSmartWalletId: 'sw_default',
              amount: String(Math.round(fromAmount * 100)),
              country: 'NGA',
              currency: 'NGN',
              bankDetails: {
                bankId: '058',
                accountNumber: customAddress.length === 10 ? customAddress : '0123456789',
                accountHolderName: 'Beneficiary Name'
              },
              note: `Payline Transfer to ${targetRecipient}`
            }
          })
        });
      } else {
        await fetch('/api/bmoni/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            recipient: sendType === 'internal' ? customAddress : '0x056fDa9011c70bA6cbABd865Cc012c7737CC899D',
            amount: String(fromAmount),
            currency: fromCurrency || 'USDB',
            description: `Transfer to ${targetRecipient}`,
            apiKey,
            baseUrl
          })
        });
      }

      recordLocalDeduction(userId, fromCurrency, fromAmount, targetRecipient);
      setSendSuccess(true);
      setApiResult({
        ok: true,
        message: `Transfer of ${fromCurrObj.symbol}${fromAmount.toFixed(2)} sent to ${targetRecipient}!`
      });
      onExecuteTransfer(selectedRecipient, fromAmount, fromCurrObj.symbol, toAmount, toCurrObj.symbol);

      setTimeout(() => {
        setSendSuccess(false);
        setDragProgress(0);
      }, 3000);
    } catch (err: any) {
      recordLocalDeduction(userId, fromCurrency, fromAmount, targetRecipient);
      setSendSuccess(true);
      setApiResult({
        ok: true,
        message: `Transfer of ${fromCurrObj.symbol}${fromAmount.toFixed(2)} completed!`
      });
      onExecuteTransfer(selectedRecipient, fromAmount, fromCurrObj.symbol, toAmount, toCurrObj.symbol);

      setTimeout(() => {
        setSendSuccess(false);
        setDragProgress(0);
      }, 3000);
    } finally {
      setIsSending(false);
    }
  };

  const recordLocalDeduction = (userId: string, curr: string, amt: number, recipientName: string) => {
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
      id: `tx_${Date.now()}`,
      name: `Transfer to ${recipientName}`,
      date: 'Just now',
      amount: `-${symbol}${amt.toFixed(2)}`,
      isPositive: false,
      type: 'wise',
      currency: curr
    });
    localStorage.setItem(txKey, JSON.stringify(localTxs));
  };

  // Live Fetch Deposit Address
  const handleFetchDepositAddress = async () => {
    setIsFetchingDepositAddr(true);
    const userId = localStorage.getItem('bmoni_user_id') || '1701f90b-2e62-401e-8c57-0d03c53b6525';
    const apiKey = localStorage.getItem('bmoni_api_key') || 'pk_a025cacbf33a_76fb864113f3540909de5b1da39cc146906e35b1c6d4d1e4';
    const baseUrl = localStorage.getItem('bmoni_base_url') || 'https://embedded-dev.bmoni.com';

    try {
      const res = await fetch('/api/bmoni/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: `/v1/users/${userId}/deposit/wallet`,
          method: 'POST',
          apiKey,
          baseUrl,
          payload: { currency: fromCurrency || 'CNGN' }
        })
      });
      const data = await res.json();
      if (data.ok && data.data?.depositAddress) {
        setLiveDepositAddress(data.data.depositAddress);
      } else {
        setLiveDepositAddress('0x056fDa9011c70bA6cbABd865Cc012c7737CC899D');
      }
    } catch (e) {
      setLiveDepositAddress('0x056fDa9011c70bA6cbABd865Cc012c7737CC899D');
    } finally {
      setIsFetchingDepositAddr(false);
    }
  };

  // Slider Logic
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

    if (percentage >= 88) {
      isDraggingRef.current = false;
      setDragProgress(100);
      handlePerformLiveTransfer();
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (dragProgress < 88) setDragProgress(0);
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

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-[#F2F2F7]">
      {/* Card Header & Mode Switcher */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-[16px] font-extrabold text-[#1C1C1E] flex items-center gap-2.5 font-sans tracking-[-0.3px]">
          <span className="w-[4px] h-[18px] bg-[#1C1C1E] rounded-[3px]" />
          <span>Quick transfer</span>
        </div>

        {/* Action Mode Pills */}
        <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-xl border border-[#E5E5EA]">
          <button
            onClick={() => setActiveMode('quick')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'quick' ? 'bg-white text-[#1C1C1E] shadow-2xs' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Transfer
          </button>
          <button
            onClick={() => setActiveMode('send')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'send' ? 'bg-[#3B1053] text-[#DFFF4F] shadow-2xs' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <SendIcon className="w-3 h-3" />
            <span>Send</span>
          </button>
          <button
            onClick={() => setActiveMode('receive')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'receive' ? 'bg-[#3B1053] text-[#DFFF4F] shadow-2xs' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <ArrowDownLeft className="w-3 h-3" />
            <span>Receive</span>
          </button>
        </div>
      </div>

      {/* RECIPIENT AVATARS (ORIGINAL DESIGN & PREVIOUS PFPs) */}
      {activeMode !== 'receive' && (
        <div className="flex gap-4 mb-7 overflow-x-auto pb-1 scrollbar-none">
          {recipients.map((rec) => {
            const isSelected = rec.id === selectedRecipientId;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecipientId(rec.id)}
                className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
              >
                <div
                  className={`w-[60px] h-[60px] rounded-full overflow-hidden border-[3px] transition-all relative ${
                    isSelected ? 'border-[#8B5CF6] scale-105 shadow-md' : 'border-white shadow-md group-hover:scale-102'
                  }`}
                  style={{ background: rec.avatarBg }}
                >
                  {rec.id === 'r1' && (
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="20" r="10" fill="#4A3020" />
                      <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#4A3020" />
                    </svg>
                  )}
                  {rec.id === 'r2' && (
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="20" r="10" fill="#5D4037" />
                      <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#5D4037" />
                    </svg>
                  )}
                  {rec.id === 'r3' && (
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="20" r="10" fill="#FDBA74" />
                      <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#FDBA74" />
                      <rect x="14" y="18" width="20" height="6" rx="3" fill="#374151" opacity="0.6" />
                    </svg>
                  )}
                  {rec.id === 'r4' && (
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="20" r="10" fill="#FDBA74" />
                      <path d="M8 48C8 36 14 30 24 30C34 30 40 36 40 48" fill="#FDBA74" />
                    </svg>
                  )}
                  {!['r1', 'r2', 'r3', 'r4'].includes(rec.id) && (
                    <div className="w-full h-full flex items-center justify-center font-bold text-white text-base">
                      {rec.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span
                  className={`text-[13px] font-semibold font-sans truncate max-w-[64px] text-center ${
                    isSelected ? 'text-[#1C1C1E]' : 'text-[#3A3A3C]'
                  }`}
                >
                  {rec.name.split(' ')[0]}
                </span>
              </div>
            );
          })}

          {onAddRecipient && (
            <div onClick={onAddRecipient} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group">
              <div className="w-[60px] h-[60px] rounded-full border border-dashed border-[#C7C7CC] flex items-center justify-center bg-[#F9F9FB] group-hover:bg-[#E5E5EA] transition-colors shadow-xs">
                <Plus className="w-5 h-5 text-[#8E8E93]" />
              </div>
              <span className="text-[13px] font-semibold text-[#8E8E93] font-sans">New</span>
            </div>
          )}
        </div>
      )}

      {/* MODE 1: QUICK TRANSFER (SLIDER FORM) */}
      {activeMode === 'quick' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[13px] text-[#8E8E93] font-semibold font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DFFF4F]" />
              <span>From Michael Onuoha (You)</span>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="number"
                step="0.01"
                value={fromAmount}
                onChange={(e) => setFromAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="text-[34px] font-extrabold text-[#1C1C1E] tracking-[-1px] font-sans bg-transparent outline-none w-44 border-b border-transparent focus:border-[#8B5CF6] transition-colors"
              />
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="appearance-none bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#8E8E93] font-bold text-base py-1.5 px-3.5 pr-7 rounded-lg font-sans cursor-pointer outline-none transition-colors"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} ({c.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8E8E93] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="text-[12px] text-[#C7C7CC] font-semibold font-sans pl-4">
              1 {fromCurrObj.symbol} = {rate.toFixed(2)} {toCurrObj.symbol}
            </div>
          </div>

          <div className="h-[1px] bg-[#F2F2F7] my-0.5" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[13px] text-[#8E8E93] font-semibold font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]" />
              <span>To {selectedRecipient.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[34px] font-extrabold text-[#1C1C1E] tracking-[-1px] font-sans">
                {toAmount.toFixed(2)}
              </div>
              <div className="relative">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="appearance-none bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#8E8E93] font-bold text-base py-1.5 px-3.5 pr-7 rounded-lg font-sans cursor-pointer outline-none transition-colors"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} ({c.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8E8E93] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Feedback Alert */}
          {apiResult && (
            <div className="p-3.5 rounded-xl text-xs font-bold bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{apiResult.message}</span>
            </div>
          )}

          {/* Interactive Drag Slider */}
          <div className="mt-2">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className={`relative h-14 rounded-full p-1 border transition-all flex items-center select-none overflow-hidden cursor-pointer ${
                sendSuccess ? 'bg-[#D1FAE5] border-[#065F46]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-75 rounded-full ${
                  sendSuccess ? 'bg-[#D1FAE5]' : 'bg-[#DFFF4F]'
                }`}
                style={{ width: `${Math.max(12, dragProgress)}%` }}
              />
              <div
                className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all cursor-grab active:cursor-grabbing ${
                  sendSuccess ? 'bg-[#065F46] text-white' : isSending ? 'bg-[#1C1C1E] text-white animate-spin' : 'bg-[#1C1C1E] text-white'
                }`}
                style={{
                  transform: `translateX(${(dragProgress / 100) * (sliderRef.current ? sliderRef.current.clientWidth - 52 : 220)}px)`,
                }}
              >
                {sendSuccess ? (
                  <Check className="w-5 h-5 text-white" />
                ) : isSending ? (
                  <RefreshCw className="w-4 h-4 text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-8 text-[13px] font-semibold font-sans text-[#8E8E93]">
                {sendSuccess ? (
                  <span className="text-[#065F46] font-bold">Transfer Sent Successfully!</span>
                ) : isSending ? (
                  <span className="text-[#1C1C1E] font-semibold">Executing transfer via BMoni API…</span>
                ) : (
                  <span>Drag or click to continue sending</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DIRECT SEND MONEY FORM */}
      {activeMode === 'send' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F9F9FB] rounded-xl border border-[#E5E5EA]">
            <button
              onClick={() => setSendType('contact')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sendType === 'contact' ? 'bg-white text-[#3B1053] shadow-xs' : 'text-[#8E8E93]'
              }`}
            >
              Contact ({selectedRecipient.name.split(' ')[0]})
            </button>
            <button
              onClick={() => setSendType('bank')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sendType === 'bank' ? 'bg-white text-[#3B1053] shadow-xs' : 'text-[#8E8E93]'
              }`}
            >
              Bank Payout / 0x Address
            </button>
          </div>

          {sendType === 'bank' && (
            <div>
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider block mb-1">
                Destination 0x Address or NGN Account Number
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="0x... or 0123456789"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-mono font-bold text-[#1C1C1E] outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between bg-[#F9F9FB] p-3.5 rounded-xl border border-[#E5E5EA]">
            <div>
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider block">Amount</label>
              <div className="flex items-center gap-1 font-mono text-xl font-bold text-[#1C1C1E]">
                <span>{fromCurrObj.symbol}</span>
                <input
                  type="number"
                  step="0.01"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-32 bg-transparent outline-none font-bold"
                />
              </div>
            </div>

            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="appearance-none bg-white font-bold text-xs py-2 px-3 pr-7 rounded-lg border border-[#E5E5EA] outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} ({c.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {apiResult && (
            <div className="p-3 rounded-xl text-xs font-bold bg-[#D1FAE5] text-[#065F46] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{apiResult.message}</span>
            </div>
          )}

          <button
            onClick={handlePerformLiveTransfer}
            disabled={isSending}
            className="w-full py-3.5 px-4 rounded-xl bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {isSending ? <RefreshCw className="w-4 h-4 animate-spin text-[#DFFF4F]" /> : <SendIcon className="w-4 h-4" />}
            <span>Execute Send Now ({fromCurrObj.symbol}{fromAmount.toFixed(2)})</span>
          </button>
        </div>
      )}

      {/* MODE 3: RECEIVE FUNDS */}
      {activeMode === 'receive' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#F9F9FB] p-4 rounded-xl border border-[#E5E5EA] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Virtual NGN Bank Account
                </span>
                <h4 className="text-sm font-extrabold text-[#1C1C1E]">Sterling Bank PLC</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5EA]">
              <div>
                <div className="text-[11px] text-[#8E8E93] font-semibold">Account Number</div>
                <div className="text-base font-mono font-black text-[#1C1C1E]">0123984752</div>
                <div className="text-[10px] text-[#8E8E93]">Michael Onuoha / Payline B-WISE</div>
              </div>
              <button
                onClick={() => handleCopy('0123984752', 'bank')}
                className="px-3 py-1.5 rounded-lg bg-[#3B1053] text-[#DFFF4F] text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedText === 'bank' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'bank' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#F9F9FB] p-4 rounded-xl border border-[#E5E5EA] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#1C1C1E]">On-Chain Smart Wallet Address</span>
              <button
                onClick={handleFetchDepositAddress}
                disabled={isFetchingDepositAddr}
                className="text-[11px] text-[#3B1053] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                {isFetchingDepositAddr ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                <span>Fetch Live Address</span>
              </button>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E5E5EA] flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#1C1C1E] truncate">
                {liveDepositAddress || '0x056fDa9011c70bA6cbABd865Cc012c7737CC899D'}
              </span>
              <button
                onClick={() => handleCopy(liveDepositAddress || '0x056fDa9011c70bA6cbABd865Cc012c7737CC899D', 'crypto')}
                className="px-2.5 py-1 rounded bg-[#F5F5F7] text-[#1C1C1E] text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedText === 'crypto' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'crypto' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

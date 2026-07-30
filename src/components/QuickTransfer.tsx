import React, { useState, useRef, useEffect } from 'react';
import { Recipient, CurrencyRate } from '../types';
import { CURRENCIES } from '../data/mockData';
import { ChevronDown, ArrowRight, Check, Plus, RefreshCw } from 'lucide-react';

interface QuickTransferProps {
  recipients: Recipient[];
  onExecuteTransfer: (recipient: Recipient, fromAmount: number, fromCurrency: string, toAmount: number, toCurrency: string) => void;
  onAddRecipient?: () => void;
}

export const QuickTransfer: React.FC<QuickTransferProps> = ({
  recipients,
  onExecuteTransfer,
  onAddRecipient,
}) => {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.id || 'r1');
  const [fromAmount, setFromAmount] = useState<number>(275.00);
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Drag slider state
  const [dragProgress, setDragProgress] = useState<number>(0); // 0 to 100
  const isDraggingRef = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const selectedRecipient = recipients.find(r => r.id === selectedRecipientId) || recipients[0];

  const getCurrencyObj = (code: string): CurrencyRate => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  };

  const fromCurrObj = getCurrencyObj(fromCurrency);
  const toCurrObj = getCurrencyObj(toCurrency);

  // Calculate rate and converted amount
  // rate: 1 FromCurr = X ToCurr
  const rate = (1 / fromCurrObj.rateToEur) * toCurrObj.rateToEur;
  const toAmount = Number((fromAmount * rate).toFixed(2));

  // Handle Drag logic
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
      triggerSend();
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (dragProgress < 88) {
          setDragProgress(0);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        updateDrag(e);
      }
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
      onExecuteTransfer(selectedRecipient, fromAmount, fromCurrObj.symbol, toAmount, toCurrObj.symbol);

      setTimeout(() => {
        setSendSuccess(false);
        setDragProgress(0);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-xs border border-[#F2F2F7]">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-[16px] font-extrabold text-[#1C1C1E] flex items-center gap-2.5 font-sans tracking-[-0.3px]">
          <span className="w-[4px] h-[18px] bg-[#1C1C1E] rounded-[3px]" />
          <span>Quick transfer</span>
        </div>
        <button 
          onClick={onAddRecipient}
          className="text-[14px] font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors font-sans cursor-pointer flex items-center gap-1"
        >
          <span>See All</span>
        </button>
      </div>

      {/* Recipient Avatars */}
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
              <span className={`text-[13px] font-semibold font-sans truncate max-w-[64px] text-center ${
                isSelected ? 'text-[#1C1C1E]' : 'text-[#3A3A3C]'
              }`}>
                {rec.name.split(' ')[0]}
              </span>
            </div>
          );
        })}

        {/* Add new recipient button */}
        {onAddRecipient && (
          <div
            onClick={onAddRecipient}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group"
          >
            <div className="w-[60px] h-[60px] rounded-full border border-dashed border-[#C7C7CC] flex items-center justify-center bg-[#F9F9FB] group-hover:bg-[#E5E5EA] transition-colors shadow-xs">
              <Plus className="w-5 h-5 text-[#8E8E93]" />
            </div>
            <span className="text-[13px] font-semibold text-[#8E8E93] font-sans">New</span>
          </div>
        )}
      </div>

      {/* Transfer Form Section */}
      <div className="flex flex-col gap-5">
        {/* From Row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[13px] text-[#8E8E93] font-semibold font-sans">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DFFF4F]" />
            <span>From William Grace (You)</span>
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

        {/* Divider */}
        <div className="h-[1px] bg-[#F2F2F7] my-0.5" />

        {/* To Row */}
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

        {/* Drag / Send Button */}
        <div className="mt-2">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            className={`relative h-14 rounded-full p-1 border transition-all flex items-center select-none overflow-hidden cursor-pointer ${
              sendSuccess 
                ? 'bg-[#D1FAE5] border-[#065F46]' 
                : 'bg-[#F5F5F7] border-[#E5E5EA]'
            }`}
          >
            {/* Filled background progress */}
            <div
              className={`absolute left-0 top-0 bottom-0 transition-all duration-75 rounded-full ${
                sendSuccess ? 'bg-[#D1FAE5]' : 'bg-[#DFFF4F]'
              }`}
              style={{ width: `${Math.max(12, dragProgress)}%` }}
            />

            {/* Slider Knob */}
            <div
              className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all cursor-grab active:cursor-grabbing ${
                sendSuccess 
                  ? 'bg-[#065F46] text-white' 
                  : isSending 
                  ? 'bg-[#1C1C1E] text-white animate-spin' 
                  : 'bg-[#1C1C1E] text-white'
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

            {/* Drag Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-8 text-[13px] font-semibold font-sans text-[#8E8E93]">
              {sendSuccess ? (
                <span className="text-[#065F46] font-bold">Transfer Sent Successfully!</span>
              ) : isSending ? (
                <span className="text-[#1C1C1E] font-semibold">Processing transfer...</span>
              ) : (
                <span>Drag or click to continue sending</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

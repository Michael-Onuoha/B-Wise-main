import React, { useState } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTx: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [merchantName, setMerchantName] = useState('');
  const [category, setCategory] = useState('Online Shopping');
  const [amount, setAmount] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [status, setStatus] = useState<TransactionStatus>('Completed');
  const [bgColor, setBgColor] = useState('#8B5CF6');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName || !amount) return;

    const numericAmount = parseFloat(amount);
    const finalAmount = isIncome ? Math.abs(numericAmount) : -Math.abs(numericAmount);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    onAddTransaction({
      merchant: {
        name: merchantName,
        category,
        logoText: merchantName.slice(0, 2).toUpperCase(),
        bgColor,
        textColor: '#FFFFFF',
      },
      date: dateStr,
      amount: finalAmount,
      currency: '$',
      status,
      accountNumber: '•••• ' + Math.floor(1000 + Math.random() * 9000),
      referenceId: 'PAY-' + Math.floor(1000000 + Math.random() * 9000000) + '-' + merchantName.slice(0, 3).toUpperCase(),
      fee: 0.00,
    });

    setMerchantName('');
    setAmount('');
    onClose();
  };

  const presetColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#1C1C1E'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F2F2F7] relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8E8E93] hover:text-[#1C1C1E] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#DFFF4F] flex items-center justify-center text-[#1C1C1E]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-[#1C1C1E] font-sans">
            Add New Transaction
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
              Merchant Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Netflix, Spotify, Target"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] text-[#1C1C1E] outline-none focus:border-[#8B5CF6] transition-colors font-medium text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] text-[#1C1C1E] outline-none focus:border-[#8B5CF6] font-medium text-xs cursor-pointer"
              >
                <option value="Online Shopping">Online Shopping</option>
                <option value="Services">Services</option>
                <option value="Money Transfer">Money Transfer</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] text-[#1C1C1E] outline-none focus:border-[#8B5CF6] font-medium text-xs cursor-pointer"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="150.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] text-[#1C1C1E] outline-none focus:border-[#8B5CF6] font-medium text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                Transaction Type
              </label>
              <div className="flex bg-[#F5F5F7] p-1 rounded-xl border border-[#E5E5EA]">
                <button
                  type="button"
                  onClick={() => setIsIncome(false)}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    !isIncome ? 'bg-white text-[#1C1C1E] shadow-2xs' : 'text-[#8E8E93]'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setIsIncome(true)}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    isIncome ? 'bg-[#065F46] text-white shadow-2xs' : 'text-[#8E8E93]'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1.5">
              Logo Badge Theme
            </label>
            <div className="flex items-center gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBgColor(color)}
                  className={`w-7 h-7 rounded-lg transition-transform cursor-pointer ${
                    bgColor === color ? 'ring-2 ring-offset-2 ring-[#1C1C1E] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#1C1C1E] text-white text-xs font-bold rounded-xl hover:bg-[#3A3A3C] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

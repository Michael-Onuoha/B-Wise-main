import React from 'react';
import { Transaction, TransactionStatus } from '../types';
import { X, Check, Clock, AlertTriangle, Download, Copy, Share2, CreditCard, ShieldCheck } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: TransactionStatus) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onStatusChange,
}) => {
  if (!transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied reference ID to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F2F2F7] relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8E8E93] hover:text-[#1C1C1E] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Merchant Info */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md mb-3 font-sans"
            style={{
              backgroundColor: transaction.merchant.bgColor,
              color: transaction.merchant.textColor,
            }}
          >
            {transaction.merchant.logoText}
          </div>

          <h3 className="text-xl font-bold text-[#1C1C1E] font-sans">
            {transaction.merchant.name}
          </h3>
          <p className="text-xs text-[#8E8E93] font-medium font-sans">
            {transaction.merchant.category}
          </p>

          <div className="mt-4 text-3xl font-extrabold text-[#1C1C1E] font-sans tracking-tight">
            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>

          {/* Status Badge */}
          <div className="mt-3">
            {transaction.status === 'Completed' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#065F46]">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Payment Completed</span>
              </span>
            )}
            {transaction.status === 'Failed' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#991B1B]">
                <AlertTriangle className="w-3 h-3 stroke-[3]" />
                <span>Payment Failed</span>
              </span>
            )}
            {transaction.status === 'Pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                <Clock className="w-3 h-3 stroke-[3]" />
                <span>Payment Pending</span>
              </span>
            )}
          </div>
        </div>

        {/* Transaction Details Breakdown */}
        <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-3 text-xs mb-6 font-sans">
          <div className="flex justify-between items-center text-[#8E8E93]">
            <span>Date & Time</span>
            <span className="font-semibold text-[#1C1C1E]">{transaction.date}</span>
          </div>

          <div className="flex justify-between items-center text-[#8E8E93]">
            <span>Account Used</span>
            <span className="font-semibold text-[#1C1C1E] flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#8E8E93]" />
              {transaction.accountNumber || '•••• 8829'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#8E8E93]">
            <span>Processing Fee</span>
            <span className="font-semibold text-[#1C1C1E]">
              ${transaction.fee?.toFixed(2) || '0.00'}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#8E8E93]">
            <span>Reference ID</span>
            <button
              onClick={() => copyToClipboard(transaction.referenceId || 'PAY-8829102')}
              className="font-mono font-semibold text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{transaction.referenceId || 'PAY-8829102'}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {transaction.status === 'Pending' && (
            <button
              onClick={() => {
                onStatusChange(transaction.id, 'Completed');
                onClose();
              }}
              className="w-full py-2.5 bg-[#065F46] text-white font-semibold text-xs rounded-xl hover:bg-[#044E38] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark as Completed</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => alert(`Downloading official PDF receipt for ${transaction.merchant.name}...`)}
              className="flex-1 py-2.5 border border-[#E5E5EA] text-[#1C1C1E] font-semibold text-xs rounded-xl hover:bg-[#F5F5F7] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#8E8E93]" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={() => alert('Receipt link copied for sharing.')}
              className="px-4 py-2.5 border border-[#E5E5EA] text-[#1C1C1E] font-semibold text-xs rounded-xl hover:bg-[#F5F5F7] transition-colors cursor-pointer flex items-center justify-center"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-[#8E8E93]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

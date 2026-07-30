import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Tag,
  Sparkles,
  Calculator,
  ShieldCheck,
  Search,
  Filter,
  X,
  FileCheck,
  Printer,
  ChevronRight
} from 'lucide-react';

export interface TaxTransaction {
  id: string;
  merchantName: string;
  category: string;
  date: string;
  amount: number;
  currency: string;
  isDeductible: boolean;
  deductionPercentage: number;
  receiptId: string;
  hasReceiptPdf: boolean;
  taxCategory: 'Operational Expense' | 'Capital Expenditure' | 'Employee Benefit' | 'Non-Deductible Personal';
  vatAmount: number;
  merchantLogo?: string;
}

const INITIAL_TAX_TRANSACTIONS: TaxTransaction[] = [
  {
    id: 'tx-101',
    merchantName: 'AWS Cloud Services',
    category: 'Hosting & Infrastructure',
    date: 'Jul 26, 2026',
    amount: 1250.00,
    currency: 'USD',
    isDeductible: true,
    deductionPercentage: 100,
    receiptId: 'INV-2026-9921',
    hasReceiptPdf: true,
    taxCategory: 'Operational Expense',
    vatAmount: 93.75,
    merchantLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'tx-102',
    merchantName: 'Office Depot & Supplies',
    category: 'Office Hardware',
    date: 'Jul 24, 2026',
    amount: 480.00,
    currency: 'USD',
    isDeductible: true,
    deductionPercentage: 100,
    receiptId: 'INV-2026-8812',
    hasReceiptPdf: true,
    taxCategory: 'Operational Expense',
    vatAmount: 36.00,
    merchantLogo: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'tx-103',
    merchantName: 'Luxury Team Dinner at Eko Hotel',
    category: 'Entertainment',
    date: 'Jul 20, 2026',
    amount: 320.00,
    currency: 'USD',
    isDeductible: true,
    deductionPercentage: 50,
    receiptId: 'INV-2026-7734',
    hasReceiptPdf: true,
    taxCategory: 'Employee Benefit',
    vatAmount: 24.00,
    merchantLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'tx-104',
    merchantName: 'Personal Gadget Upgrade',
    category: 'Electronics',
    date: 'Jul 15, 2026',
    amount: 890.00,
    currency: 'USD',
    isDeductible: false,
    deductionPercentage: 0,
    receiptId: 'INV-2026-5411',
    hasReceiptPdf: false,
    taxCategory: 'Non-Deductible Personal',
    vatAmount: 0.00,
    merchantLogo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'tx-105',
    merchantName: 'Adobe Creative Cloud',
    category: 'Software Subscription',
    date: 'Jul 12, 2026',
    amount: 55.00,
    currency: 'USD',
    isDeductible: true,
    deductionPercentage: 100,
    receiptId: 'INV-2026-3392',
    hasReceiptPdf: true,
    taxCategory: 'Operational Expense',
    vatAmount: 4.13,
    merchantLogo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=100&auto=format&fit=crop&q=80'
  }
];

interface TaxExpensePrepProps {
  onOpenAskBAI: (prompt?: string) => void;
}

export const TaxExpensePrep: React.FC<TaxExpensePrepProps> = ({ onOpenAskBAI }) => {
  const [transactions, setTransactions] = useState<TaxTransaction[]>(INITIAL_TAX_TRANSACTIONS);
  const [selectedReceipt, setSelectedReceipt] = useState<TaxTransaction | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'deductible' | 'non-deductible'>('all');

  const toggleDeductible = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isDeductible: !t.isDeductible,
              deductionPercentage: !t.isDeductible ? 100 : 0,
              taxCategory: !t.isDeductible ? 'Operational Expense' : 'Non-Deductible Personal'
            }
          : t
      )
    );
  };

  const filteredTx = transactions.filter((t) => {
    if (filterMode === 'deductible') return t.isDeductible;
    if (filterMode === 'non-deductible') return !t.isDeductible;
    return true;
  });

  const totalExpense = transactions.reduce((acc, t) => acc + t.amount, 0);
  const deductibleTotal = transactions
    .filter((t) => t.isDeductible)
    .reduce((acc, t) => acc + (t.amount * t.deductionPercentage) / 100, 0);

  const totalVatClaimable = transactions
    .filter((t) => t.isDeductible)
    .reduce((acc, t) => acc + t.vatAmount, 0);

  const matchedReceiptsCount = transactions.filter((t) => t.hasReceiptPdf).length;
  const matchPercentage = Math.round((matchedReceiptsCount / transactions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner & Tax Preparation Overview */}
      <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#1C1C1E]">Tax & Expense Preparation</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DFFF4F] text-[#3B1053] text-[10px] font-black uppercase">
                  Year-End Ready
                </span>
              </div>
              <p className="text-xs text-[#8E8E93]">
                Auto-tag deductible expenses & match official PDF receipts to reduce year-end scramble
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAskBAI('Calculate my projected annual corporate tax savings from deductible expenses.')}
            className="px-4 py-2.5 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-extrabold rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Tax Savings Copilot</span>
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E5E5EA]">
            <span className="text-xs text-[#8E8E93] font-bold uppercase tracking-wider block">Total Expenses</span>
            <span className="text-3xl xl:text-4xl font-black text-[#1C1C1E] tracking-tight block mt-1">${totalExpense.toFixed(2)}</span>
            <span className="text-xs text-[#636366] font-semibold block mt-1">{transactions.length} Transactions</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF]">
            <span className="text-xs text-[#8E8E93] font-bold uppercase tracking-wider block">Tax-Deductible</span>
            <span className="text-3xl xl:text-4xl font-black text-[#3B1053] tracking-tight block mt-1">${deductibleTotal.toFixed(2)}</span>
            <span className="text-xs text-emerald-700 font-extrabold block mt-1">
              Est. CIT Savings: ${(deductibleTotal * 0.3).toFixed(2)}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E5EA]">
            <span className="text-xs text-[#8E8E93] font-bold uppercase tracking-wider block">Claimable VAT</span>
            <span className="text-3xl xl:text-4xl font-black text-[#1C1C1E] tracking-tight block mt-1">${totalVatClaimable.toFixed(2)}</span>
            <span className="text-xs text-[#636366] font-semibold block mt-1">7.5% Tax Credit Eligible</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E5EA] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex justify-between items-center text-xs font-black text-[#1C1C1E] mb-1">
                <span>Receipt Status</span>
                <span className="text-sm font-extrabold text-[#3B1053]">{matchPercentage}%</span>
              </div>
              <div className="w-full bg-[#E5E5EA] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#3B1053] h-full rounded-full transition-all"
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-[#636366] font-medium block">
              {matchedReceiptsCount} of {transactions.length} receipts attached
            </span>
          </div>
        </div>
      </div>

      {/* Main Table & Auto-Tagging Controls */}
      <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-extrabold text-[#1C1C1E]">Transaction Tax Tagging & PDF Matcher</h3>

          {/* Filter Pills */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'deductible', label: 'Tax-Deductible' },
              { id: 'non-deductible', label: 'Non-Deductible' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === f.id
                    ? 'bg-[#1C1C1E] text-white shadow-xs'
                    : 'bg-[#F5F5F7] text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F2F2F7] text-[11px] font-extrabold text-[#8E8E93] uppercase tracking-wider">
                <th className="py-3 px-3">Merchant / Purpose</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Tax Auto-Tag</th>
                <th className="py-3 px-3">Receipt PDF</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F7] text-xs">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F9F9FB] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#1C1C1E]">
                    <div className="flex items-center gap-2.5">
                      {tx.merchantLogo ? (
                        <img
                          src={tx.merchantLogo}
                          alt={tx.merchantName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-xl object-cover border border-[#E5E5EA] shadow-2xs flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#3B1053] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {tx.merchantName[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-[#1C1C1E]">{tx.merchantName}</div>
                        <div className="text-[10px] text-[#8E8E93] font-medium">{tx.taxCategory}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#8E8E93] font-medium">{tx.category}</td>
                  <td className="py-3 px-3 text-[#8E8E93] font-medium">{tx.date}</td>
                  <td className="py-3 px-3 font-extrabold text-[#1C1C1E]">${tx.amount.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleDeductible(tx.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                        tx.isDeductible
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-gray-200'
                      }`}
                    >
                      {tx.isDeductible ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Deductible ({tx.deductionPercentage}%)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-gray-400" />
                          <span>Non-Deductible</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    {tx.hasReceiptPdf ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-[#3B1053] text-[11px] font-extrabold border border-purple-100">
                        <FileCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>{tx.receiptId}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8E8E93] italic">No receipt PDF</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(tx)}
                      className="px-3 py-1.5 bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-[#DFFF4F] text-[#1C1C1E] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive PDF Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-xl w-full shadow-2xl relative overflow-hidden border border-[#E5E5EA]">
            {/* Modal Header */}
            <div className="bg-[#3B1053] p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DFFF4F] text-[#3B1053] flex items-center justify-center font-black">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#DFFF4F] uppercase font-black tracking-wider block">
                    Official Tax Receipt PDF
                  </span>
                  <h3 className="text-base font-extrabold">{selectedReceipt.receiptId}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Digital Receipt Paper Document */}
            <div className="p-6 bg-[#F9F9FB] space-y-4 font-mono text-xs text-[#1C1C1E]">
              <div className="p-5 bg-white rounded-2xl border border-[#E5E5EA] shadow-xs space-y-4">
                <div className="flex justify-between items-start border-b border-[#F2F2F7] pb-4">
                  <div>
                    <h4 className="text-sm font-black font-sans text-[#3B1053]">{selectedReceipt.merchantName}</h4>
                    <p className="text-[10px] text-[#8E8E93] font-sans">Verified Merchant Partner</p>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      TAX VERIFIED
                    </span>
                    <p className="text-[10px] text-[#8E8E93] mt-1">{selectedReceipt.date}</p>
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8E8E93]">Tax Tag:</span>
                    <span className="font-extrabold text-[#1C1C1E]">{selectedReceipt.taxCategory}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8E8E93]">Deductibility:</span>
                    <span className="font-extrabold text-emerald-600">
                      {selectedReceipt.isDeductible ? `${selectedReceipt.deductionPercentage}% Deductible` : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8E8E93]">Input VAT (7.5%):</span>
                    <span className="font-extrabold text-indigo-700">${selectedReceipt.vatAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#E5E5EA] pt-3 flex justify-between items-center font-sans">
                  <span className="text-sm font-extrabold text-[#1C1C1E]">Total Amount</span>
                  <span className="text-xl font-black text-[#3B1053]">
                    ${selectedReceipt.amount.toFixed(2)} {selectedReceipt.currency}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] font-sans text-indigo-900 flex items-center justify-between">
                <span>Cryptographic Audit Proof:</span>
                <span className="font-mono text-[10px] text-indigo-700">0x88F...42E1 (BMoni Sealed)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white border-t border-[#E5E5EA] flex justify-end gap-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-[#F5F5F7] text-[#1C1C1E] text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Receipt ${selectedReceipt.receiptId} PDF download initiated!`);
                }}
                className="px-5 py-2 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

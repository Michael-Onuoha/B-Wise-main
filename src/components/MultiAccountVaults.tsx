import React, { useState } from 'react';
import {
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  ShieldCheck,
  Building,
  Plus,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Lock,
  ArrowRight,
  ChevronRight,
  X
} from 'lucide-react';

export interface BusinessVault {
  id: string;
  name: string;
  purpose: string;
  currency: string;
  balance: number;
  iconBg: string;
  accountNumber: string;
  isMainTreasury?: boolean;
}

interface MultiAccountVaultsProps {
  bmoniMainBalanceCNGN?: number;
  onOpenAskBAI: (prompt?: string) => void;
}

export const MultiAccountVaults: React.FC<MultiAccountVaultsProps> = ({
  bmoniMainBalanceCNGN = 10000,
  onOpenAskBAI
}) => {
  const [vaults, setVaults] = useState<BusinessVault[]>([
    {
      id: 'v-1',
      name: 'Main Business Treasury',
      purpose: 'Primary Cash Acceptance & Settlement',
      currency: 'CNGN',
      balance: bmoniMainBalanceCNGN,
      iconBg: 'bg-[#3B1053]',
      accountNumber: '0x39e9aA93E8Ab2694BB25ad8D2d86BEd50741568F',
      isMainTreasury: true
    },
    {
      id: 'v-2',
      name: 'Employee Payroll Vault',
      purpose: 'Ring-fenced Monthly Salary Funds',
      currency: 'CNGN',
      balance: 1680000,
      iconBg: 'bg-[#8B5CF6]',
      accountNumber: '0x3892aF71B0c8227d816503c53b65259921c810'
    },
    {
      id: 'v-3',
      name: 'Inventory & Supplier Lockbox',
      purpose: 'Restock Orders & Batch Purchasing',
      currency: 'CNGN',
      balance: 450000,
      iconBg: 'bg-[#059669]',
      accountNumber: '0x1477cB9910c227d816503c53b65259921c811'
    },
    {
      id: 'v-4',
      name: 'Tax & Compliance Reserve',
      purpose: '7.5% VAT & Corporate Tax Savings',
      currency: 'CNGN',
      balance: 320000,
      iconBg: 'bg-[#D97706]',
      accountNumber: '0x9921dB4410c227d816503c53b65259921c812'
    }
  ]);

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [fromVaultId, setFromVaultId] = useState<string>('v-1');
  const [toVaultId, setToVaultId] = useState<string>('v-2');
  const [transferAmount, setTransferAmount] = useState<string>('50000');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string | null>(null);

  const totalVaultAssets = vaults.reduce((sum, v) => sum + v.balance, 0);

  const handleExecuteInternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);
    if (!amountNum || amountNum <= 0 || fromVaultId === toVaultId) return;

    const sourceVault = vaults.find((v) => v.id === fromVaultId);
    if (!sourceVault || sourceVault.balance < amountNum) {
      alert('Insufficient funds in source vault.');
      return;
    }

    setIsTransferring(true);
    setTransferSuccessMsg(null);

    setTimeout(() => {
      setVaults((prev) =>
        prev.map((v) => {
          if (v.id === fromVaultId) return { ...v, balance: v.balance - amountNum };
          if (v.id === toVaultId) return { ...v, balance: v.balance + amountNum };
          return v;
        })
      );
      setIsTransferring(false);
      setShowTransferModal(false);
      setTransferSuccessMsg(
        `Internal transfer of ₦${amountNum.toLocaleString()} CNGN completed between ${sourceVault.name} and target vault!`
      );
      setTimeout(() => setTransferSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#3B1053] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-[#DFFF4F] text-[#3B1053] text-xs font-black uppercase rounded-full">
                Multi-Account Structure
              </span>
              <span className="text-white/60 text-xs font-semibold">Purpose-Driven Business Vaults</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Dedicated Accounts & Cash Segregation</h2>
            <p className="text-white/70 text-sm max-w-xl">
              Ring-fence your cash reserves into purpose accounts: Main Treasury, Employee Payroll, Inventory Restock, and Tax Lockboxes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAskBAI('Recommend optimal asset allocation ratio across my business vaults.')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#DFFF4F]" />
              <span>AI Capital Advice</span>
            </button>

            <button
              onClick={() => setShowTransferModal(true)}
              className="px-5 py-2.5 bg-[#DFFF4F] hover:bg-[#cbe646] text-[#3B1053] text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Internal Vault Transfer</span>
            </button>
          </div>
        </div>

        {/* Total Assets Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
          <div>
            <span className="text-[10px] text-white/60 uppercase font-bold block">Total Asset Liquidity</span>
            <span className="text-2xl font-black text-[#DFFF4F]">₦{totalVaultAssets.toLocaleString()} CNGN</span>
          </div>
          <div>
            <span className="text-[10px] text-white/60 uppercase font-bold block">Active Purpose Accounts</span>
            <span className="text-2xl font-black text-white">{vaults.length} Segregated Vaults</span>
          </div>
          <div>
            <span className="text-[10px] text-white/60 uppercase font-bold block">Settlement Rail</span>
            <span className="text-xs font-extrabold text-white bg-white/10 px-3 py-1 rounded-full inline-block mt-1">
              BMoni Live Smart Accounts
            </span>
          </div>
        </div>
      </div>

      {transferSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{transferSuccessMsg}</span>
        </div>
      )}

      {/* Vault Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vaults.map((vault) => (
          <div
            key={vault.id}
            className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA] flex flex-col justify-between space-y-4 hover:border-[#3B1053]/40 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${vault.iconBg} text-white flex items-center justify-center font-bold shadow-xs`}
                  >
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1C1C1E] group-hover:text-[#3B1053] transition-colors">
                      {vault.name}
                    </h3>
                    <p className="text-xs text-[#8E8E93]">{vault.purpose}</p>
                  </div>
                </div>

                {vault.isMainTreasury ? (
                  <span className="px-2.5 py-1 bg-[#DFFF4F] text-[#3B1053] text-[10px] font-black uppercase rounded-full">
                    Live Treasury
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-[#F5F5F7] text-[#1C1C1E] text-[10px] font-bold rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Purpose Lock</span>
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA] space-y-1">
                <span className="text-[11px] text-[#8E8E93] font-medium block">Available Balance</span>
                <div className="text-2xl font-black text-[#1C1C1E]">
                  ₦{vault.balance.toLocaleString()} <span className="text-xs font-bold text-[#8E8E93]">{vault.currency}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#8E8E93] font-mono truncate bg-[#F5F5F7] p-2 rounded-xl">
                Address: {vault.accountNumber}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F2F2F7] flex items-center justify-between">
              <span className="text-xs text-[#8E8E93]">BMoni Internal Vault</span>
              <button
                onClick={() => {
                  setFromVaultId(vault.isMainTreasury ? 'v-1' : vault.id);
                  setToVaultId(vault.isMainTreasury ? 'v-2' : 'v-1');
                  setShowTransferModal(true);
                }}
                className="text-xs font-extrabold text-[#3B1053] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Transfer Funds</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Internal Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl relative space-y-4 border border-[#E5E5EA]">
            <button
              onClick={() => setShowTransferModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center font-bold">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1C1C1E]">Internal Vault Transfer</h3>
                <p className="text-xs text-[#8E8E93]">Instant settlement between BMoni purpose accounts</p>
              </div>
            </div>

            <form onSubmit={handleExecuteInternalTransfer} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">From Source Vault</label>
                <select
                  value={fromVaultId}
                  onChange={(e) => setFromVaultId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs font-bold outline-none border border-[#E5E5EA]"
                >
                  {vaults.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (₦{v.balance.toLocaleString()} CNGN)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">To Destination Vault</label>
                <select
                  value={toVaultId}
                  onChange={(e) => setToVaultId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs font-bold outline-none border border-[#E5E5EA]"
                >
                  {vaults.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (₦{v.balance.toLocaleString()} CNGN)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Transfer Amount (CNGN)</label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-xl text-sm font-extrabold outline-none border border-[#E5E5EA] text-[#3B1053]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-[#F5F5F7] text-[#1C1C1E] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="px-5 py-2 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {isTransferring ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Transferring...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Execute Vault Transfer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

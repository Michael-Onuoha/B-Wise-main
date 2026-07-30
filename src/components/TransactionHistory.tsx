import React, { useState } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { Search, Filter, ArrowUpDown, Check, X, Clock, MoreVertical, Plus, Download, Trash2, ExternalLink } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onStatusChange: (id: string, newStatus: TransactionStatus) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onSelectTransaction,
  onOpenAddModal,
  onDeleteTransaction,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Categories list
  const categories = ['All', 'Online Shopping', 'Services', 'Money Transfer'];

  // Filter & Search Logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || tx.merchant.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sort Logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let result = 0;
    if (sortField === 'amount') {
      result = a.amount - b.amount;
    } else if (sortField === 'merchant') {
      result = a.merchant.name.localeCompare(b.merchant.name);
    } else {
      // Date sort
      result = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return sortAsc ? result : -result;
  });

  // Checkbox handlers
  const handleSelectAll = () => {
    if (selectedIds.length === sortedTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedTransactions.map((t) => t.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => onDeleteTransaction(id));
    setSelectedIds([]);
  };

  const exportCSV = () => {
    const headers = ['Merchant', 'Category', 'Date', 'Amount', 'Status', 'Reference ID'];
    const rows = sortedTransactions.map((tx) => [
      `"${tx.merchant.name}"`,
      `"${tx.merchant.category}"`,
      `"${tx.date}"`,
      tx.amount,
      tx.status,
      tx.referenceId || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Payline_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-xs border border-[#F2F2F7] flex-1 flex flex-col min-w-0 relative">
      {/* History Header */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-[#1C1C1E] font-sans tracking-[-0.3px]">
            History
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#8E8E93]">
            {filteredTransactions.length} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-[#F5F5F7] rounded-xl px-3 py-1.5 border border-[#E5E5EA] animate-in fade-in duration-150">
                <Search className="w-4 h-4 text-[#8E8E93] mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search merchant, date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1C1E] outline-none w-36 sm:w-48 font-sans"
                  autoFocus
                />
                <button 
                  onClick={() => { setSearchTerm(''); setShowSearchInput(false); }}
                  className="text-[#8E8E93] hover:text-[#1C1C1E] ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="w-9 h-9 flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-[#F5F5F7] rounded-xl transition-colors cursor-pointer"
                title="Search Transactions"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#F2F2F7] bg-white text-xs font-semibold font-sans cursor-pointer transition-colors ${
                statusFilter !== 'All' || categoryFilter !== 'All' 
                  ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]' 
                  : 'text-[#1C1C1E] hover:bg-[#F5F5F7]'
              }`}
            >
              <span>Filters</span>
              <Filter className="w-3.5 h-3.5" />
            </button>

            {/* Filter Menu Drawer */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#F2F2F7] p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-[#1C1C1E]">Filter Transactions</span>
                  <button
                    onClick={() => { setStatusFilter('All'); setCategoryFilter('All'); }}
                    className="text-[10px] text-[#8B5CF6] font-semibold hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1.5">Status</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['All', 'Completed', 'Pending', 'Failed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-medium transition-colors cursor-pointer ${
                            statusFilter === st ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F5F7] text-[#3A3A3C] hover:bg-[#E5E5EA]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1.5">Category</label>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`w-full py-1.5 px-2 rounded-lg text-left text-[11px] font-medium transition-colors cursor-pointer ${
                            categoryFilter === cat ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F5F7] text-[#3A3A3C] hover:bg-[#E5E5EA]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilterDropdown(false)}
                  className="w-full mt-4 py-2 bg-[#1C1C1E] text-white text-xs font-semibold rounded-xl hover:bg-[#3A3A3C] transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>

          {/* Export CSV button */}
          <button
            onClick={exportCSV}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#F2F2F7] bg-white text-[#1C1C1E] text-xs font-semibold hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span>Export</span>
          </button>

          {/* New Transaction button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1C1E] text-white text-xs font-semibold hover:bg-[#3A3A3C] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Banner */}
      {selectedIds.length > 0 && (
        <div className="mb-4 bg-[#F5F5F7] p-2.5 rounded-xl flex items-center justify-between animate-in fade-in duration-150 border border-[#E5E5EA]">
          <span className="text-xs font-semibold text-[#1C1C1E] pl-2">
            {selectedIds.length} transaction{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF3B30] text-white text-xs font-semibold hover:bg-[#D70015] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#8E8E93] hover:text-[#1C1C1E] px-2 py-1 font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F2F2F7]">
              <th className="py-2.5 px-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === sortedTransactions.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#E5E5EA] text-[#8B5CF6] focus:ring-0 cursor-pointer accent-[#1C1C1E]"
                />
              </th>

              <th 
                onClick={() => { setSortField('merchant'); setSortAsc(!sortAsc); }}
                className="py-2.5 px-3 text-[11px] font-semibold text-[#8E8E93] font-sans tracking-wider cursor-pointer hover:text-[#1C1C1E] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Merchant</span>
                  <ArrowUpDown className="w-3 h-3 text-[#C7C7CC]" />
                </div>
              </th>

              <th 
                onClick={() => { setSortField('date'); setSortAsc(!sortAsc); }}
                className="py-2.5 px-3 text-[11px] font-semibold text-[#8E8E93] font-sans tracking-wider cursor-pointer hover:text-[#1C1C1E] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Transaction Date</span>
                  <ArrowUpDown className="w-3 h-3 text-[#C7C7CC]" />
                </div>
              </th>

              <th 
                onClick={() => { setSortField('amount'); setSortAsc(!sortAsc); }}
                className="py-2.5 px-3 text-[11px] font-semibold text-[#8E8E93] font-sans tracking-wider cursor-pointer hover:text-[#1C1C1E] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-[#C7C7CC]" />
                </div>
              </th>

              <th className="py-2.5 px-3 text-[11px] font-semibold text-[#8E8E93] font-sans tracking-wider whitespace-nowrap">
                Status
              </th>

              <th className="py-2.5 px-3 w-10"></th>
            </tr>
          </thead>

          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#8E8E93]">
                  No transactions match your search or filter criteria.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => {
                const isSelected = selectedIds.includes(tx.id);
                const isMenuOpen = activeMenuId === tx.id;

                return (
                  <tr
                    key={tx.id}
                    className={`border-b border-[#F2F2F7] hover:bg-[#F9F9FB] transition-colors group ${
                      isSelected ? 'bg-[#F5F5F7]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(tx.id)}
                        className="w-4 h-4 rounded border-[#E5E5EA] text-[#1C1C1E] focus:ring-0 cursor-pointer accent-[#1C1C1E]"
                      />
                    </td>

                    {/* Merchant Cell */}
                    <td 
                      onClick={() => onSelectTransaction(tx)}
                      className="py-3.5 px-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {/* Logo Box */}
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center font-bold text-sm flex-shrink-0 font-sans shadow-2xs"
                          style={{
                            backgroundColor: tx.merchant.bgColor,
                            color: tx.merchant.textColor,
                          }}
                        >
                          {tx.merchant.isSvg ? (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2C8 2 5 6 5 10c0 4 4 8 7 12 3-4 7-8 7-12 0-4-3-8-7-8z" />
                              <circle cx="12" cy="10" r="3" fill="#FF5A5F" />
                            </svg>
                          ) : (
                            <span className={tx.merchant.logoText.length > 2 ? 'text-[11px] font-extrabold tracking-tighter' : 'text-sm font-bold'}>
                              {tx.merchant.logoText}
                            </span>
                          )}
                        </div>

                        {/* Merchant Text */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-semibold text-[#1C1C1E] font-sans tracking-[-0.2px] group-hover:text-[#8B5CF6] transition-colors">
                            {tx.merchant.name}
                          </span>
                          <span className="text-[11px] text-[#8E8E93] font-medium font-sans">
                            {tx.merchant.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Transaction Date */}
                    <td 
                      onClick={() => onSelectTransaction(tx)}
                      className="py-3.5 px-3 text-xs text-[#8E8E93] font-medium font-sans whitespace-nowrap cursor-pointer"
                    >
                      {tx.date}
                    </td>

                    {/* Amount */}
                    <td 
                      onClick={() => onSelectTransaction(tx)}
                      className="py-3.5 px-3 text-[13px] font-semibold font-sans tracking-[-0.2px] whitespace-nowrap cursor-pointer"
                    >
                      <span className={
                        tx.status === 'Failed' 
                          ? 'text-[#FF3B30]' 
                          : tx.amount > 0 
                          ? 'text-[#065F46]' 
                          : 'text-[#1C1C1E]'
                      }>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {tx.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-sans tracking-[-0.1px] bg-[#D1FAE5] text-[#065F46]">
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          <span>Completed</span>
                        </span>
                      )}
                      {tx.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-sans tracking-[-0.1px] bg-[#FEE2E2] text-[#991B1B]">
                          <X className="w-2.5 h-2.5 stroke-[3.5]" />
                          <span>Failed</span>
                        </span>
                      )}
                      {tx.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-sans tracking-[-0.1px] bg-[#FEF3C7] text-[#92400E]">
                          <Clock className="w-2.5 h-2.5 stroke-[3]" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Row Action Menu */}
                    <td className="py-3.5 px-3 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : tx.id);
                        }}
                        className="text-[#C7C7CC] hover:text-[#1C1C1E] p-1 rounded-lg hover:bg-[#E5E5EA]/50 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Menu Popover */}
                      {isMenuOpen && (
                        <div 
                          className="absolute right-3 top-10 w-44 bg-white rounded-xl shadow-xl border border-[#F2F2F7] py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              onSelectTransaction(tx);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-[#3A3A3C] hover:bg-[#F5F5F7] flex items-center gap-2 font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#8E8E93]" />
                            <span>View Details</span>
                          </button>

                          {tx.status !== 'Completed' && (
                            <button
                              onClick={() => {
                                onStatusChange(tx.id, 'Completed');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#065F46] hover:bg-[#D1FAE5] flex items-center gap-2 font-medium"
                            >
                              <Check className="w-3.5 h-3.5 text-[#065F46]" />
                              <span>Mark Completed</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onDeleteTransaction(tx.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-[#FF3B30] hover:bg-[#FEE2E2] flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

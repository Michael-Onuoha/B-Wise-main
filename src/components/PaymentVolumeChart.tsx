import React, { useMemo, useState } from 'react';
import { Transaction, VolumeDataPoint } from '../types';
import { buildVolumeFromTransactions } from '../data/mockData';
import { Info, Download } from 'lucide-react';

interface PaymentVolumeChartProps {
  transactions?: Transaction[];
  days?: number;
  title?: string;
}

type Timeframe = '7D' | '30D' | 'ALL';

export const PaymentVolumeChart: React.FC<PaymentVolumeChartProps> = ({
  transactions = [],
  days = 7,
  title = 'Payment volume',
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const resolvedDays: number = timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 90;

  const dataPoints: VolumeDataPoint[] = useMemo(
    () => buildVolumeFromTransactions(transactions, resolvedDays, 110),
    [transactions, resolvedDays]
  );

  const totalVolume = dataPoints.reduce((sum, p) => sum + p.volume, 0);
  const peakPoint = dataPoints.reduce(
    (best, p) => (p.volume > (best?.volume ?? 0) ? p : best),
    null as VolumeDataPoint | null
  );

  const summary = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'Completed');
    const pending = transactions.filter((t) => t.status === 'Pending');
    const failed = transactions.filter((t) => t.status === 'Failed');
    const spent = completed.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const received = completed.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const net = received - spent;
    return { completed, pending, failed, spent, received, net };
  }, [transactions]);

  const handleExportCSV = () => {
    const headers = ['Day', 'Date', 'Volume (USD)', 'Height (px)'];
    const rows = dataPoints.map((p) => [p.day, p.dateStr, p.volume.toFixed(2), String(p.heightPx)]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `PaymentVolume_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E5E5EA] flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2.5 sm:gap-3 mb-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-[#1C1C1E] flex items-center gap-2 tracking-[-0.2px]">
            <span className="w-[3px] h-4 bg-[#1C1C1E] rounded-full flex-shrink-0" />
            <span className="truncate">{title}</span>
          </div>
          <div className="text-[11px] text-[#8E8E93] font-semibold mt-0.5 truncate">
            Net {summary.net >= 0 ? 'gain' : 'loss'} · ${summary.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · {dataPoints.length}d window
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div data-tutorial="chart-timeframe" className="flex items-center bg-[#F5F5F7] p-0.5 rounded-md border border-[#E5E5EA] text-[11px] font-bold">
            {(['7D', '30D', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-[#1C1C1E] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="w-7 h-7 rounded-md border border-[#E5E5EA] bg-white hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowInfo((v) => !v)}
            title="Volume details"
            className="w-7 h-7 rounded-md border border-[#E5E5EA] bg-white hover:bg-[#F5F5F7] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer flex-shrink-0"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary pills — compact single row on mobile */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3.5">
        <div className="rounded-lg bg-[#F9F9FB] border border-[#EDEDF0] p-2 sm:p-2.5 overflow-hidden">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8E8E93] truncate">
            In
          </div>
          <div className="text-[11px] sm:text-sm font-black text-emerald-700 font-mono mt-0.5 truncate">
            +${summary.received.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="rounded-lg bg-[#F9F9FB] border border-[#EDEDF0] p-2 sm:p-2.5 overflow-hidden">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8E8E93] truncate">
            Out
          </div>
          <div className="text-[11px] sm:text-sm font-black text-[#FF3B30] font-mono mt-0.5 truncate">
            -${summary.spent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="rounded-lg bg-[#F9F9FB] border border-[#EDEDF0] p-2 sm:p-2.5 overflow-hidden">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8E8E93] truncate">
            Vol
          </div>
          <div className="text-[11px] sm:text-sm font-black text-[#1C1C1E] font-mono mt-0.5 truncate">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="rounded-lg bg-[#F9F9FB] border border-[#EDEDF0] p-2 sm:p-2.5 overflow-hidden">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8E8E93] truncate">
            Peak
          </div>
          <div className="text-[11px] sm:text-sm font-black text-[#3B1053] font-mono mt-0.5 truncate">
            {peakPoint ? `${peakPoint.day}` : '—'}
          </div>
        </div>
      </div>

      {/* Chart area - responsive height */}
      <div
        className={`relative w-full flex items-end justify-between gap-[2px] sm:gap-1 px-0.5 sm:px-1 pt-9 sm:pt-10 pb-1 min-h-[120px] sm:min-h-[140px] h-[130px] sm:h-[150px]`}
      >
        <div className="absolute left-0 right-0 border-t border-dashed border-[#EDEDF0] top-[44px] sm:top-[50px] pointer-events-none" />

        {dataPoints.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-[11px] text-[#8E8E93]">
            No transaction data
          </div>
        ) : (
          dataPoints.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const isPeak = pt.isHighlighted;
            return (
              <div
                key={`${pt.day}-${pt.dateStr}-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex flex-col items-center justify-end gap-1 flex-1 h-full min-w-0 cursor-pointer group"
              >
                <div className="relative w-full h-full flex items-end justify-center">
                  <div
                    className={`w-full min-w-[6px] max-w-[14px] sm:max-w-[18px] rounded-t-md rounded-b-sm relative transition-all duration-150 ${
                      isHovered ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
                    }`}
                    style={{
                      height: `${pt.heightPx}px`,
                      background: isPeak
                        ? 'linear-gradient(180deg, #7C3AED 0%, #3B1053 100%)'
                        : 'linear-gradient(180deg, #C4B5FD 0%, #8B5CF6 100%)',
                    }}
                  >
                    {isHovered && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-[#1C1C1E] text-white px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap text-center leading-snug shadow-xl z-30">
                        <div className="text-[#DFFF4F] font-bold">
                          ${pt.volume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[#C7C7CC] text-[9px] font-medium mt-0.5">
                          {pt.day} · {pt.dateStr}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold transition-colors truncate w-full text-center ${
                    isHovered || isPeak ? 'text-[#1C1C1E] font-extrabold' : 'text-[#8E8E93]'
                  }`}
                >
                  {resolvedDays > 14
                    ? (idx % Math.ceil(resolvedDays / 7) === 0 ? pt.day : '')
                    : pt.day}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Info overlay */}
      {showInfo && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] rounded-2xl p-4 sm:p-5 z-30 flex flex-col border border-[#E5E5EA]">
          <div className="flex justify-between items-start mb-3 gap-2">
            <div>
              <h4 className="text-xs font-black text-[#1C1C1E]">Volume analytics</h4>
              <p className="text-[11px] text-[#636366] leading-relaxed mt-1">
                Bars aggregate Completed/Pending transactions per day. Failed transactions excluded.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-[11px] font-bold text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer flex-shrink-0"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs mb-3">
            <div className="bg-[#F9F9FB] border border-[#EDEDF0] p-2 rounded-lg">
              <span className="text-[9px] text-[#8E8E93] block font-bold uppercase">Completed</span>
              <span className="font-black text-[#1C1C1E]">{summary.completed.length}</span>
            </div>
            <div className="bg-[#F9F9FB] border border-[#EDEDF0] p-2 rounded-lg">
              <span className="text-[9px] text-[#8E8E93] block font-bold uppercase">Pending</span>
              <span className="font-black text-amber-700">{summary.pending.length}</span>
            </div>
            <div className="bg-[#F9F9FB] border border-[#EDEDF0] p-2 rounded-lg">
              <span className="text-[9px] text-[#8E8E93] block font-bold uppercase">Failed</span>
              <span className="font-black text-[#FF3B30]">{summary.failed.length}</span>
            </div>
            <div className="bg-[#F9F9FB] border border-[#EDEDF0] p-2 rounded-lg">
              <span className="text-[9px] text-[#8E8E93] block font-bold uppercase">Total</span>
              <span className="font-black text-[#1C1C1E]">${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          <button
            onClick={() => setShowInfo(false)}
            className="mt-auto w-full py-2 bg-[#1C1C1E] hover:bg-[#3A3A3C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

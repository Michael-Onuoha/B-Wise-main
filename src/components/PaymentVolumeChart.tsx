import React, { useState } from 'react';
import { VolumeDataPoint } from '../types';
import { VOLUME_DATA } from '../data/mockData';
import { ExternalLink, Info, Calendar } from 'lucide-react';

export const PaymentVolumeChart: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<VolumeDataPoint[]>(VOLUME_DATA);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(2); // Default Friday Jan 12 highlighted
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '1Y'>('7D');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const totalVolume = dataPoints.reduce((sum, p) => sum + p.volume, 0);

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-xs border border-[#F2F2F7] relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-[13px] font-bold text-[#1C1C1E] flex items-center gap-2 font-sans tracking-[-0.2px]">
          <span className="w-[3px] h-3.5 bg-[#1C1C1E] rounded-[2px]" />
          <span>Payment volume</span>
        </div>
        <div className="flex items-center gap-3 text-[#8E8E93]">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-[#F5F5F7] p-0.5 rounded-lg text-[10px] font-medium font-sans">
            <button
              onClick={() => setTimeframe('7D')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                timeframe === '7D' ? 'bg-white text-[#1C1C1E] shadow-2xs font-semibold' : 'hover:text-[#1C1C1E]'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeframe('30D')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                timeframe === '30D' ? 'bg-white text-[#1C1C1E] shadow-2xs font-semibold' : 'hover:text-[#1C1C1E]'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeframe('1Y')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                timeframe === '1Y' ? 'bg-white text-[#1C1C1E] shadow-2xs font-semibold' : 'hover:text-[#1C1C1E]'
              }`}
            >
              1Y
            </button>
          </div>

          <button 
            onClick={() => setShowInfoModal(!showInfoModal)}
            className="hover:text-[#1C1C1E] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#F5F5F7]"
            title="Volume Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative h-40 flex items-end justify-between px-2 pt-10">
        {/* Dashed background reference grid line */}
        <div className="absolute left-0 right-0 border-t border-dashed border-[#E5E5EA] top-[60px]" />

        {dataPoints.map((pt, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(2)} // Reset to Friday Jan 12 or null
              className="flex flex-col items-center gap-2 flex-1 cursor-pointer group z-10"
            >
              <div
                className={`w-7 rounded-t-2xl rounded-b-md relative transition-all duration-200 ${
                  isHovered ? 'scale-105 opacity-100 shadow-md' : 'opacity-85 hover:opacity-100'
                }`}
                style={{
                  height: `${pt.heightPx}px`,
                  background: 'linear-gradient(180deg, #C084FC 0%, #A855F7 100%)',
                }}
              >
                {/* Tooltip on active bar */}
                {isHovered && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1C1C1E] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap text-center leading-snug font-sans shadow-xl z-20 animate-in fade-in zoom-in-95 duration-100">
                    <div>{pt.day}, {pt.dateStr}</div>
                    <div className="text-[#DFFF4F] font-bold">${pt.volume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    {/* Tooltip pointer arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1C1E] rotate-45 rounded-[1px]" />
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-sans font-medium transition-colors ${
                isHovered ? 'text-[#1C1C1E] font-bold' : 'text-[#8E8E93]'
              }`}>
                {pt.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-[20px] p-6 z-30 flex flex-col justify-between animate-in fade-in duration-150">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-[#1C1C1E]">Volume Analytics Summary</h4>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-xs text-[#8E8E93] hover:text-[#1C1C1E] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-[11px] text-[#3A3A3C] leading-relaxed mb-3">
              Payment volume measures total value of processed incoming and outgoing transactions across all connected business accounts over the selected window.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F5F5F7] p-2 rounded-lg">
                <span className="text-[10px] text-[#8E8E93] block">Period Total</span>
                <span className="font-bold text-[#1C1C1E]">${totalVolume.toLocaleString()}</span>
              </div>
              <div className="bg-[#F5F5F7] p-2 rounded-lg">
                <span className="text-[10px] text-[#8E8E93] block">Peak Day</span>
                <span className="font-bold text-[#1C1C1E]">Friday ($2,340)</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowInfoModal(false)}
            className="w-full py-2 bg-[#1C1C1E] text-white text-xs font-semibold rounded-xl hover:bg-[#3A3A3C] transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

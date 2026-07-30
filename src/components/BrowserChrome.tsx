import React from 'react';
import { ChevronLeft, ChevronRight, Lock, Info, Share2, Plus, Monitor, Maximize2, Minimize2 } from 'lucide-react';

interface BrowserChromeProps {
  url?: string;
  isFramed: boolean;
  onToggleFrame: () => void;
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  url = 'payline.com',
  isFramed,
  onToggleFrame,
}) => {
  return (
    <div className="h-11 bg-[#F9F9FB] border-b border-[#E5E5EA] flex items-center px-4 gap-3 select-none flex-shrink-0">
      {/* Traffic Light Buttons */}
      <div className="flex gap-2 items-center">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] hover:opacity-80 transition-opacity cursor-pointer" title="Close" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#D89E24] hover:opacity-80 transition-opacity cursor-pointer" title="Minimize" />
        <div 
          onClick={onToggleFrame} 
          className="w-3 h-3 rounded-full bg-[#28CA42] border border-[#1AAB29] hover:opacity-80 transition-opacity cursor-pointer" 
          title={isFramed ? "Expand Full View" : "Collapse to Browser Window"} 
        />
      </div>

      {/* Nav Buttons */}
      <div className="flex gap-2 text-[#8E8E93]">
        <button className="hover:text-[#1C1C1E] transition-colors cursor-pointer" title="Back">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="hover:text-[#1C1C1E] transition-colors cursor-pointer" title="Forward">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex-1 bg-[#E5E5EA] h-7 rounded-md flex items-center justify-center gap-1.5 text-xs text-[#3A3A3C] px-3 font-sans font-normal">
        <Lock className="w-3 h-3 text-[#8E8E93]" />
        <span className="font-medium tracking-tight">{url}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 text-[#8E8E93]">
        <button className="hover:text-[#1C1C1E] transition-colors cursor-pointer" title="Site Info">
          <Info className="w-4 h-4" />
        </button>
        <button className="hover:text-[#1C1C1E] transition-colors cursor-pointer" title="Share Page">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="hover:text-[#1C1C1E] transition-colors cursor-pointer" title="New Tab">
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={onToggleFrame}
          className="hover:text-[#1C1C1E] transition-colors cursor-pointer ml-1 p-1 rounded hover:bg-[#E5E5EA]" 
          title={isFramed ? "Maximize View" : "Windowed View"}
        >
          {isFramed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

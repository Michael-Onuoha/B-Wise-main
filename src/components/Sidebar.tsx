import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Users,
  FileCheck,
  Wallet,
  List,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'overview', title: 'Dashboard & Wallet', icon: LayoutGrid },
    { id: 'ai_analytics', title: 'AI Analytics & Restock Predictor', icon: Sparkles },
    { id: 'payroll', title: 'Employee Payroll & Onboarding', icon: Users },
    { id: 'tax_prep', title: 'Tax Prep & Receipt PDF Matcher', icon: FileCheck },
    { id: 'vaults', title: 'Purpose Accounts & Vaults', icon: Wallet },
    { id: 'transactions', title: 'Transaction History & Transfers', icon: List }
  ];

  return (
    <aside className="w-[88px] xl:w-[100px] bg-[#3B1053] flex flex-col items-center py-6 border-r border-white/10 flex-shrink-0 select-none sticky top-0 h-screen z-30">
      {/* Brand Logo */}
      <div 
        className="w-[44px] h-[44px] xl:w-[52px] xl:h-[52px] mb-[32px] xl:mb-[40px] cursor-pointer flex items-center justify-center hover:opacity-90 transition-opacity drop-shadow-md" 
        onClick={() => onTabChange('overview')}
        title="Payline Business Home"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="100" height="100" rx="22" fill="#3B1053"/>
          <path d="M28 22C28 18.6863 30.6863 16 34 16H48C57.9411 16 66 24.0589 66 34C66 38.3246 64.4436 42.3246 61.799 45.3809C64.4436 48.4372 66 52.4372 66 56.7618C66 66.7029 57.9411 74.7618 48 74.7618H34C30.6863 74.7618 28 72.0755 28 68.7618V22Z" fill="white"/>
          <ellipse cx="52" cy="34" rx="10" ry="8" fill="#3B1053"/>
          <ellipse cx="52" cy="56.7618" rx="10" ry="8" fill="#3B1053"/>
        </svg>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex flex-col gap-3 flex-1">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.title}
              className={`w-[44px] h-[44px] xl:w-[50px] xl:h-[50px] flex items-center justify-center rounded-[14px] xl:rounded-[16px] transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-[#DFFF4F] text-[#3B1053] shadow-md scale-105'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <IconComp className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px]" />
              
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#1C1C1E] text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {item.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom */}
      <div className="mt-auto pb-2 flex flex-col gap-3">
        <button
          onClick={() => onTabChange('overview')}
          title="Settings"
          className="w-[44px] h-[44px] xl:w-[50px] xl:h-[50px] flex items-center justify-center rounded-[14px] xl:rounded-[16px] text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Settings className="w-[20px] h-[20px] xl:w-[22px] xl:h-[22px]" />
        </button>
      </div>
    </aside>
  );
};


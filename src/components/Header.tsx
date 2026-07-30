import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut, Shield, CreditCard, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  unreadCount: number;
  onToggleNotifications: () => void;
  title?: string;
  accountBalance?: number;
  onOpenAddModal?: () => void;
  onOpenAskBAI?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadCount,
  onToggleNotifications,
  title = 'Transactions',
  accountBalance = 42500.80,
  onOpenAddModal,
  onOpenAskBAI,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex justify-between items-center mb-8 select-none relative">
      <div>
        <h1 className="text-[36px] font-extrabold text-[#1C1C1E] tracking-[-1px] font-sans">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        {/* Ask B-AI Button */}
        {onOpenAskBAI && (
          <button
            onClick={onOpenAskBAI}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] font-sans text-xs font-extrabold rounded-[14px] shadow-xs hover:shadow transition-all cursor-pointer border border-[#3B1053] group"
          >
            <div className="w-5 h-5 rounded-md bg-[#DFFF4F] text-[#3B1053] flex items-center justify-center font-black text-[10px] shadow-xs group-hover:scale-110 transition-transform">
              ✨
            </div>
            <span>Ask B-AI</span>
          </button>
        )}

        {/* Quick Action button for mobile/desktop */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-xs font-semibold hover:bg-[#3A3A3C] transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFFF4F]" />
            <span>New Payment</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative w-12 h-12 flex items-center justify-center text-[#1C1C1E] bg-white rounded-[14px] shadow-xs hover:bg-[#F9F9FB] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-[22px] h-[22px] text-[#1C1C1E]" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3.5 cursor-pointer p-1 rounded-xl hover:bg-[#E5E5EA]/40 transition-colors"
          >
            <div className="w-[44px] h-[44px] rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-xs">
              <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                <rect width="36" height="36" fill="url(#header-user-grad)" />
                <circle cx="18" cy="14" r="8" fill="#FDBA74" />
                <path d="M6 34C6 26 11 22 18 22C25 22 30 26 30 34" fill="#FDBA74" />
                <defs>
                  <linearGradient id="header-user-grad" x1="0" y1="0" x2="36" y2="36">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[15px] font-bold text-[#1C1C1E] leading-tight font-sans">
                William Grace
              </div>
              <div className="text-[13px] text-[#8E8E93] leading-tight font-sans font-medium flex items-center gap-1">
                <span>Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#F2F2F7] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#F2F2F7]">
                <p className="text-xs font-semibold text-[#1C1C1E]">William Grace</p>
                <p className="text-[11px] text-[#8E8E93]">william.grace@payline.com</p>
                <div className="mt-2 bg-[#F5F5F7] p-2 rounded-lg flex justify-between items-center">
                  <span className="text-[10px] text-[#8E8E93] font-medium">Available Balance</span>
                  <span className="text-xs font-bold text-[#1C1C1E]">€{accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-[#3A3A3C] hover:bg-[#F5F5F7] flex items-center gap-2.5 font-medium"
                >
                  <User className="w-4 h-4 text-[#8E8E93]" />
                  <span>Account Profile</span>
                </button>
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-[#3A3A3C] hover:bg-[#F5F5F7] flex items-center gap-2.5 font-medium"
                >
                  <CreditCard className="w-4 h-4 text-[#8E8E93]" />
                  <span>Cards & Accounts</span>
                </button>
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-[#3A3A3C] hover:bg-[#F5F5F7] flex items-center gap-2.5 font-medium"
                >
                  <Shield className="w-4 h-4 text-[#8E8E93]" />
                  <span>Security & Permissions</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#F2F2F7] text-xs">
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full px-4 py-2 text-left text-[#FF3B30] hover:bg-[#FEE2E2] flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="w-4 h-4 text-[#FF3B30]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

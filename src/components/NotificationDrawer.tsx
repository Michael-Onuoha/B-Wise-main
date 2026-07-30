import React from 'react';
import { NotificationItem } from '../types';
import { X, CheckCheck, Bell, Shield, ArrowUpRight, AlertCircle } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-[#F2F2F7] p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200 font-sans">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-[#F2F2F7]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#1C1C1E]" />
              <h3 className="text-base font-bold text-[#1C1C1E]">Notifications</h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#8E8E93] hover:text-[#1C1C1E] p-1.5 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center py-3 text-xs">
            <button
              onClick={onMarkAllAsRead}
              className="text-[#8B5CF6] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={onClearNotifications}
              className="text-[#8E8E93] hover:text-[#FF3B30] font-medium transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 mt-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8E8E93]">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    n.read
                      ? 'bg-white border-[#F2F2F7] opacity-75'
                      : 'bg-[#F9F9FB] border-[#E5E5EA] shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      n.type === 'transfer' ? 'bg-[#D1FAE5] text-[#065F46]' :
                      n.type === 'alert' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                      'bg-[#E0F2FE] text-[#0369A1]'
                    }`}>
                      {n.type === 'transfer' && <ArrowUpRight className="w-4 h-4" />}
                      {n.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                      {n.type === 'system' && <Shield className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-xs font-bold text-[#1C1C1E] truncate">{n.title}</h4>
                        <span className="text-[10px] text-[#8E8E93] flex-shrink-0 ml-1">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#3A3A3C] leading-snug">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#F2F2F7]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1C1C1E] text-white text-xs font-semibold rounded-xl hover:bg-[#3A3A3C] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

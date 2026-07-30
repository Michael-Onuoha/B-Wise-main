import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, TrendingDown, TrendingUp, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface Transaction {
  id: string;
  merchantName: string;
  merchantCategory: string;
  merchantLogoBg: string;
  merchantLogoColor: string;
  logoType: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Failed' | 'Pending';
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AskBAIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const AskBAIDrawer: React.FC<AskBAIDrawerProps> = ({ isOpen, onClose, transactions }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello Michael! I'm **B-AI**, your financial assistant. Ask me anything about your payments, merchant spending, failed transactions, or account analytics.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isLoading]);

  if (!isOpen) return null;

  // Calculate local transaction insights for instant smart responses
  const totalSpent = transactions
    .filter((t) => t.amount < 0 && t.status === 'Completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalReceived = transactions
    .filter((t) => t.amount > 0 && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const failedTxs = transactions.filter((t) => t.status === 'Failed');
  const pendingTxs = transactions.filter((t) => t.status === 'Pending');

  const largestExpense = [...transactions]
    .filter((t) => t.amount < 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];

  const promptChips = [
    { label: 'Spending summary', query: 'Summarize my spending and overall financial activity.', icon: TrendingUp },
    { label: 'Failed payments', query: 'Show me all failed transactions and their total value.', icon: AlertCircle },
    { label: 'Highest transaction', query: 'What was my highest transaction and merchant details?', icon: Sparkles },
    { label: 'Recipient transfers', query: 'How much money did I send to my contacts?', icon: User },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const storedUid = localStorage.getItem('bmoni_user_id') || '1701f90b-2e62-401e-8c57-0d03c53b6525';
      let localTxs: any[] = [];
      try {
        localTxs = JSON.parse(localStorage.getItem(`bmoni_txs_${storedUid}`) || '[]');
      } catch (e) {
        localTxs = [];
      }

      const res = await fetch('/api/ask-b-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          transactions: [...localTxs, ...transactions],
          userProfile: {
            bmoniUserId: storedUid,
            name: 'Michael Onuoha',
            email: 'michaelonuoha.01@gmail.com'
          }
        }),
      });

      const data = await res.json();

      let replyText = '';
      if (data && data.mode === 'ai' && data.answer) {
        replyText = data.answer;
      } else {
        // Fallback rule-based smart analysis
        replyText = generateSmartFallbackReply(textToSend, transactions, totalSpent, totalReceived, failedTxs, largestExpense);
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackReply = generateSmartFallbackReply(textToSend, transactions, totalSpent, totalReceived, failedTxs, largestExpense);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartFallbackReply = (
    query: string,
    txs: Transaction[],
    spent: number,
    received: number,
    failed: Transaction[],
    largest: Transaction | undefined
  ): string => {
    const q = query.toLowerCase();

    if (q.includes('failed') || q.includes('fail') || q.includes('error')) {
      if (failed.length === 0) return "Great news! You don't have any failed transactions.";
      const failedTotal = failed.reduce((acc, t) => acc + Math.abs(t.amount), 0);
      const itemsList = failed.map((f) => `• **${f.merchantName}** on ${f.date} (-$${Math.abs(f.amount).toFixed(2)})`).join('\n');
      return `**Failed Transactions Alert**:\nYou have **${failed.length} failed transaction(s)** totaling **$${failedTotal.toFixed(2)}**:\n\n${itemsList}\n\n*Suggestion:* Verify your payment method balance before retrying.`;
    }

    if (q.includes('highest') || q.includes('largest') || q.includes('biggest') || q.includes('max')) {
      if (!largest) return 'No outgoing transactions found.';
      return `**Largest Transaction Details**:\nYour highest outgoing payment was to **${largest.merchantName}** (${largest.merchantCategory}) for **$${Math.abs(largest.amount).toFixed(2)}** on ${largest.date}.\nStatus: **${largest.status}**.`;
    }

    if (q.includes('recipient') || q.includes('anabel') || q.includes('transfer') || q.includes('people') || q.includes('send')) {
      const transfers = txs.filter((t) => t.merchantCategory === 'Money Transfer');
      const totalSent = transfers.filter(t => t.amount < 0 && t.status === 'Completed').reduce((s, t) => s + Math.abs(t.amount), 0);
      const recipientSummary = transfers.map(t => `• **${t.merchantName}**: $${Math.abs(t.amount).toFixed(2)} (${t.status})`).join('\n');
      return `**Money Transfer Summary**:\nYou have initiated **${transfers.length} peer-to-peer transfers** totaling **$${totalSent.toFixed(2)}** completed.\n\n${recipientSummary}`;
    }

    // Default financial summary
    return `**Financial Overview & Activity Summary**:\n\n` +
      `• **Total Outgoing Expenses**: $${spent.toFixed(2)}\n` +
      `• **Total Incoming Credits**: $${received.toFixed(2)}\n` +
      `• **Net Cashflow**: ${received - spent >= 0 ? '+' : ''}$${(received - spent).toFixed(2)}\n` +
      `• **Total Transactions Logged**: ${txs.length} items (${failed.length} failed, ${pendingTxs.length} pending)\n\n` +
      `How else can I assist with your financial analytics today?`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl relative border-l border-[#E5E5EA]">
        {/* Header Banner following Payline Brand Colors */}
        <div className="bg-[#3B1053] text-white p-6 flex flex-col gap-3 relative select-none">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Ask B-AI"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFFF4F] text-[#3B1053] flex items-center justify-center font-extrabold text-lg shadow-md">
              <Sparkles className="w-6 h-6 fill-[#3B1053]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-sans tracking-tight text-white">Ask B-AI</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#DFFF4F] text-[#3B1053] text-[10px] font-black uppercase tracking-wider">
                  Live Copilot
                </span>
              </div>
              <p className="text-xs text-white/70 font-medium">Payline Financial Intelligence & Insights</p>
            </div>
          </div>

          {/* Quick Stats Bar inside Header */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-white/60 block font-medium">Spent</span>
              <span className="text-sm font-extrabold text-white">${totalSpent.toFixed(0)}</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-white/60 block font-medium">Received</span>
              <span className="text-sm font-extrabold text-[#DFFF4F]">${totalReceived.toFixed(0)}</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-white/60 block font-medium">Failed</span>
              <span className="text-sm font-extrabold text-[#FF6B6B]">{failedTxs.length} items</span>
            </div>
          </div>
        </div>

        {/* Chat Conversation Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F5F5F7]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-4 rounded-2xl text-xs leading-relaxed font-sans shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#1C1C1E] text-white rounded-tr-none'
                    : 'bg-white text-[#1C1C1E] border border-[#E5E5EA] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, idx) => {
                    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p
                        key={idx}
                        className={idx > 0 ? 'mt-1.5' : ''}
                        dangerouslySetInnerHTML={{ __html: formattedLine }}
                      />
                    );
                  })}
                </div>
                <span
                  className={`block text-[9px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-white/50' : 'text-[#8E8E93]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  WG
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] text-xs text-[#8E8E93] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
                <span>B-AI is analyzing transactions...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Prompt Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-[#F2F2F7] flex gap-2 overflow-x-auto no-scrollbar">
          {promptChips.map((chip, idx) => {
            const IconComp = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-3 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#3B1053] hover:text-white text-[#1C1C1E] text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer border border-[#E5E5EA] flex items-center gap-1.5 flex-shrink-0 group"
              >
                <IconComp className="w-3.5 h-3.5 text-[#3B1053] group-hover:text-white transition-colors" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#E5E5EA]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#F5F5F7] rounded-xl p-1.5 border border-[#E5E5EA] focus-within:border-[#3B1053] transition-colors"
          >
            <input
              type="text"
              placeholder="Ask B-AI a question about your payments..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-[#1C1C1E] outline-none font-sans placeholder-[#8E8E93]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="w-9 h-9 rounded-lg bg-[#3B1053] text-[#DFFF4F] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center hover:bg-[#2F0B43] transition-colors cursor-pointer flex-shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

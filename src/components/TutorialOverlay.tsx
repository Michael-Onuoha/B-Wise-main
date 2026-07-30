import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X, Sparkles, RotateCcw } from 'lucide-react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  selector?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  emoji?: string;
}

const DEFAULT_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Payline, Michael 👋',
    description:
      "Let's take a quick 60-second tour so you know exactly where everything is. Click Next when you're ready, or Skip at any time.",
    emoji: '✨',
    placement: 'right',
  },
  {
    id: 'sidebar',
    title: 'Navigate with the sidebar',
    description:
      'Jump between your dashboard overview, transactions, AI analytics, payroll, taxes, and your multi-account vault. Everything important lives here.',
    selector: '[data-tutorial="sidebar"]',
    placement: 'right',
    emoji: '🧭',
  },
  {
    id: 'profile',
    title: 'Your profile & settings',
    description:
      'Your avatar pill is top-right. Click it to access account settings, switch workspaces, API keys, or sign out.',
    selector: '[data-tutorial="profile-pill"]',
    placement: 'bottom',
    emoji: '👤',
  },
  {
    id: 'ask-bai',
    title: 'Ask B-AI anything about your money',
    description:
      'Click the "Ask B-AI" button any time to query your spend, failed transactions, merchant trends, or forecasts — powered by Gemini.',
    selector: '[data-tutorial="ask-bai"]',
    placement: 'bottom',
    emoji: '🤖',
  },
  {
    id: 'transactions-tab',
    title: 'Transaction History — the heart of the app',
    description:
      "This tab is where the magic happens: search, filter, sort, export CSV, and manage every transfer. You called this your favourite UI, so we kept it as the reference.",
    selector: '[data-tutorial="tx-tab"]',
    placement: 'right',
    emoji: '🧾',
  },
  {
    id: 'chart-timeframe',
    title: 'Payment Volume adjusts to your data',
    description:
      "Switch between 7D / 30D / 90D. Bars are derived from your actual transactions — make a transfer and they re-render instantly. Click a bar for the exact volume.",
    selector: '[data-tutorial="chart-timeframe"]',
    placement: 'bottom',
    emoji: '📊',
  },
  {
    id: 'quick-transfer',
    title: 'Send money in one drag',
    description:
      'Pick a recipient, choose an amount & currency, then drag the green slider all the way right to execute. The transaction drops into history + chart instantly.',
    selector: '[data-tutorial="quick-transfer"]',
    placement: 'right',
    emoji: '💸',
  },
  {
    id: 'search-filter',
    title: 'Search, filter, sort, export',
    description:
      'Click the search icon, use the Filter pill for status or category, sort by amount/date/merchant, and export a CSV any time. Tick rows for bulk actions like delete.',
    selector: '[data-tutorial="tx-toolbar"]',
    placement: 'top',
    emoji: '🔎',
  },
  {
    id: 'add-tx',
    title: 'Add or import a transaction manually',
    description:
      "Click + at the top of the history table to log a one-off charge, refund, or payout that didn't come through the bank feed.",
    selector: '[data-tutorial="add-tx"]',
    placement: 'bottom',
    emoji: '➕',
  },
  {
    id: 'done',
    title: "You're all set 🎉",
    description:
      "That's it. Remember the secret: type /tutorial anywhere on the page any time to re-run this guide. Enjoy Payline!",
    emoji: '🚀',
    placement: 'right',
  },
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  steps?: TutorialStep[];
  startIndex?: number;
}

type SpotlightRect = {
  x: number;
  y: number;
  w: number;
  h: number;
} | null;

const getRectFor = (selector?: string): SpotlightRect => {
  if (!selector) return null;
  try {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  } catch {
    return null;
  }
};

const PADDING = 10;
const CARD_W = 340;
const CARD_H = 230;

const pickCardPos = (
  rect: SpotlightRect,
  placement: TutorialStep['placement'] = 'bottom',
  viewportW: number,
  viewportH: number,
) => {
  if (!rect) {
    return { x: Math.max(24, viewportW / 2 - CARD_W / 2), y: Math.max(64, viewportH / 2 - CARD_H / 2) };
  }
  const gap = 18;
  let x = rect.x;
  let y = rect.y;
  switch (placement) {
    case 'top':
      x = rect.x + rect.w / 2 - CARD_W / 2;
      y = rect.y - CARD_H - gap;
      break;
    case 'left':
      x = rect.x - CARD_W - gap;
      y = rect.y + rect.h / 2 - CARD_H / 2;
      break;
    case 'right':
      x = rect.x + rect.w + gap;
      y = rect.y + rect.h / 2 - CARD_H / 2;
      break;
    case 'bottom':
    default:
      x = rect.x + rect.w / 2 - CARD_W / 2;
      y = rect.y + rect.h + gap;
  }
  const mx = 16;
  const my = 56;
  x = Math.min(Math.max(mx, x), viewportW - CARD_W - mx);
  y = Math.min(Math.max(my, y), viewportH - CARD_H - 16);
  return { x, y };
};

export const TutorialOverlay = ({
  isOpen,
  onClose,
  steps = DEFAULT_STEPS,
  startIndex = 0,
}: TutorialOverlayProps) => {
  const [stepIdx, setStepIdx] = useState(startIndex);
  const [rect, setRect] = useState<SpotlightRect>(null);
  const [viewport, setViewport] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1280, h: typeof window !== 'undefined' ? window.innerHeight : 800 });
  const rafRef = useRef<number | null>(null);

  const step = steps[stepIdx];

  useEffect(() => {
    if (!isOpen) return;
    const recompute = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      setRect(getRectFor(step?.selector));
      const el = step?.selector ? document.querySelector<HTMLElement>(step.selector) : null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    };
    recompute();
    const loop = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      setRect(getRectFor(step?.selector));
      rafRef.current = window.setTimeout(() => {
        rafRef.current = requestAnimationFrame(loop);
      }, 150) as unknown as number;
    };
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', recompute);
    window.addEventListener('scroll', recompute, true);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current as unknown as number);
      window.removeEventListener('resize', recompute);
      window.removeEventListener('scroll', recompute, true);
    };
  }, [isOpen, step?.selector]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stepIdx]);

  useEffect(() => {
    if (isOpen) {
      setStepIdx(startIndex);
    }
  }, [isOpen, startIndex]);

  const goNext = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      onClose();
    }
  };
  const goPrev = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const cardPos = useMemo(
    () => pickCardPos(rect, step?.placement, viewport.w, viewport.h),
    [rect, step?.placement, viewport.w, viewport.h],
  );

  if (!isOpen) return null;

  const showSpotlight = !!rect;
  const sx = (rect?.x ?? 0) - PADDING;
  const sy = (rect?.y ?? 0) - PADDING;
  const sw = (rect?.w ?? 0) + PADDING * 2;
  const sh = (rect?.h ?? 0) + PADDING * 2;

  return (
    <div className="fixed inset-0 z-[120] pointer-events-none select-none">
      {/* Dimmed veil + spotlight hole (outline trick) */}
      {showSpotlight ? (
        <div
          className="absolute pointer-events-none rounded-[18px] transition-[top,left,width,height] duration-300 ease-out"
          style={{
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            outline: '99999px solid rgba(12, 12, 18, 0.78)',
            boxShadow:
              '0 0 0 2px #DFFF4F inset, 0 0 0 1px rgba(223, 255, 79, 0.5), 0 8px 48px 0 rgba(223, 255, 79, 0.18)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0C0C12]/80 backdrop-blur-[2px] pointer-events-none" />
      )}

      {/* Tutorial Card */}
      <div
        className="absolute pointer-events-auto bg-white rounded-2xl shadow-[0_24px_80px_-16px_rgba(59,16,83,0.45)] border border-[#E5E5EA] overflow-hidden"
        style={{
          left: cardPos.x,
          top: cardPos.y,
          width: CARD_W,
          minHeight: CARD_H,
        }}
      >
        {/* Header stripe */}
        <div className="h-1.5 bg-gradient-to-r from-[#3B1053] via-[#6A228F] to-[#DFFF4F] w-full" />

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center text-lg font-black shadow-[0_0_0_4px_rgba(59,16,83,0.08)]">
                {step?.emoji ?? <Sparkles className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#8E8E93] leading-none mb-1">
                  Step {stepIdx + 1} / {steps.length}
                </span>
                <h3 className="text-[15px] font-extrabold text-[#1C1C1E] tracking-[-0.25px] leading-tight">
                  {step?.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center transition-colors shrink-0"
              aria-label="Close tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[13px] leading-[1.55] text-[#3A3A3C] mb-5 min-h-[60px]">
            {step?.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === stepIdx
                      ? 'w-6 bg-[#3B1053]'
                      : i < stepIdx
                      ? 'w-2 bg-[#CBCBD0]'
                      : 'w-1.5 bg-[#E5E5EA]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-[11px] font-semibold text-[#8E8E93] hover:text-[#1C1C1E] transition-colors uppercase tracking-wide"
            >
              Skip
            </button>
          </div>

          {/* Action row */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={goPrev}
              disabled={stepIdx === 0}
              className="h-9 px-3.5 rounded-xl text-[13px] font-semibold text-[#3B1053] bg-[#F8F4FB] hover:bg-[#EEE6F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={goNext}
              className="h-9 px-4 rounded-xl text-[13px] font-extrabold text-[#1C1C1E] bg-[#DFFF4F] hover:bg-[#D0FF2E] shadow-[0_2px_0_0_rgba(124,153,0,0.25)] transition-colors flex items-center gap-1.5"
            >
              {stepIdx === steps.length - 1 ? (
                <>
                  Done
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#FAFAFA] border-t border-[#F2F2F7] flex items-center justify-between">
          <span className="text-[11px] text-[#8E8E93] flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Tip: type <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-white border border-[#E5E5EA] rounded-md text-[#3B1053] font-bold">/tutorial</kbd> anywhere to replay
          </span>
          <span className="text-[10px] font-semibold text-[#C7C7CC]">Esc to close</span>
        </div>
      </div>
    </div>
  );
};

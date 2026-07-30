export type TransactionStatus = 'Completed' | 'Failed' | 'Pending';

export interface MerchantInfo {
  name: string;
  category: string;
  logoText: string;
  bgColor: string;
  textColor: string;
  isSvg?: boolean;
}

export interface Transaction {
  id: string;
  merchant: MerchantInfo;
  date: string;
  timestamp: string;
  amount: number; // Negative for outgoing, positive for incoming
  currency: string;
  status: TransactionStatus;
  accountNumber?: string;
  referenceId?: string;
  fee?: number;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  avatarBg: string;
  avatarColor?: string;
  role?: string;
}

export interface VolumeDataPoint {
  day: string;
  dateStr: string;
  volume: number;
  heightPx: number;
  isHighlighted?: boolean;
}

export interface CurrencyRate {
  code: string;
  symbol: string;
  rateToEur: number; // 1 EUR = X units
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'transfer' | 'system' | 'alert';
}

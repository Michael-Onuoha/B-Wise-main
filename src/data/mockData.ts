import { Transaction, Recipient, VolumeDataPoint, CurrencyRate, NotificationItem } from '../types';

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'r1',
    name: 'Anabel Smith',
    email: 'anabel.smith@payline.io',
    avatarBg: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    avatarColor: '#4A3020',
    role: 'Product Designer',
  },
  {
    id: 'r2',
    name: 'Ethan Vance',
    email: 'ethan.vance@payline.io',
    avatarBg: 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)',
    avatarColor: '#5D4037',
    role: 'Senior Engineer',
  },
  {
    id: 'r3',
    name: 'Gabriel Ross',
    email: 'gabriel.ross@payline.io',
    avatarBg: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)',
    avatarColor: '#FDBA74',
    role: 'Financial Analyst',
  },
  {
    id: 'r4',
    name: 'Hermione Granger',
    email: 'hermione@payline.io',
    avatarBg: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
    avatarColor: '#FDBA74',
    role: 'Operations Lead',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    merchant: {
      name: 'Amazon',
      category: 'Online Shopping',
      logoText: 'Am',
      bgColor: '#FF9900',
      textColor: '#FFFFFF',
    },
    date: 'Sep 9, 2025 at 04:30pm',
    timestamp: '2025-09-09T16:30:00Z',
    amount: -150.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 8829',
    referenceId: 'PAY-8829102-AMZ',
    fee: 0.00,
  },
  {
    id: 'tx-102',
    merchant: {
      name: 'Adobe Photoshop',
      category: 'Services',
      logoText: 'Ad',
      bgColor: '#FF0000',
      textColor: '#FFFFFF',
    },
    date: 'Sep 8, 2025 at 03:13pm',
    timestamp: '2025-09-08T15:13:00Z',
    amount: -55.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 4412',
    referenceId: 'PAY-441209-ADB',
    fee: 0.00,
  },
  {
    id: 'tx-103',
    merchant: {
      name: 'PayPal',
      category: 'Money Transfer',
      logoText: 'PP',
      bgColor: '#003087',
      textColor: '#FFFFFF',
    },
    date: 'Sep 7, 2025 at 1:00pm',
    timestamp: '2025-09-07T13:00:00Z',
    amount: -3456.00,
    currency: '$',
    status: 'Failed',
    accountNumber: '•••• 1928',
    referenceId: 'PAY-1928371-PPL',
    fee: 0.00,
  },
  {
    id: 'tx-104',
    merchant: {
      name: 'Ebay',
      category: 'Online Shopping',
      logoText: 'Eb',
      bgColor: '#F5F5F7',
      textColor: '#E53238',
    },
    date: 'Sep 6, 2025 at 07:00am',
    timestamp: '2025-09-06T07:00:00Z',
    amount: -220.80,
    currency: '$',
    status: 'Pending',
    accountNumber: '•••• 9931',
    referenceId: 'PAY-993182-EBY',
    fee: 0.00,
  },
  {
    id: 'tx-105',
    merchant: {
      name: 'Wise',
      category: 'Money Transfer',
      logoText: 'Ws',
      bgColor: '#9FE870',
      textColor: '#163300',
    },
    date: 'Sep 8, 2025 at 09:20am',
    timestamp: '2025-09-08T09:20:00Z',
    amount: 10000.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 7701',
    referenceId: 'PAY-770192-WSE',
    fee: 0.00,
  },
  {
    id: 'tx-106',
    merchant: {
      name: 'Airbnb',
      category: 'Services',
      logoText: 'Ab',
      bgColor: '#FF5A5F',
      textColor: '#FFFFFF',
    },
    date: 'Sep 6, 2025 at 09:15pm',
    timestamp: '2025-09-06T21:15:00Z',
    amount: -220.80,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 3349',
    referenceId: 'PAY-334918-ABNB',
    fee: 0.00,
  },
  {
    id: 'tx-107',
    merchant: {
      name: 'PayPal',
      category: 'Money Transfer',
      logoText: 'PP',
      bgColor: '#003087',
      textColor: '#FFFFFF',
    },
    date: 'Sep 8, 2025 at 11:02am',
    timestamp: '2025-09-08T11:02:00Z',
    amount: -1000.00,
    currency: '$',
    status: 'Failed',
    accountNumber: '•••• 1928',
    referenceId: 'PAY-1928372-PPL',
    fee: 0.00,
  },
  {
    id: 'tx-108',
    merchant: {
      name: 'Spotify',
      category: 'Entertainment',
      logoText: 'Sp',
      bgColor: '#1DB954',
      textColor: '#FFFFFF',
    },
    date: 'Sep 5, 2025 at 11:20am',
    timestamp: '2025-09-05T11:20:00Z',
    amount: -14.99,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 5512',
    referenceId: 'PAY-55121-SPT',
    fee: 0.00,
  },
  {
    id: 'tx-109',
    merchant: {
      name: 'Netflix',
      category: 'Entertainment',
      logoText: 'Nf',
      bgColor: '#000000',
      textColor: '#E50914',
    },
    date: 'Sep 4, 2025 at 08:45pm',
    timestamp: '2025-09-04T20:45:00Z',
    amount: -19.99,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 2287',
    referenceId: 'PAY-2287-NFX',
    fee: 0.00,
  },
  {
    id: 'tx-110',
    merchant: {
      name: 'Apple Store',
      category: 'Electronics',
      logoText: 'Ap',
      bgColor: '#1C1C1E',
      textColor: '#FFFFFF',
    },
    date: 'Sep 3, 2025 at 02:15pm',
    timestamp: '2025-09-03T14:15:00Z',
    amount: -1299.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 7741',
    referenceId: 'PAY-7741-APL',
    fee: 0.00,
  },
  {
    id: 'tx-111',
    merchant: {
      name: 'Stripe Payout',
      category: 'Money Transfer',
      logoText: 'St',
      bgColor: '#635BFF',
      textColor: '#FFFFFF',
    },
    date: 'Sep 10, 2025 at 08:05am',
    timestamp: '2025-09-10T08:05:00Z',
    amount: 4850.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 7701',
    referenceId: 'PAY-7701-STR',
    fee: 145.50,
  },
  {
    id: 'tx-112',
    merchant: {
      name: 'Gusto Payroll',
      category: 'Payroll',
      logoText: 'Gu',
      bgColor: '#F472B6',
      textColor: '#FFFFFF',
    },
    date: 'Sep 10, 2025 at 09:30am',
    timestamp: '2025-09-10T09:30:00Z',
    amount: -2880.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 8829',
    referenceId: 'PAY-8829-GUS',
    fee: 6.00,
  },
  {
    id: 'tx-113',
    merchant: {
      name: 'Shopify Fees',
      category: 'Services',
      logoText: 'Sh',
      bgColor: '#008060',
      textColor: '#FFFFFF',
    },
    date: 'Sep 11, 2025 at 10:15am',
    timestamp: '2025-09-11T10:15:00Z',
    amount: -298.45,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 4412',
    referenceId: 'PAY-4412-SHF',
    fee: 29.84,
  },
  {
    id: 'tx-114',
    merchant: {
      name: 'IRS Q3 Estimate',
      category: 'Tax',
      logoText: 'IR',
      bgColor: '#374151',
      textColor: '#FFFFFF',
    },
    date: 'Sep 12, 2025 at 11:45am',
    timestamp: '2025-09-12T11:45:00Z',
    amount: -1560.00,
    currency: '$',
    status: 'Pending',
    accountNumber: '•••• 8829',
    referenceId: 'PAY-8829-IRS',
    fee: 0.00,
  },
  {
    id: 'tx-115',
    merchant: {
      name: 'Upwork Client',
      category: 'Money Transfer',
      logoText: 'Uw',
      bgColor: '#14A800',
      textColor: '#FFFFFF',
    },
    date: 'Sep 13, 2025 at 02:40pm',
    timestamp: '2025-09-13T14:40:00Z',
    amount: 3420.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 7701',
    referenceId: 'PAY-7701-UW',
    fee: 342.00,
  },
  {
    id: 'tx-116',
    merchant: {
      name: 'AWS Bill',
      category: 'Services',
      logoText: 'AW',
      bgColor: '#FF9900',
      textColor: '#1C1C1E',
    },
    date: 'Sep 14, 2025 at 06:22am',
    timestamp: '2025-09-14T06:22:00Z',
    amount: -742.18,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 7741',
    referenceId: 'PAY-7741-AWS',
    fee: 0.00,
  },
  {
    id: 'tx-117',
    merchant: {
      name: 'Figma Team',
      category: 'Services',
      logoText: 'Fi',
      bgColor: '#000000',
      textColor: '#F24E1E',
    },
    date: 'Sep 15, 2025 at 01:10pm',
    timestamp: '2025-09-15T13:10:00Z',
    amount: -45.00,
    currency: '$',
    status: 'Completed',
    accountNumber: '•••• 4412',
    referenceId: 'PAY-4412-FIG',
    fee: 0.00,
  },
  {
    id: 'tx-118',
    merchant: {
      name: 'WeWork Rent',
      category: 'Office',
      logoText: 'WW',
      bgColor: '#000000',
      textColor: '#FFFFFF',
    },
    date: 'Sep 16, 2025 at 09:00am',
    timestamp: '2025-09-16T09:00:00Z',
    amount: -920.00,
    currency: '$',
    status: 'Pending',
    accountNumber: '•••• 8829',
    referenceId: 'PAY-8829-WEW',
    fee: 0.00,
  },
];

export const VOLUME_DATA: VolumeDataPoint[] = [
  { day: 'Wed', dateStr: 'Sep 10', volume: 1970, heightPx: 70 },
  { day: 'Thu', dateStr: 'Sep 11', volume: 298, heightPx: 25 },
  { day: 'Fri', dateStr: 'Sep 12', volume: 1560, heightPx: 95, isHighlighted: true },
  { day: 'Sat', dateStr: 'Sep 13', volume: 3420, heightPx: 110 },
  { day: 'Sun', dateStr: 'Sep 14', volume: 742, heightPx: 50 },
  { day: 'Mon', dateStr: 'Sep 15', volume: 45, heightPx: 20 },
  { day: 'Tue', dateStr: 'Sep 16', volume: 920, heightPx: 60 },
];

export function buildVolumeFromTransactions(
  transactions: Transaction[],
  days: number = 7,
  heightMax: number = 130
): VolumeDataPoint[] {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const perDayNet: Record<string, number> = {};
  const perDayLabels: Record<string, string> = {};

  let anchorDate: Date;
  const sortedTxs = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  if (sortedTxs[0]?.timestamp) {
    anchorDate = new Date(sortedTxs[0].timestamp);
  } else {
    anchorDate = new Date();
  }
  anchorDate.setHours(23, 59, 59, 999);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    perDayNet[key] = 0;
    perDayLabels[key] = `${DAY_NAMES[d.getDay()]}__${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  for (const tx of transactions) {
    if (tx.status === 'Failed') continue;
    const dt = new Date(tx.timestamp || tx.date);
    const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    if (perDayNet.hasOwnProperty(key)) {
      const absAmt = Math.abs(tx.amount);
      perDayNet[key] += absAmt;
    }
  }

  const ordered = Object.keys(perDayNet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const maxVolume = Math.max(1, ...ordered.map((k) => perDayNet[k]));
  let peakIdx = 0;
  ordered.forEach((k, idx) => {
    if (perDayNet[k] > perDayNet[ordered[peakIdx]]) peakIdx = idx;
  });

  return ordered.map((k, idx) => {
    const [day, dateStr] = perDayLabels[k].split('__');
    const volume = Math.round(perDayNet[k]);
    const ratio = volume / maxVolume;
    const heightPx = Math.max(18, Math.round(ratio * heightMax));
    return {
      day,
      dateStr,
      volume,
      heightPx,
      isHighlighted: idx === peakIdx,
    };
  });
}

export const CURRENCIES: CurrencyRate[] = [
  { code: 'EUR', symbol: '€', rateToEur: 1.0 },
  { code: 'USD', symbol: '$', rateToEur: 1.18 },
  { code: 'GBP', symbol: '£', rateToEur: 0.85 },
  { code: 'CAD', symbol: 'C$', rateToEur: 1.45 },
  { code: 'JPY', symbol: '¥', rateToEur: 162.50 },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Transfer Received',
    message: 'Received +$10,000.00 from Wise wire transfer.',
    time: '2 hours ago',
    read: false,
    type: 'transfer',
  },
  {
    id: 'n2',
    title: 'Payment Failed',
    message: 'Payment of -$3,456.00 to PayPal failed due to verification limit.',
    time: '1 day ago',
    read: false,
    type: 'alert',
  },
  {
    id: 'n3',
    title: 'Security Alert',
    message: 'New login detected from Safari browser on macOS.',
    time: '2 days ago',
    read: true,
    type: 'system',
  },
];

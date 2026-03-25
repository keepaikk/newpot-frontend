import { Market, CryptoTicker } from './types';

export const SUPPORTED_CRYPTOS: { ticker: CryptoTicker; name: string; color: string; icon: string }[] = [
  { ticker: 'BTC', name: 'Bitcoin', color: '#F7931A', icon: '₿' },
  { ticker: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'Ξ' },
  { ticker: 'SOL', name: 'Solana', color: '#14F195', icon: '◎' },
  { ticker: 'XLM', name: 'Stellar', color: '#FFFFFF', icon: '✧' },
  { ticker: 'XRP', name: 'Ripple', color: '#23292F', icon: '✕' },
  { ticker: 'BONK', name: 'Bonk', color: '#F8B526', icon: '🐕' },
];

export const MOCK_MARKETS: Market[] = [
  {
    id: '1',
    title: 'Will Ghana win AFCON 2027?',
    description: 'Black Stars' quest for glory in Morocco. First major tournament since 2025 group stage exit.',
    category: 'Sports',
    endDate: '2027-02-28T20:00:00Z',
    volume: 89000,
    yesPrice: 0.38,
    noPrice: 0.62,
    imageUrl: 'https://images.unsplash.com/photo-1562095533-a5e7f8beed21?w=800&h=400&fit=crop',
    oddsHistory: [
      { timestamp: '2026-01-01', yes: 0.30, no: 0.70 },
      { timestamp: '2026-02-01', yes: 0.35, no: 0.65 },
      { timestamp: '2026-03-01', yes: 0.38, no: 0.62 },
    ]
  },
  {
    id: '2',
    title: 'Will NPP win the 2028 Ghana Presidential Election?',
    description: 'Market settles on official Electoral Commission of Ghana results. Incumbent seeks re-election.',
    category: 'Politics',
    endDate: '2028-12-07T22:00:00Z',
    volume: 3200000,
    yesPrice: 0.51,
    noPrice: 0.49,
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    oddsHistory: [
      { timestamp: '2026-01-01', yes: 0.50, no: 0.50 },
      { timestamp: '2026-06-01', yes: 0.48, no: 0.52 },
      { timestamp: '2027-01-01', yes: 0.51, no: 0.49 },
    ]
  },
  {
    id: '3',
    title: 'Will BTC exceed $150,000 by end of 2026?',
    description: 'Bitcoin price prediction. Based on Binance spot market close on Dec 31, 2026.',
    category: 'Crypto',
    endDate: '2026-12-31T23:59:59Z',
    volume: 1250000,
    yesPrice: 0.65,
    noPrice: 0.35,
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop',
    oddsHistory: [
      { timestamp: '2026-01-01', yes: 0.40, no: 0.60 },
      { timestamp: '2026-02-01', yes: 0.58, no: 0.42 },
      { timestamp: '2026-03-01', yes: 0.65, no: 0.35 },
    ]
  },
  {
    id: '4',
    title: 'Will Ghana inflation drop below 10% by Q3 2026?',
    description: 'Ghana Statistical Service official CPI data. Annual inflation rate target.',
    category: 'Economy',
    endDate: '2026-09-30T23:59:59Z',
    volume: 45000,
    yesPrice: 0.42,
    noPrice: 0.58,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    oddsHistory: [
      { timestamp: '2026-01-01', yes: 0.35, no: 0.65 },
      { timestamp: '2026-02-01', yes: 0.40, no: 0.60 },
      { timestamp: '2026-03-01', yes: 0.42, no: 0.58 },
    ]
  },
  {
    id: '5',
    title: 'Will Akufo-Addo hand over power peacefully in 2025?',
    description: 'Peaceful transition of power after term ends. Based on Jan 7, 2025 inauguration.',
    category: 'Politics',
    endDate: '2025-01-10T00:00:00Z',
    volume: 67000,
    yesPrice: 0.89,
    noPrice: 0.11,
    imageUrl: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=800&h=400&fit=crop',
    oddsHistory: [
      { timestamp: '2024-06-01', yes: 0.85, no: 0.15 },
      { timestamp: '2024-09-01', yes: 0.87, no: 0.13 },
      { timestamp: '2024-12-01', yes: 0.89, no: 0.11 },
    ]
  }
];


export type CryptoTicker = 'BTC' | 'ETH' | 'SOL' | 'XLM' | 'XRP' | 'BONK';

export interface User {
  id: string;
  username: string;
  balances: Record<CryptoTicker, number>;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: 'Politics' | 'Sports' | 'Entertainment' | 'Crypto' | 'Economy';
  endDate: string;
  volume: number;
  yesPrice: number; // 0 to 1 scale
  noPrice: number;  // 0 to 1 scale
  imageUrl: string;
  oddsHistory: Array<{ timestamp: string; yes: number; no: number }>;
}

export interface Position {
  id: string;
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;
  entryPrice: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'payout';
  asset: CryptoTicker;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

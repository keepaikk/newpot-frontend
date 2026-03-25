// MVP Types for NewsoBet Backend

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  country?: 'GH' | 'NG' | 'KE' | 'UG' | 'TZ' | 'RW';
  balances: {
    BTC: number;
    ETH: number;
    SOL: number;
    XLM: number;
    XRP: number;
    BONK: number;
  };
  mobileMoneyBalances: MobileMoneyBalance[];
  createdAt: Date;
}

export interface MobileMoneyBalance {
  provider: 'MTN' | 'AIRTEL' | 'VODAFONE' | 'TIGO';
  phoneNumber: string;
  balance: number;
  currency: 'GHS' | 'NGN' | 'KES' | 'UGX' | 'TZS' | 'RWF';
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: 'Politics' | 'Sports' | 'Entertainment' | 'Crypto' | 'Economy';
  endDate: Date;
  isResolved: boolean;
  resolution?: 'YES' | 'NO';
  yesPrice: number;
  noPrice: number;
  volume: number;
  totalYesShares: number;
  totalNoShares: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface Position {
  id: string;
  userId: string;
  marketId: string;
  side: 'YES' | 'NO';
  amount: number;
  shares: number;
  entryPrice: number;
  paymentMethod: string;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'payout';
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}
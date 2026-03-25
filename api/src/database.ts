// MVP In-Memory Database for Demo
import { User, Market, Position, Transaction } from './types';

// Mock data that matches frontend expectations
export const users: User[] = [
  {
    id: 'user1',
    username: 'KwameBet',
    email: 'kwame@newpot.com',
    phoneNumber: '+233241234567',
    country: 'GH',
    balances: {
      BTC: 0.045,
      ETH: 1.2,
      SOL: 45.0,
      XLM: 5000,
      XRP: 250,
      BONK: 12000000
    },
    mobileMoneyBalances: [
      {
        provider: 'MTN',
        phoneNumber: '+233241234567',
        balance: 1250.50,
        currency: 'GHS'
      },
      {
        provider: 'VODAFONE',
        phoneNumber: '+233271234567',
        balance: 890.25,
        currency: 'GHS'
      }
    ],
    createdAt: new Date()
  }
];

export const markets: Market[] = [
  {
    id: '1',
    title: 'Will Ghana win the AFCON 2025?',
    description: 'Black Stars attempt to break the decades-long drought in Morocco.',
    category: 'Sports',
    endDate: new Date('2025-12-31T23:59:59Z'),
    isResolved: false,
    yesPrice: 0.35,
    noPrice: 0.65,
    volume: 125040,
    totalYesShares: 1400,
    totalNoShares: 2600,
    imageUrl: 'https://picsum.photos/seed/ghana-afcon/800/400',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'NPP vs NDC: Who wins the 2024 Presidential Election?',
    description: 'Market settles based on official Electoral Commission of Ghana results.',
    category: 'Politics',
    endDate: new Date('2025-12-31T23:59:59Z'),
    isResolved: false,
    yesPrice: 0.52,
    noPrice: 0.48,
    volume: 2450000,
    totalYesShares: 2080,
    totalNoShares: 1920,
    imageUrl: 'https://picsum.photos/seed/gh-election/800/400',
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Will BTC hit $100k before December 2024?',
    description: 'Based on Binance spot market prices.',
    category: 'Crypto',
    endDate: new Date('2025-12-31T23:59:59Z'),
    isResolved: false,
    yesPrice: 0.72,
    noPrice: 0.28,
    volume: 890000,
    totalYesShares: 2880,
    totalNoShares: 1120,
    imageUrl: 'https://picsum.photos/seed/btc100k/800/400',
    createdAt: new Date()
  }
];

export const positions: Position[] = [];
export const transactions: Transaction[] = [];

// Helper functions for MVP
export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findMarketById = (id: string): Market | undefined => {
  return markets.find(market => market.id === id);
};

export const addPosition = (position: Position): void => {
  positions.push(position);
};

export const addTransaction = (transaction: Transaction): void => {
  transactions.push(transaction);
};

export const getUserPositions = (userId: string): Position[] => {
  return positions.filter(position => position.userId === userId);
};

export const getUserTransactions = (userId: string): Transaction[] => {
  return transactions.filter(transaction => transaction.userId === userId);
};
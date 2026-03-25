
import { create } from 'zustand';
import { Market, Position, User, CryptoTicker } from './types';
import { MOCK_MARKETS } from './constants';

interface AppState {
  user: User | null;
  markets: Market[];
  positions: Position[];
  selectedCategory: string;
  isWalletOpen: boolean;
  setUser: (user: User | null) => void;
  setMarkets: (markets: Market[]) => void;
  setPositions: (positions: Position[]) => void;
  setCategory: (category: string) => void;
  toggleWallet: () => void;
  placeBet: (marketId: string, side: 'YES' | 'NO', amount: number, asset: CryptoTicker) => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    id: 'u1',
    username: 'KwameBet',
    balances: {
      BTC: 0.045,
      ETH: 1.2,
      SOL: 45.0,
      XLM: 5000,
      XRP: 250,
      BONK: 12000000
    }
  },
  markets: MOCK_MARKETS,
  positions: [],
  selectedCategory: 'All',
  isWalletOpen: false,
  setUser: (user) => set({ user }),
  setMarkets: (markets) => set({ markets }),
  setPositions: (positions) => set({ positions }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
  toggleWallet: () => set((state) => ({ isWalletOpen: !state.isWalletOpen })),
  placeBet: (marketId, side, amount, asset) => {
    set((state) => {
      if (!state.user) return state;
      
      const currentBalance = state.user.balances[asset];
      if (currentBalance < amount) {
        alert("Insufficient balance!");
        return state;
      }

      const newPosition: Position = {
        id: Math.random().toString(36).substr(2, 9),
        marketId,
        side,
        amount,
        entryPrice: side === 'YES' ? 0.5 : 0.5, // simplified
        timestamp: new Date().toISOString()
      };

      const updatedBalances = { ...state.user.balances, [asset]: currentBalance - amount };
      
      return {
        ...state,
        user: { ...state.user, balances: updatedBalances },
        positions: [newPosition, ...state.positions]
      };
    });
  }
}));

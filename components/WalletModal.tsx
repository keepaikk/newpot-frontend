
import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, History, Copy } from 'lucide-react';
import { useStore } from '../store';
import { SUPPORTED_CRYPTOS } from '../constants';

export const WalletModal: React.FC = () => {
  const { isWalletOpen, toggleWallet, user } = useStore();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [selectedCoin, setSelectedCoin] = useState(SUPPORTED_CRYPTOS[0]);

  if (!isWalletOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={toggleWallet}
      ></div>
      
      <div className="relative bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Wallet</h2>
          <button onClick={toggleWallet} className="text-slate-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {(['deposit', 'withdraw', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold capitalize transition-colors border-b-2 ${
                activeTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'deposit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_CRYPTOS.map((crypto) => (
                  <button
                    key={crypto.ticker}
                    onClick={() => setSelectedCoin(crypto)}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      selectedCoin.ticker === crypto.ticker 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-slate-800 bg-slate-800/50 grayscale opacity-60'
                    }`}
                  >
                    <div className="text-lg mb-1">{crypto.icon}</div>
                    <div className="text-[10px] font-bold">{crypto.ticker}</div>
                  </button>
                ))}
              </div>

              <div className="bg-white p-4 rounded-2xl flex items-center justify-center aspect-square max-w-[200px] mx-auto">
                {/* QR Mockup */}
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-900 border-2 border-slate-200">
                  <span className="font-mono text-xs text-center break-all p-4">
                    SOL_WALLET_ADDR_MOCK_XYZ_123_ABC
                  </span>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="truncate flex-1 mr-2 font-mono text-xs text-slate-400">
                  8H2xP...as89K1
                </div>
                <button className="text-indigo-400 hover:text-indigo-300">
                  <Copy size={18} />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                Only send {selectedCoin.name} ({selectedCoin.ticker}) to this address. 
                Minimum deposit: 0.001 {selectedCoin.ticker}
              </p>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Select Asset</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3">
                  {SUPPORTED_CRYPTOS.map(c => (
                    <option key={c.ticker} value={c.ticker}>{c.name} ({c.ticker})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Destination Address</label>
                <input type="text" placeholder="Enter recipient address" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount</label>
                <div className="relative">
                  <input type="number" placeholder="0.00" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pr-16" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-400">MAX</span>
                </div>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold mt-4 shadow-lg shadow-indigo-900/20">
                Confirm Withdrawal
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
                      <ArrowDownCircle size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Deposit</div>
                      <div className="text-[10px] text-slate-500">Oct 24, 2024 • 14:20</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">+10.5 SOL</div>
                    <div className="text-[10px] text-slate-500">Completed</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

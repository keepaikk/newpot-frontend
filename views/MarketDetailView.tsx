
import React, { useState, useEffect } from 'react';
import { Market, CryptoTicker } from '../types';
import { useStore } from '../store';
import { ArrowLeft, Share2, Info, Sparkles, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMarketAnalysis } from '../services/geminiService';
import { SUPPORTED_CRYPTOS } from '../constants';

interface MarketDetailViewProps {
  marketId: string;
  onBack: () => void;
}

export const MarketDetailView: React.FC<MarketDetailViewProps> = ({ marketId, onBack }) => {
  const { markets, placeBet, user } = useStore();
  const market = markets.find(m => m.id === marketId);
  const [selectedSide, setSelectedSide] = useState<'YES' | 'NO'>('YES');
  const [betAmount, setBetAmount] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<CryptoTicker>('SOL');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (market) {
      setLoadingAi(true);
      getMarketAnalysis(market.title, market.description).then(res => {
        setAiInsight(res);
        setLoadingAi(false);
      });
    }
  }, [market]);

  if (!market) return <div>Market not found</div>;

  const handleBet = () => {
    const amt = parseFloat(betAmount);
    if (isNaN(amt) || amt <= 0) return alert("Enter valid amount");
    placeBet(market.id, selectedSide, amt, selectedAsset);
    setBetAmount('');
  };

  const potentialPayout = betAmount ? (parseFloat(betAmount) / (selectedSide === 'YES' ? market.yesPrice : market.noPrice)).toFixed(2) : '0.00';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Markets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800">
            <img src={market.imageUrl} alt={market.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <h1 className="text-3xl font-black mb-2">{market.title}</h1>
               <div className="flex gap-4 text-sm text-slate-300">
                 <span className="flex items-center gap-1"><Info size={16}/> {market.category}</span>
                 <span>Ends {new Date(market.endDate).toLocaleDateString()}</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4">Odds History</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={market.oddsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} hide />
                  <YAxis domain={[0, 1]} stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="yes" stroke="#10b981" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="no" stroke="#f43f5e" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={120} className="text-indigo-500" />
            </div>
            <div className="flex items-center gap-2 mb-3 text-indigo-400 font-bold">
              <Sparkles size={18} />
              AI Insight
            </div>
            {loadingAi ? (
              <div className="flex gap-2">
                <div className="h-4 bg-indigo-500/20 rounded-full w-32 animate-pulse"></div>
                <div className="h-4 bg-indigo-500/20 rounded-full w-48 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                {aiInsight}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">About the Market</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {market.description} This market resolves based on official announcements. If the event is canceled, all bets will be refunded.
            </p>
          </div>
        </div>

        {/* Betting Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Trade</h3>
            
            <div className="flex p-1 bg-slate-800 rounded-2xl mb-6">
              <button 
                onClick={() => setSelectedSide('YES')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  selectedSide === 'YES' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400'
                }`}
              >
                YES {Math.round(market.yesPrice * 100)}¢
              </button>
              <button 
                onClick={() => setSelectedSide('NO')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  selectedSide === 'NO' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400'
                }`}
              >
                NO {Math.round(market.noPrice * 100)}¢
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end mb-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">You Send</label>
                <div className="text-[10px] text-slate-400">Bal: {user?.balances[selectedAsset].toFixed(4)}</div>
              </div>
              
              <div className="relative">
                <input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-2xl font-bold transition-all outline-none"
                />
                <select 
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value as CryptoTicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-700 text-xs font-bold px-3 py-2 rounded-xl outline-none"
                >
                  {SUPPORTED_CRYPTOS.map(c => <option key={c.ticker} value={c.ticker}>{c.ticker}</option>)}
                </select>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Potential Payout</span>
                  <span className="text-emerald-400 font-bold">{potentialPayout} {selectedAsset}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Odds</span>
                  <span className="text-slate-200">{selectedSide === 'YES' ? (1/market.yesPrice).toFixed(2) : (1/market.noPrice).toFixed(2)}x</span>
                </div>
              </div>

              <button 
                onClick={handleBet}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${
                  selectedSide === 'YES' 
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                  : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                }`}
              >
                Place {selectedSide} Bet
              </button>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[10px] text-amber-200/70">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                Crypto markets are volatile. Only bet what you can afford to lose.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

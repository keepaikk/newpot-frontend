
import React from 'react';
import { MarketCard } from '../components/MarketCard';
import { useStore } from '../store';
import { Flame, Trophy, Globe, Zap } from 'lucide-react';

interface HomeViewProps {
  onMarketSelect: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onMarketSelect }) => {
  const { markets, selectedCategory, setCategory } = useStore();

  const categories = [
    { name: 'All', icon: <Globe size={18} /> },
    { name: 'Politics', icon: <Trophy size={18} /> },
    { name: 'Sports', icon: <Zap size={18} /> },
    { name: 'Crypto', icon: <Flame size={18} /> },
  ];

  const filteredMarkets = selectedCategory === 'All' 
    ? markets 
    : markets.filter(m => m.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Hero / Featured */}
      <section className="relative h-64 sm:h-80 rounded-[2rem] overflow-hidden bg-indigo-900 flex items-center px-8 border border-indigo-500/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/africa/1200/600" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Trending Market
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            Predict Africa's <br/>Future Events.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Trade on the outcome of Ghana's biggest news with your favorite cryptocurrencies.
          </p>
          <button className="bg-white text-slate-950 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors">
            Start Trading
          </button>
        </div>
      </section>

      {/* Category Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.name
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMarkets.map((market) => (
          <MarketCard 
            key={market.id} 
            market={market} 
            onClick={onMarketSelect} 
          />
        ))}
      </div>
    </div>
  );
};

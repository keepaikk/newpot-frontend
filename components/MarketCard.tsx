
import React from 'react';
import { Market } from '../types';
import { TrendingUp, Users, Clock } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onClick: (id: string) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onClick }) => {
  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = 100 - yesPercent;

  return (
    <div 
      onClick={() => onClick(market.id)}
      className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all cursor-pointer group active:scale-[0.98]"
    >
      <div className="relative h-32 w-full">
        <img src={market.imageUrl} alt={market.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-indigo-400">
          {market.category}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-slate-100 line-clamp-2 min-h-[3rem]">
          {market.title}
        </h3>
        
        <div className="flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>${(market.volume / 1000).toFixed(1)}k Vol</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>2d left</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
            <div className="text-[10px] text-emerald-500 font-bold uppercase">Yes</div>
            <div className="text-lg font-bold text-emerald-400">{yesPercent}¢</div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 text-center">
            <div className="text-[10px] text-rose-500 font-bold uppercase">No</div>
            <div className="text-lg font-bold text-rose-400">{noPercent}¢</div>
          </div>
        </div>
      </div>
    </div>
  );
};

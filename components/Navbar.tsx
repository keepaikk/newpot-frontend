
import React from 'react';
import { Wallet, Search, Bell, User } from 'lucide-react';
import { useStore } from '../store';

export const Navbar: React.FC = () => {
  const { user, toggleWallet } = useStore();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white italic">NB</div>
          <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
            [Nn]ewpot
          </span>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search markets..." 
              className="w-full bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleWallet}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors"
          >
            <Wallet size={18} />
            <span className="text-sm font-bold hidden sm:inline">
              ${user?.balances.SOL.toFixed(1)} SOL
            </span>
          </button>
          
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 cursor-pointer hover:text-white">
            <Bell size={20} />
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden cursor-pointer border-2 border-slate-700">
            <img src="https://picsum.photos/seed/user1/100" alt="avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};

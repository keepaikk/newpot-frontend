
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { HomeView } from './views/HomeView';
import { MarketDetailView } from './views/MarketDetailView';
import { LayoutGrid, PieChart, History, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [currentMarketId, setCurrentMarketId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'portfolio' | 'history'>('home');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 sm:pb-0">
      <Navbar />
      
      <main className="min-h-[calc(100vh-64px)]">
        {currentMarketId ? (
          <MarketDetailView 
            marketId={currentMarketId} 
            onBack={() => setCurrentMarketId(null)} 
          />
        ) : (
          <HomeView onMarketSelect={(id) => setCurrentMarketId(id)} />
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center py-4 px-6 sm:hidden z-40">
        <button 
          onClick={() => {setCurrentTab('home'); setCurrentMarketId(null);}}
          className={`flex flex-col items-center gap-1 ${currentTab === 'home' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <LayoutGrid size={24} />
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button 
          onClick={() => setCurrentTab('portfolio')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'portfolio' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <PieChart size={24} />
          <span className="text-[10px] font-bold">Portfolio</span>
        </button>
        <button 
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'history' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <History size={24} />
          <span className="text-[10px] font-bold">History</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-slate-500"
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

      <WalletModal />
    </div>
  );
};

export default App;

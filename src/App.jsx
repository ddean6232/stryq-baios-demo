import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './pages/CommandCenter';
import LeadReactivation from './pages/LeadReactivation';
import FieldOps from './pages/FieldOps';
import Financials from './pages/Financials';
import Reporting from './pages/Reporting';
import { useLiveOps } from './context/LiveOpsStore';
import { Menu, Activity } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('command');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { initFetch, pulse, cycleInsights } = useLiveOps();

  useEffect(() => {
    initFetch();
    
    // Live Pulse Engine (Every 3s)
    const interval = setInterval(() => {
      pulse();
    }, 3000); 

    // Insight Cycling Engine (Every 5 mins = 300,000ms)
    const insightInterval = setInterval(() => {
      cycleInsights();
    }, 300000);
    
    return () => {
      clearInterval(interval);
      clearInterval(insightInterval);
    };
  }, [initFetch, pulse, cycleInsights]);

  const renderPage = () => {
    switch (currentPage) {
      case 'command': return <CommandCenter />;
      case 'leads': return <LeadReactivation />;
      case 'field': return <FieldOps />;
      case 'financials': return <Financials />;
      case 'reporting': return <Reporting />;
      default: return <CommandCenter />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stryq-base overflow-hidden text-white font-sans selection:bg-stryq-blue selection:text-white">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-stryq-surface p-4 border-b border-stryq-border z-20 relative">
        <h1 className="text-xl font-bold text-white flex items-center tracking-tight">
          STRYQ <Activity className="ml-2 text-stryq-blue animate-pulse" size={18} />
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={(page) => {
            setCurrentPage(page);
            setIsSidebarOpen(false); // Auto-close on mobile tap
          }} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto bg-stryq-base p-4 lg:p-8 relative w-full">
          {/* Subtle grid background to enhance industrial feel */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}></div>
          
          <div className="relative z-10 max-w-[1600px] mx-auto pb-8 lg:pb-0">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Persistent Footer */}
      <footer className="h-8 shrink-0 bg-stryq-surface border-t border-stryq-border flex items-center justify-center text-[10px] text-gray-500 uppercase tracking-widest font-mono z-20">
        STRYQ Systems
      </footer>
    </div>
  );
}

export default App;
import React from 'react';
import { LayoutDashboard, Users, Wrench, DollarSign, Activity, X } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'leads', label: 'Growth & Leads', icon: Users },
    { id: 'field', label: 'Field Ops', icon: Wrench },
    { id: 'financials', label: 'Financial Health', icon: DollarSign },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 transform 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:relative lg:translate-x-0 transition duration-300 ease-in-out 
      z-40 w-64 bg-stryq-base h-full flex flex-col border-r border-stryq-border
    `}>
      <div className="p-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            STRYQ
            <Activity className="ml-2 text-stryq-blue animate-pulse" size={24} />
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em] font-mono">BAIOS System // Live</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden text-gray-400 hover:text-white p-1"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                ? 'bg-stryq-surface border border-stryq-blue/50 text-white shadow-[0_0_15px_rgba(40,140,250,0.1)]' 
                : 'border border-transparent text-gray-400 hover:bg-stryq-surface/50 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? "text-stryq-blue" : ""} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 text-xs text-gray-600 font-mono shrink-0">
        v2.4.0-US-CAN
      </div>
    </div>
  );
}
import React from 'react';
import WidgetContainer from '../components/WidgetContainer';
import { Activity, Zap, TrendingUp, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveOps } from '../context/LiveOpsStore';

export default function CommandCenter() {
  const { metrics, feed, chartData, tickCount } = useLiveOps();

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      
      {/* Widget A1: Revenue Velocity */}
      <WidgetContainer 
        title="Revenue Velocity" 
        icon={Activity} 
        insight="Today's velocity is outpacing trailing 7-day average by 18%."
        trigger={metrics.revenue}
        className="col-span-12 lg:col-span-4"
      >
        <div className="h-full flex flex-col justify-center">
          <p className="text-gray-400 text-sm mb-2">Live Daily Earnings</p>
          <p className="text-4xl lg:text-5xl font-mono font-bold text-white tracking-tight">
            ${metrics.revenue.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-stryq-blue bg-stryq-blue/10 px-2 py-1 rounded font-medium">+12% vs Target</span>
          </div>
        </div>
      </WidgetContainer>

      {/* Widget A2: STRYQ Efficiency Score */}
      <WidgetContainer 
        title="Efficiency Score" 
        icon={Zap} 
        insight="Automation handles 84% of tier-1 triage."
        trigger={metrics.efficiency}
        className="col-span-12 lg:col-span-4"
      >
        <div className="h-full flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
            <circle cx="50" cy="50" r="40" stroke="#1E2530" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#288CFA" strokeWidth="8" fill="none" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * metrics.efficiency) / 100} 
                    className="transition-all duration-500 ease-out" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold font-mono text-white">{metrics.efficiency.toFixed(1)}%</span>
            <span className="text-[10px] uppercase text-gray-500 tracking-widest mt-1">AI vs Manual</span>
          </div>
        </div>
      </WidgetContainer>

      {/* Widget A4: Live System Feed (Moved here for better grid fitting if needed, or A3 below) */}
      <WidgetContainer 
        title="Live System Feed" 
        icon={Terminal} 
        insight="Voice Assist handled 4 inbound queries in the last minute."
        trigger={feed[0]}
        className="col-span-12 lg:col-span-4"
      >
        <div className="space-y-2 h-[200px] overflow-hidden">
          {feed.map((f, i) => (
            <div key={i} className="bg-stryq-base border border-stryq-border p-3 rounded-lg flex items-start space-x-3 text-sm animate-slide-in">
              <div className="mt-1">
                <span className="w-2 h-2 rounded-full bg-stryq-blue inline-block"></span>
              </div>
              <p className="text-gray-300 font-mono text-xs">{f}</p>
            </div>
          ))}
        </div>
      </WidgetContainer>

      {/* Widget A3: Revenue Composition */}
      <WidgetContainer 
        title="Revenue Composition" 
        icon={TrendingUp} 
        insight="AI-Generated revenue share is increasing steadily."
        trigger={tickCount}
        className="col-span-12 h-72 lg:h-96"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.composition} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#288CFA" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#288CFA" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B1E3F" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B1E3F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" vertical={false} />
            <XAxis dataKey="time" stroke="#4B5563" tick={{fontSize: 12, fill: '#6B7280'}} />
            <YAxis stroke="#4B5563" tick={{fontSize: 12, fill: '#6B7280'}} tickFormatter={(v) => `$${v}`} />
            <Tooltip contentStyle={{ backgroundColor: '#0F1218', borderColor: '#1E2530' }} itemStyle={{ fontFamily: 'JetBrains Mono' }}/>
            <Area type="monotone" dataKey="organic" stroke="#8B1E3F" fillOpacity={1} fill="url(#colorOrg)" name="Organic" />
            <Area type="monotone" dataKey="ai" stroke="#288CFA" fillOpacity={1} fill="url(#colorAi)" name="STRYQ AI-Generated" />
          </AreaChart>
        </ResponsiveContainer>
      </WidgetContainer>

    </div>
  );
}
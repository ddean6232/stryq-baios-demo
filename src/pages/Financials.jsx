import React from 'react';
import WidgetContainer from '../components/WidgetContainer';
import { DollarSign, TrendingUp, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveOps } from '../context/LiveOpsStore';

export default function Financials() {
  const { metrics, chartData, tickCount } = useLiveOps();

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      
      {/* Widget D1: Labor Recovery Rate */}
      <WidgetContainer 
        title="Labor Recovery Rate" 
        icon={DollarSign} 
        insight="Billable efficiency is rising against non-billable overhead."
        trigger={metrics.laborRecovery}
        className="col-span-12 lg:col-span-4"
      >
        <div className="h-full flex flex-col justify-center">
          <p className="text-4xl lg:text-5xl font-mono font-bold text-white tracking-tight">
            {metrics.laborRecovery.toFixed(1)}%
          </p>
          <div className="w-full bg-stryq-base rounded-full h-2 mt-4 border border-stryq-border overflow-hidden">
            <div className="bg-stryq-blue h-full transition-all duration-500" style={{width: `${metrics.laborRecovery}%`}}></div>
          </div>
        </div>
      </WidgetContainer>

      {/* Widget D3: Predictive Forecast */}
      <WidgetContainer 
        title="30-Day Predictive Forecast" 
        icon={TrendingUp} 
        insight="Based on AI reactivation velocity."
        trigger={metrics.forecast}
        status="predictive"
        className="col-span-12 lg:col-span-4 lg:col-start-9"
      >
        <div className="h-full flex flex-col justify-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Target EOM</p>
          <p className="text-3xl lg:text-4xl font-mono font-bold text-stryq-blue tracking-tight">
            ${metrics.forecast.toLocaleString()}
          </p>
        </div>
      </WidgetContainer>

      {/* Widget D2: The Profit Wedge */}
      <WidgetContainer 
        title="The Profit Wedge" 
        icon={LineChartIcon} 
        insight="Declining overhead (Red) vs. climbing revenue (Blue)."
        trigger={tickCount}
        className="col-span-12 h-[300px] lg:h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.profitWedge} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" vertical={false} />
            <XAxis dataKey="day" stroke="#4B5563" tick={{fontSize: 12}} />
            <YAxis stroke="#4B5563" tick={{fontSize: 12}} tickFormatter={(v) => `$${v}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F1218', borderColor: '#1E2530' }} 
              itemStyle={{ fontFamily: 'JetBrains Mono' }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#288CFA" strokeWidth={3} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="overhead" stroke="#8B1E3F" strokeWidth={3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </WidgetContainer>

    </div>
  );
}
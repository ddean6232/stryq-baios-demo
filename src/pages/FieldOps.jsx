import React from 'react';
import WidgetContainer from '../components/WidgetContainer';
import { Map, Truck, Navigation, CheckCircle, Clock } from 'lucide-react';
import { useLiveOps } from '../context/LiveOpsStore';

export default function FieldOps() {
  const { technicians, tickCount } = useLiveOps();

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      
      {/* Widget C1: Live Service Map */}
      <WidgetContainer 
        title="Live Service Map" 
        icon={Map} 
        insight="4 Active Units routing efficiently."
        trigger={tickCount}
        className="col-span-12 lg:col-span-8 h-[400px] lg:h-[600px]"
      >
        <div className="relative w-full h-full bg-stryq-base rounded-lg border border-stryq-border overflow-hidden">
          {/* Simulated Roadway SVG Map */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid background representing city blocks */}
            <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1E2530" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Simulated main arteries */}
            <path d="M0,50 L100,50 M50,0 L50,100 M0,20 L100,20 M80,0 L80,100" fill="none" stroke="#1E2530" strokeWidth="1.5" />
            
            {/* Active Route 1 (Dave W.) */}
            <polyline points="10,10 50,10 50,40 80,40" fill="none" stroke="#288CFA" strokeWidth="1.5" strokeOpacity="0.3" strokeLinejoin="round" />
            {/* Active Route 2 (Alex C.) */}
            <polyline points="80,20 80,60 60,60 60,90" fill="none" stroke="#288CFA" strokeWidth="1.5" strokeOpacity="0.3" strokeLinejoin="round" />
          </svg>
          
          {/* Technicians */}
          {technicians.map(tech => {
            const isDriving = tech.status === 'Driving';
            const colorClass = isDriving ? 'bg-stryq-blue' : 'bg-green-500';

            return (
              <div 
                key={tech.id} 
                className="absolute transition-all duration-[3000ms] ease-linear"
                style={{ top: `${tech.lat}%`, left: `${tech.lng}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="relative group">
                  <div className={`w-3 h-3 rounded-full ${colorClass} z-10 relative`}></div>
                  {isDriving && (
                    <div className={`absolute inset-0 rounded-full ${colorClass} animate-ping opacity-75`}></div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-max bg-stryq-surface border border-stryq-border p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <p className="text-xs font-bold text-white">{tech.name}</p>
                    <p className="text-[10px] text-gray-400">{tech.job}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-4 right-4 bg-stryq-surface border border-stryq-border p-3 rounded-lg flex items-center space-x-4 shadow-lg">
             <div className="flex items-center text-xs"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>On-site</div>
             <div className="flex items-center text-xs"><div className="w-2 h-2 bg-stryq-blue rounded-full mr-2 animate-pulse"></div>Driving</div>
          </div>
        </div>
      </WidgetContainer>

      {/* Side Column: Tech Status */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Widget C2 & C3: Technician Status & Badge */}
        <WidgetContainer 
          title="Technician Status" 
          icon={Truck} 
          trigger={tickCount}
          className="flex-1"
        >
          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
            {technicians.map(tech => (
              <div key={tech.id} className="bg-stryq-base border border-stryq-border p-4 rounded-lg flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold">{tech.name}</h4>
                  {tech.optimized && (
                    <span className="flex items-center bg-stryq-blue/10 border border-stryq-blue/30 text-stryq-blue text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                      <CheckCircle size={10} className="mr-1" /> STRYQ-Optimized
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase">Status</span>
                    <p className={`text-sm font-medium ${tech.status === 'On-site' ? 'text-green-500' : 'text-stryq-blue'} flex items-center`}>
                      {tech.status === 'On-site' ? <Map size={14} className="mr-1" /> : <Navigation size={14} className="mr-1" />}
                      {tech.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase">Current Job</span>
                    <p className="text-sm text-gray-300 truncate" title={tech.job}>{tech.job}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stryq-border/50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">FTFR</span>
                  <span className="text-sm font-mono text-green-400">{tech.ftfr}%</span>
                </div>
              </div>
            ))}
          </div>
        </WidgetContainer>

      </div>
    </div>
  );
}
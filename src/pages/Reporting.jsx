import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetContainer from '../components/WidgetContainer';
import { BrainCircuit, AlertTriangle, TrendingUp, ChevronDown, Wrench, DollarSign } from 'lucide-react';
import { useLiveOps } from '../context/LiveOpsStore';

const DrillDownCard = ({ item, isOpportunity }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-stryq-base border border-stryq-border rounded-lg overflow-hidden transition-colors hover:border-stryq-border/80">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOpportunity ? 'bg-stryq-blue/10 text-stryq-blue' : 'bg-stryq-red/10 text-stryq-red'}`}>
            {isOpportunity ? <TrendingUp size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <h4 className="text-white font-bold text-sm flex items-center">
              {item.title}
              <span className="ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-stryq-surface border border-stryq-border text-gray-400">
                {item.type}
              </span>
            </h4>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {isOpportunity ? `Exp. Value: ${item.impact} | Prob: ${item.probability}` : `Leakage: ${item.impact} | Sev: ${item.severity.toUpperCase()}`}
            </p>
          </div>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-gray-500 group-hover:text-white" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-stryq-border/50 bg-stryq-surface/30">
              <ul className="space-y-3 mt-4">
                {item.details.map((detail, idx) => {
                  const isAction = detail.startsWith('Suggested Action:');
                  return (
                    <li key={idx} className={`flex items-start text-sm ${isAction ? 'mt-4 pt-4 border-t border-stryq-border' : ''}`}>
                      <span className="mr-3 mt-0.5">
                        {isAction ? (
                          <BrainCircuit size={16} className="text-stryq-blue animate-pulse" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block"></span>
                        )}
                      </span>
                      <span className={isAction ? 'text-stryq-blue font-medium' : 'text-gray-300 leading-relaxed'}>
                        {isAction ? detail.replace('Suggested Action:', '').trim() : detail}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {/* Fake Action Button */}
              <div className="mt-5 flex justify-end">
                <button className="bg-stryq-blue/10 hover:bg-stryq-blue text-stryq-blue hover:text-white border border-stryq-blue/30 transition-colors text-xs uppercase tracking-widest font-bold px-4 py-2 rounded">
                  Execute AI Protocol
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Reporting() {
  const { insights, tickCount } = useLiveOps();

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      
      {/* Widget E1: Bottlenecks */}
      <WidgetContainer 
        title="Optimization Bottlenecks" 
        icon={Wrench} 
        insight="AI identified 2 active friction points in field routing and labor allocation."
        trigger={tickCount}
        className="col-span-12 lg:col-span-6 h-auto min-h-[500px]"
      >
        <div className="flex flex-col space-y-4">
          <p className="text-gray-400 text-sm mb-2">Systems currently leaking time or capital, prioritized by severity.</p>
          {insights.bottlenecks.map(item => (
            <DrillDownCard key={item.id} item={item} isOpportunity={false} />
          ))}
        </div>
      </WidgetContainer>

      {/* Widget E2: Revenue Opportunities */}
      <WidgetContainer 
        title="Revenue Expansion Vectors" 
        icon={DollarSign} 
        insight="Predictive models indicate $16.5k in accessible pipeline."
        trigger={tickCount}
        className="col-span-12 lg:col-span-6 h-auto min-h-[500px]"
      >
        <div className="flex flex-col space-y-4">
          <p className="text-gray-400 text-sm mb-2">AI-identified high-probability scenarios to capture un-booked revenue.</p>
          {insights.opportunities.map(item => (
            <DrillDownCard key={item.id} item={item} isOpportunity={true} />
          ))}
        </div>
      </WidgetContainer>

    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WidgetContainer({ title, icon: Icon, insight, trigger, status = 'live', children, className = "" }) {
  const [glow, setGlow] = useState(false);

  // Trigger the glow effect whenever the 'trigger' prop changes
  useEffect(() => {
    if (trigger !== undefined) {
      setGlow(true);
      const timer = setTimeout(() => setGlow(false), 400);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  // Determine status dot color
  let statusColor = "bg-green-500 shadow-[0_0_8px_#22c55e]";
  if (status === 'predictive') {
    statusColor = "bg-yellow-400 shadow-[0_0_8px_#facc15]";
  } else if (status === 'offline') {
    statusColor = "bg-stryq-red shadow-[0_0_8px_#8B1E3F]";
  }

  return (
    <motion.div
      animate={{ 
        borderColor: glow ? '#288CFA' : '#1E2530',
        boxShadow: glow ? '0 0 15px rgba(40, 140, 250, 0.2)' : '0 0 0px rgba(0,0,0,0)'
      }}
      transition={{ duration: 0.3 }}
      className={`bg-stryq-surface border-2 rounded-xl flex flex-col overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 border-b border-stryq-border flex justify-between items-center bg-gradient-to-r from-stryq-base to-stryq-surface">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="text-gray-400" size={16} />}
          <h3 className="text-white text-sm font-semibold tracking-wide uppercase">{title}</h3>
        </div>
        <div className={`w-2 h-2 rounded-full animate-pulse ${statusColor}`}></div>
      </div>
      
      <div className="flex-1 p-4 relative">
        {children}
      </div>

      {insight && (
        <div className="px-4 py-2.5 bg-stryq-base border-t border-stryq-border text-xs text-gray-400 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-stryq-blue mr-2 opacity-80"></span>
          <span className="text-stryq-blue font-semibold mr-1">AI Insight:</span>
          <span className="truncate">{insight}</span>
        </div>
      )}
    </motion.div>
  );
}
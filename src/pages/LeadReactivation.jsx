import React, { useState, useEffect, useRef } from 'react';
import WidgetContainer from '../components/WidgetContainer';
import { Filter, DollarSign, Mic, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLiveOps } from '../context/LiveOpsStore';

export default function LeadReactivation() {
  const { pipeline, metrics, activeCall, tickCount } = useLiveOps();
  
  const [transcript, setTranscript] = useState([]);
  const [callStatus, setCallStatus] = useState('idle');
  const transcriptRef = useRef(null);
  const simulatingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (activeCall && !simulatingRef.current) {
      simulatingRef.current = true;
      setCallStatus('live');
      setTranscript([]);
      
      const lines = [
        { s: 'AI Assist', t: 'Hi, this is STRYQ AI calling for Lockwood Home Services. Is this the homeowner?' },
        { s: 'Caller', t: 'Yes, speaking.' },
        { s: 'AI Assist', t: 'Great. I noticed an older service request. Are you still experiencing issues?' },
        { s: 'Caller', t: 'Actually yes, the system is making that noise again.' },
        { s: 'AI Assist', t: 'I can deploy a technician tomorrow afternoon. Does 2 PM work?' },
        { s: 'Caller', t: 'That works perfectly.' },
        { s: 'AI Assist', t: 'Fantastic. Your appointment is locked in. Have a great day!' }
      ];

      let step = 0;
      timerRef.current = setInterval(() => {
        if (step < lines.length) {
          setTranscript(prev => [...prev, lines[step]]);
          step++;
        } else {
          clearInterval(timerRef.current);
          setTimeout(() => {
            setCallStatus('idle');
            setTranscript([]);
            simulatingRef.current = false;
          }, 3000);
        }
      }, 1500);
    }
  }, [activeCall]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      
      {/* Widget B1: Reactivation Pipeline */}
      <WidgetContainer 
        title="Reactivation Pipeline" 
        icon={Filter} 
        insight="350 leads transitioned from Dormant to Outreach in the last hour."
        trigger={tickCount}
        className="col-span-12 lg:col-span-8 h-80 lg:h-auto lg:min-h-[500px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pipeline} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" horizontal={false} />
            <XAxis type="number" stroke="#4B5563" tick={{fontSize: 12}} />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" tick={{fontSize: 14}} />
            <Tooltip 
              cursor={{ fill: '#1E2530', opacity: 0.5 }}
              contentStyle={{ backgroundColor: '#05070A', border: '1px solid #1E2530' }}
            />
            <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {pipeline.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </WidgetContainer>

      {/* Side Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Widget B2: Recovered Revenue */}
        <WidgetContainer 
          title="Recovered Revenue" 
          icon={DollarSign} 
          insight="Dead-lead value brought back to pipeline."
          trigger={metrics.recoveredRevenue}
        >
          <div className="h-full flex flex-col justify-center py-4">
            <p className="text-3xl lg:text-4xl font-mono font-bold text-stryq-blue tracking-tight">
              ${metrics.recoveredRevenue.toLocaleString()}
            </p>
          </div>
        </WidgetContainer>

        {/* Widget B3: AI Voice Assist Waveform & Transcript */}
        <WidgetContainer 
          title="Voice Assist Engine" 
          icon={Mic} 
          trigger={callStatus === 'live' ? tickCount : undefined}
        >
          <div className="flex flex-col space-y-3">
            <div className="h-[60px] bg-stryq-base rounded-lg border border-stryq-border flex items-center justify-center space-x-1 p-2 relative shrink-0">
              {callStatus === 'live' && (
                <span className="absolute top-2 left-2 flex items-center text-[10px] text-stryq-blue uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-stryq-blue rounded-full mr-1 animate-ping"></span> Live Call
                </span>
              )}
              {callStatus !== 'live' && <p className="text-gray-500 font-mono text-xs">Listening for inbound...</p>}
              {callStatus === 'live' && Array.from({length: 30}).map((_, i) => (
                <div 
                  key={i} 
                  className="w-1.5 bg-stryq-blue rounded-full waveform-bar" 
                  style={{ animationDelay: `${Math.random() * 0.5}s` }}
                ></div>
              ))}
            </div>

            <div 
              ref={transcriptRef}
              className="h-[140px] bg-stryq-base rounded-lg border border-stryq-border p-3 overflow-y-auto scrollbar-hide text-[11px] font-mono space-y-2"
            >
              {callStatus !== 'live' && transcript.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-600">
                  Awaiting STT connection...
                </div>
              )}
              {transcript.map((line, i) => (
                <div key={i} className="animate-fade-in leading-relaxed">
                  <span className={line.s === 'AI Assist' ? 'text-stryq-blue font-bold' : 'text-gray-400 font-bold'}>
                    {line.s}: 
                  </span>
                  <span className="text-gray-300 ml-1">{line.t}</span>
                </div>
              ))}
            </div>
          </div>
        </WidgetContainer>

        {/* Widget B4: Speed to Lead */}
        <WidgetContainer 
          title="Speed to Lead" 
          icon={Clock} 
          trigger={metrics.speedToLead}
        >
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-3xl font-mono font-bold text-white">{metrics.speedToLead.toFixed(1)}s</p>
              <p className="text-xs text-gray-500 uppercase mt-1">Average Response</p>
            </div>
            <div className="text-right">
              <span className="text-stryq-blue font-bold text-sm">Target: &lt;10s</span>
            </div>
          </div>
        </WidgetContainer>

      </div>
    </div>
  );
}
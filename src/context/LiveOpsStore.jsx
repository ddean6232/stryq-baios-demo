import { create } from 'zustand';

// Generate some static initial chart data to prevent empty states
const generateInitialComposition = () => Array.from({length: 10}).map((_, i) => ({
  time: `T-${10-i}`,
  organic: 1000 + Math.random() * 500,
  ai: 200 + Math.random() * 800
}));

const generateInitialWedge = () => Array.from({length: 10}).map((_, i) => ({
  day: `D-${10-i}`,
  overhead: 5000 - (i * 100),
  revenue: 4000 + (i * 200)
}));

export const useLiveOps = create((set, get) => ({
  names: ['John Doe', 'Jane Smith', 'Alice Cooper', 'Bob Miller', 'Charlie Davis'], // Fallback
  metrics: {
    revenue: 145020,
    efficiency: 84.5,
    speedToLead: 12.2, // seconds
    recoveredRevenue: 34500,
    laborRecovery: 78.4,
    forecast: 215000,
  },
  feed: [
    "System initiated.",
    "Awaiting AI operations..."
  ],
  chartData: {
    composition: generateInitialComposition(),
    profitWedge: generateInitialWedge()
  },
  pipeline: [
    { name: 'Dormant', value: 2500, fill: '#1E2530' },
    { name: 'Outreach', value: 1200, fill: '#8B1E3F' },
    { name: 'Intent', value: 400, fill: '#4B5563' },
    { name: 'Booked', value: 150, fill: '#288CFA' },
  ],
  technicians: [
    { id: 1, name: 'Mike T.', status: 'On-site', job: 'HVAC Repair', ftfr: 92, optimized: true, lat: 25, lng: 30, path: [] },
    { id: 2, name: 'Dave W.', status: 'Driving', job: 'Plumbing Leak', ftfr: 88, optimized: true, lat: 10, lng: 10, path: [[10,10], [50,10], [50,40], [80,40]], pathIdx: 1 },
    { id: 3, name: 'Alex C.', status: 'Driving', job: 'Electrical Panel', ftfr: 95, optimized: true, lat: 20, lng: 80, path: [[20,80], [60,80], [60,60], [90,60]], pathIdx: 1 },
    { id: 4, name: 'Chris P.', status: 'On-site', job: 'Water Heater', ftfr: 75, optimized: false, lat: 40, lng: 80, path: [] },
  ],
  activeCall: false,
  tickCount: 0,

  initFetch: async () => {
    try {
      const res = await fetch('https://randomuser.me/api/?nat=us,ca&results=50');
      const data = await res.json();
      const names = data.results.map(r => `${r.name.first} ${r.name.last}`);
      set({ names });
    } catch (e) {
      console.error("API Name fetch failed. Using fallbacks.", e);
    }
  },

  pulse: () => {
    const state = get();
    const randName = state.names[Math.floor(Math.random() * state.names.length)];
    const isEvent = Math.random() > 0.3; // 70% chance of action each pulse
    
    set((prev) => {
      let activeCall = false;
      let newMetrics = { ...prev.metrics };
      let newFeed = [...prev.feed];
      let newPipeline = JSON.parse(JSON.stringify(prev.pipeline));
      let newTechs = JSON.parse(JSON.stringify(prev.technicians));

      if (isEvent) {
        const amount = Math.floor(Math.random() * 800) + 200;
        activeCall = Math.random() > 0.5;

        newMetrics.revenue += amount;
        newMetrics.recoveredRevenue += Math.floor(amount * 0.4);
        newMetrics.efficiency = Math.min(99.9, newMetrics.efficiency + Math.random() * 0.5);
        newMetrics.speedToLead = Math.max(2.1, newMetrics.speedToLead - (Math.random() * 0.2));
        newMetrics.laborRecovery = Math.min(98, newMetrics.laborRecovery + (Math.random() * 0.3));
        newMetrics.forecast += amount * 1.5;

        newFeed = [`AI Agent activated lead ${randName} -> Booked for $${amount}`, ...prev.feed].slice(0, 10);

        newPipeline[0].value -= 1; // Dormant
        newPipeline[1].value += 2; // Outreach
        newPipeline[2].value += 1; // Intent
        newPipeline[3].value += 1; // Booked

        // Move technicians along paths if Driving
        newTechs.forEach(t => {
          if (t.status === 'Driving' && t.path && t.path.length > 0) {
            const target = t.path[t.pathIdx];
            if (target) {
              const dy = target[0] - t.lat;
              const dx = target[1] - t.lng;
              const dist = Math.sqrt(dx*dx + dy*dy);
              const speed = 4; // units per pulse
              
              if (dist <= speed) {
                t.lat = target[0];
                t.lng = target[1];
                t.pathIdx++;
                if (t.pathIdx >= t.path.length) {
                  t.path.reverse();
                  t.pathIdx = 1; // loop back
                }
              } else {
                t.lat += (dy / dist) * speed;
                t.lng += (dx / dist) * speed;
              }
            }
          }
        });
      }

      // Always update charts to keep moving
      const tNow = new Date();
      const timeStr = tNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const lastWedge = prev.chartData.profitWedge[prev.chartData.profitWedge.length - 1];
      
      const newComposition = [...prev.chartData.composition.slice(1), {
        time: timeStr,
        organic: Math.floor(Math.random() * 500) + 1000,
        ai: Math.floor(Math.random() * 1000) + 800 + (isEvent ? 500 : 0)
      }];

      const newProfitWedge = [...prev.chartData.profitWedge.slice(1), {
        day: timeStr,
        overhead: Math.max(1000, lastWedge.overhead - (Math.random() * 20)),
        revenue: lastWedge.revenue + (isEvent ? 100 : 10)
      }];

      return {
        metrics: newMetrics,
        feed: newFeed,
        pipeline: newPipeline,
        activeCall,
        technicians: newTechs,
        tickCount: prev.tickCount + 1,
        chartData: {
          composition: newComposition,
          profitWedge: newProfitWedge
        }
      }
    });
  }
}));
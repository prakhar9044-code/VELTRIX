import { Prediction } from '../../services/api';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PredictionsCard({ prediction, mockData }: { prediction: Prediction, mockData: any[] }) {
  return (
    <div className="p-8 rounded-[2rem] glass-card h-full flex flex-col">
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-brand-accent/10 rounded-xl">
                <Target className="w-5 h-5 text-brand-accent" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest opacity-60">Forecast Intelligence</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
             prediction.risk === 'high' ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'
          }`}>
             {prediction.risk} Risk
          </div>
       </div>

       <div className="flex-1 mb-8">
          <div className="text-3xl font-display font-bold mb-2">₹{Math.round(prediction.forecast).toLocaleString()}</div>
          <p className="text-sm text-brand-ivory/40 leading-relaxed">{prediction.insight}</p>
       </div>

       <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={mockData}>
                <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <Area type="monotone" dataKey="amount" stroke="#C5A059" fillOpacity={1} fill="url(#colorValue)" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0F1115', border: 'none', borderRadius: '12px' }}
                   itemStyle={{ color: '#F5F5F3', fontSize: '12px' }}
                />
             </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
}

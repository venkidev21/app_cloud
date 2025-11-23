import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastChartProps {
  data: Array<{ time: string; temp_c: number }>;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full mt-6 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
      <h3 className="text-white/80 text-sm font-semibold mb-4 ml-2">Temperature Trend (Next 6 Hours)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${Math.round(value)}°`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fbbf24' }}
            formatter={(value: number) => [`${value}°C`, 'Temperature']}
          />
          <Area 
            type="monotone" 
            dataKey="temp_c" 
            stroke="#f59e0b" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTemp)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import EmptyState from './EmptyState';
import { Activity } from 'lucide-react';

export default function DistressChart({ data = [], height = 260 }) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No distress history"
        description="Distress history will appear after check-in data is recorded."
        icon={Activity}
      />
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded shadow text-xs space-y-1 border border-slate-700">
          <p className="font-semibold text-slate-300">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Distress Score:</span>
            <span className={`font-mono font-bold ${
              item.score >= 71 ? 'text-rose-400' : item.score >= 41 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {item.score} / 100
            </span>
          </div>
          {item.category && (
            <p className="text-[11px] text-slate-400">
              Category: <span className="text-slate-200 font-medium">{item.category}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white p-4 rounded-md border border-slate-200">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-3 px-1">
        <span className="font-semibold text-slate-800">Distress Score Trend (0 - 100)</span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-600"></span> Stable (&lt;41)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-amber-600"></span> Attention (41-70)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-rose-600"></span> Urgent (71+)
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 41, 71, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine y={41} stroke="#d97706" strokeDasharray="3 3" />
            <ReferenceLine y={71} stroke="#dc2626" strokeDasharray="3 3" />
            
            <Line
              type="monotone"
              dataKey="score"
              stroke="#1e3a8a"
              strokeWidth={2}
              dot={{ r: 3.5, fill: '#1e3a8a', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#1e3a8a', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

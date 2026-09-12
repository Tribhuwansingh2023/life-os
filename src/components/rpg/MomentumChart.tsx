import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { ReplayDay } from '../../types';
import { TrendingUp, Activity, Zap } from 'lucide-react';

interface MomentumChartProps {
  replayDays?: ReplayDay[];
  currentMomentum?: number;
  className?: string;
  compact?: boolean;
}

const DEFAULT_MOMENTUM_DATA = [
  { day: 'Mon', date: 'Sep 06', momentum: 82, xp: 1150 },
  { day: 'Tue', date: 'Sep 07', momentum: 84, xp: 980 },
  { day: 'Wed', date: 'Sep 08', momentum: 91, xp: 1420 },
  { day: 'Thu', date: 'Sep 09', momentum: 85, xp: 820 },
  { day: 'Fri', date: 'Sep 10', momentum: 94, xp: 1650 },
  { day: 'Sat', date: 'Sep 11', momentum: 89, xp: 1200 },
  { day: 'Sun', date: 'Today', momentum: 88, xp: 680 }
];

export const MomentumChart: React.FC<MomentumChartProps> = ({
  replayDays = [],
  currentMomentum = 88,
  className = '',
  compact = false
}) => {
  const chartData = replayDays.length > 0
    ? replayDays.map((d: ReplayDay) => ({
        day: d.dayName.split(' ')[0],
        date: d.dateStr,
        momentum: d.momentumScore,
        xp: d.xpEarned
      }))
    : DEFAULT_MOMENTUM_DATA;

  // Custom cybernetic obsidian tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#080d16] border border-cyan-500/40 p-2.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] font-mono text-xs z-50">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <Zap className="w-3 h-3" />
            <span>{data.day} ({data.date})</span>
          </div>
          <div className="space-y-0.5 text-[11px]">
            <div className="text-slate-200">
              Velocity: <span className="text-cyan-300 font-bold">{data.momentum}%</span>
            </div>
            <div className="text-slate-400">
              EXP Output: <span className="text-emerald-400 font-bold">+{data.xp} XP</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const avgMomentum = Math.round(
    chartData.reduce((acc, curr) => acc + curr.momentum, 0) / chartData.length
  );

  return (
    <div
      className={`bg-[#0c1017] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden flex flex-col justify-between ${className}`}
      id="momentum-trend-chart"
    >
      {/* Background ambient cyan glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              7-DAY MOMENTUM TRAJECTORY
            </h4>
            <span className="text-[9px] text-slate-400 font-mono">
              Velocity Vector // 7-Day Running Window
            </span>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[9px] text-slate-400 uppercase block">7D AVERAGE</span>
          <span className="text-xs font-bold text-cyan-300">{avgMomentum}%</span>
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="w-full h-32 sm:h-36 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 10, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id="momentumLineGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2} />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00f0ff" floodOpacity="0.6" />
              </filter>
            </defs>

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }}
              ticks={[60, 80, 100]}
            />
            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={75}
              stroke="rgba(0, 240, 255, 0.2)"
              strokeDasharray="3 3"
            />

            <Line
              type="monotone"
              dataKey="momentum"
              stroke="#00f0ff"
              strokeWidth={2.5}
              dot={{
                r: 3.5,
                fill: '#00f0ff',
                stroke: '#080d16',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#ffffff',
                stroke: '#00f0ff',
                strokeWidth: 2,
                filter: 'url(#neonGlow)'
              }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trajectory Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          +6% vs last cycle
        </span>
        <span className="text-cyan-400">Hyper-Drive threshold: 90%</span>
      </div>
    </div>
  );
};

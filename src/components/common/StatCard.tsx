// ============================================================================
// PROJECT AIRFRAME - COMMON STAT CARD COMPONENT
// ============================================================================

import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral' | 'positive' | 'negative';
  trendValue?: string;
  status?: 'normal' | 'success' | 'warning' | 'danger' | 'cyan';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  subtext,
  icon,
  trend,
  trendValue,
  status = 'normal',
  className = ''
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'border-emerald-500/30 text-emerald-400';
      case 'warning': return 'border-amber-500/30 text-amber-400';
      case 'danger': return 'border-rose-500/30 text-rose-400';
      case 'cyan': return 'border-sky-500/30 text-sky-400';
      default: return 'border-[#1e2d42] text-slate-100';
    }
  };

  const isPositive = trend === 'up' || trend === 'positive';
  const isNegative = trend === 'down' || trend === 'negative';
  const displaySubtext = subtext || subValue;

  return (
    <div className={`bg-[#0f1724] border border-[#1e2d42] rounded p-3 flex flex-col justify-between ${getStatusColor()} ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
        <span className="uppercase tracking-wider text-[10px] text-slate-400">{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between mt-0.5">
        <span className="text-xl font-bold font-mono tracking-tight text-white">{value}</span>
        {trendValue && (
          <span className={`text-[11px] font-mono font-semibold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`}>
            {isPositive ? '▲' : isNegative ? '▼' : '—'} {trendValue}
          </span>
        )}
      </div>
      {displaySubtext && (
        <span className="text-[11px] text-slate-400 mt-1 font-mono">{displaySubtext}</span>
      )}
    </div>
  );
};

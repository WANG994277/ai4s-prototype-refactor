'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CoreMetric } from '@/lib/mock/cockpit';

export function MetricCard({ metric }: { metric: CoreMetric }) {
  const isPositive = metric.changeType === 'up';
  const icons = LucideIcons as unknown as Record<string, React.ElementType>;
  const IconComponent = icons[metric.icon] || icons.LayoutDashboard;

  return (
    <div
      className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]"
      style={{ borderLeft: `3px solid ${metric.color}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted-foreground">{metric.label}</span>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: `${metric.color}15` }}
        >
          {React.createElement(IconComponent, { className: 'h-3.5 w-3.5', style: { color: metric.color } })}
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-xl font-black text-navy">{metric.value}</span>
      </div>
      {metric.change && (
        <div className="mt-1 flex items-center gap-1">
          {isPositive ? (
            <ArrowUp className="h-3 w-3 text-green-600" />
          ) : (
            <ArrowDown className="h-3 w-3 text-red-500" />
          )}
          <span
            className={cn(
              'text-[11px] font-bold',
              isPositive ? 'text-green-600' : 'text-red-500'
            )}
          >
            {metric.change}
          </span>
          <span className="text-[10px] text-muted-foreground">vs上月</span>
        </div>
      )}
    </div>
  );
}

export function MetricCardRow({ metrics }: { metrics: CoreMetric[] }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

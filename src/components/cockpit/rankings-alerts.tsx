'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Minus, AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RankItem, AlertItem } from '@/lib/mock/cockpit';

// ===== 排行榜 =====
export function RankingList({
  title,
  items,
  metricLabel,
  onItemClick,
  onViewAll,
}: {
  title: string;
  items: RankItem[];
  metricLabel: string;
  onItemClick?: (item: RankItem) => void;
  onViewAll?: () => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-navy">{title}</h4>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-0.5 text-[11px] font-medium text-primary transition-colors hover:text-primary/70"
          >
            查看全部
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.rank}
            type="button"
            onClick={() => onItemClick?.(item)}
            className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-2/50"
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-black',
                item.rank <= 3 ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-muted-foreground'
              )}
            >
              {item.rank}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[12px] font-medium text-foreground truncate block">{item.name}</span>
              {item.unit && <span className="text-[10px] text-muted-foreground">{item.unit}</span>}
              {item.extra && <span className="text-[10px] text-muted-foreground"> · {item.extra}</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-navy">{item.metric}</span>
              <span className="text-[10px] text-muted-foreground">{metricLabel}</span>
              {item.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-600" />}
              {item.trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
              {item.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== 告警列表 =====
const severityIcon = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityColor = {
  error: 'text-red-500',
  warning: 'text-amber',
  info: 'text-blue-500',
};

const severityBg = {
  error: 'bg-red-50',
  warning: 'bg-amber/5',
  info: 'bg-blue-50',
};

const severityBorder = {
  error: 'border-red-200',
  warning: 'border-amber/20',
  info: 'border-blue-200',
};

export function AlertList({
  title,
  icon: Icon,
  iconColor,
  items,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  items: AlertItem[];
}) {
  return (
    <div className={cn('rounded-lg border p-4', 'bg-white', 'border-line')}>
      <div className="mb-3 flex items-center gap-1.5">
        <Icon className={cn('h-4 w-4', iconColor)} />
        <h4 className={cn('text-sm font-bold', iconColor)}>{title}</h4>
        <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((alert) => {
          const SevIcon = severityIcon[alert.severity];
          const sevColor = severityColor[alert.severity];
          const sevBg = severityBg[alert.severity];
          const sevBorder = severityBorder[alert.severity];
          return (
            <div
              key={alert.id}
              className={cn('flex items-start gap-2 rounded-md border px-3 py-2', sevBg, sevBorder)}
            >
              <SevIcon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', sevColor)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-bold text-foreground">{alert.title}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{alert.description}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded bg-white px-2 py-0.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/5"
              >
                处理
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== 告警小卡片（算力资源用） =====
export function AlertSummaryCard({
  label,
  count,
  icon: Icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border p-3"
      style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
    >
      <Icon className="h-5 w-5" style={{ color }} />
      <div className="flex-1">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black" style={{ color }}>{count}</span>
          <span className="text-[10px] text-muted-foreground">个</span>
        </div>
      </div>
    </div>
  );
}

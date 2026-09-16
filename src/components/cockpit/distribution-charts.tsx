'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  ReferenceLine,
} from 'recharts';
import type { DistributionItem } from '@/lib/mock/cockpit';

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(16,38,79,0.08)',
};

const unitBarColors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

// ===== 水平柱状图（横向排行） =====
export function HorizontalBarChart({
  data,
  height = 260,
  labelFormatter,
  valueSuffix = '',
  colors,
}: {
  data: DistributionItem[];
  height?: number;
  labelFormatter?: (name: string) => string;
  valueSuffix?: string;
  colors?: string[];
}) {
  const sorted = [...data].sort((a, b) => a.value - b.value);
  const barColors = colors || unitBarColors;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(16,38,79,0.06)" />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: '#334155' }}
          axisLine={false}
          tickLine={false}
          width={90}
          tickFormatter={labelFormatter}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [`${value}${valueSuffix}`, '']}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
          {sorted.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ===== 带配额线的水平柱状图 =====
export function QuotaBarChart({
  data,
  height = 260,
  valueSuffix = '',
}: {
  data: { name: string; used: number; quota: number }[];
  height?: number;
  valueSuffix?: string;
}) {
  const sorted = [...data].sort((a, b) => a.used - b.used);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(16,38,79,0.06)" />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={90} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, _name: string, entry: { payload?: { used: number; quota: number; name: string } }) => {
            if (_name === 'used') {
              const pct = entry.payload ? ((entry.payload.used / entry.payload.quota) * 100).toFixed(1) : '0';
              return [`${value}${valueSuffix} (${pct}%)`, '已用'];
            }
            return [`${value}${valueSuffix}`, '配额'];
          }}
        />
        <ReferenceLine x={0} stroke="transparent" />
        {/* 配额线 */}
        {sorted.map((item) => (
          <ReferenceLine
            key={`quota-${item.name}`}
            segment={[{ y: item.name, x: item.quota }, { y: item.name, x: item.quota }]}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        ))}
        <Bar dataKey="used" radius={[0, 4, 4, 0]} barSize={18}>
          {sorted.map((item) => (
            <Cell key={`cell-${item.name}`} fill={item.used > item.quota ? '#ef4444' : '#2563eb'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ===== 饼图/环形图 =====
const pieColors = ['#2563eb', '#f59e0b', '#22c55e', '#a855f7', '#ef4444', '#06b6d4'];

export function PieDistributionChart({
  data,
  innerRadius = 0,
  centerLabel,
}: {
  data: DistributionItem[];
  innerRadius?: number;
  centerLabel?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number, _name: string, entry: { payload?: DistributionItem }) => {
                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return [`${value} (${pct}%)`, entry.payload?.name ?? ''];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && innerRadius > 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-navy">{total}</span>
            <span className="text-[10px] text-muted-foreground">{centerLabel}</span>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: pieColors[index % pieColors.length] }}
            />
            <span className="flex-1 truncate text-[12px] text-foreground">{item.name}</span>
            {item.percentage !== undefined ? (
              <span className="text-[12px] font-bold text-navy">{item.percentage}%</span>
            ) : (
              <span className="text-[12px] font-bold text-navy">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 漏斗图（纯 CSS 实现） =====
export function FunnelChart({ data }: { data: DistributionItem[] }) {
  const max = data[0]?.value || 1;
  const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

  return (
    <div className="flex flex-col items-center gap-1 py-2">
      {data.map((item, index) => {
        const widthPct = (item.value / max) * 100;
        const prevValue = index > 0 ? data[index - 1].value : item.value;
        const rate = index > 0 ? ((item.value / prevValue) * 100).toFixed(1) : '100';
        return (
          <div key={item.name} className="flex w-full flex-col items-center">
            <div
              className="flex items-center justify-between rounded-md px-4 py-2 text-white transition-all"
              style={{
                width: `${widthPct}%`,
                backgroundColor: colors[index % colors.length],
                minWidth: '160px',
              }}
            >
              <span className="text-[12px] font-bold">{item.name}</span>
              <span className="text-[13px] font-black">{item.value}</span>
            </div>
            {index > 0 && (
              <span className="text-[10px] text-muted-foreground">转化率 {rate}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===== 热力图（算力利用率） =====
export function HeatmapChart({ data }: { data: { day: string; hour: number; value: number }[] }) {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function getColor(value: number): string {
    if (value >= 90) return '#1e3a8a';
    if (value >= 75) return '#2563eb';
    if (value >= 60) return '#3b82f6';
    if (value >= 45) return '#60a5fa';
    if (value >= 30) return '#93c5fd';
    if (value >= 15) return '#bfdbfe';
    return '#eff6ff';
  }

  function getTextColor(value: number): string {
    return value >= 60 ? '#fff' : '#334155';
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block">
        {/* 时间轴 */}
        <div className="flex">
          <div className="w-12 shrink-0" />
          {hours.map((h) => (
            <div
              key={h}
              className="w-7 text-center text-[9px] text-muted-foreground"
            >
              {h % 6 === 0 ? `${h}:00` : ''}
            </div>
          ))}
        </div>
        {/* 热力图主体 */}
        {days.map((day) => (
          <div key={day} className="flex">
            <div className="w-12 shrink-0 py-1 text-right pr-2 text-[10px] font-medium text-muted-foreground">
              {day}
            </div>
            {hours.map((h) => {
              const cell = data.find((d) => d.day === day && d.hour === h);
              const value = cell?.value ?? 0;
              return (
                <div
                  key={`${day}-${h}`}
                  className="group relative m-[1px] flex h-7 w-7 items-center justify-center rounded text-[8px] font-bold transition-transform hover:scale-125 hover:z-10"
                  style={{ backgroundColor: getColor(value), color: getTextColor(value) }}
                  title={`${day} ${h}:00 - 利用率 ${value}%`}
                >
                  {value}
                </div>
              );
            })}
          </div>
        ))}
        {/* 图例 */}
        <div className="mt-3 flex items-center gap-1 pl-12">
          <span className="text-[10px] text-muted-foreground">闲置</span>
          {['#eff6ff', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1e3a8a'].map((c) => (
            <div key={c} className="h-3 w-6 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[10px] text-muted-foreground">满载</span>
        </div>
      </div>
    </div>
  );
}

// ===== 仪表盘（任务完成率） =====
export function GaugeChart({ value }: { value: number }) {
  const color = value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';
  const angle = (value / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[120px] w-[180px]">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* 背景弧 */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* 前景弧 */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 251} 251`}
          />
          {/* 指针 */}
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((Math.PI * (180 - angle)) / 180)}
            y2={100 - 60 * Math.sin((Math.PI * angle) / 180)}
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="4" fill="#334155" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-2xl font-black" style={{ color }}>{value}%</span>
          <span className="text-[10px] text-muted-foreground">任务完成率</span>
        </div>
      </div>
    </div>
  );
}

// ===== 词云（简化版标签云） =====
export function WordCloudChart({ data }: { data: DistributionItem[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const colors = ['#2563eb', '#f59e0b', '#22c55e', '#a855f7', '#06b6d4', '#ef4444'];

  function getFontSize(value: number): string {
    const ratio = max === min ? 0.5 : (value - min) / (max - min);
    return `${12 + ratio * 16}px`;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-4">
      {data.map((item, index) => (
        <span
          key={item.name}
          className="cursor-pointer rounded-md px-3 py-1 font-bold transition-all hover:scale-105"
          style={{
            fontSize: getFontSize(item.value),
            color: colors[index % colors.length],
            backgroundColor: `${colors[index % colors.length]}10`,
          }}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}

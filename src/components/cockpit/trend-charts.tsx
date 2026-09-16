'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
} from 'recharts';
import type { TrendDataPoint } from '@/lib/mock/cockpit';

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(16,38,79,0.08)',
};

// ===== 通用趋势折线图（支持多线） =====
export function TrendLineChart({
  data,
  lines,
  height = 240,
}: {
  data: TrendDataPoint[];
  lines: { key: string; stroke: string; dashed?: boolean }[];
  height?: number;
}) {
  const chartMap: Record<string, Record<string, string | number>> = {};
  data.forEach((d) => {
    if (!chartMap[d.date]) chartMap[d.date] = { date: d.date };
    if (d.category) {
      chartMap[d.date][d.category] = d.value;
    } else {
      chartMap[d.date].value = d.value;
    }
  });
  const chartData = Object.values(chartMap);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,38,79,0.06)" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.stroke}
            strokeWidth={2}
            strokeDasharray={line.dashed ? '5 5' : undefined}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ===== 通用面积图 =====
export function TrendAreaChart({
  data,
  dataKey = 'value',
  stroke = '#2563eb',
  fill = '#2563eb',
  height = 240,
}: {
  data: TrendDataPoint[];
  dataKey?: string;
  stroke?: string;
  fill?: string;
  height?: number;
}) {
  const gradientId = `gradient-${dataKey}-${stroke.replace('#', '')}`;
  const chartMap: Record<string, Record<string, string | number>> = {};
  data.forEach((d) => {
    if (!chartMap[d.date]) chartMap[d.date] = { date: d.date };
    if (d.category) {
      chartMap[d.date][d.category] = d.value;
    } else {
      chartMap[d.date].value = d.value;
    }
  });
  const chartData = Object.values(chartMap);
  const key = data.length > 0 && data[0].category ? data[0].category : dataKey;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={0.2} />
            <stop offset="95%" stopColor={fill} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,38,79,0.06)" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={key} stroke={stroke} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== 组合图表（面积 + 折线叠加） =====
export function ComposedTrendChart({
  data,
  areaKey,
  areaColor,
  lines,
  height = 240,
}: {
  data: TrendDataPoint[];
  areaKey: string;
  areaColor: string;
  lines: { key: string; stroke: string; dashed?: boolean }[];
  height?: number;
}) {
  const chartMap: Record<string, Record<string, string | number>> = {};
  data.forEach((d) => {
    if (!chartMap[d.date]) chartMap[d.date] = { date: d.date };
    if (d.category) {
      chartMap[d.date][d.category] = d.value;
    } else {
      chartMap[d.date].value = d.value;
    }
  });
  const chartData = Object.values(chartMap);
  const gradientId = `composed-${areaKey}-${areaColor.replace('#', '')}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={areaColor} stopOpacity={0.15} />
            <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,38,79,0.06)" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey={areaKey} stroke={areaColor} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 4 }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.stroke}
            strokeWidth={2}
            strokeDasharray={line.dashed ? '5 5' : undefined}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ===== 堆叠柱状图 =====
export function StackedBarChart({
  data,
  keys,
  height = 200,
}: {
  data: Record<string, Record<string, string | number>>[];
  keys: { key: string; color: string; name: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,38,79,0.06)" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} stackId="a" fill={k.color} name={k.name} radius={[4, 4, 0, 0]} barSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

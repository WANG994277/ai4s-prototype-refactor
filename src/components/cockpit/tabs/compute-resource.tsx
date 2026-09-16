'use client';

import React from 'react';
import { AlertTriangle, Zap, Clock } from 'lucide-react';
import { MetricCardRow } from '@/components/cockpit/metric-card';
import { ChartCard } from '@/components/cockpit/drilldown-dialog';
import { QuotaBarChart, PieDistributionChart } from '@/components/cockpit/distribution-charts';
import { ComposedTrendChart } from '@/components/cockpit/trend-charts';
import { AlertList } from '@/components/cockpit/rankings-alerts';
import {
  computeMetrics,
  computeTaskTrendData,
  resourceTypeDistribution,
  computeQuotaData,
  computeAlerts,
} from '@/lib/mock/cockpit';

/** 算力利用率热力图 */
function UtilizationHeatmap() {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getUtilization = (day: number, hour: number) => {
    const isWeekend = day >= 5;
    const isPeakHour = hour >= 9 && hour <= 18;
    const seed = (day * 31 + hour * 17) % 100;
    if (isWeekend) return isPeakHour ? 30 + (seed % 20) : 5 + (seed % 10);
    if (isPeakHour) return 65 + (seed % 30);
    if (hour >= 19 && hour <= 22) return 40 + (seed % 20);
    return 10 + (seed % 15);
  };

  const getColor = (val: number) => {
    if (val >= 90) return '#1e40af';
    if (val >= 60) return '#3b82f6';
    if (val >= 30) return '#93c5fd';
    if (val >= 10) return '#dbeafe';
    return '#f8fafc';
  };

  return (
    <div className="overflow-x-auto p-2">
      <div className="min-w-[500px]">
        {/* 小时标签 */}
        <div className="mb-1 ml-10 flex">
          {hours.map((h) => (
            <div key={h} className="flex-1 text-center text-[8px] text-muted-foreground">
              {h % 6 === 0 ? h : ''}
            </div>
          ))}
        </div>
        {/* 热力图主体 */}
        {days.map((day, dayIdx) => (
          <div key={day} className="mb-0.5 flex items-center">
            <span className="w-10 text-[10px] text-muted-foreground">{day}</span>
            <div className="flex flex-1 gap-0.5">
              {hours.map((hour) => {
                const val = getUtilization(dayIdx, hour);
                return (
                  <div
                    key={hour}
                    className="group relative h-4 flex-1 cursor-pointer rounded-sm transition-transform hover:scale-125 hover:z-10"
                    style={{ backgroundColor: getColor(val) }}
                    title={`${day} ${hour}:00 - 利用率 ${val.toFixed(0)}%`}
                  >
                    <div className="pointer-events-none absolute left-1/2 top-5 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white group-hover:block">
                      {day} {hour}:00 - {val.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* 图例 */}
        <div className="mt-2 ml-10 flex items-center gap-1 text-[9px] text-muted-foreground">
          <span>低</span>
          {['#f8fafc', '#dbeafe', '#93c5fd', '#3b82f6', '#1e40af'].map((c) => (
            <div key={c} className="h-3 w-6 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span>高</span>
        </div>
      </div>
    </div>
  );
}

export function ComputeResource() {
  return (
    <div className="space-y-5">
      {/* 核心指标卡片 */}
      <MetricCardRow metrics={computeMetrics} />

      {/* 资源利用率分析 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">资源利用率</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="算力资源利用率热力图" action={<span className="text-[10px] text-muted-foreground">近7天 × 24小时</span>}>
            <UtilizationHeatmap />
          </ChartCard>
          <ChartCard title="资源类型分布">
            <PieDistributionChart
              data={resourceTypeDistribution}
              innerRadius={45}
              centerLabel="核时"
            />
          </ChartCard>
        </div>
      </div>

      {/* 任务趋势 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">任务趋势</h3>
        <ChartCard title="算力任务趋势">
          <ComposedTrendChart
            data={computeTaskTrendData}
            areaKey="提交"
            areaColor="#2563eb"
            lines={[{ key: '失败', stroke: '#ef4444' }]}
          />
        </ChartCard>
      </div>

      {/* 排行与告警 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">排行与告警</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard
            title="各单位算力消耗排行"
            action={<span className="text-[10px] text-muted-foreground">虚线为配额上限，超出部分标红</span>}
          >
            <QuotaBarChart data={computeQuotaData} valueSuffix=" 核时" />
          </ChartCard>
          <div className="space-y-3">
            {/* 分类告警统计 */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '资源超限', value: 3, icon: Zap, color: 'text-red-500' },
                { label: '任务异常', value: 12, icon: AlertTriangle, color: 'text-amber-500' },
                { label: '队列积压', value: 23, icon: Clock, color: 'text-yellow-600' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center rounded-lg border border-gray-100 bg-white p-3">
                  <stat.icon className={`mb-1 h-4 w-4 ${stat.color}`} />
                  <span className="text-lg font-bold text-navy">{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
            <AlertList
              title="算力异常告警"
              icon={AlertTriangle}
              iconColor="text-red-500"
              items={computeAlerts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

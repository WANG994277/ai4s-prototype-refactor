'use client';

import React from 'react';
import { MetricCardRow } from '@/components/cockpit/metric-card';
import { ChartCard } from '@/components/cockpit/drilldown-dialog';
import { PieDistributionChart } from '@/components/cockpit/distribution-charts';
import { TrendLineChart, ComposedTrendChart } from '@/components/cockpit/trend-charts';
import {
  projectMetrics,
  projectTypeDistribution,
  outcomeTrendData,
  outcomeCategoryData,
  projectProgressDistribution,
  conversionFunnel,
} from '@/lib/mock/cockpit';

export function ProjectAchievement() {
  return (
    <div className="space-y-5">
      {/* 核心指标卡片 */}
      <MetricCardRow metrics={projectMetrics} />

      {/* 分布与分类 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">分布与分类</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="项目类型分布">
            <PieDistributionChart data={projectTypeDistribution} innerRadius={45} centerLabel="项目" />
          </ChartCard>
          <ChartCard title="论文/专利/报告数量">
            <TrendLineChart
              data={outcomeCategoryData}
              lines={[
                { key: '论文', stroke: '#2563eb' },
                { key: '专利', stroke: '#22c55e' },
                { key: '报告', stroke: '#f59e0b' },
              ]}
            />
          </ChartCard>
        </div>
      </div>

      {/* 进度与转化 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">进度与转化</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* 项目进度分布 */}
          <ChartCard title="项目进度分布">
            <div className="space-y-3 p-2">
              {projectProgressDistribution.map((item, i) => {
                const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="w-16 text-[11px] text-muted-foreground">{item.name}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded bg-gray-100">
                      <div
                        className="flex h-full items-center justify-end rounded pr-2 text-[10px] text-white"
                        style={{ width: `${item.percentage}%`, backgroundColor: colors[i] }}
                      >
                        {item.percentage}%
                      </div>
                    </div>
                    <span className="w-8 text-right text-[11px] text-muted-foreground">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* 成果转化漏斗 */}
          <ChartCard title="成果转化状态">
            <div className="flex flex-col items-center gap-1 p-4">
              {conversionFunnel.map((stage, i) => {
                const maxWidth = 100;
                const width = (stage.value / conversionFunnel[0].value) * maxWidth;
                const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
                return (
                  <div key={stage.name} className="flex w-full flex-col items-center">
                    <div
                      className="flex items-center justify-center rounded-t-md py-2 text-white"
                      style={{ width: `${width}%`, backgroundColor: colors[i], minWidth: '120px' }}
                    >
                      <span className="text-[11px] font-medium">{stage.name}: {stage.value}</span>
                    </div>
                    {i < conversionFunnel.length - 1 && (
                      <span className="text-[10px] text-muted-foreground">
                        转化率 {((conversionFunnel[i + 1].value / stage.value) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* 产出趋势 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">产出趋势</h3>
        <ChartCard title="产出成果趋势">
          <ComposedTrendChart
            data={outcomeTrendData}
            areaKey="成果数"
            areaColor="#2563eb"
            lines={[{ key: '转化数', stroke: '#f59e0b' }]}
          />
        </ChartCard>
      </div>
    </div>
  );
}

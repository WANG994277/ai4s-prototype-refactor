'use client';

import React from 'react';
import { MetricCardRow } from '@/components/cockpit/metric-card';
import { ChartCard } from '@/components/cockpit/drilldown-dialog';
import { HorizontalBarChart, PieDistributionChart } from '@/components/cockpit/distribution-charts';
import { TrendLineChart } from '@/components/cockpit/trend-charts';
import { RankingList } from '@/components/cockpit/rankings-alerts';
import {
  resourceMetrics,
  literaturePatentTrendData,
  techThemeDistribution,
  hotLiteratureRanking,
  collectionCitationRanking,
} from '@/lib/mock/cockpit';

export function ResearchResources() {
  return (
    <div className="space-y-5">
      {/* 核心指标卡片 */}
      <MetricCardRow metrics={resourceMetrics} />

      {/* 趋势分析 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">趋势分析</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="文献专利检索趋势">
            <TrendLineChart
              data={literaturePatentTrendData}
              lines={[{ key: '文献检索', stroke: '#2563eb' }, { key: '专利检索', stroke: '#22c55e' }]}
            />
          </ChartCard>
          <ChartCard title="热门技术主题" action={<span className="text-[10px] text-muted-foreground">字号越大热度越高</span>}>
            <div className="flex h-[260px] flex-wrap items-center justify-center gap-x-3 gap-y-2 overflow-hidden p-4">
              {techThemeDistribution.map((topic, i) => {
                const fontSize = 12 + (topic.value / 50) * 22;
                const colors = ['#2563eb', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#ec4899'];
                return (
                  <span
                    key={topic.name}
                    className="cursor-pointer transition-all hover:scale-110 hover:font-bold"
                    style={{ fontSize: `${fontSize}px`, color: colors[i % colors.length], fontWeight: 500 }}
                  >
                    {topic.name}
                  </span>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* 排行 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">排行</h3>
        <div className="grid grid-cols-2 gap-4">
          <RankingList
            title="热门文献/专利排行"
            items={hotLiteratureRanking}
            metricLabel="次引用"
          />
          <ChartCard title="收藏/引用资源排行">
            <HorizontalBarChart
              data={collectionCitationRanking}
              valueSuffix=" 次"
              colors={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

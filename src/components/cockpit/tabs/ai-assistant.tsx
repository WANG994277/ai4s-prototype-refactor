'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { MetricCardRow } from '@/components/cockpit/metric-card';
import { ChartCard } from '@/components/cockpit/drilldown-dialog';
import { HorizontalBarChart } from '@/components/cockpit/distribution-charts';
import { ComposedTrendChart } from '@/components/cockpit/trend-charts';
import { RankingList, AlertList } from '@/components/cockpit/rankings-alerts';
import {
  aiMetrics,
  aiTrendData,
  questionTypeDistribution,
  aiResourceCitationRanking,
  aiAlerts,
} from '@/lib/mock/cockpit';

export function AIAssistant() {
  return (
    <div className="space-y-5">
      {/* 核心指标卡片 */}
      <MetricCardRow metrics={aiMetrics} />

      {/* 趋势分析 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">趋势分析</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="高频问题类型分布">
            <HorizontalBarChart
              data={questionTypeDistribution}
              valueSuffix=" 次"
              colors={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']}
            />
          </ChartCard>
          <ChartCard title="AI使用趋势">
            <ComposedTrendChart
              data={aiTrendData}
              areaKey="调用次数"
              areaColor="#2563eb"
              lines={[{ key: '失败', stroke: '#ef4444' }]}
            />
          </ChartCard>
        </div>
      </div>

      {/* 排行与告警 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">排行与告警</h3>
        <div className="grid grid-cols-2 gap-4">
          <RankingList
            title="引用资源次数排行"
            items={aiResourceCitationRanking.map((item, i) => ({
              rank: i + 1,
              name: item.name,
              metric: item.value,
              trend: 'up' as const,
            }))}
            metricLabel="次引用"
          />
          <AlertList
            title="AI异常告警"
            icon={AlertTriangle}
            iconColor="text-red-500"
            items={aiAlerts}
          />
        </div>
      </div>
    </div>
  );
}

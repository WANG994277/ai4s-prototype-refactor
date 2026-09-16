'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { MetricCardRow } from '@/components/cockpit/metric-card';
import { ChartCard } from '@/components/cockpit/drilldown-dialog';
import { HorizontalBarChart, PieDistributionChart } from '@/components/cockpit/distribution-charts';
import { TrendLineChart } from '@/components/cockpit/trend-charts';
import { RankingList, AlertList } from '@/components/cockpit/rankings-alerts';
import { DrilldownDialog, StatusTag, TrendBar } from '@/components/cockpit/drilldown-dialog';
import {
  userMetrics,
  userTrendData,
  roleDistribution,
  highFrequencyUserRanking,
  unitActivityRanking,
  operationAlerts,
  unitOptions,
} from '@/lib/mock/cockpit';
import type { DrilldownColumn } from '@/components/cockpit/drilldown-dialog';

export function UserAnalysis() {
  const [drilldownOpen, setDrilldownOpen] = useState(false);

  const columns: DrilldownColumn[] = [
    { key: 'name', label: '用户名', render: (row) => <span className="font-medium">{String(row.name)}</span> },
    { key: 'unit', label: '所属单位' },
    { key: 'person', label: '最后活跃', render: (row) => <span className="text-muted-foreground">{String(row.person)}</span> },
    { key: 'metric', label: '核心指标', render: (row) => <span className="text-[11px]">操作 {String(row.metric)} 次</span> },
    { key: 'trend', label: '趋势', render: (row) => <TrendBar value={Number(row.trend)} />, width: '120px' },
    { key: 'status', label: '状态', render: (row) => <StatusTag status={String(row.status)} />, width: '80px' },
  ];

  const rows = highFrequencyUserRanking.map((item, i) => ({
    name: item.name,
    unit: item.unit || '',
    person: item.extra || '—',
    metric: item.metric,
    trend: 88 - i * 7,
    status: i < 7 ? '活跃' : '建设中',
  }));

  return (
    <div className="space-y-5">
      {/* 核心指标卡片 */}
      <MetricCardRow metrics={userMetrics} />

      {/* 趋势分析 + 分布 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">趋势分析</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="用户活跃趋势">
            <TrendLineChart
              data={userTrendData}
              lines={[{ key: '日活', stroke: '#2563eb' }, { key: '新增', stroke: '#22c55e' }]}
            />
          </ChartCard>
          <ChartCard title="用户角色分布">
            <PieDistributionChart data={roleDistribution} innerRadius={45} centerLabel="用户" />
          </ChartCard>
        </div>
      </div>

      {/* 排行 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">排行</h3>
        <div className="grid grid-cols-2 gap-4">
          <RankingList
            title="高频用户排行"
            items={highFrequencyUserRanking}
            metricLabel="次"
            onItemClick={() => setDrilldownOpen(true)}
            onViewAll={() => setDrilldownOpen(true)}
          />
          <ChartCard title="单位活跃度排行">
            <HorizontalBarChart data={unitActivityRanking} valueSuffix=" 次/人" colors={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']} />
          </ChartCard>
        </div>
      </div>

      {/* 钻取弹窗 */}
      <DrilldownDialog
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title="科研人员 · 明细"
        columns={columns}
        rows={rows}
        filters={[
          { label: '单位', options: unitOptions, value: '全部单位', onChange: () => {} },
          { label: '角色', options: ['全部角色', '研究员', '工程师', '技术员', '管理员'], value: '全部角色', onChange: () => {} },
          { label: '时间范围', options: ['近7天', '近30天', '近90天'], value: '近30天', onChange: () => {} },
        ]}
      />
    </div>
  );
}

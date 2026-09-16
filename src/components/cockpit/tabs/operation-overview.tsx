'use client';

import React, { useState } from 'react';
import { Shield, Cpu, Database } from 'lucide-react';
import { MetricCardRow } from '@/components/cockpit/metric-card';
import { ChartCard } from '@/components/cockpit/drilldown-dialog';
import { HorizontalBarChart } from '@/components/cockpit/distribution-charts';
import { TrendLineChart } from '@/components/cockpit/trend-charts';
import { RankingList, AlertList } from '@/components/cockpit/rankings-alerts';
import { DrilldownDialog, StatusTag, TrendBar } from '@/components/cockpit/drilldown-dialog';
import {
  operationMetrics,
  workbenchTrendData,
  unitDistribution,
  activeWorkbenchRanking,
  operationAlerts,
  unitOptions,
} from '@/lib/mock/cockpit';
import type { DrilldownColumn } from '@/components/cockpit/drilldown-dialog';

export function OperationOverview() {
  const [drilldownOpen, setDrilldownOpen] = useState(false);

  const handleOpenDrilldown = () => setDrilldownOpen(true);

  const columns: DrilldownColumn[] = [
    { key: 'name', label: '工作台名称', render: (row) => <span className="font-medium">{String(row.name)}</span> },
    { key: 'unit', label: '所属单位' },
    { key: 'person', label: '负责人', render: (row) => <span className="text-muted-foreground">{String(row.person)}</span> },
    { key: 'aiCalls', label: '核心指标', render: (row) => <span className="text-[11px]">AI调用 {String(row.metric)}次</span> },
    { key: 'trend', label: '趋势', render: (row) => <TrendBar value={Number(row.trend)} />, width: '120px' },
    { key: 'status', label: '状态', render: (row) => <StatusTag status={String(row.status)} />, width: '80px' },
  ];

  const persons = ['张明远', '李思远', '王建华', '陈晓华', '赵磊', '刘芳', '孙伟', '周丽', '吴强', '郑琳'];

  const rows = activeWorkbenchRanking.map((item, i) => ({
    name: item.name,
    unit: item.unit || '',
    person: persons[i] || '—',
    aiCalls: item.metric,
    metric: item.metric,
    trend: 85 - i * 6,
    status: i < 7 ? '活跃' : '建设中',
  }));

  return (
    <div className="space-y-5">
      {/* 第一屏：核心指标卡片 */}
      <MetricCardRow metrics={operationMetrics} />

      {/* 第二屏：趋势分析 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">趋势分析</h3>
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="工作台活跃趋势">
            <TrendLineChart
              data={workbenchTrendData}
              lines={[{ key: '日活', stroke: '#2563eb' }, { key: '周活', stroke: '#f59e0b' }]}
            />
          </ChartCard>
          <ChartCard title="运营总览分布排行" action={<span className="text-[10px] text-muted-foreground">点击柱形可查看明细</span>}>
            <HorizontalBarChart data={unitDistribution} valueSuffix=" 个" />
          </ChartCard>
        </div>
      </div>

      {/* 第三屏：排行与预警 */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-navy">排行与预警</h3>
        <div className="grid grid-cols-2 gap-4">
          <RankingList
            title="活跃工作台排行"
            items={activeWorkbenchRanking}
            metricLabel="次/月"
            onItemClick={handleOpenDrilldown}
            onViewAll={handleOpenDrilldown}
          />
          <div className="space-y-3">
            <AlertList title="权限异常" icon={Shield} iconColor="text-amber" items={operationAlerts.filter(a => a.type === 'permission')} />
            <AlertList title="算力任务异常" icon={Cpu} iconColor="text-red-500" items={operationAlerts.filter(a => a.type === 'compute')} />
            <AlertList title="数据访问异常" icon={Database} iconColor="text-purple-600" items={operationAlerts.filter(a => a.type === 'data_access')} />
          </div>
        </div>
      </div>

      {/* 钻取弹窗 */}
      <DrilldownDialog
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        title="活跃工作台排行 · 明细"
        columns={columns}
        rows={rows}
        filters={[
          { label: '单位', options: unitOptions, value: '全部单位', onChange: () => {} },
          { label: '时间范围', options: ['近7天', '近30天', '近90天'], value: '近30天', onChange: () => {} },
        ]}
      />
    </div>
  );
}

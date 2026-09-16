'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  RotateCcw,
  ArrowRight,
  Search,
  FileText,
  Lightbulb,
  Columns3,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DoSpaceAIAssistant } from '@/components/do-space-ai-assistant';
import type { AIInsight, AIPreset } from '@/components/do-space-ai-assistant';
import { NewAnalysisDialog } from '@/components/do-space/new-analysis-dialog';

/* ─── 数据 ─── */

const taskBanner = {
  name: 'DOE-0231 批次结果分析',
  runs: '24 runs',
  method: '响应面拟合 + ANOVA',
  r2: 'R² 0.972',
  owner: '张明远',
  sink: '结果将回流算空间·代理模型',
};

const kpis = [
  { label: '最佳转化率', value: '48.6%', sub: '▲6.3pt vs 基线 · EXP-512', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
  { label: '丙烯选择性', value: '96.2%', sub: '关联指标', icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '拟合优度 R²', value: '0.972', sub: 'RMSE 0.9%', icon: BarChart3, color: 'text-cyan', bg: 'bg-cyan/10' },
  { label: '有效数据', value: '24', sub: '7轮 · 异常1条', icon: FileText, color: 'text-amber', bg: 'bg-amber/10' },
  { label: '关键因子', value: '焙烧温度', sub: '贡献41% · p<0.001', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
];

type DataTag = '最优' | '优' | '常规' | '边界' | '异常↑σ';

const dataSet = [
  { id: 'EXP-512', roast: 550, snpt: 1.2, reactT: 600, whsv: 2.0, conv: 48.6, sel: 96.2, deact: 2.1, tag: '最优' as DataTag },
  { id: 'EXP-518', roast: 545, snpt: 1.18, reactT: 598, whsv: 2.1, conv: 48.3, sel: 95.8, deact: 2.3, tag: '优' as DataTag },
  { id: 'EXP-501', roast: 530, snpt: 1.3, reactT: 590, whsv: 1.8, conv: 46.1, sel: 94.5, deact: 3.1, tag: '优' as DataTag },
  { id: 'EXP-513', roast: 580, snpt: 1.0, reactT: 620, whsv: 2.5, conv: 44.8, sel: 93.1, deact: 4.2, tag: '常规' as DataTag },
  { id: 'EXP-515', roast: 500, snpt: 1.5, reactT: 610, whsv: 3.0, conv: 43.0, sel: 92.0, deact: 3.8, tag: '常规' as DataTag },
  { id: 'EXP-516', roast: 520, snpt: 1.3, reactT: 590, whsv: 1.8, conv: 47.1, sel: 95.5, deact: 2.5, tag: '优' as DataTag },
  { id: 'EXP-502', roast: 560, snpt: 0.9, reactT: 630, whsv: 2.2, conv: 42.5, sel: 91.8, deact: 5.1, tag: '常规' as DataTag },
  { id: 'EXP-503', roast: 600, snpt: 0.8, reactT: 580, whsv: 1.5, conv: 40.2, sel: 90.5, deact: 6.3, tag: '边界' as DataTag },
  { id: 'EXP-507', roast: 650, snpt: 0.7, reactT: 560, whsv: 1.2, conv: 33.8, sel: 85.1, deact: 12.5, tag: '异常↑σ' as DataTag },
  { id: 'EXP-514', roast: 650, snpt: 0.8, reactT: 580, whsv: 1.5, conv: 41.3, sel: 91.0, deact: 5.8, tag: '边界' as DataTag },
];

const tagConfig: Record<DataTag, { color: string; bg: string }> = {
  '最优': { color: 'text-amber', bg: 'bg-amber/10' },
  '优': { color: 'text-primary', bg: 'bg-primary/10' },
  '常规': { color: 'text-muted-foreground', bg: 'bg-surface-2' },
  '边界': { color: 'text-cyan', bg: 'bg-cyan/10' },
  '异常↑σ': { color: 'text-purple-600', bg: 'bg-purple-50' },
};

const factorImportance = [
  { name: '焙烧温度', value: 0.41, color: 'bg-primary' },
  { name: 'Sn:Pt', value: 0.27, color: 'bg-primary/80' },
  { name: '反应温度', value: 0.18, color: 'bg-primary/60' },
  { name: 'WHSV', value: 0.08, color: 'bg-primary/40' },
  { name: 'K助剂', value: 0.04, color: 'bg-primary/25' },
  { name: '还原温度', value: 0.02, color: 'bg-primary/15' },
];

const anovaItems = [
  { source: '模型', df: 6, fValue: 42.3, pValue: '<0.001', sig: '显著' as const },
  { source: '焙烧温度', df: 1, fValue: 58.1, pValue: '<0.001', sig: '显著' as const },
  { source: 'Sn:Pt', df: 1, fValue: 35.4, pValue: '<0.001', sig: '显著' as const },
  { source: '焙烧温度²', df: 1, fValue: 18.7, pValue: '0.001', sig: '显著' as const },
  { source: '焙烧×Sn:Pt', df: 1, fValue: 6.2, pValue: '0.03', sig: '显著' as const },
  { source: '失拟(LoF)', df: 8, fValue: 1.8, pValue: '0.21', sig: '不显著' as const },
];

const aiInsights: AIInsight[] = [
  { icon: 'check', content: '二阶响应面已收敛，R²=0.972，模型质量优良' },
  { icon: 'alert', content: 'EXP-507实测低于预测4.8%，推断局部热点导致烧结，建议标记并修正不确定度' },
  { icon: 'sync', content: '建议将24条结果回流代理模型，预计R²从0.947提升至0.96+，可同步触发下一批DoE' },
];

const aiPresets: AIPreset[] = [
  {
    q: '模型是否已收敛？',
    a: '当前二阶响应面模型已收敛，关键指标如下：\n① R² = 0.972 — 模型解释了97.2%的响应变异，拟合质量优良\n② RMSE = 0.9% — 预测误差在可接受范围内\n③ 失拟检验 LoF p=0.21（不显著）— 模型无失拟，二阶模型充分\n④ 连续3轮R²提升幅度<0.01，收敛趋势明确\n建议：当前模型可用于预测和优化，无需增加高阶项。',
  },
  {
    q: '异常点EXP-507分析',
    a: '异常点EXP-507详细分析：\n① 偏离程度：实测转化率42.1%，低于代理模型预测值46.9%（偏差-4.8%）\n② 原因推断：该实验点焙烧温度580℃较高，结合实验记录中观察到的"催化剂颜色异常加深"，推断局部热点导致Pt颗粒烧结、活性位点减少\n③ 处理建议：标记为异常点，在代理模型中增加该区域的不确定度（σ+20%），避免后续采集点被误导\n④ 补充验证：建议在550-580℃区间增加1-2个验证实验点。',
  },
  {
    q: '回流后模型效果预估',
    a: '将24条带标签结果回流至代理模型Round 7后的预估效果：\n① R²预计从0.947提升至0.96+（提升约1.5pt）\n② 最大改进区域：高温端（焙烧>580℃）的预测不确定度将显著降低\n③ 新一批贝叶斯采集：预计推荐6-8个新实验点，重心向低温高Sn:Pt区间偏移\n④ 闭环触发：回流完成后自动触发下一批DoE设计，无需人工干预\n是否现在执行回流操作？',
  },
];

/* ─── 组件 ─── */

export default function DataAnalysisPage() {
  const [dataFilter, setDataFilter] = useState<'全部' | 'Top 5' | '异常'>('全部');
  const [newAnalysisOpen, setNewAnalysisOpen] = useState(false);

  const filteredData = dataSet.filter((d) => {
    if (dataFilter === 'Top 5') return d.tag === '最优' || d.tag === '优';
    if (dataFilter === '异常') return d.tag === '异常↑σ' || d.tag === '边界';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* 页面标题 + 操作 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-navy">实验表征分析</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-[12px] font-bold text-foreground hover:bg-surface-2 transition-colors">
            <Download className="h-3.5 w-3.5" /> 导出分析报告
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12px] font-bold text-white hover:bg-primary/90 transition-colors">
            <RotateCcw className="h-3.5 w-3.5" /> 回流至代理模型
          </button>
          <button onClick={() => setNewAnalysisOpen(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12px] font-bold text-white hover:bg-primary/90 transition-colors">
            <Sparkles className="h-3.5 w-3.5" /> 新建分析
          </button>
        </div>
      </div>

      {/* 任务横幅 */}
      <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black text-navy">{taskBanner.name}</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{taskBanner.runs}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">{taskBanner.method}</span>
              <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan">{taskBanner.r2}</span>
              <span className="text-[11px] text-muted-foreground">负责人: {taskBanner.owner}</span>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-bold text-primary">
            {taskBanner.sink}
          </span>
        </div>
      </div>

      {/* KPI 看板 */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-lg border border-line bg-white p-3 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground">{kpi.label}</span>
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', kpi.bg)}>
                  <Icon className={cn('h-3.5 w-3.5', kpi.color)} />
                </div>
              </div>
              <div className="mt-1.5 text-xl font-black text-navy">{kpi.value}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* 数据表格 */}
      <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy">实验结果数据</h3>
          <div className="flex items-center gap-1">
            {(['全部', 'Top 5', '异常'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDataFilter(f)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[10px] font-bold transition-colors',
                  dataFilter === f
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-muted-foreground hover:bg-surface-2/80',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-line">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-surface-2/50">
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">编号</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">焙烧℃</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">Sn:Pt</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">反应℃</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">WHSV</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">转化率%</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">选择性%</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">5h失活%</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">标签</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => {
                const tc = tagConfig[row.tag];
                const isBest = row.tag === '最优';
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b border-line/50 hover:bg-surface-2/30 transition-colors cursor-pointer',
                      isBest && 'bg-amber/5 border-l-2 border-l-amber',
                    )}
                  >
                    <td className="px-3 py-2.5 text-[12px] font-mono font-bold text-foreground">{row.id}</td>
                    <td className={cn('px-3 py-2.5 text-[12px]', isBest ? 'text-amber font-bold' : 'text-foreground')}>{row.roast}</td>
                    <td className={cn('px-3 py-2.5 text-[12px]', isBest ? 'text-amber font-bold' : 'text-foreground')}>{row.snpt}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{row.reactT}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{row.whsv}</td>
                    <td className={cn('px-3 py-2.5 text-[12px] font-bold', isBest ? 'text-amber' : 'text-foreground')}>{row.conv}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{row.sel}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{row.deact}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold', tc.bg, tc.color)}>
                        {row.tag}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 可视化分析 + 因子重要性 + ANOVA */}
      <div className="grid grid-cols-3 gap-4">
        {/* 响应拟合图 */}
        <div className="col-span-2 rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">响应拟合图</h3>
            <span className="text-[10px] text-muted-foreground">焙烧温度 → 丙烷转化率 (Sn:Pt色映射)</span>
          </div>
          <div className="flex items-center justify-center rounded-md bg-surface-2/30 border border-line/50 p-4">
            <svg viewBox="0 0 360 220" className="w-full max-w-xl" xmlns="http://www.w3.org/2000/svg">
              {/* 坐标轴 */}
              <line x1="50" y1="190" x2="340" y2="190" stroke="#94A3B8" strokeWidth="1" />
              <line x1="50" y1="10" x2="50" y2="190" stroke="#94A3B8" strokeWidth="1" />
              {/* X轴刻度 */}
              <text x="50" y="205" fontSize="8" fill="#94A3B8" textAnchor="middle">400</text>
              <text x="122" y="205" fontSize="8" fill="#94A3B8" textAnchor="middle">475</text>
              <text x="195" y="205" fontSize="8" fill="#94A3B8" textAnchor="middle">550</text>
              <text x="268" y="205" fontSize="8" fill="#94A3B8" textAnchor="middle">625</text>
              <text x="340" y="205" fontSize="8" fill="#94A3B8" textAnchor="middle">700</text>
              <text x="195" y="218" fontSize="9" fill="#606266" textAnchor="middle">焙烧温度 (℃)</text>
              {/* Y轴刻度 */}
              <text x="45" y="193" fontSize="8" fill="#94A3B8" textAnchor="end">30</text>
              <text x="45" y="148" fontSize="8" fill="#94A3B8" textAnchor="end">36</text>
              <text x="45" y="103" fontSize="8" fill="#94A3B8" textAnchor="end">42</text>
              <text x="45" y="58" fontSize="8" fill="#94A3B8" textAnchor="end">48</text>
              <text x="45" y="14" fontSize="8" fill="#94A3B8" textAnchor="end">54</text>
              <text x="14" y="103" fontSize="9" fill="#606266" textAnchor="middle" transform="rotate(-90,14,103)">转化率 (%)</text>
              {/* 95%置信带 */}
              <path d="M60,120 Q120,60 195,42 Q270,65 330,110 L330,155 Q270,105 195,72 Q120,95 60,160 Z" fill="#3B82F6" opacity="0.1" />
              {/* 二阶拟合曲线 */}
              <path d="M60,140 Q120,78 195,57 Q270,85 330,132" fill="none" stroke="#3B82F6" strokeWidth="2" />
              {/* 散点 (颜色映射Sn:Pt: 蓝=低 → 琥珀=高) */}
              {[
                { x: 195, y: 57, c: '#F59E0B' },  // EXP-512 Sn:Pt=1.2
                { x: 190, y: 60, c: '#F59E0B' },  // EXP-518
                { x: 170, y: 72, c: '#F59E0B' },  // EXP-501
                { x: 220, y: 85, c: '#3B82F6' },  // EXP-513 Sn:Pt=1.0
                { x: 130, y: 92, c: '#F59E0B' },  // EXP-515
                { x: 155, y: 65, c: '#F59E0B' },  // EXP-516
                { x: 235, y: 95, c: '#3B82F6' },  // EXP-502
                { x: 270, y: 112, c: '#3B82F6' }, // EXP-503
                { x: 310, y: 148, c: '#3B82F6' }, // EXP-507 异常
                { x: 270, y: 105, c: '#3B82F6' }, // EXP-514
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill={pt.c} opacity="0.8" />
              ))}
              {/* 最优点标注 */}
              <circle cx="195" cy="57" r="8" fill="none" stroke="#F59E0B" strokeWidth="2" />
              {/* 异常点标注 */}
              <circle cx="310" cy="148" r="6" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="310" y="162" fontSize="7" fill="#8B5CF6" textAnchor="middle">异常</text>
            </svg>
          </div>
          {/* 图例 */}
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-0.5 w-4 bg-blue-500" /> 拟合曲线
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-3 w-4 bg-blue-500/10 rounded" /> 95%置信带
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-amber" /> 最优点
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full border border-purple-500 border-dashed" /> 异常点
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Sn:Pt低
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-amber" /> Sn:Pt高
            </span>
          </div>
        </div>

        {/* 因子重要性 + ANOVA */}
        <div className="space-y-4">
          {/* 因子重要性 */}
          <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <h3 className="mb-3 text-sm font-bold text-navy">因子重要性 (ΔR²)</h3>
            <div className="space-y-2.5">
              {factorImportance.map((f) => (
                <div key={f.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-foreground">{f.name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{(f.value * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-line">
                    <div className={cn('h-full rounded-full', f.color)} style={{ width: `${f.value * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANOVA */}
          <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <h3 className="mb-3 text-sm font-bold text-navy">方差分析 (ANOVA)</h3>
            <div className="overflow-hidden rounded-md border border-line">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line bg-surface-2/50">
                    <th className="px-2 py-1.5 text-left text-[9px] font-bold uppercase text-faint">来源</th>
                    <th className="px-2 py-1.5 text-left text-[9px] font-bold uppercase text-faint">df</th>
                    <th className="px-2 py-1.5 text-left text-[9px] font-bold uppercase text-faint">F</th>
                    <th className="px-2 py-1.5 text-left text-[9px] font-bold uppercase text-faint">p</th>
                    <th className="px-2 py-1.5 text-left text-[9px] font-bold uppercase text-faint">结论</th>
                  </tr>
                </thead>
                <tbody>
                  {anovaItems.map((item) => (
                    <tr key={item.source} className="border-b border-line/50">
                      <td className="px-2 py-1.5 text-[10px] font-medium text-foreground">{item.source}</td>
                      <td className="px-2 py-1.5 text-[10px] text-muted-foreground">{item.df}</td>
                      <td className="px-2 py-1.5 text-[10px] text-foreground">{item.fValue}</td>
                      <td className="px-2 py-1.5 text-[10px] text-foreground">{item.pValue}</td>
                      <td className="px-2 py-1.5">
                        <span className={cn(
                          'rounded-full px-1.5 py-0.5 text-[8px] font-bold',
                          item.sig === '显著' ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-muted-foreground',
                        )}>
                          {item.sig}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 结论洞察 + AI 助理 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 分析结论 */}
        <div className="col-span-2 rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
          <h3 className="mb-3 text-sm font-bold text-navy">分析结论</h3>
          <div className="space-y-3">
            <div className="rounded-md bg-primary/5 border border-primary/10 px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span className="text-[12px] font-bold text-primary">最优参数范围</span>
              </div>
              <p className="text-[12px] text-foreground leading-relaxed">
                焙烧温度 <span className="font-bold text-amber">~550℃</span>，Sn:Pt ≈ <span className="font-bold text-amber">1.2</span> 时转化率最优。
                过高焙烧温度导致Pt烧结、失活率上升；过低则活性组分分散不足。
              </p>
            </div>
            <div className="rounded-md bg-purple-50/50 border border-purple-200/50 px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-[12px] font-bold text-purple-600">异常点分析</span>
              </div>
              <p className="text-[12px] text-foreground leading-relaxed">
                <span className="font-bold">EXP-507</span> 实测转化率低于预测 4.8%，推断原因为局部热点导致Pt颗粒烧结，
                建议标记该点并修正代理模型不确定度。
              </p>
            </div>
          </div>
        </div>

        {/* 做空间 AI 助理 */}
        <DoSpaceAIAssistant insights={aiInsights} presets={aiPresets} />
      </div>
      <NewAnalysisDialog open={newAnalysisOpen} onOpenChange={setNewAnalysisOpen} />
    </div>
  );
}

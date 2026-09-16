'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Beaker,
  Target,
  TrendingUp,
  Shield,
  ArrowRight,
  Search,
  Download,
  Send,
  Sparkles,
  ChevronRight,
  Columns3,
  BarChart3,
  LayoutGrid,
  RotateCcw,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DoSpaceAIAssistant } from '@/components/do-space-ai-assistant';
import type { AIInsight, AIPreset } from '@/components/do-space-ai-assistant';
import { NewDesignDialog } from '@/components/do-space/new-design-dialog';

/* ─── 数据 ─── */

const taskBanner = {
  name: 'PDH催化剂Sn-Pt/Al₂O₃优化 DOE',
  id: '#DOE-0231',
  method: '贝叶斯优化 GP+EI',
  candidate: 'M-1842',
  owner: '张明远',
  source: '算空间·代理模型 Round 7',
};

const kpis = [
  { label: '本批实验点', value: '8', sub: 'Batch-7', icon: Beaker, color: 'text-primary', bg: 'bg-primary/10' },
  { label: '实验进度', value: '16/24', sub: '已完成', icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '空间覆盖度', value: '68%', sub: '▲12%', icon: TrendingUp, color: 'text-cyan', bg: 'bg-cyan/10' },
  { label: '预测最优', value: '48.6%', sub: '±2.1% CI', icon: Sparkles, color: 'text-amber', bg: 'bg-amber/10' },
  { label: 'HSE预审', value: '待批', sub: '2项需会签', icon: Shield, color: 'text-destructive', bg: 'bg-destructive/10' },
];

const factors = [
  { name: '焙烧温度', type: '连续', min: 400, max: 700, best: 550, unit: '℃' },
  { name: 'Sn:Pt摩尔比', type: '连续', min: 0.5, max: 2.0, best: 1.2, unit: '—' },
  { name: '反应温度', type: '连续', min: 550, max: 650, best: 600, unit: '℃' },
  { name: 'WHSV', type: '连续', min: 1, max: 4, best: 2.0, unit: 'h⁻¹' },
  { name: 'K助剂含量', type: '连续', min: 0, max: 2, best: 0.8, unit: 'wt%' },
  { name: '还原气氛', type: '离散', min: null, max: null, best: 'H₂', unit: '—' },
];

type ExpStatus = '已排程' | '待执行' | '进行中' | '已完成';

const experiments = [
  { id: 'EXP-512', params: { '焙烧℃': 550, 'Sn:Pt': 1.2, '反应℃': 600, WHSV: 2.0, 'K%': 0.8 }, pred: '48.6±1.2%', tag: 'EI★', tagType: 'ei-star' as const, status: '已排程' as ExpStatus },
  { id: 'EXP-513', params: { '焙烧℃': 580, 'Sn:Pt': 1.0, '反应℃': 620, WHSV: 2.5, 'K%': 0.5 }, pred: '46.2±1.8%', tag: 'EI', tagType: 'ei' as const, status: '已排程' as ExpStatus },
  { id: 'EXP-514', params: { '焙烧℃': 650, 'Sn:Pt': 0.8, '反应℃': 580, WHSV: 1.5, 'K%': 1.2 }, pred: '41.3±3.1%', tag: 'UCB↑σ', tagType: 'ucb' as const, status: '待执行' as ExpStatus },
  { id: 'EXP-515', params: { '焙烧℃': 500, 'Sn:Pt': 1.5, '反应℃': 610, WHSV: 3.0, 'K%': 0.3 }, pred: '44.8±1.5%', tag: 'EI', tagType: 'ei' as const, status: '进行中' as ExpStatus },
  { id: 'EXP-516', params: { '焙烧℃': 520, 'Sn:Pt': 1.3, '反应℃': 590, WHSV: 1.8, 'K%': 1.0 }, pred: '47.1±1.0%', tag: 'EI', tagType: 'ei' as const, status: '进行中' as ExpStatus },
  { id: 'EXP-517', params: { '焙烧℃': 680, 'Sn:Pt': 0.6, '反应℃': 650, WHSV: 3.5, 'K%': 0.1 }, pred: '38.5±4.2%', tag: 'UCB↑σ', tagType: 'ucb' as const, status: '待执行' as ExpStatus },
  { id: 'EXP-518', params: { '焙烧℃': 545, 'Sn:Pt': 1.18, '反应℃': 598, WHSV: 2.1, 'K%': 0.7 }, pred: '48.3±1.1%', tag: 'EI★', tagType: 'ei-star' as const, status: '已排程' as ExpStatus },
  { id: 'EXP-519', params: { '焙烧℃': 600, 'Sn:Pt': 0.9, '反应℃': 560, WHSV: 1.2, 'K%': 1.5 }, pred: '43.0±2.5%', tag: 'UCB', tagType: 'ucb' as const, status: '待执行' as ExpStatus },
];

const designMethods = [
  { id: 'bayesian', name: '贝叶斯优化', sub: 'GP+EI', desc: '小样本高效逼近最优，适合迭代优化场景', icon: Target, active: true },
  { id: 'rsm', name: '响应面RSM', sub: 'CCD', desc: '二阶曲面精拟合，适合因子交互分析', icon: LayoutGrid, active: false },
  { id: 'lhs', name: '拉丁超立方LHS', sub: '—', desc: '空间均匀填充，适合初始全局探索', icon: Columns3, active: false },
];

const hseItems = [
  { item: '高温焙烧650℃上限', status: '需会签', detail: '超温风险' },
  { item: 'H₂还原/丙烷可燃气', status: '需会签', detail: '防爆要求' },
  { item: '通风橱/气体报警', status: '已校验', detail: '设备就绪' },
  { item: '物料用量合规', status: '通过', detail: '无超量' },
];

const aiInsights: AIInsight[] = [
  { icon: 'lightbulb', content: '本批6个EI利用点、2个高σ探索点，兼顾开发与探索' },
  { icon: 'alert', content: '检测到高温(650℃)与H₂还原操作，已起草HSE会签单' },
  { icon: 'sync', content: 'EXP-512与EXP-518工艺参数接近，建议合并制备共用炉次' },
];

const aiPresets: AIPreset[] = [
  {
    q: '解读本批采集策略',
    a: '本批8个实验点中，6个采用EI（期望改进）策略——集中在预测转化率较高的区域（焙烧540-560℃、Sn:Pt 1.0-1.4）进行精细利用，追求局部最优；2个采用UCB↑σ（高不确定度探索）——部署在采样稀疏区（焙烧650℃高温端、WHSV 4.0 h⁻¹），旨在缩小代理模型的全局预测不确定度。这种「6+2」的利用-探索配比，在当前7轮迭代后属于最优分配。',
  },
  {
    q: 'HSE会签单详情',
    a: '已自动检测到以下高风险项并起草会签单：\n① 高温焙烧650℃ — 超出常规操作温度上限（600℃），需热防护审批\n② H₂还原操作 — 涉及可燃气体，需气体安全审批\n③ 丙烷脱氢反应 — 含可燃物料，需通风橱+气体报警确认\n会签单已推送至HSE主管，预计2小时内完成审批。',
  },
  {
    q: '哪些实验可以合并？',
    a: 'EXP-512（焙烧550℃/Sn:Pt 1.2/反应620℃）与EXP-518（焙烧545℃/Sn:Pt 1.1/反应625℃）的焙烧温度和Sn:Pt配比非常接近，可共用同一次炉次进行制备，节省约1.5小时炉时。建议先完成EXP-512的焙烧，利用余热过渡到EXP-518的温度区间。',
  },
];

/* ─── 状态配置 ─── */

const tagConfig: Record<string, { label: string; color: string; bg: string }> = {
  'ei-star': { label: 'EI★', color: 'text-amber', bg: 'bg-amber/10' },
  ei: { label: 'EI', color: 'text-primary', bg: 'bg-primary/10' },
  ucb: { label: 'UCB', color: 'text-purple-600', bg: 'bg-purple-50' },
};

const statusConfig: Record<ExpStatus, { color: string; bg: string }> = {
  '已排程': { color: 'text-muted-foreground', bg: 'bg-surface-2' },
  '待执行': { color: 'text-amber', bg: 'bg-amber/10' },
  '进行中': { color: 'text-green-600', bg: 'bg-green-50' },
  '已完成': { color: 'text-primary', bg: 'bg-primary/10' },
};

/* ─── 组件 ─── */

export default function ExperimentDesignPage() {
  const [factorFilter, setFactorFilter] = useState<'全部' | '连续' | '离散'>('全部');
  const [searchText, setSearchText] = useState('');
  const [newDesignOpen, setNewDesignOpen] = useState(false);

  const filteredFactors = factors.filter((f) =>
    (factorFilter === '全部' || f.type === factorFilter),
  );

  return (
    <div className="space-y-5">
      {/* 页面标题 + 操作 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-navy">实验设计</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-[12px] font-bold text-foreground hover:bg-surface-2 transition-colors">
            <Download className="h-3.5 w-3.5" /> 导出设计表
          </button>
          <Link
            href="/experiments"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12px] font-bold text-white hover:bg-primary/90 transition-colors"
          >
            <Send className="h-3.5 w-3.5" /> 进入实验管理
          </Link>
          <button onClick={() => setNewDesignOpen(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12px] font-bold text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> 新建设计
          </button>
        </div>
      </div>

      {/* 任务横幅 */}
      <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black text-navy">{taskBanner.name}</span>
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">{taskBanner.id}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">{taskBanner.method}</span>
              <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan">候选 {taskBanner.candidate}</span>
              <span className="text-[11px] text-muted-foreground">负责人: {taskBanner.owner}</span>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-[10px] font-bold text-cyan">
            来自{taskBanner.source}
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

      {/* 因子管理 + 设计方法 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 因子管理 */}
        <div className="col-span-2 rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">因子管理</h3>
            <div className="flex items-center gap-1">
              {(['全部', '连续', '离散'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFactorFilter(f)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[10px] font-bold transition-colors',
                    factorFilter === f
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
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">因子名称</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">类型</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">范围</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">当前最优</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">单位</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactors.map((factor) => {
                  const isBest = factor.name === '焙烧温度' || factor.name === 'Sn:Pt摩尔比';
                  return (
                    <tr
                      key={factor.name}
                      className={cn(
                        'border-b border-line/50 hover:bg-surface-2/30 transition-colors',
                        isBest && 'bg-amber/5 border-l-2 border-l-amber',
                      )}
                    >
                      <td className={cn('px-3 py-2.5 text-[13px] font-medium', isBest ? 'text-amber font-bold' : 'text-foreground')}>
                        {factor.name}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[9px] font-bold',
                          factor.type === '连续' ? 'bg-primary/10 text-primary' : 'bg-purple-50 text-purple-600',
                        )}>
                          {factor.type}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-muted-foreground">
                        {factor.min !== null ? `${factor.min} ~ ${factor.max}` : '—'}
                      </td>
                      <td className={cn('px-3 py-2.5 text-[13px] font-bold', isBest ? 'text-amber' : 'text-navy')}>
                        {factor.best}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-muted-foreground">{factor.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 设计方法选择 */}
        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <h3 className="mb-3 text-sm font-bold text-navy">设计方法</h3>
            <div className="space-y-2">
              {designMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={cn(
                      'rounded-md border p-3 cursor-pointer transition-colors',
                      method.active
                        ? 'border-primary bg-primary/5'
                        : 'border-line hover:border-primary/30',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-md',
                        method.active ? 'bg-primary text-white' : 'bg-surface-2 text-muted-foreground',
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-navy">{method.name}</span>
                          <span className="text-[10px] text-muted-foreground">{method.sub}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{method.desc}</p>
                      </div>
                      {method.active && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HSE 安全合规 */}
          <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy">HSE 安全合规</h3>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-bold text-destructive">2项待处理</span>
            </div>
            <div className="space-y-2">
              {hseItems.map((item) => (
                <div key={item.item} className="flex items-center gap-2 rounded-md bg-surface-2/50 px-3 py-2">
                  <div className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full',
                    item.status === '需会签' ? 'bg-destructive' : item.status === '已校验' ? 'bg-amber' : 'bg-green-500',
                  )} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-medium text-foreground block truncate">{item.item}</span>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold',
                    item.status === '需会签' ? 'bg-destructive/10 text-destructive' :
                    item.status === '已校验' ? 'bg-amber/10 text-amber' : 'bg-green-50 text-green-600',
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 实验矩阵 */}
      <div className="rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-navy">实验矩阵</h3>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">Batch-7 · 8个实验点</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" /> EI(利用)
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-2">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-500" /> UCB(探索)
            </span>
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
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">K%</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">预测转化率</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">采集策略</th>
                <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-faint">状态</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map((exp) => {
                const tc = tagConfig[exp.tagType];
                const sc = statusConfig[exp.status];
                return (
                  <tr key={exp.id} className="border-b border-line/50 hover:bg-surface-2/30 transition-colors cursor-pointer">
                    <td className="px-3 py-2.5 text-[12px] font-mono font-bold text-foreground">{exp.id}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{exp.params['焙烧℃']}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{exp.params['Sn:Pt']}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{exp.params['反应℃']}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{exp.params['WHSV']}</td>
                    <td className="px-3 py-2.5 text-[12px] text-foreground">{exp.params['K%']}</td>
                    <td className="px-3 py-2.5 text-[12px] font-medium text-foreground">{exp.pred}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold', tc.bg, tc.color)}>
                        {tc.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold', sc.bg, sc.color)}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 响应面可视化 + AI 助理 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 响应面等高线图 */}
        <div className="col-span-2 rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">响应面可视化</h3>
            <span className="text-[10px] text-muted-foreground">焙烧温度 × Sn:Pt</span>
          </div>
          <div className="flex items-center justify-center rounded-md bg-surface-2/50 border border-line/50 p-4">
            {/* SVG 等高线热力图 */}
            <svg viewBox="0 0 320 240" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
              {/* 背景 */}
              <rect x="40" y="10" width="260" height="200" fill="#F8FAFC" stroke="#E5E6EB" strokeWidth="0.5" />
              {/* 等高线区域 - 中心深色 */}
              <ellipse cx="170" cy="110" rx="90" ry="65" fill="#DBEAFE" opacity="0.5" />
              <ellipse cx="170" cy="110" rx="65" ry="45" fill="#93C5FD" opacity="0.5" />
              <ellipse cx="170" cy="110" rx="40" ry="28" fill="#3B82F6" opacity="0.4" />
              <ellipse cx="170" cy="110" rx="18" ry="13" fill="#1D4ED8" opacity="0.5" />
              {/* 等高线 */}
              <ellipse cx="170" cy="110" rx="90" ry="65" fill="none" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="3 2" />
              <ellipse cx="170" cy="110" rx="65" ry="45" fill="none" stroke="#3B82F6" strokeWidth="0.8" strokeDasharray="3 2" />
              <ellipse cx="170" cy="110" rx="40" ry="28" fill="none" stroke="#2563EB" strokeWidth="0.8" />
              {/* 已采样点 */}
              {[
                [80, 60], [100, 140], [140, 90], [150, 150], [160, 80], [180, 120],
                [200, 100], [220, 140], [240, 80], [130, 170], [250, 160], [110, 110],
                [190, 60], [210, 170], [170, 150], [230, 110],
              ].map(([x, y], i) => (
                <circle key={`s${i}`} cx={x} cy={y} r="3" fill="#94A3B8" opacity="0.6" />
              ))}
              {/* EI推荐点 (琥珀色星标) */}
              {[[145, 108], [190, 112], [155, 95], [175, 125], [165, 100], [180, 105]].map(([x, y], i) => (
                <g key={`ei${i}`} transform={`translate(${x},${y})`}>
                  <polygon points="0,-5 1.5,-1.5 5,-1.5 2.5,1 3.5,5 0,2.5 -3.5,5 -2.5,1 -5,-1.5 -1.5,-1.5" fill="#F59E0B" />
                </g>
              ))}
              {/* 高σ探索点 (紫色星标) */}
              {[[240, 55], [85, 165]].map(([x, y], i) => (
                <g key={`ucb${i}`} transform={`translate(${x},${y})`}>
                  <polygon points="0,-5 1.5,-1.5 5,-1.5 2.5,1 3.5,5 0,2.5 -3.5,5 -2.5,1 -5,-1.5 -1.5,-1.5" fill="#8B5CF6" />
                </g>
              ))}
              {/* 预测最优点 (琥珀色圆环) */}
              <circle cx="170" cy="110" r="7" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="170" cy="110" r="2" fill="#F59E0B" />
              {/* 坐标轴 */}
              <line x1="40" y1="210" x2="300" y2="210" stroke="#94A3B8" strokeWidth="1" />
              <line x1="40" y1="10" x2="40" y2="210" stroke="#94A3B8" strokeWidth="1" />
              {/* X轴刻度 */}
              <text x="40" y="225" fontSize="8" fill="#94A3B8" textAnchor="middle">400</text>
              <text x="105" y="225" fontSize="8" fill="#94A3B8" textAnchor="middle">475</text>
              <text x="170" y="225" fontSize="8" fill="#94A3B8" textAnchor="middle">550</text>
              <text x="235" y="225" fontSize="8" fill="#94A3B8" textAnchor="middle">625</text>
              <text x="300" y="225" fontSize="8" fill="#94A3B8" textAnchor="middle">700</text>
              <text x="170" y="238" fontSize="9" fill="#606266" textAnchor="middle">焙烧温度 (℃)</text>
              {/* Y轴刻度 */}
              <text x="35" y="213" fontSize="8" fill="#94A3B8" textAnchor="end">0.5</text>
              <text x="35" y="163" fontSize="8" fill="#94A3B8" textAnchor="end">0.9</text>
              <text x="35" y="113" fontSize="8" fill="#94A3B8" textAnchor="end">1.2</text>
              <text x="35" y="63" fontSize="8" fill="#94A3B8" textAnchor="end">1.6</text>
              <text x="35" y="15" fontSize="8" fill="#94A3B8" textAnchor="end">2.0</text>
              <text x="12" y="115" fontSize="9" fill="#606266" textAnchor="middle" transform="rotate(-90, 12, 115)">Sn:Pt 摩尔比</text>
            </svg>
          </div>
          {/* 图例 */}
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-400" /> 已采样
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-0 w-0" style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '5px solid #F59E0B' }} /> EI推荐
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-0 w-0" style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '5px solid #8B5CF6' }} /> 高σ探索
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-amber" /> 预测最优
            </span>
          </div>
        </div>

        {/* 做空间 AI 助理 */}
        <DoSpaceAIAssistant insights={aiInsights} presets={aiPresets} />
      </div>
      <NewDesignDialog open={newDesignOpen} onOpenChange={setNewDesignOpen} />
    </div>
  );
}

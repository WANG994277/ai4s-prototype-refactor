'use client';

import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, GitCompare, Search, Lightbulb,
  ExternalLink, ChevronRight, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { patents } from './data';

export default function CompetitiveAnalysisView() {
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [expandedIpc, setExpandedIpc] = useState<string | null>(null);
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);

  // Competitor ranking data
  const competitors = [
    { name: '中石化', count: 45, pct: 75, color: '#1d5fd6' },
    { name: 'ExxonMobil', count: 33, pct: 55, color: '#13b7c7' },
    { name: 'BASF', count: 24, pct: 40, color: '#17a56a' },
    { name: '中石油', count: 20, pct: 33, color: '#f59e0b' },
    { name: 'Shell', count: 18, pct: 30, color: '#7c5ce0' },
    { name: 'UOP', count: 12, pct: 20, color: '#ef4444' },
  ];

  // Tech blank data
  const techBlanks = [
    { title: '催化剂再生循环利用', ipc: 'B01J 38/00', reason: '现有专利缺乏系统性再生循环方案', patentCount: 2, hasActive: false },
    { title: '生物基催化材料', ipc: 'B01J 23/00', reason: '该方向属于新兴领域，专利布局尚处早期', patentCount: 3, hasActive: true },
    { title: '低温MTO工艺', ipc: 'B01J 29/40', reason: '传统MTO均在高温条件下进行，低温路线尚未被覆盖', patentCount: 1, hasActive: false },
    { title: '核壳结构分子筛', ipc: 'B01J 29/00', reason: '虽有多篇专利提及，但均未系统性解决壳层均匀性问题', patentCount: 5, hasActive: true },
  ];

  // Layout overlap data
  const ipcOverlap = [
    { name: '中石化', pct: 75, details: ['B01J 29/00 分子筛催化剂', 'B01J 23/00 非分子筛催化剂', 'C10G 51/00 催化裂化'] },
    { name: 'ExxonMobil', pct: 55, details: ['B01J 29/00 分子筛催化剂', 'C10G 51/00 催化裂化'] },
    { name: 'BASF', pct: 40, details: ['B01J 23/00 非分子筛催化剂'] },
  ];

  const keywordOverlap = [
    { name: '中石化', pct: 62, details: ['ZSM-5', '磷改性', '催化裂化', '丙烯选择性'] },
    { name: 'ExxonMobil', pct: 48, details: ['ZSM-5', '催化裂化', '丙烯'] },
    { name: 'BASF', pct: 35, details: ['分子筛改性', '金属氧化物'] },
  ];

  // Trend data
  const trendYears = ['2019', '2020', '2021', '2022', '2023', '2024'];
  const trendData = {
    '中石化': [8, 12, 15, 18, 22, 25],
    'ExxonMobil': [6, 8, 10, 9, 12, 14],
    'BASF': [4, 5, 6, 8, 7, 10],
  };
  const maxTrendVal = Math.max(...Object.values(trendData).flat());

  // Milestones
  const milestones = [
    { year: '2019', event: '磷改性ZSM-5催化剂首次产业化', patent: 'CN201910XXXXXX' },
    { year: '2020', event: '核壳结构分子筛用于MTO反应', patent: 'US2020/0XXXXXX' },
    { year: '2021', event: '双功能催化剂催化裂化技术突破', patent: 'CN202110XXXXXX' },
    { year: '2022', event: '原位合成法实现低温制备分子筛', patent: 'EP2022/0XXXXXX' },
    { year: '2023', event: '磷-稀土协同改性提升水热稳定性', patent: 'CN202310XXXXXX' },
    { year: '2024', event: 'AI辅助催化剂配方优化', patent: 'CN202410XXXXXX' },
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto bg-background">
      {/* 分析范围 */}
      <div className="shrink-0 border-b border-outline/10 bg-surface px-5 py-3 flex items-center justify-between">
        <span className="text-[12px] text-on-surface-variant">
          分析范围：当前检索结果（<strong className="text-foreground">{patents.length}</strong>件）
        </span>
        <button className="rounded-md border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
          切换数据集
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* 上半区：竞争格局 + 技术空白 */}
        <div className="grid grid-cols-2 gap-5">
          {/* 竞争格局 */}
          <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
            <h3 className="mb-4 text-[14px] font-bold text-navy flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
              </div>
              竞争格局
            </h3>
            <p className="text-[11px] text-on-surface-variant mb-4">申请人排名柱状图（点击下钻专利列表）</p>
            <div className="space-y-3">
              {competitors.map((comp) => (
                <div key={comp.name} className="cursor-pointer group" onClick={() => setSelectedApplicant(selectedApplicant === comp.name ? null : comp.name)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors">{comp.name}</span>
                    <span className="text-[11px] text-on-surface-variant">{comp.count}件</span>
                  </div>
                  <div className="h-6 rounded-r-md bg-surface-container overflow-hidden">
                    <div className="h-full rounded-r-md transition-all duration-300" style={{ width: `${comp.pct}%`, backgroundColor: comp.color, opacity: 0.65 }} />
                  </div>
                </div>
              ))}
            </div>
            {selectedApplicant && (
              <div className="mt-4 rounded-lg border border-outline/15 bg-surface-container/50 p-3">
                <p className="text-[12px] text-primary font-semibold">{selectedApplicant} 专利列表</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">共 {competitors.find(c => c.name === selectedApplicant)?.count} 件专利</p>
                <button className="mt-2 flex items-center gap-1 text-[11px] text-primary hover:underline font-medium">
                  查看完整列表 <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* 技术空白分析 */}
          <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
            <h3 className="mb-4 text-[14px] font-bold text-navy flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-info/10">
                <Search className="h-3.5 w-3.5 text-info" />
              </div>
              技术空白分析
            </h3>
            <div className="space-y-3">
              {techBlanks.map((blank, i) => (
                <div key={i} className="rounded-lg border border-outline/10 p-4 hover:shadow-card transition-shadow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                      blank.patentCount <= 2 ? 'bg-success-bg text-success' : 'bg-warning-bg text-amber'
                    )}>
                      {blank.patentCount <= 2 ? '空白' : '稀疏'}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">IPC: {blank.ipc}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-foreground">{blank.title}</p>
                  <p className="text-[12px] text-on-surface-variant mt-1 leading-relaxed">{blank.reason}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1.5">相关专利数：{blank.patentCount}件 {!blank.hasActive && '(无有效专利)'}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex items-center gap-1 rounded-md border border-outline/20 px-2.5 py-1 text-[11px] text-foreground hover:bg-surface-container transition-colors">
                      查看相关专利
                    </button>
                    <button className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                      生成交底书 <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 下半区：布局对比 + 趋势 */}
        <div className="grid grid-cols-2 gap-5">
          {/* 布局对比分析 */}
          <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
            <h3 className="mb-4 text-[14px] font-bold text-navy flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <GitCompare className="h-3.5 w-3.5 text-primary" />
              </div>
              布局对比分析
            </h3>

            {/* 维度一：IPC分类重叠度 */}
            <div className="mb-5">
              <p className="text-[12px] font-semibold text-foreground mb-3">维度一：IPC 分类重叠度</p>
              <div className="space-y-2">
                {ipcOverlap.map((item) => (
                  <OverlapRow key={`ipc-${item.name}`} name={item.name} pct={item.pct} details={item.details} color="#1d5fd6" expanded={expandedIpc === item.name} onToggle={() => setExpandedIpc(expandedIpc === item.name ? null : item.name)} />
                ))}
              </div>
            </div>

            {/* 维度二：关键词重叠度 */}
            <div>
              <p className="text-[12px] font-semibold text-foreground mb-3">维度二：技术关键词重叠度</p>
              <div className="space-y-2">
                {keywordOverlap.map((item) => (
                  <OverlapRow key={`kw-${item.name}`} name={item.name} pct={item.pct} details={item.details} color="#13b7c7" expanded={expandedKeyword === item.name} onToggle={() => setExpandedKeyword(expandedKeyword === item.name ? null : item.name)} />
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：趋势图 + 时间线 */}
          <div className="space-y-5">
            {/* 申请趋势图 */}
            <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-navy flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  </div>
                  申请趋势图
                </h3>
                <select className="rounded-md border border-outline/15 bg-surface-container px-2 py-1 text-[11px] text-foreground focus:outline-none">
                  <option>全部IPC</option><option>B01J 催化剂</option><option>C10G 石油炼制</option>
                </select>
              </div>
              {/* SVG 折线图 */}
              <div className="h-[160px]">
                <svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="30" y1={10 + i * 32} x2="310" y2={10 + i * 32} stroke="var(--color-outline)" strokeWidth="0.5" opacity="0.2" />
                  ))}
                  {[25, 18, 12, 6, 0].map((v, i) => (
                    <text key={i} x="25" y={14 + i * 32} textAnchor="end" fontSize="7" fill="var(--color-on-surface-variant)">{v}</text>
                  ))}
                  {trendYears.map((y, i) => (
                    <text key={i} x={30 + i * 56} y="145" textAnchor="middle" fontSize="7" fill="var(--color-on-surface-variant)">{y}</text>
                  ))}
                  {Object.entries(trendData).map(([name, data], idx) => {
                    const colors = ['#1d5fd6', '#13b7c7', '#17a56a'];
                    const points = data.map((v, i) => `${30 + i * 56},${145 - (v / maxTrendVal) * 125}`).join(' ');
                    return <polyline key={name} points={points} fill="none" stroke={colors[idx]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
                  })}
                </svg>
              </div>
              <div className="mt-3 flex gap-4">
                {Object.keys(trendData).map((name, i) => {
                  const colors = ['#1d5fd6', '#13b7c7', '#17a56a'];
                  return (
                    <span key={name} className="flex items-center gap-1.5 text-[11px] text-foreground">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[i] }} />{name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 技术演进时间线 */}
            <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
              <h3 className="mb-4 text-[14px] font-bold text-navy">技术演进时间线</h3>
              <div className="relative pl-5">
                <div className="absolute left-[5px] top-1 bottom-1 w-[1.5px] bg-primary/20" />
                {milestones.map((m, i) => (
                  <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    <div className="absolute left-[-6px] top-1.5 h-[10px] w-[10px] rounded-full bg-primary/20 ring-2 ring-primary/10" />
                    <div className="ml-3">
                      <span className="text-[11px] font-bold text-primary">{m.year}</span>
                      <p className="text-[12px] text-foreground leading-relaxed">{m.event}</p>
                      <span className="text-[10px] text-on-surface-variant">{m.patent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlapRow({ name, pct, details, color, expanded, onToggle }: {
  name: string; pct: number; details: string[]; color: string; expanded: boolean; onToggle: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 cursor-pointer group" onClick={onToggle}>
        <span className="text-[12px] font-medium text-foreground w-24 shrink-0 group-hover:text-primary transition-colors">{name}</span>
        <div className="flex-1 h-5 bg-surface-container rounded-r-full overflow-hidden">
          <div className="h-full rounded-r-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.55 }} />
        </div>
        <span className="text-[12px] font-bold text-foreground w-10 text-right">{pct}%</span>
        <button className="text-[11px] text-primary hover:underline shrink-0 font-medium">详情</button>
      </div>
      {expanded && (
        <div className="ml-24 mt-2 rounded-lg bg-surface-container/50 p-3 border border-outline/10 space-y-1">
          {details.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px]">
              <ChevronRight className="h-3 w-3 text-on-surface-variant" />
              <span className="text-foreground">{d}</span>
            </div>
          ))}
          <button className="mt-1 text-[11px] text-primary hover:underline font-medium">查看对应专利列表</button>
        </div>
      )}
    </div>
  );
}

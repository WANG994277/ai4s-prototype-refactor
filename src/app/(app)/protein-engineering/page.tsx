'use client';

import React from 'react';
import {
  Dna,
  Pencil,
  ChevronRight,
  FlaskConical,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== Types =====
interface HeatmapCell {
  value: string;
  bg: string;
  color: string;
}

interface Variant {
  id: string;
  mutation: string;
  fitness: number;
  fitnessColor: string;
  plddt: number;
  status: 'preferred' | 'verifying' | 'filtered' | 'pending';
  statusConfig: { label: string; bg: string; text: string };
}

// ===== Mock Data =====
const stages = [
  { num: 1, label: '序列设计', desc: 'ESM-2 / ProteinMPNN', status: '已完成3个变体设计', statusColor: 'text-success' },
  { num: 2, label: '结构预测', desc: 'AlphaFold + pLDDT', status: '结构预测中…', statusColor: 'text-amber' },
  { num: 3, label: '适应度评分', desc: 'Fitness Scoring', status: '待执行', statusColor: 'text-faint' },
  { num: 4, label: '变体筛选', desc: 'Variant Selection', status: '待执行', statusColor: 'text-faint' },
];

const stageColors = ['#1d5fd6', '#13b7c7', '#17a56a', '#f59e0b'];

const baselineMetrics = [
  { value: '68.5°C', label: 'Tm值' },
  { value: '100%', label: '相对活性（基准）' },
  { value: '3.2:1', label: '选择性' },
  { value: '87.3', label: 'pLDDT' },
];

const aminoAcids = ['A', 'D', 'E', 'K', 'R', 'N', 'Q'];
const residues = ['R15', 'R18', 'R32', 'R45', 'R67'];

const heatmapData: HeatmapCell[][] = [
  // R15
  [
    { value: '-0.8', bg: '#fef2f2', color: '#991b1b' },
    { value: '-0.3', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.4', bg: '#f0fdf4', color: '#166534' },
    { value: '+1.2', bg: '#dcfce7', color: '#166534' },
    { value: '0.0', bg: '#ffffff', color: '#374151' },
    { value: '-0.5', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.2', bg: '#f0fdf4', color: '#166534' },
  ],
  // R18
  [
    { value: '-1.1', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.9', bg: '#dcfce7', color: '#166534' },
    { value: '-0.2', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.3', bg: '#f0fdf4', color: '#166534' },
    { value: '+0.1', bg: '#ffffff', color: '#374151' },
    { value: '-0.7', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.5', bg: '#f0fdf4', color: '#166534' },
  ],
  // R32
  [
    { value: '+0.6', bg: '#f0fdf4', color: '#166534' },
    { value: '-0.4', bg: '#fef2f2', color: '#991b1b' },
    { value: '+1.1', bg: '#dcfce7', color: '#166534' },
    { value: '-0.9', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.3', bg: '#f0fdf4', color: '#166534' },
    { value: '0.0', bg: '#ffffff', color: '#374151' },
    { value: '-0.6', bg: '#fef2f2', color: '#991b1b' },
  ],
  // R45
  [
    { value: '+0.8', bg: '#dcfce7', color: '#166534' },
    { value: '-1.3', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.4', bg: '#f0fdf4', color: '#166534' },
    { value: '-0.5', bg: '#fef2f2', color: '#991b1b' },
    { value: '-0.2', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.7', bg: '#f0fdf4', color: '#166534' },
    { value: '+0.1', bg: '#ffffff', color: '#374151' },
  ],
  // R67
  [
    { value: '-0.6', bg: '#fef2f2', color: '#991b1b' },
    { value: '+0.5', bg: '#f0fdf4', color: '#166534' },
    { value: '-0.3', bg: '#fef2f2', color: '#991b1b' },
    { value: '0.0', bg: '#ffffff', color: '#374151' },
    { value: '+0.4', bg: '#f0fdf4', color: '#166534' },
    { value: '+1.0', bg: '#dcfce7', color: '#166534' },
    { value: '-0.8', bg: '#fef2f2', color: '#991b1b' },
  ],
];

const variants: Variant[] = [
  { id: 'V-001', mutation: 'R15K', fitness: 1.25, fitnessColor: 'text-chart-3', plddt: 89.2, status: 'preferred', statusConfig: { label: '优选', bg: 'bg-success/15', text: 'text-success' } },
  { id: 'V-002', mutation: 'R18D', fitness: 0.89, fitnessColor: 'text-foreground', plddt: 85.1, status: 'verifying', statusConfig: { label: '验证中', bg: 'bg-warning/15', text: 'text-amber' } },
  { id: 'V-003', mutation: 'R32E', fitness: 1.12, fitnessColor: 'text-chart-3', plddt: 87.8, status: 'preferred', statusConfig: { label: '优选', bg: 'bg-success/15', text: 'text-success' } },
  { id: 'V-004', mutation: 'R45A', fitness: 0.72, fitnessColor: 'text-muted-foreground', plddt: 82.3, status: 'filtered', statusConfig: { label: '已筛选', bg: 'bg-surface-2', text: 'text-faint' } },
  { id: 'V-005', mutation: 'R67N', fitness: 0.95, fitnessColor: 'text-foreground', plddt: 86.5, status: 'pending', statusConfig: { label: '待验证', bg: 'bg-primary/10', text: 'text-primary' } },
];

// ===== Component =====
export default function ProteinEngineeringPage() {
  return (
    <div className="space-y-5">
      {/* 1. Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">蛋白质工程</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]">
          <Dna className="h-3.5 w-3.5" />新建设计
        </button>
      </div>

      {/* 2. Target Protein Info */}
      <div className="rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="flex gap-5">
          {/* Left 60%: Protein Sequence */}
          <div className="w-[60%]">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">目标蛋白序列</span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">PETase</span>
            </div>
            <div className="rounded-md bg-surface-2 p-3 font-mono text-sm leading-relaxed text-foreground">
              <span>MKTAYIAKQRQISF</span>
              <span className="rounded-sm bg-amber/30 px-0.5 font-bold text-navy" title="活性位点">VKSH</span>
              <span>FSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[11px] text-faint">活性位点标注：</span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber/30" />
                <span className="text-muted-foreground">位置 15-18 (VKSH)</span>
              </span>
            </div>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-md border-none bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-surface-2/80 active:scale-[0.98]">
              <Pencil className="h-3 w-3" />编辑序列
            </button>
          </div>

          {/* Right 40%: Baseline Metrics */}
          <div className="w-[40%]">
            <div className="grid grid-cols-2 gap-3">
              {baselineMetrics.map((metric) => (
                <div key={metric.label} className="rounded-md bg-surface-2 p-3">
                  <div className="text-xl font-black text-navy">{metric.value}</div>
                  <div className="mt-0.5 text-[11px] text-faint">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ML-Guided Directed Evolution */}
      <div className="rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="mb-4 text-base font-semibold text-foreground">ML引导定向进化</div>
        <div className="flex items-center justify-between px-4">
          {stages.map((stage, idx) => (
            <React.Fragment key={stage.num}>
              <div className="group flex cursor-pointer flex-col items-center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition-shadow group-hover:shadow-md"
                  style={{ background: stageColors[idx] }}
                >
                  {stage.num}
                </div>
                <div className="mt-2 text-center text-xs font-semibold text-foreground">{stage.label}</div>
                <div className="text-center text-[10px] text-faint">{stage.desc}</div>
                <div className={cn('mt-1.5 text-center text-[10px] font-medium', stage.statusColor)}>{stage.status}</div>
              </div>
              {idx < stages.length - 1 && (
                <div className="mx-2 flex items-center text-faint">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. Dual Column: Heatmap + Variant Library */}
      <div className="flex gap-5">
        {/* Left 60%: Mutation Heatmap */}
        <div className="w-[60%] rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">突变效果热图</span>
          </div>
          <div className="mb-3 text-xs text-faint">残基 × 氨基酸矩阵</div>

          {/* Legend */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] text-faint">负面</span>
            <div className="h-3 w-28 rounded-full" style={{ background: 'linear-gradient(to right, #ef4444, #ffffff, #17a56a)' }} />
            <span className="text-[10px] text-faint">正面</span>
          </div>

          {/* Heatmap Grid */}
          <div className="inline-block">
            {/* Header row */}
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: '44px repeat(7, 35px)' }}>
              <div className="h-[35px]" />
              {aminoAcids.map((aa) => (
                <div key={aa} className="flex h-[35px] items-center justify-center text-[10px] font-bold text-faint">{aa}</div>
              ))}
            </div>
            {/* Data rows */}
            {residues.map((residue, rowIdx) => (
              <div key={residue} className="grid gap-[2px]" style={{ gridTemplateColumns: '44px repeat(7, 35px)' }}>
                <div className="flex h-[35px] items-center justify-end pr-1 text-[10px] font-bold text-muted-foreground">{residue}</div>
                {heatmapData[rowIdx].map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex h-[35px] w-[35px] items-center justify-center rounded-sm text-[10px] font-bold"
                    style={{ background: cell.bg, color: cell.color }}
                  >
                    {cell.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right 40%: Variant Library */}
        <div className="flex w-[40%] flex-col rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">变体文库</span>
            <button className="text-xs font-medium text-primary hover:underline">管理</button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[60px_70px_70px_60px_1fr] gap-2 rounded-t-md bg-surface-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-faint">
            <span>变体ID</span>
            <span>突变</span>
            <span>适应度</span>
            <span>pLDDT</span>
            <span>状态</span>
          </div>

          {/* Variant Rows */}
          <div className="rounded-b-md">
            {variants.map((variant, idx) => (
              <div
                key={variant.id}
                className={cn(
                  'grid grid-cols-[60px_70px_70px_60px_1fr] items-center gap-2 px-3 py-2.5 transition-colors hover:bg-surface-2/50',
                  idx < variants.length - 1 && 'border-b border-line-2/20'
                )}
              >
                <span className="text-xs font-medium text-foreground">{variant.id}</span>
                <span className="font-mono text-xs text-foreground">{variant.mutation}</span>
                <span className={cn('text-xs font-semibold', variant.fitnessColor)}>{variant.fitness.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">{variant.plddt}</span>
                <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold', variant.statusConfig.bg, variant.statusConfig.text)}>
                  {variant.statusConfig.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]">
              推送优选至做空间
            </button>
            <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <FlaskConical className="h-3 w-3" />湿实验数据对接
            </a>
          </div>
        </div>
      </div>

      {/* 5. Wet Lab Data Rollback */}
      <div className="rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]" style={{ borderLeft: '3px solid #7c5ce0' }}>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">实验数据回滚</span>
          <span className="inline-flex items-center rounded-full bg-purple/10 px-2 py-0.5 text-[9px] font-bold text-purple">模型迭代</span>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">将湿实验验证数据回传至模型，触发新一轮主动学习迭代</p>
        <div className="mb-3 flex items-center gap-3 rounded-md bg-surface-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">最近回滚：V-001验证结果</span>
            <span className="ml-2 text-sm font-semibold text-chart-3">活性提升25%</span>
            <span className="ml-2 text-xs text-faint">已触发模型更新</span>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-md border-none bg-surface-2 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-surface-2/80 active:scale-[0.98]">
          <Upload className="h-3.5 w-3.5" />上传实验数据
        </button>
      </div>
    </div>
  );
}

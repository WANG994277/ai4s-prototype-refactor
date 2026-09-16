'use client';

import React, { useState } from 'react';
import { LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== Types =====
type ModelStatus = 'deployed' | 'training' | 'archived';

interface Model {
  name: string;
  version: string;
  r2: number;
  rmse: number;
  samples: number;
  status: ModelStatus;
}

interface Experiment {
  id: string;
  eiScore: number;
  predicted: number;
  uncertainty: number;
  params: string;
}

// ===== Mock Data =====
const kpis = [
  { value: '0.94', label: 'R² 精度', color: '#1d5fd6' },
  { value: '120x', label: '替代加速比', color: '#13b7c7' },
  { value: '1,200', label: '样本数', color: '#17a56a' },
  { value: '8 轮', label: '主动学习轮次', color: '#f59e0b' },
];

const models: Model[] = [
  { name: 'ZSM-5活性预测代理', version: 'v2.1', r2: 0.94, rmse: 0.082, samples: 1200, status: 'deployed' },
  { name: '催化剂稳定性代理', version: 'v1.3', r2: 0.89, rmse: 0.115, samples: 850, status: 'training' },
  { name: '吸附能预测代理', version: 'v3.0', r2: 0.91, rmse: 0.098, samples: 2100, status: 'deployed' },
  { name: '反应路径代理', version: 'v0.8', r2: 0.76, rmse: 0.185, samples: 320, status: 'archived' },
];

const modelStatusConfig: Record<ModelStatus, { label: string; bg: string; text: string }> = {
  deployed: { label: '已部署', bg: 'bg-success/15', text: 'text-success' },
  training: { label: '训练中', bg: 'bg-warning/15', text: 'text-amber' },
  archived: { label: '归档', bg: 'bg-surface-2', text: 'text-faint' },
};

// Active learning loop nodes
const loopNodes = [
  { num: 1, label: '代理评估', color: '#1d5fd6', pos: { top: '0', left: '50%', transform: 'translateX(-50%)' } },
  { num: 2, label: '贝叶斯采集', color: '#13b7c7', pos: { top: '68px', right: '5px' } },
  { num: 3, label: '实验执行', color: '#17a56a', pos: { bottom: '18px', right: '22px' } },
  { num: 4, label: '数据标注', color: '#f59e0b', pos: { bottom: '18px', left: '22px' } },
  { num: 5, label: '模型更新', color: '#7c5ce0', pos: { top: '68px', left: '5px' } },
];

const experiments: Experiment[] = [
  { id: 'EXP-0847', eiScore: 0.92, predicted: 3.41, uncertainty: 0.28, params: 'Si/Al=25, T=450°C' },
  { id: 'EXP-0851', eiScore: 0.87, predicted: 2.98, uncertainty: 0.31, params: 'Si/Al=40, T=500°C' },
  { id: 'EXP-0839', eiScore: 0.81, predicted: 4.12, uncertainty: 0.35, params: 'Si/Al=15, T=400°C' },
  { id: 'EXP-0856', eiScore: 0.74, predicted: 1.87, uncertainty: 0.22, params: 'Si/Al=30, T=550°C' },
  { id: 'EXP-0842', eiScore: 0.68, predicted: 5.03, uncertainty: 0.19, params: 'Si/Al=50, T=475°C' },
];

// Model accuracy trend data
const trendLine1 = '50,240 105,181.3 160,144.7 215,115.3 270,89.7 325,74.3 380,59 435,44.3 490,37.3';
const trendLine2 = '50,232.7 105,210 160,181.3 215,159.3 270,137.3 325,115.3 380,100.7 435,89.7 490,81.3';
const trendDots1 = [
  { x: 50, y: 240 }, { x: 105, y: 181.3 }, { x: 160, y: 144.7 }, { x: 215, y: 115.3 },
  { x: 270, y: 89.7 }, { x: 325, y: 74.3 }, { x: 380, y: 59 }, { x: 435, y: 44.3 }, { x: 490, y: 37.3 },
];
const trendDots2 = [
  { x: 50, y: 232.7 }, { x: 105, y: 210 }, { x: 160, y: 181.3 }, { x: 215, y: 159.3 },
  { x: 270, y: 137.3 }, { x: 325, y: 115.3 }, { x: 380, y: 100.7 }, { x: 435, y: 89.7 }, { x: 490, y: 81.3 },
];

// Prediction vs experiment scatter points
const scatterDots = [
  [78, 268], [99, 252], [127, 236], [148, 215], [176, 196], [190, 188],
  [211, 166], [232, 155], [253, 142], [274, 128], [295, 112], [316, 98],
  [337, 82], [358, 61], [379, 42],
];

// Error distribution bars
const errorBars = [
  { label: '-0.2', count: 3, height: 26, bg: 'bg-chart-1/70' },
  { label: '-0.15', count: 12, height: 105, bg: 'bg-chart-1/70' },
  { label: '-0.1', count: 28, height: 170, bg: 'bg-chart-2/70' },
  { label: '-0.05', count: 42, height: 220, bg: 'bg-chart-2' },
  { label: '0', count: 38, height: 199, bg: 'bg-chart-2' },
  { label: '+0.05', count: 15, height: 131, bg: 'bg-chart-1/70' },
  { label: '+0.1', count: 5, height: 44, bg: 'bg-chart-1/70' },
];

// ===== Component =====
export default function ProxyModelPage() {
  const [acqFn, setAcqFn] = useState<'EI' | 'UCB'>('EI');

  return (
    <div className="space-y-5">
      {/* 1. Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">代理模型</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]">
          <LineChart className="h-3.5 w-3.5" />新建模型
        </button>
      </div>

      {/* 2. KPI Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-lg border border-line-2/20 bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]"
          >
            <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: kpi.color }} />
            <div className="pl-3">
              <p className="mb-1 text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-black text-navy">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Dual-Column (55% / 45%) */}
      <div className="flex gap-5">
        {/* Left 55% */}
        <div className="flex w-[55%] flex-col gap-5">
          {/* Model Registry */}
          <div className="overflow-hidden rounded-lg border border-line-2/20 bg-white shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
            <div className="flex items-center justify-between border-b border-line-2/20 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">模型注册表</h2>
              <a href="#" className="text-sm font-medium text-primary hover:underline">训练新模型</a>
            </div>
            {/* Header */}
            <div className="grid grid-cols-7 bg-surface-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>模型名称</span>
              <span>版本</span>
              <span>R²</span>
              <span>RMSE</span>
              <span>样本数</span>
              <span>状态</span>
              <span>操作</span>
            </div>
            {/* Rows */}
            <div>
              {models.map((model, idx) => {
                const sc = modelStatusConfig[model.status];
                return (
                  <div
                    key={model.name}
                    className={cn(
                      'grid grid-cols-7 items-center px-5 py-3 transition-colors hover:bg-surface-2/50',
                      idx < models.length - 1 && 'border-b border-line-2/20'
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{model.name}</span>
                    <span className="text-sm text-muted-foreground">{model.version}</span>
                    <span className="text-sm font-semibold text-foreground">{model.r2}</span>
                    <span className="text-sm text-muted-foreground">{model.rmse}</span>
                    <span className="text-sm text-muted-foreground">{model.samples.toLocaleString()}</span>
                    <span className={cn('inline-flex w-fit items-center rounded-sm px-2 py-0.5 text-xs font-medium', sc.bg, sc.text)}>
                      {sc.label}
                    </span>
                    <button className="w-fit text-sm font-medium text-primary hover:underline">查看</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Accuracy Trend */}
          <div className="rounded-lg border border-line-2/20 bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
            <h2 className="mb-4 text-base font-semibold text-foreground">模型精度趋势</h2>
            <svg viewBox="0 0 520 280" className="w-full" style={{ maxHeight: '280px' }}>
              {/* Axes */}
              <line x1="50" y1="20" x2="50" y2="240" stroke="#dce6f5" strokeWidth="1" />
              <line x1="50" y1="240" x2="490" y2="240" stroke="#dce6f5" strokeWidth="1" />
              {/* Horizontal grid */}
              {[240, 203.3, 166.7, 130, 93.3, 56.7, 20].map((y) => (
                <line key={y} x1="50" y1={y} x2="490" y2={y} stroke="#dce6f5" strokeWidth="0.5" strokeDasharray="4,3" />
              ))}
              {/* Vertical grid */}
              {[105, 160, 215, 270, 325, 380, 435, 490].map((x) => (
                <line key={x} x1={x} y1="20" x2={x} y2="240" stroke="#dce6f5" strokeWidth="0.5" strokeDasharray="4,3" />
              ))}
              {/* Y labels */}
              {[
                { y: 243, v: '0.70' }, { y: 206.3, v: '0.75' }, { y: 169.7, v: '0.80' },
                { y: 133, v: '0.85' }, { y: 96.3, v: '0.90' }, { y: 59.7, v: '0.95' }, { y: 23, v: '1.00' },
              ].map((t) => (
                <text key={t.v} x="45" y={t.y} textAnchor="end" fontSize="10" fill="#63718c"> {t.v}</text>
              ))}
              {/* X labels */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <text key={v} x={50 + v * 55} y="258" textAnchor="middle" fontSize="10" fill="#63718c"> {v}</text>
              ))}
              {/* Axis names */}
              <text x="270" y="275" textAnchor="middle" fontSize="11" fill="#63718c"> 主动学习轮次</text>
              <text x="15" y="130" textAnchor="middle" fontSize="11" fill="#63718c" transform="rotate(-90,15,130)"> R²</text>
              {/* Line 1 */}
              <polyline points={trendLine1} fill="none" stroke="#1d5fd6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {trendDots1.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="3.5" fill="#1d5fd6" />
              ))}
              {/* Line 2 */}
              <polyline points={trendLine2} fill="none" stroke="#13b7c7" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {trendDots2.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="3.5" fill="#13b7c7" />
              ))}
              {/* Legend */}
              <rect x="330" y="265" width="12" height="3" rx="1.5" fill="#1d5fd6" />
              <text x="346" y="270" fontSize="10" fill="#63718c"> ZSM-5活性</text>
              <rect x="415" y="265" width="12" height="3" rx="1.5" fill="#13b7c7" />
              <text x="431" y="270" fontSize="10" fill="#63718c"> 催化剂稳定性</text>
            </svg>
          </div>
        </div>

        {/* Right 45% */}
        <div className="flex w-[45%] flex-col gap-5">
          {/* Active Learning Loop */}
          <div className="rounded-lg border border-line-2/20 bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
            <h2 className="mb-4 text-base font-semibold text-foreground">主动学习闭环</h2>
            <div className="relative mx-auto" style={{ width: '300px', height: '260px' }}>
              {/* Center */}
              <div className="absolute flex flex-col items-center justify-center" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <span className="text-2xl font-black text-navy">8</span>
                <span className="text-xs text-muted-foreground">当前轮次</span>
              </div>
              {/* Nodes */}
              {loopNodes.map((node) => (
                <div key={node.num} className="absolute flex flex-col items-center" style={node.pos}>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold"
                    style={{ background: `${node.color}15`, color: node.color, borderColor: node.color }}
                  >
                    {node.num}
                  </div>
                  <span className="mt-1 text-xs font-medium text-foreground">{node.label}</span>
                </div>
              ))}
              {/* Arrows */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 300 260">
                <defs>
                  <marker id="arrowhead-pm" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#8a97ad" />
                  </marker>
                </defs>
                <line x1="165" y1="45" x2="218" y2="82" stroke="#8a97ad" strokeWidth="1.5" markerEnd="url(#arrowhead-pm)" />
                <line x1="248" y1="120" x2="250" y2="168" stroke="#8a97ad" strokeWidth="1.5" markerEnd="url(#arrowhead-pm)" />
                <line x1="220" y1="198" x2="168" y2="198" stroke="#8a97ad" strokeWidth="1.5" markerEnd="url(#arrowhead-pm)" />
                <line x1="82" y1="198" x2="52" y2="168" stroke="#8a97ad" strokeWidth="1.5" markerEnd="url(#arrowhead-pm)" />
                <line x1="80" y1="82" x2="135" y2="45" stroke="#8a97ad" strokeWidth="1.5" markerEnd="url(#arrowhead-pm)" />
              </svg>
            </div>
          </div>

          {/* Next Batch Experiment Recommendation */}
          <div className="overflow-hidden rounded-lg border border-line-2/20 bg-white shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
            <div className="border-b border-line-2/20 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">下一批实验推荐</h2>
                <span className="inline-flex items-center rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {acqFn === 'EI' ? 'EI期望改进' : 'UCB置信上界'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAcqFn('EI')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    acqFn === 'EI' ? 'bg-primary text-white' : 'bg-surface-2 text-muted-foreground hover:bg-surface-2/80'
                  )}
                >
                  EI期望改进
                </button>
                <button
                  onClick={() => setAcqFn('UCB')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    acqFn === 'UCB' ? 'bg-primary text-white' : 'bg-surface-2 text-muted-foreground hover:bg-surface-2/80'
                  )}
                >
                  UCB置信上界
                </button>
              </div>
            </div>
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-surface-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>实验ID</span>
              <span>EI得分</span>
              <span>预测值</span>
              <span>不确定度</span>
              <span>参数摘要</span>
            </div>
            {/* Rows */}
            <div className="divide-y divide-line-2/20">
              {experiments.map((exp) => (
                <div key={exp.id} className="grid grid-cols-5 items-center px-5 py-2.5 transition-colors hover:bg-surface-2/50">
                  <span className="text-sm font-medium text-foreground">{exp.id}</span>
                  <span className="text-sm font-semibold text-chart-1">{exp.eiScore.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">{exp.predicted}</span>
                  <span className="text-sm text-muted-foreground">{exp.uncertainty}</span>
                  <span className="text-xs text-muted-foreground">{exp.params}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-line-2/20 px-5 py-3">
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]">
                执行推荐实验
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Dual-Column (50% / 50%) */}
      <div className="flex gap-5">
        {/* Left: Prediction vs Experiment Scatter */}
        <div className="w-1/2 rounded-lg border border-line-2/20 bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
          <h2 className="mb-4 text-base font-semibold text-foreground">预测值 vs 实验值对比</h2>
          <svg viewBox="0 0 420 340" className="w-full" style={{ maxHeight: '340px' }}>
            {/* Axes */}
            <line x1="50" y1="20" x2="50" y2="290" stroke="#dce6f5" strokeWidth="1" />
            <line x1="50" y1="290" x2="400" y2="290" stroke="#dce6f5" strokeWidth="1" />
            {/* Grid */}
            {[236, 182, 128, 74, 20].map((y) => (
              <line key={y} x1="50" y1={y} x2="400" y2={y} stroke="#dce6f5" strokeWidth="0.5" strokeDasharray="4,3" />
            ))}
            {[120, 190, 260, 330, 400].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="290" stroke="#dce6f5" strokeWidth="0.5" strokeDasharray="4,3" />
            ))}
            {/* Labels */}
            {['0', '1', '2', '3', '4', '5'].map((v, i) => (
              <text key={`y-${v}`} x="45" y={293 - i * 54} textAnchor="end" fontSize="10" fill="#63718c"> {v}</text>
            ))}
            {['0', '1', '2', '3', '4', '5'].map((v, i) => (
              <text key={`x-${v}`} x={50 + i * 70} y="308" textAnchor="middle" fontSize="10" fill="#63718c"> {v}</text>
            ))}
            <text x="225" y="330" textAnchor="middle" fontSize="11" fill="#63718c"> 预测值</text>
            <text x="15" y="155" textAnchor="middle" fontSize="11" fill="#63718c" transform="rotate(-90,15,155)"> 实验值</text>
            {/* y=x ideal line */}
            <line x1="50" y1="290" x2="400" y2="20" stroke="#8a97ad" strokeWidth="1.5" strokeDasharray="6,4" />
            {/* Scatter dots */}
            {scatterDots.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="#1d5fd6" opacity="0.7" />
            ))}
            {/* R² label */}
            <rect x="310" y="250" width="82" height="24" rx="4" fill="#1d5fd6" opacity="0.1" />
            <text x="351" y="266" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1d5fd6"> R² = 0.94</text>
          </svg>
        </div>

        {/* Right: Prediction Error Distribution */}
        <div className="w-1/2 rounded-lg border border-line-2/20 bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
          <h2 className="mb-4 text-base font-semibold text-foreground">预测误差分布</h2>
          {/* CSS Bar Chart */}
          <div className="flex items-end justify-center gap-3" style={{ height: '220px', paddingBottom: '30px' }}>
            {errorBars.map((bar) => (
              <div key={bar.label} className="flex max-w-12 flex-1 flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{bar.count}</span>
                <div className={cn('w-full rounded-t-sm', bar.bg)} style={{ height: `${bar.height}px` }} />
              </div>
            ))}
          </div>
          {/* X-axis labels */}
          <div className="mt-1 flex justify-center gap-3">
            {errorBars.map((bar) => (
              <span key={bar.label} className="max-w-12 flex-1 text-center text-[10px] text-muted-foreground">{bar.label}</span>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">MAE = 0.082 · RMSE = 0.098 · 偏差 &lt; 0.1 占比 82%</p>
        </div>
      </div>
    </div>
  );
}

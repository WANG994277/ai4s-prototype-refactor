'use client';

import React, { useState } from 'react';
import {
  Target,
  Filter,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== Types =====
interface Molecule {
  id: number;
  name: string;
  rank: number;
  desulfurization: number; // °C
  yield: number; // %
  stability: number;
  score: number;
  novelty: 'new' | 'known';
  sa: number;
  saLabel: string;
  radarPoints: string;
}

// ===== Mock Data =====
const funnelStages = [
  { label: '初代库', count: '10,000', percent: '100%', gradient: 'linear-gradient(135deg, #1d5fd6, #2a6fe0)', color: '#1d5fd6' },
  { label: 'DFT筛选', count: '1,250', percent: '12.5%', gradient: 'linear-gradient(135deg, #13b7c7, #1fc9d8)', color: '#13b7c7' },
  { label: '可合成', count: '320', percent: '3.2%', gradient: 'linear-gradient(135deg, #17a56a, #1fbf7a)', color: '#17a56a' },
  { label: 'Pareto优化', count: '45', percent: '0.45%', gradient: 'linear-gradient(135deg, #f59e0b, #f7b234)', color: '#f59e0b' },
];

const molecules: Molecule[] = [
  { id: 1, name: 'Beta-C-0.6', rank: 1, desulfurization: 800, yield: 43.1, stability: 0.95, score: 0.96, novelty: 'new', sa: 2.3, saLabel: '易于合成', radarPoints: '100,28 162,61 140,118 56,123 42,62' },
  { id: 2, name: 'ZSM-5-P-0.5', rank: 2, desulfurization: 780, yield: 42.3, stability: 0.88, score: 0.92, novelty: 'new', sa: 2.8, saLabel: '易于合成', radarPoints: '100,35 155,65 135,115 62,120 48,65' },
  { id: 3, name: 'MFI-Si-1.2', rank: 3, desulfurization: 750, yield: 38.7, stability: 0.91, score: 0.87, novelty: 'known', sa: 3.1, saLabel: '可合成', radarPoints: '100,42 148,69 130,112 68,118 54,69' },
  { id: 4, name: 'SAPO-34-M-0.8', rank: 4, desulfurization: 680, yield: 39.5, stability: 0.82, score: 0.79, novelty: 'new', sa: 3.4, saLabel: '可合成', radarPoints: '100,50 142,73 125,106 72,106 58,73' },
  { id: 5, name: 'ZSM-5-P-0.3', rank: 5, desulfurization: 620, yield: 34.2, stability: 0.76, score: 0.68, novelty: 'known', sa: 3.8, saLabel: '较难合成', radarPoints: '100,58 136,77 120,100 76,100 62,77' },
];

const rankColors = ['#1d5fd6', '#2563eb', '#13b7c7', '#17a56a', '#f59e0b'];

// Pareto scatter data
const paretoDots = [
  { cx: 120, cy: 176, r: 5, fill: '#93c5fd', label: 'ZSM-5-P-0.3', lx: 130, ly: 172, bold: false },
  { cx: 253, cy: 124, r: 5, fill: '#60a5fa', label: 'SAPO-34-M-0.8', lx: 263, ly: 120, bold: false },
  { cx: 120, cy: 81, r: 5, fill: '#3b82f6', label: 'MFI-Si-1.2', lx: 130, ly: 77, bold: false },
  { cx: 260, cy: 40, r: 5, fill: '#2563eb', label: 'ZSM-5-P-0.5', lx: 270, ly: 36, bold: false },
  { cx: 420, cy: 20, r: 5, fill: '#1d5fd6', label: 'Beta-C-0.6', lx: 395, ly: 12, bold: true },
];

// ===== Component =====
export default function MolecularDesignPage() {
  const [selectedMol, setSelectedMol] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const currentMol = molecules.find((m) => m.id === selectedMol) ?? molecules[0];

  return (
    <div className="space-y-5">
      {/* 1. Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">算力管理</h1>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-line-2/30 bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-surface-2 hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)] active:scale-[0.98]">
            <Filter className="h-4 w-4" />筛选条件
          </button>
          <button
            onClick={() => { setShowWizard(true); setWizardStep(1); }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Target className="h-4 w-4" />新一轮寻优
          </button>
        </div>
      </div>

      {/* 2. Virtual Screening Funnel */}
      <div className="rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
        <h2 className="mb-4 text-base font-semibold text-foreground">虚拟筛选漏斗</h2>
        <div className="flex items-center gap-0">
          {funnelStages.map((stage, idx) => (
            <React.Fragment key={stage.label}>
              <div className="flex-1">
                <div
                  className="flex items-center justify-center py-6"
                  style={{ background: stage.gradient }}
                >
                  <div className="text-center text-white">
                    <div className="mb-1 text-[11px] font-bold opacity-80">{stage.label}</div>
                    <div className="text-xl font-black">{stage.count}</div>
                    <div className="mt-0.5 text-[10px] opacity-70">个分子</div>
                    <div className="mt-1 text-[10px] opacity-60">{stage.percent}</div>
                  </div>
                </div>
              </div>
              {idx < funnelStages.length - 1 && (
                <div className="flex items-center px-1">
                  <ChevronRight className="h-4 w-4 text-faint" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 border-t border-line-2/20 pt-3">
          {funnelStages.map((stage) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: stage.color }} />
              <span className="text-[11px] text-faint">{stage.label} {stage.count} ({stage.percent})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Dual Column: Pareto Chart + Candidate List */}
      <div className="flex gap-5">
        {/* Left 55%: Pareto Front */}
        <div className="w-[55%] rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
          <div className="mb-1">
            <h2 className="text-base font-semibold text-foreground">Pareto前沿</h2>
            <p className="text-xs text-muted-foreground">脱硫活性 vs 丙烯收率</p>
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 480 320" className="w-full" style={{ minHeight: '280px' }}>
              {/* Grid lines */}
              <line x1="60" y1="20" x2="60" y2="280" stroke="#e8f0fe" strokeWidth="1" />
              <line x1="60" y1="280" x2="460" y2="280" stroke="#e8f0fe" strokeWidth="1" />
              {[215, 150, 85, 20].map((y) => (
                <line key={y} x1="60" y1={y} x2="460" y2={y} stroke="#e8f0fe" strokeWidth="0.5" strokeDasharray="4,4" />
              ))}
              {[160, 260, 360, 460].map((x) => (
                <line key={x} x1={x} y1="20" x2={x} y2="280" stroke="#e8f0fe" strokeWidth="0.5" strokeDasharray="4,4" />
              ))}
              {/* Y-axis labels */}
              {[
                { y: 283, v: '500' },
                { y: 218, v: '575' },
                { y: 153, v: '650' },
                { y: 88, v: '725' },
                { y: 23, v: '800' },
              ].map((t) => (
                <text key={t.v} x="55" y={t.y} textAnchor="end" fontSize="9" fill="#8a97ad"> {t.v}</text>
              ))}
              {/* X-axis labels */}
              {[
                { x: 60, v: '30%' },
                { x: 160, v: '33.75%' },
                { x: 260, v: '37.5%' },
                { x: 360, v: '41.25%' },
                { x: 460, v: '45%' },
              ].map((t) => (
                <text key={t.v} x={t.x} y="296" textAnchor="middle" fontSize="9" fill="#8a97ad"> {t.v}</text>
              ))}
              {/* Axis names */}
              <text x="260" y="315" textAnchor="middle" fontSize="10" fill="#63718c" fontWeight="600"> 丙烯收率</text>
              <text x="15" y="150" textAnchor="middle" fontSize="10" fill="#63718c" fontWeight="600" transform="rotate(-90,15,150)"> 脱硫活性 (°C)</text>
              {/* Pareto front line */}
              <polyline points="120,81 260,40 420,20" fill="none" stroke="#1d5fd6" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6" />
              {/* Scatter dots */}
              {paretoDots.map((dot) => (
                <g key={dot.label}>
                  <circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.r}
                    fill={dot.fill}
                    stroke="white"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const mol = molecules.find((m) => m.name === dot.label);
                      if (mol) setSelectedMol(mol.id);
                    }}
                  />
                  <text
                    x={dot.lx}
                    y={dot.ly}
                    fontSize="9"
                    fill={dot.bold ? '#10264f' : '#63718c'}
                    fontWeight={dot.bold ? '600' : 'normal'}
                  >
                    {dot.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right 45%: Candidate List */}
        <div className="w-[45%] rounded-lg bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">候选分子</h2>
            <select className="rounded-md border-none bg-surface-2 px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="score">按综合得分</option>
              <option value="activity">按脱硫活性</option>
              <option value="yield">按丙烯收率</option>
            </select>
          </div>

          {/* Molecule list */}
          <div className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto pr-1">
            {molecules.map((mol, idx) => (
              <div
                key={mol.id}
                onClick={() => setSelectedMol(mol.id)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]',
                  selectedMol === mol.id
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-line-2/10'
                )}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-black text-white"
                  style={{ background: rankColors[idx] }}
                >
                  #{mol.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{mol.name}</span>
                    <span className={cn(
                      'inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold',
                      mol.novelty === 'new' ? 'bg-success/15 text-success' : 'bg-surface-2 text-muted-foreground'
                    )}>
                      {mol.novelty === 'new' ? '新颖' : '已知'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>脱硫活性 <b className="text-foreground">{mol.desulfurization}°C</b></span>
                    <span>丙烯收率 <b className="text-foreground">{mol.yield}%</b></span>
                    <span>稳定性 <b className="text-foreground">{mol.stability}</b></span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xl font-black text-navy">{mol.score.toFixed(2)}</div>
                  <div className="text-[10px] text-faint">综合得分</div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected molecule detail */}
          <div className="mt-4 rounded-lg border border-line-2/20 bg-surface-2/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{currentMol.name}</h3>
              <span className="text-[10px] text-faint">排名 #{currentMol.rank}</span>
            </div>

            {/* Radar chart */}
            <div className="mb-3 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-[180px] w-[180px]">
                <polygon points="100,20 169,55 154,130 46,130 31,55" fill="none" stroke="#e8f0fe" strokeWidth="0.8" />
                <polygon points="100,44 149,67 140,118 60,118 51,67" fill="none" stroke="#e8f0fe" strokeWidth="0.5" />
                <polygon points="100,68 129,79 125,106 75,106 71,79" fill="none" stroke="#e8f0fe" strokeWidth="0.5" />
                <line x1="100" y1="20" x2="100" y2="130" stroke="#e8f0fe" strokeWidth="0.5" />
                <line x1="169" y1="55" x2="31" y2="55" stroke="#e8f0fe" strokeWidth="0.5" />
                <line x1="46" y1="130" x2="154" y2="20" stroke="#e8f0fe" strokeWidth="0.5" />
                <line x1="31" y1="55" x2="169" y2="95" stroke="#e8f0fe" strokeWidth="0.5" />
                <polygon
                  points={currentMol.radarPoints}
                  fill="rgba(29,95,214,0.15)"
                  stroke="#1d5fd6"
                  strokeWidth="1.5"
                />
                {currentMol.radarPoints.split(' ').map((pt, i) => {
                  const [x, y] = pt.split(',').map(Number);
                  return <circle key={i} cx={x} cy={y} r="3" fill="#1d5fd6" />;
                })}
                <text x="100" y="14" textAnchor="middle" fontSize="9" fill="#63718c" fontWeight="600"> 活性</text>
                <text x="178" y="58" textAnchor="start" fontSize="9" fill="#63718c" fontWeight="600"> 收率</text>
                <text x="155" y="142" textAnchor="start" fontSize="9" fill="#63718c" fontWeight="600"> 稳定性</text>
                <text x="45" y="142" textAnchor="end" fontSize="9" fill="#63718c" fontWeight="600"> 成本</text>
                <text x="22" y="58" textAnchor="end" fontSize="9" fill="#63718c" fontWeight="600"> 新颖性</text>
              </svg>
            </div>

            {/* SA Score */}
            <div className="mb-3 flex items-center justify-between rounded-md bg-success-bg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">合成可及性 SA Score</span>
                <span className="text-sm font-black text-navy">{currentMol.sa}</span>
              </div>
              <span className="inline-flex items-center rounded-sm bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                {currentMol.saLabel}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button className="flex-1 rounded-md border border-line-2/30 bg-white px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-2">
                推送至DFT验证
              </button>
              <button className="flex-1 rounded-md border border-line-2/30 bg-white px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-2">
                推送至做空间
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowWizard(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line-2/20 px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">新建优化任务</h2>
              <button
                onClick={() => setShowWizard(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2">
                {[
                  { num: 1, label: '目标属性' },
                  { num: 2, label: '硬约束' },
                  { num: 3, label: '生成引擎' },
                ].map((step, idx) => (
                  <React.Fragment key={step.num}>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                        wizardStep >= step.num ? 'bg-primary text-white' : 'bg-surface-2 text-muted-foreground'
                      )}>
                        {step.num}
                      </div>
                      <span className={cn(
                        'text-xs',
                        wizardStep === step.num ? 'font-semibold text-primary' : 'font-medium text-muted-foreground'
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {idx < 2 && <div className="h-px flex-1 bg-line-2/30" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Target Property Weights */}
            {wizardStep === 1 && (
              <div className="px-6 py-5">
                <h3 className="mb-1 text-sm font-semibold text-foreground">目标属性权重配置</h3>
                <p className="mb-4 text-xs text-muted-foreground">调整各目标属性的优化权重，权重越高优化力度越大</p>
                <WizardSlider label="催化活性" defaultValue={30} />
                <WizardSlider label="选择性" defaultValue={25} />
                <WizardSlider label="稳定性" defaultValue={25} />
                <WizardSlider label="合成成本" defaultValue={20} />
                <div className="mt-3 flex items-center justify-between rounded-md bg-surface-2 px-3 py-2">
                  <span className="text-xs text-muted-foreground">权重总和</span>
                  <span className="text-sm font-bold text-navy">1.00</span>
                </div>
              </div>
            )}

            {/* Step 2: Hard Constraints */}
            {wizardStep === 2 && (
              <div className="px-6 py-5">
                <h3 className="mb-1 text-sm font-semibold text-foreground">硬约束设置</h3>
                <p className="mb-4 text-xs text-muted-foreground">设置分子筛选的硬性约束条件，不满足的分子将被过滤</p>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">分子量上限</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">&le;</span>
                    <input type="number" defaultValue={500} className="w-32 rounded-md border-none bg-surface-2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <span className="text-xs text-muted-foreground">Da</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">PAINS过滤</label>
                      <p className="text-[10px] text-faint">过滤泛抑制剂结构</p>
                    </div>
                    <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                      <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">合成可及性 SA 阈值</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">&le;</span>
                    <input type="number" defaultValue={3.5} step={0.1} className="w-32 rounded-md border-none bg-surface-2 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Engine Selection */}
            {wizardStep === 3 && (
              <div className="px-6 py-5">
                <h3 className="mb-1 text-sm font-semibold text-foreground">生成引擎选择</h3>
                <p className="mb-4 text-xs text-muted-foreground">选择分子生成引擎，不同引擎适合不同类型的优化任务</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { abbr: 'CV', name: 'CVAE', desc: '条件变分自编码器，适合连续空间探索，生成多样性高', color: '#1d5fd6', selected: true },
                    { abbr: 'DM', name: '扩散模型', desc: '基于去噪扩散概率模型，生成质量高，训练稳定', color: '#13b7c7', selected: false },
                    { abbr: 'GA', name: 'GAN', desc: '生成对抗网络，适合特定目标导向的分子设计', color: '#7c5ce0', selected: false },
                    { abbr: 'RI', name: 'REINVENT', desc: '基于强化学习的分子生成，多目标优化能力强', color: '#f59e0b', selected: false },
                  ].map((engine) => (
                    <div
                      key={engine.name}
                      className={cn(
                        'cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-[0_4px_12px_rgba(16,38,79,0.08)]',
                        engine.selected ? 'border-primary bg-primary/5' : 'border-line-2/20 hover:border-line-2/40'
                      )}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-black text-white"
                          style={{ background: engine.color }}
                        >
                          {engine.abbr}
                        </div>
                        <span className="text-sm font-semibold text-foreground">{engine.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{engine.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-line-2/20 px-6 py-4">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="rounded-md bg-surface-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2/80"
                >
                  上一步
                </button>
              ) : <div className="flex-1" />}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWizard(false)}
                  className="rounded-md bg-surface-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2/80"
                >
                  取消
                </button>
                {wizardStep < 3 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                  >
                    下一步
                  </button>
                ) : (
                  <button
                    onClick={() => setShowWizard(false)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
                  >
                    创建任务
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Wizard Slider Component =====
function WizardSlider({ label, defaultValue }: { label: string; defaultValue: number }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-bold text-primary">{(val / 100).toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

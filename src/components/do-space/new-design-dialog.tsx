'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Target,
  LayoutGrid,
  Columns3,
  CheckCircle2,
  FlaskConical,
} from 'lucide-react';

/* ─── 类型 ─── */

interface Factor {
  name: string;
  type: '连续' | '离散';
  min: string;
  max: string;
  unit: string;
  levels?: string;
}

interface NewDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ─── 步骤配置 ─── */

const STEPS = ['基本信息', '因子定义', '方法选择', '矩阵生成'];

const designMethodOptions = [
  {
    id: 'bayesian',
    name: '贝叶斯优化',
    sub: 'GP+EI',
    desc: '小样本高效逼近最优，适合迭代优化场景。推荐实验轮次≥3时使用。',
    icon: Target,
    bestFor: '迭代优化、小样本场景',
  },
  {
    id: 'rsm',
    name: '响应面RSM',
    sub: 'CCD',
    desc: '二阶曲面精拟合，适合因子交互分析和精确建模。',
    icon: LayoutGrid,
    bestFor: '因子交互分析、曲面建模',
  },
  {
    id: 'lhs',
    name: '拉丁超立方LHS',
    sub: '—',
    desc: '空间均匀填充，适合初始全局探索，为后续贝叶斯优化提供基础数据。',
    icon: Columns3,
    bestFor: '初始探索、无先验信息',
  },
];

/* ─── 组件 ─── */

export function NewDesignDialog({ open, onOpenChange }: NewDesignDialogProps) {
  const [step, setStep] = useState(0);
  const [taskName, setTaskName] = useState('');
  const [candidate, setCandidate] = useState('');
  const [owner, setOwner] = useState('');
  const [factors, setFactors] = useState<Factor[]>([
    { name: '', type: '连续', min: '', max: '', unit: '' },
  ]);
  const [method, setMethod] = useState('bayesian');
  const [expCount, setExpCount] = useState('8');
  const [generated, setGenerated] = useState(false);

  const canNext = () => {
    if (step === 0) return taskName.trim() !== '' && candidate.trim() !== '';
    if (step === 1) return factors.some((f) => f.name.trim() !== '');
    if (step === 2) return method !== '';
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      if (step === 2) {
        setGenerated(true);
      }
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAddFactor = () => {
    setFactors([...factors, { name: '', type: '连续', min: '', max: '', unit: '' }]);
  };

  const handleRemoveFactor = (index: number) => {
    if (factors.length > 1) {
      setFactors(factors.filter((_, i) => i !== index));
    }
  };

  const handleFactorChange = (index: number, field: keyof Factor, value: string) => {
    const updated = [...factors];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setFactors(updated);
  };

  const handleSubmit = () => {
    onOpenChange(false);
    // 重置
    setStep(0);
    setTaskName('');
    setCandidate('');
    setOwner('');
    setFactors([{ name: '', type: '连续', min: '', max: '', unit: '' }]);
    setMethod('bayesian');
    setExpCount('8');
    setGenerated(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(0);
    setGenerated(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[640px] p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-line">
          <DialogTitle className="text-base font-black text-navy">新建设计任务</DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground mt-1">
            创建新的实验设计任务，依次完成信息填写、因子定义、方法选择和矩阵生成
          </DialogDescription>
        </DialogHeader>

        {/* 步骤指示器 */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                      i < step
                        ? 'bg-primary text-white'
                        : i === step
                          ? 'bg-primary text-white'
                          : 'bg-surface-2 text-muted-foreground',
                    )}
                  >
                    {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      'text-[11px] font-bold',
                      i <= step ? 'text-navy' : 'text-muted-foreground',
                    )}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn('mx-1 h-px flex-1', i < step ? 'bg-primary' : 'bg-line')} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 步骤内容 */}
        <div className="min-h-[300px] px-6 py-4">
          {/* Step 0: 基本信息 */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-navy">
                  任务名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="如：PDH催化剂Sn-Pt/Al₂O₃优化 DOE"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="text-[13px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-navy">
                    候选分子/体系 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="如：M-1842"
                    value={candidate}
                    onChange={(e) => setCandidate(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-navy">负责人</Label>
                  <Input
                    placeholder="输入负责人姓名"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-bold text-navy">来源关联</Label>
                <div className="rounded-md border border-line/60 bg-surface-2/30 px-3 py-2.5 text-[12px] text-muted-foreground">
                  可关联算空间代理模型，从已有Round继承因子空间
                </div>
              </div>
            </div>
          )}

          {/* Step 1: 因子定义 */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-muted-foreground">
                  定义实验设计的因子（变量），设置类型和取值范围
                </p>
                <button
                  onClick={handleAddFactor}
                  className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-3 w-3" /> 添加因子
                </button>
              </div>
              <div className="space-y-2">
                {factors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-md border border-line/60 bg-surface-2/30 p-3"
                  >
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      <div className="col-span-2 space-y-1">
                        <span className="text-[10px] font-bold text-faint">因子名称</span>
                        <Input
                          placeholder="如：焙烧温度"
                          value={factor.name}
                          onChange={(e) => handleFactorChange(index, 'name', e.target.value)}
                          className="h-8 text-[12px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-faint">类型</span>
                        <select
                          value={factor.type}
                          onChange={(e) => handleFactorChange(index, 'type', e.target.value)}
                          className="flex h-8 w-full rounded-md border border-line bg-white px-2 text-[12px] text-foreground"
                        >
                          <option value="连续">连续</option>
                          <option value="离散">离散</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-faint">
                          {factor.type === '离散' ? '水平值' : '下限'}
                        </span>
                        <Input
                          placeholder={factor.type === '离散' ? 'A,B,C' : '400'}
                          value={factor.type === '离散' ? (factor.levels ?? '') : factor.min}
                          onChange={(e) =>
                            handleFactorChange(
                              index,
                              factor.type === '离散' ? 'levels' : 'min',
                              e.target.value,
                            )
                          }
                          className="h-8 text-[12px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-faint">
                          {factor.type === '离散' ? '单位' : '上限'}
                        </span>
                        {factor.type === '离散' ? (
                          <Input
                            placeholder="—"
                            value={factor.unit}
                            onChange={(e) => handleFactorChange(index, 'unit', e.target.value)}
                            className="h-8 text-[12px]"
                          />
                        ) : (
                          <Input
                            placeholder="700"
                            value={factor.max}
                            onChange={(e) => handleFactorChange(index, 'max', e.target.value)}
                            className="h-8 text-[12px]"
                          />
                        )}
                      </div>
                    </div>
                    {factors.length > 1 && (
                      <button
                        onClick={() => handleRemoveFactor(index)}
                        className="mt-4 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {factors.length > 0 && factors.some((f) => f.name.trim() !== '') && (
                <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                  <p className="text-[11px] font-bold text-primary">
                    已定义 {factors.filter((f) => f.name.trim()).length} 个因子（
                    {factors.filter((f) => f.name.trim() && f.type === '连续').length} 连续 +{' '}
                    {factors.filter((f) => f.name.trim() && f.type === '离散').length} 离散）
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: 方法选择 */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-[12px] text-muted-foreground">
                选择实验设计方法，不同方法适用于不同场景
              </p>
              <div className="space-y-2">
                {designMethodOptions.map((m) => {
                  const Icon = m.icon;
                  const selected = method === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        'rounded-lg border p-4 cursor-pointer transition-all',
                        selected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            selected ? 'bg-primary text-white' : 'bg-surface-2 text-muted-foreground',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-navy">{m.name}</span>
                            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                              {m.sub}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] text-muted-foreground">{m.desc}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            适用场景：{m.bestFor}
                          </p>
                        </div>
                        {selected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-navy">本批实验点数</Label>
                  <Input
                    type="number"
                    value={expCount}
                    onChange={(e) => setExpCount(e.target.value)}
                    className="h-8 text-[12px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-bold text-navy">来源关联</Label>
                  <div className="flex h-8 items-center rounded-md border border-line/60 bg-surface-2/30 px-3 text-[12px] text-muted-foreground">
                    {factors.filter((f) => f.name.trim()).length} 个因子已定义
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 矩阵生成 */}
          {step === 3 && (
            <div className="space-y-4">
              {generated ? (
                <>
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                    <p className="mt-2 text-[14px] font-bold text-green-800">实验矩阵已生成</p>
                    <p className="mt-1 text-[12px] text-green-700">
                      基于{designMethodOptions.find((m) => m.id === method)?.name}方法，已生成{' '}
                      {expCount} 个实验点
                    </p>
                  </div>
                  <div className="rounded-md border border-line bg-surface-2/30 p-4 space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">任务名称</span>
                      <span className="font-bold text-foreground">{taskName || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">候选体系</span>
                      <span className="font-bold text-foreground">{candidate || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">设计方法</span>
                      <span className="font-bold text-primary">
                        {designMethodOptions.find((m) => m.id === method)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">因子数量</span>
                      <span className="font-bold text-foreground">
                        {factors.filter((f) => f.name.trim()).length} 个
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">实验点数</span>
                      <span className="font-bold text-foreground">{expCount} 个</span>
                    </div>
                    {owner && (
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground">负责人</span>
                        <span className="font-bold text-foreground">{owner}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FlaskConical className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-[13px] font-bold text-navy">准备生成实验矩阵</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    点击「生成」按钮，基于所选方法自动生成实验点
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-line px-6 py-3">
          <div className="flex w-full items-center justify-between">
            <div>
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1">
                  <ChevronLeft className="h-3.5 w-3.5" /> 上一步
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                取消
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" onClick={handleNext} disabled={!canNext()} className="gap-1">
                  下一步 <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : generated ? (
                <Button size="sm" onClick={handleSubmit} className="gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 创建任务
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setGenerated(true)}
                  className="gap-1"
                >
                  <FlaskConical className="h-3.5 w-3.5" /> 生成矩阵
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

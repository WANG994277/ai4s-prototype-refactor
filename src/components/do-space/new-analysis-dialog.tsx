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
  BarChart3,
  CheckCircle2,
  Database,
  TrendingUp,
  Link2,
} from 'lucide-react';

/* ─── 类型 ─── */

interface NewAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ─── 预设数据 ─── */

const datasetOptions = [
  {
    id: 'DOE-0231-all',
    name: 'DOE-0231 全量数据',
    desc: '24 runs · 7轮 · 含1条异常',
    runs: 24,
    rounds: 7,
    abnormal: 1,
  },
  {
    id: 'DOE-0231-b7',
    name: 'DOE-0231 Batch-7',
    desc: '8 runs · 最新批次',
    runs: 8,
    rounds: 1,
    abnormal: 0,
  },
  {
    id: 'import',
    name: '导入外部数据',
    desc: '从CSV/Excel文件导入',
    runs: null,
    rounds: null,
    abnormal: null,
  },
];

const methodOptions = [
  {
    id: 'rsm',
    name: '响应面拟合',
    sub: 'RSM+ANOVA',
    desc: '二阶响应面模型拟合+方差分析，适合定量评估因子效应和交互作用',
    icon: TrendingUp,
  },
  {
    id: 'bayesian',
    name: '贝叶斯代理模型',
    sub: 'GP',
    desc: '高斯过程代理模型，适合非线性响应预测和采集函数推荐',
    icon: BarChart3,
  },
  {
    id: 'screening',
    name: '因子筛选',
    sub: 'Plackett-Burman',
    desc: '快速筛选关键因子，适合因子较多时的初步分析',
    icon: Database,
  },
];

const proxyModelOptions = [
  {
    id: 'R7',
    name: '代理模型 Round 7',
    desc: 'GP+EI · 24 runs · R²=0.947',
  },
  {
    id: 'R6',
    name: '代理模型 Round 6',
    desc: 'GP+EI · 16 runs · R²=0.891',
  },
  { id: 'none', name: '不关联代理模型', desc: '仅做独立分析' },
];

/* ─── 组件 ─── */

export function NewAnalysisDialog({ open, onOpenChange }: NewAnalysisDialogProps) {
  const [taskName, setTaskName] = useState('');
  const [dataset, setDataset] = useState('');
  const [method, setMethod] = useState('rsm');
  const [proxyModel, setProxyModel] = useState('none');
  const [owner, setOwner] = useState('');

  const canSubmit = taskName.trim() !== '' && dataset !== '';

  const handleSubmit = () => {
    onOpenChange(false);
    setTaskName('');
    setDataset('');
    setMethod('rsm');
    setProxyModel('none');
    setOwner('');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] p-0 gap-0 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-line sticky top-0 bg-white z-10">
          <DialogTitle className="text-base font-black text-navy">新建分析任务</DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground mt-1">
            创建数据分析任务，选择数据集和分析方法
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          {/* 任务名称 */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-bold text-navy">
              任务名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="如：DOE-0231批次结果分析"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="text-[13px]"
            />
          </div>

          {/* 数据集选择 */}
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" /> 数据集 <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-1.5">
              {datasetOptions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDataset(d.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                    dataset === d.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-foreground">{d.name}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{d.desc}</p>
                  </div>
                  {dataset === d.id && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 分析方法 */}
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> 分析方法
            </Label>
            <div className="space-y-1.5">
              {methodOptions.map((m) => {
                const Icon = m.icon;
                const selected = method === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                      selected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        selected ? 'bg-primary text-white' : 'bg-surface-2 text-muted-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-foreground">{m.name}</span>
                        <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                          {m.sub}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</p>
                    </div>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 代理模型关联 */}
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> 关联代理模型（回流目标）
            </Label>
            <div className="space-y-1.5">
              {proxyModelOptions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProxyModel(p.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                    proxyModel === p.id
                      ? 'border-primary bg-primary/5'
                      : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-foreground">{p.name}</span>
                    {p.id !== 'none' && (
                      <span className="ml-2 text-[11px] text-muted-foreground">{p.desc}</span>
                    )}
                  </div>
                  {proxyModel === p.id && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
              ))}
            </div>
            {proxyModel !== 'none' && (
              <div className="rounded-md border border-cyan/20 bg-cyan/5 px-3 py-2 text-[11px] text-cyan">
                分析完成后，结果将自动回流至算空间代理模型，触发模型更新并生成下一批采集点
              </div>
            )}
          </div>

          {/* 负责人 */}
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

        <DialogFooter className="border-t border-line px-6 py-3 sticky bottom-0 bg-white">
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              取消
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!canSubmit} className="gap-1">
              <BarChart3 className="h-3.5 w-3.5" /> 创建分析任务
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

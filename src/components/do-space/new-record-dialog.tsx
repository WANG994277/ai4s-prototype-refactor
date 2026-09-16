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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  FileText,
  Link2,
} from 'lucide-react';

/* ─── 类型 ─── */

interface NewRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ─── 预设数据 ─── */

const projectOptions = [
  { id: 'DOE-0231', name: 'PDH催化剂Sn-Pt/Al₂O₃优化', color: 'bg-primary' },
  { id: 'PE-0073', name: 'IsPETase定向进化改造', color: 'bg-green-600' },
  { id: 'DOE-0189', name: 'SCR脱硝催化剂V₂O₅/WO₃-TiO₂', color: 'bg-amber' },
];

const designLinkOptions = [
  { id: 'DOE-0231-B7', name: 'DOE-0231 Batch-7', desc: '8个实验点 · 贝叶斯优化 GP+EI' },
  { id: 'DOE-0231-B6', name: 'DOE-0231 Batch-6', desc: '6个实验点 · 贝叶斯优化 GP+EI' },
  { id: 'none', name: '不关联设计', desc: '手动创建空白记录' },
];

const templateOptions = [
  { id: 'catalyst-prep', name: '催化剂制备模板', desc: '含前驱液配制→浸渍→焙烧→还原标准步骤' },
  { id: 'reaction-test', name: '反应评价模板', desc: '含装填→活化→反应→采样分析标准步骤' },
  { id: 'blank', name: '空白模板', desc: '从零开始自由记录' },
];

/* ─── 组件 ─── */

export function NewRecordDialog({ open, onOpenChange }: NewRecordDialogProps) {
  const [project, setProject] = useState('');
  const [designLink, setDesignLink] = useState('none');
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('catalyst-prep');
  const [note, setNote] = useState('');

  const canSubmit = project !== '' && title.trim() !== '';

  const handleSubmit = () => {
    onOpenChange(false);
    setProject('');
    setDesignLink('none');
    setTitle('');
    setTemplate('catalyst-prep');
    setNote('');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[580px] p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-line">
          <DialogTitle className="text-base font-black text-navy">新建实验记录</DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground mt-1">
            创建新的实验记录，可关联已有设计任务或手动创建
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          {/* 项目选择 */}
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-navy">
              所属项目 <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-1.5">
              {projectOptions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProject(p.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                    project === p.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                  )}
                >
                  <div className={cn('h-2.5 w-2.5 shrink-0 rounded-full', p.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-mono font-bold text-muted-foreground">
                        {p.id}
                      </span>
                      <span className="text-[13px] font-bold text-foreground">{p.name}</span>
                    </div>
                  </div>
                  {project === p.id && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 关联设计 */}
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> 关联实验设计
            </Label>
            <div className="space-y-1.5">
              {designLinkOptions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDesignLink(d.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                    designLink === d.id
                      ? 'border-primary bg-primary/5'
                      : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-foreground">{d.name}</span>
                    {d.id !== 'none' && (
                      <span className="ml-2 text-[11px] text-muted-foreground">{d.desc}</span>
                    )}
                    {d.id === 'none' && (
                      <span className="ml-2 text-[11px] text-muted-foreground">{d.desc}</span>
                    )}
                  </div>
                  {designLink === d.id && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
              ))}
            </div>
            {designLink !== 'none' && (
              <div className="rounded-md border border-cyan/20 bg-cyan/5 px-3 py-2 text-[11px] text-cyan">
                关联设计后，实验步骤模板和参数将自动预填
              </div>
            )}
          </div>

          {/* 记录标题 */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> 记录标题 <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="如：Sn-Pt/Al₂O₃催化剂焙烧还原实验"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[13px]"
            />
          </div>

          {/* 步骤模板 */}
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> 步骤模板
            </Label>
            <div className="space-y-1.5">
              {templateOptions.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                    template === t.id
                      ? 'border-primary bg-primary/5'
                      : 'border-line hover:border-primary/30 hover:bg-surface-2/30',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-foreground">{t.name}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</p>
                  </div>
                  {template === t.id && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 备注 */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-bold text-navy">备注</Label>
            <Textarea
              placeholder="可选：记录实验目的、特殊要求等"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-[12px] min-h-[60px]"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-line px-6 py-3">
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="gap-1"
            >
              <FlaskConical className="h-3.5 w-3.5" /> 创建记录
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

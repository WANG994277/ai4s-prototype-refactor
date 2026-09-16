'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  FlaskConical,
  GitBranch,
  FileCheck,
  FileText,
  Dna,
  LineChart,
  BarChart3,
  Beaker,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── 类型 ─── */

export type ToolSpace = 'read' | 'compute' | 'do';
export type ToolStatus = 'pending' | 'running' | 'done' | 'error';

export interface ToolCallCardData {
  id: string;
  toolName: string;
  toolIcon: string;
  space: ToolSpace;
  status: ToolStatus;
  input: string;
  output?: string;
  outputDetail?: string;
  progress?: number;
  resultAction?: {
    label: string;
    href?: string;
  };
}

/* ─── 图标映射 ─── */

const toolIconMap: Record<string, React.ElementType> = {
  '文献检索': BookOpen,
  '知识图谱查询': GitBranch,
  '专利分析': FileCheck,
  '综述生成': FileText,
  '分子动力学模拟': Cpu,
  'DFT计算': Cpu,
  '蒙特卡洛采样': Cpu,
  '代理模型预测': LineChart,
  '分子性质预测': FlaskConical,
  '蛋白质结构预测': Dna,
  '实验设计': Beaker,
  'HSE审核': FileCheck,
  '数据分析': BarChart3,
  '报告生成': FileText,
  '文献检索与管理': BookOpen,
};

const spaceConfig: Record<ToolSpace, { label: string; color: string; bg: string; border: string }> = {
  read: { label: '读', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  compute: { label: '算', color: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/20' },
  do: { label: '做', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
};

const statusConfig: Record<ToolStatus, { icon: React.ElementType; label: string; color: string }> = {
  pending: { icon: Clock, label: '等待中', color: 'text-muted-foreground' },
  running: { icon: Loader2, label: '执行中', color: 'text-cyan' },
  done: { icon: CheckCircle2, label: '已完成', color: 'text-green-600' },
  error: { icon: AlertCircle, label: '异常', color: 'text-destructive' },
};

/* ─── 组件 ─── */

interface ToolCallCardProps {
  tool: ToolCallCardData;
  onRetry?: (id: string) => void;
}

export function ToolCallCard({ tool, onRetry }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = toolIconMap[tool.toolName] || Wrench;
  const sc = spaceConfig[tool.space];
  const st = statusConfig[tool.status];
  const StatusIcon = st.icon;

  return (
    <div
      className={cn(
        'rounded-lg border transition-all',
        tool.status === 'error'
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-line bg-white'
      )}
    >
      {/* 头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
      >
        {/* 工具图标 */}
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
            tool.status === 'running' ? 'bg-cyan/10' : 'bg-surface-2'
          )}
        >
          <Icon
            className={cn(
              'h-3.5 w-3.5',
              tool.status === 'running' && 'animate-pulse text-cyan',
              tool.status === 'done' && 'text-green-600',
              tool.status === 'error' && 'text-destructive'
            )}
          />
        </div>

        {/* 工具名 + 输入描述 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-foreground">{tool.toolName}</span>
            <span
              className={cn(
                'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                sc.bg,
                sc.color
              )}
            >
              {sc.label}
            </span>
          </div>
          <p className="truncate text-[11px] text-muted-foreground">{tool.input}</p>
        </div>

        {/* 状态 */}
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusIcon
            className={cn(
              'h-3.5 w-3.5',
              st.color,
              tool.status === 'running' && 'animate-spin'
            )}
          />
          <span className={cn('text-[10px] font-bold', st.color)}>{st.label}</span>
          {expanded ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="border-t border-line px-3 pb-3 pt-2.5">
          {/* 进度条 (running 状态) */}
          {tool.status === 'running' && tool.progress !== undefined && (
            <div className="mb-2.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">执行进度</span>
                <span className="text-[10px] font-bold text-cyan">{tool.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-cyan transition-all duration-500"
                  style={{ width: `${tool.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* pending 占位 */}
          {tool.status === 'pending' && (
            <div className="flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">等待前置任务完成...</span>
            </div>
          )}

          {/* 结果 (done) */}
          {tool.status === 'done' && tool.output && (
            <div className="space-y-2">
              <div className="rounded-md bg-green-50/50 border border-green-100 px-3 py-2">
                <p className="text-[11px] leading-relaxed text-foreground">{tool.output}</p>
                {tool.outputDetail && (
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                    {tool.outputDetail}
                  </p>
                )}
              </div>
              {tool.resultAction && (
                <a
                  href={tool.resultAction.href || '#'}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  {tool.resultAction.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* 错误 (error) */}
          {tool.status === 'error' && (
            <div className="space-y-2">
              <div className="rounded-md bg-destructive/5 border border-destructive/20 px-3 py-2">
                <p className="text-[11px] leading-relaxed text-destructive">{tool.output || '执行出错'}</p>
              </div>
              {onRetry && (
                <button
                  onClick={() => onRetry(tool.id)}
                  className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1.5 text-[11px] font-bold text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  重试
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import {
  BookOpen,
  Cpu,
  FlaskConical,
  BarChart3,
  FileText,
  CheckCircle2,
  Loader2,
  Clock,
  Lock,
  AlertCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── 类型 ─── */

export type PlanStepSpace = 'read' | 'compute' | 'do' | 'output';
export type PlanStepStatus = 'pending' | 'running' | 'done' | 'blocked' | 'error';

export interface PlanStep {
  id: string;
  label: string;
  subLabel?: string;
  space: PlanStepSpace;
  status: PlanStepStatus;
  dependsOn?: string[];
}

/* ─── 配置 ─── */

const spaceIconMap: Record<PlanStepSpace, React.ElementType> = {
  read: BookOpen,
  compute: Cpu,
  do: FlaskConical,
  output: FileText,
};

const spaceColorMap: Record<PlanStepSpace, { dot: string; ring: string; bg: string; label: string }> = {
  read: { dot: 'bg-blue-500', ring: 'ring-blue-200', bg: 'bg-blue-50', label: '读' },
  compute: { dot: 'bg-cyan', ring: 'ring-cyan/30', bg: 'bg-cyan/10', label: '算' },
  do: { dot: 'bg-green-500', ring: 'ring-green-200', bg: 'bg-green-50', label: '做' },
  output: { dot: 'bg-amber', ring: 'ring-amber/30', bg: 'bg-amber/10', label: '出' },
};

const statusIconMap: Record<PlanStepStatus, React.ElementType | null> = {
  pending: Clock,
  running: Loader2,
  done: CheckCircle2,
  blocked: Lock,
  error: AlertCircle,
};

/* ─── 组件 ─── */

interface TaskPlannerProps {
  steps: PlanStep[];
  activeStepId?: string;
  className?: string;
}

export function TaskPlanner({ steps, activeStepId, className }: TaskPlannerProps) {
  if (steps.length === 0) return null;

  return (
    <div className={cn('rounded-lg border border-line bg-white p-3', className)}>
      {/* 标题 */}
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase text-faint tracking-wider">任务规划</span>
        <span className="text-[10px] text-muted-foreground">
          {steps.filter((s) => s.status === 'done').length}/{steps.length} 已完成
        </span>
      </div>

      {/* 步骤条 */}
      <div className="flex items-center gap-0 overflow-x-auto">
        {steps.map((step, idx) => {
          const sc = spaceColorMap[step.space];
          const SpaceIcon = spaceIconMap[step.space];
          const StatusIcon = statusIconMap[step.status];
          const isActive = step.id === activeStepId;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* 步骤节点 */}
              <div
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 transition-all',
                  isActive && 'ring-1 ring-primary/30 bg-primary/5'
                )}
              >
                {/* 状态圆点 */}
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                  {/* 背景圆 */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full',
                      step.status === 'running' && 'animate-pulse ring-2',
                      step.status === 'running' && sc.ring,
                      step.status === 'done' && sc.bg,
                      step.status === 'error' && 'bg-destructive/10'
                    )}
                  />
                  {/* 图标 */}
                  {step.status === 'done' ? (
                    <CheckCircle2 className="relative z-10 h-4 w-4 text-green-600" />
                  ) : step.status === 'running' ? (
                    <Loader2 className={cn('relative z-10 h-4 w-4 animate-spin', sc.dot.replace('bg-', 'text-'))} />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="relative z-10 h-4 w-4 text-destructive" />
                  ) : step.status === 'blocked' ? (
                    <Lock className="relative z-10 h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <SpaceIcon className="relative z-10 h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>

                {/* 标签 */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span
                      className={cn(
                        'text-[11px] font-bold truncate',
                        step.status === 'done'
                          ? 'text-green-700'
                          : step.status === 'running'
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                    <span
                      className={cn(
                        'shrink-0 rounded px-1 py-0.5 text-[8px] font-bold',
                        sc.bg,
                        sc.dot.replace('bg-', 'text-')
                      )}
                    >
                      {sc.label}
                    </span>
                  </div>
                  {step.subLabel && (
                    <p className="truncate text-[9px] text-faint">{step.subLabel}</p>
                  )}
                </div>
              </div>

              {/* 连接线 */}
              {!isLast && (
                <div className="flex shrink-0 items-center px-0.5">
                  <ArrowRight
                    className={cn(
                      'h-3 w-3',
                      step.status === 'done' ? 'text-green-400' : 'text-line'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

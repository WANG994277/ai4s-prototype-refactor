'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  Lock,
  Wrench,
  ChevronRight,
  Plus,
  GitMerge,
  GitFork,
  Circle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToolCallCardData } from './tool-call-card';
import type { PlanStep, PlanStepStatus } from './task-planner';

/* ─── 类型 ─── */

export interface TaskNode {
  id: string;
  label: string;
  space: 'read' | 'compute' | 'do';
  status: PlanStepStatus;
  children?: TaskNode[];
  toolCallId?: string;
}

export interface ToolCallRecord {
  id: string;
  toolName: string;
  space: 'read' | 'compute' | 'do';
  status: 'done' | 'running' | 'error';
  time: string;
}

export interface ResearchBranch {
  id: string;
  name: string;
  type: 'main' | 'branch' | 'failed';
  description: string;
  active: boolean;
  parentId?: string;
}

/* ─── 配置 ─── */

const spaceColorMap: Record<string, { dot: string; text: string }> = {
  read: { dot: 'bg-blue-500', text: 'text-blue-600' },
  compute: { dot: 'bg-cyan', text: 'text-cyan' },
  do: { dot: 'bg-green-500', text: 'text-green-600' },
};

const statusIconMap: Record<PlanStepStatus, React.ElementType> = {
  pending: Clock,
  running: Loader2,
  done: CheckCircle2,
  blocked: Lock,
  error: AlertCircle,
};

const statusColorMap: Record<PlanStepStatus, string> = {
  pending: 'text-muted-foreground',
  running: 'text-cyan',
  done: 'text-green-600',
  blocked: 'text-muted-foreground',
  error: 'text-destructive',
};

const branchTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  main: { icon: GitBranch, color: 'text-primary', bg: 'bg-primary/10' },
  branch: { icon: GitFork, color: 'text-cyan', bg: 'bg-cyan/10' },
  failed: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

/* ─── 子组件：任务树节点 ─── */

function TaskTreeNode({ node, depth = 0 }: { node: TaskNode; depth?: number }) {
  const StatusIcon = statusIconMap[node.status];
  const sc = spaceColorMap[node.space];

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        {/* 连接线 */}
        {depth > 0 && (
          <div className="flex items-center">
            <div className="h-4 w-3 border-l-2 border-b-2 border-line rounded-bl-md" />
          </div>
        )}

        {/* 空间色点 */}
        <div className={cn('h-2 w-2 shrink-0 rounded-full', sc.dot)} />

        {/* 状态图标 */}
        <StatusIcon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            statusColorMap[node.status],
            node.status === 'running' && 'animate-spin'
          )}
        />

        {/* 标签 */}
        <span
          className={cn(
            'text-[11px] truncate',
            node.status === 'done' ? 'text-foreground line-through decoration-green-400/50' : 'text-foreground'
          )}
        >
          {node.label}
        </span>
      </div>

      {/* 子节点 */}
      {node.children?.map((child) => (
        <TaskTreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

/* ─── 子组件：调用记录时间线 ─── */

function ToolCallTimeline({ records }: { records: ToolCallRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="py-6 text-center">
        <Wrench className="mx-auto h-5 w-5 text-muted-foreground/40" />
        <p className="mt-1.5 text-[11px] text-muted-foreground">暂无调用记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {records.map((record, idx) => {
        const sc = spaceColorMap[record.space];
        const isLast = idx === records.length - 1;
        return (
          <div key={record.id} className="flex gap-2">
            {/* 时间线 */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full mt-1.5',
                  record.status === 'done'
                    ? 'bg-green-500'
                    : record.status === 'running'
                      ? 'bg-cyan animate-pulse'
                      : 'bg-destructive'
                )}
              />
              {!isLast && <div className="w-px flex-1 bg-line/60 mt-0.5" />}
            </div>

            {/* 内容 */}
            <div className={cn('flex-1 pb-2.5', isLast && 'pb-0')}>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-foreground">{record.toolName}</span>
                <span className={cn('rounded px-1 py-0.5 text-[8px] font-bold', sc.text, 'bg-surface-2')}>
                  {record.space === 'read' ? '读' : record.space === 'compute' ? '算' : '做'}
                </span>
              </div>
              <span className="text-[10px] text-faint">{record.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 子组件：分支记忆 ─── */

function BranchMemory({ branches }: { branches: ResearchBranch[] }) {
  if (branches.length === 0) {
    return (
      <div className="py-6 text-center">
        <GitBranch className="mx-auto h-5 w-5 text-muted-foreground/40" />
        <p className="mt-1.5 text-[11px] text-muted-foreground">暂无分支</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {branches.map((branch) => {
        const bc = branchTypeConfig[branch.type];
        const Icon = bc.icon;
        return (
          <div
            key={branch.id}
            className={cn(
              'rounded-md border px-3 py-2 transition-colors cursor-pointer',
              branch.active
                ? 'border-primary/30 bg-primary/5'
                : 'border-line/60 hover:border-primary/20 hover:bg-surface-2'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', bc.bg)}>
                <Icon className={cn('h-3.5 w-3.5', bc.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground truncate">{branch.name}</span>
                  {branch.active && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary">
                      当前
                    </span>
                  )}
                </div>
                <p className="truncate text-[10px] text-muted-foreground">{branch.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 主组件 ─── */

type PanelTab = 'tasks' | 'calls' | 'branches';

interface ExecutionPanelProps {
  tasks: TaskNode[];
  toolCalls: ToolCallRecord[];
  branches: ResearchBranch[];
  className?: string;
}

export function ExecutionPanel({ tasks, toolCalls, branches, className }: ExecutionPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('tasks');

  const tabs: { key: PanelTab; label: string; count?: number }[] = [
    { key: 'tasks', label: '任务树', count: tasks.length },
    { key: 'calls', label: '调用记录', count: toolCalls.length },
    { key: 'branches', label: '分支记忆', count: branches.length },
  ];

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Tab 切换 */}
      <div className="flex border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 py-2.5 text-[11px] font-bold transition-colors relative',
              activeTab === tab.key
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  'ml-1 rounded-full px-1.5 py-0.5 text-[9px]',
                  activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-muted-foreground'
                )}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'tasks' && (
          <div className="space-y-0">
            {tasks.length === 0 ? (
              <div className="py-6 text-center">
                <GitBranch className="mx-auto h-5 w-5 text-muted-foreground/40" />
                <p className="mt-1.5 text-[11px] text-muted-foreground">发送复杂任务后将在此展示任务树</p>
              </div>
            ) : (
              tasks.map((task) => <TaskTreeNode key={task.id} node={task} />)
            )}
          </div>
        )}

        {activeTab === 'calls' && <ToolCallTimeline records={toolCalls} />}

        {activeTab === 'branches' && <BranchMemory branches={branches} />}
      </div>
    </div>
  );
}

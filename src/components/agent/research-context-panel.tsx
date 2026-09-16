'use client';

import React from 'react';
import {
  Brain,
  Database,
  Cpu,
  FlaskConical,
  GitBranch,
  FileCheck,
  Dna,
  BarChart3,
  MessageSquare,
  Wrench,
  FileText,
  Lightbulb,
  ChevronRight,
  Circle,
  Link2,
  Activity,
  CheckCircle2,
  Loader2,
  Beaker,
  TrendingUp,
  ArrowRight,
  Zap,
  ListChecks,
  Clock,
  AlertCircle,
  Lock,
  BookOpen,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── 类型 ─── */

export interface LongTermMemory {
  direction: string;
  project: string;
  approach: string;
  expertise: string;
}

export interface ConnectedTool {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'running' | 'disconnected';
  runningCount?: number;
}

export interface ConversationStats {
  messages: number;
  toolCalls: number;
  citedPapers: number;
  generatedOutputs: number;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  tag: string;
  tagColor: string;
}

export interface ActiveContext {
  id: string;
  label: string;
  detail: string;
  status: 'active' | 'idle' | 'completed';
}

export interface TaskProgressStep {
  id: string;
  label: string;
  subLabel?: string;
  space: 'read' | 'compute' | 'do' | 'output';
  status: 'done' | 'running' | 'pending' | 'blocked' | 'error';
  progress?: number;
}

export interface TaskProgress {
  title: string;
  totalSteps: number;
  completedSteps: number;
  currentStepLabel?: string;
  steps: TaskProgressStep[];
}

export interface ResearchContextData {
  memory: LongTermMemory;
  tools: ConnectedTool[];
  taskProgress?: TaskProgress;
  stats: ConversationStats;
  suggestions: SuggestedQuestion[];
  contexts: ActiveContext[];
}

/* ─── 配置 ─── */

const toolIconMap: Record<string, React.ElementType> = {
  '文献库': Database,
  '计算任务': Cpu,
  '实验台': Beaker,
  '知识图谱': GitBranch,
  '专利库': FileCheck,
  '蛋白脑DB': Dna,
  '分子库': FlaskConical,
};

const suggestionTagColors: Record<string, string> = {
  '导出': 'bg-blue-50 text-blue-600 border-blue-200',
  '实验': 'bg-green-50 text-green-600 border-green-200',
  '预测': 'bg-purple-50 text-purple-600 border-purple-200',
  '文献': 'bg-cyan-50 text-cyan-600 border-cyan-200',
  '计算': 'bg-amber-50 text-amber-600 border-amber-200',
  '写作': 'bg-orange-50 text-orange-600 border-orange-200',
};

const contextStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: 'text-green-600', bg: 'bg-green-100', label: '活跃' },
  idle: { color: 'text-faint', bg: 'bg-gray-100', label: '空闲' },
  completed: { color: 'text-blue-600', bg: 'bg-blue-100', label: '完成' },
};

/* ─── 子组件 ─── */

function SectionTitle({ icon: Icon, title, action }: { icon: React.ElementType; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-faint" />
        <span className="text-[10px] font-bold uppercase text-faint tracking-wider">{title}</span>
      </div>
      {action}
    </div>
  );
}

function MemorySection({ memory }: { memory: LongTermMemory }) {
  const items = [
    { label: '主要方向', value: memory.direction },
    { label: '当前项目', value: memory.project },
    { label: '研究路线', value: memory.approach },
    { label: '专长领域', value: memory.expertise },
  ];
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          <span className="shrink-0 text-[10px] font-bold text-faint w-14">{item.label}</span>
          <span className="text-[11px] text-foreground leading-relaxed">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ToolsSection({ tools }: { tools: ConnectedTool[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {tools.map((tool) => {
        const Icon = toolIconMap[tool.icon] || Link2;
        const isRunning = tool.status === 'running';
        const isConnected = tool.status === 'connected' || isRunning;
        return (
          <div
            key={tool.id}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2 py-1.5',
              isConnected ? 'border-line bg-surface-2' : 'border-line bg-gray-50 opacity-60'
            )}
          >
            <Icon className={cn('h-3 w-3 shrink-0', isRunning ? 'text-cyan' : isConnected ? 'text-primary' : 'text-faint')} />
            <span className="flex-1 truncate text-[10px] font-medium text-foreground">{tool.name}</span>
            {isRunning ? (
              <span className="flex items-center gap-0.5 shrink-0">
                <Loader2 className="h-2.5 w-2.5 animate-spin text-cyan" />
                <span className="text-[9px] font-bold text-cyan">{tool.runningCount || ''}</span>
              </span>
            ) : isConnected ? (
              <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-green-500" />
            ) : (
              <Circle className="h-2.5 w-2.5 shrink-0 text-faint" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatsSection({ stats }: { stats: ConversationStats }) {
  const items = [
    { label: '消息数', value: stats.messages, icon: MessageSquare, color: 'text-primary' },
    { label: '工具调用', value: stats.toolCalls, icon: Wrench, color: 'text-cyan' },
    { label: '引用文献', value: stats.citedPapers, icon: FileText, color: 'text-purple' },
    { label: '生成成果', value: stats.generatedOutputs, icon: TrendingUp, color: 'text-green-600' },
  ];
  return (
    <div className="grid grid-cols-4 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex flex-col items-center rounded-md border border-line bg-surface-2 py-1.5">
            <Icon className={cn('h-3 w-3 mb-0.5', item.color)} />
            <span className="text-[14px] font-black text-navy leading-none">{item.value}</span>
            <span className="mt-0.5 text-[9px] text-faint">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function SuggestionsSection({
  suggestions,
  onSelect,
}: {
  suggestions: SuggestedQuestion[];
  onSelect?: (q: SuggestedQuestion) => void;
}) {
  return (
    <div className="space-y-1">
      {suggestions.map((q) => (
        <button
          key={q.id}
          onClick={() => onSelect?.(q)}
          className="group flex w-full items-center gap-2 rounded-md border border-line bg-white px-2.5 py-2 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
        >
          <span
            className={cn(
              'shrink-0 rounded border px-1 py-0.5 text-[9px] font-bold',
              suggestionTagColors[q.tag] || 'bg-gray-50 text-gray-600 border-gray-200'
            )}
          >
            {q.tag}
          </span>
          <span className="flex-1 truncate text-[11px] text-foreground group-hover:text-primary leading-snug">
            {q.text}
          </span>
          <ChevronRight className="h-3 w-3 shrink-0 text-faint group-hover:text-primary transition-colors" />
        </button>
      ))}
    </div>
  );
}

function ContextSection({ contexts }: { contexts: ActiveContext[] }) {
  return (
    <div className="space-y-1.5">
      {contexts.map((ctx) => {
        const cfg = contextStatusConfig[ctx.status];
        return (
          <div key={ctx.id} className="rounded-md border border-line bg-surface-2 px-2.5 py-2">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-bold text-foreground truncate">{ctx.label}</span>
              <span
                className={cn(
                  'shrink-0 rounded px-1 py-0.5 text-[9px] font-bold',
                  cfg.color,
                  cfg.bg
                )}
              >
                {cfg.label}
              </span>
            </div>
            <p className="text-[10px] text-faint leading-snug">{ctx.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 任务进度配置 ─── */

const stepSpaceConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  read: { icon: BookOpen, color: 'text-blue-600', label: '读' },
  compute: { icon: Cpu, color: 'text-cyan', label: '算' },
  do: { icon: FlaskConical, color: 'text-green-600', label: '做' },
  output: { icon: FileText, color: 'text-amber', label: '出' },
};

const stepStatusIconMap: Record<string, React.ElementType> = {
  done: CheckCircle2,
  running: Loader2,
  pending: Clock,
  blocked: Lock,
  error: AlertCircle,
};

const stepStatusColorMap: Record<string, string> = {
  done: 'text-green-500',
  running: 'text-cyan',
  pending: 'text-faint',
  blocked: 'text-faint',
  error: 'text-destructive',
};

function TaskProgressSection({ progress }: { progress: TaskProgress }) {
  const pct = Math.round((progress.completedSteps / progress.totalSteps) * 100);
  const isRunning = progress.steps.some((s) => s.status === 'running');

  return (
    <div className="rounded-lg border border-line bg-surface-2/50 px-2.5 py-2.5">
      {/* 标题 + 进度数字 */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Target className="h-3 w-3 shrink-0 text-primary" />
          <span className="truncate text-[11px] font-bold text-navy">{progress.title}</span>
        </div>
        <span className="shrink-0 text-[10px] font-bold tabular-nums text-primary">
          {progress.completedSteps}/{progress.totalSteps}
        </span>
      </div>

      {/* 总进度条 */}
      <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isRunning ? 'bg-cyan' : pct === 100 ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 当前步骤提示 */}
      {progress.currentStepLabel && isRunning && (
        <div className="mb-2 flex items-center gap-1">
          <Loader2 className="h-2.5 w-2.5 animate-spin text-cyan" />
          <span className="text-[10px] text-cyan font-medium">{progress.currentStepLabel}</span>
        </div>
      )}

      {/* 步骤列表 */}
      <div className="space-y-1">
        {progress.steps.map((step) => {
          const sc = stepSpaceConfig[step.space];
          const SpaceIcon = sc?.icon;
          const StatusIcon = stepStatusIconMap[step.status];
          const stColor = stepStatusColorMap[step.status];
          const isStepRunning = step.status === 'running';

          return (
            <div key={step.id} className="flex items-center gap-1.5">
              {/* 空间图标 */}
              {SpaceIcon && (
                <span
                  className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded', sc?.color)}
                >
                  <SpaceIcon className="h-2.5 w-2.5" />
                </span>
              )}
              {/* 状态图标 */}
              <StatusIcon
                className={cn(
                  'h-3 w-3 shrink-0',
                  stColor,
                  isStepRunning && 'animate-spin'
                )}
              />
              {/* 标签 */}
              <span
                className={cn(
                  'flex-1 truncate text-[10px] leading-snug',
                  step.status === 'done' ? 'text-faint line-through' : 'text-foreground'
                )}
              >
                {step.label}
                {step.subLabel && (
                  <span className="text-faint ml-0.5">· {step.subLabel}</span>
                )}
              </span>
              {/* 运行中的迷你进度 */}
              {isStepRunning && step.progress !== undefined && (
                <span className="shrink-0 text-[9px] font-bold tabular-nums text-cyan">
                  {step.progress}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 主组件 ─── */

interface ResearchContextPanelProps {
  data: ResearchContextData;
  onSuggestionSelect?: (q: SuggestedQuestion) => void;
  className?: string;
}

export function ResearchContextPanel({ data, onSuggestionSelect, className }: ResearchContextPanelProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {/* 可滚动内容 */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {/* 1. AI 长期记忆 */}
        <div className="mb-4">
          <SectionTitle icon={Brain} title="AI 长期记忆" />
          <MemorySection memory={data.memory} />
        </div>

        {/* 2. 已接入工具 */}
        <div className="mb-4">
          <SectionTitle icon={Activity} title="已接入工具" />
          <ToolsSection tools={data.tools} />
        </div>

        {/* 2.5 任务进度（如果存在） */}
        {data.taskProgress && (
          <div className="mb-4">
            <SectionTitle icon={Target} title="任务进度" />
            <TaskProgressSection progress={data.taskProgress} />
          </div>
        )}

        {/* 3. 本次对话统计 */}
        <div className="mb-4">
          <SectionTitle icon={BarChart3} title="对话统计" />
          <StatsSection stats={data.stats} />
        </div>

        {/* 4. 建议追问 */}
        <div className="mb-4">
          <SectionTitle icon={Lightbulb} title="建议追问" />
          <SuggestionsSection suggestions={data.suggestions} onSelect={onSuggestionSelect} />
        </div>

        {/* 5. 当前上下文 */}
        <div className="mb-2">
          <SectionTitle icon={Zap} title="当前上下文" />
          <ContextSection contexts={data.contexts} />
        </div>
      </div>
    </div>
  );
}

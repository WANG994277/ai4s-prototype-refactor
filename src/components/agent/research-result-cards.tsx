'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowRight,
  ExternalLink,
  FileText,
  BookOpen,
  FlaskConical,
  Download,
  FileCheck,
  TrendingUp,
  BarChart3,
  Loader2,
  Clock,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────
   1. 轻量 AI 步骤指示器
   ──────────────────────────────────────────── */

export interface AIStep {
  id: string;
  text: string;
  detail?: string;
  status: 'done' | 'running' | 'pending';
}

interface AIStepIndicatorProps {
  steps: AIStep[];
  className?: string;
}

export function AIStepIndicator({ steps, className }: AIStepIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleSteps = expanded ? steps : steps.slice(0, 3);

  return (
    <div className={cn('rounded-lg border border-line bg-surface-2/50 px-3 py-2.5', className)}>
      <div className="space-y-1.5">
        {visibleSteps.map((step) => {
          const Icon =
            step.status === 'done' ? CheckCircle2 : step.status === 'running' ? Loader2 : Clock;
          const color =
            step.status === 'done'
              ? 'text-green-500'
              : step.status === 'running'
                ? 'text-cyan'
                : 'text-faint';
          return (
            <div key={step.id} className="flex items-center gap-2">
              <Icon
                className={cn(
                  'h-3.5 w-3.5 shrink-0',
                  color,
                  step.status === 'running' && 'animate-spin'
                )}
              />
              <span className="flex-1 text-[11px] leading-snug text-foreground">
                {step.text}
                {step.detail && (
                  <span className="text-[10px] text-faint ml-1">· {step.detail}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      {steps.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              收起
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              查看全部 {steps.length} 步
            </>
          )}
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   2. 数据对比表格
   ──────────────────────────────────────────── */

export interface ComparisonRow {
  label: string;
  value: string;
  secondary: string;
  isHighlight?: boolean;
  barColor?: string;
  barWidth?: number;
}

interface DataComparisonTableProps {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
  highlightLabel?: string;
  className?: string;
}

export function DataComparisonTable({
  title,
  columns,
  rows,
  highlightLabel,
  className,
}: DataComparisonTableProps) {
  return (
    <div className={cn('rounded-lg border border-line bg-white overflow-hidden', className)}>
      {/* 标题行 */}
      <div className="flex items-center justify-between border-b border-line bg-surface-2 px-3 py-2">
        <span className="text-[11px] font-bold text-navy">{title}</span>
        {highlightLabel && (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            {highlightLabel}
          </span>
        )}
      </div>
      {/* 表头 */}
      <div className="grid border-b border-line bg-white px-3 py-1.5" style={{ gridTemplateColumns: `2fr 1fr 1fr 1.2fr` }}>
        {columns.map((col, i) => (
          <span
            key={i}
            className={cn(
              'text-[10px] font-bold uppercase tracking-wide',
              i === 0 ? 'text-left text-faint' : 'text-right text-faint',
              i === 3 && 'text-center'
            )}
          >
            {col}
          </span>
        ))}
      </div>
      {/* 数据行 */}
      <div className="divide-y divide-line">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              'grid items-center px-3 py-2 transition-colors',
              row.isHighlight ? 'bg-primary/5' : 'bg-white hover:bg-surface-2/50',
              i === rows.length - 1 && 'border-b-0'
            )}
            style={{ gridTemplateColumns: `2fr 1fr 1fr 1.2fr` }}
          >
            <div className="flex items-center gap-1.5">
              {row.isHighlight && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              )}
              <span
                className={cn(
                  'text-[11px] truncate',
                  row.isHighlight ? 'font-bold text-primary' : 'text-foreground'
                )}
              >
                {row.label}
              </span>
            </div>
            <span className="text-right text-[11px] font-bold text-navy tabular-nums">
              {row.value}
            </span>
            <span className="text-right text-[11px] text-faint tabular-nums">
              {row.secondary}
            </span>
            {/* 迷你趋势条 */}
            <div className="flex items-center justify-center gap-1">
              <div className="h-3 w-12 rounded-sm bg-surface-2 overflow-hidden">
                <div
                  className={cn('h-full rounded-sm transition-all', row.barColor || 'bg-primary/40')}
                  style={{ width: `${row.barWidth || 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   3. 操作按钮组
   ──────────────────────────────────────────── */

export interface ActionButton {
  id: string;
  label: string;
  count?: number;
  icon: string;
  href?: string;
}

const actionIconMap: Record<string, React.ElementType> = {
  'experiment': FlaskConical,
  'literature': BookOpen,
  'export': Download,
  'report': FileText,
  'patent': FileCheck,
  'analysis': BarChart3,
};

interface ActionButtonGroupProps {
  intro: string;
  buttons: ActionButton[];
  onAction?: (btn: ActionButton) => void;
  className?: string;
}

export function ActionButtonGroup({ intro, buttons, onAction, className }: ActionButtonGroupProps) {
  return (
    <div className={cn('', className)}>
      <p className="mb-2 text-[12px] leading-relaxed text-foreground">{intro}</p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => {
          const Icon = actionIconMap[btn.icon] || ArrowRight;
          return (
            <button
              key={btn.id}
              onClick={() => onAction?.(btn)}
              className="group flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-[0_2px_8px_rgba(16,38,79,0.06)]"
            >
              <Icon className="h-3 w-3 text-primary" />
              {btn.label}
              {btn.count !== undefined && (
                <span className="rounded bg-primary/10 px-1 py-0.5 text-[9px] font-bold text-primary">
                  {btn.count}
                </span>
              )}
              <ExternalLink className="h-2.5 w-2.5 text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   4. 关联资料溯源标签
   ──────────────────────────────────────────── */

export interface ReferenceTag {
  id: string;
  label: string;
  type: 'paper' | 'task' | 'data' | 'patent';
}

const refTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  paper: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  task: { icon: Cpu, color: 'text-cyan', bg: 'bg-cyan/10 border-cyan/20' },
  data: { icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  patent: { icon: FileCheck, color: 'text-amber', bg: 'bg-amber/10 border-amber/20' },
};

interface ReferenceTagsProps {
  tags: ReferenceTag[];
  onTagClick?: (tag: ReferenceTag) => void;
  className?: string;
}

export function ReferenceTags({ tags, onTagClick, className }: ReferenceTagsProps) {
  if (tags.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <span className="text-[10px] font-bold text-faint">关联资料:</span>
      {tags.map((tag) => {
        const cfg = refTypeConfig[tag.type];
        const Icon = cfg.icon;
        return (
          <button
            key={tag.id}
            onClick={() => onTagClick?.(tag)}
            className={cn(
              'flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors hover:opacity-80',
              cfg.bg,
              cfg.color
            )}
          >
            <Icon className="h-2.5 w-2.5" />
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────
   5. 优先级推荐卡片
   ──────────────────────────────────────────── */

export interface PriorityRecommendation {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  metrics: { label: string; value: string }[];
  highlight?: boolean;
}

interface PriorityRecommendationCardProps {
  intro: string;
  recommendations: PriorityRecommendation[];
  onViewDetail?: (rec: PriorityRecommendation) => void;
  className?: string;
}

export function PriorityRecommendationCard({
  intro,
  recommendations,
  onViewDetail,
  className,
}: PriorityRecommendationCardProps) {
  return (
    <div className={cn('', className)}>
      <p className="mb-2 text-[12px] leading-relaxed text-foreground">{intro}</p>
      <div className="space-y-1.5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={cn(
              'rounded-lg border p-2.5 transition-all',
              rec.highlight
                ? 'border-primary/30 bg-primary/5 shadow-[0_2px_8px_rgba(16,38,79,0.06)]'
                : 'border-line bg-white'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {rec.highlight && <Flame className="h-3.5 w-3.5 text-orange-500" />}
                <span
                  className={cn(
                    'text-[10px] font-bold rounded px-1 py-0.5',
                    rec.highlight
                      ? 'bg-primary text-white'
                      : 'bg-surface-2 text-faint'
                  )}
                >
                  #{rec.rank}
                </span>
                <span className="text-[12px] font-bold text-navy">{rec.title}</span>
              </div>
              <button
                onClick={() => onViewDetail?.(rec)}
                className="flex items-center gap-0.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors"
              >
                查看详细参数
                <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
            <p className="mt-1 text-[10px] text-faint leading-snug">{rec.subtitle}</p>
            {rec.metrics.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-3">
                {rec.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[9px] text-faint">{m.label}</span>
                    <span className="text-[10px] font-bold text-navy tabular-nums">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   6. 分析结论块
   ──────────────────────────────────────────── */

interface AnalysisBlockProps {
  title?: string;
  content: string;
  highlight?: string;
  className?: string;
}

export function AnalysisBlock({ title, content, highlight, className }: AnalysisBlockProps) {
  return (
    <div className={cn('rounded-lg border border-line bg-white px-4 py-3', className)}>
      {title && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className="text-[12px] font-bold text-navy">{title}</span>
        </div>
      )}
      <p className="text-[13px] leading-relaxed text-foreground whitespace-pre-wrap">{content}</p>
      {highlight && (
        <div className="mt-2 rounded-md bg-amber/5 border border-amber/20 px-3 py-2">
          <p className="text-[11px] leading-relaxed text-amber font-medium whitespace-pre-wrap">
            {highlight}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { Bot, User, ChevronRight, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolCallCard, type ToolCallCardData } from '@/components/agent/tool-call-card';
import {
  AIStepIndicator,
  AnalysisBlock,
  DataComparisonTable,
  ActionButtonGroup,
  ReferenceTags,
  PriorityRecommendationCard,
  type AIStep,
  type ComparisonRow,
  type ActionButton,
  type ReferenceTag,
  type PriorityRecommendation,
} from '@/components/agent/research-result-cards';

/* ─── 消息内容块类型 ─── */

export type ContentPart =
  | { kind: 'text'; text: string }
  | { kind: 'steps'; steps: AIStep[] }
  | { kind: 'analysis'; title?: string; content: string; highlight?: string }
  | { kind: 'table'; title: string; columns: string[]; rows: ComparisonRow[]; highlightLabel?: string }
  | { kind: 'actions'; intro: string; buttons: ActionButton[] }
  | { kind: 'refs'; tags: ReferenceTag[] }
  | { kind: 'priority'; intro: string; recommendations: PriorityRecommendation[] };

export interface RichMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  // 简单文本
  content?: string;
  // 富内容块列表（按顺序渲染）
  parts?: ContentPart[];
  // Agent 思考过程
  thinking?: string;
  // 兼容旧格式工具调用
  toolCalls?: ToolCallCardData[];
  // 确认卡片
  confirmCard?: ConfirmCardData;
}

export interface ConfirmCardData {
  title: string;
  description: string;
  options: { label: string; icon: string; value: string }[];
}

/* ─── 渲染单个内容块 ─── */

function renderPart(part: ContentPart, key: number) {
  switch (part.kind) {
    case 'text':
      return (
        <div
          key={key}
          className="rounded-lg border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-foreground"
        >
          <div className="whitespace-pre-wrap">{part.text}</div>
        </div>
      );
    case 'steps':
      return <AIStepIndicator key={key} steps={part.steps} />;
    case 'analysis':
      return (
        <AnalysisBlock
          key={key}
          title={part.title}
          content={part.content}
          highlight={part.highlight}
        />
      );
    case 'table':
      return (
        <DataComparisonTable
          key={key}
          title={part.title}
          columns={part.columns}
          rows={part.rows}
          highlightLabel={part.highlightLabel}
        />
      );
    case 'actions':
      return <ActionButtonGroup key={key} intro={part.intro} buttons={part.buttons} />;
    case 'refs':
      return <ReferenceTags key={key} tags={part.tags} />;
    case 'priority':
      return (
        <PriorityRecommendationCard
          key={key}
          intro={part.intro}
          recommendations={part.recommendations}
        />
      );
    default:
      return null;
  }
}

/* ─── 消息渲染器 ─── */

interface MessageRendererProps {
  message: RichMessage;
  onConfirmChoice?: (value: string) => void;
  onRetryTool?: (id: string) => void;
  onAction?: (btn: ActionButton) => void;
}

const confirmIconMap: Record<string, React.ElementType> = {
  shield: Sparkles,
  alert: Sparkles,
  check: Sparkles,
};

export function MessageRenderer({
  message,
  onConfirmChoice,
  onRetryTool,
}: MessageRendererProps) {
  /* 系统消息：确认卡片 */
  if (message.role === 'system' && message.confirmCard) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-lg rounded-lg border border-amber/30 bg-amber/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber" />
            <span className="text-[13px] font-bold text-amber">{message.confirmCard.title}</span>
          </div>
          <p className="mb-3 whitespace-pre-wrap text-[12px] leading-relaxed text-foreground">
            {message.confirmCard.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {message.confirmCard.options.map((opt) => {
              const OptIcon = confirmIconMap[opt.icon] || Sparkles;
              return (
                <button
                  key={opt.value}
                  onClick={() => onConfirmChoice?.(opt.value)}
                  className="flex items-center gap-1.5 rounded-md border border-amber/30 bg-white px-3 py-1.5 text-[11px] font-bold text-foreground transition-colors hover:bg-amber/10 hover:border-amber/50"
                >
                  <OptIcon className="h-3 w-3 text-amber" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* 用户消息 */
  if (message.role === 'user') {
    return (
      <div className="flex flex-row-reverse gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <User className="h-3.5 w-3.5" />
        </div>
        <div className="max-w-[75%]">
          <div className="rounded-lg bg-primary px-4 py-3 text-[13px] leading-relaxed text-white">
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
          <span className="mt-1 block text-right text-[10px] text-faint">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  /* Agent 消息 */
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan/10 text-cyan">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 max-w-[82%] flex-1 space-y-2">
        {/* 思考过程 */}
        {message.thinking && (
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors hover:text-foreground">
              <Sparkles className="h-3 w-3 text-amber" />
              Agent 思考过程
              <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-1.5 rounded-md border border-amber/10 bg-amber/5 px-3 py-2">
              <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-muted-foreground">
                {message.thinking}
              </p>
            </div>
          </details>
        )}

        {/* 兼容旧格式：工具调用卡片 */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="space-y-1.5">
            {message.toolCalls.map((tc) => (
              <ToolCallCard
                key={tc.id}
                tool={tc}
                onRetry={tc.status === 'error' ? onRetryTool : undefined}
              />
            ))}
          </div>
        )}

        {/* 简单文本 */}
        {message.content && !message.parts && (
          <div className="rounded-lg border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-foreground">
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        )}

        {/* 富内容块 */}
        {message.parts && message.parts.map((part, idx) => renderPart(part, idx))}

        <span className="block text-[10px] text-faint">{message.timestamp}</span>
      </div>
    </div>
  );
}

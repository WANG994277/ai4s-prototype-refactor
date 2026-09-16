'use client';

import { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp,
  Send,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── 类型 ─── */

export interface AIInsight {
  icon: 'lightbulb' | 'alert' | 'sync' | 'check' | 'info';
  content: string;
}

export interface AIPreset {
  q: string;
  a: string;
}

export interface DoSpaceAIAssistantProps {
  /** 洞察卡片列表 */
  insights: AIInsight[];
  /** 预设问答 */
  presets: AIPreset[];
}

/* ─── 图标映射 ─── */

const iconMap = {
  lightbulb: Lightbulb,
  alert: AlertTriangle,
  sync: RefreshCw,
  check: Lightbulb,
  info: Lightbulb,
} as const;

const iconColorMap = {
  lightbulb: 'text-primary',
  alert: 'text-amber',
  sync: 'text-cyan',
  check: 'text-green-500',
  info: 'text-muted-foreground',
} as const;

/* ─── 组件 ─── */

export function DoSpaceAIAssistant({ insights, presets }: DoSpaceAIAssistantProps) {
  const [expanded, setExpanded] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);

  const handlePresetClick = (idx: number) => {
    const preset = presets[idx];
    setActivePreset(idx);
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: preset.q },
      { role: 'ai', text: preset.a },
    ]);
  };

  const insightIcon = (type: AIInsight['icon']) => {
    const Icon = iconMap[type];
    return <Icon className={cn('h-3.5 w-3.5 shrink-0', iconColorMap[type])} />;
  };

  return (
    <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-4">
      {/* 标题 */}
      <div className="mb-3 flex items-center gap-1.5">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-navy">做空间AI助理</span>
      </div>

      {/* 洞察卡片 */}
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="rounded-md border border-line/60 bg-white px-3 py-2.5 text-xs leading-relaxed text-foreground"
          >
            <div className="flex items-start gap-2">
              {insightIcon(insight.icon)}
              <span>{insight.content}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 展开/收起按钮 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-primary/30 bg-white px-3 py-2 text-[12px] font-bold text-primary transition-colors hover:bg-primary/5"
      >
        {expanded ? (
          <>
            收起对话 <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            <MessageCircle className="h-3.5 w-3.5" /> 展开对话
          </>
        )}
      </button>

      {/* 对话区域 */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {/* 预设问题 */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase text-faint">快捷提问</p>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(idx)}
                className={cn(
                  'flex w-full items-center gap-1.5 rounded-md border px-3 py-2 text-left text-[12px] font-medium transition-colors',
                  activePreset === idx
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-line/60 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5'
                )}
              >
                <Sparkles className="h-3 w-3 shrink-0 text-primary" />
                {preset.q}
              </button>
            ))}
          </div>

          {/* 对话消息 */}
          {chatMessages.length > 0 && (
            <div className="max-h-64 space-y-2.5 overflow-y-auto rounded-md border border-line/60 bg-white p-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2">
                  {msg.role === 'ai' ? (
                    <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  ) : (
                    <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <div
                    className={cn(
                      'text-xs leading-relaxed',
                      msg.role === 'ai' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {msg.text.split('\n').map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 输入框 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="输入您的问题..."
              className="flex-1 rounded-md border border-line/60 bg-white px-3 py-2 text-[12px] text-foreground placeholder:text-faint focus:border-primary/40 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const val = e.currentTarget.value.trim();
                  setChatMessages((prev) => [
                    ...prev,
                    { role: 'user', text: val },
                    {
                      role: 'ai',
                      text: '已收到您的问题，正在基于当前做空间数据进行分析...',
                    },
                  ]);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button className="rounded-md bg-primary px-2.5 py-2 text-white transition-colors hover:bg-primary/90">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

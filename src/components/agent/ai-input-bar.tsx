'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Code2,
  Table,
  Image,
  Cpu,
  Quote,
  BookOpenText,
  Calculator,
  FlaskConical,
  PenLine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── 类型 ─── */

export interface ContextTag {
  id: string;
  label: string;
  type: 'task' | 'project' | 'data' | 'file';
  removable?: boolean;
}

export type ChatMode = 'literature' | 'compute' | 'experiment' | 'report';

interface ChatModeConfig {
  value: ChatMode;
  label: string;
  icon: LucideIcon;
  hint: string;
}

const chatModes: ChatModeConfig[] = [
  { value: 'literature',  label: '查找文献', icon: BookOpenText,  hint: '聚焦文献库检索与分析' },
  { value: 'compute',    label: '计算任务',  icon: Calculator,    hint: '聚焦 DFT / MD 等计算任务' },
  { value: 'experiment', label: '设计实验',  icon: FlaskConical,  hint: '聚焦实验方案与贝叶斯优化' },
  { value: 'report',     label: '生成报告',  icon: PenLine,       hint: '聚焦综述 / 报告 / 论文撰写' },
];

const inputTools = [
  { icon: Code2, label: '代码' },
  { icon: Table, label: '表格' },
  { icon: Image, label: '图片' },
  { icon: Cpu, label: '计算' },
  { icon: Quote, label: '引用' },
];

/* ─── 组件 ─── */

interface AIInputBarProps {
  onSend: (text: string) => void;
  contextTags?: ContextTag[];
  onRemoveTag?: (id: string) => void;
  placeholder?: string;
  className?: string;
}

export function AIInputBar({
  onSend,
  contextTags = [],
  onRemoveTag,
  placeholder = '描述您的研究任务，AI 将为您查找文献、执行计算、设计实验或生成报告...',
  className,
}: AIInputBarProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('literature');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  }, [input, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('border-t border-line bg-white px-5 py-3', className)}>
      <div className="mx-auto max-w-3xl">
        {/* 模式切换 */}
        <div className="mb-2 flex items-center gap-1">
          {chatModes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                title={m.hint}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'text-faint hover:bg-surface-2 hover:text-foreground'
                )}
              >
                <Icon className={cn('h-3 w-3', active ? 'text-white' : 'text-faint')} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* 输入框 */}
        <div className="flex items-end gap-2 rounded-lg border border-line bg-white px-3 py-2 shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-all focus-within:border-primary/40 focus-within:shadow-[0_2px_12px_rgba(16,38,79,0.08)]">
          {/* 左侧附件 */}
          <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2">
            <Paperclip className="h-4 w-4" />
          </button>

          {/* 文本输入 */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none bg-transparent text-[13px] text-foreground placeholder:text-faint focus:outline-none"
          />

          {/* 格式化工具栏 */}
          <div className="flex items-center gap-0.5">
            {inputTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  title={tool.label}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          {/* 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 提示文字 */}
        <p className="mt-1.5 text-center text-[10px] text-faint">
          <span className="font-medium">Shift+Enter</span> 换行 ·{' '}
          <span className="font-medium">Enter</span> 发送 ·{' '}
          {chatModes.find((m) => m.value === mode)?.hint}
        </p>
      </div>
    </div>
  );
}

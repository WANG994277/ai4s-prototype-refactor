'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  '帮我检索最近的催化裂化文献',
  '分析这个分子的合成路径',
  '生成实验设计方案',
];

export function AICopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '正在分析您的问题，请稍候...',
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[380px] flex-col rounded-lg border border-line bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-bold text-navy">AI Copilot</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  有什么可以帮您的？
                </p>
                <div className="flex flex-col gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setInput(action);
                      }}
                      className="rounded-md border border-line bg-surface-2 px-3 py-2 text-xs text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'mb-3 flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-[13px] leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-surface-2 text-foreground'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-line px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入您的问题..."
                className="flex-1 rounded-md border border-line bg-surface-2 px-3 py-2 text-[13px] text-foreground placeholder:text-faint focus:border-primary/40 focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

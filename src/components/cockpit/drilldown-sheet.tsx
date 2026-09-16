'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { DrilldownDetail } from '@/lib/mock/cockpit';

export function DrilldownSheet({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrilldownDetail | null;
}) {
  const [activeTab, setActiveTab] = React.useState<'members' | 'usage' | 'resources' | 'logs'>('members');

  if (!data) return null;

  const tabs = [
    { key: 'members' as const, label: '成员列表' },
    { key: 'usage' as const, label: '使用情况' },
    { key: 'resources' as const, label: '关联资源' },
    { key: 'logs' as const, label: '操作日志' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-navy">{data.name}</SheetTitle>
        </SheetHeader>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {/* 成员列表 */}
          {activeTab === 'members' && (
            <div className="space-y-2">
              {data.members.map((member) => (
                <div key={member.name} className="flex items-center gap-3 rounded-md border border-line/60 bg-surface-2/50 px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {member.name[0]}
                  </div>
                  <div className="flex-1">
                    <span className="text-[13px] font-medium text-foreground">{member.name}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground">{member.role}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{member.lastActive}</span>
                </div>
              ))}
            </div>
          )}

          {/* 使用情况 */}
          {activeTab === 'usage' && (
            <div>
              <div className="mb-3 text-[13px] font-bold text-navy">近14天使用趋势</div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.usage} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,38,79,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 关联资源 */}
          {activeTab === 'resources' && (
            <div className="space-y-2">
              {data.resources.map((resource) => (
                <div key={resource.name} className="flex items-center gap-3 rounded-md border border-line/60 bg-surface-2/50 px-3 py-2.5">
                  <div className="flex-1">
                    <span className="text-[13px] font-medium text-foreground">{resource.name}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground">{resource.type}</span>
                  </div>
                  <span className="text-[12px] font-bold text-navy">{resource.count} 条</span>
                </div>
              ))}
            </div>
          )}

          {/* 操作日志 */}
          {activeTab === 'logs' && (
            <div className="space-y-1.5">
              {data.logs.map((log, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-line/30 last:border-0">
                  <span className="shrink-0 text-[11px] text-muted-foreground w-16">{log.time}</span>
                  <span className="flex-1 text-[12px] text-foreground">{log.action}</span>
                  <span className="shrink-0 text-[11px] text-primary font-medium">{log.user}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

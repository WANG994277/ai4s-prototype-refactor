'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrilldownColumn {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
  width?: string;
}

export interface DrilldownRow {
  [key: string]: unknown;
}

export function DrilldownDialog({
  open,
  onOpenChange,
  title,
  columns,
  rows,
  filters,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  columns: DrilldownColumn[];
  rows: DrilldownRow[];
  filters?: { label: string; options: string[]; value: string; onChange: (v: string) => void }[];
}) {
  const handleExport = () => {
    const header = columns.map((c) => c.label).join(',');
    const csvRows = rows.map((row) =>
      columns.map((c) => String(row[c.key] ?? '')).join(',')
    );
    const csv = [header, ...csvRows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[960px] sm:max-w-[960px] gap-0 p-0" showCloseButton={false} aria-describedby={undefined}>
        {/* 标题栏 */}
        <DialogHeader className="flex-row items-center justify-between border-b border-line px-6 py-4">
          <DialogTitle className="text-base font-bold text-navy">{title}</DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-2"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* 筛选栏 */}
        <div className="flex items-center gap-3 border-b border-line bg-surface-2/50 px-6 py-3">
          {filters?.map((f) => (
            <Select key={f.label} value={f.value} onValueChange={f.onChange}>
              <SelectTrigger className="h-8 w-[140px] text-[12px]">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          <button
            type="button"
            onClick={handleExport}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            导出明细
          </button>
        </div>

        {/* 数据表格 */}
        <div className="max-h-[460px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-surface-2">
              <tr className="border-b border-line">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2.5 text-left text-[11px] font-bold text-muted-foreground"
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-line/40 transition-colors hover:bg-surface-2/30"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 text-[12px] text-foreground">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between border-t border-line px-6 py-3">
          <span className="text-[11px] text-muted-foreground">共 {rows.length} 条记录</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-line bg-white px-4 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-surface-2"
          >
            关闭
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ===== 状态标签组件 =====
export function StatusTag({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    '活跃': { bg: '#E8F5E9', text: '#2E7D32' },
    '运行中': { bg: '#E8F5E9', text: '#2E7D32' },
    '已完成': { bg: '#E8F5E9', text: '#2E7D32' },
    '进行中': { bg: '#E8F5E9', text: '#2E7D32' },
    '建设中': { bg: '#FFF3E0', text: '#E65100' },
    '审核中': { bg: '#FFF3E0', text: '#E65100' },
    '排队中': { bg: '#FFF3E0', text: '#E65100' },
    '归档': { bg: '#F5F5F5', text: '#757575' },
    '失败': { bg: '#FFEBEE', text: '#C62828' },
    '高风险': { bg: '#FFEBEE', text: '#C62828' },
    'error': { bg: '#FFEBEE', text: '#C62828' },
    '中风险': { bg: '#FFF8E1', text: '#F57F17' },
    'warning': { bg: '#FFF8E1', text: '#F57F17' },
    '低风险': { bg: '#F5F5F5', text: '#757575' },
    'info': { bg: '#E3F2FD', text: '#1565C0' },
  };
  const cfg = config[status] || { bg: '#F5F5F5', text: '#757575' };
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {status}
    </span>
  );
}

// ===== 趋势进度条 =====
export function TrendBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-green-600">{value}%</span>
    </div>
  );
}

// ===== 卡片容器 =====
export function ChartCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-lg border border-line bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]', className)}>
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-[13px] font-bold text-navy">{title}</h4>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { unitOptions, projectOptions, workbenchOptions, timeRangeOptions } from '@/lib/mock/cockpit';

export interface FilterState {
  timeRange: string;
  unit: string;
  project: string;
  workbench: string;
}

export function FilterBar({
  filters,
  onChange,
  onExport,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onExport?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* 时间范围 */}
      <div className="flex rounded-lg border border-line bg-white p-0.5">
        {timeRangeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ ...filters, timeRange: opt.value })}
            className={cn(
              'rounded-md px-3 py-1 text-[12px] font-medium transition-colors',
              filters.timeRange === opt.value
                ? 'bg-primary text-white font-bold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 单位筛选 */}
      <Select value={filters.unit} onValueChange={(v) => onChange({ ...filters, unit: v })}>
        <SelectTrigger className="h-8 w-[140px] text-[12px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {unitOptions.map((u) => (
            <SelectItem key={u} value={u}>{u}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 项目筛选 */}
      <Select value={filters.project} onValueChange={(v) => onChange({ ...filters, project: v })}>
        <SelectTrigger className="h-8 w-[140px] text-[12px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {projectOptions.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 工作台筛选 */}
      <Select value={filters.workbench} onValueChange={(v) => onChange({ ...filters, workbench: v })}>
        <SelectTrigger className="h-8 w-[160px] text-[12px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {workbenchOptions.map((w) => (
            <SelectItem key={w} value={w}>{w}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 导出按钮 */}
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-primary shadow-[0_2px_8px_rgba(16,38,79,0.04)] transition-colors hover:bg-primary/5"
        >
          <Download className="h-3.5 w-3.5" />
          导出
        </button>
      )}
    </div>
  );
}

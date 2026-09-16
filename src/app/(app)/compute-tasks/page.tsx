'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Search,
  X,
  Plus,
  Atom,
  Thermometer,
  Layers,
  Gauge,
  Pause,
  Play,
  Square,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FolderArchive,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type Task,
  type TaskStatus,
  type TaskType,
  type ComputeNode,
  type ParamItem,
  type ProcessStep,
  type ConvergencePoint,
  type ResultField,
  type ChargeEntry,
  type ResultFile,
  initialTasks,
  computeNodes,
  typeConfig,
  statusConfig,
  kpis,
} from '@/lib/compute-data';

// Local type for new task creation form
type NewTaskType = 'DFT' | 'MD' | 'MC' | 'QC';

interface TaskTypeMeta {
  label: string;
  desc: string;
  color: string;
  icon: typeof Cpu;
  defaultParams: Record<string, string | number>;
  fields: { key: string; label: string; unit?: string; type: 'number' | 'text' | 'select'; options?: string[] }[];
}

// ===== Task Type Config (for new task creation) =====

const taskTypeMeta: Record<NewTaskType, TaskTypeMeta> = {
  DFT: {
    label: 'DFT',
    desc: '密度泛函理论，电子结构计算',
    color: '#7c5ce0',
    icon: Atom,
    defaultParams: { name: '', encut: 500, kpoints: '3×3×3', atoms: 60, functional: 'PBE', gpu: '2×V100' },
    fields: [
      { key: 'name', label: '任务名称', type: 'text' },
      { key: 'encut', label: '截断能 ENCUT', unit: 'eV', type: 'number' },
      { key: 'kpoints', label: 'K点网格', type: 'text' },
      { key: 'functional', label: '交换关联泛函', type: 'select', options: ['PBE', 'RPBE', 'B3LYP', 'HSE06'] },
      { key: 'atoms', label: '原子数', type: 'number' },
      { key: 'gpu', label: 'GPU 分配', type: 'select', options: ['1×V100', '2×V100', '4×V100', '1×A100', '2×A100', '4×A100'] },
    ],
  },
  MD: {
    label: 'MD',
    desc: '分子动力学模拟，时间演化轨迹',
    color: '#1d5fd6',
    icon: Gauge,
    defaultParams: { name: '', timestep: 1.0, steps: 100000, temp: 300, forcefield: 'ReaxFF', atoms: 5000, gpu: '4×V100' },
    fields: [
      { key: 'name', label: '任务名称', type: 'text' },
      { key: 'timestep', label: '时间步长', unit: 'fs', type: 'number' },
      { key: 'steps', label: '总步数', type: 'number' },
      { key: 'temp', label: '温度', unit: 'K', type: 'number' },
      { key: 'forcefield', label: '力场', type: 'select', options: ['ReaxFF', 'Tersoff', 'Lennard-Jones', 'COMB3'] },
      { key: 'atoms', label: '原子数', type: 'number' },
      { key: 'gpu', label: 'GPU 分配', type: 'select', options: ['1×V100', '2×V100', '4×V100', '1×A100', '2×A100', '4×A100'] },
    ],
  },
  MC: {
    label: 'MC',
    desc: '蒙特卡洛采样，统计系综计算',
    color: '#f59e0b',
    icon: Layers,
    defaultParams: { name: '', steps: 500000, temp: 300, atoms: 2000, ensemble: 'NVT', gpu: '2×V100' },
    fields: [
      { key: 'name', label: '任务名称', type: 'text' },
      { key: 'steps', label: '采样步数', type: 'number' },
      { key: 'temp', label: '温度', unit: 'K', type: 'number' },
      { key: 'ensemble', label: '系综', type: 'select', options: ['NVT', 'NPT', 'μVT', 'NVE'] },
      { key: 'atoms', label: '原子数', type: 'number' },
      { key: 'gpu', label: 'GPU 分配', type: 'select', options: ['1×V100', '2×V100', '4×V100', '1×A100', '2×A100'] },
    ],
  },
  QC: {
    label: 'QC',
    desc: '量子化学计算，高精度电子结构',
    color: '#13b7c7',
    icon: Thermometer,
    defaultParams: { name: '', method: 'B3LYP', basis: '6-311G**', atoms: 30, charge: 0, multiplicity: 1, gpu: '1×A100' },
    fields: [
      { key: 'name', label: '任务名称', type: 'text' },
      { key: 'method', label: '计算方法', type: 'select', options: ['HF', 'B3LYP', 'MP2', 'CCSD(T)', 'CASSCF'] },
      { key: 'basis', label: '基组', type: 'select', options: ['6-31G*', '6-311G**', 'def2-TZVP', 'cc-pVTZ', 'aug-cc-pVTZ'] },
      { key: 'atoms', label: '原子数', type: 'number' },
      { key: 'charge', label: '电荷', type: 'number' },
      { key: 'multiplicity', label: '自旋多重度', type: 'number' },
      { key: 'gpu', label: 'GPU 分配', type: 'select', options: ['1×V100', '2×V100', '1×A100', '2×A100'] },
    ],
  },
};

const filters: { key: 'all' | TaskStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'running', label: '运行中' },
  { key: 'paused', label: '暂停' },
  { key: 'queued', label: '排队' },
  { key: 'done', label: '完成' },
  { key: 'error', label: '失败' },
];

const nodeStatusDot: Record<ComputeNode['status'], string> = {
  online: 'bg-success',
  maintenance: 'bg-amber',
  offline: 'bg-on-surface-variant/30',
};

// ===== Sparkline SVG Component =====
function Sparkline({ data, color, height = 48 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 260;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  const areaPoints = `${0},${height} ${points} ${w},${height}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ minHeight: `${height}px` }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

// ===== Confirm Dialog Component =====
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-3 flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', confirmVariant === 'danger' ? 'bg-red/10' : 'bg-amber/10')}>
            {confirmVariant === 'danger' ? <XCircle className="h-5 w-5 text-red" /> : <AlertTriangle className="h-5 w-5 text-amber" />}
          </div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-md bg-surface-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2/80">取消</button>
          <button
            onClick={onConfirm}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium text-white',
              confirmVariant === 'danger' ? 'bg-red hover:opacity-90' : 'bg-amber hover:opacity-90'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function ComputeTasksPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | TaskStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedType, setSelectedType] = useState<NewTaskType>('DFT');
  const [formParams, setFormParams] = useState<Record<string, string | number>>(taskTypeMeta.DFT.defaultParams);

  // Detail drawer state
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    params: true,
    process: true,
    convergence: true,
    results: false,
    charges: false,
    files: false,
  });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    taskId: string;
    action: 'pause' | 'resume' | 'abort';
  }>({ open: false, taskId: '', action: 'pause' });

  const selectedTask = useMemo(() => taskList.find((t) => t.id === detailTaskId) ?? null, [detailTaskId, taskList]);

  const filteredTasks = useMemo(() => {
    return taskList.filter((t) => {
      const statusMatch = activeFilter === 'all' || t.status === activeFilter;
      const searchMatch = !searchQuery ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [activeFilter, searchQuery, taskList]);

  const nextTaskId = useMemo(() => {
    const prefix = selectedType;
    const existing = taskList
      .filter((t) => t.id.startsWith(prefix))
      .map((t) => parseInt(t.id.split('-')[1], 10))
      .filter((n) => !isNaN(n));
    const max = existing.length > 0 ? Math.max(...existing) : 2800;
    return `${prefix}-${max + 1}`;
  }, [selectedType, taskList]);

  const handleTypeChange = (type: NewTaskType) => {
    setSelectedType(type);
    setFormParams(taskTypeMeta[type].defaultParams);
  };

  const handleSubmit = () => {
    const taskName = String(formParams.name || '').trim();
    if (!taskName) return;
    const newTask: Task = {
      id: nextTaskId,
      name: taskName,
      type: selectedType,
      status: 'queued',
      progress: 0,
      progressLabel: '排队中',
      nodes: String(formParams.gpu || '2×V100'),
      nodeName: '待分配',
      elapsed: '—',
      queuePosition: taskList.filter((t) => t.status === 'queued').length + 1,
      queueWait: '排队中',
      params: taskTypeMeta[selectedType].fields
        .filter((f) => f.key !== 'name')
        .map((f) => ({ key: f.key, label: f.label, value: formParams[f.key] ?? '', unit: f.unit })),
      processSteps: [
        { label: '排队等待', value: '提交中', status: 'active' },
      ],
    };
    setTaskList((prev) => [newTask, ...prev]);
    setShowDrawer(false);
    setFormParams(taskTypeMeta[selectedType].defaultParams);
  };

  const handleTaskAction = useCallback((taskId: string, action: 'pause' | 'resume' | 'abort') => {
    setConfirmDialog({ open: true, taskId, action });
  }, []);

  const executeTaskAction = useCallback(() => {
    const { taskId, action } = confirmDialog;
    setTaskList((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        switch (action) {
          case 'pause':
            return { ...t, status: 'paused' as TaskStatus, progressLabel: `暂停于 ${t.progressLabel}` };
          case 'resume':
            return { ...t, status: 'running' as TaskStatus, progressLabel: t.progressLabel.replace('暂停于 ', '') };
          case 'abort':
            return { ...t, status: 'error' as TaskStatus, progressLabel: '已中止', nodes: '—', nodeName: '—', errorHint: '用户手动中止' };
          default:
            return t;
        }
      })
    );
    setConfirmDialog({ open: false, taskId: '', action: 'pause' });
  }, [confirmDialog]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isFormValid = String(formParams.name || '').trim().length > 0;

  return (
    <div className="space-y-5">
      {/* 1. Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">计算任务</h1>
        <button
          onClick={() => { setShowDrawer(true); setSelectedType('DFT'); setFormParams(taskTypeMeta.DFT.defaultParams); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5" />新建任务
        </button>
      </div>

      {/* 2. KPI Dashboard */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className={cn(
              'rounded-lg border bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]',
              idx === 0 ? 'border-primary/30 bg-primary/5' : 'border-line-2/20'
            )}
          >
            <div className={cn('text-xl font-black', idx === 0 ? 'text-primary' : 'text-navy')}>
              {kpi.value}
              {kpi.unit && <span className="ml-1 text-sm font-semibold text-faint">{kpi.unit}</span>}
            </div>
            <div className={cn('mt-1 text-[11px] font-bold', idx === 0 ? 'text-primary/70' : 'text-faint')}>{kpi.label}</div>
            {kpi.sub && <div className="mt-0.5 text-[10px] text-muted-foreground">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* 3. Main Dual-Column Layout */}
      <div className="flex gap-5">
        {/* Left: Task Queue */}
        <div className="flex-[3] min-w-0">
          <div className="overflow-hidden rounded-lg border border-line-2/20 bg-white shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            {/* Filter Bar */}
            <div className="flex items-center justify-between border-b border-line-2/20 px-4 py-3">
              <div className="flex items-center gap-1">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs transition-colors',
                      activeFilter === f.key
                        ? 'bg-primary/10 font-bold text-primary'
                        : 'font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="搜索任务名称或ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 rounded-md border-none bg-surface-2 py-1.5 pl-8 pr-3 text-xs text-foreground transition-colors placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Task Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line-2/20 bg-surface-2/80">
                    <th className="w-24 px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground">任务ID</th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground">任务名称</th>
                    <th className="w-40 px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground">进度</th>
                    <th className="w-28 px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground">当前阶段</th>
                    <th className="w-32 px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground">耗时/预估</th>
                    <th className="w-36 px-3 py-2.5 text-right text-[10px] font-bold text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const sc = statusConfig[task.status];
                    const tc = typeConfig[task.type];
                    return (
                      <tr
                        key={task.id}
                        onClick={() => { setDetailTaskId(task.id); setExpandedSections({ params: true, process: true, convergence: true, results: false, charges: false, files: false }); }}
                        className={cn(
                          'border-b border-line-2/10 transition-colors cursor-pointer hover:bg-surface-2/50',
                          detailTaskId === task.id && 'bg-primary/5'
                        )}
                      >
                        {/* Task ID */}
                        <td className="px-3 py-3 font-mono text-xs font-medium text-muted-foreground">{task.id}</td>

                        {/* Task Name + Type */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate max-w-[280px]">{task.name}</span>
                            <span className={cn('inline-flex shrink-0 items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold', tc.bg, tc.text)}>
                              {task.type}
                            </span>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-line">
                              <div className={cn('h-1.5 rounded-full transition-all', sc.barColor)} style={{ width: `${task.progress}%` }} />
                            </div>
                            <span className={cn('w-8 text-right text-[10px] font-bold', sc.textColor)}>{task.progress}%</span>
                          </div>
                        </td>

                        {/* Current Stage */}
                        <td className="px-3 py-3 text-xs text-muted-foreground truncate max-w-[120px]">{task.progressLabel}</td>

                        {/* Elapsed / Estimated */}
                        <td className="px-3 py-3">
                          <div className="text-[11px] text-foreground">{task.elapsed}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {task.status === 'running' && task.estimatedRemaining && `预计 ${task.estimatedRemaining}`}
                            {task.status === 'paused' && '暂停中'}
                            {task.status === 'queued' && task.queuePosition != null && `排队 #${task.queuePosition}`}
                            {task.status === 'done' && '结果就绪'}
                            {task.status === 'error' && (task.errorHint || '已中断')}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            {task.status === 'running' && (
                              <button
                                onClick={() => handleTaskAction(task.id, 'pause')}
                                className="inline-flex items-center gap-1 rounded-md border border-amber/30 bg-amber/5 px-2 py-1 text-[10px] font-medium text-amber transition-colors hover:bg-amber/10"
                              >
                                <Pause className="h-3 w-3" />暂停
                              </button>
                            )}
                            {task.status === 'paused' && (
                              <button
                                onClick={() => handleTaskAction(task.id, 'resume')}
                                className="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/5 px-2 py-1 text-[10px] font-medium text-success transition-colors hover:bg-success/10"
                              >
                                <Play className="h-3 w-3" />恢复
                              </button>
                            )}
                            {task.status === 'queued' && (
                              <button
                                onClick={() => handleTaskAction(task.id, 'abort')}
                                className="inline-flex items-center gap-1 rounded-md border border-red/30 bg-red/5 px-2 py-1 text-[10px] font-medium text-red transition-colors hover:bg-red/10"
                              >
                                <X className="h-3 w-3" />取消
                              </button>
                            )}
                            {task.status === 'error' && (
                              <button
                                className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10"
                              >
                                <RotateCcw className="h-3 w-3" />重试
                              </button>
                            )}
                            {task.status === 'done' && (
                              <Link
                                href={`/compute-results/${task.id}`}
                                className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10"
                              >
                                查看结果<ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">无匹配任务</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Resource Monitoring + Node Grid */}
        <div className="flex flex-[2] min-w-0 flex-col gap-4">
          {/* GPU/CPU Utilization */}
          <div className="rounded-lg border border-line-2/20 bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <h3 className="mb-4 text-base font-semibold text-foreground">资源利用率</h3>
            {/* GPU */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">GPU</span>
                <span className="text-sm font-black text-navy">78%</span>
              </div>
              <div className="h-5 overflow-hidden rounded-md bg-line">
                <div className="h-5 rounded-md bg-gradient-to-r from-chart-1 to-chart-2 transition-all" style={{ width: '78%' }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-faint">
                <span>V100 × 6 / A100 × 4</span>
                <span>7.8 / 10 卡在用</span>
              </div>
            </div>
            {/* CPU */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">CPU</span>
                <span className="text-sm font-black text-navy">45%</span>
              </div>
              <div className="h-5 overflow-hidden rounded-md bg-line">
                <div className="h-5 rounded-md bg-gradient-to-r from-chart-3 to-chart-4 transition-all" style={{ width: '45%' }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-faint">
                <span>96 核总计</span>
                <span>43.2 核在用</span>
              </div>
            </div>
          </div>

          {/* Compute Nodes Grid */}
          <div className="rounded-lg border border-line-2/20 bg-white p-4 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <h3 className="mb-3 text-base font-semibold text-foreground">计算节点</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {computeNodes.map((node) => (
                <div
                  key={node.name}
                  className={cn(
                    'rounded-md border border-line-2/20 p-3',
                    node.status === 'offline' && 'opacity-60'
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{node.name}</span>
                    <span className={cn('h-2 w-2 rounded-full', nodeStatusDot[node.status])} />
                  </div>
                  <div className="mb-1.5 text-[10px] text-faint">{node.gpu}</div>
                  <div className="mb-1 flex items-center gap-1">
                    <span className="w-6 text-[10px] text-faint">GPU</span>
                    <div className="h-1.5 flex-1 rounded-full bg-line">
                      <div
                        className={cn('h-1.5 rounded-full', node.status === 'maintenance' ? 'bg-amber' : node.status === 'offline' ? 'bg-on-surface-variant/30' : 'bg-chart-1')}
                        style={{ width: `${node.gpuUsage}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-[10px] font-bold text-foreground">{node.gpuUsage}%</span>
                  </div>
                  <div className="mb-1 flex items-center gap-1">
                    <span className="w-6 text-[10px] text-faint">CPU</span>
                    <div className="h-1.5 flex-1 rounded-full bg-line">
                      <div
                        className={cn('h-1.5 rounded-full', node.status === 'maintenance' ? 'bg-amber' : node.status === 'offline' ? 'bg-on-surface-variant/30' : 'bg-chart-3')}
                        style={{ width: `${node.cpuUsage}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-[10px] font-bold text-foreground">{node.cpuUsage}%</span>
                  </div>
                  <div className={cn('text-[10px]', node.status === 'maintenance' ? 'text-amber' : node.status === 'offline' ? 'text-faint' : 'text-faint')}>
                    {node.status === 'maintenance' ? '维护中' : node.status === 'offline' ? '离线' : `内存 ${node.memory}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Task Detail Drawer ===== */}
      {detailTaskId && selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetailTaskId(null)} />
          <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-[slideInRight_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line-2/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className={cn('inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-bold', statusConfig[selectedTask.status].bgColor, statusConfig[selectedTask.status].textColor)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig[selectedTask.status].dotColor, statusConfig[selectedTask.status].pulse && 'animate-pulse')} />
                  {statusConfig[selectedTask.status].label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{selectedTask.id}</span>
              </div>
              <button onClick={() => setDetailTaskId(null)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Task name + progress */}
            <div className="border-b border-line-2/20 px-5 py-4">
              <h2 className="mb-2 text-base font-semibold text-foreground">{selectedTask.name}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-2 flex-1 rounded-full bg-line">
                    <div className={cn('h-2 rounded-full transition-all', statusConfig[selectedTask.status].barColor)} style={{ width: `${selectedTask.progress}%` }} />
                  </div>
                  <span className={cn('text-xs font-bold', statusConfig[selectedTask.status].textColor)}>{selectedTask.progress}%</span>
                </div>
                <span className="text-xs text-muted-foreground">{selectedTask.progressLabel}</span>
              </div>
              {/* Time info row */}
              <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />已运行 {selectedTask.elapsed}</span>
                {selectedTask.estimatedRemaining && <span>预计剩余 {selectedTask.estimatedRemaining}</span>}
                {selectedTask.estimatedCompletion && <span>预计完成 {selectedTask.estimatedCompletion}</span>}
                {selectedTask.queuePosition != null && <span>前方 {selectedTask.queuePosition} 个任务 · {selectedTask.queueWait}</span>}
              </div>
              {/* Node info */}
              <div className="mt-1.5 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span>节点: {selectedTask.nodeName}</span>
                <span>资源: {selectedTask.nodes}</span>
              </div>
            </div>

            {/* Action bar */}
            {(selectedTask.status === 'running' || selectedTask.status === 'paused' || selectedTask.status === 'queued') && (
              <div className="flex items-center gap-2 border-b border-line-2/20 px-5 py-3">
                {selectedTask.status === 'running' && (
                  <>
                    <button onClick={() => handleTaskAction(selectedTask.id, 'pause')} className="inline-flex items-center gap-1.5 rounded-md border border-amber/30 bg-amber/5 px-3 py-1.5 text-xs font-medium text-amber transition-colors hover:bg-amber/10">
                      <Pause className="h-3 w-3" />暂停
                    </button>
                    <button onClick={() => handleTaskAction(selectedTask.id, 'abort')} className="inline-flex items-center gap-1.5 rounded-md border border-red/30 bg-red/5 px-3 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red/10">
                      <Square className="h-2.5 w-2.5" />中止
                    </button>
                  </>
                )}
                {selectedTask.status === 'paused' && (
                  <>
                    <button onClick={() => handleTaskAction(selectedTask.id, 'resume')} className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/5 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/10">
                      <Play className="h-3 w-3" />恢复运行
                    </button>
                    <button onClick={() => handleTaskAction(selectedTask.id, 'abort')} className="inline-flex items-center gap-1.5 rounded-md border border-red/30 bg-red/5 px-3 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red/10">
                      <Square className="h-2.5 w-2.5" />中止
                    </button>
                  </>
                )}
                {selectedTask.status === 'queued' && (
                  <button onClick={() => handleTaskAction(selectedTask.id, 'abort')} className="inline-flex items-center gap-1.5 rounded-md border border-red/30 bg-red/5 px-3 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red/10">
                    <X className="h-3 w-3" />取消排队
                  </button>
                )}
              </div>
            )}

            {/* Error hint */}
            {selectedTask.status === 'error' && selectedTask.errorHint && (
              <div className="flex items-start gap-2 border-b border-line-2/20 bg-red/5 px-5 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red" />
                <div>
                  <div className="text-xs font-semibold text-red">异常原因</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{selectedTask.errorHint}</div>
                </div>
                <button className="ml-auto inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/10">
                  <RotateCcw className="h-3 w-3" />重新提交
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {/* Section: Key Parameters */}
              <DetailSection title="关键参数" sectionKey="params" expanded={expandedSections.params} onToggle={toggleSection}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {selectedTask.params.map((p) => (
                    <div key={p.key} className="flex items-baseline justify-between rounded-md bg-surface-2/50 px-3 py-2">
                      <span className="text-[11px] text-muted-foreground">{p.label}</span>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {String(p.value)}
                        {p.unit && <span className="ml-1 text-[10px] font-normal text-muted-foreground">{p.unit}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </DetailSection>

              {/* Section: Process Steps */}
              <DetailSection title="中间过程" sectionKey="process" expanded={expandedSections.process} onToggle={toggleSection}>
                <div className="space-y-2">
                  {selectedTask.processSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {step.status === 'done' && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
                      {step.status === 'active' && <RefreshCw className="h-4 w-4 shrink-0 text-primary animate-spin" style={{ animationDuration: '3s' }} />}
                      {step.status === 'pending' && <div className="h-4 w-4 shrink-0 rounded-full border border-line" />}
                      <div className="flex-1">
                        <div className={cn('text-xs font-medium', step.status === 'pending' ? 'text-muted-foreground/50' : 'text-foreground')}>{step.label}</div>
                        <div className={cn('text-[10px]', step.status === 'active' ? 'text-primary' : step.status === 'done' ? 'text-success' : 'text-faint')}>{step.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              {/* Section: Convergence (only for running/paused tasks with data) */}
              {selectedTask.convergenceData && selectedTask.convergenceData.length > 0 && (
                <DetailSection title="收敛曲线" sectionKey="convergence" expanded={expandedSections.convergence} onToggle={toggleSection}>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">总能量 ΔE</span>
                        <span className="font-mono text-[10px] text-success">
                          {selectedTask.convergenceData.length > 1
                            ? (selectedTask.convergenceData[selectedTask.convergenceData.length - 1].energy - selectedTask.convergenceData[selectedTask.convergenceData.length - 2].energy).toExponential(2) + ' eV ↓'
                            : '—'}
                        </span>
                      </div>
                      <Sparkline data={selectedTask.convergenceData.map((d) => d.energy)} color="#1d5fd6" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">最大力 Fmax</span>
                        <span className={cn(
                          'font-mono text-[10px]',
                          selectedTask.convergenceData[selectedTask.convergenceData.length - 1].force < 0.05 ? 'text-success' : 'text-amber'
                        )}>
                          {selectedTask.convergenceData[selectedTask.convergenceData.length - 1].force.toFixed(3)} eV/Å
                          {selectedTask.convergenceData[selectedTask.convergenceData.length - 1].force < 0.05 ? ' · 已收敛' : ' · 接近阈值'}
                        </span>
                      </div>
                      <Sparkline data={selectedTask.convergenceData.map((d) => d.force)} color="#f59e0b" />
                    </div>
                  </div>
                </DetailSection>
              )}

              {/* Section: Structured Results (only for done tasks) */}
              {selectedTask.status === 'done' && selectedTask.results && selectedTask.results.length > 0 && (
                <DetailSection title="结构化结果" sectionKey="results" expanded={expandedSections.results} onToggle={toggleSection} defaultOpen>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTask.results.map((r, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'rounded-md border px-3 py-2.5',
                          r.highlight ? 'border-primary/20 bg-primary/5' : 'border-line-2/20 bg-white'
                        )}
                      >
                        <div className="text-[10px] text-muted-foreground">{r.label}</div>
                        <div className={cn('font-mono text-sm font-bold', r.highlight ? 'text-primary' : 'text-foreground')}>
                          {r.value}
                          {r.unit && <span className="ml-1 text-[10px] font-normal text-muted-foreground">{r.unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}

              {/* Section: Bader Charges (only for done tasks with charges) */}
              {selectedTask.status === 'done' && selectedTask.charges && selectedTask.charges.length > 0 && (
                <DetailSection title="原子电荷分布" sectionKey="charges" expanded={expandedSections.charges} onToggle={toggleSection}>
                  <div className="overflow-hidden rounded-md border border-line-2/20">
                    <div className="grid grid-cols-3 bg-surface-2 px-3 py-1.5 text-[10px] font-bold text-faint">
                      <span>原子</span>
                      <span className="col-span-2">电荷 (e)</span>
                    </div>
                    {selectedTask.charges.map((c, idx) => {
                      const maxAbs = Math.max(...selectedTask.charges!.map((ch) => Math.abs(ch.charge)));
                      const pct = maxAbs > 0 ? (Math.abs(c.charge) / maxAbs) * 100 : 0;
                      return (
                        <div key={idx} className={cn('grid grid-cols-3 items-center px-3 py-1.5 text-[11px]', idx > 0 && 'border-t border-line-2/20')}>
                          <span className="font-mono font-bold text-foreground">{c.atom}</span>
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-line">
                              <div
                                className={cn('h-1.5 rounded-full', c.charge > 0 ? 'bg-red' : 'bg-primary')}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={cn('font-mono text-[11px] font-bold', c.charge > 0 ? 'text-red' : 'text-primary')}>
                              {c.charge > 0 ? '+' : ''}{c.charge.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DetailSection>
              )}

              {/* Section: Result Files (only for done tasks) */}
              {selectedTask.status === 'done' && selectedTask.files && selectedTask.files.length > 0 && (
                <DetailSection title="结果文件" sectionKey="files" expanded={expandedSections.files} onToggle={toggleSection}>
                  <div className="space-y-1.5">
                    {selectedTask.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-md border border-line-2/20 px-3 py-2 transition-colors hover:bg-surface-2/50">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-xs font-medium text-foreground">{file.name}</div>
                            <div className="text-[10px] text-muted-foreground">{file.size} · {file.type}</div>
                          </div>
                        </div>
                        <button className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10">
                          <Download className="h-3 w-3" />下载
                        </button>
                      </div>
                    ))}
                    {/* Batch download */}
                    <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-line-2/30 bg-surface-2 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-2/80 hover:text-foreground">
                      <FolderArchive className="h-3.5 w-3.5" />打包下载全部文件
                    </button>
                    {/* Link to full result page */}
                    <Link
                      href={`/compute-results/${selectedTask.id}`}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />查看完整结果详情
                    </Link>
                  </div>
                </DetailSection>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Confirm Dialog ===== */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.action === 'pause' ? '确认暂停任务' :
          confirmDialog.action === 'resume' ? '确认恢复任务' :
          '确认中止任务'
        }
        description={
          confirmDialog.action === 'pause' ? '暂停后任务将保留当前进度，您可以随时恢复运行。' :
          confirmDialog.action === 'resume' ? '任务将从暂停位置继续运行。' :
          '中止后任务将停止运行，已使用的计算资源将无法回收。此操作不可撤销。'
        }
        confirmLabel={
          confirmDialog.action === 'pause' ? '暂停' :
          confirmDialog.action === 'resume' ? '恢复' :
          '中止'
        }
        confirmVariant={confirmDialog.action === 'abort' ? 'danger' : 'warning'}
        onConfirm={executeTaskAction}
        onCancel={() => setConfirmDialog({ open: false, taskId: '', action: 'pause' })}
      />

      {/* ===== New Task Drawer ===== */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDrawer(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-[slideInRight_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line-2/20 px-5 py-4">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">新建计算任务</h2>
              </div>
              <button onClick={() => setShowDrawer(false)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Task Type Selection */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-foreground">任务类型</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(taskTypeMeta) as NewTaskType[]).map((type) => {
                    const meta = taskTypeMeta[type];
                    const Icon = meta.icon;
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={cn(
                          'flex items-start gap-2.5 rounded-lg border-2 p-3 text-left transition-all',
                          isSelected ? 'border-primary bg-primary/5' : 'border-line-2/20 hover:border-line-2/40 hover:bg-surface-2'
                        )}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white" style={{ background: meta.color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground">{meta.label}</div>
                          <div className="text-[10px] leading-tight text-muted-foreground">{meta.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Task ID */}
              <div className="mb-4 flex items-center justify-between rounded-md bg-surface-2 px-3 py-2">
                <span className="text-xs text-muted-foreground">任务ID（自动生成）</span>
                <span className="font-mono text-sm font-bold text-primary">{nextTaskId}</span>
              </div>

              {/* Dynamic Parameter Form */}
              <div className="space-y-4">
                {taskTypeMeta[selectedType].fields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      {field.label}
                      {field.unit && <span className="ml-1 text-xs text-faint">({field.unit})</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={String(formParams[field.key] ?? '')}
                        onChange={(e) => setFormParams((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full rounded-md border border-line-2/30 bg-white px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formParams[field.key] ?? ''}
                        onChange={(e) => setFormParams((prev) => ({
                          ...prev,
                          [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                        }))}
                        placeholder={field.type === 'text' ? '请输入任务名称' : undefined}
                        className={cn(
                          'w-full rounded-md border border-line-2/30 bg-white px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
                          field.type === 'number' && 'font-mono'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Parameter Summary */}
              <div className="mt-5 rounded-md border border-line-2/20 bg-surface-2/50 p-3">
                <div className="mb-2 text-[11px] font-bold text-faint">参数预览</div>
                <div className="flex flex-wrap gap-1.5">
                  {taskTypeMeta[selectedType].fields
                    .filter((f) => f.key !== 'name')
                    .map((field) => (
                      <span
                        key={field.key}
                        className="inline-flex items-center rounded-sm bg-white px-2 py-0.5 text-[10px] font-medium text-foreground border border-line-2/20"
                      >
                        {field.label}: <span className="ml-1 font-mono font-bold text-primary">{String(formParams[field.key] ?? '')}</span>
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-line-2/20 px-5 py-4">
              <button onClick={() => setShowDrawer(false)} className="rounded-md bg-surface-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2/80">取消</button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-all',
                  isFormValid ? 'bg-primary hover:opacity-90 active:scale-[0.98]' : 'cursor-not-allowed bg-primary/40'
                )}
              >
                <Cpu className="h-3.5 w-3.5" />提交任务
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Detail Section (collapsible) =====
function DetailSection({
  title,
  sectionKey,
  expanded,
  onToggle,
  defaultOpen,
  children,
}: {
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: (key: string) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  // Use defaultOpen to initially expand
  const isOpen = expanded;
  return (
    <div className="rounded-lg border border-line-2/20 bg-white">
      <button
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-2/50"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && <div className="border-t border-line-2/20 px-4 py-3">{children}</div>}
    </div>
  );
}

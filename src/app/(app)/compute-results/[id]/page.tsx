'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  FileText,
  FolderArchive,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Cpu,
  Atom,
  Gauge,
  Thermometer,
  Layers,
  AlertTriangle,
  XCircle,
  ExternalLink,
  BarChart3,
  Zap,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  initialTasks,
  typeConfig,
  statusConfig,
  type Task,
  type ConvergencePoint,
  type ChargeEntry,
  type ResultFile,
} from '@/lib/compute-data';

// ===== Sparkline SVG =====
function Sparkline({ data, color, height = 56 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 320;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  const areaPoints = `${0},${height} ${points} ${w},${height}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ minHeight: `${height}px` }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

// ===== Larger Convergence Chart =====
function ConvergenceChart({ data }: { data: ConvergencePoint[] }) {
  if (data.length < 2) return null;

  const energyData = data.map((d) => d.energy);
  const forceData = data.map((d) => d.force);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-line-2/20 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">总能量 ΔE</span>
          <span className="font-mono text-xs text-success">
            {data.length > 1
              ? (data[data.length - 1].energy - data[data.length - 2].energy).toExponential(2) + ' eV'
              : '—'}
          </span>
        </div>
        <Sparkline data={energyData} color="#1d5fd6" height={80} />
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>第 1 步</span>
          <span>第 {data.length} 步</span>
        </div>
      </div>
      <div className="rounded-lg border border-line-2/20 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">最大力 Fmax</span>
          <span className={cn(
            'font-mono text-xs',
            data[data.length - 1].force < 0.05 ? 'text-success' : 'text-amber'
          )}>
            {data[data.length - 1].force.toFixed(4)} eV/Å
            {data[data.length - 1].force < 0.05 ? ' · 已收敛' : ' · 接近阈值'}
          </span>
        </div>
        <Sparkline data={forceData} color="#f59e0b" height={80} />
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>第 1 步</span>
          <span>第 {data.length} 步</span>
        </div>
      </div>
    </div>
  );
}

// ===== Collapsible Section =====
function DetailSection({
  title,
  sectionKey,
  expanded,
  onToggle,
  icon,
  children,
}: {
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: (key: string) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line-2/20 bg-white shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
      <button
        onClick={() => onToggle(sectionKey)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-2/50"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded && <div className="border-t border-line-2/20 px-5 py-4">{children}</div>}
    </div>
  );
}

// ===== Type Icon Helper =====
function TypeIcon({ type }: { type: Task['type'] }) {
  const iconMap: Record<Task['type'], React.ElementType> = {
    DFT: Atom,
    MD: Gauge,
    MC: Layers,
    QC: Thermometer,
  };
  const Icon = iconMap[type];
  return <Icon className="h-4 w-4" style={{ color: typeConfig[type].color }} />;
}

// ===== Charge Bar Chart =====
function ChargeBarChart({ charges }: { charges: ChargeEntry[] }) {
  const maxAbs = Math.max(...charges.map((c) => Math.abs(c.charge)));
  return (
    <div className="space-y-2">
      {charges.map((c, idx) => {
        const pct = maxAbs > 0 ? (Math.abs(c.charge) / maxAbs) * 100 : 0;
        return (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-12 text-right font-mono text-sm font-bold text-foreground">{c.atom}</span>
            <div className="flex-1">
              <div className="h-3 rounded-full bg-line">
                <div
                  className={cn('h-3 rounded-full transition-all', c.charge > 0 ? 'bg-red' : 'bg-primary')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className={cn('w-16 font-mono text-sm font-bold', c.charge > 0 ? 'text-red' : 'text-primary')}>
              {c.charge > 0 ? '+' : ''}{c.charge.toFixed(2)} e
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ===== Result Highlight Card =====
function ResultHighlightCard({ label, value, unit, highlight }: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      'rounded-lg border p-4 transition-colors',
      highlight ? 'border-primary/20 bg-primary/5' : 'border-line-2/20 bg-white'
    )}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={cn('mt-1 font-mono text-lg font-bold', highlight ? 'text-primary' : 'text-foreground')}>
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

// ===== File Row =====
function FileRow({ file }: { file: ResultFile }) {
  const typeIconMap: Record<string, string> = {
    output: '📄',
    structure: '🔬',
    scf: '⚡',
    dos: '📊',
    band: '📈',
    charge: '🔵',
    freq: '〰️',
    orbital: '🌀',
  };
  return (
    <div className="flex items-center justify-between rounded-lg border border-line-2/20 px-4 py-3 transition-colors hover:bg-surface-2/50 hover:shadow-[0_2px_8px_rgba(16,38,79,0.06)]">
      <div className="flex items-center gap-3">
        <span className="text-lg">{typeIconMap[file.type] || '📄'}</span>
        <div>
          <div className="text-sm font-medium text-foreground">{file.name}</div>
          <div className="text-[11px] text-muted-foreground">{file.size} · {file.type}</div>
        </div>
      </div>
      <button className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
        <Download className="h-3.5 w-3.5" />下载
      </button>
    </div>
  );
}

// ===== Main Page =====
export default function ComputeResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const task = useMemo(() => initialTasks.find((t) => t.id === taskId) ?? null, [taskId]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    params: true,
    process: true,
    convergence: true,
    results: true,
    charges: true,
    files: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute energy statistics from convergence data - must be before early return
  const energyStats = useMemo(() => {
    if (!task || !task.convergenceData || task.convergenceData.length < 2) return null;
    const energies = task.convergenceData.map((d) => d.energy);
    const forces = task.convergenceData.map((d) => d.force);
    return {
      minEnergy: Math.min(...energies),
      maxEnergy: Math.max(...energies),
      finalEnergy: energies[energies.length - 1],
      finalForce: forces[forces.length - 1],
      minForce: Math.min(...forces),
    };
  }, [task]);

  if (!task) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-muted-foreground/30" />
        <div className="text-lg font-semibold text-muted-foreground">未找到任务 {taskId}</div>
        <button
          onClick={() => router.push('/compute-tasks')}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />返回计算任务
        </button>
      </div>
    );
  }

  const sc = statusConfig[task.status];
  const tc = typeConfig[task.type];
  const isRunning = task.status === 'running';
  const isDone = task.status === 'done';
  const isPaused = task.status === 'paused';
  const isError = task.status === 'error';

  return (
    <div className="space-y-5">
      {/* 1. Breadcrumb + Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/compute-tasks')}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => router.push('/compute-tasks')} className="hover:text-foreground transition-colors">计算任务</button>
          <span>/</span>
          <span className="text-foreground font-medium">{task.id}</span>
        </div>
      </div>

      {/* 2. Task Header */}
      <div className="rounded-lg border border-line-2/20 bg-white p-6 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className={cn('inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-bold', sc.bgColor, sc.textColor)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', sc.dotColor, sc.pulse && 'animate-pulse')} />
                {sc.label}
              </span>
              <span className={cn('inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[11px] font-bold', tc.bg, tc.text)}>
                <TypeIcon type={task.type} />
                {task.type} · {tc.label}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
            </div>
            <h1 className="mt-3 text-xl font-bold text-foreground">{task.name}</h1>
            {task.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{task.description}</p>
            )}
          </div>
          {/* Status Summary Cards */}
          <div className="ml-6 grid grid-cols-2 gap-3 shrink-0">
            <div className="rounded-lg border border-line-2/20 bg-surface-2/50 px-4 py-3 text-center min-w-[100px]">
              <div className={cn('text-xl font-black', sc.textColor)}>{task.progress}%</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">完成度</div>
            </div>
            <div className="rounded-lg border border-line-2/20 bg-surface-2/50 px-4 py-3 text-center min-w-[100px]">
              <div className="text-xl font-black text-foreground">{task.elapsed}</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {isDone ? '总耗时' : isError ? '中断时' : '已运行'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 rounded-full bg-line">
              <div className={cn('h-2.5 rounded-full transition-all', sc.barColor)} style={{ width: `${task.progress}%` }} />
            </div>
            <span className="text-sm text-muted-foreground">{task.progressLabel}</span>
          </div>
        </div>

        {/* Meta info row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
          {task.createdAt && (
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />创建: {task.createdAt}</span>
          )}
          {task.completedAt && (
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-success" />完成: {task.completedAt}</span>
          )}
          {task.estimatedRemaining && (
            <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-primary" />预计剩余: {task.estimatedRemaining}</span>
          )}
          {task.estimatedCompletion && (
            <span>预计完成: {task.estimatedCompletion}</span>
          )}
          {task.queuePosition != null && (
            <span>前方 {task.queuePosition} 个任务 · {task.queueWait}</span>
          )}
          <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5" />节点: {task.nodeName}</span>
          <span>资源: {task.nodes}</span>
        </div>

        {/* Error hint */}
        {isError && task.errorHint && (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-red/5 border border-red/20 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red" />
            <div>
              <div className="text-xs font-semibold text-red">异常原因</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{task.errorHint}</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Content Grid: Left (main) + Right (sidebar) */}
      <div className="flex gap-5">
        {/* Left Column */}
        <div className="flex-[3] min-w-0 space-y-4">

          {/* Structured Results - prominently at top for done tasks */}
          {isDone && task.results && task.results.length > 0 && (
            <DetailSection
              title="结构化结果"
              sectionKey="results"
              expanded={expandedSections.results}
              onToggle={toggleSection}
              icon={<Zap className="h-4 w-4 text-primary" />}
            >
              {/* Highlighted results */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                {task.results.filter((r) => r.highlight).map((r, idx) => (
                  <ResultHighlightCard key={idx} label={r.label} value={r.value} unit={r.unit} highlight />
                ))}
              </div>
              {/* Other results */}
              {task.results.some((r) => !r.highlight) && (
                <div>
                  <div className="mb-2 text-[11px] font-bold text-faint uppercase tracking-wider">其他结果</div>
                  <div className="grid grid-cols-3 gap-3">
                    {task.results.filter((r) => !r.highlight).map((r, idx) => (
                      <ResultHighlightCard key={idx} label={r.label} value={r.value} unit={r.unit} />
                    ))}
                  </div>
                </div>
              )}
            </DetailSection>
          )}

          {/* Convergence Data */}
          {task.convergenceData && task.convergenceData.length > 0 && (
            <DetailSection
              title="收敛曲线"
              sectionKey="convergence"
              expanded={expandedSections.convergence}
              onToggle={toggleSection}
              icon={<Activity className="h-4 w-4 text-primary" />}
            >
              <ConvergenceChart data={task.convergenceData} />
              {/* Summary stats */}
              {energyStats && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  <div className="rounded-md bg-surface-2/50 px-3 py-2">
                    <div className="text-[10px] text-muted-foreground">最终能量</div>
                    <div className="font-mono text-sm font-bold text-foreground">{energyStats.finalEnergy.toFixed(4)} eV</div>
                  </div>
                  <div className="rounded-md bg-surface-2/50 px-3 py-2">
                    <div className="text-[10px] text-muted-foreground">最终最大力</div>
                    <div className={cn('font-mono text-sm font-bold', energyStats.finalForce < 0.05 ? 'text-success' : 'text-amber')}>
                      {energyStats.finalForce.toFixed(4)} eV/Å
                    </div>
                  </div>
                  <div className="rounded-md bg-surface-2/50 px-3 py-2">
                    <div className="text-[10px] text-muted-foreground">最低能量</div>
                    <div className="font-mono text-sm font-bold text-foreground">{energyStats.minEnergy.toFixed(4)} eV</div>
                  </div>
                  <div className="rounded-md bg-surface-2/50 px-3 py-2">
                    <div className="text-[10px] text-muted-foreground">最小力</div>
                    <div className="font-mono text-sm font-bold text-success">{energyStats.minForce.toFixed(4)} eV/Å</div>
                  </div>
                </div>
              )}
            </DetailSection>
          )}

          {/* Atom Charges */}
          {isDone && task.charges && task.charges.length > 0 && (
            <DetailSection
              title="原子电荷分布 (Bader)"
              sectionKey="charges"
              expanded={expandedSections.charges}
              onToggle={toggleSection}
              icon={<BarChart3 className="h-4 w-4 text-primary" />}
            >
              <div className="grid grid-cols-[1fr_1fr] gap-6">
                <ChargeBarChart charges={task.charges} />
                <div className="rounded-lg border border-line-2/20 overflow-hidden">
                  <div className="grid grid-cols-3 bg-surface-2 px-4 py-2 text-[11px] font-bold text-faint">
                    <span>原子</span>
                    <span className="text-center">电荷 (e)</span>
                    <span className="text-right">类型</span>
                  </div>
                  {task.charges.map((c, idx) => (
                    <div key={idx} className={cn('grid grid-cols-3 items-center px-4 py-2 text-sm', idx > 0 && 'border-t border-line-2/20', Math.abs(c.charge) > 1.5 && 'bg-red/5')}>
                      <span className="font-mono font-bold text-foreground">{c.atom}</span>
                      <span className={cn('text-center font-mono font-bold', c.charge > 0 ? 'text-red' : 'text-primary')}>
                        {c.charge > 0 ? '+' : ''}{c.charge.toFixed(2)}
                      </span>
                      <span className={cn('text-right text-[11px]', c.charge > 0 ? 'text-red/70' : 'text-primary/70')}>
                        {c.charge > 0 ? '供电子' : '受电子'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </DetailSection>
          )}

          {/* Process Steps */}
          <DetailSection
            title="计算过程"
            sectionKey="process"
            expanded={expandedSections.process}
            onToggle={toggleSection}
            icon={<Cpu className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-3">
              {task.processSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {step.status === 'done' && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
                    {step.status === 'active' && (
                      <div className={cn('flex h-5 w-5 items-center justify-center rounded-full', isRunning ? 'bg-primary/10' : 'bg-amber/10')}>
                        <div className={cn('h-2.5 w-2.5 rounded-full', isRunning ? 'bg-primary animate-pulse' : 'bg-amber')} />
                      </div>
                    )}
                    {step.status === 'pending' && <div className="h-5 w-5 shrink-0 rounded-full border-2 border-line" />}
                    {idx < task.processSteps.length - 1 && (
                      <div className={cn('w-0.5 flex-1 min-h-[16px] mt-1', step.status === 'done' ? 'bg-success/30' : 'bg-line')} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className={cn('text-sm font-medium', step.status === 'pending' ? 'text-muted-foreground/50' : 'text-foreground')}>
                      {step.label}
                    </div>
                    <div className={cn('text-xs mt-0.5', step.status === 'active' ? 'text-primary' : step.status === 'done' ? 'text-success' : 'text-faint')}>
                      {step.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>
        </div>

        {/* Right Column */}
        <div className="flex-[2] min-w-0 space-y-4">

          {/* Key Parameters */}
          <DetailSection
            title="关键参数"
            sectionKey="params"
            expanded={expandedSections.params}
            onToggle={toggleSection}
            icon={<Atom className="h-4 w-4 text-primary" />}
          >
            <div className="grid grid-cols-2 gap-3">
              {task.params.map((p) => (
                <div key={p.key} className="rounded-lg border border-line-2/20 bg-surface-2/50 px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">{p.label}</div>
                  <div className="mt-1 font-mono text-base font-bold text-foreground">
                    {String(p.value)}
                    {p.unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{p.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>

          {/* Result Files (for done tasks) */}
          {isDone && task.files && task.files.length > 0 && (
            <DetailSection
              title="结果文件"
              sectionKey="files"
              expanded={expandedSections.files}
              onToggle={toggleSection}
              icon={<FileText className="h-4 w-4 text-primary" />}
            >
              <div className="space-y-2">
                {task.files.map((file, idx) => (
                  <FileRow key={idx} file={file} />
                ))}
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
                  <FolderArchive className="h-4 w-4" />打包下载全部文件
                </button>
              </div>
            </DetailSection>
          )}

          {/* Quick Navigation - for running/paused tasks show related info */}
          {(isRunning || isPaused) && (
            <div className="rounded-lg border border-line-2/20 bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
              <h3 className="mb-3 text-sm font-semibold text-foreground">快速操作</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/compute-tasks')}
                  className="flex w-full items-center justify-between rounded-md border border-line-2/20 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-2/50"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">前往计算任务</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Task Summary Card */}
          <div className="rounded-lg border border-line-2/20 bg-white p-5 shadow-[0_2px_8px_rgba(16,38,79,0.04)]">
            <h3 className="mb-3 text-sm font-semibold text-foreground">任务摘要</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">任务ID</span>
                <span className="font-mono font-bold text-foreground">{task.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">任务类型</span>
                <span className={cn('font-bold', tc.text)}>{task.type} · {tc.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">当前状态</span>
                <span className={cn('font-bold', sc.textColor)}>{sc.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">完成度</span>
                <span className="font-bold text-foreground">{task.progress}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">运行时长</span>
                <span className="font-bold text-foreground">{task.elapsed}</span>
              </div>
              {task.createdAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">创建时间</span>
                  <span className="text-foreground">{task.createdAt}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">完成时间</span>
                  <span className="text-foreground">{task.completedAt}</span>
                </div>
              )}
              {task.nodeName && task.nodeName !== '—' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">计算节点</span>
                  <span className="font-mono text-foreground">{task.nodeName}</span>
                </div>
              )}
              {task.nodes && task.nodes !== '—' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">计算资源</span>
                  <span className="font-mono text-foreground">{task.nodes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

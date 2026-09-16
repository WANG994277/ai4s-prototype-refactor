'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ChevronRight, ExternalLink, Filter, Plus, RotateCcw, Search, X } from 'lucide-react';
import type { Capability } from '@/lib/capabilities';
import { adminGroups, managerGroups } from '@/lib/capabilities';
import featureDetails from '@/data/feature-details.json';
import { useSidebar } from '@/components/layout/sidebar-context';
import { projects, literature, computeTasks, experiments, devices, workflows, assets, experts, tools, adminRecords, type ResearchRecord, type RecordStatus } from '@/mock/research';

type PreviewState = 'default' | 'loading' | 'empty' | 'error' | 'no-permission' | 'processing' | 'success';
const statuses: RecordStatus[] = ['进行中', '待确认', '已完成', '需关注'];
const statusStyles: Record<RecordStatus, string> = {
  '进行中': 'bg-[#EAF3FD] text-[#2878D0]',
  '待确认': 'bg-[#FFF4E5] text-[#B65E00]',
  '已完成': 'bg-[#E9F7F1] text-[#168B68]',
  '需关注': 'bg-[#FFF0EF] text-[#D92D20]',
};

const themeColors: Record<string, string> = {
  '读空间': '#2878D0', '算空间': '#0788A8', '做空间': '#168B68',
  '科研协作': '#6558D3', '科研流程贯通': '#A6191E', '共享资产': '#2878D0',
};

function dataFor(item: Capability): ResearchRecord[] {
  const path = item.href.split(/[?#]/)[0];
  if (path === '/assets/data-knowledge') return assets.filter((record) => record.id.includes('DATA'));
  if (path === '/assets/models') return assets.filter((record) => record.id.includes('MODEL'));
  if (path === '/assets/plans') return assets.filter((record) => record.id.includes('PLAN'));
  if (path === '/assets/intelligent-services') return tools;
  if (path === '/compute-space/models') return assets.filter((record) => record.id.includes('MODEL'));
  if (path === '/compute-space/tools') return tools;
  if (path === '/standards-benchmark') return literature.filter((record) => record.id.startsWith('STD'));
  if (path === '/research-flow/review') return workflows.filter((record) => record.status === '待确认');
  if (path === '/research-flow/publication') return assets;
  if (path.startsWith('/lab-resources')) return devices;
  if (path.startsWith('/experiments')) return experiments;
  if (path.startsWith('/research-flow')) return workflows;
  if (path.startsWith('/assets')) return assets;
  if (path.startsWith('/collaboration/experiments')) return experiments;
  if (path.startsWith('/collaboration/files-notes')) return assets;
  if (path.startsWith('/collaboration/experts')) return experts;
  if (item.group === '科研协作' || managerGroups.includes(item.group)) return projects;
  if (item.group === '读空间') return literature;
  if (item.group === '算空间') return computeTasks;
  if (item.group === '做空间') return experiments;
  if (item.group === '科研流程贯通') return workflows;
  if (item.group === '共享资产') return assets;
  return adminRecords;
}

function sourceName(item: Capability) {
  if (item.group.includes('川庆')) return '科研管理&驾驶舱（川庆）';
  if (item.label.includes('设备') || item.label.includes('预约')) return 'iLOMS / 设备系统';
  if (item.label.includes('样品') || item.label.includes('实验管理')) return 'ELN / LIMS';
  if (adminGroups.includes(item.group)) return 'AI中台 / IAM';
  if (item.group === '算空间') return 'AI中台';
  return 'AI4S';
}

export function CapabilityScreen({ item, projectId }: { item: Capability; projectId?: string }) {
  const { role } = useSidebar();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'全部' | RecordStatus>('全部');
  const [selected, setSelected] = useState<ResearchRecord | null>(null);
  const [preview, setPreview] = useState<PreviewState>('default');
  const [sourceNotice, setSourceNotice] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [records, setRecords] = useState(() => dataFor(item));
  const source = sourceName(item);
  const currentProject = projects.find((project) => project.id === projectId);
  const featureKey = `${item.group}::${item.label}`;
  const features = (featureDetails as Record<string, string[]>)[featureKey] ?? [];
  const adminRestricted = adminGroups.includes(item.group) && role !== 'admin';
  const managerRestricted = managerGroups.includes(item.group) && role === 'researcher';
  const isExternal = item.href.startsWith('/connections/') || item.strategy.includes('外部系统集成/跳转');
  const filtered = useMemo(() => records.filter((record) => {
    const matchStatus = status === '全部' || record.status === status;
    const matchQuery = `${record.name} ${record.id} ${record.project}`.toLowerCase().includes(query.toLowerCase().trim());
    const matchProject = !currentProject || record.project === currentProject.name;
    return matchStatus && matchQuery && matchProject;
  }), [records, status, query, currentProject]);

  const changeStatus = (id: string) => {
    setRecords((current) => current.map((record) => record.id === id ? { ...record, status: '已完成' } : record));
    setSelected((current) => current?.id === id ? { ...current, status: '已完成' } : current);
    setPreview('success');
  };

  const accent = themeColors[item.group] ?? '#A6191E';
  const restricted = adminRestricted || managerRestricted || preview === 'no-permission';

  return <div className="mx-auto max-w-[1500px] space-y-4">
    <div className="border-b border-line pb-4" style={{ borderTop: `3px solid ${accent}`, paddingTop: 16 }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground"><span>{item.group}</span><ChevronRight className="size-3" /><span>{item.label}</span></div>
          <h1 className="text-2xl font-semibold text-foreground">{item.label}</h1>
          <p className="mt-2 text-sm text-muted-foreground">围绕课题查看相关记录、进展与来源，选择对象可查看详情和下一步操作。</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="preview-state">原型状态预览</label>
          <select id="preview-state" value={preview} onChange={(event) => setPreview(event.target.value as PreviewState)} className="h-9 rounded-md border border-line bg-white px-2 text-xs text-muted-foreground" title="原型状态预览">
            <option value="default">默认状态</option><option value="loading">加载状态</option><option value="empty">空状态</option><option value="error">错误状态</option><option value="no-permission">无权限状态</option><option value="processing">处理中状态</option><option value="success">成功状态</option>
          </select>
          <button onClick={() => isExternal ? setSourceNotice(true) : setSelected(records[0] ?? null)} className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-white hover:bg-[#7F1116]">
            {isExternal ? <ExternalLink className="size-3.5" /> : <Plus className="size-3.5" />}{isExternal ? '查看来源入口' : '查看首条记录'}
          </button>
        </div>
      </div>
    </div>

    {currentProject && <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#C8D8EF] bg-[#F6F9FD] px-4 py-2.5 text-xs"><span><strong>当前课题：</strong>{currentProject.name} <span className="ml-2 text-muted-foreground">{currentProject.id}</span></span><Link href="/collaboration/projects" className="font-medium text-[#2878D0] hover:underline">切换课题</Link></div>}
    {source !== 'AI4S' && <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#D9DEE7] bg-[#F8FAFC] px-4 py-2.5 text-xs"><span><strong className="text-foreground">来源系统：</strong>{source} <span className="ml-2 text-muted-foreground">当前为原型演示数据，正式操作由来源系统办理。</span></span><button onClick={() => setSourceNotice(true)} className="font-medium text-primary hover:underline">查看接入信息</button></div>}

    {restricted ? <StatePanel title="当前角色无权访问此功能" detail="请切换左侧演示角色，或联系管理员申请相应权限。" icon={<AlertCircle className="size-7 text-[#D97706]" />} action={() => restricted && preview !== 'no-permission' ? router.push('/workbench') : setPreview('default')} actionLabel={adminRestricted || managerRestricted ? '返回工作台' : '返回默认状态'} />
    : preview === 'loading' ? <div className="space-y-3 rounded-lg border border-line bg-white p-6" aria-busy="true">{[1,2,3,4].map((n) => <div key={n} className="h-11 animate-pulse rounded bg-[#E7EBF0]" />)}</div>
    : preview === 'error' ? <StatePanel title="记录加载失败" detail={`无法取得 ${source} 的最新状态。请重试，或检查来源系统连接。`} icon={<AlertCircle className="size-7 text-[#D92D20]" />} action={() => setPreview('default')} actionLabel="重试" />
    : preview === 'processing' ? <StatePanel title="正在处理科研任务" detail="计划已生成，正在读取课题上下文和来源记录。结果完成后需要人工确认。" icon={<RotateCcw className="size-7 animate-spin text-[#2878D0]" />} action={() => setPreview('success')} actionLabel="完成演示" />
    : preview === 'empty' ? <StatePanel title="当前没有记录" detail="可调整筛选条件，或返回默认状态查看演示数据。" icon={<Filter className="size-7 text-[#98A2B3]" />} action={() => setPreview('default')} actionLabel="查看全部" />
    : <>
      {preview === 'success' && <div role="status" className="rounded-md border border-[#B9E6D1] bg-[#E9F7F1] px-4 py-2 text-sm text-[#168B68]">操作已完成，演示记录已更新。</div>}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="记录概览">
        {[['记录总数', records.length], ['进行中', records.filter((r) => r.status === '进行中').length], ['待确认', records.filter((r) => r.status === '待确认').length], ['需关注', records.filter((r) => r.status === '需关注').length]].map(([label, value]) => <div key={label} className="rounded-lg border border-line bg-white px-4 py-3"><span className="text-xs text-muted-foreground">{label}</span><strong className="mt-1 block text-2xl font-semibold text-foreground">{value}</strong></div>)}
      </section>
      {features.length > 0 && <section className="rounded-lg border border-line bg-white p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-base font-semibold">功能范围</h2><span className="text-xs text-muted-foreground">{features.length} 项</span></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{(showAllFeatures ? features : features.slice(0, 6)).map((feature, index) => <div key={`${feature}-${index}`} className="flex min-h-10 items-center gap-2 rounded-md border border-line bg-[#F8FAFC] px-3 py-2 text-xs"><span className="size-1.5 shrink-0 rounded-full" style={{ background: accent }} /><span>{feature}</span></div>)}</div>{features.length > 6 && <button onClick={() => setShowAllFeatures((value) => !value)} className="mt-3 text-xs text-primary hover:underline">{showAllFeatures ? '收起' : '查看全部功能'}</button>}</section>}
      <section className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4"><h2 className="text-base font-semibold">相关记录</h2><div className="flex flex-wrap items-center gap-2"><div className="flex h-9 items-center gap-2 rounded-md border border-line px-3"><Search className="size-4 text-muted-foreground" /><input aria-label="搜索记录" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称、编号、课题" className="w-44 bg-transparent text-xs outline-none" /></div><select aria-label="筛选状态" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-9 rounded-md border border-line bg-white px-2 text-xs"><option>全部</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[750px] text-left text-[13px]"><thead className="h-10 bg-[#F8FAFC] text-xs text-muted-foreground"><tr><th className="px-4 font-medium">名称 / 编号</th><th className="px-4 font-medium">所属课题</th><th className="px-4 font-medium">负责人</th><th className="px-4 font-medium">状态</th><th className="px-4 font-medium">更新时间</th><th className="px-4 font-medium">操作</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id} className="h-14 border-t border-line hover:bg-[#FFF7F7]"><td className="px-4"><button className="font-medium text-foreground hover:text-primary hover:underline" onClick={() => setSelected(record)}>{record.name}</button><span className="block text-[11px] text-muted-foreground">{record.id}</span></td><td className="max-w-52 truncate px-4 text-muted-foreground">{record.project}</td><td className="px-4">{record.owner}</td><td className="px-4"><span className={`rounded px-2 py-1 text-[11px] ${statusStyles[record.status]}`}>{record.status}</span></td><td className="px-4 text-muted-foreground">{record.updatedAt}</td><td className="px-4"><button onClick={() => setSelected(record)} className="text-primary hover:underline">查看详情</button></td></tr>)}</tbody></table>{!filtered.length && <div className="py-10 text-center text-sm text-muted-foreground">没有匹配的记录。请调整搜索或状态筛选。</div>}</div>
      </section>
    </>}

    {selected && <div className="fixed inset-0 z-50 flex justify-end bg-[#101828]/30" onMouseDown={() => setSelected(null)}><aside onMouseDown={(event) => event.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white shadow-xl"><div className="flex items-start justify-between border-b border-line p-5"><div><p className="text-xs text-muted-foreground">{selected.id}</p><h2 className="mt-1 text-lg font-semibold">{selected.name}</h2></div><button onClick={() => setSelected(null)} aria-label="关闭详情"><X className="size-5" /></button></div><div className="flex-1 space-y-5 overflow-y-auto p-5"><p className="text-sm leading-6 text-muted-foreground">{selected.description}</p><dl className="grid grid-cols-[90px_1fr] gap-y-3 text-sm"><dt className="text-muted-foreground">状态</dt><dd><span className={`rounded px-2 py-1 text-xs ${statusStyles[selected.status]}`}>{selected.status}</span></dd><dt className="text-muted-foreground">所属课题</dt><dd>{selected.project}</dd><dt className="text-muted-foreground">负责人</dt><dd>{selected.owner}</dd><dt className="text-muted-foreground">来源系统</dt><dd>{selected.source}</dd><dt className="text-muted-foreground">更新时间</dt><dd>{selected.updatedAt}</dd></dl><div className="rounded-md border border-line bg-[#F8FAFC] p-3 text-xs leading-5 text-muted-foreground">科研结论和操作应保留来源、版本与责任人。当前对象为原型演示记录。</div><div><h3 className="mb-2 text-sm font-semibold">关联工作</h3><div className="grid grid-cols-2 gap-2">{[['文献与标准检索','/literature-search'],['智能计算模拟任务','/compute-tasks'],['实验管理','/experiments'],['结果回流与复现','/research-flow/reproducibility']].map(([label,href]) => <Link key={href} href={href} onClick={() => setSelected(null)} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-xs hover:border-primary/40 hover:text-primary">{label}<ChevronRight className="size-3" /></Link>)}</div></div></div><div className="flex gap-2 border-t border-line p-5"><button onClick={() => setSelected(null)} className="flex h-9 flex-1 items-center justify-center rounded-md border border-line text-sm">关闭</button>{selected.source === 'AI4S' && selected.status !== '已完成' ? <button onClick={() => changeStatus(selected.id)} className="h-9 flex-1 rounded-md bg-primary text-sm text-white">标记已处理</button> : selected.source !== 'AI4S' ? <button onClick={() => setSourceNotice(true)} className="h-9 flex-1 rounded-md bg-primary text-sm text-white">查看来源信息</button> : <Link href="/research-flow/reproducibility" onClick={() => setSelected(null)} className="flex h-9 flex-1 items-center justify-center rounded-md bg-primary text-sm text-white">查看关联流程</Link>}</div></aside></div>}

    {sourceNotice && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101828]/35 px-4" onMouseDown={() => setSourceNotice(false)}><div onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><h2 className="text-lg font-semibold">来源系统接入</h2><button onClick={() => setSourceNotice(false)} aria-label="关闭"><X className="size-5" /></button></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{source} 的正式深链和单点登录尚未配置。此页面展示来源标识与演示数据；正式业务须在来源系统完成后回流状态。</p><div className="mt-4 rounded-md bg-[#FFF4E5] p-3 text-xs text-[#B65E00]">当前状态：来源系统不可用</div><button onClick={() => setSourceNotice(false)} className="mt-5 h-9 w-full rounded-md border border-line text-sm">返回 AI4S</button></div></div>}
  </div>;
}

function StatePanel({ title, detail, icon, action, actionLabel }: { title: string; detail: string; icon: React.ReactNode; action: () => void; actionLabel: string }) {
  return <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-line bg-white px-6 text-center">{icon}<h2 className="mt-3 text-base font-semibold">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{detail}</p><button onClick={action} className="mt-5 flex h-9 items-center rounded-md border border-line px-4 text-sm text-foreground hover:border-primary hover:text-primary"><ArrowLeft className="mr-1.5 size-3.5" />{actionLabel}</button></div>;
}

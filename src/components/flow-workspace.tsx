'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, CheckCircle2, CircleAlert, ClipboardCheck, Database, FlaskConical, GitBranch, Play, RotateCcw, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Capability } from '@/lib/capabilities';
import { capabilities } from '@/lib/capabilities';
import { useSidebar } from '@/components/layout/sidebar-context';
import { workflows } from '@/mock/research';

const steps: { title: string; detail: string; icon: LucideIcon; href: string }[] = [
  { title: '读', detail: '文献证据与研究假设', icon: BookOpen, href: '/literature-search' },
  { title: '算', detail: 'VASP 计算与候选筛选', icon: Calculator, href: '/compute-tasks' },
  { title: '人工确认', detail: '复核参数与实验风险', icon: ClipboardCheck, href: '/research-flow/review' },
  { title: '做', detail: '催化活性实验验证', icon: FlaskConical, href: '/experiments' },
  { title: '回流与复现', detail: '证据、参数和环境归档', icon: RotateCcw, href: '/research-flow/reproducibility' },
  { title: '成果发布', detail: '审核后进入共享资产', icon: Database, href: '/research-flow/publication' },
];

const evidence = [
  { label: '文献依据', value: 'CCUS 催化转化最新进展', source: '文献数据库 · LIT-001' },
  { label: '计算产物', value: 'VASP 电子结构计算', source: 'AI中台 · 任务 #1024' },
  { label: '实验记录', value: '催化活性评价实验', source: 'ELN · GB-2026-0915' },
  { label: '参数版本', value: '实验方案 v3 / 220 °C', source: 'AI4S · AST-PLAN-03' },
];

export function FlowWorkspace({ item }: { item: Capability }) {
  const { role } = useSidebar();
  const [selectedId, setSelectedId] = useState(workflows[0].id);
  const [review, setReview] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [published, setPublished] = useState(false);
  const [optimization, setOptimization] = useState(false);
  const [rerun, setRerun] = useState<'idle' | 'processing' | 'done'>('idle');
  const selected = workflows.find((workflow) => workflow.id === selectedId) ?? workflows[0];
  const currentEvidence = selectedId === 'WF-CCUS-01' ? evidence : [
    { label: '文献依据', value: '功能性 PE 配方研究资料', source: '知识工程 · LIT-002' },
    { label: '计算产物', value: 'GROMACS 分子动力学模拟', source: 'AI中台 · 任务 #1025' },
    { label: '实验记录', value: 'PE 配方正交实验', source: 'AI4S · EXP-0918' },
    { label: '参数版本', value: 'PE 配方方案 v2', source: 'AI4S · PROJ-PE-02' },
  ];
  const isMain = item.href === '/research-flow';
  const canReview = role === 'lead' || role === 'manager' || role === 'admin';

  useEffect(() => {
    const stored = localStorage.getItem('ai4s-selected-workflow');
    if (stored && workflows.some((workflow) => workflow.id === stored)) setSelectedId(stored);
  }, []);

  useEffect(() => {
    const storedReview = localStorage.getItem(`ai4s-flow-review-${selectedId}`);
    setReview(storedReview === 'approved' || storedReview === 'rejected' ? storedReview : 'pending');
    setPublished(localStorage.getItem(`ai4s-flow-published-${selectedId}`) === 'yes');
    setOptimization(localStorage.getItem(`ai4s-flow-optimization-${selectedId}`) === 'yes');
  }, [selectedId]);

  const updateReview = (value: 'approved' | 'rejected') => {
    localStorage.setItem(`ai4s-flow-review-${selectedId}`, value);
    setReview(value);
  };
  const publish = () => {localStorage.setItem(`ai4s-flow-published-${selectedId}`,'yes');setPublished(true);};
  const acceptOptimization = () => {localStorage.setItem(`ai4s-flow-optimization-${selectedId}`,'yes');setOptimization(true);};

  return <div className="mx-auto max-w-[1500px] space-y-4">
    <header className="border-t-[3px] border-primary pb-4 pt-4"><p className="text-xs text-muted-foreground">科研流程贯通</p><h1 className="mt-1 text-2xl font-semibold">{item.label}</h1><p className="mt-2 text-sm text-muted-foreground">把文献、计算和实验放进同一条可追溯的科研流程。</p></header>
    <nav aria-label="科研流程功能" className="flex gap-2 overflow-x-auto rounded-lg border border-line bg-white p-2">{capabilities.filter((entry) => entry.group === '科研流程贯通').map((entry) => <Link key={entry.id} href={entry.href} className={`shrink-0 rounded-md px-3 py-2 text-xs ${entry.id === item.id ? 'bg-[#FCEBEC] font-semibold text-[#7F1116]' : 'text-muted-foreground hover:bg-[#F8FAFC]'}`}>{entry.label}</Link>)}</nav>
    <div className="grid gap-4 xl:grid-cols-[270px_1fr]">
      <aside className="h-fit rounded-lg border border-line bg-white p-4"><div className="mb-3 flex items-center gap-2"><GitBranch className="size-4 text-primary" /><h2 className="text-sm font-semibold">流程实例</h2></div>{workflows.map((workflow) => <button key={workflow.id} onClick={() => {localStorage.setItem('ai4s-selected-workflow',workflow.id);setSelectedId(workflow.id);}} className={`mb-2 w-full rounded-md border px-3 py-3 text-left ${selectedId === workflow.id ? 'border-primary/40 bg-[#FFF7F7]' : 'border-line hover:bg-[#F8FAFC]'}`}><strong className="block text-[13px] leading-5">{workflow.name}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{workflow.id} · {workflow.status}</span></button>)}<p className="mt-2 text-[11px] leading-5 text-muted-foreground">流程记录为演示数据；关键节点必须由人确认。</p></aside>
      <div className="min-w-0 space-y-4">
        <section className="rounded-lg border border-line bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-xs text-muted-foreground">{selected.id} · {selected.project}</span><h2 className="mt-1 text-lg font-semibold">{selected.name}</h2><p className="mt-2 text-sm text-muted-foreground">{selected.description}</p></div><span className={`rounded px-2 py-1 text-xs ${published ? 'bg-[#E9F7F1] text-[#168B68]' : 'bg-[#FFF4E5] text-[#B65E00]'}`}>{published ? '已发布' : review === 'approved' ? '审核通过' : '待人工确认'}</span></div></section>

        {(isMain || item.href.endsWith('/workflows') || item.href.endsWith('/optimization')) && <section className="rounded-lg border border-line bg-white p-5"><h3 className="text-sm font-semibold">执行链路</h3><div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-6">{steps.map((step,index) => <Link key={step.title} href={step.href} className="rounded-md border border-line p-3 hover:border-primary/40"><div className="flex items-center gap-2"><span className={`flex size-7 items-center justify-center rounded-md ${index <= (review === 'approved' ? 3 : 1) ? 'bg-[#E9F7F1] text-[#168B68]' : 'bg-[#F8FAFC] text-muted-foreground'}`}><step.icon className="size-4" /></span><strong className="text-xs">{step.title}</strong></div><p className="mt-2 text-[11px] leading-5 text-muted-foreground">{step.detail}</p></Link>)}</div><div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-[#168B68]" />文献与计算已完成<ArrowRight className="size-3" /><CircleAlert className="size-4 text-[#D97706]" />人工确认待处理</div></section>}

        {(isMain || item.href.endsWith('/agents')) && <section className="rounded-lg border border-line bg-white p-5"><div className="flex items-center gap-2"><Sparkles className="size-4 text-[#6558D3]" /><h3 className="text-sm font-semibold">科研智能体与 Skill</h3></div><div className="mt-3 grid gap-3 md:grid-cols-3">{[['证据整理智能体','汇集文献与来源引用'],['计算结果解读 Skill','读取任务日志与计算产物'],['实验方案建议智能体','基于历史数据提出下一轮方案']].map(([name,detail]) => <div key={name} className="rounded-md border border-line p-3"><strong className="text-[13px]">{name}</strong><p className="mt-1 text-xs text-muted-foreground">{detail}</p><span className="mt-3 inline-block rounded bg-[#F0EEFC] px-2 py-1 text-[11px] text-[#6558D3]">待人工确认结果</span></div>)}</div></section>}

        {item.href.endsWith('/optimization') && <section className="rounded-lg border border-line bg-white p-5"><h3 className="text-sm font-semibold">闭环优化建议</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedId === 'WF-CCUS-01' ? '实验 GB-2026-0915 的催化活性均值下降 35%。建议复核温控系统，并在下一轮将反应温度从 200 °C 调整至 220 °C。' : 'PE 配方模拟结果已回流。建议先验证候选配方的稳定性，再启动下一轮正交实验。'}此建议需由科研人员确认后进入实验方案。</p><button onClick={acceptOptimization} disabled={optimization} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-white disabled:bg-[#98A2B3]">{optimization ? '已采纳建议' : '确认采纳建议'}</button></section>}

        {item.href.endsWith('/review') && <section className="rounded-lg border border-line bg-white p-5"><h3 className="text-sm font-semibold">特种实验人工审核</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">请核对实验条件、来源证据和风险说明。系统不会自动通过此节点。</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{currentEvidence.slice(0,2).map((entry) => <div key={entry.label} className="rounded-md border border-line p-3"><span className="text-xs text-muted-foreground">{entry.label}</span><strong className="mt-1 block text-sm">{entry.value}</strong><small className="text-muted-foreground">{entry.source}</small></div>)}</div>{review !== 'pending' && <p role="status" className={`mt-4 text-sm ${review === 'approved' ? 'text-[#168B68]' : 'text-[#D92D20]'}`}>审核结果：{review === 'approved' ? '已通过' : '已驳回'}</p>}<div className="mt-4 flex gap-2"><button disabled={!canReview} onClick={() => updateReview('approved')} className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:bg-[#98A2B3]">通过审核</button><button disabled={!canReview} onClick={() => updateReview('rejected')} className="rounded-md border border-line px-4 py-2 text-sm disabled:text-muted-foreground">驳回</button></div>{!canReview && <p className="mt-2 text-xs text-muted-foreground">请切换为课题负责人或管理角色进行审核演示。</p>}</section>}

        {(isMain || item.href.endsWith('/reproducibility') || item.href.endsWith('/publication')) && <section className="rounded-lg border border-line bg-white p-5"><h3 className="text-sm font-semibold">证据与复现包</h3><div className="mt-3 divide-y divide-line border-y border-line">{currentEvidence.map((entry) => <div key={entry.label} className="grid gap-1 py-3 text-xs sm:grid-cols-[110px_1fr_180px]"><span className="text-muted-foreground">{entry.label}</span><strong className="font-medium">{entry.value}</strong><span className="text-muted-foreground">{entry.source}</span></div>)}</div>{item.href.endsWith('/reproducibility') && <button onClick={() => {setRerun('processing');setTimeout(() => setRerun('done'),800);}} disabled={rerun === 'processing'} className="mt-4 flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm hover:border-primary hover:text-primary"><Play className="size-4" />{rerun === 'idle' ? '按原配置模拟重跑' : rerun === 'processing' ? '正在生成复现任务…' : '复现任务已生成'}</button>}</section>}

        {item.href.endsWith('/publication') && <section className="rounded-lg border border-line bg-white p-5"><h3 className="text-sm font-semibold">科研成果发布</h3><p className="mt-2 text-sm text-muted-foreground">发布包包含实验报告、计算结果、数据集、参数版本与审核记录。</p>{review !== 'approved' && <p className="mt-3 text-xs text-[#D97706]">发布前需要完成科研关键节点人工审核。</p>}<button onClick={publish} disabled={review !== 'approved' || published} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-white disabled:bg-[#98A2B3]">{published ? '成果已发布' : '确认发布成果'}</button>{review !== 'approved' && <Link href="/research-flow/review" className="ml-3 text-xs text-primary hover:underline">前往人工审核</Link>}</section>}
      </div>
    </div>
  </div>;
}

'use client';

import React, { useState } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, FileText, Shield,
  Download, GitCompare, Star, ExternalLink, AlertTriangle,
  Lightbulb, Search, ChevronDown, CheckCircle2,
  Network, Image as ImageIcon, Sparkles, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Patent, type ClaimItem, type TechParam, type LanguageGap, type TechBlank } from './data';

type DetailTab = 'tech' | 'claims' | 'opportunity' | 'citations' | 'drawings' | 'risk';

// Mock detail data
const detailData: {
  patent: Patent;
  claims: ClaimItem[];
  techParams: TechParam[];
  techKeyPoints: string[];
  languageGaps: LanguageGap[];
  techBlanks: TechBlank[];
  suggestions: { title: string; desc: string }[];
  forwardCitations: { id: string; title: string; date: string }[];
  backwardCitations: { id: string; title: string; date: string }[];
  familyPatents: { id: string; country: string; date: string }[];
} = {
  patent: {
    id: 'CN202410123456',
    title: '一种基于分子筛的催化裂化催化剂及其制备方法',
    applicant: '中石化',
    filingDate: '2024-03-15',
    ipc: 'B01J 29/40',
    cpc: 'B01J 29/40',
    country: 'CN',
    techField: '催化裂化',
    status: 'pending',
    legalStatus: '审查中',
    risk: 'high',
    riskScore: 87,
    abstract: '本发明公开了一种基于分子筛的催化裂化催化剂及其制备方法，该催化剂以ZSM-5分子筛为活性组分，通过磷改性处理提高其水热稳定性和丙烯选择性。催化剂中磷含量为2-5wt%，采用浸渍法将磷酸盐溶液负载于分子筛表面，经干燥和焙烧后得到改性催化剂。该催化剂在催化裂化反应中表现出优异的丙烯选择性和水热稳定性，适用于石油炼制过程中的轻烯烃生产。',
    tags: ['催化裂化', 'ZSM-5', '磷改性'],
    citedCount: 12,
    familyCount: 3,
    familyCountries: ['CN', 'US', 'EP'],
    relevance: 95,
    citations: { forward: ['CN202410567001'], backward: ['CN202010111111'] },
  },
  claims: [
    { id: 1, text: '一种催化裂化催化剂，其特征在于，以ZSM-5分子筛为活性组分，磷含量为2-5wt%，通过浸渍法将磷酸盐溶液负载于分子筛表面。', type: 'independent' as const, children: [
      { id: 2, text: '根据权利要求1所述的催化剂，其中磷含量为3-4wt%。', type: 'dependent' as const, children: [] },
      { id: 3, text: '根据权利要求1所述的催化剂，其中ZSM-5分子筛的硅铝比为20-50:1。', type: 'dependent' as const, children: [] },
      { id: 4, text: '根据权利要求1所述的催化剂，其特征在于，所述催化剂还包含粘结剂和载体。', type: 'dependent' as const, children: [] },
    ]},
    { id: 5, text: '一种如权利要求1所述催化剂的制备方法，包括以下步骤：配制磷酸盐溶液；将ZSM-5分子筛浸渍于磷酸盐溶液中；干燥并焙烧。', type: 'independent' as const, children: [
      { id: 6, text: '根据权利要求5所述的制备方法，其中浸渍时间为2-6小时。', type: 'dependent' as const, children: [] },
      { id: 7, text: '根据权利要求5所述的制备方法，其中焙烧温度为450-600℃。', type: 'dependent' as const, children: [] },
    ]},
  ],
  techParams: [
    { label: '分子筛类型', value: 'ZSM-5' },
    { label: '改性元素', value: 'P（磷）' },
    { label: '反应类型', value: '催化裂化' },
    { label: '目标产物', value: '丙烯' },
    { label: '关键指标', value: '丙烯选择性提升' },
    { label: '制备方法', value: '浸渍法' },
    { label: '温度条件', value: '待确认（查全文）' },
  ],
  techKeyPoints: [
    '采用磷改性ZSM-5分子筛，提高水热稳定性',
    '磷含量控制在2-5wt%范围内，兼顾选择性和活性',
    '浸渍法制备工艺简单，易于工业化',
    '与未改性ZSM-5相比，丙烯选择性显著提升',
    '与传统稀土改性方案不同，采用磷改性路线',
  ],
  languageGaps: [
    { claim: '权利要求1', text: '"包含"为开放式表述，可能覆盖未列举的实施方式', issue: '开放式表述', opportunity: '可利用"由...组成"的封闭式限定缩小其保护范围，在其未列举的组分上申请', severity: 'broad' as const },
    { claim: '权利要求2', text: '"高温条件"缺乏明确温度范围界定', issue: '范围模糊', opportunity: '可限定具体温度区间（如400-600℃）作为差异化特征', severity: 'ambiguous' as const },
    { claim: '权利要求3', text: '限定"浸渍法"，未覆盖原位合成法', issue: '方法限定过窄', opportunity: '采用原位合成路线可绕开该权利要求', severity: 'gap' as const },
  ],
  techBlanks: [
    { area: 'ZSM-5在低温催化裂化（<400℃）中的应用', title: 'ZSM-5在低温催化裂化（<400℃）中的应用', patentCount: 0, hasActive: false, ipc: 'B01J 29/40', desc: '无已有专利覆盖' },
    { area: '磷+稀土双元素协同改性方案', title: '磷+稀土双元素协同改性方案', patentCount: 1, hasActive: false, ipc: 'B01J 29/00', desc: '仅1件相关专利（已失效）' },
    { area: '磷改性ZSM-5用于MTO反应', title: '磷改性ZSM-5用于MTO反应', patentCount: 2, hasActive: true, ipc: 'B01J 29/40', desc: '该领域布局稀疏' },
  ],
  suggestions: [
    { title: '低温条件下磷改性ZSM-5催化剂及其应用', desc: '覆盖400℃以下催化裂化场景' },
    { title: '磷-镧双元素改性ZSM-5及其制备方法', desc: '利用协同效应差异' },
    { title: '原位合成法制备磷改性分子筛催化剂', desc: '绕开浸渍法限定' },
  ],
  forwardCitations: [
    { id: 'CN202310XXXXXX', title: '磷改性ZSM-5催化剂的改进制备方法', date: '2023-06' },
    { id: 'CN202210XXXXXX', title: '基于分子筛的催化裂化方法', date: '2022-09' },
    { id: 'CN202010XXXXXX', title: '稀土改性Y型分子筛用于催化裂化', date: '2020-05' },
  ],
  backwardCitations: [
    { id: 'CN202410YYYYYY', title: '磷-稀土协同改性ZSM-5催化剂', date: '2024-08' },
    { id: 'CN202410ZZZZZZ', title: '原位合成法制备改性分子筛', date: '2024-11' },
  ],
  familyPatents: [
    { id: 'CN202410123456', country: 'CN', date: '2024-03-15' },
    { id: 'US2024/0123456', country: 'US', date: '2024-09-20' },
    { id: 'EP2024/0456789', country: 'EP', date: '2024-10-01' },
  ],
};

const tabItems: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
  { key: 'tech', label: '技术方案', icon: <FileText className="h-3.5 w-3.5" /> },
  { key: 'claims', label: '权利要求', icon: <Shield className="h-3.5 w-3.5" /> },
  { key: 'opportunity', label: '可申请空间', icon: <Lightbulb className="h-3.5 w-3.5" /> },
  { key: 'citations', label: '引证关系', icon: <Network className="h-3.5 w-3.5" /> },
  { key: 'drawings', label: '附图', icon: <ImageIcon className="h-3.5 w-3.5" /> },
  { key: 'risk', label: '风险参考', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
];

export default function PatentDetailView({
  patent,
  onBack,
  onNavigate,
  hasPrev,
  hasNext,
}: {
  patent: Patent;
  onBack: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('tech');
  const [expandedClaims, setExpandedClaims] = useState<Set<number>>(new Set([1, 5]));

  const p = detailData.patent;

  const toggleClaimExpand = (id: number) => {
    setExpandedClaims(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderClaims = (claims: ClaimItem[], depth: number = 0) => (
    <div className={cn(depth > 0 && 'ml-5 border-l-2 border-outline/10 pl-3')}>
      {claims.map((claim) => (
        <div key={claim.id} className="mb-2">
          <div className={cn(
            'rounded-lg p-3 transition-colors',
            claim.type === 'independent' ? 'bg-primary/5 border border-primary/15' : 'bg-surface hover:bg-surface-container/50'
          )}>
            <div className="flex items-start gap-2">
              {(claim.children?.length ?? 0) > 0 && (
                <button onClick={() => toggleClaimExpand(claim.id)} className="shrink-0 mt-0.5">
                  {expandedClaims.has(claim.id) ? <ChevronDown className="h-3.5 w-3.5 text-on-surface-variant" /> : <ChevronRight className="h-3.5 w-3.5 text-on-surface-variant" />}
                </button>
              )}
              {(claim.children?.length ?? 0) === 0 && <span className="w-3.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-bold',
                    claim.type === 'independent' ? 'bg-primary/15 text-primary' : 'bg-surface-container text-on-surface-variant'
                  )}>
                    {claim.type === 'independent' ? '独立' : '从属'}
                  </span>
                  <span className="text-[12px] font-semibold text-foreground">权利要求 {claim.id}</span>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed">{claim.text}</p>
              </div>
            </div>
          </div>
          {(claim.children?.length ?? 0) > 0 && expandedClaims.has(claim.id) && renderClaims(claim.children!, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="shrink-0 border-b border-outline/10 bg-surface px-5 py-3 flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] text-primary hover:text-primary/80 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> 返回检索结果
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-md border border-outline/20 px-2.5 py-1.5 text-[11px] text-on-surface-variant hover:bg-surface-container transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> 上一篇
          </button>
          <button className="flex items-center gap-1 rounded-md border border-outline/20 px-2.5 py-1.5 text-[11px] text-on-surface-variant hover:bg-surface-container transition-colors">
            下一篇 <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 专利头部信息 */}
      <div className="shrink-0 border-b border-outline/10 bg-surface px-6 py-4">
        <h1 className="text-[18px] font-bold text-navy leading-snug mb-2">{p.title}</h1>
        <div className="flex items-center gap-3 text-[12px] text-on-surface-variant flex-wrap mb-3">
          <span className="font-semibold text-foreground">{p.id}</span>
          <span className="text-outline">|</span>
          <span>{p.applicant}</span>
          <span className="text-outline">|</span>
          <span>{p.filingDate}</span>
          <span className="text-outline">|</span>
          <span>IPC: {p.ipc}</span>
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', p.legalStatus === '有效' ? 'bg-success' : p.legalStatus === '审查中' ? 'bg-amber' : 'bg-faint')} />
            <span className="text-foreground font-medium">法律状态：{p.legalStatus}</span>
          </div>
          <span className="text-on-surface-variant">专利族：{p.familyCount ?? 3}件 / {(p.familyCountries ?? ['CN']).length}个国家</span>
          <span className="text-on-surface-variant">被引：{p.citedCount ?? 12}次</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button className="flex items-center gap-1.5 rounded-lg border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
            <FileText className="h-3.5 w-3.5" /> 原文PDF
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
            <Download className="h-3.5 w-3.5" /> 导出
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
            <GitCompare className="h-3.5 w-3.5" /> 加入对比
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
            <Star className="h-3.5 w-3.5" /> 收藏
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="shrink-0 border-b border-outline/10 bg-surface px-6">
        <div className="flex items-center gap-0.5">
          {tabItems.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[12px] font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-foreground'
              )}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 标签页内容 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-6">
          {/* 技术方案 */}
          {activeTab === 'tech' && (
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2 space-y-5">
                {/* 完整摘要 */}
                <div>
                  <h3 className="text-[14px] font-bold text-navy mb-2">摘要</h3>
                  <p className="text-[13px] text-foreground leading-relaxed">{p.abstract}</p>
                </div>

                {/* 技术方案要点 */}
                <div>
                  <h3 className="text-[14px] font-bold text-navy mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" /> 技术方案要点（AI 生成）
                  </h3>
                  <div className="space-y-2">
                    {detailData.techKeyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 rounded-lg bg-surface-container/50 p-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                        <p className="text-[12px] text-foreground leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI 技术参数提取 */}
              <div className="col-span-1">
                <div className="rounded-xl border border-outline/15 bg-surface p-4 shadow-card sticky top-4">
                  <h3 className="text-[13px] font-bold text-navy mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" /> AI 技术参数提取
                  </h3>
                  <div className="space-y-2.5">
                    {detailData.techParams.map((param) => (
                      <div key={param.label} className="flex items-center justify-between py-1.5 border-b border-outline/8 last:border-0">
                        <span className="text-[11px] text-on-surface-variant">{param.label}</span>
                        <span className="text-[12px] font-semibold text-foreground">{param.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-amber flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" /> 以上参数由AI自动提取，请结合原文确认
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 权利要求 */}
          {activeTab === 'claims' && (
            <div className="max-w-3xl">
              <h3 className="text-[14px] font-bold text-navy mb-4">权利要求结构树</h3>
              {renderClaims(detailData.claims)}
            </div>
          )}

          {/* 可申请空间分析 */}
          {activeTab === 'opportunity' && (
            <div className="max-w-3xl space-y-5">
              {/* 语言漏洞识别 */}
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" /> 语言漏洞识别
                </h3>
                <div className="space-y-3">
                  {detailData.languageGaps.map((gap, i) => (
                    <div key={i} className="rounded-lg border border-outline/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] font-bold text-amber">{gap.claim}</span>
                      </div>
                      <p className="text-[12px] text-foreground leading-relaxed mb-2">
                        <AlertTriangle className="h-3.5 w-3.5 inline text-amber mr-1" />{gap.text}
                      </p>
                      <div className="rounded-md bg-success-bg/60 border border-success/15 p-3">
                        <p className="text-[12px] text-success flex items-start gap-1.5">
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span><strong>机会：</strong>{gap.opportunity}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 相邻技术空白 */}
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-4 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" /> 相邻技术空白
                </h3>
                <div className="space-y-2">
                  {detailData.techBlanks.map((blank, i) => (
                    <div key={i} className="rounded-lg border border-outline/10 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                          blank.patentCount === 0 ? 'bg-success-bg text-success' : 'bg-warning-bg text-amber'
                        )}>
                          {blank.patentCount === 0 ? '空白' : '稀疏'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">IPC: {blank.ipc}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-foreground">{blank.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-1">相关专利数：{blank.patentCount}件{!blank.hasActive && '（无有效专利）'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 可申请方向建议 */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> 可申请方向建议（AI 生成）
                </h3>
                <p className="text-[12px] text-foreground leading-relaxed mb-3">
                  基于以上漏洞和空白，如果你想在此方向申请专利，建议从以下角度切入：
                </p>
                <div className="space-y-2">
                  {detailData.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-surface p-3 border border-primary/10">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-foreground">{s.title}</p>
                        <p className="text-[11px] text-on-surface-variant">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  以此方向生成交底书 <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 引证关系 */}
          {activeTab === 'citations' && (
            <div className="max-w-3xl space-y-5">
              {/* 引用前案 */}
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3">引用前案（{detailData.forwardCitations.length}件）</h3>
                <div className="space-y-2">
                  {detailData.forwardCitations.map((c, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg p-3 hover:bg-surface-container/50 transition-colors cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-medium text-foreground group-hover:text-primary">{c.id}</span>
                        <span className="mx-1.5 text-outline">—</span>
                        <span className="text-[12px] text-foreground">{c.title}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant shrink-0">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 被引后案 */}
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3">被引后案（{detailData.backwardCitations.length}件）</h3>
                <div className="space-y-2">
                  {detailData.backwardCitations.map((c, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg p-3 hover:bg-surface-container/50 transition-colors cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-medium text-foreground group-hover:text-primary">{c.id}</span>
                        <span className="mx-1.5 text-outline">—</span>
                        <span className="text-[12px] text-foreground">{c.title}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant shrink-0">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 同族专利 */}
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3">同族专利（{detailData.familyPatents.length}件 / {new Set(detailData.familyPatents.map(f => f.country)).size}个国家）</h3>
                <div className="flex gap-3">
                  {detailData.familyPatents.map((fp, i) => (
                    <div key={i} className="rounded-lg border border-outline/15 p-3 text-center min-w-[120px]">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                        fp.country === 'CN' ? 'bg-primary/10 text-primary' : fp.country === 'US' ? 'bg-info/10 text-info' : 'bg-success-bg text-success'
                      )}>{fp.country}</span>
                      <p className="mt-1.5 text-[11px] font-medium text-foreground">{fp.id}</p>
                      <p className="text-[10px] text-on-surface-variant">{fp.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 引证关系图谱（占位） */}
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4 text-primary" /> 引证关系图谱
                </h3>
                <div className="h-48 rounded-lg bg-surface-container/50 flex items-center justify-center">
                  <p className="text-[12px] text-on-surface-variant">引证关系可视化图谱（节点可点击跳转）</p>
                </div>
              </div>
            </div>
          )}

          {/* 附图 */}
          {activeTab === 'drawings' && (
            <div className="max-w-3xl">
              <h3 className="text-[14px] font-bold text-navy mb-4">专利说明书附图</h3>
              <div className="grid grid-cols-3 gap-4">
                {['图1 催化剂制备流程图', '图2 XRD衍射谱图', '图3 催化性能对比图'].map((fig, i) => (
                  <div key={i} className="rounded-xl border border-outline/15 bg-surface-container/50 p-4 text-center hover:shadow-card transition-shadow cursor-pointer">
                    <div className="h-32 bg-surface-container rounded-lg flex items-center justify-center mb-2">
                      <ImageIcon className="h-8 w-8 text-on-surface-variant/30" />
                    </div>
                    <p className="text-[11px] text-foreground font-medium">{fig}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 风险参考 */}
          {activeTab === 'risk' && (
            <div className="max-w-3xl space-y-4">
              <div className="rounded-lg bg-amber/5 border border-amber/15 p-4">
                <p className="text-[12px] text-amber flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> 仅供参考，建议结合专业 IP 人员意见
                </p>
              </div>
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3">侵权风险评分</h3>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full border-4 border-amber flex items-center justify-center">
                    <span className="text-[24px] font-black text-amber">65</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-amber">中等风险</p>
                    <p className="text-[12px] text-on-surface-variant mt-1">该专利权利要求范围较广，需关注技术方案重叠部分</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3">核心风险点</h3>
                <div className="space-y-2">
                  {['磷改性ZSM-5路线与权利要求1重叠', '浸渍法制备方法与权利要求5重叠', '丙烯选择性提升方向与已有专利交叉'].map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-error-bg/50">
                      <AlertTriangle className="h-3.5 w-3.5 text-error shrink-0 mt-0.5" />
                      <p className="text-[12px] text-foreground">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-outline/15 bg-surface p-5 shadow-card">
                <h3 className="text-[14px] font-bold text-navy mb-3">规避建议</h3>
                <div className="space-y-2">
                  {['考虑采用原位合成法替代浸渍法，规避权利要求5', '在方案中限定更窄的温度范围（如400-500℃）形成差异化', '引入磷-稀土双元素协同改性，与单一磷改性形成区别'].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-success-bg/50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                      <p className="text-[12px] text-foreground">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

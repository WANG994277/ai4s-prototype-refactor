'use client';

import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Code2, Fingerprint,
  ChevronDown, ChevronRight, X, Download, BarChart3,
  Star, StarOff, Clock, Filter, Check, CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { patents, type Patent, ipcTree, type IpcTreeNode } from './data';

type SearchMode = 'simple' | 'advanced' | 'expert' | 'similarity';

export default function PatentSearchView({
  onSelectPatent,
}: {
  onSelectPatent: (patent: Patent) => void;
}) {
  const [searchMode, setSearchMode] = useState<SearchMode>('simple');
  const [simpleQuery, setSimpleQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['CN', 'US']);
  const [expandedIpc, setExpandedIpc] = useState<string[]>(['B01J']);
  const [selectedIpc, setSelectedIpc] = useState('B01J 29/40');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'citations'>('relevance');
  const [selectedPatents, setSelectedPatents] = useState<Set<string>>(new Set());
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [similarityInput, setSimilarityInput] = useState('');

  // Advanced search state
  const [advancedFields, setAdvancedFields] = useState([
    { field: 'title', operator: 'contains', value: '' },
  ]);

  // Expert query state
  const [expertQuery, setExpertQuery] = useState('');

  const countryOptions = [
    { code: 'CN', label: '中国' },
    { code: 'US', label: '美国' },
    { code: 'EP', label: '欧洲' },
    { code: 'JP', label: '日本' },
    { code: 'WO', label: 'PCT' },
  ];

  const searchModes: { key: SearchMode; label: string; icon: React.ReactNode }[] = [
    { key: 'simple', label: '简单检索', icon: <Search className="h-3.5 w-3.5" /> },
    { key: 'advanced', label: '高级检索', icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
    { key: 'expert', label: '专业检索', icon: <Code2 className="h-3.5 w-3.5" /> },
    { key: 'similarity', label: '相似度检测', icon: <Fingerprint className="h-3.5 w-3.5" /> },
  ];

  const searchHistory = [
    { query: 'ZSM-5 磷改性 催化裂化', count: 28, time: '10分钟前' },
    { query: 'B01J 29/40', count: 4, time: '1小时前' },
    { query: '丙烯选择性 分子筛', count: 15, time: '今天' },
    { query: 'CN202310XXXXXX', count: 1, time: '昨天' },
    { query: '核壳结构 催化剂 MTO', count: 7, time: '昨天' },
  ];

  const filteredPatents = patents.filter(() => true);

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const togglePatentSelection = (id: string) => {
    setSelectedPatents(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPatents.size === filteredPatents.length) {
      setSelectedPatents(new Set());
    } else {
      setSelectedPatents(new Set(filteredPatents.map(p => p.id)));
    }
  };

  const toggleIpcExpand = (code: string) => {
    setExpandedIpc(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const renderIpcTree = (nodes: IpcTreeNode[], depth: number = 0) => (
    <div className={cn(depth > 0 && 'ml-3')}>
      {nodes.map((node) => (
        <div key={node.code}>
          <button
            className={cn(
              'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-left hover:bg-surface-container transition-colors',
              selectedIpc === node.code && 'bg-primary/10 text-primary font-semibold',
            )}
            style={{ paddingLeft: `${8 + depth * 12}px` }}
            onClick={() => {
              if (node.children) toggleIpcExpand(node.code);
              setSelectedIpc(node.code);
            }}
          >
            {node.children ? (
              expandedIpc.includes(node.code) ? <ChevronDown className="h-3 w-3 shrink-0 text-on-surface-variant" /> : <ChevronRight className="h-3 w-3 shrink-0 text-on-surface-variant" />
            ) : (
              <span className="w-3 shrink-0" />
            )}
            <span className="font-medium truncate">{node.code}</span>
            <span className="text-on-surface-variant truncate"> {node.label}</span>
            <span className="ml-auto shrink-0 text-[10px] text-on-surface-variant">({node.count}件)</span>
          </button>
          {node.children && expandedIpc.includes(node.code) && renderIpcTree(node.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="absolute inset-0 flex">
      {/* 左栏：筛选面板 */}
      <div className="w-60 shrink-0 border-r border-outline/10 bg-surface overflow-y-auto">
        <div className="p-3 space-y-4">
          {/* 专利局筛选 */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">专利局</h4>
            <div className="flex flex-wrap gap-1.5">
              {countryOptions.map((c) => (
                <button key={c.code} onClick={() => toggleCountry(c.code)}
                  className={cn(
                    'rounded-md px-2 py-1 text-[11px] font-medium transition-colors border',
                    selectedCountries.includes(c.code)
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-surface-container text-on-surface-variant border-outline/10 hover:border-outline/30'
                  )}>
                  {c.code} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* IPC分类树 */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">IPC 分类</h4>
            {renderIpcTree(ipcTree)}
          </div>

          {/* 申请人筛选 */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">申请人</h4>
            <div className="space-y-1">
              {['中石化', '中石油', 'ExxonMobil', 'BASF', 'Shell', 'UOP'].map((name) => (
                <label key={name} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-container cursor-pointer transition-colors">
                  <input type="checkbox" className="rounded border-outline/30" />
                  <span className="text-[11px] text-foreground">{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 申请日范围 */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">申请日范围</h4>
            <div className="space-y-1.5">
              <input type="date" className="w-full rounded-md border border-outline/20 bg-surface-container px-2 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30" />
              <span className="block text-center text-[10px] text-on-surface-variant">至</span>
              <input type="date" className="w-full rounded-md border border-outline/20 bg-surface-container px-2 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
          </div>

          {/* 法律状态 */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">法律状态</h4>
            <div className="space-y-1">
              {[
                { label: '有效', color: 'bg-success' },
                { label: '审查中', color: 'bg-amber' },
                { label: '失效', color: 'bg-faint' },
              ].map((s) => (
                <label key={s.label} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-container cursor-pointer transition-colors">
                  <input type="checkbox" className="rounded border-outline/30" />
                  <span className={cn('h-2 w-2 rounded-full', s.color)} />
                  <span className="text-[11px] text-foreground">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 检索历史 */}
          <div>
            <button onClick={() => setExpandedHistory(!expandedHistory)}
              className="flex w-full items-center justify-between mb-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              检索历史
              {expandedHistory ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {expandedHistory && (
              <div className="space-y-1">
                {searchHistory.map((h, i) => (
                  <button key={i} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-surface-container transition-colors group">
                    <p className="text-[11px] text-foreground group-hover:text-primary truncate">{h.query}</p>
                    <p className="text-[10px] text-on-surface-variant">{h.count}件 · {h.time}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右栏：检索区 + 结果列表 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 检索模式切换 + 搜索框 */}
        <div className="shrink-0 border-b border-outline/10 bg-surface px-5 py-3">
          {/* 模式标签 */}
          <div className="flex items-center gap-1 mb-3">
            {searchModes.map((m) => (
              <button key={m.key} onClick={() => setSearchMode(m.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all',
                  searchMode === m.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-foreground'
                )}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {/* 简单检索 */}
          {searchMode === 'simple' && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <input value={simpleQuery} onChange={(e) => setSimpleQuery(e.target.value)}
                  placeholder="输入关键词、专利号或技术主题..."
                  className="w-full rounded-lg border border-outline/20 bg-background pl-10 pr-4 py-2.5 text-[13px] text-foreground placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all" />
              </div>
              <button className="rounded-lg bg-primary px-5 py-2.5 text-[13px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm shrink-0">
                检索
              </button>
            </div>
          )}

          {/* 高级检索 */}
          {searchMode === 'advanced' && (
            <div className="space-y-2">
              {advancedFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select value={field.field} onChange={(e) => {
                    const next = [...advancedFields];
                    next[idx] = { ...next[idx], field: e.target.value };
                    setAdvancedFields(next);
                  }} className="rounded-md border border-outline/20 bg-surface-container px-2.5 py-2 text-[12px] text-foreground focus:outline-none shrink-0 w-28">
                    <option value="title">标题</option>
                    <option value="abstract">摘要</option>
                    <option value="claims">权利要求</option>
                    <option value="fulltext">全文</option>
                    <option value="inventor">发明人</option>
                    <option value="applicant">申请人</option>
                  </select>
                  <select value={field.operator} onChange={(e) => {
                    const next = [...advancedFields];
                    next[idx] = { ...next[idx], operator: e.target.value };
                    setAdvancedFields(next);
                  }} className="rounded-md border border-outline/20 bg-surface-container px-2.5 py-2 text-[12px] text-foreground focus:outline-none shrink-0 w-20">
                    <option value="contains">包含</option>
                    <option value="not_contains">不包含</option>
                  </select>
                  <input value={field.value} onChange={(e) => {
                    const next = [...advancedFields];
                    next[idx] = { ...next[idx], value: e.target.value };
                    setAdvancedFields(next);
                  }} placeholder="输入关键词..."
                    className="flex-1 rounded-md border border-outline/20 bg-background px-3 py-2 text-[12px] text-foreground placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  {idx > 0 && (
                    <button onClick={() => setAdvancedFields(prev => prev.filter((_, i) => i !== idx))}
                      className="text-on-surface-variant hover:text-foreground shrink-0"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => setAdvancedFields(prev => [...prev, { field: 'title', operator: 'contains', value: '' }])}
                  className="text-[12px] text-primary hover:underline font-medium">+ 添加条件</button>
                <div className="flex-1" />
                <button className="rounded-lg bg-primary px-5 py-2 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  检索
                </button>
              </div>
            </div>
          )}

          {/* 专业检索 */}
          {searchMode === 'expert' && (
            <div className="space-y-2">
              <textarea value={expertQuery} onChange={(e) => setExpertQuery(e.target.value)}
                placeholder={"(TI=(催化裂化 OR FCC) AND AB=(ZSM-5 AND 磷改性)) AND AD=[2020-01-01 TO 2024-12-31]\n\n语法提示：TI=标题  AB=摘要  CL=权利要求  IN=发明人  PA=申请人  IPC=分类号  AD=申请日"}
                className="w-full rounded-lg border border-outline/20 bg-background px-4 py-3 text-[12px] font-mono text-foreground min-h-[80px] placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all leading-relaxed" />
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-outline/20 px-3 py-1.5 text-[11px] text-on-surface-variant hover:bg-surface-container transition-colors">
                  检索式校验
                </button>
                <div className="flex-1" />
                <button className="rounded-lg bg-primary px-5 py-2 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  检索
                </button>
              </div>
            </div>
          )}

          {/* 相似度检测 */}
          {searchMode === 'similarity' && (
            <div className="space-y-2">
              <textarea value={similarityInput} onChange={(e) => setSimilarityInput(e.target.value)}
                placeholder="粘贴你的技术描述（研究摘要、交底书片段、论文摘要等），系统基于语义相似度匹配专利库..."
                className="w-full rounded-lg border border-outline/20 bg-background px-4 py-3 text-[13px] text-foreground min-h-[100px] placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all leading-relaxed" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-on-surface-variant">结果按相似度百分比降序排列，标注重叠/差异特征</span>
                <div className="flex-1" />
                <button className="rounded-lg bg-primary px-5 py-2 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  <Fingerprint className="h-3.5 w-3.5 inline mr-1" /> 开始检测
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 结果工具栏 */}
        <div className="shrink-0 flex items-center justify-between border-b border-outline/10 px-5 py-2.5 bg-surface">
          <div className="flex items-center gap-4">
            <button onClick={toggleSelectAll}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors">
              {selectedPatents.size === filteredPatents.length && filteredPatents.length > 0
                ? <><Check className="h-3.5 w-3.5" /> 取消全选</>
                : <><CheckSquare className="h-3.5 w-3.5" /> 全选</>
              }
            </button>
            <span className="text-[12px] text-on-surface-variant">
              已检索 <strong className="text-foreground">{filteredPatents.length}</strong> 件，已选 <strong className="text-primary">{selectedPatents.size}</strong> 件
            </span>
            <div className="flex items-center gap-1.5">
              {(['relevance', 'date', 'citations'] as const).map((sort) => (
                <button key={sort} onClick={() => setSortBy(sort)}
                  className={cn(
                    'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                    sortBy === sort ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-foreground hover:bg-surface-container'
                  )}>
                  {sort === 'relevance' ? '相关度' : sort === 'date' ? '申请日' : '被引次数'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
              <Download className="h-3.5 w-3.5" /> 批量导出
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
              <BarChart3 className="h-3.5 w-3.5" /> 分析
            </button>
          </div>
        </div>

        {/* 检索结果列表 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-0">
            {filteredPatents.map((patent) => (
              <div key={patent.id}
                className="group flex items-start gap-3 border-b border-outline/8 px-5 py-4 hover:bg-primary/3 transition-colors cursor-pointer"
                onClick={() => onSelectPatent(patent)}>
                {/* 复选框 */}
                <button onClick={(e) => { e.stopPropagation(); togglePatentSelection(patent.id); }}
                  className={cn(
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    selectedPatents.has(patent.id)
                      ? 'bg-primary border-primary text-white'
                      : 'border-outline/30 hover:border-primary/40'
                  )}>
                  {selectedPatents.has(patent.id) && <Check className="h-3 w-3" />}
                </button>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1 truncate">
                    {patent.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mb-2">
                    <span className="font-medium text-foreground">{patent.id}</span>
                    <span className="text-outline">|</span>
                    <span>{patent.applicant}</span>
                    <span className="text-outline">|</span>
                    <span>{patent.filingDate}</span>
                    <span className="text-outline">|</span>
                    <span>IPC: {patent.ipc}</span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed line-clamp-2 mb-2">
                    {patent.abstract}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(patent.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-on-surface-variant font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 右侧指标 */}
                <div className="shrink-0 text-right space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className={cn(
                      'h-2 w-2 rounded-full',
                      patent.legalStatus === '有效' ? 'bg-success' : patent.legalStatus === '审查中' ? 'bg-amber' : 'bg-faint'
                    )} />
                    <span className="text-[11px] text-on-surface-variant">{patent.legalStatus}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">被引 {patent.citedCount ?? 0}次</p>
                  <p className="text-[11px] font-semibold text-primary">相关度 {patent.relevance ?? patent.relevanceScore ?? 0}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-center gap-1.5 py-4 border-t border-outline/10">
            <button className="rounded-md border border-outline/20 px-2.5 py-1 text-[11px] text-on-surface-variant hover:bg-surface-container transition-colors">&lt;</button>
            {[1, 2, 3, '...', 20].map((p, i) => (
              <button key={i} className={cn(
                'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                p === 1 ? 'bg-primary text-white' : 'border border-outline/20 text-on-surface-variant hover:bg-surface-container'
              )}>{p}</button>
            ))}
            <button className="rounded-md border border-outline/20 px-2.5 py-1 text-[11px] text-on-surface-variant hover:bg-surface-container transition-colors">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

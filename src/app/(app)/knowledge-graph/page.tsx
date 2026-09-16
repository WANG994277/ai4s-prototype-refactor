'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronRight,
  ExternalLink,
  X,
  Eye,
  Lightbulb,
  Route,
  Network,
  Calendar,
  Tag,
  Link2,
  Sparkles,
  ArrowRight,
  Layers,
  Compass,
  Plus,
  RefreshCw,
  Send,
  Crosshair,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
interface KGNode {
  id: string;
  label: string;
  type: 'catalyst' | 'reaction' | 'molecule' | 'literature' | 'patent' | 'experiment' | 'dataset';
  x: number;
  y: number;
  properties: Record<string, string>;
  connections: number;
}

interface KGEdge {
  from: string;
  to: string;
  type: 'catalyzes' | 'produces' | 'references' | 'derived_from' | 'contains' | 'measures';
}

interface NewAssociation {
  id: string;
  from: string;
  to: string;
  fromType: string;
  toType: string;
  reason: string;
  confidence: number;
}

interface ExplorePath {
  id: string;
  title: string;
  steps: string[];
  description: string;
  relevance: number;
}

/* ─── Mock Data ─── */
const nodeTypeConfig: Record<KGNode['type'], { label: string; color: string; bg: string; border: string }> = {
  catalyst: { label: '催化剂', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  reaction: { label: '反应', color: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/20' },
  molecule: { label: '分子', color: 'text-purple', bg: 'bg-purple/10', border: 'border-purple/20' },
  literature: { label: '文献', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  patent: { label: '专利', color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/20' },
  experiment: { label: '实验', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
  dataset: { label: '数据集', color: 'text-muted-foreground', bg: 'bg-surface-2', border: 'border-line' },
};

const edgeTypeConfig: Record<KGEdge['type'], { label: string; color: string; dash?: string }> = {
  catalyzes: { label: '催化', color: '#1d5fd6' },
  produces: { label: '产出', color: '#13b7c7' },
  references: { label: '引用', color: '#17a56a' },
  derived_from: { label: '衍生自', color: '#7c5ce0', dash: '5,3' },
  contains: { label: '包含', color: '#63718c' },
  measures: { label: '测量', color: '#cf3f3f' },
};

const nodes: KGNode[] = [
  { id: 'n1', label: 'ZSM-5', type: 'catalyst', x: 320, y: 200, properties: { '硅铝比': '25-50', '孔径': '0.55nm', '拓扑结构': 'MFI' }, connections: 8 },
  { id: 'n2', label: '催化裂化', type: 'reaction', x: 520, y: 160, properties: { '温度': '500-550°C', '压力': '0.1-0.3MPa', '转化率': '65-80%' }, connections: 5 },
  { id: 'n3', label: '丙烯', type: 'molecule', x: 700, y: 140, properties: { '分子式': 'C₃H₆', 'MW': '42.08', '沸点': '-47.6°C' }, connections: 3 },
  { id: 'n4', label: 'Ni-Mo/Al₂O₃', type: 'catalyst', x: 320, y: 360, properties: { '载体': 'γ-Al₂O₃', '活性金属': 'Ni-Mo', '助剂': 'P' }, connections: 5 },
  { id: 'n5', label: '加氢脱硫', type: 'reaction', x: 520, y: 320, properties: { '温度': '340-380°C', '压力': '3-6MPa', '硫含量': '<10ppm' }, connections: 4 },
  { id: 'n6', label: 'Zhang2024', type: 'literature', x: 160, y: 140, properties: { '期刊': 'Appl Catal B', '年份': '2024', 'IF': '24.3' }, connections: 3 },
  { id: 'n7', label: 'CN2024101', type: 'patent', x: 160, y: 280, properties: { '申请人': '中石化', '状态': '审查中', 'IPC': 'B01J 29/40' }, connections: 2 },
  { id: 'n8', label: 'FCC-Exp-001', type: 'experiment', x: 700, y: 300, properties: { '类型': '微反活性', '日期': '2024-08', '结果': 'MA=72' }, connections: 3 },
  { id: 'n9', label: 'SAPO-34', type: 'catalyst', x: 500, y: 440, properties: { '硅铝比': '0.2-0.5', '孔径': '0.38nm', '拓扑结构': 'CHA' }, connections: 4 },
  { id: 'n10', label: 'MTO反应', type: 'reaction', x: 680, y: 440, properties: { '温度': '400-450°C', '甲醇转化率': '>99%', '乙烯选择性': '45%' }, connections: 3 },
  { id: 'n11', label: 'Catalyst-DB', type: 'dataset', x: 160, y: 400, properties: { '记录数': '12,456', '来源': '内部数据库', '更新': '2024-09' }, connections: 2 },
  { id: 'n12', label: 'Li2023', type: 'literature', x: 340, y: 480, properties: { '期刊': 'Catal Today', '年份': '2023', 'IF': '6.6' }, connections: 2 },
];

const edges: KGEdge[] = [
  { from: 'n1', to: 'n2', type: 'catalyzes' },
  { from: 'n2', to: 'n3', type: 'produces' },
  { from: 'n4', to: 'n5', type: 'catalyzes' },
  { from: 'n6', to: 'n1', type: 'references' },
  { from: 'n7', to: 'n1', type: 'derived_from' },
  { from: 'n2', to: 'n8', type: 'measures' },
  { from: 'n9', to: 'n10', type: 'catalyzes' },
  { from: 'n11', to: 'n4', type: 'contains' },
  { from: 'n12', to: 'n9', type: 'references' },
  { from: 'n8', to: 'n3', type: 'produces' },
];

const newAssociations: NewAssociation[] = [
  { id: 'na1', from: 'ZSM-5', to: 'SAPO-34', fromType: 'catalyst', toType: 'catalyst', reason: '两者在MTO工艺中可形成复合催化剂，协同效应显著', confidence: 0.82 },
  { id: 'na2', from: 'ZSM-5', to: 'FCC-Exp-001', fromType: 'catalyst', toType: 'experiment', reason: '实验数据中包含ZSM-5添加量对丙烯选择性的影响', confidence: 0.91 },
  { id: 'na3', from: 'Ni-Mo/Al₂O₃', to: 'SAPO-34', fromType: 'catalyst', toType: 'catalyst', reason: '两种催化剂在加氢和MTO工艺中存在联产可能性', confidence: 0.65 },
  { id: 'na4', from: 'Zhang2024', to: 'Li2023', fromType: 'literature', toType: 'literature', reason: '两篇文献在磷改性策略上存在互补论证', confidence: 0.78 },
];

const explorePaths: ExplorePath[] = [
  {
    id: 'ep1', title: 'ZSM-5改性策略全链路',
    steps: ['ZSM-5', '→ 磷改性', '→ 催化裂化', '→ 丙烯增产'],
    description: '追踪ZSM-5分子筛改性到丙烯增产的完整技术路径',
    relevance: 0.95,
  },
  {
    id: 'ep2', title: '催化剂再生与失活循环',
    steps: ['ZSM-5', '→ 水热失活', '→ 再生处理', '→ 活性恢复'],
    description: '探索分子筛催化剂的失活机理和再生方法',
    relevance: 0.88,
  },
  {
    id: 'ep3', title: 'MTO工艺催化材料演进',
    steps: ['SAPO-34', '→ MTO反应', '→ 乙烯/丙烯', '→ 复合催化剂'],
    description: '从SAPO-34出发探索MTO工艺的技术演进',
    relevance: 0.82,
  },
  {
    id: 'ep4', title: '加氢脱硫催化剂优化',
    steps: ['Ni-Mo/Al₂O₃', '→ 磷助剂', '→ 加氢脱硫', '→ 超低硫柴油'],
    description: '追踪加氢脱硫催化剂从配方到产品品质的技术链',
    relevance: 0.76,
  },
];

const scopeOptions = [
  { key: 'project', label: '当前项目', desc: '聚焦本课题相关节点' },
  { key: 'department', label: '本部门', desc: '部门内全部研究数据' },
  { key: 'institution', label: '本院所', desc: '跨部门知识整合' },
  { key: 'industry', label: '行业', desc: '石油石化行业全量数据' },
];

/* ─── Component ─── */
export default function KnowledgeGraphPage() {
  const [scope, setScope] = useState('project');
  const [nodeTypeFilter, setNodeTypeFilter] = useState<Set<KGNode['type']>>(new Set(['catalyst', 'reaction', 'molecule', 'literature', 'patent', 'experiment', 'dataset']));
  const [edgeTypeFilter, setEdgeTypeFilter] = useState<Set<KGEdge['type']>>(new Set(['catalyzes', 'produces', 'references', 'derived_from', 'contains', 'measures']));
  const [timeRange, setTimeRange] = useState<[number, number]>([2019, 2024]);
  const [selectedNode, setSelectedNode] = useState<KGNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showNewAssociations, setShowNewAssociations] = useState(false);
  const [showExplorePaths, setShowExplorePaths] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const toggleNodeType = (type: KGNode['type']) => {
    setNodeTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const toggleEdgeType = (type: KGEdge['type']) => {
    setEdgeTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !selectedNode) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan, selectedNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const filteredNodes = nodes.filter((n) => nodeTypeFilter.has(n.type));
  const filteredEdges = edges.filter((e) => edgeTypeFilter.has(e.type) && filteredNodes.some((n) => n.id === e.from) && filteredNodes.some((n) => n.id === e.to));

  const handleSearchLocate = () => {
    if (!searchQuery.trim()) return;
    const found = nodes.find((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelectedNode(found);
      setPan({ x: 400 - found.x * zoom, y: 250 - found.y * zoom });
    }
  };

  return (
    <div className="flex h-[calc(100vh-44px-40px)] gap-0 -m-5">
      {/* Left: Filters */}
      <div className="w-[280px] shrink-0 border-r border-line bg-white overflow-y-auto">
        <div className="p-4">
          <h3 className="mb-3 text-sm font-bold text-navy">知识图谱探索</h3>

          {/* Scope switch */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1">
              <Layers className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">图谱范围</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {scopeOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setScope(opt.key)}
                  className={cn(
                    'rounded-md px-2 py-1.5 text-left transition-colors',
                    scope === opt.key
                      ? 'bg-primary/10 border border-primary/20'
                      : 'border border-line hover:bg-surface-2'
                  )}
                >
                  <div className={cn('text-[11px] font-bold', scope === opt.key ? 'text-primary' : 'text-foreground')}>{opt.label}</div>
                  <div className="text-[9px] text-muted-foreground">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Node type filter */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1">
              <Network className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">节点类型</span>
            </div>
            <div className="space-y-1">
              {(Object.entries(nodeTypeConfig) as [KGNode['type'], typeof nodeTypeConfig[KGNode['type']]][]).map(([type, cfg]) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-surface-2">
                  <input
                    type="checkbox"
                    checked={nodeTypeFilter.has(type)}
                    onChange={() => toggleNodeType(type)}
                    className="h-3.5 w-3.5 rounded accent-primary"
                  />
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold border', cfg.bg, cfg.color, cfg.border)}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-faint">({nodes.filter((n) => n.type === type).length})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Edge type filter */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1">
              <Link2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">关系类型</span>
            </div>
            <div className="space-y-1">
              {(Object.entries(edgeTypeConfig) as [KGEdge['type'], typeof edgeTypeConfig[KGEdge['type']]][]).map(([type, cfg]) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 hover:bg-surface-2">
                  <input
                    type="checkbox"
                    checked={edgeTypeFilter.has(type)}
                    onChange={() => toggleEdgeType(type)}
                    className="h-3.5 w-3.5 rounded accent-primary"
                  />
                  <svg width="20" height="6" className="shrink-0">
                    <line x1="0" y1="3" x2="20" y2="3" stroke={cfg.color} strokeWidth="2" strokeDasharray={cfg.dash || 'none'} />
                  </svg>
                  <span className="text-[10px] text-foreground">{cfg.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time range filter */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">时间范围</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={timeRange[0]}
                onChange={(e) => setTimeRange([Number(e.target.value), timeRange[1]])}
                className="w-16 rounded-md border border-line bg-surface-2 px-2 py-1 text-[11px] text-center focus:outline-none"
              />
              <span className="text-faint">—</span>
              <input
                type="number"
                value={timeRange[1]}
                onChange={(e) => setTimeRange([timeRange[0], Number(e.target.value)])}
                className="w-16 rounded-md border border-line bg-surface-2 px-2 py-1 text-[11px] text-center focus:outline-none"
              />
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-line">
              <div className="h-full rounded-full bg-primary/30" style={{ marginLeft: `${((timeRange[0] - 2015) / 15) * 100}%`, width: `${((timeRange[1] - timeRange[0]) / 15) * 100}%` }} />
            </div>
          </div>

          {/* Keyword search */}
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1">
              <Crosshair className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">关键词定位</span>
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchLocate()}
                placeholder="搜索节点..."
                className="flex-1 rounded-md border border-line bg-surface-2 px-2 py-1.5 text-[11px] placeholder:text-faint focus:outline-none"
              />
              <button
                onClick={handleSearchLocate}
                className="rounded-md bg-primary/10 border border-primary/20 px-2 py-1.5 text-[11px] text-primary hover:bg-primary/20"
              >
                <MapPin className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* New associations */}
          <div className="mb-4">
            <button
              onClick={() => setShowNewAssociations(!showNewAssociations)}
              className="flex w-full items-center justify-between rounded-md border border-cyan/20 bg-cyan/5 px-3 py-2 text-left"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan" />
                <span className="text-[11px] font-bold text-cyan">新关联发现</span>
                <span className="rounded-full bg-cyan/20 px-1.5 text-[9px] font-bold text-cyan">{newAssociations.length}</span>
              </div>
              <ChevronRight className={cn('h-3.5 w-3.5 text-cyan transition-transform', showNewAssociations && 'rotate-90')} />
            </button>
            {showNewAssociations && (
              <div className="mt-2 space-y-1.5">
                {newAssociations.map((assoc) => (
                  <div key={assoc.id} className="rounded-md border border-line p-2 hover:border-cyan/20 transition-colors">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className={cn('rounded-full px-1 py-0.5 text-[8px] font-bold', nodeTypeConfig[assoc.fromType as KGNode['type']].bg, nodeTypeConfig[assoc.fromType as KGNode['type']].color)}>
                        {assoc.fromType === 'catalyst' ? '催化剂' : assoc.fromType === 'literature' ? '文献' : assoc.fromType}
                      </span>
                      <ArrowRight className="h-2.5 w-2.5 text-faint" />
                      <span className={cn('rounded-full px-1 py-0.5 text-[8px] font-bold', nodeTypeConfig[assoc.toType as KGNode['type']].bg, nodeTypeConfig[assoc.toType as KGNode['type']].color)}>
                        {assoc.toType === 'catalyst' ? '催化剂' : assoc.toType === 'experiment' ? '实验' : assoc.toType}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-foreground">{assoc.from} → {assoc.to}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{assoc.reason}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-12 rounded-full bg-line">
                          <div className="h-full rounded-full bg-cyan" style={{ width: `${assoc.confidence * 100}%` }} />
                        </div>
                        <span className="text-[9px] text-cyan font-bold">{Math.round(assoc.confidence * 100)}%</span>
                      </div>
                      <button className="text-[9px] text-primary hover:underline">添加至图谱</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Explore paths */}
          <div className="mb-4">
            <button
              onClick={() => setShowExplorePaths(!showExplorePaths)}
              className="flex w-full items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-left"
            >
              <div className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold text-primary">探索路径推荐</span>
                <span className="rounded-full bg-primary/20 px-1.5 text-[9px] font-bold text-primary">{explorePaths.length}</span>
              </div>
              <ChevronRight className={cn('h-3.5 w-3.5 text-primary transition-transform', showExplorePaths && 'rotate-90')} />
            </button>
            {showExplorePaths && (
              <div className="mt-2 space-y-1.5">
                {explorePaths.map((path) => (
                  <div key={path.id} className="rounded-md border border-line p-2 hover:border-primary/20 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-bold text-foreground">{path.title}</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-10 rounded-full bg-line">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${path.relevance * 100}%` }} />
                        </div>
                        <span className="text-[9px] text-primary font-bold">{Math.round(path.relevance * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-wrap">
                      {path.steps.map((step, i) => (
                        <span key={i} className="flex items-center">
                          <span className={cn(
                            'rounded px-1 py-0.5 text-[8px] font-bold',
                            i === 0 ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-foreground'
                          )}>{step}</span>
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">{path.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Graph canvas + detail overlay */}
      <div className="relative flex-1 flex flex-col overflow-hidden bg-bg">
        {/* Graph toolbar */}
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-foreground">
              {scope === 'project' ? '当前项目' : scope === 'department' ? '本部门' : scope === 'institution' ? '本院所' : '行业'}知识图谱
            </span>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">
              {filteredNodes.length} 节点 · {filteredEdges.length} 关系
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} className="rounded-md border border-line p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-12 text-center text-[11px] text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="rounded-md border border-line p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="rounded-md border border-line p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
              <Maximize className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 relative overflow-hidden" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <defs>
              <pattern id="kgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#dce6f5" strokeWidth="0.3" />
              </pattern>
              {Object.entries(edgeTypeConfig).map(([type, cfg]) => (
                <marker key={type} id={`arrow-${type}`} viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,3 L0,6 Z" fill={cfg.color} opacity="0.6" />
                </marker>
              ))}
            </defs>
            <rect width="100%" height="100%" fill="url(#kgrid)" />
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map((edge, i) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const cfg = edgeTypeConfig[edge.type];
                return (
                  <line
                    key={i}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={cfg.color}
                    strokeWidth="1.5"
                    strokeDasharray={cfg.dash}
                    opacity="0.5"
                    markerEnd={`url(#arrow-${edge.type})`}
                  />
                );
              })}
              {/* Nodes */}
              {filteredNodes.map((node) => {
                const cfg = nodeTypeConfig[node.type];
                const isSelected = selectedNode?.id === node.id;
                const r = Math.max(18, 12 + node.connections * 2);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle r={r + 3} fill="none" stroke={isSelected ? '#1d5fd6' : 'transparent'} strokeWidth="2" strokeDasharray={isSelected ? 'none' : '4,2'} />
                    <circle r={r} fill="white" stroke={cfg.color.includes('primary') ? '#1d5fd6' : cfg.color === 'text-cyan' ? '#13b7c7' : cfg.color === 'text-purple' ? '#7c5ce0' : cfg.color === 'text-green-600' ? '#17a56a' : cfg.color === 'text-amber' ? '#f59e0b' : cfg.color === 'text-destructive' ? '#cf3f3f' : '#63718c'} strokeWidth="1.5" />
                    <text y="-4" textAnchor="middle" className="text-[9px] font-bold" fill="#15213a">{node.label}</text>
                    <text y="7" textAnchor="middle" className="text-[7px]" fill="#8a97ad">{cfg.label}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Node detail panel - floating overlay */}
      {selectedNode && (
        <div className="absolute right-0 top-0 bottom-0 w-[300px] shrink-0 border-l border-line bg-white/95 backdrop-blur-sm overflow-y-auto z-10 shadow-lg">
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold border', nodeTypeConfig[selectedNode.type].bg, nodeTypeConfig[selectedNode.type].color, nodeTypeConfig[selectedNode.type].border)}>
                  {nodeTypeConfig[selectedNode.type].label}
                </span>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-faint hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-[16px] font-black text-navy mb-1">{selectedNode.label}</h3>
            <p className="text-[11px] text-muted-foreground mb-3">连接数: {selectedNode.connections}</p>

            {/* Properties */}
            <div className="mb-4">
              <h4 className="mb-2 text-[12px] font-bold text-foreground">属性</h4>
              <div className="space-y-1.5">
                {Object.entries(selectedNode.properties).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-md border border-line px-2.5 py-1.5">
                    <span className="text-[11px] text-muted-foreground">{key}</span>
                    <span className="text-[11px] font-bold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related nodes */}
            <div className="mb-4">
              <h4 className="mb-2 text-[12px] font-bold text-foreground">关联实体</h4>
              <div className="space-y-1.5">
                {edges
                  .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                  .map((edge, i) => {
                    const relatedId = edge.from === selectedNode.id ? edge.to : edge.from;
                    const relatedNode = nodes.find((n) => n.id === relatedId);
                    if (!relatedNode) return null;
                    const relCfg = nodeTypeConfig[relatedNode.type];
                    const edgeCfg = edgeTypeConfig[edge.type];
                    return (
                      <div key={i} className="flex items-center gap-2 rounded-md border border-line p-2 hover:bg-surface-2 cursor-pointer" onClick={() => setSelectedNode(relatedNode)}>
                        <span className={cn('rounded-full px-1.5 py-0.5 text-[8px] font-bold border', relCfg.bg, relCfg.color, relCfg.border)}>
                          {relCfg.label}
                        </span>
                        <span className="text-[11px] font-bold text-foreground flex-1">{relatedNode.label}</span>
                        <span className="rounded-full px-1.5 py-0.5 text-[8px]" style={{ color: edgeCfg.color, backgroundColor: `${edgeCfg.color}10` }}>
                          {edgeCfg.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1.5">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-md bg-cyan/10 border border-cyan/20 px-3 py-2 text-[11px] font-bold text-cyan hover:bg-cyan/20">
                <Sparkles className="h-3.5 w-3.5" /> 发现新关联
              </button>
              <button className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary/10 border border-primary/20 px-3 py-2 text-[11px] font-bold text-primary hover:bg-primary/20">
                <Compass className="h-3.5 w-3.5" /> 推荐探索路径
              </button>
              <button className="flex w-full items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-[11px] font-bold text-foreground hover:bg-surface-2">
                <Send className="h-3.5 w-3.5" /> 推送至AI助理
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

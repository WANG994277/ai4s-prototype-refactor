'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Search,
  Plus,
  BookOpen,
  Cpu,
  FlaskConical,
  FileCheck,
  Dna,
  FileText,
  Database,
  X,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIInputBar, type ContextTag } from '@/components/agent/ai-input-bar';
import {
  MessageRenderer,
  type RichMessage,
} from '@/components/agent/message-renderer';
import {
  ResearchContextPanel,
  type ResearchContextData,
  type SuggestedQuestion,
} from '@/components/agent/research-context-panel';
import { type ActionButton } from '@/components/agent/research-result-cards';

/* ═══════════════════════════════════════════
   数据 & 类型
   ═══════════════════════════════════════════ */

interface Conversation {
  id: number;
  title: string;
  time: string;
  unread: number;
  active: boolean;
}

const conversations: Conversation[] = [
  { id: 1, title: 'DFT计算结果解读与下一步实验方案', time: '09:17', unread: 12, active: true },
  { id: 2, title: 'Cu/ZrO₂专利风险评估', time: '08:20', unread: 8, active: false },
  { id: 3, title: '生成CO₂加氢文献综述摘要', time: '昨天 16:30', unread: 24, active: false },
  { id: 4, title: '贝叶斯优化实验方案设计', time: '昨天 14:12', unread: 18, active: false },
  { id: 5, title: 'XRD数据异常峰分析', time: '昨天 10:05', unread: 9, active: false },
  { id: 6, title: 'ZrO₂晶相对催化活性影响机制', time: '周三', unread: 31, active: false },
  { id: 7, title: 'PETase蛋白质定向进化策略', time: '周一', unread: 15, active: false },
  { id: 8, title: '催化剂制备方法比较综述', time: '周一', unread: 20, active: false },
  { id: 9, title: 'CO₂加氢制甲醇领域研究空白分析', time: '3天前', unread: 44, active: false },
  { id: 10, title: '发酵过程优化控制策略', time: '3天前', unread: 22, active: false },
];

const sceneTemplates = [
  { label: 'DFT解读', icon: Cpu, prompt: '我的DFT计算刚出结果了: Cu/ZrO₂(111)面上CO₂的吸附能是-2.34 eV，帮我分析这意味着什么以及下一步实验怎么设计' },
  { label: '文献综述', icon: BookOpen, prompt: '帮我围绕CO₂加氢制甲醇领域做一次系统文献综述，覆盖近5年关键进展' },
  { label: 'DOE优化', icon: FlaskConical, prompt: '帮我设计一组DOE实验来优化Cu/ZrO₂催化剂的CO₂加氢效率，使用贝叶斯优化策略' },
  { label: '专利分析', icon: FileCheck, prompt: '帮我分析Cu/ZrO₂催化剂领域的专利布局，识别核心专利和技术空白点' },
  { label: '蛋白质设计', icon: Dna, prompt: '帮我设计PETase蛋白质的定向进化方案，预测关键突变位点' },
  { label: '实验报告', icon: FileText, prompt: '帮我基于最新实验批次的数据生成完整技术报告' },
];

const defaultContextData: ResearchContextData = {
  memory: {
    direction: 'Cu基催化剂CO₂加氢',
    project: 'Cu/ZrO₂体系, 第3轮迭代',
    approach: '贝叶斯优化+DFT验证路线',
    expertise: '催化机理+材料表征',
  },
  tools: [
    { id: 't1', name: '文献库', icon: '文献库', status: 'connected' },
    { id: 't2', name: '计算任务', icon: '计算任务', status: 'running', runningCount: 2 },
    { id: 't3', name: '实验台', icon: '实验台', status: 'connected' },
    { id: 't4', name: '知识图谱', icon: '知识图谱', status: 'connected' },
    { id: 't5', name: '专利库', icon: '专利库', status: 'connected' },
    { id: 't6', name: '蛋白脑DB', icon: '蛋白脑DB', status: 'connected' },
  ],
  taskProgress: {
    title: 'Cu/ZrO₂ 催化剂优化流程',
    totalSteps: 6,
    completedSteps: 3,
    currentStepLabel: '贝叶斯优化模型运行中 · 预计 2 分钟',
    steps: [
      { id: 'p1', label: '文献检索与筛选', subLabel: '47篇', space: 'read', status: 'done' },
      { id: 'p2', label: 'DFT 计算 Cu/ZrO₂(111) 吸附能', subLabel: '-2.34 eV', space: 'compute', status: 'done' },
      { id: 'p3', label: '实验数据对比分析', subLabel: '3条匹配', space: 'compute', status: 'done' },
      { id: 'p4', label: '贝叶斯优化实验方案生成', subLabel: '8组方案', space: 'compute', status: 'running', progress: 68 },
      { id: 'p5', label: '实验验证 (E-06 / E-02)', space: 'do', status: 'pending' },
      { id: 'p6', label: '生成技术报告并推送 ELN', space: 'output', status: 'pending' },
    ],
  },
  stats: { messages: 12, toolCalls: 8, citedPapers: 7, generatedOutputs: 3 },
  suggestions: [
    { id: 's1', text: '帮我生成这次对话的技术备忘录,发给组里同学', tag: '导出', tagColor: '' },
    { id: 's2', text: 'E-06方案的制备步骤帮我生成一份标准操作规程(SOP)', tag: '实验', tagColor: '' },
    { id: 's3', text: '根据吸附能数据,预测450℃焙烧温度会怎样影响结果', tag: '预测', tagColor: '' },
    { id: 's4', text: '帮我检索一下单原子Cu催化剂最新的制备表征方法', tag: '文献', tagColor: '' },
  ],
  contexts: [
    { id: 'c1', label: 'DFT任务 #A2341', detail: '吸附能 -2.34 eV', status: 'active' },
    { id: 'c2', label: 'CO₂加氢项目', detail: '第3轮迭代 · 23条数据', status: 'active' },
  ],
};

const defaultContextTags: ContextTag[] = [
  { id: 'ct1', label: 'DFT任务 #A2341', type: 'task', removable: false },
  { id: 'ct2', label: 'CO₂加氢项目', type: 'project', removable: false },
];

/* ─── 场景消息构建 ─── */

function buildDFTScenarioMessages(): RichMessage[] {
  const now = new Date();
  const t = (m: number, s: number = 0) => {
    const d = new Date(now);
    d.setMinutes(d.getMinutes() - m);
    d.setSeconds(d.getSeconds() - s);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return [
    {
      id: 1,
      role: 'user',
      timestamp: t(5),
      content:
        '我的DFT计算刚出结果了: Cu/ZrO₂(111)面上CO₂的吸附能是-2.34 eV，比文献报道的ZnO体系强了约0.3 eV。你帮我分析一下这意味着什么，以及下一步实验应该怎么设计?',
    },
    {
      id: 2,
      role: 'assistant',
      timestamp: t(4, 50),
      thinking:
        '识别意图：用户需要DFT结果解读 + 实验方案设计。这是「读→算→做」闭环任务。需要检索文献库对比吸附能数据 → 读取用户的DFT计算任务 → 对比内部实验数据库 → 给出物理含义分析 → 设计下一步实验方案。',
      parts: [
        {
          kind: 'steps',
          steps: [
            { id: 's1', text: '检索文献库', detail: '已找到 47 篇相关报道(吸附能对比)', status: 'done' },
            { id: 's2', text: '读取您的DFT计算任务 #A2341', detail: '吸附能 -2.34 eV 已确认', status: 'done' },
            { id: 's3', text: '对比内部实验数据库', detail: '找到 3 条相关催化剂数据', status: 'done' },
          ],
        },
        {
          kind: 'analysis',
          title: '分析结论',
          content:
            '这是个非常重要的结果。-2.34 eV 的吸附能意味着 Cu/ZrO₂(111) 面对 CO₂ 的亲和力显著强于 ZnO 体系，这从理论层面解释了为什么 ZrO₂ 负载的 Cu 催化剂在实验上表现出更高的 CO₂ 转化率。',
          highlight:
            '关键物理含义: 吸附能越负，CO₂ 在表面停留时间越长，有利于后续的加氢步骤。但需要注意过强的吸附 (<-3.0 eV) 反而会导致中间体难以脱附。您当前的值恰好落在"火山型"曲线的最优区间 (-2.0 到 -2.6 eV)。',
        },
        {
          kind: 'table',
          title: '吸附能对比 · 主流体系',
          columns: ['催化剂体系', '吸附能(eV)', '实验转化率', '趋势'],
          highlightLabel: '您的结果高亮',
          rows: [
            {
              label: 'Cu/ZrO₂ ← 您的',
              value: '-2.34',
              secondary: '87.3%',
              isHighlight: true,
              barColor: 'bg-primary',
              barWidth: 87,
            },
            { label: 'Cu/ZnO', value: '-2.02', secondary: '76.1%', barColor: 'bg-cyan', barWidth: 76 },
            { label: 'Cu/Al₂O₃', value: '-1.67', secondary: '58.4%', barColor: 'bg-amber', barWidth: 58 },
            { label: 'Cu/TiO₂', value: '-2.81', secondary: '62.8%', barColor: 'bg-purple', barWidth: 63 },
          ],
        },
        {
          kind: 'actions',
          intro:
            '基于这个结果，我为您设计了下一步实验方案，重点验证两个关键变量：',
          buttons: [
            { id: 'a1', label: '查看贝叶斯实验方案', count: 8, icon: 'experiment' },
            { id: 'a2', label: '推送相关文献', count: 12, icon: 'literature' },
            { id: 'a3', label: '导出到 ELN', icon: 'export' },
            { id: 'a4', label: '生成技术报告', icon: 'report' },
          ],
        },
        {
          kind: 'refs',
          tags: [
            { id: 'r1', label: 'Chen et al., Nature Catal. 2025', type: 'paper' },
            { id: 'r2', label: 'Kim et al., ACS Catal. 2024', type: 'paper' },
            { id: 'r3', label: 'DFT任务 #A2341', type: 'task' },
            { id: 'r4', label: '本观实验数据 3条', type: 'data' },
          ],
        },
      ],
    },
    {
      id: 3,
      role: 'user',
      timestamp: t(3),
      content: '好的，那8组实验方案里，哪两组我应该最优先做？我这周只有时间跑2个样品。',
    },
    {
      id: 4,
      role: 'assistant',
      timestamp: t(2, 30),
      parts: [
        {
          kind: 'steps',
          steps: [
            { id: 's1', text: '运行贝叶斯优化模型', detail: '基于已有 23 条实验数据', status: 'done' },
          ],
        },
        {
          kind: 'priority',
          intro: '根据贝叶斯优化模型的预期增益(EI)排序，强烈建议优先做这两组：',
          recommendations: [
            {
              id: 'p1',
              rank: 1,
              title: '方案 E-06',
              subtitle: 'Cu负载量 15wt%, 焙烧 450℃, Sn:Pt=1.0 — 预测转化率最高',
              metrics: [
                { label: 'EI', value: '0.82' },
                { label: '预测转化率', value: '89.2±1.5%' },
                { label: '置信度', value: '92%' },
              ],
              highlight: true,
            },
            {
              id: 'p2',
              rank: 2,
              title: '方案 E-02',
              subtitle: 'Cu负载量 12wt%, 焙烧 500℃, 还原气氛 H₂/N₂ — 探索性较高',
              metrics: [
                { label: 'EI', value: '0.68' },
                { label: '预测转化率', value: '85.7±2.1%' },
                { label: '置信度', value: '87%' },
              ],
            },
          ],
        },
      ],
    },
  ];
}

function buildGenericScenarioMessages(userText: string): RichMessage[] {
  const now = new Date();
  const t = (m: number, s: number = 0) => {
    const d = new Date(now);
    d.setMinutes(d.getMinutes() - m);
    d.setSeconds(d.getSeconds() - s);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return [
    {
      id: 1,
      role: 'user',
      timestamp: t(1),
      content: userText,
    },
    {
      id: 2,
      role: 'assistant',
      timestamp: t(0, 30),
      thinking: '识别用户意图，判断需要调度的工具空间和执行步骤。',
      parts: [
        {
          kind: 'steps',
          steps: [
            { id: 's1', text: '分析您的请求', detail: '识别研究意图和所需工具', status: 'done' },
            { id: 's2', text: '检索相关文献库', detail: '匹配研究方向', status: 'running' },
          ],
        },
        {
          kind: 'analysis',
          content:
            '我已收到您的研究请求，正在为您检索相关文献和数据。完成后将给出详细分析和建议方案。\n\n您可以继续在下方输入框中补充更多细节，或选择上方的场景模板快速启动一个科研闭环任务。',
        },
      ],
    },
  ];
}

/* ═══════════════════════════════════════════
   全局科研助理浮动面板
   ═══════════════════════════════════════════ */

export function ResearchAssistantPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [selectedConv, setSelectedConv] = useState(1);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<RichMessage[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [contextTags, setContextTags] = useState<ContextTag[]>(defaultContextTags);
  const [hasInitiated, setHasInitiated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      if (!hasInitiated) {
        const isDFTScenario = text.includes('DFT') || text.includes('吸附能') || text.includes('dft');
        const scenarioMessages = isDFTScenario
          ? buildDFTScenarioMessages()
          : buildGenericScenarioMessages(text);

        // First user message in scenario already contains the text
        if (isDFTScenario) {
          setMessages(scenarioMessages);
        } else {
          setMessages(scenarioMessages);
        }
        setHasInitiated(true);
        return;
      }

      const userMsg: RichMessage = {
        id: Date.now(),
        role: 'user',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        content: text,
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsStreaming(true);
      setStreamingText('');

      const streamText =
        '根据您的描述，我正在为您分析相关数据并生成建议方案。请稍候...';
      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex += 2;
        if (charIndex >= streamText.length) {
          clearInterval(interval);
          setIsStreaming(false);
          setStreamingText('');
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: 'assistant',
              timestamp: new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              parts: [
                {
                  kind: 'analysis',
                  content: streamText,
                },
              ],
            },
          ]);
        } else {
          setStreamingText(streamText.slice(0, charIndex));
        }
      }, 30);
    },
    [hasInitiated]
  );

  const handleConfirmChoice = useCallback((value: string) => {
    const userMsg: RichMessage = {
      id: Date.now(),
      role: 'user',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content: `确认选择: ${value}`,
    };
    setMessages((prev) => [...prev, userMsg]);
  }, []);

  const handleAction = useCallback((_btn: ActionButton) => {
    // no-op for demo
  }, []);

  const handleRemoveTag = useCallback((tagId: string) => {
    setContextTags((prev) => prev.filter((t) => t.id !== tagId));
  }, []);

  const handleSuggestionSelect = useCallback((q: SuggestedQuestion) => {
    handleSend(q.text);
  }, [handleSend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // 支持全局唤起：Banner 输入框 / 快捷指令通过自定义事件打开面板并直接提问
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setShowPanel(true);
      if (detail?.message) handleSend(detail.message);
    };
    window.addEventListener('petrolab:open-assistant', handler);
    return () => window.removeEventListener('petrolab:open-assistant', handler);
  }, [handleSend]);

  return (
    <>
      {/* 浮动按钮 */}
      {!showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_rgba(29,95,214,0.35)] transition-all hover:scale-105 hover:shadow-[0_6px_24px_rgba(29,95,214,0.45)]"
        >
          <Bot className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {conversations.reduce((sum, c) => sum + c.unread, 0)}
          </span>
        </button>
      )}

      {/* 面板主体 */}
      {showPanel && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[calc(100vh-49px)] w-[720px] flex-col border-l border-line bg-white shadow-[-4px_0_24px_rgba(16,38,79,0.08)]">
          {/* 面板头部 */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h1 className="text-[13px] font-black leading-none text-navy">科研助理</h1>
              <div className="flex items-center gap-1 ml-2">
                {[
                  { label: '做空间', href: '/experiment-design', icon: FlaskConical, color: 'text-green-600' },
                  { label: '算空间', href: '/compute-tasks', icon: Cpu, color: 'text-cyan' },
                  { label: '读空间', href: '/literature-search', icon: BookOpen, color: 'text-blue-600' },
                ].map((space) => {
                  const SpaceIcon = space.icon;
                  return (
                    <Link
                      key={space.label}
                      href={space.href}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-faint transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <SpaceIcon className={cn('h-2.5 w-2.5', space.color)} />
                      {space.label}
                    </Link>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-line">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-600">在线</span>
              </div>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 面板主体：会话列表 + 消息区 + 上下文 */}
          <div className="flex flex-1 min-h-0">
            {/* 会话列表 */}
            <div className="flex w-[180px] shrink-0 flex-col border-r border-line bg-white">
              <div className="p-2 space-y-1.5">
                <button
                  onClick={() => {
                    setMessages([]);
                    setHasInitiated(false);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-primary/90"
                >
                  <Plus className="h-3 w-3" />
                  新建对话
                </button>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-faint" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索对话"
                    className="w-full rounded-md border border-line bg-surface-2 py-1 pl-6 pr-2 text-[10px] text-foreground placeholder:text-faint focus:border-primary/40 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-1 pb-2">
                {filteredConversations.length === 0 && (
                  <div className="px-3 py-4 text-center text-[10px] text-faint">未找到匹配的对话</div>
                )}
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv.id)}
                    className={cn(
                      'mb-0.5 flex w-full items-start gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors',
                      selectedConv === conv.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-surface-2'
                    )}
                  >
                    <Bot className="mt-0.5 h-3 w-3 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-medium leading-snug">{conv.title}</p>
                      <p className="mt-0.5 text-[9px] text-faint">{conv.time}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-1 py-0.5 text-[8px] font-bold leading-none',
                          selectedConv === conv.id
                            ? 'bg-primary text-white'
                            : 'bg-red-100 text-red-600'
                        )}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 主工作区 */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* 消息区 */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="mx-auto max-w-2xl space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Sparkles className="h-7 w-7 text-primary" />
                      </div>
                      <h2 className="text-lg font-black text-navy">科研助理</h2>
                      <p className="mt-1 max-w-md text-[12px] leading-relaxed text-muted-foreground">
                        我是您的 AI 科研助理。我能理解复杂研究意图，自动拆解任务，
                        调度「读·算·做」三空间工具协同执行，在关键节点等待您的决策。
                      </p>
                      <div className="mt-5 grid max-w-md grid-cols-3 gap-2">
                        {[
                          { label: '读', desc: '文献检索\n知识提取', color: 'border-blue-200 bg-blue-50 text-blue-700' },
                          { label: '算', desc: '分子模拟\n代理模型', color: 'border-cyan/30 bg-cyan/10 text-cyan' },
                          { label: '做', desc: '实验设计\n数据分析', color: 'border-green-200 bg-green-50 text-green-700' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={cn('rounded-lg border px-3 py-2.5 text-center', item.color)}
                          >
                            <div className="text-base font-black">{item.label}</div>
                            <div className="mt-0.5 whitespace-pre-line text-[9px] leading-snug opacity-70">
                              {item.desc}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase text-faint tracking-wider">场景模板</span>
                        {sceneTemplates.map((scene) => {
                          const SceneIcon = scene.icon;
                          return (
                            <button
                              key={scene.label}
                              onClick={() => handleSend(scene.prompt)}
                              className="flex items-center gap-1 rounded-full border border-line bg-white px-2 py-0.5 text-[9px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            >
                              <SceneIcon className="h-2.5 w-2.5" />
                              {scene.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <MessageRenderer
                      key={msg.id}
                      message={msg}
                      onConfirmChoice={handleConfirmChoice}
                      onAction={handleAction}
                    />
                  ))}

                  {isStreaming && streamingText && (
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan/10 text-cyan">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="max-w-[82%]">
                        <div className="rounded-lg border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-foreground">
                          <span className="whitespace-pre-wrap">{streamingText}</span>
                          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-cyan align-middle" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* 输入区 */}
              <AIInputBar
                onSend={handleSend}
                contextTags={contextTags}
                onRemoveTag={handleRemoveTag}
              />
            </div>

            {/* 科研上下文面板 */}
            {showContextPanel && (
              <div className="flex w-[240px] shrink-0 flex-col border-l border-line bg-white">
                <div className="flex items-center justify-between border-b border-line px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-bold text-navy">科研上下文</span>
                  </div>
                  <button
                    onClick={() => setShowContextPanel(false)}
                    className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2"
                  >
                    <PanelRightClose className="h-3 w-3" />
                  </button>
                </div>
                <ResearchContextPanel
                  data={defaultContextData}
                  onSuggestionSelect={handleSuggestionSelect}
                  className="flex-1 min-h-0"
                />
              </div>
            )}

            {!showContextPanel && (
              <button
                onClick={() => setShowContextPanel(true)}
                className="flex h-16 w-5 items-center justify-center rounded-l-md border border-r-0 border-line bg-white text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <PanelRightOpen className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

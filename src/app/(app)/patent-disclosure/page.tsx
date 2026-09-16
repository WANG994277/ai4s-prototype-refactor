'use client';

import React, { useState } from 'react';
import {
  ArrowLeft, FileText, Sparkles, Download, Edit3, Plus, Trash2,
  CheckCircle2, AlertTriangle, Shield, ChevronRight, Save, RotateCcw,
  BookOpen, Lightbulb, Search, Target
} from 'lucide-react';
import Link from 'next/link';

type Step = 'input' | 'generating' | 'result' | 'review';

interface DisclosureSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

const defaultSections: DisclosureSection[] = [
  { id: 'field', title: '技术领域', content: '', editable: true },
  { id: 'background', title: '背景技术', content: '', editable: true },
  { id: 'problem', title: '技术问题', content: '', editable: true },
  { id: 'solution', title: '技术方案', content: '', editable: true },
  { id: 'effect', title: '有益效果', content: '', editable: true },
  { id: 'implementation', title: '具体实施方式', content: '', editable: true },
  { id: 'claims', title: '权利要求', content: '', editable: true },
];

const mockGenerated: DisclosureSection[] = [
  {
    id: 'field', title: '技术领域', editable: true,
    content: '本发明涉及石油化工催化技术领域，具体涉及一种磷改性Ni-Mo/Al₂O₃加氢脱硫催化剂及其制备方法。'
  },
  {
    id: 'background', title: '背景技术', editable: true,
    content: '随着环保法规日趋严格，燃料油中硫含量的限值不断降低。目前国VI标准要求汽油中硫含量不超过10ppm，柴油中硫含量不超过10ppm。传统的Co-Mo/Al₂O₃和Ni-Mo/Al₂O₃催化剂在深度脱硫方面仍面临挑战，特别是对4,6-二甲基二苯并噻吩（4,6-DMDBT）等位阻大的含硫化合物脱除效率较低。\n\n现有技术中，磷改性被用于改善催化剂的加氢脱硫活性，但磷添加量与活性之间的关系尚不明确，且磷的引入方式对催化剂性能的影响缺乏系统性研究。'
  },
  {
    id: 'problem', title: '技术问题', editable: true,
    content: '本发明要解决的技术问题是：提供一种磷改性Ni-Mo/Al₂O₃加氢脱硫催化剂及其制备方法，通过优化磷钼比（P/Mo），显著提高催化剂的加氢脱硫活性，特别是对位阻大的含硫化合物的脱除能力。'
  },
  {
    id: 'solution', title: '技术方案', editable: true,
    content: '为解决上述技术问题，本发明提供如下技术方案：\n\n一种磷改性Ni-Mo/Al₂O₃加氢脱硫催化剂的制备方法，包括以下步骤：\n\n1）载体预处理：将γ-Al₂O₃载体在500-600°C下焙烧4-6h，得到预处理载体；\n\n2）浸渍液配制：以Ni(NO₃)₂为镍源、(NH₄)₆Mo₇O₂₄为钼源、(NH₄)₂HPO₄为磷源，配制含Ni、Mo、P的混合浸渍液，其中P/Mo摩尔比为0.3-0.7，优选0.5；NiO含量为3-8wt%，MoO₃含量为10-25wt%；\n\n3）等体积浸渍：将步骤1）的预处理载体与步骤2）的浸渍液按等体积浸渍法混合，静置12-24h；\n\n4）干燥焙烧：将浸渍后样品在100-120°C下干燥8-16h，然后在450-550°C下焙烧3-5h，得到催化剂前驱体；\n\n5）预硫化：将催化剂前驱体在含2-5wt% CS₂的环己烷溶液中，于350-420°C下硫化3-5h，得到磷改性Ni-Mo/Al₂O₃催化剂。'
  },
  {
    id: 'effect', title: '有益效果', editable: true,
    content: '与现有技术相比，本发明具有以下有益效果：\n\n1）通过优化P/Mo比为0.5，催化剂的DBT转化率达到98.3%，较未改性催化剂提高了23.1%；\n\n2）磷的引入显著改变了加氢脱硫路径的选择性，HYD路径选择性从31.7%提升至51.3%，有利于深度脱硫；\n\n3）磷促进了MoS₂活性相的分散，MoS₂片层长度从5.8nm减少至3.9nm，堆叠层数从2.1增加至3.8，Type II活性位点数量显著增加；\n\n4）适量磷的引入改善了载体的孔结构，比表面积从186 m²/g增加至205 m²/g，孔容从0.45增加至0.52 cm³/g；\n\n5）本发明制备方法操作简便，条件温和，易于工业化放大。'
  },
  {
    id: 'implementation', title: '具体实施方式', editable: true,
    content: '下面结合具体实施例对本发明作进一步详细说明。\n\n实施例1：P/Mo=0.5的磷改性Ni-Mo/Al₂O₃催化剂\n\n称取100g γ-Al₂O₃载体，在550°C下焙烧5h。按NiO含量5wt%、MoO₃含量15wt%、P/Mo摩尔比0.5配制浸渍液。将浸渍液与载体按等体积浸渍法混合，静置18h后，在110°C下干燥12h，500°C焙烧4h。预硫化条件：含3wt% CS₂的环己烷溶液，400°C硫化4h。\n\n所得催化剂在固定床反应器中进行活性评价：反应温度360°C，压力4 MPa，LHSV=2h⁻¹，H₂/油=500。DBT转化率达到98.3%。\n\n对比例1：未添加磷的Ni-Mo/Al₂O₃催化剂\n\n除不添加磷源外，其余条件同实施例1。DBT转化率为75.2%。\n\n对比例2：P/Mo=1.0的磷改性Ni-Mo/Al₂O₃催化剂\n\n除P/Mo摩尔比为1.0外，其余条件同实施例1。DBT转化率为87.2%，活性较实施例1下降，说明过量磷不利于催化剂活性。'
  },
  {
    id: 'claims', title: '权利要求', editable: true,
    content: '1. 一种磷改性Ni-Mo/Al₂O₃加氢脱硫催化剂的制备方法，其特征在于，包括以下步骤：将γ-Al₂O₃载体预处理后，采用等体积浸渍法浸渍含Ni、Mo、P的混合溶液，其中P/Mo摩尔比为0.3-0.7，经干燥、焙烧和预硫化后得到催化剂。\n\n2. 根据权利要求1所述的制备方法，其特征在于，P/Mo摩尔比为0.5。\n\n3. 根据权利要求1所述的制备方法，其特征在于，NiO含量为3-8wt%，MoO₃含量为10-25wt%。\n\n4. 根据权利要求1所述的制备方法，其特征在于，焙烧温度为450-550°C，焙烧时间为3-5h。\n\n5. 根据权利要求1所述的制备方法，其特征在于，预硫化采用含2-5wt% CS₂的环己烷溶液，在350-420°C下硫化3-5h。\n\n6. 一种按照权利要求1-5任一所述方法制备的磷改性Ni-Mo/Al₂O₃加氢脱硫催化剂。\n\n7. 根据权利要求6所述的催化剂在柴油深度加氢脱硫中的应用。'
  },
];

/* Mock gap analysis */
const mockGapAnalysis = [
  { gap: 'P/Mo比精确控制方法', covered: true, match: '权利要求1-2' },
  { gap: '预硫化条件优化', covered: true, match: '权利要求5' },
  { gap: '工业放大条件', covered: false, match: '—' },
  { gap: '4,6-DMDBT脱除验证', covered: false, match: '—' },
  { gap: '催化剂再生方法', covered: false, match: '—' },
];

export default function PatentDisclosurePage() {
  const [step, setStep] = useState<Step>('input');
  const [sections, setSections] = useState<DisclosureSection[]>(defaultSections);
  const [template, setTemplate] = useState<'general' | 'catalyst'>('catalyst');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [techField, setTechField] = useState('加氢脱硫催化剂');
  const [techProblem, setTechProblem] = useState('现有Ni-Mo/Al₂O₃催化剂对位阻大的含硫化合物脱除效率低');
  const [techSolution, setTechSolution] = useState('通过磷改性Ni-Mo/Al₂O₃催化剂，优化P/Mo比为0.5，显著提升加氢脱硫活性');
  const [showGapReview, setShowGapReview] = useState(false);

  const handleGenerate = () => {
    setStep('generating');
    setTimeout(() => {
      setSections(mockGenerated);
      setStep('result');
    }, 3000);
  };

  const handleStartEdit = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSection(sectionId);
      setEditContent(section.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingSection) {
      setSections(prev => prev.map(s => s.id === editingSection ? { ...s, content: editContent } : s));
      setEditingSection(null);
    }
  };

  const handleExport = () => {
    const content = sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '专利交底书.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[var(--color-surface)] border-b border-[var(--color-line)]">
        <div className="max-w-[1000px] mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/patent-analysis" className="flex items-center gap-1 text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] transition-colors">
            <ArrowLeft className="w-4 h-4" />返回专利分析
          </Link>
          <div className="flex-1" />
          <span className="text-[14px] font-bold text-[var(--color-text)]">专利交底书生成</span>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-6">
        {/* Step: Input */}
        {step === 'input' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
              <h3 className="text-[15px] font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--color-blue)]" />填写技术思路
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1.5">技术领域</label>
                  <input className="w-full px-3 py-2.5 text-[14px] rounded-lg border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-blue)] bg-[var(--color-surface)]" value={techField} onChange={e => setTechField(e.target.value)} placeholder="如：加氢脱硫催化剂、分子筛合成、催化裂化..." />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1.5">技术问题（现有技术的不足）</label>
                  <textarea className="w-full px-3 py-2.5 text-[14px] rounded-lg border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-blue)] min-h-[80px] bg-[var(--color-surface)]" value={techProblem} onChange={e => setTechProblem(e.target.value)} placeholder="描述现有技术存在的问题和不足..." />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1.5">技术方案（核心创新点）</label>
                  <textarea className="w-full px-3 py-2.5 text-[14px] rounded-lg border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-blue)] min-h-[120px] bg-[var(--color-surface)]" value={techSolution} onChange={e => setTechSolution(e.target.value)} placeholder="描述你的技术方案、创新点和关键参数..." />
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
              <h3 className="text-[15px] font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--color-blue)]" />选择交底书模板
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className={`p-4 rounded-lg border-2 text-left transition-colors ${template === 'general' ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5' : 'border-[var(--color-line)] hover:border-[var(--color-blue)]/30'}`} onClick={() => setTemplate('general')}>
                  <div className="text-[14px] font-bold text-[var(--color-text)] mb-1">通用专利交底书模板</div>
                  <div className="text-[12px] text-[var(--color-muted-foreground)]">适用于一般发明创造，包含技术领域/背景/方案/实施方式/权利要求7个标准章节</div>
                </button>
                <button className={`p-4 rounded-lg border-2 text-left transition-colors ${template === 'catalyst' ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5' : 'border-[var(--color-line)] hover:border-[var(--color-blue)]/30'}`} onClick={() => setTemplate('catalyst')}>
                  <div className="text-[14px] font-bold text-[var(--color-text)] mb-1">催化剂领域专用模板</div>
                  <div className="text-[12px] text-[var(--color-muted-foreground)]">针对催化剂发明优化，增加制备方法/活性评价/表征数据/对比例等章节</div>
                  <span className="inline-block mt-1.5 rounded-full bg-[var(--color-blue)]/10 px-2 py-0.5 text-[11px] text-[var(--color-blue)] font-medium">推荐</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="px-6 py-2.5 rounded-lg text-[14px] bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue)]/90 flex items-center gap-2" onClick={handleGenerate}>
                <Sparkles className="w-4 h-4" />生成交底书
              </button>
            </div>
          </div>
        )}

        {/* Step: Generating */}
        {step === 'generating' && (
          <div className="rounded-xl border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 p-12 text-center">
            <div className="animate-pulse">
              <Sparkles className="w-10 h-10 text-[var(--color-blue)] mx-auto mb-4" />
              <h3 className="text-[16px] font-bold text-[var(--color-blue)] mb-2">正在生成专利交底书...</h3>
              <div className="space-y-2 text-[13px] text-[var(--color-muted-foreground)]">
                <p>✓ 分析技术方案创新点</p>
                <p>✓ 检索相关专利文献</p>
                <p className="animate-pulse">● 生成各章节内容...</p>
                <p>○ 权利要求自动撰写</p>
                <p>○ 空白方向复核</p>
              </div>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && (
          <div className="space-y-4">
            {/* Action bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-green)]" />
                <span className="text-[14px] font-bold text-[var(--color-text)]">交底书已生成</span>
                <span className="text-[12px] text-[var(--color-muted-foreground)]">共{sections.length}个章节，点击章节标题可编辑</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-[13px] border border-[var(--color-line)] text-[var(--color-muted-foreground)] hover:border-[var(--color-blue)]/30 hover:text-[var(--color-blue)] flex items-center gap-1.5" onClick={() => { setStep('input'); setSections(defaultSections); }}>
                  <RotateCcw className="w-3.5 h-3.5" />重新生成
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[13px] border border-[var(--color-amber)]/30 text-[var(--color-amber)] hover:bg-[var(--color-amber)]/5 flex items-center gap-1.5" onClick={() => setShowGapReview(true)}>
                  <Target className="w-3.5 h-3.5" />空白方向复核
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[13px] bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue)]/90 flex items-center gap-1.5" onClick={handleExport}>
                  <Download className="w-3.5 h-3.5" />导出文件
                </button>
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, idx) => (
              <div key={section.id} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--color-line)] flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface-2)]" onClick={() => editingSection === section.id ? null : handleStartEdit(section.id)}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)] text-[12px] font-bold flex items-center justify-center">{idx + 1}</span>
                    <span className="text-[14px] font-bold text-[var(--color-text)]">{section.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingSection === section.id ? (
                      <>
                        <button className="text-[12px] text-[var(--color-muted-foreground)] hover:text-[var(--color-text)]" onClick={e => { e.stopPropagation(); setEditingSection(null); }}>取消</button>
                        <button className="text-[12px] text-[var(--color-blue)] font-bold" onClick={e => { e.stopPropagation(); handleSaveEdit(); }}>保存</button>
                      </>
                    ) : (
                      <Edit3 className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                    )}
                  </div>
                </div>
                <div className="px-5 py-4">
                  {editingSection === section.id ? (
                    <textarea className="w-full px-3 py-2 text-[14px] rounded-lg border border-[var(--color-blue)] focus:outline-none min-h-[200px] bg-[var(--color-surface)] leading-relaxed" value={editContent} onChange={e => setEditContent(e.target.value)} />
                  ) : (
                    <div className="text-[14px] text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">{section.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gap Review Modal */}
        {showGapReview && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowGapReview(false)}>
            <div className="bg-[var(--color-surface)] rounded-xl shadow-lg w-[600px] p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2"><Target className="w-5 h-5 text-[var(--color-amber)]" />空白方向复核</h3>
                <button onClick={() => setShowGapReview(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-text)]">×</button>
              </div>
              <p className="text-[13px] text-[var(--color-muted-foreground)] mb-4">将生成的交底书与专利空白方向分析结果进行对比，检查是否覆盖了可布局方向。</p>
              <div className="space-y-2">
                {mockGapAnalysis.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${item.covered ? 'border-[var(--color-green)]/20 bg-[var(--color-green)]/5' : 'border-[var(--color-amber)]/20 bg-[var(--color-amber)]/5'}`}>
                    {item.covered ? <CheckCircle2 className="w-4 h-4 text-[var(--color-green)] shrink-0" /> : <AlertTriangle className="w-4 h-4 text-[var(--color-amber)] shrink-0" />}
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-[var(--color-text)]">{item.gap}</div>
                      <div className="text-[11px] text-[var(--color-muted-foreground)]">{item.covered ? `已覆盖 → ${item.match}` : '未覆盖，建议补充'}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${item.covered ? 'bg-[var(--color-green)]/10 text-[var(--color-green)]' : 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]'}`}>{item.covered ? '已覆盖' : '待补充'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[var(--color-surface-2)] text-[12px] text-[var(--color-muted-foreground)]">
                <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-[var(--color-amber)]" />
                复核结果：7个空白方向中已覆盖2个，5个未覆盖。建议在「具体实施方式」中补充工业放大条件和4,6-DMDBT评价数据。
              </div>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 rounded-lg text-[13px] bg-[var(--color-blue)] text-white" onClick={() => setShowGapReview(false)}>确认</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

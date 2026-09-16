'use client'

import { useState } from 'react'
import {
  Bold, Italic, List, ListOrdered, Link2, Image, Table, Code, Quote,
  Undo, Redo, Save, Download, FileText, BookOpen, Sparkles, Shield, CheckCircle2,
  ChevronRight, ChevronDown, Search, Plus, X, Eye, Edit3, FileCode,
  MessageSquare, AlertTriangle, AlertCircle, Info, ChevronLeft, Star, ArrowRight,
  Copy, Palette, SpellCheck, Zap, Target, Upload
} from 'lucide-react'

// --- Mock Data ---
const MOCK_SECTIONS = [
  { id: 's1', title: '1. 引言', type: 'heading', level: 1, content: '' },
  { id: 's2', title: '1.1 研究背景', type: 'heading', level: 2, content: '' },
  { id: 's3', title: '', type: 'paragraph', level: 0, content: '分子筛催化剂在石油化工领域扮演着至关重要的角色，尤其在催化裂化、加氢裂化和甲醇制烯烃（MTO）等核心工艺中。然而，传统分子筛催化剂面临着活性中心利用率低、传质限制和稳定性不足等挑战。近年来，多级孔分子筛的设计与合成成为突破这些瓶颈的关键策略[1,2]。' },
  { id: 's4', title: '1.2 国内外研究现状', type: 'heading', level: 2, content: '' },
  { id: 's5', title: '', type: 'paragraph', level: 0, content: '目前，多级孔分子筛的合成策略主要包括硬模板法、软模板法和后处理脱硅法三类。Chen等[3]报道了一种原子级分散Zn物种在Silicalite-1上的新方法，实现了丙烷脱氢性能的重大突破。Liu等[4]对多级孔ZSM-5的合成策略进行了系统综述。在MTO反应领域，Park等[5]利用原位XAFS技术揭示了Cu-SAPO-34中Cu物种的动态演变机制。' },
  { id: 's6', title: '2. 实验方法', type: 'heading', level: 1, content: '' },
  { id: 's7', title: '2.1 催化剂制备', type: 'heading', level: 2, content: '' },
  { id: 's8', title: '', type: 'paragraph', level: 0, content: '采用水热合成法制备SAPO-34分子筛，以三乙胺（TEA）为模板剂。将铝源、磷源和硅源按一定比例混合，在200°C下晶化48小时。所得产物经洗涤、干燥后，在550°C下焙烧6小时脱除模板剂。' },
  { id: 's9', title: '2.2 表征方法', type: 'heading', level: 2, content: '' },
  { id: 's10', title: '', type: 'paragraph', level: 0, content: 'XRD表征使用Rigaku D/MAX-2500衍射仪，Cu Kα辐射（λ=1.5406 Å），扫描范围5-50°。N₂吸附脱附在Micromeritics ASAP 2020上于-196°C进行。NH₃-TPD在AutoChem II 2920上完成，He气氛下从100°C程序升温至600°C。' },
  { id: 's11', title: '3. 结果与讨论', type: 'heading', level: 1, content: '' },
  { id: 's12', title: '3.1 结构表征', type: 'heading', level: 2, content: '' },
  { id: 's13', title: '', type: 'paragraph', level: 0, content: 'XRD谱图表明，所有样品均具有典型的CHA拓扑结构特征衍射峰，未见杂晶。N₂吸附结果显示，介孔改性后的SAPO-34介孔比表面积从32 m²/g增加至98 m²/g，介孔孔容从0.08 cm³/g增加至0.25 cm³/g。' },
  { id: 's14', title: '4. 结论', type: 'heading', level: 1, content: '' },
  { id: 's15', title: '', type: 'paragraph', level: 0, content: '本研究成功制备了具有多级孔结构的SAPO-34分子筛催化剂。介孔的引入显著改善了传质性能，在MTO反应中表现出更长的催化寿命和更高的轻烯烃选择性。' },
]

const MOCK_REFERENCES = [
  { id: 1, key: 'Chen2025atomically', text: 'Chen Y, Wang L, Zhang X, et al. Atomically Dispersed Zn on Silicalite-1 for Propane Dehydrogenation. Nature Catalysis, 2025.' },
  { id: 2, key: 'Liu2024hierarchical', text: 'Liu H, Zhang M, Chen Y, et al. Hierarchical ZSM-5 Zeolites: Synthesis Strategies and Catalytic Applications. Chemical Reviews, 2024.' },
  { id: 3, key: 'Park2025situ', text: 'Park J, Kim S, Lee D. In Situ XAFS Study of Cu Species in Cu-SAPO-34 during MTO Reaction. Journal of Catalysis, 2025.' },
  { id: 4, key: 'Wang2024co2', text: 'Wang R, Li X, Zhao Y, et al. CO₂ Hydrogenation to Methanol over ZrO₂-Supported Catalysts. Applied Catalysis B, 2024.' },
  { id: 5, key: 'Groen2024desilication', text: 'Groen JC, Bach T, Ziese M. Desilication of Zeolite Beta: Optimizing Mesoporosity. Microporous and Mesoporous Materials, 2024.' },
]

const MOCK_POLISH_RESULTS = [
  { original: '分子筛催化剂在石油化工领域扮演着至关重要的角色', polished: '分子筛催化剂在石油化工领域发挥着不可或缺的关键作用', type: '用词升级' },
  { original: '传统分子筛催化剂面临着活性中心利用率低、传质限制和稳定性不足等挑战', polished: '传统分子筛催化剂长期受限于活性中心利用效率偏低、传质扩散受限以及水热稳定性不足等关键瓶颈', type: '句式优化' },
  { original: '近年来，多级孔分子筛的设计与合成成为突破这些瓶颈的关键策略', polished: '近年来，多级孔分子筛的理性设计与可控合成已被视为突破上述瓶颈的核心策略', type: '学术风格' },
  { original: '在MTO反应领域', polished: '在甲醇制烯烃（MTO）反应领域', type: '术语规范' },
]

const MOCK_REVIEW_ISSUES = [
  { severity: 'error', category: '引用完整性', message: '正文引用[2]在参考文献列表中未找到对应条目', location: '1.1 研究背景' },
  { severity: 'error', category: '引用格式', message: '引用[3]和[4]的期刊缩写格式不统一', location: '1.2 国内外研究现状' },
  { severity: 'warning', category: '术语一致性', message: '全文中"分子筛"与"沸石"交替使用，建议统一', location: '全文' },
  { severity: 'warning', category: '缩写检查', message: '"MTO"首次出现已定义，但"TPD"首次出现在2.2节未定义', location: '2.2 表征方法' },
  { severity: 'warning', category: '数字/单位', message: '温度表述"200°C"与"550 °C"空格不一致', location: '2.1 催化剂制备' },
  { severity: 'info', category: '逻辑连贯性', message: '3.1节讨论了结构表征结果，但缺少与1.2节研究现状的呼应', location: '3.1 结构表征' },
  { severity: 'info', category: '图表交叉引用', message: '文中提到"图1"和"表1"，但未在文档中插入对应图表', location: '3.1 结构表征' },
]

const MOCK_PRETREVIEW = {
  scores: { innovation: 72, methodology: 68, data: 75, writing: 80, impact: 65 },
  decision: 'Major Revision',
  majorConcerns: [
    '创新性有限：多级孔SAPO-34的制备方法已有大量报道，本文未充分说明与已有方法的本质区别和创新点。建议在引言中更清晰地定位研究空白。',
    '方法学审查：表征方法不够全面，缺少CO₂-TPD表征酸性分布，建议补充原位红外光谱数据以验证酸中心的性质变化。',
    '数据呈现：缺少误差线和重复性数据，图1中的XRD谱图未标注晶面指数。',
  ],
  minorConcerns: [
    '摘要中应明确说明催化性能提升的量化指标。',
    '参考文献格式不统一，需按目标期刊要求调整。',
    '结论部分过于简短，未对研究局限性进行讨论。',
  ],
}

export default function PaperWritingPage() {
  const [editMode, setEditMode] = useState<'richtext' | 'latex'>('richtext')
  const [activeRightTab, setActiveRightTab] = useState<'ai' | 'cite' | 'polish' | 'review' | 'pretreview'>('ai')
  const [activeLeftTab, setActiveLeftTab] = useState<'outline' | 'references'>('outline')
  const [showCiteSearch, setShowCiteSearch] = useState(false)
  const [citeSearchQuery, setCiteSearchQuery] = useState('')
  const [polishMode, setPolishMode] = useState(false)
  const [showPretreviewPanel, setShowPretreviewPanel] = useState(false)
  const [bibStyle, setBibStyle] = useState('GB/T 7714')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['s1', 's6', 's11', 's14']))
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const toggleSection = (id: string) => {
    setExpandedSections(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <div className="flex h-full">
      {/* Left: Outline + References */}
      <div className="w-56 border-r border-[var(--color-line)] bg-[var(--color-surface)] flex flex-col shrink-0">
        <div className="flex border-b border-[var(--color-line)]">
          {([['outline', '大纲'], ['references', '参考文献']] as const).map(([key, label]) => (
            <button
              key={key}
              className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeLeftTab === key ? 'border-[var(--color-blue)] text-[var(--color-blue)]' : 'border-transparent text-[var(--color-muted-foreground)]'
              }`}
              onClick={() => setActiveLeftTab(key)}
            >
              {label}
              {key === 'references' && <span className="ml-1 text-[9px]">({MOCK_REFERENCES.length})</span>}
            </button>
          ))}
        </div>

        {activeLeftTab === 'outline' && (
          <div className="flex-1 overflow-y-auto p-2">
            {MOCK_SECTIONS.filter(s => s.type === 'heading').map(section => (
              <button
                key={section.id}
                className={`w-full flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-[var(--color-surface-2)] transition-colors ${
                  section.level === 1 ? 'font-bold text-[var(--color-text)]' : 'font-medium text-[var(--color-muted-foreground)] pl-5'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                {section.level === 1 && (expandedSections.has(section.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
                <span className="truncate">{section.title}</span>
              </button>
            ))}
            <button className="w-full flex items-center gap-1 px-2 py-1.5 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] transition-colors mt-1">
              <Plus className="w-3 h-3" />添加章节
            </button>
          </div>
        )}

        {activeLeftTab === 'references' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-faint)]" />
                <input
                  className="w-full pl-7 pr-2 py-1.5 text-[11px] rounded border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-blue)]"
                  placeholder="搜索论文库插入引用..."
                  value={citeSearchQuery}
                  onChange={e => setCiteSearchQuery(e.target.value)}
                />
              </div>
              {MOCK_REFERENCES.map(ref => (
                <div key={ref.id} className="px-2 py-2 rounded hover:bg-[var(--color-surface-2)] cursor-pointer group transition-colors mb-1">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[10px] text-[var(--color-blue)] font-bold mt-0.5">[{ref.id}]</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-[var(--color-text)] leading-relaxed line-clamp-3">{ref.text}</div>
                      <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-1.5 py-0.5 rounded text-[9px] bg-[var(--color-blue)] text-white">插入</button>
                        <button className="px-1.5 py-0.5 rounded text-[9px] border border-[var(--color-line)] text-[var(--color-muted-foreground)]">查看</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-[var(--color-line)]">
              <button className="w-full px-3 py-2 rounded text-xs bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3.5 h-3.5" />从论文库添加引用
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Middle: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Toolbar */}
        <div className="px-4 py-2 border-b border-[var(--color-line)] bg-[var(--color-surface)] flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-0.5 mr-2">
            <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Undo className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Redo className="w-4 h-4" /></button>
          </div>
          <div className="h-4 w-px bg-[var(--color-line)]" />
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Bold className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Italic className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-[var(--color-line)]" />
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><List className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><ListOrdered className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-[var(--color-line)]" />
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Link2 className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Image className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Table className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Code className="w-4 h-4" /></button>
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]"><Quote className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-[var(--color-line)]" />

          {/* Mode Toggle */}
          <div className="flex items-center gap-0.5 ml-1">
            <button
              className={`px-2 py-1 rounded text-[10px] font-medium ${editMode === 'richtext' ? 'bg-[var(--color-blue)] text-white' : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-2)]'}`}
              onClick={() => setEditMode('richtext')}
            >
              <Edit3 className="w-3 h-3 inline mr-1" />富文本
            </button>
            <button
              className={`px-2 py-1 rounded text-[10px] font-medium ${editMode === 'latex' ? 'bg-[var(--color-blue)] text-white' : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-2)]'}`}
              onClick={() => setEditMode('latex')}
            >
              <FileCode className="w-3 h-3 inline mr-1" />LaTeX
            </button>
          </div>

          <div className="flex-1" />

          {/* Action Buttons */}
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]" title="保存"><Save className="w-4 h-4" /></button>
          <button
            className="px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--color-line)] text-[var(--color-muted-foreground)] hover:border-[var(--color-blue)] hover:text-[var(--color-blue)] flex items-center gap-1"
            onClick={() => setShowTemplateModal(true)}
          >
            <FileText className="w-3 h-3" />模板
          </button>
          <button
            className="px-2.5 py-1 rounded text-[10px] font-medium bg-[var(--color-blue)] text-white flex items-center gap-1"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="w-3 h-3" />导出
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-8">
          <div className="max-w-3xl mx-auto bg-[var(--color-surface)] rounded-lg shadow-sm p-8">
            <h1 className="text-xl font-bold text-[var(--color-navy)] mb-1">多级孔SAPO-34分子筛的合成、表征及MTO催化性能研究</h1>
            <div className="text-xs text-[var(--color-muted-foreground)] mb-6">张明远¹，李晓明²  ¹中国石化石油化工科学研究院  ²中国科学院大连化学物理研究所</div>

            {editMode === 'richtext' ? (
              <div className="prose prose-sm max-w-none">
                {MOCK_SECTIONS.map(section => {
                  if (section.type === 'heading') {
                    const HeadingTag = section.level === 1 ? 'h2' : 'h3'
                    return <HeadingTag key={section.id} className="text-[var(--color-navy)] font-bold mt-6 mb-2 first:mt-0">{section.title}</HeadingTag>
                  }
                  return (
                    <p key={section.id} className="text-sm text-[var(--color-text)] leading-relaxed mb-3">
                      {section.content}
                      {section.id === 's3' && polishMode && (
                        <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-[var(--color-cyan)]">
                          <Sparkles className="w-3 h-3" />AI润色建议
                        </span>
                      )}
                    </p>
                  )
                })}

                {/* References */}
                <div className="mt-8 pt-4 border-t border-[var(--color-line)]">
                  <h3 className="text-sm font-bold text-[var(--color-navy)] mb-2">参考文献</h3>
                  {MOCK_REFERENCES.map(ref => (
                    <div key={ref.id} className="text-[11px] text-[var(--color-muted-foreground)] leading-relaxed mb-1">
                      [{ref.id}] {ref.text}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="font-mono text-xs text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
{`\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{chemformula}
\\usepackage{graphicx}
\\usepackage{natbib}

\\title{多级孔SAPO-34分子筛的合成、表征及MTO催化性能研究}
\\author{张明远\\textsuperscript{1}, 李晓明\\textsuperscript{2}}

\\begin{document}
\\maketitle

\\section{引言}
\\subsection{研究背景}
分子筛催化剂在石油化工领域扮演着至关重要的角色...

\\bibliographystyle{gb7714}
\\bibliography{references}
\\end{document}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: AI Assistant + Polish + Review + Pretreview */}
      <div className="w-80 border-l border-[var(--color-line)] bg-[var(--color-surface)] flex flex-col shrink-0">
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-line)] flex-wrap">
          {([
            ['ai', 'AI写作', Sparkles],
            ['cite', '引用', BookOpen],
            ['polish', '润色', Palette],
            ['review', '审校', Shield],
            ['pretreview', '预审', Target],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              className={`flex-1 min-w-0 px-2 py-2 text-[10px] font-medium border-b-2 transition-colors flex flex-col items-center gap-0.5 ${
                activeRightTab === key ? 'border-[var(--color-blue)] text-[var(--color-blue)]' : 'border-transparent text-[var(--color-muted-foreground)]'
              }`}
              onClick={() => setActiveRightTab(key)}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* AI Writing Assistant */}
          {activeRightTab === 'ai' && (
            <div className="p-3 space-y-3">
              <div className="text-xs font-bold text-[var(--color-text)]">AI 写作助手</div>
              <div className="space-y-1.5">
                {[
                  { icon: Zap, label: '续写', desc: 'AI 继续当前段落' },
                  { icon: Edit3, label: '改写', desc: '换一种表达方式' },
                  { icon: ChevronLeft, label: '缩写', desc: '精简当前段落' },
                  { icon: ChevronRight, label: '扩写', desc: '展开更多细节' },
                  { icon: BookOpen, label: '生成综述段落', desc: '基于论文库文献生成' },
                  { icon: FileText, label: '生成大纲', desc: 'AI 生成论文大纲' },
                ].map(({ icon: IconComp, label, desc }) => (
                  <button key={label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-blue)] hover:bg-[var(--color-surface-2)] transition-colors text-left">
                    <IconComp className="w-4 h-4 text-[var(--color-cyan)] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[var(--color-text)]">{label}</div>
                      <div className="text-[10px] text-[var(--color-faint)]">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-[var(--color-line)] pt-3">
                <div className="text-xs font-bold text-[var(--color-text)] mb-2">引用格式</div>
                <select
                  className="w-full px-2 py-1.5 text-xs rounded border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-blue)]"
                  value={bibStyle}
                  onChange={e => setBibStyle(e.target.value)}
                >
                  {['GB/T 7714', 'APA', 'ACS', 'Nature', 'Vancouver', 'Chicago', 'MLA', 'IEEE', 'AMA', 'Harvard', 'CSE', 'ASA', 'APS', 'AIP', 'RSC', 'Elsevier Harvard', 'Springer Basic', 'Wiley-VCH'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-[var(--color-line)] pt-3">
                <div className="text-xs font-bold text-[var(--color-text)] mb-2">智能翻译</div>
                <div className="flex gap-1.5">
                  <button className="flex-1 px-2 py-1.5 rounded text-[10px] bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] transition-colors border border-[var(--color-line)]">
                    中文 → 英文
                  </button>
                  <button className="flex-1 px-2 py-1.5 rounded text-[10px] bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] transition-colors border border-[var(--color-line)]">
                    英文 → 中文
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Citation Panel */}
          {activeRightTab === 'cite' && (
            <div className="p-3 space-y-3">
              <div className="text-xs font-bold text-[var(--color-text)]">引用管理</div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-faint)]" />
                <input className="w-full pl-8 pr-3 py-2 text-xs rounded-md border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-blue)]" placeholder="搜索论文库..." />
              </div>
              <div className="space-y-2">
                {MOCK_REFERENCES.map(ref => (
                  <div key={ref.id} className="p-2.5 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-blue)] cursor-pointer transition-colors">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-bold text-[var(--color-blue)]">[{ref.id}]</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-[var(--color-text)] line-clamp-2">{ref.text}</div>
                        <div className="flex gap-1.5 mt-1.5">
                          <button className="px-2 py-0.5 rounded text-[9px] bg-[var(--color-blue)] text-white">插入引用</button>
                          <button className="px-2 py-0.5 rounded text-[9px] border border-[var(--color-line)] text-[var(--color-muted-foreground)]">查看</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--color-line)] pt-3">
                <div className="text-xs font-bold text-[var(--color-text)] mb-2">.bib 文件管理</div>
                <div className="flex gap-1.5">
                  <button className="flex-1 px-2 py-1.5 rounded text-[10px] bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] border border-[var(--color-line)] flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" />导出 .bib
                  </button>
                  <button className="flex-1 px-2 py-1.5 rounded text-[10px] bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] border border-[var(--color-line)] flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" />导入 .bib
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Polish Panel */}
          {activeRightTab === 'polish' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[var(--color-text)]">学术润色</div>
                <button className={`px-2.5 py-1 rounded text-[10px] font-medium ${polishMode ? 'bg-[var(--color-cyan)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]'}`} onClick={() => setPolishMode(!polishMode)}>
                  {polishMode ? '修订模式 ON' : '开启修订模式'}
                </button>
              </div>

              <div className="text-[10px] text-[var(--color-faint)] mb-2">润色维度</div>
              <div className="space-y-1.5">
                {[
                  { label: '语法纠错', count: 2, color: 'var(--color-red)' },
                  { label: '用词升级', count: 5, color: 'var(--color-amber)' },
                  { label: '句式优化', count: 3, color: 'var(--color-blue)' },
                  { label: '逻辑衔接', count: 1, color: 'var(--color-purple)' },
                  { label: '学术风格', count: 2, color: 'var(--color-cyan)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--color-surface-2)]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-[var(--color-text)] flex-1">{item.label}</span>
                    <span className="text-[10px] text-[var(--color-faint)]">{item.count} 处</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-bold text-[var(--color-faint)] uppercase mt-3 mb-1">修改建议</div>
              <div className="space-y-2">
                {MOCK_POLISH_RESULTS.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-[var(--color-line)]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]">{item.type}</span>
                    </div>
                    <div className="text-[10px] text-[var(--color-red)] line-through mb-0.5">{item.original}</div>
                    <div className="text-[10px] text-[var(--color-green)]">{item.polished}</div>
                    <div className="flex gap-1.5 mt-1.5">
                      <button className="px-2 py-0.5 rounded text-[9px] bg-[var(--color-green)]/10 text-[var(--color-green)]">接受</button>
                      <button className="px-2 py-0.5 rounded text-[9px] bg-[var(--color-surface-2)] text-[var(--color-muted-foreground)]">拒绝</button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-3 py-2 rounded-md text-xs font-medium bg-[var(--color-cyan)] text-white hover:opacity-90 flex items-center justify-center gap-1 mt-2">
                <Palette className="w-3.5 h-3.5" />一键润色全文
              </button>
            </div>
          )}

          {/* Review Panel */}
          {activeRightTab === 'review' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[var(--color-text)]">全文审校</div>
                <button className="px-2.5 py-1 rounded text-[10px] font-medium bg-[var(--color-blue)] text-white">运行审校</button>
              </div>

              {/* Summary */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-2)]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--color-red)]">2</div>
                  <div className="text-[9px] text-[var(--color-faint)]">错误</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--color-amber)]">3</div>
                  <div className="text-[9px] text-[var(--color-faint)]">警告</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--color-blue)]">2</div>
                  <div className="text-[9px] text-[var(--color-faint)]">建议</div>
                </div>
              </div>

              {/* Issues */}
              <div className="space-y-2">
                {MOCK_REVIEW_ISSUES.map((issue, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-[var(--color-line)]">
                    <div className="flex items-start gap-2">
                      {issue.severity === 'error' && <AlertCircle className="w-3.5 h-3.5 text-[var(--color-red)] shrink-0 mt-0.5" />}
                      {issue.severity === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-amber)] shrink-0 mt-0.5" />}
                      {issue.severity === 'info' && <Info className="w-3.5 h-3.5 text-[var(--color-blue)] shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-[var(--color-text)]">{issue.message}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-faint)]">{issue.category}</span>
                          <span className="text-[9px] text-[var(--color-faint)]">{issue.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-3 py-2 rounded-md text-xs font-medium border border-[var(--color-line)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] hover:border-[var(--color-blue)] flex items-center justify-center gap-1">
                <Download className="w-3.5 h-3.5" />导出审校报告
              </button>
            </div>
          )}

          {/* Pretreview Panel */}
          {activeRightTab === 'pretreview' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[var(--color-text)]">AI 论文预审</div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[var(--color-amber)]/10 text-[var(--color-amber)]">{MOCK_PRETREVIEW.decision}</span>
              </div>

              {/* Score Radar (simplified as bars) */}
              <div className="space-y-2">
                {Object.entries(MOCK_PRETREVIEW.scores).map(([key, value]) => {
                  const labels: Record<string, string> = { innovation: '创新性', methodology: '方法学', data: '数据呈现', writing: '写作质量', impact: '影响力' }
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-[var(--color-text)]">{labels[key]}</span>
                        <span className={`text-[10px] font-bold ${value >= 75 ? 'text-[var(--color-green)]' : value >= 60 ? 'text-[var(--color-amber)]' : 'text-[var(--color-red)]'}`}>{value}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${value}%`,
                            backgroundColor: value >= 75 ? 'var(--color-green)' : value >= 60 ? 'var(--color-amber)' : 'var(--color-red)'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Major Concerns */}
              <div>
                <div className="text-[10px] font-bold text-[var(--color-red)] uppercase mb-1.5">Major Concerns</div>
                <div className="space-y-2">
                  {MOCK_PRETREVIEW.majorConcerns.map((concern, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-[var(--color-red)]/20 bg-[var(--color-red)]/5">
                      <div className="text-[11px] text-[var(--color-text)] leading-relaxed">{concern}</div>
                      <button className="mt-1.5 text-[9px] text-[var(--color-blue)] hover:underline flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />生成修改建议
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minor Concerns */}
              <div>
                <div className="text-[10px] font-bold text-[var(--color-amber)] uppercase mb-1.5">Minor Concerns</div>
                <div className="space-y-1.5">
                  {MOCK_PRETREVIEW.minorConcerns.map((concern, i) => (
                    <div key={i} className="p-2 rounded-lg border border-[var(--color-amber)]/20 bg-[var(--color-amber)]/5">
                      <div className="text-[10px] text-[var(--color-text)] leading-relaxed">{concern}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full px-3 py-2 rounded-md text-xs font-medium border border-[var(--color-line)] text-[var(--color-muted-foreground)] hover:text-[var(--color-blue)] hover:border-[var(--color-blue)] flex items-center justify-center gap-1">
                <Download className="w-3.5 h-3.5" />导出预审报告
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg w-[560px] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--color-text)]">学术模板库</h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-text)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Nature', desc: 'Nature 期刊格式' },
                { name: 'ACS', desc: '美国化学会格式' },
                { name: 'RSC', desc: '英国皇家化学会格式' },
                { name: '中文核心', desc: 'GB/T 7714 引用格式' },
                { name: 'Elsevier', desc: 'Elsevier 期刊通用' },
                { name: 'Springer', desc: 'Springer 期刊通用' },
              ].map(tpl => (
                <div key={tpl.name} className="p-3 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-blue)] cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-blue)]" />
                    <div>
                      <div className="text-sm font-bold text-[var(--color-text)]">{tpl.name}</div>
                      <div className="text-[10px] text-[var(--color-faint)]">{tpl.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
          <div className="bg-[var(--color-surface)] rounded-lg shadow-lg w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--color-text)]">导出文档</h3>
              <button onClick={() => setShowExportModal(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-text)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              {[
                { format: 'PDF', desc: '格式化文档，适合投稿', icon: FileText },
                { format: 'Word (.docx)', desc: '可编辑文档', icon: FileText },
                { format: 'LaTeX (.tex)', desc: 'LaTeX 源码', icon: FileCode },
                { format: '.bib', desc: 'BibTeX 引用文件', icon: BookOpen },
              ].map(({ format, desc, icon: IconComp }) => (
                <div key={format} className="p-3 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-blue)] cursor-pointer transition-colors flex items-center gap-3">
                  <IconComp className="w-5 h-5 text-[var(--color-blue)]" />
                  <div>
                    <div className="text-sm font-bold text-[var(--color-text)]">{format}</div>
                    <div className="text-[10px] text-[var(--color-faint)]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

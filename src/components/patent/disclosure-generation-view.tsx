'use client';

import React, { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Download, FileText, AlertTriangle,
  CheckCircle2, Search, Lightbulb, Sparkles, Upload, Edit3,
  ChevronRight, Circle, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3 | 4;

export default function DisclosureGenerationView() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 state
  const [techField, setTechField] = useState('催化裂化');
  const [techProblem, setTechProblem] = useState('');
  const [techSolution, setTechSolution] = useState('');
  const [expectedEffect, setExpectedEffect] = useState('');

  // Step 2 state
  const [highSimilarity] = useState([
    { id: 'CN202310XXXXXX', title: '一种磷改性ZSM-5催化裂化催化剂', applicant: '中石化', date: '2023-06', similarity: 82, overlapFeatures: ['磷改性', 'ZSM-5', '催化裂化'], diffFeatures: ['含镧元素（该专利无）', '分步改性工艺（该专利为一步法）'] },
    { id: 'CN202210XXXXXX', title: '基于分子筛的催化裂化方法', applicant: '中石油', date: '2022-09', similarity: 71, overlapFeatures: ['ZSM-5', '催化裂化', '丙烯选择性'], diffFeatures: ['你的方案含磷改性（该专利为未改性）', '不同温度区间'] },
  ]);
  const [lowSimilarity] = useState([
    { id: 'CN202410XXXXXX', title: '核壳结构分子筛催化剂制备', applicant: 'BASF', date: '2024-01', similarity: 58 },
    { id: 'CN202010XXXXXX', title: '稀土改性Y型分子筛用于催化裂化', applicant: '中石化', date: '2020-05', similarity: 45 },
  ]);

  const handleNoveltySearch = () => setCurrentStep(2);
  const handleGenerateDisclosure = () => setCurrentStep(3);
  const handleVerifyBlank = () => setCurrentStep(4);

  const stepItems = [
    { step: 1, label: '输入构思', desc: '描述技术方案' },
    { step: 2, label: '查新检测', desc: '发现相似专利' },
    { step: 3, label: '生成交底书', desc: 'AI自动撰写' },
    { step: 4, label: '空白验证', desc: '确认技术空白' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      {/* 步骤指示器 - 横跨全宽 */}
      <div className="shrink-0 border-b border-outline/15 bg-surface px-6 py-4">
        <div className="flex items-center justify-center gap-0">
          {stepItems.map((s, i) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all',
                    currentStep > s.step
                      ? 'bg-primary text-white'
                      : currentStep === s.step
                        ? 'bg-primary text-white ring-4 ring-primary/15'
                        : 'bg-surface-container text-on-surface-variant'
                  )}>
                    {currentStep > s.step ? <Check className="h-4 w-4" /> : s.step}
                  </div>
                  <div>
                    <p className={cn('text-[13px] font-semibold leading-tight',
                      currentStep >= s.step ? 'text-foreground' : 'text-on-surface-variant'
                    )}>{s.label}</p>
                    <p className="text-[10px] text-on-surface-variant leading-tight">{s.desc}</p>
                  </div>
                </div>
              </div>
              {i < stepItems.length - 1 && (
                <div className="mx-4 flex items-center">
                  <div className={cn('h-[2px] w-16 rounded-full transition-colors',
                    currentStep > s.step ? 'bg-primary' : 'bg-outline/20'
                  )} />
                  <ChevronRight className={cn('h-3.5 w-3.5 -ml-0.5',
                    currentStep > s.step ? 'text-primary' : 'text-outline/30'
                  )} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-5">

          {/* Step 1：输入技术构思 */}
          {currentStep === 1 && (
            <div className="rounded-xl border border-outline/15 bg-surface p-6 shadow-card">
              <h3 className="mb-5 text-[16px] font-bold text-navy flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                输入技术构思
              </h3>

              <div className="space-y-5">
                {/* 技术领域 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-foreground">技术领域</label>
                  <select value={techField} onChange={(e) => setTechField(e.target.value)}
                    className="w-full rounded-lg border border-outline/20 bg-surface-container px-4 py-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all">
                    <option>催化裂化</option>
                    <option>加氢裂化</option>
                    <option>重整</option>
                    <option>加氢脱硫</option>
                    <option>烷基化</option>
                    <option>异构化</option>
                    <option>其他</option>
                  </select>
                </div>

                {/* 技术问题 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-foreground">
                    技术问题
                    <span className="ml-1 text-[10px] font-normal text-on-surface-variant">你要解决什么问题？</span>
                  </label>
                  <textarea value={techProblem} onChange={(e) => setTechProblem(e.target.value)}
                    placeholder="例：现有ZSM-5分子筛催化剂在催化裂化过程中丙烯选择性不足，磷改性虽能提高选择性但在高温下稳定性差..."
                    className="w-full rounded-lg border border-outline/20 bg-surface-container px-4 py-3 text-[13px] text-foreground min-h-[100px] placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all leading-relaxed" />
                </div>

                {/* 技术方案 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-foreground">
                    技术方案
                    <span className="ml-1 text-[10px] font-normal text-on-surface-variant">你的解决思路是什么？</span>
                  </label>
                  <textarea value={techSolution} onChange={(e) => setTechSolution(e.target.value)}
                    placeholder={"例：采用磷-镧双元素协同改性ZSM-5分子筛，通过先浸磷后浸镧的分步改性工艺，控制磷含量2-5wt%、镧含量1-3wt%，在400-550℃反应条件下...\n\n支持粘贴实验数据、配方参数、工艺条件"}
                    className="w-full rounded-lg border border-outline/20 bg-surface-container px-4 py-3 text-[13px] text-foreground min-h-[120px] placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all leading-relaxed" />
                </div>

                {/* 预期效果 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-foreground">
                    预期效果
                    <span className="ml-1 text-[10px] font-normal text-on-surface-variant">能达到什么技术效果？</span>
                  </label>
                  <textarea value={expectedEffect} onChange={(e) => setExpectedEffect(e.target.value)}
                    placeholder="例：丙烯选择性提高至35%以上，催化剂在600℃下水热稳定性保持率>90%，寿命延长至..."
                    className="w-full rounded-lg border border-outline/20 bg-surface-container px-4 py-3 text-[13px] text-foreground min-h-[100px] placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all leading-relaxed" />
                </div>

                {/* 附加材料 */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-foreground">附加材料（可选）</label>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-dashed border-outline/30 px-4 py-2.5 text-[12px] text-on-surface-variant hover:bg-surface-container hover:border-primary/30 transition-colors">
                      <Upload className="h-4 w-4" /> 上传实验数据
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-dashed border-outline/30 px-4 py-2.5 text-[12px] text-on-surface-variant hover:bg-surface-container hover:border-primary/30 transition-colors">
                      <Upload className="h-4 w-4" /> 上传参考文献
                    </button>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex items-center gap-3 border-t border-outline/10 pt-5">
                <button onClick={handleNoveltySearch}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  <Search className="h-4 w-4" /> 先查新再生成（推荐）
                </button>
                <button onClick={handleGenerateDisclosure}
                  className="flex items-center gap-2 rounded-lg border border-outline/25 px-5 py-2.5 text-[13px] text-foreground font-semibold hover:bg-surface-container transition-colors">
                  <Sparkles className="h-4 w-4" /> 直接生成交底书
                </button>
              </div>
            </div>
          )}

          {/* Step 2：查新检测 */}
          {currentStep === 2 && (
            <div className="rounded-xl border border-outline/15 bg-surface p-6 shadow-card">
              <h3 className="mb-4 text-[16px] font-bold text-navy flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                查新检测
              </h3>
              <p className="mb-5 text-[12px] text-on-surface-variant leading-relaxed">
                基于你的技术方案，在专利库中检测到以下相似专利：
              </p>

              {/* 高相似度 */}
              <div className="mb-4 rounded-lg border border-error/20 bg-error-bg/50 p-4">
                <h4 className="mb-3 text-[13px] font-bold text-error flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> 高相似度（&gt;70%）
                </h4>
                <div className="space-y-3">
                  {highSimilarity.map((patent) => (
                    <div key={patent.id} className="rounded-lg bg-surface p-4 border border-outline/10 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-bold text-foreground">{patent.id}</span>
                        <span className="rounded-full bg-error/10 px-2 py-0.5 text-[11px] font-bold text-error">相似度 {patent.similarity}%</span>
                      </div>
                      <p className="text-[13px] text-foreground font-medium">{patent.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{patent.applicant} | {patent.date}</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] font-semibold text-amber mb-1">重叠特征</p>
                          <div className="flex flex-wrap gap-1">
                            {patent.overlapFeatures.map((f) => (
                              <span key={f} className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] text-amber font-medium">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-success mb-1">差异特征</p>
                          <div className="flex flex-wrap gap-1">
                            {patent.diffFeatures.map((f) => (
                              <span key={f} className="rounded-full bg-success-bg px-2 py-0.5 text-[10px] text-success font-medium">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="mt-2 text-[11px] text-primary hover:underline font-medium">查看详情</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 低相似度 */}
              <div className="mb-4 rounded-lg border border-success/20 bg-success-bg/50 p-4">
                <h4 className="mb-3 text-[13px] font-bold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 低相似度（&lt;70%）
                </h4>
                <div className="space-y-2">
                  {lowSimilarity.map((patent) => (
                    <div key={patent.id} className="flex items-center justify-between rounded-lg bg-surface p-3 border border-outline/10">
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-foreground">{patent.id}</span>
                        <span className="mx-1.5 text-outline">|</span>
                        <span className="text-[12px] text-foreground">{patent.title}</span>
                        <span className="mx-1.5 text-outline">|</span>
                        <span className="text-[11px] text-on-surface-variant">{patent.applicant}</span>
                      </div>
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] text-success font-medium ml-2">相似度 {patent.similarity}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 查新结论 */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="text-[13px] font-bold text-primary mb-1.5">查新结论</h4>
                <p className="text-[12px] text-foreground leading-relaxed">
                  你的方案与已有专利的核心差异在于<strong className="text-primary">「磷-镧双元素协同」</strong>和<strong className="text-primary">「分步改性工艺」</strong>，建议在交底书中着重强调这两个特征。
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-outline/10 pt-4">
                <button onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 rounded-lg border border-outline/25 px-4 py-2.5 text-[12px] text-foreground hover:bg-surface-container transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> 返回修改构思
                </button>
                <button onClick={handleGenerateDisclosure}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  确认差异，继续生成交底书 <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3：AI 生成交底书 */}
          {currentStep === 3 && (
            <div className="rounded-xl border border-outline/15 bg-surface shadow-card overflow-hidden">
              {/* 工具栏 */}
              <div className="flex items-center justify-between border-b border-outline/15 px-6 py-3 bg-surface-container/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[14px] font-bold text-foreground">交底书预览</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-medium">AI生成</span>
                </div>
                <button className="flex items-center gap-1.5 rounded-md border border-outline/20 px-3 py-1.5 text-[11px] text-foreground hover:bg-surface-container transition-colors">
                  <Edit3 className="h-3 w-3" /> 编辑模式
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 发明名称 */}
                <div>
                  <h4 className="text-[12px] font-bold text-primary mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> 发明名称（AI建议）
                  </h4>
                  <p className="text-[16px] font-bold text-navy leading-snug">
                    一种磷-镧双元素协同改性ZSM-5催化裂化催化剂及其制备方法
                  </p>
                </div>

                {/* 技术领域 */}
                <div>
                  <h4 className="text-[13px] font-bold text-navy mb-1.5 pb-1 border-b border-outline/10">技术领域</h4>
                  <p className="text-[13px] text-foreground leading-relaxed">
                    本发明涉及石油炼制催化剂技术领域，具体涉及一种磷-镧双元素协同改性的ZSM-5分子筛催化裂化催化剂及其制备方法。
                  </p>
                </div>

                {/* 背景技术 */}
                <div>
                  <h4 className="text-[13px] font-bold text-navy mb-1.5 pb-1 border-b border-outline/10">背景技术</h4>
                  <p className="text-[13px] text-foreground leading-relaxed">
                    目前，在催化裂化领域，ZSM-5分子筛催化剂已被广泛应用于提高轻烯烃特别是丙烯的产率。然而，现有ZSM-5催化剂在高温水热条件下稳定性不足，导致活性快速下降。磷改性是提高ZSM-5水热稳定性的常用方法（参见CN202310XXXXXX），但单一磷改性在提高稳定性的同时会部分牺牲催化剂的活性。单一稀土元素改性的研究虽有报道，但未能同时兼顾选择性和稳定性。因此，亟需开发一种兼具高选择性和优良水热稳定性的改性ZSM-5催化剂。
                  </p>
                </div>

                {/* 发明内容 */}
                <div>
                  <h4 className="text-[13px] font-bold text-navy mb-3 pb-1 border-b border-outline/10">发明内容</h4>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-surface-container/60 p-4">
                      <p className="text-[11px] font-bold text-primary mb-1">要解决的技术问题</p>
                      <p className="text-[13px] text-foreground leading-relaxed">
                        本发明要解决的技术问题是提供一种催化裂化催化剂，使其在保持高丙烯选择性的同时具备优异的高温水热稳定性。
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-container/60 p-4">
                      <p className="text-[11px] font-bold text-primary mb-1">技术方案</p>
                      <p className="text-[13px] text-foreground leading-relaxed">
                        为解决上述技术问题，本发明提供一种磷-镧双元素协同改性ZSM-5催化裂化催化剂，其特征在于，以ZSM-5分子筛为活性组分，采用先浸磷后浸镧的分步改性工艺，磷含量为2-5wt%，镧含量为1-3wt%。
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-container/60 p-4">
                      <p className="text-[11px] font-bold text-primary mb-1">有益效果</p>
                      <p className="text-[13px] text-foreground leading-relaxed">
                        丙烯选择性提高至35%以上，催化剂在600℃下水热稳定性保持率&gt;90%，寿命较传统磷改性ZSM-5催化剂延长30%以上。磷-镧双元素协同效应使催化剂兼具高选择性和高稳定性。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 具体实施方式 */}
                <div>
                  <h4 className="text-[13px] font-bold text-navy mb-1.5 pb-1 border-b border-outline/10">具体实施方式</h4>
                  <p className="text-[13px] text-foreground leading-relaxed">
                    以下结合具体实施例对本发明作进一步详细说明。<br/><br/>
                    实施例1：称取100g ZSM-5分子筛（硅铝比25:1），配制浓度为0.5mol/L的磷酸二氢铵溶液，按磷含量3wt%计算所需溶液体积，将分子筛浸入溶液中，室温浸渍4h，110℃干燥6h，500℃焙烧4h，得到磷改性ZSM-5。配制浓度为0.3mol/L的硝酸镧溶液，按镧含量2wt%计算所需溶液体积，将磷改性ZSM-5浸入溶液中，室温浸渍4h，110℃干燥6h，550℃焙烧4h，得到磷-镧双改性ZSM-5催化剂...
                  </p>
                </div>

                {/* 摘要 */}
                <div>
                  <h4 className="text-[13px] font-bold text-navy mb-1.5 pb-1 border-b border-outline/10">摘要</h4>
                  <p className="text-[13px] text-foreground leading-relaxed">
                    本发明公开了一种磷-镧双元素协同改性ZSM-5催化裂化催化剂及其制备方法，采用先浸磷后浸镧的分步改性工艺，控制磷含量2-5wt%、镧含量1-3wt%。该催化剂在400-550℃催化裂化条件下，丙烯选择性达35%以上，600℃水热稳定性保持率超过90%，实现了选择性与稳定性的协同提升。
                  </p>
                </div>

                <div className="rounded-lg bg-amber/5 border border-amber/20 p-3">
                  <p className="text-[11px] text-amber flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> 以上内容由AI生成，仅作为交底书初稿，请结合专业知识修改完善
                  </p>
                </div>
              </div>

              <div className="border-t border-outline/15 px-6 py-4 bg-surface-container/30 flex items-center gap-3">
                <button onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 rounded-lg border border-outline/25 px-4 py-2.5 text-[12px] text-foreground hover:bg-surface-container transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> 返回查新结果
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-outline/25 px-4 py-2.5 text-[12px] text-foreground hover:bg-surface-container transition-colors">
                  <Download className="h-3.5 w-3.5" /> 导出 Word
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-outline/25 px-4 py-2.5 text-[12px] text-foreground hover:bg-surface-container transition-colors">
                  <Edit3 className="h-3.5 w-3.5" /> 继续编辑
                </button>
                <button onClick={handleVerifyBlank}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm ml-auto">
                  空白验证 <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4：空白验证 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-outline/15 bg-surface p-6 shadow-card">
                <h3 className="mb-4 text-[16px] font-bold text-navy flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  相似度复检
                </h3>
                <div className="space-y-2.5">
                  <p className="text-[13px] text-foreground">
                    最高相似度：<strong>78%</strong>（CN202310XXXXXX）— 已在查新阶段识别，差异特征明确
                  </p>
                  <p className="text-[13px] text-foreground">
                    新增相似专利：<strong className="text-success">无</strong>
                  </p>
                  <div className="mt-3 rounded-lg bg-success-bg border border-success/20 p-3">
                    <p className="text-[12px] text-success font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> 结论：未发现查新阶段遗漏的相似专利
                    </p>
                  </div>
                </div>
              </div>

              {/* 空白覆盖评估 */}
              <div className="rounded-xl border border-outline/15 bg-surface p-6 shadow-card">
                <h3 className="mb-4 text-[16px] font-bold text-navy flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  空白覆盖评估
                </h3>

                {/* 覆盖的空白 */}
                <div className="mb-4 rounded-lg bg-success-bg/60 border border-success/15 p-4">
                  <p className="text-[12px] font-bold text-success mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> 该方案覆盖了以下技术空白：
                  </p>
                  <div className="space-y-3">
                    {[
                      { blank: '磷+稀土双元素协同改性方案', desc: '此前仅1件相关专利（CN2018XXXXXXXX，已失效）', detail: '你的方案提供了新的分步改性工艺路线' },
                      { blank: '低温催化裂化条件下的分子筛改性', desc: '此前无已有专利覆盖400-550℃区间', detail: '你的方案填补了该温度范围的空白' },
                    ].map((item, i) => (
                      <div key={i} className="rounded-lg bg-surface p-3 border border-outline/10">
                        <p className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {item.blank}
                        </p>
                        <p className="text-[12px] text-on-surface-variant mt-1 ml-5">— {item.desc}</p>
                        <p className="text-[12px] text-on-surface-variant ml-5">— {item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 部分重叠 */}
                <div className="rounded-lg bg-warning-bg/60 border border-amber/15 p-4">
                  <p className="text-[12px] font-bold text-amber mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> 以下方面与已有专利存在部分重叠：
                  </p>
                  <div className="space-y-3">
                    {[
                      { area: '浸渍法制备路线', desc: 'CN202310XXXXXX 已覆盖一步浸渍法', suggestion: '你的方案为分步浸渍，构成差异。建议：在权利要求中明确"分步"限定' },
                    ].map((item, i) => (
                      <div key={i} className="rounded-lg bg-surface p-3 border border-outline/10">
                        <p className="text-[13px] font-semibold text-foreground">{item.area}</p>
                        <p className="text-[12px] text-on-surface-variant mt-1 ml-0">— {item.desc}</p>
                        <p className="text-[12px] text-on-surface-variant">— 但{item.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI 优化建议 */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="mb-4 text-[16px] font-bold text-primary flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  AI 优化建议
                </h3>
                <div className="space-y-3">
                  {[
                    '在独立权利要求中强调"分步改性"工艺特征，与已有一步法方案形成明确区分',
                    '补充磷含量和镧含量的具体范围限定，避免保护范围过宽被驳回',
                    '建议增加对比实施例数据（磷单改性 vs 磷-镧双改性）以支撑"协同效应"的有益效果主张',
                  ].map((suggestion, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{i + 1}</span>
                      <span className="text-[13px] text-foreground leading-relaxed">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 rounded-lg border border-outline/25 px-4 py-2.5 text-[12px] text-foreground hover:bg-surface-container transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> 返回修改交底书
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[12px] text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm ml-auto">
                  <Download className="h-3.5 w-3.5" /> 导出完整报告（交底书+查新+验证）
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, BarChart3, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import PatentSearchView from '@/components/patent/patent-search-view';
import PatentDetailView from '@/components/patent/patent-detail-view';
import CompetitiveAnalysisView from '@/components/patent/competitive-analysis-view';
import DisclosureGenerationView from '@/components/patent/disclosure-generation-view';
import { patents } from '@/components/patent/data';
import type { Patent } from '@/components/patent/data';

type ViewMode = 'search' | 'analysis' | 'disclosure';

function PatentAnalysisContent() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<ViewMode>('search');
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [selectedPatentIndex, setSelectedPatentIndex] = useState<number>(-1);

  // Support URL query param ?tab=disclosure or ?tab=analysis
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'disclosure' || tab === 'analysis' || tab === 'search') {
      setActiveView(tab);
    }
  }, [searchParams]);

  const views: { key: ViewMode; label: string; icon: React.ElementType }[] = [
    { key: 'search', label: '专利检索', icon: Search },
    { key: 'analysis', label: '竞争分析看板', icon: BarChart3 },
    { key: 'disclosure', label: '交底书生成', icon: FileText },
  ];

  const handleSelectPatent = useCallback((patent: Patent) => {
    const idx = patents.findIndex((p) => p.id === patent.id);
    setSelectedPatent(patent);
    setSelectedPatentIndex(idx);
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedPatent(null);
    setSelectedPatentIndex(-1);
  }, []);

  const handleNavigatePatent = useCallback((direction: 'prev' | 'next') => {
    const newIdx = direction === 'prev'
      ? Math.max(0, selectedPatentIndex - 1)
      : Math.min(patents.length - 1, selectedPatentIndex + 1);
    setSelectedPatent(patents[newIdx]);
    setSelectedPatentIndex(newIdx);
  }, [selectedPatentIndex]);

  return (
    <div className="flex h-[calc(100vh-44px-40px)] flex-col -m-5">
      {/* 顶部导航：面包屑 + Tab 切换 */}
      <div className="shrink-0 border-b border-outline/20 bg-surface">
        {/* 面包屑 */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-1 text-[11px] text-on-surface-variant">
          <span className="hover:text-primary cursor-pointer">读空间</span>
          <span className="text-outline">/</span>
          <span className="text-foreground font-semibold">专利分析</span>
        </div>

        {/* Tab 切换 */}
        <div className="flex items-center gap-0 px-4">
          {views.map((view) => (
            <button
              key={view.key}
              onClick={() => { setActiveView(view.key); setSelectedPatent(null); }}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors',
                activeView === view.key
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              )}
            >
              <view.icon className="h-4 w-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {activeView === 'search' && !selectedPatent && (
          <PatentSearchView onSelectPatent={handleSelectPatent} />
        )}
        {activeView === 'search' && selectedPatent && (
          <PatentDetailView
            patent={selectedPatent}
            onBack={handleBackFromDetail}
            onNavigate={handleNavigatePatent}
            hasPrev={selectedPatentIndex > 0}
            hasNext={selectedPatentIndex < patents.length - 1}
          />
        )}
        {activeView === 'analysis' && <CompetitiveAnalysisView />}
        {activeView === 'disclosure' && <DisclosureGenerationView />}
      </div>
    </div>
  );
}

export default function PatentAnalysisPage() {
  return (
    <Suspense>
      <PatentAnalysisContent />
    </Suspense>
  );
}

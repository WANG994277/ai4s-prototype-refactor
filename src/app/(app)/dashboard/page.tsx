'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Search,
  Bot,
  FolderKanban,
  Award,
  Cpu,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterBar } from '@/components/cockpit/filter-bar';
import { OperationOverview } from '@/components/cockpit/tabs/operation-overview';
import { UserAnalysis } from '@/components/cockpit/tabs/user-analysis';
import { ResearchResources } from '@/components/cockpit/tabs/research-resources';
import { AIAssistant } from '@/components/cockpit/tabs/ai-assistant';
import { ProjectAchievement } from '@/components/cockpit/tabs/project-achievement';
import { ComputeResource } from '@/components/cockpit/tabs/compute-resource';

const tabs = [
  { id: 'operation', label: '运营总览', icon: LayoutDashboard },
  { id: 'user', label: '用户分析', icon: Users },
  { id: 'research', label: '科研资源', icon: Search },
  { id: 'ai', label: 'AI科研助理', icon: Bot },
  { id: 'project', label: '项目与成果', icon: FolderKanban },
  { id: 'compute', label: '算力资源分析', icon: Cpu },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('operation');
  const [timeRange, setTimeRange] = useState('30d');
  const [unit, setUnit] = useState('全部单位');
  const [project, setProject] = useState('全部项目');
  const [workbench, setWorkbench] = useState('全部工作台');

  const handleExport = () => {
    const tabLabel = tabs.find((t) => t.id === activeTab)?.label || '';
    const csvContent = `管理驾驶舱-${tabLabel}\n时间范围,${timeRange}\n单位,${unit}\n项目,${project}\n工作台,${workbench}\n`;
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `管理驾驶舱_${tabLabel}_${timeRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'operation':
        return <OperationOverview />;
      case 'user':
        return <UserAnalysis />;
      case 'research':
        return <ResearchResources />;
      case 'ai':
        return <AIAssistant />;
      case 'project':
        return <ProjectAchievement />;
      case 'compute':
        return <ComputeResource />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground">我的工作台 / 管理驾驶舱</div>
          <h1 className="text-xl font-black text-navy">管理驾驶舱</h1>
        </div>
      </div>

      {/* 全局筛选栏 - 吸顶 */}
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-white/95 px-4 py-2 backdrop-blur-sm">
        <FilterBar
          filters={{ timeRange, unit, project, workbench }}
          onChange={(newFilters) => {
            setTimeRange(newFilters.timeRange);
            setUnit(newFilters.unit);
            setProject(newFilters.project);
            setWorkbench(newFilters.workbench);
          }}
          onExport={handleExport}
        />
      </div>

      {/* 标签页导航 */}
      <div className="flex items-center gap-1 border-b border-line">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-4 py-2 text-[13px] font-medium transition-colors',
                isActive
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 标签页内容 */}
      <div className="min-h-[400px]">{renderTabContent()}</div>
    </div>
  );
}

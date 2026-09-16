'use client';

import { useState, useMemo } from 'react';
import { Search, Building2, Users, ChevronRight, ChevronDown, ArrowRight, Check } from 'lucide-react';
import type { WorkspaceBinding } from '@/lib/types/auth';
import { organizations, buildOrgTree, orgTypeLabel } from '@/lib/mock/organizations';
import { roles } from '@/lib/mock/roles';
import { myWorkspaces, validPeriodLabel, currentUserId, currentUserName } from '@/lib/mock/workspaces';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { OrgTreeNode } from '@/lib/types/auth';

interface JoinWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (workspace: WorkspaceBinding) => void;
}

export function JoinWorkspaceDialog({ open, onOpenChange, onSuccess }: JoinWorkspaceDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['org-cnpc', 'org-riped', 'org-ripp', 'org-daqing']));
  const [reason, setReason] = useState('');
  const [validPeriod, setValidPeriod] = useState<string>('1y');
  const [submitted, setSubmitted] = useState(false);

  // 排除已加入的工作台
  const joinedOrgIds = useMemo(() => myWorkspaces.map((w) => w.orgId), []);
  const joinedOrgSet = useMemo(() => new Set(joinedOrgIds), [joinedOrgIds]);

  const tree = useMemo(() => buildOrgTree(), []);

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (!selectedOrgId || !reason) return;

    const org = organizations.find((o) => o.id === selectedOrgId);
    if (!org) return;

    // 构造新的工作台绑定（状态为待激活）
    const newWorkspace: WorkspaceBinding = {
      id: `wb-${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      orgId: org.id,
      orgName: org.name,
      orgPath: '',
      roleId: 'role-researcher',
      roleName: '研究员',
      isActive: false,
      source: 'application',
      validFrom: new Date().toISOString().slice(0, 10),
      validTo: validPeriod === 'permanent' ? undefined : validPeriod === '6m'
        ? new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10)
        : new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      status: 'active',
    };

    onSuccess?.(newWorkspace);
    setSubmitted(true);

    // 重置
    setTimeout(() => {
      setSelectedOrgId(null);
      setReason('');
      setValidPeriod('1y');
      setSubmitted(false);
    }, 1500);
  }

  function renderTree(nodes: OrgTreeNode[], depth: number): React.ReactNode {
    return nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedOrgId === node.id;
      const isJoined = joinedOrgSet.has(node.id);
      const matchesSearch =
        !searchQuery ||
        node.name.includes(searchQuery) ||
        node.code.toLowerCase().includes(searchQuery.toLowerCase());
      // 如果不匹配且无子节点，跳过
      if (!matchesSearch && !hasChildren) return null;

      return (
        <div key={node.id}>
          <div
            className={cn(
              'group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors',
              isSelected ? 'bg-primary/10' : isJoined ? 'opacity-40' : 'hover:bg-surface-2',
              !matchesSearch && 'opacity-30'
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => !isJoined && node.level >= 2 && setSelectedOrgId(node.id)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                className="flex h-4 w-4 items-center justify-center text-faint hover:text-foreground"
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className={cn('flex-1 truncate text-[13px]', isSelected ? 'font-bold text-primary' : 'text-foreground')}>
              {node.name}
            </span>
            {isJoined && (
              <Badge variant="outline" className="text-[10px] font-normal text-cyan border-cyan/30">
                已加入
              </Badge>
            )}
            {!isJoined && node.level >= 2 && (
              <span className="text-[10px] text-faint">{orgTypeLabel[node.orgType]}</span>
            )}
          </div>
          {hasChildren && isExpanded && renderTree(node.children, depth + 1)}
        </div>
      );
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">申请加入工作台</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10">
              <Check className="h-6 w-6 text-cyan" />
            </div>
            <p className="mt-3 text-[14px] font-medium text-foreground">申请已提交</p>
            <p className="mt-1 text-[12px] text-faint">等待工作台管理员审批后即可加入</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* 左侧：工作台树 */}
            <div className="space-y-2">
              <Label className="text-[13px]">选择工作台 *</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-faint" />
                <Input
                  placeholder="搜索单位名称或编码"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-[12px]"
                />
              </div>
              <div className="h-[300px] overflow-y-auto rounded-md border border-line p-2">
                {renderTree(tree, 0)}
              </div>
            </div>

            {/* 右侧：申请信息 */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[13px]">目标工作台</Label>
                {selectedOrg ? (
                  <div className="flex items-center gap-2.5 rounded-md border border-line bg-surface-2 px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="truncate text-[13px] font-bold text-foreground">{selectedOrg.name}</div>
                      <div className="text-[11px] text-faint">{selectedOrg.code} · {orgTypeLabel[selectedOrg.orgType]}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-md border border-dashed border-line py-2.5 text-[12px] text-faint">
                    请从左侧选择工作台
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px]">申请角色</Label>
                <div className="flex items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2">
                  <span className="text-[13px] text-muted-foreground">研究员</span>
                  <Badge variant="outline" className="text-[10px] font-normal text-amber border-amber/30">
                    仅本人数据
                  </Badge>
                </div>
                <p className="text-[11px] text-faint">加入工作台后角色为研究员，如需管理员权限请联系工作台负责人</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px]">有效期</Label>
                <div className="flex gap-2">
                  {(['6m', '1y', 'permanent'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setValidPeriod(p)}
                      className={cn(
                        'flex-1 rounded-md border px-2 py-1.5 text-[12px] font-medium transition-colors',
                        validPeriod === p
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-line text-muted-foreground hover:border-line-2'
                      )}
                    >
                      {validPeriodLabel[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px]">申请理由 *</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="请说明加入原因，如参与课题、跨单位协作等"
                  className="min-h-[70px] resize-none text-[12px]"
                />
              </div>
            </div>
          </div>
        )}

        {!submitted && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9">
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedOrgId || !reason}
              className="h-9 gap-1.5"
            >
              提交申请
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

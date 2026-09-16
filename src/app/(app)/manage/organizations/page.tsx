'use client';

import { useState } from 'react';
import {
  Building2,
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Users,
  MapPin,
} from 'lucide-react';
import type { OrgTreeNode } from '@/lib/types/auth';
import { organizations, buildOrgTree, orgTypeLabel } from '@/lib/mock/organizations';
import { users } from '@/lib/mock/users';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OrgForm {
  name: string;
  code: string;
  orgType: 'institute' | 'department' | 'group_team';
  parentId: string;
}

export default function OrganizationsPage() {
  const tree = buildOrgTree();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-riped');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['org-cnpc', 'org-riped', 'org-ripp'])
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrgForm>({
    name: '',
    code: '',
    orgType: 'department',
    parentId: '',
  });

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);
  const childOrgs = organizations.filter((o) => o.parentId === selectedOrgId);
  const orgUsers = users.filter((u) => u.orgId === selectedOrgId);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddSub(parentId: string) {
    setEditingOrgId(null);
    setFormData({ name: '', code: '', orgType: 'department', parentId });
    setDialogOpen(true);
  }

  function handleEdit(orgId: string) {
    const org = organizations.find((o) => o.id === orgId);
    if (!org) return;
    setEditingOrgId(orgId);
    setFormData({
      name: org.name,
      code: org.code,
      orgType: org.orgType === 'group' ? 'institute' : (org.orgType as OrgForm['orgType']),
      parentId: org.parentId || '',
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.name || !formData.code) return;
    // Mock: 不实际修改数据（前端模拟）
    setDialogOpen(false);
  }

  // 递归渲染组织树
  function renderTree(nodes: OrgTreeNode[], depth: number): React.ReactNode {
    return nodes.map((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedOrgId === node.id;

      return (
        <div key={node.id}>
          <div
            className={cn(
              'group flex items-center gap-1 rounded-md px-2 py-1.5 cursor-pointer transition-colors',
              isSelected ? 'bg-primary/10' : 'hover:bg-surface-2'
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => setSelectedOrgId(node.id)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="flex h-4 w-4 items-center justify-center text-faint hover:text-foreground"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                'flex-1 truncate text-[13px]',
                isSelected ? 'font-bold text-primary' : 'text-foreground'
              )}
            >
              {node.name}
            </span>
            <span className="text-[10px] text-faint">{orgTypeLabel[node.orgType]}</span>
          </div>
          {hasChildren && isExpanded && renderTree(node.children, depth + 1)}
        </div>
      );
    });
  }

  return (
    <div className="flex gap-4">
      {/* 左侧：组织树 */}
      <div className="flex w-72 flex-col rounded-lg border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
          <span className="text-[13px] font-bold text-foreground">组织架构</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-[12px]"
            onClick={() => handleAddSub('org-cnpc')}
          >
            <Plus className="h-3.5 w-3.5" />
            新增
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">{renderTree(tree, 0)}</div>
      </div>

      {/* 右侧：单位详情 */}
      <div className="flex-1 space-y-4">
        {selectedOrg && (
          <>
            {/* 单位信息卡片 */}
            <div className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">{selectedOrg.name}</h2>
                      <Badge variant="outline" className="text-[11px] font-normal text-faint">
                        {orgTypeLabel[selectedOrg.orgType]}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[11px] font-normal',
                          selectedOrg.status === 'active'
                            ? 'border-cyan/30 text-cyan'
                            : 'border-faint text-faint'
                        )}
                      >
                        {selectedOrg.status === 'active' ? '启用' : '停用'}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-[12px] text-faint">
                      <span>编码: {selectedOrg.code}</span>
                      <span>层级: L{selectedOrg.level}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedOrg.path}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => handleEdit(selectedOrg.id)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => handleAddSub(selectedOrg.id)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    新增子单位
                  </Button>
                </div>
              </div>

              {/* 统计 */}
              <div className="mt-4 flex gap-6 border-t border-line pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan" />
                  <span className="text-[13px] text-muted-foreground">直属成员</span>
                  <span className="text-[15px] font-bold text-foreground">{orgUsers.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-[13px] text-muted-foreground">下级单位</span>
                  <span className="text-[15px] font-bold text-foreground">{childOrgs.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple" />
                  <span className="text-[13px] text-muted-foreground">管理员</span>
                  <span className="text-[15px] font-bold text-foreground">
                    {orgUsers.filter((u) => u.roleId === 'role-admin').length}
                  </span>
                </div>
              </div>
            </div>

            {/* 下级单位列表 */}
            {childOrgs.length > 0 && (
              <div className="rounded-lg border border-line bg-white">
                <div className="border-b border-line px-4 py-2.5">
                  <span className="text-[13px] font-bold text-foreground">下级单位</span>
                  <span className="ml-2 text-[12px] text-faint">({childOrgs.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3">
                  {childOrgs.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setSelectedOrgId(org.id)}
                      className="flex items-center gap-2.5 rounded-md border border-line px-3 py-2.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate text-[13px] font-medium text-foreground">
                          {org.name}
                        </div>
                        <div className="text-[11px] text-faint">
                          {orgTypeLabel[org.orgType]} · {users.filter((u) => u.orgId === org.id).length} 人
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 成员列表 */}
            <div className="rounded-lg border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-foreground">直属成员</span>
                  <span className="text-[12px] text-faint">({orgUsers.length})</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-[12px]">
                  <Plus className="h-3.5 w-3.5" />
                  添加成员
                </Button>
              </div>
              <div className="divide-y divide-line">
                {orgUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {user.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-foreground">{user.name}</span>
                        <span className="text-[11px] text-faint">{user.title}</span>
                      </div>
                      <div className="text-[11px] text-faint">
                        {user.employeeId} · {user.phone}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[11px]',
                        user.roleId === 'role-admin'
                          ? 'border-primary/30 bg-primary/5 text-primary'
                          : 'border-amber/30 bg-amber/5 text-amber'
                      )}
                    >
                      {user.roleName}
                    </Badge>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-[12px]',
                        user.status === 'active' ? 'text-cyan' : 'text-faint'
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          user.status === 'active' ? 'bg-cyan' : 'bg-faint'
                        )}
                      />
                      {user.status === 'active' ? '活跃' : '停用'}
                    </span>
                  </div>
                ))}
                {orgUsers.length === 0 && (
                  <div className="flex h-20 items-center justify-center text-[13px] text-faint">
                    该单位暂无直属成员
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 新增/编辑单位弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingOrgId ? '编辑单位' : '新增单位'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[13px]">单位名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="如 算法课题组"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">单位编码 *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="如 ALGO-001"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">单位类型</Label>
              <Select
                value={formData.orgType}
                onValueChange={(v) => setFormData({ ...formData, orgType: v as OrgForm['orgType'] })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="institute">研究院</SelectItem>
                  <SelectItem value="department">研究所</SelectItem>
                  <SelectItem value="group_team">课题组</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">上级单位</Label>
              <Select
                value={formData.parentId}
                onValueChange={(v) => setFormData({ ...formData, parentId: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="请选择上级单位" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9">
              取消
            </Button>
            <Button onClick={handleSubmit} className="h-9">
              {editingOrgId ? '保存修改' : '创建单位'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

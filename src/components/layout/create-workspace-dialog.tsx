'use client';

import { useState } from 'react';
import { Building2, Check, ArrowRight, User2 } from 'lucide-react';
import type { WorkspaceBinding } from '@/lib/types/auth';
import { organizations, orgTypeLabel } from '@/lib/mock/organizations';
import { users } from '@/lib/mock/users';
import { currentUserId, currentUserName } from '@/lib/mock/workspaces';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (workspace: WorkspaceBinding) => void;
}

const orgTypeOptions = [
  { value: 'institute', label: '研究院' },
  { value: 'department', label: '研究所' },
  { value: 'group_team', label: '课题组' },
];

export function CreateWorkspaceDialog({ open, onOpenChange, onSuccess }: CreateWorkspaceDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    orgType: 'group_team' as 'institute' | 'department' | 'group_team',
    parentId: 'org-ripp',
    firstAdminId: currentUserId,
    description: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const parentOrg = organizations.find((o) => o.id === formData.parentId);
  const firstAdmin = users.find((u) => u.id === formData.firstAdminId);

  // 自动生成编码建议
  function generateCode(name: string, parentId: string): string {
    const parent = organizations.find((o) => o.id === parentId);
    if (!parent) return '';
    const prefix = parent.code;
    // 取名称前 2-3 个拼音首字母（简化：取名称前 3 字符大写）
    const suffix = name.replace(/[\s\u4e00-\u9fa5]/g, '').toUpperCase().slice(0, 6) ||
      name.slice(0, 3);
    return `${prefix}-${suffix}`;
  }

  function handleSubmit() {
    if (!formData.name || !formData.code || !formData.parentId) return;

    const newWorkspace: WorkspaceBinding = {
      id: `wb-${Date.now()}`,
      userId: currentUserId,
      userName: currentUserName,
      orgId: `org-${Date.now()}`,
      orgName: formData.name,
      orgPath: parentOrg ? `${parentOrg.name} / ${formData.name}` : formData.name,
      roleId: 'role-admin',
      roleName: '单位管理员',
      isActive: false,
      source: 'created',
      validFrom: new Date().toISOString().slice(0, 10),
      status: 'active',
    };

    onSuccess?.(newWorkspace);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '', code: '', orgType: 'group_team', parentId: 'org-ripp',
        firstAdminId: currentUserId, description: '', reason: '',
      });
      setSubmitted(false);
    }, 1500);
  }

  // 可选父单位（level 1-2，可以创建子单位）
  const parentOptions = organizations.filter((o) => o.level <= 2 && o.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">创建工作台</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan/10">
              <Check className="h-6 w-6 text-cyan" />
            </div>
            <p className="mt-3 text-[14px] font-medium text-foreground">创建申请已提交</p>
            <p className="mt-1 text-[12px] text-faint">上级单位管理员审批后将自动创建工作台</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* 工作台信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[13px]">工作台名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      code: generateCode(name, formData.parentId),
                    });
                  }}
                  placeholder="如 CO2加氢催化课题组"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">工作台编码 *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="自动生成"
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[13px]">工作台类型</Label>
                <Select
                  value={formData.orgType}
                  onValueChange={(v) => setFormData({ ...formData, orgType: v as typeof formData.orgType })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orgTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px]">上级单位 *</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(v) => setFormData({
                    ...formData,
                    parentId: v,
                    code: generateCode(formData.name, v),
                  })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px]">工作台描述</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简要描述工作台的研究方向和职责"
                className="min-h-[50px] resize-none text-[12px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px]">首任负责人</Label>
              <Select
                value={formData.firstAdminId}
                onValueChange={(v) => setFormData({ ...formData, firstAdminId: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={currentUserId}>
                    <span className="flex items-center gap-2">
                      <User2 className="h-3 w-3 text-faint" />
                      {currentUserName}（我）
                    </span>
                  </SelectItem>
                  {users
                    .filter((u) => u.id !== currentUserId && u.status === 'active')
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        <span className="flex items-center gap-2">
                          <span className="text-[11px] text-faint">{u.employeeId}</span>
                          {u.name} · {u.title}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-faint">首任负责人将自动获得「单位管理员」角色</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px]">创建理由 *</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="说明为什么需要新建工作台"
                className="min-h-[50px] resize-none text-[12px]"
              />
            </div>

            {/* 预览卡片 */}
            {formData.name && (
              <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                <div className="mb-1 text-[11px] font-bold text-primary">创建预览</div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="truncate text-[13px] font-bold text-foreground">{formData.name}</div>
                    <div className="text-[11px] text-faint">
                      {formData.code} · {orgTypeLabel[formData.orgType]} · 隶属 {parentOrg?.name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!submitted && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9">
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.code || !formData.reason}
              className="h-9 gap-1.5"
            >
              提交创建申请
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

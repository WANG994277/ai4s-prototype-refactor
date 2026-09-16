'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, Eye, MousePointerClick, Server } from 'lucide-react';
import type { Role } from '@/lib/types/auth';
import { roles } from '@/lib/mock/roles';
import { permissionGroups, permissionMap } from '@/lib/mock/permissions';
import { dataScopeLabel, dataScopeColor } from '@/lib/mock/roles';
import { users } from '@/lib/mock/users';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const permTypeIcon: Record<string, React.ElementType> = {
  menu: Eye,
  action: MousePointerClick,
  api: Server,
};

const permTypeLabel: Record<string, string> = {
  menu: '菜单',
  action: '操作',
  api: '接口',
};

export default function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-admin');
  const [rolePermissions, setRolePermissions] = useState<Record<string, Set<string>>>(() => {
    const map: Record<string, Set<string>> = {};
    for (const role of roles) {
      map[role.id] = new Set(role.permissionIds);
    }
    return map;
  });

  const selectedRole = roles.find((r) => r.id === selectedRoleId)!;
  const currentPermIds = rolePermissions[selectedRoleId] || new Set<string>();
  const userCount = users.filter((u) => u.roleId === selectedRoleId).length;

  function togglePermission(permId: string) {
    if (selectedRole.isBuiltin) return; // 内置角色不可编辑
    setRolePermissions((prev) => {
      const next = { ...prev };
      const set = new Set(next[selectedRoleId]);
      if (set.has(permId)) set.delete(permId);
      else set.add(permId);
      next[selectedRoleId] = set;
      return next;
    });
  }

  function toggleGroup(groupPerms: string[]) {
    if (selectedRole.isBuiltin) return;
    setRolePermissions((prev) => {
      const next = { ...prev };
      const set = new Set(next[selectedRoleId]);
      const allChecked = groupPerms.every((id) => set.has(id));
      if (allChecked) {
        groupPerms.forEach((id) => set.delete(id));
      } else {
        groupPerms.forEach((id) => set.add(id));
      }
      next[selectedRoleId] = set;
      return next;
    });
  }

  // 统计选中权限数
  const totalPerms = permissionGroups.reduce((acc, g) => acc + g.permissions.length, 0);
  const checkedCount = currentPermIds.size;

  return (
    <div className="flex gap-4">
      {/* 左侧：角色列表 */}
      <div className="w-72 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-foreground">角色列表</span>
        </div>
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          const count = users.filter((u) => u.roleId === role.id).length;
          return (
            <Card
              key={role.id}
              className={cn(
                'cursor-pointer border p-3.5 transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-line hover:border-line-2'
              )}
              onClick={() => setSelectedRoleId(role.id)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    isSelected ? 'bg-primary/15' : 'bg-surface-2'
                  )}
                >
                  <ShieldCheck
                    className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-muted-foreground')}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-foreground">{role.name}</span>
                    {role.isBuiltin && (
                      <Lock className="h-3 w-3 text-faint" />
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-faint">
                    <span>{count} 用户</span>
                    <span>·</span>
                    <span>{role.permissionIds.length} 权限</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 右侧：角色详情 + 权限矩阵 */}
      <div className="flex-1 space-y-4">
        {/* 角色信息 */}
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">{selectedRole.name}</h2>
                  <Badge variant="outline" className="text-[11px] font-normal text-faint">
                    {selectedRole.code}
                  </Badge>
                  {selectedRole.isBuiltin && (
                    <Badge
                      variant="outline"
                      className="border-amber/30 bg-amber/5 text-[11px] font-normal text-amber"
                    >
                      <Lock className="mr-1 h-2.5 w-2.5" />
                      内置角色
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{selectedRole.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
                  dataScopeColor[selectedRole.dataScope]
                )}
              >
                {dataScopeLabel[selectedRole.dataScope]}
              </span>
            </div>
          </div>

          {/* 统计 */}
          <div className="mt-4 flex gap-6 border-t border-line pt-4">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-faint">绑定用户</span>
              <span className="text-[15px] font-bold text-foreground">{userCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-faint">已授权限</span>
              <span className="text-[15px] font-bold text-primary">{checkedCount}</span>
              <span className="text-[12px] text-faint">/ {totalPerms}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-faint">权限覆盖率</span>
              <span className="text-[15px] font-bold text-cyan">
                {totalPerms > 0 ? Math.round((checkedCount / totalPerms) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* 权限矩阵 */}
        <div className="rounded-lg border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-foreground">权限配置</span>
              {selectedRole.isBuiltin && (
                <span className="text-[11px] text-amber">
                  内置角色权限不可修改
                </span>
              )}
            </div>
            <span className="text-[12px] text-faint">
              勾选权限点以授予该角色
            </span>
          </div>

          <div className="divide-y divide-line">
            {permissionGroups.map((group) => {
              const groupPermIds = group.permissions.map((p) => p.id);
              const checkedCount = groupPermIds.filter((id) => currentPermIds.has(id)).length;
              const allChecked = checkedCount === groupPermIds.length;
              const someChecked = checkedCount > 0 && !allChecked;

              return (
                <div key={group.resource} className="px-4 py-3">
                  {/* 分组标题 */}
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={allChecked ? true : someChecked ? 'indeterminate' : false}
                      onCheckedChange={() => toggleGroup(groupPermIds)}
                      disabled={selectedRole.isBuiltin}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-[13px] font-bold text-foreground">{group.label}</span>
                    <span className="text-[11px] text-faint">
                      {checkedCount} / {groupPermIds.length}
                    </span>
                  </div>

                  {/* 权限点列表 */}
                  <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1.5 pl-7">
                    {group.permissions.map((perm) => {
                      const isChecked = currentPermIds.has(perm.id);
                      const Icon = permTypeIcon[perm.type] || Eye;
                      return (
                        <label
                          key={perm.id}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
                            selectedRole.isBuiltin
                              ? 'cursor-default'
                              : 'cursor-pointer hover:bg-surface-2'
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => togglePermission(perm.id)}
                            disabled={selectedRole.isBuiltin}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <div className="flex flex-col overflow-hidden">
                            <span
                              className={cn(
                                'text-[12px] truncate',
                                isChecked ? 'font-medium text-foreground' : 'text-muted-foreground'
                              )}
                            >
                              {perm.name}
                            </span>
                            <span className="text-[10px] text-faint">
                              {permTypeLabel[perm.type]} · {perm.code}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

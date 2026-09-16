'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronsUpDown,
  Check,
  Plus,
  Building2,
  Clock,
  Layers,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import type { WorkspaceBinding } from '@/lib/types/auth';
import { myWorkspaces, currentUserName } from '@/lib/mock/workspaces';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { JoinWorkspaceDialog } from './join-workspace-dialog';
import { CreateWorkspaceDialog } from './create-workspace-dialog';

const userTitle = '催化化工·高级研究员';
const displayName = '张博士';

export function UserProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<WorkspaceBinding[]>(myWorkspaces);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.isActive) || workspaces[0];
  const pendingCount = 1;

  function handleSwitch(bindingId: string) {
    setWorkspaces((prev) =>
      prev.map((w) => ({ ...w, isActive: w.id === bindingId }))
    );
    setOpen(false);
    router.refresh();
  }

  function handleJoinSuccess(newWorkspace: WorkspaceBinding) {
    setWorkspaces((prev) => [...prev, { ...newWorkspace, isActive: false }]);
    setJoinDialogOpen(false);
    setOpen(false);
  }

  function handleCreateSuccess(newWorkspace: WorkspaceBinding) {
    setWorkspaces((prev) => [...prev, { ...newWorkspace, isActive: false }]);
    setCreateDialogOpen(false);
    setOpen(false);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-surface-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              张
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[12px] font-bold text-foreground leading-tight">{displayName}</span>
              <span className="text-[10px] text-faint leading-tight">{userTitle}</span>
            </div>
            <ChevronsUpDown className="h-3 w-3 text-faint" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          {/* 我的工作台 */}
          <div className="border-b border-line px-3 py-2">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-faint">
              我的工作台
            </div>
            <div className="space-y-0.5">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleSwitch(ws.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors',
                    ws.isActive ? 'bg-primary/5' : 'hover:bg-surface-2'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                      ws.isActive ? 'bg-primary/10' : 'bg-surface-2'
                    )}
                  >
                    <Building2 className={cn('h-3.5 w-3.5', ws.isActive ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('truncate text-[13px] font-medium', ws.isActive ? 'text-primary' : 'text-foreground')}>
                        {ws.orgName}
                      </span>
                      {ws.isActive && <Check className="h-3 w-3 shrink-0 text-primary" />}
                    </div>
                    <div className="text-[11px] text-faint">{ws.roleName}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'shrink-0 text-[10px] font-normal',
                      ws.roleId === 'role-admin'
                        ? 'border-primary/30 bg-primary/5 text-primary'
                        : 'border-amber/30 bg-amber/5 text-amber'
                    )}
                  >
                    {ws.roleName}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* 待审批提示 */}
          {pendingCount > 0 && (
            <div className="border-b border-line px-3 py-2">
              <div className="flex items-center gap-2 text-[12px] text-amber">
                <Clock className="h-3.5 w-3.5" />
                <span>{pendingCount} 个申请待审批</span>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push('/manage/workspaces');
                  }}
                  className="ml-auto text-[12px] font-medium text-primary hover:underline"
                >
                  查看
                </button>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="border-b border-line p-2">
            <button
              onClick={() => setJoinDialogOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              申请加入工作台
            </button>
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Building2 className="h-3.5 w-3.5" />
              创建工作台
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push('/manage/workspaces');
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Layers className="h-3.5 w-3.5" />
              工作台管理
            </button>
          </div>

          {/* 个人操作 */}
          <div className="p-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/manage/users');
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <User className="h-3.5 w-3.5" />
              个人信息
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push('/manage/roles');
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Settings className="h-3.5 w-3.5" />
              账号设置
            </button>
            <button
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-destructive/80 transition-colors hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              退出登录
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <JoinWorkspaceDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onSuccess={handleJoinSuccess}
      />
      <CreateWorkspaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}

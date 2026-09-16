'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Building2,
  Check,
  X,
  Clock,
  ArrowRight,
  User2,
  Layers,
  ChevronRight,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  ShieldCheck,
} from 'lucide-react';
import type { User } from '@/lib/types/auth';
import type { WorkspaceApplication } from '@/lib/types/auth';
import { users as mockUsers } from '@/lib/mock/users';
import {
  applicationTypeLabel,
  applicationStatusLabel,
  validPeriodLabel,
  pendingApplications,
  myApplications,
  myWorkspaces,
  currentUserId,
  currentUserName,
} from '@/lib/mock/workspaces';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { JoinWorkspaceDialog } from '@/components/layout/join-workspace-dialog';
import { CreateWorkspaceDialog } from '@/components/layout/create-workspace-dialog';

/* ===================== Types ===================== */

type WsTab = 'mine' | 'pending' | 'history';

interface UserFormData {
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  title: string;
  status: 'active' | 'inactive';
}

const emptyForm: UserFormData = {
  name: '',
  employeeId: '',
  phone: '',
  email: '',
  title: '',
  status: 'active',
};

/* ===================== Page ===================== */

type MainTab = 'permissions' | 'approval';

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('permissions');

  return (
    <div className="space-y-6">
      {/* 页面标题 + Tab 切换 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">权限管理</h1>
            <p className="text-[12px] text-faint">管理用户账号与工作台权限</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors ${
              activeTab === 'permissions'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            权限管理
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors ${
              activeTab === 'approval'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            权限审批
          </button>
        </div>
      </div>

      {/* 面板内容 */}
      {activeTab === 'permissions' && <UsersPanel />}
      {activeTab === 'approval' && <WorkspacesPanel />}
    </div>
  );
}

/* ===================== 权限管理面板 ===================== */

function UsersPanel() {
  const [userList, setUserList] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const filteredUsers = userList.filter((u) => {
    const matchSearch =
      !searchQuery ||
      u.name.includes(searchQuery) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: userList.length,
    active: userList.filter((u) => u.status === 'active').length,
    inactive: userList.filter((u) => u.status === 'inactive').length,
  };

  function handleAdd() {
    setEditingUserId(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  }

  function handleEdit(user: User) {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      employeeId: user.employeeId,
      phone: user.phone,
      email: user.email,
      title: user.title,
      status: user.status,
    });
    setDialogOpen(true);
  }

  function handleDelete(user: User) {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (deletingUser) {
      setUserList((prev) => prev.filter((u) => u.id !== deletingUser.id));
    }
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  }

  function handleToggleStatus(user: User) {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  }

  function handleSubmit() {
    if (!formData.name || !formData.employeeId) return;

    if (editingUserId) {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                ...formData,
              }
            : u
        )
      );
    } else {
      const newUser: User = {
        id: `u-${Date.now()}`,
        ...formData,
        orgId: '',
        orgName: '',
        roleId: 'role-researcher',
        roleName: '研究员',
        avatarUrl: undefined,
        createdAt: new Date().toISOString().slice(0, 10),
        lastActiveAt: '-',
      };
      setUserList((prev) => [...prev, newUser]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="用户总数" value={stats.total} color="text-primary" />
        <StatCard label="活跃用户" value={stats.active} color="text-cyan" />
        <StatCard label="停用用户" value={stats.inactive} color="text-muted-foreground" />
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <Input
            placeholder="搜索姓名 / 工号 / 邮箱"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-[13px]"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-28 text-[13px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">活跃</SelectItem>
            <SelectItem value="inactive">停用</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Button size="sm" onClick={handleAdd} className="h-8 gap-1.5">
            <Plus className="h-4 w-4" />
            新增用户
          </Button>
        </div>
      </div>

      {/* 用户表格 */}
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-line bg-surface-2">
              <TableHead className="w-[180px] text-[12px] font-bold text-faint">姓名 / 工号</TableHead>
              <TableHead className="w-[120px] text-[12px] font-bold text-faint">职称</TableHead>
              <TableHead className="text-[12px] font-bold text-faint">邮箱</TableHead>
              <TableHead className="w-[120px] text-[12px] font-bold text-faint">所属单位</TableHead>
              <TableHead className="w-[80px] text-[12px] font-bold text-faint">状态</TableHead>
              <TableHead className="w-[140px] text-[12px] font-bold text-faint">最后活跃</TableHead>
              <TableHead className="w-[60px] text-[12px] font-bold text-faint">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-line hover:bg-surface-2">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {user.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-foreground">{user.name}</span>
                      <span className="text-[11px] text-faint">{user.employeeId}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[13px] text-muted-foreground">{user.title}</TableCell>
                <TableCell className="text-[13px] text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-[13px] text-muted-foreground">{user.orgName || '-'}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[12px] font-medium',
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
                </TableCell>
                <TableCell className="text-[12px] text-faint">{user.lastActiveAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => handleEdit(user)} className="text-[13px]">
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)} className="text-[13px]">
                        {user.status === 'active' ? (
                          <>
                            <UserX className="mr-2 h-3.5 w-3.5" />
                            停用
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-3.5 w-3.5" />
                            启用
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(user)}
                        className="text-[13px] text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-[13px] text-faint">
                  暂无匹配的用户
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 新增/编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingUserId ? '编辑用户' : '新增用户'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[13px]">姓名 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">工号 *</Label>
              <Input
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="如 EMP-2024001"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">手机号</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="138****0000"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">邮箱</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@xinghuo.com"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">职称</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="如 高级工程师"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">状态</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as 'active' | 'inactive' })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9">
              取消
            </Button>
            <Button onClick={handleSubmit} className="h-9">
              {editingUserId ? '保存修改' : '创建用户'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">确认删除用户</DialogTitle>
          </DialogHeader>
          <p className="py-2 text-[13px] text-muted-foreground">
            确定要删除用户「{deletingUser?.name}」（{deletingUser?.employeeId}）吗？此操作不可撤销。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="h-9">
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="h-9">
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ===================== 权限审批面板 ===================== */

function WorkspacesPanel() {
  const [tab, setTab] = useState<WsTab>('mine');
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [pending, setPending] = useState<WorkspaceApplication[]>(pendingApplications);
  const [history, setHistory] = useState<WorkspaceApplication[]>(myApplications);

  function handleApprove(app: WorkspaceApplication) {
    setPending((prev) => prev.filter((a) => a.id !== app.id));
    setHistory((prev) => [
      {
        ...app,
        status: 'approved',
        reviewerId: currentUserId,
        reviewerName: currentUserName,
        reviewComment: reviewComment || '同意',
        reviewedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...prev,
    ]);
    setReviewingId(null);
    setReviewComment('');
  }

  function handleReject(app: WorkspaceApplication) {
    if (!reviewComment) return;
    setPending((prev) => prev.filter((a) => a.id !== app.id));
    setHistory((prev) => [
      {
        ...app,
        status: 'rejected',
        reviewerId: currentUserId,
        reviewerName: currentUserName,
        reviewComment,
        reviewedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...prev,
    ]);
    setReviewingId(null);
    setReviewComment('');
  }

  function handleRevoke(app: WorkspaceApplication) {
    setHistory((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? { ...a, status: 'revoked' as const }
          : a
      )
    );
  }

  const pendingCount = pending.length;
  const activeCount = myWorkspaces.filter((w) => w.status === 'active').length;
  const historyApproved = history.filter((a) => a.status === 'approved').length;

  return (
    <>
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-3">
        <WsStatCard
          icon={Layers}
          label="已加入工作台"
          value={activeCount}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <WsStatCard
          icon={Clock}
          label="待审批申请"
          value={pendingCount}
          color="text-amber"
          bgColor="bg-amber/10"
        />
        <WsStatCard
          icon={CheckCircle2}
          label="已通过申请"
          value={historyApproved}
          color="text-cyan"
          bgColor="bg-cyan/10"
        />
        <WsStatCard
          icon={FileText}
          label="申请总数"
          value={history.length}
          color="text-muted-foreground"
          bgColor="bg-surface-2"
        />
      </div>

      {/* Tab 切换 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-white px-2">
          <WsTabButton active={tab === 'mine'} onClick={() => setTab('mine')}>
            我的工作台
          </WsTabButton>
          <WsTabButton active={tab === 'pending'} onClick={() => setTab('pending')} badge={pendingCount}>
            待我审批
          </WsTabButton>
          <WsTabButton active={tab === 'history'} onClick={() => setTab('history')}>
            我的申请
          </WsTabButton>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 gap-1.5 text-[13px]" onClick={() => setJoinOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            申请加入
          </Button>
          <Button className="h-8 gap-1.5 text-[13px]" onClick={() => setCreateOpen(true)}>
            <Building2 className="h-3.5 w-3.5" />
            创建工作台
          </Button>
        </div>
      </div>

      {/* 我的工作台 */}
      {tab === 'mine' && (
        <div className="grid grid-cols-3 gap-3">
          {myWorkspaces.map((ws) => (
            <Card key={ws.id} className={cn('relative overflow-hidden', ws.isActive && 'border-primary/30')}>
              {ws.isActive && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-primary" />
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-md',
                      ws.isActive ? 'bg-primary/10' : 'bg-surface-2'
                    )}>
                      <Building2 className={cn('h-4 w-4', ws.isActive ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <CardTitle className="text-[14px]">{ws.orgName}</CardTitle>
                      <div className="mt-0.5 text-[11px] text-faint">{ws.orgPath}</div>
                    </div>
                  </div>
                  {ws.isActive && (
                    <Badge className="text-[10px] font-normal">当前</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="text-faint">来源</span>
                  <span className="text-muted-foreground">
                    {ws.source === 'direct' ? '直接分配' : ws.source === 'application' ? '申请加入' : '创建工作台'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <Calendar className="h-3 w-3 text-faint" />
                  <span className="text-muted-foreground">
                    {ws.validFrom}
                    {ws.validTo && ` ~ ${ws.validTo}`}
                  </span>
                </div>
                {!ws.isActive && (
                  <Button variant="outline" className="mt-1 h-7 w-full gap-1.5 text-[12px]">
                    切换到此工作台
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 待我审批 */}
      {tab === 'pending' && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <EmptyState icon={CheckCircle2} text="暂无待审批申请" />
          ) : (
            pending.map((app) => (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                      {app.applicantName.slice(-2)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-foreground">{app.applicantName}</span>
                        <Badge variant="outline" className={cn('text-[10px]', app.type === 'create' ? 'border-primary/30 text-primary' : 'border-cyan/30 text-cyan')}>
                          {applicationTypeLabel[app.type]}
                        </Badge>
                        <Badge variant="outline" className={cn('text-[10px]', app.status === 'pending' ? 'border-amber/30 bg-amber/5 text-amber' : 'border-primary/30 bg-primary/5 text-primary')}>
                          {applicationStatusLabel[app.status]}
                        </Badge>
                        <span className="ml-auto text-[11px] text-faint">{app.submittedAt}</span>
                      </div>

                      {app.type === 'join' ? (
                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                          <span>申请加入</span>
                          <ChevronRight className="h-3 w-3 text-faint" />
                          <span className="font-medium text-foreground">{app.targetOrgName}</span>
                          {app.validPeriod && (
                            <span className="text-[11px] text-faint">({validPeriodLabel[app.validPeriod]})</span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                            <span>创建工作台</span>
                            <span className="font-medium text-foreground">{app.newOrgName}</span>
                            <Badge variant="outline" className="text-[10px] font-normal">
                              {app.newOrgCode}
                            </Badge>
                          </div>
                          {app.description && (
                            <div className="text-[12px] text-faint">{app.description}</div>
                          )}
                          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                            <User2 className="h-3 w-3 text-faint" />
                            <span>首任负责人：{app.firstAdminName}</span>
                          </div>
                        </div>
                      )}

                      <div className="rounded-md bg-surface-2 px-3 py-1.5 text-[12px] text-muted-foreground">
                        <span className="font-medium text-foreground">申请理由：</span>
                        {app.reason}
                      </div>

                      {reviewingId === app.id ? (
                        <div className="space-y-2 rounded-md border border-primary/20 bg-primary/5 p-3">
                          <Textarea
                            placeholder="输入审批意见（驳回时必填）"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="min-h-[60px] resize-none text-[12px]"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="h-7 text-[12px]"
                              onClick={() => { setReviewingId(null); setReviewComment(''); }}
                            >
                              取消
                            </Button>
                            <Button
                              variant="outline"
                              className="h-7 gap-1 text-[12px] border-destructive/30 text-destructive hover:bg-destructive/5"
                              onClick={() => handleReject(app)}
                              disabled={!reviewComment}
                            >
                              <XCircle className="h-3 w-3" />
                              驳回
                            </Button>
                            <Button
                              className="h-7 gap-1 text-[12px]"
                              onClick={() => handleApprove(app)}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              通过
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="h-7 gap-1 text-[12px]"
                            onClick={() => setReviewingId(app.id)}
                          >
                            <Check className="h-3 w-3" />
                            审批
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* 我的申请 */}
      {tab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <EmptyState icon={FileText} text="暂无申请记录" />
          ) : (
            history.map((app) => (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      app.type === 'create' ? 'bg-primary/10' : 'bg-surface-2'
                    )}>
                      {app.type === 'create' ? (
                        <Building2 className="h-4 w-4 text-primary" />
                      ) : (
                        <User2 className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-foreground">
                          {app.type === 'join' ? `加入 ${app.targetOrgName}` : `创建 ${app.newOrgName}`}
                        </span>
                        <Badge variant="outline" className={cn('text-[10px]', getWsStatusBadgeClass(app.status))}>
                          {applicationStatusLabel[app.status]}
                        </Badge>
                        <span className="ml-auto text-[11px] text-faint">
                          提交于 {app.submittedAt}
                        </span>
                      </div>

                      <div className="text-[12px] text-muted-foreground">
                        <span className="text-faint">理由：</span>
                        {app.reason}
                      </div>

                      {app.type === 'join' && app.validPeriod && (
                        <div className="flex items-center gap-2 text-[12px]">
                          <Calendar className="h-3 w-3 text-faint" />
                          <span className="text-muted-foreground">有效期：{validPeriodLabel[app.validPeriod]}</span>
                        </div>
                      )}

                      {app.type === 'create' && app.description && (
                        <div className="text-[12px] text-faint">{app.description}</div>
                      )}

                      {app.reviewedAt && (
                        <div className={cn(
                          'flex items-start gap-2 rounded-md px-3 py-1.5 text-[12px]',
                          app.status === 'approved' ? 'bg-cyan/5 text-cyan' : 'bg-destructive/5 text-destructive'
                        )}>
                          {app.status === 'approved' ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          )}
                          <div>
                            <span className="font-medium">{app.reviewerName}</span>
                            <span className="text-faint"> 审批于 {app.reviewedAt}</span>
                            {app.reviewComment && (
                              <div className="mt-0.5">{app.reviewComment}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {app.status === 'pending' && (
                        <Button
                          variant="outline"
                          className="h-7 gap-1 text-[12px] text-muted-foreground"
                          onClick={() => handleRevoke(app)}
                        >
                          <X className="h-3 w-3" />
                          撤销申请
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* 弹窗 */}
      <JoinWorkspaceDialog open={joinOpen} onOpenChange={setJoinOpen} />
      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}

/* ===================== 共用小组件 ===================== */

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-line bg-white px-4 py-3">
      <div className="text-[11px] font-medium text-faint">{label}</div>
      <div className={cn('mt-1 text-2xl font-black', color)}>{value}</div>
    </div>
  );
}

function WsStatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-md', bgColor)}>
          <Icon className={cn('h-4 w-4', color)} />
        </div>
        <div>
          <div className="text-xl font-black text-foreground">{value}</div>
          <div className="text-[11px] text-faint">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function WsTabButton({
  active,
  onClick,
  children,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative border-b-2 px-3 py-2 text-[13px] font-medium transition-colors',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
        <Icon className="h-6 w-6 text-faint" />
      </div>
      <p className="mt-3 text-[13px] text-faint">{text}</p>
    </div>
  );
}

function getWsStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved':
      return 'border-cyan/30 bg-cyan/5 text-cyan';
    case 'rejected':
      return 'border-destructive/30 bg-destructive/5 text-destructive';
    case 'revoked':
      return 'border-faint/30 bg-faint/5 text-faint';
    case 'pending':
      return 'border-amber/30 bg-amber/5 text-amber';
    case 'reviewing':
      return 'border-primary/30 bg-primary/5 text-primary';
    default:
      return '';
  }
}

'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from 'lucide-react';
import type { User } from '@/lib/types/auth';
import { users as mockUsers } from '@/lib/mock/users';
import { organizations } from '@/lib/mock/organizations';
import { roles } from '@/lib/mock/roles';
import { dataScopeLabel, dataScopeColor } from '@/lib/mock/roles';
import { orgTypeLabel } from '@/lib/mock/organizations';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserFormData {
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  title: string;
  orgId: string;
  roleId: string;
  status: 'active' | 'inactive';
}

const emptyForm: UserFormData = {
  name: '',
  employeeId: '',
  phone: '',
  email: '',
  title: '',
  orgId: '',
  roleId: 'role-researcher',
  status: 'active',
};

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrg, setFilterOrg] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // 筛选
  const filteredUsers = userList.filter((u) => {
    const matchSearch =
      !searchQuery ||
      u.name.includes(searchQuery) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchOrg = filterOrg === 'all' || u.orgId === filterOrg;
    const matchRole = filterRole === 'all' || u.roleId === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchOrg && matchRole && matchStatus;
  });

  const stats = {
    total: userList.length,
    active: userList.filter((u) => u.status === 'active').length,
    admins: userList.filter((u) => u.roleId === 'role-admin').length,
    researchers: userList.filter((u) => u.roleId === 'role-researcher').length,
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
      orgId: user.orgId,
      roleId: user.roleId,
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
    if (!formData.name || !formData.employeeId || !formData.orgId) return;

    const org = organizations.find((o) => o.id === formData.orgId);
    const role = roles.find((r) => r.id === formData.roleId);
    if (!org || !role) return;

    if (editingUserId) {
      // 编辑
      setUserList((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                ...formData,
                orgName: org.name,
                roleName: role.name,
              }
            : u
        )
      );
    } else {
      // 新增
      const newUser: User = {
        id: `u-${Date.now()}`,
        ...formData,
        orgName: org.name,
        roleName: role.name,
        avatarUrl: undefined,
        createdAt: new Date().toISOString().slice(0, 10),
        lastActiveAt: '-',
      };
      setUserList((prev) => [...prev, newUser]);
    }
    setDialogOpen(false);
  }

  // 可选择单位（仅 level 3，即最末级）
  const selectableOrgs = organizations.filter((o) => o.level >= 2);

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="用户总数" value={stats.total} color="text-primary" />
        <StatCard label="活跃用户" value={stats.active} color="text-cyan" />
        <StatCard label="单位管理员" value={stats.admins} color="text-purple" />
        <StatCard label="研究员" value={stats.researchers} color="text-amber" />
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
        <Select value={filterOrg} onValueChange={setFilterOrg}>
          <SelectTrigger className="h-8 w-40 text-[13px]">
            <SelectValue placeholder="所属单位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部单位</SelectItem>
            {selectableOrgs.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="h-8 w-32 text-[13px]">
            <SelectValue placeholder="角色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部角色</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              <TableHead className="w-[160px] text-[12px] font-bold text-faint">姓名 / 工号</TableHead>
              <TableHead className="w-[120px] text-[12px] font-bold text-faint">职称</TableHead>
              <TableHead className="text-[12px] font-bold text-faint">所属单位</TableHead>
              <TableHead className="w-[120px] text-[12px] font-bold text-faint">角色</TableHead>
              <TableHead className="w-[100px] text-[12px] font-bold text-faint">数据权限</TableHead>
              <TableHead className="w-[80px] text-[12px] font-bold text-faint">状态</TableHead>
              <TableHead className="w-[140px] text-[12px] font-bold text-faint">最后活跃</TableHead>
              <TableHead className="w-[60px] text-[12px] font-bold text-faint">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const role = roles.find((r) => r.id === user.roleId);
              return (
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
                  <TableCell className="text-[13px] text-muted-foreground">{user.orgName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[11px] font-medium',
                        user.roleId === 'role-admin'
                          ? 'border-primary/30 bg-primary/5 text-primary'
                          : 'border-amber/30 bg-amber/5 text-amber'
                      )}
                    >
                      {user.roleName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {role && (
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium',
                          dataScopeColor[role.dataScope]
                        )}
                      >
                        {dataScopeLabel[role.dataScope]}
                      </span>
                    )}
                  </TableCell>
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
              );
            })}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-[13px] text-faint">
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
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[13px]">所属单位 *</Label>
              <Select
                value={formData.orgId}
                onValueChange={(v) => setFormData({ ...formData, orgId: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="请选择单位" />
                </SelectTrigger>
                <SelectContent>
                  {selectableOrgs.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-[11px] text-faint">{orgTypeLabel[org.orgType]}</span>
                        {org.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[13px]">角色 *</Label>
              <Select
                value={formData.roleId}
                onValueChange={(v) => setFormData({ ...formData, roleId: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <span className="flex items-center gap-2">
                        {role.name}
                        <span className="text-[11px] text-faint">
                          ({dataScopeLabel[role.dataScope]})
                        </span>
                      </span>
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
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-line bg-white px-4 py-3">
      <div className="text-[11px] font-medium text-faint">{label}</div>
      <div className={cn('mt-1 text-2xl font-black', color)}>{value}</div>
    </div>
  );
}

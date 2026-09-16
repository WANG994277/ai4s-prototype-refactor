'use client';

import { useState } from 'react';
import {
  Building2,
  Check,
  X,
  Clock,
  ArrowRight,
  User2,
  Layers,
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import type { WorkspaceApplication } from '@/lib/types/auth';
import {
  myWorkspaces,
  pendingApplications,
  myApplications,
  applicationStatusLabel,
  validPeriodLabel,
  applicationTypeLabel,
  currentUserId,
  currentUserName,
} from '@/lib/mock/workspaces';
import { orgTypeLabel } from '@/lib/mock/organizations';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JoinWorkspaceDialog } from '@/components/layout/join-workspace-dialog';
import { CreateWorkspaceDialog } from '@/components/layout/create-workspace-dialog';

type TabId = 'mine' | 'pending' | 'history';

export default function WorkspaceManagePage() {
  const [tab, setTab] = useState<TabId>('mine');
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
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          icon={Layers}
          label="已加入工作台"
          value={activeCount}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={Clock}
          label="待审批申请"
          value={pendingCount}
          color="text-amber"
          bgColor="bg-amber/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="已通过申请"
          value={historyApproved}
          color="text-cyan"
          bgColor="bg-cyan/10"
        />
        <StatCard
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
          <TabButton active={tab === 'mine'} onClick={() => setTab('mine')}>
            我的工作台
          </TabButton>
          <TabButton active={tab === 'pending'} onClick={() => setTab('pending')} badge={pendingCount}>
            待我审批
          </TabButton>
          <TabButton active={tab === 'history'} onClick={() => setTab('history')}>
            我的申请
          </TabButton>
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
                  <span className="text-faint">角色</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-normal',
                      ws.roleId === 'role-admin'
                        ? 'border-primary/30 bg-primary/5 text-primary'
                        : 'border-amber/30 bg-amber/5 text-amber'
                    )}
                  >
                    {ws.roleName}
                  </Badge>
                </div>
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
                    {/* 头像 */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                      {app.applicantName.slice(-2)}
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* 头部 */}
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

                      {/* 内容 */}
                      {app.type === 'join' ? (
                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                          <span>申请加入</span>
                          <ChevronRight className="h-3 w-3 text-faint" />
                          <span className="font-medium text-foreground">{app.targetOrgName}</span>
                          <ChevronRight className="h-3 w-3 text-faint" />
                          <Badge variant="outline" className="text-[10px] font-normal text-amber border-amber/30">
                            {app.requestedRoleName}
                          </Badge>
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
                            <span className="text-[11px] text-faint">
                              {app.newOrgType && orgTypeLabel[app.newOrgType]} · 隶属 {app.newOrgParentName}
                            </span>
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

                      {/* 理由 */}
                      <div className="rounded-md bg-surface-2 px-3 py-1.5 text-[12px] text-muted-foreground">
                        <span className="font-medium text-foreground">申请理由：</span>
                        {app.reason}
                      </div>

                      {/* 审批操作 */}
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
                        <Badge variant="outline" className={cn('text-[10px]', getStatusBadgeClass(app.status))}>
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

                      {/* 审批结果 */}
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

                      {/* 撤销操作 */}
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
    </div>
  );
}

function StatCard({
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

function TabButton({
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

function getStatusBadgeClass(status: string): string {
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

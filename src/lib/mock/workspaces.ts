import type { WorkspaceBinding, WorkspaceApplication } from '@/lib/types/auth';
import { organizations, orgMap } from '@/lib/mock/organizations';

// 当前用户 ID（模拟登录用户：张明远）
export const currentUserId = 'u-001';
export const currentUserName = '张明远';

// 我的工作台绑定列表
export const myWorkspaces: WorkspaceBinding[] = [
  {
    id: 'wb-001',
    userId: 'u-001',
    userName: '张明远',
    orgId: 'org-riped-unconv',
    orgName: '信息技术研究所',
    orgPath: '创新研究院 / 信息技术研究所',
    roleId: 'role-admin',
    roleName: '单位管理员',
    isActive: true,
    source: 'direct',
    validFrom: '2024-01-15',
    status: 'active',
  },
  {
    id: 'wb-002',
    userId: 'u-001',
    userName: '张明远',
    orgId: 'org-riped-eor',
    orgName: '材料科学研究所',
    orgPath: '创新研究院 / 材料科学研究所',
    roleId: 'role-researcher',
    roleName: '研究员',
    isActive: false,
    source: 'application',
    validFrom: '2024-06-01',
    status: 'active',
  },
  {
    id: 'wb-003',
    userId: 'u-001',
    userName: '张明远',
    orgId: 'org-ripp-catalyst',
    orgName: '算法课题组',
    orgPath: '应用技术研究院 / 算法课题组',
    roleId: 'role-researcher',
    roleName: '研究员',
    isActive: false,
    source: 'application',
    validFrom: '2024-09-10',
    validTo: '2025-09-10',
    status: 'active',
  },
];

// 待审批的申请记录（作为管理员收到的）
export const pendingApplications: WorkspaceApplication[] = [
  {
    id: 'app-001',
    type: 'join',
    applicantId: 'u-008',
    applicantName: '周文博',
    targetOrgId: 'org-riped-unconv',
    targetOrgName: '信息技术研究所',
    requestedRoleId: 'role-researcher',
    requestedRoleName: '研究员',
    reason: '负责算法模型 DFT 模拟计算，需要使用算空间分子设计工具',
    validPeriod: '1y',
    status: 'pending',
    submittedAt: '2025-01-08 10:30',
  },
  {
    id: 'app-002',
    type: 'join',
    applicantId: 'u-010',
    applicantName: '郑海洋',
    targetOrgId: 'org-riped-unconv',
    targetOrgName: '信息技术研究所',
    requestedRoleId: 'role-researcher',
    requestedRoleName: '研究员',
    reason: '跨单位协作，参与新材料封存技术研究课题',
    validPeriod: '6m',
    status: 'reviewing',
    reviewerId: 'u-001',
    reviewerName: '张明远',
    submittedAt: '2025-01-07 16:20',
  },
  {
    id: 'app-003',
    type: 'create',
    applicantId: 'u-005',
    applicantName: '刘伟强',
    newOrgName: '软件开发课题组',
    newOrgCode: 'SW-DEV-001',
    newOrgType: 'group_team',
    newOrgParentId: 'org-ripp',
    newOrgParentName: '应用技术研究院',
    firstAdminId: 'u-005',
    firstAdminName: '刘伟强',
    description: '开展软件开发项目，需独立工作台隔离实验数据',
    reason: '新方向立项，需要独立课题组管理实验记录和计算资源',
    status: 'pending',
    submittedAt: '2025-01-09 09:15',
  },
];

// 我提交的申请记录
export const myApplications: WorkspaceApplication[] = [
  {
    id: 'app-mine-001',
    type: 'join',
    applicantId: 'u-001',
    applicantName: '张明远',
    targetOrgId: 'org-ripp-heavyoil',
    targetOrgName: '数据分析课题组',
    requestedRoleId: 'role-researcher',
    requestedRoleName: '研究员',
    reason: '参与动力学模拟合作研究',
    validPeriod: '1y',
    status: 'pending',
    submittedAt: '2025-01-09 14:00',
  },
  {
    id: 'app-mine-002',
    type: 'join',
    applicantId: 'u-001',
    applicantName: '张明远',
    targetOrgId: 'org-ripp-catalyst',
    targetOrgName: '算法课题组',
    requestedRoleId: 'role-researcher',
    requestedRoleName: '研究员',
    reason: '联合实验协作',
    validPeriod: 'permanent',
    status: 'approved',
    reviewerId: 'u-005',
    reviewerName: '刘伟强',
    reviewComment: '同意，欢迎加入课题组',
    submittedAt: '2024-09-05 11:00',
    reviewedAt: '2024-09-08 09:30',
  },
  {
    id: 'app-mine-003',
    type: 'create',
    applicantId: 'u-001',
    applicantName: '张明远',
    newOrgName: '智能计算小组',
    newOrgCode: 'AI-CALC-001',
    newOrgType: 'group_team',
    newOrgParentId: 'org-riped-unconv',
    newOrgParentName: '信息技术研究所',
    firstAdminId: 'u-001',
    firstAdminName: '张明远',
    description: '智能计算专项研究',
    reason: '新增研究方向需要独立工作台',
    status: 'rejected',
    reviewerId: 'u-002',
    reviewerName: '李红梅',
    reviewComment: '请在现有研究所框架下开展，暂不需要新建课题组',
    submittedAt: '2024-07-20 10:00',
    reviewedAt: '2024-07-22 14:30',
  },
];

// 可申请加入的工作台（排除已加入的）
export function getAvailableWorkspaces(excludeOrgIds: string[]): typeof organizations {
  const excludeSet = new Set(excludeOrgIds);
  return organizations.filter(
    (o) => o.level >= 2 && o.status === 'active' && !excludeSet.has(o.id)
  );
}

// 申请状态标签和颜色
export const applicationStatusLabel: Record<string, string> = {
  pending: '待审批',
  reviewing: '审批中',
  approved: '已通过',
  rejected: '已驳回',
  revoked: '已撤销',
};

export const applicationStatusColor: Record<string, string> = {
  pending: 'bg-amber/10 text-amber border-amber/20',
  reviewing: 'bg-primary/10 text-primary border-primary/20',
  approved: 'bg-cyan/10 text-cyan border-cyan/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  revoked: 'bg-faint/10 text-faint border-faint/20',
};

// 有效期标签
export const validPeriodLabel: Record<string, string> = {
  '6m': '6 个月',
  '1y': '1 年',
  permanent: '长期',
};

// 申请类型标签
export const applicationTypeLabel: Record<string, string> = {
  join: '加入工作台',
  create: '创建工作台',
};

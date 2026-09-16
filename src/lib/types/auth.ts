// ===== 组织架构 =====
export interface Organization {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  path: string;
  level: number; // 1=集团 2=研究院 3=研究所/课题组
  orgType: 'group' | 'institute' | 'department' | 'group_team';
  status: 'active' | 'inactive';
  memberCount: number;
  sortOrder: number;
  createdAt: string;
}

// ===== 角色 =====
export interface Role {
  id: string;
  name: string;
  code: string;
  dataScope: 'ALL' | 'ORG_AND_CHILDREN' | 'ORG_ONLY' | 'SELF';
  isBuiltin: boolean;
  description: string;
  permissionIds: string[];
  createdAt: string;
}

// ===== 权限点 =====
export interface Permission {
  id: string;
  code: string;
  name: string;
  type: 'menu' | 'action' | 'api';
  resource: string;
  description: string;
}

// ===== 用户 =====
export interface User {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  title: string;
  status: 'active' | 'inactive';
  orgId: string;
  orgName: string;
  roleId: string;
  roleName: string;
  createdAt: string;
  lastActiveAt: string;
}

// ===== 组织树节点（带 children） =====
export interface OrgTreeNode extends Organization {
  children: OrgTreeNode[];
}

// ===== 权限分组 =====
export interface PermissionGroup {
  resource: string;
  label: string;
  permissions: Permission[];
}

// ===== 工作台绑定 =====
export interface WorkspaceBinding {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  orgName: string;
  orgPath: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  source: 'direct' | 'application' | 'created';
  validFrom: string;
  validTo?: string;
  status: 'active' | 'expired' | 'revoked';
}

// ===== 工作台申请 =====
export interface WorkspaceApplication {
  id: string;
  type: 'join' | 'create';
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;

  // 申请加入
  targetOrgId?: string;
  targetOrgName?: string;
  requestedRoleId?: string;
  requestedRoleName?: string;

  // 创建工作台
  newOrgName?: string;
  newOrgCode?: string;
  newOrgType?: 'institute' | 'department' | 'group_team';
  newOrgParentId?: string;
  newOrgParentName?: string;
  firstAdminId?: string;
  firstAdminName?: string;
  description?: string;

  // 通用
  reason: string;
  validPeriod?: '6m' | '1y' | 'permanent';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'revoked';
  reviewerId?: string;
  reviewerName?: string;
  reviewComment?: string;
  submittedAt: string;
  reviewedAt?: string;
}

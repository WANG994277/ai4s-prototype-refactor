import type { Role } from '@/lib/types/auth';

// 角色定义（2 级角色体系）
export const roles: Role[] = [
  {
    id: 'role-admin',
    name: '单位管理员',
    code: 'unit_admin',
    dataScope: 'ORG_AND_CHILDREN',
    isBuiltin: true,
    description: '管理本单位用户、查看本单位及下级单位数据，可分配研究员角色',
    permissionIds: [
      // 读空间 - 全部
      'p-lit-view', 'p-lit-export', 'p-kg-view', 'p-review-view', 'p-patent-view',
      // 算空间 - 全部
      'p-ct-view', 'p-ct-create', 'p-ct-cancel', 'p-mol-view', 'p-protein-view',
      // 做空间 - 全部（含审批）
      'p-exp-view', 'p-exp-approve', 'p-log-view', 'p-data-view',
      // 管理模块 - 全部
      'p-mu-users', 'p-mu-orgs', 'p-mu-roles', 'p-mu-user-create', 'p-mu-user-assign',
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 'role-researcher',
    name: '研究员',
    code: 'researcher',
    dataScope: 'SELF',
    isBuiltin: true,
    description: '独立科研操作，仅查看本人数据，不可访问管理模块',
    permissionIds: [
      // 读空间 - 只读（不可导出）
      'p-lit-view', 'p-kg-view', 'p-review-view', 'p-patent-view',
      // 算空间 - 可创建和取消任务（不可管理）
      'p-ct-view', 'p-ct-create', 'p-ct-cancel', 'p-mol-view', 'p-protein-view',
      // 做空间 - 不可审批
      'p-exp-view', 'p-log-view', 'p-data-view',
      // 管理模块 - 无权限
    ],
    createdAt: '2024-01-01',
  },
];

export const roleMap = new Map(roles.map((r) => [r.id, r]));

// 数据权限范围标签
export const dataScopeLabel: Record<string, string> = {
  ALL: '全平台',
  ORG_AND_CHILDREN: '本单位及下级',
  ORG_ONLY: '仅本单位',
  SELF: '仅本人',
};

export const dataScopeColor: Record<string, string> = {
  ALL: 'bg-purple/10 text-purple border-purple/20',
  ORG_AND_CHILDREN: 'bg-primary/10 text-primary border-primary/20',
  ORG_ONLY: 'bg-cyan/10 text-cyan border-cyan/20',
  SELF: 'bg-amber/10 text-amber border-amber/20',
};

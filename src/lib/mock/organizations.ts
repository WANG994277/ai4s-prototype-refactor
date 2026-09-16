import type { Organization, OrgTreeNode } from '@/lib/types/auth';

// 组织架构 Mock 数据
export const organizations: Organization[] = [
  // Level 1: 集团
  {
    id: 'org-cnpc',
    name: '星火科技集团有限公司',
    code: 'SPARK',
    parentId: null,
    path: '/org-cnpc/',
    level: 1,
    orgType: 'group',
    status: 'active',
    memberCount: 0,
    sortOrder: 1,
    createdAt: '2024-01-01',
  },
  // Level 2: 专业分公司 / 直属科研院所
  {
    id: 'org-riped',
    name: '创新研究院',
    code: 'SPARK-IRD',
    parentId: 'org-cnpc',
    path: '/org-cnpc/org-riped/',
    level: 2,
    orgType: 'institute',
    status: 'active',
    memberCount: 0,
    sortOrder: 1,
    createdAt: '2024-01-15',
  },
  {
    id: 'org-ripp',
    name: '应用技术研究院',
    code: 'SPARK-ATR',
    parentId: 'org-cnpc',
    path: '/org-cnpc/org-ripp/',
    level: 2,
    orgType: 'institute',
    status: 'active',
    memberCount: 0,
    sortOrder: 2,
    createdAt: '2024-01-15',
  },
  {
    id: 'org-daqing',
    name: '华南分公司',
    code: 'SPARK-HN',
    parentId: 'org-cnpc',
    path: '/org-cnpc/org-daqing/',
    level: 2,
    orgType: 'institute',
    status: 'active',
    memberCount: 0,
    sortOrder: 3,
    createdAt: '2024-01-15',
  },
  // Level 3: 研究所 / 课题组
  {
    id: 'org-riped-unconv',
    name: '信息技术研究所',
    code: 'IRD-IT',
    parentId: 'org-riped',
    path: '/org-cnpc/org-riped/org-riped-unconv/',
    level: 3,
    orgType: 'department',
    status: 'active',
    memberCount: 0,
    sortOrder: 1,
    createdAt: '2024-02-01',
  },
  {
    id: 'org-riped-eor',
    name: '材料科学研究所',
    code: 'IRD-MS',
    parentId: 'org-riped',
    path: '/org-cnpc/org-riped/org-riped-eor/',
    level: 3,
    orgType: 'department',
    status: 'active',
    memberCount: 0,
    sortOrder: 2,
    createdAt: '2024-02-01',
  },
  {
    id: 'org-ripp-catalyst',
    name: '算法课题组',
    code: 'ATR-ALGO',
    parentId: 'org-ripp',
    path: '/org-cnpc/org-ripp/org-ripp-catalyst/',
    level: 3,
    orgType: 'group_team',
    status: 'active',
    memberCount: 0,
    sortOrder: 1,
    createdAt: '2024-02-01',
  },
  {
    id: 'org-ripp-heavyoil',
    name: '数据分析课题组',
    code: 'ATR-DA',
    parentId: 'org-ripp',
    path: '/org-cnpc/org-ripp/org-ripp-heavyoil/',
    level: 3,
    orgType: 'group_team',
    status: 'active',
    memberCount: 0,
    sortOrder: 2,
    createdAt: '2024-02-01',
  },
  {
    id: 'org-daqing-ri',
    name: '工程技术研究院',
    code: 'HN-ET',
    parentId: 'org-daqing',
    path: '/org-cnpc/org-daqing/org-daqing-ri/',
    level: 3,
    orgType: 'department',
    status: 'active',
    memberCount: 0,
    sortOrder: 1,
    createdAt: '2024-02-01',
  },
];

// 构建 org map 便于查找
export const orgMap = new Map(organizations.map((o) => [o.id, o]));

// 获取单位完整路径名（如 "星火科技 / 创新研究院 / 信息技术研究所"）
export function getOrgPathName(orgId: string): string {
  const parts: string[] = [];
  let current: Organization | undefined = orgMap.get(orgId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? orgMap.get(current.parentId) : undefined;
  }
  return parts.join(' / ');
}

// 获取某单位及其所有子单位 ID
export function getOrgAndDescendantIds(orgId: string): string[] {
  const result: string[] = [orgId];
  const queue = [orgId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = organizations.filter((o) => o.parentId === currentId);
    for (const child of children) {
      result.push(child.id);
      queue.push(child.id);
    }
  }
  return result;
}

// 构建组织树
export function buildOrgTree(): OrgTreeNode[] {
  const nodeMap = new Map<string, OrgTreeNode>();
  for (const org of organizations) {
    nodeMap.set(org.id, { ...org, children: [] });
  }
  const roots: OrgTreeNode[] = [];
  for (const org of organizations) {
    const node = nodeMap.get(org.id)!;
    if (org.parentId) {
      const parent = nodeMap.get(org.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// 单位类型标签映射
export const orgTypeLabel: Record<string, string> = {
  group: '集团',
  institute: '研究院',
  department: '研究所',
  group_team: '课题组',
};

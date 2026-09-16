import type { Permission, PermissionGroup } from '@/lib/types/auth';

// 权限点定义（按科研平台业务模块分组）
export const permissions: Permission[] = [
  // 读空间
  { id: 'p-lit-view', code: 'menu:literature-search', name: '文献检索', type: 'menu', resource: 'literature', description: '访问文献检索页面' },
  { id: 'p-lit-export', code: 'action:literature.export', name: '文献导出', type: 'action', resource: 'literature', description: '导出文献数据' },
  { id: 'p-kg-view', code: 'menu:knowledge-graph', name: '知识图谱', type: 'menu', resource: 'knowledge', description: '访问知识图谱页面' },
  { id: 'p-review-view', code: 'menu:review-generation', name: '综述生成', type: 'menu', resource: 'review', description: '访问综述生成页面' },
  { id: 'p-patent-view', code: 'menu:patent-analysis', name: '专利分析', type: 'menu', resource: 'patent', description: '访问专利分析页面' },
  // 算空间
  { id: 'p-ct-view', code: 'menu:compute-tasks', name: '计算任务', type: 'menu', resource: 'compute', description: '访问计算任务页面' },
  { id: 'p-ct-create', code: 'action:compute.create', name: '创建计算任务', type: 'action', resource: 'compute', description: '提交新的计算任务' },
  { id: 'p-ct-cancel', code: 'action:compute.cancel', name: '取消计算任务', type: 'action', resource: 'compute', description: '取消运行中的计算任务' },
  { id: 'p-mol-view', code: 'menu:molecular-design', name: '分子设计', type: 'menu', resource: 'molecular', description: '访问分子设计页面' },
  { id: 'p-protein-view', code: 'menu:protein-engineering', name: '蛋白质工程', type: 'menu', resource: 'protein', description: '访问蛋白质工程页面' },
  // 做空间
  { id: 'p-exp-view', code: 'menu:experiment-design', name: '实验设计', type: 'menu', resource: 'experiment', description: '访问实验设计页面' },
  { id: 'p-exp-approve', code: 'action:experiment.approve', name: '实验审批', type: 'action', resource: 'experiment', description: '审批实验方案' },
  { id: 'p-log-view', code: 'menu:experiment-log', name: '实验记录', type: 'menu', resource: 'experiment', description: '访问实验记录页面' },
  { id: 'p-data-view', code: 'menu:data-analysis', name: '数据分析', type: 'menu', resource: 'analysis', description: '访问数据分析页面' },
  // 管理模块
  { id: 'p-mu-users', code: 'menu:manage.users', name: '用户管理', type: 'menu', resource: 'manage', description: '访问用户管理页面' },
  { id: 'p-mu-orgs', code: 'menu:manage.organizations', name: '组织架构', type: 'menu', resource: 'manage', description: '访问组织架构页面' },
  { id: 'p-mu-roles', code: 'menu:manage.roles', name: '角色管理', type: 'menu', resource: 'manage', description: '访问角色管理页面' },
  { id: 'p-mu-user-create', code: 'action:user.create', name: '创建用户', type: 'action', resource: 'manage', description: '新增用户账号' },
  { id: 'p-mu-user-assign', code: 'action:user.assign-role', name: '分配角色', type: 'action', resource: 'manage', description: '为用户分配角色和单位' },
];

// 权限分组（用于权限矩阵展示）
export const permissionGroups: PermissionGroup[] = [
  { resource: 'literature', label: '文献检索', permissions: permissions.filter((p) => p.resource === 'literature') },
  { resource: 'knowledge', label: '知识图谱', permissions: permissions.filter((p) => p.resource === 'knowledge') },
  { resource: 'review', label: '综述生成', permissions: permissions.filter((p) => p.resource === 'review') },
  { resource: 'patent', label: '专利分析', permissions: permissions.filter((p) => p.resource === 'patent') },
  { resource: 'compute', label: '计算任务', permissions: permissions.filter((p) => p.resource === 'compute') },
  { resource: 'molecular', label: '分子设计', permissions: permissions.filter((p) => p.resource === 'molecular') },
  { resource: 'protein', label: '蛋白质工程', permissions: permissions.filter((p) => p.resource === 'protein') },
  { resource: 'experiment', label: '实验管理', permissions: permissions.filter((p) => p.resource === 'experiment') },
  { resource: 'analysis', label: '数据分析', permissions: permissions.filter((p) => p.resource === 'analysis') },
  { resource: 'manage', label: '系统管理', permissions: permissions.filter((p) => p.resource === 'manage') },
];

export const permissionMap = new Map(permissions.map((p) => [p.id, p]));

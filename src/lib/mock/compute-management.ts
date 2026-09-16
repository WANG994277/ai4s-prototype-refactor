// 算力管理模块 Mock 数据 — 超算/智算/普算三分类

// ===== 类型定义 =====
export type ComputeCategory = 'hpc' | 'ai' | 'cloud';

export interface CategoryMetrics {
  category: ComputeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalResource: string;
  usedResource: string;
  utilization: number;
  runningTasks: number;
  queuedTasks: number;
  metrics: {
    label: string;
    value: string;
    change: string;
    changeType: 'up' | 'down';
    icon: string;
    color: string;
  }[];
}

export interface ResourceApplication {
  id: string;
  category: ComputeCategory;
  applicant: string;
  department: string;
  project: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectReason?: string;
  // 超算字段
  hpcSpec?: {
    cpuCores: number;
    memory: string;
    gpu?: string;
    jobType: string;
    duration: string;
  };
  // 智算字段
  aiSpec?: {
    gpuModel: string;
    gpuCount: number;
    framework: string;
    distributed: boolean;
    duration: string;
  };
  // 普算字段
  cloudSpec?: {
    instanceType: string;
    gpu: string;
    storage: string;
    usageMode: string;
    autoRelease: boolean;
  };
  reason: string;
}

export interface QuotaItem {
  category: ComputeCategory;
  project: string;
  used: number;
  total: number;
  unit: string;
  period: 'monthly' | 'yearly';
}

export interface ComputeNode {
  id: string;
  category: ComputeCategory;
  name: string;
  status: 'online' | 'maintenance' | 'offline' | 'running';
  cpuUtil?: number;
  gpuUtil?: number;
  memoryUtil?: number;
  gpuModel?: string;
  gpuCount?: number;
  cpuCores?: number;
  temperature?: number;
  jobs?: number;
}

export interface QueuedTask {
  id: string;
  category: ComputeCategory;
  name: string;
  type: string;
  priority: 'high' | 'normal' | 'low';
  position: number;
  estimatedWait: string;
  requiredResource: string;
  submittedAt: string;
  applicant: string;
}

export interface UsageTrendPoint {
  date: string;
  hpc: number;
  ai: number;
  cloud: number;
}

export interface CostItem {
  category: ComputeCategory;
  project: string;
  cost: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ComputeAlert {
  id: string;
  category: ComputeCategory;
  type: 'resource' | 'task' | 'quota' | 'node';
  title: string;
  description: string;
  time: string;
  severity: 'error' | 'warning' | 'info';
}

// ===== 超算/智算/普算 分类概览数据 =====
export const categoryData: Record<ComputeCategory, CategoryMetrics> = {
  hpc: {
    category: 'hpc',
    label: '超算 HPC',
    description: '科学仿真与高性能计算',
    icon: 'Server',
    color: '#1d5fd6',
    bgColor: '#eff5ff',
    totalResource: '2,400 CPU核',
    usedResource: '1,872 CPU核',
    utilization: 78,
    runningTasks: 14,
    queuedTasks: 5,
    metrics: [
      { label: 'CPU 总核数', value: '2,400', change: '+0%', changeType: 'up', icon: 'Cpu', color: '#1d5fd6' },
      { label: '已用/空闲', value: '1,872/528', change: '+3.2%', changeType: 'up', icon: 'BarChart3', color: '#1d5fd6' },
      { label: '运行中作业', value: '14', change: '-2', changeType: 'down', icon: 'Play', color: '#22c55e' },
      { label: '平均排队时长', value: '12min', change: '-35%', changeType: 'up', icon: 'Clock', color: '#f59e0b' },
      { label: '作业完成率', value: '96.8%', change: '+1.2%', changeType: 'up', icon: 'CheckCircle', color: '#22c55e' },
    ],
  },
  ai: {
    category: 'ai',
    label: '智算 AI',
    description: 'AI 训练/推理/大模型',
    icon: 'Brain',
    color: '#7c5ce0',
    bgColor: '#f3f0ff',
    totalResource: '128 GPU卡',
    usedResource: '117 GPU卡',
    utilization: 91,
    runningTasks: 23,
    queuedTasks: 8,
    metrics: [
      { label: 'GPU 总卡数', value: '128', change: '+32', changeType: 'up', icon: 'Cpu', color: '#7c5ce0' },
      { label: 'A100/H100', value: '82/46', change: '+8卡', changeType: 'up', icon: 'Layers', color: '#7c5ce0' },
      { label: '运行中训练', value: '23', change: '+4', changeType: 'up', icon: 'Play', color: '#22c55e' },
      { label: '显存利用率', value: '84.6%', change: '+5.3%', changeType: 'up', icon: 'MemoryStick', color: '#f59e0b' },
      { label: '模型吞吐量', value: '1.2K tok/s', change: '+18%', changeType: 'up', icon: 'Zap', color: '#22c55e' },
    ],
  },
  cloud: {
    category: 'cloud',
    label: '普算 Cloud',
    description: '日常分析、轻量计算',
    icon: 'Cloud',
    color: '#17a56a',
    bgColor: '#edfcf3',
    totalResource: '512 vCPU',
    usedResource: '178 vCPU',
    utilization: 35,
    runningTasks: 6,
    queuedTasks: 0,
    metrics: [
      { label: 'vCPU 总量', value: '512', change: '+128', changeType: 'up', icon: 'Cpu', color: '#17a56a' },
      { label: '已用/预留', value: '178/334', change: '-5.2%', changeType: 'down', icon: 'BarChart3', color: '#17a56a' },
      { label: '运行中容器', value: '6', change: '+1', changeType: 'up', icon: 'Container', color: '#22c55e' },
      { label: '弹性实例', value: '3/8', change: '+1', changeType: 'up', icon: 'Scaling', color: '#f59e0b' },
      { label: '按需/预留比', value: '34/66', change: '+4%', changeType: 'up', icon: 'PieChart', color: '#17a56a' },
    ],
  },
};

// ===== 资源申请列表 =====
export const applications: ResourceApplication[] = [
  {
    id: 'APP-001',
    category: 'hpc',
    applicant: '张明',
    department: '分子模拟中心',
    project: '催化材料DFT筛选',
    status: 'pending',
    createdAt: '2024-01-15 09:30',
    hpcSpec: { cpuCores: 512, memory: '256GB', gpu: '4×V100', jobType: 'DFT', duration: '72h' },
    reason: '需要对新催化剂体系进行DFT计算，预计72小时完成全部能量计算',
  },
  {
    id: 'APP-002',
    category: 'ai',
    applicant: '李芳',
    department: '算法课题组',
    project: 'GNN分子性质预测',
    status: 'approved',
    createdAt: '2024-01-14 14:20',
    approvedBy: '王主任',
    approvedAt: '2024-01-14 15:30',
    aiSpec: { gpuModel: 'A100-80G', gpuCount: 8, framework: 'PyTorch', distributed: true, duration: '48h' },
    reason: '训练GNN模型预测分子性质，需8卡分布式训练',
  },
  {
    id: 'APP-003',
    category: 'cloud',
    applicant: '赵强',
    department: '工艺工程部',
    project: '数据分析流水线',
    status: 'approved',
    createdAt: '2024-01-14 10:15',
    approvedBy: '系统自动',
    approvedAt: '2024-01-14 10:15',
    cloudSpec: { instanceType: '8C16G', gpu: '无', storage: '100GB', usageMode: '批处理脚本', autoRelease: true },
    reason: '批量数据处理脚本，预计2小时完成',
  },
  {
    id: 'APP-004',
    category: 'ai',
    applicant: '王丽',
    department: '算法课题组',
    project: '大模型推理服务',
    status: 'rejected',
    createdAt: '2024-01-13 16:40',
    approvedBy: '王主任',
    approvedAt: '2024-01-13 17:10',
    rejectReason: '当前智算配额不足，建议等待已有任务完成后再申请',
    aiSpec: { gpuModel: 'H100-80G', gpuCount: 16, framework: 'vLLM', distributed: true, duration: '168h' },
    reason: '部署大模型推理服务，需持续运行',
  },
  {
    id: 'APP-005',
    category: 'hpc',
    applicant: '陈华',
    department: '分子模拟中心',
    project: '分子动力学模拟',
    status: 'pending',
    createdAt: '2024-01-15 11:00',
    hpcSpec: { cpuCores: 256, memory: '512GB', jobType: 'MD', duration: '120h' },
    reason: 'ZSM-5分子筛扩散模拟，48920原子体系需要大内存节点',
  },
  {
    id: 'APP-006',
    category: 'ai',
    applicant: '刘洋',
    department: '算法课题组',
    project: 'MACE力场训练',
    status: 'approved',
    createdAt: '2024-01-12 09:00',
    approvedBy: '王主任',
    approvedAt: '2024-01-12 09:30',
    aiSpec: { gpuModel: 'A100-40G', gpuCount: 4, framework: 'PyTorch', distributed: false, duration: '96h' },
    reason: '训练MACE等变神经网络力场',
  },
  {
    id: 'APP-007',
    category: 'cloud',
    applicant: '孙涛',
    department: '工艺工程部',
    project: '实验报告生成',
    status: 'withdrawn',
    createdAt: '2024-01-11 14:20',
    cloudSpec: { instanceType: '4C8G', gpu: 'T4共享', storage: '50GB', usageMode: '交互式Jupyter', autoRelease: true },
    reason: '已改用本地环境完成',
  },
];

// ===== 配额数据 =====
export const quotaData: QuotaItem[] = [
  { category: 'hpc', project: '算法课题组', used: 42800, total: 50000, unit: '核时', period: 'monthly' },
  { category: 'hpc', project: '分子模拟中心', used: 38500, total: 45000, unit: '核时', period: 'monthly' },
  { category: 'hpc', project: '工艺工程部', used: 12600, total: 20000, unit: '核时', period: 'monthly' },
  { category: 'hpc', project: '催化材料组', used: 8900, total: 15000, unit: '核时', period: 'monthly' },
  { category: 'ai', project: '算法课题组', used: 1820, total: 2000, unit: '卡时', period: 'monthly' },
  { category: 'ai', project: '分子模拟中心', used: 860, total: 1200, unit: '卡时', period: 'monthly' },
  { category: 'ai', project: '工艺工程部', used: 320, total: 800, unit: '卡时', period: 'monthly' },
  { category: 'cloud', project: '算法课题组', used: 3200, total: 5000, unit: 'vCPU·h', period: 'monthly' },
  { category: 'cloud', project: '分子模拟中心', used: 1800, total: 3000, unit: 'vCPU·h', period: 'monthly' },
  { category: 'cloud', project: '工艺工程部', used: 4600, total: 8000, unit: 'vCPU·h', period: 'monthly' },
];

// ===== 计算节点数据 =====
export const computeNodes: ComputeNode[] = [
  { id: 'N-001', category: 'hpc', name: 'hpc-node-01', status: 'running', cpuUtil: 87, memoryUtil: 72, cpuCores: 128, jobs: 6 },
  { id: 'N-002', category: 'hpc', name: 'hpc-node-02', status: 'running', cpuUtil: 92, memoryUtil: 68, cpuCores: 128, jobs: 8 },
  { id: 'N-003', category: 'hpc', name: 'hpc-node-03', status: 'online', cpuUtil: 45, memoryUtil: 32, cpuCores: 256, jobs: 2 },
  { id: 'N-004', category: 'hpc', name: 'hpc-bigmem-01', status: 'running', cpuUtil: 78, memoryUtil: 91, cpuCores: 64, jobs: 1 },
  { id: 'N-005', category: 'hpc', name: 'hpc-node-04', status: 'maintenance', cpuUtil: 0, memoryUtil: 0, cpuCores: 128, jobs: 0 },
  { id: 'N-006', category: 'ai', name: 'gpu-a100-01', status: 'running', gpuUtil: 96, memoryUtil: 78, gpuModel: 'A100-80G', gpuCount: 8, temperature: 68 },
  { id: 'N-007', category: 'ai', name: 'gpu-a100-02', status: 'running', gpuUtil: 88, memoryUtil: 82, gpuModel: 'A100-80G', gpuCount: 8, temperature: 72 },
  { id: 'N-008', category: 'ai', name: 'gpu-h100-01', status: 'running', gpuUtil: 94, memoryUtil: 65, gpuModel: 'H100-80G', gpuCount: 4, temperature: 58 },
  { id: 'N-009', category: 'ai', name: 'gpu-a100-03', status: 'online', gpuUtil: 12, memoryUtil: 8, gpuModel: 'A100-40G', gpuCount: 4, temperature: 35 },
  { id: 'N-010', category: 'ai', name: 'gpu-h100-02', status: 'maintenance', gpuUtil: 0, memoryUtil: 0, gpuModel: 'H100-80G', gpuCount: 4, temperature: 0 },
  { id: 'N-011', category: 'cloud', name: 'cloud-worker-01', status: 'running', cpuUtil: 34, memoryUtil: 28 },
  { id: 'N-012', category: 'cloud', name: 'cloud-worker-02', status: 'running', cpuUtil: 22, memoryUtil: 18 },
  { id: 'N-013', category: 'cloud', name: 'cloud-jupyter-01', status: 'online', cpuUtil: 8, memoryUtil: 12 },
  { id: 'N-014', category: 'cloud', name: 'cloud-batch-01', status: 'running', cpuUtil: 56, memoryUtil: 44 },
];

// ===== 排队任务 =====
export const queuedTasks: QueuedTask[] = [
  { id: 'Q-001', category: 'hpc', name: 'CO₂加氢过渡态搜索', type: 'DFT·CI-NEB', priority: 'high', position: 1, estimatedWait: '~5min', requiredResource: '256核·128GB', submittedAt: '09:15', applicant: '陈华' },
  { id: 'Q-002', category: 'hpc', name: 'Pt表面吸附能计算', type: 'DFT·VASP', priority: 'normal', position: 2, estimatedWait: '~15min', requiredResource: '128核·64GB', submittedAt: '09:22', applicant: '张明' },
  { id: 'Q-003', category: 'ai', name: '分子生成模型训练', type: 'ML·Diffusion', priority: 'high', position: 1, estimatedWait: '~8min', requiredResource: '4×A100', submittedAt: '09:10', applicant: '李芳' },
  { id: 'Q-004', category: 'ai', name: '力场微调', type: 'ML·MACE', priority: 'normal', position: 2, estimatedWait: '~25min', requiredResource: '2×A100', submittedAt: '09:18', applicant: '刘洋' },
  { id: 'Q-005', category: 'ai', name: '大模型推理部署', type: 'LLM·vLLM', priority: 'low', position: 3, estimatedWait: '~45min', requiredResource: '4×H100', submittedAt: '09:30', applicant: '王丽' },
  { id: 'Q-006', category: 'hpc', name: 'ZSM-5扩散模拟', type: 'MD·LAMMPS', priority: 'normal', position: 3, estimatedWait: '~30min', requiredResource: '512核·512GB', submittedAt: '09:35', applicant: '陈华' },
  { id: 'Q-007', category: 'hpc', name: '沸石酸性位点计算', type: 'DFT·VASP', priority: 'low', position: 4, estimatedWait: '~50min', requiredResource: '128核·64GB', submittedAt: '09:40', applicant: '张明' },
  { id: 'Q-008', category: 'ai', name: 'GNN性质预测续训', type: 'ML·GNN', priority: 'normal', position: 4, estimatedWait: '~35min', requiredResource: '2×A100', submittedAt: '09:42', applicant: '李芳' },
];

// ===== 用量趋势 =====
export const usageTrendData: UsageTrendPoint[] = [
  { date: '01-08', hpc: 38000, ai: 1200, cloud: 2800 },
  { date: '01-09', hpc: 41000, ai: 1400, cloud: 3200 },
  { date: '01-10', hpc: 39500, ai: 1600, cloud: 2600 },
  { date: '01-11', hpc: 43000, ai: 1800, cloud: 3400 },
  { date: '01-12', hpc: 44500, ai: 2200, cloud: 3800 },
  { date: '01-13', hpc: 42000, ai: 1900, cloud: 3100 },
  { date: '01-14', hpc: 46000, ai: 2400, cloud: 4200 },
  { date: '01-15', hpc: 48000, ai: 2600, cloud: 4500 },
  { date: '01-16', hpc: 44000, ai: 2100, cloud: 3900 },
  { date: '01-17', hpc: 47000, ai: 2300, cloud: 4100 },
  { date: '01-18', hpc: 50000, ai: 2800, cloud: 4800 },
  { date: '01-19', hpc: 49000, ai: 2500, cloud: 4300 },
  { date: '01-20', hpc: 46500, ai: 2200, cloud: 3600 },
  { date: '01-21', hpc: 52000, ai: 3000, cloud: 5000 },
];

// ===== 成本核算 =====
export const costData: CostItem[] = [
  { category: 'hpc', project: '算法课题组', cost: 2140, unit: '元', trend: 'up' },
  { category: 'hpc', project: '分子模拟中心', cost: 1925, unit: '元', trend: 'down' },
  { category: 'hpc', project: '工艺工程部', cost: 630, unit: '元', trend: 'stable' },
  { category: 'ai', project: '算法课题组', cost: 3640, unit: '元', trend: 'up' },
  { category: 'ai', project: '分子模拟中心', cost: 1720, unit: '元', trend: 'up' },
  { category: 'ai', project: '工艺工程部', cost: 640, unit: '元', trend: 'down' },
  { category: 'cloud', project: '算法课题组', cost: 64, unit: '元', trend: 'stable' },
  { category: 'cloud', project: '分子模拟中心', cost: 36, unit: '元', trend: 'down' },
  { category: 'cloud', project: '工艺工程部', cost: 92, unit: '元', trend: 'up' },
];

// ===== 告警数据 =====
export const computeAlerts: ComputeAlert[] = [
  { id: 'CA-001', category: 'ai', type: 'resource', title: 'GPU集群利用率过高', description: '智算集群利用率达95%，8个任务排队等待，建议扩容', time: '5分钟前', severity: 'error' },
  { id: 'CA-002', category: 'hpc', type: 'task', title: '作业超时', description: 'DFT计算 #2839 已运行超24小时，疑似卡死', time: '30分钟前', severity: 'error' },
  { id: 'CA-003', category: 'ai', type: 'node', title: 'GPU温度过高', description: 'gpu-a100-02 GPU温度达82°C，接近阈值85°C', time: '45分钟前', severity: 'warning' },
  { id: 'CA-004', category: 'hpc', type: 'quota', title: '配额即将用尽', description: '算法课题组超算配额已用85.6%，剩余7,200核时', time: '1小时前', severity: 'warning' },
  { id: 'CA-005', category: 'ai', type: 'task', title: '训练loss异常', description: 'GNN训练任务loss连续3步NaN，建议检查学习率', time: '1.5小时前', severity: 'warning' },
  { id: 'CA-006', category: 'hpc', type: 'node', title: '节点维护中', description: 'hpc-node-04 正在例行维护，预计2小时后恢复', time: '2小时前', severity: 'info' },
  { id: 'CA-007', category: 'ai', type: 'node', title: 'H100节点离线', description: 'gpu-h100-02 硬件故障，已提交维修工单', time: '3小时前', severity: 'error' },
  { id: 'CA-008', category: 'cloud', type: 'resource', title: '存储配额不足', description: '工艺工程部存储已用92%，建议清理历史数据', time: '4小时前', severity: 'warning' },
];

// ===== 热力图颜色方案 =====
export const heatmapColors: Record<ComputeCategory, string[]> = {
  hpc: ['#f8fafc', '#dbeafe', '#93c5fd', '#3b82f6', '#1e40af'],
  ai: ['#faf5ff', '#e9d5ff', '#c084fc', '#8b5cf6', '#5b21b6'],
  cloud: ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#14532d'],
};

// ===== Compute Task Types & Mock Data =====

export type TaskStatus = 'running' | 'paused' | 'queued' | 'done' | 'error';
export type TaskType = 'MD' | 'DFT' | 'MC' | 'QC';

export interface ParamItem {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
}

export interface ProcessStep {
  label: string;
  value: string;
  status: 'active' | 'done' | 'pending';
}

export interface ConvergencePoint {
  step: number;
  energy: number;
  force: number;
}

export interface ResultField {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export interface ChargeEntry {
  atom: string;
  charge: number;
}

export interface ResultFile {
  name: string;
  size: string;
  type: string;
}

export interface ComputeNode {
  name: string;
  gpu: string;
  gpuUsage: number;
  cpuUsage: number;
  memory: string;
  status: 'online' | 'maintenance' | 'offline';
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  status: TaskStatus;
  progress: number;
  progressLabel: string;
  nodes: string;
  nodeName: string;
  elapsed: string;
  estimatedRemaining?: string;
  estimatedCompletion?: string;
  queuePosition?: number;
  queueWait?: string;
  params: ParamItem[];
  processSteps: ProcessStep[];
  convergenceData?: ConvergencePoint[];
  results?: ResultField[];
  charges?: ChargeEntry[];
  files?: ResultFile[];
  errorHint?: string;
  createdAt?: string;
  completedAt?: string;
  description?: string;
}

// ===== Type Config =====
export const typeConfig: Record<TaskType, { bg: string; text: string; color: string; label: string }> = {
  MD: { bg: 'bg-primary/10', text: 'text-primary', color: '#1d5fd6', label: '分子动力学' },
  DFT: { bg: 'bg-purple/15', text: 'text-purple', color: '#7c5ce0', label: '密度泛函' },
  MC: { bg: 'bg-amber/15', text: 'text-amber', color: '#f59e0b', label: '蒙特卡洛' },
  QC: { bg: 'bg-cyan/15', text: 'text-cyan', color: '#13b7c7', label: '量子化学' },
};

export const statusConfig: Record<TaskStatus, {
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
  barColor: string;
  pulse?: boolean;
}> = {
  running: { label: '运行中', dotColor: 'bg-success', textColor: 'text-success', bgColor: 'bg-success-bg', barColor: 'bg-cyan', pulse: true },
  paused: { label: '已暂停', dotColor: 'bg-amber', textColor: 'text-amber', bgColor: 'bg-warning-bg', barColor: 'bg-amber' },
  queued: { label: '排队中', dotColor: 'bg-amber', textColor: 'text-amber', bgColor: 'bg-warning-bg', barColor: 'bg-amber' },
  done: { label: '已完成', dotColor: 'bg-primary', textColor: 'text-primary', bgColor: 'bg-primary-container', barColor: 'bg-primary' },
  error: { label: '异常', dotColor: 'bg-red', textColor: 'text-red', bgColor: 'bg-error-bg', barColor: 'bg-red' },
};

// ===== Mock Data =====
export const initialTasks: Task[] = [
  {
    id: 'DFT-2843',
    name: 'DFT计算-Ni-Mo活性相',
    type: 'DFT',
    status: 'running',
    progress: 45,
    progressLabel: 'SCF 第 38 步',
    nodes: '2×A100',
    nodeName: 'node-gpu-03',
    elapsed: '5h 30m',
    estimatedRemaining: '+6.7h',
    estimatedCompletion: '约 18:20',
    createdAt: '2025-01-15 09:50',
    description: '基于密度泛函理论，研究Ni-Mo双金属活性相在加氢脱硫反应中的催化机制，分析电子转移与d带中心偏移。',
    params: [
      { key: 'encut', label: '截断能 ENCUT', value: 500, unit: 'eV' },
      { key: 'kpoints', label: 'K点网格', value: '3×3×3' },
      { key: 'functional', label: '交换关联泛函', value: 'PBE' },
      { key: 'atoms', label: '原子数', value: 60 },
      { key: 'ediff', label: '能量收敛', value: '1E-5', unit: 'eV' },
      { key: 'gpu', label: 'GPU 分配', value: '2×A100' },
    ],
    processSteps: [
      { label: '结构优化', value: '完成', status: 'done' },
      { label: 'SCF 自洽', value: '第 38 步 · ΔE=-1.2×10⁻⁴ eV', status: 'active' },
      { label: '能带计算', value: '待启动', status: 'pending' },
      { label: '态密度分析', value: '待启动', status: 'pending' },
    ],
    convergenceData: Array.from({ length: 38 }, (_, i) => ({
      step: i + 1,
      energy: -156.234 + Math.sin(i * 0.3) * 0.5 * Math.exp(-i * 0.08) + (i > 30 ? -0.001 * (i - 30) : 0),
      force: 2.5 * Math.exp(-i * 0.06) + 0.05 + Math.sin(i * 0.5) * 0.1,
    })),
  },
  {
    id: 'MD-2847',
    name: '分子动力学模拟-ZSM-5酸性位点',
    type: 'MD',
    status: 'running',
    progress: 73,
    progressLabel: '3.4 / 5.0 ns',
    nodes: '4×V100',
    nodeName: 'node-gpu-07',
    elapsed: '2h 15m',
    estimatedRemaining: '+0.8h',
    estimatedCompletion: '约 15:45',
    createdAt: '2025-01-15 11:30',
    description: '利用ReaxFF反应力场模拟ZSM-5分子筛Brønsted酸性位点在高温水热条件下的脱铝机制，追踪Al-O键断裂过程。',
    params: [
      { key: 'timestep', label: '时间步长', value: 1.0, unit: 'fs' },
      { key: 'steps', label: '总步数', value: '100,000' },
      { key: 'temp', label: '温度', value: 300, unit: 'K' },
      { key: 'forcefield', label: '力场', value: 'ReaxFF' },
      { key: 'atoms', label: '原子数', value: 48920 },
      { key: 'gpu', label: 'GPU 分配', value: '4×V100' },
    ],
    processSteps: [
      { label: '能量最小化', value: '完成', status: 'done' },
      { label: 'NVT 平衡', value: '完成', status: 'done' },
      { label: 'NPT 生产', value: '3.4/5.0 ns · T=302K', status: 'active' },
      { label: '轨迹分析', value: '待启动', status: 'pending' },
    ],
    convergenceData: Array.from({ length: 34 }, (_, i) => ({
      step: i + 1,
      energy: -8420.5 + Math.sin(i * 0.2) * 2 + (i > 25 ? -0.01 * (i - 25) : 0),
      force: 0.8 + Math.sin(i * 0.3) * 0.15,
    })),
  },
  {
    id: 'MC-2841',
    name: '蒙特卡洛采样-催化剂配方',
    type: 'MC',
    status: 'queued',
    progress: 0,
    progressLabel: '排队中',
    nodes: '2×V100',
    nodeName: '待分配',
    elapsed: '—',
    queuePosition: 3,
    queueWait: '预计 ~5min',
    createdAt: '2025-01-15 13:10',
    description: '基于蒙特卡洛方法搜索多组分催化剂最优配方，通过统计采样评估Co-Mo-Ni三元体系的活性与稳定性。',
    params: [
      { key: 'steps', label: '采样步数', value: '500,000' },
      { key: 'temp', label: '温度', value: 300, unit: 'K' },
      { key: 'ensemble', label: '系综', value: 'NVT' },
      { key: 'atoms', label: '原子数', value: 2000 },
      { key: 'gpu', label: 'GPU 分配', value: '2×V100' },
    ],
    processSteps: [
      { label: '排队等待', value: '前方 3 个任务', status: 'active' },
      { label: '采样计算', value: '待启动', status: 'pending' },
      { label: '统计分析', value: '待启动', status: 'pending' },
    ],
  },
  {
    id: 'MD-2839',
    name: '分子动力学模拟-水热稳定性',
    type: 'MD',
    status: 'error',
    progress: 30,
    progressLabel: '已中断',
    nodes: '—',
    nodeName: '—',
    elapsed: '1.2h',
    createdAt: '2025-01-14 16:00',
    description: '模拟SAPO-34分子筛在水蒸气环境下的结构演变，研究823K高温下的骨架脱铝和硅迁移。',
    params: [
      { key: 'timestep', label: '时间步长', value: 0.5, unit: 'fs' },
      { key: 'steps', label: '总步数', value: '200,000' },
      { key: 'temp', label: '温度', value: 823, unit: 'K' },
      { key: 'forcefield', label: '力场', value: 'COMB3' },
      { key: 'atoms', label: '原子数', value: 12000 },
      { key: 'gpu', label: 'GPU 分配', value: '4×V100' },
    ],
    processSteps: [
      { label: '能量最小化', value: '完成', status: 'done' },
      { label: 'NVT 平衡', value: '中断于 1.2h', status: 'active' },
      { label: 'NPT 生产', value: '未启动', status: 'pending' },
    ],
    errorHint: '内存溢出 (OOM)，建议减少原子数或增加节点内存',
  },
  {
    id: 'DFT-2835',
    name: 'DFT计算-磷改性机制',
    type: 'DFT',
    status: 'done',
    progress: 100,
    progressLabel: '已完成',
    nodes: '—',
    nodeName: 'node-cpu-22',
    elapsed: '4.8h',
    createdAt: '2025-01-14 08:20',
    completedAt: '2025-01-14 13:08',
    description: '研究磷(P)对ZSM-5分子筛的改性机制，分析P-O-Si桥键形成过程和酸性位点的变化规律，评估磷改性对催化活性的影响。',
    params: [
      { key: 'encut', label: '截断能 ENCUT', value: 520, unit: 'eV' },
      { key: 'kpoints', label: 'K点网格', value: '4×4×4' },
      { key: 'functional', label: '交换关联泛函', value: 'PBE+U' },
      { key: 'atoms', label: '原子数', value: 48 },
      { key: 'ediff', label: '能量收敛', value: '1E-6', unit: 'eV' },
      { key: 'gpu', label: 'GPU 分配', value: '2×A100' },
    ],
    processSteps: [
      { label: '结构优化', value: '完成', status: 'done' },
      { label: 'SCF 自洽', value: '完成 · 52步收敛', status: 'done' },
      { label: '能带计算', value: '完成', status: 'done' },
      { label: '态密度分析', value: '完成', status: 'done' },
    ],
    results: [
      { label: '总能量 E₀', value: '-124.563', unit: 'eV', highlight: true },
      { label: '形成能', value: '-2.34', unit: 'eV', highlight: true },
      { label: '带隙', value: '1.82', unit: 'eV', highlight: true },
      { label: '磁矩', value: '0.0', unit: 'μB' },
      { label: '费米能级', value: '-4.21', unit: 'eV' },
      { label: 'SCF 收敛步数', value: '52' },
      { label: 'P-O 键长', value: '1.54', unit: 'Å' },
      { label: 'Si-O-P 角', value: '142.3', unit: '°' },
    ],
    charges: [
      { atom: 'P', charge: 3.21 },
      { atom: 'O₁', charge: -1.42 },
      { atom: 'O₂', charge: -1.38 },
      { atom: 'Al', charge: 1.87 },
      { atom: 'Si', charge: 2.12 },
      { atom: 'O₃', charge: -1.25 },
      { atom: 'O₄', charge: -1.30 },
      { atom: 'Si₂', charge: 1.95 },
    ],
    files: [
      { name: 'OUTCAR', size: '23.4 MB', type: 'output' },
      { name: 'CONTCAR', size: '156 KB', type: 'structure' },
      { name: 'OSZICAR', size: '12 KB', type: 'scf' },
      { name: 'DOSCAR', size: '8.2 MB', type: 'dos' },
      { name: 'EIGENVAL', size: '4.1 MB', type: 'band' },
      { name: 'CHGCAR', size: '128 MB', type: 'charge' },
    ],
  },
  {
    id: 'QC-2831',
    name: '量子化学计算-基础油黏温特性',
    type: 'QC',
    status: 'done',
    progress: 100,
    progressLabel: '已完成',
    nodes: '—',
    nodeName: 'node-cpu-18',
    elapsed: '3.2h',
    createdAt: '2025-01-13 14:00',
    completedAt: '2025-01-13 17:12',
    description: '采用ωB97X-D泛函结合def2-TZVP基组，计算PAO基础油模型分子的黏温特性，获取HOMO-LUMO能级和热力学量。',
    params: [
      { key: 'method', label: '计算方法', value: 'ωB97X-D' },
      { key: 'basis', label: '基组', value: 'def2-TZVP' },
      { key: 'atoms', label: '原子数', value: 32 },
      { key: 'charge', label: '电荷', value: 0 },
      { key: 'multiplicity', label: '自旋多重度', value: 1 },
    ],
    processSteps: [
      { label: '几何优化', value: '完成 · 28步', status: 'done' },
      { label: '频率计算', value: '完成 · 无虚频', status: 'done' },
      { label: '单点能', value: '完成', status: 'done' },
    ],
    results: [
      { label: '总能量', value: '-782.4561', unit: 'Hartree', highlight: true },
      { label: 'HOMO', value: '-6.82', unit: 'eV', highlight: true },
      { label: 'LUMO', value: '-1.43', unit: 'eV', highlight: true },
      { label: 'HOMO-LUMO Gap', value: '5.39', unit: 'eV', highlight: true },
      { label: '偶极矩', value: '2.34', unit: 'Debye' },
      { label: '零点能', value: '0.876', unit: 'Hartree' },
      { label: 'ΔH(298K)', value: '-781.92', unit: 'Hartree' },
      { label: 'ΔG(298K)', value: '-782.01', unit: 'Hartree' },
    ],
    charges: [
      { atom: 'C₁', charge: -0.12 },
      { atom: 'C₂', charge: 0.08 },
      { atom: 'H₁', charge: 0.04 },
      { atom: 'O', charge: -0.52 },
      { atom: 'H₂', charge: 0.03 },
      { atom: 'C₃', charge: -0.09 },
    ],
    files: [
      { name: 'output.log', size: '5.6 MB', type: 'output' },
      { name: 'optimized.xyz', size: '24 KB', type: 'structure' },
      { name: 'frequencies.dat', size: '180 KB', type: 'freq' },
      { name: 'molden', size: '2.1 MB', type: 'orbital' },
    ],
  },
  {
    id: 'DFT-2826',
    name: 'DFT计算-Co费托合成晶面能',
    type: 'DFT',
    status: 'paused',
    progress: 62,
    progressLabel: '暂停于 SCF 第 51 步',
    nodes: '4×V100',
    nodeName: 'node-gpu-04',
    elapsed: '3.8h',
    estimatedRemaining: '+2.3h（恢复后）',
    estimatedCompletion: '恢复后约 2.3h',
    createdAt: '2025-01-14 10:00',
    description: '计算钴基费托合成催化剂不同晶面(0001, 10-10, 11-20)的表面能，评估晶面稳定性与活性位点分布。',
    params: [
      { key: 'encut', label: '截断能 ENCUT', value: 450, unit: 'eV' },
      { key: 'kpoints', label: 'K点网格', value: '5×5×1' },
      { key: 'functional', label: '交换关联泛函', value: 'PBE' },
      { key: 'atoms', label: '原子数', value: 36 },
      { key: 'gpu', label: 'GPU 分配', value: '4×V100' },
    ],
    processSteps: [
      { label: '结构优化', value: '完成', status: 'done' },
      { label: 'SCF 自洽', value: '暂停于第 51 步', status: 'active' },
      { label: '表面能计算', value: '待启动', status: 'pending' },
    ],
    convergenceData: Array.from({ length: 51 }, (_, i) => ({
      step: i + 1,
      energy: -98.456 + Math.sin(i * 0.25) * 0.3 * Math.exp(-i * 0.05),
      force: 1.8 * Math.exp(-i * 0.04) + 0.1,
    })),
  },
];

export const computeNodes: ComputeNode[] = [
  { name: 'node-01', gpu: 'V100 · 32GB', gpuUsage: 92, cpuUsage: 55, memory: '24.3 / 32 GB', status: 'online' },
  { name: 'node-02', gpu: 'A100 · 80GB', gpuUsage: 67, cpuUsage: 40, memory: '38.1 / 64 GB', status: 'online' },
  { name: 'node-03', gpu: 'V100 · 32GB', gpuUsage: 0, cpuUsage: 0, memory: '—', status: 'maintenance' },
  { name: 'node-04', gpu: 'A100 · 80GB', gpuUsage: 85, cpuUsage: 52, memory: '45.7 / 64 GB', status: 'online' },
  { name: 'node-05', gpu: 'V100 · 32GB', gpuUsage: 0, cpuUsage: 0, memory: '—', status: 'offline' },
  { name: 'node-06', gpu: 'V100 · 32GB', gpuUsage: 58, cpuUsage: 35, memory: '18.6 / 32 GB', status: 'online' },
];

export const kpis = [
  { value: '2', label: '运行中任务', sub: '排队 1 · 暂停 1' },
  { value: '78%', label: 'GPU 占用率', sub: '7.8 / 10 卡在用' },
  { value: '1,248', label: '本月核时', sub: '预算 1,500 · 余 17%' },
  { value: '18', label: '完成任务', sub: '成功 17 · 失败 1' },
  { value: '12', unit: '分钟', label: '平均队列时长', sub: '较上周 ▼35%' },
];

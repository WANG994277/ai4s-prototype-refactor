// 管理驾驶舱 Mock 数据 — 6 个标签页完整版

// ===== 通用类型 =====
export interface CoreMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: string;
  color: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  category?: string;
}

export interface DistributionItem {
  name: string;
  value: number;
  percentage?: number;
}

export interface RankItem {
  rank: number;
  name: string;
  metric: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  extra?: string;
}

export interface AlertItem {
  id: string;
  type: 'permission' | 'compute' | 'data_access' | 'ai' | 'resource' | 'quota';
  title: string;
  description: string;
  time: string;
  severity: 'error' | 'warning' | 'info';
}

export interface MemberItem {
  name: string;
  role: string;
  lastActive: string;
}

export interface ResourceItem {
  name: string;
  type: string;
  count: number;
}

export interface LogItem {
  time: string;
  action: string;
  user: string;
}

export interface DrilldownDetail {
  id: string;
  name: string;
  members: MemberItem[];
  usage: TrendDataPoint[];
  resources: ResourceItem[];
  logs: LogItem[];
}

// ===== 趋势数据生成工具 =====
// 确定性伪随机，避免 SSR/hydration 不匹配
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateTrendData(days: number, base: number, variance: number, categories?: string[]): TrendDataPoint[] {
  const data: TrendDataPoint[] = [];
  // 使用固定基准日期避免 SSR/hydration 不匹配
  const baseDate = new Date(2026, 5, 17); // 2026-06-17
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    if (categories) {
      categories.forEach((cat, ci) => {
        const seed = (days - i) * 31 + ci * 17;
        data.push({
          date: dateStr,
          value: Math.round(base + (seededRandom(seed) - 0.3) * variance),
          category: cat,
        });
      });
    } else {
      const seed = (days - i) * 31;
      data.push({
        date: dateStr,
        value: Math.round(base + (seededRandom(seed) - 0.3) * variance),
      });
    }
  }
  return data;
}

// ====================================================================
// 1. 运营总览
// ====================================================================
export const operationMetrics: CoreMetric[] = [
  { label: '工作台总数', value: '1,286', change: '+12.5%', changeType: 'up', icon: 'LayoutDashboard', color: '#2563eb' },
  { label: '新增工作台数', value: '48', change: '+8.3%', changeType: 'up', icon: 'PlusCircle', color: '#22c55e' },
  { label: '活跃工作台数', value: '923', change: '-2.1%', changeType: 'down', icon: 'Activity', color: '#06b6d4' },
  { label: '工作台使用频次', value: '15.6', change: '+5.2%', changeType: 'up', icon: 'MousePointerClick', color: '#f59e0b' },
  { label: '运行中工作台', value: '652', change: '+3.8%', changeType: 'up', icon: 'Play', color: '#7c5ce0' },
  { label: '待处理工作台', value: '37', change: '-15.2%', changeType: 'up', icon: 'Clock', color: '#ef4444' },
];

export const workbenchTrendData: TrendDataPoint[] = generateTrendData(30, 85, 40, ['日活', '周活']);

export const unitDistribution: DistributionItem[] = [
  { name: '算法课题组', value: 32, percentage: 25 },
  { name: '工艺工程部', value: 28, percentage: 21.9 },
  { name: '分子模拟中心', value: 24, percentage: 18.8 },
  { name: '分析测试中心', value: 20, percentage: 15.6 },
  { name: '新材料实验室', value: 14, percentage: 10.9 },
  { name: '安全环保部', value: 10, percentage: 7.8 },
];

export const activeWorkbenchRanking: RankItem[] = [
  { rank: 1, name: '分子模拟优化工作台', metric: 342, unit: '算法课题组', trend: 'up' },
  { rank: 2, name: '反应路径筛选', metric: 298, unit: '算法课题组', trend: 'up' },
  { rank: 3, name: '催化裂化工艺优化', metric: 256, unit: '工艺工程部', trend: 'stable' },
  { rank: 4, name: '分子动力学模拟平台', metric: 234, unit: '分子模拟中心', trend: 'down' },
  { rank: 5, name: '原油蒸馏实验台', metric: 198, unit: '工艺工程部', trend: 'up' },
  { rank: 6, name: '生物油提质工作台', metric: 176, unit: '新材实验室', trend: 'stable' },
  { rank: 7, name: '吸附剂性能评价', metric: 145, unit: '分析测试中心', trend: 'up' },
  { rank: 8, name: '安全评价模拟台', metric: 132, unit: '安全环保部', trend: 'down' },
  { rank: 9, name: '表面化学研究台', metric: 118, unit: '算法课题组', trend: 'up' },
  { rank: 10, name: '反应动力学建模', metric: 95, unit: '分子模拟中心', trend: 'stable' },
];

export const operationAlerts: AlertItem[] = [
  { id: 'op-1', type: 'permission', title: '越权访问', description: '用户李某某尝试访问受限项目「受限研究项目」', time: '10分钟前', severity: 'error' },
  { id: 'op-2', type: 'compute', title: '任务超时', description: 'DFT计算 #2839 已运行超24小时，疑似卡死', time: '30分钟前', severity: 'error' },
  { id: 'op-3', type: 'permission', title: '权限过期', description: '3名用户的「分子模拟中心」访问权限已过期', time: '1小时前', severity: 'warning' },
  { id: 'op-4', type: 'data_access', title: '异常下载', description: '用户赵某某在10分钟内下载了500+条专利数据', time: '15分钟前', severity: 'error' },
  { id: 'op-5', type: 'compute', title: '算力不足', description: 'GPU集群使用率达95%，3个任务排队等待', time: '45分钟前', severity: 'warning' },
];

// ====================================================================
// 2. 用户分析
// ====================================================================
export const userMetrics: CoreMetric[] = [
  { label: '总用户数', value: '3,856', change: '+6.8%', changeType: 'up', icon: 'Users', color: '#2563eb' },
  { label: '日活用户', value: '892', change: '+3.2%', changeType: 'up', icon: 'UserCheck', color: '#22c55e' },
  { label: '周活用户', value: '1,647', change: '-1.5%', changeType: 'down', icon: 'UserPlus', color: '#06b6d4' },
  { label: '管理员数', value: '126', change: '+2.0%', changeType: 'up', icon: 'Shield', color: '#f59e0b' },
  { label: '成员邀请数', value: '204', change: '+18.7%', changeType: 'up', icon: 'UserPlus', color: '#7c5ce0' },
  { label: '权限申请数', value: '53', change: '+9.1%', changeType: 'up', icon: 'Key', color: '#ef4444' },
];

export const userTrendData: TrendDataPoint[] = generateTrendData(30, 890, 200, ['日活', '新增']);

export const roleDistribution: DistributionItem[] = [
  { name: '研究员', value: 68, percentage: 42.5 },
  { name: '工程师', value: 45, percentage: 28.1 },
  { name: '技术员', value: 28, percentage: 17.5 },
  { name: '管理员', value: 12, percentage: 7.5 },
  { name: '访客', value: 7, percentage: 4.4 },
];

export const highFrequencyUserRanking: RankItem[] = [
  { rank: 1, name: '张明远', metric: 342, unit: '算法课题组', trend: 'up', extra: '2小时前' },
  { rank: 2, name: '李思远', metric: 298, unit: '分子模拟中心', trend: 'up', extra: '3小时前' },
  { rank: 3, name: '王明', metric: 256, unit: '工艺工程部', trend: 'stable', extra: '5小时前' },
  { rank: 4, name: '陈华', metric: 234, unit: '分析测试中心', trend: 'down', extra: '1天前' },
  { rank: 5, name: '赵磊', metric: 198, unit: '算法课题组', trend: 'up', extra: '4小时前' },
  { rank: 6, name: '刘芳', metric: 176, unit: '新材实验室', trend: 'stable', extra: '6小时前' },
  { rank: 7, name: '孙伟', metric: 145, unit: '工艺工程部', trend: 'up', extra: '1天前' },
  { rank: 8, name: '周丽', metric: 132, unit: '安全环保部', trend: 'down', extra: '2天前' },
  { rank: 9, name: '吴强', metric: 118, unit: '分子模拟中心', trend: 'up', extra: '3小时前' },
  { rank: 10, name: '郑琳', metric: 95, unit: '算法课题组', trend: 'stable', extra: '1天前' },
];

export const unitActivityRanking: DistributionItem[] = [
  { name: '算法课题组', value: 28.5 },
  { name: '工艺工程部', value: 22.3 },
  { name: '分子模拟中心', value: 19.8 },
  { name: '分析测试中心', value: 15.2 },
  { name: '新材料实验室', value: 12.6 },
  { name: '安全环保部', value: 8.4 },
];

// ====================================================================
// 3. 科研资源
// ====================================================================
export const resourceMetrics: CoreMetric[] = [
  { label: '文献检索次数', value: '12,460', change: '+15.3%', changeType: 'up', icon: 'BookOpen', color: '#2563eb' },
  { label: '专利检索次数', value: '3,287', change: '+8.6%', changeType: 'up', icon: 'FileCheck', color: '#22c55e' },
  { label: '知识图谱访问', value: '5,892', change: '+11.2%', changeType: 'up', icon: 'GitBranch', color: '#06b6d4' },
  { label: '收藏资源数', value: '1,456', change: '+4.3%', changeType: 'up', icon: 'Bookmark', color: '#f59e0b' },
  { label: '引用资源数', value: '892', change: '-2.7%', changeType: 'down', icon: 'Quote', color: '#7c5ce0' },
  { label: '热门主题数', value: '67', change: '+5.0%', changeType: 'up', icon: 'Hash', color: '#ef4444' },
];

export const literaturePatentTrendData: TrendDataPoint[] = generateTrendData(30, 150, 80, ['文献检索', '专利检索']);

export const techThemeDistribution: DistributionItem[] = [
  { name: '分子筛催化', value: 45 },
  { name: '加氢脱硫', value: 38 },
  { name: '催化裂化', value: 32 },
  { name: '反应动力学', value: 28 },
  { name: '分子模拟', value: 25 },
  { name: '表面化学', value: 22 },
  { name: '吸附分离', value: 18 },
  { name: '石油化工', value: 15 },
  { name: '催化剂表征', value: 13 },
  { name: '反应器设计', value: 11 },
];

export const hotLiteratureRanking: RankItem[] = [
  { rank: 1, name: 'ZSM-5分子筛酸性调控研究综述', metric: 89, trend: 'up' },
  { rank: 2, name: 'Ni-Mo/Al₂O₃加氢脱硫催化剂最新进展', metric: 76, trend: 'up' },
  { rank: 3, name: '催化裂化工艺参数优化方法', metric: 68, trend: 'stable' },
  { rank: 4, name: '分子动力学在催化剂设计中的应用', metric: 55, trend: 'down' },
  { rank: 5, name: '表面活性剂对分子筛孔道的影响', metric: 52, trend: 'up' },
  { rank: 6, name: '石油馏分物性数据建模与预测', metric: 48, trend: 'stable' },
  { rank: 7, name: '催化剂失活机理与再生技术', metric: 41, trend: 'up' },
  { rank: 8, name: '反应器模拟与CFD分析综述', metric: 38, trend: 'down' },
  { rank: 9, name: '吸附等温线模型比较研究', metric: 35, trend: 'up' },
  { rank: 10, name: '生物油提质催化路径研究', metric: 28, trend: 'stable' },
];

export const collectionCitationRanking: DistributionItem[] = [
  { name: 'ZSM-5分子筛酸性调控研究', value: 156 },
  { name: 'Ni-Mo/Al₂O₃催化剂数据库', value: 132 },
  { name: '催化裂化动力学模型库', value: 98 },
  { name: '加氢脱硫反应路径图谱', value: 87 },
  { name: '分子筛酸性位点数据集', value: 76 },
  { name: '石油馏分物性数据库', value: 65 },
  { name: '催化剂失活模型集', value: 54 },
  { name: '反应器模拟参数库', value: 42 },
];

// ====================================================================
// 4. AI科研助理
// ====================================================================
export const aiMetrics: CoreMetric[] = [
  { label: 'AI问答总次数', value: '28,560', change: '+22.1%', changeType: 'up', icon: 'Bot', color: '#2563eb' },
  { label: '日均问答次数', value: '952', change: '+18.6%', changeType: 'up', icon: 'MessageSquare', color: '#22c55e' },
  { label: '平均响应时间', value: '1.2s', change: '-8.3%', changeType: 'up', icon: 'Timer', color: '#f59e0b' },
  { label: '用户满意度', value: '4.6', change: '+0.2', changeType: 'up', icon: 'Star', color: '#06b6d4' },
  { label: '成功率', value: '94.7%', change: '+2.1%', changeType: 'up', icon: 'CheckCircle', color: '#7c5ce0' },
  { label: '失败/未命中数', value: '156', change: '+5.4%', changeType: 'down', icon: 'XCircle', color: '#ef4444' },
];

export const aiTrendData: TrendDataPoint[] = generateTrendData(30, 800, 300, ['调用次数', '成功', '失败']);

export const questionTypeDistribution: DistributionItem[] = [
  { name: '文献查询', value: 2340, percentage: 28.5 },
  { name: '数据分析', value: 1856, percentage: 22.6 },
  { name: '报告生成', value: 1423, percentage: 17.3 },
  { name: '技术问答', value: 1187, percentage: 14.5 },
  { name: '流程指引', value: 856, percentage: 10.4 },
  { name: '其他', value: 548, percentage: 6.7 },
];

export const aiResourceCitationRanking: DistributionItem[] = [
  { name: 'ZSM-5分子筛结构参数集', value: 89 },
  { name: '催化性能测试数据库', value: 76 },
  { name: '催化裂化动力学模型库', value: 68 },
  { name: '加氢脱硫反应路径图谱', value: 55 },
  { name: '分子筛酸性位点数据集', value: 52 },
  { name: '石油馏分物性数据库', value: 48 },
  { name: '催化剂失活模型集', value: 41 },
  { name: '反应器模拟参数库', value: 38 },
];

export const aiAlerts: AlertItem[] = [
  { id: 'ai-1', type: 'ai', title: '连续未命中', description: 'AI助理连续3次未能命中「催化剂表征」相关提问', time: '10分钟前', severity: 'warning' },
  { id: 'ai-2', type: 'ai', title: '响应超时', description: '3次问答响应时间 > 5s，影响用户体验', time: '30分钟前', severity: 'error' },
  { id: 'ai-3', type: 'ai', title: '调用失败', description: 'AI调用失败5次，服务端返回503', time: '1小时前', severity: 'error' },
  { id: 'ai-4', type: 'ai', title: '满意度下降', description: '「数据分析」类问题满意度降至3.8分', time: '2小时前', severity: 'warning' },
  { id: 'ai-5', type: 'ai', title: '模型版本滞后', description: '当前模型版本落后最新版2个迭代', time: '1天前', severity: 'info' },
];

// ====================================================================
// 5. 项目与成果
// ====================================================================
export const projectMetrics: CoreMetric[] = [
  { label: '绑定项目数', value: '186', change: '+5.3%', changeType: 'up', icon: 'FolderKanban', color: '#2563eb' },
  { label: '进行中项目', value: '94', change: '+2.8%', changeType: 'up', icon: 'FolderOpen', color: '#22c55e' },
  { label: '任务完成率', value: '78.5%', change: '+3.2%', changeType: 'up', icon: 'CheckCircle', color: '#06b6d4' },
  { label: '产出成果数', value: '423', change: '+12.7%', changeType: 'up', icon: 'Award', color: '#f59e0b' },
  { label: '论文/专利/报告', value: '67/23/89', change: '', changeType: 'up', icon: 'FileText', color: '#7c5ce0' },
  { label: '成果转化中', value: '15', change: '+2', changeType: 'up', icon: 'TrendingUp', color: '#ef4444' },
];

export const projectTypeDistribution: DistributionItem[] = [
  { name: '催化材料研发', value: 18, percentage: 32.1 },
  { name: '工艺优化', value: 14, percentage: 25 },
  { name: '分子模拟', value: 10, percentage: 17.9 },
  { name: '安全评价', value: 8, percentage: 14.3 },
  { name: '分析方法开发', value: 6, percentage: 10.7 },
];

export const outcomeCategoryData: TrendDataPoint[] = (() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const data: TrendDataPoint[] = [];
  months.forEach((m, mi) => {
    data.push({ date: m, value: Math.round(8 + seededRandom(mi * 31 + 1) * 6), category: '论文' });
    data.push({ date: m, value: Math.round(2 + seededRandom(mi * 31 + 2) * 4), category: '专利' });
    data.push({ date: m, value: Math.round(10 + seededRandom(mi * 31 + 3) * 8), category: '报告' });
  });
  return data;
})();

export const projectProgressDistribution: DistributionItem[] = [
  { name: '0-25%', value: 12, percentage: 12.8 },
  { name: '25-50%', value: 28, percentage: 29.8 },
  { name: '50-75%', value: 34, percentage: 36.2 },
  { name: '75-100%', value: 20, percentage: 21.2 },
];

export const conversionFunnel: DistributionItem[] = [
  { name: '研究成果', value: 423 },
  { name: '专利申请', value: 89 },
  { name: '授权专利', value: 23 },
  { name: '成果转化', value: 15 },
];

export const outcomeTrendData: TrendDataPoint[] = generateTrendData(12, 35, 15, ['成果数', '转化数']);

// ====================================================================
// 6. 算力资源分析
// ====================================================================
export const computeMetrics: CoreMetric[] = [
  { label: '算力任务总数', value: '4,826', change: '+18.3%', changeType: 'up', icon: 'Cpu', color: '#2563eb' },
  { label: '运行中任务', value: '312', change: '+4.5%', changeType: 'up', icon: 'Play', color: '#22c55e' },
  { label: '排队等待任务', value: '87', change: '+24.6%', changeType: 'down', icon: 'Clock', color: '#f59e0b' },
  { label: '平均等待时长', value: '23min', change: '-8.5%', changeType: 'up', icon: 'Timer', color: '#06b6d4' },
  { label: '平均利用率', value: '76.3%', change: '+3.1%', changeType: 'up', icon: 'Gauge', color: '#7c5ce0' },
  { label: '失败任务数', value: '42', change: '+11.2%', changeType: 'down', icon: 'XCircle', color: '#ef4444' },
];

export const computeTaskTrendData: TrendDataPoint[] = generateTrendData(30, 160, 60, ['提交', '完成', '失败']);

// 算力利用率热力图数据（7天 × 24小时）
export function generateHeatmapData(): { day: string; hour: number; value: number }[] {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const data: { day: string; hour: number; value: number }[] = [];
  days.forEach((day, di) => {
    for (let h = 0; h < 24; h++) {
      const seed = di * 100 + h;
      let base = 30 + seededRandom(seed) * 30;
      // 工作日白天高峰
      if (['周一', '周二', '周三', '周四', '周五'].includes(day) && h >= 9 && h <= 20) {
        base = 65 + seededRandom(seed) * 30;
      }
      // 凌晨低谷
      if (h >= 0 && h <= 7) {
        base = 10 + seededRandom(seed) * 20;
      }
      // 周末低谷
      if (['周六', '周日'].includes(day)) {
        base = 15 + seededRandom(seed) * 25;
      }
      data.push({ day, hour: h, value: Math.round(base) });
    }
  });
  return data;
}

export const resourceTypeDistribution: DistributionItem[] = [
  { name: 'GPU-A100', value: 4580, percentage: 36.4 },
  { name: 'GPU-V100', value: 3260, percentage: 25.9 },
  { name: 'CPU集群', value: 2890, percentage: 23.0 },
  { name: '存储资源', value: 1350, percentage: 10.7 },
  { name: '其他', value: 500, percentage: 4.0 },
];

export const computeUnitRanking: DistributionItem[] = [
  { name: '算法课题组', value: 1280 },
  { name: '分子模拟中心', value: 1050 },
  { name: '工艺工程部', value: 860 },
  { name: '分析测试中心', value: 620 },
  { name: '新材料实验室', value: 480 },
  { name: '安全环保部', value: 340 },
];

// 算力配额数据
export const computeQuotaData: { name: string; used: number; quota: number }[] = [
  { name: '算法课题组', used: 1280, quota: 1500 },
  { name: '分子模拟中心', used: 1050, quota: 1200 },
  { name: '工艺工程部', used: 860, quota: 900 },
  { name: '分析测试中心', used: 620, quota: 800 },
  { name: '新材料实验室', used: 480, quota: 600 },
  { name: '安全环保部', used: 340, quota: 500 },
];

export const computeAlerts: AlertItem[] = [
  { id: 'ca-1', type: 'compute', title: '任务超时', description: 'DFT计算 #2839 已运行超24小时，疑似卡死', time: '30分钟前', severity: 'error' },
  { id: 'ca-2', type: 'compute', title: '算力不足', description: 'GPU集群使用率达95%，3个任务排队等待', time: '45分钟前', severity: 'warning' },
  { id: 'ca-3', type: 'compute', title: '结果异常', description: '蒙特卡洛采样 #2841 输出值偏离预期3σ', time: '1小时前', severity: 'warning' },
  { id: 'ca-4', type: 'quota', title: '配额告急', description: '算法课题组GPU-A100配额已用98%，剩余52核时', time: '2小时前', severity: 'error' },
  { id: 'ca-5', type: 'compute', title: '内存溢出', description: '任务 #T-3921 运行失败：OOM (Out of Memory)', time: '3小时前', severity: 'error' },
];

// 算力异常小卡片
export const computeAlertSummary = [
  { label: '资源超限', count: 3, icon: 'Zap', color: '#ef4444' },
  { label: '任务异常', count: 12, icon: 'XCircle', color: '#f59e0b' },
  { label: '队列积压', count: 23, icon: 'Hourglass', color: '#eab308' },
];

// 算力钻取明细表格
export interface ComputeTaskDetail {
  id: string;
  name: string;
  workbench: string;
  unit: string;
  resourceType: string;
  coreHours: number;
  status: '运行中' | '排队中' | '已完成' | '失败';
  submitTime: string;
  duration: string;
}

export const computeTaskDetails: ComputeTaskDetail[] = [
  { id: 'T-3847', name: '分子结构DFT优化', workbench: '分子模拟优化工作台', unit: '算法课题组', resourceType: 'GPU-A100', coreHours: 128, status: '运行中', submitTime: '2026-06-17 14:30', duration: '2h 35min' },
  { id: 'T-3848', name: '反应路径模拟计算', workbench: '反应路径筛选', unit: '算法课题组', resourceType: 'GPU-A100', coreHours: 256, status: '运行中', submitTime: '2026-06-17 12:00', duration: '5h 10min' },
  { id: 'T-3849', name: '催化裂化动力学拟合', workbench: '催化裂化工艺优化', unit: '工艺工程部', resourceType: 'GPU-V100', coreHours: 64, status: '排队中', submitTime: '2026-06-17 15:45', duration: '等待 23min' },
  { id: 'T-3850', name: '分子动力学MD模拟', workbench: '分子动力学模拟平台', unit: '分子模拟中心', resourceType: 'GPU-A100', coreHours: 512, status: '运行中', submitTime: '2026-06-17 09:00', duration: '8h 20min' },
  { id: 'T-3851', name: '蒙特卡洛采样分析', workbench: '原油蒸馏实验台', unit: '工艺工程部', resourceType: 'CPU集群', coreHours: 32, status: '失败', submitTime: '2026-06-17 11:30', duration: '1h 02min' },
  { id: 'T-3852', name: '吸附等温线拟合', workbench: '吸附剂性能评价', unit: '分析测试中心', resourceType: 'CPU集群', coreHours: 16, status: '已完成', submitTime: '2026-06-17 08:00', duration: '3h 15min' },
  { id: 'T-3853', name: '表面化学DFT计算', workbench: '表面化学研究台', unit: '算法课题组', resourceType: 'GPU-A100', coreHours: 192, status: '运行中', submitTime: '2026-06-17 10:15', duration: '6h 50min' },
  { id: 'T-3854', name: '安全评价模型训练', workbench: '安全评价模拟台', unit: '安全环保部', resourceType: 'GPU-V100', coreHours: 96, status: '排队中', submitTime: '2026-06-17 16:00', duration: '等待 45min' },
  { id: 'T-3855', name: '生物油提质路径搜索', workbench: '生物油提质工作台', unit: '新材实验室', resourceType: 'GPU-A100', coreHours: 384, status: '运行中', submitTime: '2026-06-16 22:00', duration: '18h 30min' },
  { id: 'T-3856', name: '反应器CFD仿真', workbench: '反应动力学建模', unit: '分子模拟中心', resourceType: 'CPU集群', coreHours: 48, status: '已完成', submitTime: '2026-06-17 06:00', duration: '5h 40min' },
];

// ===== 通用筛选项 =====
export const unitOptions = [
  '全部单位',
  '算法课题组',
  '工艺工程部',
  '分子模拟中心',
  '分析测试中心',
  '新材料实验室',
  '安全环保部',
];

export const projectOptions = [
  '全部项目',
  'ZSM-5分子筛优化',
  '加氢脱硫催化剂',
  '催化裂化工艺优化',
  '生物油提质',
  '原油蒸馏实验',
];

export const workbenchOptions = [
  '全部工作台',
  '分子模拟优化工作台',
  '反应路径筛选',
  '催化裂化工艺优化',
  '分子动力学模拟平台',
  '原油蒸馏实验台',
  '生物油提质工作台',
  '吸附剂性能评价',
  '安全评价模拟台',
  '表面化学研究台',
  '反应动力学建模',
];

export const timeRangeOptions = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '近90天', value: '90d' },
];

// ===== 钻取明细 =====
export const drilldownData: Record<string, DrilldownDetail> = {
  '分子模拟优化工作台': {
    id: 'wb-001',
    name: '分子模拟优化工作台',
    members: [
      { name: '张明远', role: '负责人', lastActive: '10分钟前' },
      { name: '李思远', role: '研究员', lastActive: '1小时前' },
      { name: '王明', role: '工程师', lastActive: '3小时前' },
      { name: '陈华', role: '技术员', lastActive: '1天前' },
    ],
    usage: generateTrendData(14, 20, 10),
    resources: [
      { name: 'ZSM-5分子筛结构参数集', type: '数据集', count: 45 },
      { name: '催化性能测试数据', type: '实验数据', count: 128 },
      { name: '分子筛制备工艺报告', type: '报告', count: 12 },
    ],
    logs: [
      { time: '10:30', action: '提交实验数据', user: '张明远' },
      { time: '09:45', action: '更新实验参数', user: '李思远' },
      { time: '09:00', action: '启动DFT计算任务', user: '王明' },
      { time: '昨日 17:30', action: '导出分析报告', user: '张明远' },
    ],
  },
};

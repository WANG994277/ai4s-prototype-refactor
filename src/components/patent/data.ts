/* ─── 专利分析模块 - 共享类型与 Mock 数据 ─── */

export interface Patent {
  id: string;
  title: string;
  applicant: string;
  filingDate: string;
  status: 'granted' | 'pending' | 'expired';
  legalStatus?: '有效' | '审查中' | '实审中' | '已失效' | '已撤回';
  risk: 'high' | 'medium' | 'low';
  riskScore: number;
  abstract: string;
  ipc: string;
  cpc: string;
  country: string;
  techField: string;
  warningLevel?: 'urgent' | 'watch' | 'normal';
  claims?: ClaimItem[];
  citedCount?: number;
  familyCount?: number;
  familyCountries?: string[];
  tags?: string[];
  relevanceScore?: number;
  relevance?: number;
  citations?: { forward: string[]; backward: string[] };
}

export interface ClaimItem {
  id: number;
  text: string;
  type: 'independent' | 'dependent';
  parentId?: number;
  children?: ClaimItem[];
}

export interface TechParam {
  label: string;
  value: string;
  confirmed?: boolean;
}

export interface LanguageGap {
  claim: string;
  text?: string;
  issue: string;
  opportunity: string;
  severity: 'broad' | 'ambiguous' | 'gap';
}

export interface TechBlank {
  area: string;
  title?: string;
  ipc: string;
  patentCount: number;
  hasActive: boolean;
  desc: string;
}

export interface Suggestion {
  title: string;
  desc: string;
}

export interface SimilarPatent {
  id: string;
  title: string;
  applicant: string;
  filingDate: string;
  similarity: number;
  overlapFeatures: string[];
  diffFeatures: string[];
}

/* ─── 配置映射 ─── */
export const riskConfig = {
  high: { label: '高风险', bg: 'bg-error-bg', text: 'text-error', border: 'border-error/20' },
  medium: { label: '中风险', bg: 'bg-warning-bg', text: 'text-amber', border: 'border-amber/20' },
  low: { label: '低风险', bg: 'bg-success-bg', text: 'text-success', border: 'border-success/20' },
} as const;

export const statusConfig = {
  granted: { label: '已授权', dot: 'bg-success' },
  pending: { label: '审查中', dot: 'bg-amber' },
  expired: { label: '已失效', dot: 'bg-faint' },
} as const;

export const countryConfig: Record<string, { label: string; flag: string }> = {
  CN: { label: '中国', flag: '🇨🇳' },
  US: { label: '美国', flag: '🇺🇸' },
  EP: { label: '欧洲', flag: '🇪🇺' },
  JP: { label: '日本', flag: '🇯🇵' },
  WO: { label: 'WIPO', flag: '🌐' },
};

/* ─── IPC 树形数据 ─── */
export interface IpcTreeNode {
  code: string;
  label: string;
  count: number;
  expanded?: boolean;
  children?: IpcTreeNode[];
}

export const ipcTree: IpcTreeNode[] = [
  {
    code: 'B01J', label: '催化剂及其制备', count: 52, expanded: true,
    children: [
      { code: 'B01J 23/00', label: '非分子筛催化剂', count: 15, expanded: false,
        children: [
          { code: 'B01J 23/88', label: '含贵金属', count: 3 },
          { code: 'B01J 23/883', label: 'Co-Mo/Al₂O₃', count: 4 },
        ],
      },
      { code: 'B01J 29/00', label: '分子筛催化剂', count: 28, expanded: true,
        children: [
          { code: 'B01J 29/40', label: 'ZSM-5型', count: 4 },
          { code: 'B01J 29/48', label: 'ZSM-11型', count: 3 },
          { code: 'B01J 29/06', label: 'Y型沸石', count: 8 },
        ],
      },
      { code: 'B01J 38/00', label: '催化剂再生', count: 9 },
    ],
  },
  {
    code: 'C10G', label: '石油炼制', count: 23, expanded: false,
    children: [
      { code: 'C10G 11/00', label: '催化裂化', count: 12 },
      { code: 'C10G 45/00', label: '加氢精制', count: 8 },
    ],
  },
  {
    code: 'G06N', label: '计算/AI', count: 2, expanded: false,
    children: [
      { code: 'G06N 20/00', label: '机器学习', count: 2 },
    ],
  },
];

/* ─── Mock 专利数据 ─── */
export const patents: Patent[] = [
  {
    id: 'CN202410123456', title: '一种基于分子筛的催化裂化催化剂及其制备方法',
    applicant: '中国石油化工股份有限公司', filingDate: '2024-03-15',
    status: 'pending', legalStatus: '实审中', risk: 'high', riskScore: 87,
    abstract: '本发明涉及一种以ZSM-5分子筛为活性组分的催化裂化催化剂，通过磷改性提高丙烯选择性。该催化剂包含磷改性的ZSM-5分子筛、粘结剂和基质材料，其中磷含量为0.5-3.0wt%。制备方法包括浸渍和焙烧步骤，所得催化剂在催化裂化反应中表现出优异的丙烯选择性和水热稳定性。',
    ipc: 'B01J 29/40', cpc: 'B01J 29/40', country: 'CN', techField: '催化裂化',
    warningLevel: 'urgent', citedCount: 12, familyCount: 3, familyCountries: ['CN', 'US', 'EP'],
    tags: ['催化裂化', 'ZSM-5', '磷改性'],
    relevanceScore: 95, relevance: 95,
    citations: { forward: ['CN202410567001', 'CN202410567002', 'CN202410567003'], backward: ['CN202010111111', 'CN201920222222', 'US2019/0034567', 'CN201830333333', 'CN201740444444', 'CN201650555555'] },
    claims: [
      { id: 1, text: '一种催化裂化催化剂，其特征在于包含磷改性的ZSM-5分子筛，其中磷含量为0.5-3.0wt%', type: 'independent', children: [
        { id: 2, text: '根据权利要求1所述的催化剂，其中磷含量为1.0-2.5wt%', type: 'dependent', parentId: 1 },
        { id: 3, text: '根据权利要求1所述的催化剂，其中分子筛的硅铝比为20-50', type: 'dependent', parentId: 1 },
        { id: 4, text: '根据权利要求1所述的催化剂，其中还包含稀土元素改性', type: 'dependent', parentId: 1 },
      ]},
      { id: 5, text: '一种如权利要求1所述催化剂的制备方法，包括浸渍和焙烧步骤', type: 'independent', children: [
        { id: 6, text: '根据权利要求5所述的方法，其中浸渍温度为60-80℃', type: 'dependent', parentId: 5 },
        { id: 7, text: '根据权利要求5所述的方法，其中焙烧温度为500-600℃', type: 'dependent', parentId: 5 },
      ]},
    ],
  },
  {
    id: 'US2024/0012345', title: 'Method for preparing hydrodesulfurization catalyst with enhanced activity',
    applicant: 'ExxonMobil Research', filingDate: '2024-01-22',
    status: 'granted', legalStatus: '有效', risk: 'medium', riskScore: 62,
    abstract: 'A method for preparing a hydrodesulfurization catalyst comprising Ni-Mo supported on alumina with phosphorus promoter, where P/Mo molar ratio is 0.3-0.7, providing significantly improved HDS activity for refractory sulfur compounds.',
    ipc: 'B01J 23/88', cpc: 'B01J 23/888', country: 'US', techField: '加氢脱硫',
    warningLevel: 'watch', citedCount: 8, familyCount: 2, familyCountries: ['US', 'EP'],
    tags: ['加氢脱硫', 'Ni-Mo', '磷助剂'],
    relevanceScore: 78, relevance: 78,
    citations: { forward: ['US2024/0056789'], backward: ['US2018/0012345', 'EP2019/0567890'] },
    claims: [
      { id: 1, text: 'A hydrodesulfurization catalyst comprising Ni-Mo supported on alumina with phosphorus promoter', type: 'independent', children: [
        { id: 2, text: 'The catalyst of claim 1, wherein P/Mo molar ratio is 0.3-0.7', type: 'dependent', parentId: 1 },
      ]},
    ],
  },
  {
    id: 'CN202310987654', title: '用于加氢脱硫的复合催化剂及制备工艺',
    applicant: '中国石油天然气股份有限公司', filingDate: '2023-11-08',
    status: 'granted', legalStatus: '有效', risk: 'low', riskScore: 28,
    abstract: '本发明公开了一种用于柴油加氢脱硫的Co-Mo/Al₂O₃复合催化剂，采用共浸渍法制备，通过优化载体孔结构和活性金属分散度，显著提升了对4,6-DMDBT的脱除效率。',
    ipc: 'B01J 23/883', cpc: 'B01J 23/883', country: 'CN', techField: '加氢脱硫',
    warningLevel: 'normal', citedCount: 5, familyCount: 1, familyCountries: ['CN'],
    tags: ['加氢脱硫', 'Co-Mo', '复合催化剂'],
    relevanceScore: 65, relevance: 65,
  },
  {
    id: 'EP2024/0567890', title: 'Zeolite-based catalyst for enhanced propylene production in FCC process',
    applicant: 'BASF SE', filingDate: '2024-05-10',
    status: 'pending', legalStatus: '审查中', risk: 'medium', riskScore: 55,
    abstract: 'A zeolite catalyst composition for fluid catalytic cracking with improved propylene selectivity, comprising phosphorus-modified ZSM-5 and a matrix binder, providing propylene yield above 30%.',
    ipc: 'B01J 29/48', cpc: 'B01J 29/48', country: 'EP', techField: '催化裂化',
    warningLevel: 'watch', citedCount: 3, familyCount: 2, familyCountries: ['EP', 'US'],
    tags: ['催化裂化', '丙烯', 'ZSM-5'],
    relevanceScore: 82, relevance: 82,
  },
  {
    id: 'CN202410567890', title: '一种分子筛骨架稳定性的评价方法',
    applicant: '中国科学院大连化学物理研究所', filingDate: '2024-06-20',
    status: 'pending', legalStatus: '实审中', risk: 'low', riskScore: 15,
    abstract: '本发明提供了一种评价分子筛骨架水热稳定性的方法，通过测定骨架硅铝比变化率来量化分子筛在高温水热条件下的结构稳定性，为催化剂开发提供评价依据。',
    ipc: 'G01N 33/24', cpc: 'G01N 33/24', country: 'CN', techField: '表征方法',
    warningLevel: 'normal', citedCount: 2, familyCount: 1, familyCountries: ['CN'],
    tags: ['表征方法', '水热稳定性', '硅铝比'],
    relevanceScore: 45, relevance: 45,
  },
  {
    id: 'JP2024-089123', title: '触媒再生方法及び再生触媒',
    applicant: 'JX Nippon Oil & Energy', filingDate: '2024-02-18',
    status: 'granted', legalStatus: '有效', risk: 'high', riskScore: 78,
    abstract: '本発明は、使用済みFCC触媒の再生方法に関する。特に、コーク付着触媒の効率的な再生プロセスを開示し、再生後の触媒活性回复率を90%以上に維持する。',
    ipc: 'B01J 38/00', cpc: 'B01J 38/00', country: 'JP', techField: '催化剂再生',
    warningLevel: 'urgent', citedCount: 6, familyCount: 2, familyCountries: ['JP', 'US'],
    tags: ['催化剂再生', 'FCC', '活性恢复'],
    relevanceScore: 72, relevance: 72,
  },
  {
    id: 'WO2024/123456', title: 'Catalyst composition for bio-oil upgrading process',
    applicant: 'Shell International Research', filingDate: '2024-04-05',
    status: 'pending', legalStatus: '审查中', risk: 'low', riskScore: 22,
    abstract: 'A catalyst composition for upgrading bio-oil comprising a metal-loaded zeolite support, particularly Ni-Cu on hierarchical ZSM-5, for deoxygenation and hydrocracking of biomass-derived oils.',
    ipc: 'B01J 29/72', cpc: 'B01J 29/72', country: 'WO', techField: '生物油提质',
    warningLevel: 'normal', citedCount: 1, familyCount: 3, familyCountries: ['WO', 'US', 'EP'],
    tags: ['生物油提质', '多级孔ZSM-5', '脱氧'],
    relevanceScore: 55, relevance: 55,
  },
];

/* ─── 竞争分析 Mock ─── */
export const competitors = [
  { name: '中石化', count: 12, pct: 40, color: '#1d5fd6' },
  { name: 'ExxonMobil', count: 8, pct: 27, color: '#13b7c7' },
  { name: 'BASF', count: 5, pct: 17, color: '#7c5ce0' },
  { name: '中石油', count: 3, pct: 10, color: '#f59e0b' },
  { name: 'JX Nippon', count: 2, pct: 7, color: '#ef4444' },
];

export const layoutComparison = [
  { name: '中石化', ipcOverlap: 75, keywordOverlap: 62, timeCompetition: 45 },
  { name: 'ExxonMobil', ipcOverlap: 55, keywordOverlap: 48, timeCompetition: 38 },
  { name: 'BASF', ipcOverlap: 40, keywordOverlap: 35, timeCompetition: 22 },
];

export const techBlanks = [
  { area: '催化剂再生循环利用技术', ipc: 'B01J 38/00', priority: 'high' as const, patentCount: 2, hasActive: false, desc: '现有专利缺乏系统性再生循环方案' },
  { area: '磷+稀土双元素协同改性', ipc: 'B01J 29/40', priority: 'high' as const, patentCount: 1, hasActive: false, desc: '双元素协同改性方案布局不足，仅1件已失效' },
  { area: '生物基催化材料', ipc: 'B01J 20/24', priority: 'medium' as const, patentCount: 3, hasActive: true, desc: '绿色催化领域布局不足' },
  { area: '低温催化裂化(<400℃)', ipc: 'B01J 8/00', priority: 'high' as const, patentCount: 0, hasActive: false, desc: '低温条件下催化裂化尚无专利覆盖' },
  { area: 'AI辅助催化剂设计', ipc: 'G06N 20/00', priority: 'medium' as const, patentCount: 2, hasActive: true, desc: '计算驱动的催化剂开发尚未形成专利壁垒' },
];

export const trendData = [
  { year: '2020', 中石化: 3, ExxonMobil: 2, BASF: 0 },
  { year: '2021', 中石化: 5, ExxonMobil: 3, BASF: 1 },
  { year: '2022', 中石化: 6, ExxonMobil: 4, BASF: 3 },
  { year: '2023', 中石化: 8, ExxonMobil: 5, BASF: 4 },
  { year: '2024', 中石化: 10, ExxonMobil: 6, BASF: 5 },
];

export const timelineEvents = [
  { year: '2020', count: 3, highlight: '中石化申请首件磷改性分子筛专利' },
  { year: '2021', count: 5, highlight: 'ExxonMobil布局加氢脱硫系列' },
  { year: '2022', count: 8, highlight: 'BASF进入FCC催化剂领域' },
  { year: '2023', count: 12, highlight: '专利申请量快速增长' },
  { year: '2024', count: 15, highlight: 'AI辅助设计专利涌现' },
];

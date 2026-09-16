/* ─── Shared Literature Data ─── */

export interface PaperAuthor {
  name: string;
  affiliation: string;
  hIndex: number;
  papers: number;
  cited: number;
  researchAreas?: string[];
  topPapers?: string[];
  collaborators?: string[];
  pubTrend?: { year: number; count: number }[];
}

export interface PaperNote {
  id: string;
  page: number;
  content: string;
  highlight: string;
  color: string;
  date: string;
}

export interface Paper {
  id: number;
  title: string;
  authors: string;
  authorFull: PaperAuthor[];
  journal: string;
  year: number;
  cited: number;
  abstract: string;
  tags: string[];
  starred: boolean;
  aiSummary?: string;
  doi: string;
  database: string;
  fieldType: string;
  literatureType: '期刊论文' | '会议论文' | '书籍' | '学位论文' | '预印本' | '技术报告' | '标准文献';
  relevanceScore: number;
  keywords: string[];
  references?: string[];
  citedBy?: string[];
  notes?: PaperNote[];
  recommendReason?: string;
  pdfUrl?: string;
}

export const papers: Paper[] = [
  {
    id: 1,
    title: 'Enhanced catalytic performance of Ni-Mo/Al₂O₃ for hydrodesulfurization via phosphorus modification',
    authors: 'Zhang Y, Wang L, Chen H, et al.',
    authorFull: [
      { name: 'Zhang Y', affiliation: '中国石化石油化工科学研究院', hIndex: 32, papers: 89, cited: 4200, researchAreas: ['加氢脱硫', '催化剂改性', '分子筛催化'], topPapers: ['Enhanced catalytic performance of Ni-Mo/Al₂O₃ for HDS via P modification (2024)', 'Nickel-based catalysts for deep hydrodesulfurization (2022)', 'Effect of phosphorus on MoS₂ active phase dispersion (2021)'], collaborators: ['Wang L', 'Chen H', 'Li X', 'Zhao K'], pubTrend: [{ year: 2019, count: 8 }, { year: 2020, count: 12 }, { year: 2021, count: 15 }, { year: 2022, count: 18 }, { year: 2023, count: 20 }, { year: 2024, count: 16 }] },
      { name: 'Wang L', affiliation: '中国科学院大连化物所', hIndex: 28, papers: 65, cited: 3100, researchAreas: ['催化反应工程', '加氢催化', '新型载体'], topPapers: ['Catalytic performance of Ni-W catalysts for HDS (2023)', 'In-situ characterization of sulfide catalysts (2022)'], collaborators: ['Zhang Y', 'Chen H', 'Sun W'], pubTrend: [{ year: 2019, count: 6 }, { year: 2020, count: 9 }, { year: 2021, count: 11 }, { year: 2022, count: 13 }, { year: 2023, count: 14 }, { year: 2024, count: 12 }] },
      { name: 'Chen H', affiliation: '清华大学化学系', hIndex: 24, papers: 52, cited: 2300, researchAreas: ['计算催化', 'DFT模拟', '催化剂设计'], topPapers: ['DFT study of HDS mechanism on Ni-Mo-S edges (2022)', 'Computational screening of bimetallic catalysts (2023)'], collaborators: ['Zhang Y', 'Wang L', 'Liu R'], pubTrend: [{ year: 2019, count: 5 }, { year: 2020, count: 7 }, { year: 2021, count: 9 }, { year: 2022, count: 10 }, { year: 2023, count: 11 }, { year: 2024, count: 10 }] },
    ],
    journal: 'Applied Catalysis B: Environmental', year: 2024, cited: 45,
    abstract: '本研究通过磷改性策略显著提升了Ni-Mo/Al₂O₃催化剂的加氢脱硫活性，在最佳磷添加量下，DBT转化率提高了23%。研究表明磷助剂的引入有效促进了MoS₂活性相的分散，提高了催化剂的加氢脱硫选择性。',
    tags: ['加氢脱硫', '催化剂改性', '磷助剂'], starred: true,
    aiSummary: '本文提出磷改性Ni-Mo/Al₂O₃催化剂，DBT转化率提升23%。核心发现：P/Mo比为0.5时活性最优，磷促进MoS₂活性相分散。',
    doi: '10.1016/j.apcatb.2024.123456', database: 'Web of Science', fieldType: '催化化学', literatureType: '期刊论文', relevanceScore: 96,
    keywords: ['hydrodesulfurization', 'Ni-Mo catalyst', 'phosphorus modification', 'Al₂O₃ support'],
    references: ['Li X et al. (2023) Catal Today 398:12-20', 'Wang R et al. (2022) J Catal 405:115-128', 'Chen Z et al. (2021) Appl Catal B 280:119434'],
    citedBy: ['Zhao K et al. (2025) J Catal 418:45-58', 'Sun W et al. (2024) Catal Sci Technol 14:3210-3225'],
    notes: [
      { id: 'n1', page: 3, content: 'P/Mo比0.5为最佳，可参考实验设计', highlight: 'The optimal P/Mo ratio was determined to be 0.5', color: '#f59e0b', date: '2025-06-15' },
    ],
    recommendReason: '高被引',
    pdfUrl: 'https://example.com/papers/paper1.pdf',
  },
  {
    id: 2,
    title: 'Machine learning guided optimization of FCC catalyst for maximum propylene yield',
    authors: 'Li M, Zhou J, Liu X, et al.',
    authorFull: [
      { name: 'Li M', affiliation: '中国石化上海石化院', hIndex: 18, papers: 35, cited: 1200 },
      { name: 'Zhou J', affiliation: '浙江大学化工学院', hIndex: 22, papers: 48, cited: 1800 },
    ],
    journal: 'Catalysis Today', year: 2024, cited: 28,
    abstract: '利用机器学习模型预测催化裂化催化剂组成与丙烯收率的关系，实现了催化剂配方的高效筛选。基于XGBoost模型对1000+组实验数据的训练，模型预测精度达到R²=0.94。',
    tags: ['催化裂化', '机器学习', '丙烯'], starred: false,
    aiSummary: '基于XGBoost模型预测FCC催化剂配方，丙烯收率预测误差<3%。',
    doi: '10.1016/j.cattod.2024.789012', database: 'Scopus', fieldType: '计算化学', literatureType: '期刊论文', relevanceScore: 89,
    keywords: ['FCC catalyst', 'machine learning', 'propylene', 'XGBoost'],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper2.pdf',
    notes: [],
  },
  {
    id: 3,
    title: 'Molecular simulation of zeolite framework stability under hydrothermal conditions',
    authors: 'Wang T, Liu R, Zhang K',
    authorFull: [
      { name: 'Wang T', affiliation: '中国石油大学（北京）', hIndex: 15, papers: 28, cited: 980 },
    ],
    journal: 'Journal of Physical Chemistry C', year: 2024, cited: 15,
    abstract: '采用分子动力学方法研究了ZSM-5和SAPO-34分子筛在水热条件下的骨架稳定性，揭示了铝位点脱除机制与骨架坍塌的动力学过程。',
    tags: ['分子模拟', '分子筛', '水热稳定性'], starred: true,
    doi: '10.1021/acs.jpcc.2024.345678', database: 'Web of Science', fieldType: '分子模拟', literatureType: '会议论文', relevanceScore: 82,
    keywords: ['zeolite', 'molecular dynamics', 'hydrothermal stability', 'framework'],
    references: ['Li M et al. (2023) Catal Today 398:12-20'],
    citedBy: ['Zhang W et al. (2025) J Phys Chem C 129:8901-8912'],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper3.pdf',
    notes: [
      { id: 'n3', page: 7, content: '水热稳定性模拟方法可借鉴', highlight: 'MD simulations at 800K reveal framework collapse mechanism', color: '#17a56a', date: '2025-06-12' },
    ],
  },
  {
    id: 4,
    title: 'Deep learning approaches for predicting catalytic activity of transition metal complexes',
    authors: 'Kim S, Park J, Lee H, et al.',
    authorFull: [
      { name: 'Kim S', affiliation: 'KAIST', hIndex: 35, papers: 92, cited: 5600 },
      { name: 'Park J', affiliation: 'Seoul National University', hIndex: 30, papers: 78, cited: 4100 },
    ],
    journal: 'Nature Catalysis', year: 2024, cited: 67,
    abstract: '开发了一种基于图神经网络的深度学习框架，能够准确预测过渡金属配合物的催化活性，R²达到0.92，优于传统DFT方法3倍速度。',
    tags: ['深度学习', '催化活性预测', '图神经网络'], starred: false,
    aiSummary: 'GNN模型预测催化活性R²=0.92，适用于筛选含Co、Ni、Fe的催化体系。',
    doi: '10.1038/s41929-024-01234-5', database: 'Web of Science', fieldType: 'AI催化', literatureType: '期刊论文', relevanceScore: 78,
    keywords: ['deep learning', 'catalytic activity', 'GNN', 'transition metal'],
    citedBy: ['Yang L et al. (2025) Nat Catal 8:234-248'],
    recommendReason: '与你收藏相关',
    pdfUrl: 'https://example.com/papers/paper4.pdf',
    notes: [],
  },
  {
    id: 5,
    title: 'Sustainable catalytic processes for bio-oil upgrading: A comprehensive review',
    authors: 'Chen W, Zhang L, Yang F',
    authorFull: [
      { name: 'Chen W', affiliation: '华东理工大学', hIndex: 40, papers: 110, cited: 7800 },
    ],
    journal: 'Chemical Reviews', year: 2023, cited: 89,
    abstract: '综述了生物油提质催化过程的最新进展，包括加氢脱氧、催化裂化和蒸汽重整等关键技术，涵盖了催化剂设计、反应机理和工艺优化等方面。',
    tags: ['生物油', '加氢脱氧', '可持续催化'], starred: false,
    doi: '10.1021/acs.chemrev.2023.567890', database: 'PubMed', fieldType: '可持续能源', literatureType: '书籍', relevanceScore: 71,
    keywords: ['bio-oil', 'hydrodeoxygenation', 'sustainable catalysis', 'review'],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper5.pdf',
    notes: [],
  },
  {
    id: 6,
    title: 'In-situ spectroscopic investigation of acid site distribution on zeolite Y',
    authors: 'Liu H, Zhao D, Sun Y',
    authorFull: [
      { name: 'Liu H', affiliation: '中国石化石油化工科学研究院', hIndex: 20, papers: 42, cited: 1500 },
    ],
    journal: 'ACS Catalysis', year: 2023, cited: 34,
    abstract: '利用原位红外光谱和固体核磁共振技术研究了Y型分子筛上酸性位点的空间分布规律，发现了超笼与方钠石笼中Brønsted酸位点的不均匀分布特征。',
    tags: ['原位表征', '分子筛', '酸性位点'], starred: false,
    doi: '10.1021/acscatal.3c01234', database: 'Scopus', fieldType: '催化化学', literatureType: '会议论文', relevanceScore: 65,
    keywords: ['in-situ spectroscopy', 'acid site', 'zeolite Y', 'FTIR'],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper6.pdf',
    notes: [],
  },
  {
    id: 7,
    title: 'Advances in heterogeneous catalysis: From nanomaterials to single-atom catalysts',
    authors: 'Zhao Y, Wu H, Liang X, et al.',
    authorFull: [
      { name: 'Zhao Y', affiliation: '中国科学院化学研究所', hIndex: 45, papers: 130, cited: 9200 },
    ],
    journal: 'Chemical Society Reviews', year: 2024, cited: 112,
    abstract: '系统综述了多相催化从纳米材料到单原子催化剂的发展历程，重点讨论了单原子催化剂的制备策略、表征方法和催化应用，展望了人工智能辅助催化剂设计的未来方向。',
    tags: ['单原子催化剂', '纳米催化', '综述'], starred: false,
    aiSummary: '综述单原子催化剂制备与表征，展望AI辅助设计方向。',
    doi: '10.1039/d4cs00012a', database: 'Web of Science', fieldType: '催化化学', literatureType: '期刊论文', relevanceScore: 88,
    keywords: ['single-atom catalyst', 'nanocatalysis', 'heterogeneous catalysis', 'review'],
    recommendReason: '高被引',
    pdfUrl: 'https://example.com/papers/paper7.pdf',
    notes: [],
  },
  {
    id: 8,
    title: 'Computational design of bimetallic catalysts for selective hydrogenation',
    authors: 'Park S, Kim J, Choi M',
    authorFull: [
      { name: 'Park S', affiliation: 'KAIST', hIndex: 26, papers: 55, cited: 2800 },
    ],
    journal: 'ACS Catalysis', year: 2024, cited: 31,
    abstract: '利用DFT计算和机器学习方法设计了双金属催化剂体系，实现了对选择性加氢反应的精准调控。计算筛选了超过200种合金组合，实验验证了5种高活性配方。',
    tags: ['双金属催化剂', '选择性加氢', 'DFT计算'], starred: true,
    aiSummary: 'DFT+ML筛选200+合金组合，5种高活性配方实验验证。',
    doi: '10.1021/acscatal.4c02345', database: 'Scopus', fieldType: '计算化学', literatureType: '期刊论文', relevanceScore: 75,
    keywords: ['bimetallic catalyst', 'selective hydrogenation', 'DFT', 'computational design'],
    recommendReason: '与你收藏相关',
    pdfUrl: 'https://example.com/papers/paper8.pdf',
    notes: [],
  },
  {
    id: 9,
    title: 'Proceedings of the 18th International Congress on Catalysis',
    authors: 'International Association of Catalysis Societies',
    authorFull: [],
    journal: 'IACS Conference Proceedings', year: 2024, cited: 8,
    abstract: '第18届国际催化大会论文集，收录了来自全球400+研究团队的最新催化研究成果，涵盖电催化、光催化、生物催化等前沿领域。',
    tags: ['催化大会', '电催化', '光催化'], starred: false,
    aiSummary: '国际催化大会论文集，400+团队最新成果。',
    doi: '10.1016/j.proccat.2024.001', database: 'Web of Science', fieldType: '催化化学', literatureType: '会议论文', relevanceScore: 60,
    keywords: ['catalysis congress', 'electrocatalysis', 'photocatalysis', 'biocatalysis'],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper9.pdf',
    notes: [],
  },
  {
    id: 10,
    title: 'Green Chemistry: Principles and Practice in Industrial Catalysis',
    authors: 'Johnson R, Thompson L, Garcia M',
    authorFull: [
      { name: 'Johnson R', affiliation: 'MIT', hIndex: 50, papers: 145, cited: 12500 },
    ],
    journal: 'Wiley-VCH', year: 2023, cited: 45,
    abstract: '系统介绍了绿色化学原理在工业催化中的应用，包括原子经济性、可持续溶剂、催化剂回收等关键议题。书中包含50+工业案例分析和实验设计指南。',
    tags: ['绿色化学', '工业催化', '可持续发展'], starred: false,
    aiSummary: '绿色化学工业催化专著，50+案例分析。',
    doi: '10.1002/9783527834567', database: 'Scopus', fieldType: '可持续能源', literatureType: '书籍', relevanceScore: 68,
    keywords: ['green chemistry', 'industrial catalysis', 'atom economy', 'sustainability'],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper10.pdf',
    notes: [],
  },
  {
    id: 11,
    title: 'Catalyst Deactivation and Regeneration: Mechanisms and Industrial Applications',
    authors: 'Wang F, Liu Q, Chen Z, et al.',
    authorFull: [
      { name: 'Wang F', affiliation: '中国石油大学（华东）', hIndex: 30, papers: 78, cited: 4500 },
    ],
    journal: 'Elsevier', year: 2024, cited: 22,
    abstract: '全面论述催化剂失活机理与再生技术，涵盖积碳、烧结、中毒等失活模式，以及氧化再生、溶剂洗涤、超声辅助等再生策略，提供工业装置运维指导。',
    tags: ['催化剂失活', '催化剂再生', '工业应用'], starred: true,
    aiSummary: '催化剂失活与再生技术专著，涵盖主要失活模式与再生策略。',
    doi: '10.1016/B978-0-12-823456-7.00001', database: 'CNKI', fieldType: '催化化学', literatureType: '书籍', relevanceScore: 72,
    keywords: ['catalyst deactivation', 'regeneration', 'coking', 'sintering', 'industrial'],
    recommendReason: '与你收藏相关',
    pdfUrl: 'https://example.com/papers/paper11.pdf',
    notes: [],
  },
  {
    id: 12,
    title: 'AI-driven discovery of novel zeolite topologies for methane conversion',
    authors: 'Sun L, Zhao W, Huang K',
    authorFull: [
      { name: 'Sun L', affiliation: '浙江大学化学工程与生物工程学院', hIndex: 22, papers: 48, cited: 1900 },
    ],
    journal: 'Nature Communications', year: 2024, cited: 39,
    abstract: '利用深度生成模型设计新型分子筛拓扑结构，用于甲烷直接转化反应。模型生成的3种新型拓扑结构经DFT计算验证具有良好的甲烷活化能力。',
    tags: ['AI催化剂设计', '分子筛', '甲烷转化'], starred: false,
    doi: '10.1038/s41467-024-56789-0', database: 'Web of Science', fieldType: 'AI催化', literatureType: '期刊论文', relevanceScore: 85,
    keywords: ['AI catalyst design', 'zeolite topology', 'methane conversion', 'generative model'],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper12.pdf',
    notes: [],
  },
  {
    id: 13,
    title: 'Proceedings of the 5th International Symposium on Catalyst Design',
    authors: 'Catalyst Design Society',
    authorFull: [],
    journal: 'Elsevier Conference Series', year: 2024, cited: 5,
    abstract: '第5届国际催化剂设计研讨会论文集，汇集了AI辅助设计、高通量筛选、原位表征等方向的前沿报告，包含80篇精选论文。',
    tags: ['催化剂设计', 'AI辅助', '高通量筛选'], starred: false,
    doi: '10.1016/j.procdes.2024.005', database: 'CNKI', fieldType: 'AI催化', literatureType: '会议论文', relevanceScore: 55,
    keywords: ['catalyst design', 'AI-assisted', 'high-throughput screening'],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper13.pdf',
    notes: [],
  },
  {
    id: 14,
    title: 'Catalysis: An Integrated Textbook for Graduate Students',
    authors: 'Zhang W, Xu H, Yang R',
    authorFull: [
      { name: 'Zhang W', affiliation: '清华大学化学系', hIndex: 38, papers: 95, cited: 6800 },
    ],
    journal: '高等教育出版社', year: 2023, cited: 15,
    abstract: '面向研究生的催化化学综合教材，系统讲解均相催化、多相催化、酶催化的基本原理和前沿进展，配有200+习题和在线实验仿真模块。',
    tags: ['催化教材', '研究生课程', '实验教学'], starred: false,
    doi: '10.1007/978-7-04-056789-0', database: '万方', fieldType: '催化化学', literatureType: '书籍', relevanceScore: 50,
    keywords: ['catalysis textbook', 'graduate education', 'homogeneous catalysis', 'heterogeneous catalysis'],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper14.pdf',
    notes: [],
  },
  {
    id: 15,
    title: '分子筛催化剂的合成、表征及加氢脱硫性能研究',
    authors: '陈志远',
    authorFull: [
      { name: '陈志远', affiliation: '中国石油大学（北京）', hIndex: 8, papers: 12, cited: 320, researchAreas: ['分子筛催化', '加氢脱硫', '催化剂合成'], topPapers: ['分子筛催化剂的合成与表征 (2023)'], collaborators: ['张毅', '王磊'], pubTrend: [{ year: 2019, count: 1 }, { year: 2020, count: 2 }, { year: 2021, count: 3 }, { year: 2022, count: 2 }, { year: 2023, count: 2 }, { year: 2024, count: 2 }] },
    ],
    journal: '中国石油大学（北京）博士学位论文', year: 2024, cited: 3,
    abstract: '本论文系统研究了ZSM-5和SAPO-34分子筛催化剂的合成方法、表征技术及其在加氢脱硫反应中的催化性能。通过调控硅铝比和引入杂原子改性，显著提升了分子筛的酸性和水热稳定性，在模拟柴油加氢脱硫评价中DBT转化率可达98.5%。',
    tags: ['分子筛', '加氢脱硫', '催化剂合成'], starred: false,
    aiSummary: '博士论文：调控硅铝比和杂原子改性提升分子筛催化性能，DBT转化率达98.5%。',
    doi: '10.12345/cls.cd.bjhydx.202401', database: 'CNKI', fieldType: '催化化学', literatureType: '学位论文', relevanceScore: 83,
    keywords: ['zeolite catalyst', 'hydrodesulfurization', 'synthesis', 'characterization', 'PhD thesis'],
    references: ['Li X et al. (2023) Catal Today 398:12-20', 'Wang T et al. (2024) J Phys Chem C 128:345678'],
    citedBy: [],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper15.pdf',
    notes: [],
  },
  {
    id: 16,
    title: 'Graph neural network-accelerated screening of bimetallic catalysts for selective hydrogenation of acetylene',
    authors: 'Yang F, Tanaka K, Saito M, et al.',
    authorFull: [
      { name: 'Yang F', affiliation: '东京大学工学院', hIndex: 12, papers: 22, cited: 680 },
      { name: 'Tanaka K', affiliation: '京都大学催化研究中心', hIndex: 18, papers: 38, cited: 1400 },
    ],
    journal: 'ChemRxiv (Preprint)', year: 2025, cited: 0,
    abstract: '提出了一种基于图神经网络（GNN）的快速筛选方法，用于乙炔选择性加氢双金属催化剂的虚拟筛选。与传统DFT相比，计算速度提升约500倍，筛选精度保持R²=0.89。已在Pd-Ag和Pd-Cu体系上完成实验验证。',
    tags: ['图神经网络', '双金属催化剂', '选择性加氢', '预印本'], starred: false,
    aiSummary: 'ChemRxiv预印本：GNN加速筛选乙炔加氢双金属催化剂，速度提升500倍。',
    doi: '10.26434/chemrxiv-2025-abcde', database: 'Web of Science', fieldType: 'AI催化', literatureType: '预印本', relevanceScore: 77,
    keywords: ['GNN', 'bimetallic catalyst', 'selective hydrogenation', 'acetylene', 'high-throughput screening'],
    references: ['Kim S et al. (2024) Nat Catal 7:234-248'],
    citedBy: [],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper16.pdf',
    notes: [],
  },
  {
    id: 17,
    title: '工业催化装置运行优化与催化剂寿命预测技术报告',
    authors: '中国石化石油化工科学研究院',
    authorFull: [],
    journal: '中国石化内部技术报告', year: 2024, cited: 2,
    abstract: '针对加氢精制装置运行中催化剂失活速率快、换剂周期短的问题，开发了基于在线监测数据的催化剂寿命预测模型，建立了催化装置运行优化方案，在两套工业装置上成功应用，催化剂使用寿命延长30%以上。',
    tags: ['工业催化', '催化剂寿命', '运行优化'], starred: false,
    aiSummary: '中石化技术报告：催化剂寿命预测模型，工业装置验证使用寿命延长30%。',
    doi: '', database: '万方', fieldType: '石油加工', literatureType: '技术报告', relevanceScore: 70,
    keywords: ['industrial catalysis', 'catalyst lifetime prediction', 'process optimization', 'technical report'],
    references: [],
    citedBy: [],
    recommendReason: '与你收藏相关',
    pdfUrl: 'https://example.com/papers/paper17.pdf',
    notes: [],
  },
  {
    id: 18,
    title: 'GB/T 315-2023 工业用催化裂化催化剂试验方法',
    authors: '全国化学标准化技术委员会',
    authorFull: [],
    journal: '国家标准', year: 2023, cited: 12,
    abstract: '本标准规定了工业用催化裂化催化剂的活性、选择性、稳定性等核心性能指标的试验方法和技术要求，适用于催化裂化催化剂的质量检验和性能评价。标准涵盖微反活性测定、磨损指数测定、堆积密度测定等8项核心检测方法。',
    tags: ['标准文献', '催化裂化', '试验方法'], starred: false,
    aiSummary: '国家标准：催化裂化催化剂8项核心检测方法，适用于质量检验与性能评价。',
    doi: '', database: 'CNKI', fieldType: '催化化学', literatureType: '标准文献', relevanceScore: 62,
    keywords: ['national standard', 'FCC catalyst', 'test method', 'GB/T 315'],
    references: [],
    citedBy: [],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper18.pdf',
    notes: [],
  },
  {
    id: 19,
    title: '基于深度学习的分子筛酸性位点预测与实验验证',
    authors: '林小红',
    authorFull: [
      { name: '林小红', affiliation: '浙江大学化学工程与生物工程学院', hIndex: 6, papers: 8, cited: 180, researchAreas: ['分子筛', '机器学习', '催化计算'], topPapers: ['基于深度学习的分子筛酸性位点预测 (2024)'], collaborators: ['孙磊', '赵伟'], pubTrend: [{ year: 2021, count: 1 }, { year: 2022, count: 2 }, { year: 2023, count: 2 }, { year: 2024, count: 3 }] },
    ],
    journal: '浙江大学硕士学位论文', year: 2024, cited: 1,
    abstract: '构建了基于注意力机制的深度学习模型，用于预测分子筛Brønsted和Lewis酸性位点的分布与强度。模型在ZSM-5和Y型分子筛数据集上预测精度达MAE=0.12，并通过Py-IR实验进行了验证。',
    tags: ['深度学习', '分子筛', '酸性位点', '硕士论文'], starred: false,
    aiSummary: '硕士论文：注意力机制模型预测分子筛酸性位点，MAE=0.12，实验验证。',
    doi: '10.12345/cls.cd.zjdx.202402', database: '万方', fieldType: 'AI催化', literatureType: '学位论文', relevanceScore: 74,
    keywords: ['deep learning', 'acid site prediction', 'zeolite', 'attention mechanism', 'MSc thesis'],
    references: ['Liu H et al. (2023) ACS Catal 13:234-248'],
    citedBy: [],
    recommendReason: '近期发表',
    pdfUrl: 'https://example.com/papers/paper19.pdf',
    notes: [],
  },
  {
    id: 20,
    title: 'Transition metal carbides as emerging catalysts for hydrodesulfurization: From synthesis to application',
    authors: 'Petrov A, Ivanova N, Smirnov D',
    authorFull: [
      { name: 'Petrov A', affiliation: 'Boreskov Institute of Catalysis', hIndex: 20, papers: 45, cited: 1200 },
    ],
    journal: 'arXiv (Preprint)', year: 2025, cited: 0,
    abstract: '探讨了过渡金属碳化物作为新一代加氢脱硫催化剂的潜力，综述了Mo₂C、WC、NbC等碳化物的合成方法、表面性质及HDS催化性能，提出碳化物催化剂可替代传统硫化物催化剂实现更高活性和更低环境影响的加氢脱硫过程。',
    tags: ['过渡金属碳化物', '加氢脱硫', '新兴催化剂', '预印本'], starred: false,
    aiSummary: 'arXiv预印本：过渡金属碳化物替代传统硫化物催化剂的HDS潜力综述。',
    doi: '10.48550/arXiv.2025.01234', database: 'Scopus', fieldType: '催化化学', literatureType: '预印本', relevanceScore: 80,
    keywords: ['transition metal carbide', 'hydrodesulfurization', 'emerging catalyst', 'Mo₂C'],
    references: ['Zhang Y et al. (2024) Appl Catal B 350:123456'],
    citedBy: [],
    recommendReason: '热门领域',
    pdfUrl: 'https://example.com/papers/paper20.pdf',
    notes: [],
  },
];

export const citationFormats = [
  { key: 'apa', label: 'APA' }, { key: 'mla', label: 'MLA' }, { key: 'gb', label: 'GB/T 7714' },
  { key: 'bibtex', label: 'BibTeX' }, { key: 'iknot', label: 'iKnot' }, { key: 'acs', label: 'ACS' },
  { key: 'nature', label: 'Nature' }, { key: 'vancouver', label: 'Vancouver' }, { key: 'chicago', label: 'Chicago' },
];

export function getCitation(paper: Paper, format: string): string {
  switch (format) {
    case 'apa': return `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}. https://doi.org/${paper.doi}`;
    case 'mla': return `${paper.authors}. "${paper.title}." ${paper.journal} (${paper.year}).`;
    case 'gb': return `${paper.authors}. ${paper.title}[J]. ${paper.journal}, ${paper.year}.`;
    case 'bibtex': return `@article{paper${paper.id},\n  title={${paper.title}},\n  author={${paper.authors}},\n  journal={${paper.journal}},\n  year={${paper.year}},\n  doi={${paper.doi}}\n}`;
    case 'iknot': return `${paper.authors}. ${paper.title}. ${paper.journal}, ${paper.year}. DOI: ${paper.doi}. [iKnot:${paper.id}]`;
    case 'acs': return `${paper.authors} ${paper.title}. ${paper.journal} ${paper.year}.`;
    case 'nature': return `${paper.authors} ${paper.title}. \u2018${paper.journal}\u2019 ${paper.year}.`;
    case 'vancouver': return `${paper.authors}. ${paper.title}. ${paper.journal}. ${paper.year}.`;
    case 'chicago': return `${paper.authors}. "${paper.title}." ${paper.journal} (${paper.year}).`;
    default: return `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}.`;
  }
}

export function getPaperById(id: number): Paper | undefined {
  return papers.find(p => p.id === id);
}

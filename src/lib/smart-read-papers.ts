/**
 * Shared utility for managing papers added to smart reading.
 * Uses localStorage for cross-page data sharing.
 */

const STORAGE_KEY = 'smart-read-papers';

export interface SmartReadPaper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  keywords: string[];
  tags: string[];
  literatureType: string;
  relevanceScore: number;
  cited: number;
  addedAt: number;
  /** File name for user-uploaded papers */
  fileName?: string;
  /** Whether this paper was uploaded by the user (vs added from literature search) */
  isUploaded?: boolean;
}

/** Read all papers added to smart reading from localStorage */
export function getSmartReadPapers(): SmartReadPaper[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SmartReadPaper[];
  } catch {
    return [];
  }
}

/** Check if a paper has already been added to smart reading */
export function isPaperInSmartRead(id: number): boolean {
  return getSmartReadPapers().some((p) => p.id === id);
}

/** Add a paper to the smart reading collection (deduplicated by id) */
export function addSmartReadPaper(paper: Omit<SmartReadPaper, 'addedAt'>): boolean {
  if (typeof window === 'undefined') return false;
  const papers = getSmartReadPapers();
  if (papers.some((p) => p.id === paper.id)) return false;
  papers.push({ ...paper, addedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  window.dispatchEvent(new CustomEvent('smart-read-papers-changed'));
  return true;
}

/** Remove a single paper by id from smart reading */
export function removeSmartReadPaper(id: number): void {
  if (typeof window === 'undefined') return;
  const papers = getSmartReadPapers().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  window.dispatchEvent(new CustomEvent('smart-read-papers-changed'));
}

/** Clear all papers from smart reading */
export function clearSmartReadPapers(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('smart-read-papers-changed'));
}

/** Generate a unique negative ID for uploaded papers (to avoid collision with DB ids) */
function generateUploadedId(): number {
  const papers = getSmartReadPapers();
  const minId = papers.length === 0 ? 0 : Math.min(...papers.map(p => p.id), 0);
  return minId - 1;
}

/** Add an uploaded file as a paper to the smart reading collection */
export function addUploadedSmartReadPaper(file: {
  name: string;
  title?: string;
  authors?: string;
}): boolean {
  if (typeof window === 'undefined') return false;
  const id = generateUploadedId();
  const paper: SmartReadPaper = {
    id,
    title: file.title ?? file.name.replace(/\.[^.]+$/, ''),
    authors: file.authors ?? '待识别',
    journal: '待识别',
    year: new Date().getFullYear(),
    doi: '',
    abstract: '',
    keywords: [],
    tags: ['用户上传'],
    literatureType: '期刊论文',
    relevanceScore: 0,
    cited: 0,
    addedAt: Date.now(),
    fileName: file.name,
    isUploaded: true,
  };
  const papers = getSmartReadPapers();
  papers.push(paper);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  window.dispatchEvent(new CustomEvent('smart-read-papers-changed'));
  return true;
}

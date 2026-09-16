/**
 * Shared utility for managing papers added to review generation.
 * Uses localStorage for cross-page data sharing.
 */

const STORAGE_KEY = 'review-papers';

export interface ReviewPaper {
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
}

/** Read all papers added to review from localStorage */
export function getReviewPapers(): ReviewPaper[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReviewPaper[];
  } catch {
    return [];
  }
}

/** Check if a paper has already been added */
export function isPaperAdded(id: number): boolean {
  return getReviewPapers().some((p) => p.id === id);
}

/** Add a paper to the review collection (deduplicated by id) */
export function addReviewPaper(paper: Omit<ReviewPaper, 'addedAt'>): boolean {
  if (typeof window === 'undefined') return false;
  const papers = getReviewPapers();
  if (papers.some((p) => p.id === paper.id)) return false;
  papers.push({ ...paper, addedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  // Dispatch a custom event so other components can react
  window.dispatchEvent(new CustomEvent('review-papers-changed'));
  return true;
}

/** Remove a single paper by id */
export function removeReviewPaper(id: number): void {
  if (typeof window === 'undefined') return;
  const papers = getReviewPapers().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  window.dispatchEvent(new CustomEvent('review-papers-changed'));
}

/** Clear all papers */
export function clearReviewPapers(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('review-papers-changed'));
}

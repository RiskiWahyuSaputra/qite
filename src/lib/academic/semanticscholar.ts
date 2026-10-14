import { JournalReference } from '@/types';

/**
 * Semantic Scholar API Client
 * Provides academic search with paper abstracts, citation counts, and direct open access PDF links.
 */
interface SemanticScholarPaper {
  paperId: string;
  externalIds?: {
    DOI?: string;
    CorpusId?: number;
    ArXiv?: string;
  };
  title?: string;
  year?: number;
  venue?: string;
  abstract?: string;
  citationCount?: number;
  isOpenAccess?: boolean;
  openAccessPdf?: {
    url?: string;
    status?: string;
  };
  authors?: Array<{
    authorId?: string;
    name: string;
  }>;
  url?: string;
}

export async function searchSemanticScholar(
  query: string,
  limit: number = 6,
  yearRange?: { startYear?: number; endYear?: number }
): Promise<JournalReference[]> {
  try {
    const fields = 'paperId,title,abstract,year,venue,authors,citationCount,isOpenAccess,openAccessPdf,externalIds,url';
    let url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=${fields}`;

    if (yearRange?.startYear && yearRange?.endYear) {
      url += `&year=${yearRange.startYear}-${yearRange.endYear}`;
    } else if (yearRange?.startYear) {
      url += `&year=${yearRange.startYear}-`;
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'QiteResearchScout/1.0 (academic-research-assistant)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Semantic Scholar search returned status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const papers: SemanticScholarPaper[] = data.data || [];

    return papers.map((paper) => {
      const doi = paper.externalIds?.DOI;
      const authors = (paper.authors || []).map((a) => a.name);
      const pdfUrl = paper.openAccessPdf?.url;
      const webUrl = paper.url || (doi ? `https://doi.org/${doi}` : undefined);

      return {
        id: `s2-${paper.paperId}`,
        doi,
        title: paper.title || 'Untitled Academic Paper',
        authors,
        year: paper.year,
        venue: paper.venue || 'Peer-Reviewed Journal',
        abstract: paper.abstract,
        url: webUrl,
        pdf_url: pdfUrl,
        source: 'merged' as const,
        citation_count: paper.citationCount || 0,
        is_open_access: paper.isOpenAccess || !!pdfUrl,
      };
    });
  } catch (err) {
    console.error('Error fetching Semantic Scholar:', err);
    return [];
  }
}

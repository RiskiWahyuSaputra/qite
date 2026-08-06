import { JournalReference } from '@/types';

interface CrossrefItem {
  DOI: string;
  title?: string[];
  author?: Array<{
    given?: string;
    family?: string;
    name?: string;
  }>;
  published?: {
    'date-parts'?: number[][];
  };
  'container-title'?: string[];
  URL?: string;
  abstract?: string;
  'is-referenced-by-count'?: number;
  link?: Array<{
    URL: string;
    'content-type'?: string;
  }>;
}

export async function searchCrossref(
  query: string,
  limit: number = 8,
  yearRange?: { startYear?: number; endYear?: number }
): Promise<JournalReference[]> {
  const mailto = process.env.CROSSREF_MAILTO || 'research-scout@example.com';
  let url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${limit}&mailto=${encodeURIComponent(mailto)}`;

  if (yearRange?.startYear && yearRange?.endYear) {
    url += `&filter=from-pub-date:${yearRange.startYear}-01-01,until-pub-date:${yearRange.endYear}-12-31`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': `QiteAcademicScout/1.0 (mailto:${mailto})`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Crossref search returned status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const items: CrossrefItem[] = data.message?.items || [];

    return items.map((item) => {
      const title = item.title?.[0] || 'Untitled Publication';
      const authors = (item.author || []).map((a) => {
        if (a.name) return a.name;
        if (a.family && a.given) return `${a.given} ${a.family}`;
        return a.family || a.given || 'Unknown Author';
      });
      const year = item.published?.['date-parts']?.[0]?.[0];
      const venue = item['container-title']?.[0] || 'Scholarly Journal / Proceeding';
      const webUrl = item.URL || `https://doi.org/${item.DOI}`;
      
      const pdfLink = item.link?.find((l) => l['content-type']?.includes('pdf'))?.URL;

      // Clean abstract tags like <jats:p> if present
      let cleanAbstract: string | undefined = undefined;
      if (item.abstract) {
        cleanAbstract = item.abstract.replace(/<[^>]+>/g, '').trim();
      }

      return {
        id: `cr-${item.DOI.replace(/[^a-zA-Z0-9]/g, '_')}`,
        doi: item.DOI,
        title,
        authors,
        year,
        venue,
        abstract: cleanAbstract,
        url: webUrl,
        pdf_url: pdfLink,
        source: 'crossref',
        citation_count: item['is-referenced-by-count'] || 0,
        is_open_access: !!pdfLink,
      };
    });
  } catch (error) {
    console.error('Error fetching from Crossref:', error);
    return [];
  }
}

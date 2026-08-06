import { JournalReference } from '@/types';

interface OpenAlexWork {
  id: string;
  doi?: string;
  title?: string;
  publication_year?: number;
  primary_location?: {
    source?: {
      display_name?: string;
    };
    landing_page_url?: string;
    pdf_url?: string;
    is_oa?: boolean;
  };
  authorships?: Array<{
    author: {
      display_name: string;
    };
  }>;
  abstract_inverted_index?: Record<string, number[]>;
  cited_by_count?: number;
  open_access?: {
    is_oa?: boolean;
    oa_url?: string;
  };
}

/**
 * Reconstruct abstract from OpenAlex inverted index
 */
function reconstructAbstract(invertedIndex?: Record<string, number[]>): string | undefined {
  if (!invertedIndex) return undefined;
  try {
    const wordPositions: { word: string; pos: number }[] = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) {
        wordPositions.push({ word, pos });
      }
    }
    wordPositions.sort((a, b) => a.pos - b.pos);
    return wordPositions.map((wp) => wp.word).join(' ');
  } catch {
    return undefined;
  }
}

export async function searchOpenAlex(
  query: string,
  limit: number = 8,
  yearRange?: { startYear?: number; endYear?: number }
): Promise<JournalReference[]> {
  const mailto = process.env.OPENALEX_EMAIL || 'academic-scout@example.com';
  const apiKey = process.env.OPENALEX_API_KEY;

  let url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${limit}&mailto=${encodeURIComponent(mailto)}`;
  
  if (apiKey) {
    url += `&api_key=${apiKey}`;
  }

  if (yearRange?.startYear && yearRange?.endYear) {
    url += `&filter=publication_year:${yearRange.startYear}-${yearRange.endYear}`;
  } else if (yearRange?.startYear) {
    url += `&filter=publication_year:>${yearRange.startYear - 1}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': `QiteResearchScout/1.0 (mailto:${mailto})`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`OpenAlex search returned status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const works: OpenAlexWork[] = data.results || [];

    return works.map((work) => {
      const doiRaw = work.doi ? work.doi.replace(/^https:\/\/doi\.org\//, '') : undefined;
      const authors = (work.authorships || []).map((a) => a.author.display_name);
      const venue = work.primary_location?.source?.display_name || 'Academic Publication';
      const webUrl = work.primary_location?.landing_page_url || (work.doi ? work.doi : undefined);
      const pdfUrl = work.open_access?.oa_url || work.primary_location?.pdf_url;
      const abstract = reconstructAbstract(work.abstract_inverted_index);

      return {
        id: `oa-${work.id.split('/').pop() || Math.random().toString(36).substring(7)}`,
        doi: doiRaw,
        title: work.title || 'Untitled Work',
        authors,
        year: work.publication_year,
        venue,
        abstract,
        url: webUrl,
        pdf_url: pdfUrl,
        source: 'openalex',
        citation_count: work.cited_by_count || 0,
        is_open_access: work.open_access?.is_oa || false,
      };
    });
  } catch (error) {
    console.error('Error fetching from OpenAlex:', error);
    return [];
  }
}

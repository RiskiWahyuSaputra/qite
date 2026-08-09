import { JournalReference } from '@/types';

/**
 * Deteksi akreditasi dan badge reputasi akademis berdasarkan venue, citation count, open access, dan DOI
 */
export function determineAcademicBadges(journal: {
  venue?: string;
  citation_count?: number;
  is_open_access?: boolean;
  doi?: string;
}): string[] {
  const badges: string[] = [];
  const v = (journal.venue || '').toLowerCase();

  // 1. Scopus / IEEE / Nature / Springer / Elsevier / ACM
  const scopusVenues = [
    'ieee', 'acm', 'springer', 'elsevier', 'nature', 'sciencedirect',
    'wiley', 'emerald', 'oxford', 'cambridge', 'taylor & francis',
    'plos', 'frontiers', 'hindawi', 'mdpi', 'proceedings', 'transactions'
  ];

  if (scopusVenues.some((sv) => v.includes(sv))) {
    badges.push('SCOPUS / INTERNASIONAL');
  }

  // 2. SINTA Compatible (Jurnal Nasional Indonesia & Regional)
  const sintaKeywords = [
    'jurnal', 'indonesian', 'informatika', 'teknik', 'sistem informasi',
    'pendidikan', 'komputasi', 'ilmu', 'komputer', 'nusantara', 'nasional',
    'universitas', 'institute', 'telkom', 'itb', 'ugm', 'ui', 'its'
  ];

  if (sintaKeywords.some((sk) => v.includes(sk))) {
    badges.push('SINTA COMPATIBLE');
  }

  // 3. Top Cited / High Impact
  if (journal.citation_count && journal.citation_count >= 10) {
    badges.push(`TOP CITED (${journal.citation_count}+ SITASI)`);
  }

  // 4. DOAJ / Open Access Verified
  if (journal.is_open_access) {
    badges.push('DOAJ / OPEN ACCESS');
  } else if (journal.doi) {
    badges.push('DOI REGISTERED');
  }

  // Default fallback if no specific keywords matched
  if (badges.length === 0) {
    badges.push('PEER-REVIEWED');
  }

  return badges;
}

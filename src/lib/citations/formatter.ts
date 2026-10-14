import { JournalReference, CitationItem, Author } from '@/types';

/**
 * Clean and format author list according to standard conventions
 */
function getAuthorDisplay(authors: (string | { name?: string; family?: string; given?: string })[]): string {
  if (!authors || authors.length === 0) return 'Penulis Tidak Diketahui';
  
  const names = authors.map((a) => {
    if (typeof a === 'string') return a;
    if (a.name) return a.name;
    if (a.family && a.given) return `${a.family}, ${a.given.charAt(0)}.`;
    return a.family || a.given || 'Unknown';
  });

  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names[0]} et al.`;
}

/**
 * APA 7th Edition Formatter
 * Author, A. A. (Year). Title of article. Title of Periodical, DOI / URL
 */
export function formatAPA(journal: JournalReference): string {
  const authorStr = getAuthorDisplay(journal.authors);
  const yearStr = journal.year ? `(${journal.year})` : '(n.d.)';
  const titleStr = journal.title.endsWith('.') ? journal.title : `${journal.title}.`;
  const venueStr = journal.venue ? `*${journal.venue}*.` : '';
  const linkStr = journal.doi ? `https://doi.org/${journal.doi}` : (journal.url || '');

  return `${authorStr} ${yearStr}. ${titleStr} ${venueStr} ${linkStr}`.trim();
}

/**
 * IEEE Formatter
 * [1] A. Author, "Title of article," Title of Periodical, year, doi.
 */
export function formatIEEE(journal: JournalReference): string {
  const authorStr = getAuthorDisplay(journal.authors);
  const titleStr = `"${journal.title},"`;
  const venueStr = journal.venue ? `*${journal.venue}*` : '';
  const yearStr = journal.year ? `${journal.year}` : 'n.d.';
  const linkStr = journal.doi ? `doi: ${journal.doi}` : '';

  return `${authorStr}, ${titleStr} ${venueStr}, ${yearStr}. ${linkStr}`.trim();
}

/**
 * Harvard Formatter
 * Author, A. (Year) 'Title of article', Title of Periodical. Available at: URL
 */
export function formatHarvard(journal: JournalReference): string {
  const authorStr = getAuthorDisplay(journal.authors);
  const yearStr = journal.year ? `(${journal.year})` : '(no date)';
  const titleStr = `'${journal.title}'`;
  const venueStr = journal.venue ? `*${journal.venue}*.` : '';
  const urlStr = journal.doi ? `https://doi.org/${journal.doi}` : (journal.url || '');
  const availStr = urlStr ? `Available at: ${urlStr}` : '';

  return `${authorStr} ${yearStr} ${titleStr}, ${venueStr} ${availStr}`.trim();
}

/**
 * Vancouver Formatter
 * Author AA. Title of article. Title of Periodical. Year; DOI/URL
 */
export function formatVancouver(journal: JournalReference): string {
  const authorStr = getAuthorDisplay(journal.authors).replace(/,/g, '');
  const titleStr = journal.title.endsWith('.') ? journal.title : `${journal.title}.`;
  const venueStr = journal.venue ? `${journal.venue}.` : '';
  const yearStr = journal.year ? `${journal.year};` : '';
  const linkStr = journal.doi ? `doi:${journal.doi}` : (journal.url || '');

  return `${authorStr}. ${titleStr} ${venueStr} ${yearStr} ${linkStr}`.trim();
}

/**
 * In-text Citation Formatter
 * e.g. (Pratama et al., 2024)
 */
export function formatInText(journal: JournalReference): string {
  const authorStr = getAuthorDisplay(journal.authors);
  const yearStr = journal.year || 'n.d.';
  return `(${authorStr}, ${yearStr})`;
}

function authorToString(a: string | Author): string {
  if (typeof a === 'string') return a;
  if (a.name) return a.name;
  if (a.family && a.given) return `${a.family}, ${a.given}`;
  return a.family || a.given || 'Unknown';
}

/**
 * Generate BibTeX string for export
 */
export function generateBibTeX(journal: JournalReference): string {
  const firstAuthor = journal.authors[0] ? authorToString(journal.authors[0] as string | Author).split(' ')[0] : 'ref';
  const cleanId = firstAuthor + (journal.year || '2024');
  const safeId = cleanId.toLowerCase().replace(/[^a-z0-9]/g, '');

  return `@article{${safeId},
   author    = {${journal.authors.map((a) => authorToString(a as string | Author)).join(' and ')}},
   title     = {${journal.title}},
   journal   = {${journal.venue || 'Academic Journal'}},
   year      = {${journal.year || ''}},
   doi       = {${journal.doi || ''}},
   url       = {${journal.url || ''}}
 }`;
}

/**
 * Generate RIS format string for Mendeley / Zotero / EndNote
 */
export function generateRIS(journal: JournalReference): string {
  const lines = [
    'TY  - JOUR',
    `TI  - ${journal.title}`,
    ...journal.authors.map((a) => `AU  - ${authorToString(a as string | Author)}`),
    journal.venue ? `JO  - ${journal.venue}` : '',
    journal.year ? `PY  - ${journal.year}` : '',
    journal.doi ? `DO  - ${journal.doi}` : '',
    journal.url ? `UR  - ${journal.url}` : '',
    'ER  - ',
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Generate complete CitationItem model
 */
export function createCitationItem(
  journal: JournalReference,
  citationType: 'direct_quote' | 'paraphrase' | 'abstract_summary',
  content: string,
  pageNumber?: string
): CitationItem {
  const verified = citationType === 'direct_quote' && Boolean(pageNumber);

  let warningLabel = undefined;
  if (citationType === 'paraphrase') {
    warningLabel = 'Parafrasa AI — Periksa kembali teks sumber asli sebelum mencantumkan dalam skripsi.';
  } else if (citationType === 'abstract_summary') {
    warningLabel = 'Ringkasan berasal dari abstrak, bukan teks lengkap (full-text).';
  } else if (!verified) {
    warningLabel = 'Kutipan langsung dari metadata artikel, halaman spesifik belum terverifikasi.';
  }

  return {
    id: `cit-${Math.random().toString(36).substring(2, 9)}`,
    journal_id: journal.id,
    journal_title: journal.title,
    authors: getAuthorDisplay(journal.authors),
    year: journal.year || 'n.d.',
    venue: journal.venue || 'Journal',
    citation_type: citationType,
    content,
    page_number: pageNumber,
    verified,
    warning_label: warningLabel,
    formats: {
      apa: formatAPA(journal),
      ieee: formatIEEE(journal),
      harvard: formatHarvard(journal),
      vancouver: formatVancouver(journal),
      in_text: formatInText(journal),
    },
  };
}

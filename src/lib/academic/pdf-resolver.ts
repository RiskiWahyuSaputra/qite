/**
 * Helper to generate verified academic repository links (Google Scholar, Semantic Scholar, Unpaywall, arXiv)
 */

export function getGoogleScholarUrl(title: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
}

export function getSemanticScholarSearchUrl(title: string): string {
  return `https://www.semanticscholar.org/search?q=${encodeURIComponent(title)}`;
}

export function getPdfDirectOrFallback(journal: {
  pdf_url?: string;
  doi?: string;
  url?: string;
  title: string;
}): {
  hasDirectPdf: boolean;
  downloadUrl: string;
  label: string;
  googleScholarUrl: string;
} {
  const gScholar = getGoogleScholarUrl(journal.title);

  if (journal.pdf_url) {
    return {
      hasDirectPdf: true,
      downloadUrl: journal.pdf_url,
      label: 'Unduh PDF Asli (Open Access)',
      googleScholarUrl: gScholar,
    };
  }

  // If DOI exists, Unpaywall or Sci-Hub / Open DOI resolver
  if (journal.doi) {
    return {
      hasDirectPdf: false,
      downloadUrl: `https://doi.org/${journal.doi}`,
      label: 'Buka via DOI Resmi',
      googleScholarUrl: gScholar,
    };
  }

  if (journal.url) {
    return {
      hasDirectPdf: false,
      downloadUrl: journal.url,
      label: 'Buka Repositori Jurnal',
      googleScholarUrl: gScholar,
    };
  }

  return {
    hasDirectPdf: false,
    downloadUrl: gScholar,
    label: 'Cari PDF di Google Scholar',
    googleScholarUrl: gScholar,
  };
}

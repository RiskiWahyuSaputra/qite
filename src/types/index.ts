export type DocumentScanType = 'title_scan' | 'pdf_scan' | 'paragraph_scan';

export interface Author {
  given?: string;
  family?: string;
  name?: string;
}

export interface JournalReference {
  id: string;
  doi?: string;
  title: string;
  authors: (string | Author)[];
  year?: number;
  venue?: string;
  abstract?: string;
  url?: string;
  pdf_url?: string;
  source: 'openalex' | 'crossref' | 'merged';
  citation_count?: number;
  is_open_access?: boolean;
  relevance_score?: number; // 0 to 100
  relevance_explanation?: string;
  recommended_chapter?: 'BAB I' | 'BAB II' | 'BAB III' | 'BAB IV' | 'BAB V';
  citation_recommendation?: {
    sentence_to_cite: string; // Kalimat mana dalam paragraf pengguna yang membutuhkan sitasi ini
    suggested_intext: string; // e.g. (Smith et al., 2023)
    why_quote_here: string; // Alasan dikutip pada titik kalimat ini
  };
  indexing_badges?: string[]; // e.g. ['SCOPUS Q1/Q2', 'SINTA COMPATIBLE', 'DOAJ INDEXED', 'TOP CITED']
  is_saved?: boolean;
  is_read?: boolean;
}

export interface ChapterAnalysis {
  chapter: string; // e.g. "BAB I — Pendahuluan"
  purpose: string;
  identified_needs: string[];
  suggested_focus: string;
}

export interface PriorLiteratureItem {
  authors: string;
  year: number | string;
  title: string;
  methodology: string;
  key_findings: string;
  similarities: string;
  differences: string;
  relevance_to_user: string;
}

export interface ResearchAnalysis {
  project_title: string;
  field_of_study: string;
  abstract_summary?: string;
  problem_statement?: string;
  research_objectives?: string[];
  methodology?: string;
  variables: {
    independent?: string[];
    dependent?: string[];
    moderating?: string[];
    general_concepts: string[];
  };
  keywords: {
    id: string[];
    en: string[];
  };
  search_queries: string[];
  chapter_breakdown: ChapterAnalysis[];
  literature_matrix?: PriorLiteratureItem[];
}

export interface CitationItem {
  id: string;
  journal_id: string;
  journal_title: string;
  authors: string;
  year: string | number;
  venue: string;
  citation_type: 'direct_quote' | 'paraphrase' | 'abstract_summary';
  content: string;
  page_number?: string;
  verified: boolean;
  warning_label?: string;
  formats: {
    apa: string;
    ieee: string;
    harvard: string;
    vancouver: string;
    in_text: string;
  };
}

export interface ResearchProject {
  id: string;
  title: string;
  field_of_study?: string;
  abstract?: string;
  document_type: DocumentScanType;
  document_name?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  analysis?: ResearchAnalysis;
  journals: JournalReference[];
  saved_citations: CitationItem[];
  created_at: string;
  updated_at: string;
}

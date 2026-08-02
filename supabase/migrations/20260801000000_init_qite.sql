-- ==============================================================================
-- Qite — Skripsi Scout AI
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Research Projects Table
CREATE TABLE IF NOT EXISTS public.research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    field_of_study TEXT,
    abstract TEXT,
    research_variables JSONB DEFAULT '[]'::jsonb,
    keywords JSONB DEFAULT '[]'::jsonb,
    document_type TEXT DEFAULT 'title_scan' CHECK (document_type IN ('title_scan', 'pdf_scan')),
    document_name TEXT,
    raw_document_summary TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Document Analysis Results (Bab I - Bab V structured breakdown)
CREATE TABLE IF NOT EXISTS public.analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE NOT NULL,
    problem_statement TEXT,
    research_objectives JSONB DEFAULT '[]'::jsonb,
    methodology TEXT,
    key_variables JSONB DEFAULT '[]'::jsonb,
    chapter_breakdown JSONB DEFAULT '{}'::jsonb, -- Bab 1 to 5 mapping and reference requirements
    literature_matrix JSONB DEFAULT '[]'::jsonb, -- Prior research comparative table
    suggested_queries JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Journal References (Discovered academic papers from OpenAlex & Crossref)
CREATE TABLE IF NOT EXISTS public.journal_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE NOT NULL,
    doi TEXT,
    title TEXT NOT NULL,
    authors JSONB DEFAULT '[]'::jsonb,
    year INT,
    venue TEXT, -- Journal or conference name
    abstract TEXT,
    url TEXT,
    pdf_url TEXT,
    source TEXT NOT NULL CHECK (source IN ('openalex', 'crossref', 'merged')),
    citation_count INT DEFAULT 0,
    is_open_access BOOLEAN DEFAULT FALSE,
    relevance_score NUMERIC(5,2) DEFAULT 0,
    relevance_explanation TEXT,
    recommended_chapter TEXT, -- BAB I, BAB II, etc.
    is_saved BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Saved Citations (Smart direct quote & academic paraphrase generator results)
CREATE TABLE IF NOT EXISTS public.saved_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE NOT NULL,
    journal_id UUID REFERENCES public.journal_references(id) ON DELETE CASCADE,
    citation_type TEXT NOT NULL CHECK (citation_type IN ('direct_quote', 'paraphrase', 'abstract_summary')),
    content TEXT NOT NULL,
    page_number TEXT,
    verified BOOLEAN DEFAULT FALSE,
    format_apa TEXT,
    format_ieee TEXT,
    format_harvard TEXT,
    format_vancouver TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Research Notes
CREATE TABLE IF NOT EXISTS public.research_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE NOT NULL,
    journal_id UUID REFERENCES public.journal_references(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Search History
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results_count INT DEFAULT 0,
    source TEXT DEFAULT 'hybrid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own projects
CREATE POLICY "Users can view own projects" ON public.research_projects
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own projects" ON public.research_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own projects" ON public.research_projects
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own projects" ON public.research_projects
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Cascade access for child tables
CREATE POLICY "Users can access analysis of their projects" ON public.analysis_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.research_projects p
            WHERE p.id = analysis_results.project_id
            AND (p.user_id = auth.uid() OR p.user_id IS NULL)
        )
    );

CREATE POLICY "Users can access journals of their projects" ON public.journal_references
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.research_projects p
            WHERE p.id = journal_references.project_id
            AND (p.user_id = auth.uid() OR p.user_id IS NULL)
        )
    );

CREATE POLICY "Users can access citations of their projects" ON public.saved_citations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.research_projects p
            WHERE p.id = saved_citations.project_id
            AND (p.user_id = auth.uid() OR p.user_id IS NULL)
        )
    );

CREATE POLICY "Users can access research notes" ON public.research_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.research_projects p
            WHERE p.id = research_notes.project_id
            AND (p.user_id = auth.uid() OR p.user_id IS NULL)
        )
    );

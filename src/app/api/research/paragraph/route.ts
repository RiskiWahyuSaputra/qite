import { NextResponse } from 'next/server';
import { callGroqStructured } from '@/lib/ai/groq';
import { runAcademicSearchPipeline } from '@/lib/academic/pipeline';
import { formatInText } from '@/lib/citations/formatter';
import { ResearchAnalysis, ResearchProject, JournalReference } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ParagraphAnalyzeRequest {
  paragraph: string;
  field?: string;
  yearRange?: { startYear?: number; endYear?: number };
}

export async function POST(req: Request) {
  try {
    const body: ParagraphAnalyzeRequest = await req.json();

    if (!body.paragraph || body.paragraph.trim().length < 20) {
      return NextResponse.json(
        { error: 'Paragraf minimal 20 karakter agar AI dapat menganalisis klaim dan kebutuhan sitasi.' },
        { status: 400 }
      );
    }

    const fieldOfStudy = body.field || 'Penelitian Akademik & Teknologi';

    // 1. First AI Prompt: Break down claims and generate queries
    const claimSystemPrompt = `Anda adalah Academic Citation Specialist dan Reviewer Jurnal Ilmiah.
Tugas Anda adalah membedah sebuah paragraf skripsi mahasiswa, mengidentifikasi setiap kalimat klaim atau argumen yang MEMERLUKAN rujukan/sitasi ilmiah.
Hasilkan:
1. Ringkasan topik utama paragraf.
2. Identifikasi 2-4 kalimat/klaim spesifik yang wajib memiliki sitasi (beserta alasannya, misal: data empiris, definisi teori, metodologi).
3. Query pencarian jurnal ilmiah akademik yang presisi untuk OpenAlex & Crossref (dalam bahasa Inggris & Indonesia).

Format JSON:
{
  "topic_title": string,
  "claims_needing_citation": [
    {
      "sentence": string,
      "reason": string
    }
  ],
  "search_queries": string[],
  "concepts": string[]
}`;

    const claimAnalysis = await callGroqStructured<{
      topic_title: string;
      claims_needing_citation: Array<{ sentence: string; reason: string }>;
      search_queries: string[];
      concepts: string[];
    }>(claimSystemPrompt, `Paragraf Skripsi:\n"${body.paragraph}"\n\nBidang: ${fieldOfStudy}`);

    // 2. Fetch real academic journals from OpenAlex & Crossref
    const queries = claimAnalysis.search_queries?.length > 0
      ? claimAnalysis.search_queries
      : [claimAnalysis.topic_title || body.paragraph.slice(0, 50)];

    const journals = await runAcademicSearchPipeline(
      queries,
      {
        title: claimAnalysis.topic_title || 'Analisis Paragraf',
        field: fieldOfStudy,
        abstract: body.paragraph,
      },
      body.yearRange
    );

    // 3. Second AI Batch Prompt: Map specific journals to sentences in the user's paragraph
    if (journals.length > 0) {
      const batchJournals = journals.slice(0, 8).map((j, idx) => ({
        index: idx,
        title: j.title,
        authors: Array.isArray(j.authors) ? j.authors.slice(0, 2).join(', ') : 'Penulis',
        year: j.year || 'n.d.',
        abstract: j.abstract ? j.abstract.slice(0, 300) : 'Tanpa abstrak',
      }));

      const mappingPrompt = `Anda adalah AI Academic Citation Locator.
Tugas Anda: Pasangkan daftar jurnal rujukan berikut dengan kalimat mana dari paragraf mahasiswa yang paling tepat dikutip.
Tentukan:
- "sentence_to_cite": Kalimat PERSIS dari paragraf mahasiswa yang didukung oleh jurnal ini.
- "suggested_intext": Format sitasi dalam teks, contoh "(Santoso & Lee, 2023)".
- "why_quote_here": Mengapa jurnal ini wajib dikutip pada kalimat tersebut (1 kalimat jelas).

Format output JSON:
{
  "mappings": [
    {
      "index": 0,
      "sentence_to_cite": "string persis dari paragraf",
      "suggested_intext": "(Penulis, Tahun)",
      "why_quote_here": "Menyediakan bukti empiris untuk klaim efektivitas..."
    }
  ]
}`;

      try {
        const mappingRes = await callGroqStructured<{
          mappings: Array<{
            index: number;
            sentence_to_cite: string;
            suggested_intext: string;
            why_quote_here: string;
          }>;
        }>(
          mappingPrompt,
          `Paragraf Asli Mahasiswa:\n"${body.paragraph}"\n\nDaftar Jurnal:\n${JSON.stringify(batchJournals, null, 2)}`
        );

        if (mappingRes?.mappings) {
          mappingRes.mappings.forEach((m) => {
            if (journals[m.index]) {
              journals[m.index].citation_recommendation = {
                sentence_to_cite: m.sentence_to_cite || body.paragraph.slice(0, 80),
                suggested_intext: m.suggested_intext || formatInText(journals[m.index]),
                why_quote_here: m.why_quote_here || 'Mendukung pernyataan klaim dalam paragraf.',
              };
            }
          });
        }
      } catch (e) {
        console.warn('Fallback mapping citation recommendations:', e);
        journals.forEach((j) => {
          j.citation_recommendation = {
            sentence_to_cite: body.paragraph.split('.')[0] + '.',
            suggested_intext: formatInText(j),
            why_quote_here: `Mendukung latar belakang dari publikasi ${j.venue || 'resmi'}.`,
          };
        });
      }
    }

    const projectId = `proj-para-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const projectTitle = claimAnalysis.topic_title || `Telaah Paragraf: ${body.paragraph.slice(0, 60)}...`;

    const analysisResult: ResearchAnalysis = {
      project_title: projectTitle,
      field_of_study: fieldOfStudy,
      abstract_summary: body.paragraph,
      problem_statement: `Analisis kebutuhan sitasi untuk paragraf: "${body.paragraph.slice(0, 150)}..."`,
      research_objectives: claimAnalysis.claims_needing_citation.map((c) => `Verifikasi rujukan: ${c.sentence}`),
      methodology: 'Analisis Komparasi Paragraf & Klaim Ilmiah',
      variables: {
        general_concepts: claimAnalysis.concepts || [],
      },
      keywords: {
        id: claimAnalysis.concepts || [],
        en: queries,
      },
      search_queries: queries,
      chapter_breakdown: [
        {
          chapter: 'Paragraf Pengguna',
          purpose: 'Kebutuhan sitasi per kalimat klaim',
          identified_needs: claimAnalysis.claims_needing_citation.map((c) => c.reason),
          suggested_focus: 'Semua kutipan dipetakan langsung ke kalimat asli.',
        },
      ],
    };

    const project: ResearchProject = {
      id: projectId,
      title: projectTitle,
      field_of_study: fieldOfStudy,
      abstract: body.paragraph,
      document_type: 'paragraph_scan',
      status: 'completed',
      analysis: analysisResult,
      journals,
      saved_citations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      project,
      claimsCount: claimAnalysis.claims_needing_citation.length,
    });
  } catch (error: unknown) {
    console.error('API /api/research/paragraph error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memproses paragraf skripsi.' },
      { status: 500 }
    );
  }
}

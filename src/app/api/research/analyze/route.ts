import { NextResponse } from 'next/server';
import { callGroqStructured } from '@/lib/ai/groq';
import { runAcademicSearchPipeline } from '@/lib/academic/pipeline';
import { ResearchAnalysis, ResearchProject } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60s max execution for serverless

interface AnalyzeRequestBody {
  title: string;
  abstract?: string;
  field?: string;
  keywords?: string[];
  refLanguage?: 'id' | 'en' | 'all';
  yearRange?: { startYear?: number; endYear?: number };
}

export async function POST(req: Request) {
  try {
    const body: AnalyzeRequestBody = await req.json();

    if (!body.title || body.title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Judul skripsi wajib diisi (minimal 5 karakter).' },
        { status: 400 }
      );
    }

    const fieldOfStudy = body.field || 'Ilmu Komputer / Teknologi Informasi';

    // 1. Structure Analysis Prompt for Groq
    const systemPrompt = `Anda adalah Senior Academic Research Advisor dan AI Thesis Scout.
Tugas Anda adalah membedah judul dan informasi skripsi mahasiswa Indonesia secara komprehensif.
Lakukan identifikasi konsep utama, variabel penelitian (bebas, terikat, perantara), rumusan masalah, metodologi yang sesuai, dan breakdown kebutuhan referensi untuk BAB I hingga BAB V.
Hasilkan kata kunci pencarian jurnal akademik dalam Bahasa Indonesia dan Bahasa Inggris, serta 3-4 query pencarian efektif untuk OpenAlex dan Crossref.
Hasilkan tabel komparasi penelitian terdahulu yang relevan (prior literature matrix) dengan 3-4 studi literatur tipikal yang berkaitan erat.

PENTING: Output HARUS murni JSON yang valid dengan skema berikut:
{
  "field_of_study": string,
  "problem_statement": string,
  "research_objectives": string[],
  "methodology": string,
  "variables": {
    "independent": string[],
    "dependent": string[],
    "moderating": string[],
    "general_concepts": string[]
  },
  "keywords": {
    "id": string[],
    "en": string[]
  },
  "search_queries": string[],
  "chapter_breakdown": [
    {
      "chapter": "BAB I — Pendahuluan",
      "purpose": "Urgensi latar belakang, data empiris fenomena masalah",
      "identified_needs": ["Statistik masalah terkini", "Gap riset terdahulu"],
      "suggested_focus": "Cari jurnal mengenai dampak atau urgensi permasalahan..."
    },
    {
      "chapter": "BAB II — Tinjauan Pustaka",
      "purpose": "Landasan teori variabel dan kerangka konseptual",
      "identified_needs": ["Definisi formal variabel", "Kajian model teoritis"],
      "suggested_focus": "Fokus pada teori dasar dan pemodelan..."
    },
    {
      "chapter": "BAB III — Metodologi Penelitian",
      "purpose": "Desain eksperimen, dataset, dan parameter evaluasi",
      "identified_needs": ["Metrik evaluasi", "Standar protokol pengujian"],
      "suggested_focus": "Rujukan implementasi algoritma..."
    },
    {
      "chapter": "BAB IV — Hasil dan Pembahasan",
      "purpose": "Komparasi temuan empiris dengan penelitian sejenis terdahulu",
      "identified_needs": ["Hasil benchmark terdahulu", "Diskusi anomali"],
      "suggested_focus": "Membandingkan akurasi/efisiensi dengan riset rujukan..."
    },
    {
      "chapter": "BAB V — Kesimpulan",
      "purpose": "Sintesis konklusi dan rekomendasi kelanjutan riset",
      "identified_needs": ["Implikasi teoritis dan praktis"],
      "suggested_focus": "Rujukan arah tren riset masa depan..."
    }
  ],
  "literature_matrix": [
    {
      "authors": "Nama Peneliti dkk.",
      "year": 2023,
      "title": "Judul Artikel Terdahulu Terkait",
      "methodology": "Metode yang digunakan",
      "key_findings": "Temuan utama atau performa",
      "similarities": "Persamaan dengan penelitian ini",
      "differences": "Perbedaan / novelitas skripsi ini",
      "relevance_to_user": "Dasar argumen komparasi"
    }
  ]
}`;

    const userPrompt = `Judul Skripsi: "${body.title}"
Bidang Penelitian: "${fieldOfStudy}"
${body.abstract ? `Abstrak Tambahan: ${body.abstract}` : ''}
${body.keywords?.length ? `Kata Kunci Input Pengguna: ${body.keywords.join(', ')}` : ''}`;

    // 2. Inference with Groq
    const analysisResult = await callGroqStructured<ResearchAnalysis>(
      systemPrompt,
      userPrompt
    );

    analysisResult.project_title = body.title;
    analysisResult.field_of_study = fieldOfStudy;

    // 3. Search Academic Publications (OpenAlex + Crossref)
    const queries = analysisResult.search_queries && analysisResult.search_queries.length > 0
      ? analysisResult.search_queries
      : [body.title.slice(0, 50)];

    const journals = await runAcademicSearchPipeline(
      queries,
      {
        title: body.title,
        field: fieldOfStudy,
        abstract: body.abstract,
      },
      body.yearRange
    );

    const projectId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const project: ResearchProject = {
      id: projectId,
      title: body.title,
      field_of_study: fieldOfStudy,
      abstract: body.abstract,
      document_type: 'title_scan',
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
    });
  } catch (error: unknown) {
    console.error('API /api/research/analyze error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kegagalan saat menganalisis skripsi.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

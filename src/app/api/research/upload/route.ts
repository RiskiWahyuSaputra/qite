import { NextResponse } from 'next/server';
import { extractTextFromPDF, extractRelevantThesisChunks } from '@/lib/pdf/extract';
import { callGroqStructured } from '@/lib/ai/groq';
import { runAcademicSearchPipeline } from '@/lib/academic/pipeline';
import { ResearchAnalysis, ResearchProject } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const startYear = formData.get('startYear') ? parseInt(String(formData.get('startYear'))) : undefined;
    const endYear = formData.get('endYear') ? parseInt(String(formData.get('endYear'))) : undefined;
    const yearRange = (startYear || endYear) ? { startYear, endYear } : undefined;

    if (!file) {
      return NextResponse.json({ error: 'File dokumen PDF wajib diunggah.' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Format file tidak valid. Harap unggah file dengan format .PDF.' }, { status: 400 });
    }

    // Limit size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi batas 15MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract Text
    const pdfData = await extractTextFromPDF(buffer);

    if (!pdfData.hasReadableText) {
      return NextResponse.json({
        error: 'Dokumen tampaknya berupa hasil scan gambar atau tidak memiliki teks yang dapat dibaca mesin. OCR memerlukan konfigurasi API OCR eksternal.',
        isScanned: true,
      }, { status: 422 });
    }

    // 2. Chunking for Groq Free Tier token safety
    const chunks = extractRelevantThesisChunks(pdfData.text);

    // 3. AI Document Parsing & Academic Analysis
    const systemPrompt = `Anda adalah Academic Document Analyst & AI Thesis Scout.
Tugas Anda adalah membaca potongan teks proposal/skripsi mahasiswa, mengidentifikasi judul skripsi, rumusan masalah, tujuan, metode, variabel, dan bab skripsi.
Hasilkan kata kunci pencarian jurnal akademik dalam Bahasa Indonesia dan Bahasa Inggris, serta 3-4 query pencarian efektif untuk OpenAlex dan Crossref.
Hasilkan tabel komparasi penelitian terdahulu yang relevan (prior literature matrix) dengan 3-4 studi literatur tipikal yang berkaitan erat.

PENTING: Output HARUS murni JSON yang valid dengan skema berikut:
{
  "project_title": string,
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

    const userPrompt = `Nama Dokumen: ${file.name}
Total Halaman: ${pdfData.numPages}

Bagian Awal Dokumen (Judul, Abstrak, Latar Belakang):
${chunks.introChunk}

Bagian Metodologi:
${chunks.methodChunk}`;

    const analysisResult = await callGroqStructured<ResearchAnalysis>(
      systemPrompt,
      userPrompt
    );

    const docTitle = analysisResult.project_title || file.name.replace(/\.pdf$/i, '');
    analysisResult.project_title = docTitle;

    // 4. Academic Search Pipeline
    const queries = analysisResult.search_queries && analysisResult.search_queries.length > 0
      ? analysisResult.search_queries
      : [docTitle.slice(0, 50)];

    const journals = await runAcademicSearchPipeline(
      queries,
      {
        title: docTitle,
        field: analysisResult.field_of_study || 'Penelitian Akademik',
      },
      yearRange
    );

    const projectId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const project: ResearchProject = {
      id: projectId,
      title: docTitle,
      field_of_study: analysisResult.field_of_study,
      document_type: 'pdf_scan',
      document_name: file.name,
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
      pdfMeta: {
        pages: pdfData.numPages,
        charCount: pdfData.charCount,
      },
    });
  } catch (error: unknown) {
    console.error('API /api/research/upload error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kegagalan saat membaca file PDF skripsi.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

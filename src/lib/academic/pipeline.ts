import { JournalReference } from '@/types';
import { searchOpenAlex } from './openalex';
import { searchCrossref } from './crossref';
import { searchSemanticScholar } from './semanticscholar';
import { callGroqStructured } from '@/lib/ai/groq';

/**
 * Normalizes title string for duplicate checking
 */
function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Deduplicate journals by DOI and normalized title
 */
export function deduplicateJournals(journals: JournalReference[]): JournalReference[] {
  const seenDois = new Set<string>();
  const seenTitles = new Set<string>();
  const results: JournalReference[] = [];

  for (const j of journals) {
    if (j.doi) {
      const cleanDoi = j.doi.toLowerCase().trim();
      if (seenDois.has(cleanDoi)) continue;
      seenDois.add(cleanDoi);
    }

    const normTitle = normalizeTitle(j.title);
    if (normTitle.length > 5 && seenTitles.has(normTitle)) {
      continue;
    }
    seenTitles.add(normTitle);

    results.push(j);
  }

  return results;
}

/**
 * Execute multi-query search across OpenAlex and Crossref, then rank with Groq AI
 */
export async function runAcademicSearchPipeline(
  queries: string[],
  thesisContext: {
    title: string;
    field: string;
    abstract?: string;
  },
  yearRange?: { startYear?: number; endYear?: number }
): Promise<JournalReference[]> {
  // 1. Fetch from OpenAlex, Crossref, and Semantic Scholar in parallel
  const activeQueries = queries.slice(0, 3);
  const searchPromises = activeQueries.flatMap((q) => [
    searchOpenAlex(q, 6, yearRange),
    searchCrossref(q, 6, yearRange),
    searchSemanticScholar(q, 5, yearRange),
  ]);

  const rawResultsNested = await Promise.all(searchPromises);
  const flatResults = rawResultsNested.flat();

  // 2. Deduplicate
  const uniqueJournals = deduplicateJournals(flatResults);

  if (uniqueJournals.length === 0) {
    return [];
  }

  // 3. Batch evaluation with Groq to assess relevance, assign chapter recommendation, and score
  const batchToEvaluate = uniqueJournals.slice(0, 16).map((j, idx) => ({
    index: idx,
    title: j.title,
    venue: j.venue,
    year: j.year,
    abstract: j.abstract ? j.abstract.slice(0, 400) + '...' : 'Tidak ada abstrak',
  }));

  try {
    const systemPrompt = `Anda adalah AI Academic Evaluator untuk penulisan skripsi perguruan tinggi.
Tugas Anda adalah menilai relevansi daftar jurnal berikut terhadap topik penelitian mahasiswa.
Beri skor relevansi 50 - 98 berdasarkan kesesuaian topik.
Tentukan rekomendasi bab skripsi yang paling cocok:
- "BAB I" (Latar Belakang / Urgensi Masalah)
- "BAB II" (Tinjauan Pustaka / Landasan Teori / Penelitian Terdahulu)
- "BAB III" (Metode Penelitian / Desain / Algoritma)
- "BAB IV" (Hasil & Pembahasan / Komparasi)
- "BAB V" (Kesimpulan / Implikasi)
Tuliskan penjelasan singkat (1-2 kalimat) mengapa jurnal ini relevan.
Format output JSON:
{
  "evaluations": [
    {
      "index": 0,
      "relevance_score": 92,
      "relevance_explanation": "Menjelaskan perbandingan akurasi model deep learning pada studi kasus serupa...",
      "recommended_chapter": "BAB II"
    }
  ]
}`;

    const userPrompt = `Topik Skripsi: "${thesisContext.title}"
Bidang: "${thesisContext.field}"
${thesisContext.abstract ? `Abstrak: ${thesisContext.abstract.slice(0, 500)}` : ''}

Daftar Jurnal untuk Dinilai:
${JSON.stringify(batchToEvaluate, null, 2)}`;

    const evaluationRes = await callGroqStructured<{
      evaluations: Array<{
        index: number;
        relevance_score: number;
        relevance_explanation: string;
        recommended_chapter: 'BAB I' | 'BAB II' | 'BAB III' | 'BAB IV' | 'BAB V';
      }>;
    }>(systemPrompt, userPrompt);

    if (evaluationRes?.evaluations) {
      evaluationRes.evaluations.forEach((evalItem) => {
        if (uniqueJournals[evalItem.index]) {
          uniqueJournals[evalItem.index].relevance_score = evalItem.relevance_score;
          uniqueJournals[evalItem.index].relevance_explanation = evalItem.relevance_explanation;
          uniqueJournals[evalItem.index].recommended_chapter = evalItem.recommended_chapter;
        }
      });
    }

    // Default scoring for non-evaluated remaining items
    uniqueJournals.forEach((j) => {
      if (!j.relevance_score) {
        j.relevance_score = j.citation_count ? Math.min(95, 70 + Math.min(j.citation_count, 25)) : 75;
        j.relevance_explanation = `Referensi akademis terkait dari publikasi ${j.venue || 'resmi'}.`;
        j.recommended_chapter = 'BAB II';
      }
    });
  } catch (err) {
    console.warn('Groq batch scoring fallback to heuristic:', err);
    // Fallback scoring if Groq rate limited
    uniqueJournals.forEach((j) => {
      j.relevance_score = j.citation_count ? Math.min(95, 70 + Math.min(j.citation_count, 25)) : 75;
      j.relevance_explanation = `Referensi akademis terkait dari publikasi ${j.venue || 'resmi'}.`;
      j.recommended_chapter = 'BAB II';
    });
  }

  // Sort descending by relevance score
  return uniqueJournals.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
}

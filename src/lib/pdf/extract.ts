import pdf from 'pdf-parse';

export interface ExtractedPDFResult {
  text: string;
  numPages: number;
  info?: Record<string, unknown>;
  hasReadableText: boolean;
  charCount: number;
}

/**
 * Server-side PDF text extractor using pdf-parse with safe chunking and validation
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedPDFResult> {
  try {
    const data = await pdf(buffer);

    const rawText = data.text || '';
    const cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const charCount = cleanText.length;
    // Heuristic: If fewer than 150 characters for a whole multi-page doc, likely scanned image
    const hasReadableText = charCount > 100;

    return {
      text: cleanText,
      numPages: data.numpages || 1,
      info: data.info,
      hasReadableText,
      charCount,
    };
  } catch (error: unknown) {
    console.error('PDF parsing error:', error);
    throw new Error('Gagal memproses file PDF. Pastikan file tidak terenkripsi atau rusak.');
  }
}

/**
 * Smart thesis sections extraction from raw PDF text
 * Picks relevant sections (Title, Abstract, Rumusan Masalah, Metodologi)
 * to avoid exceeding Groq Free Tier token limits.
 */
export function extractRelevantThesisChunks(fullText: string): {
  introChunk: string;
  methodChunk: string;
  summary: string;
} {
  // First 4000 characters usually contain Title, Abstract, Background, Problem Statement
  const introChunk = fullText.slice(0, 4500);

  // Search for methodology or BAB III keywords
  const methodRegex = /(?:BAB\s*III|METODE\s*PENELITIAN|METODOLOGI|RESEARCH\s*METHODOLOGY)/i;
  const methodMatch = fullText.search(methodRegex);

  let methodChunk = '';
  if (methodMatch !== -1) {
    methodChunk = fullText.slice(methodMatch, methodMatch + 3500);
  } else {
    // If not explicitly found, take middle chunk
    const midPoint = Math.floor(fullText.length / 2);
    methodChunk = fullText.slice(midPoint, midPoint + 3000);
  }

  const summary = `Total panjang dokumen: ${fullText.length} karakter. Mengambil ringkasan awal & metode penelitian.`;

  return {
    introChunk,
    methodChunk,
    summary,
  };
}

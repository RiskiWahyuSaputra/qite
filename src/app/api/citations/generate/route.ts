import { NextResponse } from 'next/server';
import { callGroqStructured } from '@/lib/ai/groq';
import { createCitationItem } from '@/lib/citations/formatter';
import { JournalReference } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { journal, thesisContext } = await req.json() as {
      journal: JournalReference;
      thesisContext?: { title: string };
    };

    if (!journal || !journal.title) {
      return NextResponse.json({ error: 'Data jurnal tidak valid' }, { status: 400 });
    }

    // Call Groq to generate intelligent paraphrase and verify if direct quote is possible
    const systemPrompt = `Anda adalah Academic Citation Specialist.
Berdasarkan metadata artikel jurnal dan teks abstrak yang tersedia, buatlah:
1. "paraphrase": Parafrasa akademis formal (2-3 kalimat) yang menjelaskan temuan/konsep artikel dan relevansinya.
2. "abstract_summary": Ringkasan akurat 1-2 kalimat dari abstrak yang ada.
3. "direct_quote": Kalimat kutipan langsung yang otentik HANYA jika terdapat kutipan kalimat utuh dari abstrak yang tertera. Jika abstrak tidak memadai untuk kutipan langsung spesifik, berikan string kosong "".

Format output JSON murni:
{
  "paraphrase": string,
  "abstract_summary": string,
  "direct_quote": string
}`;

    const userPrompt = `Judul Artikel: "${journal.title}"
Penulis: ${Array.isArray(journal.authors) ? journal.authors.join(', ') : 'Penulis'}
Tahun: ${journal.year || 'n.d.'}
Venue: ${journal.venue || 'Publikasi Ilmiah'}
Abstrak: ${journal.abstract || 'Abstrak tidak disediakan dalam metadata penerbit.'}
Konteks Skripsi: ${thesisContext?.title || 'Penelitian Akademik'}`;

    const aiResult = await callGroqStructured<{
      paraphrase: string;
      abstract_summary: string;
      direct_quote?: string;
    }>(systemPrompt, userPrompt, {
      paraphrase: `Berdasarkan penelitian ${Array.isArray(journal.authors) ? journal.authors[0] : 'peneliti'} (${journal.year || 'n.d.'}), topik ini memiliki kontribusi terhadap pemahaman dalam lingkup ${journal.venue || 'terkait'}.`,
      abstract_summary: journal.abstract ? journal.abstract.slice(0, 200) + '...' : 'Ringkasan berdasarkan metadata jurnal.',
      direct_quote: '',
    });

    const paraphraseCitation = createCitationItem(
      journal,
      'paraphrase',
      aiResult.paraphrase
    );

    const abstractCitation = createCitationItem(
      journal,
      'abstract_summary',
      aiResult.abstract_summary
    );

    const citations = [paraphraseCitation, abstractCitation];

    if (aiResult.direct_quote && aiResult.direct_quote.length > 15) {
      citations.unshift(
        createCitationItem(
          journal,
          'direct_quote',
          aiResult.direct_quote,
          undefined // Unverified page number
        )
      );
    }

    return NextResponse.json({
      success: true,
      citations,
    });
  } catch (error: unknown) {
    console.error('API /api/citations/generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghasilkan kutipan cerdas' },
      { status: 500 }
    );
  }
}

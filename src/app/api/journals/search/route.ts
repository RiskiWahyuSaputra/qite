import { NextResponse } from 'next/server';
import { runAcademicSearchPipeline } from '@/lib/academic/pipeline';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { query, field = 'Ilmu Komputer', startYear, endYear } = await req.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query pencarian tidak boleh kosong' }, { status: 400 });
    }

    const journals = await runAcademicSearchPipeline(
      [query],
      {
        title: query,
        field,
      },
      {
        startYear: startYear ? parseInt(startYear) : undefined,
        endYear: endYear ? parseInt(endYear) : undefined,
      }
    );

    return NextResponse.json({
      success: true,
      journals,
      count: journals.length,
    });
  } catch (error: unknown) {
    console.error('API /api/journals/search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal mencari jurnal' },
      { status: 500 }
    );
  }
}

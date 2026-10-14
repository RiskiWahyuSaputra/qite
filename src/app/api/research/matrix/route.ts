import { NextResponse } from 'next/server';
import { generateLiteratureMatrix } from '@/lib/academic/matrix';
import { JournalReference } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, field, journals } = body;

    if (!title || !journals || !Array.isArray(journals)) {
      return NextResponse.json(
        { error: 'Parameter title dan journals wajib diisi.' },
        { status: 400 }
      );
    }

    const matrix = await generateLiteratureMatrix(title, field || 'Umum', journals as JournalReference[]);

    return NextResponse.json({
      success: true,
      matrix,
    });
  } catch (error: unknown) {
    console.error('API Matrix Generation Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghasilkan matriks penelitian terdahulu.' },
      { status: 500 }
    );
  }
}

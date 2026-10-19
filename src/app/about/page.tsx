import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BrutalCard, BrutalBadge } from '@/components/brutalist';

export const metadata = {
  title: 'Tentang Qitee — Skripsi Scout AI',
  description: 'Tentang Qitee Skripsi Scout AI — asisten riset untuk mahasiswa Indonesia.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
        <div className="pb-6 border-b-3 border-[#171717]">
          <BrutalBadge variant="yellow">ABOUT</BrutalBadge>
          <h1 className="text-3xl md:text-4xl font-black mt-2">Tentang Qitee</h1>
          <p className="text-sm font-bold text-neutral-600 mt-1">Skripsi Scout AI — Asisten Riset untuk Mahasiswa Indonesia</p>
        </div>

        <BrutalCard className="p-6 md:p-8 bg-white space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-black">Apa itu Qitee?</h2>
            <p className="font-bold text-neutral-700">
              Qitee adalah AI Research Assistant yang membantu mahasiswa menganalisis judul/PDF/paragraf skripsi, mencari jurnal ilmiah nyata (OpenAlex, Crossref, Semantic Scholar), memetakan sitasi per kalimat dan per BAB, serta menghasilkan daftar pustaka (APA, IEEE, Harvard, Vancouver, BibTeX, RIS) dan matriks penelitian terdahulu untuk BAB II.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">Fitur Utama</h2>
            <ul className="list-disc pl-5 font-bold text-neutral-700 space-y-1">
              <li><strong>3 Mode Input:</strong> Scan Judul, Scan Paragraf Klaim, Scan PDF (server-side extract + chunking).</li>
              <li><strong>Academic Search Nyata:</strong> anti-halusinasi, deduplikasi DOI + judul, badge SCOPUS/SINTA/DOAJ, relevance scoring per BAB.</li>
              <li><strong>Citation Hunter:</strong> bedakan kutipan langsung vs parafrasa AI berlabel vs ringkasan abstrak.</li>
              <li><strong>Literature Matrix:</strong> tabel 7 kolom siap paste ke Word untuk BAB II.</li>
              <li><strong>Local-First + Supabase Ready:</strong> tanpa wajib login, data di browser; siap sync ke PostgreSQL.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">Komitmen Integritas Akademik</h2>
            <p className="font-bold text-neutral-700">
              Qitee adalah alat bantu riset, bukan jasa pembuatan skripsi. Kami membantu mahasiswa menemukan sumber nyata dan memahaminya, tetapi tulisan, analisis, dan tanggung jawab akademik tetap milik mahasiswa. Setiap parafrasa hasil AI diberi label jelas, dan kami menganjurkan pengguna membaca sumber asli serta mengikuti kebijakan kampus tentang penggunaan AI. Baca juga panduan kami tentang <Link href="/blog/kutipan-langsung-parafrasa-dan-ringkasan" className="text-[#3454FF] underline">parafrasa dan plagiarisme</Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">Teknologi</h2>
            <p className="font-bold text-neutral-700">Next.js 16 (App Router) • Tailwind CSS v4 Neo-Brutalism • Groq (gpt-oss-20b) • pdf-parse • Supabase</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">Pengembang</h2>
            <p className="font-bold text-neutral-700">
              Dibuat oleh <span className="font-black">Riski Wahyu Saputra</span> © 2026. Hubungi via <Link href="/contact" className="text-[#3454FF] underline">Kontak</Link> untuk kerja sama, sponsor, atau laporan bug.
            </p>
          </section>

          <div className="pt-4 border-t-2 border-[#171717] flex flex-wrap gap-3 text-xs font-black">
            <Link href="/privacy" className="underline">Kebijakan Privasi</Link>
            <span>•</span>
            <Link href="/terms" className="underline">Syarat Layanan</Link>
            <span>•</span>
            <Link href="/contact" className="underline">Kontak</Link>
            <span>•</span>
            <Link href="/research/new" className="underline">Mulai Riset</Link>
          </div>
        </BrutalCard>
      </main>
      <Footer />
    </div>
  );
}

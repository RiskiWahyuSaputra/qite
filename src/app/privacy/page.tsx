import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BrutalCard, BrutalBadge } from '@/components/brutalist';

export const metadata = {
  title: 'Kebijakan Privasi — Qite Skripsi Scout AI',
  description: 'Kebijakan privasi Qite: bagaimana data riset, PDF, dan informasi pengguna dikelola.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
        <div className="pb-6 border-b-3 border-[#171717]">
          <BrutalBadge variant="yellow">LEGAL</BrutalBadge>
          <h1 className="text-3xl md:text-4xl font-black mt-2">Kebijakan Privasi</h1>
          <p className="text-xs font-mono text-neutral-500 mt-1">Terakhir diperbarui: 14 Oktober 2026</p>
        </div>

        <BrutalCard className="p-6 md:p-8 bg-white space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-black">1. Pengumpulan Data</h2>
            <p className="font-bold text-neutral-700">
              Qite beroperasi dengan prinsip <strong>Local-First</strong>. Judul skripsi, paragraf, file PDF, dan hasil pencarian jurnal disimpan di <code className="bg-neutral-100 px-1">localStorage</code> browser Anda. Kami tidak menyimpan dokumen PDF di server secara permanen — file diproses di memori dan dibuang setelah analisis selesai.
            </p>
            <ul className="list-disc pl-5 font-bold text-neutral-700 space-y-1">
              <li>Data yang dikirim ke AI (Groq) hanya potongan teks yang diproses untuk menghasilkan variabel, keywords, dan query pencarian — bukan file utuh.</li>
              <li>Pencarian jurnal menggunakan API publik OpenAlex, Crossref, dan Semantic Scholar — query pencarian dikirim ke layanan tersebut.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">2. Cookies & LocalStorage</h2>
            <p className="font-bold text-neutral-700">
              Kami menggunakan <code className="bg-neutral-100 px-1">localStorage</code> untuk menyimpan proyek riset (<code>qite_research_projects_v1</code>) dan preferensi bahasa (<code>qite-lang</code> serta cookie <code>qite-lang</code>). Tidak ada cookie pelacakan pihak ketiga kecuali yang diperlukan Google AdSense setelah disetujui. Anda dapat menghapus data kapan saja via halaman <Link href="/settings" className="text-[#3454FF] underline">Pengaturan</Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">3. Google AdSense</h2>
            <p className="font-bold text-neutral-700">
              Qite menampilkan iklan melalui Google AdSense. Google dapat menggunakan cookie untuk menampilkan iklan yang relevan. Anda dapat mengelola preferensi iklan di <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#3454FF] underline">Google Ad Settings</a>. File <code>ads.txt</code> tersedia di <code>/ads.txt</code>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">4. Keamanan</h2>
            <p className="font-bold text-neutral-700">
              Komunikasi ke Groq dan academic APIs dilakukan server-side melalui Next.js Route Handlers. API key tidak pernah dikirim ke browser. Jika Anda mengaktifkan Supabase, data dapat disinkronisasi dengan Row Level Security (RLS) — lihat file migrasi di <code>supabase/migrations/</code>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">5. Hak Pengguna</h2>
            <p className="font-bold text-neutral-700">
              Anda berhak menghapus seluruh data lokal kapan saja. Untuk pertanyaan privasi hubungi kami via <Link href="/contact" className="text-[#3454FF] underline">Kontak</Link>.
            </p>
          </section>

          <div className="pt-4 border-t-2 border-[#171717] flex gap-3 text-xs font-black">
            <Link href="/terms" className="underline">Syarat Layanan</Link>
            <span>•</span>
            <Link href="/about" className="underline">Tentang Qite</Link>
            <span>•</span>
            <Link href="/contact" className="underline">Kontak</Link>
          </div>
        </BrutalCard>
      </main>
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BrutalCard, BrutalBadge } from '@/components/brutalist';

export const metadata = {
  title: 'Syarat Layanan — Qite Skripsi Scout AI',
  description: 'Syarat dan ketentuan penggunaan Qite Skripsi Scout AI.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
        <div className="pb-6 border-b-3 border-[#171717]">
          <BrutalBadge variant="black">LEGAL</BrutalBadge>
          <h1 className="text-3xl md:text-4xl font-black mt-2">Syarat Layanan</h1>
          <p className="text-xs font-mono text-neutral-500 mt-1">Terakhir diperbarui: 14 Oktober 2026</p>
        </div>

        <BrutalCard className="p-6 md:p-8 bg-white space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-black">1. Penerimaan Syarat</h2>
            <p className="font-bold text-neutral-700">Dengan mengakses Qite Anda menyetujui syarat ini. Jika tidak setuju, jangan gunakan layanan.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-black">2. Layanan Akademik — Bukan Pengganti Pembimbing</h2>
            <p className="font-bold text-neutral-700">
              Qite adalah asisten riset berbasis AI. Hasil analisis variabel, rekomendasi jurnal, parafrasa, dan matriks penelitian terdahulu bersifat <strong>bantuan</strong> dan wajib diverifikasi ke sumber asli dan pembimbing akademik. Kutipan bertipe <em>paraphrase</em> diberi label peringatan dan harus diperiksa ulang sebelum dikutip di skripsi.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-black">3. Penggunaan Wajar</h2>
            <ul className="list-disc pl-5 font-bold text-neutral-700 space-y-1">
              <li>Jangan mengunggah dokumen yang melanggar hak cipta pihak lain tanpa izin.</li>
              <li>Jangan melakukan scraping / abuse terhadap endpoint API.</li>
              <li>Jangan menggunakan Qite untuk plagiarisme — selalu sitasi sumber asli.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-black">4. Kekayaan Intelektual</h2>
            <p className="font-bold text-neutral-700">Kode Qite © 2026 Riski Wahyu Saputra. Metadata jurnal berasal dari OpenAlex, Crossref, Semantic Scholar dengan lisensi masing-masing.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-black">5. Batasan Tanggung Jawab</h2>
            <p className="font-bold text-neutral-700">Layanan disediakan &quot;sebagaimana adanya&quot; tanpa jaminan ketersediaan 100%. Kami tidak bertanggung jawab atas keputusan akademik yang diambil berdasarkan output AI.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-black">6. Perubahan Layanan</h2>
            <p className="font-bold text-neutral-700">Kami dapat memperbarui syarat ini sewaktu-waktu. Penggunaan berkelanjutan setelah perubahan dianggap menyetujui versi terbaru.</p>
          </section>
          <div className="pt-4 border-t-2 border-[#171717] flex gap-3 text-xs font-black">
            <Link href="/privacy" className="underline">Kebijakan Privasi</Link>
            <span>•</span>
            <Link href="/contact" className="underline">Kontak</Link>
            <span>•</span>
            <Link href="/about" className="underline">Tentang</Link>
          </div>
        </BrutalCard>
      </main>
      <Footer />
    </div>
  );
}

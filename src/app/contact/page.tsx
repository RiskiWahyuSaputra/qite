import { Navbar, Footer } from '@/components/layout';
import { BrutalCard, BrutalBadge } from '@/components/brutalist';
import Link from 'next/link';

export const metadata = {
  title: 'Kontak — Qitee Skripsi Scout AI',
  description: 'Hubungi tim Qitee untuk pertanyaan, sponsor, atau laporan bug.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
        <div className="pb-6 border-b-3 border-[#171717]">
          <BrutalBadge variant="coral">CONTACT</BrutalBadge>
          <h1 className="text-3xl md:text-4xl font-black mt-2">Kontak</h1>
          <p className="text-sm font-bold text-neutral-600 mt-1">Hubungi pengembang untuk pertanyaan, sponsor iklan, atau laporan bug.</p>
        </div>

        <BrutalCard className="p-6 md:p-8 bg-white space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black">Email Pengembang</h2>
            <a href="mailto:arskies2005@gmail.com?subject=Kontak%20Qitee%20Skripsi" className="inline-block py-2 px-4 bg-[#171717] text-white font-black text-sm brutal-border-sm hover:bg-neutral-800">
              arskies2005@gmail.com
            </a>
            <p className="text-xs font-bold text-neutral-500">Respon biasanya 1–2 hari kerja.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">Topik yang Bisa Ditanyakan</h2>
            <ul className="list-disc pl-5 font-bold text-neutral-700 space-y-1">
              <li>Pertanyaan penggunaan Qitee untuk skripsi & sitasi.</li>
              <li>Penawaran sponsor / pemasangan iklan (media kit tersedia).</li>
              <li>Laporan bug, request fitur, atau kerja sama akademik.</li>
              <li>Donasi / dukungan via Saweria (link di banner sponsor).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black">Alamat</h2>
            <p className="font-bold text-neutral-700">Qitee Skripsi Scout AI — Project by Riski Wahyu Saputra. Operasional remote / online. Korespondensi via email di atas.</p>
          </section>

          <div className="pt-4 border-t-2 border-[#171717] flex flex-wrap gap-3 text-xs font-black">
            <Link href="/about" className="underline">Tentang Qitee</Link>
            <span>•</span>
            <Link href="/privacy" className="underline">Kebijakan Privasi</Link>
            <span>•</span>
            <Link href="/terms" className="underline">Syarat Layanan</Link>
          </div>
        </BrutalCard>
      </main>
      <Footer />
    </div>
  );
}

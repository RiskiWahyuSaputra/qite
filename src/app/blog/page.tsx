import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BrutalCard, BrutalBadge } from '@/components/brutalist';
import { BLOG_POSTS } from '@/lib/blog/posts';

export const metadata = {
  title: 'Blog Qitee — Panduan Menulis Skripsi & Riset Akademik',
  description: 'Panduan praktis menulis skripsi: tinjauan pustaka, sitasi APA, mencari jurnal kredibel, parafrasa, dan verifikasi referensi.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
        <div className="pb-6 border-b-3 border-[#171717]">
          <BrutalBadge variant="yellow">BLOG</BrutalBadge>
          <h1 className="text-3xl md:text-4xl font-black mt-2">Panduan Skripsi & Riset</h1>
          <p className="text-sm font-bold text-neutral-600 mt-1">
            Artikel praktis untuk membantu mahasiswa menulis skripsi dengan jujur, rapi, dan berbasis sumber nyata.
          </p>
        </div>

        <div className="space-y-4">
          {BLOG_POSTS.map((post) => (
            <BrutalCard key={post.slug} className="p-6 bg-white space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold text-neutral-500">
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</time>
                <span>•</span>
                <span>{post.readingMinutes} menit baca</span>
              </div>
              <h2 className="text-lg md:text-xl font-black">
                <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
              </h2>
              <p className="text-sm font-bold text-neutral-700 leading-relaxed">{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="inline-block text-xs font-black uppercase text-[#3454FF] underline">
                Baca selengkapnya →
              </Link>
            </BrutalCard>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

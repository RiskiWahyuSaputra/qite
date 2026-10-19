import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';
import { BrutalCard, BrutalBadge } from '@/components/brutalist';
import { AdBanner } from '@/components/ads/AdBanner';
import { BLOG_POSTS, getPostBySlug, type BlogBlock } from '@/lib/blog/posts';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog Qitee`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date },
  };
}

const renderBlock = (block: BlogBlock, i: number) => {
  switch (block.type) {
    case 'h2':
      return <h2 key={i} className="text-xl font-black pt-4">{block.text}</h2>;
    case 'p':
      return <p key={i} className="font-bold text-neutral-700">{block.text}</p>;
    case 'quote':
      return (
        <blockquote key={i} className="p-3 bg-[#F4FF3F]/30 border-l-4 border-[#171717] font-bold text-neutral-800 italic">
          {block.text}
        </blockquote>
      );
    case 'ul':
      return (
        <ul key={i} className="list-disc pl-5 font-bold text-neutral-700 space-y-1">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} className="list-decimal pl-5 font-bold text-neutral-700 space-y-1">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ol>
      );
  }
};

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const midpoint = Math.floor(post.content.length / 2);
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-8 space-y-6">
        <div className="pb-6 border-b-3 border-[#171717] space-y-2">
          <Link href="/blog" className="text-xs font-black uppercase underline">← Semua Artikel</Link>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => <BrutalBadge key={tag} variant="yellow">{tag}</BrutalBadge>)}
          </div>
          <h1 className="text-2xl md:text-4xl font-black">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-neutral-500">
            <span>Oleh Riski Wahyu Saputra</span>
            <span>•</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</time>
            <span>•</span>
            <span>{post.readingMinutes} menit baca</span>
          </div>
        </div>

        <BrutalCard className="p-6 md:p-8 bg-white space-y-4 text-sm md:text-base leading-relaxed">
          {post.content.slice(0, midpoint).map(renderBlock)}
          <AdBanner slot="content-inline" className="my-4" />
          {post.content.slice(midpoint).map((block, i) => renderBlock(block, i + midpoint))}
        </BrutalCard>

        <BrutalCard className="p-6 bg-white space-y-3">
          <h2 className="text-lg font-black">Artikel Lainnya</h2>
          <ul className="space-y-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-sm font-bold text-[#3454FF] underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </BrutalCard>
      </main>
      <Footer />
    </div>
  );
}

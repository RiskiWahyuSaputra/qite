import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blog/posts';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.qitee.site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/blog', '/about', '/privacy', '/terms', '/contact', '/research/new'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...posts];
}

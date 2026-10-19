import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.qitee.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Mediapartners-Google', allow: '/' },
      { userAgent: '*', allow: '/', disallow: ['/api/', '/settings'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

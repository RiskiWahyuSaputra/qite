'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Halaman aplikasi (tool) tanpa konten penerbit — AdSense tidak boleh tampil di sini
const APP_ROUTES = ['/dashboard', '/research', '/library', '/citations', '/settings'];

export const AdSenseScript = () => {
  const pathname = usePathname();
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!client) return null;
  if (APP_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

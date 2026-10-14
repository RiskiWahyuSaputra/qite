import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { LangProvider } from '@/lib/i18n/LangContext';

export const metadata: Metadata = {
  title: 'Qitee — Skripsi Scout AI | Neo-Brutalism Academic Assistant',
  description: 'AI Research Assistant untuk membantu mahasiswa menganalisis skripsi, mencari jurnal ilmiah yang relevan, menemukan kutipan yang dapat diverifikasi, dan menyusun daftar pustaka.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://qitee.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Qitee — Skripsi Scout AI',
    description: 'AI Research Assistant untuk skripsi — analisis judul/PDF/paragraf, jurnal nyata, sitasi terverifikasi.',
    type: 'website',
    images: ['/logo.png'],
  },
};

export const viewport = {
  themeColor: '#171717',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F5F2EA] text-[#171717] selection:bg-[#F4FF3F] selection:text-[#171717]">
        <LangProvider>
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
          {children}
        </LangProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qite — Skripsi Scout AI | Neo-Brutalism Academic Assistant',
  description: 'AI Research Assistant untuk membantu mahasiswa menganalisis skripsi, mencari jurnal ilmiah yang relevan, menemukan kutipan yang dapat diverifikasi, dan menyusun daftar pustaka.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F5F2EA] text-[#171717] selection:bg-[#F4FF3F] selection:text-[#171717]">
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}

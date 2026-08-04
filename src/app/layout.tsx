import type { Metadata } from 'next';
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
        {children}
      </body>
    </html>
  );
}

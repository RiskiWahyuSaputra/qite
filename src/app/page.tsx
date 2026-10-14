'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { AdBanner } from '@/components/ads/AdBanner';
import {
  Sparkles,
  ArrowRight,
  BookMarked,
  Search,
  CheckCircle2,
  FileCheck2,
  Quote,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <BrutalBadge variant="yellow" className="text-xs px-3 py-1">
                AI-POWERED ACADEMIC RESEARCH
              </BrutalBadge>
              <BrutalBadge variant="blue" className="text-xs px-3 py-1">
                OPENALEX & CROSSREF REAL METADATA
              </BrutalBadge>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-[#171717]">
              STOP GUESSING.<br />
              <span className="bg-[#F4FF3F] px-2 border-3 border-[#171717] brutal-shadow inline-block mt-2">
                START CITING.
              </span>
            </h1>

            <p className="text-lg md:text-xl font-bold text-neutral-800 leading-relaxed max-w-2xl">
              Asisten riset skripsi berbasis AI untuk mahasiswa Indonesia. Bedah judul skripsi atau ekstrak dokumen PDF, temukan jurnal akademik terakreditasi, verifikasi kutipan riil, dan susun daftar pustaka otomatis berstandar internasional.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/research/new">
                <BrutalButton variant="yellow" size="lg" className="text-lg">
                  <span>Mulai Analisis Skripsi</span>
                  <ArrowRight className="w-5 h-5" />
                </BrutalButton>
              </Link>
              <Link href="/dashboard">
                <BrutalButton variant="white" size="lg">
                  <span>Masuk Dashboard</span>
                </BrutalButton>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t-3 border-[#171717]">
              <div>
                <div className="text-2xl font-black font-mono">100%</div>
                <div className="text-xs font-bold text-neutral-700 uppercase">Jurnal Nyata (No AI Halusinasi)</div>
              </div>
              <div>
                <div className="text-2xl font-black font-mono">0 Rupiah</div>
                <div className="text-xs font-bold text-neutral-700 uppercase">Gratis &amp; Terbuka untuk Mahasiswa</div>
              </div>
              <div>
                <div className="text-2xl font-black font-mono">APA & IEEE</div>
                <div className="text-xs font-bold text-neutral-700 uppercase">Generator Sitasi Standar</div>
              </div>
            </div>
          </div>

          {/* Interactive Preview Panel */}
          <div className="lg:col-span-5">
            <BrutalCard className="p-6 relative bg-white rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#171717] mb-4">
                <span className="text-xs font-black uppercase font-mono tracking-wider">LIVE CITATION RADAR</span>
                <BrutalBadge variant="coral" className="text-[10px]">CONTOH DEMO</BrutalBadge>
              </div>

              <div className="space-y-4 font-mono">
                <div className="p-3 bg-[#F5F2EA] brutal-border-sm text-xs">
                  <span className="font-bold text-neutral-500 block mb-1">TOPIK ANALISIS:</span>
                  <div className="font-bold text-sm text-[#171717]">
                    Sistem Rekomendasi Jurnal Akademis Menggunakan Model NLP & Semantic Similarity
                  </div>
                </div>

                <div className="p-3 bg-white brutal-border-sm space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-800 font-bold">
                      RELEVANSI 96%
                    </span>
                    <span className="text-neutral-500 font-bold">BAB II — Tinjauan Pustaka</span>
                  </div>
                  <div className="font-bold text-xs text-[#171717]">
                    &quot;Deep Learning Frameworks for Scientific Literature Matching&quot;
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Kurniawan, A. &amp; Chen, W. (2024). IEEE Transactions on Knowledge Eng.
                  </div>
                  <div className="p-2 bg-[#F4FF3F]/30 border-l-4 border-[#171717] text-[11px]">
                    <span className="font-bold">Parafrasa Akademik:</span> Model embedding berbasis transformer terbukti mempercepat komparasi teks abstrak sebesar 42%.
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="bg-[#3454FF] text-white px-2 py-1 font-bold brutal-border-sm">DOI: 10.1109/TKDE.2024.123</span>
                  <span className="bg-[#171717] text-white px-2 py-1 font-bold brutal-border-sm">OPEN ACCESS</span>
                </div>
              </div>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* Inline Ad — Landing */}
      <div className="max-w-7xl mx-auto w-full px-6">
        <AdBanner slot="content-inline" className="my-6" />
      </div>

      {/* Dual Mode Section */}
      <section className="bg-white border-y-3 border-[#171717] py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <BrutalBadge variant="coral">2 METODE INPUT</BrutalBadge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#171717]">
              PILIH METODE RISET ANDA
            </h2>
            <p className="font-bold text-neutral-600">
              Mulai dari ide kasar di kepala atau dokumen skripsi yang sedang Anda susun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mode A */}
            <BrutalCard className="p-8 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-[#F4FF3F] text-[#171717] flex items-center justify-center font-black text-xl brutal-border">
                A
              </div>
              <h3 className="text-2xl font-black">MODE A — Scan Judul Skripsi</h3>
              <p className="text-sm font-bold text-neutral-700 leading-relaxed">
                Cukup masukkan judul rencana skripsi dan bidang studi. AI akan membedah variabel independen/dependen, merumuskan masalah, dan mencari jurnal pembanding secara otomatis.
              </p>
              <ul className="text-xs font-bold space-y-2 pt-2 text-neutral-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ekstraksi variabel &amp; konsep utama
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Query pencarian bilingual (ID/EN)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Filter rentang tahun publikasi
                </li>
              </ul>
              <Link href="/research/new?mode=title" className="block pt-4">
                <BrutalButton variant="black" className="w-full">
                  Scan Judul Sekarang
                </BrutalButton>
              </Link>
            </BrutalCard>

            {/* Mode B */}
            <BrutalCard className="p-8 space-y-4 hover:-translate-y-1 transition-transform bg-[#F5F2EA]">
              <div className="w-12 h-12 bg-[#3454FF] text-white flex items-center justify-center font-black text-xl brutal-border">
                B
              </div>
              <h3 className="text-2xl font-black">MODE B — Scan PDF Skripsi</h3>
              <p className="text-sm font-bold text-neutral-700 leading-relaxed">
                Unggah draft proposal skripsi dalam format PDF. Sistem server kami mengekstrak teks, memilah struktur bab, mendeteksi kebutuhan kutipan, dan memverifikasi sumber.
              </p>
              <ul className="text-xs font-bold space-y-2 pt-2 text-neutral-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Parsing teks aman di backend Next.js
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Chunking cerdas efisiensi pemrosesan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Deteksi dokumen scan gambar otomatis
                </li>
              </ul>
              <Link href="/research/new?mode=pdf" className="block pt-4">
                <BrutalButton variant="coral" className="w-full">
                  Unggah PDF Skripsi
                </BrutalButton>
              </Link>
            </BrutalCard>

            {/* Mode C — Paragraph Scan */}
            <BrutalCard className="p-8 space-y-4 hover:-translate-y-1 transition-transform bg-[#FF6B5E]/10 border-[#FF6B5E]">
              <div className="w-12 h-12 bg-[#FF6B5E] text-white flex items-center justify-center font-black text-xl brutal-border">
                C
              </div>
              <h3 className="text-2xl font-black">MODE C — Scan Paragraf Klaim</h3>
              <p className="text-sm font-bold text-neutral-700 leading-relaxed">
                Paste satu paragraf skripsi. AI bedah kalimat mana yang butuh sitasi, cari jurnal nyata, dan tunjukkan persis kalimat mana yang harus dikutip.
              </p>
              <ul className="text-xs font-bold space-y-2 pt-2 text-neutral-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Deteksi klaim per kalimat
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mapping jurnal → kalimat spesifik
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rekomendasi in-text citation
                </li>
              </ul>
              <Link href="/research/new?mode=paragraph" className="block pt-4">
                <BrutalButton variant="coral" className="w-full">
                  Scan Paragraf Sekarang
                </BrutalButton>
              </Link>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* Citation Hunter & Bab Mapping */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="space-y-3">
          <BrutalBadge variant="black">CORE INNOVATION</BrutalBadge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#171717]">
            ANALISIS PER BAB &amp; CITATION HUNTER
          </h2>
          <p className="font-bold text-neutral-600 max-w-2xl">
            Kami tidak mengarang kutipan. Sistem secara tegas membedakan antara kutipan langsung, parafrasa akademis berlabel AI, dan ringkasan abstrak.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BrutalCard className="p-6 bg-white space-y-3">
            <div className="p-2 bg-[#F4FF3F] w-fit brutal-border">
              <Quote className="w-6 h-6 text-[#171717]" />
            </div>
            <h4 className="font-black text-lg">Kutipan Langsung Riil</h4>
            <p className="text-xs font-bold text-neutral-600 leading-relaxed">
              Hanya disajikan jika teks otentik tersedia dari penerbit. Disertai nomor halaman atau verifikasi DOI yang valid.
            </p>
          </BrutalCard>

          <BrutalCard className="p-6 bg-white space-y-3">
            <div className="p-2 bg-[#3454FF] text-white w-fit brutal-border">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg">Parafrasa Akademik</h4>
            <p className="text-xs font-bold text-neutral-600 leading-relaxed">
              AI menyusun ulang gagasan menjadi kalimat formal untuk skripsi, dengan label peringatan transparan untuk mahasiswa.
            </p>
          </BrutalCard>

          <BrutalCard className="p-6 bg-white space-y-3">
            <div className="p-2 bg-[#FF6B5E] text-white w-fit brutal-border">
              <BookMarked className="w-6 h-6" />
            </div>
            <h4 className="font-black text-lg">Pemetaan Bab I — V</h4>
            <p className="text-xs font-bold text-neutral-600 leading-relaxed">
              Setiap jurnal diklasifikasikan apakah cocok untuk latar belakang (BAB I), teori &amp; matrix terdahulu (BAB II), atau metodologi (BAB III).
            </p>
          </BrutalCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#171717] text-white border-t-4 border-[#171717] p-8 md:p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-black text-2xl text-[#F4FF3F] font-mono">QITEE</span>
              <span className="text-xs font-bold bg-white text-[#171717] px-2 py-0.5">SKRIPSI SCOUT AI</span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Academic Research Assistant for Indonesian University Students
            </p>
            <div className="text-xs font-bold text-neutral-300 pt-1 flex items-center justify-center md:justify-start gap-1">
              <span>Crafted with passion by</span>
              <span className="text-[#F4FF3F] font-black underline decoration-2 underline-offset-2">
                Riski Wahyu Saputra
              </span>
              <span>© 2026. All rights reserved.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <Link href="/dashboard" className="hover:text-[#F4FF3F]">Dashboard</Link>
            <Link href="/research/new" className="hover:text-[#F4FF3F]">New Research</Link>
            <Link href="/library" className="hover:text-[#F4FF3F]">Library</Link>
            <Link href="/citations" className="hover:text-[#F4FF3F]">Citations</Link>
            <Link href="/settings" className="hover:text-[#F4FF3F]">Settings</Link>
            <span className="text-neutral-600">|</span>
            <Link href="/about" className="hover:text-[#F4FF3F]">About</Link>
            <Link href="/privacy" className="hover:text-[#F4FF3F]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#F4FF3F]">Terms</Link>
            <Link href="/contact" className="hover:text-[#F4FF3F]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

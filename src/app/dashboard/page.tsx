'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Sidebar } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { getStoredProjects, deleteProjectFromStorage } from '@/lib/storage';
import { ResearchProject } from '@/types';
import {
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';

export default function DashboardPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(getStoredProjects());
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Hapus proyek riset ini dari penyimpanan lokal?')) {
      deleteProjectFromStorage(id);
      setProjects(getStoredProjects());
    }
  };

  const totalJournalsFound = projects.reduce((acc, p) => acc + (p.journals?.length || 0), 0);
  const totalSavedCitations = projects.reduce((acc, p) => acc + (p.saved_citations?.length || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-3 border-[#171717]">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-[#171717]">
                  WORKSPACE RISET
                </h1>
                <BrutalBadge variant="yellow">PRO</BrutalBadge>
              </div>
              <p className="text-sm font-bold text-neutral-600 mt-1">
                Kelola proyek telaah skripsi, jurnal ilmiah terverifikasi, dan kutipan akademis.
              </p>
            </div>

            <Link href="/research/new">
              <BrutalButton variant="yellow" size="md">
                <Sparkles className="w-4 h-4" />
                <span>Buat Riset Baru</span>
              </BrutalButton>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BrutalCard className="p-4 bg-white">
              <div className="text-xs font-bold text-neutral-500 uppercase">Total Proyek</div>
              <div className="text-3xl font-black font-mono mt-1">{projects.length}</div>
              <div className="text-[11px] font-bold text-neutral-600 mt-2">Telaah Skripsi Aktif</div>
            </BrutalCard>

            <BrutalCard className="p-4 bg-white">
              <div className="text-xs font-bold text-neutral-500 uppercase">Jurnal Ditemukan</div>
              <div className="text-3xl font-black font-mono mt-1 text-[#3454FF]">{totalJournalsFound}</div>
              <div className="text-[11px] font-bold text-neutral-600 mt-2">OpenAlex &amp; Crossref</div>
            </BrutalCard>

            <BrutalCard className="p-4 bg-white">
              <div className="text-xs font-bold text-neutral-500 uppercase">Kutipan Disimpan</div>
              <div className="text-3xl font-black font-mono mt-1 text-[#FF6B5E]">{totalSavedCitations}</div>
              <div className="text-[11px] font-bold text-neutral-600 mt-2">Daftar Pustaka Siap Pakai</div>
            </BrutalCard>

            <BrutalCard className="p-4 bg-[#F4FF3F]">
              <div className="text-xs font-bold text-[#171717] uppercase">AI Inference</div>
              <div className="text-xl font-black font-mono mt-2">Groq Free Tier</div>
              <div className="text-[11px] font-bold text-neutral-800 mt-1">Model Aktif: gpt-oss-20b</div>
            </BrutalCard>
          </div>

          {/* Launch Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BrutalCard className="p-6 bg-white space-y-4">
              <div className="flex justify-between items-center">
                <BrutalBadge variant="yellow">MODE CEPAT</BrutalBadge>
                <span className="text-xs font-mono font-bold text-neutral-500">Estimasi ~5 detik</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#171717]">Scan Judul &amp; Variabel</h3>
                <p className="text-xs font-bold text-neutral-600 mt-1">
                  Masukkan judul rencana skripsi Anda. AI membedah variabel penelitian dan mencari jurnal ilmiah terkait.
                </p>
              </div>
              <Link href="/research/new?mode=title" className="block pt-2">
                <BrutalButton variant="black" size="md" className="w-full">
                  Input Judul Skripsi
                </BrutalButton>
              </Link>
            </BrutalCard>

            <BrutalCard className="p-6 bg-white space-y-4">
              <div className="flex justify-between items-center">
                <BrutalBadge variant="coral">ANALISIS MENDALAM</BrutalBadge>
                <span className="text-xs font-mono font-bold text-neutral-500">Ekstraksi Server</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#171717]">Unggah Dokumen PDF</h3>
                <p className="text-xs font-bold text-neutral-600 mt-1">
                  Unggah file proposal atau draft skripsi PDF. Server akan memilah struktur bab dan mendeteksi kebutuhan sitasi.
                </p>
              </div>
              <Link href="/research/new?mode=pdf" className="block pt-2">
                <BrutalButton variant="blue" size="md" className="w-full">
                  Upload PDF Skripsi
                </BrutalButton>
              </Link>
            </BrutalCard>
          </div>

          {/* Project History */}
          <section id="projects" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#171717]">RIWAYAT PROYEK TELAAH</h2>
                <span className="text-xs font-bold font-mono bg-neutral-200 px-2 py-0.5 border border-[#171717]">
                  {projects.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center font-bold text-neutral-500 font-mono">
                Memuat riwayat proyek...
              </div>
            ) : projects.length === 0 ? (
              <BrutalCard className="p-12 text-center bg-white space-y-4">
                <div className="w-16 h-16 bg-[#F5F2EA] brutal-border flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-neutral-500" />
                </div>
                <div>
                  <h4 className="text-lg font-black">Belum Ada Proyek Riset</h4>
                  <p className="text-xs font-bold text-neutral-600 mt-1 max-w-md mx-auto">
                    Mulai petualangan riset skripsi Anda sekarang dengan melakukan scan judul atau mengunggah draf PDF skripsi.
                  </p>
                </div>
                <Link href="/research/new">
                  <BrutalButton variant="yellow" size="md" className="mx-auto">
                    Mulai Telaah Skripsi Pertama
                  </BrutalButton>
                </Link>
              </BrutalCard>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <BrutalCard key={proj.id} className="p-5 bg-white hover:-translate-y-0.5 transition-transform">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <BrutalBadge variant={proj.document_type === 'pdf_scan' ? 'coral' : 'yellow'}>
                            {proj.document_type === 'pdf_scan' ? 'PDF SCAN' : 'TITLE SCAN'}
                          </BrutalBadge>
                          <span className="text-xs font-bold text-neutral-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(proj.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <Link href={`/research/${proj.id}`} className="block">
                          <h3 className="text-lg font-black hover:underline text-[#171717]">
                            {proj.title}
                          </h3>
                        </Link>

                        <div className="text-xs font-bold text-neutral-600 flex flex-wrap items-center gap-4">
                          <span>Bidang: {proj.field_of_study || 'Umum'}</span>
                          <span>•</span>
                          <span>{proj.journals?.length || 0} Jurnal Ditemukan</span>
                          <span>•</span>
                          <span>{proj.analysis?.variables?.general_concepts?.length || 0} Konsep Teridentifikasi</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/research/${proj.id}`}>
                          <BrutalButton variant="yellow" size="sm">
                            <span>Buka Hasil</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </BrutalButton>
                        </Link>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-2 border-2 border-[#171717] bg-white hover:bg-red-50 text-neutral-700 hover:text-red-600"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </BrutalCard>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

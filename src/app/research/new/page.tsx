'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { saveProjectToStorage } from '@/lib/storage';
import {
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from 'lucide-react';

function NewResearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'pdf' ? 'pdf' : 'title';

  const [activeTab, setActiveTab] = useState<'title' | 'pdf'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State Mode A
  const [title, setTitle] = useState('');
  const [field, setField] = useState('Ilmu Komputer & Sistem Informasi');
  const [abstract, setAbstract] = useState('');
  const [startYear, setStartYear] = useState('2020');
  const [endYear, setEndYear] = useState('2026');

  // Form State Mode B
  const [file, setFile] = useState<File | null>(null);

  const stepsList = [
    'Document Parsing',
    'AI Analysis (Groq)',
    'Academic Search (OpenAlex/Crossref)',
    'Citation Matching',
    'Results Ready',
  ];

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg('Judul skripsi minimal 5 karakter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setStep(1);

    try {
      const res = await fetch('/api/research/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          field,
          abstract,
          yearRange: {
            startYear: parseInt(startYear) || 2020,
            endYear: parseInt(endYear) || 2026,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menganalisis skripsi.');
      }

      setStep(4);
      saveProjectToStorage(data.project);
      setTimeout(() => {
        router.push(`/research/${data.project.id}`);
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
      setLoading(false);
      setStep(0);
    }
  };

  const handlePDFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Harap pilih dokumen PDF terlebih dahulu.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setStep(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/research/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengekstrak PDF.');
      }

      setStep(4);
      saveProjectToStorage(data.project);
      setTimeout(() => {
        router.push(`/research/${data.project.id}`);
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memproses file PDF.');
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <>
      {/* Tab Selector */}
      <div className="flex border-3 border-[#171717] bg-white brutal-shadow">
        <button
          onClick={() => { setActiveTab('title'); setErrorMsg(null); }}
          disabled={loading}
          className={`flex-1 py-4 px-6 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'title'
              ? 'bg-[#F4FF3F] text-[#171717] border-r-3 border-[#171717]'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border-r-3 border-[#171717]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mode A: Scan Judul Skripsi</span>
        </button>

        <button
          onClick={() => { setActiveTab('pdf'); setErrorMsg(null); }}
          disabled={loading}
          className={`flex-1 py-4 px-6 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === 'pdf'
              ? 'bg-[#3454FF] text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Mode B: Scan PDF Skripsi</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-[#FF6B5E] text-white brutal-border font-bold text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Progress Tracker */}
      {loading && (
        <BrutalCard className="p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase font-mono tracking-wider">
              PIPELINE ANALISIS AKADEMIS SEDANG BERJALAN
            </span>
            <Loader2 className="w-5 h-5 animate-spin text-[#3454FF]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
            {stepsList.map((st, idx) => {
              const isDone = step > idx;
              const isCurrent = step === idx;
              return (
                <div
                  key={st}
                  className={`p-3 brutal-border-sm text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-100 border-emerald-900 text-emerald-900'
                      : isCurrent
                      ? 'bg-[#F4FF3F] text-[#171717] animate-pulse'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  <div className="text-[10px] font-mono mb-1">Tahap 0{idx + 1}</div>
                  <div>{st}</div>
                </div>
              );
            })}
          </div>
        </BrutalCard>
      )}

      {/* Form Mode A: Scan Judul */}
      {activeTab === 'title' && (
        <BrutalCard className="p-8 bg-white space-y-6">
          <form onSubmit={handleTitleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-2">
                Judul Rencana Skripsi <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Implementasi Algoritma Random Forest dan SMOTE untuk Prediksi Kelulusan Mahasiswa Tepat Waktu"
                className="w-full p-4 brutal-border bg-[#F5F2EA] font-bold text-sm text-[#171717] focus:outline-none focus:bg-white"
                required
              />
              <p className="text-[11px] font-bold text-neutral-500 mt-1">
                Semakin spesifik judul atau topik Anda, semakin akurat pencarian jurnal di OpenAlex dan Crossref.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-2">
                  Bidang Penelitian
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="Teknik Informatika / Sistem Informasi"
                  className="w-full p-3 brutal-border bg-[#F5F2EA] font-bold text-sm text-[#171717] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-2">
                    Tahun Dari
                  </label>
                  <input
                    type="number"
                    disabled={loading}
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="w-full p-3 brutal-border bg-[#F5F2EA] font-bold text-sm text-[#171717] focus:outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-2">
                    Tahun Sampai
                  </label>
                  <input
                    type="number"
                    disabled={loading}
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="w-full p-3 brutal-border bg-[#F5F2EA] font-bold text-sm text-[#171717] focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#171717] mb-2">
                Abstrak / Rumusan Masalah Ringkas (Opsional)
              </label>
              <textarea
                rows={4}
                disabled={loading}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Tuliskan latar belakang singkat atau masalah penelitian yang ingin Anda pecahkan..."
                className="w-full p-4 brutal-border bg-[#F5F2EA] font-bold text-sm text-[#171717] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <BrutalButton
                type="submit"
                variant="yellow"
                size="lg"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Menganalisis Skripsi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>ANALYZE RESEARCH &amp; SCOUT JOURNALS</span>
                  </>
                )}
              </BrutalButton>
            </div>
          </form>
        </BrutalCard>
      )}

      {/* Form Mode B: Scan PDF */}
      {activeTab === 'pdf' && (
        <BrutalCard className="p-8 bg-white space-y-6">
          <form onSubmit={handlePDFSubmit} className="space-y-6">
            <div className="border-3 border-dashed border-[#171717] p-8 md:p-12 text-center bg-[#F5F2EA] hover:bg-neutral-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setErrorMsg(null);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-16 h-16 bg-[#3454FF] text-white brutal-border flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-lg font-black text-[#171717]">
                    {file ? file.name : 'Pilih atau Tarik File PDF Skripsi'}
                  </div>
                  <div className="text-xs font-bold text-neutral-500 mt-1 font-mono">
                    {file
                      ? `Ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : 'Format .PDF saja (Maksimal 15MB)'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-100 brutal-border-sm text-xs font-bold text-neutral-700 space-y-1">
              <div>• Server mengekstrak teks asli (Judul, Rumusan, dan Metodologi).</div>
              <div>• Teks di-chunk secara cerdas agar tidak melebihi batas kuota token Groq.</div>
              <div>• Dokumen Anda diproses secara privat dan tidak disimpan permanen tanpa izin.</div>
            </div>

            <div className="pt-2">
              <BrutalButton
                type="submit"
                variant="blue"
                size="lg"
                disabled={loading || !file}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengekstrak &amp; Menganalisis PDF...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>PARSE PDF &amp; CARI REFERENSI</span>
                  </>
                )}
              </BrutalButton>
            </div>
          </form>
        </BrutalCard>
      )}
    </>
  );
}

export default function NewResearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="pb-6 border-b-3 border-[#171717]">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-black text-[#171717]">
                NEW RESEARCH SCOUT
              </h1>
              <BrutalBadge variant="yellow">GROQ INFERENCE</BrutalBadge>
            </div>
            <p className="text-sm font-bold text-neutral-600 mt-1">
              Pilih metode pemindaian untuk menemukan referensi akademis dan menyusun daftar pustaka.
            </p>
          </div>

          <Suspense fallback={<div className="p-8 text-center font-bold font-mono">Memuat formulir...</div>}>
            <NewResearchForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

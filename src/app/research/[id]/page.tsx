'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Sidebar, Footer } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { getStoredProjectById, saveProjectToStorage } from '@/lib/storage';
import { formatAPA, formatIEEE, formatHarvard, formatVancouver, generateBibTeX, generateRIS } from '@/lib/citations/formatter';
import { getPdfDirectOrFallback } from '@/lib/academic/pdf-resolver';
import { determineAcademicBadges } from '@/lib/academic/badges';
import { AdBanner } from '@/components/ads/AdBanner';
import { ResearchProject, JournalReference, CitationItem, PriorLiteratureItem } from '@/types';
import {
  Sparkles,
  BookOpen,
  Quote,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  ChevronRight,
  Filter,
  FileDown,
  Layers,
  ArrowLeft,
  Info,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function ResearchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJournal, setSelectedJournal] = useState<JournalReference | null>(null);
  const [activeChapterFilter, setActiveChapterFilter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<'relevance' | 'year' | 'citations'>('relevance');

  // Citations Hunter State
  const [generatingCitations, setGeneratingCitations] = useState(false);
  const [activeCitationTab, setActiveCitationTab] = useState<'hunter' | 'formats'>('hunter');
  const [activeFormatTab, setActiveFormatTab] = useState<'apa' | 'ieee' | 'harvard' | 'vancouver'>('apa');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [generatingMatrix, setGeneratingMatrix] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  useEffect(() => {
    if (projectId) {
      const p = getStoredProjectById(projectId);
      if (p) {
        setProject(p);
        if (p.journals && p.journals.length > 0) {
          setSelectedJournal(p.journals[0]);
        }
      }
      setLoading(false);
    }
  }, [projectId]);

  // Close matrix modal on Escape
  useEffect(() => {
    if (!showMatrixModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMatrixModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showMatrixModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center font-bold font-mono">
          Memuat data riset...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
        <Navbar />
        <div className="flex-1 p-8 max-w-lg mx-auto text-center space-y-4 pt-20">
          <h2 className="text-2xl font-black">Proyek Tidak Ditemukan</h2>
          <p className="text-sm font-bold text-neutral-600">
            Proyek dengan ID ini tidak ada di penyimpanan lokal browser Anda.
          </p>
          <Link href="/dashboard">
            <BrutalButton variant="yellow" className="mx-auto">
              Kembali ke Dashboard
            </BrutalButton>
          </Link>
        </div>
      </div>
    );
  }

  // Toggle Save Journal — re-read from storage to avoid lost-update race
  const toggleSaveJournal = (journalId: string) => {
    if (!project) return;
    const latest = getStoredProjectById(project.id) || project;
    const updatedJournals = latest.journals.map((j) => {
      if (j.id === journalId) {
        return { ...j, is_saved: !j.is_saved };
      }
      return j;
    });

    const updatedProj = { ...latest, journals: updatedJournals };
    setProject(updatedProj);
    saveProjectToStorage(updatedProj);
    if (selectedJournal?.id === journalId) {
      setSelectedJournal({ ...selectedJournal, is_saved: !selectedJournal.is_saved });
    }
  };

  // Handle Generate Literature Matrix
  const handleGenerateMatrix = async () => {
    if (!project || !project.analysis) return;
    setGeneratingMatrix(true);

    try {
      const res = await fetch('/api/research/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          field: project.analysis.field_of_study || 'Umum',
          journals: project.journals,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal generate matrix');
      if (data.matrix) {
        const latest = getStoredProjectById(project.id) || project;
        const updatedProj: ResearchProject = {
          ...latest,
          analysis: {
            ...latest.analysis!,
            literature_matrix: data.matrix,
          },
        };
        setProject(updatedProj);
        saveProjectToStorage(updatedProj);
        setShowMatrixModal(true);
      }
    } catch (err) {
      console.error('Error generating matrix:', err);
      alert(err instanceof Error ? err.message : 'Gagal menghasilkan matriks penelitian terdahulu.');
    } finally {
      setGeneratingMatrix(false);
    }
  };

  // Run Citation Hunter with Groq AI — re-read to avoid lost update
  const handleGenerateCitations = async () => {
    if (!selectedJournal || !project) return;
    setGeneratingCitations(true);

    try {
      const res = await fetch('/api/citations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journal: selectedJournal,
          thesisContext: { title: project.title },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newCits = data.citations as CitationItem[];
      const latest = getStoredProjectById(project.id) || project;
      const existingCits = latest.saved_citations || [];
      const updatedProj = {
        ...latest,
        saved_citations: [...existingCits, ...newCits],
      };

      setProject(updatedProj);
      saveProjectToStorage(updatedProj);
      setActiveCitationTab('hunter');
    } catch (err) {
      console.error('Error generating citations:', err);
    } finally {
      setGeneratingCitations(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Filter & Sort Journals
  let displayedJournals = [...(project.journals || [])];
  if (activeChapterFilter !== 'ALL') {
    displayedJournals = displayedJournals.filter((j) => j.recommended_chapter === activeChapterFilter);
  }

  displayedJournals.sort((a, b) => {
    if (sortOption === 'relevance') return (b.relevance_score || 0) - (a.relevance_score || 0);
    if (sortOption === 'year') return (b.year || 0) - (a.year || 0);
    if (sortOption === 'citations') return (b.citation_count || 0) - (a.citation_count || 0);
    return 0;
  });

  const selectedCitations = (project.saved_citations || []).filter(
    (c) => c.journal_id === selectedJournal?.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />

      {/* Top Breadcrumb & Project Header */}
      <div className="bg-white brutal-border border-t-0 border-x-0 py-3.5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 brutal-border-sm hover:bg-neutral-100 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-neutral-500 font-mono">
                  HASIL TELAAH RISET
                </span>
                <BrutalBadge variant="yellow" className="text-[10px]">
                  {project.document_type === 'pdf_scan' ? 'DOKUMEN PDF' : project.document_type === 'paragraph_scan' ? 'SCAN PARAGRAF' : 'SCAN JUDUL'}
                </BrutalBadge>
              </div>
              <h1 className="text-base md:text-xl font-black text-[#171717] line-clamp-1 max-w-2xl">
                {project.title}
              </h1>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tombol Matriks Penelitian Terdahulu - Sangat Menonjol */}
            <button
              onClick={handleGenerateMatrix}
              disabled={generatingMatrix}
              className="py-2 px-3.5 bg-[#F4FF3F] text-[#171717] border-2 border-[#171717] font-black text-xs uppercase flex items-center gap-2 hover:bg-[#e4ef30] shadow-[3px_3px_0_#171717] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#171717]" />
              <span>{generatingMatrix ? 'Menyusun Matriks...' : '📋 Matriks Penelitian (Bab II)'}</span>
            </button>

            <Link href="/citations">
              <BrutalButton variant="white" size="sm">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Koleksi Sitasi ({project.saved_citations?.length || 0})</span>
              </BrutalButton>
            </Link>
          </div>
        </div>
      </div>

      {/* 3-Column Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: Struktur Bab & Konsep Skripsi (Col 1-3) */}
        <section className="lg:col-span-3 space-y-4">
          <BrutalCard className="p-4 bg-white space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-[#171717]">
              <Layers className="w-4 h-4 text-[#3454FF]" />
              <span className="text-xs font-black uppercase tracking-wider">STRUKTUR SKRIPSI</span>
            </div>

            {/* Filter Bab Buttons */}
            <div className="space-y-1.5 font-bold text-xs">
              <button
                onClick={() => setActiveChapterFilter('ALL')}
                className={`w-full text-left px-3 py-2 brutal-border-sm flex justify-between items-center transition-all ${
                  activeChapterFilter === 'ALL' ? 'bg-[#171717] text-white' : 'bg-white hover:bg-neutral-100'
                }`}
              >
                <span>Semua Bagian</span>
                <span className="font-mono text-[10px]">{project.journals.length}</span>
              </button>

              {['BAB I', 'BAB II', 'BAB III', 'BAB IV', 'BAB V'].map((bab) => {
                const count = project.journals.filter((j) => j.recommended_chapter === bab).length;
                return (
                  <button
                    key={bab}
                    onClick={() => setActiveChapterFilter(bab)}
                    className={`w-full text-left px-3 py-2 brutal-border-sm flex justify-between items-center transition-all ${
                      activeChapterFilter === bab ? 'bg-[#F4FF3F] text-[#171717]' : 'bg-white hover:bg-neutral-100'
                    }`}
                  >
                    <span>{bab}</span>
                    <span className="font-mono text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Buat Matriks di Sidebar Kiri juga */}
            <div className="pt-2">
              <button
                onClick={handleGenerateMatrix}
                disabled={generatingMatrix}
                className="w-full py-2 px-3 bg-[#F4FF3F] text-[#171717] border-2 border-[#171717] font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#e4ef30] shadow-[2px_2px_0_#171717] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generatingMatrix ? 'Memproses...' : 'Tabel Matriks Bab II'}</span>
              </button>
            </div>

            {/* Variabel Penelitian */}
            {project.analysis?.variables && (
              <div className="pt-3 border-t-2 border-[#171717] space-y-2">
                <span className="text-[11px] font-black uppercase text-neutral-500 block">
                  VARIABEL &amp; KONSEP
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.analysis.variables.general_concepts?.map((c) => (
                    <span key={c} className="text-[11px] font-bold bg-[#F5F2EA] px-2 py-0.5 brutal-border-sm">
                      {c}
                    </span>
                  ))}
                  {project.analysis.variables.independent?.map((c) => (
                    <span key={c} className="text-[11px] font-bold bg-blue-100 px-2 py-0.5 brutal-border-sm text-blue-900">
                      IV: {c}
                    </span>
                  ))}
                  {project.analysis.variables.dependent?.map((c) => (
                    <span key={c} className="text-[11px] font-bold bg-emerald-100 px-2 py-0.5 brutal-border-sm text-emerald-900">
                      DV: {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rumusan Masalah */}
            {project.analysis?.problem_statement && (
              <div className="pt-3 border-t-2 border-[#171717] space-y-1">
                <span className="text-[11px] font-black uppercase text-neutral-500 block">
                  RUMUSAN MASALAH
                </span>
                <p className="text-xs font-bold text-neutral-700 leading-relaxed bg-[#F5F2EA] p-2.5 brutal-border-sm">
                  {project.analysis.problem_statement}
                </p>
              </div>
            )}
          </BrutalCard>

          {/* Matrix Penelitian Terdahulu (Literature Matrix) */}
          {project.analysis?.literature_matrix && project.analysis.literature_matrix.length > 0 && (
            <BrutalCard className="p-4 bg-white space-y-3">
              <span className="text-xs font-black uppercase tracking-wider block">
                MATRIKS PENELITIAN TERDAHULU
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {project.analysis.literature_matrix.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F5F2EA] brutal-border-sm text-[11px] space-y-1">
                    <div className="font-black text-[#171717]">{item.authors} ({item.year})</div>
                    <div className="font-bold text-neutral-600 line-clamp-1">&quot;{item.title}&quot;</div>
                    <div className="text-[10px] text-neutral-700">
                      <span className="font-bold">Metode:</span> {item.methodology}
                    </div>
                  </div>
                ))}
              </div>
            </BrutalCard>
          )}
        </section>

        {/* PANEL TENGAH: Daftar Jurnal Akademik (Col 4-8) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between bg-white p-3 brutal-border-sm">
            <span className="text-xs font-black uppercase">
              {displayedJournals.length} JURNAL DITEMUKAN
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-neutral-500">Urut:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="text-xs font-bold bg-[#F5F2EA] border border-[#171717] p-1 focus:outline-none"
              >
                <option value="relevance">Skor Relevansi</option>
                <option value="year">Tahun Terbaru</option>
                <option value="citations">Sitasi Terbanyak</option>
              </select>
            </div>
          </div>

          {displayedJournals.length === 0 ? (
            <BrutalCard className="p-8 text-center bg-white space-y-2">
              <Info className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-black text-sm">Tidak Ada Jurnal Pada Filter Ini</div>
              <p className="text-xs font-bold text-neutral-500">
                Pilih bagian bab lain atau ubah query pencarian.
              </p>
            </BrutalCard>
          ) : (
            <div className="space-y-3">
              {displayedJournals.map((j) => {
                const isSelected = selectedJournal?.id === j.id;
                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJournal(j)}
                    className={`p-4 brutal-card cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#F4FF3F]/15 border-3 border-[#171717] shadow-[6px_6px_0_#171717]'
                        : 'bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {j.relevance_score && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-800 px-1.5 py-0.5">
                              {j.relevance_score}% MATCH
                            </span>
                          )}
                          <span className="text-[10px] font-black bg-[#171717] text-white px-1.5 py-0.5">
                            {j.recommended_chapter || 'BAB II'}
                          </span>
                          
                          {/* BADGE INDEKS AKADEMIS (SCOPUS, SINTA, DOAJ) */}
                          {(j.indexing_badges || determineAcademicBadges(j)).map((b, bIdx) => (
                            <span
                              key={bIdx}
                              className={`text-[9px] font-black px-1.5 py-0.5 border ${
                                b.includes('SCOPUS')
                                  ? 'bg-[#3454FF] text-white border-[#171717]'
                                  : b.includes('SINTA')
                                  ? 'bg-amber-300 text-[#171717] border-[#171717]'
                                  : b.includes('TOP CITED')
                                  ? 'bg-[#FF6B5E] text-white border-[#171717]'
                                  : 'bg-[#F5F2EA] text-neutral-800 border-neutral-400'
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-black text-sm text-[#171717] leading-snug">
                          {j.title}
                        </h3>

                        <div className="text-xs font-bold text-neutral-600 line-clamp-1">
                          {Array.isArray(j.authors) ? j.authors.slice(0, 3).join(', ') : 'Penulis'}
                          {j.year ? ` • (${j.year})` : ''}
                        </div>

                        <div className="text-[11px] text-neutral-500 line-clamp-1 italic">
                          {j.venue || 'Publikasi Ilmiah'}
                        </div>

                        {/* Indikator PDF / Open Access */}
                        <div className="flex items-center gap-2 pt-1">
                          {j.pdf_url ? (
                            <span className="text-[10px] font-black bg-[#F4FF3F] text-[#171717] px-1.5 py-0.2 border border-[#171717] flex items-center gap-1">
                              <FileDown className="w-3 h-3" /> PDF TERSEDIA
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-neutral-500 flex items-center gap-1">
                              <span>Tersedia di Google Scholar</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Tombol Unduh PDF / Repositori di samping Simpan Jurnal */}
                        {(() => {
                          const pdfInfo = getPdfDirectOrFallback(j);
                          return (
                            <a
                              href={pdfInfo.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`p-2 brutal-border-sm flex items-center justify-center transition-colors ${
                                pdfInfo.hasDirectPdf
                                  ? 'bg-[#F4FF3F] hover:bg-[#e2ed28] text-[#171717]'
                                  : 'bg-[#F5F2EA] hover:bg-neutral-200 text-neutral-800'
                              }`}
                              title={pdfInfo.label}
                            >
                              <FileDown className="w-4 h-4" />
                            </a>
                          );
                        })()}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJournal(j.id);
                          }}
                          className={`p-2 brutal-border-sm transition-colors ${
                            j.is_saved ? 'bg-[#FF6B5E] text-white' : 'bg-white hover:bg-neutral-100 text-neutral-700'
                          }`}
                          title="Simpan Jurnal"
                        >
                          {j.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {j.relevance_explanation && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200 text-[11px] font-bold text-neutral-700 flex items-start gap-1.5">
                        <span className="text-neutral-400">💡</span>
                        <span>{j.relevance_explanation}</span>
                      </div>
                    )}

                    {j.citation_recommendation && (
                      <div className="mt-2 p-2.5 bg-[#FF6B5E]/15 border-2 border-[#171717] text-[11px] space-y-1">
                        <div className="font-black text-[#171717] flex items-center gap-1">
                          <span>🎯 Dikutip pada kalimat:</span>
                        </div>
                        <div className="italic text-neutral-900 font-bold bg-white p-1.5 border border-[#171717]">
                          &quot;{j.citation_recommendation.sentence_to_cite}&quot;
                        </div>
                        <div className="text-[10px] font-mono text-neutral-700 flex justify-between pt-0.5">
                          <span>Format Sitasi: <strong>{j.citation_recommendation.suggested_intext}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PANEL KANAN: Detail, Citation Hunter & Generator (Col 9-12) */}
        <section className="lg:col-span-4 space-y-4">
          <AdBanner slot="content-inline" />
          {selectedJournal ? (
            <BrutalCard className="p-5 bg-white space-y-5 sticky top-20">
              {/* Header Jurnal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <BrutalBadge variant="yellow" className="text-[10px]">
                    CITATION RADAR
                  </BrutalBadge>
                  {selectedJournal.url && (
                    <a
                      href={selectedJournal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black text-[#3454FF] hover:underline flex items-center gap-1"
                    >
                      <span>Buka Sumber Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <h2 className="text-base font-black text-[#171717] leading-snug">
                  {selectedJournal.title}
                </h2>
                <div className="text-xs font-bold text-neutral-600 mt-1">
                  {Array.isArray(selectedJournal.authors) ? selectedJournal.authors.join(', ') : 'Penulis'}
                </div>
                <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                  {selectedJournal.venue} • {selectedJournal.year || 'n.d.'}
                </div>
              </div>

              {/* DOI & Access Pill */}
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedJournal.doi && (
                  <span className="bg-[#F5F2EA] px-2 py-0.5 font-bold font-mono brutal-border-sm text-[11px]">
                    DOI: {selectedJournal.doi}
                  </span>
                )}
                {selectedJournal.is_open_access && (
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 font-bold font-mono border border-emerald-800 text-[11px]">
                    OPEN ACCESS
                  </span>
                )}
              </div>

              {/* ACTION BAR: DOWNLOAD PDF & REPOSITORI VALID */}
              {(() => {
                const pdfInfo = getPdfDirectOrFallback(selectedJournal);
                return (
                  <div className="p-3 bg-[#F4FF3F]/20 border-2 border-[#171717] space-y-2">
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#171717]">
                      📥 AKSES FULL-TEXT & PDF VALID:
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={pdfInfo.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2 px-3 brutal-border-sm text-xs font-black uppercase text-center flex items-center justify-center gap-1.5 transition-all ${
                          pdfInfo.hasDirectPdf
                            ? 'bg-[#F4FF3F] hover:bg-[#e4ef30] text-[#171717]'
                            : 'bg-white hover:bg-neutral-100 text-[#171717]'
                        }`}
                      >
                        <FileDown className="w-4 h-4 shrink-0 text-[#171717]" />
                        <span>{pdfInfo.label}</span>
                      </a>

                      <a
                        href={pdfInfo.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-white hover:bg-neutral-100 brutal-border-sm text-xs font-black uppercase text-center flex items-center justify-center gap-1.5 text-[#171717]"
                        title="Cek di Google Scholar untuk versi PDF lainnya"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#3454FF]" />
                        <span>Google Scholar</span>
                      </a>
                    </div>

                    <div className="text-[10px] text-neutral-600 font-mono">
                      * Sumber referensi diambil dari indeks resmi OpenAlex, Crossref &amp; Semantic Scholar.
                    </div>
                  </div>
                );
              })()}

              {/* Rekomendasi Titik Kutipan Paragraf */}
              {selectedJournal.citation_recommendation && (
                <div className="p-3 bg-[#FF6B5E]/15 brutal-border-sm space-y-1.5">
                  <div className="text-[11px] font-black uppercase text-[#171717] flex items-center gap-1">
                    <span>🎯 LOKASI SITASI DALAM PARAGRAF:</span>
                  </div>
                  <div className="text-xs font-bold text-neutral-800 bg-white p-2 border border-[#171717]">
                    &quot;{selectedJournal.citation_recommendation.sentence_to_cite}&quot;
                  </div>
                  <div className="text-[11px] text-neutral-700 font-medium pt-0.5">
                    <strong>Alasan Dikutip:</strong> {selectedJournal.citation_recommendation.why_quote_here}
                  </div>
                </div>
              )}

              {/* Abstrak Jurnal */}
              {selectedJournal.abstract && (
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-neutral-500 block">
                    ABSTRAK
                  </span>
                  <div className="max-h-36 overflow-y-auto p-2.5 bg-[#F5F2EA] brutal-border-sm text-xs font-normal text-neutral-800 leading-relaxed">
                    {selectedJournal.abstract}
                  </div>
                </div>
              )}

              {/* Sub-Tabs: Citation Hunter vs Formats */}
              <div className="border-b-2 border-[#171717] flex gap-2">
                <button
                  onClick={() => setActiveCitationTab('hunter')}
                  className={`pb-2 text-xs font-black uppercase tracking-wider ${
                    activeCitationTab === 'hunter'
                      ? 'border-b-3 border-[#171717] text-[#171717]'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Citation Hunter
                </button>
                <button
                  onClick={() => setActiveCitationTab('formats')}
                  className={`pb-2 text-xs font-black uppercase tracking-wider ${
                    activeCitationTab === 'formats'
                      ? 'border-b-3 border-[#171717] text-[#171717]'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Generator Sitasi
                </button>
              </div>

              {/* Citation Hunter Tab */}
              {activeCitationTab === 'hunter' && (
                <div className="space-y-3">
                  {selectedCitations.length === 0 ? (
                    <div className="text-center p-4 bg-[#F5F2EA] brutal-border-sm space-y-3">
                      <Quote className="w-6 h-6 text-neutral-500 mx-auto" />
                      <div className="text-xs font-bold text-neutral-700">
                        Belum ada kutipan yang dibuat untuk jurnal ini.
                      </div>
                      <BrutalButton
                        variant="yellow"
                        size="sm"
                        disabled={generatingCitations}
                        onClick={handleGenerateCitations}
                        className="w-full"
                      >
                        {generatingCitations ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Menganalisis Teks Sumber...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Hasilkan Kutipan Cerdas AI</span>
                          </>
                        )}
                      </BrutalButton>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCitations.map((cit) => (
                        <div key={cit.id} className="p-3 bg-white brutal-border-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <BrutalBadge
                              variant={
                                cit.citation_type === 'direct_quote'
                                  ? 'yellow'
                                  : cit.citation_type === 'paraphrase'
                                  ? 'blue'
                                  : 'white'
                              }
                              className="text-[10px]"
                            >
                              {cit.citation_type === 'direct_quote'
                                ? 'Kutipan Langsung'
                                : cit.citation_type === 'paraphrase'
                                ? 'Parafrasa Akademik'
                                : 'Ringkasan Abstrak'}
                            </BrutalBadge>

                            <button
                              onClick={() => handleCopyText(cit.content, cit.id)}
                              className="p-1 border border-[#171717] hover:bg-neutral-100"
                              title="Salin Kalimat"
                            >
                              {copiedFormat === cit.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <p className="text-xs font-bold text-[#171717] leading-relaxed">
                            &quot;{cit.content}&quot;
                          </p>

                          {cit.warning_label && (
                            <div className="text-[10px] font-bold text-amber-800 bg-amber-50 p-1.5 border border-amber-300">
                              ⚠️ {cit.warning_label}
                            </div>
                          )}

                          <div className="text-[10px] font-mono text-neutral-500 pt-1">
                            Sitasi Dalam Teks: {cit.formats.in_text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Generator Formats Tab */}
              {activeCitationTab === 'formats' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-1 font-bold text-[10px]">
                    {(['apa', 'ieee', 'harvard', 'vancouver'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setActiveFormatTab(fmt)}
                        className={`py-1.5 uppercase brutal-border-sm ${
                          activeFormatTab === fmt ? 'bg-[#171717] text-white' : 'bg-white hover:bg-neutral-100'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-[#F5F2EA] brutal-border-sm space-y-2">
                    <div className="text-xs font-mono font-bold text-neutral-800 break-words">
                      {activeFormatTab === 'apa' && formatAPA(selectedJournal)}
                      {activeFormatTab === 'ieee' && formatIEEE(selectedJournal)}
                      {activeFormatTab === 'harvard' && formatHarvard(selectedJournal)}
                      {activeFormatTab === 'vancouver' && formatVancouver(selectedJournal)}
                    </div>

                    <button
                      onClick={() => {
                        let text = '';
                        if (activeFormatTab === 'apa') text = formatAPA(selectedJournal);
                        if (activeFormatTab === 'ieee') text = formatIEEE(selectedJournal);
                        if (activeFormatTab === 'harvard') text = formatHarvard(selectedJournal);
                        if (activeFormatTab === 'vancouver') text = formatVancouver(selectedJournal);
                        handleCopyText(text, 'format');
                      }}
                      className="w-full py-1.5 px-3 bg-white brutal-border-sm text-xs font-black uppercase flex items-center justify-center gap-1.5 hover:bg-neutral-100"
                    >
                      {copiedFormat === 'format' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Format {activeFormatTab.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Export Options */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleCopyText(generateBibTeX(selectedJournal), 'bibtex')}
                      className="py-1.5 px-2 bg-white brutal-border-sm text-[11px] font-bold uppercase hover:bg-neutral-100 flex items-center justify-center gap-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>{copiedFormat === 'bibtex' ? 'Tersalin!' : 'Copy BibTeX'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(generateRIS(selectedJournal), 'ris')}
                      className="py-1.5 px-2 bg-white brutal-border-sm text-[11px] font-bold uppercase hover:bg-neutral-100 flex items-center justify-center gap-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>{copiedFormat === 'ris' ? 'Tersalin!' : 'Copy RIS'}</span>
                    </button>
                  </div>
                </div>
              )}
            </BrutalCard>
          ) : (
            <BrutalCard className="p-8 text-center bg-white space-y-2">
              <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-black text-sm">Pilih Jurnal</div>
              <p className="text-xs font-bold text-neutral-500">
                Klik salah satu jurnal dari panel tengah untuk memeriksa kutipan cerdas dan format daftar pustaka.
              </p>
            </BrutalCard>
          )}
        </section>
      </main>

      {/* MODAL MATRIKS PENELITIAN TERDAHULU (BAB II) */}
      {showMatrixModal && project?.analysis?.literature_matrix && (
        <div
          className="fixed inset-0 z-50 bg-[#171717]/80 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Matriks Penelitian Terdahulu"
          onClick={() => setShowMatrixModal(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowMatrixModal(false); }}
          tabIndex={-1}
        >
          <div
            className="bg-[#F5F2EA] brutal-border border-4 max-w-5xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-3 border-[#171717]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-[#171717]">MATRIKS PENELITIAN TERDAHULU</span>
                  <BrutalBadge variant="yellow" className="text-[10px]">BAB II SKRIPSI</BrutalBadge>
                </div>
                <p className="text-xs font-bold text-neutral-600 mt-0.5">
                  Tabel sintesis telaah pustaka siap disalin ke dokumen skripsi Microsoft Word Anda.
                </p>
              </div>

              <button
                onClick={() => setShowMatrixModal(false)}
                className="p-1.5 brutal-border-sm bg-white hover:bg-neutral-100 font-black text-sm"
              >
                ✕ TUTUP
              </button>
            </div>

            {/* Tabel Matriks Neo-Brutalism */}
            <div className="overflow-x-auto brutal-border bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#171717] text-white font-mono text-[11px] uppercase">
                    <th className="p-2.5 border-r border-neutral-700 w-12 text-center">No</th>
                    <th className="p-2.5 border-r border-neutral-700 w-36">Penulis &amp; Tahun</th>
                    <th className="p-2.5 border-r border-neutral-700 w-48">Judul Penelitian</th>
                    <th className="p-2.5 border-r border-neutral-700 w-44">Metode</th>
                    <th className="p-2.5 border-r border-neutral-700 w-56">Temuan Utama</th>
                    <th className="p-2.5 border-r border-neutral-700 w-44">Persamaan</th>
                    <th className="p-2.5">Perbedaan (Kebaruan Anda)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#171717]">
                  {project.analysis.literature_matrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 align-top">
                      <td className="p-2.5 font-mono font-bold text-center border-r-2 border-[#171717] bg-neutral-100">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-bold border-r-2 border-[#171717]">
                        <div className="text-neutral-900">{item.authors}</div>
                        <div className="font-mono text-neutral-500 text-[11px]">({item.year})</div>
                      </td>
                      <td className="p-2.5 font-bold text-neutral-800 border-r-2 border-[#171717]">
                        {item.title}
                      </td>
                      <td className="p-2.5 text-neutral-700 border-r-2 border-[#171717]">
                        {item.methodology}
                      </td>
                      <td className="p-2.5 text-neutral-800 font-medium border-r-2 border-[#171717]">
                        {item.key_findings}
                      </td>
                      <td className="p-2.5 text-neutral-700 border-r-2 border-[#171717]">
                        {item.similarities}
                      </td>
                      <td className="p-2.5 text-neutral-900 font-bold bg-[#F4FF3F]/20">
                        {item.differences}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs font-mono text-neutral-600">
                💡 Tip: Blok seluruh tabel di atas lalu tekan <kbd className="px-1.5 py-0.5 bg-neutral-200 border border-[#171717] font-bold">Ctrl + C</kbd>, lalu paste langsung ke Microsoft Word.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const text = project.analysis?.literature_matrix?.map((m, i) => 
                      `${i+1}. ${m.authors} (${m.year}) - "${m.title}"\nMetode: ${m.methodology}\nTemuan: ${m.key_findings}\nPersamaan: ${m.similarities}\nPerbedaan: ${m.differences}\n`
                    ).join('\n---\n');
                    if (text) {
                      navigator.clipboard.writeText(text);
                      alert('Rangkuman Matriks Penelitian berhasil disalin ke clipboard!');
                    }
                  }}
                  className="py-2 px-4 bg-[#171717] text-white font-black text-xs uppercase brutal-border-sm hover:bg-neutral-800"
                >
                  Salin Teks Matriks
                </button>

                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="py-2 px-4 bg-[#F4FF3F] text-[#171717] font-black text-xs uppercase brutal-border-sm hover:bg-[#e4ef30]"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

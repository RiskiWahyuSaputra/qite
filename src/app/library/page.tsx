'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Sidebar, Footer } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { getStoredProjects, saveProjectToStorage } from '@/lib/storage';
import { JournalReference, ResearchProject } from '@/types';
import { BookOpen, ExternalLink, BookmarkCheck, Trash2, ArrowUpRight, Search } from 'lucide-react';

export default function LibraryPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [savedJournals, setSavedJournals] = useState<{ journal: JournalReference; projectId: string; projectTitle: string }[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const projs = getStoredProjects();
    setProjects(projs);

    const extracted: { journal: JournalReference; projectId: string; projectTitle: string }[] = [];
    projs.forEach((p) => {
      (p.journals || []).forEach((j) => {
        if (j.is_saved) {
          extracted.push({ journal: j, projectId: p.id, projectTitle: p.title });
        }
      });
    });

    setSavedJournals(extracted);
  }, []);

  const handleRemoveSaved = (projectId: string, journalId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          journals: p.journals.map((j) => (j.id === journalId ? { ...j, is_saved: false } : j)),
        };
      }
      return p;
    });

    setProjects(updated);
    updated.forEach((p) => saveProjectToStorage(p));

    setSavedJournals((prev) => prev.filter((item) => !(item.projectId === projectId && item.journal.id === journalId)));
  };

  const filtered = savedJournals.filter((item) =>
    item.journal.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.projectTitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-3 border-[#171717]">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-[#171717]">
                  PERPUSTAKAAN JURNAL TERSIMPAN
                </h1>
                <BrutalBadge variant="yellow">{savedJournals.length} JURNAL</BrutalBadge>
              </div>
              <p className="text-sm font-bold text-neutral-600 mt-1">
                Koleksi referensi akademik penting yang telah Anda tandai sebagai bahan skripsi.
              </p>
            </div>

            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari judul jurnal..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full p-2.5 pl-9 brutal-border bg-white text-xs font-bold text-[#171717] focus:outline-none"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <BrutalCard className="p-12 text-center bg-white space-y-4">
              <BookOpen className="w-12 h-12 text-neutral-400 mx-auto" />
              <div>
                <h3 className="text-lg font-black">Belum Ada Jurnal Tersimpan</h3>
                <p className="text-xs font-bold text-neutral-500 mt-1">
                  Buka salah satu telaah skripsi dan klik ikon bookmark pada jurnal yang ingin Anda kumpulkan.
                </p>
              </div>
              <Link href="/research/new">
                <BrutalButton variant="yellow" className="mx-auto">
                  Cari Jurnal Baru
                </BrutalButton>
              </Link>
            </BrutalCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(({ journal, projectId, projectTitle }) => (
                <BrutalCard key={journal.id} className="p-5 bg-white space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-[#F5F2EA] px-2 py-0.5 brutal-border-sm">
                        PROYEK: {projectTitle.slice(0, 25)}...
                      </span>
                      <button
                        onClick={() => handleRemoveSaved(projectId, journal.id)}
                        className="text-neutral-400 hover:text-red-600 p-1"
                        title="Hapus dari tersimpan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-[#171717] leading-snug">
                      {journal.title}
                    </h3>

                    <div className="text-xs font-bold text-neutral-600">
                      {Array.isArray(journal.authors) ? journal.authors.slice(0, 3).join(', ') : 'Penulis'}
                      {journal.year ? ` • (${journal.year})` : ''}
                    </div>

                    <div className="text-[11px] text-neutral-500 italic">
                      {journal.venue}
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-[#171717] flex items-center justify-between">
                    <Link
                      href={`/research/${projectId}`}
                      className="text-xs font-black text-[#3454FF] hover:underline flex items-center gap-1"
                    >
                      <span>Lihat di Telaah</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {journal.url && (
                      <a
                        href={journal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black text-neutral-700 hover:underline flex items-center gap-1"
                      >
                        <span>Sumber Asli</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </BrutalCard>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

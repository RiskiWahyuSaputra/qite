'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Sidebar, Footer } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { getStoredProjects, saveProjectToStorage } from '@/lib/storage';
import { CitationItem, ResearchProject } from '@/types';
import { AdBanner } from '@/components/ads/AdBanner';
import { Quote, Copy, Check, Trash2, FileDown, BookOpen } from 'lucide-react';

export default function CitationsPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [citations, setCitations] = useState<{ citation: CitationItem; projectId: string }[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const projs = getStoredProjects();
    setProjects(projs);

    const allCits: { citation: CitationItem; projectId: string }[] = [];
    projs.forEach((p) => {
      (p.saved_citations || []).forEach((c) => {
        allCits.push({ citation: c, projectId: p.id });
      });
    });

    setCitations(allCits);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemove = (projectId: string, citId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          saved_citations: (p.saved_citations || []).filter((c) => c.id !== citId),
        };
      }
      return p;
    });

    setProjects(updated);
    updated.forEach((p) => saveProjectToStorage(p));
    setCitations((prev) => prev.filter((item) => item.citation.id !== citId));
  };

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
                  KOLEKSI KUTIPAN &amp; DAFTAR PUSTAKA
                </h1>
                <BrutalBadge variant="coral">{citations.length} KUTIPAN</BrutalBadge>
              </div>
              <p className="text-sm font-bold text-neutral-600 mt-1">
                Kutipan langsung, parafrasa AI terverifikasi, dan format sitasi (APA, IEEE, Harvard, Vancouver).
              </p>
            </div>
          </div>

          <AdBanner slot="content-inline" />

          {citations.length === 0 ? (
            <BrutalCard className="p-12 text-center bg-white space-y-4">
              <Quote className="w-12 h-12 text-neutral-400 mx-auto" />
              <div>
                <h3 className="text-lg font-black">Belum Ada Kutipan Disimpan</h3>
                <p className="text-xs font-bold text-neutral-500 mt-1">
                  Buka detail telaah skripsi, pilih jurnal, dan klik tombol &quot;Hasilkan Kutipan Cerdas AI&quot; pada panel kanan.
                </p>
              </div>
              <Link href="/research/new">
                <BrutalButton variant="yellow" className="mx-auto">
                  Mulai Telaah Skripsi
                </BrutalButton>
              </Link>
            </BrutalCard>
          ) : (
            <div className="space-y-4">
              {citations.map(({ citation, projectId }) => (
                <BrutalCard key={citation.id} className="p-6 bg-white space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <BrutalBadge
                        variant={
                          citation.citation_type === 'direct_quote'
                            ? 'yellow'
                            : citation.citation_type === 'paraphrase'
                            ? 'blue'
                            : 'white'
                        }
                      >
                        {citation.citation_type === 'direct_quote'
                          ? 'Kutipan Langsung'
                          : citation.citation_type === 'paraphrase'
                          ? 'Parafrasa Akademik'
                          : 'Ringkasan Abstrak'}
                      </BrutalBadge>
                      <span className="text-xs font-bold text-neutral-500">
                        {citation.authors} ({citation.year})
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemove(projectId, citation.id)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                      title="Hapus Sitasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-mono font-bold text-neutral-500 mb-1">
                      SUMBER: {citation.journal_title}
                    </div>
                    <p className="text-sm font-bold text-[#171717] leading-relaxed bg-[#F5F2EA] p-3 brutal-border-sm">
                      &quot;{citation.content}&quot;
                    </p>
                  </div>

                  {citation.warning_label && (
                    <div className="text-xs font-bold text-amber-800 bg-amber-50 p-2 border border-amber-300">
                      ⚠️ {citation.warning_label}
                    </div>
                  )}

                  {/* Formats Grid */}
                  <div className="pt-2 border-t-2 border-[#171717] space-y-2">
                    <div className="text-xs font-black uppercase text-neutral-600">FORMAT SITASI:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 bg-neutral-50 brutal-border-sm flex justify-between items-start gap-2">
                        <div>
                          <span className="font-black text-[#171717] block">APA 7th:</span>
                          <span className="text-neutral-700">{citation.formats.apa}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(citation.formats.apa, `${citation.id}-apa`)}
                          className="p-1 border border-[#171717] bg-white hover:bg-neutral-100 shrink-0"
                        >
                          {copiedId === `${citation.id}-apa` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 bg-neutral-50 brutal-border-sm flex justify-between items-start gap-2">
                        <div>
                          <span className="font-black text-[#171717] block">IEEE:</span>
                          <span className="text-neutral-700">{citation.formats.ieee}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(citation.formats.ieee, `${citation.id}-ieee`)}
                          className="p-1 border border-[#171717] bg-white hover:bg-neutral-100 shrink-0"
                        >
                          {copiedId === `${citation.id}-ieee` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
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

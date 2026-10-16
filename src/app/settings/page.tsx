'use client';

import React, { useState } from 'react';
import { Navbar, Sidebar, Footer } from '@/components/layout';
import { BrutalButton, BrutalBadge, BrutalCard } from '@/components/brutalist';
import { clearAllQiteData } from '@/lib/storage';
import { Settings, Shield, Cpu, Trash2, CheckCircle2 } from 'lucide-react';

// Kartu "Konfigurasi AI & Academic API" disembunyikan; ubah ke true untuk menampilkannya lagi.
const SHOW_AI_CONFIG = false;

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  const handleClearLocalStorage = () => {
    if (confirm('Hapus seluruh riwayat riset, jurnal, dan kutipan dari browser Anda?')) {
      clearAllQiteData();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="pb-6 border-b-3 border-[#171717]">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-black text-[#171717]">
                PENGATURAN &amp; STATUS SISTEM
              </h1>
              <BrutalBadge variant="yellow">CONFIG</BrutalBadge>
            </div>
            <p className="text-sm font-bold text-neutral-600 mt-1">
              Informasi arsitektur sistem, model AI aktif, kuota inferensi, dan manajemen penyimpanan.
            </p>
          </div>

          <div className="space-y-6">
            {/* System Status Card */}
            {SHOW_AI_CONFIG && (
            <BrutalCard className="p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#171717]">
                <Cpu className="w-5 h-5 text-[#3454FF]" />
                <h3 className="text-lg font-black">Konfigurasi AI &amp; Academic API</h3>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center p-2.5 bg-[#F5F2EA] brutal-border-sm">
                  <span className="font-bold">AI Inference Engine:</span>
                  <span className="font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-emerald-800">
                    Online &amp; Active
                  </span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#F5F2EA] brutal-border-sm">
                  <span className="font-bold">Default Model:</span>
                  <span className="font-black text-[#171717]">openai/gpt-oss-20b</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#F5F2EA] brutal-border-sm">
                  <span className="font-bold">OpenAlex API:</span>
                  <span className="font-black text-[#171717]">Works &amp; Citation Inverted Index</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-[#F5F2EA] brutal-border-sm">
                  <span className="font-bold">Crossref API:</span>
                  <span className="font-black text-[#171717]">Bibliographic Polite Pool</span>
                </div>
              </div>
            </BrutalCard>
            )}

            {/* Author & License Card */}
            <BrutalCard className="p-6 bg-[#F4FF3F] space-y-2">
              <div className="text-xs font-mono font-black uppercase text-neutral-800">
                APPLICATION CREATOR &amp; COPYRIGHT
              </div>
              <div className="text-lg font-black text-[#171717]">
                Developed &amp; Designed by Riski Wahyu Saputra
              </div>
              <div className="text-xs font-bold text-neutral-800">
                © 2026 Qitee — Skripsi Scout AI. All rights reserved.
              </div>
            </BrutalCard>

            {/* Data Reset */}
            <BrutalCard className="p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#171717]">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-black">Bersihkan Penyimpanan Lokal</h3>
              </div>

              <p className="text-xs font-bold text-neutral-600 leading-relaxed">
                Hapus semua riwayat skripsi, daftar jurnal, dan kutipan tersimpan dari browser perangkat ini. Tindakan ini tidak dapat dibatalkan.
              </p>

              <div>
                <BrutalButton
                  variant="coral"
                  size="sm"
                  onClick={handleClearLocalStorage}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Kosongkan Seluruh Data Lokal</span>
                </BrutalButton>
                {cleared && (
                  <span className="text-xs font-bold text-emerald-700 ml-3 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Data berhasil dibersihkan!
                  </span>
                )}
              </div>
            </BrutalCard>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

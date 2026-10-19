'use client';

import React, { useEffect } from 'react';
import { BrutalCard } from '@/components/brutalist';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdBannerProps {
  slot?: 'sidebar' | 'content-inline' | 'bottom-footer';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Komponen Slot Iklan & Monetisasi Qitee (Neo-Brutalism Style)
 * Mendukung:
 * 1. Google AdSense Auto Ads (cukup NEXT_PUBLIC_ADSENSE_CLIENT_ID)
 * 2. AdSense dengan slot spesifik (CLIENT_ID + SLOT_ID)
 * 3. Fallback Sponsor Akademik / Saweria jika belum ada env
 */
export const AdBanner: React.FC<AdBannerProps> = ({ slot = 'sidebar', className = '' }) => {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (!adsenseClient) return;
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle as unknown[]).push({});
      }
    } catch {
      // AdSense belum ready, ignore
    }
  }, [adsenseClient]);

  // Jika Google AdSense sudah aktif — cukup CLIENT_ID saja (Auto Ads support)
  if (adsenseClient) {
    return (
      <div className={`p-2 bg-white brutal-border-sm text-center overflow-hidden ${className}`}>
        <span className="text-[9px] font-mono text-neutral-400 block mb-1 uppercase tracking-wider">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClient}
          {...(adsenseSlot ? { 'data-ad-slot': adsenseSlot } : {})}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Tampilan Default: Slot Sponsor & Saweria Support
  if (slot === 'sidebar') {
    return (
      <div className={`p-4 bg-white brutal-border-sm space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 font-mono">
            SPONSOR SPACE
          </span>
          <span className="text-[9px] font-black bg-[#F4FF3F] text-[#171717] px-1 border border-[#171717]">
            SLOT IKLAN
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-black text-[#171717]">Ingin Pasang Iklan di Qitee?</div>
          <p className="text-[11px] font-bold text-neutral-600 leading-snug">
            Jangkau ribuan mahasiswa yang sedang menyusun skripsi &amp; riset jurnal.
          </p>
        </div>

        <a
          href="mailto:arskies2005@gmail.com?subject=Pasang%20Iklan%20di%20Qitee%20Skripsi"
          className="block py-1.5 px-2 bg-[#171717] text-white hover:bg-neutral-800 text-[10px] font-black uppercase text-center brutal-border-sm"
        >
          Hubungi Pengembang
        </a>
      </div>
    );
  }

  // Banner Horizontal di bawah konten
  return (
    <div className={`p-4 bg-[#F4FF3F]/25 border-3 border-[#171717] brutal-shadow flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <div className="space-y-0.5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          <span className="text-[10px] font-black bg-[#171717] text-[#F4FF3F] px-1 font-mono">AD / DONATION</span>
          <span className="text-xs font-black text-[#171717]">Dukung Pengembangan Qitee Skripsi</span>
        </div>
        <p className="text-xs font-bold text-neutral-700">
          Qitee gratis untuk seluruh mahasiswa. Anda dapat mendukung server dengan berdonasi atau memasang banner sponsor.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href="mailto:arskies2005@gmail.com?subject=Sponsor%20Qitee%20Skripsi"
          className="py-1.5 px-3 bg-white hover:bg-neutral-100 brutal-border-sm text-xs font-black uppercase text-[#171717] flex items-center gap-1"
        >
          <span>Pasang Iklan</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://saweria.co"
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-3 bg-[#171717] hover:bg-neutral-800 brutal-border-sm text-xs font-black uppercase text-[#F4FF3F] flex items-center gap-1"
        >
          <span>☕ Traktir Kopi</span>
        </a>
      </div>
    </div>
  );
};

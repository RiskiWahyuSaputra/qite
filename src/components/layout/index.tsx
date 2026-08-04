'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Compass, BookmarkCheck, FileText, Settings, Sparkles, FolderKanban } from 'lucide-react';
import { BrutalBadge } from '@/components/brutalist';

export const Navbar = () => {
  return (
    <nav className="w-full bg-[#FFFFFF] brutal-border border-t-0 border-x-0 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-[#171717] text-white p-2 brutal-border">
            <BookOpen className="w-6 h-6 text-[#F4FF3F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter text-[#171717]">QITE</span>
              <span className="text-xs font-black bg-[#F4FF3F] px-1.5 py-0.5 border border-[#171717]">SCOUT</span>
            </div>
            <p className="text-[10px] font-bold text-neutral-600 tracking-widest uppercase">Skripsi Scout AI</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-bold hover:underline">
            Dashboard
          </Link>
          <Link href="/research/new" className="text-sm font-bold hover:underline">
            New Research
          </Link>
          <Link href="/library" className="text-sm font-bold hover:underline">
            Journal Library
          </Link>
          <Link href="/citations" className="text-sm font-bold hover:underline">
            Citations
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <BrutalBadge variant="blue" className="hidden sm:inline-flex">
            GROQ AI FREE TIER
          </BrutalBadge>
          <Link
            href="/research/new"
            className="brutal-btn bg-[#F4FF3F] text-[#171717] text-xs px-4 py-2 uppercase font-black"
          >
            Mulai Analisis
          </Link>
        </div>
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: Compass },
    { label: 'New Research', href: '/research/new', icon: Sparkles },
    { label: 'My Projects', href: '/dashboard#projects', icon: FolderKanban },
    { label: 'Journal Library', href: '/library', icon: BookOpen },
    { label: 'Citation Hunter', href: '/citations', icon: BookmarkCheck },
    { label: 'Generator', href: '/citations?tab=generator', icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white brutal-border border-y-0 border-l-0 p-5 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-73px)]">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-black tracking-widest uppercase text-neutral-400">Navigation</span>
          <div className="mt-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 font-bold text-sm brutal-border-sm transition-all ${
                    isActive
                      ? 'bg-[#F4FF3F] text-[#171717] translate-x-1 shadow-[2px_2px_0_#171717]'
                      : 'bg-white text-neutral-800 hover:bg-neutral-100 hover:translate-x-0.5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-[#F5F2EA] brutal-border-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase">Academic APIs</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-[11px] space-y-1 font-mono text-neutral-600">
            <div>• OpenAlex API: Online</div>
            <div>• Crossref API: Polite</div>
            <div>• Groq SDK: Connected</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-[#171717] text-xs font-mono text-neutral-500">
        <div>Qite Skripsi v1.0.0</div>
        <div className="text-[10px]">Neo-Brutalism Engine</div>
      </div>
    </aside>
  );
};

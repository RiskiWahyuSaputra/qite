'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Compass,
  BookmarkCheck,
  FileText,
  Settings,
  Sparkles,
  FolderKanban,
  Menu,
  X
} from 'lucide-react';
import { BrutalBadge } from '@/components/brutalist';
import { AdBanner } from '@/components/ads/AdBanner';

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/dashboard', icon: Compass },
    { label: 'New Research', href: '/research/new', icon: Sparkles },
    { label: 'Journal Library', href: '/library', icon: BookOpen },
    { label: 'Citations & Radar', href: '/citations', icon: BookmarkCheck },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <nav className="w-full bg-[#FFFFFF] brutal-border border-t-0 border-x-0 py-3.5 px-4 md:px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-[#171717] text-white p-2 brutal-border">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#F4FF3F]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl md:text-2xl tracking-tighter text-[#171717]">QITE</span>
                <span className="text-[10px] md:text-xs font-black bg-[#F4FF3F] px-1 py-0.2 border border-[#171717]">SCOUT</span>
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-neutral-600 tracking-widest uppercase">Skripsi Scout AI</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
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

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/research/new"
              className="brutal-btn bg-[#F4FF3F] text-[#171717] text-xs px-3 md:px-4 py-2 uppercase font-black"
            >
              Mulai Analisis
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 brutal-border-sm bg-white hover:bg-neutral-100 flex items-center justify-center text-[#171717]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] bottom-0 z-40 bg-[#F5F2EA] p-5 flex flex-col justify-between overflow-y-auto border-b-4 border-[#171717] animate-in fade-in slide-in-from-top-4 duration-150">
          <div className="space-y-4">
            <div className="text-[11px] font-black uppercase tracking-wider text-neutral-500 font-mono">
              MENU UTAMA
            </div>
            <div className="space-y-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 font-black text-sm brutal-border transition-all ${
                      isActive
                        ? 'bg-[#F4FF3F] text-[#171717] translate-x-1 shadow-[3px_3px_0_#171717]'
                        : 'bg-white text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t-2 border-[#171717] text-xs font-mono text-neutral-600 space-y-1">
            <div className="font-bold text-[#171717]">Qite — Skripsi Scout AI</div>
            <div className="text-[11px]">Created by <span className="font-black text-[#171717]">Riski Wahyu Saputra</span></div>
          </div>
        </div>
      )}
    </>
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
            <div>• LLM Neural Engine: Connected</div>
          </div>
        </div>

        {/* Slot Iklan / Sponsor Sidebar */}
        <AdBanner slot="sidebar" />
      </div>

      <div className="pt-4 border-t-2 border-[#171717] text-xs font-mono text-neutral-500 space-y-1">
        <div className="font-bold text-[#171717]">Qite Skripsi v1.0.0</div>
        <div className="text-[10px]">Neo-Brutalism Engine</div>
        <div className="text-[10px] text-neutral-700 font-bold pt-1 border-t border-neutral-300">
          Created by <span className="font-black text-[#171717]">Riski Wahyu Saputra</span>
        </div>
      </div>
    </aside>
  );
};

export const Footer = () => {
  return (
    <footer className="mt-auto bg-[#171717] text-white border-t-4 border-[#171717] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-black text-xl text-[#F4FF3F] font-mono">QITE</span>
            <span className="text-[10px] font-bold bg-white text-[#171717] px-1.5 py-0.5">SKRIPSI SCOUT AI</span>
          </div>
          <div className="text-xs font-bold text-neutral-300 flex flex-wrap items-center justify-center md:justify-start gap-1">
            <span>Crafted with passion by</span>
            <span className="text-[#F4FF3F] font-black underline decoration-2 underline-offset-2">
              Riski Wahyu Saputra
            </span>
            <span>© 2026. All rights reserved.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-neutral-400">
          <Link href="/dashboard" className="hover:text-[#F4FF3F]">Dashboard</Link>
          <Link href="/research/new" className="hover:text-[#F4FF3F]">New Research</Link>
          <Link href="/library" className="hover:text-[#F4FF3F]">Library</Link>
          <Link href="/citations" className="hover:text-[#F4FF3F]">Citations</Link>
          <Link href="/settings" className="hover:text-[#F4FF3F]">Settings</Link>
        </div>
      </div>
    </footer>
  );
};

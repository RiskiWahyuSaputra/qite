export type Lang = 'id' | 'en';

export const dictionaries = {
  id: {
    nav: {
      dashboard: 'Dashboard',
      newResearch: 'Riset Baru',
      library: 'Perpustakaan Jurnal',
      citations: 'Sitasi',
      citationsRadar: 'Sitasi & Radar',
      settings: 'Pengaturan',
      overview: 'Overview',
      journalLibrary: 'Journal Library',
      startAnalysis: 'Mulai Analisis',
      menu: 'MENU UTAMA',
    },
    common: {
      lang_id: 'ID',
      lang_en: 'EN',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      newResearch: 'New Research',
      library: 'Journal Library',
      citations: 'Citations',
      citationsRadar: 'Citations & Radar',
      settings: 'Settings',
      overview: 'Overview',
      journalLibrary: 'Journal Library',
      startAnalysis: 'Start Analysis',
      menu: 'MAIN MENU',
    },
    common: {
      lang_id: 'ID',
      lang_en: 'EN',
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)['id'];

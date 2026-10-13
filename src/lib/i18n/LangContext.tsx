'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionaries, type Lang, type Dictionary } from './dictionaries';

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dictionary;
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'qite-lang';

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'id' || saved === 'en') setLangState(saved);
    // sync html lang attribute
    document.documentElement.lang = saved === 'en' ? 'en' : 'id';
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
    // keep cookie for potential SSR use later
    document.cookie = `qite-lang=${l}; path=/; max-age=31536000`;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = dictionaries[lang] as Dictionary;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

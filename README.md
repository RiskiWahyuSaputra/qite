# Qite — Skripsi Scout AI 🎓⚡

**Qite (Skripsi Scout AI)** adalah asisten riset skripsi berbasis AI untuk mahasiswa Indonesia. Aplikasi ini membantu menganalisis judul dan draf skripsi (PDF), menemukan jurnal akademik terakreditasi melalui OpenAlex dan Crossref, memverifikasi kutipan riil, serta menyusun daftar pustaka otomatis (APA, IEEE, Harvard, Vancouver).

Dibangun dengan estetika **Neo-Brutalism**, backend aman Next.js App Router, integrasi **AI Inference Engine**, dan arsitektur Local-First yang dapat disinkronkan ke **Supabase PostgreSQL**.

---

## 🚀 Fitur Utama

1. **Mode A — Scan Judul Skripsi**
   - AI membedah judul skripsi, rumusan masalah, variabel independen/dependen, dan konsep kunci.
   - Menghasilkan kata kunci pencarian bilingual (Indonesia & Inggris).
2. **Mode B — Scan PDF Skripsi**
   - Ekstraksi teks dokumen PDF langsung di server Next.js.
   - Chunking cerdas untuk menjaga efisiensi pemrosesan dokumen.
   - Deteksi dokumen scan gambar/OCR.
3. **Pencarian Akademik Nyata (No AI Halusinasi)**
   - Integrasi langsung dengan **OpenAlex API** dan **Crossref API**.
   - Verifikasi DOI, judul, penulis, tahun, dan ketersediaan open access.
   - Normalisasi metadata dan deduplikasi cerdas.
4. **Analisis Per Bab (BAB I — V)**
   - AI mengklasifikasikan kecocokan setiap jurnal untuk BAB I (Urgensi Masalah), BAB II (Landasan Teori/Terdahulu), BAB III (Metodologi), BAB IV (Pembahasan), atau BAB V (Kesimpulan).
   - Matriks penelitian terdahulu komparatif.
5. **Citation Hunter & Generator**
   - Membedakan dengan tegas antara **Kutipan Langsung**, **Parafrasa Akademis Berlabel AI**, dan **Ringkasan Abstrak**.
   - Format sitasi otomatis: APA 7th Edition, IEEE, Harvard, Vancouver, dan In-Text.
   - Ekspor BibTeX dan RIS (Zotero / Mendeley).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions / Route Handlers)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v4 (Neo-Brutalism Design System)
- **Icons**: Lucide React
- **AI Inference Engine**: High-Performance Neural LLM
- **PDF Extraction**: `pdf-parse`
- **Academic APIs**: OpenAlex REST API & Crossref API (Polite Pool)
- **Database / Auth**: Supabase PostgreSQL dengan RLS (Row Level Security)

---

## 📦 Instalasi & Menjalankan Lokal

1. **Clone Repository**:
   ```bash
   git clone https://github.com/RiskiWahyuSaputra/qite.git
   cd qite
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi konfigurasi minimal berikut:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GROQ_MODEL=openai/gpt-oss-20b
   CROSSREF_MAILTO=your-email@example.com
   OPENALEX_EMAIL=your-email@example.com
   ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🗄️ Database Supabase (Opsional)

Jika ingin mengaktifkan sinkronisasi database cloud:
1. Buat project baru di [Supabase Dashboard](https://supabase.com).
2. Jalankan skrip SQL di file `supabase/migrations/20260801000000_init_qite.sql` melalui SQL Editor Supabase.
3. Masukkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ke `.env.local`.

---

## 🌐 Deployment ke Vercel

Aplikasi ini 100% siap dideploy ke Vercel:
1. Hubungkan repository GitHub ini ke Vercel.
2. Tambahkan Environment Variables (`GROQ_API_KEY`, `GROQ_MODEL`, `CROSSREF_MAILTO`, dll.) di menu Settings Vercel.
3. Klik **Deploy**.

---

## 📄 Lisensi

MIT License © 2026 Riski Wahyu Saputra

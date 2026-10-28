# Resepify — Katalog Resep Masakan dengan Admin Tunggal & Akses Terautentikasi

Aplikasi web katalog resep masakan modern, elegan, dan terstruktur yang dibangun berdasarkan **Product Requirements Document (PRD) v1.0** dengan panduan desain **UI/UX Pro Max Skill (Warm Culinary Editorial)**.

---

## 🌟 Fitur Utama & Kesesuaian PRD

### 1. Hak Akses & Matriks Otorisasi (PRD §4)
- **Tamu (Guest Gate):** Pengunjung yang belum masuk hanya dapat melihat halaman landing publik dan ringkasan nilai produk. Akses katalog resep, detail bahan, langkah memasak, dan API resep dilindungi secara ketat.
- **Pembaca (Viewer):** Pengguna terautentikasi memiliki akses baca (*view-only*) ke seluruh resep berstatus **Published**. Dilengkapi pencarian *full-text*, filter kategori, waktu, dan tingkat kesulitan.
- **Admin Tunggal:** Pemilik website memiliki dashboard operasional penuh untuk membuat draf, mengedit, menerbitkan (*publish*), mengarsipkan (*soft delete*), memulihkan (*restore*), mengelola kategori, meninjau log audit, serta mencadangkan/memulihkan data JSON.
- **Kontributor (Fase Lanjutan):** Tersedia kartu/modal resmi **Coming Soon** tanpa mengekspos endpoint *write* yang belum siap.

### 2. Pengalaman Memasak Interaktif (PRD §6.4 & Preferensi Pengguna)
- **Skala Porsi Dinamis (Servings Scaler):** Takaran seluruh bahan otomatis dihitung ulang secara proporsional sesuai jumlah porsi yang diinginkan.
- **Checklist Bahan Masakan:** Pengguna dapat mencentang bahan belanjaan atau persiapan dapur yang sudah selesai.
- **Panduan Memasak Bertahap:** Dilengkapi persentase progres memasak, checklist tahapan, serta dukungan media gambar dan cuplikan video pendek pada langkah memasak.
- **Salin Bahan & Mode Cetak (Print-Friendly):** Salin daftar belanjaan ke *clipboard* hanya dengan 1 klik atau cetak lembar resep tanpa elemen navigasi.

### 3. Keamanan & Kepatuhan Arsitektur (PRD §8, §9, §11)
- **OWASP Top 10:2025 Compliant:** Otentikasi dan otorisasi diperiksa di sisi server; RLS (*Row Level Security*) diterapkan pada seluruh tabel database.
- **Supabase Integration & Local Persistent Fallback:** Berjalan langsung tanpa konfigurasi eksternal berkat sistem penyimpanan lokal reaktif, sekaligus siap dihubungkan ke Supabase PostgreSQL & Auth kapan saja.
- **Log Audit Operasional:** Merekam setiap aksi administratif tanpa menyimpan data sensitif, token, atau kata sandi.
- **Pencadangan & Pemulihan (PRD §14):** Fitur ekspor dan impor berkas JSON untuk memastikan ketersediaan dan mitigasi kehilangan data.

---

## 🎨 Desain UI/UX (Warm Culinary Editorial)

Mengacu pada `ui-ux-pro-max-skill`:
- **Warna Utama:** Terracotta hangat (`#9A3412`), Aksen Fresh Herb Green (`#059669`), dan Kanvas Cream lembut (`#FFFBEB`).
- **Tipografi:** Kombinasi editorial *Playfair Display* (judul resep elegan) dan *Plus Jakarta Sans* (bacaan presisi dan nyaman).
- **Claymorphic Cards:** Kartu masakan dengan bayangan lembut berdimensi, *hover lift* halus, serta rasio kontras warna tinggi (memenuhi standar WCAG 2.2 AA).
- **Tanpa Emoji Struktural:** Seluruh ikon kontrol menggunakan vektor SVG standar (*Lucide Icons*).

---

## 🚀 Panduan Memulai Cepat

### Prasyarat
- Node.js versi 18 atau lebih baru.
- npm.

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000).

### 3. Menjalankan Uji Logika Bisnis (Unit Test)
```bash
npm run test:logic
```

### 4. Melakukan Build Produksi
```bash
npm run build
```

---

## 👥 Akun Uji Coba Cepat (Mode Demo)

Bilah atas (*Demo Bar*) memudahkan pengujian seluruh peran pengguna tanpa perlu mendaftar ulang:
1. **Tamu (Guest):** Menguji gerbang akses publik, halaman *landing*, dan penolakan akses privat.
2. **Viewer (Sarah Penggemar Masak):** Menguji katalog, pencarian, checklist bahan, penyesuaian porsi, dan modal *Coming Soon*.
3. **Admin (Chef Admin Resepify):** Membuka Dashboard Admin (`/admin`), mengedit draf, menerbitkan resep, mengelola kategori, meninjau log audit, dan ekspor JSON.

---

## 🗄️ Skema Database Supabase (PostgreSQL)

Berkas skema lengkap dengan RLS dan indeks performa tersedia di:
```
supabase/schema.sql
```

Untuk menghubungkan ke project Supabase Anda:
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Jalankan skrip `supabase/schema.sql` pada menu **SQL Editor**.
3. Buat file `.env.local` dari `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 📁 Struktur Direktori Proyek

```
Recipes Stack/
├── .github/workflows/ci.yml       # Pipeline CI/CD GitHub Actions
├── design-system/resepify/        # Master token & aturan UI/UX Pro Max
├── scripts/
│   └── test-recipe-logic.mjs      # Test suite verifikasi kriteria PRD
├── src/
│   ├── app/
│   │   ├── admin/page.tsx         # Dashboard Admin & manajemen resep
│   │   ├── api/                   # API routes (health, recipes, me)
│   │   ├── login/page.tsx         # Autentikasi Google, Email & Magic Link
│   │   ├── recipes/
│   │   │   ├── page.tsx           # Katalog resep terfilter
│   │   │   └── [slug]/page.tsx    # Halaman detail & panduan memasak
│   │   ├── globals.css            # Token warna & styling Tailwind
│   │   ├── layout.tsx             # Root Layout & Google Fonts
│   │   └── page.tsx               # Gerbang beranda publik / pengalihan
│   ├── components/
│   │   ├── admin/                 # Modal CRUD, kategori, audit, backup
│   │   ├── common/                # Navbar, Footer, DemoBar, ComingSoonModal
│   │   ├── home/                  # GuestLanding (Hero-centric pattern)
│   │   └── recipes/               # RecipeCard, RecipeFilters, DetailView
│   ├── context/                   # AuthContext & state manajemen sesi
│   ├── data/                      # Data seed resep otentik & kategori
│   ├── lib/                       # Storage service, slug generator, Supabase client
│   └── types/                     # Antarmuka TypeScript (Recipe, Category, Auth, Audit)
├── supabase/
│   └── schema.sql                 # DDL PostgreSQL, RLS policies, indexes
└── package.json
```

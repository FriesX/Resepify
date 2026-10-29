# Resepify 🍳✨
### *Perpustakaan Resep Masakan Pilihan & Panduan Kuliner Interaktif*

Resepify adalah aplikasi web katalog resep masakan modern yang dirancang untuk mempermudah siapa saja—mulai dari pemula di dapur hingga pecinta kuliner sejati—dalam menemukan, mempelajari, dan mempraktikkan resep hidangan lezat Nusantara dan kreasi kuliner pilihan dengan panduan memasak interaktif.

---

## 🌟 Fitur Unggulan

Resepify bukan sekadar buku resep digital biasa, melainkan asisten memasak pribadi di dapur Anda:

* 📖 **Katalog Resep Terkurasi** — Jelajahi aneka menu mulai dari masakan utama, hidangan nusantara kaya rempah, sarapan praktis, camilan gurih, hingga hidangan penutup manis dengan pencarian cerdas dan filter multi-kategori (waktu, jenis sajian, tingkat kesulitan).
* ⚖️ **Penyesuaian Porsi Otomatis (*Smart Servings Scaler*)** — Ingin memasak untuk 2 orang atau pesta 10 orang? Cukup ubah angka porsi, dan seluruh takaran bahan akan dihitung ulang secara otomatis dan proporsional.
* ✅ **Checklist Bahan Interaktif** — Centang bahan-bahan belanjaan yang sudah disiapkan di meja dapur agar tidak ada bumbu rahasia yang terlewat.
* 👩‍🍳 **Panduan Memasak Langkah Demi Langkah** — Ikuti instruksi memasak bertahap dengan pelacak progres (*progress bar*), checklist tahapan yang sudah selesai, serta panduan foto visual.
* 📋 **Salin Bahan & Mode Cetak Dapur (*Print-Friendly*)** — Salin daftar belanja ke *clipboard* hanya dengan 1 klik untuk dikirim via chat, atau cetak lembar resep bersih tanpa gangguan tombol navigasi.
* 🛡️ **Dashboard Pengelolaan Admin** — Manajemen resep lengkap bagi pemilik website untuk membuat draf menu baru, menerbitkan (*publish*), mengarsipkan, mengelola kategori, hingga mencadangkan (*backup*) data.

---

## 🧭 Bagaimana Resepify Berjalan?

Aplikasi ini dirancang dengan alur pengalaman pengguna yang intuitif, aman, dan menyenangkan:

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│ 1. Pengunjung Umum  │ ──> │  2. Akses Masuk     │ ──> │ 3. Memasak Interaktif│
│    Jelajahi Landing │     │     Google / Email  │     │    Katalog & Resep  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                                                   │
                                                                   ▼
                                                        ┌─────────────────────┐
                                                        │  4. Dashboard Admin │
                                                        │     Kelola Menu     │
                                                        └─────────────────────┘
```

1. **Jelajahi Halaman Utama (Pengunjung Umum)**  
   Pengunjung yang baru pertama kali datang dapat melihat keunggulan Resepify, kategori menu populer, dan cuplikan kreasi masakan unggulan.
2. **Masuk Akun Secara Mudah (Pengguna Terdaftar)**  
   Cukup masuk menggunakan akun **Google** (*One-Tap / OAuth*) atau mendaftar dengan **Email** untuk membuka akses penuh ke seluruh perpustakaan resep terbitan.
3. **Mulai Memasak dengan Panduan Interaktif**  
   Pilih resep favorit, sesuaikan jumlah porsi, centang bahan yang tersedia, dan ikuti langkah memasak hingga hidangan siap disajikan.
4. **Pengelolaan Menu Terpusat (Admin Utama)**  
   Bagi pengelola/pemilik platform, tersedia dashboard khusus untuk menambah resep kreasi baru, mengunggah foto, mengatur kategori, meninjau log perubahan, serta mengunduh cadangan data.

---

## 🛠️ Teknologi yang Digunakan (*Tech Stack*)

Resepify dibangun di atas fondasi teknologi web modern yang cepat, andal, dan aman:

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Gaya & Desain:** [Tailwind CSS](https://tailwindcss.com/) dengan palet hangat *Terracotta & Cream*, tipografi *Playfair Display* & *Plus Jakarta Sans*, serta ikon vektor dari [Lucide React](https://lucide.dev/)
* **Database & Autentikasi:** [Supabase](https://supabase.com/) (PostgreSQL dengan perlindungan *Row Level Security* & autentikasi Google/Email)
* **Ketersediaan Offline:** Dilengkapi sistem penyimpanan lokal persisten (*Local Storage Fallback*) sehingga aplikasi tetap dapat diuji tanpa konfigurasi database eksternal

---

## 💻 Panduan Menjalankan Proyek (Bagi Pengembang)

Jika Anda ingin menjalankan atau mengembangkan proyek ini di komputer lokal:

### 1. Prasyarat
* [Node.js](https://nodejs.org/) versi 18 atau lebih baru
* npm (bawaan dari Node.js)

### 2. Instalasi Dependensi
```bash
git clone https://github.com/FriesX/Resepify.git
cd Resepify
npm install
```

### 3. Konfigurasi Lingkungan (*Environment Variables*)
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan nilai URL dan Kunci Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```
*(Catatan: Jika Supabase belum diisi, aplikasi akan berjalan menggunakan data bawaan/mock secara lokal).*

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

### 5. Pengujian & Build Produksi
* Menjalankan uji logika bisnis (validasi slug, scaler porsi, dan aturan otorisasi):
  ```bash
  npm run test:logic
  ```
* Membangun aplikasi untuk produksi:
  ```bash
  npm run build
  ```

---

## 📂 Struktur Direktori Proyek

```
Resepify/
├── scripts/                       # Skrip uji logika resep & koneksi database
├── src/
│   ├── app/                       # Rute halaman Next.js App Router (katalog, detail, admin, auth)
│   ├── components/                # Komponen antarmuka pengguna (Navbar, Footer, Resep, Modal)
│   ├── context/                   # State autentikasi & manajemen sesi pengguna
│   ├── data/                      # Data awal (seed) resep & kategori nusantara
│   ├── lib/                       # Layanan penyimpanan, slug generator, dan client Supabase
│   └── types/                     # Definisi tipe data TypeScript (Resep, Bahan, Kategori, dsb.)
├── supabase/                      # Skrip SQL database (skema tabel, trigger role admin, seed data)
├── .github/workflows/             # Pipeline otomatisasi CI/CD GitHub Actions
└── package.json                   # Konfigurasi dependensi dan skrip proyek
```

---

## 📄 Lisensi & Kontribusi

Proyek ini dikembangkan secara terbuka untuk tujuan edukasi dan portofolio kuliner modern. Saran, masukan, dan kontribusi pengembangan selalu disambut baik melalui *Pull Request* atau *Issue* di GitHub.

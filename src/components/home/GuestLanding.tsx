import React from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Lock,
  Sparkles,
  ChefHat,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  BookOpen,
} from "lucide-react";

export function GuestLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION (Hero-Centric Pattern) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-terracotta-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100 text-terracotta-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-700" aria-hidden="true" />
                <span>Katalog Resep Terkurasi & Akses Privat</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                Rahasia Masakan Lezat, <br className="hidden sm:inline" />
                <span className="text-terracotta-800 underline decoration-accent/40 decoration-wavy">
                  Kini Rapi & Terstruktur
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Resepify adalah perpustakaan resep kuliner pribadi dengan takaran presisi, panduan memasak interaktif, dan penyesuaian porsi otomatis. Akses katalog hanya dibuka bagi anggota terdaftar.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold text-base shadow-clay-button hover:shadow-clay-hover transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-accent-light" aria-hidden="true" />
                  <span>Masuk untuk Buka Resep</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>

                <a
                  href="#fitur"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-terracotta-200 text-slate-700 hover:bg-cream-100 font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-terracotta-700" aria-hidden="true" />
                  <span>Pelajari Fitur</span>
                </a>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Autentikasi Terenkripsi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Bahan & Langkah Teruji</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Bebas Iklan Pop-up</span>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main appetizing card */}
                <div className="relative rounded-clay-lg overflow-hidden border-4 border-white shadow-2xl bg-white group">
                  <div className="aspect-[4/3] overflow-hidden bg-cream-200">
                    <img
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                      alt="Rendang Daging Sapi Minang"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-terracotta-700 uppercase tracking-wider">
                        Kuliner Nusantara
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Mahir
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                      Rendang Daging Sapi Minang Asli
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      Rendang otentik dengan santan kelapa tua murni dan rempah pilihan hingga menghitam karamel...
                    </p>
                    <div className="mt-3 pt-3 border-t border-terracotta-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-terracotta-700" /> 180 Menit
                      </span>
                      <span className="text-terracotta-800 font-semibold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Login untuk Buka
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-terracotta-100 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center font-bold">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900">Perpustakaan Pribadi</p>
                    <p className="text-[11px] text-slate-500">100% Khusus Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROP SECTION (#fitur) */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200/50">
              Pengalaman Memasak Modern
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Dirancang untuk Kenyamanan Memasak di Dapur Anda
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Tidak ada lagi scroll panjang membingungkan atau takaran yang salah hitung. Nikmati fitur interaktif yang mendukung setiap proses memasak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-cream-50/80 p-8 rounded-clay border border-terracotta-100 shadow-clay-card hover:shadow-clay-hover hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-terracotta-800 text-white flex items-center justify-center mb-5 shadow-clay-button">
                <ChefHat className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                Skala Porsi Otomatis
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Memasak untuk 2 orang atau kenduri 10 orang? Cukup ubah angka porsi, dan takaran bahan akan dihitung ulang secara otomatis dan presisi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cream-50/80 p-8 rounded-clay border border-terracotta-100 shadow-clay-card hover:shadow-clay-hover hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center mb-5 shadow-clay-accent">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                Checklist Bahan & Tahapan
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tandai bahan belanjaan yang sudah siap dan centang tahapan memasak saat kompor menyala. Memasak jadi rapi tanpa langkah terlewat.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cream-50/80 p-8 rounded-clay border border-terracotta-100 shadow-clay-card hover:shadow-clay-hover hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-5 shadow-sm">
                <Flame className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                Resep Teruji & Tips Rahasia
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Setiap resep dilengkapi tips eksklusif dari chef untuk memastikan tekstur empuk, wangi sedap, dan tingkat kematangan yang sempurna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED CATEGORIES TEASER (#kategori) */}
      <section id="kategori" className="py-20 bg-cream-100/70 border-t border-terracotta-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3">
              Kategori Kuliner Pilihan
            </h2>
            <p className="text-slate-600 text-sm">
              Beragam inspirasi masakan siap dieksplorasi setelah Anda masuk ke Resepify
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Makanan Utama", count: "Aneka Lauk & Daging", icon: "🍛" },
              { title: "Masakan Nusantara", count: "Kuliner Daerah", icon: "🇮🇩" },
              { title: "Sarapan Praktis", count: "Cepat & Bernutrisi", icon: "🍳" },
              { title: "Camilan & Kudapan", count: "Teman Kopi & Teh", icon: "🥟" },
              { title: "Pencuci Mulut", count: "Kue & Manisan", icon: "🍰" },
              { title: "Minuman Segar", count: "Pelepas Dahaga", icon: "🍹" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-terracotta-100 text-center shadow-xs flex flex-col items-center justify-center hover:border-terracotta-300 transition-colors"
              >
                <span className="text-3xl mb-2" role="img" aria-hidden="true">{cat.icon}</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{cat.title}</h4>
                <p className="text-[11px] text-slate-500">{cat.count}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-14 bg-gradient-to-r from-terracotta-900 via-terracotta-800 to-amber-900 rounded-clay-lg p-8 sm:p-10 text-white text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Mulai Eksplorasi Resep Hari Ini
              </h3>
              <p className="text-cream-200 text-sm sm:text-base leading-relaxed">
                Masuk menggunakan Google atau email untuk menikmati seluruh koleksi resep lezat, panduan takaran, dan fitur cetak resep.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-clay-accent transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Buka Akses Katalog Lengkap</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

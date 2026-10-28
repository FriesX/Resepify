import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Heart, Shield, Lock, ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cream-200/60 border-t border-terracotta-200/80 mt-auto text-slate-700 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta-800 text-white flex items-center justify-center shadow-sm">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-serif text-2xl font-bold text-terracotta-950">
                Resepify<span className="text-accent">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Perpustakaan resep masakan pribadi dan kurasi kuliner istimewa. Didesain untuk memberikan panduan memasak terstruktur, presisi, dan mudah dipraktikkan di dapur rumah Anda.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-accent" aria-hidden="true" /> Akses Terotentikasi
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-accent" aria-hidden="true" /> Privasi Terjaga
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-accent" aria-hidden="true" /> Resep Teruji
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-terracotta-950 mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/recipes" className="hover:text-terracotta-800 transition-colors">
                  Katalog Resep
                </Link>
              </li>
              <li>
                <Link href="/recipes?cuisine=Indonesia" className="hover:text-terracotta-800 transition-colors">
                  Kuliner Nusantara
                </Link>
              </li>
              <li>
                <Link href="/recipes?meal_type=sarapan" className="hover:text-terracotta-800 transition-colors">
                  Menu Sarapan
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-terracotta-800 transition-colors">
                  Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div>
            <h4 className="font-serif text-base font-bold text-terracotta-950 mb-3">Keamanan & Standar</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Perlindungan RLS Supabase</li>
              <li>Standar OWASP Top 10</li>
              <li>Aksesibilitas WCAG 2.2 AA</li>
              <li>Mode Serverless Berbiaya Hemat</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-terracotta-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Resepify. Seluruh Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-terracotta-700 fill-terracotta-700" aria-hidden="true" /> untuk pecinta kuliner sejati.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UtensilsCrossed,
  BookOpen,
  PlusCircle,
  Shield,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { ComingSoonModal } from "@/components/common/ComingSoonModal";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname === path;

  return (
    <>
      <header className="bg-cream-100/90 backdrop-blur-md sticky top-0 z-40 border-b border-terracotta-100 shadow-sm transition-all no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link
              href={isAuthenticated ? "/recipes" : "/"}
              className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-700 rounded-lg px-1 py-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-700 to-terracotta-900 text-white flex items-center justify-center shadow-clay group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-terracotta-950 group-hover:text-terracotta-800 transition-colors">
                  Resepify<span className="text-accent">.</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-700/80 -mt-1">
                  Katalog Resep Pilihan
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Navigasi Utama">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isCurrent("/")
                        ? "text-terracotta-800 bg-terracotta-50 font-semibold"
                        : "text-slate-600 hover:text-terracotta-800 hover:bg-terracotta-50/60"
                    }`}
                  >
                    Beranda
                  </Link>
                  <a
                    href="#fitur"
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-terracotta-800 hover:bg-terracotta-50/60 transition-all cursor-pointer"
                  >
                    Keunggulan
                  </a>
                  <a
                    href="#kategori"
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-terracotta-800 hover:bg-terracotta-50/60 transition-all cursor-pointer"
                  >
                    Koleksi Menu
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/recipes"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrent("/recipes")
                        ? "text-terracotta-800 bg-terracotta-100 font-semibold shadow-sm"
                        : "text-slate-700 hover:text-terracotta-800 hover:bg-terracotta-50"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-terracotta-700" aria-hidden="true" />
                    <span>Katalog Resep</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowComingSoon(true)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-terracotta-800 hover:bg-terracotta-50 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Fitur Kirim Resep (Segera Hadir)"
                  >
                    <PlusCircle className="w-4 h-4 text-accent" aria-hidden="true" />
                    <span>Kirim Resep</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-accent/15 text-accent-hover">
                      Segera
                    </span>
                  </button>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        pathname.startsWith("/admin")
                          ? "bg-amber-600 text-white font-semibold shadow-sm"
                          : "text-amber-900 bg-amber-100/80 hover:bg-amber-200/90 font-medium"
                      }`}
                    >
                      <Shield className="w-4 h-4" aria-hidden="true" />
                      <span>Kelola Resep</span>
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Desktop Auth CTA */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-terracotta-800 hover:bg-terracotta-900 text-white font-medium text-sm shadow-clay-button hover:shadow-clay-hover transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Masuk Akun</span>
                </Link>
              ) : (
                <div className="flex items-center gap-3 pl-3 border-l border-terracotta-200">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={user?.display_name || "User"}
                      className="w-8 h-8 rounded-full border-2 border-terracotta-300 object-cover"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {user?.display_name || "Pengguna"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {isAdmin ? "Admin Utama" : "Viewer Masakan"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    aria-label="Keluar dari akun"
                    title="Keluar dari akun"
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                className="p-2 rounded-lg text-slate-700 hover:text-terracotta-800 hover:bg-terracotta-50 cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-terracotta-100 bg-cream-50 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fadeIn">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-terracotta-100"
                >
                  Beranda
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-terracotta-800 text-white font-medium text-center flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk / Daftar Akun</span>
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2 border-b border-terracotta-200/80 mb-2 flex items-center gap-3">
                  <img
                    src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={user?.display_name || "User"}
                    className="w-9 h-9 rounded-full border border-terracotta-300"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user?.display_name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>

                <Link
                  href="/recipes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-terracotta-100"
                >
                  <BookOpen className="w-4 h-4 text-terracotta-700" />
                  <span>Katalog Resep</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowComingSoon(true);
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-terracotta-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-accent" />
                    <span>Kirim Resep</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent-hover">
                    Segera Hadir
                  </span>
                </button>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-900 font-semibold"
                  >
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Dashboard Kelola Resep</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 cursor-pointer mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </>
  );
}

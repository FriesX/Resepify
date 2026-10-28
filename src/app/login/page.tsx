"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UtensilsCrossed,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, loginWithEmail, loginWithMagicLink, loginWithGoogle, quickLoginAs, logout } =
    useAuth();

  const [activeTab, setActiveTab] = useState<"password" | "magic_link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-clay p-8 max-w-md w-full shadow-clay border border-terracotta-100 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 mb-1">
              Anda Sudah Masuk
            </h1>
            <p className="text-slate-600 text-sm mb-6">
              Masuk sebagai <strong className="text-terracotta-800">{user.display_name}</strong> ({user.role})
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push(user.role === "admin" ? "/admin" : "/recipes")}
                className="w-full py-3 px-4 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold rounded-xl transition-all shadow-clay-button cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Lanjut ke {user.role === "admin" ? "Dashboard Admin" : "Katalog Resep"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 px-4 bg-cream-100 hover:bg-cream-200 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer text-sm"
              >
                Ganti Akun / Keluar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Kata sandi minimal 4 karakter.");
      return;
    }

    setLoading(true);
    const res = await loginWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      router.push(email.toLowerCase().includes("admin") ? "/admin" : "/recipes");
    } else {
      setError(res.error || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    setLoading(true);
    const res = await loginWithMagicLink(email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage("Tautan masuk berhasil dikirim & sesi Anda telah aktif!");
      setTimeout(() => {
        router.push(email.toLowerCase().includes("admin") ? "/admin" : "/recipes");
      }, 1000);
    } else {
      setError(res.error || "Gagal mengirimkan tautan masuk.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      router.push("/recipes");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-clay p-6 sm:p-8 shadow-clay border border-terracotta-100 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-800 text-white flex items-center justify-center mx-auto mb-3 shadow-clay-button">
              <UtensilsCrossed className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Masuk ke Resepify
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Akses khusus anggota untuk membuka seluruh katalog resep
            </p>
          </div>

          {/* Quick 1-Click Demo Testing Buttons (PRD Evaluation Ease) */}
          <div className="mb-6 p-4 rounded-xl bg-cream-100/80 border border-terracotta-200/80">
            <span className="text-[11px] font-bold text-terracotta-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              Akses Uji Coba Cepat (1-Klik):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickLoginAs("admin");
                  router.push("/admin");
                }}
                className="p-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-950 font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer text-center"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Masuk Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginAs("viewer");
                  router.push("/recipes");
                }}
                className="p-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-950 font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer text-center"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Masuk Viewer</span>
              </button>
            </div>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
              atau via email
            </span>
          </div>

          {/* Auth Tab: Password vs Magic Link */}
          <div className="grid grid-cols-2 p-1 bg-cream-100 rounded-xl mb-4 border border-terracotta-100">
            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "password"
                  ? "bg-white text-terracotta-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kata Sandi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("magic_link")}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "magic_link"
                  ? "bg-white text-terracotta-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tautan Ajaib (Magic Link)
            </button>
          </div>

          {/* Form */}
          {activeTab === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="email-input">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50 border border-terracotta-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-700 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="pass-input">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="pass-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50 border border-terracotta-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-700 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-terracotta-800 hover:bg-terracotta-900 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all shadow-clay-button cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? "Memverifikasi..." : "Masuk ke Akun"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="magic-email">
                  Alamat Email Anda
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="magic-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50 border border-terracotta-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-700 text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Kami akan mengirimkan tautan login aman tanpa perlu mengingat kata sandi.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-terracotta-800 hover:bg-terracotta-900 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-all shadow-clay-button cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? "Mengirimkan Tautan..." : "Kirim Tautan Masuk"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <p className="text-[11px] text-slate-400 text-center mt-6">
            Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi Resepify.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

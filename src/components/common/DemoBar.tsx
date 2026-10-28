"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, UserCheck, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DemoBar() {
  const { user, role, quickLoginAs, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside
      aria-label="Demo Bar Pengujian Peran"
      className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 z-50 sticky top-0 transition-all shadow-md no-print"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            Mode Pengujian Cepat:
          </span>
          <span
            className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
              role === "admin"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : role === "viewer"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-700 text-slate-300 border border-slate-600"
            }`}
          >
            {role === "admin"
              ? "Admin (Pemilik Website)"
              : role === "viewer"
              ? "Viewer Terautentikasi"
              : "Guest (Belum Login)"}
          </span>
          {user && (
            <span className="hidden sm:inline text-slate-400 truncate max-w-[180px]">
              ({user.display_name})
            </span>
          )}
        </div>

        {/* Right: Quick Switch Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Ubah Hak Akses:</span>

          <button
            type="button"
            onClick={() => quickLoginAs("guest")}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${
              role === "guest"
                ? "bg-slate-700 text-white shadow-inner border border-slate-500"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Uji sebagai Pengunjung Umum (Guest)"
          >
            <EyeOff className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span>Tamu (Guest)</span>
          </button>

          <button
            type="button"
            onClick={() => quickLoginAs("viewer")}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${
              role === "viewer"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Uji sebagai Pembaca Terautentikasi (Viewer)"
          >
            <UserCheck className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            <span>Viewer</span>
          </button>

          <button
            type="button"
            onClick={() => quickLoginAs("admin")}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${
              role === "admin"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Uji sebagai Admin Pemilik Website"
          >
            <ShieldCheck className="w-3 h-3 text-amber-300" aria-hidden="true" />
            <span>Admin</span>
          </button>

          {role === "admin" && pathname !== "/admin" && (
            <Link
              href="/admin"
              className="ml-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-md transition-all flex items-center gap-1"
            >
              <span>Buka Dashboard</span>
            </Link>
          )}

          {role !== "guest" && (
            <button
              type="button"
              onClick={logout}
              className="text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors cursor-pointer"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

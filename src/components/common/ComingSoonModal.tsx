"use client";

import React from "react";
import { Sparkles, Clock, CheckCircle2, ShieldCheck, X } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-clay-lg max-w-md w-full p-6 sm:p-8 shadow-2xl border border-terracotta-100 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/15 via-terracotta-100/30 to-transparent -mr-10 -mt-10 rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-accent-light text-accent flex items-center justify-center mb-5 shadow-sm">
          <Clock className="w-7 h-7" aria-hidden="true" />
        </div>

        {/* Title & Copy specified in PRD Section 6.5 */}
        <h3 id="modal-title" className="font-serif text-2xl font-bold text-slate-900 mb-2">
          Fitur Kontribusi Resep
        </h3>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Fase Berikutnya (Coming Soon)</span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          Fitur kontribusi resep sedang dipersiapkan agar setiap kiriman dari komunitas dapat ditinjau oleh tim kurator dan tetap memenuhi standar kualitas tinggi Resepify.
        </p>

        {/* Roadmap points */}
        <div className="bg-cream-100 rounded-xl p-4 mb-6 border border-terracotta-100 space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span>Alur pengiriman resep dengan validasi takaran presisi</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span>Sistem moderasi & persetujuan kurator sebelum terbit</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span>Profil kontributor dan penghargaan kreasi kuliner</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold rounded-xl transition-all shadow-clay-button cursor-pointer text-sm"
        >
          Saya Mengerti
        </button>
      </div>
    </div>
  );
}

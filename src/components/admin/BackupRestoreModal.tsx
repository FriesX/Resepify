"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/auth";
import { RecipeService } from "@/lib/storage";
import { X, Download, Upload, CheckCircle2, AlertCircle, Database, FileJson } from "lucide-react";

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  actor: UserProfile;
  onRestoreComplete: () => void;
}

export function BackupRestoreModal({
  isOpen,
  onClose,
  actor,
  onRestoreComplete,
}: BackupRestoreModalProps) {
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonString = RecipeService.exportBackup();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resepify-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreSuccess(null);
    setRestoreError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = RecipeService.restoreBackup(content, actor);
      if (res.success) {
        setRestoreSuccess(`Berhasil memulihkan ${res.count} resep dari berkas cadangan.`);
        onRestoreComplete();
      } else {
        setRestoreError(res.error || "Gagal memulihkan cadangan.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-clay-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-terracotta-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-terracotta-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 id="backup-modal-title" className="font-serif text-xl font-bold text-slate-900">
                Pencadangan & Pemulihan Data
              </h3>
              <p className="text-xs text-slate-500">
                Ekspor dan impor berkas JSON untuk menjaga ketersediaan data (PRD §14)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {restoreError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{restoreError}</span>
          </div>
        )}

        {restoreSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{restoreSuccess}</span>
          </div>
        )}

        {/* Export Box */}
        <div className="p-5 bg-cream-50 rounded-2xl border border-terracotta-100 mb-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-terracotta-200 text-terracotta-800 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Unduh Cadangan Resep (Export JSON)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Simpan seluruh resep, kategori, dan log audit ke format JSON portabel.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="w-full py-2.5 px-4 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileJson className="w-4 h-4" />
            <span>Unduh Berkas JSON Sekarang</span>
          </button>
        </div>

        {/* Import/Restore Box */}
        <div className="p-5 bg-cream-50 rounded-2xl border border-terracotta-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-terracotta-200 text-accent flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Pulihkan Cadangan (Import JSON)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah berkas cadangan JSON untuk memulihkan seluruh data resep.
              </p>
            </div>
          </div>
          <label className="w-full py-2.5 px-4 bg-white border border-dashed border-terracotta-300 hover:border-terracotta-700 text-terracotta-900 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-terracotta-700" />
            <span>Pilih Berkas JSON Backup</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

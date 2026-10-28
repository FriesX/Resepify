"use client";

import React, { useState } from "react";
import { Category } from "@/types/category";
import { UserProfile } from "@/types/auth";
import { RecipeService } from "@/lib/storage";
import { X, Plus, FolderTree, CheckCircle2, AlertCircle } from "lucide-react";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onRefresh: () => void;
  actor: UserProfile;
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onRefresh,
  actor,
}: CategoryManagerModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = RecipeService.createCategory({ name, description }, actor);
    if (res.success) {
      setSuccess(`Kategori '${name}' berhasil ditambahkan.`);
      setName("");
      setDescription("");
      onRefresh();
    } else {
      setError(res.error || "Gagal membuat kategori.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-clay-lg max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-terracotta-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-terracotta-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cat-modal-title" className="font-serif text-xl font-bold text-slate-900">
                Kelola Kategori Masakan
              </h3>
              <p className="text-xs text-slate-500">
                Atur klasifikasi resep pada katalog Resepify
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Add Category */}
        <form onSubmit={handleCreate} className="bg-cream-50 p-4 rounded-xl border border-terracotta-100 mb-6">
          <span className="text-xs font-bold text-terracotta-900 block mb-3">
            Tambah Kategori Baru:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Kategori (cth: Olahan Seafood)"
                required
                className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
              />
            </div>
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat (opsional)"
                className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Kategori</span>
          </button>
        </form>

        {/* Existing categories list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Daftar Kategori Aktif ({categories.length}):
          </span>
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-white border border-terracotta-100 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs"
            >
              <div>
                <span className="font-bold text-slate-900">{c.name}</span>
                <span className="text-slate-400 block text-[11px]">{c.description || "Tidak ada deskripsi"}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cream-100 text-terracotta-800 font-bold text-[10px] whitespace-nowrap">
                {c.recipe_count || 0} Resep
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

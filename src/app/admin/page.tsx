"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Recipe, RecipeStatus } from "@/types/recipe";
import { Category } from "@/types/category";
import { AuditEvent } from "@/types/audit";
import { RecipeService, getStoredAuditLogs } from "@/lib/storage";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AdminStats } from "@/components/admin/AdminStats";
import { RecipeFormModal } from "@/components/admin/RecipeFormModal";
import { CategoryManagerModal } from "@/components/admin/CategoryManagerModal";
import { AuditLogModal } from "@/components/admin/AuditLogModal";
import { BackupRestoreModal } from "@/components/admin/BackupRestoreModal";
import {
  ShieldAlert,
  Plus,
  Search,
  Edit,
  Archive,
  RotateCcw,
  Trash2,
  CheckCircle,
  FileText,
  FolderTree,
  Database,
  Shield,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState<RecipeStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Hard delete confirmation dialog
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);

  // Notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = useCallback(() => {
    const all = RecipeService.getAllForAdmin({
      status: statusFilter,
      search: searchQuery,
    });
    setRecipes(all);
    setCategories(RecipeService.getCategories());
    setAuditLogs(getStoredAuditLogs());
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    if (!isLoading && isAdmin) {
      loadData();
    }
  }, [isAdmin, isLoading, loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-terracotta-200 border-t-terracotta-800 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-terracotta-900 tracking-wider">
            Memuat Dashboard Admin...
          </span>
        </div>
      </div>
    );
  }

  // Strict Admin Gate check (OWASP Broken Access Control prevention)
  if (!isAdmin || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-clay p-8 sm:p-10 max-w-md w-full shadow-clay border border-terracotta-100 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
              Akses Ditolak (403 Forbidden)
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Halaman ini hanya dapat diakses oleh Admin pemilik Resepify. Silakan login sebagai Admin melalui bilah demo di atas atau form login.
            </p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold text-xs rounded-xl transition-all shadow-clay-button cursor-pointer"
              >
                <span>Masuk sebagai Admin</span>
              </Link>
              <Link
                href="/recipes"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-cream-100 hover:bg-cream-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span>Kembali ke Katalog Viewer</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = RecipeService.getStats();

  // Recipe Action Handlers
  const handlePublish = (recipe: Recipe) => {
    const res = RecipeService.publish(recipe.id, user);
    if (res.success) {
      showToast(`Resep '${recipe.title}' berhasil diterbitkan.`);
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleArchive = (recipe: Recipe) => {
    const res = RecipeService.archive(recipe.id, user);
    if (res.success) {
      showToast(`Resep '${recipe.title}' telah diarsipkan (soft delete).`);
      loadData();
    }
  };

  const handleRestore = (recipe: Recipe) => {
    const res = RecipeService.restore(recipe.id, user);
    if (res.success) {
      showToast(`Resep '${recipe.title}' dipulihkan ke status draf.`);
      loadData();
    }
  };

  const confirmHardDelete = () => {
    if (!deleteTarget) return;
    const res = RecipeService.hardDelete(deleteTarget.id, user);
    if (res.success) {
      showToast(`Resep '${deleteTarget.title}' berhasil dihapus permanen.`);
      setDeleteTarget(null);
      loadData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-terracotta-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
              <span>Pusat Kontrol Pemilik Website</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Dashboard Admin Resepify
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Kelola seluruh konten kuliner, draf terstruktur, kategori, dan log operasional
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingRecipe(null);
                setIsRecipeModalOpen(true);
              }}
              className="px-4 py-2.5 bg-terracotta-800 hover:bg-terracotta-900 text-white font-bold text-xs rounded-xl shadow-clay-button transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Resep</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-2.5 bg-white border border-terracotta-200 text-slate-700 hover:bg-terracotta-50 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FolderTree className="w-4 h-4 text-terracotta-700" />
              <span>Kategori</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="px-3.5 py-2.5 bg-white border border-terracotta-200 text-slate-700 hover:bg-terracotta-50 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Log Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBackupModalOpen(true)}
              className="px-3.5 py-2.5 bg-white border border-terracotta-200 text-slate-700 hover:bg-terracotta-50 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-4 h-4 text-accent" />
              <span>Cadangan (JSON)</span>
            </button>
          </div>
        </div>

        {/* Admin Statistics Row */}
        <AdminStats stats={stats} />

        {/* Recipe Management Table Area */}
        <div className="bg-white rounded-clay border border-terracotta-100 shadow-clay-card overflow-hidden">
          {/* Filter & Search Bar */}
          <div className="p-5 border-b border-terracotta-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cream-50/50">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none" role="tablist">
              {[
                { key: "all", label: "Semua Resep", count: stats.total },
                { key: "published", label: "Diterbitkan", count: stats.published },
                { key: "draft", label: "Draf", count: stats.drafts },
                { key: "archived", label: "Diarsipkan", count: stats.archived },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key as RecipeStatus | "all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.key
                      ? "bg-terracotta-800 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-terracotta-100/70 border border-terracotta-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      statusFilter === tab.key ? "bg-white/20 text-white" : "bg-terracotta-100 text-terracotta-900"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, draf, slug..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
              />
            </div>
          </div>

          {/* Table / List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-cream-100/80 text-terracotta-900 font-bold uppercase tracking-wider text-[11px] border-b border-terracotta-100">
                <tr>
                  <th className="py-3 px-4">Resep Masakan</th>
                  <th className="py-3 px-4">Kuliner & Jenis</th>
                  <th className="py-3 px-4">Waktu / Porsi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta-100">
                {recipes.length > 0 ? (
                  recipes.map((item) => (
                    <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                      {/* Title & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.cover_image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-terracotta-200 shrink-0 bg-cream-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-sm block line-clamp-1">
                              {item.title}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">
                              /{item.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cuisine & Meal Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{item.cuisine}</span>
                        <span className="text-slate-500 capitalize text-[11px]">
                          {item.meal_type.replace("_", " ")}
                        </span>
                      </td>

                      {/* Time & Servings */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {(item.prep_time_minutes || 0) + (item.cook_time_minutes || 0)} mnt total
                        </span>
                        <span className="text-slate-500 text-[11px]">{item.servings} porsi</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-block ${
                            item.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "draft"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.status === "published"
                            ? "Published"
                            : item.status === "draft"
                            ? "Draft"
                            : "Archived"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live preview link if published */}
                          {item.status === "published" && (
                            <Link
                              href={`/recipes/${item.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-terracotta-800 hover:bg-terracotta-50 transition-colors"
                              title="Buka tampilan publik"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRecipe(item);
                              setIsRecipeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-terracotta-800 hover:bg-terracotta-50 transition-colors cursor-pointer"
                            title="Edit Resep"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Status toggle actions */}
                          {item.status === "draft" && (
                            <button
                              type="button"
                              onClick={() => handlePublish(item)}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors cursor-pointer"
                              title="Terbitkan resep sekarang"
                            >
                              Publish
                            </button>
                          )}

                          {item.status === "published" && (
                            <button
                              type="button"
                              onClick={() => handleArchive(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="Arsipkan Resep (Soft Delete)"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          {item.status === "archived" && (
                            <button
                              type="button"
                              onClick={() => handleRestore(item)}
                              className="p-1.5 rounded-lg text-teal-700 hover:text-teal-800 hover:bg-teal-50 transition-colors cursor-pointer"
                              title="Pulihkan dari Arsip ke Draf"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}

                          {/* Hard Delete button */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Tidak ada resep yang sesuai dengan filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Recipe Form Modal */}
      <RecipeFormModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipe={editingRecipe}
        categories={categories}
        actor={user}
        onSuccess={() => {
          showToast(
            editingRecipe
              ? "Perubahan resep berhasil disimpan."
              : "Resep baru berhasil ditambahkan."
          );
          loadData();
        }}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onRefresh={loadData}
        actor={user}
      />

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={auditLogs}
      />

      {/* Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        actor={user}
        onRestoreComplete={() => {
          showToast("Data resep berhasil dipulihkan.");
          loadData();
        }}
      />

      {/* Hard Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-clay-lg p-6 max-w-sm w-full border border-rose-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">
              Hapus Resep Permanen?
            </h4>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Resep <strong>&quot;{deleteTarget.title}&quot;</strong> akan dihapus permanen dari sistem dan tidak dapat dipulihkan kecuali melalui berkas backup.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmHardDelete}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

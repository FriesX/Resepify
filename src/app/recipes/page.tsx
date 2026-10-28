"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Recipe, RecipeFilterParams } from "@/types/recipe";
import { Category } from "@/types/category";
import { RecipeService } from "@/lib/storage";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Sparkles, SearchX } from "lucide-react";

export default function RecipesCatalogPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<RecipeFilterParams>({
    search: "",
    category_id: "all",
    cuisine: "all",
    meal_type: "all",
    difficulty: "all",
    sort_by: "newest",
  });

  // Redirect guest to login per PRD Section 6.1
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Load recipes and categories
  useEffect(() => {
    if (isAuthenticated) {
      const cats = RecipeService.getCategories();
      setCategories(cats);
      const res = RecipeService.getPublishedRecipes(filters);
      setRecipes(res.recipes);
      setTotal(res.total);
    }
  }, [isAuthenticated, filters]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-terracotta-200 border-t-terracotta-800 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-terracotta-900 tracking-wider">
            Memverifikasi Hak Akses...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-terracotta-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-700" aria-hidden="true" />
              <span>Koleksi Eksklusif Anggota</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Katalog Resep Pilihan
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Telusuri beragam panduan masakan teruji dengan takaran presisi dan instruksi memasak interaktif.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-terracotta-200 font-medium">
              Total {total} Resep Tersedia
            </span>
          </div>
        </div>

        {/* Filters & Search Component */}
        <RecipeFilters
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
          totalResults={total}
        />

        {/* Recipe Grid or Empty State */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-clay p-12 text-center border border-terracotta-100 shadow-sm max-w-lg mx-auto my-12 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-cream-100 text-terracotta-800 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
              Resep Tidak Ditemukan
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Tidak ada resep yang sesuai dengan kata kunci atau kombinasi filter saat ini. Coba gunakan kata kunci lain atau bersihkan filter.
            </p>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  search: "",
                  category_id: "all",
                  cuisine: "all",
                  meal_type: "all",
                  difficulty: "all",
                  sort_by: "newest",
                })
              }
              className="px-6 py-2.5 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold text-xs rounded-xl transition-all shadow-clay-button cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

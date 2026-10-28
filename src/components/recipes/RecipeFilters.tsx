"use client";

import React, { useState } from "react";
import { RecipeFilterParams } from "@/types/recipe";
import { Category } from "@/types/category";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

interface RecipeFiltersProps {
  categories: Category[];
  filters: RecipeFilterParams;
  onFilterChange: (newFilters: RecipeFilterParams) => void;
  totalResults: number;
}

export function RecipeFilters({
  categories,
  filters,
  onFilterChange,
  totalResults,
}: RecipeFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryClick = (catId: string) => {
    onFilterChange({ ...filters, category_id: filters.category_id === catId ? "all" : catId });
  };

  const handleReset = () => {
    onFilterChange({
      search: "",
      category_id: "all",
      cuisine: "all",
      meal_type: "all",
      difficulty: "all",
      max_time: undefined,
      sort_by: "newest",
    });
  };

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim()) ||
    (filters.category_id && filters.category_id !== "all") ||
    (filters.cuisine && filters.cuisine !== "all") ||
    (filters.meal_type && filters.meal_type !== "all") ||
    (filters.difficulty && filters.difficulty !== "all") ||
    filters.max_time
  );

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Quick Category Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input with SVG Icon */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filters.search || ""}
            onChange={handleSearchChange}
            placeholder="Cari resep, bahan (cth: santan, daging, matcha), atau masakan..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-terracotta-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-terracotta-700 shadow-sm text-sm"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, search: "" })}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
              showAdvanced || hasActiveFilters
                ? "bg-terracotta-50 border-terracotta-400 text-terracotta-900"
                : "bg-white border-terracotta-200 text-slate-700 hover:bg-terracotta-50/50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-terracotta-700" aria-hidden="true" />
            <span>Filter Detail</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-terracotta-700"></span>
            )}
          </button>

          <div className="relative">
            <select
              value={filters.sort_by || "newest"}
              onChange={(e) => onFilterChange({ ...filters, sort_by: e.target.value as RecipeFilterParams["sort_by"] })}
              className="appearance-none pl-9 pr-8 py-3 bg-white border border-terracotta-200/80 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-terracotta-700 shadow-sm cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="popular">Terpopuler</option>
              <option value="prep_time">Waktu Tercepat</option>
              <option value="alphabetical">Alfabetis (A-Z)</option>
            </select>
            <ArrowUpDown
              className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
        <button
          type="button"
          onClick={() => handleCategoryClick("all")}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            !filters.category_id || filters.category_id === "all"
              ? "bg-terracotta-800 text-white shadow-clay-button"
              : "bg-white text-slate-700 hover:bg-terracotta-100/60 border border-terracotta-100"
          }`}
        >
          Semua Kategori
        </button>

        {categories.map((cat) => {
          const isSelected = filters.category_id === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-terracotta-800 text-white shadow-clay-button"
                  : "bg-white text-slate-700 hover:bg-terracotta-100/60 border border-terracotta-100"
              }`}
            >
              <span>{cat.name}</span>
              {typeof cat.recipe_count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-terracotta-100 text-terracotta-800"
                  }`}
                >
                  {cat.recipe_count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="bg-white p-5 rounded-clay border border-terracotta-200/80 shadow-clay grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
          {/* Cuisine */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Kuliner Asal</label>
            <select
              value={filters.cuisine || "all"}
              onChange={(e) => onFilterChange({ ...filters, cuisine: e.target.value })}
              className="w-full p-2.5 bg-cream-50 border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
            >
              <option value="all">Semua Kuliner</option>
              <option value="Indonesia">Nusantara / Indonesia</option>
              <option value="Asia">Asia</option>
              <option value="Jepang">Jepang</option>
              <option value="Barat">Barat / Western</option>
            </select>
          </div>

          {/* Meal Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Waktu / Jenis Santapan</label>
            <select
              value={filters.meal_type || "all"}
              onChange={(e) => onFilterChange({ ...filters, meal_type: e.target.value })}
              className="w-full p-2.5 bg-cream-50 border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
            >
              <option value="all">Semua Waktu Makan</option>
              <option value="sarapan">Sarapan Pagi</option>
              <option value="makan_siang">Makan Siang</option>
              <option value="makan_malam">Makan Malam</option>
              <option value="camilan">Camilan</option>
              <option value="pencuci_mulut">Pencuci Mulut / Dessert</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Kesulitan</label>
            <select
              value={filters.difficulty || "all"}
              onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
              className="w-full p-2.5 bg-cream-50 border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
            >
              <option value="all">Semua Tingkat</option>
              <option value="easy">Mudah (Pemula)</option>
              <option value="medium">Sedang (Menengah)</option>
              <option value="hard">Mahir (Progresif)</option>
            </select>
          </div>

          {/* Max Cooking Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Waktu Maksimal</label>
            <select
              value={filters.max_time || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  max_time: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full p-2.5 bg-cream-50 border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
            >
              <option value="">Berapa Saja</option>
              <option value="30">≤ 30 Menit (Kilat)</option>
              <option value="60">≤ 1 Jam</option>
              <option value="120">≤ 2 Jam</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2 border-t border-terracotta-100">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-terracotta-800 hover:text-terracotta-900 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count & Reset indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Menampilkan {totalResults} resep pilihan</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-terracotta-700 hover:underline cursor-pointer"
          >
            Hapus filter
          </button>
        )}
      </div>
    </div>
  );
}

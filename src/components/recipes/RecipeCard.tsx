import React from "react";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { Clock, Users, Flame } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

const difficultyLabels: Record<string, { label: string; class: string }> = {
  easy: { label: "Mudah", class: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  medium: { label: "Sedang", class: "bg-amber-100 text-amber-800 border-amber-200" },
  hard: { label: "Mahir", class: "bg-rose-100 text-rose-800 border-rose-200" },
};

const mealTypeLabels: Record<string, string> = {
  sarapan: "Sarapan",
  makan_siang: "Makan Siang",
  makan_malam: "Makan Malam",
  camilan: "Camilan",
  minuman: "Minuman",
  pencuci_mulut: "Dessert",
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  const diff = difficultyLabels[recipe.difficulty] || difficultyLabels.medium;

  return (
    <article className="group bg-white rounded-clay overflow-hidden border border-terracotta-100/80 shadow-clay hover:shadow-clay-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer">
      <Link
        href={`/recipes/${recipe.slug}`}
        className="block flex-1 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-700"
      >
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
          <img
            src={recipe.cover_image_url}
            alt={`Foto masakan ${recipe.title}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/70 text-white backdrop-blur-md shadow-sm">
              {recipe.cuisine}
            </span>
            {recipe.is_featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-slate-950" aria-hidden="true" />
                Pilihan
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${diff.class}`}
            >
              {diff.label}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-terracotta-700 mb-1.5">
              <span>{mealTypeLabels[recipe.meal_type] || recipe.meal_type}</span>
              <span>•</span>
              <span>{recipe.ingredients.length} Bahan</span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-terracotta-800 transition-colors line-clamp-2 leading-snug mb-2">
              {recipe.title}
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
              {recipe.summary}
            </p>
          </div>

          {/* Footer Meta: Time & Servings */}
          <div className="pt-3 border-t border-terracotta-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-terracotta-700" aria-hidden="true" />
              <span>{totalTime} menit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>{recipe.servings} porsi</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

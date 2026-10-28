"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Recipe } from "@/types/recipe";
import { RecipeService } from "@/lib/storage";
import { RecipeDetailView } from "@/components/recipes/RecipeDetailView";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function RecipeDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Guest gate: redirect to login
        router.push("/login");
        return;
      }

      if (slug) {
        const found = RecipeService.getBySlug(slug, role);
        setRecipe(found);
        if (found) {
          RecipeService.incrementViews(slug);
        }
        setHasLoaded(true);
      }
    }
  }, [slug, role, isAuthenticated, isLoading, router]);

  if (isLoading || !hasLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-terracotta-200 border-t-terracotta-800 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-terracotta-900 tracking-wider">
            Menyiapkan Resep...
          </span>
        </div>
      </div>
    );
  }

  // Not found or not allowed (draft/archived for viewer)
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-clay p-8 sm:p-10 max-w-md w-full shadow-clay border border-terracotta-100 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
              Resep Tidak Dapat Diakses
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Resep yang Anda cari tidak ditemukan atau berstatus draf privat yang belum diterbitkan untuk publik.
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta-800 hover:bg-terracotta-900 text-white font-semibold text-xs rounded-xl transition-all shadow-clay-button cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Resep</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1">
        <RecipeDetailView recipe={recipe} />
      </main>
      <Footer />
    </div>
  );
}

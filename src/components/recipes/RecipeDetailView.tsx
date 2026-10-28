"use client";

import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import {
  Clock,
  Users,
  Flame,
  ChefHat,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Info,
  CheckCircle2,
  Sparkles,
  PlayCircle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface RecipeDetailViewProps {
  recipe: Recipe;
}

export function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  // Servings Scaler State
  const [servings, setServings] = useState<number>(recipe.servings || 4);
  const baseServings = recipe.servings || 4;
  const ratio = servings / baseServings;

  // Ingredients Check State
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Steps Progress State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Copy ingredients toast
  const [copied, setCopied] = useState(false);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scaleQuantity = (qty: number | string): string => {
    if (typeof qty === "string") {
      const parsed = parseFloat(qty);
      if (isNaN(parsed)) return qty;
      const scaled = parsed * ratio;
      return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, "");
    }
    const scaled = qty * ratio;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, "");
  };

  const handleCopyIngredients = async () => {
    const text = recipe.ingredients
      .map(
        (i, idx) =>
          `${idx + 1}. ${scaleQuantity(i.quantity)} ${i.unit} ${i.name}${i.note ? ` (${i.note})` : ""}`
      )
      .join("\n");
    const fullText = `*Bahan Resep: ${recipe.title} (${servings} Porsi)*\n\n${text}\n\nSumber: Resepify (Katalog Resep Pilihan)`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Gagal menyalin bahan", e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalSteps = recipe.steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta-800 hover:text-terracotta-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Katalog</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyIngredients}
            className="px-3.5 py-2 rounded-xl bg-white border border-terracotta-200 text-slate-700 hover:bg-terracotta-50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Salin daftar bahan ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-terracotta-700" aria-hidden="true" />
                <span>Salin Bahan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white border border-terracotta-200 text-slate-700 hover:bg-terracotta-50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Cetak lembar resep ini"
          >
            <Printer className="w-4 h-4 text-terracotta-700" aria-hidden="true" />
            <span>Cetak Resep</span>
          </button>
        </div>
      </div>

      {/* Hero Recipe Card */}
      <div className="bg-white rounded-clay-lg overflow-hidden border border-terracotta-100 shadow-clay-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Cover Image */}
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-cream-200">
            <img
              src={recipe.cover_image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                {recipe.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta-800 text-white shadow-sm">
                {recipe.meal_type.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Header Info */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-700 uppercase tracking-wider mb-2">
                <span>Resep Terverifikasi</span>
                <span>•</span>
                <span>Tingkat: {recipe.difficulty}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                {recipe.title}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {recipe.summary}
              </p>

              {recipe.description && (
                <div className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 bg-cream-50 p-4 rounded-xl border border-terracotta-100/60">
                  {recipe.description}
                </div>
              )}
            </div>

            {/* Meta bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-terracotta-100">
              <div className="flex flex-col items-center p-3 rounded-xl bg-cream-50 text-center">
                <Clock className="w-5 h-5 text-terracotta-700 mb-1" aria-hidden="true" />
                <span className="text-[11px] text-slate-500 font-medium">Persiapan</span>
                <span className="text-sm font-bold text-slate-800">{recipe.prep_time_minutes} mnt</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-cream-50 text-center">
                <Flame className="w-5 h-5 text-terracotta-700 mb-1" aria-hidden="true" />
                <span className="text-[11px] text-slate-500 font-medium">Memasak</span>
                <span className="text-sm font-bold text-slate-800">{recipe.cook_time_minutes} mnt</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-cream-50 text-center">
                <Users className="w-5 h-5 text-accent mb-1" aria-hidden="true" />
                <span className="text-[11px] text-slate-500 font-medium">Porsi Dasar</span>
                <span className="text-sm font-bold text-slate-800">{baseServings} Porsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipe Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ingredients & Servings Scaler */}
        <section className="lg:col-span-5 space-y-6" aria-labelledby="ingredients-heading">
          <div className="bg-white p-6 rounded-clay border border-terracotta-100 shadow-clay-card sticky top-32">
            <div className="flex items-center justify-between pb-4 border-b border-terracotta-100 mb-4">
              <h2 id="ingredients-heading" className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-terracotta-800" aria-hidden="true" />
                <span>Bahan-Bahan</span>
              </h2>

              {/* Servings Scaler Controls */}
              <div className="flex items-center gap-2 bg-cream-100 px-3 py-1.5 rounded-full border border-terracotta-200">
                <span className="text-xs font-semibold text-slate-700">Porsi:</span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="w-5 h-5 rounded-full bg-white text-terracotta-800 hover:bg-terracotta-100 flex items-center justify-center font-bold text-sm shadow-xs cursor-pointer"
                  title="Kurangi porsi"
                  aria-label="Kurangi porsi"
                >
                  -
                </button>
                <span className="text-xs font-bold text-terracotta-900 w-4 text-center">
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => s + 1)}
                  className="w-5 h-5 rounded-full bg-white text-terracotta-800 hover:bg-terracotta-100 flex items-center justify-center font-bold text-sm shadow-xs cursor-pointer"
                  title="Tambah porsi"
                  aria-label="Tambah porsi"
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>Centang bahan untuk menandai yang sudah siap:</span>
            </p>

            {/* Checklist items */}
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = Boolean(checkedIngredients[ing.id]);
                return (
                  <li
                    key={ing.id}
                    onClick={() => toggleIngredient(ing.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer select-none ${
                      isChecked
                        ? "bg-emerald-50/60 text-slate-400 line-through"
                        : "hover:bg-cream-100/70 text-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(ing.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent cursor-pointer"
                    />
                    <div className="flex-1 text-sm leading-snug">
                      <span className="font-semibold text-terracotta-900 mr-1.5">
                        {scaleQuantity(ing.quantity)} {ing.unit}
                      </span>
                      <span>{ing.name}</span>
                      {ing.note && (
                        <span className="block text-xs text-slate-500 italic mt-0.5">
                          {ing.note}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Source attribution if exists */}
            {recipe.source_attribution && (
              <div className="mt-6 pt-4 border-t border-terracotta-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Sumber / Atribusi: </span>
                {recipe.source_attribution}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Cooking Steps & Media */}
        <section className="lg:col-span-7 space-y-6" aria-labelledby="steps-heading">
          <div className="bg-white p-6 rounded-clay border border-terracotta-100 shadow-clay-card">
            {/* Header & Cooking Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-terracotta-100 mb-6">
              <div>
                <h2 id="steps-heading" className="font-serif text-xl font-bold text-slate-900">
                  Langkah Memasak
                </h2>
                <p className="text-xs text-slate-500">
                  Ikuti instruksi bertahap untuk cita rasa maksimal
                </p>
              </div>

              {/* Step completion badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {completedCount} dari {totalSteps} Selesai
                  </div>
                  <div className="text-[10px] text-slate-500">{progressPercent}% tercapai</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-terracotta-100 flex items-center justify-center font-bold text-xs text-terracotta-800 bg-cream-50">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-cream-200 overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps list */}
            <div className="space-y-6">
              {recipe.steps.map((step, idx) => {
                const isDone = Boolean(completedSteps[step.id]);
                return (
                  <div
                    key={step.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isDone
                        ? "bg-slate-50/70 border-slate-200/80 opacity-75"
                        : "bg-white border-terracotta-200/70 hover:border-terracotta-400 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number or Check */}
                      <button
                        type="button"
                        onClick={() => toggleStep(step.id)}
                        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                          isDone
                            ? "bg-accent text-white shadow-xs"
                            : "bg-terracotta-100 text-terracotta-900 hover:bg-terracotta-200"
                        }`}
                        title={isDone ? "Tandai belum selesai" : "Tandai selesai"}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-terracotta-800 uppercase tracking-wider">
                            Langkah {idx + 1}
                          </span>
                          {isDone && (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Selesai
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-sm sm:text-base leading-relaxed ${
                            isDone ? "text-slate-500 line-through" : "text-slate-800"
                          }`}
                        >
                          {step.instruction}
                        </p>

                        {/* Optional Step Image / Short Video preview as requested */}
                        {step.image_url && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-terracotta-100 max-w-sm">
                            <div className="relative aspect-video bg-cream-200">
                              <img
                                src={step.image_url}
                                alt={`Ilustrasi langkah ${idx + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] flex items-center gap-1 backdrop-blur-xs">
                                <ImageIcon className="w-3 h-3" /> Panduan Visual
                              </div>
                            </div>
                          </div>
                        )}

                        {step.video_url && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between max-w-sm">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-5 h-5 text-accent" />
                              <span className="text-xs font-medium">Klip Video Langkah {idx + 1}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Segera Diputar</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chef's Tips block */}
            {recipe.tips && (
              <div className="mt-8 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-1">
                    Tips Rahasia Dari Chef:
                  </span>
                  {recipe.tips}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

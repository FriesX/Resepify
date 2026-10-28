"use client";

import React, { useState, useEffect } from "react";
import {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeDifficulty,
  MealType,
  CuisineType,
} from "@/types/recipe";
import { Category } from "@/types/category";
import { UserProfile } from "@/types/auth";
import { RecipeService, generateSlug } from "@/lib/storage";
import {
  X,
  Plus,
  Trash2,
  ChefHat,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { RecipeDetailView } from "@/components/recipes/RecipeDetailView";

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe | null; // null if creating new
  categories: Category[];
  actor: UserProfile;
  onSuccess: () => void;
}

const sampleImages = [
  { label: "Rendang Sapi", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80" },
  { label: "Ayam Bakar", url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80" },
  { label: "Soto & Sup Gurih", url: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=1200&q=80" },
  { label: "Nasi Goreng", url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80" },
  { label: "Dessert & Manisan", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80" },
  { label: "Salad Segar", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80" },
  { label: "Cake & Baking", url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80" },
];

export function RecipeFormModal({
  isOpen,
  onClose,
  recipe,
  categories,
  actor,
  onSuccess,
}: RecipeFormModalProps) {
  const isEditing = Boolean(recipe);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<CuisineType>("Indonesia");
  const [mealType, setMealType] = useState<MealType>("makan_siang");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>("medium");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [tips, setTips] = useState("");
  const [sourceAttribution, setSourceAttribution] = useState("");

  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate state on open or change
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setSlug(recipe.slug);
      setSummary(recipe.summary || "");
      setDescription(recipe.description || "");
      setCoverImageUrl(recipe.cover_image_url || "");
      setCategoryIds(recipe.category_ids || []);
      setCuisine(recipe.cuisine || "Indonesia");
      setMealType(recipe.meal_type || "makan_siang");
      setPrepTimeMinutes(recipe.prep_time_minutes || 15);
      setCookTimeMinutes(recipe.cook_time_minutes || 30);
      setServings(recipe.servings || 4);
      setDifficulty(recipe.difficulty || "medium");
      setIngredients(recipe.ingredients ? [...recipe.ingredients] : []);
      setSteps(recipe.steps ? [...recipe.steps] : []);
      setTips(recipe.tips || "");
      setSourceAttribution(recipe.source_attribution || "");
    } else {
      // Defaults for new recipe
      setTitle("");
      setSlug("");
      setSummary("");
      setDescription("");
      setCoverImageUrl(sampleImages[0].url);
      setCategoryIds([categories[0]?.id || "cat-utama"]);
      setCuisine("Indonesia");
      setMealType("makan_siang");
      setPrepTimeMinutes(20);
      setCookTimeMinutes(30);
      setServings(4);
      setDifficulty("medium");
      setIngredients([
        { id: "ing-init-1", position: 1, name: "Bahan Utama", quantity: 500, unit: "gr", note: "potong rapi" },
        { id: "ing-init-2", position: 2, name: "Bawang Merah", quantity: 6, unit: "siung", note: "haluskan" },
      ]);
      setSteps([
        { id: "stp-init-1", position: 1, instruction: "Persiapkan dan haluskan bumbu aromatik." },
        { id: "stp-init-2", position: 2, instruction: "Tumis bumbu dengan api sedang hingga harum lalu masukkan bahan utama." },
      ]);
      setTips("");
      setSourceAttribution("Kreasi Dapur Resepify");
    }
    setError(null);
    setPreviewMode(false);
  }, [recipe, isOpen, categories]);

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(generateSlug(val));
    }
  };

  // Ingredient helpers
  const addIngredient = () => {
    const newId = "ing-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setIngredients((prev) => [
      ...prev,
      { id: newId, position: prev.length + 1, name: "", quantity: 1, unit: "sdm" },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof RecipeIngredient, value: string | number) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  // Step helpers
  const addStep = () => {
    const newId = "stp-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setSteps((prev) => [
      ...prev,
      { id: newId, position: prev.length + 1, instruction: "" },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: keyof RecipeStep, value: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Save as Draft or Publish
  const handleSave = (publishState: "draft" | "published") => {
    setError(null);

    const payload: Partial<Recipe> = {
      title,
      slug: slug ? generateSlug(slug) : generateSlug(title),
      summary,
      description,
      cover_image_url: coverImageUrl,
      category_ids: categoryIds,
      cuisine,
      meal_type: mealType,
      prep_time_minutes: Number(prepTimeMinutes),
      cook_time_minutes: Number(cookTimeMinutes),
      servings: Number(servings),
      difficulty,
      ingredients: ingredients.filter((i) => i.name.trim().length > 0),
      steps: steps.filter((s) => s.instruction.trim().length > 0),
      tips,
      source_attribution: sourceAttribution,
      status: publishState,
    };

    if (publishState === "published") {
      const valErr = RecipeService.validateForPublish(payload);
      if (valErr) {
        setError(valErr);
        return;
      }
    }

    if (isEditing && recipe) {
      const res = RecipeService.update(recipe.id, payload, actor);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Gagal memperbarui resep.");
      }
    } else {
      const res = RecipeService.create(payload, actor);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Gagal membuat resep.");
      }
    }
  };

  // Construct preview recipe object
  const previewRecipe: Recipe = {
    id: recipe?.id || "preview-id",
    title: title || "Judul Resep Anda",
    slug: slug || "preview-slug",
    summary: summary || "Ringkasan resep akan tampil di sini...",
    description: description || "",
    cover_image_url: coverImageUrl || sampleImages[0].url,
    category_ids: categoryIds,
    cuisine,
    meal_type: mealType,
    prep_time_minutes: prepTimeMinutes,
    cook_time_minutes: cookTimeMinutes,
    servings,
    difficulty,
    ingredients,
    steps,
    tips,
    source_attribution: sourceAttribution,
    status: "published",
    created_by: actor.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-clay-lg max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-terracotta-100 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-terracotta-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-800 text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 id="recipe-form-title" className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                {isEditing ? `Edit Resep: ${recipe?.title}` : "Tambah Resep Baru"}
              </h3>
              <p className="text-xs text-slate-500">
                Lengkapi rincian takaran bahan dan langkah memasak terstruktur
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode
                  ? "bg-amber-100 border-amber-300 text-amber-900"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-700" />
              <span>{previewMode ? "Kembali ke Form" : "Live Preview"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup formulir"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Body: Form or Live Preview */}
        {previewMode ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-amber-50 p-3 rounded-xl text-xs text-amber-900 font-semibold mb-4 text-center border border-amber-200">
              Pratinjau Resep: Tampilan ini adalah representasi nyata yang akan dilihat oleh pengguna (Viewer)
            </div>
            <RecipeDetailView recipe={previewRecipe} />
          </div>
        ) : (
          <form className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Section 1: Basic Info */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-700" />
                <span>Informasi Utama Resep</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Resep <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Contoh: Soto Betawi Kuah Susu Gurih"
                    required
                    className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-terracotta-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slug URL <span className="text-slate-400 font-normal">(Otomatis/Bisa Diedit)</span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="soto-betawi-kuah-susu-gurih"
                    className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan / Summary Singkat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  maxLength={300}
                  placeholder="Ringkasan menggoda selera (maksimal 300 karakter)"
                  className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Cerita Resep (Opsional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Cerita latar belakang kuliner, filosofi bahan, atau pengantar..."
                  className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-700"
                />
              </div>
            </div>

            {/* Section 2: Cover Image & Presets */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-terracotta-700" />
                <span>Foto Cover Masakan</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Gambar Utama <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-terracotta-700 mb-2"
                />
              </div>

              {/* Sample Quick Selector */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Pilih Cepat dari Galeri Fotografi Kuliner Siap Pakai:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverImageUrl(img.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        coverImageUrl === img.url
                          ? "bg-terracotta-800 text-white border-terracotta-800 shadow-xs"
                          : "bg-white text-slate-700 border-terracotta-200 hover:bg-terracotta-50"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Cooking Parameters */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Parameter Kuliner & Waktu</h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kuliner Asal</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value as CuisineType)}
                    className="w-full p-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Asia">Asia</option>
                    <option value="Jepang">Jepang</option>
                    <option value="Barat">Barat</option>
                    <option value="Timur Tengah">Timur Tengah</option>
                    <option value="Fusion">Fusion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Santapan</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealType)}
                    className="w-full p-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value="sarapan">Sarapan</option>
                    <option value="makan_siang">Makan Siang</option>
                    <option value="makan_malam">Makan Malam</option>
                    <option value="camilan">Camilan</option>
                    <option value="pencuci_mulut">Pencuci Mulut</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as RecipeDifficulty)}
                    className="w-full p-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value="easy">Mudah</option>
                    <option value="medium">Sedang</option>
                    <option value="hard">Mahir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Porsi Dasar</label>
                  <input
                    type="number"
                    min={1}
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu Persiapan (Menit)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu Memasak (Menit)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cookTimeMinutes}
                    onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-terracotta-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori Masakan (Pilih satu atau lebih):
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const selected = categoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (selected) {
                            setCategoryIds(categoryIds.filter((id) => id !== cat.id));
                          } else {
                            setCategoryIds([...categoryIds, cat.id]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          selected
                            ? "bg-terracotta-800 text-white border-terracotta-800"
                            : "bg-white text-slate-700 border-terracotta-200 hover:bg-terracotta-50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 4: Ingredients Builder */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  Daftar Bahan Masakan ({ingredients.length}) <span className="text-rose-500">*</span>
                </h4>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Bahan</span>
                </button>
              </div>

              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div
                    key={ing.id}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2.5 bg-white rounded-xl border border-terracotta-100"
                  >
                    <span className="w-6 text-center font-bold text-xs text-slate-400">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                      placeholder="Nama Bahan (cth: Daging Sapi)"
                      className="flex-1 min-w-[130px] p-2 bg-cream-50/60 border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                    <input
                      type="text"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(ing.id, "quantity", e.target.value)}
                      placeholder="Jml"
                      className="w-16 p-2 bg-cream-50/60 border border-slate-200 rounded-lg text-xs text-slate-900 text-center"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                      placeholder="Satuan (gr/ml/sdm)"
                      className="w-24 p-2 bg-cream-50/60 border border-slate-200 rounded-lg text-xs text-slate-900 text-center"
                    />
                    <input
                      type="text"
                      value={ing.note || ""}
                      onChange={(e) => updateIngredient(ing.id, "note", e.target.value)}
                      placeholder="Catatan (opsional)"
                      className="flex-1 min-w-[120px] p-2 bg-cream-50/60 border border-slate-200 rounded-lg text-xs text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus bahan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Steps Builder (with step image/video support as requested!) */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Langkah Memasak ({steps.length}) <span className="text-rose-500">*</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Mendukung instruksi bertahap & URL foto/video langkah (opsional)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addStep}
                  className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Langkah</span>
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 bg-white rounded-xl border border-terracotta-100 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-7 h-7 rounded-full bg-terracotta-100 text-terracotta-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <textarea
                        value={step.instruction}
                        onChange={(e) => updateStep(step.id, "instruction", e.target.value)}
                        rows={2}
                        placeholder={`Tulis instruksi langkah ${idx + 1}...`}
                        className="flex-1 p-2 bg-cream-50/60 border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus langkah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pl-9 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <input
                          type="url"
                          value={step.image_url || ""}
                          onChange={(e) => updateStep(step.id, "image_url", e.target.value)}
                          placeholder="URL Foto Langkah (opsional)"
                          className="w-full p-1.5 bg-cream-50/40 border border-slate-200 rounded-md text-[11px] text-slate-700"
                        />
                      </div>
                      <div>
                        <input
                          type="url"
                          value={step.video_url || ""}
                          onChange={(e) => updateStep(step.id, "video_url", e.target.value)}
                          placeholder="URL Video Pendek Langkah (opsional)"
                          className="w-full p-1.5 bg-cream-50/40 border border-slate-200 rounded-md text-[11px] text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Tips & Attribution */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Tips Chef & Atribusi Sumber</h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tips Rahasia Chef (Opsional)
                </label>
                <textarea
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  rows={2}
                  placeholder="Tips penting (contoh: pakai api lilin, dinginkan adonan, teknik memotong serat)"
                  className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atribusi Sumber Resep (Opsional)
                </label>
                <input
                  type="text"
                  value={sourceAttribution}
                  onChange={(e) => setSourceAttribution(e.target.value)}
                  placeholder="Contoh: Resep Warisan Nenek Bukittinggi"
                  className="w-full p-2.5 bg-white border border-terracotta-200 rounded-lg text-xs text-slate-800"
                />
              </div>
            </div>
          </form>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-terracotta-100 flex flex-wrap items-center justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-300"
            >
              Simpan sebagai Draf
            </button>

            <button
              type="button"
              onClick={() => handleSave("published")}
              className="px-6 py-2.5 bg-terracotta-800 hover:bg-terracotta-900 text-white font-bold text-xs rounded-xl transition-all shadow-clay-button cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-accent-light" />
              <span>Terbitkan Resep (Publish)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

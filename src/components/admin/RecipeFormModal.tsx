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
  UploadCloud,
  Loader2,
  Camera,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { RecipeDetailView } from "@/components/recipes/RecipeDetailView";

interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe | null; // null if creating new
  categories: Category[];
  actor: UserProfile;
  onSuccess: (message?: string) => void;
}

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
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingStepId, setUploadingStepId] = useState<string | null>(null);
  const [coverUploadSource, setCoverUploadSource] = useState<"supabase" | "local" | null>(null);

  // Populate state on open or change
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setSlug(recipe.slug);
      setSummary(recipe.summary || "");
      setDescription(recipe.description || "");
      setCoverImageUrl(recipe.cover_image_url || "");
      setCoverUploadSource(null);
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
      setCoverImageUrl("");
      setCoverUploadSource(null);
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

  // Upload handlers
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      setError(null);
      const res = await uploadImage(file, "covers");
      setCoverImageUrl(res.url);
      setCoverUploadSource(res.source);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto cover.";
      setError(msg);
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleStepFileUpload = async (stepId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingStepId(stepId);
      setError(null);
      const res = await uploadImage(file, "steps");
      updateStep(stepId, "image_url", res.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto langkah.";
      setError(msg);
    } finally {
      setUploadingStepId(null);
      e.target.value = "";
    }
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
        onSuccess("Perubahan resep berhasil disimpan.");
        onClose();
      } else {
        setError(res.error || "Gagal memperbarui resep.");
      }
    } else {
      const res = RecipeService.create(payload, actor);
      if (res.success) {
        onSuccess(
          publishState === "published"
            ? "Resep baru berhasil diterbitkan."
            : "Draf resep baru berhasil disimpan."
        );
        onClose();
      } else {
        setError(res.error || "Gagal membuat resep.");
      }
    }
  };

  // Deteksi apakah form memiliki perubahan data atau foto yang terunggah
  const hasChanges = () => {
    if (!recipe) {
      if (coverImageUrl && coverImageUrl.trim().length > 0) return true;
      if (title.trim().length > 0) return true;
      if (summary.trim().length > 0 || description.trim().length > 0) return true;
      if (tips.trim().length > 0 || (sourceAttribution && sourceAttribution !== "Kreasi Dapur Resepify")) return true;
      if (steps.some((s) => (s.image_url && s.image_url.trim().length > 0) || (s.video_url && s.video_url.trim().length > 0))) return true;
      if (ingredients.some((i) => i.name.trim().length > 0 && i.name !== "Bahan Utama" && i.name !== "Bawang Merah")) return true;
      return false;
    } else {
      if (title !== recipe.title) return true;
      if (coverImageUrl !== (recipe.cover_image_url || "")) return true;
      if (summary !== (recipe.summary || "")) return true;
      if (description !== (recipe.description || "")) return true;
      if (cuisine !== recipe.cuisine) return true;
      if (mealType !== recipe.meal_type) return true;
      if (difficulty !== recipe.difficulty) return true;
      if (prepTimeMinutes !== recipe.prep_time_minutes) return true;
      if (cookTimeMinutes !== recipe.cook_time_minutes) return true;
      if (servings !== recipe.servings) return true;
      if (tips !== (recipe.tips || "")) return true;
      if (sourceAttribution !== (recipe.source_attribution || "")) return true;
      if (JSON.stringify(categoryIds) !== JSON.stringify(recipe.category_ids || [])) return true;
      if (JSON.stringify(ingredients) !== JSON.stringify(recipe.ingredients || [])) return true;
      if (JSON.stringify(steps) !== JSON.stringify(recipe.steps || [])) return true;
      return false;
    }
  };

  // Tutup modal dengan otomatis menyimpan sebagai draf jika ada foto atau perubahan
  const handleCloseWithAutoDraft = () => {
    if (!hasChanges()) {
      onClose();
      return;
    }

    const draftTitle = title.trim() || (recipe?.title || "Draf Resep Baru (Belum Berjudul)");
    const payload: Partial<Recipe> = {
      title: draftTitle,
      slug: slug ? generateSlug(slug) : generateSlug(draftTitle),
      summary,
      description,
      cover_image_url: coverImageUrl,
      category_ids: categoryIds.length > 0 ? categoryIds : [categories[0]?.id || "cat-utama"],
      cuisine,
      meal_type: mealType,
      prep_time_minutes: Number(prepTimeMinutes) || 15,
      cook_time_minutes: Number(cookTimeMinutes) || 30,
      servings: Number(servings) || 4,
      difficulty,
      ingredients: ingredients.filter((i) => i.name.trim().length > 0),
      steps: steps.filter((s) => s.instruction.trim().length > 0),
      tips,
      source_attribution: sourceAttribution,
      status: isEditing && recipe ? recipe.status : "draft",
    };

    if (isEditing && recipe) {
      const res = RecipeService.update(recipe.id, payload, actor);
      if (res.success) {
        onSuccess("Perubahan resep dan foto berhasil disimpan otomatis.");
      }
      onClose();
    } else {
      const res = RecipeService.create(payload, actor);
      if (res.success) {
        onSuccess("Draf otomatis disimpan! Foto dan data Anda aman di tab Draf.");
      }
      onClose();
    }
  };

  // Construct preview recipe object
  const previewRecipe: Recipe = {
    id: recipe?.id || "preview-id",
    title: title || "Judul Resep Anda",
    slug: slug || "preview-slug",
    summary: summary || "Ringkasan resep akan tampil di sini...",
    description: description || "",
    cover_image_url:
      coverImageUrl ||
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80",
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
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseWithAutoDraft();
        }
      }}
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
              onClick={handleCloseWithAutoDraft}
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

            {/* Section 2: Upload Foto Cover Masakan dari Komputer */}
            <div className="bg-cream-50/70 p-5 rounded-2xl border border-terracotta-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-terracotta-700" />
                  <span>Foto Cover Masakan</span>
                  <span className="text-rose-500">*</span>
                </h4>
                {coverUploadSource === "supabase" && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Tersimpan di Cloud Storage
                  </span>
                )}
                {coverUploadSource === "local" && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Tersimpan Lokal
                  </span>
                )}
              </div>

              {coverImageUrl ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-terracotta-200 bg-slate-900 aspect-[16/9] max-h-64 group shadow-sm">
                  <img
                    src={coverImageUrl}
                    alt="Pratinjau Cover Resep"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-cream-100 transition-all flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-terracotta-700" />
                      <span>Ganti Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverFileUpload}
                        disabled={isUploadingCover}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImageUrl("");
                        setCoverUploadSource(null);
                      }}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Foto</span>
                    </button>
                  </div>
                  {isUploadingCover && (
                    <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-2 text-white text-xs font-semibold">
                      <Loader2 className="w-7 h-7 animate-spin text-terracotta-400" />
                      <span>Mengunggah foto cover ke storage...</span>
                    </div>
                  )}
                </div>
              ) : (
                <label
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isUploadingCover
                      ? "border-terracotta-400 bg-terracotta-50/50"
                      : "border-terracotta-300 bg-white hover:bg-cream-50 hover:border-terracotta-500 shadow-xs"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverFileUpload}
                    disabled={isUploadingCover}
                  />
                  {isUploadingCover ? (
                    <div className="flex flex-col items-center gap-2 text-terracotta-900 py-3">
                      <Loader2 className="w-8 h-8 animate-spin text-terracotta-700" />
                      <span className="text-xs font-bold">Sedang mengunggah foto ke penyimpanan aman...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-cream-100 text-terracotta-800 flex items-center justify-center mb-3 shadow-inner">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                        Pilih Foto Cover dari Komputer
                      </span>
                      <span className="text-[11px] text-slate-500 max-w-sm mb-3">
                        Pilih file foto masakan langsung dari laptop Anda (JPG, PNG, WebP hingga 10 MB). Disimpan aman di cloud tanpa perlu menggunakan link luar.
                      </span>
                      <span className="px-3.5 py-1.5 rounded-lg bg-terracotta-800 text-white text-xs font-semibold shadow-xs hover:bg-terracotta-900 transition-colors">
                        Pilih Berkas Gambar
                      </span>
                    </>
                  )}
                </label>
              )}
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

                    <div className="pl-9 flex flex-wrap items-center gap-3 text-[11px] pt-1">
                      {/* Upload Foto Langkah dari Komputer */}
                      {step.image_url ? (
                        <div className="flex items-center gap-2 bg-cream-50 border border-terracotta-200 rounded-lg p-1.5 pr-2.5">
                          <img
                            src={step.image_url}
                            alt={`Foto langkah ${idx + 1}`}
                            className="w-10 h-10 object-cover rounded-md border border-terracotta-200"
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-700">Foto Langkah Terpasang</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <label className="text-terracotta-700 hover:text-terracotta-900 font-semibold cursor-pointer underline text-[10px]">
                                Ganti
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingStepId === step.id}
                                  onChange={(e) => handleStepFileUpload(step.id, e)}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => updateStep(step.id, "image_url", "")}
                                className="text-rose-600 hover:text-rose-800 font-semibold text-[10px] cursor-pointer"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-terracotta-200 rounded-lg text-terracotta-900 hover:bg-terracotta-50 text-[11px] font-semibold cursor-pointer transition-colors shadow-2xs">
                          {uploadingStepId === step.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-terracotta-700" />
                              <span>Mengunggah...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-3.5 h-3.5 text-terracotta-700" />
                              <span>+ Upload Foto Langkah</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingStepId === step.id}
                            onChange={(e) => handleStepFileUpload(step.id, e)}
                          />
                        </label>
                      )}

                      {/* Video URL opsional */}
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="url"
                          value={step.video_url || ""}
                          onChange={(e) => updateStep(step.id, "video_url", e.target.value)}
                          placeholder="URL Video Pendek Langkah (opsional)"
                          className="w-full p-1.5 bg-cream-50/40 border border-slate-200 rounded-md text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-terracotta-700"
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
            onClick={handleCloseWithAutoDraft}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {hasChanges() ? "Tutup (Simpan Draf)" : "Batal"}
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
